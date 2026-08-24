/** חוט · plan-word — שם מסלול-התמחור של חוג. חוזה: plan-word.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:184-194. אפס שקעים. */
export function planWord(model) {
    return model === 'punch'
        ? 'כרטיסייה'
        : model === 'half_year'
            ? 'מנוי חצי-שנתי'
            : model === 'year'
                ? 'מנוי שנתי'
                : 'מנוי חודשי';
}
