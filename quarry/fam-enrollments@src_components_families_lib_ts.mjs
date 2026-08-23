/** 🪨 טיוטת-חוט (דרגת-מחצבה) · famEnrollments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:69-78 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): famEnrollments
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function famEnrollments(db, fam) {
    const ids = new Set(fam.members.map((m) => m.id));
    return db.enrollments.filter((e) => ids.has(e.memberId));
}
/**
 * השיבוצים ה"חיים" של המשפחה — פעילים+מוקפאים בלבד. 'ended' כבר לא משתתף,
 * ו-'wait' (רשימת-המתנה) עדיין לא — ספירתם כ"השתתפות" ניפחה את עמודת/ציר
 * ה"חוגים" והציגה משפחה עם היסטוריה-בלבד כמשתתפת.
 */
