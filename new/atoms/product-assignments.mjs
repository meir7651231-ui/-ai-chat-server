/** חוט · product-assignments — שיוכי-חנות של מוצר נתון. חוזה: product-assignments.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:452-465. אפס שקעים. */
export function productAssignments(assignments, productId) {
    return assignments.filter((a) => a.productId === productId);
}
