import { writeOrgJoinRequest } from './write-org-join-request.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const docCalls = [];
const setCalls = [];
const fs = {
  db,
  doc: (...args) => { docCalls.push(args); return ref; },
  setDoc: async (...args) => { setCalls.push(args); },
};

// 1) עדות-נתיב: 5 מקטעים לתת-האוסף
const out = await writeOrgJoinRequest('kehila', 'U1', { email: 'a@b.com' }, fs);
chk('1 doc(db,platformOrgs,kehila,joinRequests,U1) + setDoc(ref)',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila', 'joinRequests', 'U1']) &&
  setCalls.length === 1 && setCalls[0][0] === ref);

// 2) בלי merge — שני ארגומנטים בדיוק
chk('2 setDoc בשני ארגומנטים (אין אופציות)', setCalls[0].length === 2);

// 3) deep-equal אך !== (עיקור-JSON)
const req3 = { name: 'ענת', phone: '0521112223', code: 'J7', at: '2026-08-24' };
await writeOrgJoinRequest('s', 'U2', req3, fs);
chk('3 הנכתב deep-equal ל-req אך לא אותה הפניה',
  JSON.stringify(setCalls[1][1]) === JSON.stringify(req3) && setCalls[1][1] !== req3);

// 4) עיקור-undefined
await writeOrgJoinRequest('s', 'U3', { email: 'a@b.com', code: undefined }, fs);
chk('4 undefined מעוקר — {email} בלבד',
  JSON.stringify(setCalls[2][1]) === JSON.stringify({ email: 'a@b.com' }) &&
  !('code' in setCalls[2][1]));

// + מחזיר undefined
chk('פלט undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await writeOrgJoinRequest('s', 'U4', {}, { ...fs, setDoc: async () => { throw new Error('permission-denied'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'permission-denied');

if (f) process.exit(1);
console.log('✓ write-org-join-request: 5 דוגמאות-חוזה (תת-אוסף 5 מקטעים, בלי merge) — ירוק');
