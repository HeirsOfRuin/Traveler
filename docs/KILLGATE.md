# Gate B: the numbers

The second gate in `SPEC.md` ("Proof before screens"). A numbers-only model of
the life: one hero waiting in one era for the door to open, season by season.
No prose, no screens. It answers one question: are the SPEC's three claims
true as a table of numbers?

**Verdict: the three claims hold, at a door that stays shut for 16 seasons,
not 12. Six design faults are open** (below). Two rounds, 2026-11-23.

Gate B was built at the author's word, "Let's build gate B now", while the
third draft of Gate A had no verdict recorded. Gate A is still open.

Every number in the model is a tuned placeholder. Nothing in it is sourced,
and nothing in it is a design until the Phase 0 proposal says so. What the
gate shows is that a model of this shape *can* make the claims true, and
where it strains.

## How it was measured

All files are in `prototypes/killgate/`. `run.js`, `ablate.js`, `stats.js` and
`measure-lib.js` are the game-measure kit, copied unchanged; `rng.js` is
game-scaffold's.

| File | What | Command |
|---|---|---|
| `data.js` | Every tunable number | |
| `model.js` | The rules. Deterministic: named random streams, no clock | |
| `policies.js` | Eleven fixed policies, each a written rule | |
| `adapter.js` | Connects the model to the kit | |
| `gate.js` | The tables below | `npm run gate` |
| `ablations/switches.js` | Each rule switched off; the inert check | `npm run gate:switches` |
| `check.js` | Determinism and invariants, 4,752 runs | `npm run gate:check` (in `npm run check`) |

The player makes the hero: sex, who they court, one hand's worth of kit (tool
bag, notebook, sack: `GATE-A.md`), and two of four modern traits. That is 72
heroes. Every policy plays every hero on the same 30 seeds: **2,160 runs per
policy**. Rates carry one standard error (±). At 2,160 runs two rates differ
when the gap is over about 3 points.

## The model in one screen

A turn is a season. The hero chooses what the season is for (work, train,
court, the uncle's trail, travel) and how much of what they know to use (none,
a little, openly).

- **Place** (0 to 100) is where the hero stands on the hall's ladder: stranger,
  tolerated (20), household (40), named (60), somebody (80). Work raises it,
  each rung is harder than the last, and a stranger who stops working for his
  keep slides back.
- **Skill** is the era's own way of doing things. Training raises it. It adds
  to work and hides some of the hero's strangeness.
- **Knowledge** multiplies a season's gain (1.8 times for a little, 3 times
  openly) and adds strangeness.
- **Strangeness** is how much the hall wonders. It fades. Place and a close
  bond make the hall tolerate more. Above the hall's tolerance, each season
  carries a chance of exposure. Talk feeds on itself by an amount the hero
  does not control.
- **Exposure in any year but the last is a soft loss** (SPEC): the hero is
  cast out, keeps half their place, loses a season and some of every bond.
  In the last year it is final.
- **Courting** raises a bond with one of two people. A bond cannot pass 70
  while the truth is untold, and telling it early is itself strange. Each of
  the two also needs one thing before they will stand beside the hero.
- **The trail** has two walls: it leaves the fjord (the hero must travel), and
  nobody tells a stranger the rest (the hero needs a foothold).
- **The ending** is graded from three of the SPEC's four things: the uncle
  (30), place (30), a partner (30, and 10 more if they know all of it). The
  fourth, which side of the door, is the player's and has no number.

## The policies

| Policy | The rule |
|---|---|
| knower | Works every season and uses what they know, openly, every time |
| native | Never uses what they know. Trains for a year, then works |
| quiet | Works every season; only ever a little, deniable knowledge |
| riser | Trains two seasons, then works; uses what they know while the hall has room for it |
| placeLove | Earns a household place, courts, then goes on rising |
| placeUncle | Earns a household place, follows the trail to its end, then goes on rising |
| loveUncle | Follows the trail to its end, then courts; works only for the keep |
| everything | A household place, then the trail, then courting, then rising |
| seeker | Follows the trail and nothing else |
| lover0, lover1 | Courts one named person and does whatever that person needs |

"Riser" and the planning policies stand in for competent play: fixed
thresholds, no look-ahead. A person will beat them.

## Results against the SPEC's claims

