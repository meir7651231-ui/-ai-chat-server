import { findDuplicateGroups } from './find-duplicate-groups.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// שקעים מזויפים לפי החוזה
const phonesOf = (fam) => fam.phones || [];
const nameCityKey = (fam) => fam.nk || '';
const run = (fams) => findDuplicateGroups(fams, phonesOf, nameCityKey);

// 1) טלפון משותף
eq(run([{ id: 'a', phones: ['0501111111'] }, { id: 'b', phones: ['0501111111'] }]), [['a', 'b']], 'קיבוץ-טלפון שגוי');

// 2) שם+עיר משותפים
eq(run([{ id: 'a', nk: 'כהן|צפת' }, { id: 'b', nk: 'כהן|צפת' }]), [['a', 'b']], 'קיבוץ-שם+עיר שגוי');

// 3) טרנזיטיביות: a~b בטלפון, b~c בשם+עיר ⇒ קבוצה אחת
eq(run([
  { id: 'a', phones: ['0501111111'] },
  { id: 'b', phones: ['0501111111'], nk: 'לוי|חיפה' },
  { id: 'c', nk: 'לוי|חיפה' },
]), [['a', 'b', 'c']], 'טרנזיטיביות נשברה');

// 4) בודדות לא מוחזרות
eq(run([
  { id: 'a', phones: ['0501111111'] }, { id: 'b', phones: ['0501111111'] },
  { id: 'c', phones: ['0529999999'] },
]), [['a', 'b']], 'בודדת חדרה לקבוצות');

// 5) nk ריק לא מקבץ
eq(run([{ id: 'a', nk: '' }, { id: 'b', nk: '' }]), [], 'nk ריק קיבץ בטעות');

// 6) שני זוגות נפרדים ⇒ שתי קבוצות
eq(run([
  { id: 'a', phones: ['0501111111'] }, { id: 'b', phones: ['0501111111'] },
  { id: 'c', nk: 'מזרחי|לוד' }, { id: 'd', nk: 'מזרחי|לוד' },
]), [['a', 'b'], ['c', 'd']], 'זוגות נפרדים התערבבו');

// 7) ריק ⇒ ריק
eq(run([]), [], 'ריק לא החזיר []');

if (f) process.exit(1);
console.log('✓ find-duplicate-groups: 7 דוגמאות-חוזה — ירוק');
