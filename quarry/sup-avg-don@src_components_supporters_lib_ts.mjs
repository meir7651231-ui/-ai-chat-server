/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supAvgDon — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:191-197 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supAvgDon, supTotalIls, supCount
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supAvgDon(supporters, rate = 3.7) {
    const totIls = supporters.reduce((a, x) => a + supTotalIls(x, rate), 0);
    const totCnt = supporters.reduce((a, x) => a + supCount(x), 0);
    return totCnt ? Math.round(totIls / totCnt) : null;
}
/** מונה "תרמו ב-12 החודשים" — התרומה האחרונה (כולל היסטוריה) בתוך 365 יום. */
