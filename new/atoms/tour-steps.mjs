/** חוט · tour-steps — סינון+מיתוג צעדי-הסיור. חוזה: tour-steps.contract.md
 *  חולץ מ-maor/src/lib/tour.ts:64-75; שקעים: steps (היה TOUR_STEPS), termOf. */
export function tourSteps(steps, isModuleOn, termOf, config, T2) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const loc = (s) => {
        const caption = s.caption
            .replace(T2.k1, T2.k2 + T(T2.k3, T2.k4))
            .replace(T2.k5, T2.k2 + T(T2.k6, T2.k7))
            .replace(T2.k8, T2.k9 + T(T2.k6, T2.k7));
        const anchorText = s.anchorText === T2.k10 ? T2.k11 + T(T2.k12, T2.k13) : s.anchorText;
        return caption === s.caption && anchorText === s.anchorText ? s : { ...s, caption, anchorText };
    };
    return steps.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
