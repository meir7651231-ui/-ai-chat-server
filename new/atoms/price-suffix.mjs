/** חוט · price-suffix — סיומת תקופת-המחיר של מסלול. חוזה: price-suffix.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:195-199. אפס שקעים. */
export function priceSuffix(model) {
    return model === 'half_year' ? 'לחצי שנה' : model === 'year' ? 'לשנה' : model === 'punch' ? '' : 'לחודש';
}
