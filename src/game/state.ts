// Traveler's state: the engine's CoreState plus this game's own. Plain JSON; the engine clones it.
import type { CoreState } from '@engine/state';

/** How a modern thing was presented (docs/DESIGN.md section 4): the game's standing decision. */
export type Presentation = 'craft' | 'open' | 'explain';
export const PRESENTATIONS: readonly Presentation[] = ['craft', 'open', 'explain'];
/** The one hand's worth carried through the door: the story's first choice. '' until it is made. */
export type Kit = '' | 'bag' | 'notebook' | 'sack';
export const KITS: readonly Kit[] = ['bag', 'notebook', 'sack'];

export interface GameState extends CoreState {
  /** the start this game began from (content/starts/) */
  start: string;
  /** who the hero would court, chosen at creation (content/creation.yaml): `courts == women` in content */
  courts: 'women' | 'men';
  /** what was picked in each creation group (occupation, traits, looks, manner); the hero's traits are these, flattened */
  picks: Record<string, string[]>;
  /** what was carried through the door: `kit == bag` in content */
  kit: Kit;
  /** how many times each presentation has been used: `shown.explain >= 1` in content */
  shown: Record<Presentation, number>;
  /** which road was taken at each remembered choice (content/roads.yaml): `road.day == boat` in content */
  roads: Record<string, string>;
}

export const HERO_ID = 'hero';
