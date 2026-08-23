/** 🪨 טיוטת-חוט (דרגת-מחצבה) · famLiveEnrollments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:79-86 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): famLiveEnrollments, famEnrollments
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function famLiveEnrollments(db, fam) {
    return famEnrollments(db, fam).filter((e) => e.status !== 'ended' && e.status !== 'wait');
}
/* ── מאתר המשפחות (גלגל הסינון) — עזרים טהורים (הועברו מ-FamilyFinder כדי
   שקובץ הרכיב יישאר רכיבים בלבד; משמש גם את FamiliesView) ── */
/** צירי הצלילה — לפי סדר הקדימות במקור. תוויות הצירים נגזרות מהמילון (config). */
