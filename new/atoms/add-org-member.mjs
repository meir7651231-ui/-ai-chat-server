/** חוט · add-org-member — צירוף חבר-ארגון אטומי (arrayUnion, מייל מנורמל) לענן.
 *  חוזה: add-org-member.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:255-258; שכני firebase/firestore
 *  (cloudDb·doc·updateDoc·arrayUnion) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). */
export async function addOrgMember(slug, email, fs) {
  const { db, doc, updateDoc, arrayUnion } = fs;
  await updateDoc(doc(db, 'platformOrgs', slug), { members: arrayUnion(email.trim().toLowerCase()) });
}
