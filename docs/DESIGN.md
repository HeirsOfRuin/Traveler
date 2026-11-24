# Traveler: design

Stage 3 of the workflow, written 2026-11-24 with the first prototype, at the
author's word: "Build me the first prototype using the gates we have done.
The character Creation should be included in this. The UI should have designs
that match each era you are playing in".

It is short on purpose. It settles what the prototype had to settle and lists
what it left. Where a later "as built" section differs from the plan above it,
the later section wins.

Inputs: `SPEC.md` (the game and every decision), `GATE-A.md` (the voice and
how one scene serves every hero), `KILLGATE.md` (the numbers),
`FRAME-creation.md`.

## 1. Decisions already made

| Decision | Source |
|---|---|
| Phone first, installable, offline, no accounts, turn-based | Every previous build |
| Shape C (Vite, Preact, TypeScript strict, YAML, Zod) with game-narrative's story engine | `SPEC.md` handoff |
| A hero is a name, a sex, who they would court, one occupation, two traits, a look, a manner | The author, 2026-11-23 |
| Looks and manner change prose, not outcomes | The author, 2026-11-23 |
| The hero uses what they know; the decision is how it is presented | The author, 2026-11-23 |
| Every choice is three roads of the same story | The author, 2026-11-22 |
| The door stays shut four years (16 seasons) | The author, 2026-11-23, on Gate B |
| The screen's design matches the era being played | The author, 2026-11-24 |
| Nothing authored is shown twice in one playthrough | `SPEC.md` |

## 2. Architecture

```
content/          YAML: scenes, registries, creation.yaml, eras.yaml, the style guide
src/content/      the schema (Zod) and the compiled bundle
src/game/         this game's rules
  creation.ts       what a valid hero is: the one place
  module.ts         this game's paths, effects and date line
  state.ts          what this game adds to the engine's state
  index.ts          newGame, and the engine's view and choose
  save.ts           the save contract
src/ui/           Preact screens; read the engine, compute nothing
  App.tsx           title, story, journal, the You page
  Creation.tsx      the creation screen
  eras.css          one design per era, as tokens
packages/engine   the story engine, copied from the kit and not edited here
prototypes/killgate   the Gate B numbers model: not read by the game
```
Import direction: `ui -> game -> engine`. Content is data; the game never
holds a sentence.

## 3. How the story engine fits, and where it does not

The engine was built for a knight's career under a king. This game opens in a
machine shed.

| The engine has | This game | Decided |
|---|---|---|
| A date line: "Spring, year 3 of King Edmund" | Four places in four different centuries | **The date line is the era's** (`content/eras.yaml`), through the engine's own `date` hook. `start_year` and `regnal_king` are set and never shown |
| Attributes and skills, and checks rolled against them | No design for checks yet | **No checks in the prototype.** One attribute and one skill stand in for the lists the schema requires. Whether this game rolls dice at all is open (section 9) |
| Stations: a ladder of rank | A ladder in each era, not designed | One station, `stranger`. Standing is two counters, shown in words |
| Starts: several openings | One opening; the differences are the hero's | One start, `door`. Who you are is creation, not a start |
| Coin, health, injuries, items | None yet | Idle |
| Scenes, conditions, effects, text templates, saves, save codes, the bot, the text tools | All of it | Used as built |

## 4. This game's own rules, as far as the prototype goes

**Paths content can read** (`src/game/module.ts`):

| Path | Is |
|---|---|
| `{name}`, `hero.sex == female` | The engine's |
| `courts == women` | Who the hero would court |
| `occupation == nurse`, `looks == tall`, `manner == blunt` | The creation groups that pick one |
| `trait.<id>` | Any pick at all, including the three above |
| `kit == bag`, `notebook`, `sack` | What was carried through the door |
| `shown.craft`, `shown.open`, `shown.explain` | How many times each presentation has been used |
| `era == norway` | Where the chapter happens |
| `counter.place`, `counter.talk` | Standing: the hall's ladder, and how much it wonders |

**Effects:** `take: bag` (the kit), `present: explain` (a presentation), and
the engine's `add` on the two counters.

