/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hokEffectivelyActive — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:694-707 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hokEffectivelyActive, monthsAgoIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hokEffectivelyActive(sp, todayIso) {
    const h = sp.hok;
    if (!h || !h.active)
        return false;
    if (!h.kevaId)
        return true; // הו"ק ידני — אין לאפ-אוטומטי
    let last = '';
    // 🐛 נחיל-סולה C7: גם חיובי-סולה נחשבים "חיות" של הו"ק-סליקה
    for (const e of sp.hist ?? [])
        if ((e.clearer === 'נדרים' || e.clearer === 'סולה') && (e.d || '') > last)
            last = e.d || '';
    if (!last)
        return true; // עדיין אין היסטוריית-נדרים — סומכים על הדגל
    return monthsAgoIso(last, todayIso) <= 2;
}
/** האם חיוב-החודש של ההוראה כבר נרשם (חודש אזרחי נוכחי).
 *  כולל **חיוב-נדרים חוזר ב-hist** (19.8): נדרים גובה בעצמו, החיוב יושב ב-hist
 *  (לא ב-donations) ⇒ תורם שנדרים כבר חייב החודש לא יופיע כ"ממתין" בטעות. */
