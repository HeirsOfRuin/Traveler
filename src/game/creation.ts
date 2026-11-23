// Character creation: the one place that says what a valid hero is. The screen, newGame, the
// bot and the tests all ask this file, so what the screen allows and what the game accepts
// cannot drift apart (game-building rule 1). Words and groups are in content/creation.yaml.
import type { ContentBundle } from '../content/schema';
import type { Sex } from '@engine/state';

export type Courts = 'women' | 'men';
export const SEXES: readonly Sex[] = ['male', 'female'];
export const COURTS: readonly Courts[] = ['women', 'men'];

/** group id -> the option ids picked in it (occupation, traits, looks, manner). */
export type Picks = Record<string, string[]>;
/** What the player has filled in so far. Nothing is chosen for them. */
export interface HeroDraft { name: string; sex?: Sex; courts?: Courts; picks: Picks }
/** A finished hero, as newGame takes it. */
export interface HeroChoice { name: string; sex: Sex; courts: Courts; picks: Picks }

export const emptyDraft = (): HeroDraft => ({ name: '', picks: {} });
const of = (d: { picks: Picks }, group: string) => d.picks[group] ?? [];

/** Why this draft cannot begin yet, in the words the screen shows. Empty means it can. */
export function problems(content: ContentBundle, d: HeroDraft): string[] {
  const c = content.creation, out: string[] = [];
  if (d.name.trim().length > c.name.max) out.push(c.name_long);
  if (!d.sex || !SEXES.includes(d.sex)) out.push(c.sex.owed);
  if (!d.courts || !COURTS.includes(d.courts)) out.push(c.courts.owed);
  for (const g of c.groups) {
    const got = of(d, g.id);
    const unknown = got.filter((t) => !g.options.includes(t));
    if (unknown.length) out.push(`Unknown: ${unknown.join(', ')}.`);
    if (new Set(got).size !== got.length) out.push('The same thing twice.');
    if (got.length > g.pick) out.push(g.full ?? `Only ${g.pick}.`);
    if (got.length < g.pick) out.push(g.owed.replace('{n}', String(g.pick - got.length)));
  }
  const stray = Object.keys(d.picks).filter((k) => !c.groups.some((g) => g.id === k));
  if (stray.length) out.push(`Unknown: ${stray.join(', ')}.`);
  return out;
}

/**
 * Tap an option. In a group that picks one, it replaces what was there. In a group that picks
 * more, it goes off if it is on, on if there is room, and is refused with the reason if not.
 */
export function tap(content: ContentBundle, d: HeroDraft, group: string, id: string): { draft: HeroDraft; refused?: string } {
  const g = content.creation.groups.find((x) => x.id === group);
  if (!g || !g.options.includes(id)) return { draft: d, refused: `Unknown: ${id}.` };
  const got = of(d, group);
  const put = (next: string[]) => ({ draft: { ...d, picks: { ...d.picks, [group]: next } } });
  if (g.pick === 1) return put([id]);
  if (got.includes(id)) return put(got.filter((t) => t !== id));
  if (got.length >= g.pick) return { draft: d, refused: g.full ?? `Only ${g.pick}.` };
  return put([...got, id]);
}

/** The finished hero, or a thrown list of what is missing. Picks are stored in the screen's order, not the tap order. */
export function finish(content: ContentBundle, d: HeroDraft): HeroChoice {
  const bad = problems(content, d);
  if (bad.length) throw new Error(`not a hero yet: ${bad.join(' ')}`);
  const picks: Picks = {};
  for (const g of content.creation.groups) picks[g.id] = [...of(d, g.id)].sort((a, b) => g.options.indexOf(a) - g.options.indexOf(b));
  return { name: d.name.trim() || content.creation.name.default, sex: d.sex!, courts: d.courts!, picks };
}

/** Every pick as one list, in the screen's order: what the engine stores as the hero's traits (trait.<id>). */
export const allPicks = (content: ContentBundle, h: { picks: Picks }): string[] =>
  content.creation.groups.flatMap((g) => g.options.filter((o) => of(h, g.id).includes(o)));

/** Who was made, as the screen and the You page show it: "Ingrid · A woman · A nurse · Rode as a child · Hunts · Tall · Blunt · It would be a man". */
export function describe(content: ContentBundle, h: { name: string; sex?: Sex; courts?: Courts; picks: Picks }): string {
  const c = content.creation;
  const labels = allPicks(content, h).map((t) => content.registry.traits[t]?.label ?? t);
  return [h.name.trim() || c.name.default, h.sex ? c.sex.options[h.sex] : '', ...labels, h.courts ? c.courts.options[h.courts] : ''].filter(Boolean).join(' · ');
}

// ---- every hero the screen can make (name aside), without building the whole list
const combos = (options: string[], pick: number): string[][] => {
  const out: string[][] = [];
  const grow = (from: number, acc: string[]) => {
    if (acc.length === pick) { out.push(acc); return; }
    for (let i = from; i < options.length; i++) grow(i + 1, [...acc, options[i]!]);
  };
  grow(0, []);
  return out;
};
const axes = (content: ContentBundle) => content.creation.groups.map((g) => ({ id: g.id, sets: combos(g.options, g.pick) }));

/** How many different heroes there are: sexes x preferences x every group's ways of picking. */
export const heroCount = (content: ContentBundle): number => axes(content).reduce((n, a) => n * a.sets.length, SEXES.length * COURTS.length);

/** The i-th hero of heroCount, in a fixed order. For the bot, the text tools and the tests. */
export function heroAt(content: ContentBundle, i: number): HeroChoice {
  let k = ((i % heroCount(content)) + heroCount(content)) % heroCount(content);
  const sex = SEXES[k % SEXES.length]!; k = Math.floor(k / SEXES.length);
  const courts = COURTS[k % COURTS.length]!; k = Math.floor(k / COURTS.length);
  const picks: Picks = {};
  for (const a of axes(content)) { picks[a.id] = a.sets[k % a.sets.length]!; k = Math.floor(k / a.sets.length); }
  return { name: content.creation.name.default, sex, courts, picks };
}
/**
 * n heroes spread across all of them, so a short batch still meets every option: a stride that
 * shares no factor with the count visits a different hero each time.
 */
export function spreadHeroes(content: ContentBundle, n: number): HeroChoice[] {
  const total = heroCount(content);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  let stride = Math.max(1, Math.floor(total * 0.618));
  while (gcd(stride, total) !== 1) stride++;
  return Array.from({ length: n }, (_, i) => heroAt(content, i * stride));
}
