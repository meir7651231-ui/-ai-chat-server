/** חוט · integration-setting — הגדרת-הרחבה כמחרוזת (trim, אחרת ''). חוזה: integration-setting.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:95-103. */
export function integrationSetting(cfg, key, field, T) {
  const v = cfg.integrations?.[key]?.[field];
  return typeof v === T.k1 ? v.trim() : '';
}
