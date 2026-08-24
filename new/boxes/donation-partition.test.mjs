/** בדיקת-קצה · donation-partition — דרך הקופסה בלבד. חוזה: donation-partition.contract.md
 *  DoD (נכתב לפני הקוד — דיבר 12): `node donation-partition.test.mjs` ⇒ exit 0,
 *  מדפיס '✓' — 6 דוגמאות-החוזה + מגן-הכרעה עוברים; כל כשל ⇒ exit 1. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  SHARED_PURPOSE_KEY, purposeKeyOf, donAllowedKeys,
  explodeSupporter, reassembleDonations, donationPartitionDiff,
} from './donation-partition.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 0) המפתח-המשותף
ok(SHARED_PURPOSE_KEY === '_shared_', `SHARED_PURPOSE_KEY=${SHARED_PURPOSE_KEY}`);

// 1) purposeKeyOf — trim · ריק ⇒ משותף · undefined ⇒ משותף (עדשה-עוינת: null/רווחים)
ok(purposeKeyOf({ purpose: ' חינוך ' }) === 'חינוך', 'purposeKeyOf trim');
ok(purposeKeyOf({}) === '_shared_', 'purposeKeyOf ריק');
ok(purposeKeyOf({ purpose: '   ' }) === '_shared_', 'purposeKeyOf רווחים');
ok(purposeKeyOf({ purpose: null }) === '_shared_', 'purposeKeyOf null');

// 2) donAllowedKeys — dedup + trim + סינון-ריק + המשותף בסוף; חיתוך ל-29
assert.deepStrictEqual(donAllowedKeys(['a', 'a', '', ' b ']), ['a', 'b', '_shared_'], 'donAllowedKeys בסיס');
const big = donAllowedKeys(Array.from({ length: 40 }, (_, i) => 'k' + i));
ok(big.length === 30 && big[29] === '_shared_' && big[28] === 'k28', 'donAllowedKeys חיתוך-29+משותף');
assert.deepStrictEqual(donAllowedKeys([]), ['_shared_'], 'donAllowedKeys ריק ⇒ רק המשותף');

// 3) explodeSupporter — id=rid, pkey מ-purpose; אין donations ⇒ []
assert.deepStrictEqual(
  explodeSupporter({ id: 's1', donations: [{ rid: 'D-1', purpose: 'חינוך', date: '2024-01-01', amount: 100 }] }),
  [{ id: 'D-1', supporterId: 's1', pkey: 'חינוך', donation: { rid: 'D-1', purpose: 'חינוך', date: '2024-01-01', amount: 100 } }],
  'explodeSupporter בסיס');
assert.deepStrictEqual(explodeSupporter({ id: 's2' }), [], 'explodeSupporter ללא donations');
// תרומה ללא-purpose ⇒ pkey משותף (החיווט: purposeKeyOf מזין)
ok(explodeSupporter({ id: 's3', donations: [{ rid: 'D-9' }] })[0].pkey === '_shared_', 'explode ללא-ייעוד ⇒ משותף');

// 4) reassembleDonations — סינון-supporterId + מיון תאריך-ואז-rid + hist נשמר
const re = reassembleDonations(
  { id: 's1', name: 'כהן', hist: [{ d: 'x' }] },
  [{ supporterId: 's1', donation: { rid: 'D-2', date: '2024-02-01' } },
   { supporterId: 's1', donation: { rid: 'D-1', date: '2024-01-01' } },
   { supporterId: 'sX', donation: { rid: 'D-9', date: '2024-03-01' } }]);
assert.deepStrictEqual(re, {
  id: 's1', name: 'כהן', hist: [{ d: 'x' }],
  donations: [{ rid: 'D-1', date: '2024-01-01' }, { rid: 'D-2', date: '2024-02-01' }],
}, 'reassembleDonations סינון+מיון+hist');
// tie-break: אותו תאריך ⇒ מיון לפי rid
const tie = reassembleDonations({ id: 's1' }, [
  { supporterId: 's1', donation: { rid: 'D-2', date: '2024-01-01' } },
  { supporterId: 's1', donation: { rid: 'D-1', date: '2024-01-01' } }]);
ok(tie.donations[0].rid === 'D-1' && tie.donations[1].rid === 'D-2', 'reassemble tie-break rid');

// 5) donationPartitionDiff — set על שינוי/חדש, delete על הסרה
const diff = donationPartitionDiff(
  [{ id: 's1', donations: [{ rid: 'D-1', purpose: 'a', amount: 100 }, { rid: 'D-3', purpose: 'b' }] }],
  [{ id: 's1', donations: [{ rid: 'D-1', purpose: 'a', amount: 200 }, { rid: 'D-2', purpose: 'c' }] }]);
assert.deepStrictEqual(diff.deletes, ['D-3'], 'diff deletes');
ok(diff.sets.length === 2 && diff.sets.some((d) => d.id === 'D-1' && d.donation.amount === 200)
  && diff.sets.some((d) => d.id === 'D-2'), 'diff sets (שינוי+חדש)');
// ללא-שינוי ⇒ ריק (עדשה-עוינת: אותה רשימה בדיוק)
const same = [{ id: 's1', donations: [{ rid: 'D-1', purpose: 'a' }] }];
assert.deepStrictEqual(donationPartitionDiff(same, same), { sets: [], deletes: [] }, 'diff ללא-שינוי ⇒ ריק');
// תרומה שעברה תומך (supporterId שונה) ⇒ set (התוכן שונה — donationPartition.ts:101)
const moved = donationPartitionDiff(
  [{ id: 's1', donations: [{ rid: 'D-1', purpose: 'a' }] }],
  [{ id: 's2', donations: [{ rid: 'D-1', purpose: 'a' }] }]);
ok(moved.sets.length === 1 && moved.sets[0].supporterId === 's2' && moved.deletes.length === 0, 'diff מעבר-תומך ⇒ set');

// 6) האינווריאנט-הקדוש: reassemble(sp, explode(sp)) ≡ sp (קבוצה+hist)
const sp = { id: 's7', name: 'לוי', hist: [{ d: '2024-01-01', a: 50 }],
  donations: [{ rid: 'D-5', purpose: 'x', date: '2024-05-01' }, { rid: 'D-4', purpose: '', date: '2024-04-01' }] };
const round = reassembleDonations(sp, explodeSupporter(sp));
assert.deepStrictEqual(new Set(round.donations.map((d) => d.rid)), new Set(sp.donations.map((d) => d.rid)), 'round-trip קבוצה');
assert.deepStrictEqual(round.hist, sp.hist, 'round-trip hist לא-נגוע');

/* 🛡 מגן-הכרעה: הבדיקה קוראת את מקור-הקופסה ומאשרת את הכרעות-החיווט verbatim. */
const src = readFileSync(new URL('./donation-partition.mjs', import.meta.url), 'utf8');
ok(src.includes('_donAllowedKeys(allowed, SHARED_PURPOSE_KEY)'), 'מגן: המפתח-המשותף מוזרק ל-donAllowedKeys');
ok(src.includes('_explodeSupporter(sp, purposeKeyOf)'), 'מגן: purposeKeyOf מזין את explode');
ok(src.includes('_donationPartitionDiff(prev, next, explodeSupporter)'), 'מגן: explode המחווט מזין את diff');
// אין import של קופסה אחרת / אטום-פנימי מזוהם — רק atoms/
ok(!/from '\.\/[^']+\.mjs'/.test(src.replace(/donation-partition\.mjs/g, '')), 'מגן: אין import מקופסה');

if (f) process.exit(1);
console.log('✓ קופסת donation-partition: 6 דוגמאות-חוזה + round-trip + מגן-הכרעה — ירוקים');
