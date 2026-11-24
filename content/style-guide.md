# Style guide

Applies to every written string: scenes, choices, outcomes, the creation screen, trait
descriptions, endings. `npm run lint:style` enforces the lists at the bottom. The model for the
voice is `docs/GATE-A.md`.

## The author's rules, in his words
- "It did not have enough dry wit, but I liked the way it was narrated."
- "Keep the ai feel out of the prose, I beg you."
- "Don't try too hard, it should be clever." (said of Divine Mismanagement; it holds here)
- Looks and manner "affect prose more than actions or outcome".
- 2026-11-24, on the first prototype: "Make sure the prose isn't obtuse [in] it's wit. It should
  give a chuckle at times, it's should be readable, and it should be witty and fun, while
  remaining full of wonder and wistfulness."

## Voice

**The author, 2026-11-25, on the whole Norway visit:** "The narrative prose is far too broken or
laconic. It sounds like a robot trying to be human. Make it more story like, with more flowing
narrative prose. I want to feel like I'm there, not like the game is telling me what my thoughts
are."

That verdict replaces the dry, flat reporting this guide asked for before. What went wrong: three
passes for "dry wit" and "readable" had cut every sentence down to a statement, one after another,
and filled the gaps with the hero's reactions ("You find that you do not like it"). It read as a
list of facts with a personality stuck on.

### Tell it as a story
- Second person, present tense, as before. But the sentences carry. A paragraph follows one
  moment through from its beginning to its end; it does not stop after each fact.
- Let a long sentence run where the moment runs: the hill dropping away, the fire showing the
  hall by degrees, a plank being worked. Short sentences are for the instant something breaks.
- Join things with the world, not with full stops: what a thing sounds like while another thing
  is happening, what the light is doing, what somebody's hands are busy with as they speak.

### Put the reader there
- Lead with the senses: the rain before the view, the smell of the hall before its size, the
  weight of a plank, the cold of an iron ring. At least two senses in any scene, and one of them
  not sight.
- One slow look at each new place before anything happens in it. This is the wonder.
- A detail that only this place would have: a wagtail's nest in the bow of an unfinished ship,
  a drop of rain hissing in the embers.

### Never tell the player what they think or feel
The player is the hero. The page gives them the world and what the hero's body does; the thought
is theirs to have.
- Not "You find that you do not like it." Show the mist and the boy's report, and stop.
- Not "You feel a good deal lighter, and do not much like it." The bag "goes down on the packed
  earth, and its weight leaves your shoulder."
- No: you find, you realise, you feel, you wish, you hope, you wonder, you suspect, you gather,
  you decide, you would like, you had thought, you are sure. The lint fails most of these.
- What the hero knows from their trade is given as a memory of a real thing, never as an opinion:
  "There was a garage once, and a crack creeping across a windscreen."
- What the hero says and does is the player's too. Outside a choice, keep the hero's own acts
  small and physical (a hand out, a step back), and let other people do the talking.
- Wistfulness is an image left where the reader will find it: a yard light still burning at noon,
  eleven hundred years away. Never a sentence saying the hero misses anything.

### Wit
- It lives in the people and in what happens, not in a narrator's clipped aside. A boy who works a
  zip eleven times. A smith who says, of his own life being saved, "I had noticed."
- A chuckle should be plain on a first reading.
- The narrator may use the hero's own world for a comparison (a grain truck, a garden hose). The
  people of the era never do: no modern idiom in their mouths.

### Still true
- People talk. Most scenes have at least two spoken lines, and people needle each other.
- Nobody explains the theme. If a thing has to be said, somebody in the scene says it as advice,
  for a reason of their own.
- Choice text is an action, in the imperative, under about 15 words, and does not hint which
  road is best. The screen shows no stakes under a choice.

## Machine habits: never
These made earlier drafts read as generated (`docs/GATE-A.md` history has the lines that were cut).
- A short line alone at the end of a paragraph, for effect. ("Not who. What.")
- Telling the reader what they have just worked out.
- A list of three for rhythm; "no this, no that, no the other".
- Two flat sentences where one with a turn in it would do. ("It is dark, and it is enormous.")
- An echoed closing line.
- The same construction again and again ("the way you would").
- A joke that knows it is one.

## One scene, every hero
- Plain text is for everyone. A passage that depends on who was made is written once per
  occupation (all four), and once per trait, look, manner or sex where it is used.
- A look or a manner may change a sentence. It never opens or closes a road and never moves a
  number: `tests/prototype.test.ts` fails if one does.
- A woman's route is its own route where the era demands it, not the man's with the pronouns
  changed. Write the hero without "he" or "she"; the scenes are in the second person.

## Choices
- Three roads through the same story, or one way on. Never two, never four. None is a refusal,
  a delay or a wrong answer, and none is locked for any hero. `npm run validate` fails otherwise.
- The hero uses what they know. The standing choice is how it is presented: as a craft of your
  people, done and left unexplained, or explained. Never write a road where the right play is
  to keep quiet and live as a local.

## History
- Real people appear as they were; the hero is never written into a real person's deeds.
- A period detail is checked before it shapes a scene (`docs/HISTORY.md`). One not in that file
  is from memory and is listed as such where it is used.
- In Norway: no clock time in anybody's mouth, silver by weight, names and patronymics, never
  "sir" or "my lord". Vikingr's guide (`Vikingr/content/style-guide.md`) holds the detail.

## Lint lists
Each line is one pattern. Plain lines match as case-insensitive whole words or phrases. Lines
wrapped in `/.../` are regular expressions (case-insensitive). Lines starting with `#` are comments.

### Banned (lint error)
```banned
# telling the player what they think or feel (the author, 2026-11-25)
/\byou (find|found) (that |yourself|you )/
/\byou (realise|realize|suspect|gather|decide|wish|hope|wonder|feel|felt)\b/
/\byou would (very much |much |rather |sooner )?(like|have liked|prefer)\b/
/\byou had (thought|expected|assumed|supposed)\b/
/\byou (are|were) (quite |fairly |very |almost )?(sure|certain)\b/
/\bit (occurs|comes) to you\b/
/\byou (do not|don't) (much )?like\b/
# the shows, not the history
horned helmet
/\bthe vikings\b/
# address
/\bsir\b/
my lord
# a narrator who tells you what to feel
/\byou will (remember|never forget|think about) this\b/
/\byou realise that\b/
/\byou realize that\b/
# machine connectives
/\bit is worth noting\b/
/\ba testament to\b/
/\bin that moment\b/
/\bsomething (shifts|changes) (in|between)\b/
```

### Warning (lint warning)
```warning
# the hero's mind, where it may be dialogue ("You know my uncle?") or may be the narrator
/\byou (know|notice|understand|remember|think)\b/
/\byou can (see|tell|hear)\b/
# narrator tics: each is allowed rarely
which is worse
for a long time
that is all
/\bit is not \w+\. it is\b/
/\bnobody says anything\b/
/\b(he|she) says nothing\b/
/\bthe way you would\b/
/\bas you would\b/
/\ba beat (passes|later)\b/
# contested in the sources
shieldmaiden
blood eagle
```
