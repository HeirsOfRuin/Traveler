// Nothing authored is shown twice in one playthrough (SPEC). Every authored line that is drawn
// rather than placed (a season's report, a pool event) has an id in a named deck; once used it is
// spent, and the spent list lives in the save, so a reload cannot bring it back. A dry deck gives
// nothing, and the screen leaves the prose out: a deck running dry is a content shortfall, never a
// repeat. Ported from Divine Mismanagement's src/engine/deck.js and content.js. Pure.
import type { Stream } from './streams';

export type Spent = Record<string, string[]>;

export const unspent = (spent: Spent, deck: string, ids: string[]): string[] => {
  const used = spent[deck];
  return used ? ids.filter((id) => !used.includes(id)) : ids;
};

export const isSpent = (spent: Spent, deck: string, id: string): boolean => Boolean(spent[deck]?.includes(id));

export function spend(spent: Spent, deck: string, id: string): Spent {
  if (isSpent(spent, deck, id)) throw new Error(`Deck "${deck}": "${id}" was already used in this playthrough`);
  return { ...spent, [deck]: [...(spent[deck] ?? []), id] };
}

/** Draw one unspent id and spend it. null when the deck is dry. */
export function draw(spent: Spent, deck: string, ids: string[], rng: Stream): { spent: Spent; id: string | null } {
  const left = unspent(spent, deck, ids);
  if (!left.length) return { spent, id: null };
  const id = left[Math.min(left.length - 1, Math.floor(rng.float(0, left.length)))]!;
  return { spent: spend(spent, deck, id), id };
}
