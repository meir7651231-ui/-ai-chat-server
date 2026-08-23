/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hokRecordedThisMonth — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:708-725 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hokRecordedThisMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hokRecordedThisMonth(sp, todayIso) {
    if (!sp.hok)
        return false;
    const month = todayIso.slice(0, 7);
    const hok = sp.hok;
    const inDonations = sp.donations.some((d) => d.date.startsWith(month) && (d.cat === HOK_CAT || (d.amount === hok.amount && (d.cur || '₪') === hok.cur)));
    if (inDonations)
        return true;
    // חיוב-נדרים כלשהו החודש ⇒ נחשב "נרשם" — **בלי דרישת-סכום-מדויק** (הו"ק בסכום-
    // משתנה, למשל שזוהתה-רטרואקטיבית, לא תוצג שגוי כ"ממתין"); נפילה: התאמת-סכום-מדויק
    // לרשומת-hist שאינה נדרים (מקור-ישן/לגאסי).
    return (sp.hist ?? []).some((h) => (h.d || '').startsWith(month) && (h.clearer === 'נדרים' || h.clearer === 'סולה' || (h.a === hok.amount && (h.c || '₪') === hok.cur)));
}
/** התומכים שהו"ק-החודש שלהם טרם נרשמה — ממוינים לפי יום-החיוב.
 *  משתמש ב-hokEffectivelyActive (הו"ק-נדרים שפגה לא נספרת). */
