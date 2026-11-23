# Traveler (working title, from the repo's name): one-page spec

Status: **approved to go to its gates, 2026-11-22.** Stage 1 of the
`game-building` workflow is done; the author answered the open questions (see
Decisions). Nothing of the game is built and nothing here is measured. Scene
counts are estimates.

The repo was laid on 2026-11-22 and the Gate A sample is written and waiting
on the author (`docs/GATE-A.md`). Where the build stands is in
`docs/STATUS.md`. This page came from `Game-Workshop/docs/specs/
time-traveller-spec.md` (branch `ccr-00d0968c-uoowum`, not merged to `main`
when it was copied); this copy is now the one that is kept up.

## Setting

Now, and then. Your uncle wrote to say he finally got it to work. His workshop
is empty, there is a note with blood on it, and there is a door that should not
be gone through. You go through it.

Three eras of our own world, each a real place in a real year, each chosen
because people already love it:

| Era | Proposed place and year | Why this one |
|---|---|---|
| Viking Norway | The western fjords, about 870, as Harald Fairhair is making one kingdom of many | Fixed by the author. Reuses Vikingr's research and style guide; later than Vikingr's 830 to 865 |
| Medieval Japan | A small province in the 1560s, the age of warring states | Fixed by the author; the year is proposed. It is the one Japanese period where a nobody rose to rule, so a zero-to-hero story is true to it. Foreigners had been landing since the 1540s, so a stranger is at least thinkable |
| The third | Rome and the Bay of Naples, AD 79 to 80: Vesuvius, then the opening of the Colosseum | Fixed by the author; the years are proposed. Ten years after Imperator, so the research carries and the story does not repeat. A city, where the other two are a fjord and a castle town |

Why it is a game: a modern person in the past has nothing (no kin, no name, no
trade, no words) and knows things nobody there knows. Both facts are dangerous.

## Shape

Two acts, approved by the author. This is the answer to a conflict in the brief: the story chases
through three eras, and the player is meant to live a full life in the one they
love.

- **Act 1, the chase.** A short visit to each era on the uncle's trail, always
  one step behind him. This is the comedy: you are useless, and the uncle has
  already been here and left a mess. You meet the people who will matter.
- **Act 2, the life.** The door home will not open again for a set time. You
  choose one era to wait in. This is the long part: a place earned, a person
  courted, the uncle's trouble brought to its end. When the door opens you go
  home or you stay.

A playthrough sees three visits and one life. The other two lives are a reason
to play again, and nothing written is shown twice in one run.

## Core loop

Act 1 is authored scenes in sequence. In Act 2, one turn is a season:

1. **Choose what the season is for:** work for your keep, train, travel, court,
   or follow the uncle's trail.
2. **Scenes come from where you are and who you know.** Choices, with checks
   against what you can do.
