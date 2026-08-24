/** בדיקת-קצה · קופסת-הביקורת (audit) — מוכיחה את דוגמאות audit.contract.md
 *  דרך הקופסה בלבד (דיבר 4). DoD: node new/boxes/audit.test.mjs ⇒ exit 0. */
import { AUDIT_CAT_COLORS, AUDIT_CATEGORIES, phoneIssue, runAudit, auditReportLines } from './audit.mjs';
import { readFileSync } from 'node:fs';

let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };
const eq = (got, want, msg) => { if (JSON.stringify(got) !== JSON.stringify(want)) bad(msg + ' — קיבלנו ' + JSON.stringify(got)); };
const NOW = new Date('2026-08-24T12:00:00');

// ── קבועי-התצוגה (audit.ts:34-54) ──
eq(AUDIT_CATEGORIES, ['כפילות', 'ת"ז', 'טלפון', 'אימייל', 'כתובת', 'לוגיקה', 'ילדים', 'קשר'], 'סדר-הקטגוריות');
eq(AUDIT_CAT_COLORS['כפילות'], ['#fdeaea', '#b91c1c'], 'צבעי-כפילות');
eq(AUDIT_CAT_COLORS['קשר'], ['#f6ead1', '#9a6414'], 'צבעי-קשר');
if (Object.keys(AUDIT_CAT_COLORS).join() !== AUDIT_CATEGORIES.join()) bad('לכל קטגוריה צבע — אי-התאמה');

// ── phoneIssue — טבלת-החוזה (audit.ts:60-68) ──
eq(phoneIssue(undefined), null, 'טלפון ריק');
eq(phoneIssue(''), null, 'טלפון מחרוזת-ריקה');
eq(phoneIssue('-'), null, 'טלפון מקף');
eq(phoneIssue('050-1234567'), null, 'טלפון 10 ספרות');
eq(phoneIssue('03-5551234'), null, 'טלפון 9 ספרות');
eq(phoneIssue('12345678'), 'כנראה חסרה ספרת 0 מובילה: 12345678', '8 ספרות');
eq(phoneIssue('123456'), 'קצר מדי: 123456', '6 ספרות');
eq(phoneIssue('972501234567'), 'לא מתחיל ב-0: 972501234567', 'קידומת-ללא-0');
eq(phoneIssue('05012345678'), 'אורך חריג (11 ספרות): 05012345678', '11 ספרות');

// ── runAudit — קורפוס-דוגמאות החוזה ──
const famBase = { status: 'active', city: 'צפת', address: 'רח 1', maritalStatus: 'נשואים', father: 'א', mother: 'ב', members: [] };
const db = {
  families: [
    { ...famBase, id: 'f1', name: 'א', phone: '0501234567' },
    { ...famBase, id: 'f2', name: 'ב', phone: '0501234567' },
    { ...famBase, id: 'f3', name: 'לוי', phone: '0525550001', fatherId: '123456789' },
    { ...famBase, id: 'f4', name: 'ולידי', phone: '0525550002', fatherId: '123456782' },
    {
      ...famBase, id: 'f5', name: 'ילדים', phone: '0525550003',
      members: [
        { id: 'm1', first: 'זקן', birth: '1990-01-01' },
        { id: 'm2', first: 'שבור', birth: 'bad-date' },
        { id: 'm3', first: 'תקין', birth: '2015-06-10' },
      ],
    },
  ],
  enrollments: [{ memberId: 'm3', totalDue: 100, payments: [{ amount: 80 }, { amount: 40 }] }],
  supporters: [
    { id: 's1', name: 'תורם', phone: '0501112222', ils: 100, count: 1, donations: [{ amount: 50, date: '2026-01-01', rid: 'R-1' }] },
    { id: 's2', name: 'איחר', phone: '0501112223', ils: 0, usd: 0, count: 1, nextDate: '2026-01-01', donations: [{ amount: 0, date: '2026-01-02', rid: 'D-7' }] },
  ],
};
const issues = runAudit(db, '2026-08-24', true, undefined, NOW);
const has = (cat, part) => issues.some((i) => i.cat === cat && i.title.includes(part));
if (!has('כפילות', 'טלפון 0501234567 משותף ל-2 משפחות: א, ב')) bad('דוגמה 1: טלפון-משותף');
if (!has('ת"ז', 'לא עוברת ספרת ביקורת (123456789)')) bad('דוגמה 2: ת"ז שגויה');
if (issues.some((i) => i.title.includes('123456782'))) bad('דוגמה 2: ת"ז תקינה סומנה');
if (!has('ילדים', 'גיל חריג לזקן (36)')) bad('דוגמה 3: גיל 36 מול שעון מוזרק');
if (issues.some((i) => i.cat === 'ילדים' && i.title.includes('שבור') && i.title.includes('גיל'))) bad('דוגמה 3: birth שבור ⇒ בלי ממצא-גיל');
if (!has('לוגיקה', 'לא תואם את פירוט ה')) bad('דוגמה 4: מצבור/פירוט');
if (!has('קשר', 'עבר יעד הקשר של "איחר" (2026-01-01)')) bad('דוגמה 5: יעד-קשר');
if (!has('לוגיקה', 'תרומה בסכום 0 אצל "איחר" (D-7)')) bad('דוגמה 6: תרומת-אפס');
if (!has('לוגיקה', 'שולם ₪120 — יותר מסה"כ העסקה (₪100)')) bad('תשלום-יתר בשיבוץ');
const fam = issues.find((i) => i.title.includes('משותף'));
if (!fam || fam.famId !== 'f1') bad('famId על ממצא-משפחה');
const sup = issues.find((i) => i.cat === 'קשר');
if (!sup || sup.spId !== 's2') bad('spId על ממצא-תומך');

