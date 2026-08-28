import { waAppLink } from './wa-app-link.mjs';
// שקע waDigits — מימוש-inline כחוזה wa-digits (בדיקת-אטום לא מייבאת אטום — חוק-חיווט):
const waDigits = (phone) => { let d = (phone || '').replace(/\D/g, ''); if (!d) return null; if (d.startsWith('00972')) d = '972' + d.slice(5); else if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('9720')) d = '972' + d.slice(4); if (!d.startsWith('972') && !d.startsWith('0') && (d.length === 8 || d.length === 9)) d = '0' + d; if (d.startsWith('0')) { if (d.length === 9 || d.length === 10) d = '972' + d.slice(1); else return null; } if (d.length < 8 || d.length > 15) return null; return d; };
let f = 0;
if (waAppLink('050-123-4567', '', waDigits) !== 'whatsapp://send?phone=972501234567') { console.error('✗ 1 בלי-טקסט'); f = 1; }
if (waAppLink('050-123-4567', 'שלום עולם', waDigits) !== 'whatsapp://send?phone=972501234567&text=' + encodeURIComponent('שלום עולם')) { console.error('✗ 2 עם-טקסט-עברי'); f = 1; }
if (waAppLink('12', 'hi', waDigits) !== null) { console.error('✗ 3 לא-תקין ⇒ null'); f = 1; }
if (waAppLink('0501234567', '  ', waDigits) !== 'whatsapp://send?phone=972501234567') { console.error('✗ 4 טקסט-רווחים ⇒ כמו-ריק'); f = 1; }
if (f) process.exit(1);
console.log('✓ wa-app-link: 4 דוגמאות-חוזה — ירוק');
