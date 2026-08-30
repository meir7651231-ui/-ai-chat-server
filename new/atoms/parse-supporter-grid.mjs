/** חוט · parse-supporter-grid — פענוח רשת-תאים (CSV/xlsx) לשורות-ייבוא תומכות.
 *  חוזה: parse-supporter-grid.contract.md · שקעים: supNameKeys, parseAnyDate, excelSerialToIso
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:416-505 (השכנים שוקעו — חוק-1;
 *  isFinite = גלובל-שפה, אינו שקע). */
export function parseSupporterGrid(rows, supNameKeys, parseAnyDate, excelSerialToIso, T) {
  if (!rows.length) return [];
  // שורת-הכותרות = הראשונה (מבין 15 העליונות) שיש בה עמודת-שם ("שם"/"תורם").
  const hdrIdx = rows
    .slice(0, 15)
    .findIndex((r) => r.some((h) => supNameKeys.some((k) => (h ?? '').includes(k))));
  const header = (hdrIdx >= 0 ? rows[hdrIdx] : rows[0]).map((h) => (h ?? '').trim());
  const find = (keys) => header.findIndex((h) => keys.some((k) => h.includes(k)));
  let iName = find(supNameKeys);
  let iPhone = find([T.k1, T.k2]);
  let iEmail = find([T.k3, T.k4, T.k5]);
  let iId = find([T.k6, T.k7, T.k8]);
  let iAddr = find([T.k9]);
  let iCat = find([T.k10]);
  let iFor = find([T.k11, T.k12]);
  // קובץ מסוף-הסליקה (ExportHistory, 9.8): עמודות סכום/תאריך-עסקה/מטבע ⇒
  // כל שורה נושאת גם עסקה — נכנסת כהיסטוריה-ללא-קבלה (הכרעת-בעלים).
  const iAmount = find([T.k13]);
  const iTxDate = find([T.k14]);
  const iCur = find([T.k15]);
  // 13.8 — כל שאר עמודות-הסליקה נקלטות למטא-דאטה של רשומת-ההיסטוריה.
  const iRef = find([T.k16]);
  const iTxn = find([T.k17]);
  const iReceipt = find([T.k18]);
  const iBrand = find([T.k19]);
  const iLast4 = find([T.k20, T.k21]);
  const iClearer = find([T.k22, T.k23]);
  const iPays = find([T.k24]);
  const iStatus = find([T.k25]);
  let start = hdrIdx >= 0 ? hdrIdx + 1 : 1;
  if (iName < 0) {
    // אין שורת כותרות מזוהה — סדר עמודות קבוע
    iName = 0;
    iPhone = 1;
    iEmail = 2;
    iId = 3;
    iAddr = 4;
    iCat = 5;
    iFor = 6;
    start = 0;
  }
  const g = (r, i) => (i >= 0 ? (r[i] ?? '').trim() : '');
  const out = [];
  for (const r of rows.slice(start)) {
    const name = g(r, iName);
    if (!name) continue;
    const row = {
      name,
      phone: g(r, iPhone),
      email: g(r, iEmail),
      idNum: g(r, iId),
      address: g(r, iAddr),
      cat: g(r, iCat),
      forWho: g(r, iFor),
    };
    if (iAmount >= 0 && iTxDate >= 0) {
      const amount = Math.round(Number(g(r, iAmount).replace(/[^\d.-]/g, '')) * 100) / 100;
      // 'תאריך עסקה' מגיע עם שעה ("09/08/26 00:36") — התאריך בלבד. אם התא מספר-
      // סריאל של Excel (יצוא ששומר תאריך כמספר) — parseAnyDate נכשל ⇒ המרה מסריאל.
      const rawDate = g(r, iTxDate).split(' ')[0];
      const d = parseAnyDate(rawDate) || (/^\d+(\.\d+)?$/.test(rawDate) ? excelSerialToIso(Number(rawDate)) : '');
      if (isFinite(amount) && amount > 0 && d) {
        // 13.8 — מטא-דאטה: רק שדות שקיימים בפועל (נשארים undefined אחרת).
        const pays = Number(g(r, iPays));
        row.hist = [
          {
            d,
            a: amount,
            ...(/דולר|\$|usd/i.test(g(r, iCur)) ? { c: '$' } : {}),
            ...(g(r, iRef) ? { ref: g(r, iRef) } : {}),
            ...(g(r, iTxn) ? { txn: g(r, iTxn) } : {}),
            ...(g(r, iReceipt) ? { receipt: g(r, iReceipt) } : {}),
            ...(g(r, iBrand) ? { brand: g(r, iBrand) } : {}),
            ...(g(r, iLast4) ? { last4: g(r, iLast4) } : {}),
            ...(g(r, iClearer) ? { clearer: /נדרים|nedarim/i.test(g(r, iClearer)) ? T.k26 : g(r, iClearer) } : {}),
            ...(iPays >= 0 && isFinite(pays) && pays > 0 ? { pays } : {}),
            ...(g(r, iStatus) ? { status: g(r, iStatus) } : {}),
          },
        ];
      }
    }
    // 13.8 (בקשת-בעלים) — הוסר אוטומט-העי"ן: קטגוריה "הסרת עין הרע" היא ייעוד-
    // תרומה, לא הוראה לפתוח תיק-מעקב. תיק-עי"ן נפתח רק כשצוין במפורש (ידנית
    // בכרטיס/בלוח-העי"ן), לא מזיהוי-מחרוזת בקטגוריה. (ביטול הכרעת-9.8.)
    out.push(row);
  }
  return out;
}
