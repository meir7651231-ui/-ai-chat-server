/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supScoreBins — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:184-190 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supScoreBins, fill, supScore
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supScoreBins(supporters, rate = 3.7) {
    const bins = Array(10).fill(0);
    for (const sp of supporters)
        bins[Math.min(9, Math.floor(supScore(sp, rate) / 100))]++;
    return bins;
}
/** ממוצע לתרומה — סה"כ ₪-שקול (‎$×3.7‎) חלקי מספר התרומות (legacy supAvgDon:3024); אין תרומות ⇒ null. */
