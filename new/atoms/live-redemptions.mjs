/** חוט · live-redemptions — המימושים החיים של שיוך (מוחרגים המבוטלים).
 *  חוזה: live-redemptions.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:25-27 — אפס שקעים. */
export function liveRedemptions(a) {
    return a.redemptions.filter((r) => !r.voidedAt);
}
