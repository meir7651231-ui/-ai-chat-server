/** חוט · makeup-eligibility — זכאות-השלמה לחיסור. חוזה: makeup-eligibility.contract.md */
export function makeupEligibility(kind, justified, rawHrs, T) {
  if (kind === T.k1) return { eligible: false, dropsPunch: true };
  const earlyCancel = rawHrs != null && rawHrs >= 48;
  const eligible = justified || earlyCancel;
  return { eligible, dropsPunch: !eligible };
}
