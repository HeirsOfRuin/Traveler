// Every tunable number of the Gate B model. Nothing here is sourced: these are
// tuned placeholders for a numbers-only test of the SPEC's three claims, and
// none of them is a design until the Phase 0 proposal says so.
//
// One turn is a season. The life is the wait for the door.

export const D = {
  seasons: 16,          // the door stays shut this long (four years); see the timer table
  yearLength: 4,        // a year is a chapter; only the last chapter's losses are final

  // --- place: where you stand on the hall's ladder, 0..100
  rungs: [[80, 'somebody'], [60, 'named'], [40, 'household'], [20, 'tolerated'], [0, 'stranger']],
  nobodyBelow: 40,      // door reached below this = "ends the life as nobody"
  workPlace: 4,         // place from a season's work, at the foot of the ladder
  ladderTop: 110,       // gains shrink as place nears this: each rung is harder than the last
  workSkill: 0.03,      // extra place per point of skill
  idleGrace: 3,         // seasons without working for your keep before it costs you
  idleCost: 4,          // place lost per season after that
  placeDrift: 1.2,      // place lost every season, working or not: a stranger is forgotten

  // --- skill: the era's own way of doing things, 0..100
  trainSkill: 12,       // per season of training, shrinking as skill rises
  trainPlace: 1,
  trainCalms: 4,        // extra strangeness lost in a season spent learning their way

  // --- knowledge. The hero is expected to use it (the author, 2026-11-23); the
  //     choice is how it is presented:
  //     0 nothing | 1 as a craft of your people | 2 done openly, unexplained | 3 explained
  knowGain: [1, 1.5, 2.3, 3.2],       // multiplies the season's gain
  knowStrange: [0, 3, 9, 20],         // strangeness it adds: explaining germs is what gets you burnt
  skillCovers: [0, 0.011, 0.005, 0.001], // share hidden per point of skill: their ways cover a craft well, a lecture not at all

  // --- a need: a season when somebody is hurt or something is broken
  needChance: 0.35,
  needGain: 1.5,        // meeting it openly (know 2 or 3) multiplies the gain again
  needStrange: 1.3,     // and everyone was watching
  needIgnored: 3,       // place lost for standing by with your hands in your pockets

  // --- reading the room
  readNoise: 9,         // the hero's guess at the hall's room is off by about this (1 sd)
  bondTells: 0.7,       // a full bond removes this share of the error: someone tells you what is said

  // --- strangeness: how much the hall wonders about you, 0..100
  strangeDecay: 3,
  placeCalms: 0.03,     // extra decay per point of place
  rumourChance: 0.25,   // a season when talk feeds on itself
  rumourAt: 25,         // only once there is something to talk about
  rumourMin: 5,         // and how much it adds is not in your hands
  rumourMax: 18,
  tolerance: 34,        // exposure cannot happen below this
  placeShields: 0.2,    // tolerance per point of place
  bondShields: 0.15,    // tolerance per point of your closest bond
  exposeSpan: 45,       // strangeness above tolerance / this = chance of exposure that season

  // --- a soft loss (any year but the last): the harder road
  castOutPlace: 0.5,    // place is multiplied by this
  castOutStrange: 28,   // and strangeness falls to this: the worst has been said
  castOutBond: 18,      // every bond loses this
  castOutSeasons: 1,    // seasons lost getting back in

  // --- courting
  courtBond: 8,
  courtPlace: 0.05,     // per point of place: a person of standing is listened to
  bondCapSilent: 70,    // a bond cannot pass this while the truth is untold
  partnerAt: 80,
  truthBond: [0, 5, 10],        // extra bond in a season when you tell part, or all
  truthStrangeAt: 60,   // telling the truth below this bond is a risk
  truthStrange: 0.28,   // strangeness per point the bond is short of it
  bondFade: 2.5,        // a bond you do not tend loses this a season

  // --- the uncle's trail, 0..100
  trailGain: 20,
  trailWall1: 45,       // the trail leaves the fjord: nothing past this until you have travelled
  trailWall2: 75,       // people only tell a household man the rest: needs place >= trailPlace
  trailPlace: 30,
  uncleAt: 100,

  // --- travel: where nobody knows you
  travelPlace: 4,       // news of you
  renownTop: 150,       // renown abroad steepens far more slowly than the hall's ladder
  travelTrail: 6,       // every journey turns up something of him
  travelStrange: 2,     // nobody out there vouches for you
  awayStrange: 0.45,    // but what you do out there comes home as a story, this much of it

  // --- the dangerous way: a named risk the hero chooses, on the trail or a journey
  pressGain: 1.45,
  pressDanger: 0.05,    // in the last year it kills; before that it costs seasons
  hurtSeasons: 2,
};

