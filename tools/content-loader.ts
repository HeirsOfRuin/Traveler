// Node-only: reads content/ into a bundle (the shared loader plus this game's starts).
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { loadBase, walkYaml, readYaml, parse, ContentError } from '@tools/content';
import { ConfigSchema, RegistrySchema, SceneSchema, StartSchema, CreationSchema, GAME_ID, type ContentBundle, type Start } from '../src/content/schema';
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
  return { hash: hash.digest('hex').slice(0, 12), ...base, starts, creation };
}
