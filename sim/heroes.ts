// Every hero the four years can tell apart, and playing one life to its end with a policy.
// Looks and manner are left out: by the author's rule they change prose, never a number.
import type { ContentBundle } from '../src/content/schema';
import { SEXES, COURTS } from '../src/game/creation';
import { newLife, step, type Life, type Off, type SeasonInput } from '../src/game/life';
import { POLICIES } from './policies';

export interface Who { sex: 'male' | 'female'; courts: 'women' | 'men'; kit: string; job: string; traits: string[] }

export function heroes(content: ContentBundle): Who[] {
  const g = Object.fromEntries(content.creation.groups.map((x) => [x.id, x.options]));
  const t = g.traits!, pairs: string[][] = [];
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) pairs.push([t[i]!, t[j]!]);
  const out: Who[] = [];
  for (const sex of SEXES) for (const courts of COURTS) for (const kit of ['bag', 'notebook', 'sack']) for (const job of g.occupation!) for (const traits of pairs) out.push({ sex: sex as Who['sex'], courts, kit, job, traits });
  return out;
}
/** The seed for hero h, run i: the same formula as the Gate B model, so the two can be compared. */
export const seedOf = (h: number, i: number) => 1 + h * 100003 + i * 7919;

/**
 * What the season screen lets a player do (src/ui/Years.tsx): work, the trail and a journey are
 * always done with what you know, as a craft at least. The Gate B policies could also choose
 * nothing; the game cannot, so the gate measures the game with that taken away. asModel keeps the
 * policies exactly as the model had them, for sim/equivalence.ts.
 */
export function asScreen(input: SeasonInput): SeasonInput {
  return (input.focus === 'work' || input.focus === 'trail' || input.focus === 'travel') && input.know === 0 ? { ...input, know: 1 } : input;
}

export function live(content: ContentBundle, who: Who, seed: number, policy: string, off?: Off[], seasons?: number, asModel = false): Life {
  const c = seasons === undefined ? content : { ...content, season: { ...content.season, rules: { ...content.season.rules, seasons } } };
  let l = newLife(c, { seed, ...who, off });
  const rule = POLICIES[policy]!.rule;
  for (let n = 0; !l.ending; n++) {
    if (n > 200) throw new Error(`${policy}: a life did not end`);
    const before = l.season;
    const input = rule(c, l);
    l = step(c, l, asModel ? input : asScreen(input));
    if (l.season !== before + 1) throw new Error(`${policy}: a season did not pass`);
  }
  return l;
}
