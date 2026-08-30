import { stripSupporterDonations as __pure_stripSupporterDonations } from './strip-supporter-donations.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_stripSupporterDonations_STRIP_SUPPORTER_DONATIONS_T = {
  k1: "supporters",
  k2: "object",
};
const stripSupporterDonations = (...a) => __pure_stripSupporterDonations(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripSupporterDonations_STRIP_SUPPORTER_DONATIONS_T);

let f = 0;
const chk = (n, ok) => { if (!ok) { console.error(`✗ ${n}`); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1. ריקון donations בתומך, שאר-השדות נשמרים
const d1 = { sets: [{ col: 'supporters', id: 's1', data: { name: 'ראובן', donations: [{ amount: 100 }] } }], deletes: [] };
const r1 = stripSupporterDonations(d1);
chk('דוגמה-1', eq(r1.sets[0].data, { name: 'ראובן', donations: [] }));

// 2. אוסף אחר — ללא-שינוי (זהה-רפרנס)
const d2 = { sets: [{ col: 'families', id: 'f1', data: { donations: [1, 2] } }] };
const r2 = stripSupporterDonations(d2);
chk('דוגמה-2', r2.sets[0] === d2.sets[0] && eq(r2.sets[0].data.donations, [1, 2]));

// 3. data:null — לא נוגעים
const d3 = { sets: [{ col: 'supporters', id: 's2', data: null }] };
chk('דוגמה-3', stripSupporterDonations(d3).sets[0] === d3.sets[0]);

// 4. שדות-אחים עוברים זהה-רפרנס
const meta = { orgName: 'א' };
const d4 = { sets: [], deletes: ['x'], meta };
const r4 = stripSupporterDonations(d4);
chk('דוגמה-4', r4.deletes === d4.deletes && r4.meta === meta);

// 5. אי-מוטציה של המקור
chk('דוגמה-5', eq(d1.sets[0].data.donations, [{ amount: 100 }]));

// 6. תומך בלי donations — המפתח נוסף ריק
const d6 = { sets: [{ col: 'supporters', id: 's3', data: { name: 'לאה' } }] };
chk('דוגמה-6', eq(stripSupporterDonations(d6).sets[0].data, { name: 'לאה', donations: [] }));

if (f) process.exit(1);
console.log('✓ strip-supporter-donations: 6 דוגמאות-חוזה — ירוק');
