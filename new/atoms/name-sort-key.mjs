/** חוט · name-sort-key — מפתח-שם חסין-סדר להשוואת-כפילויות. חוזה: name-sort-key.contract.md
 *  חולץ כלשונו מ-maor/src/lib/validate.ts:85-91; השכנים normSearch (פונקציית-נרמול)
 *  ו-NAME_TITLES (קבוע-שכן באותו קובץ) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function nameSortKey(t, normSearch, nameTitles) {
  const tokens = normSearch(t)
    .split(/\s+/)
    .filter((w) => w && !nameTitles.has(w));
  return tokens.slice().sort().join(' ');
}
