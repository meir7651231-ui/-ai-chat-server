/** חוט · don-allowed-keys — ערכי-in מותרים לשאילתת-תרומות מפוצלת. חוזה: don-allowed-keys.contract.md
 *  חולץ כלשונו מ-maor/src/lib/donationPartition.ts:34-37; הקבוע-השכן
 *  SHARED_PURPOSE_KEY הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function donAllowedKeys(allowed, sharedPurposeKey, T) {
  const clean = [...new Set(allowed.map((s) => s.trim()).filter(Boolean))].slice(0, T.k1);
  return [...clean, sharedPurposeKey];
}
