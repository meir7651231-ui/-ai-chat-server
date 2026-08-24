/** חוט · campaign-total — סכום איסופי-קמפיין על-פני כל הקופות. חוזה: campaign-total.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:68-73 (מודול קופות-הצדקה). */
export function campaignTotal(boxes, campaignId) {
    let sum = 0;
    for (const b of boxes)
        for (const c of b.collections)
            if (c.campaignId === campaignId)
                sum += Number.isFinite(c.amount) ? c.amount : 0;
    return sum;
}
