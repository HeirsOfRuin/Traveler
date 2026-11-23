// Fixed policies. Each is a written rule with no look-ahead, so a difference
// between two rows is a difference between two rules and nothing else.
//
// The planning policies share one shape: work when the keep is due, otherwise
// take the next step toward the first goal in a list that is not yet met.

import { tolerance, lastYear, meets } from './model.js';
import { LOVES } from './data.js';

const room = (s) => tolerance(s) - s.strange;          // how far from being talked about
// Competent use of what you know: openly while there is plenty of room, a
// little while there is some, almost nothing in the last year.
const careful = (s) => { const r = room(s); if (lastYear(s)) return r > 30 ? 1 : 0; return r > 24 ? 2 : r > 10 ? 1 : 0; };
const work = (s) => ({ focus: 'work', know: careful(s) });
const mustWork = (s) => s.idle >= s.D.idleGrace;

// --- goals: each returns the season's input, or null when it is met
const place = (min) => (s) => (s.place >= min ? null : work(s));
const train = (seasons) => (s) => (s.season < seasons ? { focus: 'train', know: 0 } : null);
const uncle = (s) => {
  if (s.trail >= s.D.uncleAt) return null;
  if (!s.hero.openTrail && !s.travelled && s.trail >= s.D.trailWall1) return { focus: 'travel', know: 0 };      // the trail leaves the fjord
  if (!s.hero.openTrail && s.travelled && s.place < s.D.trailPlace && s.trail >= s.D.trailWall2) return work(s); // nobody tells a stranger the rest
  return { focus: 'trail', know: careful(s) };
};
// Court one person: tell part of the truth once the bond can bear it and all of
// it later; then do whatever that person needs before they will stand beside you.
const love = (who) => (s) => {
  const held = s.told[who] >= 2 && s.bond[who] >= (s.season >= s.D.seasons - 2 ? s.D.partnerAt + 2 : 86);
  if (!held) return { focus: 'court', who, know: s.told[who] < 2 && s.bond[who] >= 45 ? 2 : s.told[who] < 1 && s.bond[who] >= 30 ? 1 : 0 };
  if (meets(s, who)) return null;
  const n = LOVES[s.hero.courts][who].needs;
  if (n.place !== undefined && s.place < n.place) return work(s);
  if (n.travelled !== undefined && s.travelled < n.travelled) return { focus: 'travel', know: 0 };
  return null;
};
const plan = (...goals) => (s) => {
  if (mustWork(s)) return work(s);
  for (const g of goals) { const step = g(s); if (step) return step; }
  return work(s);
};

export const POLICIES = {
  knower:     { says: 'Works every season and uses what they know, openly, every time', rule: () => ({ focus: 'work', know: 2 }) },
  native:     { says: 'Never uses what they know. Trains for a year, then works', rule: (s) => ({ focus: s.season < 4 ? 'train' : 'work', know: 0 }) },
  quiet:      { says: 'Works every season; only ever a little, deniable knowledge', rule: () => ({ focus: 'work', know: 1 }) },
  riser:      { says: 'Trains two seasons, then works; uses what they know while the hall has room for it', rule: plan(train(2)) },
  placeLove:  { says: 'Earns a household place, courts the first of the two, then goes on rising', rule: plan(train(2), place(45), love(0)) },
  placeUncle: { says: 'Earns a household place, follows the trail to its end, then goes on rising', rule: plan(train(2), place(40), uncle) },
  loveUncle:  { says: 'Follows the trail to its end, then courts the first of the two; works only for the keep', rule: plan(uncle, love(0)) },
  everything: { says: 'A household place, then the trail, then courting, then rising', rule: plan(place(40), uncle, love(0)) },
  seeker:     { says: 'Follows the trail and nothing else, working only when the keep is due', rule: plan(uncle) },
  // The reachability test: court one named person and do whatever they need.
  lover0:     { says: 'Courts the first of the two and does what that person needs', rule: plan(love(0)) },
  lover1:     { says: 'Courts the second of the two and does what that person needs', rule: plan(love(1)) },
};
export const MAIN = ['knower', 'native', 'quiet', 'riser', 'placeLove', 'placeUncle', 'loveUncle', 'everything', 'seeker'];
