/** חוט · price-suffix — סיומת תקופת-המחיר של מסלול. חוזה: price-suffix.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:195-199. אפס שקעים. */
export function priceSuffix(model, T) {
    return model === T.k1 ? T.k2 : model === T.k3 ? T.k4 : model === T.k5 ? '' : T.k6;
}
