/** קופסת-חיבורים · origin-guard — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/lib/originGuard.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { S } from '../atoms/origin-guard-strings.mjs';
/** מארחים מקומיים תמיד-מותרים (פיתוח/בדיקה) — לא נחשבים "זרים". */
const LOCAL_HOSTS = new Set([S.k0, '127.0.0.1', '0.0.0.0', '::1']);
/** נורמליזציה: אותיות-קטנות, בלי www., בלי פורט. */
function normHost(h) {
    return (h || '').toLowerCase().trim().replace(/:\d+$/, '').replace(/^www\./, '');
}
/**
 * האם המארח הנוכחי "זר" (עותק-מגורר)? allowed=רשימת-מארחים-רשמיים. אחד מהם
 * יכול להיות סיומת (למשל `github.io` יתאים ל-`org.github.io`). מקומי ⇒ לעולם לא-זר.
 */
export function foreignHost(hostname, allowed) {
    if (!allowed || allowed.length === 0)
        return false; // דורמנטי — אין רשימה ⇒ אין בדיקה
    const h = normHost(hostname);
    // פרוטוקול-חיצוני: עיצוב-קונסולה/סיומת-מארח (חוק-6)
    if (!h || LOCAL_HOSTS.has(h) || h.endsWith('.local'))
        return false;
    const list = allowed.map(normHost).filter(Boolean);
    return !list.some((a) => h === a || h.endsWith('.' + a));
}
/**
 * הרצת-השומר (תופעת-לוואי מינימלית): כשהמארח זר — אזהרת-זכויות בקונסולה. אין
 * חסימת-אפליקציה (הרתעה בלבד). מדולג ב-Playwright ובלי DOM. מחזיר האם זוהה-זר.
 */
export function runOriginGuard(allowed, orgName) {
    if (typeof window === S.k1 || typeof navigator === S.k1)
        return false;
    if (navigator.webdriver)
        return false; // סוויטות-הדפדפן — אפס התערבות
    if (!foreignHost(window.location.hostname, allowed))
        return false;
    // אזהרה גלויה בקונסולה — הרתעה + עקבה. הזכויות של הבעלים.
    // eslint-disable-next-line no-console
    // פרוטוקול-חיצוני: עיצוב-קונסולה/סיומת-מארח (חוק-6)
    console.warn(`%c⚠️ ${orgName || S.k2}${S.k3}${window.location.hostname}`, 'color:#b45309;font-weight:800;font-size:14px', 'color:inherit');
    return true;
}
