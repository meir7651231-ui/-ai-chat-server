/** חוט · volunteer-route-stops — עצירות-המסלול של מתנדב ביום-חלוקה.
 *  חוזה: volunteer-route-stops.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:136-146 — עצמאי, אפס שקעים. */
export function volunteerRouteStops(db, dayId, volunteerId) {
  const out = [];
  for (const d of db.deliveries) {
    if (d.dayId !== dayId || d.volunteerId !== volunteerId) continue;
    const fam = db.families.find((f) => f.id === d.familyId);
    if (!fam) continue;
    const stop = [fam.address, fam.city].map((s) => (s || '').trim()).filter(Boolean).join(', ');
    if (stop) out.push(stop);
  }
  return out;
}
