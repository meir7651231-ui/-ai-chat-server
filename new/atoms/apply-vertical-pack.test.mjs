import { applyVerticalPack } from './apply-vertical-pack.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);
const P = {
  id: 'digital', terms: { 'nav.ayin': 'פרויקטים' }, modules: { shop: false },
  features: { 'a.b': true }, theme: 'tsohar', icon: '💻', accent: '#7c3aed', motion: 'snappy',
};
const N = { id: 'chesed', terms: {}, modules: {} };

// 1) packId לא-מוכר ⇒ no-op (אותה רפרנס)
const cfg1 = { orgName: 'א' };
ok(applyVerticalPack(cfg1, 'ghost', [P]) === cfg1, 'packId לא-מוכר לא החזיר את אותו קונפיג');

// 2) חבילה מלאה — זהות מוחלפת, שאר הקונפיג שורד
const cfg2 = { orgName: 'א', slug: 'x', emoji: '🕯', motion: 'calm', accent: '#000' };
const o2 = applyVerticalPack(cfg2, 'digital', [P]);
eq(o2, {
  orgName: 'א', slug: 'x', emoji: '💻', motion: 'snappy', accent: '#7c3aed',
  terms: { 'nav.ayin': 'פרויקטים' }, modules: { shop: false }, features: { 'a.b': true }, theme: 'tsohar',
}, 'חבילה מלאה: הפלט שגוי');
ok(!('accentCustom' in o2), 'accentCustom הופיע בלי צבע-ידני');

// 3) חבילה עמותתית — theme שורד, זהות-חזותית מוסרת, features={}
const o3 = applyVerticalPack({ theme: 'or-rishon', emoji: '🕯', motion: 'calm', accent: '#000' }, 'chesed', [N]);
ok(o3.theme === 'or-rishon', 'theme נדרס בלי שהחבילה מגדירה');
ok(!('emoji' in o3) && !('motion' in o3) && !('accent' in o3) && !('accentCustom' in o3),
  'זהות-חזותית לא הוסרה בחבילה עמותתית');
eq(o3.features, {}, 'features חסר בחבילה לא הפך {}');

// 4) צבע-ידני שורד
const o4 = applyVerticalPack({ accent: '#123456', accentCustom: true }, 'digital', [P]);
ok(o4.accent === '#123456' && o4.accentCustom === true, 'הצבע-הידני לא שרד');

// 5) עותקים חדשים — לא אותן רפרנסות של החבילה
ok(o2.terms !== P.terms && o2.modules !== P.modules && o2.features !== P.features,
  'terms/modules/features לא הועתקו — שינוי יזלוג לחבילה');

if (f) process.exit(1);
console.log('✓ apply-vertical-pack: 5 דוגמאות-חוזה — ירוק');
