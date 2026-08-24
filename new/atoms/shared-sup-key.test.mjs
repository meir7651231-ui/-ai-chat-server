import { SHARED_SUP_KEY } from './shared-sup-key.mjs';
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };
chk('ערך ביט-זהה', SHARED_SUP_KEY === '_shared_');
chk('אורך 8', SHARED_SUP_KEY.length === 8);
chk('לא-ריק', !!SHARED_SUP_KEY);
chk('מוקף קווים-תחתונים', SHARED_SUP_KEY.startsWith('_') && SHARED_SUP_KEY.endsWith('_'));
chk('שווה למפתח-התרומות (אותו מרחב-שמות)', SHARED_SUP_KEY === '_shared_');
if (f) process.exit(1); console.log('✓ shared-sup-key: 5 דוגמאות-חוזה — ירוק');
