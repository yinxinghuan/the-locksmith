// The Locksmith — node tree (15 nodes, 8 endings).
//
//   root  (Beat 0: corridor, her half-open doorway)
//   ├── T  trust (Layer 1: she relaxes)
//   │   ├── TE enter
//   │   │   ├── TEP push    → 💖 sensual  (wine on the sofa)
//   │   │   └── TEQ pull    → 💖 sensual  (coffee at foyer)
//   │   └── TR refuse
//   │       ├── TRP push    → 💖 sensual  (walking her down barefoot)
//   │       └── TRQ pull    → 👹 horror   (man's laugh from her doorway)
//   └── S  suspect (Layer 1: she tightens)
//       ├── SE enter
//       │   ├── SEP push    → 👹 horror   (man in her bed)
//       │   └── SEQ pull    → 👹 horror   (her on phone — "he's leaving")
//       └── SR refuse
//           ├── SRP push    → 👹 horror   (rolled rug with bare foot)
//           └── SRQ pull    → 💖 sensual  reversal (she grabs your wrist crying)
//
// Pin coords are in IMAGE-percent (0-100) relative to the freeze frame.
// Engine maps to viewport via `-13 + p × 1.26` for 3:4 hero on 9:19+ phone.

import type { EndingType, NodeDef, ChoiceDef } from './types';

export const ROOT_ID = 'root';

function parentOf(id: string): string | null {
  if (id === 'root') return null;
  if (id.length === 1) return 'root';   // T, S → root
  return id.slice(0, -1);                // TE → T, TEP → TE
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

function ending(id: string, type: EndingType, startFrame?: string): NodeDef {
  return {
    id,
    video: `${id}.mp4`,
    posterFrame: posterFor(id),
    startFrame,
    endFrame: `${id}_end.png`,
    isEnding: true,
    endingType: type,
    endingTitleKey: `ending.${id}.title`,
    endingTaglineKey: `ending.${id}.tagline`,
  };
}

const ch = (labelKey: string, nextId: string, pinX: number, pinY: number): ChoiceDef =>
  ({ labelKey, nextId, pinX, pinY });

export const NODES: Record<string, NodeDef> = {
  // root: She stands half-open in the doorway, arms crossed, looking at you.
  //   T pin = her eyes/face (read her as trustworthy)
  //   S pin = the dark gap of door behind her (suspicious of what's inside)
  root: branch('root',
    ch('choice.trust_her',    'T', 50, 32),
    ch('choice.suspect_her',  'S', 56, 55),
  ),

  // T: She has dropped her arms, body softer. Choose: enter or work from threshold.
  T: branch('T',
    ch('choice.enter_trust',  'TE', 46, 50),
    ch('choice.refuse_trust', 'TR', 50, 80),
  ),

  // S: She has tightened arms, eyes flicked back. Choose: push in anyway or back off.
  S: branch('S',
    ch('choice.enter_suspect',  'SE', 50, 50),
    ch('choice.refuse_suspect', 'SR', 28, 70),
  ),

  // TE: Inside foyer, glimpse of living room. Choose: stay or finish & leave.
  TE: branch('TE',
    ch('choice.stay_inside',  'TEP', 65, 65),
    ch('choice.leave_polite', 'TEQ', 30, 50),
  ),

  // TR: You crouching at threshold, she on threshold with water. Push or pull.
  TR: branch('TR',
    ch('choice.walk_her_down', 'TRP', 50, 60),
    ch('choice.goodnight',     'TRQ', 28, 50),
  ),

  // SE: Inside foyer, she crowding you, rolled rug in living room. Push or out.
  SE: branch('SE',
    ch('choice.ask_about_door', 'SEP', 60, 50),
    ch('choice.wrong_job_out',  'SEQ', 28, 65),
  ),

  // SR: You half-stepped back, men's shoe in foyer behind her. Push or done.
  SR: branch('SR',
    ch('choice.wait_downstairs', 'SRP', 32, 70),
    ch('choice.done_here',       'SRQ', 28, 50),
  ),

  // Layer 3 — 8 endings.
  // Six of them cross spaces (foyer→bedroom, doorway→stairwell, etc). For
  // those, give the video a pre-beat startFrame so the engine hard-cuts to a
  // frame near the beat opening instead of asking the model to interpolate
  // across rooms in 5s. See feedback_fmv_5s_one_beat — 三同一近 rule.
  TEP: ending('TEP', 'sensual', 'TEP_start.png'),
  TEQ: ending('TEQ', 'sensual'),
  TRP: ending('TRP', 'sensual', 'TRP_start.png'),
  TRQ: ending('TRQ', 'horror',  'TRQ_start.png'),
  SEP: ending('SEP', 'horror',  'SEP_start.png'),
  SEQ: ending('SEQ', 'horror',  'SEQ_start.png'),
  SRP: ending('SRP', 'horror',  'SRP_start.png'),
  SRQ: ending('SRQ', 'sensual'),
};
