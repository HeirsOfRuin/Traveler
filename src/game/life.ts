// The four years: Act 2's season turn (docs/STORY.md, docs/DESIGN.md section 8). Pure: a life is
// plain JSON in the save, and step() returns a new one. Every number is in content/season.yaml.
//
// A port of the Gate B model (prototypes/killgate/model.js, round 6), rule for rule and stream for
// stream. sim/equivalence.ts plays both on the same heroes and seeds and compares end states, so
// the tables measured on the model hold for the game until a number here is changed and measured.
//
// What the player decides each season: what it is for (work, learn their ways, court one of two
// people, follow the uncle's trail, a journey), how to present what they know while doing it, and
// on the trail or a journey whether to take the dangerous way. What the player sees before
// deciding: whether somebody needs help this season, and a GUESS at how much room the hall has.
import type { ContentBundle, Season, Mods } from '../content/schema';
import type { Sex } from '@engine/state';
import { streamFor } from './streams';

export type Focus = 'work' | 'train' | 'court' | 'trail' | 'travel';
export const FOCI: readonly Focus[] = ['work', 'train', 'court', 'trail', 'travel'];
/** 0 nothing | 1 as a craft of your people | 2 done, and left unexplained | 3 explained. In courting: what of the truth is told (0 to 2). */
export type Know = 0 | 1 | 2 | 3;
export interface SeasonInput { focus: Focus; know: Know; who?: 0 | 1; press?: boolean }
export type LifeEnding = 'door' | 'exposed' | 'dead';
/** Measurement switches (sim/ablations): each turns one rule off. Never set in play. */
export type Off = 'noKnow' | 'noTruth' | 'noNeeds' | 'clearSight' | 'freeLove' | 'noSupport' | 'noPress' | 'hardLoss' | 'sexless';

/** What happened in one season, for the screen and the trace. */
export interface SeasonLine {
  t: number; focus: Focus | 'lost'; know: number; need: boolean; press?: boolean;
  hurt?: boolean; castOut?: boolean; walled?: boolean; line?: string | null;
  place: number; strange: number; tol: number; bond: number[]; trail: number;
}

export interface Life {
  seed: number;
  /** who the hero is, as the season numbers read them: fixed when the life begins */
  sex: Sex; courts: 'women' | 'men'; kit: string; job: string; traits: string[];
  off?: Off[];
  season: number;
  place: number; skill: number; strange: number;
  bond: [number, number]; told: [number, number];
  trail: number; travelled: number; idle: number; skip: number; giftsLeft: number;
  setbacks: number; hurts: number; pressed: number; used: [number, number, number, number];
  needsMet: number; needsLeft: number; peakPlace: number;
  ending: LifeEnding | null;
  /** seen before the next choice: does the season bring a need, and the guessed room in the hall */
  need: boolean; seen: number;
  log: SeasonLine[];
}

