/** חוט · call-stats — קודם אוטומטית (אפיון-Golden). חוזה: call-stats.contract.md */
export function callStats(calls) {
    const list = calls ?? [];
    let noanswer = 0;
    for (const c of list)
        if (c.outcome === 'noanswer')
            noanswer++;
    return { total: list.length, last: list.length ? list[list.length - 1].at : '', noanswer };
}
/**
 * שורות-CSV לסיכום הקמפיין (20.8) — שורה פר-ניסיון (כולל לא-ענה שחזרו),
 * בסדר-כרונולוגי; nameOf ממופה ב-caller (המנוע לא מכיר את ה-store). טהור.
 */
