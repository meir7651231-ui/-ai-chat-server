import { expFieldDefs as __pure_expFieldDefs } from './exp-field-defs.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_expFieldDefs_EXP_FIELD_DEFS_T = {
  k1: "reports.custom.full",
  k2: "courses",
  k3: "name",
  k4: "שם החוג",
  k5: "teacher",
  k6: "מורה + טלפון",
  k7: "model",
  k8: "מסלול ומחיר",
  k9: "occ",
  k10: "תפוסה",
  k11: "students",
  k12: "רשימת ",
  k13: "entity.students",
  k14: "תלמידים",
  k15: "pays",
  k16: "תשלומים בטווח",
  k17: "abs",
  k18: "חיסורים בטווח",
  k19: "שם ה",
  k20: "entity.course",
  k21: "חוג",
  k22: "entity.teacher",
  k23: "מורה",
  k24: " + טלפון",
  k25: "grade",
  k26: "כיתות",
  k27: "audience",
  k28: "קהל יעד",
  k29: "room",
  k30: "entity.room",
  k31: "חדר",
  k32: "schedule",
  k33: "יום ושעה",
  k34: "studentsFull",
  k35: " + טלפון + יתרה",
  k36: "revenue",
  k37: "סה\"כ הכנסות",
  k38: "notes",
  k39: "הערות",
  k40: "events",
  k41: "title",
  k42: "כותרת",
  k43: "type",
  k44: "סוג אירוע",
  k45: "hdate",
  k46: "תאריך עברי",
  k47: "gdate",
  k48: "תאריך לועזי",
  k49: "time",
  k50: "שעה",
  k51: "fam",
  k52: "entity.family",
  k53: "משפחה",
  k54: "done",
  k55: "בוצע",
  k56: "supporters.ayin",
  k57: "שם",
  k58: "phone",
  k59: "טלפון",
  k60: "email",
  k61: "אימייל",
  k62: "dons",
  k63: "entity.donations",
  k64: "תרומות",
  k65: " בטווח (מספר + סכום)",
  k66: "stage",
  k67: "שלב ",
  k68: "names",
  k69: "answers",
  k70: "תשובות/הערות בטווח",
  k71: "next",
  k72: "תאריך יעד לקשר",
  k73: "address",
  k74: "כתובת",
  k75: "city",
  k76: "עיר",
  k77: "cat",
  k78: "קטגוריה",
  k79: "forWho",
  k80: "עבור מי",
  k81: "donsAll",
  k82: "סה\"כ ",
  k83: " (כל הזמן)",
  k84: "tier",
  k85: "דירוג",
  k86: "eyesTotal",
  k87: "paid",
  k88: "שולם",
};
const expFieldDefs = (...a) => __pure_expFieldDefs(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_expFieldDefs_EXP_FIELD_DEFS_T);
// מימושי-שקע לבדיקה — נאמנים למקור (config.ts / ayin.ts):
const featureOn = (cfg, key) => cfg?.features?.[key] !== false;
const termOf = (cfg, key, fb) => cfg?.terms?.[key] || fb;
const featLabel = (cfg) => termOf(cfg, 'nav.ayin', 'מעקב טיפול');
const itemLabel = (cfg) => termOf(cfg, 'entity.ayinItem', 'שם לטיפול');
const unitLabel = (cfg) => termOf(cfg, 'entity.ayinUnit', 'כמות');
const S = [featureOn, termOf, featLabel, itemLabel, unitLabel];
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const keys = (a) => a.map((x) => x.key).join(',');
// courses — מלא (חסר=פעיל):
const cf = expFieldDefs({}, 'courses', ...S);
ok(cf.length === 14, 'courses מלא: ' + cf.length + ' ≠ 14');
ok(cf[0].key === 'name' && cf[0].label === 'שם החוג', "courses[0]: " + JSON.stringify(cf[0]));
ok(cf[1].label === 'מורה + טלפון', 'courses[1].label: ' + cf[1].label);
ok(cf[9].key === 'studentsFull', 'courses[9].key: ' + cf[9].key);
ok(cf[13].key === 'notes', 'courses[13].key: ' + cf[13].key);
// courses — מקוצר:
const cs = expFieldDefs({ features: { 'reports.custom.full': false } }, 'courses', ...S);
ok(cs.length === 7, 'courses מקוצר: ' + cs.length + ' ≠ 7');
ok(cs[0].label === 'שם החוג', 'courses מקוצר [0].label');
ok(keys(cs) === 'name,teacher,model,occ,students,pays,abs', 'courses מקוצר keys: ' + keys(cs));
// events — תמיד 8:
for (const cfg of [{}, { features: { 'reports.custom.full': false } }]) {
  const ev = expFieldDefs(cfg, 'events', ...S);
  ok(ev.length === 8 && keys(ev) === 'title,type,hdate,gdate,time,fam,notes,done', 'events: ' + keys(ev));
  ok(ev[5].label === 'משפחה', 'events[5].label: ' + ev[5].label);
}
// supporters — מלא+ayin:
const sa = expFieldDefs({}, 'supporters', ...S);
ok(sa.length === 17, 'supporters מלא+ayin: ' + sa.length + ' ≠ 17');
ok(sa[9].key === 'tier', 'supporters[9].key: ' + sa[9].key);
ok(sa.find((x) => x.key === 'stage')?.label === 'שלב מעקב טיפול', 'stage.label');
ok(sa.find((x) => x.key === 'names')?.label === 'שם לטיפול + כמות', 'names.label');
ok(sa[16].key === 'notes', 'notes אחרון');
// supporters — מלא בלי ayin:
const sn = expFieldDefs({ features: { 'supporters.ayin': false } }, 'supporters', ...S);
ok(sn.length === 11 && !sn.some((x) => x.key === 'stage'), 'supporters מלא בלי-ayin: ' + sn.length);
// supporters — מקוצר:
const sm = expFieldDefs({ features: { 'reports.custom.full': false, 'supporters.ayin': false } }, 'supporters', ...S);
ok(sm.length === 4 && keys(sm) === 'name,phone,email,dons', 'supporters מקוצר: ' + keys(sm));
ok(sm[3].label === 'תרומות בטווח (מספר + סכום)', 'dons.label: ' + sm[3].label);
const sma = expFieldDefs({ features: { 'reports.custom.full': false } }, 'supporters', ...S);
ok(sma.length === 8 && keys(sma) === 'name,phone,email,dons,stage,names,answers,next', 'supporters מקוצר+ayin: ' + keys(sma));
if (f) process.exit(1);
console.log('✓ exp-field-defs: כל דוגמאות-החוזה — ירוק');
