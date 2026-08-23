/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isSendableSupportText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:41-45 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isSendableSupportText, sanitizeSupportText
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isSendableSupportText(raw) {
    return sanitizeSupportText(raw).length > 0;
}
/** מיון הודעות לפי זמן עולה (ישן→חדש) — יציב, לא-משנה-מקור. */
