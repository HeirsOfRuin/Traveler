// The Gate B model: one life in one era, season by season, numbers only.
// Deterministic: named RNG streams, no Math.random, no clock.
//   play(seed, { policy, sex, courts, kit, traits, ...switches }) -> end state
//
// Round 3 (2026-11-23), after the author: the hero is expected to use what
// they know. The decision is how it is presented, and how hard to push.

import { streamFor } from './rng.js';
import { D as BASE, KITS, OCCUPATIONS, TRAITS, SEX, LOVES, GRADE } from './data.js';
import { POLICIES } from './policies.js';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

export function newLife(seed, o = {}) {
  const D = { ...BASE, ...(o.data || {}) };
  const traits = String(o.traits || 'rider+charm').split('+');
  const job = o.job || 'welder';
  const mods = [KITS[o.kit || 'tools'], OCCUPATIONS[job], ...traits.map((t) => TRAITS[t])];
  if (mods.some((m) => !m)) throw new Error(`unknown kit, occupation or trait: ${o.kit}, ${job}, ${traits}`);
  const sum = (k) => mods.reduce((a, m) => a + (m[k] || 0), 0);
  const mul = (k) => mods.reduce((a, m) => a * (m[k] ?? 1), 1);
  const sex = o.sex || 'm';
  const hero = {
    sex, courts: o.courts || 'women', kit: o.kit || 'tools', job, traits, bond: sum('bond'),
    work: sum('work'), trail: sum('trail'), know: sum('know'), workKnow: sum('workKnow'),
    travelPlace: sum('travelPlace'), travelTrail: sum('travelTrail'), openTrail: sum('openTrail') > 0,
    gifts: sum('gifts'), giftBond: sum('giftBond'),
    dangerMul: mul('dangerMul'),
    strangeMul: mul('strangeMul') * (o.sexless ? 1 : SEX[sex].strangeMul),
    sexWork: o.sexless ? 1 : SEX[sex].work, sexSkill: o.sexless ? 1 : SEX[sex].skillPlace,
  };
  const s = {
    seed, D, o, hero, policy: o.policy || 'riser',
    season: 0, place: clamp(5 + sum('place0')), skill: clamp(sum('skill0')), strange: clamp(15 + sum('strange0')),
    bond: [0, 0], told: [0, 0], trail: 0, travelled: 0, idle: 0, skip: 0, giftsLeft: hero.gifts,
    setbacks: 0, hurts: 0, pressed: 0, used: [0, 0, 0, 0], needsMet: 0, needsLeft: 0,
    ending: null, peakPlace: 0, log: [], need: false, seen: 0,
  };
  look(s);
  return s;
}

export const rungOf = (s) => s.D.rungs.find(([min]) => s.place >= min)[1];
export const tolerance = (s) => s.D.tolerance + s.D.placeShields * s.place + s.D.bondShields * Math.max(...s.bond);
export const lastYear = (s) => s.season >= s.D.seasons - s.D.yearLength;
const loves = (s) => LOVES[s.hero.courts];

// What the hero can see before choosing: whether the season brings a need, and
// how much room the hall seems to have. The second is a guess. Nobody shows a
// stranger what is said about him; a close bond tells him more of it.
function look(s) {
  const { D, o } = s;
  const r = streamFor(s.seed, s.season, 'look');
  s.need = !o.noNeeds && r.chance(D.needChance);
  const blur = o.clearSight ? 0 : D.readNoise * (1 - D.bondTells * Math.max(...s.bond) / 100);
  s.seen = tolerance(s) - s.strange + r.normal(0, blur);
}

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

