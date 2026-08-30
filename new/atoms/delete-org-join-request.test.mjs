import { deleteOrgJoinRequest as __pure_deleteOrgJoinRequest } from './delete-org-join-request.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_delete_org_join_request_T = {
  k1: "platformOrgs",
  k2: "joinRequests",
};
const deleteOrgJoinRequest = (...a) => __pure_deleteOrgJoinRequest(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_delete_org_join_request_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const docCalls = [];
const delCalls = [];
const ref = { __ref: true };
const fs = {
  db,
  doc: (...args) => { docCalls.push(args); return ref; },
  deleteDoc: async (r) => { delCalls.push(r); },
};

// 1–3) מסלול מוצלח + פרוטוקול-הקריאות
const out = await deleteOrgJoinRequest('kehila', 'uid-42', fs);
chk('1 doc(db,platformOrgs,kehila,joinRequests,uid-42) פעם אחת',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila', 'joinRequests', 'uid-42']));
chk('2 deleteDoc פעם אחת עם ההפניה של doc', delCalls.length === 1 && delCalls[0] === ref);
chk('3 מחזיר undefined', out === undefined);

// 4) reject מבעבע
let bubbled = '';
try {
  await deleteOrgJoinRequest('s', 'u', { db, doc: () => ref, deleteDoc: async () => { throw new Error('denied'); } });
} catch (e) { bubbled = e.message; }
chk('4 שגיאה מבעבעת', bubbled === 'denied');

if (f) process.exit(1);
console.log('✓ delete-org-join-request: 4 דוגמאות-חוזה (שקעי-fs) — ירוק');
