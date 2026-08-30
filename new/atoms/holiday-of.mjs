/** חוט · holiday-of — שם החג בתאריך נתון (דיני חנוכה-ח'/צום-נדחה/תענית-אסתר-מוקדמת).
 *  חוזה: holiday-of.contract.md · חולץ כלשונו מ-maor/src/lib/hebrew.ts;
 *  התלויות hebParts / scanHebYear / HOLIDAYS הפכו שקעים (חוק-1). */
export function holidayOf(d, hebParts, scanHebYear, HOLIDAYS, T) {
  const p = hebParts(d);
  // חנוכה יום ח' (ג' טבת): קיים רק בשנה שכסלו בה חסר (29) — בשנה מלאה חנוכה
  // מסתיים ב-ב' טבת. שמירה על 8 ימים בדיוק בשתי סוגי-השנים.
  if (p.month === T.k1 && p.day === 3) {
    return scanHebYear(p.year).has30.has(T.k2) ? null : T.k3;
  }
  // 🐛 נחיל-עמוק (13.8): צום י״ז בתמוז / ט׳ באב שחלו בשבת — הצום נדחה ליום ראשון
  // (כמו ביומן-החדרים, לקח #21). לא מציגים "צום" על השבת אלא על יום-הדחייה.
  const dow = d.getDay();
  const key = `${p.month} ${p.day}`;
  if (dow === 6 && (key === T.k4 || key === 'Av 9')) return null; // שבת — הצום נדחה
  if (dow === 0 && p.month === T.k5 && p.day === 18) return T.k6;
  if (dow === 0 && p.month === 'Av' && p.day === 10) return T.k7;
  // דין-נדחה מלא (19.8) — אותו דפוס לשני הצומות הנותרים:
  // צום גדליה (ג' תשרי) שחל בשבת נדחה ליום ראשון (ד' תשרי) — קורה כשר"ה ביום חמישי.
  if (dow === 6 && key === T.k8) return null;
  if (dow === 0 && p.month === T.k9 && p.day === 4) return T.k10;
  // תענית אסתר (י"ג אדר) שחלה בשבת מוקדמת ליום חמישי (י"א אדר) — פורים ביום ראשון.
  if (dow === 6 && (key === T.k11 || key === T.k12)) return null;
  if (dow === 4 && p.day === 11 && (p.month === T.k13 || p.month === T.k14)) {
    return T.k15;
  }
  return HOLIDAYS[key] ?? null;
}
