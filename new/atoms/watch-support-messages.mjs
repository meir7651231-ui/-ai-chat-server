/** חוט · watch-support-messages — האזנה-חיה להודעות שיחת-התמיכה supportChats/{uid}/messages.
 *  חוזה: watch-support-messages.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:375-383; שכני firebase/firestore
 *  (cloudDb·collection·onSnapshot) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export function watchSupportMessages(uid, cb, fs, T) {
  const { db, collection, onSnapshot } = fs;
  return onSnapshot(
    collection(db, T.k1, uid, T.k2),
    (snap) => cb(snap.docs.map((d) => d.data())),
    () => { /* אין הרשאה/רשת — נשארים על מה שיש */ },
  );
}
