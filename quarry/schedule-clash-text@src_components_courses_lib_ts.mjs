/** 🪨 טיוטת-חוט (דרגת-מחצבה) · scheduleClashText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:497-522 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): scheduleClashText, sessionsOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function scheduleClashText(db, memberId, course) {
    const target = sessionsOf(course);
    for (const e of db.enrollments) {
        if (e.memberId !== memberId || e.status === 'ended' || e.courseId === course.id)
            continue;
        const other = db.courses.find((x) => x.id === e.courseId);
        if (!other)
            continue;
        for (const s1 of target) {
            for (const s2 of sessionsOf(other)) {
                if (s1.day === s2.day && !!s1.time && s1.time === s2.time) {
                    return '⚠ התנגשות לו"ז: כבר משובצ/ת ל"' + other.name + '" — יום ' + DAY_NAMES[s1.day] + ' ' + s1.time;
                }
            }
        }
    }
    return null;
}
/* ── יצירת משפחה מתוך שיבוץ (P1.10, feature courses.enroll.inlinecreate) ──
   ratchet: legacy saveEnrollNew (legacy-main-script.js:1318-1339) — בחירת משפחה
   קיימת או '__new'; שם חדש שכבר קיים (normName) לא יוצר כפילות אלא משתמש
   בקיימת. הצעת '__new' מופיעה רק לשאילתה ≥2 תווים בלי התאמה מדויקת (legacy:2188). */
