/** חוט · module-on — האם מודול פעיל בקונפיגורציה: מפתח חסר = פעיל; רק false מכבה.
 *  חוזה: module-on.contract.md · שקעים: אין.
 *  חולץ כלשונו מ-maor/src/lib/config.ts:15-17. */
export function moduleOn(cfg, m) {
  return cfg.modules[m] !== false;
}
