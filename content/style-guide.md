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
- Second person, present tense. A narrator who stands beside a modern person and reports.
- The wit is understatement, in the reporting and in what people say. Nothing is set up as a
  joke. Comedy comes from competence: a modern adult cannot light a fire, find a lintel or eat
  without being lent a spoon. Report it flatly.
- The narrator may use the hero's own world for a comparison (a grain truck, a garden hose, a
  bus stop). The people of the era never do: no modern idiom in their mouths.
- Each visit gives one slow look at the place before anything goes wrong.
- People talk. Most scenes have at least two spoken lines, and people needle each other.
- Nobody explains the theme. If a thing has to be said, somebody in the scene says it as advice
  and for a reason of their own.
- Choice text is an action, in the imperative, under about 15 words, and does not hint which
  road is best. The screen shows no stakes under a choice.

## Readable first
The dry voice went too far in places: a line the reader has to stop and work out is not wit.
- If a joke needs a second reading, say it straight. "You gave him a summer of lessons once and
  he gave it back" became "and none of it stuck".
- A chuckle every page or so, and it should be plain what is funny.
- Wonder: one slow look per place, and one thing made by hand that is better than it needed to be.
- Wistfulness: a line now and then about who is not here to see it. The uncle writes to nobody
  else; the hero would like to tell their mother about the roof.
- Fun is allowed. People in the hall enjoy each other.

## Machine habits: never
These made the first draft read as generated (`docs/GATE-A.md` history has the lines that were cut).
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
