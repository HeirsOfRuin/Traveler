# Gate B: the numbers

The second gate in `SPEC.md` ("Proof before screens"). A numbers-only model of
the life: one hero waiting in one era for the door to open, season by season.
No prose, no screens. It answers one question: are the SPEC's three claims
true as a table of numbers?

**Verdict after round 3 (2026-11-23): the three claims hold at a door of 16
seasons, and the six faults round 2 left open are closed: five by a rule that
was measured, one by cutting a rule that did nothing.** Four smaller things
are open (below).

Gate B was built at the author's word, "Let's build gate B now", while the
third draft of Gate A had no verdict recorded. Gate A is still open.

Round 3 follows two decisions of the author's. On the wait: "Four years is
fine". On the faults, and on what the game is: "now fix the six faults. 3.
Players aren't going to pick this game up to not feel like they are a modern
human with vast knowledge. They are going to want to use it and feel smart
and powerful. Rather than playing it as a local, I think it should be more
about making sure they don't come across as a lunatic or heretic. Running
around explaining germs, the internet, and cars will get you burnt at the
stake lol."

So the decision at the centre of the model changed. It was *whether* to use
what you know. It is now *how you present it*.

Every number in the model is a tuned placeholder. Nothing in it is sourced,
and nothing in it is a design until the Phase 0 proposal says so. What the
gate shows is that a model of this shape *can* make the claims true.

## How it was measured

All files are in `prototypes/killgate/`. `run.js`, `ablate.js`, `stats.js` and
`measure-lib.js` are the game-measure kit, copied unchanged; `rng.js` is
game-scaffold's.

| File | What | Command |
|---|---|---|
| `data.js` | Every tunable number | |
| `model.js` | The rules. Deterministic: named random streams, no clock | |
| `policies.js` | Fourteen fixed policies, each a written rule | |
| `adapter.js` | Connects the model to the kit | |
| `gate.js` | The tables below | `npm run gate` |
| `ablations/switches.js` | Each rule switched off; the inert check | `npm run gate:switches` |
| `check.js` | Determinism and invariants, 37,632 runs (every hero, every policy). Retired with the model; the game's is `sim/check.ts` | `npm run gate:check` (in `npm run check`) |

The player makes the hero: sex, who they court, one hand's worth of kit (tool
bag, notebook, sack: `GATE-A.md`), and two of four modern traits. That is 72
heroes. Every policy plays every hero on the same 30 seeds: **2,160 runs per
policy**. Rates carry one standard error (±). At 2,160 runs two rates differ
when the gap is over about 3 points.

## The model in one screen

