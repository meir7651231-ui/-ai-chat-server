/** חוט · all-off-config — קונפיג-לידה all-off לארגון חדש. חוזה: all-off-config.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:58-64; השכנים ALL_MODULES
 *  ו-DEFAULT_CONFIG הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function allOffConfig(slug, orgName, allModules, defaultConfig) {
  const modules = {};
  for (const m of allModules) modules[m] = false;
  return { ...defaultConfig, slug, orgName, modules, features: {}, terms: {} };
}
