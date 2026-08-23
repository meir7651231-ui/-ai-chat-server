/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollSummary — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:81-133 (53 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollSummary, payBal, paidOf, findMember
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollSummary(e) {
    const presents = (e.presents ?? []).length;
    const absences = (e.absences ?? []).length;
    const noshow = (e.absences ?? []).filter((a) => a.noshow).length;
    const lastPresent = (e.presents ?? []).slice().sort().slice(-1)[0] ?? '';
    return {
        presents,
        absences,
        noshow,
        balance: payBal(e),
        paid: paidOf(e),
        statusLabel: STATUS_LABEL[e.status] ?? '',
        lastPresent,
    };
}
/** איתור בן/בת-משפחה + שם-משפחה לפי memberId (סריקת families.members). */
function findMember(db, memberId) {
    for (const f of db.families) {
        const m = f.members.find((x) => x.id === memberId);
        if (m)
            return { member: m, family: f.name || '' };
    }
    return { member: null, family: '' };
}
/**
 * בניית שורות-הרישום — מצטרף member+course+summary לכל שיבוץ של "השנה הנוכחית".
 * "השנה הנוכחית" = שיבוצים שאינם עצמם תוצר-רישום (renewedToId ריק בצד המקור לא
 * רלוונטי — מסננים לפי החוג/ההחלטה). דטרמיניסטי, ממויין לפי שם-תלמיד.
 */
