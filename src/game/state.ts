// Traveler's state: the engine's CoreState plus this game's own. Plain JSON; the engine clones it.
import type { CoreState } from '@engine/state';

export interface Ferry {
  /** pence taken at the landing this season */
  takings: number;
  /** 0 (leaking) to 3 (sound) */
  repair: number;
}

export interface GameState extends CoreState {
  /** the start this game began from (content/starts/) */
  start: string;
  /** who the hero would court, chosen at creation (content/creation.yaml): `courts == women` in content */
  courts: 'women' | 'men';
  ferry: Ferry;
}

export const HERO_ID = 'hero';
