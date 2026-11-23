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
   is refused with "Two only. Put one back first."

## What the player makes

| Field | Choices | Stored as | Content reads it as |
|---|---|---|---|
| Name | Free text, 24 characters; "Sam" if left empty | `hero.name` | `{name}` |
| Sex | A man, a woman | `hero.sex` | `hero.sex == female`; the pronoun tokens |
| Who they would court | A woman, a man | `state.courts` | `courts == women` |
| Two traits | Nurse, welder, rode as a child, only ever read about it | `hero.traits` | `trait.nurse` |

That is 24 heroes before the name. With the three kits it is the 72 Gate B
measured.

**Not on this screen, on purpose:** the kit (tool bag, notebook, sack) is the
story's first choice, in the shed (`GATE-A.md`). The era of the life is chosen
in the story too.

## Choices made here that are the author's to change

| Chosen | Why | The other option |
|---|---|---|
| Two traits, not three | Gate B measured two of four. Three of four would make every hero nearly the same | "Two or three" (SPEC); needs more traits first |
| Four traits, the SPEC's own examples | They are the ones in the model | More, once each has a use written in each era |
| The name can be left empty | A phone keyboard is a cost before the first scene | Require it |
| Traits carry no numbers | The game's numbers are not designed. The Gate B multipliers are placeholders and are not copied in | |
| The words on the screen | Written for this build; under the prose rules | Any of them |

## What is not true yet

**No scene reads any of it.** What plays after the creation screen is still
the kit's example game, a medieval ferry, which was never written to know
about a nurse or a welder. `tests/creation.test.ts` proves that content *can*
read every field (a condition on each one is true for the right heroes and
false for the others), and the Menu tab shows who was made. The first real
readers are the shed (the name on the letter, a trait in what the hero looks
at first) and the hall (sex, who they court). Until then the choices change
the save and nothing on the page. That is rule 2 of game-building, broken
knowingly and for one step.

## Measured

- `tests/creation.test.ts`, 12 tests: the empty draft is refused with all
  three reasons; a third trait is refused with its reason; five kinds of hero
  the screen could not make are refused by `newGame`; all 24 heroes start,
  differ in state, and have an open choice; each field is readable by a
  content condition; a hero survives a save and a load; the traits are the
  ones Gate B measured.
- The bot's 200 runs and the text tools now rotate through all 24 heroes.
- The phone smoke test makes a hero through the screen (a woman, courts men,
  nurse and rider) before it plays, at 390px, with no horizontal scroll.
- The save fixture was regenerated. No build has been deployed, so no save in
  the world was made by the old one; the save version stays 1.
