import { allOffConfig } from './all-off-config.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// 1) דוגמת-הליבה
const out1 = allOffConfig('demo', 'מאור', ['a', 'b'], { theme: 'x' });
ok(eq(out1, { theme: 'x', slug: 'demo', orgName: 'מאור', modules: { a: false, b: false }, features: {}, terms: {} }),
  'דוגמה 1 נכשלה: ' + JSON.stringify(out1));
// 2) false מפורש (לא undefined)
ok(out1.modules.a === false, 'modules.a אינו false מפורש');
// 3) דריסת-בסיס
const base3 = { slug: 'default', modules: { a: true }, features: { f: 1 } };
const out3 = allOffConfig('s1', 'שם', ['a'], base3);
ok(out3.slug === 's1' && out3.modules.a === false && eq(out3.features, {}), 'דריסת-הבסיס נכשלה');
// 4) 9 המפתחות של maor — כולם false
const MODS = ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'];
const out4 = allOffConfig('s', 'x', MODS, {});
ok(Object.keys(out4.modules).length === 9 && Object.values(out4.modules).every((v) => v === false),
  '9 המודולים אינם כולם false');
// 5) טוהר — הבסיס לא שונה, הפלט רפרנס חדשה
ok(eq(base3, { slug: 'default', modules: { a: true }, features: { f: 1 } }), 'defaultConfig עבר מוטציה');
ok(out3 !== base3, 'הפלט הוא אותה רפרנס כמו הבסיס');
if (f) process.exit(1);
console.log('✓ all-off-config: 5 דוגמאות-חוזה — ירוק');
