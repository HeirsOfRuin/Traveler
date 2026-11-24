// The prototype (docs/DESIGN.md section 7): the shed and the whole Norway visit, for every hero.
// These tests hold the author's rules to the content: three roads that are different, every hero
// can take every road, each occupation reads its own passages, looks and manner change words and
// nothing else, clues are drawn, and no template ever reaches the page raw.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../tools/content-loader';
import { validate } from '../tools/validate';
import { runBot } from '../tools/bot';
import { newGame, view, choose, heroAt, spreadHeroes, eraOf, standing, cluesFound, type GameState, type HeroChoice } from '../src/game/index';

const content = loadContent();
const base = heroAt(content, 0);
const hero = (picks: Record<string, string[]>, more: Partial<HeroChoice> = {}): HeroChoice => ({ ...base, ...more, picks: { ...base.picks, ...picks } });
/** scene -> the choice to take there. A scene not named takes its first choice (a page turn has only one). */
type Plan = Record<string, string>;
const NEED = ['n_boat', 'n_bench', 'n_forge'];
const plan = (p: Record<string, string> = {}): Plan => ({
  p_shed: p.kit ?? 'bag', n_choke: p.first ?? 'hold', n_keel: p.day ?? 'boat', ...Object.fromEntries(NEED.map((s) => [s, p.need ?? 'craft'])),
  n_skald: p.verse ?? 'truth', n_counsel: p.counsel ?? 'useful', n_stone: p.kol ?? 'far', n_surety: p.surety ?? 'kit',
});

/** Play one hero down one plan; return every page shown, the scenes visited and the end state. */
function run(h: HeroChoice, p: Plan = plan()): { text: string; state: GameState; scenes: string[] } {
  let s = newGame(content, { start: 'door', seed: 5, hero: h });
  const shown: string[] = [], scenes: string[] = [];
  for (let i = 0; i < 60; i++) {
    const v = view(content, s);
    shown.push(v.outcome?.text ?? '', v.title ?? '', v.text, ...v.choices.map((c) => c.text));
    scenes.push(s.scene);
    if (s.ended) break;
    s = choose(content, s, p[s.scene] ?? v.choices[0]!.id).state;
  }
  return { text: shown.join('\n'), state: s, scenes };
}
const KITS = ['bag', 'notebook', 'sack'], THREE = ['craft', 'open', 'explain'], FIRST = ['hold', 'silent', 'explain'], DAYS = ['boat', 'bench', 'forge'];
const CHOICES: [string, string[]][] = [['kit', KITS], ['first', FIRST], ['day', DAYS], ['need', THREE], ['verse', content.roads.verse!], ['counsel', content.roads.counsel!], ['kol', content.roads.kol!], ['surety', content.roads.surety!]];
/** A deterministic spread of plans: every road of every choice turns up. */
const plans = (n: number): Plan[] => Array.from({ length: n }, (_, i) => plan(Object.fromEntries(CHOICES.map(([k, v], j) => [k, v[Math.floor(i / 3 ** (j % 4) + j) % 3]!]))));

describe('the content', () => {
  it('validates, including the three-roads rule', () => {
    expect(validate(content).filter((i) => i.severity === 'error')).toEqual([]);
  });
  it('every bot run reaches the door', () => {
    const runs = runBot(60);
    expect(runs.filter((r) => r.outcome !== 'ending').map((r) => `${r.start} ${r.seed}: ${r.outcome} ${r.detail ?? ''}`)).toEqual([]);
    expect(new Set(runs.map((r) => r.ending))).toEqual(new Set(['the_door']));
  });
  it('a scene offers three roads or one way on, and there are ten real choices', () => {
    for (const s of Object.values(content.scenes)) if (s.kind !== 'ending') expect([1, 3], s.id).toContain(s.choices.length);
    expect(Object.values(content.scenes).filter((s) => s.choices.length === 3).map((s) => s.id).sort())
      .toEqual(['n_bench', 'n_boat', 'n_choke', 'n_counsel', 'n_forge', 'n_keel', 'n_skald', 'n_stone', 'n_surety', 'p_shed']);
  });
});

