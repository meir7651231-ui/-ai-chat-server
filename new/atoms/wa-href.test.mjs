import { waHref } from './wa-href.mjs';
// שקע waDigits — מימוש-inline כחוזה wa-digits (בדיקת-אטום לא מייבאת אטום — חוק-חיווט):
const waDigits = (phone) => { let d = (phone || '').replace(/\D/g, ''); if (!d) return null; if (d.startsWith('00972')) d = '972' + d.slice(5); else if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('9720')) d = '972' + d.slice(4); if (!d.startsWith('972') && !d.startsWith('0') && (d.length === 8 || d.length === 9)) d = '0' + d; if (d.startsWith('0')) { if (d.length === 9 || d.length === 10) d = '972' + d.slice(1); else return null; } if (d.length < 8 || d.length > 15) return null; return d; };
// שקעים כחוזי wa-app-link / wa-link (inline):
const appAtom = (p, t, wd) => { const d = wd(p); if (!d) return null; const tt = t.trim(); return 'whatsapp://send?phone=' + d + (tt ? '&text=' + encodeURIComponent(tt) : ''); };
const linkAtom = (p, t, wd) => { const d = wd(p); if (!d) return null; const tt = t.trim(); return 'https://wa.me/' + d + (tt ? '?text=' + encodeURIComponent(tt) : ''); };
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
