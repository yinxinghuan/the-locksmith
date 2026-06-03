// The Photographer — v3 decision-tree FMV types.

export type EndingType = 'sensual' | 'horror';

export interface ChoiceDef {
  labelKey: string;      // i18n key for the choice button text
  nextId: string;        // node id to navigate to
  // Hotspot pin position on the freeze image (image-percent 0-100). Engine
  // maps to viewport-percent via `-13 + p × 1.26` (see [[platform-safe-area-13pct]]).
  pinX: number;
  pinY: number;
}

export interface NodeDef {
  id: string;
  video: string;         // filename in /public/videos/
  posterFrame?: string;  // filename in /public/stills/ — shown before video loads
  endFrame: string;      // filename in /public/stills/ — the freeze frame after video
  choices?: ChoiceDef[]; // omitted on endings
  isEnding?: boolean;
  endingType?: EndingType;
  endingTitleKey?: string;
  endingTaglineKey?: string;
}

export type Phase = 'intro' | 'playing' | 'choosing' | 'ending-card';
