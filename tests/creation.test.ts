// Character creation (docs/FRAME-creation.md): what the screen allows is what the game accepts,
// every option changes the game's state, and content can read each of them.
import { describe as group, expect, it } from 'vitest';
import { loadContent } from '../tools/content-loader';
import { test as cond } from '@engine/conditions';
import { newGame, view, heroOf, problems, tap, finish, describe, allPicks, heroCount, heroAt, spreadHeroes, emptyDraft, type HeroChoice, type HeroDraft } from '../src/game/index';
import { toSave, fromSave } from '../src/game/save';
import { OCCUPATIONS, TRAITS } from '../prototypes/killgate/data.js';

const content = loadContent();
const c = content.creation;
const G = Object.fromEntries(c.groups.map((g) => [g.id, g]));
const start = Object.keys(content.starts)[0]!;
const make = (hero: HeroChoice, seed = 7) => newGame(content, { start, seed, hero });
const full: HeroDraft = { name: 'Ingrid', sex: 'female', courts: 'men', picks: { occupation: ['nurse'], traits: ['rider', 'hunter'], looks: ['tall'], manner: ['blunt'] } };
const withPicks = (p: Record<string, string[]>): HeroDraft => ({ ...full, picks: { ...full.picks, ...p } });

group('the shape the author asked for', () => {
  it('one occupation of four, two traits of at least eight, one of four looks, one of four manners', () => {
    expect(c.groups.map((g) => [g.id, g.pick])).toEqual([['occupation', 1], ['traits', 2], ['looks', 1], ['manner', 1]]);
    expect(G.occupation!.options).toEqual(['welder', 'nurse', 'teacher', 'engineer']);
    expect(G.traits!.options.length).toBeGreaterThanOrEqual(8);
    expect(G.looks!.options.length).toBe(4);
    expect(G.manner!.options.length).toBe(4);
  });
  it('no option is in two groups, and each has a label and a description', () => {
    const all = c.groups.flatMap((g) => g.options);
    expect(new Set(all).size).toBe(all.length);
    for (const id of all) {
      const def = content.registry.traits[id]!;
      expect(def.label.length, id).toBeGreaterThan(0);
      expect(def.description.length, id).toBeGreaterThan(15);
      expect(def.mods, `${id} carries numbers before the game has any`).toEqual({});
    }
  });
  it('the occupations and traits are the ones Gate B measured', () => {
    expect([...G.occupation!.options].sort()).toEqual(Object.keys(OCCUPATIONS).sort());
    expect([...G.traits!.options].sort()).toEqual(Object.keys(TRAITS).sort());
  });
});

group('the rules', () => {
  it('nothing is chosen for the player, and each thing owed is named', () => {
    const p = problems(content, emptyDraft());
    expect(p).toEqual([c.sex.owed, c.courts.owed, G.occupation!.owed, G.traits!.owed.replace('{n}', '2'), G.looks!.owed, G.manner!.owed]);
    expect(() => finish(content, emptyDraft())).toThrow(/not a hero yet/);
  });
  it('says how many traits are still owed', () => {
    expect(problems(content, withPicks({ traits: ['rider'] }))).toEqual([G.traits!.owed.replace('{n}', '1')]);
  });
  it('a full draft has no problems, and an empty name takes the default', () => {
    expect(problems(content, full)).toEqual([]);
    expect(finish(content, { ...full, name: '   ' }).name).toBe(c.name.default);
  });
  it('a group that picks one swaps; a group that picks two refuses a third and says why', () => {
    expect(tap(content, full, 'occupation', 'welder').draft.picks.occupation).toEqual(['welder']);
    expect(tap(content, full, 'looks', 'broad').draft.picks.looks).toEqual(['broad']);
    const r = tap(content, full, 'traits', 'sailor');
    expect(r.refused).toBe(G.traits!.full);
    expect(r.draft.picks.traits).toEqual(['rider', 'hunter']);
    expect(tap(content, full, 'traits', 'rider').draft.picks.traits).toEqual(['hunter']);
    expect(tap(content, full, 'traits', 'welder').refused).toMatch(/Unknown/); // an occupation is not a trait
  });
  it('refuses what the screen could not have made', () => {
    const bads: HeroDraft[] = [
      withPicks({ traits: ['rider', 'rider'] }), withPicks({ traits: ['rider', 'pilot'] }), withPicks({ traits: ['rider', 'hunter', 'sailor'] }),
      withPicks({ occupation: ['nurse', 'welder'] }), withPicks({ occupation: ['rider'] }), withPicks({ looks: [] }), withPicks({ wealth: ['rich'] }),
      { ...full, sex: 'other' as never }, { ...full, name: 'x'.repeat(c.name.max + 1) },
    ];
    for (const bad of bads) {
      expect(problems(content, bad).length, JSON.stringify(bad.picks)).toBeGreaterThan(0);
      expect(() => newGame(content, { start, seed: 1, hero: bad as HeroChoice })).toThrow();
    }
  });
  it('stores picks in the screen order whatever order they were tapped in', () => {
    expect(finish(content, withPicks({ traits: ['hunter', 'rider'] })).picks.traits).toEqual(['rider', 'hunter']);
    expect(allPicks(content, finish(content, full))).toEqual(['nurse', 'rider', 'hunter', 'tall', 'blunt']);
  });
});

