/** חוט · wa-href — בורר-סכמה לפי הקונפיג: appScheme ⇒ whatsapp:// (קריאה-ישירה);
 *  אחרת wa.me (ביט-זהה להיום). מחזיר גם דגל-אפליקציה כדי שהצרכן ידע לא לפתוח
 *  target=_blank (סכמת-אפליקציה ⇒ אין טאב חדש). בלי מספר תקין ⇒ null.
 *  חוזה: wa-href.contract.md · שקעים: waAppLink · waLink
 *  מוצא: maor/src/lib/wa.ts · waHref (main 24-25.8; חוק-4 verbatim). */
export function waHref(phone, text, appScheme, waAppLink, waLink) {
  const href = appScheme ? waAppLink(phone, text) : waLink(phone, text);
  return href ? { href, app: appScheme } : null;
}
