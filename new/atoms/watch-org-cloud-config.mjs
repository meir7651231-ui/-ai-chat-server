/** חוט · watch-org-cloud-config — האזנה-חיה למסמך-הארגון platformOrgs/{slug}.
 *  חוזה: watch-org-cloud-config.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:110-120; שכני firebase/firestore
 *  (cloudDb·doc·onSnapshot) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export function watchOrgCloudConfig(slug, cb, fs, T) {
  const { db, doc, onSnapshot } = fs;
  return onSnapshot(
    doc(db, T.k1, slug),
    (snap) => cb(snap.exists() ? snap.data() : null),
    () => {
      /* אין הרשאה/רשת — נשארים על הקונפיג הנוכחי */
    },
  );
}
