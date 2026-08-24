/** חוט · collections-csv-rows — שורות-CSV של ריקוני קופות-הצדקה.
 *  חוזה: collections-csv-rows.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:281-301 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function collectionsCsvRows(db, config, termOf) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const rows = [['תאריך', 'רכז', 'קופה', T('entity.family', 'משפחה'), 'סכום', 'מבצע']];
  for (const b of db.tzBoxes) {
    const coord = db.tzCoordinators.find((c) => c.id === b.coordinatorId);
    const fam = db.families.find((f) => f.id === b.famId);
    for (const c of b.collections) {
      const camp = c.campaignId ? db.tzCampaigns.find((p) => p.id === c.campaignId) : undefined;
      rows.push([c.date, coord?.name ?? '', '#' + b.num, fam?.name ?? '', c.amount, camp?.name ?? '']);
    }
  }
  return rows;
}
