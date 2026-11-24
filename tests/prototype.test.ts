// The first prototype (docs/DESIGN.md section 7): the shed and the first night in Norway, for every
// hero. These tests hold the author's rules to the content: three roads that are different, every
// hero can take every road, each occupation reads its own passages, looks and manner change words
// and nothing else, and no template ever reaches the page raw.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../tools/content-loader';
import { validate } from '../tools/validate';
import { runBot } from '../tools/bot';
import { newGame, view, choose, heroAt, spreadHeroes, eraOf, standing, type GameState, type HeroChoice } from '../src/game/index';

const content = loadContent();
const KITS = ['bag', 'notebook', 'sack'] as const;
const ROADS = ['hold', 'silent', 'explain'] as const;
const base = heroAt(content, 0);
const hero = (picks: Record<string, string[]>, more: Partial<HeroChoice> = {}): HeroChoice => ({ ...base, ...more, picks: { ...base.picks, ...picks } });

/** Play one hero down one pair of roads; return every page shown and the end state. */
function run(h: HeroChoice, kit: string, road: string): { text: string; state: GameState; scenes: string[] } {
  let s = newGame(content, { start: 'door', seed: 5, hero: h });
  const shown: string[] = [], scenes: string[] = [];
  for (let i = 0; i < 20; i++) {
    const v = view(content, s);
    shown.push(v.outcome?.text ?? '', v.title ?? '', v.text, ...v.choices.map((c) => c.text));
    scenes.push(s.scene);
    if (s.ended) break;
    const pick = s.scene === 'p_shed' ? kit : s.scene === 'n_choke' ? road : v.choices[0]!.id;
    s = choose(content, s, pick).state;
  }
  return { text: shown.join('\n'), state: s, scenes };
}

describe('the content', () => {
  it('validates, including the three-roads rule', () => {
    expect(validate(content).filter((i) => i.severity === 'error')).toEqual([]);
  });
  it('every bot run reaches the first night', () => {
    const bad = runBot(60).filter((r) => r.outcome !== 'ending');
    expect(bad.map((r) => `${r.start} ${r.seed}: ${r.outcome} ${r.detail ?? ''}`)).toEqual([]);
  });
  it('every scene with a choice offers exactly three, and a page turn offers one', () => {
    for (const s of Object.values(content.scenes)) if (s.kind !== 'ending') expect([1, 3], s.id).toContain(s.choices.length);
    expect(Object.values(content.scenes).filter((s) => s.choices.length === 3).map((s) => s.id).sort()).toEqual(['n_choke', 'p_shed']);
  });
});

