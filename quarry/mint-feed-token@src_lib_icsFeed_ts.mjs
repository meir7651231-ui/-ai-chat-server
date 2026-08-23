/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mintFeedToken — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/icsFeed.ts:17-23 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mintFeedToken, getRandomValues, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mintFeedToken() {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}
/** ה-token הקיים של הפיד (אם פורסם) — כדי שרענון לא ישבור קישורים שכבר במנוי. */
