// The creation screen. It computes nothing: what is allowed, why Begin is shut and the line that
// says who you made all come from src/game/creation.ts, and every word from content/creation.yaml.
// Hooks for tools/smoke.mjs: [data-pick="sex:male"], [data-pick="occupation:nurse"], [data-act="begin"].
import { useState } from 'preact/hooks';
import type { ContentBundle } from '../content/schema';
import { problems, tap, finish, describe, emptyDraft, SEXES, COURTS, type HeroDraft, type HeroChoice } from '../game/index';

export function Creation({ content, onBegin, onBack }: { content: ContentBundle; onBegin: (h: HeroChoice) => void; onBack: () => void }) {
  const c = content.creation;
  const [d, setD] = useState<HeroDraft>(emptyDraft());
  const [refused, setRefused] = useState<{ group: string; why: string } | null>(null);
  const bad = problems(content, d);
  const set = (patch: Partial<HeroDraft>) => { setRefused(null); setD({ ...d, ...patch }); };
  const pick = (group: string, id: string) => { const r = tap(content, d, group, id); setD(r.draft); setRefused(r.refused ? { group, why: r.refused } : null); };

  return (
    <main class="creation">
      <h1>{c.title}</h1>
      <p class="lede">{c.lede}</p>

      <label class="field">
        <span>{c.name.prompt}</span>
        <input type="text" value={d.name} placeholder={c.name.default} maxLength={c.name.max + 8} autocomplete="off" autocapitalize="words"
          onInput={(e) => set({ name: (e.target as HTMLInputElement).value })} />
      </label>

      <fieldset>
        <legend>{c.sex.prompt}</legend>
        <div class="pair">
          {SEXES.map((s) => <button type="button" data-pick={`sex:${s}`} aria-pressed={d.sex === s} class={d.sex === s ? 'on' : ''} onClick={() => set({ sex: s })}>{c.sex.options[s]}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend>{c.courts.prompt}</legend>
        <div class="pair">
          {COURTS.map((k) => <button type="button" data-pick={`courts:${k}`} aria-pressed={d.courts === k} class={d.courts === k ? 'on' : ''} onClick={() => set({ courts: k })}>{c.courts.options[k]}</button>)}
        </div>
        <p class="hint">{c.courts.note}</p>
      </fieldset>

      {c.groups.map((g) => {
        const got = d.picks[g.id] ?? [];
        return (
          <fieldset>
            <legend>{g.prompt}{g.pick > 1 && <small> ({got.length} of {g.pick})</small>}</legend>
            {g.note && <p class="hint">{g.note}</p>}
            <div class="stack">
              {g.options.map((id) => {
                const t = content.registry.traits[id]!;
                const on = got.includes(id);
                return <button type="button" data-pick={`${g.id}:${id}`} aria-pressed={on} class={on ? 'on' : ''} onClick={() => pick(g.id, id)}><strong>{t.label}</strong><small>{t.description}</small></button>;
              })}
            </div>
            {refused?.group === g.id && <p class="warn" role="status">{refused.why}</p>}
          </fieldset>
        );
      })}

      <section class="made">
        <p>{describe(content, d)}</p>
        {bad.length > 0 && <ul class="hint">{bad.map((b) => <li>{b}</li>)}</ul>}
      </section>

      <div class="stack">
        <button type="button" class="primary" data-act="begin" disabled={bad.length > 0} onClick={() => onBegin(finish(content, d))}>{c.begin}</button>
        <button type="button" data-act="back" onClick={onBack}>Back</button>
      </div>
    </main>
  );
}
