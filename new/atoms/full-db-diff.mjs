/** חוט · full-db-diff — ה-DB המלא כ-diff להעלאה ראשונה לענן ריק.
 *  חוזה: full-db-diff.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:173-181; השכנים
 *  ‏ENTITY_COLLECTIONS ו-metaOf הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function fullDbDiff(db, entityCollections, metaOf) {
  const sets = [];
  for (const col of entityCollections) {
    for (const item of db[col]) {
      sets.push({ col, id: item.id, data: item });
    }
  }
  return { sets, deletes: [], meta: metaOf(db) };
}
