/** חוט · remove-org-member — הסרת חבר-ארגון אטומית (arrayRemove, גם הצורה הגולמית) מהענן.
 *  חוזה: remove-org-member.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:259-262; שכני firebase/firestore
 *  (cloudDb·doc·updateDoc·arrayRemove) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). */
export async function removeOrgMember(slug, email, fs, T) {
  const { db, doc, updateDoc, arrayRemove } = fs;
  const variants = [...new Set([email.trim(), email.trim().toLowerCase()])];
  await updateDoc(doc(db, T.k1, slug), { members: arrayRemove(...variants) });
}