// The player makes the hero (content/creation.yaml): sex, who they court, ONE occupation and TWO
// traits; and in the story, a kit of one hand's worth (GATE-A.md). Looks and manner are also
// chosen, and are not in this model: they change the prose more than the outcome (the author).
// 2 x 2 x 3 kits x 4 occupations x 28 trait pairs = 1,344 heroes.
export const SEXES = ['m', 'f'];
export const COURTS = ['women', 'men'];

export const KITS = {
  tools:    { skill0: 9, work: 0.4 },                        // arrive with a trade
  notebook: { trail: 5, know: 0.35, strange0: 4, openTrail: 1 }, // he wrote down where it leads and who to ask
  sack:     { place0: 12, gifts: 5, giftBond: 7 },           // arrive with something to give
};

// What the hero knows comes mostly from here. PLACEHOLDERS, like every number in this file.
export const OCCUPATIONS = {
  welder:   { skill0: 10, work: 0.5 },                       // hands: the nearest thing to a trade they have
  nurse:    { workKnow: 0.25, strangeMul: 0.88 },            // healing is a use people understand
  teacher:  { know: 0.3, strangeMul: 1.05, trail: 3 },       // knows what happened here, and says so
  engineer: { know: 0.2, work: 0.3 },                        // knows why it works; has never built it
};

// Other things a person can do. Each touches one corner of the model.
export const TRAITS = {
  rider:   { dangerMul: 0.6, travelPlace: 3, travelTrail: 8 }, // a journey is also a search
  charm:   { bond: 2.5 },                                     // people tell you things
  martial: { dangerMul: 0.5 },                                // the dangerous way is less so
  fencer:  { dangerMul: 0.7, place0: 5 },                     // carries himself like someone who has held one
  speaker: { know: 0.12, strangeMul: 0.93 },                  // explains it and is believed a little longer
  hunter:  { work: 0.6, trail: 1.5 },                         // earns his keep, and can follow a track
  sailor:  { travelPlace: 2.5, travelTrail: 5 },              // in a country that goes everywhere by water
  farm:    { skill0: 9, work: 0.3 },                          // already knows half of how they live
};
export const TRAIT_PAIRS = (() => {
  const k = Object.keys(TRAITS), out = [];
  for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) out.push(`${k[i]}+${k[j]}`);
  return out;
})();

// A woman's route is its own route (SPEC). In numbers, for this gate only: her
// place comes less from hired work and more from skill, and what she knows is
// read differently. PLACEHOLDERS, not history: to be checked and designed.
export const SEX = {
  m: { work: 1, skillPlace: 1, strangeMul: 1 },
  f: { work: 0.85, skillPlace: 1.6, strangeMul: 0.92 },
};

// Two people to court for each preference. Only Aud is written; the other
// three are placeholders with a different thing they answer to, so that
// "reachable" is tested against four different requirements.
//   likes: what adds to a season's courting; needs: what must be true to stand beside you.
export const LOVES = {
  women: [
    { id: 'aud',    likes: { skill: 0.07 },  needs: { place: 40 } },   // reads your hands; the hersir's sister
    { id: 'healer', likes: { truth: 4 },     needs: { told: 2 } },     // wants to know how you know, all of it
  ],
  men: [
    { id: 'shipwright', likes: { skill: 0.07 }, needs: { place: 40 } },
    { id: 'skald',      likes: { travelled: 5 }, needs: { travelled: 2 } },
  ],
};

// The ending is read from four things (SPEC). The fourth, which side of the
// door, is the player's and has no number.
export const GRADE = { uncle: 30, place: 30, placeFull: 80, partner: 30, truth: 10 };
