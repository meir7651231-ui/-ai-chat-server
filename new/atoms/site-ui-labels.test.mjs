import { SITE_UI_LABELS } from './site-ui-labels.mjs';
let f = 0;
const err = (m) => { console.error('✗ ' + m); f = 1; };
// ערבות 1: בדיוק 3 שפות, לכולן אותה קבוצת-מפתחות בת 16
const KEYS = ['donate', 'contact', 'enter', 'services', 'story', 'news', 'gallery', 'campaign',
  'raised', 'goal', 'daysLeft', 'call', 'whatsapp', 'email', 'poweredBy', 'dir'];
const langs = Object.keys(SITE_UI_LABELS).sort();
if (JSON.stringify(langs) !== JSON.stringify(['en', 'he', 'yi'])) err(`שפות: ${langs}`);
for (const lang of langs) {
  const got = Object.keys(SITE_UI_LABELS[lang]).sort();
  if (JSON.stringify(got) !== JSON.stringify([...KEYS].sort()))
    err(`קבוצת-המפתחות של ${lang} שונה: ${got}`);
}
// ערבות 2: ערכים verbatim
const C = [
  ['he', 'donate', 'לתרומה'],
  ['en', 'donate', 'Donate'],
  ['yi', 'donate', 'שפּענדן'],
  ['he', 'poweredBy', 'מופעל על-ידי מאור'],
  ['en', 'raised', 'Raised'],
  ['yi', 'goal', 'ציל'],
  // ערבות 3: כיווני-כתיבה
  ['he', 'dir', 'rtl'],
  ['en', 'dir', 'ltr'],
  ['yi', 'dir', 'rtl'],
];
for (const [lang, key, w] of C) {
  const g = SITE_UI_LABELS[lang][key];
  if (g !== w) err(`${lang}.${key} = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
}
if (f) process.exit(1);
console.log('✓ site-ui-labels: 3 ערבויות (3 שפות × 16 מפתחות + 9 ערכי-verbatim) — ירוק');
