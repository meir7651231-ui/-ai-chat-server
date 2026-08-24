/** חוט · apply-entity-partial — מיזוג שינויי-אוסף מרוחקים (upsert לפי id).
 *  חוזה: apply-entity-partial.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:73-105; השכנים ENTITY_COLLECTIONS/
 *  sanitizeIncoming/mergeDonationsPreserving הוזרקו כשקעים (חוק-1). */
export function applyEntityPartial(db, col, docs, entityCollections, sanitizeIncoming, mergeDonationsPreserving) {
  if (!entityCollections.includes(col)) return db;
  const key = col;
  const list = db[key];
  const deleted = new Set(docs.filter((d) => d.deleted).map((d) => d.id));
  const incoming = new Map(docs
    .filter((d) => !d.deleted)
    .map((d) => [d.id, sanitizeIncoming(col, { ...d.data, id: d.id })]));
  // עדכונים במקומם (שומר סדר), חדשים לראש הרשימה — כמו upsertIn של ה-store
  const kept = list
    .filter((x) => !deleted.has(x.id))
    .map((x) => {
      const inc = incoming.get(x.id);
      if (inc) {
        incoming.delete(x.id);
        // מיזוג מקומי-מול-נכנס (בקוד-המקור: איחוד-תרומות חסין-אובדן לתומכים).
        const merged = mergeDonationsPreserving(col, x, inc);
        return merged;
      }
      return x;
    });
  const next = [...incoming.values(), ...kept];
  if (JSON.stringify(next) === JSON.stringify(list)) return db;
  return { ...db, [key]: next };
}
