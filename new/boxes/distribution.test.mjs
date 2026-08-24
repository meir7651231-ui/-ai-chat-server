/** בדיקת-קצה · קופסת-החלוקה (SHOP7) — מחווטת מקצה-לקצה דרך הקופסה בלבד.
 *  DoD: node distribution.test.mjs ⇒ exit 0. מוכיח את דוגמאות-החוזה + עדשה-עוינת. */
import {
  advanceStatus, statusLabel, deliveriesOfDay, deliveriesOfVolunteer,
  eligibleAssignmentsForDay, progressOfDay, loadHint, deliveriesOfFamily,
  pendingDeliveriesToday, listLines, csvRows, volunteerRouteStops,
  filterVolunteers, filterDeliveries,
} from './distribution.mjs';
import assert from 'node:assert';

let f = 0;
const chk = (name, fn) => { try { fn(); } catch (e) { console.error('✗ ' + name + ': ' + e.message); f = 1; } };

// ── advanceStatus / statusLabel ──
chk('advanceStatus קדימה', () => {
  assert.strictEqual(advanceStatus('pickup'), 'enroute');
  assert.strictEqual(advanceStatus('enroute'), 'delivered');
  assert.strictEqual(advanceStatus('delivered'), 'delivered');
  assert.strictEqual(advanceStatus('zzz'), 'delivered'); // קלט-קצה: סטטוס לא-מוכר ⇒ delivered
});
chk('statusLabel', () => {
  assert.strictEqual(statusLabel('pickup'), 'איסוף');
  assert.strictEqual(statusLabel('enroute'), 'בדרך');
  assert.strictEqual(statusLabel('delivered'), 'נמסר');
});

// ── מסד לדוגמה ──
const db = {
  deliveries: [
    { id: 'd1', dayId: 'day1', assignmentId: 'a1', volunteerId: 'v1', familyId: 'f1', status: 'pickup', note: 'קומה 3' },
    { id: 'd2', dayId: 'day1', assignmentId: 'a2', volunteerId: 'v1', familyId: 'f2', status: 'delivered', note: '' },
    { id: 'd3', dayId: 'day2', assignmentId: 'a3', volunteerId: 'v2', familyId: 'f1', status: 'enroute', note: '' },
  ],
  shopAssignments: [
    { id: 'a1', status: 'active' }, { id: 'a2', status: 'active' },
    { id: 'a4', status: 'active' }, { id: 'a5', status: 'inactive' },
  ],
  distributionDays: [
    { id: 'day1', date: '2026-08-20', closed: false },
    { id: 'day2', date: '2026-08-24', closed: false },
    { id: 'day3', date: '2026-08-10', closed: true },
  ],
  families: [
    { id: 'f1', name: 'כהן', address: 'הרצל 5', city: 'ירושלים' },
    { id: 'f2', name: 'לוי', address: '', city: '' }, // קלט-קצה: משפחה בלי כתובת
  ],
  volunteers: [
    { id: 'v1', name: 'משה', phone: '0501111111', area: 'צפון' },
    { id: 'v2', name: 'שרה', phone: '0502222222' }, // בלי area
  ],
};

chk('deliveriesOfDay/Volunteer/Family', () => {
  assert.strictEqual(deliveriesOfDay(db, 'day1').length, 2);
  assert.strictEqual(deliveriesOfVolunteer(db, 'v1').length, 2);
  assert.strictEqual(deliveriesOfVolunteer(db, 'v1', 'day1').length, 2);
  assert.strictEqual(deliveriesOfVolunteer(db, 'v1', 'day2').length, 0);
  assert.strictEqual(deliveriesOfFamily(db, 'f1').length, 2);
});

chk('eligibleAssignmentsForDay', () => {
  // day1: a1,a2 כבר נמסרו (taken); a4 active-פנוי; a5 inactive ⇒ רק a4
  const el = eligibleAssignmentsForDay(db, 'day1').map((a) => a.id);
  assert.deepStrictEqual(el, ['a4']);
});

chk('progressOfDay (חיווט deliveriesOfDay)', () => {
  assert.deepStrictEqual(progressOfDay(db, 'day1'), { total: 2, pickup: 1, enroute: 0, delivered: 1 });
});

chk('loadHint (חיווט deliveriesOfVolunteer)', () => {
  assert.deepStrictEqual(loadHint(db, { id: 'v1', maxDeliveries: 1 }, 'day1'), { count: 2, over: true });
  assert.deepStrictEqual(loadHint(db, { id: 'v9' }, 'day1'), { count: 0, over: false }); // אין maxDeliveries ⇒ over:false
});

chk('pendingDeliveriesToday (יום-סגור לא-צף)', () => {
  // היום=2026-08-24: day1(עבר,פתוח)+day2(היום,פתוח) פתוחים; day3 סגור. d1(pickup)+d3(enroute) פתוחים; d2 נמסר.
  const p = pendingDeliveriesToday(db, '2026-08-24').map((d) => d.id).sort();
  assert.deepStrictEqual(p, ['d1', 'd3']);
});

