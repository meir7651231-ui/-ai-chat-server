/** בדיקת-קצה: קופסת-ההעצמה — חיווט 27-החוטים דרך הקופסה בלבד (DoD: exit 0).
 *  מייבאת רק את הקופסה-שלה (מגילה, דיבר 12). זהב נלכד מהרצת-החיווט האמיתי
 *  על-fixture מייצג (4 תומכים: ותיק-בסיכון · בינוני · רדום · הו״ק-פעיל). */
import assert from 'node:assert';
import * as B from './empowerment.mjs';

const TODAY = '2026-08-24';
let f = 0;
const chk = (name, got, want) => {
  try { assert.deepStrictEqual(got, want); }
  catch { console.error(`✗ ${name}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); f = 1; }
};

const mk = (id, name, phone, last, ils, usd, count, dons = [], hist = [], hok = null, first = '2023-01-01') => ({
  id, name, phone, email: '', idNum: '', address: '', cat: '', forWho: '',
  count, ils, usd, first, last, nextDate: '', donations: dons, hist, ...(hok ? { hok } : {}),
});
const sups = [
  mk('a', 'כהן משה', '0501111111', '2026-08-20', 500, 0, 5,
    [{ date: '2026-08-20', amount: 100, cur: '₪', rid: 'R-1', purpose: '' },
     { date: '2026-05-20', amount: 100, cur: '₪', rid: 'R-2' },
     { date: '2026-02-20', amount: 100, cur: '₪', rid: 'R-3' }]),
  mk('b', 'לוי שרה', '0502222222', '2026-03-01', 200, 20, 2,
    [{ date: '2026-03-01', amount: 100, cur: '₪', rid: 'R-4' },
     { date: '2025-11-01', amount: 100, cur: '₪', rid: 'R-5' }]),
  mk('c', 'ישראלי דוד', '0503333333', '2024-06-01', 50, 0, 1,
    [{ date: '2024-06-01', amount: 50, cur: '₪', rid: 'R-6' }]),
  mk('d', 'אברהם רות', '0504444444', '2026-08-23', 1200, 0, 8,
    [{ date: '2026-08-23', amount: 300, cur: '₪', rid: 'R-7' }],
    [], { amount: 150, day: 1, method: 'הו"ק', active: true }),
];

// ── קוקפיט ──────────────────────────────────────────────────────────────────
chk('cockpitDaysSince', B.cockpitDaysSince('2026-08-20', TODAY), 4);
chk('dayDiff', B.dayDiff('2026-08-20', TODAY), 4);
chk('cockpitAtRisk', B.cockpitAtRisk(sups, TODAY).map((s) => s.id), ['c', 'b']);
chk('cockpitCollectedThisMonth', B.cockpitCollectedThisMonth(sups, TODAY), 400);
chk('cockpitThanks', B.cockpitThanks(sups, TODAY).map((s) => s.id), ['thanks:d']);
chk('cockpitCalls-N', B.cockpitCalls(sups, TODAY).length, 2);
chk('cockpitHokTasks-N', B.cockpitHokTasks(sups, TODAY).length, 1);
chk('cockpitKpis', B.cockpitKpis(sups, TODAY), { total: 4, collected: 400, expectedHok: 150, atRisk: 2 });

const queue = B.cockpitQueue(sups, TODAY);
chk('cockpitQueue-total', queue.total, 4);
chk('cockpitQueue-kinds', queue.tasks.map((t) => t.kind), ['call', 'call', 'thanks', 'hok']);
chk('cockpitProgress', B.cockpitProgress(queue, new Set([queue.tasks[0].id])), { done: 1, total: 4 });
chk('cockpitCsvRows-N', B.cockpitCsvRows(queue).length, 5);
chk('cockpitCsvRows-header', B.cockpitCsvRows(queue)[0], ['קבוצה', 'שם', 'טלפון', 'סיבה']);
chk('cockpitWorkListText-line0', B.cockpitWorkListText(queue).split('\n')[0],
  '📞 שיחה · ישראלי דוד · 0503333333 — תורם/ת · שקט/ה 814 יום');
chk('cockpitFeed-N', B.cockpitFeed(sups).length, 8);

// ── מודיעין ─────────────────────────────────────────────────────────────────
chk('donorScan-keys', Object.keys(B.donorScan(sups[0], TODAY)).sort(),
  ['count', 'first', 'ils', 'last', 'monthly']);
chk('donorIntel-keys', Object.keys(B.donorIntel(sups[0], TODAY)).sort(),
  ['avgGift', 'churn', 'forecast', 'ltv', 'rfm', 'scan', 'trend']);

// ── סגמנטים ─────────────────────────────────────────────────────────────────
chk('segmentCounts', B.segmentCounts(sups, TODAY), [
  { key: 'atrisk', label: 'בסיכון נטישה', dot: '#b45309', count: 2 },
  { key: 'goldsilent', label: 'זהב · שקטים 60+ יום', dot: '#a05008', count: 0 },
  { key: 'hok', label: 'הו״ק פעילות', dot: '#2e7d32', count: 1 },
  { key: 'gave12m', label: 'תרמו ב-12 החודשים', dot: '#1d4ed8', count: 3 },
  { key: 'noemail', label: 'ללא אימייל', dot: '#8a8172', count: 4 },
]);

// ── תיק ─────────────────────────────────────────────────────────────────────
chk('portfolioIntel-keys', Object.keys(B.portfolioIntel(sups, TODAY)).sort(),
  ['atRiskCount', 'atRiskMoney', 'avgGift', 'concentrationTopN', 'count', 'forecast30',
   'forecast90', 'giftCount', 'ltv', 'retention12m', 'scoreBins', 'tierCounts', 'topN']);
chk('tierTrendCounts', B.tierTrendCounts(sups, TODAY), [
  { tier: 'זהב', total: 0, rising: 0, falling: 0, stable: 0 },
  { tier: 'כסף', total: 0, rising: 0, falling: 0, stable: 0 },
  { tier: 'ארד', total: 2, rising: 2, falling: 0, stable: 0 },
  { tier: 'רדומה', total: 2, rising: 0, falling: 0, stable: 2 },
]);
chk('activeByMonth-N', B.activeByMonth(sups, TODAY).length, 12);

// ── גלקסיה ──────────────────────────────────────────────────────────────────
chk('donorConstellation-N', B.donorConstellation(sups, TODAY).length, 4);

// ── פיקוד ───────────────────────────────────────────────────────────────────
chk('buildCommands-N', B.buildCommands({ supporters: sups }).length, 5);

if (f) process.exit(1);
console.log('✓ קופסת-ההעצמה: 24 בדיקות-חיווט (27 חוטים) — ירוק');
