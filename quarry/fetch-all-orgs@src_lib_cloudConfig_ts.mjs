/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchAllOrgs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:203-211 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchAllOrgs, getDocs, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchAllOrgs() {
    const snap = await getDocs(collection(cloudDb(), PLATFORM_ORGS));
    return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}
/* ─────────── ORGADMIN — בקשות-הצטרפות של עובדות (subcollection של הארגון) ───────────
 * platformOrgs/{slug}/joinRequests/{uid} — create ע"י המבקש; קריאה/מחיקה = מנהל+מייל-על. */
/** עובד/ת שולח/ת בקשת-הצטרפות (create-only, uid=uid לפי Rules v3). */
