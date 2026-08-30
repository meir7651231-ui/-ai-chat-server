/** חוט · wa-app-link — קישור-אפליקציה whatsapp://send (הכרעת-בעלים 24.8 "שהקישור
 *  יתבצע אצלי, לא דרך wa.me"): קריאה ישירה לאפליקציה דרך מערכת-ההפעלה, בלי דומיין
 *  wa.me — עוקף חסימת-דומיין של סינון-כשר. בלי מספר תקין ⇒ null.
 *  חוזה: wa-app-link.contract.md · שקעים: waDigits
 *  מוצא: maor/src/lib/wa.ts · waAppLink (main 24-25.8; חוק-4 verbatim). */
export function waAppLink(phone, text = '', waDigits, T) {
  const digits = waDigits(phone);
  if (!digits) return null;
  const t = text.trim();
  return T.k1 + digits + (t ? T.k2 + encodeURIComponent(t) : '');
}
