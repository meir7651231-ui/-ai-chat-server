/** 🪨 טיוטת-חוט (דרגת-מחצבה) · repairCardsFromRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:367-404 (38 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): repairCardsFromRows, fillCardFromCharge
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function repairCardsFromRows(supporters, rows, label) {
    const map = new Map();
    for (const r of rows) {
        const k = (r.txnId || '').trim() || (r.reference || '').trim();
        if (k && !map.has(k))
            map.set(k, r);
    }
    if (!map.size)
        return { supporters, relabeled: 0, enriched: 0 };
    let relabeled = 0;
    let enriched = 0;
    const out = supporters.map((sp) => {
        const hist = sp.hist;
        if (!hist?.length)
            return sp;
        let touched = false;
        const mine = [];
        const next = hist.map((h) => {
            const key = (h.txn || '').trim() || (h.ref || '').trim();
            const row = key ? map.get(key) : undefined;
            if (!row)
                return h;
            mine.push(row);
            if (h.clearer === label)
                return h;
            touched = true;
            relabeled++;
            return { ...h, clearer: label };
        });
        if (!mine.length)
            return touched ? { ...sp, hist: next } : sp;
        let filled = { ...sp, hist: next };
        const before = filled;
        for (const row of mine)
            filled = fillCardFromCharge(filled, row);
        if (filled !== before)
            enriched++;
        if (filled !== before || touched)
            return filled;
        return sp;
    });
    return { supporters: out, relabeled, enriched };
}
/** ההתאמה-החזקה-ביותר לעסקה — לפי מפתח-**ודאי** בלבד (ToremId/ת"ז/טלפון/אימייל,
 *  לא שם-בלבד) או null. משמש לשיוך-אוטומטי-בטוח באצווה: שם-בלבד דורש אישור-ידני
 *  (סיכון להתאמת-שווא), לכן אינו נכלל כאן. */