A turn is a season; the door opens after 16. The hero chooses what the season
is for (work, train, court, the uncle's trail, a journey) and **how to present
what they know**:

| Presentation | Gain | Strangeness | What hides it |
|---|---|---|---|
| Nothing | x1 | 0 | |
| As a craft of your people | x1.5 | 3 | Skill in their ways hides most of it |
| Done openly, unexplained | x2.3 | 9 | Skill hides some |
| Explained | x3.2 | 20 | Almost nothing |

- **Place** (0 to 100) is the hall's ladder: stranger, tolerated (20),
  household (40), named (60), somebody (80). Each rung is harder than the last.
- **Skill** is the era's own way. It no longer competes with knowledge. It is
  the cover for it: the better you know how they do things, the more of yours
  passes as a craft.
- **Strangeness** is how much the hall wonders. Place and a close bond make
  the hall tolerate more. Above its tolerance, each season carries a chance of
  exposure.
- **The hero does not see the hall's tolerance.** They get a guess, off by
  about 9 points, and a close bond narrows it: someone tells you what is being
  said. (Fault 1.)
- **A need** arrives in about one season in three: somebody is hurt, something
  is broken. Meeting it openly pays half as much again and everyone is
  watching. Standing by costs place. (Fault 1.)
- **Exposure in any year but the last is a soft loss**: cast out, half the
  place kept, a season and some of every bond gone. In the last year it is
  final.
- **Courting** raises a bond with one of two people. A bond cannot pass 70
  while the truth is untold, and telling it early is itself strange.
- **The trail** has two walls: it leaves the fjord, and nobody tells a
  stranger the rest.
- **A journey** is where nobody knows you: what you do there is news, renown
  climbs a much longer ladder than the hall's, less than half the strangeness
  follows you home, and every journey turns up something of the uncle.
  (Fault 6.)
- **The dangerous way** can be chosen on the trail or a journey: 45% more
  ground for a 5% risk, named before it is taken. Before the last year the
  risk costs two seasons. In the last year it kills. Nobody is hurt or killed
  who did not choose it; `check.js` asserts that. (Fault 5.)
- **The ending** is graded from three of the SPEC's four things: the uncle
  (30), place (30), a partner (30, and 10 more if they know all of it).

## The policies

| Policy | The rule |
|---|---|
| lunatic | Works every season and explains everything, every time |
| showman | Works every season; does it openly and never explains |
| crafty | Works every season; everything is a craft of his people |
| native | Never uses what they know. Trains for a year, then works |
| riser | Trains two seasons, then works; presents what they know to suit the room as they guess it |
| placeLove | Earns a household place, courts, then goes on rising |
| placeUncle | Earns a household place, follows the trail to its end, then goes on rising |
| loveUncle | Follows the trail to its end, then courts; works only for the keep |
| everything | A household place, then the trail, then courting, then rising |
| seeker | Follows the trail and nothing else, the safe way |
| bold | Courts, then follows the trail the dangerous way |
| wanderer | A journey every other season, work between |
| lover0, lover1 | Courts one named person and does whatever that person needs |

A policy sees what a player would: the state, whether a need has come, and
the guess at the hall's room. "Riser" and the planning policies stand in for
competent play: fixed thresholds, no look-ahead. A person will beat them.

## Results against the SPEC's claims

Claim 1 in the SPEC was about using what you know or not. After the author's
decision it reads: the more openly you show it, the faster you rise and the
likelier you burn.

| Claim | Measured (2,160 runs per policy) | Verdict |
|---|---|---|
| 1a. Showing more rises faster | Place after one year: native 3.9, crafty 26.1, riser 38.6, showman 45.8 | Met |
| 1b. ...and is exposed more | Finally exposed: native 0.0%, crafty 0.0%, riser 6.3% ±0.5, showman 53.7% ±1.1, lunatic 93.5% ±0.5 | Met |
| 1c. Explaining everything is the worst thing you can do | Lunatic is cast out at least once in every run, so after a year it stands lower than showman (31.0 against 45.8) as well as being doomed | Met |
| 1d. Never using it is safe and ends as nobody | Native: exposed 0.0%, named 0.0%, below the household in 81.3% | Met |
| 1e. No fixed rule is best | Grade: lunatic 1.5, showman 11.4, native 13.1, crafty 20.9, riser 26.0. Suiting it to the room beats every fixed presentation | Met |
| 2a. The timer leaves room for a place and a courtship | placeLove has both in 88.9% ±0.7 | Met |
| 2b. ...and not for everything | All three things: 0.0% to 3.9% for the safe plans; 8.2% ±0.6 for bold, which pays for it (6.2% dead) | Met |
| 3. Both people are reachable from every hero | 72 heroes x 2 people x 30 seeds. Worst hero for each: Aud 63.3% ±8.8, the second woman 86.7%, the first man 66.7% ±8.6, the second man 83.3% | Met |

### Every policy

| Policy | Place, year 1 | Place, end | Cast out | Exposed (final) | Dead | Nobody (<40) | Named | Partner | Uncle | Two of three | All three | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| lunatic | 31.0 | 63.3 | **100.0%** | **93.5%** | 0.0% | 0.0% | 4.4% | 0.0% | 0.0% | 0.0% | 0.0% | 1.5 |
| showman | 45.8 | 66.0 | 91.9% | 53.7% | 0.0% | 0.2% | 32.1% | 0.0% | 0.0% | 0.0% | 0.0% | 11.4 |
| crafty | 26.1 | 55.7 | 0.0% | 0.0% | 0.0% | 1.0% | 26.7% | 0.0% | 0.0% | 0.0% | 0.0% | 20.9 |
| native | 3.9 | 35.0 | 0.0% | 0.0% | 0.0% | 81.3% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 13.1 |
| riser | 38.6 | 76.0 | 9.8% | 6.3% | 0.0% | 0.9% | 86.4% | 0.0% | 0.0% | 0.0% | 0.0% | 26.0 |
| placeLove | 38.6 | 72.4 | 1.9% | 1.3% | 0.0% | 0.3% | **89.1%** | **96.5%** | 0.0% | **88.9%** | 0.0% | **65.2** |
| placeUncle | 38.4 | 66.9 | 13.5% | 6.6% | 0.0% | 2.7% | 69.5% | 0.0% | 92.8% | 69.5% | 0.0% | 51.2 |
| loveUncle | 19.3 | 39.3 | 17.0% | 4.1% | 0.0% | 47.6% | 4.0% | 41.2% | **93.3%** | 41.3% | 3.9% | 58.6 |
| everything | 37.9 | 46.0 | 25.7% | 7.1% | 0.0% | 20.7% | 5.4% | 21.6% | 83.7% | 23.8% | 3.1% | 49.8 |
| seeker | 21.3 | 51.1 | 27.4% | 10.2% | 0.0% | 19.5% | 25.6% | 0.0% | 87.3% | 25.6% | 0.0% | 43.4 |
| bold | 20.5 | 48.4 | 2.8% | 3.7% | **6.2%** | 14.3% | 10.0% | 75.6% | 56.5% | 55.5% | **8.2%** | 63.6 |
| wanderer | **46.4** | **77.3** | 17.0% | 9.9% | 0.0% | 2.2% | 77.9% | 0.0% | 45.2% | 41.9% | 0.0% | 38.2 |

Place columns are means with standard errors of 0.1 to 0.7. Rate errors are
at most 1.1 points.

### The timer

Two of the three things, by how long the door stays shut; the last column is
the best any policy did at all three. 720 runs per cell.

| Seasons | placeLove | placeUncle | loveUncle | everything | bold | All three (best) |
|---|---|---|---|---|---|---|
| 8 | 0.0% | 1.9% | 0.0% | 0.0% | 0.0% | 0.0% |
| 10 | 6.5% | 15.6% | 2.8% | 0.6% | 0.8% | 0.0% |
| 12 | 32.6% ±1.7 | 46.1% ±1.9 | 7.6% | 2.5% | 9.7% | 0.4% |
| 14 | 75.7% ±1.6 | 62.2% ±1.8 | 20.1% ±1.5 | 10.7% | 32.9% ±1.8 | 2.4% |
| **16** | 88.2% ±1.2 | 69.7% ±1.7 | 42.5% ±1.8 | 24.9% ±1.6 | 54.4% ±1.9 | 6.8% ±0.9 |
| 20 | 91.4% ±1.0 | 76.8% ±1.6 | 70.6% ±1.7 | 55.7% ±1.9 | 76.4% ±1.6 | 27.4% ±1.7 |

Four years holds. At three, the best pair is under half. At five, more than a
quarter of bold lives get everything.

### What the player chose

Mean grade by kit; `*` is the best where the gap from the worst is beyond two
standard errors.

| Policy | Tool bag | Notebook | Sack |
|---|---|---|---|
| showman | 12.2* | 11.4 | 10.5 |
| crafty | 21.8* | 20.6 | 20.3 |
| native | 13.5 | 11.8 | 14.0* |
| riser | 27.0* | 26.2 | 24.9 |
| placeLove | 65.4 | 64.7 | 65.4 |
| placeUncle | 51.5 | 52.1* | 50.0 |
| loveUncle | 49.2 | 62.1 | 64.6* |
| everything | 44.6 | 47.5 | 57.3* |
| seeker | 43.8 | 44.7* | 41.7 |
| bold | 60.9 | 62.9 | 66.9* |
| wanderer | 39.1* | 38.4 | 36.9 |

Tool bag best in four rows, sack in four, notebook in two (both by under a
point). By trait, over all twelve policies: welder or nurse leads eleven rows, and
rider leads wanderer by 19 points (53.0 against 33.7). By sex, no gap is over 3.2 points.

### Each rule switched off

720 runs per policy per variant, same seeds, all 14 policies pooled: 10,080
runs a column (`npm run gate:switches`).

| Switched off | What changed |
|---|---|
| What you know can never be used | Named 36.0% to 0.0%; grade 39.3 to 11.9. The game is using it |
| The truth can never be told | Partner 29.5% to 0.0% |
| No season brings a need | Cast out 23.4% to 17.7%; named +4.9 points. Needs are what pull a careful player over the line |
| The hero reads the hall exactly | Cast out -3.4 points, named +2.9. For seeker, cast out 28.1% to 17.7% |
| The dangerous way cannot be taken | Bold: uncle 58.5% to 41.0%, dead 4.4% to 0.0% (720 runs). A real trade |
| Soft losing (exposure is final in any year) | Finally exposed 15.7% to 28.2%; mean grade 39.3 to 35.2 |
| A woman's route | Changes half the end states; pooled, named +1.5 points and nothing else beyond the noise |

The inert check marked a switch INERT only where a policy never touches the
rule.

## The six faults of round 2, and what was done

| Fault | Round 2 | What changed | Round 3 |
|---|---|---|---|
| 1. Reading the room was nearly free | Riser exposed 1.9%, cast out 1.4% | The hero sees a guess at the hall's room, not the number; needs tempt | Riser cast out 9.8% ±0.6, exposed 6.3% ±0.5, and still named in 86.4% |
| 2. "People remember" did nothing | No rate moved when it was switched off | Rebuilt for round 3 (explaining left the deepest mark) and measured again: 926 of 10,080 end states changed and no rate moved. **Cut.** | The rule is gone; no number changed when it went |
| 3. No slow, safe road to a name | Native named 0.0% | The author's decision: there should not be one. The game is using what you know without looking like a lunatic. Skill became the cover for knowledge | Crafty, the safest way to use it, is never exposed and named in 26.7% |
| 4. A place and a courtship was near certain | 98.9% | Courting gains 12 to 8 a season; an untended bond fades faster | 88.9% ±0.7 |
| 5. Nobody died | 0.0% to 0.1% | Danger is a way the hero chooses, with the risk named | Bold dead 6.2% ±0.5; every other policy 0.0%; nobody harmed who did not choose it |
| 6. Rider was weak because travel was thin | Rider last in six rows of nine | A journey has its own worth: renown, a quieter place to be clever, something of the uncle | Wanderer is named in 77.9% and has the highest place after a year (46.4). Rider leads it by 19 points |

Round 1's six failures and their numbers are in the git history of this file
(commit "Gate B: the three claims hold at a 16-season door").

## Open after round 3

1. **Everything is reachable by the dangerous way, in 8.2%.** The SPEC says
   the timer leaves no room for everything. The safe plans top out at 3.9%.
   Whether one life in twelve that risks death should get all three is the
   author's call. At 6.2% dead it is not cheap.
2. **Rider is a specialist, not fixed.** It is best by far in a life of
   journeys and last or near last in six other rows. That may be right for a
   trait about horses.
3. **The notebook is the weakest kit.** Best in two rows, both by under a
   point. It opens the trail's walls, which the careful plans get past anyway.
4. **Presenting to suit the room is one threshold rule.** Riser beats every
   fixed presentation, but the model has no case where explaining is right and
   doing it openly is wrong for a reason other than how much room there is.
   In the game that has to come from who is in the room, which a table of
   numbers cannot hold.

## Round 4: the wider hero (2026-11-23)

The author split what a hero is made of: one occupation of four (welder,
nurse, history teacher, engineer) and two traits of eight, where rounds 1 to
3 had two "traits" of four. The model follows (`data.js`: `OCCUPATIONS`,
`TRAITS`), with a placeholder number or two for each new option. Looks and
manner are not in the model; by the author's rule they change the prose more
than the outcome.

That is 1,344 heroes where there were 72, so every gate was measured again:
1,344 heroes x 8 seeds = **10,752 runs per policy**, and 20 seeds a hero for
reachability. Nothing else in the model changed. The tables above are round
3's, on 72 heroes.

| Claim | Round 3 (72 heroes) | Round 4 (1,344 heroes) |
|---|---|---|
| Explaining everything: finally exposed | 93.5% ±0.5 | 93.3% ±0.2 |
| Doing it openly, never explaining | 53.7% ±1.1 | 54.0% ±0.5 |
| Suiting it to the room: cast out / exposed / named | 9.8% / 6.3% / 86.4% | 10.5% ±0.3 / 6.5% ±0.2 / 86.3% ±0.3 |
| A place and a courtship (placeLove) | 88.9% ±0.7 | 92.5% ±0.3 |
| The other pair plans | 69.5%, 41.3% | 71.9% ±0.4, 47.1% ±0.5 |
| All three, safely | 0.0% to 3.9% | 0.0% to 6.6% ±0.2 |
| All three, the dangerous way (bold) | 8.2% ±0.6, 6.2% dead | **12.5% ±0.3**, 4.8% ±0.2 dead |
| Timer, best pair at 12 / 16 / 20 seasons | 46.1% / 88.2% / 91.4% | 49.8% / 92.4% / 93.3% |
| Worst hero for any of the four people | 63.3% ±8.8 | 50.0% ±11.2 (a woman, the notebook, a teacher, rider and sailor, courting the first man) |

The claims hold. Two things moved the wrong way and are added to the open
list: everything by the dangerous way is now one life in eight, and a place
plus a courtship crept back above 90%.

Switches, 1,344 runs per policy, 18,816 pooled: the same pattern as round 3
(no needs, cast out -4.9 points; clear sight, -2.8; soft losing off, finally
exposed +11.2).

**What the new options are worth, and it is not even.** Mean grade, each
policy's best marked:

| | Best in (of 12 policies) | Worst in |
|---|---|---|
| Welder | 6 | 0 |
| Nurse | 6 | 0 |
| Teacher | 0 | 11 |
| Engineer | 0 | 0 |
| Raised on a farm | 9 | 0 |
| Rode as a child | 1 (wanderer, by 22 points) | 1 |
| Hunts, used to a room | 1 each | 0 |
| Martial arts | 0 | 6 |
| Easy to like, fenced, sails | 0 | 1, 0, 4 |

This is the model's placeholder numbers talking, not the game: martial arts
only lowers a risk one policy takes; a teacher's knowledge is strong and
strange in a model where strangeness is the cost. It is recorded because the
real numbers will be made the same way and will need the same table. **Open
5: a history teacher is the worst occupation in eleven rows of twelve, and
four of the eight traits are best nowhere.**

## Round 5: the faults of the wider hero (2026-11-23)

The author: "Fix the prototype faults you need to get it working." Round 4
left three: everything by the dangerous way had risen to 12.5%, a place plus
a courtship to 92.5%, and the new options were lopsided (a history teacher
worst in eleven rows of twelve; four traits best nowhere).

Changed, all in `data.js` and three lines of `model.js`:

- **Each occupation and trait got a corner of its own.** A teacher reads the
  hall better (the guess at its room is off by less than half as much). An
  engineer gets more from a need. Easy to like courts faster and hears more.
  Martial arts makes the dangerous way safer and longer. Sails and rode as a
  child both make a journey pay, differently. Raised on a farm was cut back.
- **The timer was tightened**: the trail gains 18 a season, not 20; the
  dangerous way 30% more ground, not 45%; an untended bond fades by 3.

Measured, 1,344 heroes x 8 seeds = 10,752 runs per policy:

| | Round 4 | Round 5 |
|---|---|---|
| Explaining everything: finally exposed | 93.3% ±0.2 | 92.9% ±0.2 |
| Suiting it to the room: exposed / named | 6.5% / 86.3% | 5.8% ±0.2 / 88.8% ±0.3 |
| A place and a courtship | 92.5% ±0.3 | 93.9% ±0.2 |
| The other pair plans | 71.9%, 47.1% | 74.6% ±0.4, 51.0% ±0.5 |
| All three, safely (best policy) | 6.6% ±0.2 | 8.9% ±0.3 |
| All three, the dangerous way | 12.5% ±0.3 | 10.1% ±0.3 |
| Timer, best pair at 12 / 16 / 20 seasons | 49.8% / 92.4% / 93.3% | 52.8% / 93.8% / 94.0% |
| Worst hero for any of the four people (20 seeds) | 50.0% ±11.2 | 50.0% ±11.2 |
| Occupations best in at least one policy row | 2 of 4 | **4 of 4** (welder 4, engineer 4, nurse 1, teacher 1; two rows have no clear best) |
| Traits best in at least one row | 4 of 8 | **6 of 8** (used to a room 4, raised on a farm 3, fenced 2, easy to like 1, hunts 1, sails 1) |

One thing tried and taken back: courting at 7.5 a season instead of 8 pulled
a place plus a courtship down by 0.3 points and put four heroes under 25% for
one of the four people (worst 10.0% ±6.7). It cost the claim and bought
nothing, so it is 8.

**Fixed:** every occupation is now the best choice for some way of playing.
**Better, not fixed:** everything by the dangerous way, 12.5% to 10.1%.
**Not fixed, and said plainly:**

- A place plus a courtship is 93.9%. The lever that moves it (courting speed)
  breaks reachability first. It needs a rule, not a number: something a
  courtship costs besides seasons.
- Everything is reachable safely in 8.9% (the trail, then courting). It was
  3.9% on the narrower hero. Options that help the trail and options that
  help courting can now be held by one hero.
- Martial arts and rode as a child are best in no row. Martial arts is worst
  in six. Danger is one policy's business in this model, so a trait about
  danger has one place to matter.

These are placeholder numbers. The prototype does not read them; it will have
its own, made the same way and checked with the same tables.

## Round 6: a courtship costs and gives (2026-11-24)

The author, on what a courtship should cost besides time: "Your [name] and
standing are affected by your courtship. They provide different stories and
different support to you". ("Babe" in his message is read as "name".)

In the model (`data.js`, `LOVES`): a season of courting raises talk. For the
two who need you to have a place (Aud, Finn) it raises it by 1, and by 3 more
while your place is below theirs. For the other two (Hild, Eyvind) by 2.5.
Once a bond is past 50, that person gives something every season: Aud a far
clearer read of the hall and a lift to your place; Hild cover for what you
know; Finn more from your work; Eyvind more from every journey.

Measured: 1,344 heroes x 8 seeds = 10,752 runs per policy.

**The four are four different lives** (5,376 runs a person):

| Courting | Partner at the door | Named | Cast out | Place at the end |
|---|---|---|---|---|
| Aud | 84.4% ±0.5 | 52.4% ±0.7 | 9.8% ±0.4 | 59.6 |
| Hild | 95.3% ±0.3 | 31.9% ±0.6 | 4.5% ±0.3 | 53.2 |
| Finn | 85.7% ±0.5 | 63.5% ±0.7 | 9.6% ±0.4 | 63.9 |
| Eyvind | 91.0% ±0.4 | 51.4% ±0.7 | 5.6% ±0.3 | 60.6 |

**Who you court decides what else fits.** The trail and the first person
(Aud or Finn): both in 22.8% ±0.4. The trail and the second (Hild or Eyvind):
61.0% ±0.5. Before this round the first was 51.0%.

**Each half matters when switched off** (1,344 runs a policy): with courting
free, a hero courting the second person is named in 73.4% instead of 41.3%.
With no support, a hero courting the first is named in 44.0% instead of
58.4%.

**Not fixed.** A place plus a courtship, earned in that order, is still 93.7%
±0.2. The cost bites on a hero who courts before they have a place, and a
sensible one does not.

**Broken, slightly.** Claim 3 (both people reachable from every hero) now
fails for four cells of 2,688 at 20 seeds each: a woman who carried the
notebook, a history teacher, with martial arts and sailing or riding and
sailing, courting Aud or Finn: 10.0% ±6.7 at worst. She has the least work
and the most talk in the model. It is recorded, not tuned.

Unchanged: explaining everything is finally exposed in 92.9%; suiting it to
the room is named in 88.8%; all three things by the dangerous way fell from
10.1% to 6.1% ±0.2.

## Round 7: measured on the game (2026-11-28)

The model's rules were ported into the game (`src/game/life.ts`, numbers in
`content/season.yaml`), and the gate now runs on the game: `npm run gate`,
`gate:switches`, `gate:check` (in `npm run check`). The model in
`prototypes/killgate/` is retired (its README says so).

