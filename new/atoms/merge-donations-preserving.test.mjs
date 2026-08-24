import { mergeDonationsPreserving } from './merge-donations-preserving.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) אוסף שאינו supporters ⇒ incoming עצמו
{
  const inc = { donations: [], count: 9 };
  ok(mergeDonationsPreserving('families', { count: 99 }, inc) === inc, 'col זר לא הוחזר כמות-שהוא');
}

// 2) שימור תרומה מקומית-בלבד + מונים max
{
  const local = { donations: [{ rid: 'R-1', ils: 100 }, { rid: 'R-2', ils: 50 }], count: 2, ils: 150, usd: 0 };
  const inc = { donations: [{ rid: 'R-1', ils: 100 }], count: 1, ils: 100, usd: 0 };
  eq(mergeDonationsPreserving('supporters', local, inc),
    { donations: [{ rid: 'R-1', ils: 100 }, { rid: 'R-2', ils: 50 }], count: 2, ils: 150, usd: 0 },
    'שימור-מקומית/מוני-max שגוי');
}

// 3) זהים ⇒ אותה הפניה
{
  const inc = { donations: [{ rid: 'R-1' }], count: 1, ils: 100 };
  const local = { donations: [{ rid: 'R-1' }], count: 1, ils: 100 };
  ok(mergeDonationsPreserving('supporters', local, inc) === inc, 'זהים לא הוחזרו באותה הפניה');
}

// 4) תרומה מקומית בלי rid אינה משתמרת
{
  const inc = { donations: [], count: 0, ils: 0 };
  ok(mergeDonationsPreserving('supporters', { donations: [{ ils: 5 }], count: 0, ils: 0 }, inc) === inc,
    'תרומה בלי rid שומרה בטעות');
}

// 5) מונים רק עולים גם בלי תרומות-לשימור
{
  const local = { donations: [], count: 3, ils: 0, usd: 0 };
  const inc = { donations: [{ rid: 'R-9' }], count: 1, ils: 0, usd: 0 };
  eq(mergeDonationsPreserving('supporters', local, inc),
    { donations: [{ rid: 'R-9' }], count: 3, ils: 0, usd: 0 }, 'מונה מקומי גבוה לא שרד');
}

// 6) מונה לא-מספרי ⇒ 0
{
  const out = mergeDonationsPreserving('supporters', { donations: [], count: 2 }, { donations: [], count: '7' });
  ok(out.count === 2, `מחרוזת-מונה לא אופסה ⇒ ${JSON.stringify(out.count)}`);
}

// 7) עריכת-ענן על rid משותף מנצחת
{
  const local = { donations: [{ rid: 'R-1', ils: 100 }], count: 1, ils: 120, usd: 0 };
  const inc = { donations: [{ rid: 'R-1', ils: 120 }], count: 1, ils: 120, usd: 0 };
  const out = mergeDonationsPreserving('supporters', local, inc);
  eq(out.donations, [{ rid: 'R-1', ils: 120 }], 'גרסת-הענן על rid משותף לא ניצחה');
}

if (f) process.exit(1);
console.log('✓ merge-donations-preserving: 7 דוגמאות-חוזה — ירוק');
