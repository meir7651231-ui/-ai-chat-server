import { deleteOrgMemberConfig } from './delete-org-member-config.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const docCalls = [];
const updateCalls = [];
let fieldPathInstances = [];
let deleteFieldCalls = 0;
class FakeFieldPath {
  constructor(...segments) { this.segments = segments; fieldPathInstances.push(this); }
}
const sentinel = { __deleteField: true };
const fs = {
  db,
  doc: (...args) => { docCalls.push(args); return ref; },
  updateDoc: async (...args) => { updateCalls.push(args); },
  FieldPath: FakeFieldPath,
  deleteField: () => { deleteFieldCalls++; return sentinel; },
};

// 1–4) מסלול מוצלח + פרוטוקול-הקריאות
const out = await deleteOrgMemberConfig('kehila', 'Anat.Levi@gmail.com', fs);
chk('1 doc(db,platformOrgs,kehila) + FieldPath דו-מקטעי כלשונו',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila']) &&
  fieldPathInstances.length === 1 &&
  JSON.stringify(fieldPathInstances[0].segments) === JSON.stringify(['memberConfigs', 'Anat.Levi@gmail.com']));
chk('2 updateDoc(ref, FieldPath, סנטינל) פעם אחת',
  updateCalls.length === 1 && updateCalls[0][0] === ref &&
  updateCalls[0][1] instanceof FakeFieldPath && updateCalls[0][2] === sentinel);
chk('3 deleteField נקרא פעם אחת', deleteFieldCalls === 1);
chk('4 מחזיר undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await deleteOrgMemberConfig('s', 'a@b.c', { ...fs, updateDoc: async () => { throw new Error('no-doc'); } });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'no-doc');

if (f) process.exit(1);
console.log('✓ delete-org-member-config: 5 דוגמאות-חוזה (שקעי-fs + FieldPath) — ירוק');
