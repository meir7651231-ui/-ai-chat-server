/** 🪨 טיוטת-חוט (דרגת-מחצבה) · duplicateCourse — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:340-353 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): duplicateCourse
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function duplicateCourse(c, newId, dates) {
    return { ...c, id: newId, name: c.name + ' (עותק)', start: dates.start, end: dates.end };
}
/** חיסורים-זכאים-להשלמה (makeup===true) — אופציונלית פר-חוג. לא-מתוזמנים קודם. */
