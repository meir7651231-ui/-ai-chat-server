import { famLiveEnrollments } from './fam-live-enrollments.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) חסר-סטטוס ומוקפא = חיים; ended/wait מסוננים
const mix = [{ id: 1 }, { id: 2, status: 'ended' }, { id: 3, status: 'wait' }, { id: 4, status: 'frozen' }];
eq(famLiveEnrollments({}, {}, () => mix), [{ id: 1 }, { id: 4, status: 'frozen' }], 'סינון ended/wait שגוי');

// 2) היסטוריה-בלבד ⇒ ריק
eq(famLiveEnrollments({}, {}, () => [{ id: 1, status: 'ended' }, { id: 2, status: 'ended' }]), [], 'היסטוריה-בלבד לא רוקנה');

// 3) ריק ⇒ ריק
eq(famLiveEnrollments({}, {}, () => []), [], 'ריק לא נשאר ריק');

// 4) השקע נקרא פעם אחת עם (db, fam) כלשונם
const db = { tag: 'db' }, fam = { tag: 'fam' };
let calls = 0, gotDb = null, gotFam = null;
famLiveEnrollments(db, fam, (d, fm) => { calls++; gotDb = d; gotFam = fm; return []; });
if (calls !== 1 || gotDb !== db || gotFam !== fam) { console.error('✗ השקע לא קיבל (db, fam) כלשונם פעם אחת'); f = 1; }

if (f) process.exit(1);
console.log('✓ fam-live-enrollments: 4 דוגמאות-חוזה — ירוק');
