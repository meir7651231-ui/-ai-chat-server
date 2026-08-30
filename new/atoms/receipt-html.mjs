/** 🔌 חוט · receipt-html — הקבלה כ-HTML מוכן-להדפסה (טהור — מחרוזת בלבד).
 *  מוצא: maor/src/lib/receipt.ts:165-195 כלשונו; ‏receiptLines הוזרק כשקע (חוק-1 —
 *  אפס import פנימי; מקור-האמת היחיד לתוכן נשאר אצל שורות-הטקסט).
 *  ‏esc = עוזר-פנימי לא-מיוצא במקור — נכלל (שם-תורם/ייעוד הם קלט חופשי, אסור שיוזרקו). */

/** @param o פרטי-הקבלה · @param receiptLines שקע: (o)=>string[] — שורות-הטקסט של הקבלה */
export function receiptHtml(o, receiptLines, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function esc(s) {
    return s.replace(/&/g, T.k1).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const lines = receiptLines(o).filter((x) => x !== '');
  const [first, ...rest] = lines;
  const body = rest.map((ln) => T.k2 + esc(ln) + T.k3).join('\n');
  return (
    T.k4 +
    T.k5 + esc(T.k6 + o.rid) + T.k7 +
    T.k8 +
    T.k9 +
    T.k10 +
    T.k11 +
    T.k12 +
    T.k13 +
    T.k14 +
    T.k15 +
    T.k16 + esc(first) + T.k3 +
    body +
    T.k17
  );
}
