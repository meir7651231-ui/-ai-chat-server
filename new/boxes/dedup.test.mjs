/** בדיקת-קצה · קופסת dedup — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד (מותר לייבא
 *  אך-ורק את הקופסה-שלה). + מגן-הכרעה: קורא את מקור-הקופסה ומאשר הזרקות verbatim. */
import * as D from './dedup.mjs';
const DEDUP_TERMS = {
  k1: "ר",
  k2: "רבי",
  k3: "הרב",
  k4: "הרבנית",
  k5: "הרהג",
  k6: "הרהח",
  k7: "הגר",
  k8: "מוהרר",
  k9: "אדמור",
  k10: "מרת",
  k11: "מר",
  k12: "גב",
  k13: "הגב",
  k14: "דר",
  k15: "פרופ",
  k16: "הבחור",
  k17: "הבהח",
  k18: "הת",
  k19: "משפ",
  k20: "משפחת",
  k21: "שליטא",
  k22: "זצל",
  k23: "זצוקל",
  k24: "זקל",
  k25: "זל",
  k26: "עה",
  k27: "היד",
  k28: "נרו",
  k29: "ניו",
  k30: "ני",
  k31: "היו",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

// 1) normPhone — 972→0 · מציין-מקום ⇒ ריק
eq(D.normPhone('+972-50-123-4567'), '0501234567', 'normPhone 972→0');
eq(D.normPhone('0000000000'), '', 'normPhone מציין-מקום');
eq(D.normPhone('00972501234567'), '0501234567', 'normPhone 00972');

// 2) normId — ≥4 משמעותיות · ≥5 ספרות
eq(D.normId('00000012345'), '00000012345', 'normId מרופד תקין');
eq(D.normId('000000020'), '', 'normId מציין-מקום נדרים');
eq(D.normId('123'), '', 'normId קצר מדי');
eq(D.normId('000000000'), '', 'normId אפסים');

// 3) findDuplicateGroups — שם+עיר
eq(D.findDuplicateGroups([
  { id: 'a', name: 'כהן', city: 'ירושלים' },
  { id: 'b', name: 'כהן', city: 'ירושלים' },
  { id: 'c', name: 'לוי', city: 'בני ברק' },
]), [['a', 'b']], 'findDuplicateGroups שם+עיר');
// 4) findDuplicateGroups — טלפון מנורמל
eq(D.findDuplicateGroups([
  { id: 'a', phone: '0501112222' },
  { id: 'b', phone: '972501112222' },
]), [['a', 'b']], 'findDuplicateGroups טלפון');
// עדשה-עוינת: שם בלי עיר לא מקבץ (סיכון מיזוג-שווא — dedup.ts:27-31)
eq(D.findDuplicateGroups([{ id: 'a', name: 'כהן' }, { id: 'b', name: 'כהן' }]), [], 'שם-ללא-עיר לא מקבץ');
// עדשה-עוינת: קלט ריק
eq(D.findDuplicateGroups([]), [], 'קלט ריק ⇒ אפס קבוצות');

// 5) mergeFamilies — מילוי-ריק · max · status · notes
const mf = D.mergeFamilies(
  { id: 'k', name: 'כהן', phone: '0501112222', status: 'pending', kidsHome: 2 },
  [{ id: 'l', name: 'כהן', email: 'x@y.z', status: 'active', kidsHome: 5 }],
);
eq(mf.id, 'k', 'mergeFamilies שומר-id');
eq(mf.email, 'x@y.z', 'mergeFamilies מולא-ריק');
eq(mf.status, 'active', 'mergeFamilies status-הגבוה');
eq(mf.kidsHome, 5, 'mergeFamilies kidsHome=max');
ok(mf.notes.includes('| מוזג: כהן'), 'mergeFamilies סמן-מיזוג');

// 6) dupFieldValue — edit ⇒ pick ⇒ ראשונה-עם-ערך
const nameDef = { key: 'name', get: (f) => f.name || '' };
eq(D.dupFieldValue([{ name: '' }, { name: 'לוי' }], nameDef, {}, {}), 'לוי', 'dupFieldValue ראשונה-עם-ערך');
eq(D.dupFieldValue([{ name: '' }, { name: 'לוי' }], nameDef, {}, { name: 'כהן' }), 'כהן', 'dupFieldValue edit גובר');
eq(D.dupFieldValue([{ name: '' }, { name: 'לוי' }], nameDef, { name: 0 }, {}), '', 'dupFieldValue pick גובר');

// DUP_FIELDS / SUP_DUP_FIELDS — קבועים חשופים
eq(D.DUP_FIELDS.length, 18, 'DUP_FIELDS 18 שדות');
eq(D.DUP_FIELDS[0].label, 'שם משפחה', 'DUP_FIELDS תווית-ראשונה verbatim');
eq(D.SUP_DUP_FIELDS.length, 9, 'SUP_DUP_FIELDS 9 שדות');

// mergeFamiliesByFields — בסיס-בטוח + דריסה נבחרת
const mfbf = D.mergeFamiliesByFields([
  { id: 'k', name: 'כהן', city: 'ירושלים', status: 'active', kidsHome: 1 },
  { id: 'l', name: 'כ.', city: 'ירושלים', status: 'pending', kidsHome: 3 },
], { name: 1 }, {});
eq(mfbf.name, 'כ.', 'mergeFamiliesByFields pick-שדה');
eq(mfbf.id, 'k', 'mergeFamiliesByFields בסיס=fams[0]');

// 7) findSupporterDupGroups — ת"ז מפתח-חזק (שם שונה)
eq(D.findSupporterDupGroups([
  { id: 'a', idNum: '123456789' },
  { id: 'b', idNum: '123456789', name: 'שונה' },
]), [['a', 'b']], 'findSupporterDupGroups ת"ז');
// עדשה-עוינת: שם חסין-סדר ≥2 מילים (נדרים "בן צבי רחל"↔"רחל בן צבי")
eq(D.findSupporterDupGroups([
  { id: 'a', name: 'בן צבי רחל' },
  { id: 'b', name: 'רחל בן צבי' },
]), [['a', 'b']], 'findSupporterDupGroups שם-חסין-סדר');
// עדשה-עוינת: שם-בודד לא מקבץ (nameSortHardening — דורש רווח)
eq(D.findSupporterDupGroups([{ id: 'a', name: 'רחל' }, { id: 'b', name: 'רחל' }]), [], 'שם-בודד לא מקבץ');

// 8) mergeSupporterInto — כסף ל"שומר", צבירה מחושבת-מחדש
const msi = D.mergeSupporterInto(
  { id: 'k', donations: [{ date: '2024-01-01', amount: 100, cur: '₪' }], city: '' },
  { id: 'd', donations: [{ date: '2024-02-01', amount: 50, cur: '₪' }], city: 'חיפה' },
);
eq(msi.donations.length, 2, 'mergeSupporterInto תרומות ממוזגות');
eq(msi.ils, 150, 'mergeSupporterInto ils צבירה');
eq(msi.city, 'חיפה', 'mergeSupporterInto מולא-ריק');
eq(msi.count, 2, 'mergeSupporterInto count');
eq(msi.first, '2024-01-01', 'mergeSupporterInto first');
eq(msi.last, '2024-02-01', 'mergeSupporterInto last');

// 9) mergeSupportersGroup — קבוצת-3, אפס איבוד-כסף
const msg = D.mergeSupportersGroup(
  { id: 'k', donations: [{ date: '2024-01-01', amount: 100, cur: '₪' }] },
  [
    { id: 'b', donations: [{ date: '2024-02-01', amount: 50, cur: '₪' }] },
    { id: 'c', donations: [{ date: '2024-03-01', amount: 25, cur: '₪' }] },
  ],
);
eq(msg.ils, 175, 'mergeSupportersGroup קבוצת-3 צבירה');
eq(msg.donations.length, 3, 'mergeSupportersGroup כל התרומות');

// supDupFieldValue + mergeSupportersByFields
const sDef = { key: 'name', get: (s) => s.name || '' };
eq(D.supDupFieldValue([{ name: '' }, { name: 'דוד' }], sDef, {}, {}), 'דוד', 'supDupFieldValue ראשונה');
const msbf = D.mergeSupportersByFields([
  { id: 'k', name: 'דוד', donations: [{ date: '2024-01-01', amount: 10, cur: '₪' }] },
  { id: 'd', name: 'ד.', donations: [{ date: '2024-02-01', amount: 20, cur: '₪' }] },
], { name: 1 }, {});
eq(msbf.name, 'ד.', 'mergeSupportersByFields pick-שדה');
eq(msbf.ils, 30, 'mergeSupportersByFields כסף-נשמר');

/* 🛡 מגן-הכרעה: ההזרקות (סוקטים) והמילון verbatim חיים בקופסה — קורא את המקור. */
const src = readFileSync(new URL('./dedup.mjs', import.meta.url), 'utf8');
ok(src.includes('{ normPhone, dedupById }'), 'מגן: הזרקת mergeFamilies');
ok(src.includes('{ normPhone, normId, supNameCityKey, nameSortKey }'), 'מגן: הזרקת findSupporterDupGroups');
ok(src.includes('mergeHist, PHOTO_MAX'), 'מגן: הזרקת mergeSupporterInto');
ok(src.includes("DEDUP_TERMS.k21, DEDUP_TERMS.k22"), 'מגן: NAME_TITLES verbatim');
ok(src.includes("filter((p) => p.length >= 7)"), 'מגן: phonesOf ≥7');
// אפס-ייבוא-פנימי (חוק-2/3): כל import מ-../atoms/ בלבד
for (const m of src.matchAll(/^import .*?from '([^']+)'/gm)) {
  ok(m[1].startsWith('../atoms/'), `מגן: ייבוא-אטום-בלבד (${m[1]})`);
}

console.log(`✓ קופסת-dedup: ${n} טענות עברו (13 חוטים · משפחות+תורמים · מיזוג-בטוח · מגן-הכרעה)`);
