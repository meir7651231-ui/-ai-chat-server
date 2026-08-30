/** חוט · send-support-reply — תשובת-התמיכה (מייל-על) בצ׳אט-הלקוח: הודעה + עדכון מטא-שיחה.
 *  חוזה: send-support-reply.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:362-374 (תורגם TS→JS); השכן
 *  sanitizeSupportText הוזרק כשקע sanitize, ושכני firebase/firestore
 *  (cloudDb·addDoc·collection·setDoc·doc·increment) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). קבוע-המנגנון SUPPORT_CHATS הוטבע כלשונו. */

export async function sendSupportReply(uid, text, sanitize, fs, T) {
  const { db, addDoc, collection, setDoc, doc, increment } = fs;
  const clean = sanitize(text);
  if (!clean) return;
  const now = new Date().toISOString();
  await addDoc(collection(db, T.tbl1, uid, T.k1), { from: T.k2, text: clean, at: now });
  await setDoc(
    doc(db, T.tbl1, uid),
    { lastText: clean.slice(0, T.k3), lastAt: now, lastFrom: T.k2, unreadUser: increment(1) },
    { merge: true },
  );
}
