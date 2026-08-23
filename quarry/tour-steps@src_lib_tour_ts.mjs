/** 🪨 טיוטת-חוט (דרגת-מחצבה) · tourSteps — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/tour.ts:64-79 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): tourSteps, termOf, isModuleOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function tourSteps(isModuleOn, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const loc = (s) => {
        const caption = s.caption
            .replace('מאתר המשפחות', 'מאתר ה' + T('nav.families', 'משפחות'))
            .replace('מאתר החוגים', 'מאתר ה' + T('nav.courses', 'חוגים'))
            .replace('חיזוי חוגים', 'חיזוי ' + T('nav.courses', 'חוגים'));
        const anchorText = s.anchorText === 'מצא חוג' ? 'מצא ' + T('entity.course', 'חוג') : s.anchorText;
        return caption === s.caption && anchorText === s.anchorText ? s : { ...s, caption, anchorText };
    };
    return TOUR_STEPS.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
/**
 * ניווט בין צעדים: delta ‎+1/-1‎; לפני ההתחלה נצמד ל-0, אחרי הסוף = null (סיום).
 */
