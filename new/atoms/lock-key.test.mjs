import { lockKey } from './lock-key.mjs';
let f = 0;
const eq = (g, w, m) => { if (g !== w) { console.error(`✗ ${m}: ${g} ≠ ${w}`); f = 1; } };
// default — שקע-זהות ⇒ הבסיס עצמו
eq(lockKey((b) => b), 'maor_lock', 'default');
// ארגון-פלטפורמה — השקע מוסיף slug
eq(lockKey((b) => `${b}:demo`), 'maor_lock:demo', 'slug demo');
eq(lockKey((b) => `${b}:or-rishon`), 'maor_lock:or-rishon', 'slug or-rishon');
// הבסיס המועבר לשקע הוא תמיד 'maor_lock' בדיוק
let seen = null;
lockKey((b) => { seen = b; return b; });
eq(seen, 'maor_lock', 'base קבוע');
if (f) process.exit(1);
console.log('✓ lock-key: 4 דוגמאות-חוזה (שקע-nsLsKey) — ירוק');
