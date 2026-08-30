/** חוט · filter-ayin-board — סינון מסך-הטיפול של העין (טקסט/סטטוס/שלב).
 *  חוזה: filter-ayin-board.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:358-379 (תורגם TS→JS);
 *  ‏normSearch הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function filterAyinBoard(items, q, status, stage, normSearch, T) {
    const nq = normSearch(q);
    return items.filter((it) => {
        if (status === T.k1 && it.done)
            return false;
        if (status === T.k2 && !it.done)
            return false;
        if (stage && it.stage !== stage)
            return false;
        if (!nq)
            return true;
        return normSearch([it.supporter, it.name, it.note].join(' ')).includes(nq);
    });
}