3. **Decide how to present what you know.** Boil the water, set the bone,
   predict the eclipse: as a trick of your people, as a thing you simply do,
   or with the reason given. (Amended 2026-11-23; it read "or keep your mouth
   shut".)
4. **The season closes:** your place in the household moves, people remember,
   the door is a season nearer.

## The scarce resource

**Belonging.** You arrive at the bottom of every ladder, and the one advantage
you have makes you strange. Modern knowledge solves a problem and raises the
question of how you knew. Enough of that and you are a witch, a spy or a
madman, depending on the era.

No built game runs on this. The nearest is The Company's gap between feared and
trusted, but there the player starts with a name.

## Per-turn decision

*As first written:* use what you know and rise fast and exposed, or learn the
era's own way and rise slowly and safe.

*As decided on 2026-11-23:* the hero uses what they know. That is what the
player came for. The decision is **how it is presented**: as a craft of your
people, done openly and left unexplained, or explained, which is what gets a
person burnt. Learning the era's own way is no longer the other road. It is
the cover: the better you know how they do things, the more of yours passes.
The author's words are in the Decisions table.

The same choice sits under the romance: how much of the truth do you tell the
one person you want to tell.

## The hero

Made by the player: name, male or female, two or three modern traits that turn
out to matter (a nurse, a welder, someone who rode horses as a child, someone
who only ever read about it). Zero to hero: each era has its own ladder, from
stranger on sufferance to someone with a name.

A woman's route is its own route where the era demands it, not the man's with
the pronouns changed. The failure this guards against is a female hero living a
life the era would not have allowed, with nobody in the story noticing.

## The people, and the two you can love

Each era has four major characters, two men and two women, each with a place in
the story whoever you are. The player declares at the start whether the hero
courts men or women; the two of that sex are the love interests, and the other
two are still there as friend, rival or patron. Nothing written is wasted on a
route the player did not take.

That is twelve major characters across the game, six of them courtable in any
one setup, two in any one life. The romance is a major thread and not the
spine: it can be declined, and the life is still a life.

## The ways to lose

1. **Exposed.** Strange enough, long enough, and the household turns on you.
2. **Dead.** The past kills people for small mistakes. Rare, and from a choice
   the player saw coming.
3. **The uncle is lost.** You were too slow or too careful, and you go home
   alone.

Because this is meant to leave the player better than it found them, a loss
ends a chapter and not the game: the story bends to a harder road, and only the
last chapter's losses are final. The author agreed to this.

## The one way to win

The door opens. You have saved the uncle or you have not, and you choose: go
home, or stay where you turned out to belong. The ending is read from four
things: the uncle, the place you earned, who is beside you, and which side of
the door you are on. It generalises across eras and heroes because every route
ends at the same door with the same question.

## What carries over, what does not

| Carries over | From |
|---|---|
| The story engine: scenes, checks, calendar, `hero.sex`, saves and codes | `game-narrative` (shape C) |
| Norway: places, ships, the hall, the style guide | Vikingr |
| Rome: the city, the decade before | Imperator |
| The deck: every authored line has an id and is never shown twice | Divine Mismanagement |
| The continuity checker (text must not assume a choice not made) | Knight of Adalia |

Does not carry over: any sim of money, armies or trade. The engine of this game
is people.

## Tone

Drama, comedy and wonder, in that order of difficulty.

- **Comedy comes from competence, not jokes.** A modern adult cannot light a
  fire, ride, or keep quiet. Report it flatly. The uncle is the other source:
  he has been everywhere first.
- **Wonder is the product.** The player came to stand in the hall, the castle
  town, the forum. Each visit gives them one slow look before anything goes
  wrong.
- **Real people appear as they were.** The hero is never written into a real
  person's deeds.
- **Love scenes close the door.** Proposed.

## First playable scope

The prologue, the Norway visit and the Norway life, with all four of its major
characters and both sexes of hero. About 150 scenes (estimate: prologue 10,
visit 25, life 115). The whole game on the same arithmetic is about 450. For
scale, Vikingr is 646 scenes.

Each further era is its own release. The game is worth shipping with one.

## Proof before screens (two gates)

**Gate A, the read.** Before any engine work the author reads about 3,000 words:
the prologue, the first hour in Norway, one of the uncle's leavings, and the
first meeting with one love interest. The questions: is it funny without trying,
is there wonder, do you want the next scene. This is the gate Divine
Mismanagement used, and nothing measures it but the author.

**Gate B, the numbers.** Bot policies on the same seeds, with run counts:

1. A policy that always uses modern knowledge rises fastest and is exposed most.
   One that never does is safe and ends the life as nobody. Neither is best.
2. The door's timer leaves room for a place earned and a courtship, and not for
   everything.
3. Both love interests are reachable from every hero the player can make.

## Assumptions and risks

- **Writing load is the project.** Three eras, twelve major characters, two
  sexes of hero. Shipping one era first is what makes it survivable.
- **The comedy and the wonder cannot be generated.** If Gate A fails there is no
  tuning that fixes it.
- **Language.** A modern person speaks no Old Norse. It needs one conceit (the
  uncle's device, which mostly works) stated once and then left alone, or every
  scene is about translation.
- **How the hero looks.** In a Norwegian hall a stranger is odd. In 1560s Japan
  a foreign face cannot pass at all, and the story has to be written from that
  fact.
- **Japan is new ground.** No built game has touched it, and it has to be right
  for players who know it well. It is the most research and should not be the
  first era built.
- **The history is from memory:** Harald Fairhair's dates, the 1540s landings in
  Japan, Vesuvius in 79 and the Colosseum in 80. All to be checked and sourced.
- **The film Timeline** is the feeling aimed at, as the author said. Nothing of
  its story, people or places is used.

## For the session that builds this

This page is the whole brief; the chat it came from is gone. In order:

1. Read `Game-Workshop/skills/game-building/SKILL.md` and follow its stages.
   Skipping a stage is allowed; skipping it silently is not.
2. Lay the repo with `Game-Workshop/skills/game-scaffold/scripts/init.mjs`,
   shape C (Vite, Preact, TypeScript, YAML content), with `game-narrative`'s
   story engine. Put this page in it as `docs/SPEC.md`.
3. Write the repo's `CLAUDE.md` on the pattern of the other games': read the
   SPEC first, `npm run check` before every commit, numbers carry their run
   counts, decisions go in the SPEC's dated table in the author's words.
4. Gate A first: write the 3,000-word sample and stop for the author's
   verdict. No engine work before it. Then Gate B as numbers only. Read
   Vikingr's `content/style-guide.md` and `docs/DESIGN.md` before writing
   Norway.
5. Check and source the history marked "from memory" before it shapes a number
   or a scene.
6. Add the game to `Game-Workshop/docs/game-backlog.md` section 1 and write
   what the build teaches back into the skills.

## Open for the author

1. A title. "Traveler" is the repo's name and stands in until there is one.
2. The exact years and places, once the history is checked. First check:
   `docs/HISTORY.md`.
3. Whether love scenes close the door (proposed above).
4. Vesuvius in August or in autumn. The day is disputed (`docs/HISTORY.md`);
   the game has to pick a season and keep it.
5. The choices the Gate A sample made to get written (`docs/GATE-A.md`, the
   table at the top): the voice, the uncle's name, the device, the hall.

## Decisions

| Date | Decision |
|---|---|
| 2026-11-22 | **The premise.** The author: "you must duck, weave, dive, and swoon your way three 3 eras of our worlds history to save your uncle and maybe even find the place you were meant to be. This one is more drama, comedy, narrative story telling, and dreppression curing wonder". |
| 2026-11-22 | **The eras.** The author: "The three eras are Viking Norway, medieval japan, and somewhere similar to what I've done but not the same as these two. My goal is to have 3 distinct eras and stories that will speak to a variety of players." The years, and Rome as the third, are proposals. |
| 2026-11-22 | **What it is for.** The author: "The main goal is that they get to see and interact with a slice of the era they so enjoy. A place whether they can choose 1 of 2 love interests, find a fulfilling life, and be the person they were born to be. A zero to hero type game that feels personal. One that resonates with the movie Timeline." |
| 2026-11-22 | **The hero and the romance.** The author: "The hero is the person they create. Either male or female. The love interests will be whatever they declare as their gender preference, thoigh I'm.not real interested in doing the whole non-binary. And the dating isn't the main story, it's a major part though. The other part is the world exploration/engagement, and rpg style adventure." |
| 2026-11-22 | **The third era is Rome.** Offered Rome, the Navy in 1793 or Missouri in the 1870s. The author: "rome". |
| 2026-11-22 | **The two-act shape,** with a door home that stays shut for a set time. Asked whether he accepted it. The author: "Yes". |
| 2026-11-22 | **Soft losing:** a loss ends a chapter and not the game, except in the last chapter. The author: "I agree". |
| 2026-11-22 | **Built alongside the Adalian colony,** each in its own repo and session. The author: "I want to do both simultaneously, so set them both up and I'll export the spec sheets to different sessions with their own repos". |
| 2026-11-22 | **The repo is laid and Gate A is written.** The author: "I want you to read the spec sheet for Time Traveler in the game workshop, and begin building the framework in the Traveler repo". Shape C with the story engine, as this page's handoff asks; the kit's example game is in place until the gates are passed. The history marked "from memory" had a first check (`docs/HISTORY.md`); the Vesuvius day turned out to be disputed. No decision of the author's is recorded here beyond the instruction to begin. |
| 2026-11-22 | **Gate A, first draft: not passed.** The author: "It did not have enough dry wit, but I liked the way it was narrated. Keep the ai feel out of the prose, I beg you." The narration (second person, present tense, a narrator beside the hero who reports) is kept. The sample was rewritten with the wit in the reporting, and the habits that read as generated were listed with the lines that showed them and made rules (`docs/GATE-A.md`, `CLAUDE.md`). The second draft waits on the author. |
| 2026-11-22 | **Gate A, second draft: not passed, on the choices.** The author: "Make sure the choices are actually worth choosing. Every choice should lead in 3 different paths of the same story, not interruptive of those choices. And the first choice where you go into the door and choose starting kit should give 3 different approaches. This may be a choose your own adventure narrative, but I don't want it to ever feel predetermined". Three of the draft's four choices failed that (a refusal, a flavour choice, one never answered). Rule: every choice is three roads through the same story, nothing later cancels a road, and a choice that cannot be three roads is not offered. Third draft: the starting kit is a trade, the uncle's notebook or goods to give; the hill has no choice; all three answers to both choices are written. "Not interruptive" was read as "the story does not put the hero back on the road it had planned"; the author has not confirmed that reading. **The scene estimate (150 for the first playable) predates this rule and is now too low; not re-estimated.** |
| 2026-11-23 | **Gate B run, with Gate A still open.** The author: "Let's build gate B now". He gave no verdict on the third draft of Gate A, so that gate is not recorded as passed. Measured (72 heroes x 30 seeds = 2,160 runs per policy, `docs/KILLGATE.md`): always using what you know rises fastest (place 43.1 after a year against 38.0) and is finally exposed in 73.5% ±0.9; never using it is never exposed and never named; reading the room beats both. **Two of the three things (a name, a partner, the uncle) fit at 16 seasons and not at 12; all three fit for nobody at 16 and for 28.8% at 20.** Both people are reachable from every hero (worst 80.0% ±7.3). Six faults open, the first being that a careful player is exposed in only 1.9%. The SPEC does not yet say how long the door stays shut; 16 seasons is the model's answer, not the author's. |
| 2026-11-23 | **The door stays shut four years.** Gate B found that two of the three things fit at 16 seasons and not at 12. The author: "Four years is fine". |
| 2026-11-23 | **The game is using what you know without being taken for a lunatic.** Gate B's fault 3 asked whether a hero who never uses modern knowledge should be able to earn a name. The author: "Players aren't going to pick this game up to not feel like they are a modern human with vast knowledge. They are going to want to use it and feel smart and powerful. Rather than playing it as a local, I think it should be more about making sure they don't come across as a lunatic or heretic. Running around explaining germs, the internet, and cars will get you burnt at the stake lol." The per-turn decision changes from whether to use it to how it is presented (craft, done openly, explained); the era's own way becomes the cover for it. The "Per-turn decision" and "Core loop" sections are amended above with the old wording kept. |
| 2026-11-23 | **Gate B, round 3: the six faults.** The author: "now fix the six faults." Measured, 2,160 runs per policy (`docs/KILLGATE.md`): a careful player is now cast out in 9.8% ±0.6 (was 1.4%), because the hall's tolerance is a guess and needs tempt; the "people remember" floor was rebuilt, measured inert a second time and cut; a place plus a courtship fell from 98.9% to 88.9%; death is a chosen risk (6.2% for the one policy that takes it in the last year, 0.0% otherwise); a journey has its own worth (a life of journeys is named in 77.9%). Explaining everything ends finally exposed in 93.5%. Four smaller things are open. |
| 2026-11-23 | **Gate A: usable for the prototype.** On the third draft (`docs/GATE-A.md`), after Gate B's round 3. The author: "Gate a is fine for now, call it usable for the prototype." Not a final pass on the voice: it clears the gate for building. One thing in the draft predates the same day's decision on knowledge: its hall choice offers "work it off" as an equal road, which leans toward living as a local. |
| 2026-11-23 | **Character creation built** (`docs/FRAME-creation.md`), ahead of the Phase 0 design. The author: "I also want to build the character Creation side of the [game] next [once] these results are sorted and you have enough framework in place for it". Name, sex, who they would court, two of four traits; nothing preselected. 24 heroes, each proven readable by content (12 tests). No scene reads them yet: what follows the screen is still the kit's example game. |
| 2026-11-23 | **What a hero is made of.** The author: "We are going to split traits. 1 occupation, then 2 traits. Occupation options will be welder, nurse, history teacher, and engineer. Traits will add other skills, such as riding, charisma, martial arts, fencing, public speaking, hunting, etc. atleast 8 choices. You also get to choose 1 of 4 options for personal descriptive phrases (1 on looks, 1 on personality) which affect prose more than actions or outcome". Built the same day (`docs/FRAME-creation.md`): 7,168 heroes. The seventh and eighth traits (sails, raised on a farm), the four looks and the four manners are proposals, not his. This replaces "two or three modern traits" in "The hero" above. Gate B re-measured on 1,344 heroes, 10,752 runs per policy: the claims hold; everything by the dangerous way rose from 8.2% to 12.5% ±0.3; a history teacher is the worst occupation in eleven policy rows of twelve under the placeholder numbers. |
| 2026-11-23 | **Gate A rewritten, fourth draft, and Gate B round 5.** The author: "Fix the prototype faults you need to get it working. Rewrite gate a with all of the new context behind it". Gate A (`docs/GATE-A.md`): written for every hero, with each occupation's version of three passages and samples by trait, look, manner and sex; the hall's choice is now how to present a modern thing done in front of everybody (a choking man's throat cleared): as a hold, left alone, or explained. It waits on the author; the third draft's "usable for the prototype" was given to different text. Gate B (`docs/KILLGATE.md`, 10,752 runs per policy): every occupation is now best for some way of playing (was 2 of 4) and six of eight traits (was 4); everything by the dangerous way 12.5% to 10.1% ±0.3. Not fixed: a place plus a courtship is 93.9%, and two traits are best nowhere. |