/** The hero's numbers, derived from who they are each time they are needed (never stored). */
export interface HeroMods {
  work: number; trail: number; know: number; workKnow: number; travelPlace: number; travelTrail: number;
  openTrail: boolean; gifts: number; giftBond: number; bond: number; need: number; press: number;
  readMul: number; dangerMul: number; strangeMul: number; sexWork: number; sexSkill: number;
  place0: number; skill0: number; strange0: number;
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const has = (l: { off?: Off[] }, k: Off) => !!l.off?.includes(k);

export function heroMods(S: Season, l: Pick<Life, 'sex' | 'kit' | 'job' | 'traits' | 'off'>): HeroMods {
  const mods: Mods[] = [S.kits[l.kit]!, S.occupations[l.job]!, ...l.traits.map((t) => S.traits[t]!)];
  if (mods.some((m) => !m)) throw new Error(`season.yaml has no numbers for kit ${l.kit}, occupation ${l.job} or traits ${l.traits}`);
  const sum = (k: keyof Mods) => mods.reduce((a, m) => a + (m[k] ?? 0), 0);
  const mul = (k: keyof Mods) => mods.reduce((a, m) => a * (m[k] ?? 1), 1);
  const sx = has(l, 'sexless') ? { work: 1, skillPlace: 1, strangeMul: 1 } : S.sex[l.sex];
  return {
    work: sum('work'), trail: sum('trail'), know: sum('know'), workKnow: sum('workKnow'),
    travelPlace: sum('travelPlace'), travelTrail: sum('travelTrail'), openTrail: sum('openTrail') > 0,
    gifts: sum('gifts'), giftBond: sum('giftBond'), bond: sum('bond'), need: sum('need'), press: sum('press'),
    readMul: mul('readMul'), dangerMul: mul('dangerMul'), strangeMul: mul('strangeMul') * sx.strangeMul,
    sexWork: sx.work, sexSkill: sx.skillPlace, place0: sum('place0'), skill0: sum('skill0'), strange0: sum('strange0'),
  };
}

export const tolerance = (S: Season, l: Life) => S.rules.tolerance + S.rules.placeShields * l.place + S.rules.bondShields * Math.max(...l.bond);
export const lastYear = (S: Season, l: Life) => l.season >= S.rules.seasons - S.rules.yearLength;
export const lovesOf = (S: Season, l: Pick<Life, 'courts'>) => S.loves[l.courts];

/** What the people the hero is close to give this season (season.yaml loves.gives), summed. */
export function support(S: Season, l: Life) {
  const out = { readMul: 1, place: 0, cover: 0, work: 0, travelPlace: 0, travelTrail: 0 };
  if (has(l, 'noSupport')) return out;
  lovesOf(S, l).forEach((L, i) => {
    if (l.bond[i]! < S.rules.supportAt) return;
    for (const [k, v] of Object.entries(L.gives) as [string, number][]) { if (k === 'readMul') out.readMul *= v; else (out as Record<string, number>)[k]! += v; }
  });
  return out;
}

/** What the hero can see before choosing. The room is a guess; a close bond makes it a better one. */
function look(S: Season, l: Life) {
  const r = streamFor(l.seed, l.season, 'look');
  l.need = !has(l, 'noNeeds') && r.chance(S.rules.needChance);
  const blur = has(l, 'clearSight') ? 0 : S.rules.readNoise * heroMods(S, l).readMul * support(S, l).readMul * (1 - S.rules.bondTells * Math.max(...l.bond) / 100);
  l.seen = tolerance(S, l) - l.strange + r.normal(0, blur);
}

/** What the life starts with on top of who the hero is: what the visit left (src/game/years.ts). */
export interface Carry { place?: number; strange?: number; bond?: [number, number] }

export function newLife(content: ContentBundle, who: { seed: number; sex: Sex; courts: 'women' | 'men'; kit: string; job: string; traits: string[]; off?: Off[] }, carry: Carry = {}): Life {
  const S = content.season;
  const base = { sex: who.sex, kit: who.kit, job: who.job, traits: who.traits, off: who.off };
  const h = heroMods(S, base);
  const l: Life = {
    seed: who.seed, ...base, courts: who.courts,
    season: 0, place: clamp(5 + h.place0), skill: clamp(h.skill0), strange: clamp(15 + h.strange0),
    bond: [0, 0], told: [0, 0], trail: 0, travelled: 0, idle: 0, skip: 0, giftsLeft: h.gifts,
    setbacks: 0, hurts: 0, pressed: 0, used: [0, 0, 0, 0], needsMet: 0, needsLeft: 0, peakPlace: 0,
    ending: null, need: false, seen: 0, log: [],
  };
  if (!who.off) delete l.off;
  l.place = clamp(l.place + (carry.place ?? 0));
  l.strange = clamp(l.strange + (carry.strange ?? 0));
  if (carry.bond) l.bond = [clamp(carry.bond[0]), clamp(carry.bond[1])];
  look(S, l);
  return l;
}

export function meets(S: Season, l: Life, i: number): boolean {
  const n = lovesOf(S, l)[i]!.needs;
  return (n.place === undefined || l.place >= n.place) && (n.told === undefined || l.told[i]! >= n.told)
    && (n.travelled === undefined || l.travelled >= n.travelled);
}
export function partnerOf(S: Season, l: Life): number {
  const i = [0, 1].filter((k) => l.bond[k]! >= S.rules.partnerAt && meets(S, l, k)).sort((a, b) => l.bond[b]! - l.bond[a]!)[0];
  return i === undefined ? -1 : i;
}
/** The ending, as a number, for measurement only: the uncle, the place, who is beside you. The fourth thing, which side of the door, has no number. */
export function grade(S: Season, l: Life): number {
  if (l.ending !== 'door') return 0;
  const G = S.grade, p = partnerOf(S, l);
  return (l.trail >= S.rules.uncleAt ? G.uncle : 0) + Math.min(G.place, G.place * l.place / G.placeFull) + (p >= 0 ? G.partner + (l.told[p]! >= 2 ? G.truth : 0) : 0);
}

/** One season. Returns a new life; the one given is not changed. */
export function step(content: ContentBundle, life: Life, input: SeasonInput): Life {
  const S = content.season, D = S.rules;
  const s: Life = structuredClone(life);
  if (s.ending) throw new Error('the four years are over');
  const hero = heroMods(S, s);
  const t = s.season;
  const rng = (label: string) => streamFor(s.seed, t, label);
  let focus: Focus | 'lost' = input.focus;
  const who = input.who ?? 0;
  let know = has(s, 'noKnow') ? 0 : Math.max(0, Math.min(3, input.know | 0));
  const press = !!input.press && !has(s, 'noPress') && (focus === 'trail' || focus === 'travel');
  if (focus === 'train') know = 0;
  const line: SeasonLine = { t, focus, know, need: s.need, place: 0, strange: 0, tol: 0, bond: [], trail: 0 };

  if (s.skip > 0) { s.skip--; line.focus = 'lost'; focus = 'lost'; know = 0; }
  const away = focus === 'travel';
  const need = s.need && focus !== 'lost' && focus !== 'train' && focus !== 'court';
  const answered = need && know >= 2;

  let gainMul = 1 + (D.knowGain[know]! - 1) * (1 + hero.know);
  if (answered) gainMul *= D.needGain + hero.need;
  const sup = support(S, s);
  const steep = (g: number) => g * Math.max(0.15, 1 - s.place / D.ladderTop);
  const cover = (1 - Math.min(0.9, s.skill * D.skillCovers[know]!)) * (know === 1 || know === 2 ? 1 - sup.cover : 1);
  let strangeAdd = D.knowStrange[know]! * hero.strangeMul * cover * (answered ? D.needStrange : 1) * (away ? D.awayStrange : 1);
  if (focus !== 'court' && focus !== 'lost') s.used[know]!++;

  if (focus === 'work') {
    const base = (D.workPlace + hero.work + sup.work) * hero.sexWork + D.workSkill * s.skill * hero.sexSkill;
    s.place += steep(base * (know ? gainMul + hero.workKnow : 1));
    s.idle = 0;
  } else if (focus !== 'lost') s.idle++;

  if (focus === 'train') { s.skill += D.trainSkill * (1 - s.skill / 130); s.place += steep(D.trainPlace); strangeAdd -= D.trainCalms; }

  if (focus === 'court') {
    const L = lovesOf(S, s)[who]!, k = L.likes, tell = Math.min(2, know);
    let g = D.courtBond + hero.bond + D.courtPlace * s.place + (k.skill ?? 0) * s.skill + (k.travelled && s.travelled ? k.travelled : 0);
    if (s.giftsLeft > 0) { g += hero.giftBond; s.giftsLeft--; }
    const c = has(s, 'freeLove') ? {} as typeof L.costs : L.costs;
    strangeAdd = (c.talk ?? 0) + (c.above && s.place < (L.needs.place ?? 0) ? c.above : 0);
    const seenTalk = strangeAdd;
    if (tell && !has(s, 'noTruth')) {
      g += D.truthBond[tell]! + (k.truth ?? 0);
      s.told[who] = Math.max(s.told[who]!, tell);
      strangeAdd = seenTalk + Math.max(0, D.truthStrangeAt - s.bond[who]!) * D.truthStrange * (tell / 2) * hero.strangeMul;
    }
    const cap = s.told[who] ? 100 : D.bondCapSilent;
    s.bond[who] = Math.min(cap, s.bond[who]! + g);
  }
  for (const i of [0, 1] as const) if (!(focus === 'court' && i === who)) s.bond[i] = Math.max(0, s.bond[i] - D.bondFade);

  const danger = () => {
    if (!press) return;
    s.pressed++;
    if (!rng('danger').chance(D.pressDanger * hero.dangerMul)) return;
    if (lastYear(S, s)) { s.ending = 'dead'; return; }
    s.hurts++; s.skip += D.hurtSeasons; line.hurt = true;
  };
  const pressMul = press ? D.pressGain + hero.press : 1;

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
    s.place += (D.travelPlace + hero.travelPlace + sup.travelPlace) * gainMul * pressMul * Math.max(0.3, 1 - s.place / D.renownTop);
    const cap = hero.openTrail || s.place >= D.trailPlace ? 100 : D.trailWall2;
    s.trail = Math.max(s.trail, Math.min(cap, s.trail + (D.travelTrail + hero.travelTrail + sup.travelTrail) * pressMul));
    strangeAdd += D.travelStrange;
    danger();
  }

