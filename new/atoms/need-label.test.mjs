import { needLabel } from './need-label.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע כקטלוג-המקור (maor/src/lib/signupWizard.ts ORG_NEEDS)
const ORG_NEEDS = [
  { id: 'crm', emoji: '👥', label: 'ניהול לקוחות ואנשי קשר' },
  { id: 'billing', emoji: '🧾', label: 'גבייה, תשלומים וקבלות' },
  { id: 'schedule', emoji: '📅', label: 'יומן, שיבוצים ותורים' },
  { id: 'inventory', emoji: '📦', label: 'מלאי, מוצרים ושירותים' },
  { id: 'reports', emoji: '📊', label: 'דוחות ותובנות' },
  { id: 'multi', emoji: '🏢', label: 'ריבוי סניפים / צוות גדול' },
  { id: 'backup', emoji: '🔒', label: 'גיבוי ואבטחת מידע' },
];
ok(needLabel('crm', ORG_NEEDS) === 'ניהול לקוחות ואנשי קשר', 'crm');
ok(needLabel('billing', ORG_NEEDS) === 'גבייה, תשלומים וקבלות', 'billing');
ok(needLabel('backup', ORG_NEEDS) === 'גיבוי ואבטחת מידע', 'backup');
ok(needLabel('nosuch', ORG_NEEDS) === 'nosuch', 'מזהה-זר לא הוחזר כמו-שהוא');
ok(needLabel('crm', []) === 'crm', 'קטלוג ריק לא נפל למזהה');
if (f) process.exit(1);
console.log('✓ need-label: 5 דוגמאות-חוזה — ירוק');
