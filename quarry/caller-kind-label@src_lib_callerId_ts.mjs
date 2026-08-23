/** 🪨 טיוטת-חוט (דרגת-מחצבה) · callerKindLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/callerId.ts:24-56 (33 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): callerKindLabel, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function callerKindLabel(cfg, kind) {
    switch (kind) {
        case 'family':
            return termOf(cfg, 'entity.family', 'משפחה');
        case 'member':
            return termOf(cfg, 'entity.member', 'בן/בת משפחה');
        case 'supporter':
            return termOf(cfg, 'entity.supporter', 'תורם/ת');
        case 'volunteer':
            return termOf(cfg, 'entity.volunteer', 'מתנדב/ת');
        case 'coordinator':
            return termOf(cfg, 'entity.tzCoordinator', 'רכז/ת');
    }
}
/**
 * מפתח-השוואה של טלפון: ספרות בלבד, בניכוי קידומת בינ"ל (00/972) ו-0 מוביל.
 * '050-123-4567' · '+972 50 1234567' · '0050-1234567' → כולם '501234567'.
 * קווי: '02-555-1234' → '25551234'. ריק/קצר-מדי ⇒ '' (לא ניתן להתאמה).
 */
