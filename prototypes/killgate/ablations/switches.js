// Does each rule matter, and is any switch decoration?
//   npm run gate:switches
export default {
  runs: 1, by: ['policy'], pool: ['sex', 'courts', 'kit', 'job', 'traits'],   // 1,344 heroes a policy
  base: {},
  variants: {
    noKnow: { noKnow: true },         // what you know can never be used
    noTruth: { noTruth: true },       // the truth can never be told
    noNeeds: { noNeeds: true },       // no season ever brings a need
    clearSight: { clearSight: true }, // the hero reads the hall's room exactly
    noPress: { noPress: true },       // the dangerous way cannot be taken
    hardLoss: { hardLoss: true },     // exposure is final in any year
    sexless: { sexless: true },       // a woman's route is the man's
  },
  metrics: ['grade', 'named', 'partner', 'uncle', 'exposed', 'castOut', 'dead'],
};
