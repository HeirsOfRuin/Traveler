# Traveler (working title): working rules

- Read `docs/SPEC.md` first in every new session (the design, the open
  questions and every decision in the author's words), then `docs/STATUS.md`
  (which stage the build is at and what is waiting on the author). Do not
  re-derive either from chat.
- Built with the HeirsOfRuin game-building skills (`Game-Workshop/skills/`).
  Read `game-building/SKILL.md` before writing game logic, and
  `game-narrative/SKILL.md` before writing scenes. Follow the stages and gates;
  skipping a stage is allowed, skipping it silently is not.
- Two gates stand before any game code. Gate A (`docs/GATE-A.md`): the author
  reads the sample and says whether it is funny without trying, whether there
  is wonder, and whether he wants the next scene. Nothing measures it but him.
  Gate B: bot policies on the same seeds, numbers only. No engine work on the
  game's own rules before Gate A is passed.
- What is in `content/` and `src/game/` today is the story kit's example game
  ("The Crossing"). It is there so every instrument has something to prove. It
  is replaced chapter by chapter after the gates, never extended.
- `packages/engine`, `packages/tools` and `tools/narrative/` are copies of the
  kit and are not edited here. A fault found in them is fixed in
  `Game-Workshop/skills/game-narrative` and brought back with
  `install.mjs --upgrade`. This game's rules go in `src/game/module.ts` and
  `src/content/schema.ts`.
- Every commit runs `npm run check` first. Numbers in a commit message carry
  their run counts.
- History is checked before it shapes a number or a scene. `docs/HISTORY.md`
  holds each claim, its source and how far it has been checked. A claim not in
  that file is from memory and is treated as unchecked.
- Real people appear as they were. The hero is never written into a real
  person's deeds.
- Nothing authored is shown twice in one playthrough. Every authored line has
  an id in a deck and the spent list is in the save; a dry deck leaves the
  prose out. New content systems use the deck from their first commit. (The
  deck is Divine Mismanagement's `src/engine/deck.js`; it is not laid here yet.)
- A woman's route is its own route where the era demands it, not the man's
  with the pronouns changed. Every scene written for one sex of hero is read
  against the other before it is committed.
- Before writing Norway, read Vikingr's `content/style-guide.md` and
  `docs/DESIGN.md`. This game's own guide is `content/style-guide.md`.
- Decisions go in the SPEC's dated table with the author's words quoted.
- Scratch files are `tools/_*.mjs` or `*.tmp.*` and are never committed.
  `dist/`, `out/`, `release/` are output and never committed.
- Do not open a pull request unless the author asks.
- Write for a reader who was not there: plain words, the failure behind each
  rule, the number that was measured.
