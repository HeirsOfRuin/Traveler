// Character creation (docs/FRAME-creation.md): what the screen allows is what the game accepts,
// every option changes the game's state, and content can read each of them.
import { describe as group, expect, it } from 'vitest';
import { loadContent } from '../tools/content-loader';
import { test as cond } from '@engine/conditions';
import { newGame, view, heroOf, problems, toggleTrait, finish, describe, everyHero, emptyDraft, type HeroChoice, type HeroDraft } from '../src/game/index';
import { toSave, fromSave } from '../src/game/save';
import { TRAITS } from '../prototypes/killgate/data.js';

const content = loadContent();
const c = content.creation;
const start = Object.keys(content.starts)[0]!;
const make = (hero: HeroChoice, seed = 7) => newGame(content, { start, seed, hero });
const full: HeroDraft = { name: 'Ingrid', sex: 'female', courts: 'men', traits: ['nurse', 'rider'] };

group('the rules', () => {
  it('nothing is chosen for the player', () => {
    const p = problems(content, emptyDraft());
    expect(p).toContain(c.missing.sex);
    expect(p).toContain(c.missing.courts);
    expect(p).toContain(c.missing.traits_few.replace('{n}', String(c.traits.pick)));
    expect(() => finish(content, emptyDraft())).toThrow(/not a hero yet/);
  });
  it('says how many traits are still owed', () => {
    expect(problems(content, { ...full, traits: ['nurse'] })).toEqual([c.missing.traits_few.replace('{n}', '1')]);
  });
  it('a full draft has no problems, and an empty name takes the default', () => {
    expect(problems(content, full)).toEqual([]);
    expect(finish(content, { ...full, name: '   ' }).name).toBe(c.name.default);
  });
  it('refuses a third trait with a reason, and lets one be put back', () => {
    const r = toggleTrait(content, full, 'welder');
    expect(r.refused).toBe(c.traits.full);
    expect(r.draft.traits).toEqual(full.traits);
    expect(toggleTrait(content, full, 'nurse').draft.traits).toEqual(['rider']);
  });
  it('refuses what the screen could not have made', () => {
    for (const bad of [{ ...full, traits: ['nurse', 'nurse'] }, { ...full, traits: ['nurse', 'pilot'] }, { ...full, traits: ['nurse', 'rider', 'welder'] }, { ...full, sex: 'other' as never }, { ...full, name: 'x'.repeat(c.name.max + 1) }]) {
      expect(problems(content, bad).length, JSON.stringify(bad)).toBeGreaterThan(0);
      expect(() => newGame(content, { start, seed: 1, hero: bad as HeroChoice })).toThrow();
    }
  });
  it('stores traits in the screen order whatever order they were tapped in', () => {
    expect(finish(content, { ...full, traits: ['rider', 'nurse'] }).traits).toEqual(['nurse', 'rider']);
  });
});

group('every hero', () => {
  const heroes = everyHero(content);
  it('is 2 sexes x 2 preferences x 6 trait pairs, all different, all playable', () => {
    expect(heroes.length).toBe(24);
    const states = heroes.map((h) => make(h));
    expect(new Set(states.map((s) => JSON.stringify([heroOf(s).sex, s.courts, heroOf(s).traits]))).size).toBe(24);
    for (const s of states) expect(view(content, s).choices.some((x) => x.available)).toBe(true);
  });
  it('each option is readable by content: hero.sex, courts, trait.<id>, {name}', () => {
    for (const h of heroes) {
      const s = make(h);
      expect(cond(`hero.sex == ${h.sex}`, s, content)).toBe(true);
      expect(cond(`hero.sex == ${h.sex === 'male' ? 'female' : 'male'}`, s, content)).toBe(false);
      expect(cond(`courts == ${h.courts}`, s, content)).toBe(true);
      expect(cond(`courts == ${h.courts === 'men' ? 'women' : 'men'}`, s, content)).toBe(false);
      for (const t of c.traits.options) expect(cond(`trait.${t}`, s, content), `${t} for ${h.traits}`).toBe(h.traits.includes(t));
    }
    expect(heroOf(make({ ...heroes[0]!, name: 'Ingrid' })).name).toBe('Ingrid');
  });
  it('survives a save and a load', () => {
    const s = make(finish(content, full));
    const back = fromSave(JSON.parse(JSON.stringify(toSave(s, content))), content).state;
    expect([heroOf(back).name, heroOf(back).sex, back.courts, heroOf(back).traits]).toEqual(['Ingrid', 'female', 'men', ['nurse', 'rider']]);
  });
});

group('the words', () => {
  it('the line that says who you made comes from the same data', () => {
    expect(describe(content, finish(content, full))).toBe('Ingrid · A woman · A nurse · Rode as a child · It would be a man');
    expect(describe(content, emptyDraft())).toBe(c.name.default);
  });
  it('every trait has a label and a description, and no numbers yet', () => {
    for (const t of c.traits.options) {
      const def = content.registry.traits[t]!;
      expect(def.label.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(20);
      expect(def.mods).toEqual({});
    }
  });
  it('the traits are the ones Gate B measured', () => {
    expect([...c.traits.options].sort()).toEqual(Object.keys(TRAITS).sort());
    expect(c.traits.pick).toBe(2);
  });
});
