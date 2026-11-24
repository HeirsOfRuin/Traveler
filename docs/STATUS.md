# Where the build stands

Read after `SPEC.md`. One page, kept current: the stage, what exists, what is
waiting on whom.

## Stage (2026-11-24)

| Stage (`game-building`) | State |
|---|---|
| 0 Backlog | Done. The entry is in Game-Workshop on branch `ccr-00d0968c-uoowum`, not yet on `main` |
| 1 Spec | Approved 2026-11-22; amended since (`SPEC.md`, decisions table) |
| 2 Gate A, the read | Third draft accepted as usable for the prototype. The fourth, rewritten on everything decided since, **is the prototype's text and has not been read** (`GATE-A.md`) |
| 2 Gate B, the numbers | Five rounds. The claims hold at 16 seasons; three things open (`KILLGATE.md`) |
| 3 Phase 0 design | Written with the prototype (`DESIGN.md`) |
| 4 Engine and instruments | The kit, character creation, this game's module |
| **5 Calibration** | **A first prototype plays. The author's playtest is the next thing** (`DESIGN.md` section 7) |
| 6 to 8 | Not started |

## What exists

- **A first prototype:** title, character creation, the shed, the hill, the
  hall, the smith's throat, one of three scenes with Aud, the first night.
  Two choices of three roads; nine ways through; 7,168 heroes; about fifteen
  minutes. 8 scenes in `content/scenes/`.
- **One design per era** (`src/ui/eras.css`): now, Norway, Japan, Rome. The
  screen wears the era being played. Japan and Rome have no scenes and can be
  looked at from the You page.
- **Character creation** (`content/creation.yaml`, `src/game/creation.ts`).
- **This game's rules** (`src/game/module.ts`): the kit, the three
  presentations, standing as two counters shown in words, the era.
- **The Gate B model** (`prototypes/killgate/`): numbers only, not read by the
  game.
- **Instruments:** 31 tests, a validator that enforces three roads, the choice
  audit, the style lint on this game's own guide, continuity, render scan, the
  bot, the phone smoke test, scripted playthroughs in `docs/playthroughs/`.
- **Documents:** `SPEC.md`, `DESIGN.md`, `GATE-A.md`, `KILLGATE.md`,
  `HISTORY.md`, `FRAME-creation.md`, this page.

The kit's example game ("The Crossing") is gone.

## Not built

Listed in `DESIGN.md` section 7, "Known gaps". The large ones: nothing reads
standing (no exposure, no season, no door); who the hero would court changes
nothing; a woman's hall differs from a man's by one bench; six of eight traits
have no passage; the deck is not laid.

## Waiting on the author

1. **Play the prototype** on a phone and say: the voice, the two choices, the
   creation screen, the four designs. (`DESIGN.md` section 9 has four
   questions with defaults.)
2. **To play it from a link:** once, in the repository on GitHub, Settings >
   Pages > Source: "GitHub Actions". The workflow deploys from the default
   branch and cannot switch Pages on by itself.
3. `FRAME-creation.md`: the two traits he did not name, the looks, the
   manners, the words.
4. `SPEC.md`, open list: a title, love scenes, the Vesuvius season.
5. `KILLGATE.md`: whether one bold life in ten should have everything.

## Found while laying the repo

- The story kit's `tools/make-fixture.ts` failed on a fresh install: the
  installer removes the scaffold's placeholder fixture and its folder, and the
  tool wrote into the folder without making it. Fixed here and in
  `Game-Workshop/skills/game-narrative` (same date).
