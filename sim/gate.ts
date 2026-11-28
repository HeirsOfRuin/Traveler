// Gate B, measured on the game itself (content/season.yaml, src/game/life.ts).
//   npm run gate                  the tables: every policy, the timer, reachability, who you court, what the player chose
//   npm run gate -- --switches    each rule switched off, against the same seeds
//   npm run gate -- 8             seeds per hero (default 8)
// Rates in %, +-1 SE. Two rates differ when the gap is over about twice the larger SE.
import { loadContent } from '../tools/content-loader';
import { grade, partnerOf, type Life, type Off } from '../src/game/life';
import { heroes, live, seedOf, type Who } from './heroes';
import { MAIN } from './policies';

const content = loadContent();
const S = content.season, D = S.rules;
const args = process.argv.slice(2);
const per = Number(args.find((a) => /^\d+$/.test(a)) ?? 8);
const HEROES = heroes(content);
const idx = new Map(HEROES.map((h, i) => [h, i]));

function runs(policy: string, o: { off?: Off[]; seasons?: number; n?: number; only?: Who[] } = {}): Life[] {
  const out: Life[] = [];
  for (const w of o.only ?? HEROES) for (let i = 0; i < (o.n ?? per); i++) out.push(live(content, w, seedOf(idx.get(w)!, i), policy, o.off, o.seasons));
  return out;
}
const se = (p: number, n: number) => Math.sqrt(Math.max(p * (1 - p), 1 / (4 * n)) / n) * 100;
const rate = (r: Life[], f: (l: Life) => boolean) => { const k = r.filter(f).length, n = r.length; return `${(100 * k / n).toFixed(1)}±${se(k / n, n).toFixed(1)}`; };
const frac = (r: Life[], f: (l: Life) => boolean) => r.filter(f).length / r.length;
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const sem = (a: number[]) => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / Math.max(1, a.length - 1) / a.length); };
const ms = (a: number[]) => `${mean(a).toFixed(1)}±${sem(a).toFixed(1)}`;
const row = (cells: (string | number)[], w: number[]) => cells.map((c, i) => String(c).padStart(w[i] ?? w[w.length - 1]!)).join(' | ');

const door = (l: Life) => l.ending === 'door';
const named = (l: Life) => door(l) && l.place >= 60;
const partner = (l: Life) => door(l) && partnerOf(S, l) >= 0;
const uncle = (l: Life) => door(l) && l.trail >= D.uncleAt;
const three = (l: Life) => [named(l), partner(l), uncle(l)].filter(Boolean).length;
const g = (l: Life) => grade(S, l);

console.log(`\nGate B on the game. ${HEROES.length} heroes x ${per} seeds = ${HEROES.length * per} lives per policy. Door after ${D.seasons} seasons.\n`);

if (args.includes('--switches')) {
  const OFF: Off[] = ['noKnow', 'noTruth', 'noNeeds', 'clearSight', 'freeLove', 'noSupport', 'noPress', 'hardLoss', 'sexless'];
  const n = Math.max(1, Math.round(per / 8));
  console.log(`EACH RULE SWITCHED OFF: ${HEROES.length * n} lives a cell, all ${MAIN.length + 2} policies pooled`);
  const pols = [...MAIN, 'lover0', 'lover1'];
  const base = pols.flatMap((p) => runs(p, { n }));
  const show = (label: string, r: Life[]) => console.log(row([label, rate(r, (l) => l.ending === 'exposed'), rate(r, (l) => l.setbacks > 0), rate(r, named), rate(r, partner), rate(r, uncle), rate(r, (l) => l.ending === 'dead'), ms(r.map(g))], [11, 10]));
  console.log(row(['switch', 'exposed', 'cast out', 'named', 'partner', 'uncle', 'dead', 'grade'], [11, 10]));
  show('(none)', base);
  for (const k of OFF) show(k, pols.flatMap((p) => runs(p, { n, off: [k] })));
  process.exit(0);
}

