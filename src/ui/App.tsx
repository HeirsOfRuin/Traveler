// The screens. Reads the engine's view(), computes nothing. Same hooks as every scaffolded game,
// so tools/smoke.mjs drives it unchanged: [data-act] for title and menu actions, .hud .turn for
// the clock, [data-action] for choices, [data-tab] for tabs.
//
// The screen wears the design of the era being played (src/ui/eras.css): the title and the
// creation screen are "now", and a game is whatever era its chapter is in (content/eras.yaml).
import { useEffect, useState } from 'preact/hooks';
import type { ContentBundle, EraId } from '../content/schema';
import { ERA_IDS, CLUE_MARK } from '../content/schema';
import { Clue } from './Clue';
import { newGame, view, choose, startsOf, describe, heroOf, eraOf, standing, cluesFound, canBegin, beginLife, type GameState, type SceneView, type HeroChoice } from '../game/index';
import { toSave, fromSave, encodeSaveCode, decodeSaveCode, SAVE_KEY } from '../game/save';
import { STORAGE_OK, lsGet, lsSet } from './storage.js';
import { Creation } from './Creation';
import { Years } from './Years';

function load(content: ContentBundle): GameState | null {
  const raw = lsGet(SAVE_KEY);
  if (!raw) return null;
  try { return fromSave(JSON.parse(raw), content).state; } catch { return null; }
}
// Which page of the scene the player is on is the screen's, not the game's: it is kept beside the
// save so a reload in the middle of a scene comes back to the same page (the smoke test caught this).
const PAGE_KEY = 'traveler.page.v1';
const at = (s: GameState) => `${s.scene}#${s.journal.length}`;
const keepPage = (s: GameState, page: number) => lsSet(PAGE_KEY, JSON.stringify({ at: at(s), page }));
function pageFor(s: GameState): number {
  try { const p = JSON.parse(lsGet(PAGE_KEY) ?? 'null'); return p && p.at === at(s) && Number.isInteger(p.page) ? p.page : 0; } catch { return 0; }
}


/** Put the era's design on the page, and tell the browser's own chrome its colour. */
function wear(era: EraId) {
  const root = document.documentElement;
  if (root.dataset.era !== era) root.dataset.era = era;
  const bg = getComputedStyle(root).getPropertyValue('--on-bg').trim();
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}

/** Who you made, what you carried, and how you stand: all from the state the story reads. */
function You({ content, state }: { content: ContentBundle; state: GameState }) {
  const s = standing(content, state);
  return (
    <dl class="you">
      <dt>Who went through the door</dt><dd>{describe(content, { ...heroOf(state), courts: state.courts, picks: state.picks })}</dd>
      <dt>In your one hand</dt><dd>{state.kit ? content.eras.kits[state.kit] : 'Nothing yet.'}</dd>
      {eraOf(content, state) !== 'now' && <><dt>{content.config.counter_labels.place}</dt><dd>{s.place}</dd><dt>{content.config.counter_labels.talk}</dt><dd>{s.talk}</dd></>}
    </dl>
  );
}

