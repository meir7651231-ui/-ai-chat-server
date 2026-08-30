/** חוט · heb-parts — לועזי⇒עברי דרך Intl. חוזה: heb-parts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrew.ts */
export function hebParts(d, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const fmtParts = new Intl.DateTimeFormat(T.k1, { day: T.k2, month: T.k3, year: T.k2 });

  if (isNaN(d.getTime())) return { day: 0, month: '', year: 0 }; // תאריך שבור ⇒ חלקים בטוחים (כמו במקור)
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  return { day: +get(T.k4), month: get(T.k5), year: +get(T.k6) };
}
