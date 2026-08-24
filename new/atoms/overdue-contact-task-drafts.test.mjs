import { overdueContactTaskDrafts } from './overdue-contact-task-drafts.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-הזהות כהתנהגות-המקור: trim+lowercase, ריק ⇒ 'מקומי'
const tid = (email) => {
  const e = (email ?? '').trim().toLowerCase();
  return e || 'מקומי';
};
const today = '2026-08-24';
// 1) תורם שעבר-יעד ⇒ טיוטה מלאה, זהות מנורמלת
const d1 = overdueContactTaskDrafts([{ id: 's1', name: 'ראובן', nextDate: '2026-08-20' }], [], 'A@x.co', today, tid);
ok(d1.length === 1, 'דוגמה 1: לא טיוטה אחת');
ok(d1[0].assignee === 'a@x.co', 'דוגמה 1: זהות לא נורמלה');
ok(d1[0].title === '📞 להתקשר — ראובן', 'דוגמה 1: כותרת שגויה');
ok(d1[0].ref.kind === 'supporter' && d1[0].ref.id === 's1', 'דוגמה 1: ref שגוי');
ok(d1[0].pri === 1 && d1[0].due === today, 'דוגמה 1: pri/due שגויים');
// 2) בדיוק-היום נכלל; מחר לא
const d2 = overdueContactTaskDrafts(
  [
    { id: 'a', name: 'א', nextDate: '2026-08-24' },
    { id: 'b', name: 'ב', nextDate: '2026-08-25' },
  ],
  [], 'a@x.co', today, tid,
);
ok(d2.length === 1 && d2[0].ref.id === 'a', 'דוגמה 2: גבול-היום שגוי');
// 3) בלי nextDate ⇒ לא נכלל
const d3 = overdueContactTaskDrafts([{ id: 'c', name: 'ג' }, { id: 'd', name: 'ד', nextDate: '' }], [], 'a@x.co', today, tid);
ok(d3.length === 0, 'דוגמה 3: תורם בלי nextDate שובץ');
// 4) דדופ מול משימה פתוחה קיימת; תורם אחר עדיין משובץ
const sup = [
  { id: 's1', name: 'ראובן', nextDate: '2026-08-20' },
  { id: 's2', name: 'שמעון', nextDate: '2026-08-21' },
];
const d4 = overdueContactTaskDrafts(sup, [{ assignee: 'a@x.co', ref: { kind: 'supporter', id: 's1' } }], 'a@x.co', today, tid);
ok(d4.length === 1 && d4[0].ref.id === 's2', 'דוגמה 4: דדופ שגוי');
// 5) משימה סגורה אינה חוסמת
const d5 = overdueContactTaskDrafts(sup, [{ assignee: 'a@x.co', doneAt: '2026-08-23T10:00', ref: { kind: 'supporter', id: 's1' } }], 'a@x.co', today, tid);
ok(d5.length === 2, 'דוגמה 5: משימה סגורה חסמה');
// 6) משימה של עובדת אחרת אינה חוסמת
const d6 = overdueContactTaskDrafts(sup, [{ assignee: 'b@x.co', ref: { kind: 'supporter', id: 's1' } }], 'a@x.co', today, tid);
ok(d6.length === 2, 'דוגמה 6: משימת-אחרת חסמה');
// 7) ref.kind אחר אינו נספר לדדופ
const d7 = overdueContactTaskDrafts(sup, [{ assignee: 'a@x.co', ref: { kind: 'family', id: 's1' } }], 'a@x.co', today, tid);
ok(d7.length === 2, 'דוגמה 7: ref-משפחה נספר לדדופ');
if (f) process.exit(1);
console.log('✓ overdue-contact-task-drafts: 7 דוגמאות-חוזה — ירוק');
