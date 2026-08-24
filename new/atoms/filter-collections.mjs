/** חוט · filter-collections — סינון היסטוריית-ריקוני-קופה (טווח כוללני + מבצע).
 *  חוזה: filter-collections.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:233-249 (תורגם TS→JS);
 *  ‏dateInRange הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function filterCollections(box, fromIso, toIso, campaignId, dateInRange) {
    return box.collections.filter((c) => dateInRange(c.date, fromIso, toIso) && (!campaignId || c.campaignId === campaignId));
}
