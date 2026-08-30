/** חוט · read-org-secrets-meta — מדדי-"מוגדר" של כספת-הסודות (orgSecretsMeta/{slug}).
 *  חוזה: read-org-secrets-meta.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:158-167; ‏cloudDb וערכת-Firestore
 *  (doc/getDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  failure-safe: כל שגיאה ⇒ {} (הסודות עצמם לא קריאים מהלקוח לעולם — רק המטא). */
export async function readOrgSecretsMeta(slug, fs, T) {
  const { db, doc, getDoc } = fs;
  try {
    const snap = await getDoc(doc(db, T.k1, slug));
    return snap.exists() ? snap.data() : {};
  } catch {
    return {};
  }
}
