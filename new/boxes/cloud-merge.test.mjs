/** בדיקת-קצה: קופסת-מיזוג-הענן — 4 החוטים המחווטים, כל דוגמאות-החוזה.
 *  DoD (נכתב לפני הקוד): node cloud-merge.test.mjs ⇒ exit 0. */
import { sanitizeIncoming, mergeDonationsPreserving, applyEntityPartial, applyMetaPartial } from './cloud-merge.mjs';
import assert from 'node:assert';
let f = 0;
const eq = (a, b, msg) => { try { assert.deepStrictEqual(a, b); } catch { console.error('✗ ' + msg); f = 1; } };

// ── sanitizeIncoming ──
{
  const g = { a: 1 };
  if (sanitizeIncoming('ghosts', g) !== g) { console.error('✗ s1 אוסף-לא-מוכר לא אותה-רפרנס'); f = 1; }
  eq(sanitizeIncoming('supporters', { id: 'x' }), { id: 'x', donations: [] }, 's2 שדה-רשימה חסר');
  eq(sanitizeIncoming('families', { members: 5, docs: ['d'] }), { members: [], docs: ['d'] }, 's3 members לא-מערך');
}

// ── mergeDonationsPreserving ──
{
  const inc = { donations: [{ rid: 'B' }] };
  if (mergeDonationsPreserving('families', {}, inc) !== inc) { console.error('✗ m1 לא-תומך לא אותה-רפרנס'); f = 1; }
  const r2 = mergeDonationsPreserving('supporters', { donations: [{ rid: 'A' }] }, { donations: [{ rid: 'B' }] });
  eq(r2.donations, [{ rid: 'B' }, { rid: 'A' }], 'm2 תרומה מקומית-בלבד נשמרת');
  const r3 = mergeDonationsPreserving('supporters', { count: 5 }, { donations: [], count: 3 });
  if (r3.count !== 5) { console.error('✗ m3 מונה לא-max'); f = 1; }
  const inc4 = { donations: [{ rid: 'A' }], count: 5 };
  if (mergeDonationsPreserving('supporters', { donations: [{ rid: 'A' }], count: 5 }, inc4) !== inc4) {
    console.error('✗ m4 local⊆incoming לא אותה-רפרנס'); f = 1;
  }
}

// ── applyEntityPartial (מחווט 3-ארגומנטים) ──
{
  const db1 = { families: [{ id: 'a', n: 1 }] };
  if (applyEntityPartial(db1, 'ghosts', [{ id: 'z', data: {}, deleted: false }]) !== db1) {
    console.error('✗ e1 אוסף-לא-ישות לא no-op'); f = 1;
  }
  const db2 = applyEntityPartial({ rooms: [{ id: 'a', n: 1 }] }, 'rooms', [{ id: 'b', data: { n: 2 }, deleted: false }]);
  eq(db2.rooms, [{ n: 2, id: 'b' }, { id: 'a', n: 1 }], 'e2 חדש-לראש');
  const db3 = applyEntityPartial({ rooms: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] }, 'rooms', [{ id: 'a', data: {}, deleted: true }]);
  eq(db3.rooms, [{ id: 'b', n: 2 }], 'e3 מחוק-יצא');
  // e4 — החיווט האמיתי: sanitizeIncoming + mergeDonationsPreserving פעילים דרך הקופסה
  const db4 = applyEntityPartial(
    { supporters: [{ id: 's', donations: [{ rid: 'A' }], count: 5 }] },
    'supporters', [{ id: 's', data: { donations: [{ rid: 'B' }], count: 3 }, deleted: false }],
  );
  eq(db4.supporters[0].donations, [{ rid: 'B' }, { rid: 'A' }], 'e4 מיזוג-תרומות דרך הקופסה');
  if (db4.supporters[0].count !== 5) { console.error('✗ e4 מונה לא-max דרך הקופסה'); f = 1; }
  const db5 = { rooms: [{ id: 'a', n: 1 }] };
  if (applyEntityPartial(db5, 'rooms', [{ id: 'a', data: { id: 'a', n: 1 }, deleted: false }]) !== db5) {
    console.error('✗ e5 ביט-זהה לא אותה-רפרנס'); f = 1;
  }
  // e6 — סניטציה חיה: families מקבל members/docs מהשקע המחווט (חיזוק אמיתי בקופסה)
  const db6 = applyEntityPartial({ families: [] }, 'families', [{ id: 'g', data: { name: 'כהן' }, deleted: false }]);
  eq(db6.families, [{ name: 'כהן', id: 'g', members: [], docs: [] }], 'e6 חיזוק-שדות-רשימה דרך הקופסה');
}

// ── applyMetaPartial ──
{
  const dbP = { seq: 5 };
  if (applyMetaPartial(dbP, { seq: 3 }) !== dbP) { console.error('✗ p1 מונה-קטן לא no-op'); f = 1; }
  if (applyMetaPartial({ seq: 5 }, { seq: 9 }).seq !== 9) { console.error('✗ p2 מונה-עולה'); f = 1; }
  if (applyMetaPartial({ orgName: 'א' }, { orgName: 'ב' }).orgName !== 'ב') { console.error('✗ p3 הענן-מנצח'); f = 1; }
  const dbP4 = { orgName: 'א' };
  if (applyMetaPartial(dbP4, { orgName: undefined }) !== dbP4) { console.error('✗ p4 undefined לא-מדולג'); f = 1; }
}

/* 🛡 מגן-הכרעה: הקופסה מחווטת את 3 השכנים חזרה ל-applyEntityPartial verbatim
 * (ENTITY_COLLECTIONS · sanitizeIncoming · mergeDonationsPreserving) — הסדר חתום. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./cloud-merge.mjs', import.meta.url), 'utf8');
if (!/applyEntityPartialAtom\(db, ?col, ?docs, ?ENTITY_COLLECTIONS, ?sanitizeIncoming, ?mergeDonationsPreserving\)/.test(src)) {
  console.error('✗ מגן: חיווט-שלושת-השקעים ל-applyEntityPartial שונה'); f = 1;
}
// חוק-2/3: קופסה מייבאת רק אטומים, לא קופסאות.
if (/from '\.\/[^']+'/.test(src)) { console.error('✗ מגן: הקופסה מייבאת קופסה אחרת'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-מיזוג-הענן: 4 חוטים · sanitize+merge+entity(מחווט)+meta · כל דוגמאות-החוזה ירוקות');
