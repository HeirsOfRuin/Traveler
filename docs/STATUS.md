# Where the build stands

Read after `SPEC.md`. One page, kept current: the stage, what exists, what is
waiting on whom.

## Stage (2026-11-22)

| Stage (`game-building`) | State |
|---|---|
| 0 Backlog | Done. The entry is in Game-Workshop on branch `ccr-00d0968c-uoowum`, not yet on `main` |
| 1 Spec | Approved by the author, 2026-11-22 (`SPEC.md`) |
| **2 Gate A, the read** | **Written. Waiting on the author** (`GATE-A.md`) |
| 2 Gate B, the numbers | Not started. Starts when Gate A passes |
| 3 Phase 0 design | Not started (`DESIGN.md` is a stub) |
| 4 Engine and instruments | The kit is laid and proven; none of this game's own rules exist |
| 5 to 8 | Not started |

The repo was laid before Gate A because the SPEC's handoff orders it that way
(lay the repo, write `CLAUDE.md`, then Gate A). Laying a kit is not engine
work on this game: nothing in it knows about belonging, the door or the uncle.

## What exists

- **The scaffold** (game-scaffold, shape C): Vite, Preact, TypeScript strict,
  YAML content checked by Zod, guarded saves with a v1 fixture and save codes
  (`TRV1.`), a build-id service worker, icons, the Pages workflow, the phone
  smoke test, `npm run check`.
- **The story engine** (game-narrative): `packages/engine`, `packages/tools`,
  the four text tools in `tools/narrative/`, and the kit's example game, "The
  Crossing" (8 scenes, 2 starts), in `content/` and `src/game/`. It is a
  placeholder. It is what `npm run check` plays today.
- **Documents:** `SPEC.md`, `GATE-A.md` (the sample, about 2,700 words),
  `HISTORY.md` (a first check of the four things the SPEC marked "from
  memory"), this page. `CONTENT.md`, `ECONOMY.md` and the `FRAME-*` files are
  the kit's templates and references.

`npm run check` on 2026-11-22, on the example game: build, 3 test files, validate, style
lint, continuity and render scan (158 views, 0 leaks), 200 bot runs with 0
failed, the installed-site check and the 390px smoke test, all clean. These
numbers say the kit works. They say nothing about this game.

## Not laid yet, on purpose

- **The deck** (nothing authored shown twice; Divine Mismanagement's
  `src/engine/deck.js`). It goes in with the first content system, after the
  gates. The story engine's own once-only rules for scenes need reading
  against it first.
- **The measurement kit's adapter** for Gate B. Gate B is a numbers-only model
  in `prototypes/`, written when Gate A passes.
- **This game's style guide.** `content/style-guide.md` is the example's.
  Vikingr's guide is the model for Norway; it bans modern idiom outright, and
  this game's narrator stands beside a modern person, so it cannot be copied
  whole. The Gate A verdict on voice decides how it is written.

## Waiting on the author

1. **Gate A:** read `GATE-A.md` and answer its three questions.
2. The table at the top of `GATE-A.md`: seven things the sample chose that
   are not decided.
3. The open list in `SPEC.md`: a title, love scenes, the Vesuvius season.
4. Once, in the repository on GitHub: Settings > Pages > Source: "GitHub
   Actions". The workflow cannot switch Pages on by itself. Not needed until
   there is something to play.

## Found while laying the repo

- The story kit's `tools/make-fixture.ts` failed on a fresh install: the
  installer removes the scaffold's placeholder fixture and its folder, and the
  tool wrote into the folder without making it. Fixed here and in
  `Game-Workshop/skills/game-narrative` (same date).
