/** חוט · integration-on — האם הרחבה פעילה (opt-in: חסר=כבוי). חוזה: integration-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:82-89. */
export function integrationOn(cfg, key) {
  return cfg.integrations?.[key]?.enabled === true;
}
