/** חוט · exp-field-defs — הגדרות-שדות הדו"ח המותאם לפי יעד.
 *  חוזה: exp-field-defs.contract.md · שקעים: featureOn, termOf, featLabel, itemLabel, unitLabel
 *  חולץ כלשונו מ-maor/src/lib/customExport.ts (קריאות-השכן שוקעו). */
export function expFieldDefs(cfg, target, featureOn, termOf, featLabel, itemLabel, unitLabel, T) {
    const full = featureOn(cfg, T.k1);
    if (target === T.k2) {
        if (!full) {
            return [
                { key: T.k3, label: T.k4 },
                { key: T.k5, label: T.k6 },
                { key: T.k7, label: T.k8 },
                { key: T.k9, label: T.k10 },
                { key: T.k11, label: T.k12 + termOf(cfg, T.k13, T.k14) },
                { key: T.k15, label: T.k16 },
                { key: T.k17, label: T.k18 },
            ];
        }
        return [
            { key: T.k3, label: T.k19 + termOf(cfg, T.k20, T.k21) },
            { key: T.k5, label: termOf(cfg, T.k22, T.k23) + T.k24 },
            { key: T.k25, label: T.k26 },
            { key: T.k27, label: T.k28 },
            { key: T.k29, label: termOf(cfg, T.k30, T.k31) },
            { key: T.k32, label: T.k33 },
            { key: T.k7, label: T.k8 },
            { key: T.k9, label: T.k10 },
            { key: T.k11, label: T.k12 + termOf(cfg, T.k13, T.k14) },
            { key: T.k34, label: termOf(cfg, T.k13, T.k14) + T.k35 },
            { key: T.k15, label: T.k16 },
            { key: T.k36, label: T.k37 },
            { key: T.k17, label: T.k18 },
            { key: T.k38, label: T.k39 },
        ];
    }
    if (target === T.k40) {
        return [
            { key: T.k41, label: T.k42 },
            { key: T.k43, label: T.k44 },
            { key: T.k45, label: T.k46 },
            { key: T.k47, label: T.k48 },
            { key: T.k49, label: T.k50 },
            { key: T.k51, label: termOf(cfg, T.k52, T.k53) },
            { key: T.k38, label: T.k39 },
            { key: T.k54, label: T.k55 },
        ];
    }
    const ayinOn = featureOn(cfg, T.k56);
    if (!full) {
        const defs = [
            { key: T.k3, label: T.k57 },
            { key: T.k58, label: T.k59 },
            { key: T.k60, label: T.k61 },
            { key: T.k62, label: termOf(cfg, T.k63, T.k64) + T.k65 },
        ];
        if (ayinOn) {
            defs.push({ key: T.k66, label: T.k67 + featLabel(cfg) }, { key: T.k68, label: itemLabel(cfg) + ' + ' + unitLabel(cfg) }, { key: T.k69, label: T.k70 }, { key: T.k71, label: T.k72 });
        }
        return defs;
    }
    const defs = [
        { key: T.k3, label: T.k57 },
        { key: T.k58, label: T.k59 },
        { key: T.k60, label: T.k61 },
        { key: T.k73, label: T.k74 },
        { key: T.k75, label: T.k76 },
        { key: T.k77, label: T.k78 },
        { key: T.k79, label: T.k80 },
        { key: T.k62, label: termOf(cfg, T.k63, T.k64) + T.k65 },
        { key: T.k81, label: T.k82 + termOf(cfg, T.k63, T.k64) + T.k83 },
        { key: T.k84, label: T.k85 },
    ];
    if (ayinOn) {
        defs.push({ key: T.k66, label: T.k67 + featLabel(cfg) }, { key: T.k68, label: itemLabel(cfg) + ' + ' + unitLabel(cfg) }, { key: T.k86, label: T.k82 + unitLabel(cfg) }, { key: T.k87, label: T.k88 }, { key: T.k69, label: T.k70 }, { key: T.k71, label: T.k72 });
    }
    defs.push({ key: T.k38, label: T.k39 });
    return defs;
}
