// The four years in the game (src/game/life.ts, years.ts, deck.ts). The rules themselves are
// measured by sim/ (npm run gate, gate:check) and proved equal to the Gate B model by
// sim/equivalence.ts; these tests hold the joins: the visit into the life, the save, the deck, the screen's words.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../tools/content-loader';
import { newGame, view, choose, heroAt, canBegin, beginLife, seasonTurn, words, FOCI, type GameState, type HeroChoice } from '../src/game/index';
import { toSave, fromSave } from '../src/game/save';
import { draw, spend, unspent } from '../src/game/deck';
import { streamFor } from '../src/game/streams';
import { newLife, step } from '../src/game/life';

const content = loadContent();
const base = heroAt(content, 0);
function toDoor(h: HeroChoice = base, plan: Record<string, string> = {}): GameState {
  let s = newGame(content, { start: 'door', seed: 11, hero: h });
  for (let i = 0; i < 60 && !s.ended; i++) s = choose(content, s, plan[s.scene] ?? view(content, s).choices[0]!.id).state;
  return s;
}

describe('the four years begin at the door', () => {
  it('not before the visit has ended', () => {
    const s = newGame(content, { start: 'door', seed: 1, hero: base });
    expect(canBegin(content, s)).toBe(false);
    expect(() => beginLife(content, s)).toThrow();
    const end = toDoor();
    expect(end.ended?.ending).toBe('the_door');
    expect(canBegin(content, end)).toBe(true);
    expect(canBegin(content, beginLife(content, end))).toBe(false);
  });
  it('the life is the hero who was made and the kit that was carried', () => {
    const h: HeroChoice = { ...base, sex: 'female', courts: 'men', picks: { ...base.picks, occupation: ['engineer'], traits: ['rider', 'sailor'] } };
    const l = beginLife(content, toDoor(h, { p_shed: 'notebook' })).life!;
    expect([l.sex, l.courts, l.kit, l.job, l.traits]).toEqual(['female', 'men', 'notebook', 'engineer', ['rider', 'sailor']]);
  });
  it('what the visit left is carried: standing, and the person the second day was spent with', () => {
    const plain = newLife(content, { seed: 11, sex: base.sex, courts: base.courts, kit: 'bag', job: base.picks.occupation![0]!, traits: base.picks.traits! });
    const s = toDoor(base, { p_shed: 'bag', n_keel: 'bench' });
    const l = beginLife(content, s).life!;
    const C = content.season.carry;
    expect(l.place).toBeCloseTo(Math.min(100, plain.place + C.placePer * (s.counters.place ?? 0)));
    expect(l.strange).toBeCloseTo(Math.min(100, plain.strange + C.talkPer * (s.counters.talk ?? 0)));
    const hild = content.season.loves[base.courts].findIndex((L) => L.npc === 'hild');
    expect(l.bond).toEqual([0, 1].map((i) => (i === hild ? C.dayBond : 0)));
  });
});

describe('a season', () => {
  it('passes, is kept in the save, and plays the same after a reload', () => {
    let s = beginLife(content, toDoor());
    s = seasonTurn(content, s, { focus: 'work', know: 2 });
    expect(s.life!.season).toBe(1);
    const back = fromSave(JSON.parse(JSON.stringify(toSave(s, content))), content).state;
    expect(back).toEqual(s);
    const input = { focus: 'trail' as const, know: 1 as const };
    expect(seasonTurn(content, back, input)).toEqual(seasonTurn(content, s, input));
  });
  it('sixteen seasons of anything end at the door, or sooner; every focus is accepted', () => {
    for (const [i, focus] of FOCI.entries()) {
      let s = beginLife(content, toDoor());
      for (let n = 0; n < 40 && !s.life!.ending; n++) s = seasonTurn(content, s, { focus, know: (1 + (i % 3)) as 1 | 2 | 3, who: (n % 2) as 0 | 1 });
      expect(s.life!.ending, focus).not.toBeNull();
      expect(s.life!.season).toBeLessThanOrEqual(content.season.rules.seasons);
      expect(() => seasonTurn(content, s, { focus: 'work', know: 1 })).toThrow();
    }
  });
  it('step never changes the life it is given', () => {
    const s = beginLife(content, toDoor()), copy = JSON.stringify(s);
    seasonTurn(content, s, { focus: 'court', know: 2, who: 1 });
    expect(JSON.stringify(s)).toBe(copy);
  });
  it('every value the screen shows is a line of words, at every season of a life', () => {
    const W = content.season.screen;
    let s = beginLife(content, toDoor());
    for (let n = 0; !s.life!.ending; n++) {
      const l = s.life!;
      for (const t of [words(W.room, l.seen), words(W.trail, l.trail), words(W.door, 16 - l.season), words(W.bond, l.bond[0])]) expect(t).toMatch(/^[A-Z{].*[.]$/);
      s = seasonTurn(content, s, { focus: n % 3 ? 'work' : 'trail', know: 1 });
    }
  });
});

describe('the deck: nothing authored is shown twice', () => {
  const rng = () => streamFor(1, 0, 'deck');
  it('spends, refuses a second use, and runs dry', () => {
    let spent = spend({}, 'd', 'a');
    expect(() => spend(spent, 'd', 'a')).toThrow(/already used/);
    expect(unspent(spent, 'd', ['a', 'b'])).toEqual(['b']);
    const d1 = draw(spent, 'd', ['a', 'b'], rng()); expect(d1.id).toBe('b'); spent = d1.spent;
    expect(draw(spent, 'd', ['a', 'b'], rng()).id).toBeNull();
  });
  it('a season with no lines written leaves the prose out', () => {
    const s = seasonTurn(content, beginLife(content, toDoor()), { focus: 'work', know: 1 });
    expect(s.life!.log[0]!.line).toBeNull();
    expect(s.spent).toEqual({});
  });
  it('with lines written, a life of sixteen seasons never shows one twice, and the save remembers', () => {
    const lines = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`w${i}`, `Line ${i}.`]));
    const c = { ...content, decks: { season_work: lines } };
    let s = beginLife(c, toDoor());
    const seen: string[] = [];
    while (!s.life!.ending) { s = seasonTurn(c, s, { focus: 'work', know: 1 }); const l = s.life!.log.at(-1)!.line; if (l) seen.push(l); }
    expect(seen.length).toBe(6);
    expect(new Set(seen).size).toBe(6);
    expect(s.spent.season_work!.sort()).toEqual(Object.keys(lines).sort());
    expect(fromSave(JSON.parse(JSON.stringify(toSave(s, c))), c).state.spent).toEqual(s.spent);
  });
});

describe('the measured rules are the played rules', () => {
  it('the game and a bare life agree season for season', () => {
    const s0 = beginLife(content, toDoor(base, { p_shed: 'sack', n_keel: 'forge' }));
    let s = s0, l = s0.life!;
    for (const input of [{ focus: 'work', know: 2 }, { focus: 'court', know: 1, who: 1 }, { focus: 'travel', know: 3, press: true }, { focus: 'train', know: 0 }] as const) {
      s = seasonTurn(content, s, input); l = step(content, l, input);
      expect({ ...s.life!, log: [] }).toEqual({ ...l, log: [] });
    }
  });
});
