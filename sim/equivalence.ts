// Is the game's four years the Gate B model? Plays both on the same heroes, seeds and policies.
//   npx tsx sim/equivalence.ts [seedsPerHero=2]
// 1. In lockstep: the model's own policy chooses each season, the same input goes to both, and the
//    two states must agree after every season. This tests the rules.
// 2. Apart: each plays with its own copy of the policies, and the end states must agree. This tests
//    the port of the policies.
// The model (prototypes/killgate/) is the Stage 2 record and is not maintained. Once a number in
// content/season.yaml moves, this tool is expected to disagree: it proved the port on the day it
// was made, and the commit message records that day's result.
import { loadContent } from '../tools/content-loader';
import { newLife, step, type Life } from '../src/game/life';
import { heroes, live, seedOf } from './heroes';
import { POLICIES as REAL } from './policies';
// @ts-ignore the model is plain JavaScript
import { newLife as mNew, step as mStep, play as mPlay } from '../prototypes/killgate/model.js';
// @ts-ignore
import { POLICIES as MODEL } from '../prototypes/killgate/policies.js';

const content = loadContent();
const per = Number(process.argv[2] || 2);
const KIT: Record<string, string> = { bag: 'tools', notebook: 'notebook', sack: 'sack' };
const r4 = (x: number) => x.toFixed(9);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sig = (s: any) => JSON.stringify([s.season, s.ending, r4(s.place), r4(s.skill), r4(s.strange), s.bond.map(r4), s.told, r4(s.trail), s.travelled, s.idle, s.skip, s.giftsLeft, s.setbacks, s.hurts, s.pressed, s.used, s.needsMet, s.needsLeft, s.need, r4(s.seen)]);

let lockstep = 0, apart = 0, seasons = 0;
const bad: string[] = [];
const all = heroes(content);
all.forEach((w, h) => {
  const o = { sex: w.sex === 'male' ? 'm' : 'f', courts: w.courts, kit: KIT[w.kit], job: w.job, traits: w.traits.join('+') };
  for (let i = 0; i < per; i++) for (const policy of Object.keys(REAL)) {
    const seed = seedOf(h, i);
    let m = mNew(seed, { ...o, policy }); let g: Life = newLife(content, { seed, ...w });
    if (sig(m) !== sig(g)) { bad.push(`${policy} ${JSON.stringify(w)} seed ${seed}: differ at the start`); continue; }
    while (!m.ending) {
      const input = MODEL[policy].rule(m);
      m = mStep(m, input); g = step(content, g, input); seasons++;
      if (sig(m) !== sig(g)) { bad.push(`${policy} ${JSON.stringify(w)} seed ${seed}: differ after season ${m.season}`); break; }
    }
    lockstep++;
    if (sig(mPlay(seed, { ...o, policy })) !== sig(live(content, w, seed, policy, undefined, undefined, true))) bad.push(`${policy} ${JSON.stringify(w)} seed ${seed}: the policies differ`);
    apart++;
  }
});
if (bad.length) { console.error(bad.slice(0, 10).join('\n')); console.error(`${bad.length} difference(s)`); process.exit(1); }
console.log(`equivalence: ${all.length} heroes x ${per} seeds x ${Object.keys(REAL).length} policies. ${lockstep} lives in lockstep (${seasons} seasons), ${apart} apart: every state identical to the model.`);