| Claim | Measured (2,160 runs per policy) | Verdict |
|---|---|---|
| 1a. Always using what you know rises fastest | Place after one year: knower 43.1 ±0.3, riser 38.0, quiet 34.6, native 3.2 | Met |
| 1b. ...and is exposed most | Knower is cast out at least once in 100.0%, and finally exposed in 73.5% ±0.9. Next worst: quiet, 22.4% | Met |
| 1c. Never using it is safe | Native: cast out 0.0%, exposed 0.0% | Met |
| 1d. ...and ends the life as nobody | Native ends with a name (place 60) in 0.0%. It ends in the household (mean 44.2); 16.7% end below that | Met, if "nobody" means "without a name". See fault 3 |
| 1e. Neither is best | Grade: knower 6.2, native 16.6, riser 27.9. Reading the room beats both | Met |
| 2a. The timer leaves room for a place and a courtship | At 16 seasons, placeLove has both in 98.9% ±0.2 | Met, too easily. See fault 4 |
| 2b. ...and not for everything | All three things, any policy, at 16 seasons: 0.0% | Met |
| 3. Both people are reachable from every hero | 72 heroes x 2 people x 30 seeds. Worst hero for each: Aud 90.0% ±5.5, the second woman 90.0%, the first man 80.0% ±7.3, the second man 93.3% | Met |

### Every policy

| Policy | Place, year 1 | Place, end | Cast out | Exposed (final) | Nobody (<40) | Named | Partner | Uncle | Two of three | All three | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| knower | **43.1** | 62.4 | **100.0%** | **73.5%** | 0.0% | 15.4% | 0.0% | 0.0% | 0.0% | 0.0% | 6.2 |
| native | 3.2 | 44.2 | 0.0% | 0.0% | 16.7% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 16.6 |
| quiet | 34.6 | 70.0 | 20.0% | 22.4% | 0.7% | 63.8% | 0.0% | 0.0% | 0.0% | 0.0% | 20.3 |
| riser | 38.0 | **76.6** | 1.4% | 1.9% | 0.4% | **96.6%** | 0.0% | 0.0% | 0.0% | 0.0% | 27.9 |
| placeLove | 38.0 | 73.3 | 0.1% | 0.2% | 0.1% | 98.9% | **99.7%** | 0.0% | **98.9%** | 0.0% | **67.3** |
| placeUncle | 38.0 | 63.6 | 2.3% | 1.9% | 1.5% | 74.7% | 0.0% | 97.9% | 74.7% | 0.0% | 52.8 |
| loveUncle | 14.1 | 40.7 | 3.7% | 1.7% | 42.6% | 0.0% | 55.6% | **98.3%** | 55.6% | 0.0% | 66.8 |
| everything | 34.6 | 43.0 | 6.7% | 2.7% | 14.5% | 0.0% | 40.1% | 93.2% | 40.1% | 0.0% | 59.7 |
| seeker | 16.4 | 49.0 | 12.0% | 6.3% | 11.5% | 5.9% | 0.0% | 93.7% | 5.9% | 0.0% | 45.3 |

Place columns are means; their standard errors are 0.1 to 0.4. Rate errors are
under 1.1 points. Deaths were 0.0% to 0.1% in every row (fault 5).

### The timer

How often a policy ends with two of the three things, and with all three, by
how long the door stays shut. 720 runs per cell (72 heroes x 10 seeds).

| Seasons | placeLove | placeUncle | loveUncle | everything | All three (best policy) |
|---|---|---|---|---|---|
| 8 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 10 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 12 | 9.7% ±1.1 | 6.7% ±0.9 | 0.0% | 0.0% | 0.0% |
| 14 | 92.4% ±1.0 | 26.5% ±1.6 | 15.0% ±1.3 | 3.9% ±0.7 | 0.0% |
| **16** | 99.2% ±0.3 | 74.6% ±1.6 | 56.3% ±1.8 | 39.3% ±1.8 | 0.0% |
| 20 | 97.5% ±0.6 | 93.3% ±0.9 | 87.8% ±1.2 | 85.7% ±1.3 | 28.8% ±1.7 |

The SPEC's claim is true in a window. At 12 seasons (three years) there is no
room for two things. At 20 (five years) more than a quarter of plain plans get
everything. **16 seasons, four years, is where two fit and three do not.** The
window is about two seasons wide either side, in this model.

### What the player chose

Mean grade by kit. `*` is the best of the three where the gap from the worst
is beyond two standard errors.

| Policy | Tool bag | Notebook | Sack |
|---|---|---|---|
| knower | 7.4* | 6.1 | 5.1 |
| native | 17.1 | 15.3 | 17.2* |
| quiet | 24.3* | 16.6 | 20.1 |
| riser | 28.9* | 28.0 | 26.9 |
| placeLove | 67.6* | 66.7 | 67.5 |
| placeUncle | 53.0 | 54.3* | 51.0 |
| loveUncle | 60.2 | 76.6* | 63.4 |
| everything | 56.3 | 58.3 | 64.4* |
| seeker | 46.8* | 44.8 | 44.3 |

