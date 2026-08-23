/** 🪨 טיוטת-חוט (דרגת-מחצבה) · teacherIdOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:660-672 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): teacherIdOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function teacherIdOf(config, email) {
    const e = (email || '').trim().toLowerCase();
    const teachers = config.roles?.teachers;
    if (!e || !teachers)
        return null;
    for (const [k, v] of Object.entries(teachers))
        if (k.trim().toLowerCase() === e)
            return v;
    return null;
}
/**
 * האם המשתמש הנוכחי מנהל-על. ריק/חסר adminEmails = אין הגבלה (true לכולם, כמו
 * היום). מוגדר = רק מי שמיילו ברשימה (case-insensitive). ללא מייל מול רשימה
 * מוגדרת = לא-אדמין (משתמש-לקוח שאינו ברשימה).
 */
