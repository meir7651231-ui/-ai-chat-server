/** 🪨 טיוטת-חוט (דרגת-מחצבה) · expFieldDefs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/customExport.ts:36-126 (91 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): expFieldDefs, featureOn, termOf, featLabel, itemLabel, unitLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function expFieldDefs(cfg, target) {
    const full = featureOn(cfg, 'reports.custom.full');
    if (target === 'courses') {
        if (!full) {
            return [
                { key: 'name', label: 'שם החוג' },
                { key: 'teacher', label: 'מורה + טלפון' },
                { key: 'model', label: 'מסלול ומחיר' },
                { key: 'occ', label: 'תפוסה' },
                { key: 'students', label: 'רשימת ' + termOf(cfg, 'entity.students', 'תלמידים') },
                { key: 'pays', label: 'תשלומים בטווח' },
                { key: 'abs', label: 'חיסורים בטווח' },
            ];
        }
        return [
            { key: 'name', label: 'שם ה' + termOf(cfg, 'entity.course', 'חוג') },
            { key: 'teacher', label: termOf(cfg, 'entity.teacher', 'מורה') + ' + טלפון' },
            { key: 'grade', label: 'כיתות' },
            { key: 'audience', label: 'קהל יעד' },
            { key: 'room', label: termOf(cfg, 'entity.room', 'חדר') },
            { key: 'schedule', label: 'יום ושעה' },
            { key: 'model', label: 'מסלול ומחיר' },
            { key: 'occ', label: 'תפוסה' },
            { key: 'students', label: 'רשימת ' + termOf(cfg, 'entity.students', 'תלמידים') },
            { key: 'studentsFull', label: termOf(cfg, 'entity.students', 'תלמידים') + ' + טלפון + יתרה' },
            { key: 'pays', label: 'תשלומים בטווח' },
            { key: 'revenue', label: 'סה"כ הכנסות' },
            { key: 'abs', label: 'חיסורים בטווח' },
            { key: 'notes', label: 'הערות' },
        ];
    }
    if (target === 'events') {
        return [
            { key: 'title', label: 'כותרת' },
            { key: 'type', label: 'סוג אירוע' },
            { key: 'hdate', label: 'תאריך עברי' },
            { key: 'gdate', label: 'תאריך לועזי' },
            { key: 'time', label: 'שעה' },
            { key: 'fam', label: termOf(cfg, 'entity.family', 'משפחה') },
            { key: 'notes', label: 'הערות' },
            { key: 'done', label: 'בוצע' },
        ];
    }
    const ayinOn = featureOn(cfg, 'supporters.ayin');
    if (!full) {
        const defs = [
            { key: 'name', label: 'שם' },
            { key: 'phone', label: 'טלפון' },
            { key: 'email', label: 'אימייל' },
            { key: 'dons', label: termOf(cfg, 'entity.donations', 'תרומות') + ' בטווח (מספר + סכום)' },
        ];
        if (ayinOn) {
            defs.push({ key: 'stage', label: 'שלב ' + featLabel(cfg) }, { key: 'names', label: itemLabel(cfg) + ' + ' + unitLabel(cfg) }, { key: 'answers', label: 'תשובות/הערות בטווח' }, { key: 'next', label: 'תאריך יעד לקשר' });
        }
        return defs;
    }
    const defs = [
        { key: 'name', label: 'שם' },
        { key: 'phone', label: 'טלפון' },
        { key: 'email', label: 'אימייל' },
        { key: 'address', label: 'כתובת' },
        { key: 'city', label: 'עיר' },
        { key: 'cat', label: 'קטגוריה' },
        { key: 'forWho', label: 'עבור מי' },
        { key: 'dons', label: termOf(cfg, 'entity.donations', 'תרומות') + ' בטווח (מספר + סכום)' },
        { key: 'donsAll', label: 'סה"כ ' + termOf(cfg, 'entity.donations', 'תרומות') + ' (כל הזמן)' },
        { key: 'tier', label: 'דירוג' },
    ];
    if (ayinOn) {
        defs.push({ key: 'stage', label: 'שלב ' + featLabel(cfg) }, { key: 'names', label: itemLabel(cfg) + ' + ' + unitLabel(cfg) }, { key: 'eyesTotal', label: 'סה"כ ' + unitLabel(cfg) }, { key: 'paid', label: 'שולם' }, { key: 'answers', label: 'תשובות/הערות בטווח' }, { key: 'next', label: 'תאריך יעד לקשר' });
    }
    defs.push({ key: 'notes', label: 'הערות' });
    return defs;
}
/**
 * דריסת עמודה בשורות שנבנו (עריכת "הערות" בתצוגה המקדימה — P2 פער 23):
 * לייצוא בלבד, ה-DB לא משתנה. המפתח = אינדקס השורה (0 = כותרת, לא נדרסת).
 */