export function App({ content }: { content: ContentBundle }) {
  // a paragraph that is only "::clue id::" is drawn as that clue (content/clues.yaml)
  const paras = (t: string) => t.trim().split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const m = CLUE_MARK.exec(p);
    return m ? <Clue content={content} id={m[1]!} /> : <p>{p}</p>;
  });
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<'story' | 'journal' | 'menu'>('story');
  const [page, setPage] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [making, setMaking] = useState<string | null>(null); // the start a hero is being made for
  const [preview, setPreview] = useState<EraId | null>(null); // a design being looked at from the menu; never saved
  const commit = (s: GameState | null) => { setState(s); setPage(0); if (s) { lsSet(SAVE_KEY, JSON.stringify(toSave(s, content))); keepPage(s, 0); } };
  const begin = (start: string, hero: HeroChoice) => { setMaking(null); commit(newGame(content, { start, seed: (Math.random() * 2 ** 31) >>> 0, hero })); setTab('story'); };

  const era: EraId = preview ?? (state ? eraOf(content, state) : 'now');
  useEffect(() => { wear(era); }, [era]);

  if (!state && making) return <Creation content={content} onBegin={(h) => begin(making, h)} onBack={() => setMaking(null)} />;

  if (!state) {
    const saved = load(content);
    return (
      <main class="title">
        <h1>{content.config.title}</h1>
        <p class="lede">{document.querySelector('meta[name="description"]')?.getAttribute('content')}</p>
        {!STORAGE_OK && <p class="warn">This browser is refusing to store anything for this page, so progress will not be kept. Menu &gt; Save code still works.</p>}
        <div class="stack">
          {saved && <button class="primary" data-act="continue" onClick={() => { setState(saved); setPage(pageFor(saved)); }}>Continue</button>}
          {startsOf(content).map((id, i) => (
            <button class={!saved && i === 0 ? 'primary' : ''} data-act={i === 0 ? 'new' : `new-${id}`} onClick={() => setMaking(id)}>
              <strong>{content.starts[id]!.label}</strong><br /><small>{content.starts[id]!.summary}</small>
            </button>
          ))}
        </div>
        <p class="hint">A prototype: the shed, and three days in Norway. About forty minutes. It ends at the door to the next place, which is not built.</p>
      </main>
    );
  }

  if (state.life) return <Years content={content} state={state} onChange={commit} onQuit={() => setState(null)} />;

  const v: SceneView = view(content, state);
  const pages = v.text.split(/^\s*\[break\]\s*$/m).map((t) => t.trim()).filter(Boolean);
  const last = page >= pages.length - 1;
  const act = (id: string) => {
    try { commit(choose(content, state, id).state); window.scrollTo(0, 0); } catch (e) { setNote((e as Error).message); }
  };
  const turn = (to: number) => { setPage(to); keepPage(state, to); window.scrollTo(0, 0); };
  const end = v.ended ? content.registry.endings[v.ended.ending] : undefined;
  return (
    <>
      {preview && <p class="preview" role="status"><span>Looking at {content.eras.eras[preview].label}{content.eras.eras[preview].built ? '' : '. Nothing is built there yet'}.</span><button data-act="preview-off" onClick={() => setPreview(null)}>Back</button></p>}
      <header class="hud"><span class="turn">{v.date}</span><span>{v.title}</span></header>
      {note && <p class="banner">{note} <button onClick={() => setNote(null)}>OK</button></p>}
      <main class="panel"><div class="leaf" key={`${state.scene}/${page}/${tab}/${era}`}>
        {tab === 'story' && <>
          {v.outcome?.text && page === 0 && <section class="outcome">{paras(v.outcome.text)}</section>}
          {v.card && page === 0 && <section class="card"><h2>{v.card.title}</h2>{v.card.subtitle && <p>{v.card.subtitle}</p>}{v.card.epigraph && <p class="hint">{v.card.epigraph}</p>}</section>}
          <h2>{v.title}</h2>
          {paras(pages[Math.min(page, pages.length - 1)] ?? '')}
          {v.ended
            ? <>{end && <section class="card"><h2>{end.label}</h2><p>{end.description}</p></section>}
                <h2>Where it leaves you</h2><You content={content} state={state} />
                <div class="stack">{canBegin(content, state) && <button class="primary" data-act="years" onClick={() => commit(beginLife(content, state))}>{content.season.screen.begin}</button>}
                  <button data-act="new" onClick={() => setState(null)}>Play it another way</button></div></>
            : !last
              ? <div class="stack"><button class="primary" data-action="continue" onClick={() => turn(page + 1)}>Continue</button><p class="hint">{page + 1} of {pages.length}</p></div>
              : v.choices.length === 1
                // one way on is a page turn, not a choice (docs/DESIGN.md section 4)
                ? <div class="stack"><button class="primary" data-action={v.choices[0]!.id} onClick={() => act(v.choices[0]!.id)}>{v.choices[0]!.text}</button></div>
                : <div class="stack roads">{v.deadEnd && <p class="warn">No choice is open here: this is a content bug. Menu &gt; Save code, and send it with a note.</p>}
                    {v.choices.map((c) => (
                      <button data-action={c.id} disabled={!c.available} class={c.lethal ? 'danger' : ''} onClick={() => act(c.id)}>
                        {c.text}
                        {c.warn && <><br /><small class="warn">{c.warn}</small></>}
                        {!c.available && c.lockReason && <><br /><small>{c.lockReason}</small></>}
                      </button>
                    ))}</div>}
        </>}
        {tab === 'journal' && <><h2>Journal</h2>{state.journal.length
          ? <ol class="journal">{[...state.journal].reverse().map((j) => <li><strong>{j.sceneTitle ?? j.scene}</strong>: {j.choice}</li>)}</ol>
          : <p class="empty">Empty so far: every choice you make is written here.</p>}
          <h2>What you have found</h2>
          {cluesFound(content, state).length ? <div class="found">{cluesFound(content, state).map((id) => <Clue content={content} id={id} />)}</div> : <p class="empty">Nothing yet.</p>}</>}
        {tab === 'menu' && <><h2>You</h2><You content={content} state={state} />
          <h2>Menu</h2><div class="stack">
          <button data-act="code" onClick={async () => { const c = await encodeSaveCode(toSave(state, content)); try { await navigator.clipboard.writeText(c); setNote('Save code copied.'); } catch { setNote(c); } }}>Save code (copy)</button>
          <button data-act="load-code" onClick={async () => { const t = prompt('Paste a save code'); if (!t) return; try { commit(fromSave(await decodeSaveCode(t.trim()), content).state); setTab('story'); } catch (e) { setNote(`That code did not load: ${(e as Error).message}`); } }}>Load a save code</button>
          <button data-act="quit" onClick={() => { setPreview(null); setState(null); }}>Back to the title</button></div>
          <p class="hint">Saves live in this browser on this device. A save code moves a game to another.</p>
          <h2>The four designs</h2>
          <p class="hint">The screen wears the era you are in. Two are built; all four can be looked at.</p>
          <div class="era-tiles">{ERA_IDS.map((e) => <button data-act={`era-${e}`} class={era === e ? 'on' : ''} onClick={() => { setPreview(e === eraOf(content, state) ? null : e); setTab('story'); }}>{content.eras.eras[e].label}</button>)}</div></>}
      </div></main>
      <nav class="tabs">
        {(['story', 'journal', 'menu'] as const).map((t) => <button data-tab={t} class={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'menu' ? 'You' : t[0]!.toUpperCase() + t.slice(1)}</button>)}
      </nav>
    </>
  );
}
