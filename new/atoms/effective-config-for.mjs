/** חוט · effective-config-for — קונפיג אפקטיבי לעובד/ת (הגבלה-בלבד + הדלקות-בסט).
 *  חוזה: effective-config-for.contract.md · שקעים: isOrgManager, overrideOf, grantable
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:205-220 (קריאות-השכן שוקעו). */
export function effectiveConfigFor(email, org, orgConfig, isOrgManager, overrideOf, grantable) {
  if (isOrgManager(email, org)) return orgConfig;
  const ov = overrideOf(email, org);
  if (!ov.modules && !ov.features) return orgConfig;
  const modules = { ...orgConfig.modules };
  for (const [m, v] of Object.entries(ov.modules ?? {})) if (v === false) modules[m] = false;
  const features = { ...orgConfig.features };
  for (const [k, v] of Object.entries(ov.features ?? {})) {
    if (v === false) features[k] = false;
    else if (v === true && grantable.has(k)) features[k] = true; // הדלקה פר-עובד
  }
  return { ...orgConfig, modules, features };
}
