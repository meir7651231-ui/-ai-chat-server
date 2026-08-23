/** 🪨 טיוטת-חוט (דרגת-מחצבה) · guideSections — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/guide.ts:101-120 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): guideSections, termOf, swap, isModuleOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function guideSections(isModuleOn, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const loc = (s) => {
        let { title, text } = s;
        if (title === 'כרטיס משפחה')
            title = 'כרטיס ' + T('entity.family', 'משפחה');
        text = swap(text, 'חדרים חיים', T('entity.rooms', 'חדרים') + ' חיים');
        text = swap(text, 'על חדר', 'על ' + T('entity.room', 'חדר'));
        text = swap(text, 'בתוך חוג', 'בתוך ' + T('entity.course', 'חוג'));
        text = swap(text, 'תדפיס למורה', 'תדפיס ל' + T('entity.teacher', 'מורה'));
        text = swap(text, '＋ תרומה', '＋ ' + T('entity.donation', 'תרומה'));
        text = swap(text, 'שיוך למשפחה', 'שיוך ל' + T('entity.family', 'משפחה'));
        return title === s.title && text === s.text ? s : { ...s, title, text };
    };
    return GUIDE_SECTIONS.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
/**
 * "המתכונים המהירים" ממותג-מחדש — מונחי-הישות עוברים termOf; בלי config =
 * GUIDE_RECIPES מילה-במילה (ratchet — הקבוע עצמו לא נגע, נשאר fallback).
 */
