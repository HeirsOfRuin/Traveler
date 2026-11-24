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

export function Clue({ content, id }: { content: ContentBundle; id: string }) {
  const c = content.clues[id];
  if (!c) return <p class="warn">A clue is missing here ({id}).</p>;
  return (
    <figure class={`clue clue-${c.kind}`} aria-label={c.title}>
      <div class="clue-body">
        {c.lines.map((l) => <p>{l}</p>)}
        {c.boxed && <p class="boxed"><span>{c.boxed}</span></p>}
        {c.tally && <Tally n={c.tally} />}
        {c.mark === 'thumbprint' && <Thumb />}
      </div>
      <figcaption>{c.title}</figcaption>
    </figure>
  );
}
