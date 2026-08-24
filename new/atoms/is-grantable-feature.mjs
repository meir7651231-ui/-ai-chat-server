/** חוט · is-grantable-feature — האם מפתח הוא יכולת-הדלקה-פר-עובד.
 *  חוזה: is-grantable-feature.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:203-204; השכן
 *  GRANTABLE_STAFF_FEATURES הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function isGrantableFeature(key, grantableSet) {
  return grantableSet.has(key);
}
