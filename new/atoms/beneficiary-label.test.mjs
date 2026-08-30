import { beneficiaryLabel as __pure_beneficiaryLabel } from './beneficiary-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_beneficiaryLabel_BENEFICIARY_LABEL_T = {
  k1: "entity.familyOf",
  k2: "משפחת",
  k3: "entity.family",
  k4: "משפחה",
  k5: " לא ידועה",
};
const beneficiaryLabel = (...a) => __pure_beneficiaryLabel(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_beneficiaryLabel_BENEFICIARY_LABEL_T);
// שקע termOf — ההתנהגות האמיתית (מילון-הארגון או ברירת-מחדל; ריק/רווחים ⇒ נסיגה)
const termOf = (cfg, key, fallback) => {
  const v = cfg.terms?.[key];
  if (typeof v === 'string') { const t = v.trim(); if (t) return t; }
  return fallback;
};
const db = { families: [{ id: 'f1', name: 'כהן', members: [{ id: 'm1', first: 'דוד' }] }] };
const C = [
  [{ famId: 'f1' }, undefined, 'משפחת כהן'],
  [{ famId: 'f1', memberId: 'm1' }, undefined, 'משפחת כהן — דוד'],
  [{ famId: 'f1', memberId: 'mX' }, undefined, 'משפחת כהן'],
  [{ famId: 'zzz', memberId: 'm1' }, undefined, 'משפחה לא ידועה'],
  [{ famId: 'f1', memberId: 'm1' }, { terms: { 'entity.familyOf': 'לקוח' } }, 'לקוח כהן — דוד'],
  [{ famId: 'f1' }, { terms: {} }, 'משפחת כהן'],
];
let f = 0;
for (const [a, cfg, w] of C) {
  const g = beneficiaryLabel(db, a, cfg, termOf);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} + cfg=${JSON.stringify(cfg)} ⇒ "${g}" ≠ "${w}"`); f = 1; }
}
if (f) process.exit(1); console.log('✓ beneficiary-label: 6 דוגמאות-חוזה — ירוק');
