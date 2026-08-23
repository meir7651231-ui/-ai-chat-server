/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyAyinNames — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:534-556 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyAyinNames, emptyAyin, planAddName, mkId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyAyinNames(sp, names, mkId) {
    let a = sp.ayin ?? emptyAyin();
    let changed = false;
    for (const nm of names) {
        if (!planAddName(a, nm, '', '').ok)
            continue; // כפילות/ריק — דילוג שקט, בלי לשרוף מזהה
        const plan = planAddName(a, nm, '', mkId());
        if (plan.ok) {
            a = { ...a, names: plan.names };
            changed = true;
        }
    }
    return changed ? { ...sp, ayin: a } : sp;
}
/** מיזוג-היסטוריה אידמפוטנטי: לכל מפתח (תאריך|סכום|מטבע) הכמות הסופית =
 *  max(קיים, נכנס) — ייבוא-חוזר של אותו קובץ לא מכפיל, עסקאות-אמת כפולות
 *  באותו יום (אותו סכום פעמיים בקובץ אחד) נשמרות. משמר את **כל** שדות-הרשומה
 *  (מטא-דאטת-הסליקה: אסמכתא/מס'-עסקה/קבלה/מותג/…), לא רק d/a/c.
 *  ⚠️ המפתח נשאר d|a|c במכוון: כך ייבוא-חוזר של קובץ שיובא לפני שדה מס'-העסקה
 *  (בלי txn) מזוהה כאותה עסקה ולא משוכפל. */
