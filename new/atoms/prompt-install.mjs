/** חוט · prompt-install — הרצת דיאלוג-התקנת PWA על אירוע-דחוי מוזרק.
 *  חוזה: prompt-install.contract.md
 *  חולץ כלשונו מ-maor/src/lib/pwa.ts:37-43; מצב-המודול deferredInstall הוזרק
 *  כשקע d (חוק-1/חוק-5 — האטום לא מכיר window; האיפוס = חיווט-קופסה). */
export async function promptInstall(d) {
  if (!d) return false;
  await d.prompt();
  return (await d.userChoice).outcome === 'accepted';
}
