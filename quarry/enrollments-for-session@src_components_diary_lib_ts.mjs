/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollmentsForSession — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:228-236 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollmentsForSession, sessionsOf, groupLabelOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollmentsForSession(db, c, sessionIndex) {
    const all = db.enrollments.filter((e) => e.courseId === c.id);
    const ss = sessionsOf(c);
    if (ss.length <= 1)
        return all;
    const label = groupLabelOf(ss[Math.min(sessionIndex, ss.length - 1)], sessionIndex);
    return all.filter((e) => !e.group || e.group === label);
}
/** ניצולת שבועית — מספר המפגשים השבועיים המשויכים לחדר (חוגים שלא הסתיימו). */
