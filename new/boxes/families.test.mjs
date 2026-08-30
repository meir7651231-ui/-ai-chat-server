/** בדיקת-קצה · קופסת-המשפחות. מייבאת אך-ורק את הקופסה-שלה (חוק-4).
 *  ה-DoD (חוזה families.contract.md) מוכח כאן דוגמה-דוגמה, כולל עדשה-עוינת
 *  (ריק/null/עברית/פורמט-שבור) + מגן-הכרעה (קריאת-מקור-הקופסה ב-fs). */
import { readFileSync } from 'node:fs';
import assert from 'node:assert';
import {
  fmtDate, isoToday, ageOf, STATUS_META, CRED_RED_THRESHOLD, CRED_HELP_TEXT,
  tierOf, famEnrollments, famLiveEnrollments, finderAxes, finderAxisValue,
  finderMatches, numMatch, famHistoryOf, MARITAL_OPTIONS, LANGUAGE_OPTIONS,
  OTHER, OTHER_LABEL, chipStyle, maritalChipStyle,
} from './families.mjs';

let n = 0;
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

// ── fmtDate ──
eq(fmtDate('2026-08-24'), '24/08/2026', 'fmtDate תקין');
eq(fmtDate('2026-08-24T09:00:00'), '24/08/2026', 'fmtDate חותך ל-10');
eq(fmtDate(''), '—', 'fmtDate ריק');            // עוין
eq(fmtDate('bad'), '—', 'fmtDate פורמט-שבור');  // עוין
eq(fmtDate(undefined), '—', 'fmtDate undefined');// עוין (falsy)

// ── isoToday (now מוזרק — דטרמיניסטי) ──
eq(isoToday(new Date('2026-08-24T12:00:00')), '2026-08-24', 'isoToday מוזרק');

// ── ageOf ──
const NOW = new Date('2026-08-24T12:00:00');
eq(ageOf('2000-01-15', NOW), 26, 'ageOf יום-הולדת עבר');
eq(ageOf('2000-12-15', NOW), 25, 'ageOf יום-הולדת לא-עבר');
eq(ageOf('2000-08-24', NOW), 26, 'ageOf יום-הולדת היום');
eq(ageOf('', NOW), null, 'ageOf ריק');           // עוין
eq(ageOf('not-a-date', NOW), null, 'ageOf שבור'); // עוין

// ── קבועים ──
eq(STATUS_META.active.label, 'פעילה', 'STATUS_META active');
eq(STATUS_META.pending.label, 'ממתינה', 'STATUS_META pending');
eq(STATUS_META.inactive.label, 'לא פעילה', 'STATUS_META inactive');
eq(CRED_RED_THRESHOLD, 500, 'סף-אדום');
assert.ok(CRED_HELP_TEXT.startsWith('נוכחות +5 · דיוק +2'), 'CRED_HELP_TEXT verbatim'); n++;

// ── tierOf (סף מולחם) ──
eq(tierOf(970).key, 'titan', 'tier titan');
eq(tierOf(850).key, 'lion', 'tier lion');
eq(tierOf(600).key, 'pale', 'tier pale');
eq(tierOf(500).key, 'pale', 'tier סף כולל');   // גבול
eq(tierOf(499).key, 'red', 'tier red');
eq(tierOf(400).label, 'סיכון נטישה', 'tier red label');

