/** 🪨 טיוטת-חוט (דרגת-מחצבה) · appendCall — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:126-132 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): appendCall
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function appendCall(calls, outcome, iso) {
    if (outcome === 'skip')
        return calls;
    const next = [...(calls ?? []), { at: iso, outcome }];
    return next.length > CALL_LOG_CAP ? next.slice(next.length - CALL_LOG_CAP) : next;
}
/** ביטול-סיווג ⇒ הסרת רישום-השיחה האחרון (בן-הזוג של appendCall ב-undo). */
