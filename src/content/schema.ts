// Traveler's content schema: the engine's core schema plus this game's own. One Zod definition
// gives both the TypeScript types and the validation tools/build-content.ts runs on every YAML file.
//
// To add a game effect: its Zod object in GAME_EFFECTS, its handler in src/game/module.ts
// (effects), and its stakes there too (stakesOf) if the player should see it under a choice.
// To add a scene field of the game's own: the second argument of makeSceneSchemas.
import { z } from 'zod';
import { CORE_EFFECTS, CORE_REGISTRY, Id, makeSceneSchemas, wrapEffects, type CondInput, type CoreContent } from '@engine/schema';

export { ConfigSchema, Id } from '@engine/schema';
import { CondInputSchema } from '@engine/schema';
export { CondInputSchema };
export type { CondInput, Config } from '@engine/schema';

/** The game module id this content belongs to (src/game/module.ts registers it). */
export const GAME_ID = 'traveler';

// ---- Effects --------------------------------------------------------------
export const GAME_EFFECTS = [
  z.object({ take: z.enum(['bag', 'notebook', 'sack']) }).strict(), // the one hand's worth carried through the door (kit)
  z.object({ present: z.enum(['craft', 'open', 'explain']) }).strict(), // how a modern thing was presented (shown.<how>)
  z.object({ road: z.record(Id, z.string()) }).strict(), // which of three roads was taken at a named choice (road.<choice>; content/roads.yaml)
] as const;
const BaseEffectSchema = z.union([...CORE_EFFECTS, ...GAME_EFFECTS]);
export type BaseEffect = z.infer<typeof BaseEffectSchema>;
export type Effect = BaseEffect | { if: CondInput; then: Effect[]; else?: Effect[] } | { chance: number; then: Effect[]; else?: Effect[] };
export const EffectSchema: z.ZodType<Effect> = z.lazy(() => wrapEffects<Effect>(BaseEffectSchema, () => EffectSchema));

// ---- Scenes ---------------------------------------------------------------
export const { OutcomeSchema, ChoiceSchema, SceneSchema } = makeSceneSchemas(EffectSchema);
export type Outcome = z.infer<typeof OutcomeSchema>;
export type Choice = z.infer<typeof ChoiceSchema>;
export type Scene = z.infer<typeof SceneSchema>;

// ---- Registries -----------------------------------------------------------
export const RegistrySchema = z.object({ ...CORE_REGISTRY }).strict();
export type Registry = z.infer<typeof RegistrySchema>;

// ---- Starts: who you are when the game begins (content/starts/*.yaml) ----
const StatBlock = z.record(Id, z.number().int());
export const StartSchema = z.object({
  id: Id,
  label: z.string(),
  summary: z.string(),
  start_scene: Id,
  hero: z.object({ age: z.number().int(), station: Id, attributes: StatBlock, skills: StatBlock, coin: z.number().int() }).strict(),
}).strict();
export type Start = z.infer<typeof StartSchema>;

// ---- Character creation (content/creation.yaml; rules in src/game/creation.ts) ----
const TwoLabels = <A extends string, B extends string>(a: A, b: B) => z.object({ [a]: z.string(), [b]: z.string() } as Record<A | B, z.ZodString>).strict();
export const CreationSchema = z.object({
  title: z.string(),
  lede: z.string(),
  name: z.object({ prompt: z.string(), default: z.string().min(1), max: z.number().int().min(1) }).strict(),
  sex: z.object({ prompt: z.string(), options: TwoLabels('male', 'female'), owed: z.string() }).strict(),
  courts: z.object({ prompt: z.string(), note: z.string(), options: TwoLabels('women', 'men'), owed: z.string() }).strict(),
  // occupation, traits, looks, manner: each a list of ids from registry/traits.yaml and how many to pick
  groups: z.array(z.object({
    id: Id, prompt: z.string(), note: z.string().optional(), pick: z.number().int().min(1),
    options: z.array(Id).min(2), owed: z.string(), full: z.string().optional(),
  }).strict()).min(1),
  begin: z.string(),
  name_long: z.string(),
}).strict();
export type Creation = z.infer<typeof CreationSchema>;

// ---- Eras (content/eras.yaml): where and when each chapter happens, and which design the screen wears ----
export const ERA_IDS = ['now', 'norway', 'japan', 'rome'] as const;
export type EraId = (typeof ERA_IDS)[number];
const EraDef = z.object({ label: z.string(), where: z.string(), built: z.boolean() }).strict();
export const ErasSchema = z.object({
  eras: z.object({ now: EraDef, norway: EraDef, japan: EraDef, rome: EraDef }).strict(),
  chapters: z.record(z.string(), z.enum(ERA_IDS)),
  standing: z.object({ place: z.array(z.string()).min(2), talk: z.array(z.string()).min(2) }).strict(),
  kits: z.object({ bag: z.string(), notebook: z.string(), sack: z.string() }).strict(),
}).strict();
export interface Eras {
  eras: Record<EraId, { label: string; where: string; built: boolean }>;
  chapters: Record<string, EraId>;
  standing: { place: string[]; talk: string[] };
  kits: { bag: string; notebook: string; sack: string };
}

// ---- Clues (content/clues.yaml): things written, labelled or cut, drawn on the page ----
export const CLUE_KINDS = ['letter', 'note', 'tape', 'page', 'carving', 'wood', 'ash'] as const;
export const ClueSchema = z.object({
  kind: z.enum(CLUE_KINDS),
  title: z.string(),
  lines: z.array(z.string()).default([]),
  art: z.enum(['ship', 'rune']).optional(), // a drawing rather than words (src/ui/Clue.tsx)
  boxed: z.string().optional(),
  tally: z.number().int().min(1).max(40).optional(),
  mark: z.enum(['thumbprint']).optional(),
  found_in: Id,
  if: CondInputSchema.optional(),
}).strict();
export type Clue = z.infer<typeof ClueSchema>;
export const CluesSchema = z.record(Id, ClueSchema);
/** A paragraph that is nothing but this shows a clue: "::clue letter::". */
export const CLUE_MARK = /^::clue ([a-z][a-z0-9_]*)::$/;

