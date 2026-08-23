/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supportPreview — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:76-81 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supportPreview
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supportPreview(text, max = 40) {
    const t = (text ?? '').replace(/\s+/gu, ' ').trim();
    return t.length > max ? t.slice(0, max - 1) + '…' : t;
}
/** מספר "לא-נקרא" לצד נתון (לתג-מונה). לא-שלילי; חסר ⇒ 0. */
