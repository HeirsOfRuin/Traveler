// The four years inside a game: starting a life once the visit is over, and playing a season.
// The rules are src/game/life.ts; this file joins them to the save, the hero and the deck.
import type { ContentBundle } from '../content/schema';
import type { GameState } from './state';
import { heroOf } from '@engine/character';
import { newLife, step, lovesOf, type Life, type SeasonInput, type Focus } from './life';
import { streamFor } from './streams';
import { draw } from './deck';

/** The life can begin when the visit has ended at the door. */
export const canBegin = (content: ContentBundle, s: GameState) => !!s.ended && !s.life && s.kit !== '' && !!content.season;

/** Start the four years in the era just visited, carrying what the visit left (season.yaml carry). */
export function beginLife(content: ContentBundle, s: GameState): GameState {
  if (!canBegin(content, s)) throw new Error('the four years begin after the visit, at the door');
  const S = content.season, C = S.carry, h = heroOf(s);
  const day = s.roads.day === 'boat' ? 'finn' : s.roads.day === 'bench' ? 'hild' : '';
  const bond = lovesOf(S, { courts: s.courts }).map((L) => (L.npc === day ? C.dayBond : 0)) as [number, number];
  const life: Life = newLife(content, {
    seed: s.seed, sex: h.sex, courts: s.courts, kit: s.kit, job: s.picks.occupation![0]!, traits: [...s.picks.traits!],
  }, { place: C.placePer * (s.counters.place ?? 0), strange: C.talkPer * (s.counters.talk ?? 0), bond });
  return { ...structuredClone(s), life };
}

/** One season of the life, and the line drawn for it if any is written (content/decks.yaml). */
export function seasonTurn(content: ContentBundle, s: GameState, input: SeasonInput): GameState {
  if (!s.life) throw new Error('no life has begun');
  const next = structuredClone(s);
  const life = step(content, s.life, input);
  const deck = `season_${input.focus as Focus}`;
  const ids = Object.keys(content.decks[deck] ?? {});
  const d = draw(next.spent ?? {}, deck, ids, streamFor(s.seed, s.life.season, 'deck'));
  next.spent = d.spent;
  life.log[life.log.length - 1]!.line = d.id ? content.decks[deck]![d.id]! : null;
  next.life = life;
  return next;
}

/** First entry of a [threshold, words] list whose threshold the value meets. */
export const words = (list: [number, string][], v: number): string => (list.find(([at]) => v >= at) ?? list[list.length - 1]!)[1];
