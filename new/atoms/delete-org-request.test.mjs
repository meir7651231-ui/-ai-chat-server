import { deleteOrgRequest as __pure_deleteOrgRequest } from './delete-org-request.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_delete_org_request_T = {
  k1: "platformRequests",
};
const deleteOrgRequest = (...a) => __pure_deleteOrgRequest(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_delete_org_request_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const docCalls = [];
const delCalls = [];
const fs = {
  db,
  doc: (...args) => { docCalls.push(args); return ref; },
  deleteDoc: async (r) => { delCalls.push(r); },
};

// 1–3) מסלול מוצלח + פרוטוקול-הקריאות
const out = await deleteOrgRequest('uid-77', fs);
chk('1 doc(db,platformRequests,uid-77) פעם אחת',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformRequests', 'uid-77']));
chk('2 deleteDoc פעם אחת עם ההפניה של doc', delCalls.length === 1 && delCalls[0] === ref);
chk('3 מחזיר undefined', out === undefined);

// 4) reject מבעבע
let bubbled = '';
try {
  await deleteOrgRequest('u', { db, doc: () => ref, deleteDoc: async () => { throw new Error('denied'); } });
} catch (e) { bubbled = e.message; }
chk('4 שגיאה מבעבעת', bubbled === 'denied');

if (f) process.exit(1);
console.log('✓ delete-org-request: 4 דוגמאות-חוזה (שקעי-fs) — ירוק');
