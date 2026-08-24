import { purposeKeyOf, SHARED_PURPOSE_KEY } from './purpose-key-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(SHARED_PURPOSE_KEY === '_shared_', "SHARED_PURPOSE_KEY ≠ '_shared_'");
// 1) ייעוד-אמת מוחזר כלשונו
ok(purposeKeyOf({ purpose: 'בניין' }) === 'בניין', "{'בניין'} לא הוחזר כלשונו");
// 2) גזימת-רווחים
ok(purposeKeyOf({ purpose: '  חוגים  ' }) === 'חוגים', 'רווחים לא נגזמו');
// 3) ריק ⇒ משותף
ok(purposeKeyOf({ purpose: '' }) === '_shared_', "ריק ≠ '_shared_'");
// 4) רווחים-בלבד ⇒ משותף
ok(purposeKeyOf({ purpose: '   ' }) === '_shared_', "רווחים-בלבד ≠ '_shared_'");
// 5) purpose חסר ⇒ משותף
ok(purposeKeyOf({}) === '_shared_', "חסר ≠ '_shared_'");
// 6) purpose=null ⇒ משותף
ok(purposeKeyOf({ purpose: null }) === '_shared_', "null ≠ '_shared_'");
if (f) process.exit(1);
console.log('✓ purpose-key-of: 6 דוגמאות-חוזה — ירוק');
