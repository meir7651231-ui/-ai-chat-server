/** חוט · allowed-designations-for — ייעודי-תרומה מותרים לעובד/ת.
 *  חוזה: allowed-designations-for.contract.md · שקעים: isOrgManager, overrideOf
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts (קריאות-השכן שוקעו). */
export function allowedDesignationsFor(email, org, isOrgManager, overrideOf) {
  if (isOrgManager(email, org)) return null;
  const d = overrideOf(email, org).designations;
  return d && d.length ? d : null;
}
