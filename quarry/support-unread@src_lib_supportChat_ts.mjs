/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supportUnread — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:82-98 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supportUnread
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supportUnread(thread, side) {
    if (!thread)
        return 0;
    const n = side === 'admin' ? thread.unreadAdmin : thread.unreadUser;
    return typeof n === 'number' && n > 0 ? n : 0;
}
/** מיון הודעות-צוות לפי זמן עולה — יציב, לא-משנה-מקור. */