**Standing is shown in words, never a number.** The You page reads the two
counters through lists in `eras.yaml` ("You have been moved up the bench, into
the warm"). Gate B's fault 1 was that a player who watches one number is never
exposed. Nobody in the hall would give you the number.

**No stakes line under a choice.** The engine can print what each choice puts
at stake. The screen does not, because choice text must not hint which road is
best and a line reading "Talk about you" under one of three would.

**One way on is a page turn.** The engine needs every scene to have a choice.
This game's rule is three roads or none, so a scene with one choice is shown
as a single button and is not counted as a choice. The validator fails a scene
with two, or four, or three that do the same thing, or a road locked for any
hero.

**Nothing shown twice.** Every scene in the prototype is on the spine and is
visited once by construction. The deck (`SPEC.md`) is owed with the first
thing that draws from a pool: seasonal scenes in Act 2.

## 5. Screens

| Screen | What it does |
|---|---|
| Title | Continue, new game, what the prototype is |
| Creation | `FRAME-creation.md`. One long page |
| Story | The era's line and the scene's title; a chapter card on entering an era; pages with Continue; three roads or one way on |
| Journal | Every choice made, newest first |
| You | Who was made, what is carried, standing in words; save codes; the four designs |
| The end | The ending's card, and where it leaves the hero |

## 6. One design per era

The screen wears the era of the chapter being played. The title and the
creation screen are "now". An era is one block of tokens in `src/ui/eras.css`
(colours, faces, the case and spacing of headings, corner radius, one
ornament) and nothing else in the code knows the difference.

| Era | The idea | Ground and ink | Accent | Headings | Ornament |
|---|---|---|---|---|---|
| Now | A machine shed | Galvanised grey, white | Safety yellow | Condensed capitals, like his labels | Hazard stripe; cards are masking tape, slightly crooked |
| Norway | A hall by firelight | Soot and timber, bone white | Amber | Bold old-style serif | A carved two-strand braid |
| Japan | Ink on paper | Washi, sumi black | One vermilion seal | Mincho, widely spaced | A line of waves; cards ruled above and below with a red seal |
| Rome | A painted wall | Plaster, dark umber | Pompeian red, ochre | Cut capitals, wide | A meander; cards are a red panel with a ruled border |

No network fonts: each face is a stack of what phones already carry, so the
game works offline and looks slightly different on each. Japan and Rome are
light; now and Norway are dark. Japan and Rome have no scenes: the You page
lets them be looked at.

These are a first pass made without the author. The ornaments are drawn from
memory of well-known patterns (a ring-chain braid, *seigaiha* waves, a Greek
key) and none is checked against a dated object. That check is owed before
any of them is called period.

## 7. The first prototype, as built (2026-11-24)

**What plays:** the title, character creation, the shed (the kit: three
roads), the hill, the hall, the smith's throat (the presentation: three
roads), one of three scenes with Aud, and the first night. Nine ways through,
for 7,168 heroes. About fifteen minutes. It is `docs/GATE-A.md`, fourth
draft, as content, with a short closing scene written for the build.

| | Count |
|---|---|
| Scenes | 8 (1 prologue, 6 Norway, 1 ending) |
| Choices that are choices | 2, of three roads each |
| Words of scene text | about 5,200 across every version; one playthrough reads about 3,200 |
| Passages that vary by occupation | 3, written four ways (the nurse's hurry is written two ways) |
| By trait / look / manner / sex | 2 / 2 / 1 / 1 |

**Measured** (`npm run check`):

- 31 tests. Fourteen are on the prototype (`tests/prototype.test.ts`): all nine
  ways reach the end and no two read the same; the three kits and the three
  presentations each leave a different state and different standing words;
  each occupation reads its own passages and nobody else's; every look and
  manner reads differently and none moves a counter, a flag, a scene or a
  road, over 9 ways x 8 options; 40 heroes x 9 ways show no raw template.
- The validator: 8 scenes, 0 errors, 0 warnings, including the three-roads
  rule.
- The choice audit: 0 hollow choices.
- The bot: 100 runs across heroes spread over all 7,168, 0 failed.
- The style lint: 103 strings, 0 errors, 3 warnings (the three copies of "as
  you would" in the kit choice's after-text; a player reads one).
- The phone smoke test at 390px makes a hero through the screen and plays to
  the end. Screenshots of all four designs were looked at
  (`docs/shots/prototype.png`); three faults found that way were fixed (a
  yellow line on a yellow button, the tab bar wearing the creation screen's
  "picked" look, Rome's capitals wrapping the era line). The smoke test
  itself found a fourth: a reload in the middle of a scene went back to the
  scene's first page. The page is now kept beside the save.
- Scripted playthroughs to read: `docs/playthroughs/`.

**Known gaps, carried forward**

1. The fourth draft of Gate A has not been read by the author. The prototype
   is that draft. A verdict on one is a verdict on the other.
2. A woman's time in the hall differs from a man's by one bench.
3. Who the hero would court changes nothing yet. Aud's scenes are written to
   work for any hero and court nobody.
4. Six of the eight traits have no passage.
5. Standing moves and is shown, and nothing reads it. There is no exposure,
   no season, no door.
6. The closing scene (`e_first_night`) is new prose and was not in Gate A.

## 8. Build plan from here

| Step | Delivers | Exit |
|---|---|---|
| Calibration | The author plays the prototype on a phone | His verdict on the voice, the two choices, the creation screen and the four designs |
| The rest of the Norway visit | The uncle's trail to the edge of the fjord; the second of the two people; the door | He wants the next era |
| The season | Act 2's turn on the engine's calendar; standing that is read; exposure as a soft loss; the deck | Gate B's tables reproduced from the real game |
| Japan, then Rome | Each its own release (`SPEC.md`) | |

## 9. Questions for the author (with the default if unanswered)

| # | Question | Default |
|---|---|---|
| 1 | Does this game roll dice? The engine can test a choice against a skill and show "Risky / Even / Favorable". Gate B used chance only for exposure and for the dangerous way | No checks in authored scenes; chance only where Gate B has it |
| 2 | Is the creation screen one page or a step per group? | One page |
| 3 | Should the four designs go further (a drawn header, a texture, the hero's kit pictured)? | Tokens and one ornament each, until the voice is settled |
| 4 | A title | "Traveler" stands in |

## Decisions log

| Date | Decision |
|---|---|
| 2026-11-24 | **The first prototype** (section 7). The author: "Build me the first prototype using the gates we have done. The character Creation should be included in this. The UI should have designs that match each era you are playing in". The kit's example game is removed. Four era designs as tokens; Japan and Rome can be looked at and have no scenes. Measured: 31 tests, 100 bot runs with 0 failed, 0 hollow choices, smoke at 390px. |
