import { waHref } from './wa-href.mjs';
import { waAppLink as appAtom } from './wa-app-link.mjs';
import { waLink as linkAtom } from './wa-link.mjs';
import { waDigits } from './wa-digits.mjs';
const appL = (p, t) => appAtom(p, t, waDigits);
const linkL = (p, t) => linkAtom(p, t, waDigits);
let f = 0;
const a = waHref('050-123-4567', 'הי', true, appL, linkL);
if (!a || !a.href.startsWith('whatsapp://send?phone=972501234567') || a.app !== true) { console.error('✗ 1 מצב-אפליקציה'); f = 1; }
const w = waHref('050-123-4567', 'הי', false, appL, linkL);
if (!w || !w.href.startsWith('https://wa.me/972501234567') || w.app !== false) { console.error('✗ 2 מצב-wa.me'); f = 1; }
if (waHref('12', 'הי', true, appL, linkL) !== null) { console.error('✗ 3 לא-תקין ⇒ null (אפליקציה)'); f = 1; }
if (waHref('12', 'הי', false, appL, linkL) !== null) { console.error('✗ 4 לא-תקין ⇒ null (wa.me)'); f = 1; }
if (f) process.exit(1);
console.log('✓ wa-href: 4 דוגמאות-חוזה — ירוק');