**The port is the model.** `sim/equivalence.ts` played both on every hero
(1,344) x 2 seeds x 15 policies, first in lockstep (the same input to both
every season) and then each with its own copy of the policies: 40,320 lives
and 634,634 seasons, every state identical after every season.

**One change, from the screen.** The season screen offers three ways to go
about work, the trail and a journey (as a craft, done and unexplained,
explained). It does not offer "use nothing": the author's rule is never to
make keeping quiet the right play, and learning their ways is already the
quiet season. The Gate B policies could choose nothing when the hall looked
tight, so the gate now measures with that taken away. Measured first on 7
policies x 5,376 lives each, as the model had them and with nothing taken
away:

| Policy | Exposed, model | Exposed, the screen | Named, model | Named, the screen |
|---|---|---|---|---|
| riser | 5.5% | 10.3% | 89.0% | 84.2% |
| placeUncle | 6.6% | 10.8% | 74.9% | 77.6% |
| seeker | 10.0% | 18.9% | 29.1% | 33.8% |
| wanderer | 9.4% | 14.9% | 80.5% | 76.2% |
| placeLove | 1.2% | 2.0% | 93.9% | 94.6% |

This is round 2's fault 1 ("reading the room is nearly free") pushed further
the right way: careful play is now exposed about one life in ten.

