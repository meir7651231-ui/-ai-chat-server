import { makeDUP_FIELDS as __pure_makeDUP_FIELDS } from './dup-fields.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_dup_fields_T = {
  k1: "name",
  k2: "שם משפחה",
  k3: "mother",
  k4: "שם האם",
  k5: "father",
  k6: "שם האב",
  k7: "phone",
  k8: "טלפון",
  k9: "phone2",
  k10: "טלפון 2",
  k11: "email",
  k12: "אימייל",
  k13: "city",
  k14: "עיר",
  k15: "address",
  k16: "כתובת",
  k17: "motherId",
  k18: "ת\"ז אם",
  k19: "fatherId",
  k20: "ת\"ז אב",
  k21: "community",
  k22: "קהילה",
  k23: "language",
  k24: "שפה",
  k25: "maritalStatus",
  k26: "מצב משפחתי",
  k27: "status",
  k28: "סטטוס",
  k29: "kidsHome",
  k30: "ילדים בבית",
  k31: "kidsMarried",
  k32: "ילדים נשואים",
  k33: "createdAt",
  k34: "נרשמה",
  k35: "notes",
  k36: "הערות",
};
const DUP_FIELDS = __pure_makeDUP_FIELDS(__d_dup_fields_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const by = (k) => DUP_FIELDS.find((d) => d.key === k);
ok(DUP_FIELDS.length === 18, '18 שדות');
ok(DUP_FIELDS[0].key === 'name' && DUP_FIELDS[0].label === 'שם משפחה', 'שדה ראשון name/שם משפחה');
ok(DUP_FIELDS[17].key === 'notes', 'שדה אחרון notes');
ok(by('name').get({ name: 'כהן' }) === 'כהן', "get name על {name:'כהן'} ⇒ 'כהן'");
ok(by('phone').get({}) === '', 'get phone על {} ⇒ ריק');
ok(by('kidsHome').get({ kidsHome: 3 }) === '3', 'kidsHome 3 ⇒ "3"');
ok(by('kidsHome').get({ kidsHome: 0 }) === '0', 'kidsHome 0 ⇒ "0" (אפס אינו ריק)');
ok(by('kidsMarried').get({}) === '', 'kidsMarried חסר ⇒ ריק');
ok(new Set(DUP_FIELDS.map((d) => d.key)).size === 18, 'אין כפילויות-key');
if (f) process.exit(1);
console.log('✓ dup-fields: 9 דוגמאות-חוזה — ירוק');
