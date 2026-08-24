/** חוט · merge-family-import — קודם אוטומטית (אפיון-Golden). חוזה: merge-family-import.contract.md */
export function mergeFamilyImport(f, obj) {
    const out = { ...f };
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v)
            out[k] = v;
    }
    return out;
}
