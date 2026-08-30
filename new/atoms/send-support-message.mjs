/** חוט · send-support-message — הלקוח שולח הודעת-צ׳אט-תמיכה: כותב message
 *  (from:'user') לתת-האוסף + מעדכן מטא-שיחה (unreadAdmin++) ב-merge.
 *  חוזה: send-support-message.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:338-359; שכני firebase/firestore
 *  (cloudDb·addDoc·collection·doc·setDoc·increment) הוזרקו כאובייקט-שקעים fs,
 *  והשכן-הטהור sanitizeSupportText כשקע נפרד (חוק-1 — אפס import פנימי). */
export async function sendSupportMessage(uid, meta, text, fs, sanitizeSupportText, T) {
  const { db, addDoc, collection, doc, setDoc, increment } = fs;
  const clean = sanitizeSupportText(text);
  if (!clean) return;
  const now = new Date().toISOString();
  await addDoc(collection(db, T.k1, uid, T.k2), { from: T.k3, text: clean, at: now });
  await setDoc(
    doc(db, T.k1, uid),
    {
      email: (meta.email ?? '').slice(0, T.k4),
      orgName: (meta.orgName ?? '').slice(0, T.k4),
      lastText: clean.slice(0, T.k4),
      lastAt: now,
      lastFrom: T.k3,
      unreadAdmin: increment(1),
    },
    { merge: true },
  );
}
