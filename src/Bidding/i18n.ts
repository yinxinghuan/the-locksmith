// The Locksmith — minimal i18n (en / zh). Choice labels + 8 endings only.

type Locale = 'zh' | 'en';

const STORAGE_KEY = 'locksmith_locale';

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
    'choice.trust_her':       'OK. Show me the lock.',
    'choice.suspect_her':     "That door isn't locked.",
    'choice.enter_trust':     'Step inside.',
    'choice.refuse_trust':    "I'll work from here.",
    'choice.enter_suspect':   'Let me see inside.',
    'choice.refuse_suspect':  "Then I'm leaving.",
    'choice.stay_inside':     'Stay a while.',
    'choice.leave_polite':    'I should head out.',
    'choice.walk_her_down':   "I'll walk you down.",
    'choice.goodnight':       'Goodnight.',
    'choice.ask_about_door':  "What's behind that door?",
    'choice.wrong_job_out':   'Wrong job. I’m out.',
    'choice.wait_downstairs': "I'll wait downstairs.",
    'choice.done_here':       "I'm done here.",

    // ── Endings (taglines are placeholder — finalize after watching videos) ──
    'ending.TEP.title':   'the second glass',
    'ending.TEP.tagline': 'You said no. She kept pouring.',
    'ending.TEQ.title':   'her fingertips',
    'ending.TEQ.tagline': 'She held the cup until you took the cup.',
    'ending.TRP.title':   'one flight down',
    'ending.TRP.tagline': 'She followed you down barefoot. The stairwell was warmer than the corridor.',
    'ending.TRQ.title':   'the man who laughed',
    'ending.TRQ.tagline': 'You came alone. Up there, two people are awake.',
    'ending.SEP.title':   'her bed',
    'ending.SEP.tagline': "He sat up like he'd been waiting.",
    'ending.SEQ.title':   '"he\'s leaving"',
    'ending.SEQ.tagline': "She wasn't on the phone when you arrived.",
    'ending.SRP.title':   'the rug',
    'ending.SRP.tagline': 'One end was heavier than the other.',
    'ending.SRQ.title':   'a tear',
    'ending.SRQ.tagline': 'The wrist she caught was the warmest thing in the hallway.',

    // ── UI ─────────────────────────────────────────────────────────────────
    'ui.replay':         'another door',
    'ui.ending_label':   'ending',
    'ui.sensual_label':  'sensual',
    'ui.horror_label':   'wrong',
    'ui.brand_sig':      'alteru · after dark',

    // ── Intro ──────────────────────────────────────────────────────────────
    'intro.title':   'the locksmith',
    'intro.hint':    'An emergency call at 3:40 AM. The door behind her is already open. Read her. Choose how far you go.',
    'intro.cta':     'tap to begin',
  },

  zh: {
    'choice.trust_her':       '好, 让我看看锁',
    'choice.suspect_her':     '你这门没锁',
    'choice.enter_trust':     '我进去看看',
    'choice.refuse_trust':    '我在外面修就行',
    'choice.enter_suspect':   '我进去看一下',
    'choice.refuse_suspect':  '那我走了',
    'choice.stay_inside':     '再坐一会',
    'choice.leave_polite':    '我该走了',
    'choice.walk_her_down':   '我送你下楼',
    'choice.goodnight':       '保重',
    'choice.ask_about_door':  '那扇门后面是什么',
    'choice.wrong_job_out':   '找错人了, 我走',
    'choice.wait_downstairs': '我下楼等等看',
    'choice.done_here':       '我不管了',

    'ending.TEP.title':   '第二杯',
    'ending.TEP.tagline': '你说够了。她还在倒。',
    'ending.TEQ.title':   '她的指尖',
    'ending.TEQ.tagline': '那杯咖啡, 她端着, 直到你接过。',
    'ending.TRP.title':   '一层楼',
    'ending.TRP.tagline': '她赤脚跟你下了楼梯。楼道比走廊暖一点。',
    'ending.TRQ.title':   '笑出声的那个',
    'ending.TRQ.tagline': '你是一个人来的。楼上有两个人醒着。',
    'ending.SEP.title':   '她的床',
    'ending.SEP.tagline': '他坐起来, 像在等你。',
    'ending.SEQ.title':   '「他要走了」',
    'ending.SEQ.tagline': '你到的时候, 她没在打电话。',
    'ending.SRP.title':   '那卷地毯',
    'ending.SRP.tagline': '一头比另一头沉。',
    'ending.SRQ.title':   '一滴泪',
    'ending.SRQ.tagline': '走廊里最暖的, 是她抓住你手腕的那一处。',

    'ui.replay':         '换一扇门',
    'ui.ending_label':   '结局',
    'ui.sensual_label':  '感官',
    'ui.horror_label':   '不对劲',
    'ui.brand_sig':      'alteru · after dark',

    'intro.title':   '锁匠',
    'intro.hint':    '凌晨 3:40 的一通急修电话。她身后的门, 从里面是开的。读她 — 然后决定走多远。',
    'intro.cta':     '点屏幕开始',
  },
};

export function t(key: string): string {
  return STRINGS[LOCALE][key] ?? STRINGS.en[key] ?? key;
}

export function locale(): Locale { return LOCALE; }
