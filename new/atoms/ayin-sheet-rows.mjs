/** חוט · ayin-sheet-rows — שורות ייצוא גיליון-העיניים. חוזה: ayin-sheet-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:380-418 (legacy:196-198); הכותרת
 *  AYIN_SHEET_HEADER — שכנת-אותו-קובץ — הוטבעה כאן (אפס import פנימי, חוק-1). */
export const makeAYIN_SHEET_HEADER = (T) => ([
  T.k1,
  T.k2,
  T.k3,
  T.k4,
  T.k5,
  T.k6,
  T.k7,
  T.k8,
]);

export function ayinSheetRows(supporters, T) {
  const rows = [[...makeAYIN_SHEET_HEADER(T)]];
  for (const sp of supporters) {
    const a = sp.ayin;
    if (!a) continue;
    const lastAns = a.answers[0];
    const leadDone = [T.k9, T.k10, T.k11].includes(a.stage) ? T.k12 : T.k13;
    for (const n of a.names) {
      rows.push([
        sp.name,
        sp.phone || '',
        n.name,
        n.eyes === '' || n.eyes == null ? '' : String(n.eyes),
        n.done ? T.k12 : T.k13,
        a.paid ? T.k12 : T.k13,
        (lastAns ? lastAns.note : a.answeredNote || '').replace(/,/g, ' '),
        leadDone,
      ]);
    }
  }
  return rows;
}
