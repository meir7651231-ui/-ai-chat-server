import { mergeFamiliesByFields as __pure_mergeFamiliesByFields } from './merge-families-by-fields.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_mergeFamiliesByFields_MERGE_FAMILIES_BY_FIELDS_T = {
  k1: "kidsHome",
  k2: "kidsMarried",
  k3: "status",
  k4: "name",
  k5: "mother",
  k6: "father",
  k7: "phone",
  k8: "phone2",
  k9: "email",
  k10: "city",
  k11: "address",
  k12: "motherId",
  k13: "fatherId",
  k14: "community",
  k15: "language",
  k16: "maritalStatus",
  k17: "createdAt",
  k18: "notes",
};
const mergeFamiliesByFields = (...a) => __pure_mergeFamiliesByFields(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_mergeFamiliesByFields_MERGE_FAMILIES_BY_FIELDS_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// שקעים מזויפים לפי החוזה
const deps = {
  mergeFamilies: (k) => ({ ...k }),
  // הלוגיקה המקורית של dup-field-value (edit ⇒ pick ⇒ ראשונה-עם-ערך)
  dupFieldValue: (fams, def, pick, edit) => {
    const edited = edit[def.key];
    if (edited != null) return edited;
    const idx = pick[def.key] ?? fams.findIndex((fm) => def.get(fm));
    return def.get(fams[idx >= 0 ? idx : 0]);
  },
  dupFields: [
    { key: 'name', get: (fm) => fm.name || '' },
    { key: 'status', get: (fm) => fm.status || '' },
    { key: 'kidsHome', get: (fm) => (fm.kidsHome == null ? '' : String(fm.kidsHome)) },
  ],
};
const fams = [
  { id: 'f1', name: '', status: 'pending', kidsHome: 2 },
  { id: 'f2', name: 'לוי', status: 'active', kidsHome: 4 },
];

// 1) בלי pick/edit — הראשונה-עם-ערך לכל שדה
eq(mergeFamiliesByFields(fams, {}, {}, deps),
  { id: 'f1', name: 'לוי', status: 'pending', kidsHome: 2 }, 'ברירת-מחדל שגויה');

// 2) pick בוחר מקור + המרת-מספר
ok(mergeFamiliesByFields(fams, { kidsHome: 1 }, {}, deps).kidsHome === 4, 'pick למונה לא הומר ל-4');

// 3) edit גובר על pick
ok(mergeFamiliesByFields(fams, { name: 1 }, { name: 'אדית' }, deps).name === 'אדית', 'edit לא גבר על pick');

// 4) מונה ריק ⇒ 0
ok(mergeFamiliesByFields(fams, {}, { kidsHome: '' }, deps).kidsHome === 0, "'' במונה לא הפך ל-0");

// 5) סטטוס ריק ⇒ סטטוס-הבסיס
ok(mergeFamiliesByFields(fams, {}, { status: '' }, deps).status === 'pending', "'' בסטטוס לא נפל לבסיס");

// 6) שדה מחוץ ל-dupFields נשאר מהבסיס
ok(mergeFamiliesByFields(fams, { name: 1 }, {}, deps).id === 'f1', 'id נדרס שלא-כדין');

if (f) process.exit(1);
console.log('✓ merge-families-by-fields: 6 דוגמאות-חוזה — ירוק');
