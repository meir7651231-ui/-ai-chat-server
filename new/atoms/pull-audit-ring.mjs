/** חוט · pull-audit-ring — משיכת כל טבעות-הלוג וממוזגות (מנהל/מייל-על בלבד).
 *  חוזה: pull-audit-ring.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:158-174 (תורגם TS→JS); ‏auditReadable
 *  (מצב-מודול), ‏requireDb ⇒ db, ‏scopedCol, ערכת-Firestore (getDocs/collection)
 *  ⇒ fs, ‏decryptDoc — כולם שקעים (חוק-1). AUDIT_CAP=500 הוטמע. */

export async function pullAuditRing(dek, auditReadable, db, scopedCol, fs, decryptDoc, T) {
  if (!auditReadable) return null;
  const snap = await fs.getDocs(fs.collection(db, scopedCol(T.k1)));
  const all = [];
  for (const d of snap.docs) {
    const data = dek ? await decryptDoc(d.data(), dek) : d.data();
    if (Array.isArray(data.entries)) all.push(...data.entries);
  }
  all.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  return all.slice(-T.tbl1);
}