const all = Object.fromEntries(MAIN.map((p) => [p, runs(p)]));
console.log('1. EVERY POLICY');
const W = [10, 9];
console.log(row(['policy', 'place Y1', 'place end', 'cast out', 'exposed', 'dead', 'door', 'nobody', 'named', 'partner', 'uncle', 'two of 3', 'all 3', 'grade'], W));
for (const p of MAIN) {
  const r = all[p]!;
  console.log(row([p, ms(r.map((l) => l.log[3]?.place ?? l.place)), ms(r.filter(door).map((l) => l.place)), rate(r, (l) => l.setbacks > 0), rate(r, (l) => l.ending === 'exposed'),
    rate(r, (l) => l.ending === 'dead'), rate(r, door), rate(r, (l) => door(l) && l.place < D.nobodyBelow), rate(r, named), rate(r, partner), rate(r, uncle),
    rate(r, (l) => three(l) >= 2), rate(r, (l) => three(l) === 3), ms(r.map(g))], W));
}

console.log('\n2. THE TIMER: two of three, and all three, by how long the door stays shut');
const T2 = ['placeLove', 'placeUncle', 'loveUncle', 'everything', 'bold'];
console.log(row(['seasons', ...T2.flatMap((p) => [`${p} 2of3`, 'all 3'])], [8, 16, 9]));
for (const t of [8, 10, 12, 14, 16, 20]) {
  const cells = T2.flatMap((p) => { const r = runs(p, { seasons: t, n: Math.max(1, Math.round(per / 4)) }); return [rate(r, (l) => three(l) >= 2), rate(r, (l) => three(l) === 3)]; });
  console.log(row([t, ...cells], [8, 16, 9]));
}

const reachN = Math.max(per, 20);
console.log(`\n3. REACHABLE: each hero courts each of their two people, partner at the door; ${reachN} seeds a hero`);
for (const c of ['women', 'men'] as const) for (const who of [0, 1] as const) {
  const cells = HEROES.filter((h) => h.courts === c).map((h) => { const r = runs(`lover${who}`, { n: reachN, only: [h] }); return { h, p: frac(r, (l) => door(l) && partnerOf(S, l) === who), n: r.length }; });
  const worst = cells.reduce((a, b) => (b.p < a.p ? b : a));
  console.log(`${S.loves[c][who]!.npc.padEnd(8)} mean ${(100 * mean(cells.map((x) => x.p))).toFixed(1)}%  worst ${(100 * worst.p).toFixed(1)}±${se(worst.p, worst.n).toFixed(1)}% (${worst.h.sex}, ${worst.h.kit}, ${worst.h.job}, ${worst.h.traits.join('+')})  heroes under 25%: ${cells.filter((x) => x.p < 0.25).length} of ${cells.length}`);
}

console.log(`\n4. WHO YOU COURT: the same heroes courting each of their two people; ${per} seeds a hero`);
console.log(row(['person', 'partner', 'named', 'cast out', 'exposed', 'place end', 'grade'], [8, 10]));
for (const c of ['women', 'men'] as const) for (const who of [0, 1] as const) {
  const r = runs(`lover${who}`, { only: HEROES.filter((h) => h.courts === c) });
  console.log(row([S.loves[c][who]!.npc, rate(r, (l) => door(l) && partnerOf(S, l) === who), rate(r, named), rate(r, (l) => l.setbacks > 0), rate(r, (l) => l.ending === 'exposed'), ms(r.filter(door).map((l) => l.place)), ms(r.map(g))], [8, 10]));
}

console.log('\n5. MEAN GRADE BY WHAT THE PLAYER CHOSE (* best in the row, - worst)');
const by = (label: string, vals: string[], pick: (l: Life) => string | string[]) => {
  console.log(row([label, ...vals], [10, 9]));
  for (const p of MAIN) {
    const m = vals.map((v) => mean(all[p]!.filter((l) => { const x = pick(l); return Array.isArray(x) ? x.includes(v) : x === v; }).map(g)));
    console.log(row([p, ...m.map((v) => `${v.toFixed(1)}${v === Math.max(...m) ? '*' : v === Math.min(...m) ? '-' : ' '}`)], [10, 9]));
  }
};
by('kit', ['bag', 'notebook', 'sack'], (l) => l.kit);
by('sex', ['male', 'female'], (l) => l.sex);
by('job', Object.keys(S.occupations), (l) => l.job);
by('trait', Object.keys(S.traits), (l) => l.traits);