describe('nine ways through, for every hero', () => {
  const heroes = spreadHeroes(content, 40);
  it('each of the nine reaches the end, wearing the right era, and no two read the same', () => {
    const texts = new Set<string>();
    for (const kit of KITS) for (const road of ROADS) {
      const r = run(base, kit, road);
      expect(r.state.ended?.ending, `${kit}/${road}`).toBe('first_night');
      expect(r.state.kit).toBe(kit);
      expect(eraOf(content, r.state)).toBe('norway');
      texts.add(r.text);
    }
    expect(texts.size).toBe(9);
  });
  it('the three kits leave three different people, and so do the three presentations', () => {
    const where = (kit: string, road: string) => { const s = run(base, kit, road).state; return JSON.stringify([s.counters.place ?? 0, s.counters.talk ?? 0, s.shown, s.flags]); };
    expect(new Set(KITS.map((k) => where(k, 'hold'))).size).toBe(3);
    expect(new Set(ROADS.map((r) => where('bag', r))).size).toBe(3);
    expect(new Set(ROADS.map((r) => JSON.stringify(standing(content, run(base, 'bag', r).state)))).size).toBe(3);
  });
  it('the era is "now" in the shed and Norway after the door', () => {
    const s = newGame(content, { start: 'door', seed: 1, hero: base });
    expect(eraOf(content, s)).toBe('now');
    expect(view(content, s).date).toBe(content.eras.eras.now.label);
    expect(view(content, choose(content, s, 'sack').state).date).toBe(content.eras.eras.norway.label);
  });
  it('no page ever shows a raw template, for 40 heroes x 9 ways', () => {
    for (const h of heroes) for (const kit of KITS) for (const road of ROADS) {
      const t = run(h, kit, road).text;
      expect(t, JSON.stringify(h.picks)).not.toMatch(/\[\/?(if|elif|else)\b|\{[a-z_.]+\}|undefined|\[break\]\s*\[break\]/);
      expect(t).not.toMatch(/ {2,}\S| \.|\n\n\n\n/);
    }
  });
});

describe('who was made changes what is read', () => {
  const MARK = { welder: 'You look at the welds first', nurse: 'find the mess before you look at the patient', teacher: "you read people's shelves", engineer: 'You look at the supply first' };
  const BAG = { welder: 'Hrapp is going to hate you', nurse: 'Gyda is going to hate you', teacher: 'Ulf is going to hate you', engineer: 'Orm is going to hate you' };
  it('each occupation reads its own first look and its own bag, and nobody else\'s', () => {
    for (const job of Object.keys(MARK) as (keyof typeof MARK)[]) {
      const t = run(hero({ occupation: [job] }), 'bag', 'hold').text;
      for (const other of Object.keys(MARK) as (keyof typeof MARK)[]) {
        expect(t.includes(MARK[other]), `${job} reads ${other}'s first look`).toBe(other === job);
        expect(t.includes(BAG[other]), `${job} reads ${other}'s bag`).toBe(other === job);
      }
    }
  });
  it('only a nurse has done it eleven times', () => {
    expect(run(hero({ occupation: ['nurse'] }), 'bag', 'hold').text).toContain('eleven times, twice on the same patient');
    expect(run(hero({ occupation: ['welder'] }), 'bag', 'hold').text).toContain('a man called Keith');
  });
  it('a trait is read only by a hero who has it', () => {
    const with_ = run(hero({ traits: ['rider', 'sailor'] }), 'sack', 'hold').text, without = run(hero({ traits: ['charm', 'hunter'] }), 'sack', 'hold').text;
    for (const line of ['There is a horse in the yard', 'the smoke agrees with you']) { expect(with_).toContain(line); expect(without).not.toContain(line); }
  });
  it('the hall seats a man and a woman in different places', () => {
    expect(run(hero({}, { sex: 'male' }), 'bag', 'hold').text).toContain('among the dogs');
    expect(run(hero({}, { sex: 'female' }), 'bag', 'hold').text).toContain('cross-bench at the far wall');
  });
});

describe('looks and manner change the prose and nothing else (the author, 2026-11-23)', () => {
  const g = Object.fromEntries(content.creation.groups.map((x) => [x.id, x.options]));
  it('every look and every manner reads differently', () => {
    expect(new Set(g.looks!.map((o) => run(hero({ looks: [o] }), 'bag', 'hold').text)).size).toBe(4);
    expect(new Set(g.manner!.map((o) => run(hero({ manner: [o] }), 'bag', 'hold').text)).size).toBe(4);
  });
  it('none of them moves a counter, sets a flag, changes a scene or closes a road', () => {
    for (const kit of KITS) for (const road of ROADS) {
      const want = run(base, kit, road);
      for (const group of ['looks', 'manner']) for (const o of g[group]!) {
        const got = run(hero({ [group]: [o] }), kit, road);
        expect(got.scenes, `${group} ${o}`).toEqual(want.scenes);
        expect([got.state.counters, got.state.flags, got.state.shown, got.state.kit]).toEqual([want.state.counters, want.state.flags, want.state.shown, want.state.kit]);
      }
    }
  });
  it('no choice anywhere is locked or hidden by a look or a manner', () => {
    const all = [...g.looks!, ...g.manner!];
    const src = JSON.stringify(Object.values(content.scenes).flatMap((s) => [s.requires ?? [], ...s.choices.map((c) => [c.requires ?? [], c.visible_if ?? [], c.next])]));
    for (const o of all) expect(src.includes(o), o).toBe(false);
    expect(src).not.toMatch(/looks|manner/);
  });
});
