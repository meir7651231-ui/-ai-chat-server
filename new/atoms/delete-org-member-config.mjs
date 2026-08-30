/** חוט · delete-org-member-config — מחיקת כרטיס-עובד (מפתח memberConfigs.{email}) מהענן.
 *  חוזה: delete-org-member-config.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:233-242; שכני firebase/firestore
 *  (cloudDb·doc·updateDoc·FieldPath·deleteField) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). */
export async function deleteOrgMemberConfig(slug, email, fs, T) {
  const { db, doc, updateDoc, FieldPath, deleteField } = fs;
  await updateDoc(doc(db, T.k1, slug), new FieldPath(T.k2, email), deleteField());
}
