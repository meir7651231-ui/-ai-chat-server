/** חוט · gematria-value — אותיות⇒מספר (הכיוון ההפוך של gematria). חוזה: gematria-value.contract.md
 *  אותן טבלאות ואותם שקעים של gem: ערך אות = מקומה ב-U · ×T2.k7 ב-T · ×T2.k5 ב-H (10 ו-100 מהשקע, לא מהקוד).
 *  אות סופית (צורה, בלי רשימה): תו שאינו בטבלאות אבל התו שאחריו בקוד-היוניקוד כן ⇒ נספר כבסיסו (ך⇒כ ם⇒מ ן⇒נ ף⇒פ ץ⇒צ).
 *  תווים שאינם אותיות (גרש, גרשיים, רווח) מדולגים. נכתב ביד כחלקיק חדש (הכרעת-בעלים 23.9 «יש גימטריה, תחפש»). */
export function gemValue(s, U, T, H, T2) {
  const valueOf = (ch) => { let i = U.indexOf(ch); if (i > 0) return i; i = T.indexOf(ch); if (i > 0) return T2.k7 * i; i = H.indexOf(ch); if (i > 0 && ch.length === 1) return T2.k5 * i; return null; };
  let sum = 0, any = false;
  for (const ch of String(s ?? '')) {
    let v = valueOf(ch);
    if (v === null) v = valueOf(String.fromCodePoint(ch.codePointAt(0) + 1));   // צורה סופית ⇒ הבסיס = התו הבא
    if (v === null) continue;
    sum += v; any = true;
  }
  return any ? sum : null;
}
