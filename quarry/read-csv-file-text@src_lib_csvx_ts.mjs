/** 🪨 טיוטת-חוט (דרגת-מחצבה) · readCsvFileText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/csvx.ts:64-71 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): readCsvFileText, decodeCsvBuffer, arrayBuffer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function readCsvFileText(file) {
    return decodeCsvBuffer(await file.arrayBuffer());
}
/**
 * פענוח CSV מלא: שדות מצוטטים ("..."), גרשיים כפולים בתוך ציטוט,
 * פסיקים ומעברי שורה בתוך שדה, CRLF. שורות ריקות לגמרי מדולגות.
 */
