/** חוט · deliveries-csv-rows — שורות-CSV של מסירות-החלוקה (SHOP7). חוזה: deliveries-csv-rows.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:114-135; השכנים termOf/statusLabel
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function deliveriesCsvRows(db, config, termOf, statusLabel) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const dayDate = (id) => db.distributionDays.find((d) => d.id === id)?.date ?? '';
  const famName = (id) => db.families.find((f) => f.id === id)?.name ?? '';
  const famAddr = (id) => {
    const f = db.families.find((x) => x.id === id);
    return f ? [f.address, f.city].map((s) => (s || '').trim()).filter(Boolean).join(', ') : '';
  };
  const volName = (id) => db.volunteers.find((v) => v.id === id)?.name ?? '';
  // גל ב׳: עמודת כתובת (שדרוג-פורמט מתועד)
  const rows = [['תאריך', T('entity.family', 'משפחה'), 'כתובת', 'מתנדב', 'סטטוס', 'הערה']];
  for (const d of db.deliveries) {
    rows.push([dayDate(d.dayId), famName(d.familyId), famAddr(d.familyId), volName(d.volunteerId), statusLabel(d.status), d.note ?? '']);
  }
  return rows;
}
