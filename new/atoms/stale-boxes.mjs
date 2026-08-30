/** חוט · stale-boxes — קופות-צדקה אצל משפחות שלא רוקנו ≥N יום (או מעולם).
 *  חוזה: stale-boxes.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:80-89 (תורגם TS→JS);
 *  השכנים isoOf ו-lastCollectionIso הוזרקו כשקעים (חוק-1 — אפס import פנימי);
 *  הסף TZ_STALE_DAYS=90 (אותו קובץ, שורה 77) הוטבע כברירת-מחדל של days. */
export function staleBoxes(boxes, todayIso, days = 90, isoOf, lastCollectionIso, T) {
    const cutoff = new Date(todayIso + 'T12:00:00');
    cutoff.setDate(cutoff.getDate() - days);
    const cut = isoOf(cutoff);
    return boxes.filter((b) => {
        if (b.status !== T.k1)
            return false;
        const last = lastCollectionIso(b) || b.since;
        return !!last && last <= cut;
    });
}
