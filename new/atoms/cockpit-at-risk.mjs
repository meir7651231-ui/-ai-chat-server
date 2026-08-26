/** חוט · cockpit-at-risk — Golden. חוזה: cockpit-at-risk.contract.md
 * מוצא: cockpit.ts:67 (cockpitAtRisk) + hasGiven:51 (inline) + COCKPIT_SILENT_DAYS=60 (inline). חוק-4 verbatim.
 * בסיכון-נטישה: נתן בעבר, בלי nextDate, שקט מעל הסף. ממוין מהשקט-ביותר.
 * שקעים: supCount, supLast (אטומי-Genesis) · daysSince (אח cockpit).
 */
export function cockpitAtRisk(supporters, todayIso, silentDays = 60, { supCount, supLast, daysSince }) {
  const hasGiven = (sp) => supCount(sp) > 0 && !!supLast(sp);
  return supporters
    .filter((sp) => {
      if (!hasGiven(sp)) return false;
      if (sp.nextDate) return false;
      return daysSince(supLast(sp), todayIso) >= silentDays;
    })
    .sort((a, b) => daysSince(supLast(b), todayIso) - daysSince(supLast(a), todayIso));
}
