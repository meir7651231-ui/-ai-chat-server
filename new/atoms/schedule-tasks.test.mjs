import { scheduleTasks } from './schedule-tasks.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const J = JSON.stringify;

// 1) שרשרת A(3)→B(2)→C(4)
const chain = scheduleTasks([
  { id: 'a', name: 'A', days: 3 },
  { id: 'b', name: 'B', days: 2, deps: ['a'] },
  { id: 'c', name: 'C', days: 4, deps: ['b'] },
]);
ok(chain.total === 9, 'שרשרת: total=9');
ok(J(chain.tasks.map((t) => [t.id, t.start, t.end, t.critical])) ===
   J([['a', 0, 3, true], ['b', 3, 5, true], ['c', 5, 9, true]]), 'שרשרת: ES/EF/קריטי');

// 2) מקביליות A(5)·B(2)·C(1,deps:[a,b]) — B לא-קריטית, מיון לפי סיום
const par = scheduleTasks([
  { id: 'a', name: 'A', days: 5 },
  { id: 'b', name: 'B', days: 2 },
  { id: 'c', name: 'C', days: 1, deps: ['a', 'b'] },
]);
ok(par.total === 6, 'מקביליות: total=6');
ok(J(par.tasks.map((t) => [t.id, t.start, t.end, t.critical])) ===
   J([['b', 0, 2, false], ['a', 0, 5, true], ['c', 5, 6, true]]), 'מקביליות: B לא-קריטית + מיון');

// 3) שורה בלי-days מסוננת; deps אליה ולעצמה נזרקות
const nod = scheduleTasks([
  { id: 'a', name: 'A', days: 3 },
  { id: 'x', name: 'X' },
  { id: 'b', name: 'B', days: 2, deps: ['x', 'a', 'b'] },
]);
ok(nod.tasks.length === 2 && nod.total === 5, 'בלי-days: 2 משימות, total=5');
const b3 = nod.tasks.find((t) => t.id === 'b');
ok(J(b3.deps) === J(['a']) && b3.start === 3 && b3.end === 5, 'בלי-days: deps מסוננות, B 3-5');

// 4) מחזור A(2,deps:[b])·B(3,deps:[a]) — נעצר, לא נתקע
const cyc = scheduleTasks([
  { id: 'a', name: 'A', days: 2, deps: ['b'] },
  { id: 'b', name: 'B', days: 3, deps: ['a'] },
]);
ok(cyc.total === 7, 'מחזור: total=7');
ok(J(cyc.tasks.map((t) => [t.id, t.start, t.end, t.critical])) ===
   J([['b', 2, 5, true], ['a', 5, 7, false]]), 'מחזור: B 2-5 קריטית, A 5-7 לא');

// 5) ריק
ok(J(scheduleTasks([])) === J({ tasks: [], total: 0 }), 'ריק ⇒ {tasks:[],total:0}');

if (f) process.exit(1);
console.log('✓ schedule-tasks: 5 דוגמאות-חוזה (שרשרת/מקביליות/סינון/מחזור/ריק) — ירוק');
