/** חוט · mark-support-read — איפוס מונה-לא-נקרא לצד שקרא (שיחת-תמיכה בענן).
 *  חוזה: mark-support-read.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:402-406; שכני firebase/firestore
 *  (cloudDb·doc·setDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  קבוע-האוסף SUPPORT_CHATS='supportChats' מהמקור — מוטבע כלשונו. */
export async function markSupportRead(uid, side, fs) {
  const { db, doc, setDoc } = fs;
  const field = side === 'admin' ? 'unreadAdmin' : 'unreadUser';
  await setDoc(doc(db, 'supportChats', uid), { [field]: 0 }, { merge: true }).catch(() => { });
}
