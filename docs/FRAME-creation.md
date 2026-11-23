# Frame: character creation

**Status: built 2026-11-23.** The author: "I also want to build the character
Creation side of the [game] next [once] these results are sorted and you have
enough framework in place for it".

Stage 3 of the workflow (the Phase 0 design, `DESIGN.md`) is not written. This
feature was built ahead of it, under this frame, at the author's word. It
touches no rule Gate B measured and decides nothing about the engine's fit
for the game, which is what Phase 0 still has to do.

## The problem

The SPEC: "Made by the player: name, male or female, two or three modern
traits that turn out to matter". And: "The player declares at the start
whether the hero courts men or women". None of that existed. The kit's example
game began with a fixed man called Hal.

## The rule

1. **Nothing is chosen for the player.** No sex, preference or trait is
   preselected. The one default is the name, which is used only if the box is
   left empty and is shown in the box.
2. **One place says what a valid hero is** (`src/game/creation.ts`). The
   screen asks it what to allow and why Begin is shut; `newGame` asks it
   again and refuses a hero the screen could not have made. The bot and the
   text tools take their heroes from the same file.
3. **Every word on the screen is content** (`content/creation.yaml`,
   `content/registry/traits.yaml`), under the same prose rules as scenes.
4. **A shut button says why.** Begin lists what is still owed. A third trait
   is refused with "Two only. Put one back first." A group that picks one
   swaps instead.

## What the player makes

Reshaped on 2026-11-23, the day it was built. The author: "We are going to
split traits. 1 occupation, then 2 traits. Occupation options will be welder,
nurse, history teacher, and engineer. Traits will add other skills, such as
riding, charisma, martial arts, fencing, public speaking, hunting, etc.
atleast 8 choices. You also get to choose 1 of 4 options for personal
descriptive phrases (1 on looks, 1 on personality) which affect prose more
than actions or outcome".

| Field | Choices | Content reads it as |
|---|---|---|
| Name | Free text, 24 characters; "Sam" if left empty | `{name}` |
| Sex | A man, a woman | `hero.sex == female`; the pronoun tokens |
| Who they would court | A woman, a man | `courts == women` |
| Occupation, one of four | Welder, nurse, history teacher, engineer | `occupation == nurse`, `trait.nurse` |
| Traits, two of eight | Rode as a child, easy to like, martial arts, fenced, used to a room, hunts, sails, raised on a farm | `trait.rider` |
| Looks, one of four | Tall, slight, broad, easy to forget | `looks == tall`, `trait.tall` |
| Manner, one of four | Blunt, quiet, cheerful, stubborn | `manner == blunt`, `trait.blunt` |

2 x 2 x 4 x 28 x 4 x 4 = **7,168 heroes** before the name. Looks and manner
do not touch outcomes, so for the numbers there are 448, and with the three
kits the 1,344 that Gate B now measures.

The four groups are data (`content/creation.yaml`, `groups:`). A fifth group,
a ninth trait or a different count is a change to that file and a line in
`registry/traits.yaml`; the screen, the rules and the tests follow.

**Looks and manner are for the prose.** The rule for writers: a scene may
*say* a tall hero ducks or a blunt one is answered sharply; it may not open or
close a road on it, or move a number. The validator does not enforce this
yet; it is owed when this game's content starts.

**Not on this screen, on purpose:** the kit (tool bag, notebook, sack) is the
story's first choice, in the shed (`GATE-A.md`). The era of the life is chosen
in the story too.

## Choices made here that are the author's to change

| Chosen | Why | The other option |
|---|---|---|
| The two traits the author did not name: **sails**, **raised on a farm** | Six were named and eight asked for. Boats matter in all three eras; a farm childhood is the nearest a modern person comes to how these people live | Any two others: cooking, languages, music, sewing, climbing |
| "Charisma" is shown as **Easy to like**, "public speaking" as **Used to a room** | A trait reads better as a thing about a person than as a stat | The plain words |
| The four looks: tall, slight, broad, easy to forget | Each is something a scene can use in any era and for either sex, and none is a face. How the hero's face reads in 1560s Japan is a story question the SPEC already flags | Others |
| The four manners: blunt, quiet, cheerful, stubborn | Each changes how a line of dialogue lands | Others |
| The name can be left empty | A phone keyboard is a cost before the first scene | Require it |
| Nothing carries numbers | The game's numbers are not designed. The Gate B multipliers are placeholders and are not copied in | |
| One long page | It is 2,773 pixels tall at phone width, a little over three screens. It works and it scrolls | A step per group, if it feels long in the hand |
| Every word on the screen | Written for this build; under the prose rules | Any of them |

## What is not true yet

**No scene reads any of it.** What plays after the creation screen is still
the kit's example game, a medieval ferry, which was never written to know
about a nurse or a welder. `tests/creation.test.ts` proves that content *can*
read every field (a condition on each one is true for the right heroes and
false for the others), and the Menu tab shows who was made. The first real
readers are the shed (the name on the letter, the occupation in what the hero
looks at first) and the hall (sex, who they court). Until then the choices
change the save and nothing on the page. That is rule 2 of game-building,
broken knowingly and for one step.

**The shed in `GATE-A.md` is written for a welder.** The letter asks for "your
good helmet", the tool bag holds a welder's tools, and the hero judges the
uncle's welds. A nurse, a teacher and an engineer each need their own bag and
their own first look. That is three more versions of about six passages.

## Measured

- `tests/creation.test.ts`, 14 tests: the shape is the one asked for; no
  option is in two groups; the empty draft is refused with all six reasons; a
  pick-one group swaps and the traits refuse a third; nine kinds of hero the
  screen could not make are refused by `newGame`; all 7,168 heroes are
  distinct; a spread of 300 meets every option, starts, and is readable by a
  content condition on every field; a hero survives a save and a load; the
  occupations and traits are the ones the Gate B model has.
- The bot's 200 runs and the text tools take heroes spread across all 7,168.
- The style lint reads the screen's words: 115 strings, 0 errors.
- The phone smoke test makes a hero through the screen before it plays, at
  390px, with no horizontal scroll. Screenshot: `docs/shots/creation.png`.
- The save fixture was regenerated. No build has been deployed, so no save in
  the world was made by the old one; the save version stays 1.
- Gate B was re-run on the wider hero (`KILLGATE.md`, round 4).
