/** בדיקת-קצה: קופסת-התומכים — חיווט 41-החוטים דרך הקופסה בלבד (DoD: exit 0).
 *  מייבאת רק את הקופסה-שלה (מגילה, דיבר 12). */
import assert from 'node:assert';
const SUPPORTERS_TERMS = {
  k1: "new",
  k2: "hist",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
import { readFileSync } from 'node:fs';
import * as B from './supporters.mjs';

const FIXED = '2026-08-24';
let f = 0;
const chk = (name, got, want) => {
  try { assert.deepStrictEqual(got, want); }
  catch { console.error(`✗ ${name}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); f = 1; }
};

const sp = {
  id: 's1', name: 'כהן משה', phone: '0501234567', email: '', idNum: '', address: '', cat: '', forWho: '',
  count: 2, ils: 100, usd: 10, first: '2024-01-01', last: '2026-08-01', nextDate: '',
  donations: [
    { date: '2026-08-01', amount: 50, cur: '₪', rid: 'R-1', purpose: '' },
    { date: '2026-07-01', amount: 50, cur: '₪', rid: 'R-2' },
  ],
  hist: [{ d: '2026-06-01', a: 200, c: '₪', clearer: 'נדרים' }],
};

// ── אגרגטים (כולל היסטוריה, הכרעת 9.8) ──
chk('supIls', B.supIls(sp), 300);
chk('supUsd', B.supUsd(sp), 10);
chk('supCount', B.supCount(sp), 3);
chk('supLast', B.supLast(sp), '2026-08-01');
chk('supTotalIls', B.supTotalIls(sp), 337); // 300 + 10*3.7
chk('totalLabel', B.totalLabel(sp), '₪300 + $10');
chk('totalLabel-empty', B.totalLabel({ ils: 0, usd: 0 }), '—');

// ── פורמט ──
chk('fmtDate', B.fmtDate('2026-08-01'), '01/08/2026');
chk('fmtDate-broken', B.fmtDate(''), '—');
chk('normName', B.normName('בן דוד'), 'בנדוד');
chk('fixPhone', B.fixPhone('0501234567'), '050-1234567');

// ── דרגות ──
chk('supTier-gold', B.supTier(850), { label: 'זהב', bg: '#fdf3dd', c: '#9a6414', dot: '#f3c76b' });
chk('supTier-dormant', B.supTier(100).label, 'רדומה');
chk('TIER_ORDER', B.TIER_ORDER, ['זהב', 'כסף', 'ארד', 'רדומה']);
chk('SUP_NAME_KEYS', B.SUP_NAME_KEYS, ['שם', 'תורם']);
chk('HOK_CAT', B.HOK_CAT, 'הו"ק');

// ── אירועי-תרומה ──
chk('supDonEvents', B.supDonEvents(sp).map((e) => e.src), ['קבלה R-1', 'קבלה R-2', 'תרומה · נדרים']);

// ── ראוּת פר-ייעוד (הכשל שהאטום-הקבוצתי לא ידע לבד — נפתר בחיווט-הקופסה) ──
chk('vis-visible', B.supporterVisibleForDesignations({ forWho: 'עבודה' }, ['עבודה']), true);
chk('vis-hidden-noforwho', B.supporterVisibleForDesignations({ forWho: '' }, ['עבודה']), false);
chk('vis-all', B.supporterVisibleForDesignations({ forWho: '' }, null), true);
chk('visList', B.visibleSupportersForDesignations(
  [{ forWho: 'עבודה', donations: [] }, { forWho: 'אחר', donations: [] }], ['עבודה']).map((s) => s.forWho), ['עבודה']);
chk('allPurposes', B.allDonationPurposes([{ forWho: 'ב', donations: [{ purpose: 'א' }] }]), ['א', 'ב']);

// ── ייבוא ──
chk('excelSerial', B.excelSerialToIso(45900), '2025-08-31');
chk('excelSerial-bad', B.excelSerialToIso(-1), '');
chk('parseCsv', B.parseSupporterCsv('שם,טלפון\nלוי,0521111111')[0].name, 'לוי');
const plan = B.planSupporterImport([{ name: 'לוי', phone: '', email: '', idNum: '', address: '', cat: '', forWho: '' }],
  [{ id: 'x', name: 'לוי' }]);
chk('planImport-update', plan.updates.length, 1);
chk('planImport-noinsert', plan.inserts.length, 0);
chk('mergeHist-idempotent',
  B.mergeHist([{ d: '2026-01-01', a: 10, c: '₪' }], [{ d: '2026-01-01', a: 10, c: '₪' }]).length, 1);
chk('newFromRow', B.newSupporterFromRow('n1', { name: 'x', phone: '0501234567', email: '', idNum: '', address: '', cat: '', forWho: '' }).phone, '050-1234567');

// ── תיק-מעקב (clockIso לא נקרא כי eyes='') ──
let seq = 0;
const clockNever = () => { throw new Error('clock must not fire on eyes=""'); };
const withAyin = B.applyAyinNames({ ayin: undefined }, ['אבי', 'אבי'], () => 'id' + ++seq, clockNever);
chk('applyAyin-dedup', withAyin.ayin.names.map((n) => n.name), ['אבי']);

// ── הו"ק ──
chk('hokMethodLabel', B.hokMethodLabel('bank'), 'הו"ק בנקאית');
const hokSp = { hok: { active: true, amount: 100, cur: '₪', day: 5 }, donations: [], hist: [] };
chk('hokActive', B.hokEffectivelyActive(hokSp, FIXED), true);
chk('hokRecorded-no', B.hokRecordedThisMonth(hokSp, FIXED), false);
chk('hokDue', B.hokDue([hokSp], FIXED).length, 1);
chk('hokMonthlyTotal', B.hokMonthlyTotal([hokSp], 3.7, FIXED), 100);

// ── שקע-שעון (isoToday מוזרק, לא ממומש) ──
chk('isoToday-injected', B.isoToday(() => FIXED), FIXED);

/* 🛡 מגן-הכרעה: ההחלטות חיות בקופסה verbatim — נקראות מהמקור עם fs. */
const src = readFileSync(new URL('./supporters.mjs', import.meta.url), 'utf8');
// (1) emptyAyin — ברירת-המחדל של תיק-המעקב, ביט-זהה ל-domain.
for (const frag of ["stage: SUPPORTERS_TERMS.k1", 'names: [], answers: [], log: [], time: [], mat: []']) {
  if (!src.includes(frag)) { console.error(`✗ מגן emptyAyin: "${frag}" נעדר`); f = 1; }
}
// (2) fillEmpty — hist/ayinNames מצטרפים (מדיניות-המיזוג).
if (!src.includes('out.hist = [...(a.hist ?? []), ...(b.hist ?? [])]')) { console.error('✗ מגן fillEmpty'); f = 1; }
// (3) visibleSupportersForDesignations מחווט מעל supporterVisibleForDesignations (לא מעל האטום-הקבוצתי השבור).
if (!/\.filter\(\(sup\) => supporterVisibleForDesignations\(sup, allowed\)\)/.test(src)) { console.error('✗ מגן vis-list wiring'); f = 1; }
// (4) הקופסה מייבאת רק אטומים (LAW חוק-2) — אין import של קופסה אחרת.
if (/from '\.\.\/boxes\//.test(src) || /from '\.\/[a-z-]+\.mjs'/.test(src)) { console.error('✗ מגן: import לא-אטומי'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-התומכים: 41 חוטים מחווטים + 3 מגני-הכרעה — ירוק');
