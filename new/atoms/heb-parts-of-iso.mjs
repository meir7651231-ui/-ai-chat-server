/** חוט · heb-parts-of-iso — hebParts ממומואיז לפי מחרוזת-ISO, מטמון חסום (3000).
 *  חוזה: heb-parts-of-iso.contract.md · חולץ כלשונו מ-maor/src/lib/hebrew.ts:137-147;
 *  השכן hebParts הוזרק כשקע (חוק-1 — חייב להיות דטרמיניסטי, ראה חוזה). */
const hpCacheShared = new Map();
export function hebPartsOfIso(iso, hebParts, HP_CACHE_MAX) {
  let hp = hpCacheShared.get(iso);
  if (!hp) {
    if (hpCacheShared.size >= HP_CACHE_MAX) hpCacheShared.clear();
    hp = hebParts(new Date(iso.slice(0, 10) + 'T12:00:00'));
    hpCacheShared.set(iso, hp);
  }
  return hp;
}
