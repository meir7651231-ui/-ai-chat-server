/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hokDue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:726-733 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hokDue, hokEffectivelyActive, hokRecordedThisMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hokDue(supporters, todayIso) {
    return supporters
        .filter((sp) => hokEffectivelyActive(sp, todayIso) && !hokRecordedThisMonth(sp, todayIso))
        .sort((a, b) => (a.hok?.day ?? 0) - (b.hok?.day ?? 0));
}
/** סה"כ הו"ק חודשי פעיל בש"ח-שקול (ההכנסה-הקבועה) — לפי שער-הדולר העריך.
 *  todayIso (אופציונלי) ⇒ מנכה הו"ק-נדרים שפגה (>2 חודשים בלי חיוב). */
