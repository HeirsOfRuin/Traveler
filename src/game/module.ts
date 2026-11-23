// Traveler's game module: the rules the engine leaves to the game. Registered on import; every
// entry point that loads content imports it (src/game/index.ts, tools/content-loader.ts).
// The hooks are listed in packages/engine/src/game.ts; only id, namespaces, getValue, checkPath
// and effects are required. This one owns two paths (ferry.*, start), two effects (toll, mend),
// one text variable ({takings}) and the scene variant key (the start).
import { registerGame, STAKES_RANK, type GameModule } from '@engine/game';
import type { CoreContent } from '@engine/schema';
import type { CoreState } from '@engine/state';
import { formatCoin } from '@engine/format';
import { GAME_ID, type ContentBundle } from '../content/schema';
import type { GameState } from './state';

const st = (s: CoreState) => s as GameState;
const ct = (c: CoreContent) => c as ContentBundle;
const FERRY = ['takings', 'repair'];
const ONE = ['occupation', 'looks', 'manner'];

export const module: GameModule = {
  id: GAME_ID,
  // occupation, looks, manner: the creation groups that pick one (content/creation.yaml): occupation == nurse
  namespaces: ['ferry', 'start', 'courts', 'occupation', 'looks', 'manner'],
  getValue(s, _c, path) {
    const [ns, field] = path.split('.');
    if (ns === 'start') return st(s).start;
    if (ns === 'courts') return st(s).courts;
    if (ONE.includes(ns!)) return st(s).picks[ns!]?.[0] ?? '';
    return st(s).ferry[field as 'takings' | 'repair'];
  },
  checkPath(c, path) {
    const [ns, field] = path.split('.');
    if (ns === 'start') return field === undefined ? null : `"start" has no fields (start == <id>)`;
    if (ns === 'courts') return field === undefined ? null : `"courts" has no fields (courts == women, courts == men)`;
    if (ONE.includes(ns!)) return field !== undefined ? `"${ns}" has no fields (${ns} == <id>)` : ct(c).creation.groups.some((g) => g.id === ns && g.pick === 1) ? null : `creation.yaml has no pick-one group "${ns}"`;
    return FERRY.includes(field ?? '') ? null : `unknown ferry field in "${path}" (${FERRY.join(', ')})`;
  },
  labelFor: (_c, path) => ({ 'ferry.repair': 'The boat', 'ferry.takings': 'Takings' })[path],
  // start == heir compares with the starts' ids
  namedValues: (c, path) => (path === 'start' ? Object.keys(ct(c).starts) : path === 'courts' ? ['women', 'men'] : ONE.includes(path) ? ct(c).creation.groups.find((g) => g.id === path)?.options : undefined),
  addNumber(s, _c, path, delta, changes) {
    const f = st(s).ferry;
    if (path === 'ferry.repair') { f.repair = Math.max(0, Math.min(3, f.repair + delta)); changes.push(`The boat: ${delta > 0 ? 'sounder' : 'worse'}`); }
    if (path === 'ferry.takings') { f.takings += delta; changes.push(`Takings: ${formatCoin(f.takings)}`); }
  },
  effects: {
    toll(s, _c, e, ctx) {
      const n = (e as { toll: number }).toll;
      st(s).ferry.takings += n;
      s.res.coin = (s.res.coin ?? 0) + n;
      ctx.changes.push(`+${formatCoin(n)} at the landing`);
    },
    mend(s, _c, e, ctx) {
      const f = st(s).ferry;
      f.repair = Math.min(3, f.repair + (e as { mend: number }).mend);
      ctx.changes.push('The boat: sounder');
    },
  },
  stakesOf(_c, _s, e, put) {
    if ('toll' in e) put('coin', 'Coin', STAKES_RANK.coin, 1);
    if ('mend' in e) put('boat', 'The boat', STAKES_RANK.other, 1);
  },
  textVar(name, s) {
    if (name === 'takings') return formatCoin(st(s).ferry.takings);
    return undefined;
  },
  checkTextVar: (name) => (name === 'takings' ? [] : undefined),
  variantKey: (s) => st(s).start,
  startScene: (s, c) => ct(c).starts[st(s).start]?.start_scene,
};

registerGame(module);
