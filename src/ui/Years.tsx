// The four years, as a sandbox: the season's plan and its result, in words, with no story yet.
// Computes nothing: every value shown is read from the life through the lists in season.yaml
// (src/game/years.ts words), and no number is ever shown (docs/DESIGN.md section 4).
// Hooks for tools/smoke.mjs: [data-focus], [data-know], [data-act="season"].
import { useState } from 'preact/hooks';
import type { ContentBundle } from '../content/schema';
import { seasonTurn, words, lovesOf, FOCI, type GameState, type SeasonInput, type Focus, type Know } from '../game/index';

export function Years({ content, state, onChange, onQuit }: { content: ContentBundle; state: GameState; onChange: (s: GameState) => void; onQuit: () => void }) {
  const S = content.season, W = S.screen, D = S.rules, l = state.life!;
  const people = lovesOf(S, l).map((L) => content.registry.npcs[L.npc]!.name.split(' ')[0]!);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [who, setWho] = useState<0 | 1>(0);
  const [know, setKnow] = useState<Know | null>(null);
  const [press, setPress] = useState(false);
  const say = (t: string, i = 0) => t.replace('{npc}', people[i]!);
  const season = content.config.seasons[l.season % 4]!;
  const last = l.log[l.log.length - 1];
  const left = D.seasons - l.season;
  const presentable = focus === 'work' || focus === 'trail' || focus === 'travel';
  const ready = focus !== null && (focus === 'train' || know !== null);
  const go = () => {
    if (!ready) return;
    const input: SeasonInput = { focus: focus!, know: focus === 'train' ? 0 : know!, who, press: presentable && press };
    onChange(seasonTurn(content, state, input));
    setFocus(null); setKnow(null); setPress(false); window.scrollTo(0, 0);
  };
  const happened = last && [
    last.focus === 'lost' ? W.happened.lost : '',
    last.castOut ? W.happened.castOut : '', last.hurt ? W.happened.hurt : '', last.walled ? W.happened.walled : '',
    last.need && last.focus !== 'lost' && last.focus !== 'train' && last.focus !== 'court' ? (last.know >= 2 ? W.happened.needMet : W.happened.needLeft) : '',
  ].filter(Boolean);

  return (
    <>
      <header class="hud"><span class="turn">{l.ending ? content.eras.eras.norway.label : `${W.years[Math.min(3, Math.floor(l.season / 4))]}, ${season}`}</span><span>{W.title}</span></header>
      <main class="panel"><div class="leaf" key={`${l.season}/${l.ending}`}>
        {l.season === 0 && <p class="hint">{W.note}</p>}
        {last?.line && <section class="outcome"><p>{last.line}</p></section>}
        {happened && happened.length > 0 && <ul class="happened">{happened.map((h) => <li>{h}</li>)}</ul>}

        <dl class="you">
          <dt>{content.config.counter_labels.place}</dt><dd>{words(placeWords(content), l.place)}</dd>
          <dt>{content.config.counter_labels.talk}</dt><dd>{words(W.room, l.seen)}</dd>
          {[0, 1].map((i) => <><dt>{people[i]}</dt><dd>{say(words(W.bond, l.bond[i]!), i)} {say(W.told[l.told[i]!]!, i)}</dd></>)}
          <dt>Your uncle</dt><dd>{!l.travelled && l.trail >= D.trailWall1 ? W.trailOut : words(W.trail, l.trail)}</dd>
          <dt>The door</dt><dd>{words(W.door, left)}</dd>
        </dl>

        {l.ending ? <>
          <section class="card"><h2>{W.ending[l.ending]}</h2></section>
          <div class="stack"><button class="primary" data-act="new" onClick={onQuit}>{W.back}</button></div>
        </> : <>
          {l.need && <p class="banner-calm" role="status">{W.need}</p>}
          <p class="label">{W.for}</p>
          <div class="stack roads">
            {FOCI.flatMap((f) => (f === 'court' ? [0, 1] as const : [0] as const).map((i) => (
              <button data-focus={f === 'court' ? `court-${i}` : f} class={focus === f && (f !== 'court' || who === i) ? 'on' : ''}
                onClick={() => { setFocus(f); if (f === 'court') setWho(i); if (f === 'train') setKnow(0); else if (f !== focus) setKnow(null); }}>
                {f === 'court' ? say(W.focus.court, i) : W.focus[f]}
              </button>
            )))}
          </div>
          {focus && focus !== 'train' && <p class="label">{W.how}</p>}
          {focus && focus !== 'train' && <div class="stack">
            {(focus === 'court' ? W.tell : W.present).map((t, i) => {
              const k = (focus === 'court' ? i : i + 1) as Know;
              return <button data-know={k} class={know === k ? 'on' : ''} onClick={() => setKnow(k)}>{say(t, who)}</button>;
            })}
          </div>}
          {presentable && <label class="check"><input type="checkbox" id="press" checked={press} onChange={(e) => setPress((e.target as HTMLInputElement).checked)} /> {W.press}</label>}
          <div class="stack"><button class="primary" data-act="season" disabled={!ready} onClick={go}>{W.go}</button>
            <button data-act="quit" onClick={onQuit}>{W.back}</button></div>
        </>}
      </div></main>
    </>
  );
}

/** Place on the season scale, read through the same words the visit uses (eras.yaml standing.place). */
function placeWords(content: ContentBundle): [number, string][] {
  const list = content.eras.standing.place, step = 100 / list.length;
  return list.map((w, i) => [Math.round(i * step), w] as [number, string]).reverse();
}
