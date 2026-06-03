// The Photographer — node tree (15 nodes, 8 endings).
//
//   root
//   ├── A "lower the strap"        ← intimate route
//   │   ├── AA "and the other"
//   │   │   ├── AAA "let it fall"        → 💖 sensual
//   │   │   └── AAB "I changed my mind"  → 👹 horror
//   │   └── AB "step closer"
//   │       ├── ABA "touch her shoulder" → 💖 sensual
//   │       └── ABB "ask her to leave"   → 👹 horror
//   └── B "turn to the light"      ← technical route
//       ├── BA "lie down"
//       │   ├── BAA "turn her face"      → 👹 horror
//       │   └── BAB "lower the camera"   → 💖 sensual
//       └── BB "step closer to mark"
//           ├── BBA "ask about it"       → 👹 horror
//           └── BBB "photograph it"      → 👹 horror

import type { EndingType, NodeDef } from './types';

export const ROOT_ID = 'root';

// Each video's first frame visually equals its parent's last frame (chain
// continuity), so we use the parent's end-frame as the <video poster=...> for
// each non-root node. This prevents the brief "wrong frame" flash before the
// video starts loading.
function parentOf(id: string): string | null {
  if (id === 'root') return null;
  if (id.length === 1) return 'root';   // A, B → root
  return id.slice(0, -1);                // AA → A, AAA → AA, etc.
}

function posterFor(id: string): string {
  const p = parentOf(id);
  return p ? `${p}_end.png` : 'root_start.png';
}

function branch(id: string, aKey: string, aNext: string, bKey: string, bNext: string): NodeDef {
  return {
    id,
    video: `${id}.mp4`,
    posterFrame: posterFor(id),
    endFrame: `${id}_end.png`,
    choices: [
      { labelKey: aKey, nextId: aNext },
      { labelKey: bKey, nextId: bNext },
    ],
  };
}

function ending(id: string, type: EndingType): NodeDef {
  return {
    id,
    video: `${id}.mp4`,
    posterFrame: posterFor(id),
    endFrame: `${id}_end.png`,
    isEnding: true,
    endingType: type,
    endingTitleKey: `ending.${id}.title`,
    endingTaglineKey: `ending.${id}.tagline`,
  };
}

export const NODES: Record<string, NodeDef> = {
  root: branch('root', 'choice.lower_strap', 'A', 'choice.turn_to_light', 'B'),

  // Layer 1
  A: branch('A', 'choice.and_the_other', 'AA', 'choice.step_closer', 'AB'),
  B: branch('B', 'choice.lie_down',      'BA', 'choice.see_mark',     'BB'),

  // Layer 2
  AA: branch('AA', 'choice.let_it_fall',    'AAA', 'choice.changed_mind', 'AAB'),
  AB: branch('AB', 'choice.touch_shoulder', 'ABA', 'choice.ask_leave',    'ABB'),
  BA: branch('BA', 'choice.turn_face',      'BAA', 'choice.lower_camera', 'BAB'),
  BB: branch('BB', 'choice.ask_mark',       'BBA', 'choice.photograph_it','BBB'),

  // Layer 3 — endings (8)
  AAA: ending('AAA', 'sensual'),
  AAB: ending('AAB', 'horror'),
  ABA: ending('ABA', 'sensual'),
  ABB: ending('ABB', 'horror'),
  BAA: ending('BAA', 'horror'),
  BAB: ending('BAB', 'sensual'),
  BBA: ending('BBA', 'horror'),
  BBB: ending('BBB', 'horror'),
};
