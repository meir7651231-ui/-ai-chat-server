import { SHARED_PURPOSE_KEY } from './shared-purpose-key.mjs';
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };
chk('ערך ביט-זהה', SHARED_PURPOSE_KEY === '_shared_');
chk('אורך 8', SHARED_PURPOSE_KEY.length === 8);
chk('לא-ריק', !!SHARED_PURPOSE_KEY);
chk('מוקף קווים-תחתונים', SHARED_PURPOSE_KEY.startsWith('_') && SHARED_PURPOSE_KEY.endsWith('_'));
chk('מקטע-Firestore חוקי', !SHARED_PURPOSE_KEY.includes('/') && SHARED_PURPOSE_KEY !== '.' && SHARED_PURPOSE_KEY !== '..');
if (f) process.exit(1); console.log('✓ shared-purpose-key: 5 דוגמאות-חוזה — ירוק');
