import { bulkWaRecipients } from './bulk-wa-recipients.mjs';
import { waDigits } from './wa-digits.mjs';
let f = 0;
const r = bulkWaRecipients([
  { id: 'a', name: 'אבי', phone: '050-123-4567' },
  { id: 'b', name: 'בני', phone: '0501234567' },   // אותן ספרות — דדופ
  { id: 'c', name: 'גדי', phone: '12' },            // לא-תקין — מסונן
  { id: 'd', name: 'דנה' },                          // בלי טלפון — מסונן
  { id: 'e', name: 'הדס', phone: '052-999-8877' },
], waDigits);
if (r.length !== 2) { console.error('✗ 1 סינון+דדופ ⇒ 2'); f = 1; }
if (r[0].id !== 'a' || r[0].digits !== '972501234567') { console.error('✗ 2 הראשון + ספרות-בינ"ל'); f = 1; }
if (r[0].phone !== '050-123-4567') { console.error('✗ 3 phone מקורי נשמר'); f = 1; }
if (r[1].digits !== '972529998877') { console.error('✗ 4 השני'); f = 1; }
if (bulkWaRecipients([], waDigits).length !== 0) { console.error('✗ 5 ריק'); f = 1; }
if (f) process.exit(1);
console.log('✓ bulk-wa-recipients: 5 דוגמאות-חוזה — ירוק');
