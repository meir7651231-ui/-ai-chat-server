/** חוט · fetch-all-orgs — כל ארגוני-הפלטפורמה מהענן (לוח-הבקרה).
 *  חוזה: fetch-all-orgs.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:203-206 (תורגם TS→JS); שכני
 *  firebase/firestore (cloudDb·collection·getDocs) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). קבוע-המנגנון PLATFORM_ORGS הוטבע כלשונו. */
export async function fetchAllOrgs(fs, T) {
    const { db, collection, getDocs } = fs;
    const snap = await getDocs(collection(db, T.k1));
    return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}