### On the game: 1,344 heroes x 8 seeds = 10,752 lives per policy, ±1 SE

| Claim | Measured | Verdict |
|---|---|---|
| Showing more rises faster and burns more | Place after a year: crafty 27.3, riser 41.4, showman 48.1. Finally exposed: crafty 0.0%, riser 10.1% ±0.3, showman 53.4% ±0.5, lunatic 92.9% ±0.2 | Holds |
| No fixed presentation is best | Grade: lunatic 1.7, showman 11.6, crafty 20.9, riser 25.7, placeLove 66.5 | Holds |
| Two of three things fit at 16 seasons; all three do not, safely | Pair plans 26.5% to 95.1% (720 lives a cell at 2 seeds); all three safely 0.0% to 10.6% ±0.3 (loveUncle2), by the dangerous way 7.5% ±0.3 | Holds, with all three now as likely by the trail and the second person as by danger |
| Both people reachable from every hero | Mean 83.2% to 93.5% by person; worst cell 10.0% ±6.7 (20 lives), two heroes under 25% for Aud and two for Finn, as in round 6 | Holds except those four cells |

**No longer measurable:** "never using what you know ends as nobody" (claim
1d). The game no longer lets anyone work without using it, so the "native"
policy now means "trains a year, then works as a craft", and it earns a name
in 56.7% ±0.5. There is no local's road to measure, which is the author's
decision of 2026-11-23.

Each rule switched off, 1,344 lives a cell, 15 policies pooled (20,160 lives
a row): every rule moves something beyond the noise. Without what you know
nobody is named (0.2%); without the truth nobody has a partner; without needs
fewer are cast out (26.3% to 18.8%); with courting free more are named (41.9%
to 49.7%); without support fewer (38.3%); with exposure final, 34.2% end
exposed instead of 18.7%. The dangerous way moves death (0.2% to 0.0%) and
little else when pooled. Sex: within the noise when pooled, as before.

## What this does not show

- Whether any of it is fun. Gate A is the only test of that, and it is open.
- Act 1 (the three visits), the other two eras, or the second playthrough.
- That these numbers are the game's. They are one set that makes the claims
  true.
- A woman's route. The model gives her multipliers, invented, so that the
  tables have a second column. They change almost nothing, which says the
  model has no route for her yet, not that she needs none.
