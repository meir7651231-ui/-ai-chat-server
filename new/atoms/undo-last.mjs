/** חוט · undo-last — ביטול הסיווג-האחרון בקמפיין-שיחות (חזרה לחזית-התור).
 *  חוזה: undo-last.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:106-115 (תורגם TS→JS);
 *  השכן REQUEUE_OUTCOMES הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function undoLast(c, requeueOutcomes) {
    const last = c.log[c.log.length - 1];
    if (!last)
        return c;
    let queue = c.queue;
    if (requeueOutcomes.includes(last.outcome)) {
        const at = queue.lastIndexOf(last.id);
        queue = at >= 0 ? [...queue.slice(0, at), ...queue.slice(at + 1)] : queue;
    }
    return { ...c, queue: [last.id, ...queue], log: c.log.slice(0, -1) };
}
