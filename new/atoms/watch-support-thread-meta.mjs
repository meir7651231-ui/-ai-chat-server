/** חוט · watch-support-thread-meta — האזנה-חיה למטא-שיחת-התמיכה supportChats/{uid}.
 *  חוזה: watch-support-thread-meta.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:384-392; שכני firebase/firestore
 *  (cloudDb·doc·onSnapshot) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export function watchSupportThreadMeta(uid, cb, fs, T) {
  const { db, doc, onSnapshot } = fs;
  return onSnapshot(
    doc(db, T.k1, uid),
    (snap) => cb(snap.exists() ? snap.data() : null),
    () => { /* נבלע */ },
  );
}
