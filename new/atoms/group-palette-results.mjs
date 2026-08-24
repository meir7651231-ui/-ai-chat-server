/** חוט · group-palette-results — קיבוץ יציב של תוצאות-פלטה לדליי-סוג + כותרות section.
 *  חוזה: group-palette-results.contract.md
 *  חולץ כלשונו מ-maor/src/lib/paletteGroups.ts:51-64; השכנים buckets+bucketOf
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function groupPaletteResults(items, config, buckets, bucketOf) {
  const B = buckets(config);
  const indexed = items.map((it, i) => ({ it, i, b: bucketOf(it.key) }));
  indexed.sort((a, b) => a.b - b.b || a.i - b.i);
  const out = [];
  let lastLabel = '';
  for (const { it, b } of indexed) {
    const label = b < B.length ? B[b][1] : '';
    // שני דליים חולקים כותרת ('nav-'/'act-') — הכותרת לא מוכפלת
    out.push({ ...it, section: label && label !== lastLabel ? label : undefined });
    if (label) lastLabel = label;
  }
  return out;
}
