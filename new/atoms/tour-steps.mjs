/** חוט · tour-steps — סינון+מיתוג צעדי-הסיור. חוזה: tour-steps.contract.md
 *  חולץ מ-maor/src/lib/tour.ts:64-75; שקעים: steps (היה TOUR_STEPS), termOf. */
export function tourSteps(steps, isModuleOn, termOf, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const loc = (s) => {
        const caption = s.caption
            .replace('מאתר המשפחות', 'מאתר ה' + T('nav.families', 'משפחות'))
            .replace('מאתר החוגים', 'מאתר ה' + T('nav.courses', 'חוגים'))
            .replace('חיזוי חוגים', 'חיזוי ' + T('nav.courses', 'חוגים'));
        const anchorText = s.anchorText === 'מצא חוג' ? 'מצא ' + T('entity.course', 'חוג') : s.anchorText;
        return caption === s.caption && anchorText === s.anchorText ? s : { ...s, caption, anchorText };
    };
    return steps.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
