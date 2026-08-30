/** חוט · candidate-supporters-for-charge — מועמדים לשיוך עסקה לכרטיס-תורם.
 *  חוזה: candidate-supporters-for-charge.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:279-302; השכנים keysOf +
 *  nameSortKey הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function candidateSupportersForCharge(charge, supporters, limit = 8, keysOf, nameSortKey, T) {
    const ck = new Set(keysOf({ extId: charge.toremId, zeout: charge.zeout, phone: charge.phone, email: charge.email }));
    const cName = nameSortKey(charge.name || '');
    const scored = [];
    for (const sp of supporters) {
        const sk = keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email });
        let score = 0;
        for (const k of sk) {
            if (!ck.has(k))
                continue;
            if (k.startsWith(T.k1))
                score = Math.max(score, 5);
            else if (k.startsWith('id:'))
                score = Math.max(score, 4);
            else if (k.startsWith('ph:'))
                score = Math.max(score, 3);
            else if (k.startsWith('em:'))
                score = Math.max(score, 2);
        }
        if (!score && cName && cName.includes(' ') && nameSortKey(sp.name) === cName)
            score = 1;
        if (score)
            scored.push({ sp, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((x) => x.sp);
}
