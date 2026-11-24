# Traveler (working title): working rules

- Read `docs/SPEC.md` first in every new session (the design, the open
  questions and every decision in the author's words), then `docs/STATUS.md`
  (which stage the build is at and what is waiting on the author). Do not
  re-derive either from chat.
- Built with the HeirsOfRuin game-building skills (`Game-Workshop/skills/`).
  Read `game-building/SKILL.md` before writing game logic, and
  `game-narrative/SKILL.md` before writing scenes. Follow the stages and gates;
  skipping a stage is allowed, skipping it silently is not.
- Two gates stood before any game code. Gate A (`docs/GATE-A.md`): the author
  reads a sample. On the third draft, 2026-11-23: "Gate a is fine for now,
  call it usable for the prototype." That clears it for building; it is not a
  final word on the voice. The file now holds a fourth draft, rewritten at his
  word on everything decided since, which he has not yet read. It is the
  model for how one scene serves every hero: plain text for all, a labelled
  version where occupation, trait, look, manner or sex changes a passage.
  Gate B (`docs/KILLGATE.md`): bot policies on the same seeds, numbers only.
  It was run on 2026-11-23 at the author's word while Gate A was still open:
  the SPEC's three claims hold at a door of 16 seasons (the author: "Four
  years is fine"). Round 3 closed the six faults of round 2; four smaller
  things are open. Read them before designing any system they touch, and do
  not tune one away without measuring it.
- `docs/DESIGN.md` is the design and the record of what was built. Read it
  before touching `src/`. Section 3 says how the story engine fits a game that
  starts in a machine shed and what of it is left idle; section 7 is the first
  prototype as built, with its known gaps.
- A hero is made in one place, `src/game/creation.ts`. The screen, `newGame`,
  the bot and the tests all ask it. Do not build a hero by hand anywhere else,
  and do not preselect anything for the player. A hero is a name, a sex, who
  they would court, one occupation, two traits, one look and one manner; the
  groups are data in `content/creation.yaml`.
- Looks and manner "affect prose more than actions or outcome" (the author,
  2026-11-23). A scene may say a tall hero ducks; it may not open or close a
  road on it or move a number.
- The author on what the game is, 2026-11-23: players "are going to want to
  use it and feel smart and powerful... it should be more about making sure
  they don't come across as a lunatic or heretic." The hero uses what they
  know. The decision is how it is presented: as a craft, done openly, or
  explained. Never design or write a road where the right play is to keep
  quiet and live as a local.
- The Gate B model is `prototypes/killgate/`. Its numbers are tuned
  placeholders, not the design. Re-run `npm run gate` after any change to it
  and put the numbers, with their run counts, in the commit message. The kit
  files in it (`run.js`, `ablate.js`, `stats.js`, `measure-lib.js`, `rng.js`)
  are copies from Game-Workshop and are not edited here.
- The first prototype (2026-11-24) is the fourth draft of `docs/GATE-A.md` as
  content: the shed and the first night in Norway. The kit's example game is
  gone. One scene serves every hero: plain text for all, `[if occupation ==
  ...]` and the like where a passage depends on who was made. Write all four
  occupations whenever one is written.
- The screen wears the era being played (`src/ui/eras.css`, one block of
  tokens per era; `content/eras.yaml` maps chapters to eras). A new era is a
  block there and a line in `eras.yaml`. Look at every design at 390px after
  any change to either: three faults were found that way and none by a test.
- The author on the designs, 2026-11-24: "The designs look good, but don't
  make them too powerful, I like a calm and easy on the eyes background with
  easy transitions." Soft grounds, accents low in colour, ornaments faint,
  slow cross-fades. The art on a page is its clues, not its chrome.
- Anything written, labelled or cut by a person is a clue and is drawn
  (`content/clues.yaml`; a scene paragraph `::clue <id>::`). The author:
  "having clues like notes, carvings, etc should have some art to them".
  Never quote such a thing in running prose when it can be shown.
- `docs/STORY.md` is the whole arc and what each mechanic is for. It is a
  proposal until the author answers its section 6; do not write past the
  Norway visit on it before then.
- Standing is shown in words, never as a number, and no stakes line is shown
  under a choice (`docs/DESIGN.md` section 4).
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
- The author on the prose, 2026-11-22: "Keep the ai feel out of the prose, I
  beg you", and of the first Gate A draft, "It did not have enough dry wit, but
  I liked the way it was narrated." So: the narrator reports, drily, and the
  wit is understatement in the reporting and in what people say. Never a short
  line alone at the end of a paragraph for effect; never telling the reader
  what they have just worked out; no lists of three for rhythm; no echoed
  closing line; no joke that knows it is one. And on the prototype,
  2026-11-24: "Make sure the prose isn't obtuse [in] it's wit. It should give a
  chuckle at times... readable... witty and fun, while remaining full of wonder
  and wistfulness." Readable comes first: a line that needs a second reading
  is said straight. `content/style-guide.md` holds all of it. Read every scene
  against it before it is committed.
- The author on choices, 2026-11-22: "Make sure the choices are actually
  worth choosing. Every choice should lead in 3 different paths of the same
  story, not interruptive of those choices... I don't want it to ever feel
  predetermined". So: every choice is three roads through the same story.
  None is a refusal, a delay, a wrong answer or flavour. No later scene folds
  a road back into the one the story had planned: the same places and people
  come round and meet a different person. A choice that cannot be written as
  three roads is not offered. The second Gate A draft failed on this in three
  choices out of four (`docs/GATE-A.md` has the table). `npm run audit` lists
  choices that do nothing, and `npm run validate` fails a scene that offers two
  roads, or four, or three that do the same thing, or one locked for any hero.
  A scene with one choice is a page turn.
- Before writing Norway, read Vikingr's `content/style-guide.md` and
  `docs/DESIGN.md`. This game's own guide is `content/style-guide.md`.
- Decisions go in the SPEC's dated table with the author's words quoted.
- Scratch files are `tools/_*.mjs` or `*.tmp.*` and are never committed.
  `dist/`, `out/`, `release/` are output and never committed.
- Do not open a pull request unless the author asks.
- Write for a reader who was not there: plain words, the failure behind each
  rule, the number that was measured.
