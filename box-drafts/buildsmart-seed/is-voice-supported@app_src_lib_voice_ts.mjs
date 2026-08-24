/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isVoiceSupported — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/voice.ts:30-39 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isVoiceSupported, getCtor
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isVoiceSupported() {
    return getCtor() !== null;
}
