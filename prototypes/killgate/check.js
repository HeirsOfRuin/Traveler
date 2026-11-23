// Determinism and invariants for the Gate B model.  node prototypes/killgate/check.js
import { play } from './model.js';
import { POLICIES } from './policies.js';
import { SEXES, COURTS, KITS, OCCUPATIONS, TRAIT_PAIRS } from './data.js';
import { digest, progress } from './adapter.js';

let runs = 0; const bad = [];
const in100 = (v) => Number.isFinite(v) && v >= 0 && v <= 100;
for (const policy of Object.keys(POLICIES)) for (const sex of SEXES) for (const courts of COURTS) for (const kit of Object.keys(KITS)) for (const job of Object.keys(OCCUPATIONS)) for (const traits of TRAIT_PAIRS) {
  for (let i = 0; i < 1; i++) {
    const seed = 11 + i * 977 + runs, o = { policy, sex, courts, kit, job, traits };
    const a = play(seed, o), b = play(seed, o); runs += 2;
    const where = `${policy}/${sex}/${courts}/${kit}/${job}/${traits}/seed ${seed}`;
    if (digest(a) !== digest(b)) bad.push(`${where}: two plays of one seed differ`);
    for (const m of progress(a)) bad.push(`${where}: ${m}`);
    if (![a.place, a.skill, a.strange, a.trail, ...a.bond].every(in100)) bad.push(`${where}: a value left 0..100`);
    if (a.ending === 'dead' && !a.pressed) bad.push(`${where}: died without choosing the dangerous way`);
    if (a.hurts && !a.pressed) bad.push(`${where}: hurt without choosing the dangerous way`);
    if (!['door', 'exposed', 'dead'].includes(a.ending)) bad.push(`${where}: ending ${a.ending}`);
    if (a.ending !== 'door' && a.season <= a.D.seasons - a.D.yearLength) bad.push(`${where}: a final loss before the last year (season ${a.season})`);
    if (a.bond.some((v, k) => v > a.D.bondCapSilent + 1e-9 && !a.told[k])) bad.push(`${where}: a bond passed the cap with nothing told`);
  }
}
if (bad.length) { console.error(bad.slice(0, 20).join('\n')); console.error(`${bad.length} problem(s) in ${runs} runs`); process.exit(1); }
console.log(`killgate check: ${runs} runs, deterministic, invariants hold`);
