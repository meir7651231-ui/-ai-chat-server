/** 🪨 טיוטת-חוט (דרגת-מחצבה) · productAssignments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:452-465 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): productAssignments
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function productAssignments(assignments, productId) {
    return assignments.filter((a) => a.productId === productId);
}
/* ---------- חיפוש/סינון/מיון (UX סינון 2) — טהור, smartFilter הקיים ---------- */
/**
 * תיקון (swarm-audit): "האם הרכיב מומש עכשיו" — מתנת-חג נבחנת מול מופע-החג
 * הקרוב **פר-שנה-עברית** (כמו needsCare ותג-הכרטיס), לא "מומש אי-פעם":
 * מתנה שנמסרה אשתקד נספרה כמומשת-לנצח — השיוך מוין אחרון, הוסתר ב"ממתינים
 * בלבד" והציג '3/3' בעוד needsCare התריע שהמתנה מגיעה. holidays = החגים
 * הקרובים (upcomingHolidays); בלי רשימה (או כשאין חג רלוונטי קרוב) —
 * ההתנהגות ההיסטורית (מימוש-חי כלשהו) נשמרת.
 */
