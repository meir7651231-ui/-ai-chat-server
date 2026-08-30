import { writeOrgRequest as __pure_writeOrgRequest } from './write-org-request.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_write_org_request_T = {
  k1: "platformRequests",
};
const writeOrgRequest = (...a) => __pure_writeOrgRequest(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_write_org_request_T);
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

// 1) עדות-נתיב
const out = await writeOrgRequest('U1', { orgName: 'מאור' }, fs);
chk('1 doc(db,platformRequests,U1) פעם אחת + setDoc(ref)',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformRequests', 'U1']) &&
  setCalls.length === 1 && setCalls[0][0] === ref);

// 2) בלי merge — שני ארגומנטים בדיוק
chk('2 setDoc בשני ארגומנטים (החלפה מלאה)', setCalls[0].length === 2);

// 3) פרופיל-אשף מלא: deep-equal כולל מערך, אך !==
const req3 = { orgName: 'מאור', industry: 'studio', size: 'small', needs: ['crm', 'receipts'] };
await writeOrgRequest('U2', req3, fs);
chk('3 הנכתב deep-equal (כולל needs) אך לא אותה הפניה',
  JSON.stringify(setCalls[1][1]) === JSON.stringify(req3) &&
  setCalls[1][1] !== req3 && setCalls[1][1].needs !== req3.needs);

// 4) עיקור-undefined
await writeOrgRequest('U3', { phone: '0501234567', industry: undefined }, fs);
chk('4 undefined מעוקר — {phone} בלבד',
  JSON.stringify(setCalls[2][1]) === JSON.stringify({ phone: '0501234567' }) &&
  !('industry' in setCalls[2][1]));

// + מחזיר undefined
chk('פלט undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await writeOrgRequest('U4', {}, { ...fs, setDoc: async () => { throw new Error('permission-denied'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'permission-denied');

if (f) process.exit(1);
console.log('✓ write-org-request: 5 דוגמאות-חוזה (platformRequests/{uid} בלי merge) — ירוק');
