import { taskOverdue } from './task-overdue.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const today = '2026-08-24';
// 1) יעד שעבר ⇒ באיחור
ok(taskOverdue({ due: '2026-08-20' }, today) === true, 'דוגמה 1: יעד-שעבר לא זוהה כאיחור');
// 2) יעד היום ⇒ לא איחור
ok(taskOverdue({ due: '2026-08-24' }, today) === false, 'דוגמה 2: יעד-היום נחשב איחור');
// 3) יעד עתידי ⇒ לא איחור
ok(taskOverdue({ due: '2026-08-25' }, today) === false, 'דוגמה 3: יעד-עתידי נחשב איחור');
// 4) בוצעה ⇒ לעולם לא באיחור
ok(taskOverdue({ due: '2026-08-20', doneAt: '2026-08-23T10:00' }, today) === false, 'דוגמה 4: משימה-שבוצעה נחשבה איחור');
// 5) בלי יעד ⇒ לא איחור
ok(taskOverdue({}, today) === false, 'דוגמה 5: בלי-due נחשב איחור');
ok(taskOverdue({ due: '' }, today) === false, 'דוגמה 5: due-ריק נחשב איחור');
if (f) process.exit(1);
console.log('✓ task-overdue: 5 דוגמאות-חוזה — ירוק');
