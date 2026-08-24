/** חוט · with-nedarim-hok — מילוי משבצת-ההו"ק מחיוב-נדרים חוזר (kevaId); ידני לא נדרס.
 *  חוזה: with-nedarim-hok.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:172-192 (תורגם TS→JS); השכנים
 *  curOf/hokDayFromDate הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function withNedarimHok(sp, charge, curOf, hokDayFromDate) {
    if (!(charge.amount > 0))
        return sp; // זיכוי/ביטול (Amount≤0) לא ממלא/מעדכן הו"ק
    const keva = (charge.kevaId || '').trim();
    if (!keva)
        return sp;
    if (sp.hok && !sp.hok.kevaId)
        return sp; // הו"ק ידני — לא דורסים
    const cd = (charge.d || charge.at || '').slice(0, 10);
    const prevStart = sp.hok?.startedAt || '';
    return {
        ...sp,
        hok: {
            amount: charge.amount,
            cur: curOf(charge),
            day: hokDayFromDate(cd),
            method: 'card',
            note: 'הו״ק נדרים · ' + keva,
            active: true,
            startedAt: prevStart && prevStart < cd ? prevStart : cd || prevStart || '',
            kevaId: keva,
        },
    };
}