// ברירות-המחדל של הקופסה: todayIso='' ⇒ בלי יעד-קשר; extra=false ⇒ גם בלי תרומת-אפס
const defIssues = runAudit(db, undefined, undefined, undefined, NOW);
if (defIssues.some((i) => i.title.includes('עבר יעד הקשר'))) bad("ברירת-מחדל todayIso='' לא דילגה על יעד-קשר");
if (!defIssues.some((i) => i.title.includes('תרומה בסכום 0'))) bad('ברירת-מחדל extra=true לא בדקה תרומת-אפס');
const offIssues = runAudit(db, '2026-08-24', false, undefined, NOW);
if (offIssues.some((i) => i.title.includes('עבר יעד הקשר') || i.title.includes('תרומה בסכום 0'))) bad('extra=false לא כיבה את המורחבת');

// termOf דרך config (audit.ts:80,113): המונח נדרס, ה-fallback לא דולף
const cfg = { terms: { 'nav.families': 'לקוחות' } };
const cfgIssues = runAudit(db, '2026-08-24', true, cfg, NOW);
if (!cfgIssues.some((i) => i.title.includes('משותף ל-2 לקוחות'))) bad('termOf: דריסת-מונח לא הופיעה');

// כפילות-שם עם נרמול (validate.ts:65-67): "בן דוד"≡"בןדוד", ניקוד/גרשיים מוסרים
const dupDb = {
  families: [],
  supporters: [
    { id: 'd1', name: 'בן דוד', phone: '0501234567', donations: [] },
    { id: 'd2', name: 'בןדוֹד', phone: '0501234568', donations: [] },
  ],
};
if (!runAudit(dupDb, '', true, undefined, NOW).some((i) => i.cat === 'כפילות' && i.title.includes('מופיע/ה 2 פעמים'))) bad('נרמול-שם בכפילות-תומכים');

// חסינות לנתונים פגומים (audit.ts:82-83)
eq(runAudit({}, '', true, undefined, NOW), [], 'db ריק ⇒ []');
const brokenDb = {
  families: [{ ...famBase, id: 'x', name: 'שבורה', phone: '0525550009', members: 'לא-מערך' }],
  enrollments: 'לא-מערך',
  supporters: [{ id: 'y', name: 'בלי-פירוט', phone: '0525550008', donations: null }],
};
try { runAudit(brokenDb, '2026-08-24', true, undefined, NOW); } catch (e) { bad('קריסה על נתונים פגומים: ' + e.message); }

// ── auditReportLines (audit.ts:222-226) ──
eq(auditReportLines('', [{ cat: 'טלפון', title: 'X' }], '24.8.2026'),
  ['דוח תקינות נתונים — מאור החסד', 'הופק: 24.8.2026', '', '[טלפון] X'], 'שורות-הדוח + ברירת-שם');
eq(auditReportLines('אור ראשון', [], 'עכשיו'), ['דוח תקינות נתונים — אור ראשון', 'הופק: עכשיו', ''], 'שם-ארגון מפורש');

/* 🛡 מגן-הכרעה: ההכרעות שבחוזה חיות במקור-הקופסה verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./audit.mjs', import.meta.url), 'utf8');
for (const anchor of [
  "todayIso = ''",
  'extra = true',
  'now = new Date()',
  'normNameWire(t, normSearch)',
  'ageOf: (birth) => ageOf(birth, now)',
]) if (!src.includes(anchor)) bad('מגן: ההכרעה "' + anchor + '" שונתה');
const imports = [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
if (!imports.length || imports.some((p) => !p.startsWith('../atoms/'))) bad('מגן: ייבוא שאינו מ-../atoms/ (חוק-2)');

if (f) process.exit(1);
console.log('✓ קופסת-הביקורת: 8 קטגוריות · phoneIssue 9 דינים · runAudit (כפילויות/ת"ז/גיל-מוזרק/מצבור/מורחבת/termOf/נרמול/פגום) · דוח · מגן-הכרעה');
