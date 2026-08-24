/** חוט · sup-allowed-keys — ערכי where('skey','in',…) לעובד/ת מוגבל/ת (≤29 ייעודים + משותף).
 *  חוזה: sup-allowed-keys.contract.md · חולץ כלשונו מ-maor/src/lib/supporterPartition.ts:61-69;
 *  הקבוע-השכן SHARED_SUP_KEY הוזרק כשקע sharedKey (חוק-1 — אפס import פנימי). */
export function supAllowedKeys(allowed, sharedKey) {
  const clean = [...new Set(allowed.map((s) => s.trim()).filter(Boolean))].slice(0, 29);
  return [...clean, sharedKey];
}
