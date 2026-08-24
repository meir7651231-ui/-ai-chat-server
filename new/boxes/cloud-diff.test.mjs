/** בדיקת-קצה · קופסת-cloud-diff — כל דוגמאות-החוזה דרך הקופסה בלבד.
 *  DoD: node new/boxes/cloud-diff.test.mjs ⇒ exit 0. */
import {
  ENTITY_COLLECTIONS, DONATIONS_COL,
  colPath, metaPath, envPath, donationsPath,
  metaOf, stripSupporterDonations, emptyDiff, diffDb, fullDbDiff,
} from './cloud-diff.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const J = (x) => JSON.stringify(x);

// עוזר: DB עם כל 23 האוספים ריקים + שדות-meta נתונים.
const mkDb = (over = {}) => {
  const db = {};
  for (const c of ENTITY_COLLECTIONS) db[c] = [];
  return { ...db, ...over };
};

// 1) נתיבים · cloudRoot=true (לקוח-חי, ביט-זהה)
ok(colPath('acme', true, 'families') === 'families', '1: colPath שורש');
ok(metaPath('x', true) === 'meta/org', '1: metaPath שורש');
ok(envPath('x', true) === '_enc/envelope', '1: envPath שורש');
ok(donationsPath('x', true) === 'donations', '1: donationsPath שורש');

// 2) נתיבים · cloudRoot=false (פר-ארגון)
ok(colPath('acme', false, 'families') === 'orgs/acme/families', '2: colPath פר-ארגון');
ok(metaPath('acme', false) === 'orgs/acme/meta/org', '2: metaPath פר-ארגון');
ok(envPath('acme', false) === 'orgs/acme/_enc/envelope', '2: envPath פר-ארגון');
ok(donationsPath('acme', false) === 'orgs/acme/donations', '2: donationsPath פר-ארגון');

// 3) diffDb — sets/deletes/meta
const prev = mkDb({ families: [{ id: 'f1', name: 'כהן' }, { id: 'f2', name: 'לוי' }], seq: 5, savedAt: 't1' });
const next = mkDb({ families: [{ id: 'f1', name: 'כהן-לוי' }, { id: 'f3', name: 'ברק' }], seq: 6, savedAt: 't2' });
const d = diffDb(prev, next);
ok(J(d.sets) === J([
  { col: 'families', id: 'f1', data: { id: 'f1', name: 'כהן-לוי' } },
  { col: 'families', id: 'f3', data: { id: 'f3', name: 'ברק' } },
]), '3: sets שגוי');
ok(J(d.deletes) === J([{ col: 'families', id: 'f2' }]), '3: deletes שגוי');
ok(d.meta !== null && d.meta.seq === 6 && J(d.meta) === J(metaOf(next)), '3: meta ≠ metaOf(next)');

// 4) דילוג-רפרנס + אפס-רעש (savedAt מחוץ ל-META_KEYS)
const same = diffDb(prev, prev);
ok(same.sets.length === 0 && same.deletes.length === 0 && same.meta === null, '4: אותו-DB לא ריק');
const onlySaved = diffDb(prev, mkDb({ families: prev.families, seq: 5, savedAt: 't9' }));
ok(onlySaved.meta === null, '4: savedAt-בלבד הפיק meta (רעש)');

// 5) fullDbDiff — meta נבנה תמיד, deletes ריק
const full = fullDbDiff(mkDb({ families: [{ id: 'f1' }], seq: 3, savedAt: 't' }));
ok(J(full.sets) === J([{ col: 'families', id: 'f1', data: { id: 'f1' } }]), '5: sets שגוי');
ok(J(full.deletes) === J([]) && full.meta !== null, '5: deletes/meta שגוי');

// 6) emptyDiff
ok(emptyDiff({ sets: [], deletes: [], meta: null }) === true, '6: ריק ⇒ false');
ok(emptyDiff({ sets: [{}], deletes: [], meta: null }) === false, '6: לא-ריק ⇒ true');

// 7) stripSupporterDonations — רק supporters מנוקה, אפס מוטציה
const inDiff = { sets: [
  { col: 'supporters', id: 's1', data: { id: 's1', donations: [{ rid: 1 }] } },
  { col: 'families', id: 'f1', data: { id: 'f1', donations: [9] } },
], deletes: [], meta: null };
const stripped = stripSupporterDonations(inDiff);
ok(J(stripped.sets[0].data.donations) === J([]), '7: תרומות-תומך לא רוקנו');
ok(J(stripped.sets[1].data.donations) === J([9]), '7: משפחה שונתה בטעות');
ok(inDiff.sets[0].data.donations.length === 1, '7: מוטציה על המקור');

// 8) metaOf — 16 מפתחות בלבד, foo מסונן
const m = metaOf(mkDb({ orgName: 'מאור', seq: 3, savedAt: 't', foo: 'התעלם' }));
ok(!('foo' in m) && m.orgName === 'מאור' && 'savedAt' in m, '8: metaOf כולל foo / חסר savedAt');

// 9) DONATIONS_COL אינו ב-ENTITY_COLLECTIONS (מסלול-B נפרד)
ok(!ENTITY_COLLECTIONS.includes(DONATIONS_COL), '9: donations דלף ל-ENTITY_COLLECTIONS');

/* 🛡 מגן-הכרעה: META_KEYS (סדר) + sameJson (אסטרטגיה) חתומים verbatim בקוד-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./cloud-diff.mjs', import.meta.url), 'utf8');
const META_KEYS_EXPECT = ['orgName','orgSite','orgDonate','orgGoal','budget','usdRate','audit',
  'notif','reports','ui','seq','receiptSeq','donationSeq','shopReceiptSeq','attnDone'];
for (const k of META_KEYS_EXPECT) {
  if (!new RegExp("'" + k + "'").test(src)) { console.error('✗ מגן: META_KEYS חסר ' + k); f = 1; }
}
// סדר: כל מפתח מופיע לפני הבא ברשימה (חתימת-הסדר).
for (let i = 1; i < META_KEYS_EXPECT.length; i++) {
  if (src.indexOf("'" + META_KEYS_EXPECT[i - 1] + "'") > src.indexOf("'" + META_KEYS_EXPECT[i] + "'")) {
    console.error('✗ מגן: סדר-META_KEYS שונה סביב ' + META_KEYS_EXPECT[i]); f = 1;
  }
}
if (!src.includes('a === b || JSON.stringify(a) === JSON.stringify(b)')) {
  console.error('✗ מגן: sameJson שונה מהמקור'); f = 1;
}
if (f) process.exit(1);
console.log('✓ קופסת-cloud-diff: 9 תרחישי-קצה + מגן-הכרעה (META_KEYS סדר + sameJson) — ירוק');
