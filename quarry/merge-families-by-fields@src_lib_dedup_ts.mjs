/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeFamiliesByFields — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:224-271 (48 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeFamiliesByFields, mergeFamilies, dupFieldValue, supNameCityKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeFamiliesByFields(fams, pick, edit) {
    const base = mergeFamilies(fams[0], fams.slice(1));
    const out = { ...base };
    for (const def of DUP_FIELDS) {
        const val = dupFieldValue(fams, def, pick, edit);
        switch (def.key) {
            case 'kidsHome':
                out.kidsHome = val === '' ? 0 : +val;
                break;
            case 'kidsMarried':
                out.kidsMarried = val === '' ? 0 : +val;
                break;
            case 'status':
                out.status = (val || base.status);
                break;
            case 'name':
                out.name = val;
                break;
            case 'mother':
                out.mother = val;
                break;
            case 'father':
                out.father = val;
                break;
            case 'phone':
                out.phone = val;
                break;
            case 'phone2':
                out.phone2 = val;
                break;
            case 'email':
                out.email = val;
                break;
            case 'city':
                out.city = val;
                break;
            case 'address':
                out.address = val;
                break;
            case 'motherId':
                out.motherId = val;
                break;
            case 'fatherId':
                out.fatherId = val;
                break;
            case 'community':
                out.community = val;
                break;
            case 'language':
                out.language = val;
                break;
            case 'maritalStatus':
                out.maritalStatus = val;
                break;
            case 'createdAt':
                out.createdAt = val;
                break;
            case 'notes':
                out.notes = val;
                break;
        }
    }
    return out;
}
/* ─────────── 🔗 כפולי-תורמים (ROADMAP-100 ‏#13, 5.8.2026) ───────────
 * אותם עקרונות-בטיחות כמו המשפחות: המיזוג משמר הכול, ולעולם לא מוחק רשומה
 * כספית — התרומות (עם ה-rid!) וה-hist עוברים ל"שומר", והצבירה מחושבת מחדש. */
/** מפתח שם+עיר לתומך — שניהם חובה (שם-אדם נפוץ לבדו = סיכון מיזוג-שווא). */
function supNameCityKey(sp) {
    const n = (sp.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    const c = (sp.city || '').trim().toLowerCase();
    return n && c ? n + '|' + c : '';
}
/**
 * ת"ז מנורמלת להשוואה — ספרות בלבד; אפסים-בלבד (מציין-מקום נדרים "000000000")
 * וקצרים-מדי (<5 ספרות = מספר-סידורי, לא ת"ז) ⇒ ריק (לא מפתח-שיוך).
 */
