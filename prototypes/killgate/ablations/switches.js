// Does each rule matter, and is any switch decoration?
//   node prototypes/killgate/ablate.js prototypes/killgate/ablations/switches.js --adapter=prototypes/killgate/adapter.js --inert
export default {
  runs: 25, by: ['policy'], pool: ['sex', 'courts', 'kit', 'traits'],
  base: {},
  variants: {
    noKnow: { noKnow: true },         // what you know can never be used
    noTruth: { noTruth: true },       // the truth can never be told
    forgetful: { forgetful: true },   // nothing you showed is remembered
    hardLoss: { hardLoss: true },     // exposure is final in any year
    sexless: { sexless: true },       // a woman's route is the man's
  },
  metrics: ['grade', 'named', 'partner', 'uncle', 'exposed', 'castOut'],
};
