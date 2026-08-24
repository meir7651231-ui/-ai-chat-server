/** חוט · can-issue-receipt — מי מנפיק קבלות-§46 (מקצה-יחיד לרצף הקבלות).
 *  חוזה: can-issue-receipt.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:239-248. */
export function canIssueReceipt(p) {
    return p.superAdmin || p.isManager || p.cloudRoot || !p.cloudConnected;
}
