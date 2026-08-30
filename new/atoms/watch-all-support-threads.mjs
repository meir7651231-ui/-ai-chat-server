/** חוט · watch-all-support-threads — תיבת-השיחות של התמיכה (מייל-על): האזנה-חיה
 *  לכל השיחות supportChats. חוזה: watch-all-support-threads.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:393-399; שכני firebase/firestore
 *  (cloudDb·collection·onSnapshot) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import
 *  פנימי). כל מסמך ⇒ {uid:d.id, ...d.data()} (ה-uid נחשף — שלא-כמו רשימות-ההודעות). */
export function watchAllSupportThreads(cb, fs, T) {
  const { db, collection, onSnapshot } = fs;
  return onSnapshot(
    collection(db, T.k1),
    (snap) => cb(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))),
    () => { /* נבלע */ },
  );
}
