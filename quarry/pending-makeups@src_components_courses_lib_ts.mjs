/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pendingMakeups — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:354-367 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pendingMakeups
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pendingMakeups(enrollments, courseId) {
    const out = [];
    for (const e of enrollments) {
        if (e.status === 'ended' || e.status === 'wait')
            continue;
        if (courseId && e.courseId !== courseId)
            continue;
        for (const a of e.absences) {
            if (!a.makeup)
                continue;
            out.push({ enrollmentId: e.id, memberId: e.memberId, courseId: e.courseId, date: a.date, reason: a.reason, makeupDate: a.makeupDate });
        }
    }
    return out.sort((x, y) => (x.makeupDate ? 1 : 0) - (y.makeupDate ? 1 : 0) || x.date.localeCompare(y.date));
}
/** רשימת-ההמתנה של חוג — status 'wait', לפי סדר-ההצטרפות (FIFO). */
