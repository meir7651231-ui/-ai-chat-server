import { callerKindLabel } from './caller-kind-label.mjs';

// שקע-termOf בסמנטיקת-המקור (lib/config.ts): דריסה ריקה/רווחים = אין-דריסה
const termOf = (cfg, key, fb) => {
  const v = cfg?.terms?.[key];
  if (typeof v === 'string') { const t = v.trim(); if (t) return t; }
  return fb;
};

let f = 0;
const eq = (n, got, want) => { if (got !== want) { console.error(`✗ דוגמה ${n}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; } };

// 1 · חמש התוויות ההיסטוריות (בלי דריסות — ביט-זהה ללקוח-החי)
const cfg = {};
eq('1-family', callerKindLabel(cfg, 'family', termOf), 'משפחה');
eq('1-member', callerKindLabel(cfg, 'member', termOf), 'בן/בת משפחה');
eq('1-supporter', callerKindLabel(cfg, 'supporter', termOf), 'תורם/ת');
eq('1-volunteer', callerKindLabel(cfg, 'volunteer', termOf), 'מתנדב/ת');
eq('1-coordinator', callerKindLabel(cfg, 'coordinator', termOf), 'רכז/ת');
// 2 · דריסת-מונח מנצחת (ורטיקל מסחרי)
eq('2', callerKindLabel({ terms: { 'entity.supporter': 'ליד' } }, 'supporter', termOf), 'ליד');
// 3 · דריסה של רווחים = אין-דריסה
eq('3', callerKindLabel({ terms: { 'entity.family': '   ' } }, 'family', termOf), 'משפחה');
// 4 · סוג לא-מוכר
eq('4', callerKindLabel(cfg, 'alien', termOf), undefined);

if (f) process.exit(1);
console.log('✓ caller-kind-label: 8 בדיקות מ-4 דוגמאות-חוזה — ירוק');
