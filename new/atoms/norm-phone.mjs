/** חוט · norm-phone — קודם אוטומטית (אפיון-Golden). חוזה: norm-phone.contract.md */
export function normPhone(s) {
    let d = (s || '').replace(/\D/g, '');
    if (/^(\d)\1+$/.test(d))
        return ''; // מציין-מקום (אפסים/ספרה-חוזרת) — לא טלפון אמיתי
    d = d.replace(/^00/, ''); // צורה בינ"ל 00972…
    if (d.startsWith('972'))
        d = '0' + d.slice(3);
    return d.replace(/^0{2,}/, '0'); // כיווץ אפסים-מובילים-כפולים (מספר ישראלי לא מתחיל 00)
}
/**
 * מפתח שם+עיר מנורמל. דורש גם שם וגם עיר לא-ריקים — אחרת ריק. בלי הדרישה הזו,
 * משפחות רבות ללא עיר ובעלות שם-משפחה נפוץ היו מתקבצות בטעות (סיכון מיזוג-שווא).
 */
function nameCityKey(f) {
    const n = (f.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    const c = (f.city || '').trim().toLowerCase();
    return n && c ? n + '|' + c : '';
}
/** כל הטלפונים המנורמלים של משפחה (ראשי + נוסף), לא-ריקים. */
function phonesOf(f) {
    return [normPhone(f.phone), normPhone(f.phone2)].filter((p) => p.length >= 7);
}
/**
 * קבוצות כפילות — רכיבי-קשירות של משפחות שחולקות טלפון מנורמל, או שם+עיר זהים.
 * מחזיר מערך קבוצות (מזהי משפחות), כל קבוצה בגודל ≥2. Union-Find לטרנזיטיביות.
 */
