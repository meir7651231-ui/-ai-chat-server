/** חוט · plan-word — שם מסלול-התמחור של חוג. חוזה: plan-word.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:184-194. אפס שקעים. */
export function planWord(model, T) {
    return model === T.k1
        ? T.k2
        : model === T.k3
            ? T.k4
            : model === T.k5
                ? T.k6
                : T.k7;
}
