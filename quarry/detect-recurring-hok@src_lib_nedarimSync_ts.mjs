/** 🪨 טיוטת-חוט (דרגת-מחצבה) · detectRecurringHok — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:236-278 (43 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): detectRecurringHok, modeStr, modeOf, monthsAgo
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function detectRecurringHok(supporters, todayIso, minMonths = 3) {
    let detected = 0;
    const out = supporters.map((sp) => {
        if (sp.hok && !sp.hok.kevaId)
            return sp; // הו"ק ידני — לא נוגעים
        // 🐛 נחיל-סולה C7: המנוע היה עיוור לסולה — 552 חיובים דולריים חוזרים לא מילאו הו"ק.
        const nd = (sp.hist ?? []).filter((h) => CLEARING_PROVIDERS.includes(h.clearer || '') && h.a > 0 && !!h.d);
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
/* ── שיוך-ידני של תשלום-נכנס לכרטיס (בסגנון בדיקת-הכפילויות, 19.8.2026) ──
   כשהסנכרון-האוטומטי לא הצליח להתאים עסקה (שם שונה/חסר), המזכירה בוחרת ידנית
   את הכרטיס. אותם מפתחות-שיוך של המנוע — כדי להציע מועמדים חכמים. טהור. */
/** מועמדים לשיוך עסקה לכרטיס — לפי מפתח-חזק (ToremId/ת"ז/טלפון/אימייל) או שם
 *  חסין-סדר (≥2 מילים). ממוין: מפתח-חזק קודם, שם אחרון. עד `limit`. */