group('every hero', () => {
  const total = heroCount(content);
  it('is 2 sexes x 2 preferences x 4 occupations x 28 trait pairs x 4 looks x 4 manners', () => {
    expect(total).toBe(2 * 2 * 4 * 28 * 4 * 4);
    const seen = new Set<string>();
    for (let i = 0; i < total; i++) seen.add(JSON.stringify(heroAt(content, i)));
    expect(seen.size).toBe(total);
  });
  const sample = spreadHeroes(content, 300);
  it('a spread of 300 meets every option of every group, both sexes and both preferences', () => {
    for (const g of c.groups) for (const o of g.options) expect(sample.some((h) => h.picks[g.id]!.includes(o)), o).toBe(true);
    expect(new Set(sample.map((h) => `${h.sex}/${h.courts}`)).size).toBe(4);
    expect(new Set(sample.map((h) => JSON.stringify(h))).size).toBe(300);
  });
  it('each starts, with an open choice, and content can read every field', () => {
    for (const h of sample) {
      const s = make(h);
      expect(view(content, s).choices.some((x) => x.available)).toBe(true);
      expect(cond(`hero.sex == ${h.sex}`, s, content)).toBe(true);
      expect(cond(`hero.sex == ${h.sex === 'male' ? 'female' : 'male'}`, s, content)).toBe(false);
      expect(cond(`courts == ${h.courts}`, s, content)).toBe(true);
      expect(cond(`courts == ${h.courts === 'men' ? 'women' : 'men'}`, s, content)).toBe(false);
      for (const g of c.groups) for (const o of g.options) {
        const has = h.picks[g.id]!.includes(o);
        expect(cond(`trait.${o}`, s, content), `trait.${o}`).toBe(has);
        if (g.pick === 1) expect(cond(`${g.id} == ${o}`, s, content), `${g.id} == ${o}`).toBe(has);
      }
    }
    expect(heroOf(make({ ...sample[0]!, name: 'Ingrid' })).name).toBe('Ingrid');
  });
  it('survives a save and a load', () => {
    const s = make(finish(content, full));
    const back = fromSave(JSON.parse(JSON.stringify(toSave(s, content))), content).state;
    expect([heroOf(back).name, heroOf(back).sex, back.courts, back.picks, heroOf(back).traits]).toEqual(
      ['Ingrid', 'female', 'men', full.picks, ['nurse', 'rider', 'hunter', 'tall', 'blunt']]);
  });
});

group('the words', () => {
  it('the line that says who you made comes from the same data', () => {
    expect(describe(content, finish(content, full))).toBe('Ingrid · A woman · A nurse · Rode as a child · Hunts · Tall · Blunt · It would be a man');
    expect(describe(content, emptyDraft())).toBe(c.name.default);
  });
});
