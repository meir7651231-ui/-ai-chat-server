/** חוט · public-site-on — האם האתר-הציבורי פעיל (דגל + site לא-מכובה).
 *  חוזה: public-site-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:637-641; השכן featureOn הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function publicSiteOn(cfg, featureOn, T) {
  return featureOn(cfg, T.k1) && !!cfg.site && cfg.site.enabled !== false;
}