// ── משפחה-לדוגמה ──
const fam = {
  id: 'f1', city: 'ירושלים', community: 'גור', maritalStatus: 'נשואים',
  status: 'active', language: 'עברית', fullSefach: true, cred: { score: 820, log: [] },
  members: [{ id: 'm1', isParent: true, first: 'שרה' }, { id: 'm2', isParent: false, first: 'דוד' }],
  docs: [], createdAt: '2025-01-01',
};
const db = {
  families: [fam],
  enrollments: [
    { memberId: 'm2', courseId: 'c1', status: 'active', enrolledAt: '2025-03-01', group: '', payments: [], absences: [] },
    { memberId: 'm2', courseId: 'c2', status: 'ended', enrolledAt: '2024-01-01', group: '', payments: [], absences: [] },
    { memberId: 'm2', courseId: 'c3', status: 'wait', enrolledAt: '2025-06-01', group: '', payments: [], absences: [] },
    { memberId: 'zz', courseId: 'c1', status: 'active', enrolledAt: '2025-01-01', group: '', payments: [], absences: [] },
  ],
  courses: [{ id: 'c1', name: 'אנגלית' }, { id: 'c2', name: 'חשבון' }, { id: 'c3', name: 'ציור' }],
  events: [{ famId: 'f1', date: '2025-05-05', title: 'ביקור בית', time: '10:00', done: true }],
};

// famEnrollments — כולל ended/wait, רק בני-המשפחה
eq(famEnrollments(db, fam).length, 3, 'famEnrollments כולל ended/wait, בלי זרים');
// famLiveEnrollments — בלי ended/wait
eq(famLiveEnrollments(db, fam).length, 1, 'famLive רק active/frozen');

// ── finderAxes ──
const axes = finderAxes({});
eq(axes.length, 9, 'finderAxes 9 צירים');
eq(axes[0], ['city', 'עיר'], 'finderAxes ציר-ראשון');
eq(axes[4], ['cred', 'אמינות'], 'finderAxes cred fallback');
// מילון דורס
eq(finderAxes({ terms: { 'entity.cred': 'מהימנות' } })[4], ['cred', 'מהימנות'], 'finderAxes termOf דורס');

// ── finderAxisValue ──
eq(finderAxisValue(db, fam, 'city'), 'ירושלים', 'axisValue city');
eq(finderAxisValue(db, fam, 'status'), 'פעילה', 'axisValue status');
eq(finderAxisValue(db, fam, 'kids'), 'עם ילדים', 'axisValue kids');
eq(finderAxisValue(db, fam, 'enrolled'), 'משתתפות בחוגים', 'axisValue enrolled');
eq(finderAxisValue(db, fam, 'sefach'), 'קיים', 'axisValue sefach');
eq(finderAxisValue(db, fam, 'cred'), 'לביאה', 'axisValue cred (820⇒lion)');
eq(finderAxisValue(db, { ...fam, maritalStatus: '' }, 'marital'), 'לא ידוע', 'axisValue marital חסר'); // עוין
eq(finderAxisValue(db, fam, 'zzz'), '', 'axisValue ציר לא-מוכר');  // עוין
// cred ברירת-מחדל 700 כשאין score
eq(finderAxisValue(db, { ...fam, cred: undefined }, 'cred'), 'טעון שיפור', 'axisValue cred ברירת-700'); // עוין

// ── finderMatches ──
eq(finderMatches(db, { city: 'ירושלים' }).length, 1, 'finderMatches תואם');
eq(finderMatches(db, { city: 'תל-אביב' }).length, 0, 'finderMatches לא-תואם');
eq(finderMatches(db, {}).length, 1, 'finderMatches בלי-נעילות = הכל');

// ── numMatch ──
eq(numMatch('', 5), true, 'numMatch ריק');
eq(numMatch('3', 3), true, 'numMatch מדויק');
eq(numMatch('3', 4), false, 'numMatch מדויק-שלילי');
eq(numMatch('3+', 3), true, 'numMatch לפחות-גבול');
eq(numMatch('3+', 2), false, 'numMatch לפחות-שלילי');
eq(numMatch('2-4', 4), true, 'numMatch טווח-גבול');
eq(numMatch('2-4', 5), false, 'numMatch טווח-מחוץ');
eq(numMatch('abc', 9), true, 'numMatch לא-מספרי לא-מסנן'); // עוין
eq(numMatch(null, 9), true, 'numMatch null');              // עוין

