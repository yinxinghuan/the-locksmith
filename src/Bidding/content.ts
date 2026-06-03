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
//
// Pin coords are in IMAGE-percent (0-100) relative to the freeze frame.
// Engine maps to viewport via `-13 + p × 1.26` for 3:4 hero on 9:19+ phone.

import type { EndingType, NodeDef, ChoiceDef } from './types';

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

function branch(id: string, a: ChoiceDef, b: ChoiceDef): NodeDef {
  return {
    id,
    video: `${id}.mp4`,
    posterFrame: posterFor(id),
    endFrame: `${id}_end.png`,
    choices: [a, b],
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

// Helper: ChoiceDef factory with pin coords (image-percent).
const ch = (labelKey: string, nextId: string, pinX: number, pinY: number): ChoiceDef =>
  ({ labelKey, nextId, pinX, pinY });

export const NODES: Record<string, NodeDef> = {
  // root: Lin Wei standing on cyclorama, POV camera in foreground.
  // A pin = her left strap (her right from camera view, image-left).
  // B pin = the rim light source / her right shoulder lit area.
  root: branch('root',
    ch('choice.lower_strap',   'A', 36, 36),
    ch('choice.turn_to_light', 'B', 64, 38),
  ),

  // A: Looking back, one strap down. AA = the other strap (other shoulder).
  // AB = move camera closer to her face.
  A: branch('A',
    ch('choice.and_the_other', 'AA', 58, 36),
    ch('choice.step_closer',   'AB', 42, 30),
  ),

  // B: Profile with bruise visible. BA = lie down (bottom of frame).
  // BB = closer to mark on shoulder.
  B: branch('B',
    ch('choice.lie_down',      'BA', 50, 70),
    ch('choice.see_mark',      'BB', 58, 42),
  ),

  // AA: Both straps down. AAA = let it fall (down, on slip). AAB = changed mind (camera/away).
  AA: branch('AA',
    ch('choice.let_it_fall',   'AAA', 50, 60),
    ch('choice.changed_mind',  'AAB', 22, 40),
  ),

  // AB: Close-up of her face. ABA = touch shoulder. ABB = ask leave (away gesture).
  AB: branch('AB',
    ch('choice.touch_shoulder','ABA', 40, 50),
    ch('choice.ask_leave',     'ABB', 22, 40),
  ),

  // BA: She's lying down. BAA = ask her to turn face. BAB = put camera down (low POV).
  BA: branch('BA',
    ch('choice.turn_face',     'BAA', 50, 55),
    ch('choice.lower_camera',  'BAB', 22, 80),
  ),

  // BB: Close-up of shoulder with mark. BBA = ask "who put that there". BBB = photograph it.
  BB: branch('BB',
    ch('choice.ask_mark',      'BBA', 38, 30),
    ch('choice.photograph_it', 'BBB', 65, 55),
  ),

  // Layer 3 — endings (8)
  // AAA was originally a sensual ending (slip falls, intimate). The
  // generated video accidentally rendered a third hand catching the slip
  // — perfect material to flip into horror. Tagline reframes the moment.
  AAA: ending('AAA', 'horror'),
  AAB: ending('AAB', 'horror'),
  ABA: ending('ABA', 'sensual'),
  ABB: ending('ABB', 'horror'),
  BAA: ending('BAA', 'horror'),
  BAB: ending('BAB', 'sensual'),
  BBA: ending('BBA', 'horror'),
  BBB: ending('BBB', 'horror'),
};
