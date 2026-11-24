// Node-only: reads content/ into a bundle (the shared loader plus this game's starts).
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { loadBase, walkYaml, readYaml, parse, ContentError } from '@tools/content';
import { ConfigSchema, RegistrySchema, SceneSchema, StartSchema, CreationSchema, ErasSchema, CluesSchema, GAME_ID, type Eras, type ContentBundle, type Start } from '../src/content/schema';
import '../src/game/module'; // the rules this content is played by

export { ContentError };
export const CONTENT_DIR = join(import.meta.dirname, '..', 'content');
const REGISTRY = ['flags', 'npcs', 'traits', 'injuries', 'items', 'factions', 'endings', 'lore', 'places'];

export function loadContent(dir = CONTENT_DIR): ContentBundle {
  const { hash, base, rel } = loadBase({ dir, game: GAME_ID, config: ConfigSchema, registry: RegistrySchema, scene: SceneSchema, registryKeys: REGISTRY });
  const starts: Record<string, Start> = {};
  for (const p of walkYaml(join(dir, 'starts'))) {
    hash.update(readFileSync(p));
    const s = parse(StartSchema, readYaml(p), rel(p));
    if (starts[s.id]) throw new ContentError(`${rel(p)}: duplicate start ${s.id}`);
    starts[s.id] = s;
  }
  if (!Object.keys(starts).length) throw new ContentError('content/starts/: no start');
  const cp = join(dir, 'creation.yaml');
  hash.update(readFileSync(cp));
  const creation = parse(CreationSchema, readYaml(cp), rel(cp));
  const owner: Record<string, string> = {};
  for (const g of creation.groups) {
    if (g.pick > g.options.length) throw new ContentError(`creation.yaml: ${g.id} picks ${g.pick} of ${g.options.length}`);
    if (g.pick > 1 && !g.full) throw new ContentError(`creation.yaml: ${g.id} picks more than one and has no "full" line to say why the next is refused`);
    for (const t of g.options) {
      if (!base.registry.traits[t]) throw new ContentError(`creation.yaml: ${g.id} option "${t}" is not in registry/traits.yaml`);
      if (owner[t]) throw new ContentError(`creation.yaml: "${t}" is in both ${owner[t]} and ${g.id}`);
      owner[t] = g.id;
    }
  }
  const ep = join(dir, 'eras.yaml');
  hash.update(readFileSync(ep));
  const eras: Eras = parse(ErasSchema, readYaml(ep), rel(ep));
  for (const ch of base.config.chapters) if (!eras.chapters[ch]) throw new ContentError(`eras.yaml: chapter "${ch}" has no era`);
  for (const ch of Object.keys(eras.chapters)) if (!base.config.chapters.includes(ch)) throw new ContentError(`eras.yaml: "${ch}" is not a chapter in config.yaml`);
  const kp = join(dir, 'clues.yaml');
  hash.update(readFileSync(kp));
  const clues = parse(CluesSchema, readYaml(kp), rel(kp));
  // every clue is shown by the scene that says it is found there, and every mark names a clue
  const marks: Record<string, string[]> = {};
  for (const s of Object.values(base.scenes)) for (const m of JSON.stringify(s).matchAll(/::clue ([a-z0-9_]+)::/g)) (marks[m[1]!] ??= []).push(s.id);
  for (const [id, where] of Object.entries(marks)) if (!clues[id]) throw new ContentError(`scene ${where[0]}: "::clue ${id}::" is not in clues.yaml`);
  for (const [id, c] of Object.entries(clues)) {
    if (!base.scenes[c.found_in]) throw new ContentError(`clues.yaml: ${id} is found in "${c.found_in}", which is not a scene`);
    if (!marks[id]?.includes(c.found_in)) throw new ContentError(`clues.yaml: ${id} says it is found in ${c.found_in}, and that scene never shows it`);
  }
  return { hash: hash.digest('hex').slice(0, 12), ...base, starts, creation, eras, clues };
}
