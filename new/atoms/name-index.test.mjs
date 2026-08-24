import { nameIndex } from './name-index.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const DB = { __db: true };

// 1+2+3) מיפוי, זהות-הפניה, קריאה-אחת עם ה-db
{
  const m1 = { id: 'm1', name: 'דנה' };
  const m2 = { id: 'm2', name: 'יוסי' };
  const calls = [];
  const map = nameIndex(DB, (db) => { calls.push(db); return [m1, m2]; });
  chk('1 מפה בגודל 2 עם שני החברים',
    map.size === 2 && map.get('m1').name === 'דנה' && map.get('m2').name === 'יוסי');
  chk('2 זהות-הפניה (לא עותק)', map.get('m1') === m1 && map.get('m2') === m2);
  chk('3 השקע נקרא פעם אחת עם ה-db', calls.length === 1 && calls[0] === DB);
}

// 4) רשימה ריקה ⇒ מפה ריקה
{
  const map = nameIndex(DB, () => []);
  chk('4 מפה ריקה', map.size === 0 && map.get('m1') === undefined);
}

// 5) מזהה כפול — האחרון מנצח
{
  const map = nameIndex(DB, () => [{ id: 'm1', v: 1 }, { id: 'm1', v: 2 }]);
  chk('5 כפול: האחרון מנצח', map.size === 1 && map.get('m1').v === 2);
}

if (f) process.exit(1);
console.log('✓ name-index: 5 דוגמאות-חוזה — ירוק');