describe('every road, for every hero', () => {
  it('each road of each choice reaches the door and reads differently from the other two', () => {
    for (const [key, roads] of CHOICES) {
      const texts = roads.map((r) => { const x = run(base, plan({ [key]: r })); expect(x.state.ended?.ending, `${key}=${r}`).toBe('the_door'); return x.text; });
      expect(new Set(texts).size, key).toBe(3);
    }
  });
  it('each road of each choice leaves a different state', () => {
    for (const [key, roads] of CHOICES) {
      const sig = roads.map((r) => { const s = run(base, plan({ [key]: r })).state; return JSON.stringify([s.counters, s.shown, s.flags, s.roads, s.kit]); });
      expect(new Set(sig).size, key).toBe(3);
    }
  });
  it('the three days are three different places, and the need in each has its own three roads', () => {
    for (const day of DAYS) {
      const r = run(base, plan({ day }));
      expect(r.scenes.filter((s) => NEED.includes(s))).toEqual([`n_${day}`]);
      expect(new Set(THREE.map((need) => run(base, plan({ day, need })).text)).size).toBe(3);
    }
  });
  it('nobody leaves without having met Aud, Hild, Finn and Eyvind', () => {
    for (const day of DAYS) for (const first of FIRST) { const t = run(base, plan({ day, first })).text; for (const who of ['Aud', 'Hild', 'Finn', 'Eyvind']) expect(t, `${day}/${first}: ${who}`).toContain(who); }
  });
  it('what happened to the uncle comes out three ways, by how the first night was presented', () => {
    const tellers = { hold: 'It is the boy from the forge who tells you', silent: 'Nobody tells you', explain: 'He left the other half' };
    for (const [first, line] of Object.entries(tellers)) {
      const t = run(base, plan({ first })).text;
      for (const [other, l] of Object.entries(tellers)) expect(t.includes(l), `${first} reads ${other}`).toBe(other === first);
      expect(t).toContain('He was right about the well');
    }
  });
  it('the era is "now" in the shed and Norway after the door', () => {
    const s = newGame(content, { start: 'door', seed: 1, hero: base });
    expect(eraOf(content, s)).toBe('now');
    expect(view(content, choose(content, s, 'sack').state).date).toBe(content.eras.eras.norway.label);
  });
  it('standing is always a line of words, for every plan tried', () => {
    for (const p of plans(40)) { const st = standing(content, run(base, p).state); expect(st.place.length).toBeGreaterThan(5); expect(st.talk.length).toBeGreaterThan(5); }
  });
  it('no page ever shows a raw template: 30 heroes x 12 plans', () => {
    const ps = plans(12);
    for (const h of spreadHeroes(content, 30)) for (const p of ps) {
      const t = run(h, p).text;
      expect(t, JSON.stringify(h.picks)).not.toMatch(/\[\/?(if|elif|else)\b|\{[A-Za-z_.]+\}|undefined|\[break\]\s*\[break\]/);
      expect(t).not.toMatch(/ {2,}\S| \.|\n\n\n\n/);
    }
  });
});

describe('who was made changes what is read', () => {
  const SHED = { welder: 'You look at the welds first', nurse: 'find the mess before you look at the patient', teacher: "you read people's shelves", engineer: 'You look at the supply first' };
  const BAG = { welder: 'Hrapp is going to hate you', nurse: 'Gyda is going to hate you', teacher: 'Ulf is going to hate you', engineer: 'Orm is going to hate you' };
  const ASH = { welder: 'He always did like a fitting', nurse: 'could not tell a good ship from a bathtub', teacher: 'a different history', engineer: 'It is a dinghy' };
  it('each occupation reads its own shed, bag and drawing, and nobody else\'s', () => {
    for (const job of Object.keys(SHED) as (keyof typeof SHED)[]) {
      const t = run(hero({ occupation: [job] })).text;
      for (const other of Object.keys(SHED) as (keyof typeof SHED)[]) for (const set of [SHED, BAG, ASH]) expect(t.includes(set[other]), `${job} reads ${other}: ${set[other]}`).toBe(other === job);
    }
  });
  it('the one who knows the trade knows the need: nurse at the bench, welder at the forge', () => {
    expect(run(hero({ occupation: ['nurse'] }), plan({ day: 'bench' })).text).toContain('how long he has');
    expect(run(hero({ occupation: ['welder'] }), plan({ day: 'bench' })).text).toContain('on the back of a packet');
    expect(run(hero({ occupation: ['welder'] }), plan({ day: 'forge' })).text).toContain('rebuilt more bellows');
    expect(run(hero({ occupation: ['nurse'] }), plan({ day: 'forge' })).text).toContain('cat flap');
    expect(run(hero({ occupation: ['teacher'] })).text).toContain("You know this king's name");
    expect(run(hero({ occupation: ['nurse'] })).text).not.toContain("You know this king's name");
  });
  it('a trait is read only by a hero who has it', () => {
    const with_ = run(hero({ traits: ['rider', 'sailor'] }), plan({ kit: 'sack' })).text, without = run(hero({ traits: ['charm', 'hunter'] }), plan({ kit: 'sack' })).text;
    for (const line of ['There is a horse in the yard', 'the smoke agrees with you']) { expect(with_).toContain(line); expect(without).not.toContain(line); }
  });
  it('a woman is seated, sent and asked differently, and is spoken for as "she"', () => {
    const m = run(hero({}, { sex: 'male' }), plan({ day: 'forge', surety: 'word' })).text, f = run(hero({}, { sex: 'female' }), plan({ day: 'forge', surety: 'word' })).text;
    for (const line of ['cross-bench at the far wall', 'four women sewing', 'puts a key in your hand', 'It is Aud who asks you', 'I owe her a breath']) { expect(f, line).toContain(line); expect(m, line).not.toContain(line); }
    for (const line of ['among the dogs', 'down the length of the fire', 'I owe him a breath']) { expect(m, line).toContain(line); expect(f, line).not.toContain(line); }
    expect(run(hero({}, { sex: 'female' }), plan({ day: 'boat', surety: 'word' })).text).toContain('She held the right end');
  });
});

describe('looks and manner change the prose and nothing else (the author, 2026-11-23)', () => {
  const g = Object.fromEntries(content.creation.groups.map((x) => [x.id, x.options]));
  it('every look and every manner reads differently', () => {
    expect(new Set(g.looks!.map((o) => run(hero({ looks: [o] })).text)).size).toBe(4);
    expect(new Set(g.manner!.map((o) => run(hero({ manner: [o] })).text)).size).toBe(4);
  });
  it('none of them moves a counter, sets a flag, changes a scene or closes a road, over 12 plans', () => {
    for (const p of plans(12)) {
      const want = run(base, p);
      for (const group of ['looks', 'manner']) for (const o of g[group]!) {
        const got = run(hero({ [group]: [o] }), p);
        expect(got.scenes, `${group} ${o}`).toEqual(want.scenes);
        expect([got.state.counters, got.state.flags, got.state.shown, got.state.kit, got.state.roads]).toEqual([want.state.counters, want.state.flags, want.state.shown, want.state.kit, want.state.roads]);
      }
    }
  });
  it('no choice anywhere is locked or hidden by a look or a manner', () => {
    const src = JSON.stringify(Object.values(content.scenes).flatMap((s) => [s.requires ?? [], ...s.choices.map((c) => [c.requires ?? [], c.visible_if ?? [], c.next])]));
    for (const o of [...g.looks!, ...g.manner!]) expect(src.includes(o), o).toBe(false);
    expect(src).not.toMatch(/looks|manner/);
  });
});

describe('clues: things written, labelled and cut are drawn (the author, 2026-11-24)', () => {
  const mark = (id: string) => `::clue ${id}::`;
  it('every hero finds the letter, the note, the labels, the tally, his drawing and the last label', () => {
    const r = run(base);
    const always = ['letter', 'note', 'ear_label', 'frame_label', 'boulder_tally', 'ash_drawing', 'next_label'];
    for (const id of always) expect(r.text, id).toContain(mark(id));
    expect(cluesFound(content, r.state)).toEqual(expect.arrayContaining(always));
  });
  it('a clue that belongs to one road is found only on it', () => {
    const only: [string, Record<string, string>, Record<string, string>[]][] = [
      ['notebook_people', { kit: 'notebook' }, [{ kit: 'bag' }, { kit: 'sack' }]],
      ['finn_tally', { day: 'boat' }, [{ day: 'bench' }, { day: 'forge' }]],
      ['hild_stick', { day: 'bench' }, [{ day: 'boat' }, { day: 'forge' }]],
      ['hrapp_marks', { day: 'forge' }, [{ day: 'boat' }, { day: 'bench' }]],
      ['note_half', { first: 'explain' }, [{ first: 'hold' }, { first: 'silent' }]],
    ];
    for (const [id, yes, nos] of only) {
      const a = run(base, plan(yes));
      expect(a.text, id).toContain(mark(id)); expect(cluesFound(content, a.state), id).toContain(id);
      for (const no of nos) { const b = run(base, plan(no)); expect(b.text, id).not.toContain(mark(id)); expect(cluesFound(content, b.state), id).not.toContain(id); }
    }
  });
  it('nothing is found before its scene', () => {
    expect(cluesFound(content, newGame(content, { start: 'door', seed: 1, hero: base }))).toEqual(['letter', 'note', 'ear_label', 'frame_label']);
  });
  it('a clue mark is always a paragraph of its own, so the screen can draw it', () => {
    for (const s of Object.values(content.scenes)) for (const m of s.text.matchAll(/(.*)::clue [a-z_]+::(.*)/g)) expect([m[1]!.trim(), m[2]!.trim()], s.id).toEqual(['', '']);
  });
});
