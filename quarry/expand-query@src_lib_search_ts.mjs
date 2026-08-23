/** 🪨 טיוטת-חוט (דרגת-מחצבה) · expandQuery — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/search.ts:129-148 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): expandQuery, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function expandQuery(q) {
    const nq = normSearch(q);
    const out = [q];
    if (!nq)
        return out;
    for (const [heb, aliases] of Object.entries(XLAT)) {
        if (normSearch(heb) === nq)
            out.push(...aliases);
        else if (aliases.some((a) => normSearch(a) === nq))
            out.push(heb);
    }
    return [...new Set(out)];
}
/**
 * ציון פריט מול שאילתה: לכל מילה בשאילתה — הציון הטוב ביותר על פני
 * (הרחבות × מונחים). כל מילה חייבת להתאים (AND); הציון הכולל הוא סכום המיטב.
 *
 * בנוסף — מעבר "ביטוי שלם": שאילתה רב-מילתית שכולה מפתח/כינוי ב-XLAT
 * ("בני ברק"↔"bnei brak", "פתח תקווה"↔"petah tikva") מורחבת כמכלול, כי
 * הפיצול-למילים היה מפספס תעתיקים רב-מילתיים לגמרי. max() בלבד — לעולם לא מוריד
 * ציון, כך שסמנטיקת ה-AND לשאילתות רגילות נשמרת.
 */
