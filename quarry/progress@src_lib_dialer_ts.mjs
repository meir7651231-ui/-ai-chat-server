/** 🪨 טיוטת-חוט (דרגת-מחצבה) · progress — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:80-96 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): progress
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function progress(c) {
    const pending = new Set(c.queue);
    const remaining = pending.size;
    const counts = ZERO_COUNTS();
    const seen = {};
    for (const e of c.log) {
        if (REQUEUE_OUTCOMES.includes(e.outcome)) {
            const s = (seen[e.outcome] ??= new Set());
            if (s.has(e.id))
                continue;
            s.add(e.id);
        }
        counts[e.outcome]++;
    }
    return { total: c.total, remaining, finalized: Math.max(0, c.total - remaining), counts };
}
/** האם הקמפיין הסתיים (אין עוד מי לחייג). */
