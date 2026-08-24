import { filterProducts } from './filter-products.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// smartFilter-מזויף: מתעד קריאות, מחזיר את items כמות-שהם
const calls = [];
const fakeSmart = (q, items, getTerms) => { calls.push({ q, items, getTerms }); return items; };

const products = [
  { name: 'קופון', desc: 'הנחה', active: true },
  { name: 'מתנה', desc: '', active: false },
];

// 1) onlyActive=true ⇒ הבסיס = הפעילות בלבד
eq(filterProducts(products, 'הנח', true, fakeSmart).map((p) => p.name), ['קופון'], 'onlyActive לא סינן לא-פעילות');

// 2) onlyActive=false ⇒ הבסיס = הכול, בסדר-המקור
eq(filterProducts(products, '', false, fakeSmart).map((p) => p.name), ['קופון', 'מתנה'], 'onlyActive=false שינה את הבסיס');

// 3) העתק — לא אותו reference
const out3 = filterProducts(products, '', false, fakeSmart);
if (out3 === products) { console.error('✗ הוחזר הקלט עצמו ולא העתק'); f = 1; }

// 4) getTerms ⇒ [name, desc]
eq(calls[0].getTerms({ name: 'קופון', desc: 'הנחה' }), ['קופון', 'הנחה'], 'getTerms לא [name, desc]');

// 5) q עובר כלשונו
if (calls[0].q !== 'הנח') { console.error('✗ q לא הועבר כלשונו'); f = 1; }

if (f) process.exit(1);
console.log('✓ filter-products: 5 דוגמאות-חוזה — ירוק');
