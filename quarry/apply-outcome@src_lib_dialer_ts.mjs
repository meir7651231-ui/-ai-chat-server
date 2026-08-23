/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyOutcome — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:46-79 (34 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyOutcome, currentId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyOutcome(c, outcome, note, iso) {
    const id = currentId(c);
    if (!id)
        return c;
    const rest = c.queue.slice(1);
    const queue = REQUEUE_OUTCOMES.includes(outcome) ? [...rest, id] : rest;
    const entry = { id, outcome, at: iso };
    if (note && note.trim())
        entry.note = note.trim();
    return { ...c, queue, log: [...c.log, entry] };
}
const ZERO_COUNTS = () => ({
    donated: 0,
    noanswer: 0,
    refused: 0,
    callback: 0,
    done: 0,
    skip: 0,
});
/**
 * מדד-התקדמות: כמה נסגרו, כמה נותרו, וספירה פר-תוצאה.
 * תיקון (20.8): לא-ענה/דלג נספרים **פר-אדם** (ייחודי) ולא פר-ניסיון —
 * מי שלא ענה 3 פעמים הציג "📵 3" והטעה כאילו 3 אנשים לא ענו.
 */
