/** חוט · migrate-donations-to-collection — מיגרציית-פיצול חד-פעמית: כל התרומות ⇒ אוסף נפרד.
 *  חוזה: migrate-donations-to-collection.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:201-213; שכני-הענן הוזרקו כשקעים (חוק-1):
 *  donationPartitionDiff (במקור import() דינמי — האטום donation-partition-diff) ·
 *  pushDonations (כתיבת-ה-diff ל-Firestore — שכבת-הענן כולה מאחורי השקע). */
export async function migrateDonationsToCollection(supporters, dek, donationPartitionDiff, pushDonations) {
    const diff = donationPartitionDiff([], supporters); // prev ריק ⇒ כל התרומות = sets
    await pushDonations(diff, dek);
    return diff.sets.length;
}
