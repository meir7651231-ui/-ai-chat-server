import { openCloudKey } from './open-cloud-key.mjs';
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };

// 1. האצלה שקופה — אותם ארגומנטים, אותו ערך-מוחזר (===), קריאה יחידה
const S = { sentinel: true };
const calls = [];
const spy = (...a) => { calls.push(a); return S; };
const env = { iter: 1000 };
chk('מחזיר בדיוק את פלט-השקע', openCloudKey(env, 'סוד', 'pass', spy) === S);
chk('קריאה יחידה', calls.length === 1);
chk('ארגומנטים כלשונם (רפרנסים)', calls[0][0] === env && calls[0][1] === 'סוד' && calls[0][2] === 'pass');

// 2. via='rec' מועבר כלשונו
openCloudKey(env, 'מפתח', 'rec', spy);
chk("via='rec' עובר", calls[1][2] === 'rec');

// 3. null (סוד שגוי) מחלחל
chk('null מחלחל', (await openCloudKey(env, 'רע', 'pass', () => Promise.resolve(null))) === null);

if (f) process.exit(1);
console.log('✓ open-cloud-key: 3 דוגמאות-חוזה (שקע openDek) — ירוק');
