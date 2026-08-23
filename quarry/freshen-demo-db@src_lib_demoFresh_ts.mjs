/** 🪨 טיוטת-חוט (דרגת-מחצבה) · freshenDemoDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/demoFresh.ts:32-51 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): freshenDemoDb, daysBetween, shift
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function freshenDemoDb(db, todayIso) {
    const delta = daysBetween(DEMO_ANCHOR, todayIso);
    if (!delta)
        return db;
    return {
        ...db,
        courses: db.courses.map((c) => ({ ...c, start: shift(c.start, delta), end: shift(c.end, delta) })),
        events: db.events.map((e) => ({ ...e, date: shift(e.date, delta) })),
        distributionDays: db.distributionDays.map((d) => ({
            ...d,
            date: shift(d.date, delta),
            createdAt: shift(d.createdAt, delta),
        })),
        enrollments: db.enrollments.map((en) => ({
            ...en,
            dueDate: shift(en.dueDate, delta),
            enrolledAt: shift(en.enrolledAt, delta),
        })),
    };
}
