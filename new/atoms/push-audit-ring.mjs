/** חוט · push-audit-ring — דחיפת טבעת-הלוג של המחובר למסמכו (auditlog/{uid}).
 *  חוזה: push-audit-ring.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:149-157 (תורגם TS→JS); ‏auditUid (מצב-מודול),
 *  ‏requireDb ⇒ db, ‏scopedCol, ערכת-Firestore (setDoc/doc) ⇒ fs, ‏encryptDoc —
 *  כולם שקעים (חוק-1). AUDIT_CAP=500 (maor/src/types/domain.ts:1072) הוטמע. */

export async function pushAuditRing(entries, dek, auditUid, db, scopedCol, fs, encryptDoc, T) {
  if (!auditUid) return;
  const ring = entries.slice(-T.tbl1);
  const body = dek ? await encryptDoc({ entries: ring }, dek) : { entries: ring };
  await fs.setDoc(fs.doc(db, scopedCol(T.k1), auditUid), body);
}
