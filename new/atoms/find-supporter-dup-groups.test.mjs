import { findSupporterDupGroups } from './find-supporter-dup-groups.mjs';
// שקעי-ייחוס כמוסכמת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const normPhone = (s) => {
  let d = (s || '').replace(/\D/g, '');
  if (/^(\d)\1+$/.test(d)) return '';
  d = d.replace(/^00/, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return d.replace(/^0{2,}/, '0');
};
const normId = (s) => {
  const d = (s || '').replace(/\D/g, '');
  if (!d || /^0+$/.test(d)) return '';
  if (d.replace(/^0+/, '').length < 4) return '';
  return d.length >= 5 ? d : '';
};
const supNameCityKey = (sp) => {
  const n = (sp.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const c = (sp.city || '').trim().toLowerCase();
  return n && c ? n + '|' + c : '';
};
const nameSortKey = (t) => String(t || '').toLowerCase().trim().split(/\s+/).filter(Boolean).sort().join(' ');
const S = { normPhone, normId, supNameCityKey, nameSortKey };

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const sorted = (gs) => gs.map((g) => g.slice().sort());

// 1) טלפון מנורמל זהה ⇒ קבוצה אחת
let g = findSupporterDupGroups([{ id: 'a', phone: '050-1234567' }, { id: 'b', phone: '0501234567' }], S);
ok(g.length === 1 && sorted(g)[0].join(',') === 'a,b', 'דוגמה 1: טלפון מנורמל לא קיבץ');
// 2) טלפון <7 ספרות אינו מפתח
g = findSupporterDupGroups([{ id: 'a', phone: '123456' }, { id: 'b', phone: '123456' }], S);
ok(g.length === 0, 'דוגמה 2: טלפון קצר קיבץ בטעות');
// 3) טרנזיטיביות: אימייל + ת"ז ⇒ קבוצה בגודל 3
g = findSupporterDupGroups([
  { id: 'a', email: 'X@y.co' },
  { id: 'b', email: 'x@y.co ', idNum: '123456782' },
  { id: 'c', idNum: '123-456-782' },
], S);
ok(g.length === 1 && sorted(g)[0].join(',') === 'a,b,c', 'דוגמה 3: טרנזיטיביות נשברה');
// 4) שם חסין-סדר (≥2 מילים)
g = findSupporterDupGroups([{ id: 'a', name: 'בן צבי רחל' }, { id: 'b', name: 'רחל בן צבי' }], S);
ok(g.length === 1 && sorted(g)[0].join(',') === 'a,b', 'דוגמה 4: שם חסין-סדר לא קיבץ');
// 5) שם-בודד (בלי רווח) אינו מפתח
g = findSupporterDupGroups([{ id: 'a', name: 'רחל' }, { id: 'b', name: 'רחל' }], S);
ok(g.length === 0, 'דוגמה 5: שם-בודד קיבץ בטעות');
// 6) אין מפתח משותף ⇒ אין קבוצות (יחידים מוחרגים)
g = findSupporterDupGroups([
  { id: 'a', phone: '0501111111', name: 'אהרן כהן' },
  { id: 'b', phone: '0502222222', name: 'ברוך לוי' },
  { id: 'c', phone: '0503333333', name: 'גד ישראלי' },
], S);
ok(g.length === 0, 'דוגמה 6: נוצרה קבוצת-שווא');

if (f) process.exit(1);
console.log('✓ find-supporter-dup-groups: 6 דוגמאות-חוזה — ירוק');
