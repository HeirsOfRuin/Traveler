// Traveler's facade: a new game from a start, and the engine's view and choose for its state.
// Importing this registers the game module.
import './module';
import type { ContentBundle } from '../content/schema';
import { HERO_ID, type GameState } from './state';
import { RngCursor, seedRng } from '@engine/rng';
import { newNpcState } from '@engine/effects';
import { enterScene } from '@engine/director';
import { bornAtAge } from '@engine/character';
import { EngineError } from '@engine/index';
import type { Character } from '@engine/state';
import { finish, allPicks, type HeroChoice } from './creation';

export { EngineError, view, choose, visibleChoices, isAvailable } from '@engine/index';
export type { ChoiceView, SceneView, ChooseResult } from '@engine/index';
export { describeDate } from '@engine/calendar';
export { heroOf } from '@engine/character';
export type { GameState, Kit, Presentation } from './state';
export { eraOf, standing } from './module';
export { canBegin, beginLife, seasonTurn, words } from './years';
export { FOCI, lovesOf, partnerOf, lastYear, type Life, type SeasonInput, type Focus, type Know } from './life';
import { found as foundIn } from './module';
import { test as holds } from '@engine/conditions';
import type { GameState as GS } from './state';
/** The clues this hero has met so far (content/clues.yaml), in the order found. */
export const cluesFound = (content: ContentBundle, s: GS): string[] => foundIn(content, s, (c) => holds(c as never, s, content));

export { problems, tap, finish, describe, allPicks, heroCount, heroAt, spreadHeroes, emptyDraft, SEXES, COURTS } from './creation';
export type { HeroDraft, HeroChoice, Courts, Picks } from './creation';

/** A new game needs a finished hero: build one with finish() from ./creation, which is what the screen does. */
export interface NewGameOptions { start: string; seed: number; hero: HeroChoice }

export function newGame(content: ContentBundle, opts: NewGameOptions): GameState {
  const st = content.starts[opts.start];
  if (!st) throw new EngineError(`unknown start ${opts.start}`);
  const scene = content.scenes[st.start_scene];
  if (!scene) throw new EngineError(`start ${st.id}: unknown scene ${st.start_scene}`);
  const made = finish(content, opts.hero); // refuses a hero the screen could not have made
  const rng = new RngCursor(seedRng(opts.seed));
  const hero: Character = {
    name: made.name,
    sex: made.sex,
    born: bornAtAge(st.hero.age),
    alive: true,
    attributes: Object.fromEntries(content.config.attributes.map((a) => [a, st.hero.attributes[a] ?? 2])),
    skills: Object.fromEntries(content.config.skills.map((k) => [k, st.hero.skills[k] ?? 0])),
    health: 8,
    traits: allPicks(content, made),
    injuries: [],
    items: [],
    station: st.hero.station,
  };
  const state: GameState = {
    version: 1,
    contentHash: content.hash,
    seed: opts.seed,
    rng: rng.state,
    characters: { [HERO_ID]: hero },
    hero: HERO_ID,
    start: st.id,
    courts: made.courts,
    picks: made.picks,
    kit: '',
    shown: { craft: 0, open: 0, explain: 0 },
    roads: {},
    spent: {},
    chapter: scene.chapter,
    scene: scene.id,
    returnStack: [],
    time: 0,
    rep: Object.fromEntries(Object.keys(content.registry.factions).map((id) => [id, 0])),
    res: { coin: st.hero.coin },
    favors: {},
    flags: {},
    counters: {},
    npcs: Object.fromEntries(Object.keys(content.registry.npcs).map((id) => [id, newNpcState(content, id)])),
    aliases: {},
    queue: [],
    seen: {},
    journal: [],
  };
  enterScene(state, content, scene, [], rng);
  state.rng = rng.state;
  return state;
}

/** Every start a game can begin from. */
export const startsOf = (content: ContentBundle) => Object.keys(content.starts);
