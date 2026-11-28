// Named random streams for the four years: a draw is fixed by (seed, season, label), so a reload
// cannot re-roll a season and one system's draws never shift another's. A port of game-scaffold's
// rng.js (FNV-1a and mulberry32), number for number: the Gate B model used the original, and
// sim/equivalence.ts proves this port plays the same lives.
const UINT32 = 4294967296;

export function hashString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

export interface Stream { chance(p: number): boolean; float(lo: number, hi: number): number; normal(mean?: number, sd?: number): number }

export function makeStream(seed: number): Stream {
  let state = (seed >>> 0) || 1;
  const raw = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / UINT32;
  };
  return {
    chance: (p) => raw() < p,
    float: (lo, hi) => lo + raw() * (hi - lo),
    normal(mean = 0, sd = 1) {
      const u = Math.max(raw(), Number.EPSILON);
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * raw());
      return mean + sd * Math.max(-3, Math.min(3, z));
    },
  };
}

export const streamFor = (seed: number, period: number, label: string): Stream => makeStream(hashString(`${seed >>> 0}|${period}|${label}`));