// One season.
//   input = { focus: work|train|court|trail|travel,
//             know: 0 nothing | 1 as a craft of your people | 2 done openly, unexplained | 3 explained,
//             who: 0|1, press: take the dangerous way (trail and travel) }
export function step(s, input) {
  const { D, hero, o } = s;
  const t = s.season;
  const rng = (label) => streamFor(s.seed, t, label);
  let { focus, who = 0 } = input;
  let know = o.noKnow ? 0 : Math.max(0, Math.min(3, input.know | 0));
  const press = !!input.press && !o.noPress && (focus === 'trail' || focus === 'travel');
  if (focus === 'train') know = 0;                       // nothing of yours helps you learn theirs
  const line = { t, focus, know, need: s.need };

  if (s.skip > 0) { s.skip--; line.focus = 'lost'; focus = 'lost'; know = 0; }
  const away = focus === 'travel';
  const need = s.need && focus !== 'lost' && focus !== 'train' && focus !== 'court';
  const answered = need && know >= 2;                    // a need is met by doing the thing, in the open

  let gainMul = 1 + (D.knowGain[know] - 1) * (1 + hero.know);
  if (answered) gainMul *= D.needGain;
  const steep = (g) => g * Math.max(0.15, 1 - s.place / D.ladderTop);   // each rung is harder than the last
  // strangeness: a craft is covered by knowing their ways; an explanation is not
  const cover = 1 - Math.min(0.9, s.skill * D.skillCovers[know]);
  let strangeAdd = D.knowStrange[know] * hero.strangeMul * cover * (answered ? D.needStrange : 1) * (away ? D.awayStrange : 1);
  if (focus !== 'court' && focus !== 'lost') s.used[know]++;

  if (focus === 'work') {
    const base = (D.workPlace + hero.work) * hero.sexWork + D.workSkill * s.skill * hero.sexSkill;
    s.place += steep(base * (know ? gainMul + hero.workKnow : 1));
    s.idle = 0;
  } else if (focus !== 'lost') s.idle++;

  if (focus === 'train') { s.skill += D.trainSkill * (1 - s.skill / 130); s.place += steep(D.trainPlace); strangeAdd -= D.trainCalms; }

  if (focus === 'court') {
    const L = loves(s)[who], k = L.likes, tell = Math.min(2, know);
    let g = D.courtBond + hero.bond + D.courtPlace * s.place + (k.skill || 0) * s.skill + (k.travelled && s.travelled ? k.travelled : 0);
    if (s.giftsLeft > 0) { g += hero.giftBond; s.giftsLeft--; }
    strangeAdd = 0;
    if (tell && !o.noTruth) {                            // in courting, what you know is the truth about you
      g += D.truthBond[tell] + (k.truth || 0);
      s.told[who] = Math.max(s.told[who], tell);
      strangeAdd = Math.max(0, D.truthStrangeAt - s.bond[who]) * D.truthStrange * (tell / 2) * hero.strangeMul;
    }
    const cap = s.told[who] ? 100 : D.bondCapSilent;
    s.bond[who] = Math.min(cap, s.bond[who] + g);
  }
  for (const i of [0, 1]) if (!(focus === 'court' && i === who)) s.bond[i] = Math.max(0, s.bond[i] - D.bondFade);

  // The dangerous way is chosen, and its risk is named before it is taken.
  const danger = () => {
    if (!press) return;
    s.pressed++;
    if (!rng('danger').chance(D.pressDanger * hero.dangerMul)) return;
    if (lastYear(s)) { s.ending = 'dead'; return; }
    s.hurts++; s.skip += D.hurtSeasons; line.hurt = true;
  };
  const pressMul = press ? D.pressGain : 1;

  if (focus === 'trail') {
    let cap = 100;
    if (hero.openTrail) cap = 100; else if (!s.travelled) cap = D.trailWall1; else if (s.place < D.trailPlace) cap = D.trailWall2;
    const before = s.trail;
    s.trail = Math.max(before, Math.min(cap, before + (D.trailGain + hero.trail) * gainMul * pressMul));
    if (s.trail === before) line.walled = true;
    danger();
  }

  if (focus === 'travel') {
    s.travelled++;
    // Out there nobody has a ladder to keep you off: what you do is news, and news travels home.
    s.place += (D.travelPlace + hero.travelPlace) * gainMul * pressMul * Math.max(0.3, 1 - s.place / D.renownTop);
    const cap = hero.openTrail || s.place >= D.trailPlace ? 100 : D.trailWall2;
    s.trail = Math.max(s.trail, Math.min(cap, s.trail + (D.travelTrail + hero.travelTrail) * pressMul));
    strangeAdd += D.travelStrange;
    danger();
  }

  // the season closes
  if (need) { if (answered) s.needsMet++; else { s.needsLeft++; s.place -= D.needIgnored; } }
  if (s.idle > D.idleGrace) s.place -= D.idleCost;
  s.place = clamp(s.place - D.placeDrift);
  s.skill = clamp(s.skill);
  s.trail = clamp(s.trail);
  const talk = rng('rumour');
  if (s.strange >= D.rumourAt && talk.chance(D.rumourChance)) strangeAdd += talk.float(D.rumourMin, D.rumourMax);
  s.strange = clamp(s.strange + strangeAdd - D.strangeDecay - D.placeCalms * s.place);
  s.peakPlace = Math.max(s.peakPlace, s.place);

  const over = s.strange - tolerance(s);
  if (!s.ending && over > 0 && rng('expose').chance(Math.min(0.9, over / D.exposeSpan))) {
    if (lastYear(s) || o.hardLoss) s.ending = 'exposed';
    else {
      s.setbacks++; line.castOut = true;
      s.place *= D.castOutPlace; s.strange = Math.min(s.strange, D.castOutStrange);
      s.bond = s.bond.map((b) => Math.max(0, b - D.castOutBond)); s.skip += D.castOutSeasons;
    }
  }

  line.press = press; line.place = +s.place.toFixed(1); line.strange = +s.strange.toFixed(1); line.tol = +tolerance(s).toFixed(1);
  line.bond = s.bond.map((b) => Math.round(b)); line.trail = Math.round(s.trail);
  s.log.push(line);
  s.season++;
  if (!s.ending && s.season >= D.seasons) s.ending = 'door';
  if (!s.ending) look(s);
  return s;
}

export function play(seed, o = {}) {
  const s = newLife(seed, o);
  const policy = POLICIES[s.policy];
  if (!policy) throw new Error(`no policy "${s.policy}"`);
  while (!s.ending) step(s, policy.rule(s));
  return s;
}
