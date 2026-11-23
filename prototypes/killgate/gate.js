// The Gate B tables in one run, from the SPEC's three claims.
//   node prototypes/killgate/gate.js [seedsPerHero=30]
// 72 heroes (2 sexes x 2 preferences x 3 kits x 6 trait pairs), the same seeds for every policy.

import { play, grade, partnerOf } from './model.js';
import { POLICIES, MAIN } from './policies.js';
import { D, SEXES, COURTS, KITS, TRAIT_PAIRS, LOVES } from './data.js';
import { seRate } from './stats.js';
import { progress } from './adapter.js';

const per = Number(process.argv[2] || 30);
const HEROES = [];
for (const sex of SEXES) for (const courts of COURTS) for (const kit of Object.keys(KITS)) for (const traits of TRAIT_PAIRS) HEROES.push({ sex, courts, kit, traits });
const seedOf = (h, i) => 1 + h * 100003 + i * 7919;

function runs(policy, extra = {}, n = per, heroes = HEROES) {
  const out = [];
  heroes.forEach((hero, h) => {
    for (let i = 0; i < n; i++) {
      const s = play(seedOf(HEROES.indexOf(hero), i), { policy, ...hero, ...extra });
      const miss = progress(s);
      if (miss.length) throw new Error(`${policy} ${JSON.stringify(hero)} seed ${s.seed}: ${miss.join('; ')}`);
      out.push(s);
    }
  });
  return out;
}
const rate = (r, f) => { const k = r.filter(f).length, n = r.length; return `${(100 * k / n).toFixed(1)}±${seRate(k / n, n).toFixed(1)}`; };
const num = (r, f) => r.filter(f).length / r.length;
const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const sem = (a) => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / Math.max(1, a.length - 1) / a.length); };
const ms = (a) => `${mean(a).toFixed(1)}±${sem(a).toFixed(1)}`;
const row = (cells, w) => cells.map((c, i) => String(c).padStart(w[i] ?? w[w.length - 1])).join(' | ');

const door = (s) => s.ending === 'door';
const named = (s) => door(s) && s.place >= 60;
const partner = (s) => door(s) && partnerOf(s) >= 0;
const uncle = (s) => door(s) && s.trail >= s.D.uncleAt;
const count3 = (s) => [named(s), partner(s), uncle(s)].filter(Boolean).length;

console.log(`\nGate B. ${HEROES.length} heroes x ${per} seeds = ${HEROES.length * per} runs per policy. Door after ${D.seasons} seasons. Rates in %, ±1 SE.\n`);

// ---- 1. every policy
const all = Object.fromEntries(MAIN.map((p) => [p, runs(p)]));
const W = [10, 9];
console.log('1. EVERY POLICY');
console.log(row(['policy', 'place Y1', 'peak', 'place end', 'cast out', 'exposed', 'dead', 'door', 'nobody', 'named', 'partner', 'uncle', 'two of 3', 'all 3', 'grade'], W));
for (const p of MAIN) {
  const r = all[p];
  console.log(row([p, ms(r.map((s) => s.log[3]?.place ?? s.place)), ms(r.map((s) => s.peakPlace)), ms(r.filter(door).map((s) => s.place)),
    rate(r, (s) => s.setbacks > 0), rate(r, (s) => s.ending === 'exposed'), rate(r, (s) => s.ending === 'dead'), rate(r, door),
    rate(r, (s) => door(s) && s.place < s.D.nobodyBelow), rate(r, named), rate(r, partner), rate(r, uncle),
    rate(r, (s) => count3(s) >= 2), rate(r, (s) => count3(s) === 3), ms(r.map(grade))], W));
}

// ---- 2. the door's timer
console.log('\n2. THE TIMER: two of three, and all three, by how long the door stays shut');
const TIMES = [8, 10, 12, 14, 16, 20];
const T2 = ['placeLove', 'placeUncle', 'loveUncle', 'everything'];
console.log(row(['seasons', ...T2.flatMap((p) => [`${p} 2of3`, 'all 3'])], [8, 16, 9]));
for (const t of TIMES) {
  const cells = T2.flatMap((p) => { const r = runs(p, { data: { seasons: t } }, Math.max(6, Math.round(per / 3))); return [rate(r, (s) => count3(s) >= 2), rate(r, (s) => count3(s) === 3)]; });
  console.log(row([t, ...cells], [8, 16, 9]));
}

// ---- 3. both people reachable from every hero
console.log('\n3. REACHABLE: each hero courts each of their two people (lover0, lover1), partner at the door');
const reach = [];
for (const hero of HEROES) for (const who of [0, 1]) {
  const r = runs(`lover${who}`, {}, per, [hero]);
  reach.push({ hero, who, id: LOVES[hero.courts][who].id, p: num(r, (s) => door(s) && partnerOf(s) === who), n: r.length });
}
for (const c of COURTS) for (const who of [0, 1]) {
  const cells = reach.filter((x) => x.hero.courts === c && x.who === who);
  const worst = cells.reduce((a, b) => (b.p < a.p ? b : a));
  console.log(`${LOVES[c][who].id.padEnd(11)} mean ${(100 * mean(cells.map((x) => x.p))).toFixed(1)}%  worst hero ${(100 * worst.p).toFixed(1)}±${seRate(worst.p, worst.n).toFixed(1)}% (${worst.hero.sex}, ${worst.hero.kit}, ${worst.hero.traits})  heroes under 25%: ${cells.filter((x) => x.p < 0.25).length} of ${cells.length}`);
}

// ---- 4. no kit, sex or trait is best everywhere
console.log('\n4. GRADE BY WHAT THE PLAYER CHOSE (mean ±SE; * = best in the row beyond 2 SE of the worst)');
const by = (label, key, vals, pick) => {
  console.log(row([label, ...vals], [10, 11]));
  for (const p of MAIN) {
    const g = vals.map((v) => all[p].filter((s) => pick(s) === v).map(grade));
    const m = g.map(mean), best = Math.max(...m), worst = Math.min(...m), i = m.indexOf(best), j = m.indexOf(worst);
    const clear = best - worst > 2 * Math.hypot(sem(g[i]), sem(g[j]));
    console.log(row([p, ...g.map((a, k) => `${ms(a)}${k === i && clear ? '*' : ' '}`)], [10, 11]));
  }
};
by('kit', 'kit', Object.keys(KITS), (s) => s.hero.kit);
by('sex', 'sex', SEXES, (s) => s.hero.sex);
const TR = ['nurse', 'welder', 'rider', 'reader'];
console.log(row(['trait', ...TR], [10, 11]));
for (const p of MAIN) console.log(row([p, ...TR.map((t) => ms(all[p].filter((s) => s.hero.traits.includes(t)).map(grade)))], [10, 11]));
