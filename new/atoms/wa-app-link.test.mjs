import { waAppLink } from './wa-app-link.mjs';
import { waDigits } from './wa-digits.mjs';
let f = 0;
if (waAppLink('050-123-4567', '', waDigits) !== 'whatsapp://send?phone=972501234567') { console.error('✗ 1 בלי-טקסט'); f = 1; }
if (waAppLink('050-123-4567', 'שלום עולם', waDigits) !== 'whatsapp://send?phone=972501234567&text=' + encodeURIComponent('שלום עולם')) { console.error('✗ 2 עם-טקסט-עברי'); f = 1; }
if (waAppLink('12', 'hi', waDigits) !== null) { console.error('✗ 3 לא-תקין ⇒ null'); f = 1; }
if (waAppLink('0501234567', '  ', waDigits) !== 'whatsapp://send?phone=972501234567') { console.error('✗ 4 טקסט-רווחים ⇒ כמו-ריק'); f = 1; }
if (f) process.exit(1);
console.log('✓ wa-app-link: 4 דוגמאות-חוזה — ירוק');
