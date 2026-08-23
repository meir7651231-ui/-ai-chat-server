/** 🪨 טיוטת-חוט (דרגת-מחצבה) · metaOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:117-146 (30 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): metaOf, sameJson
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
function sameJson(a, b) {
    if (a === b)
        return true;
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * השוואת שני מצבי DB → סט הפעולות המינימלי מול Firestore.
 * השוואה פר-ישות לפי id בשוויון JSON; רשימה זהה (===) מדולגת בזול.
 */
