/** חוט · ayin-sheet-rows — שורות ייצוא גיליון-העיניים. חוזה: ayin-sheet-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:380-418 (legacy:196-198); הכותרת
 *  AYIN_SHEET_HEADER — שכנת-אותו-קובץ — הוטבעה כאן (אפס import פנימי, חוק-1). */
export const AYIN_SHEET_HEADER = [
  'תומכת',
  'טלפון',
  'שם למסירה',
  'כמה עיניים',
  'נמסר (כן/לא)',
  'שולם (כן/לא)',
  'תשובה/הערה',
  'עופרת בוצעה (כן/לא)',
];

export function ayinSheetRows(supporters) {
  const rows = [[...AYIN_SHEET_HEADER]];
  for (const sp of supporters) {
    const a = sp.ayin;
    if (!a) continue;
    const lastAns = a.answers[0];
    const leadDone = ['eyes', 'answer', 'done'].includes(a.stage) ? 'כן' : 'לא';
    for (const n of a.names) {
      rows.push([
        sp.name,
        sp.phone || '',
        n.name,
        n.eyes === '' || n.eyes == null ? '' : String(n.eyes),
        n.done ? 'כן' : 'לא',
        a.paid ? 'כן' : 'לא',
        (lastAns ? lastAns.note : a.answeredNote || '').replace(/,/g, ' '),
        leadDone,
      ]);
    }
  }
  return rows;
}
