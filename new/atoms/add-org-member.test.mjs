import { addOrgMember } from './add-org-member.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const sentinel = { __arrayUnion: true };
const docCalls = [];
const updateCalls = [];
const unionCalls = [];
const fs = {
  db,
  doc: (...args) => { docCalls.push(args); return ref; },
  updateDoc: async (...args) => { updateCalls.push(args); },
  arrayUnion: (...args) => { unionCalls.push(args); return sentinel; },
};

// 1) נירמול-מייל + נתיב-מסמך
const out = await addOrgMember('kehila', '  Anat.Levi@Gmail.com ', fs);
chk('1 doc(db,platformOrgs,kehila) + arrayUnion במייל מנורמל',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila']) &&
  unionCalls.length === 1 &&
  JSON.stringify(unionCalls[0]) === JSON.stringify(['anat.levi@gmail.com']));

// 2) updateDoc פעם אחת: ref + {members: סנטינל} בלבד
chk('2 updateDoc(ref,{members:סנטינל}) פעם אחת',
  updateCalls.length === 1 && updateCalls[0][0] === ref &&
  JSON.stringify(Object.keys(updateCalls[0][1])) === JSON.stringify(['members']) &&
  updateCalls[0][1].members === sentinel);

// 3) מייל כבר-מנורמל עובר כמות-שהוא
await addOrgMember('s', 'a@b.com', fs);
chk('3 מייל מנורמל כמות-שהוא',
  unionCalls.length === 2 && JSON.stringify(unionCalls[1]) === JSON.stringify(['a@b.com']));

// 4) מחזיר undefined
chk('4 מחזיר undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await addOrgMember('s', 'a@b.com', { ...fs, updateDoc: async () => { throw new Error('offline'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'offline');

if (f) process.exit(1);
console.log('✓ add-org-member: 5 דוגמאות-חוזה (שקעי-fs + arrayUnion מנורמל) — ירוק');
