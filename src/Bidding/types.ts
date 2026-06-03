// The Photographer — v3 decision-tree FMV types.

export type EndingType = 'sensual' | 'horror';

export interface ChoiceDef {
  labelKey: string;      // i18n key for the choice button text
  nextId: string;        // node id to navigate to
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

export type Phase = 'playing' | 'choosing' | 'ending-card';
