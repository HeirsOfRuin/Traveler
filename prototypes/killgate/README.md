# The Gate B model: retired 2026-11-28

This was the Stage 2 kill-gate model: a numbers-only life, written before the game existed, so
that the SPEC's claims could be tested as a table of numbers. Rounds 1 to 6 of `docs/KILLGATE.md`
were measured here.

On 2026-11-28 its rules were ported into the game (`src/game/life.ts`, numbers in
`content/season.yaml`) and `sim/equivalence.ts` proved the port plays the same lives: 1,344
heroes x 2 seeds x 15 policies, 40,320 lives and 634,634 seasons, every state identical to this
model after every season. From then on `npm run gate` measures the game itself (`sim/`).

Two models drift, so this one is the record and is not maintained. Do not tune it, and do not
read a number from it as the game's. The kit files here (`run.js`, `ablate.js`, `stats.js`,
`measure-lib.js`, `rng.js`) are copies from Game-Workshop and stay as they were.
