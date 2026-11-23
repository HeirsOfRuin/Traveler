// Fixed policies. Each is a written rule with no look-ahead, so a difference
// between two rows is a difference between two rules and nothing else.
//
// A policy sees what a player would: the state, whether the season brings a
// need (s.need), and a GUESS at how much room the hall has (s.seen). It never
// reads the true tolerance.
//
// The planning policies share one shape: work when the keep is due, otherwise
// take the next step toward the first goal in a list that is not yet met.

import { lastYear, meets } from './model.js';
import { LOVES } from './data.js';

// Competent presentation: explain while the hall seems to have plenty of room,
// do it openly while it has some, pass it off as a craft when it is tight,
// nothing when it is gone. A need tempts; the last year sobers.
const present = (s) => {
  const r = s.seen + (s.need ? 6 : 0) - (lastYear(s) ? 8 : 0);
  return r > 34 ? 3 : r > 18 ? 2 : r > 6 ? 1 : 0;
};
const work = (s) => ({ focus: 'work', know: present(s) });
const mustWork = (s) => s.idle >= s.D.idleGrace;

// --- goals: each returns the season's input, or null when it is met
const place = (min) => (s) => (s.place >= min ? null : work(s));
const train = (seasons) => (s) => (s.season < seasons ? { focus: 'train', know: 0 } : null);
const trail = (press) => (s) => {
  if (s.trail >= s.D.uncleAt) return null;
  if (!s.hero.openTrail && !s.travelled && s.trail >= s.D.trailWall1) return { focus: 'travel', know: present(s), press };   // the trail leaves the fjord
  if (!s.hero.openTrail && s.travelled && s.place < s.D.trailPlace && s.trail >= s.D.trailWall2) return work(s);            // nobody tells a stranger the rest
  return { focus: 'trail', know: present(s), press };
};
// Court one person: tell part of the truth once the bond can bear it and all of
// it later; then do whatever that person needs before they will stand beside you.
const love = (who) => (s) => {
  const held = s.told[who] >= 2 && s.bond[who] >= (s.season >= s.D.seasons - 2 ? s.D.partnerAt + 3 : 88);
  if (!held) return { focus: 'court', who, know: s.told[who] < 2 && s.bond[who] >= 45 ? 2 : s.told[who] < 1 && s.bond[who] >= 30 ? 1 : 0 };
  if (meets(s, who)) return null;
  const n = LOVES[s.hero.courts][who].needs;
  if (n.place !== undefined && s.place < n.place) return work(s);
  if (n.travelled !== undefined && s.travelled < n.travelled) return { focus: 'travel', know: present(s) };
  return null;
};
const plan = (...goals) => (s) => {
  if (mustWork(s)) return work(s);
  for (const g of goals) { const step = g(s); if (step) return step; }
  return work(s);
};

export const POLICIES = {
  lunatic:    { says: 'Works every season and explains everything, every time', rule: () => ({ focus: 'work', know: 3 }) },
  showman:    { says: 'Works every season; does it openly and never explains', rule: () => ({ focus: 'work', know: 2 }) },
  crafty:     { says: 'Works every season; everything is a craft of his people', rule: () => ({ focus: 'work', know: 1 }) },
  native:     { says: 'Never uses what they know. Trains for a year, then works', rule: (s) => ({ focus: s.season < 4 ? 'train' : 'work', know: 0 }) },
  riser:      { says: 'Trains two seasons, then works; presents what they know to suit the room', rule: plan(train(2)) },
  placeLove:  { says: 'Earns a household place, courts the first of the two, then goes on rising', rule: plan(train(2), place(45), love(0)) },
  placeUncle: { says: 'Earns a household place, follows the trail to its end, then goes on rising', rule: plan(train(2), place(40), trail(false)) },
  loveUncle:  { says: 'Follows the trail to its end, then courts the first of the two; works only for the keep', rule: plan(trail(false), love(0)) },
  everything: { says: 'A household place, then the trail, then courting, then rising', rule: plan(place(40), trail(false), love(0)) },
  seeker:     { says: 'Follows the trail and nothing else, the safe way', rule: plan(trail(false)) },
  bold:       { says: 'Courts the first of the two, then follows the trail the dangerous way', rule: plan(love(0), trail(true)) },
  wanderer:   { says: 'A journey every other season, work between', rule: (s) => (mustWork(s) || s.season % 2 ? work(s) : { focus: 'travel', know: present(s) }) },
  // The reachability test: court one named person and do whatever they need.
  lover0:     { says: 'Courts the first of the two and does what that person needs', rule: plan(love(0)) },
  lover1:     { says: 'Courts the second of the two and does what that person needs', rule: plan(love(1)) },
};
export const MAIN = ['lunatic', 'showman', 'crafty', 'native', 'riser', 'placeLove', 'placeUncle', 'loveUncle', 'everything', 'seeker', 'bold', 'wanderer'];
