/** בדיקת-קצה · לוח-האם — מוכיחה שהאינטגרציה חוצת-הקופסות עובדת דרך הלוח בלבד,
 *  ושחוקי-החשמלאי מתקיימים: שעון-יחיד-מקור, קונפיג-מושחל, ייבוא-קופסות-בלבד.
 *  DoD: node new/board.test.mjs ⇒ exit 0. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { makeBoard } from './board.mjs';

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

// ── הצבה: שעון-קבוע (דטרמיניזם) + קונפיג עם דריסת-מונח ──
const board = makeBoard({
  clockIso: () => '2026-08-24',
  config: { slug: 'demo', orgName: 'ארגון-בדיקה', terms: { 'nav.supporters': 'שותפים' } },
  rate: 3.7,
});

// ── 1) IO מוזרק פעם-אחת: השעון של הלוח הוא מקור-האמת ──
eq(board.today(), '2026-08-24', 'שעון-הלוח מוזרק ודטרמיניסטי');

// ── 2) חיווט config-box → צרכני-המונחים: הדריסה עוברת, ה-fallback לא דולף ──
eq(board.term('nav.supporters', 'תורמים'), 'שותפים', 'config→term: דריסת-מונח מההצבה');
eq(board.term('nav.families', 'משפחות'), 'משפחות', 'config→term: fallback כשאין דריסה');
ok(board.feature('supporters.cockpit') === true || board.feature('supporters.cockpit') === false, 'config→feature מחווט');

// ── fixture-תורמים (זהה לפרוסת-ההעצמה) ──
const mk = (id, name, phone, last, ils, usd, count, dons = [], hok = null) => ({
  id, name, phone, email: '', idNum: '', address: '', cat: '', forWho: '',
  count, ils, usd, first: '2023-01-01', last, nextDate: '', donations: dons, hist: [], ...(hok ? { hok } : {}),
});
const sups = [
  mk('a', 'כהן משה', '0501111111', '2026-08-20', 500, 0, 5,
    [{ date: '2026-08-20', amount: 100, cur: '₪', rid: 'R-1' }, { date: '2026-05-20', amount: 100, cur: '₪', rid: 'R-2' }, { date: '2026-02-20', amount: 100, cur: '₪', rid: 'R-3' }]),
  mk('b', 'לוי שרה', '0502222222', '2026-03-01', 200, 20, 2,
    [{ date: '2026-03-01', amount: 100, cur: '₪', rid: 'R-4' }, { date: '2025-11-01', amount: 100, cur: '₪', rid: 'R-5' }]),
  mk('c', 'ישראלי דוד', '0503333333', '2024-06-01', 50, 0, 1, [{ date: '2024-06-01', amount: 50, cur: '₪', rid: 'R-6' }]),
  mk('d', 'אברהם רות', '0504444444', '2026-08-23', 1200, 0, 8, [{ date: '2026-08-23', amount: 300, cur: '₪', rid: 'R-7' }], { amount: 150, day: 1, method: 'הו"ק', active: true }),
];

// ── 3) חיווט supporters-box → אגרגטים (אותם אטומים, דרך הלוח) ──
eq(board.sup.ils(sups[0]), 500, 'supporters→ils (sp.ils + Σhist; hist ריק ⇒ 500)');
eq(board.sup.count(sups[0]), 5, 'supporters→count (sp.count)');

// ── 4) חיווט date-util(שעון) → empowerment: הקוקפיט על שעון-הלוח ──
const queue = board.cockpit.queue(sups);
eq(queue.total, 4, 'cockpit.queue.total דרך שעון-הלוח');
eq(queue.tasks.map((t) => t.kind), ['call', 'call', 'thanks', 'hok'], 'cockpit.queue.kinds');
eq(board.cockpit.kpis(sups), { total: 4, collected: 400, expectedHok: 150, atRisk: 2 }, 'cockpit.kpis משולב');
eq(board.cockpit.atRisk(sups).map((s) => s.id), ['c', 'b'], 'cockpit.atRisk');

// ── 5) האינווריאנט חוצה-הקופסתי: שעון-יחיד-מקור ──
// hokDue (supporters-box) ו-cockpit (empowerment-box) חייבים לראות אותו "היום".
// שניהם דרך board.today() ⇒ hok-המשימה של 'd' מופיעה בשתי הקופסאות זהה.
const hokDue = board.sup.hokDue(sups);
ok(hokDue.some((s) => s.id === 'd'), 'supporters.hokDue רואה את d');
ok(queue.hok.some((t) => t.supId === 'd' || (t.id && String(t.id).includes('d'))), 'empowerment.hok-task רואה את d — אותו שעון');
eq(board.sup.hokMonthlyTotal(sups), 150, 'hokMonthlyTotal על שעון-הלוח');

// ── 6) חיווט dedup-box (כלי חוצה-מודול) ──
const dupSups = [
  { id: 'x', name: 'בן צבי רחל', phone: '0500000001', donations: [] },
  { id: 'y', name: 'רחל בן צבי', phone: '0500000002', donations: [] },
];
eq(board.dedup.supporterGroups(dupSups), [['x', 'y']], 'dedup→שם-חסין-סדר');

// ── 7) חיווט search-box (כלי חוצה-מודול) ──
const found = board.search('cohen', sups, (s) => [s.name]);
ok(found.some((s) => s.name.includes('כהן')), 'search→תעתיק cohen');

// ── 8) חיווט ייצוא: cockpit.csvRows על תור-הלוח ──
eq(board.cockpit.csvRows(queue)[0], ['קבוצה', 'שם', 'טלפון', 'סיבה'], 'cockpit.csvRows כותרת');

// ── 9) פרוסת-משפחות: config→צירי-מאתר · שעון→גיל ──
ok(Array.isArray(board.families.finderAxes()), 'families.finderAxes דרך config');
ok(typeof board.families.tier(600).key === 'string', 'families.tier(score)⇒דרגה');
eq(board.families.age('2000-08-24'), 26, 'families.age על שעון-הלוח (2000→2026)');

// ── 10) פרוסת-יומן: דין-תשעה-באב-נדחה (ט׳ באב בשבת ⇒ הצום י׳ באב) ──
eq(board.diary.blockReason(new Date('2022-08-07T12:00:00')), 'תשעה באב (נדחה)', 'diary.blockReason דין-הדחייה');

// ── 11) פרוסת-לוח-עברי ──
ok(typeof board.hebrew.dateFull('2026-08-24') === 'string' && board.hebrew.dateFull('2026-08-24').length > 0, 'hebrew.dateFull');
ok(board.hebrew.today().length > 0, 'hebrew.today על שעון-הלוח');

// ── 12) פרוסת-וואטסאפ: config→שם-ארגון ──
ok(board.wa.link('0501234567', 'שלום').startsWith('https://wa.me/'), 'wa.link');
ok(board.wa.delivery('כהן').includes('ארגון-בדיקה'), 'wa.delivery מזריק את שם-הארגון מ-config');

// ── 13) פרוסת-ביקורת: config+שעון מוזרקים לרנטגן-הנתונים ──
const auditDb = {
  families: [
    { id: 'f1', name: 'א', phone: '0501234567', status: 'active', city: 'צפת', address: 'רח 1', maritalStatus: 'נשואים', father: 'x', mother: 'y', members: [] },
    { id: 'f2', name: 'ב', phone: '0501234567', status: 'active', city: 'צפת', address: 'רח 1', maritalStatus: 'נשואים', father: 'x', mother: 'y', members: [] },
  ],
  supporters: [], enrollments: [],
};
const auditIssues = board.audit.run(auditDb);
ok(auditIssues.some((i) => i.cat === 'כפילות' && i.title.includes('משותף')), 'audit.run תופס טלפון-כפול (שעון+config מהלוח)');
ok(board.audit.report(auditIssues)[0].includes('ארגון-בדיקה'), 'audit.report עם שם-הארגון מ-config');

/* 🛡 מגן-חוק-3: הלוח מייבא אך-ורק מ-./boxes/ (שום ./atoms, שום קופסה-לא-דרך-הלוח). */
const src = readFileSync(new URL('./board.mjs', import.meta.url), 'utf8');
for (const m of src.matchAll(/^import .*?from '([^']+)'/gm)) {
  ok(m[1].startsWith('./boxes/'), `מגן חוק-3: ייבוא-קופסה-בלבד (${m[1]})`);
}
ok(!/from '\.\/atoms\//.test(src), 'מגן: אין ייבוא-אטום-ישיר מהלוח (עקיפת-קופסה אסורה)');

console.log(`✓ לוח-האם: ${n} טענות — 12 קופסאות-מאור משולבות (תורמים·קוקפיט·דדופ·חיפוש·משפחות·יומן·דוחות·עברי·וואטסאפ·ביקורת+) · שעון-יחיד-מקור · קונפיג-מושחל · חוק-3 נאכף`);
