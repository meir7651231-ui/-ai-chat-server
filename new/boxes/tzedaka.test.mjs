/** בדיקת-קצה · קופסת tzedaka — דרך הקופסה בלבד (חוק-4). מוכיחה את דוגמאות-החוזה,
 *  עדשה-עוינת (ריק/NaN/עברית/'/status), ומגן-הכרעה (fs על מקור-הקופסה). */
import { readFileSync } from 'node:fs';
import {
  TZ_SCORE_RULES, TZ_STALE_DAYS, DAY_NAMES,
  lastCollectionIso, collectionScoreDelta, boxTotal, coordinatorBoxes,
  coordinatorTotal, grandTotal, campaignTotal, staleBoxes, needsCare,
  leaderboard, campaignProgress, filterCoordinators, boxesOverview,
  filterCollections, coordinatorPrintLines, collectionsCsvRows, buildTzGrid,
} from './tzedaka.mjs';

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${n}: ${g} ≠ ${w}`); f = 1; }
};
const ok = (n, cond) => { if (!cond) { console.error(`✗ ${n}`); f = 1; } };

// ── שקעי-מנוע (doubles דטרמיניסטיים; המנוע האמיתי נבדק ברתמות search/calendar) ──
// smartFilter: q ריק ⇒ הכל; אחרת התאמת-תת-מחרוזת על אחד המונחים.
const smartFilter = (q, items, getTerms) =>
  !q ? items.slice() : items.filter((it) => getTerms(it).some((t) => String(t).includes(q)));
// buildMonthGrid: זקיף-האצלה — מחזיר את הארגומנטים כדי לאמת wrapper דק.
const gridSpy = (...args) => ({ delegated: args });

// ── קבועים ──
eq('TZ_SCORE_RULES', TZ_SCORE_RULES, { emptyPts: 10, ilsPerPoint: 50, streakDays: 60, streakPts: 5 });
eq('TZ_STALE_DAYS', TZ_STALE_DAYS, 90);
eq('DAY_NAMES', DAY_NAMES, ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']);
ok('DAY_NAMES כולל שבת (מקור calLib, 7)', DAY_NAMES.length === 7 && DAY_NAMES[6] === 'שבת');

// ── lastCollectionIso ──
eq('lastCollectionIso max', lastCollectionIso({ collections: [{ date: '2026-07-01' }, { date: '2026-08-01' }, { date: '2026-06-15' }] }), '2026-08-01');
eq('lastCollectionIso ריק', lastCollectionIso({ collections: [] }), '');

// ── collectionScoreDelta ──
const emptyBox = { collections: [] };
eq('delta ריק/120', collectionScoreDelta(emptyBox, '2026-08-01', 120), 12);
eq('delta רצף/17', collectionScoreDelta({ collections: [{ date: '2026-07-01' }] }, '2026-08-01', 100), 17);
eq('delta מחוץ-לרצף/12', collectionScoreDelta({ collections: [{ date: '2026-01-01' }] }, '2026-08-01', 100), 12);
eq('delta ימים-שליליים/12', collectionScoreDelta({ collections: [{ date: '2026-08-10' }] }, '2026-08-01', 100), 12);
eq('delta rules-מותאם/5', collectionScoreDelta(emptyBox, '2026-08-01', 55, { emptyPts: 0, ilsPerPoint: 10, streakDays: 30, streakPts: 3 }), 5);

// ── סכומים (עדשה-עוינת: NaN מדולג) ──
eq('boxTotal NaN', boxTotal({ collections: [{ amount: 100 }, { amount: 50 }, { amount: NaN }] }), 150);
const boxes = [
  { id: 'b1', num: '1', coordinatorId: 'c1', status: 'home', since: '2026-01-01', famId: 'f1', collections: [{ date: '2026-06-15', amount: 100, campaignId: 'p1' }, { date: '2026-07-10', amount: 50 }] },
  { id: 'b2', num: '2', coordinatorId: 'c1', status: 'office', since: '2026-01-01', famId: '', collections: [{ date: '2026-08-01', amount: 40, campaignId: 'p1' }] },
  { id: 'b3', num: '3', coordinatorId: 'c2', status: 'home', since: '2026-01-01', famId: 'f2', collections: [{ date: '2026-08-20', amount: 300 }] },
];
eq('coordinatorBoxes c1', coordinatorBoxes(boxes, 'c1').map((b) => b.id), ['b1', 'b2']);
eq('coordinatorTotal c1', coordinatorTotal(boxes, 'c1'), 190);
eq('grandTotal', grandTotal(boxes), 490);
eq('campaignTotal p1', campaignTotal(boxes, 'p1'), 140);
eq('campaignTotal ריק', campaignTotal(boxes, 'nope'), 0);

// ── staleBoxes (רק home, סף ברירת-מחדל 90) ──
// b1 last 07-10 → 08-24 = 45 יום < 90 ⇒ אינו stale; b3 last 08-20 ⇒ לא. אף אחד:
eq('staleBoxes 90', staleBoxes(boxes, '2026-08-24'), []);
eq('staleBoxes 30', staleBoxes(boxes, '2026-08-24', 30).map((b) => b.id), ['b1']); // 45>30 ⇒ b1; b3 25<30 ⇒ לא
const oldBox = [{ id: 'x', num: '9', coordinatorId: 'c1', status: 'home', since: '2025-01-01', famId: 'f1', collections: [{ date: '2026-01-01', amount: 10 }] }];
eq('staleBoxes ישן', staleBoxes(oldBox, '2026-08-24').map((b) => b.id), ['x']);
eq('staleBoxes office מדולג', staleBoxes([{ ...oldBox[0], status: 'office' }], '2026-08-24'), []);

// ── needsCare (סדר + מונח; config חסר ⇒ 'קופה') ──
const db1 = {
  families: [{ id: 'f1', name: 'כהן', address: 'הרצל 1', city: 'ירושלים', phone: '050' }, { id: 'f2', name: 'לוי' }],
  tzBoxes: [
    { id: 'x', num: '9', coordinatorId: 'c1', status: 'home', since: '2025-01-01', famId: 'f1', collections: [{ date: '2026-01-01', amount: 10 }] },
    { id: 'l', num: '7', coordinatorId: 'c1', status: 'lost', since: '2026-01-01', famId: 'f2', collections: [] },
  ],
  tzCoordinators: [{ id: 'c1', name: 'שרה', active: false, score: 0 }],
  tzCampaigns: [{ id: 'p1', name: 'פסח', active: true, end: '2026-08-30', goal: 1000 }],
};
const care = needsCare(db1, '2026-08-24');
eq('needsCare kinds בסדר', care.map((x) => x.kind), ['stale', 'lost', 'inactiveCoord', 'campaignEnding']);
eq('needsCare stale label', care[0].label, 'קופה 9 לא רוקנה מזמן');
eq('needsCare lost label', care[1].label, 'קופה 7 מסומנת כאבודה');
eq('needsCare inactiveCoord', care[2].label, 'שרה אינו פעיל אך עדיין עם 1 קופות בבתים');
eq('needsCare campaignEnding', care[3].label, 'המבצע "פסח" מסתיים ב-2026-08-30');
// config ⇒ termOf מחליף את מונח-הקופה
const care2 = needsCare(db1, '2026-08-24', { terms: { 'entity.tzBox': 'קופסת-צדקה' } });
eq('needsCare termOf', care2[0].label, 'קופסת-צדקה 9 לא רוקנה מזמן');

// ── leaderboard (רק פעילים, score↓ ואז total↓) ──
const coords = [
  { id: 'c1', name: 'שרה', active: true, score: 20 },
  { id: 'c2', name: 'רבקה', active: true, score: 30 },
  { id: 'c3', name: 'לאה', active: false, score: 99 },
];
const lb = leaderboard(coords, boxes);
eq('leaderboard מיון', lb.map((r) => r.coordinator.id), ['c2', 'c1']);
eq('leaderboard boxCount', lb.find((r) => r.coordinator.id === 'c1').boxCount, 2);

// ── campaignProgress ──
eq('campaignProgress 25', campaignProgress({ id: 'p1', goal: 1000 }, boxes), { sum: 140, goal: 1000, pct: 14 });
eq('campaignProgress קטום', campaignProgress({ id: 'p1', goal: 100 }, boxes), { sum: 140, goal: 100, pct: 100 });
eq('campaignProgress ללא-יעד', campaignProgress({ id: 'p1' }, boxes), { sum: 140, goal: 0, pct: 0 });

// ── filterCoordinators (smartFilter מוזרק; q='' ⇒ הכל, בודקים מיון) ──
eq('filterCoords name', filterCoordinators(coords, boxes, '', false, 'name', smartFilter).map((c) => c.id), ['c3', 'c2', 'c1']); // לאה<רבקה<שרה
eq('filterCoords onlyActive+score', filterCoordinators(coords, boxes, '', true, 'score', smartFilter).map((c) => c.id), ['c2', 'c1']);
eq('filterCoords stale', filterCoordinators(coords, boxes, '', true, 'stale', smartFilter).map((c) => c.id), ['c1', 'c2']); // c1 ריקון-אחרון 08-01 < c2 08-20
eq('filterCoords q-עברית', filterCoordinators(coords, boxes, 'רבקה', false, 'name', smartFilter).map((c) => c.id), ['c2']);

// ── boxesOverview ──
const ovDb = { tzBoxes: boxes, tzCoordinators: coords, families: db1.families };
const ov = boxesOverview(ovDb, '', '', 'num', smartFilter);
eq('boxesOverview שורות', ov.map((r) => [r.box.id, r.coordName, r.famName, r.last, r.total]),
  [['b1', 'שרה', 'כהן', '2026-07-10', 150], ['b2', 'שרה', '', '2026-08-01', 40], ['b3', 'רבקה', 'לוי', '2026-08-20', 300]]);
eq('boxesOverview status home', boxesOverview(ovDb, '', 'home', 'num', smartFilter).map((r) => r.box.id), ['b1', 'b3']);
eq('boxesOverview sort total', boxesOverview(ovDb, '', '', 'total', smartFilter).map((r) => r.box.id), ['b3', 'b1', 'b2']);

// ── filterCollections (טווח כוללני; קצה ריק=פתוח) ──
const boxC = { collections: [{ date: '2026-06-15', amount: 1, campaignId: 'p1' }, { date: '2026-07-10', amount: 2 }, { date: '2026-08-01', amount: 3, campaignId: 'p2' }] };
eq('filterCollections טווח', filterCollections(boxC, '2026-07-01', '2026-07-31', '').map((c) => c.date), ['2026-07-10']);
eq('filterCollections פתוח', filterCollections(boxC, '', '', '').length, 3);
eq('filterCollections מבצע', filterCollections(boxC, '', '', 'p2').map((c) => c.date), ['2026-08-01']);

// ── coordinatorPrintLines ──
const pl = coordinatorPrintLines(db1, 'c1');
eq('print כותרת', pl[0], 'רשימת קופות — שרה');
eq('print קו', pl[1], '='.repeat(30));
ok('print קופת-home', pl.some((l) => l.startsWith('#9') && l.includes('משפחת כהן') && l.includes('הרצל 1, ירושלים')));
eq('print רכז-ריק', coordinatorPrintLines(db1, 'zzz'), ['רשימת קופות — ', '='.repeat(30), 'אין קופות פעילות']);

// ── collectionsCsvRows ──
const csv = collectionsCsvRows(db1);
eq('csv כותרת', csv[0], ['תאריך', 'רכז', 'קופה', 'משפחה', 'סכום', 'מבצע']);
eq('csv שורה', csv[1], ['2026-01-01', 'שרה', '#9', 'כהן', 10, '']);
eq('csv termOf family', collectionsCsvRows(db1, { terms: { 'entity.family': 'בית-אב' } })[0][3], 'בית-אב');

// ── buildTzGrid (wrapper דק — האצלה מלאה למנוע-הלוח) ──
const evs = [{ date: '2026-08-24' }];
eq('buildTzGrid האצלה', buildTzGrid(evs, '2026-08-24', false, gridSpy), { delegated: [evs, '2026-08-24', false] });
eq('buildTzGrid heb', buildTzGrid([], '2026-01-01', true, gridSpy), { delegated: [[], '2026-01-01', true] });

/* 🛡 מגן-הכרעה: הקופסה קוראת את מקור-עצמה ומאשרת הכרעות verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./tzedaka.mjs', import.meta.url), 'utf8');
ok('מגן: isoOf=isoLocal', /const isoOf = isoLocal;/.test(src));
ok('מגן: DAY_NAMES מ-week-day-names (7 כולל שבת)', src.includes("from '../atoms/week-day-names.mjs'"));
ok('מגן: הרכב coordinatorLastCollection', /const coordinatorLastCollection = \(boxes, coordId\) => \{/.test(src) && /if \(l > last\) last = l;/.test(src));
ok('מגן: staleBoxes ברירת-מחדל TZ_STALE_DAYS', /staleBoxes = \(boxes, todayIso, days = TZ_STALE_DAYS\)/.test(src));
ok('מגן: collectionScoreDelta ברירת-מחדל TZ_SCORE_RULES', /collectionScoreDelta = \(box, date, amount, rules = TZ_SCORE_RULES\)/.test(src));
ok('מגן: needsCare מזריק חמישה שקעים', /termOf,\s*staleBoxes,\s*lastCollectionIso: lastCollectionIsoA,\s*coordinatorBoxes: coordinatorBoxesA,\s*isoOf,/.test(src));
ok('מגן: אפס ייבוא-קופסה (רק ../atoms/)', ![...src.matchAll(/from\s*'([^']+)'/g)].some((m) => !m[1].startsWith('../atoms/')));

if (f) process.exit(1);
console.log('✓ קופסת tzedaka: 19 חוטים דרך הקופסה + עדשה-עוינת (ריק/NaN/עברית/status/טווח) + מגן-הכרעה — ירוק');
