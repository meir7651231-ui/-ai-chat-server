import { payLink as __pure_payLink } from './pay-link.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_payLink_PAY_LINK_T = {
  k1: "%7Bamount%7D",
  k2: "{amount}",
  k3: "Amount",
  k4: "ClientName",
  k5: "amount",
  k6: "name",
};
const payLink = (...a) => __pure_payLink(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_payLink_PAY_LINK_T);
// שקע safeHttpsUrl כחוזה safe-https-url: ‏https בלבד, שבור/ריק ⇒ null.
const safeHttpsUrl = (raw) => {
  const t = (raw || '').trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
};
let f = 0;
if (payLink('http://pay.example.com/x', 100, '', safeHttpsUrl) !== null) { console.error('✗ 1 לא-https'); f = 1; }
if (payLink('https://pay.example.com/give', 100, 'דוד', safeHttpsUrl) !== 'https://pay.example.com/give?amount=100&name=%D7%93%D7%95%D7%93') { console.error('✗ 2 גנרי'); f = 1; }
if (payLink('https://pay.example.com/give', 99.999, '', safeHttpsUrl) !== 'https://pay.example.com/give?amount=100') { console.error('✗ 3 עיגול'); f = 1; }
if (payLink('https://pay.example.com/give', 0, '', safeHttpsUrl) !== 'https://pay.example.com/give') { console.error('✗ 4 סכום-0'); f = 1; }
if (payLink('https://x.com/pay/{amount}/{name}', 250, 'רות', safeHttpsUrl) !== 'https://x.com/pay/250/%D7%A8%D7%95%D7%AA') { console.error('✗ 5 תבנית'); f = 1; }
if (payLink('https://www.matara.pro/nedarimplus/online/?mosad=123', 180, 'לוי', safeHttpsUrl) !== 'https://www.matara.pro/nedarimplus/online/?mosad=123&Amount=180&ClientName=%D7%9C%D7%95%D7%99') { console.error('✗ 6 נדרים-פלוס'); f = 1; }
if (payLink('https://x.com/pay/{amount}', 0, '', safeHttpsUrl) !== 'https://x.com/pay/') { console.error('✗ 7 תבנית-סכום-0'); f = 1; }
if (f) process.exit(1);
console.log('✓ pay-link: 7 דוגמאות-חוזה — ירוק');
