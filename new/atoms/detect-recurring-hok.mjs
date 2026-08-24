/** חוט · detect-recurring-hok — זיהוי הוראות-קבע מתבנית-ה-hist ומילוי משבצת-ההו"ק.
 *  חוזה: detect-recurring-hok.contract.md · שקעים: clearingProviders, modeStr, modeOf, monthsAgo
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:236-278 (קריאות-השכן שוקעו). */
export function detectRecurringHok(supporters, todayIso, minMonths = 3, clearingProviders, modeStr, modeOf, monthsAgo) {
    let detected = 0;
    const out = supporters.map((sp) => {
        if (sp.hok && !sp.hok.kevaId)
            return sp; // הו"ק ידני — לא נוגעים
        // 🐛 נחיל-סולה C7: המנוע היה עיוור לסולה — 552 חיובים דולריים חוזרים לא מילאו הו"ק.
        const nd = (sp.hist ?? []).filter((h) => clearingProviders.includes(h.clearer || '') && h.a > 0 && !!h.d);
        if (!nd.length)
            return sp;
        // חיוב עם kevaId ⇒ הו"ק **ודאי** (גם חיוב-בודד). אחרת ⇒ תבנית: חיובי-נדרים
        // ב-≥minMonths חודשים **שונים** (סכום עשוי להשתנות בין שנים ⇒ לא דורשים
        // סכום-זהה; זה מה שהחמיץ ~400 תורמים ותיקים).
        const kevaCharge = nd.find((h) => h.kevaId);
        const distinctMonths = new Set(nd.map((h) => h.d.slice(0, 7)));
        if (!kevaCharge && distinctMonths.size < minMonths)
            return sp;
        detected++;
        // סכום/מטבע ההו"ק = השכיח (הו"ק חוזר); day = היום השכיח.
        const parts = modeStr(nd.map((h) => h.a + '|' + (h.c || '₪'))).split('|');
        const cur = parts[1] === '$' ? '$' : '₪';
        const dates = nd.map((h) => h.d).sort();
        return {
            ...sp,
            hok: {
                amount: Number(parts[0]),
                cur,
                day: Math.min(28, Math.max(1, modeOf(nd.map((h) => Number(h.d.slice(8, 10)) || 1)))),
                method: 'card',
                note: kevaCharge
                    ? 'הו״ק ' + (nd[0]?.clearer || 'סליקה') + ' · ' + kevaCharge.kevaId
                    : 'הו״ק ' + (nd[0]?.clearer || 'סליקה') + ' (זוהה מהיסטוריה · ' + distinctMonths.size + ' חודשים)',
                active: monthsAgo(dates[dates.length - 1], todayIso) <= 2,
                startedAt: dates[0],
                kevaId: kevaCharge?.kevaId || 'auto',
            },
        };
    });
    return { supporters: out, detected };
}
