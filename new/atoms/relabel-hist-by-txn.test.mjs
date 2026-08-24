import { relabelHistByTxn } from './relabel-hist-by-txn.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1 — רשימת-מזהים ריקה/רווחים ⇒ אותו מערך, אפס שינוי:
const arr = [{ id: 's1', hist: [{ txn: 'T1', clearer: 'נדרים' }] }];
const e1 = relabelHistByTxn(arr, [], 'סולה');
ok(e1.supporters === arr && e1.changed === 0, 'txns=[] ⇒ זהות-עצם + changed=0');
const e1b = relabelHistByTxn(arr, ['', '  '], 'סולה');
ok(e1b.supporters === arr && e1b.changed === 0, "txns=['','  '] ⇒ זהות-עצם + changed=0");

// 2 — תיוג-מחדש לפי txn, בלי לגעת בשאר:
const sp1 = { id: 's1', hist: [{ txn: 'T1', clearer: 'נדרים' }, { txn: 'T9' }] };
const r2 = relabelHistByTxn([sp1], ['T1'], 'סולה');
ok(r2.changed === 1, 'changed=' + r2.changed + ' ≠ 1');
ok(r2.supporters[0].hist[0].clearer === 'סולה', 'hist[0] לא תויג');
ok(r2.supporters[0].hist[1] === sp1.hist[1], 'hist[1] איבד זהות-עצם');
ok(sp1.hist[0].clearer === 'נדרים', 'מוטציה של הקלט!');

// 3 — נפילה-ל-ref עם trim דו-צדדי:
const r3 = relabelHistByTxn([{ id: 's2', hist: [{ txn: '', ref: ' R7 ' }] }], ['R7'], 'סולה');
ok(r3.changed === 1 && r3.supporters[0].hist[0].clearer === 'סולה', 'ref+trim לא נתפס');

// 4 — אידמפוטנטיות: כבר-מתויג לא נספר והתומך נשמר בזהות-עצם:
const sp4 = { id: 's4', hist: [{ txn: 'T1', clearer: 'סולה' }] };
const r4 = relabelHistByTxn([sp4], ['T1'], 'סולה');
ok(r4.changed === 0 && r4.supporters[0] === sp4, 'אידמפוטנטיות נשברה');

// 5 — בלי hist / hist ריק ⇒ זהות-עצם:
const sp5a = { id: 'a' }, sp5b = { id: 'b', hist: [] };
const r5 = relabelHistByTxn([sp5a, sp5b], ['T1'], 'סולה');
ok(r5.supporters[0] === sp5a && r5.supporters[1] === sp5b && r5.changed === 0, 'בלי-hist ⇒ זהות-עצם');

// 6 — רשומה בלי txn ובלי ref ⇒ לא נגעת:
const r6 = relabelHistByTxn([{ id: 'c', hist: [{ amount: 5 }] }], ['T1'], 'סולה');
ok(r6.changed === 0 && r6.supporters[0].hist[0].clearer === undefined, 'מפתח-ריק תויג בטעות');

if (f) process.exit(1);
console.log('✓ relabel-hist-by-txn: 11 דוגמאות-חוזה — ירוק');
