/** חוט · watch-team-messages — האזנה-חיה לצ׳אט-הצוות teamChats/{slug}/messages.
 *  חוזה: watch-team-messages.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:425-432; שכני firebase/firestore
 *  (cloudDb·collection·onSnapshot) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export function watchTeamMessages(slug, cb, fs, T) {
  const { db, collection, onSnapshot } = fs;
  return onSnapshot(
    collection(db, T.k1, slug, T.k2),
    (snap) => cb(snap.docs.map((d) => d.data())),
    () => { /* אין הרשאה/רשת — נבלע */ },
  );
}
