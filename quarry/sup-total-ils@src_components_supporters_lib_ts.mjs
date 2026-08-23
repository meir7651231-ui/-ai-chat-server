/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supTotalIls — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:143-150 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supTotalIls, supIls, supUsd
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supTotalIls(sp, rate = 3.7) {
    return supIls(sp) + supUsd(sp) * rate;
}
/**
 * ציון משוקלל 0–1000 בסגנון RFM — ספי הניקוד verbatim מהמקור:
 * R — טריות (ימים מאז התרומה האחרונה), F — תדירות (מספר תרומות), M — סכום מצטבר.
 */
