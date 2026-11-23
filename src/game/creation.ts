// Character creation: the one place that says what a valid hero is. The screen, newGame, the
// bot and the tests all ask this file, so what the screen allows and what the game accepts
// cannot drift apart (game-building rule 1). Words are in content/creation.yaml.
import type { ContentBundle } from '../content/schema';
import type { Sex } from '@engine/state';

export type Courts = 'women' | 'men';
export const SEXES: readonly Sex[] = ['male', 'female'];
export const COURTS: readonly Courts[] = ['women', 'men'];

/** What the player has filled in so far. Nothing is chosen for them. */
export interface HeroDraft { name: string; sex?: Sex; courts?: Courts; traits: string[] }
/** A finished hero, as newGame takes it. */
export interface HeroChoice { name: string; sex: Sex; courts: Courts; traits: string[] }

export const emptyDraft = (): HeroDraft => ({ name: '', traits: [] });

/** Why this draft cannot begin yet, in the words the screen shows. Empty means it can. */
export function problems(content: ContentBundle, d: HeroDraft): string[] {
  const c = content.creation, out: string[] = [];
  if (d.name.trim().length > c.name.max) out.push(c.missing.name_long);
  if (!d.sex || !SEXES.includes(d.sex)) out.push(c.missing.sex);
  if (!d.courts || !COURTS.includes(d.courts)) out.push(c.missing.courts);
  const picked = [...new Set(d.traits)];
  const unknown = d.traits.filter((t) => !c.traits.options.includes(t));
  if (unknown.length) out.push(`Unknown: ${unknown.join(', ')}.`);
  if (picked.length !== d.traits.length) out.push('The same thing twice.');
  if (picked.length > c.traits.pick) out.push(c.traits.full);
  if (picked.length < c.traits.pick) out.push(c.missing.traits_few.replace('{n}', String(c.traits.pick - picked.length)));
  return out;
}

/** Tap a trait: off if it is on, on if there is room. Returns the draft and, when refused, why. */
export function toggleTrait(content: ContentBundle, d: HeroDraft, id: string): { draft: HeroDraft; refused?: string } {
  if (d.traits.includes(id)) return { draft: { ...d, traits: d.traits.filter((t) => t !== id) } };
  if (d.traits.length >= content.creation.traits.pick) return { draft: d, refused: content.creation.traits.full };
  return { draft: { ...d, traits: [...d.traits, id] } };
}

/** The finished hero, or a thrown list of what is missing. Traits are stored in the screen's order, not the tap order. */
export function finish(content: ContentBundle, d: HeroDraft): HeroChoice {
  const bad = problems(content, d);
  if (bad.length) throw new Error(`not a hero yet: ${bad.join(' ')}`);
  const order = content.creation.traits.options;
  return { name: d.name.trim() || content.creation.name.default, sex: d.sex!, courts: d.courts!, traits: [...d.traits].sort((a, b) => order.indexOf(a) - order.indexOf(b)) };
}

/** Who was made, as the screen and the You page show it: "Ingrid · A woman · A nurse · Rode as a child · It would be a man". */
export function describe(content: ContentBundle, h: { name: string; sex?: Sex; courts?: Courts; traits: string[] }): string {
  const c = content.creation;
  const order = c.traits.options;
  const traits = [...h.traits].sort((x, y) => order.indexOf(x) - order.indexOf(y)).map((t) => content.registry.traits[t]?.label ?? t);
  return [h.name.trim() || c.name.default, h.sex ? c.sex.options[h.sex] : '', ...traits, h.courts ? c.courts.options[h.courts] : ''].filter(Boolean).join(' · ');
}

/** Every hero the screen can make (name aside): sexes x preferences x trait sets. For the bot and the tests. */
export function everyHero(content: ContentBundle): HeroChoice[] {
  const { options, pick } = content.creation.traits, sets: string[][] = [];
  const grow = (from: number, acc: string[]) => {
    if (acc.length === pick) { sets.push(acc); return; }
    for (let i = from; i < options.length; i++) grow(i + 1, [...acc, options[i]!]);
  };
  grow(0, []);
  return SEXES.flatMap((sex) => COURTS.flatMap((courts) => sets.map((traits) => ({ name: content.creation.name.default, sex, courts, traits }))));
}
