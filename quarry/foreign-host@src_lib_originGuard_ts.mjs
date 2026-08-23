/** 🪨 טיוטת-חוט (דרגת-מחצבה) · foreignHost — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/originGuard.ts:24-35 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): foreignHost, normHost
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function foreignHost(hostname, allowed) {
    if (!allowed || allowed.length === 0)
        return false; // דורמנטי — אין רשימה ⇒ אין בדיקה
    const h = normHost(hostname);
    if (!h || LOCAL_HOSTS.has(h) || h.endsWith('.local'))
        return false;
    const list = allowed.map(normHost).filter(Boolean);
    return !list.some((a) => h === a || h.endsWith('.' + a));
}
/**
 * הרצת-השומר (תופעת-לוואי מינימלית): כשהמארח זר — אזהרת-זכויות בקונסולה. אין
 * חסימת-אפליקציה (הרתעה בלבד). מדולג ב-Playwright ובלי DOM. מחזיר האם זוהה-זר.
 */
