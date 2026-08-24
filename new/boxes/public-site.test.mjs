/** בדיקת-קצה · קופסת public-site — דרך הקופסה בלבד (ownTest). */
import * as PS from './public-site.mjs';
import { readFileSync } from 'node:fs';

let f = 0;
const eq = (a, b, msg) => { const g = JSON.stringify(a), w = JSON.stringify(b); if (g !== w) { console.error(`✗ ${msg} ⇒ ${g} ≠ ${w}`); f = 1; } };

// 1) isRtl
eq(PS.isRtl('en'), false, 'isRtl en');
eq(PS.isRtl('he'), true, 'isRtl he');
eq(PS.isRtl('yi'), true, 'isRtl yi');

// 2) palette — נפילה ל-CORAL כשאין accent; שמירת-גוון עם accent
eq(PS.palette(), PS.CORAL, 'palette fallback=CORAL');
eq(PS.palette('').c1, '#EC9C9C', 'palette ריק⇒CORAL');
eq(PS.palette(undefined).word, '#E29392', 'palette undefined⇒CORAL');
{ const p = PS.palette('#3366cc'); if (!/^#[0-9a-f]{6}$/i.test(p.c2) || p.c2 === PS.CORAL.c2) { console.error('✗ palette accent לא נגזר', p.c2); f = 1; } }

// 3) vocab
eq(PS.vocab(false, 'he').navCta, 'לתרומה ♡', 'vocab עמותתי-he navCta');
eq(PS.vocab(false, 'en').heroCta, 'Donate now', 'vocab עמותתי-en');
eq(PS.vocab(true, 'en').heroCta, 'Get in touch', 'vocab מסחרי-en');
eq(PS.vocab(true, 'he').give, 'צרו קשר', 'vocab מסחרי-he give');

// 4) localize — נפילות
eq(PS.localize({ he: 'שלום', en: 'Hi' }, 'en'), 'Hi', 'localize en');
eq(PS.localize({ en: 'Hi' }, 'yi'), 'Hi', 'localize yi⇒he⇒ראשון');
eq(PS.localize({ he: 'שלום' }, 'yi'), 'שלום', 'localize yi⇒he');
eq(PS.localize('טקסט', 'he'), 'טקסט', 'localize מחרוזת');
eq(PS.localize(undefined, 'he'), '', 'localize undefined');
eq(PS.localize({ he: '   ' }, 'he'), '', 'localize רק-רווחים⇒ריק');

// 5) langs — מסונן/ייחודי/ברירת-מחדל
eq(PS.langs({ langs: ['en', 'he', 'en', 'zz'] }), ['en', 'he'], 'langs מסונן+ייחודי');
eq(PS.langs(undefined), ['he'], 'langs חסר⇒[he]');
eq(PS.langs({ langs: [] }), ['he'], 'langs ריק⇒[he]');

// 6) ui — נפילה לעברית
eq(PS.ui('he', 'donate'), 'לתרומה', 'ui he donate');
eq(PS.ui('en', 'goal'), 'Goal', 'ui en goal');
eq(PS.ui('zz', 'donate'), 'לתרומה', 'ui שפה-לא-מוכרת⇒he');
eq(PS.ui('en', 'nope'), '', 'ui מפתח-חסר⇒ריק');

// 7) campaign — עם nowMs מוזרק
const now = Date.parse('2026-09-01T00:00:00');
eq(PS.campaign({ goal: 1000, raised: 250, end: '2026-09-11' }, now),
  { goal: 1000, raised: 250, pct: 25, currency: '₪', daysLeft: 10, show: true }, 'campaign מלא');
eq(PS.campaign({ raised: 5 }, now).show, false, 'campaign בלי goal⇒show=false');
eq(PS.campaign({ goal: 1000, raised: 1500 }, now).pct, 100, 'campaign חסימת-100');

// 8) hasSite
eq(PS.hasSite({ site: {} }), true, 'hasSite site קיים');
eq(PS.hasSite({ site: { enabled: false } }), false, 'hasSite כובה');
eq(PS.hasSite({}), false, 'hasSite אין site');

// 9) donateUrl
eq(PS.donateUrl({ site: { donateUrl: 'https://a' } }), 'https://a', 'donateUrl ישיר');
eq(PS.donateUrl({ integrations: { payments: { payUrl: 'https://p' } } }), 'https://p', 'donateUrl payUrl');
eq(PS.donateUrl({}), null, 'donateUrl null');

// קבועים חשופים
eq(PS.LANGS, ['he', 'en', 'yi'], 'LANGS');
eq(PS.UI_LABELS.he.donate, 'לתרומה', 'UI_LABELS');

/* 🛡 מגן-הכרעה: קריאת מקור-הקופסה ואימות ההכרעות verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./public-site.mjs', import.meta.url), 'utf8');
const must = [
  ['const FALLBACK_PALETTE = CORAL_PALETTE', 'פלטת-הנפילה=CORAL'],
  ['const KNOWN_LANGS = SITE_LANGS', 'רשימת-שפות=SITE_LANGS'],
  ['const UI = SITE_UI_LABELS', 'תוויות=SITE_UI_LABELS'],
  ['sitePalette(accent, FALLBACK_PALETTE)', 'חיווט-פלטה'],
  ['siteLangs(site, KNOWN_LANGS)', 'חיווט-שפות'],
  ['siteUi(lang, key, UI)', 'חיווט-תוויות'],
  ['campaignProgress(c, nowMs)', 'nowMs=שקע-IO מוזרק'],
];
for (const [needle, name] of must) if (!src.includes(needle)) { console.error(`✗ מגן: הכרעה שונתה — ${name}`); f = 1; }
// אין קריאת Date.now() פנימית (nowMs מוזרק בלבד) — בודקים צורת-הקריאה, לא אזכור-בהערה
if (/Date\.now\s*\(/.test(src)) { console.error('✗ מגן: קריאת Date.now() פנימית — שקע-הזמן חייב להיות מוזרק'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת public-site: 9 חוטים + 3 קבועים · דוגמאות-חוזה ירוקות · מגן-הכרעה מאושר');
