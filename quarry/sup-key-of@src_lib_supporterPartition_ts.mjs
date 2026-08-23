/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supKeyOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:26-34 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supKeyOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supKeyOf(sp) {
    const f = (sp.forWho ?? '').trim();
    return f || SHARED_SUP_KEY;
}
/**
 * האוספים הנאכפים פר-skey: `supporters` (הייעוד עליו) + `events` (אירוע-מעקב
 * מקושר-תומך נושא את מפתח-התומך, כדי ששם-התורם בלוח לא ידלוף לעובדת אחרת).
 */
