// The Gate B model: one life in one era, season by season, numbers only.
// Deterministic: named RNG streams, no Math.random, no clock.
//   play(seed, { policy, sex, courts, kit, traits, ...switches }) -> end state

import { streamFor } from './rng.js';
import { D as BASE, KITS, TRAITS, SEX, LOVES, GRADE } from './data.js';
import { POLICIES } from './policies.js';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

export function newLife(seed, o = {}) {
  const D = { ...BASE, ...(o.data || {}) };
  const traits = String(o.traits || 'nurse+welder').split('+');
  const mods = [KITS[o.kit || 'tools'], ...traits.map((t) => TRAITS[t])];
  const sum = (k) => mods.reduce((a, m) => a + (m[k] || 0), 0);
  const mul = (k) => mods.reduce((a, m) => a * (m[k] ?? 1), 1);
  const sex = o.sex || 'm';
  const hero = {
    sex, courts: o.courts || 'women', kit: o.kit || 'tools', traits,
    work: sum('work'), trail: sum('trail'), know: sum('know'), workKnow: sum('workKnow'),
    travelPlace: sum('travelPlace'), travelTrail: sum('travelTrail'), openTrail: sum('openTrail') > 0, gifts: sum('gifts'), giftBond: sum('giftBond'),
    dangerMul: mul('dangerMul'),
    strangeMul: mul('strangeMul') * (o.sexless ? 1 : SEX[sex].strangeMul),
    sexWork: o.sexless ? 1 : SEX[sex].work, sexSkill: o.sexless ? 1 : SEX[sex].skillPlace,
  };
  return {
    seed, D, o, hero, policy: o.policy || 'adaptive',
    season: 0, place: clamp(5 + sum('place0')), skill: clamp(sum('skill0')), strange: clamp(15 + sum('strange0')),
    bond: [0, 0], told: [0, 0], remembered: 0, trail: 0, travelled: 0, idle: 0, skip: 0, giftsLeft: hero.gifts,
    setbacks: 0, hurts: 0, usedKnow: 0, ending: null, peakPlace: 0, log: [],
  };
}

export const rungOf = (s) => s.D.rungs.find(([min]) => s.place >= min)[1];
export const tolerance = (s) => s.D.tolerance + s.D.placeShields * s.place + s.D.bondShields * Math.max(...s.bond);
export const lastYear = (s) => s.season >= s.D.seasons - s.D.yearLength;
const loves = (s) => LOVES[s.hero.courts];

export function meets(s, i) {
  const n = loves(s)[i].needs;
  return (n.place === undefined || s.place >= n.place) && (n.told === undefined || s.told[i] >= n.told)
    && (n.travelled === undefined || s.travelled >= n.travelled);
}
export const partnerOf = (s) => { const i = [0, 1].filter((k) => s.bond[k] >= s.D.partnerAt && meets(s, k)).sort((a, b) => s.bond[b] - s.bond[a])[0]; return i === undefined ? -1 : i; };

export function grade(s) {
  if (s.ending !== 'door') return 0;
  const p = partnerOf(s);
  return (s.trail >= s.D.uncleAt ? GRADE.uncle : 0) + Math.min(GRADE.place, GRADE.place * s.place / GRADE.placeFull)
    + (p >= 0 ? GRADE.partner + (s.told[p] >= 2 ? GRADE.truth : 0) : 0);
}

