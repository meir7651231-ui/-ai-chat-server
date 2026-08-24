import { mergeSupportersGroup } from './merge-supporters-group.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
// שקע-בדיקה כלשון-החוזה: סוכם ils ורושם את סדר-המיזוג
let calls = 0;
const fakeMerge = (a, b) => {
  calls++;
  return { ...a, ils: a.ils + b.ils, order: [...(a.order ?? []), b.id] };
};

// דוגמה 1 — קיפול-שמאלי של 3 כרטיסים
{
  calls = 0;
  const out = mergeSupportersGroup(
    { id: 'a', ils: 100 },
    [{ id: 'b', ils: 50 }, { id: 'c', ils: 25 }],
    fakeMerge,
  );
  chk('1 ils=175', out.ils === 175);
  chk('1 id=a', out.id === 'a');
  chk('1 סדר', JSON.stringify(out.order) === JSON.stringify(['b', 'c']));
  chk('1 שתי-קריאות', calls === 2);
}
// דוגמה 2 — losers ריק ⇒ ה-keeper עצמו, אפס קריאות
{
  calls = 0;
  const keeper = { id: 'a', ils: 100 };
  const out = mergeSupportersGroup(keeper, [], fakeMerge);
  chk('2 אותו-אובייקט', out === keeper);
  chk('2 אפס-קריאות', calls === 0);
}
// דוגמה 3 — loser יחיד ⇒ קריאה אחת בדיוק
{
  calls = 0;
  const out = mergeSupportersGroup({ id: 'a', ils: 7 }, [{ id: 'z', ils: 3 }], fakeMerge);
  chk('3 ils=10', out.ils === 10);
  chk('3 קריאה-אחת', calls === 1);
}
if (f) process.exit(1);
console.log('✓ merge-supporters-group: 3 דוגמאות-חוזה — ירוק');
