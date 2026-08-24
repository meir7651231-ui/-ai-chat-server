/** חוט · org-enabled-modules — המודולים הדלוקים בארגון (רק false מכבה).
 *  חוזה: org-enabled-modules.contract.md · שקעים: allModules (מרשם-המודולים).
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts (ALL_MODULES שוקע). */
export function orgEnabledModules(orgConfig, allModules) {
  return allModules.filter((m) => orgConfig.modules?.[m] !== false);
}
