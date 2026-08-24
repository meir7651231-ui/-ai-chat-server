import { ORG_NEEDS } from './org-needs.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) בדיוק 7
ok(ORG_NEEDS.length === 7, 'length ≠ 7');
// 2) הראשון
ok(
  ORG_NEEDS[0].id === 'crm' && ORG_NEEDS[0].emoji === '👥' && ORG_NEEDS[0].label === 'ניהול לקוחות ואנשי קשר',
  'הרשומה הראשונה שגויה',
);
// 3) האחרון
ok(
  ORG_NEEDS[6].id === 'backup' && ORG_NEEDS[6].emoji === '🔒' && ORG_NEEDS[6].label === 'גיבוי ואבטחת מידע',
  'הרשומה האחרונה שגויה',
);
// 4) סדר-ה-id המחייב
ok(
  ORG_NEEDS.map((n) => n.id).join(',') === 'crm,billing,schedule,inventory,reports,multi,backup',
  'סדר-ה-id שגוי',
);
// 5) billing
const billing = ORG_NEEDS.find((n) => n.id === 'billing');
ok(billing.emoji === '🧾' && billing.label === 'גבייה, תשלומים וקבלות', 'billing שגוי');
// 6) ייחודיות + שדות מלאים
ok(new Set(ORG_NEEDS.map((n) => n.id)).size === 7, 'id כפול');
ok(
  ORG_NEEDS.every(
    (n) =>
      typeof n.id === 'string' && n.id && typeof n.emoji === 'string' && n.emoji && typeof n.label === 'string' && n.label,
  ),
  'שדה חסר/ריק',
);
if (f) process.exit(1);
console.log('✓ org-needs: 6 דוגמאות-חוזה — ירוק');
