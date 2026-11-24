// A clue, drawn: a letter, a torn note, a strip of masking tape, a page of the notebook, marks cut
// in stone. The words come from content/clues.yaml; the drawing is CSS and a little inline SVG
// (src/ui/clues.css). A clue looks the same in every era: it is the thing itself, not the screen.
import type { ContentBundle } from '../content/schema';

/** Tally marks as they are scratched: fours, with a fifth across. */
function Tally({ n }: { n: number }) {
  const marks = [];
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), k = i % 5, x0 = 8 + g * 46;
    marks.push(k < 4
      ? <line x1={x0 + k * 8} y1={5 + (k % 2)} x2={x0 + k * 8 + 1.5} y2={29 - (k % 2) * 2} />
      : <line x1={x0 - 5} y1={24} x2={x0 + 30} y2={9} />);
  }
  const w = 16 + Math.ceil(n / 5) * 46;
  return <svg class="tally" viewBox={`0 0 ${w} 34`} width={w} height="34" role="img" aria-label={`${n} tally marks`}><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">{marks}</g></svg>;
}

const Thumb = () => (
  <svg class="thumb" viewBox="0 0 40 52" width="40" height="52" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
      {[4, 8, 12, 16, 20].map((r) => <ellipse cx="20" cy="27" rx={r * 0.8} ry={r * 1.15} stroke-dasharray={`${r * 2.2} ${r * 0.5}`} />)}
    </g>
  </svg>
);

/** His drawing in the ashes: a hull, a mast, a sail set along the ship and not across it, and the wind. */
const Ship = () => (
  <svg class="art" viewBox="0 0 200 120" role="img" aria-label="A drawing of a ship with its sail set along the hull, and an arrow for the wind">
    <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 84 Q100 110 178 84 Q170 96 150 100 L50 100 Q30 96 22 84" />
      <path d="M100 98 L100 22" />
      <path d="M100 26 L160 84 L100 84" />
      <path d="M100 100 L100 114 M88 114 L112 114" />
      <path d="M186 30 L140 44 M140 44 L150 36 M140 44 L151 50" stroke-dasharray="1 0" />
    </g>
  </svg>
);
/** A rune cut with a knife: the one for U. Drawn, because not every phone has a face with runes in it. */
const Rune = () => (
  <svg class="art rune" viewBox="0 0 40 60" width="34" height="52" role="img" aria-label="A rune">
    <path d="M10 56 L10 6 L30 30 L30 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" />
  </svg>
);

export function Clue({ content, id }: { content: ContentBundle; id: string }) {
  const c = content.clues[id];
  if (!c) return <p class="warn">A clue is missing here ({id}).</p>;
  return (
    <figure class={`clue clue-${c.kind}`} aria-label={c.title}>
      <div class="clue-body">
        {c.art === 'ship' && <Ship />}
        {c.art === 'rune' && <Rune />}
        {c.lines.map((l) => <p>{l}</p>)}
        {c.boxed && <p class="boxed"><span>{c.boxed}</span></p>}
        {c.tally && <Tally n={c.tally} />}
        {c.mark === 'thumbprint' && <Thumb />}
      </div>
      <figcaption>{c.title}</figcaption>
    </figure>
  );
}
