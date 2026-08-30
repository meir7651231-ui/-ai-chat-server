/** חוט · watch-incoming-payments — האזנה-חיה לתשלומים-נכנסים ממתינים (webhook⇒כרטיס).
 *  חוזה: watch-incoming-payments.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:738-751; שכני firebase/firestore ותחום-
 *  הארגון (requireDb·scopedCol·collection·query·where·onSnapshot) הוזרקו
 *  כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export function watchIncomingPayments(cb, fs, T) {
  const { requireDb, scopedCol, collection, query, where, onSnapshot } = fs;
  try {
    const q = query(collection(requireDb(), scopedCol(T.k1)), where(T.k2, '==', T.k3));
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => {}, // שגיאת-האזנה (אין Rules/הרשאה) ⇒ שקט
    );
  } catch {
    return () => {};
  }
}
