/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextClosure — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:186-198 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextClosure, hebrewClosedWindows
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextClosure(config, todayIso) {
    const tel = config.telephony;
    if (!tel)
        return null;
    const city = tel.city || 'default';
    const tenant = { city, timezone: 'Asia/Jerusalem' };
    const wins = hebrewClosedWindows(todayIso, 10, tenant, {});
    const w = wins[0];
    if (!w)
        return null;
    const cityHe = (tel.city && CITIES[tel.city]) ? CITIES[tel.city].he : CITIES.jerusalem.he;
    return { reason: w.reason, kind: w.kind, startIso: w.startIso, candle: w.startTime, endIso: w.endIso, tzeis: w.endTime, cityHe };
}
/** מריץ תיאור-שיחה יחיד (למשתמש שמנסה מספר/שעה ספציפיים). */
