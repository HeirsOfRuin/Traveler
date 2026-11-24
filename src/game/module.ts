// Traveler's game module: the rules the engine leaves to the game. Registered on import; every
// entry point that loads content imports it (src/game/index.ts, tools/content-loader.ts).
//
// Paths this game owns (docs/DESIGN.md section 4):
//   courts == women | men                 who the hero would court (creation)
//   occupation, looks, manner == <id>     the creation groups that pick one
//   kit == bag | notebook | sack          what was carried through the door
//   shown.craft | open | explain >= n     how often each presentation has been used
//   era == now | norway | japan | rome    where the current chapter happens (content/eras.yaml)
//   road.<choice> == <road>               which of three roads was taken at a remembered choice (content/roads.yaml)
// Effects: take (the kit), present (a presentation). The date line is the era's, not a reign's.
import { registerGame, STAKES_RANK, type GameModule } from '@engine/game';
import type { CoreContent } from '@engine/schema';
import type { CoreState } from '@engine/state';
import { GAME_ID, type ContentBundle, type EraId } from '../content/schema';
import { KITS, PRESENTATIONS, type GameState, type Kit, type Presentation } from './state';

const st = (s: CoreState) => s as GameState;
const ct = (c: CoreContent) => c as ContentBundle;
const ONE = ['occupation', 'looks', 'manner'];

/** The era a state is in: the design the screen wears and the line at the top of it. */
export const eraOf = (content: ContentBundle, s: { chapter: string }): EraId => content.eras.chapters[s.chapter] ?? 'now';

/**
 * The hero's standing in words, for the You page: never a number (docs/DESIGN.md section 4).
 * The same counters the choices move, read through the lists in content/eras.yaml.
 */
export function standing(content: ContentBundle, s: GameState): { place: string; talk: string } {
  const at = (list: string[], n: number) => list[Math.max(0, Math.min(list.length - 1, n))]!;
  return { place: at(content.eras.standing.place, s.counters.place ?? 0), talk: at(content.eras.standing.talk, s.counters.talk ?? 0) };
}

/** The clues this hero has met so far, in the order found: for the Journal. */
export function found(content: ContentBundle, s: GameState, holds: (cond: unknown) => boolean): string[] {
  const been = new Set([...s.journal.map((j) => j.scene), s.scene]);
  return Object.entries(content.clues).filter(([, c]) => been.has(c.found_in) && (c.if === undefined || holds(c.if))).map(([id]) => id);
}

export const module: GameModule = {
  id: GAME_ID,
  namespaces: ['start', 'courts', 'occupation', 'looks', 'manner', 'kit', 'shown', 'era', 'road'],
  getValue(s, c, path) {
    const [ns, field] = path.split('.');
    if (ns === 'start') return st(s).start;
    if (ns === 'courts') return st(s).courts;
    if (ns === 'kit') return st(s).kit;
    if (ns === 'era') return eraOf(ct(c), s);
    if (ns === 'shown') return st(s).shown[field as Presentation] ?? 0;
    if (ns === 'road') return st(s).roads[field!] ?? '';
    return st(s).picks[ns!]?.[0] ?? '';
  },
  checkPath(c, path) {
    const [ns, field] = path.split('.');
    if (ns === 'shown') return PRESENTATIONS.includes(field as Presentation) ? null : `unknown presentation in "${path}" (${PRESENTATIONS.join(', ')})`;
    if (ns === 'road') return field && ct(c).roads[field] ? null : `unknown road in "${path}" (${Object.keys(ct(c).roads).join(', ')})`;
    if (field !== undefined) return `"${ns}" has no fields (${ns} == <id>)`;
    if (ONE.includes(ns!) && !ct(c).creation.groups.some((g) => g.id === ns && g.pick === 1)) return `creation.yaml has no pick-one group "${ns}"`;
    return null;
  },
  namedValues: (c, path) => (
    path === 'start' ? Object.keys(ct(c).starts)
      : path === 'courts' ? ['women', 'men']
        : path === 'kit' ? [...KITS]
          : path === 'era' ? Object.keys(ct(c).eras.eras)
            : path.startsWith('road.') ? ct(c).roads[path.slice(5)]
            : ONE.includes(path) ? ct(c).creation.groups.find((g) => g.id === path)?.options : undefined),
  effects: {
    take(s, c, e) { st(s).kit = (e as { take: Kit }).take; void c; },
    present(s, _c, e) { st(s).shown[(e as { present: Presentation }).present] += 1; },
    road(s, _c, e) { Object.assign(st(s).roads, (e as { road: Record<string, string> }).road); },
  },
  // What a choice puts at stake is shown under it. A presentation is named as itself; the kit is not
  // a stake (it is the choice).
  stakesOf(_c, _s, e, put) {
    if ('present' in e) put('shown', 'How it looks', STAKES_RANK.rep, 1);
  },
  date: (s, c) => ct(c).eras.eras[eraOf(ct(c), s)].label,
  startScene: (s, c) => ct(c).starts[st(s).start]?.start_scene,
};

registerGame(module);
