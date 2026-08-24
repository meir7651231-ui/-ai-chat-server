import { telephonyOn } from './telephony-on.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) enabled:true ⇒ דלוק
ok(telephonyOn({ telephony: { enabled: true } }) === true, 'דוגמה 1: enabled:true לא דלוק');
// 2) enabled:false ⇒ כבוי
ok(telephonyOn({ telephony: { enabled: false } }) === false, 'דוגמה 2: enabled:false דלוק');
// 3) חסר telephony ⇒ כבוי (opt-in)
ok(telephonyOn({}) === false, 'דוגמה 3: חסר-telephony דלוק');
// 4) telephony בלי enabled ⇒ כבוי
ok(telephonyOn({ telephony: {} }) === false, 'דוגמה 4: בלי-enabled דלוק');
// 5) מחרוזת 'true' ⇒ כבוי (=== מחמיר)
ok(telephonyOn({ telephony: { enabled: 'true' } }) === false, "דוגמה 5: 'true' מחרוזת דלוק");
if (f) process.exit(1);
console.log('✓ telephony-on: 5 דוגמאות-חוזה — ירוק');
