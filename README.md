# Traveler (working title)

An accidental time traveller: Norway about 870, Japan in the 1560s, Rome in AD 79. Three visits, one life.

Status, 2026-11-22: the spec is approved (`docs/SPEC.md`), the repo is laid,
and the first gate is waiting on the author's read (`docs/GATE-A.md`). What
plays today is the story kit's example game, a placeholder. `docs/STATUS.md`
says where the build stands.

## Play as an app

Once the Pages workflow has run on the default branch: open
https://heirsofruin.github.io/Traveler/ on a phone and choose Install (Chrome)
or Share → Add to Home Screen (Safari). It plays with the network off. Saves
live in that browser; Menu → Copy a save code moves a game anywhere.

## Run

```
npm install
npm run dev          # Vite dev server
npm run build        # dist/ (installable, build id stamped)
```

## Check

```
npm run check     # content build, typecheck, build, tests, a 200-story bot batch, the site check, the phone smoke test
```

Must pass before every commit.

## Instruments

| Command | Question |
|---|---|
| `npm test` | Is it true? Invariants and the save contract |
| `npm run sim -- --runs=200 --by=difficulty` | Is it balanced? Batch runs by cell, ±1 SE (game-measure) |
| `npm run sim -- --trace --seed=3` | One game, turn by turn |
| `npm run smoke` | Does the real page work at 390px? |

## Layout

```
content/      YAML scenes (compiled to src/content/bundle.json)
src/content/  schema (Zod) and the compiled bundle
src/engine/   pure: story facade, rng
src/ui/       Preact screens; read the engine, compute nothing
tools/        build-content, bot, smoke, check-bundle, icons, stamp
tests/        Vitest
```

## Sources
<!-- Real figures and their sources; "rounded for a game, do not cite". -->
