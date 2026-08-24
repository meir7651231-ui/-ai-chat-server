import { expFieldDefs } from './exp-field-defs.mjs';
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
