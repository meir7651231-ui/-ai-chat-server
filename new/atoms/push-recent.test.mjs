import { pushRecent } from './push-recent.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1) רשימה ריקה
ok(eq(pushRecent([], 'f1'), ['f1']), 'דוגמה 1: [] + f1 ≠ [f1]');

// 2) החדש בראש
ok(eq(pushRecent(['f1', 'f2'], 'f3'), ['f3', 'f1', 'f2']), 'דוגמה 2: החדש לא בראש');

// 3) ייחודיות — מופע קיים קודם לראש ומוסר ממקומו
ok(eq(pushRecent(['f1', 'f2', 'f3'], 'f2'), ['f2', 'f1', 'f3']), 'דוגמה 3: הייחודיות/הקידום שגויים');

// 4) תקרת 6 — האחרון נדחק
ok(
  eq(pushRecent(['a', 'b', 'c', 'd', 'e', 'f'], 'g'), ['g', 'a', 'b', 'c', 'd', 'e']),
  'דוגמה 4: תקרת-6 לא נאכפה (f היה אמור להידחק)'
);

// 5) טוהר — הקלט לא משתנה
{
  const ids = ['f1', 'f2'];
  pushRecent(ids, 'f3');
  ok(ids.length === 2 && ids[0] === 'f1', 'דוגמה 5: הקלט המקורי השתנה');
}

process.exit(f);