// ---- The four years (content/season.yaml; rules in src/game/life.ts) ----
const ModsSchema = z.object({
  skill0: z.number(), place0: z.number(), strange0: z.number(), work: z.number(), workKnow: z.number(), know: z.number(),
  trail: z.number(), openTrail: z.number(), travelPlace: z.number(), travelTrail: z.number(), gifts: z.number(), giftBond: z.number(),
  bond: z.number(), need: z.number(), press: z.number(), readMul: z.number(), dangerMul: z.number(), strangeMul: z.number(),
}).partial().strict();
export type Mods = z.infer<typeof ModsSchema>;
const num = z.number();
const LoveSchema = z.object({
  npc: Id,
  likes: z.object({ skill: num, truth: num, travelled: num }).partial().strict(),
  needs: z.object({ place: num, told: num, travelled: num }).partial().strict(),
  costs: z.object({ above: num, talk: num }).partial().strict(),
  gives: z.object({ readMul: num, place: num, cover: num, work: num, travelPlace: num, travelTrail: num }).partial().strict(),
}).strict();
const RULE_KEYS = ['seasons', 'yearLength', 'nobodyBelow', 'workPlace', 'ladderTop', 'workSkill', 'idleGrace', 'idleCost', 'placeDrift',
  'trainSkill', 'trainPlace', 'trainCalms', 'needChance', 'needGain', 'needStrange', 'needIgnored', 'readNoise', 'bondTells',
  'strangeDecay', 'placeCalms', 'rumourChance', 'rumourAt', 'rumourMin', 'rumourMax', 'tolerance', 'placeShields', 'bondShields', 'exposeSpan',
  'castOutPlace', 'castOutStrange', 'castOutBond', 'castOutSeasons', 'courtBond', 'courtPlace', 'bondCapSilent', 'partnerAt',
  'truthStrangeAt', 'truthStrange', 'bondFade', 'supportAt', 'trailGain', 'trailWall1', 'trailWall2', 'trailPlace', 'uncleAt',
  'travelPlace', 'renownTop', 'travelTrail', 'travelStrange', 'awayStrange', 'pressGain', 'pressDanger', 'hurtSeasons'] as const;
export const SeasonSchema = z.object({
  rules: z.object({
    ...Object.fromEntries(RULE_KEYS.map((k) => [k, num])) as Record<(typeof RULE_KEYS)[number], typeof num>,
    knowGain: z.array(num).length(4), knowStrange: z.array(num).length(4), skillCovers: z.array(num).length(4), truthBond: z.array(num).length(3),
  }).strict(),
  kits: z.record(Id, ModsSchema), occupations: z.record(Id, ModsSchema), traits: z.record(Id, ModsSchema),
  sex: z.object({ male: z.object({ work: num, skillPlace: num, strangeMul: num }).strict(), female: z.object({ work: num, skillPlace: num, strangeMul: num }).strict() }).strict(),
  loves: z.object({ women: z.array(LoveSchema).length(2), men: z.array(LoveSchema).length(2) }).strict(),
  grade: z.object({ uncle: num, place: num, placeFull: num, partner: num, truth: num }).strict(),
  // what the visit carries into the four years (src/game/years.ts): placeholders, like the rest
  carry: z.object({ placePer: num, talkPer: num, dayBond: num }).strict(),
  // the season screen's words (src/ui/Years.tsx). {npc} is the person's name.
  screen: z.object({
    title: z.string(), note: z.string(), begin: z.string(), for: z.string(), how: z.string(), need: z.string(), press: z.string(), go: z.string(), back: z.string(),
    focus: z.object({ work: z.string(), train: z.string(), court: z.string(), trail: z.string(), travel: z.string() }).strict(),
    present: z.array(z.string()).length(3), tell: z.array(z.string()).length(3),
    years: z.array(z.string()).length(4),
    room: z.array(z.tuple([num, z.string()])).min(2),
    bond: z.array(z.tuple([num, z.string()])).min(2), told: z.array(z.string()).length(3),
    trail: z.array(z.tuple([num, z.string()])).min(2), trailOut: z.string(),
    door: z.array(z.tuple([num, z.string()])).min(2),
    happened: z.object({ lost: z.string(), castOut: z.string(), hurt: z.string(), walled: z.string(), needLeft: z.string(), needMet: z.string() }).strict(),
    ending: z.object({ door: z.string(), exposed: z.string(), dead: z.string() }).strict(),
  }).strict(),
}).strict();
export type Season = z.infer<typeof SeasonSchema>;

/** content/decks.yaml: authored lines that are drawn, by deck. Each is used once in a playthrough (src/game/deck.ts). */
export const DecksSchema = z.record(Id, z.record(Id, z.string()));

/** content/roads.yaml: each remembered choice and its three roads. */
export const RoadsSchema = z.record(Id, z.array(z.string()).length(3));

export interface ContentBundle extends CoreContent {
  season: Season;
  decks: Record<string, Record<string, string>>;
  roads: Record<string, string[]>;
  creation: Creation;
  clues: Record<string, Clue>;
  eras: Eras;
  registry: Registry;
  scenes: Record<string, Scene>;
  starts: Record<string, Start>;
}