// ── famHistoryOf ──
const hist = famHistoryOf(db, fam);
// הצטרפות + אירוע + שיבוצים (3 בני-משפחה: active/ended/wait) = 5 רשומות
eq(hist.length, 5, 'famHistory ספירת-רשומות');
eq(hist[0].date, '2025-06-01', 'famHistory ממוין מהחדש-לישן');  // ציור wait = החדש
assert.ok(hist.some((h) => h.tag === 'הצטרפות'), 'famHistory הצטרפות'); n++;
assert.ok(hist.find((h) => h.text.includes('ציור')).text.includes('ברשימת-המתנה'), 'famHistory wait מסומן'); n++;
// config מוזרק דורס מונח
const histT = famHistoryOf(db, fam, { terms: { 'entity.family': 'חמולה' } });
assert.ok(histT.find((h) => h.tag === 'הצטרפות').text.includes('החמולה'), 'famHistory termOf דורס'); n++;
// ריק — משפחה בלי היסטוריה
eq(famHistoryOf({ families: [], enrollments: [], courses: [], events: [] },
  { id: 'x', members: [], docs: [], createdAt: '' }).length, 0, 'famHistory ריק'); // עוין

// ── בוררים ──
eq(MARITAL_OPTIONS, ['נשואים', 'גרושים', 'אלמן/ה', 'פרודים'], 'MARITAL_OPTIONS');
eq(LANGUAGE_OPTIONS, ['עברית', 'יידיש', 'רוסית', 'צרפתית', 'אנגלית'], 'LANGUAGE_OPTIONS');
eq(OTHER, '__other', 'OTHER');
eq(OTHER_LABEL, 'אחר — הקלדה חופשית…', 'OTHER_LABEL');

// ── chipStyle / maritalChipStyle ──
eq(chipStyle('#fff', '#000').background, '#fff', 'chipStyle bg');
eq(chipStyle('#fff', '#000').borderRadius, 999, 'chipStyle קבוע');
eq(maritalChipStyle('נשואים').background, '#e6f4ea', 'maritalChip נשואים');
eq(maritalChipStyle('אלמן/ה').color, '#4a5568', 'maritalChip אלמן');
eq(maritalChipStyle('???').background, '#eef1f5', 'maritalChip לא-מוכר ⇒ ניטרלי'); // עוין

/* 🛡 מגן-הכרעה: קריאת מקור-הקופסה ואישור הכרעות-החיווט verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./families.mjs', import.meta.url), 'utf8');
assert.ok(src.includes('tierOfWire(score, CRED_RED_THRESHOLD)'), 'מגן: tierOf מולחם עם הסף'); n++;
assert.ok(src.includes('termOf, tierOf: wiredTierOf, famLiveEnrollments: wiredFamLive, STATUS_META'),
  'מגן: אובייקט-שקעים ל-finderAxisValue'); n++;
assert.ok(src.includes('famLiveWire(db, fam, famEnrollments)'), 'מגן: famEnrollments מוזרק ל-famLive'); n++;
assert.ok(src.includes('const DEFAULT_CONFIG = {}'), 'מגן: ברירת-מחדל ריקה בקופסה'); n++;
// אכיפת-חשמלאי: קופסה מייבאת רק אטומים, לא קופסאות
assert.ok(!/from '\.\/[^']*\.mjs'/.test(src.replace(/families\.contract/g, '')), 'מגן: אפס ייבוא-קופסה'); n++;
assert.ok((src.match(/from '\.\.\/atoms\//g) || []).length === 23, 'מגן: 23 ייבואי-אטום (20 חוטים + iso-local + term-of + marital-chip-style-data — הכרעה 19)'); n++;

console.log(`✓ קופסת-המשפחות: ${n} טענות עברו (20 חוטים · עדשה-עוינת: ריק/null/עברית/שבור · מגן-הכרעה)`);
