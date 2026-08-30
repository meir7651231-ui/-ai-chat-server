/** חוט · read-ics-feed-token — ה-token הקיים של פיד-היומן (icsFeeds/{slug}) מהענן.
 *  חוזה: read-ics-feed-token.contract.md
 *  חולץ כלשונו מ-maor/src/lib/icsFeed.ts:24-29; ‏cloudDb וערכת-Firestore
 *  (doc/getDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  token תקין = מחרוזת לא-ריקה; כל השאר ⇒ null. שגיאות מבעבעות (אין בליעה). */
export async function readIcsFeedToken(slug, fs, T) {
  const { db, doc, getDoc } = fs;
  const snap = await getDoc(doc(db, T.k1, slug));
  const d = snap.exists() ? snap.data() : null;
  return d && typeof d.token === T.k2 && d.token ? d.token : null;
}
