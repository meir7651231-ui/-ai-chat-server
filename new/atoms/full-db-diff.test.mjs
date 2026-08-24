import { fullDbDiff } from './full-db-diff.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const cols = ['families', 'courses'];
const metaOf = (db) => ({ orgName: db.orgName });
const db = { orgName: 'מאור', families: [{ id: 'f1', name: 'לוי' }, { id: 'f2' }], courses: [{ id: 'c1' }] };
const d = fullDbDiff(db, cols, metaOf);
// 1) שלושה sets בסדר אוספים-ואז-פריטים
ok(d.sets.length === 3, `sets.length ⇒ ${d.sets.length}`);
ok(d.sets[0].col === 'families' && d.sets[0].id === 'f1', 'sets[0] שגוי');
ok(d.sets[1].col === 'families' && d.sets[1].id === 'f2', 'sets[1] שגוי');
ok(d.sets[2].col === 'courses' && d.sets[2].id === 'c1', 'sets[2] שגוי');
// 2) data = אותה רפרנס
ok(d.sets[0].data === db.families[0], 'data אינו אותה רפרנס');
// 3) deletes ריק תמיד
ok(Array.isArray(d.deletes) && d.deletes.length === 0, 'deletes אינו []');
// 4) meta דרך השקע
ok(JSON.stringify(d.meta) === JSON.stringify({ orgName: 'מאור' }), `meta ⇒ ${JSON.stringify(d.meta)}`);
// 5) אוספים ריקים — sets ריק, meta עדיין נבנה
const d2 = fullDbDiff({ orgName: 'x', families: [], courses: [] }, cols, metaOf);
ok(d2.sets.length === 0 && d2.meta.orgName === 'x', 'db ריק-ישויות טופל שגוי');
if (f) process.exit(1);
console.log('✓ full-db-diff: 5 דוגמאות-חוזה (8 בדיקות) — ירוק');
