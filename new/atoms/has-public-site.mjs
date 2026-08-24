/** חוט · has-public-site — האם להציג אתר-ציבורי (site קיים ולא-כובה-במפורש).
 *  חוזה: has-public-site.contract.md · חולץ כלשונו מ-maor/src/lib/publicSite.ts:242-244 */
export function hasPublicSite(config) {
  return !!config.site && config.site.enabled !== false;
}
