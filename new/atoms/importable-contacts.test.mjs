import { importableContacts } from './importable-contacts.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error(`✗ ${name}`); f = 1; } };
// 1. אין כרטיסים
chk('1 ריק', importableContacts('x', () => [], () => true).length === 0);
// 2. סינון-זבל שומר-סדר
const three = [{ n: 'א' }, { n: '' }, { n: 'ב' }];
const got2 = importableContacts('x', () => three, (c) => !c.n);
chk('2 סינון', got2.length === 2 && got2[0].n === 'א' && got2[1].n === 'ב');
// 3. הכול זבל
chk('3 הכול-זבל', importableContacts('x', () => three, () => true).length === 0);
// 4. אפס-זבל — אותן רפרנסים ובאותו סדר
const got4 = importableContacts('x', () => three, () => false);
chk('4 רפרנסים', got4.length === 3 && got4[0] === three[0] && got4[1] === three[1] && got4[2] === three[2]);
// 5. הטקסט מועבר כמו-שהוא, קריאה אחת
const seen = [];
importableContacts('BEGIN:VCARD', (t) => { seen.push(t); return []; }, () => false);
chk('5 העברת-טקסט', seen.length === 1 && seen[0] === 'BEGIN:VCARD');
if (f) process.exit(1);
console.log('✓ importable-contacts: 5 דוגמאות-חוזה — ירוק');
