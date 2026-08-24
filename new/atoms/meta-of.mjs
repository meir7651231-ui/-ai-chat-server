/** חוט · meta-of — גוף מסמך meta/org: כל שדות ה-Db שאינם אוספי-ישויות (בלי v).
 *  חוזה: meta-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:117-146 — הטלה טהורה, אפס שקעים. */
export function metaOf(db) {
    return {
        orgName: db.orgName,
        orgSite: db.orgSite,
        orgDonate: db.orgDonate,
        orgGoal: db.orgGoal,
        budget: db.budget,
        usdRate: db.usdRate,
        audit: db.audit, // לוג-פעולות (#10) — רוכב על meta כמו attnDone
        notif: db.notif,
        reports: db.reports,
        ui: db.ui,
        seq: db.seq,
        receiptSeq: db.receiptSeq,
        donationSeq: db.donationSeq,
        shopReceiptSeq: db.shopReceiptSeq,
        attnDone: db.attnDone,
        savedAt: db.savedAt,
    };
}