// One season. input = { focus: work|train|court|trail|travel, know: 0|1|2, who: 0|1 }
export function step(s, input) {
  const { D, hero, o } = s;
  const t = s.season;
  const rng = (label) => streamFor(s.seed, t, label);
  let { focus, who = 0 } = input;
  let know = o.noKnow ? 0 : input.know | 0;
  if (focus === 'train') know = 0;                       // nothing of yours helps you learn theirs
  const line = { t, focus, know };

  if (s.skip > 0) { s.skip--; line.focus = 'lost'; focus = 'lost'; know = 0; }

  const gainMul = 1 + (D.knowGain[know] - 1) * (1 + hero.know);
  if (know) { s.usedKnow++; if (focus !== 'court' && focus !== 'lost') s.remembered += D.remember[know]; }
  const steep = (g) => g * Math.max(0.15, 1 - s.place / D.ladderTop);   // each rung is harder than the last
  let strangeAdd = D.knowStrange[know] * hero.strangeMul * (1 - D.skillCovers * s.skill);

  if (focus === 'work') {
    const base = (D.workPlace + hero.work) * hero.sexWork + D.workSkill * s.skill * hero.sexSkill;
    s.place += steep(base * (know ? gainMul + hero.workKnow : 1));
    s.idle = 0;
  } else if (focus !== 'lost') s.idle++;

  if (focus === 'train') { s.skill += D.trainSkill * (1 - s.skill / 130); s.place += steep(D.trainPlace); strangeAdd -= D.trainCalms; }

  if (focus === 'court') {
    const L = loves(s)[who], k = L.likes;
    let g = D.courtBond + D.courtPlace * s.place + (k.skill || 0) * s.skill + (k.travelled && s.travelled ? k.travelled : 0);
    if (s.giftsLeft > 0) { g += hero.giftBond; s.giftsLeft--; }
    if (know && !o.noTruth) {                            // in courting, "knowledge" is the truth about you
      g += D.truthBond[know] + (k.truth || 0);
      s.told[who] = Math.max(s.told[who], know);
      strangeAdd = Math.max(0, D.truthStrangeAt - s.bond[who]) * D.truthStrange * (know / 2) * hero.strangeMul;
    } else strangeAdd = 0;
    const cap = s.told[who] ? 100 : D.bondCapSilent;
    s.bond[who] = Math.min(cap, s.bond[who] + g);
  }
  for (const i of [0, 1]) if (!(focus === 'court' && i === who)) s.bond[i] = Math.max(0, s.bond[i] - D.bondFade);

  const danger = (p) => {
    if (!rng('danger').chance(p * hero.dangerMul)) return;
    if (lastYear(s)) { s.ending = 'dead'; return; }
    s.hurts++; s.skip += D.hurtSeasons; line.hurt = true;
  };

  if (focus === 'trail') {
    let cap = 100;
    if (hero.openTrail) cap = 100; else if (!s.travelled) cap = D.trailWall1; else if (s.place < D.trailPlace) cap = D.trailWall2;
    const before = s.trail;
    s.trail = Math.max(before, Math.min(cap, before + (D.trailGain + hero.trail) * gainMul));
    if (s.trail === before) line.walled = true;
    danger(D.trailDanger);
  }

  if (focus === 'travel') {
    s.travelled++;
    if (hero.travelTrail) s.trail = Math.max(s.trail, Math.min(hero.openTrail || s.place >= D.trailPlace ? 100 : D.trailWall2, s.trail + hero.travelTrail));
    s.place += steep((D.travelPlace + hero.travelPlace) * gainMul);
    strangeAdd += D.travelStrange;
    danger(D.travelDanger);
  }

  // the season closes
  if (s.idle > D.idleGrace) s.place -= D.idleCost;
  s.place = clamp(s.place - D.placeDrift);
  s.skill = clamp(s.skill);
  s.trail = clamp(s.trail);
  const talk = rng('rumour');
  if (s.strange >= D.rumourAt && talk.chance(D.rumourChance)) strangeAdd += talk.float(D.rumourMin, D.rumourMax);
  s.strange = clamp(Math.max(o.forgetful ? 0 : s.remembered, s.strange + strangeAdd - D.strangeDecay - D.placeCalms * s.place));
  s.peakPlace = Math.max(s.peakPlace, s.place);

  const over = s.strange - tolerance(s);
  if (!s.ending && over > 0 && rng('expose').chance(Math.min(0.9, over / D.exposeSpan))) {
    if (lastYear(s) || o.hardLoss) s.ending = 'exposed';
    else {
      s.setbacks++; line.castOut = true;
      s.place *= D.castOutPlace; s.remembered *= D.castOutForget; s.strange = Math.max(s.remembered, Math.min(s.strange, D.castOutStrange));
      s.bond = s.bond.map((b) => Math.max(0, b - D.castOutBond)); s.skip += D.castOutSeasons;
    }
  }

  line.place = +s.place.toFixed(1); line.strange = +s.strange.toFixed(1); line.tol = +tolerance(s).toFixed(1);
  line.bond = s.bond.map((b) => Math.round(b)); line.trail = Math.round(s.trail);
  s.log.push(line);
  s.season++;
  if (!s.ending && s.season >= D.seasons) s.ending = 'door';
  return s;
}

export function play(seed, o = {}) {
  const s = newLife(seed, o);
  const policy = POLICIES[s.policy];
  if (!policy) throw new Error(`no policy "${s.policy}"`);
  while (!s.ending) step(s, policy.rule(s));
  return s;
}