chk('listLines (חיווט statusLabel)', () => {
  const rows = [
    { ...db.deliveries[0], familyName: 'כהן', volunteerName: 'משה', address: 'הרצל 5' },
    { ...db.deliveries[1], familyName: 'לוי', volunteerName: 'משה' },
  ];
  const out = listLines(rows);
  assert.strictEqual(out[0], '🦺 משה (2 מסירות)');
  assert.strictEqual(out[1], '  • כהן · איסוף · 📍 הרצל 5 · קומה 3');
  assert.strictEqual(out[2], '  • לוי · נמסר'); // בלי כתובת/הערה ⇒ פורמט-בסיס
});

chk('csvRows כותרת + termOf', () => {
  const bare = csvRows(db);
  assert.deepStrictEqual(bare[0], ['תאריך', 'משפחה', 'כתובת', 'מתנדב', 'סטטוס', 'הערה']);
  assert.deepStrictEqual(bare[1], ['2026-08-20', 'כהן', 'הרצל 5, ירושלים', 'משה', 'איסוף', 'קומה 3']);
  // config עם מונח-מותאם ⇒ termOf מחליף 'משפחה'
  const withCfg = csvRows(db, { terms: { 'entity.family': 'בית-אב' } });
  assert.strictEqual(withCfg[0][1], 'בית-אב');
  // קלט-קצה: משפחה בלי כתובת ⇒ תא-כתובת ריק, לא ", "
  assert.strictEqual(bare[2][2], '');
});

chk('volunteerRouteStops (משפחה בלי-כתובת מדולגת)', () => {
  assert.deepStrictEqual(volunteerRouteStops(db, 'day1', 'v1'), ['הרצל 5, ירושלים']); // f2 בלי כתובת דולגה
  assert.deepStrictEqual(volunteerRouteStops(db, 'day9', 'v1'), []); // יום-ריק
});

// ── סינון: smartFilter שקע-מוזרק ──
const fakeSmart = (q, items, getTerms) => items.filter((it) => getTerms(it).some((t) => String(t).includes(q)));
chk('filterVolunteers (שאילתה-ריקה ⇒ בלי smartFilter)', () => {
  let called = false;
  const spy = (...a) => { called = true; return fakeSmart(...a); };
  assert.strictEqual(filterVolunteers(db.volunteers, '', spy), db.volunteers); // זהות — לא סונן
  assert.strictEqual(called, false);
  assert.strictEqual(filterVolunteers(db.volunteers, '  ', spy), db.volunteers); // רווחים-בלבד ⇒ ריק
  assert.strictEqual(called, false);
  const r = filterVolunteers(db.volunteers, 'שרה', fakeSmart);
  assert.deepStrictEqual(r.map((v) => v.id), ['v2']);
});
chk('filterDeliveries (בורר-שדות + statusLabel)', () => {
  const rows = db.deliveries.map((d) => ({ ...d, familyName: d.familyId === 'f1' ? 'כהן' : 'לוי', volunteerName: 'משה' }));
  assert.strictEqual(filterDeliveries(rows, '', fakeSmart), rows);
  // 'איסוף' = תווית-הסטטוס של d1 (pickup) ⇒ מסירה אחת
  assert.deepStrictEqual(filterDeliveries(rows, 'איסוף', fakeSmart).map((r) => r.id), ['d1']);
});

/* 🛡 מגן-הכרעה: מילון-התוויות + בוררי-השדות + קיצור-השאילתה-הריקה חתומים במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./distribution.mjs', import.meta.url), 'utf8');
chk('מגן: מילון-תוויות verbatim', () => {
  assert.ok(src.includes("{ pickup: 'איסוף', enroute: 'בדרך', delivered: 'נמסר' }"), 'STATUS_LABEL סטה מהמקור');
});
chk('מגן: בוררי-שדות verbatim', () => {
  assert.ok(src.includes("[v.name, v.phone, v.area ?? '']"), 'בורר-מתנדבים סטה');
  assert.ok(src.includes('[r.familyName, r.volunteerName, statusLabel(r.status)]'), 'בורר-מסירות סטה');
});
chk('מגן: קיצור-שאילתה-ריקה לפני smartFilter', () => {
  assert.ok(src.indexOf('if (!q.trim()) return vols;') < src.indexOf('smartFilter(q, vols'), 'קיצור-הריק אחרי smartFilter');
});
chk('מגן: קופסה מייבאת רק אטומים', () => {
  const bad = [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]).filter((p) => !p.startsWith('../atoms/') && !p.startsWith('node:'));
  assert.deepStrictEqual(bad, [], 'ייבוא לא-אטום: ' + bad.join());
});

if (f) process.exit(1);
console.log('✓ קופסת-החלוקה (SHOP7): 14 חוטים מחווטים + עדשה-עוינת + מגן-הכרעה — ירוק');
