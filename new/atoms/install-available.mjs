/** חוט · install-available — האם דיאלוג-התקנת-PWA זמין (נלכד beforeinstallprompt).
 *  חוזה: install-available.contract.md
 *  חולץ כלשונו מ-maor/src/lib/pwa.ts:32-34; מצב-המודול deferredInstall (האירוע
 *  שנלכד ע"י מאזין-DOM) הוזרק כשקע — הלכידה עצמה היא חיווט-דפדפן בקופסה (חוק-1). */
export function installAvailable(deferredInstall) {
  return deferredInstall !== null;
}
