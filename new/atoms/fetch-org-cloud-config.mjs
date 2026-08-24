/** חוט · fetch-org-cloud-config — מסמך-הארגון platformOrgs/{slug}, נפילה-רכה ל-null.
 *  חוזה: fetch-org-cloud-config.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:96-109 (תורגם TS→JS); ‏cloudDb ⇒ שקע db,
 *  ערכת-Firestore (getDoc/doc) ⇒ שקע fs (חוק-1). 'platformOrgs' = ערך PLATFORM_ORGS מהמקור. */
export async function fetchOrgCloudConfig(slug, db, fs) {
  try {
    const snap = await fs.getDoc(fs.doc(db, 'platformOrgs', slug));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}
