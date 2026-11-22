# Traveler: Phase 0 design proposal (not written yet)

Stage 3 of the workflow: stack, architecture, content schema, screens, look
and build plan, for the author's approval before game code. It is written
after both gates in `SPEC.md` are passed, from what they show. Writing it
earlier would design a game that Gate A may stop.

Until then, `STATUS.md` says what is laid and why.

## Decisions already made
| Decision | Source |
|---|---|
| Phone first, installable, offline, no accounts, turn-based | All previous builds |
| Shape C: Vite + Preact + TypeScript (strict) + YAML content + Zod, with game-narrative's story engine | `SPEC.md`, "For the session that builds this" |
| Saves: guarded localStorage, key `traveler.save.v1`, migrations, a fixture per version, save codes prefixed `TRV1.` | game-scaffold and game-narrative, 2026-11-22 |
| Nothing authored is shown twice in one playthrough (the deck) | `SPEC.md`, "What carries over" |
| No sim of money, armies or trade | `SPEC.md` |

## To be designed here, after the gates
- How belonging and strangeness are held and shown (the scarce resource).
- The season turn of Act 2 on the story engine's calendar.
- The door's timer, and how time runs on the two sides of it.
- The hero: sex, who they court, two or three modern traits, and what each
  trait opens in each era.
- How one content tree serves two sexes of hero without one being the other
  with the pronouns changed.
- Soft losing: a loss ends a chapter and bends the story, except in the last.
- The deck, against the engine's own pools and once-only scenes.
- Screens, look, and a style tile.
