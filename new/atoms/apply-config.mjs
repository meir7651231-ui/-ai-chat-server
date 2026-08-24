/** חוט · apply-config — מפזר-קונפיג לשני מפעילי-זהות. חוזה: apply-config.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:911-915; השכנים applyTheme/applyFavicon
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function applyConfig(cfg, applyTheme, applyFavicon) {
  applyTheme(cfg.theme, cfg.accent, cfg.motion);
  applyFavicon(cfg.emoji);
}
