import { applyEntityPartial } from './apply-entity-partial.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);
const COLS = ['families'];
const idSan = (_c, item) => item;
const cloudWins = (_c, _l, inc) => inc;

// 1) אוסף לא-מוכר ⇒ no-op (אותה רפרנס)
let db = { families: [{ id: 'a', n: 1 }] };
ok(applyEntityPartial(db, 'ghosts', [{ id: 'x', data: {}, deleted: false }], COLS, idSan, cloudWins) === db,
  'אוסף לא-מוכר לא החזיר את אותו db');

// 2) מסמך חדש ⇒ לראש-הרשימה, id מושתל
db = { families: [{ id: 'a', n: 1 }] };
let out = applyEntityPartial(db, 'families', [{ id: 'b', data: { n: 2 }, deleted: false }], COLS, idSan, cloudWins);
eq(out.families, [{ n: 2, id: 'b' }, { id: 'a', n: 1 }], 'חדש לא נכנס לראש');

// 3) עדכון-במקומו ⇒ הסדר נשמר
db = { families: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
out = applyEntityPartial(db, 'families', [{ id: 'b', data: { n: 9 }, deleted: false }], COLS, idSan, cloudWins);
eq(out.families, [{ id: 'a', n: 1 }, { n: 9, id: 'b' }], 'עדכון שבר את הסדר');

// 4) deleted:true ⇒ יוצא
db = { families: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
out = applyEntityPartial(db, 'families', [{ id: 'a', data: {}, deleted: true }], COLS, idSan, cloudWins);
eq(out.families, [{ id: 'b', n: 2 }], 'המחוק לא יצא');

// 5) ביט-זהה ⇒ אותה רפרנס (data כולל id ⇒ סדר-המפתחות נשמר בהשוואת-ה-JSON)
db = { families: [{ id: 'a', n: 1 }] };
ok(applyEntityPartial(db, 'families', [{ id: 'a', data: { id: 'a', n: 1 }, deleted: false }], COLS, idSan, cloudWins) === db,
  'תוצאה ביט-זהה לא החזירה את אותו db');

// 6) שקע-sanitize חל על כל נכנס
db = { families: [] };
out = applyEntityPartial(db, 'families', [{ id: 'c', data: { n: 3 }, deleted: false }], COLS,
  (_c, item) => ({ ...item, tag: 'S' }), cloudWins);
eq(out.families, [{ n: 3, id: 'c', tag: 'S' }], 'שקע-sanitize לא הופעל');

// 7) שקע-merge קובע את העדכון-במקומו
db = { families: [{ id: 'a', n: 1 }] };
out = applyEntityPartial(db, 'families', [{ id: 'a', data: { n: 9 }, deleted: false }], COLS, idSan,
  () => ({ id: 'a', n: 'M' }));
eq(out.families, [{ id: 'a', n: 'M' }], 'תוצר-המיזוג לא נכנס');

if (f) process.exit(1);
console.log('✓ apply-entity-partial: 7 דוגמאות-חוזה — ירוק');