  if (need) { if (answered) s.needsMet++; else { s.needsLeft++; s.place -= D.needIgnored; } }
  if (s.idle > D.idleGrace) s.place -= D.idleCost;
  s.place += steep(sup.place);
  s.place = clamp(s.place - D.placeDrift);
  s.skill = clamp(s.skill);
  s.trail = clamp(s.trail);
  const talk = rng('rumour');
  if (s.strange >= D.rumourAt && talk.chance(D.rumourChance)) strangeAdd += talk.float(D.rumourMin, D.rumourMax);
  s.strange = clamp(s.strange + strangeAdd - D.strangeDecay - D.placeCalms * s.place);
  s.peakPlace = Math.max(s.peakPlace, s.place);

  const over = s.strange - tolerance(S, s);
  if (!s.ending && over > 0 && rng('expose').chance(Math.min(0.9, over / D.exposeSpan))) {
    if (lastYear(S, s) || has(s, 'hardLoss')) s.ending = 'exposed';
    else {
      s.setbacks++; line.castOut = true;
      s.place *= D.castOutPlace; s.strange = Math.min(s.strange, D.castOutStrange);
      s.bond = s.bond.map((b) => Math.max(0, b - D.castOutBond)) as [number, number]; s.skip += D.castOutSeasons;
    }
  }

  line.press = press; line.place = +s.place.toFixed(1); line.strange = +s.strange.toFixed(1); line.tol = +tolerance(S, s).toFixed(1);
  line.bond = s.bond.map((b) => Math.round(b)); line.trail = Math.round(s.trail);
  s.log.push(line);
  s.season++;
  if (!s.ending && s.season >= D.seasons) s.ending = 'door';
  if (!s.ending) look(S, s);
  return s;
}
