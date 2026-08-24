import { openTasksFor } from './open-tasks-for.mjs';
// מימוש-שקע לבדיקה (רוח המקור): trim+lowercase; ריק ⇒ 'מקומי'.
const taskIdentity = (email) => {
  const e = (email ?? '').trim().toLowerCase();
  return e || 'מקומי';
};
const T = (id, p) => ({ id, pri: 2, createdAt: '2026-08-01', assignee: 'a@x.co', ...p });
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };
const ids = (arr) => arr.map((t) => t.id).join(',');

// 1. סינון: נרמול דו-צדדי, doneAt מוחרג, זרים מוחרגים
const t1 = [
  T('a', { assignee: ' A@X.co ' }),
  T('b', { doneAt: '2026-08-20' }),
  T('c', { assignee: 'b@x.co' }),
];
chk('סינון+נרמול', ids(openTasksFor(t1, 'a@x.co', taskIdentity)) === 'a');

// 2. עדיפות גוברת על יעד
const t2 = [T('x', { pri: 2, due: '2026-08-25' }), T('y', { pri: 1, due: '2026-12-31' })];
chk('pri קודם ל-due', ids(openTasksFor(t2, 'a@x.co', taskIdentity)) === 'y,x');

// 3. שוויון-עדיפות: due קרוב קודם, חסר-due אחרון
const t3 = [T('m', {}), T('n', { due: '2026-09-02' }), T('o', { due: '2026-08-30' })];
chk('due קרוב קודם, חסר אחרון', ids(openTasksFor(t3, 'a@x.co', taskIdentity)) === 'o,n,m');

// 4. שוויון מלא: createdAt ותיק קודם
const t4 = [T('q', { createdAt: '2026-08-05' }), T('p', { createdAt: '2026-08-01' })];
chk('ותיקה קודם', ids(openTasksFor(t4, 'a@x.co', taskIdentity)) === 'p,q');

// 5. identity ריק ⇒ 'מקומי' תופס assignee חסר
const t5 = [T('loc', { assignee: undefined }), T('z', {})];
chk("''⇒'מקומי'", ids(openTasksFor(t5, '', taskIdentity)) === 'loc');

if (f) process.exit(1);
console.log('✓ open-tasks-for: 5 דוגמאות-חוזה (שקע taskIdentity) — ירוק');
