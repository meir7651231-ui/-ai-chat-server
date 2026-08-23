/** 🪨 טיוטת-חוט (דרגת-מחצבה) · beneficiaryLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:681-690 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): beneficiaryLabel, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function beneficiaryLabel(db, a, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const fam = db.families.find((f) => f.id === a.famId);
    const famLabel = fam ? T('entity.familyOf', 'משפחת') + ' ' + fam.name : T('entity.family', 'משפחה') + ' לא ידועה';
    if (!a.memberId || !fam)
        return famLabel;
    const m = fam.members.find((x) => x.id === a.memberId);
    return m ? famLabel + ' — ' + m.first : famLabel;
}
/** ספירת רכיבי מוצר לפי סוג — לתצוגת כרטיסי הקטלוג. */
