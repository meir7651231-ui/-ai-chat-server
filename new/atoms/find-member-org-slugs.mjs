/** חוט · find-member-org-slugs — ארגוני-הפלטפורמה שבהם המייל חבר (ניתוב-עצמי בכניסה).
 *  חוזה: find-member-org-slugs.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:190-200 (תורגם TS→JS); שכני
 *  firebase/firestore (cloudDb·collection·query·where·getDocs) הוזרקו כאובייקט-שקעים
 *  fs (חוק-1 — אפס import פנימי). קבוע-המנגנון PLATFORM_ORGS הוטבע כלשונו. */
export async function findMemberOrgSlugs(email, fs) {
    try {
        const { db, collection, query, where, getDocs } = fs;
        const mail = email.trim().toLowerCase();
        if (!mail)
            return [];
        const q = query(collection(db, 'platformOrgs'), where('members', 'array-contains', mail));
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.id);
    }
    catch {
        return [];
    }
}
