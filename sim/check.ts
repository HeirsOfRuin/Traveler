// Determinism and invariants for the four years, on every hero and every policy.
//   npm run gate:check   (part of npm run check)
import { loadContent } from '../tools/content-loader';
import { newLife, step, tolerance } from '../src/game/life';
import { heroes, live, seedOf } from './heroes';
import { POLICIES } from './policies';

const content = loadContent();
const S = content.season, D = S.rules;
const bad: string[] = [];
let lives = 0;
const in100 = (v: number) => Number.isFinite(v) && v >= 0 && v <= 100;
heroes(content).forEach((w, h) => {
  for (const policy of Object.keys(POLICIES)) {
    const seed = seedOf(h, 7) + lives, where = `${policy}/${JSON.stringify(w)}/seed ${seed}`;
    const a = live(content, w, seed, policy), b = live(content, w, seed, policy); lives += 2;
    if (JSON.stringify(a) !== JSON.stringify(b)) bad.push(`${where}: two plays of one seed differ`);
    if (![a.place, a.skill, a.strange, a.trail, ...a.bond].every(in100)) bad.push(`${where}: a value left 0..100`);
    if (!['door', 'exposed', 'dead'].includes(a.ending ?? '')) bad.push(`${where}: ending ${a.ending}`);
    if (a.ending === 'door' && a.season !== D.seasons) bad.push(`${where}: the door at season ${a.season}`);
    if (a.log.length !== a.season) bad.push(`${where}: a season left no record`);
    if (a.ending !== 'door' && a.season <= D.seasons - D.yearLength) bad.push(`${where}: a final loss before the last year (season ${a.season})`);
    if (a.ending === 'dead' && !a.pressed) bad.push(`${where}: died without choosing the dangerous way`);
    if (a.hurts && !a.pressed) bad.push(`${where}: hurt without choosing the dangerous way`);
    if (a.bond.some((v, k) => v > D.bondCapSilent + 1e-9 && !a.told[k])) bad.push(`${where}: a bond passed the cap with nothing told`);
  }
});
// step() never changes the life it is given
const l0 = newLife(content, { seed: 9, ...heroes(content)[0]! }), copy = JSON.stringify(l0);
step(content, l0, { focus: 'work', know: 2 });
if (JSON.stringify(l0) !== copy) bad.push('step() changed the life it was given');
if (!(tolerance(S, l0) > 0)) bad.push('tolerance is not positive');
if (bad.length) { console.error(bad.slice(0, 20).join('\n')); console.error(`${bad.length} problem(s) in ${lives} lives`); process.exit(1); }
console.log(`gate check: ${lives} lives on the game, deterministic, invariants hold`);
