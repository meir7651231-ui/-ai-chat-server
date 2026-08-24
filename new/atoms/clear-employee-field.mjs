/** חוט · clear-employee-field — מחיקת שדה-יחיד מכרטיס-עובד (memberConfigs.{email}.{field}) בענן.
 *  חוזה: clear-employee-field.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:243-254; שכני firebase/firestore
 *  (cloudDb·doc·updateDoc·FieldPath·deleteField) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). */
export async function clearEmployeeField(slug, email, field, fs) {
  const { db, doc, updateDoc, FieldPath, deleteField } = fs;
  await updateDoc(doc(db, 'platformOrgs', slug), new FieldPath('memberConfigs', email, field), deleteField());
}
