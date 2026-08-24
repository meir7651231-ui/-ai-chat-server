/** חוט · override-column — דריסת-עמודה בשורות-ייצוא (כותרת חסינה, אי-מוטציה).
 *  חוזה: override-column.contract.md
 *  חולץ כלשונו מ-maor/src/lib/customExport.ts:127-136. עצמאי — אפס import פנימי. */
export function overrideColumn(rows, colIdx, overrides) {
  if (colIdx < 0) return rows;
  return rows.map((r, i) => {
    if (i === 0 || overrides[i] === undefined) return r;
    const c = [...r];
    c[colIdx] = overrides[i];
    return c;
  });
}
