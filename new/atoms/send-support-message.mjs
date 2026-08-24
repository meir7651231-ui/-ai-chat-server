/** חוט · send-support-message — הלקוח שולח הודעת-צ׳אט-תמיכה: כותב message
 *  (from:'user') לתת-האוסף + מעדכן מטא-שיחה (unreadAdmin++) ב-merge.
 *  חוזה: send-support-message.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:338-359; שכני firebase/firestore
 *  (cloudDb·addDoc·collection·doc·setDoc·increment) הוזרקו כאובייקט-שקעים fs,
 *  והשכן-הטהור sanitizeSupportText כשקע נפרד (חוק-1 — אפס import פנימי). */
export async function sendSupportMessage(uid, meta, text, fs, sanitizeSupportText) {
  const { db, addDoc, collection, doc, setDoc, increment } = fs;
  const clean = sanitizeSupportText(text);
  if (!clean) return;
  const now = new Date().toISOString();
  await addDoc(collection(db, 'supportChats', uid, 'messages'), { from: 'user', text: clean, at: now });
  await setDoc(
    doc(db, 'supportChats', uid),
    {
      email: (meta.email ?? '').slice(0, 120),
      orgName: (meta.orgName ?? '').slice(0, 120),
      lastText: clean.slice(0, 120),
      lastAt: now,
      lastFrom: 'user',
      unreadAdmin: increment(1),
    },
    { merge: true },
  );
}
