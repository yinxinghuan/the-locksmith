// The Photographer — minimal i18n (en / zh). Choice labels + 8 endings only.

type Locale = 'zh' | 'en';

const STORAGE_KEY = 'photographer_locale';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const override = window.localStorage.getItem(STORAGE_KEY);
    if (override === 'zh' || override === 'en') return override;
  } catch {}
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en') || 'en';
  return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const LOCALE: Locale = detectLocale();

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    // ── Choices ────────────────────────────────────────────────────────────
    'choice.lower_strap':    'lower the strap',
    'choice.turn_to_light':  'turn to the light',
    'choice.and_the_other':  'and the other',
    'choice.step_closer':    'step closer',
    'choice.lie_down':       'lie down, slowly',
    'choice.see_mark':       'step closer to the mark',
    'choice.let_it_fall':    'let it fall',
    'choice.changed_mind':   "I've changed my mind",
    'choice.touch_shoulder': 'touch her shoulder',
    'choice.ask_leave':      'ask her to leave',
    'choice.turn_face':      'turn your face to me',
    'choice.lower_camera':   'set the camera down',
    'choice.ask_mark':       'who put that there',
    'choice.photograph_it':  'photograph it',

    // ── Endings ────────────────────────────────────────────────────────────
    'ending.AAA.title':   'the third hand',
    'ending.AAA.tagline': 'The slip fell. Three hands moved to catch it. She has two. Yours are not in the room.',
    'ending.AAB.title':   'where you never touched her',
    'ending.AAB.tagline': "A handprint, where your hand wasn't.",
    'ending.ABA.title':   'closer',
    'ending.ABA.tagline': "A photograph isn't what either of you came for.",
    'ending.ABB.title':   'the wrong rate',
    'ending.ABB.tagline': "What the mirror keeps for itself.",
    'ending.BAA.title':   'her face, your face',
    'ending.BAA.tagline': 'You have always wanted to photograph yourself.',
    'ending.BAB.title':   'set it down',
    'ending.BAB.tagline': 'You lie in the same pool of light.',
    'ending.BBA.title':   'last week',
    'ending.BBA.tagline': "You don't remember leaving the mark.",
    'ending.BBB.title':   'four exposures',
    'ending.BBB.tagline': 'The shutter is heavier than it was a minute ago.',

    // ── UI ─────────────────────────────────────────────────────────────────
    'ui.replay':         'shoot it again',
    'ui.ending_label':   'ending',
    'ui.sensual_label':  'sensual',
    'ui.horror_label':   'wrong',
    'ui.brand_sig':      'alteru · after dark',

    // ── Intro ──────────────────────────────────────────────────────────────
    'intro.title':   'the photographer',
    'intro.hint':    'A studio session in five minutes. Direct her. Tap the lights — or pick a phrase. Some choices end soft. Some end wrong.',
    'intro.cta':     'tap to begin',
  },

  zh: {
    'choice.lower_strap':    '把吊带放下来',
    'choice.turn_to_light':  '转向光',
    'choice.and_the_other':  '另一根也是',
    'choice.step_closer':    '走近一些',
    'choice.lie_down':       '慢慢躺下',
    'choice.see_mark':       '走近看那道印记',
    'choice.let_it_fall':    '让它滑下来',
    'choice.changed_mind':   '我改主意了',
    'choice.touch_shoulder': '触她的肩',
    'choice.ask_leave':      '请她离开',
    'choice.turn_face':      '把脸转过来',
    'choice.lower_camera':   '把相机放下',
    'choice.ask_mark':       '这是谁留下的',
    'choice.photograph_it':  '把它拍下来',

    'ending.AAA.title':   '第三只手',
    'ending.AAA.tagline': '她让它滑下。三只手伸过来接住了它。她有两只。你的手不在这间屋里。',
    'ending.AAB.title':   '你没碰过的地方',
    'ending.AAB.tagline': '一只手印, 你的手没去过。',
    'ending.ABA.title':   '更近一些',
    'ending.ABA.tagline': '照片不是你们俩来这里的目的。',
    'ending.ABB.title':   '慢了半拍',
    'ending.ABB.tagline': '镜子留下来的东西。',
    'ending.BAA.title':   '她的脸 你的脸',
    'ending.BAA.tagline': '你一直想拍下你自己。',
    'ending.BAB.title':   '放下',
    'ending.BAB.tagline': '你和她躺在同一个光池里。',
    'ending.BBA.title':   '上周',
    'ending.BBA.tagline': '你不记得自己留下了它。',
    'ending.BBB.title':   '四张曝光',
    'ending.BBB.tagline': '快门比一分钟前沉了。',

    'ui.replay':         '再拍一次',
    'ui.ending_label':   '结局',
    'ui.sensual_label':  '感官',
    'ui.horror_label':   '不对劲',
    'ui.brand_sig':      'alteru · after dark',

    // ── Intro ──────────────────────────────────────────────────────────────
    'intro.title':   '摄影师',
    'intro.hint':    '一场五分钟的私拍。你指导她。点亮灯 — 或选一句话。有的走向温柔, 有的走向不对劲。',
    'intro.cta':     '点屏幕开始',
  },
};

export function t(key: string): string {
  return STRINGS[LOCALE][key] ?? STRINGS.en[key] ?? key;
}

export function locale(): Locale { return LOCALE; }
