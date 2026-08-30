/** חוט · reenroll-counts — קודם אוטומטית (אפיון-Golden). חוזה: reenroll-counts.contract.md */
export function reenrollCounts(rows, T) {
    const c = { total: 0, yes: 0, no: 0, hold: 0, undecided: 0, renewed: 0 };
    for (const r of rows) {
        c.total++;
        if (r.renewed)
            c.renewed++;
        if (r.decision === T.k1)
            c.yes++;
        else if (r.decision === 'no')
            c.no++;
        else if (r.decision === T.k2)
            c.hold++;
        else
            c.undecided++;
    }
    return c;
}
/** מי מיועד לרישום המוני — "ממשיך" שעדיין לא נרשם. */
