import { diffDb } from './diff-db.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// השקעים — מימושי-המקור בזעיר-אנפין
const entityCollections = ['families', 'rooms'];
const metaKeys = ['orgName', 'seq'];
const sameJson = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);
const metaOf = (db) => ({ orgName: db.orgName, seq: db.seq, savedAt: db.savedAt });
const run = (p, n) => diffDb(p, n, entityCollections, metaKeys, sameJson, metaOf);
const prev = {
  families: [{ id: 'f1', name: 'כהן' }, { id: 'f2', name: 'לוי' }],
  rooms: [{ id: 'r1', cap: 10 }],
  orgName: 'מאור', seq: 5, savedAt: 't1',
};
const next = {
  families: [{ id: 'f1', name: 'כהן-לוי' }, { id: 'f3', name: 'ברק' }],
  rooms: prev.rooms, // אותה רפרנס — דילוג-===
  orgName: 'מאור', seq: 6, savedAt: 't2',
};
const d = run(prev, next);
// 1) sets: שינוי + חדש; rooms מדולג
ok(d.sets.length === 2, '1: sets.length ≠ 2');
ok(JSON.stringify(d.sets[0]) === JSON.stringify({ col: 'families', id: 'f1', data: { id: 'f1', name: 'כהן-לוי' } }), '1: set-השינוי שגוי');
ok(JSON.stringify(d.sets[1]) === JSON.stringify({ col: 'families', id: 'f3', data: { id: 'f3', name: 'ברק' } }), '1: set-החדש שגוי');
ok(!d.sets.some((s) => s.col === 'rooms') && !d.deletes.some((x) => x.col === 'rooms'), '1: rooms לא דולג');
// 2) deletes: f2 נעלמה
ok(d.deletes.length === 1 && d.deletes[0].col === 'families' && d.deletes[0].id === 'f2', '2: deletes שגוי');
// 3) meta: seq השתנה ⇒ המסמך המלא
ok(JSON.stringify(d.meta) === JSON.stringify({ orgName: 'מאור', seq: 6, savedAt: 't2' }), '3: meta שגוי');
// 4) אותו DB ⇒ diff ריק
const same = run(prev, prev);
ok(same.sets.length === 0 && same.deletes.length === 0 && same.meta === null, '4: diff לא ריק על אותו DB');
// 5) עותק-עמוק שווה-ערך (רק savedAt שונה — מחוץ ל-metaKeys) ⇒ אפס-רעש
const copy = { ...prev, families: prev.families.map((x) => ({ ...x })), rooms: prev.rooms.map((x) => ({ ...x })), savedAt: 't9' };
const d5 = run(prev, copy);
ok(d5.sets.length === 0 && d5.deletes.length === 0 && d5.meta === null, '5: עותק שווה-ערך הפיק רעש');
if (f) process.exit(1);
console.log('✓ diff-db: 5 דוגמאות-חוזה — ירוק');
