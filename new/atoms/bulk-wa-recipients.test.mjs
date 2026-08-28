import { bulkWaRecipients } from './bulk-wa-recipients.mjs';
// שקע waDigits — מימוש-inline כחוזה wa-digits (בדיקת-אטום לא מייבאת אטום — חוק-חיווט):
const waDigits = (phone) => { let d = (phone || '').replace(/\D/g, ''); if (!d) return null; if (d.startsWith('00972')) d = '972' + d.slice(5); else if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('9720')) d = '972' + d.slice(4); if (!d.startsWith('972') && !d.startsWith('0') && (d.length === 8 || d.length === 9)) d = '0' + d; if (d.startsWith('0')) { if (d.length === 9 || d.length === 10) d = '972' + d.slice(1); else return null; } if (d.length < 8 || d.length > 15) return null; return d; };
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
