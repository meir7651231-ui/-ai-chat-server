import { watchOrgCloudConfig } from './watch-org-cloud-config.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const unsub = () => 'unsubbed';
const docCalls = [];
const snapCalls = [];
const fs = {
  db,
  doc: (...a) => { docCalls.push(a); return ref; },
  onSnapshot: (...a) => { snapCalls.push(a); return unsub; },
};

const seen = [];
const ret = watchOrgCloudConfig('kehila', (d) => seen.push(d), fs);

// 1) doc(db,'platformOrgs','kehila') + onSnapshot על ההפניה
chk('1 נתיב-מסמך + האזנה',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['platformOrgs', 'kehila']) &&
  snapCalls.length === 1 && snapCalls[0][0] === ref);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) מסמך קיים ⇒ cb(הנתונים)
const next = snapCalls[0][1];
const data = { config: { name: 'קהילה' }, members: ['a@b.com'] };
next({ exists: () => true, data: () => data });
chk('3 קיים ⇒ cb(data)',
  seen.length === 1 && JSON.stringify(seen[0]) === JSON.stringify({ config: { name: 'קהילה' }, members: ['a@b.com'] }));

// 4) מסמך לא-קיים ⇒ cb(null)
next({ exists: () => false, data: () => ({ לא: 'אמור-להיקרא' }) });
chk('4 לא-קיים ⇒ cb(null)', seen.length === 2 && seen[1] === null);

// 5) error-callback שקט
let quiet = true;
try { snapCalls[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-org-cloud-config: 5 דוגמאות-חוזה (נתיב+קיים/null+כשל-רך) — ירוק');