Each kit is best somewhere: the tool bag for rising, the notebook where the
uncle is the aim, the sack for a life that tries a bit of everything. In round
1 the tool bag won seven rows of nine and the notebook none.

By sex, a woman's grade is higher in six rows of nine and a man's in one, all
by 0.5 to 3.3 points. By trait, nurse and welder lead most rows; rider is last
in six of nine (fault 6).

### Each rule switched off

720 runs per policy per variant, same seeds (`npm run gate:switches`).

| Switched off | What changed, all policies pooled |
|---|---|
| What you know can never be used | Named 39.4% to 0.0%. Partner and uncle fall with it. Nothing in the life is reachable without it (fault 3) |
| The truth can never be told | No partner, for anyone. As designed: the bond is capped while it is untold |
| Soft losing (exposure is final in any year) | Knower exposed 70.4% to 100.0%; quiet +15.4 points; riser +1.9 |
| A woman's route (sex makes no difference) | Changes half the end states. Pooled over the policies, no rate moves beyond the noise (exposed +0.9, named +0.3); single policies move by up to 10 points either way |
| Nothing shown is remembered | Changes 2,516 of 7,920 end states and **no rate beyond the noise** (fault 2) |

The inert check marked a switch INERT only where the policy never touches the
rule (the truth, for a policy that does not court). No rule is unread by the
model.

## What round 1 found

Round 1 (12 seasons, first numbers) failed in six ways. Round 2 fixed four.

| Round 1 | Measured then | Round 2 |
|---|---|---|
| The uncle could not be saved | Best policy, seeker: 3.0% ±0.4 | Trail gain 9 to 20 a season; less danger. Seeker 93.7% |
| No two things fitted in the time | placeLove 41.7%; every other pair 0.0% | The door at 16 seasons; keep due every fourth season, not third |
| Careful play was free and total | Riser: named 100.0%, never exposed, place 97 | The ladder steepens; talk adds 5 to 18, not a fixed 7; tolerance 42 to 34. Riser 96.6% named, 1.9% exposed. Still open: fault 1 |
| Death was not rare for anyone on the trail | placeUncle dead 11.0% ±0.7 | Danger cut. Now it is absent: fault 5 |
| Aud was out of reach for some heroes | 8 of 36 heroes under 25%, the worst at 0% | Reachable for all; worst 90.0% |
| One kit was right for everything | Tool bag best in 7 rows of 9, notebook in none | Each kit best somewhere (above) |

## Open faults

Not to be tuned away without measuring. Each is a design question first.

1. **Reading the room is nearly free.** Riser is exposed in 1.9% and named in
   96.6%. The danger the SPEC builds the game on, "enough of that and you are
   a witch, a spy or a madman", only happens to a policy that does not look.
   A player who watches one number will never meet it. Either the room has to
   be harder to read (the hall's tolerance is not shown as a number), or
   something has to tempt the player past it. The trail and courting do tempt:
   seeker is cast out in 12.0%.
2. **"People remember" does nothing.** The rule that strangeness can never
   fall below what the hero has shown moved no rate beyond the noise when
   switched off. It is close to decoration under these policies, because the
   careful ones stop before it binds and the knower is exposed long before.
   Cut it, or make it the thing that tempts (fault 1).
3. **There is no slow, safe road to a name.** Native is never named: 0.0%.
   Switch knowledge off and nobody is. The SPEC's per-turn decision reads
   "learn the era's own way and rise slowly and safe"; in these numbers the
   era's own way tops out in the household. That matches claim 1 as written
   ("ends the life as nobody") and may not match what the author wants. A
   question for him.
4. **A place and a courtship is nearly certain.** placeLove gets both in
   98.9%. The other pairs sit at 74.7% and 55.6%, which is the shape wanted.
   The romance costs too little next to the trail.
5. **Nobody dies.** 0.0% to 0.1%. The SPEC's second way to lose is "rare, and
   from a choice the player saw coming". In the model, danger is a small
   chance on trail and travel seasons and is only final in the last year, so
   it never lands. It should be a choice with a named risk, not a dice roll on
   a season, and the model has no such choice yet.
6. **Rider is the weak trait** (last in six rows of nine), and nurse and
   welder lead most. Travel matters only as a key to the trail, so a trait
   about travel has little to do. This is a symptom: travel is the thinnest of
   the five things a season can be for.

## What this does not show

- Whether any of it is fun. Gate A is the only test of that, and it is open.
- Act 1 (the three visits), the other two eras, or the second playthrough.
- That these numbers are the game's. They are one set that makes the claims
  true.
- A woman's route. The model gives her two multipliers, invented, so that the
  tables have a second column. They changed almost nothing, which says the
  model has no route for her yet, not that she needs none.
