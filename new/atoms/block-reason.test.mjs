import { blockReason as __pure_blockReason } from './block-reason.mjs';
const __d_blockReason_BLOCK_REASON_T = {
  k1: "שבת",
  k2: "יום שישי (שעתיים לפני שבת)",
  k3: "תשעה באב (נדחה)",
  k4: "Tishri",
  k5: "Nisan",
  k6: "חול המועד",
};
// צילום-מקומי מ-block-reason-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const FULL_HOLIDAYS = [
  'ראש השנה',
  'ראש השנה ב׳',
  'יום כיפור',
  'סוכות',
  'שמחת תורה',
  'פסח',
  'שביעי של פסח',
  'שבועות',
  'תשעה באב',
];
const blockReason = (...a) => __pure_blockReason(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), FULL_HOLIDAYS, __d_blockReason_BLOCK_REASON_T);
// שקע hebParts — ההתנהגות האמיתית (Intl בלוח hebrew, חודש בשם אנגלי)
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
const hebParts = (d) => {
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
};
// שקע holidays — תת-המפה הרלוונטית מ-HOLIDAYS של maor (מפתח: '<חודש-אנגלי> <יום>')
const holidays = {
  'Tishri 1': 'ראש השנה',
  'Tishri 10': 'יום כיפור',
  'Tishri 15': 'סוכות',
  'Nisan 15': 'פסח',
  'Av 9': 'תשעה באב',
  'Adar 14': 'פורים',
};
const at = (iso) => new Date(iso + 'T12:00:00');
const C = [
  ['2026-08-29', true, 'שבת'],
  ['2026-08-28', true, 'יום שישי (שעתיים לפני שבת)'],
  ['2026-09-21', true, 'יום כיפור'],
  ['2026-09-28', true, 'חול המועד'],
  ['2022-08-07', true, 'תשעה באב (נדחה)'],
  ['2026-03-03', true, null], // פורים — במפה אך לא חג-מלא ⇒ אין חסימה
  ['2026-08-29', false, null], // הדגל כבוי — גם שבת לא נחסמת
];
let f = 0;
for (const [iso, on, w] of C) {
  const g = blockReason(at(iso), on, hebParts, holidays);
  if (g !== w) { console.error(`✗ ${iso} (blockingOn=${on}) ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1); console.log('✓ block-reason: 7 דוגמאות-חוזה — ירוק (כולל תשעה-באב-נדחה 7.8.2022)');
