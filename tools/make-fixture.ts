// Writes tests/fixtures/v<SAVE_VERSION>-save.json from the current build: a hero played through the
// visit to the door, into the four years, and three seasons on, so the fixture carries every part of
// the save (the visit, the roads, the deck's spent list, a life in progress). Run it once per save version, BEFORE the version rises, and commit it.
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { loadContent } from './content-loader';
import { newGame, view, choose, startsOf, heroAt, beginLife, seasonTurn } from '../src/game/index';
import { toSave, SAVE_VERSION } from '../src/game/save';

const content = loadContent();
const file = join(import.meta.dirname, '..', 'tests', 'fixtures', `v${SAVE_VERSION}-save.json`);
if (existsSync(file) && !process.argv.includes('--force')) { console.error(`${file} exists: a shipped fixture is never rewritten (--force if it never shipped)`); process.exit(1); }
let s = newGame(content, { start: startsOf(content)[0]!, seed: 12345, hero: { ...heroAt(content, 0), name: 'Fixture' } });
for (let i = 0; i < 60 && !s.ended; i++) s = choose(content, s, view(content, s).choices.find((c) => c.available)!.id).state;
s = beginLife(content, s);
for (const focus of ['work', 'train', 'trail'] as const) s = seasonTurn(content, s, { focus, know: focus === 'train' ? 0 : 1 });
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(toSave(s, content), null, 1));
console.log(`wrote ${file} (scene ${s.scene}, season ${s.life?.season})`);
