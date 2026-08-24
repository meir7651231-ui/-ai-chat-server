import { writeOrgCloudDoc } from './write-org-cloud-doc.mjs';
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

// 1) עדות-נתיב: doc(db,'platformOrgs','kehila') + setDoc על ההפניה
const data1 = { joinOpen: true, joinCode: 'X7' };
const out = await writeOrgCloudDoc('kehila', data1, fs);
chk('1 doc(db,platformOrgs,kehila) פעם אחת + setDoc(ref)',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila']) &&
  setCalls.length === 1 && setCalls[0][0] === ref);

// 2) עותק שווה-ערך אך לא אותה הפניה (עיקור-JSON)
chk('2 deep-equal אך !== (הפניה מנותקת)',
  JSON.stringify(setCalls[0][1]) === JSON.stringify(data1) && setCalls[0][1] !== data1);

// 3) עיקור-undefined: manager נופל מהמסמך הנכתב
await writeOrgCloudDoc('s', { orgName: 'מאור', manager: undefined }, fs);
chk('3 undefined מעוקר — נכתב {orgName} בלבד',
  JSON.stringify(setCalls[1][1]) === JSON.stringify({ orgName: 'מאור' }) &&
  !('manager' in setCalls[1][1]));

// 4) merge:true תמיד — גם על {}
await writeOrgCloudDoc('s', {}, fs);
chk('4 merge:true בכל הקריאות (כולל {})',
  setCalls.every((c) => JSON.stringify(c[2]) === JSON.stringify({ merge: true })) &&
  JSON.stringify(setCalls[2][1]) === '{}');

// + מחזיר undefined
chk('פלט undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await writeOrgCloudDoc('s', {}, { ...fs, setDoc: async () => { throw new Error('permission-denied'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'permission-denied');

if (f) process.exit(1);
console.log('✓ write-org-cloud-doc: 5 דוגמאות-חוזה (merge חלקי + עיקור-JSON) — ירוק');
