// Fixed policies for measuring the four years: each a written rule with no look-ahead, so a gap
// between two rows is a gap between two rules. Ported from the Gate B model's policies.js.
//
// A policy sees what a player would: the life, whether the season brings a need (l.need) and the
// GUESS at the hall's room (l.seen). It never reads the true tolerance.
import type { ContentBundle } from '../src/content/schema';
import { heroMods, lastYear, meets, lovesOf, type Life, type SeasonInput, type Know } from '../src/game/life';

type Rule = (c: ContentBundle, l: Life) => SeasonInput;
type Goal = (c: ContentBundle, l: Life) => SeasonInput | null;

// Competent presentation: explain while the hall seems to have plenty of room, do it openly while it
// has some, pass it off as a craft when it is tight, nothing when it is gone. A need tempts; the last
// year sobers.
const present = (c: ContentBundle, l: Life): Know => {
  const r = l.seen + (l.need ? 6 : 0) - (lastYear(c.season, l) ? 8 : 0);
  return r > 34 ? 3 : r > 18 ? 2 : r > 6 ? 1 : 0;
};
const work = (c: ContentBundle, l: Life): SeasonInput => ({ focus: 'work', know: present(c, l) });
const mustWork = (c: ContentBundle, l: Life) => l.idle >= c.season.rules.idleGrace;

const place = (min: number): Goal => (c, l) => (l.place >= min ? null : work(c, l));
const train = (seasons: number): Goal => (_c, l) => (l.season < seasons ? { focus: 'train', know: 0 } : null);
const trail = (press: boolean): Goal => (c, l) => {
  const D = c.season.rules, open = heroMods(c.season, l).openTrail;
  if (l.trail >= D.uncleAt) return null;
  if (!open && !l.travelled && l.trail >= D.trailWall1) return { focus: 'travel', know: present(c, l), press };
  if (!open && l.travelled && l.place < D.trailPlace && l.trail >= D.trailWall2) return work(c, l);
  return { focus: 'trail', know: present(c, l), press };
};
const love = (who: 0 | 1): Goal => (c, l) => {
  const D = c.season.rules;
  const held = l.told[who]! >= 2 && l.bond[who]! >= (l.season >= D.seasons - 2 ? D.partnerAt + 3 : 88);
  if (!held) return { focus: 'court', who, know: (l.told[who]! < 2 && l.bond[who]! >= 45 ? 2 : l.told[who]! < 1 && l.bond[who]! >= 30 ? 1 : 0) as Know };
  if (meets(c.season, l, who)) return null;
  const n = lovesOf(c.season, l)[who]!.needs;
  if (n.place !== undefined && l.place < n.place) return work(c, l);
  if (n.travelled !== undefined && l.travelled < n.travelled) return { focus: 'travel', know: present(c, l) };
  return null;
};
const earnFor = (who: 0 | 1): Goal => (c, l) => { const n = lovesOf(c.season, l)[who]!.needs.place; return n !== undefined && l.place < n ? work(c, l) : null; };
const plan = (...goals: Goal[]): Rule => (c, l) => {
  if (mustWork(c, l)) return work(c, l);
  for (const g of goals) { const s = g(c, l); if (s) return s; }
  return work(c, l);
};

export const POLICIES: Record<string, { says: string; rule: Rule }> = {
  lunatic:    { says: 'Works every season and explains everything, every time', rule: () => ({ focus: 'work', know: 3 }) },
  showman:    { says: 'Works every season; does it openly and never explains', rule: () => ({ focus: 'work', know: 2 }) },
  crafty:     { says: 'Works every season; everything is a craft of his people', rule: () => ({ focus: 'work', know: 1 }) },
  native:     { says: 'Never uses what they know. Trains for a year, then works', rule: (_c, l) => ({ focus: l.season < 4 ? 'train' : 'work', know: 0 }) },
  riser:      { says: 'Trains two seasons, then works; presents what they know to suit the room', rule: plan(train(2)) },
  placeLove:  { says: 'Earns a household place, courts the first of the two, then goes on rising', rule: plan(train(2), place(45), love(0)) },
  placeUncle: { says: 'Earns a household place, follows the trail to its end, then goes on rising', rule: plan(train(2), place(40), trail(false)) },
  loveUncle:  { says: 'Follows the trail to its end, then courts the first of the two', rule: plan(trail(false), love(0)) },
  loveUncle2: { says: 'As loveUncle, courting the second of the two', rule: plan(trail(false), love(1)) },
  everything: { says: 'A household place, then the trail, then courting, then rising', rule: plan(place(40), trail(false), love(0)) },
  seeker:     { says: 'Follows the trail and nothing else, the safe way', rule: plan(trail(false)) },
  bold:       { says: 'Courts the first of the two, then follows the trail the dangerous way', rule: plan(love(0), trail(true)) },
  wanderer:   { says: 'A journey every other season, work between', rule: (c, l) => (mustWork(c, l) || l.season % 2 ? work(c, l) : { focus: 'travel', know: present(c, l) }) },
  lover0:     { says: 'Earns the place the first person needs, then courts them', rule: plan(earnFor(0), love(0)) },
  lover1:     { says: 'Earns the place the second person needs, then courts them', rule: plan(earnFor(1), love(1)) },
};
export const MAIN = ['lunatic', 'showman', 'crafty', 'native', 'riser', 'placeLove', 'placeUncle', 'loveUncle', 'loveUncle2', 'everything', 'seeker', 'bold', 'wanderer'];
