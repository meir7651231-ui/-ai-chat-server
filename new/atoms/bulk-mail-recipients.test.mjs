import { bulkMailRecipients } from './bulk-mail-recipients.mjs';
const norm = (s) => (s || '').trim().toLowerCase();
let f = 0;
const r1 = bulkMailRecipients([
  { id: 'a', name: 'אבי', email: ' Avi@X.co ' },
  { id: 'b', name: 'בני', email: 'avi@x.co' },   // דדופ — אותה כתובת מנורמלת
  { id: 'c', name: 'גדי' },                        // בלי מייל — מסונן
  { id: 'd', name: 'דנה', email: 'not-an-email' }, // בלי @ — מסונן
  { id: 'e', name: 'הדס', email: 'h@y.co' },
], norm);
if (r1.length !== 2) { console.error('✗ 1 סינון+דדופ ⇒ 2'); f = 1; }
if (r1[0].id !== 'a' || r1[0].email !== 'Avi@X.co') { console.error('✗ 2 הראשון-שורד + trim בלבד (לא lowercase)'); f = 1; }
if (r1[1].id !== 'e') { console.error('✗ 3 סדר-שימור'); f = 1; }
if (bulkMailRecipients([], norm).length !== 0) { console.error('✗ 4 ריק'); f = 1; }
if (bulkMailRecipients([{ id: 'x', name: '', email: 'a@b.c' }], norm)[0].name !== '') { console.error('✗ 5 שם-חסר ⇒ ריק'); f = 1; }
if (f) process.exit(1);
console.log('✓ bulk-mail-recipients: 5 דוגמאות-חוזה — ירוק');
