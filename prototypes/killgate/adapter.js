// Connects the Gate B model to the game-measure kit (run.js, ablate.js).
//   node prototypes/killgate/run.js --adapter=prototypes/killgate/adapter.js --runs=200 --by=policy --pool=sex,kit,traits,courts

import { play as playLife, grade, partnerOf, rungOf } from './model.js';
import { POLICIES } from './policies.js';
import { SEXES, COURTS, KITS, OCCUPATIONS, TRAIT_PAIRS } from './data.js';

export const axes = { policy: Object.keys(POLICIES), sex: SEXES, courts: COURTS, kit: Object.keys(KITS), job: Object.keys(OCCUPATIONS), traits: TRAIT_PAIRS };
export const defaults = { policy: 'riser', sex: 'm', courts: 'women', kit: 'tools', job: 'welder', traits: 'rider+charm' };

export const play = (seed, opts) => playLife(seed, opts);

export function progress(s) {
  const missing = [];
  if (!s.ending) missing.push('never ended');
  if (s.season < 1) missing.push('no season was played');
  if (s.ending === 'door' && s.season !== s.D.seasons) missing.push(`door at season ${s.season}`);
  if (s.log.length !== s.season) missing.push('a season left no record');
  return missing;
}

export function metrics(s) {
  const door = s.ending === 'door', p = door ? partnerOf(s) : -1;
  return {
    door, exposed: s.ending === 'exposed', dead: s.ending === 'dead',
    nobody: door && s.place < s.D.nobodyBelow,
    named: door && s.place >= 60,
    household: door && s.place >= 40,
    partner: p >= 0, partner0: p === 0, partner1: p === 1,
    uncle: door && s.trail >= s.D.uncleAt,
    two: door && [s.place >= 60, p >= 0, s.trail >= s.D.uncleAt].filter(Boolean).length >= 2,
    all: door && s.place >= 60 && p >= 0 && s.trail >= s.D.uncleAt,
    grade: Math.round(grade(s) * 10) / 10,
    place: Math.round(s.place * 10) / 10,
    peakPlace: Math.round(s.peakPlace * 10) / 10,
    setbacks: s.setbacks, castOut: s.setbacks > 0, hurts: s.hurts, pressed: s.pressed,
    explained: s.used[3], needsMet: s.needsMet, needsLeft: s.needsLeft,
  };
}

export function digest(s) {
  return JSON.stringify([s.ending, s.season, s.place.toFixed(4), s.skill.toFixed(4), s.strange.toFixed(4),
    s.bond.map((b) => b.toFixed(4)), s.told, s.trail.toFixed(4), s.travelled, s.setbacks, s.hurts, s.used, s.needsMet]);
}

export function trace(s) {
  const h = s.hero;
  return [`${s.policy} / ${h.sex} courts ${h.courts} / ${h.kit} / ${h.job} / ${h.traits.join('+')} / seed ${s.seed}`,
    ...s.log.map((l) => `  ${String(l.t + 1).padStart(2)} ${l.focus.padEnd(6)} know ${l.know}  place ${String(l.place).padStart(5)}  strange ${String(l.strange).padStart(5)} / tol ${String(l.tol).padStart(5)}  bond ${l.bond.join(',').padEnd(7)} trail ${String(l.trail).padStart(3)}${l.castOut ? '  CAST OUT' : ''}${l.hurt ? '  hurt' : ''}${l.walled ? '  (trail walled)' : ''}${l.need ? '  need' : ''}${l.press ? '  pressed' : ''}`),
    `ending ${s.ending}, ${rungOf(s)}, grade ${grade(s).toFixed(1)}, partner ${partnerOf(s)}, uncle ${s.trail >= s.D.uncleAt}`].join('\n');
}
