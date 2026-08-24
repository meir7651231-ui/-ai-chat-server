/** בדיקת-קצה: קופסת-הקבלה — תוכן (§46/רגילה/S-/שבור) + מסירה (io מזויף) + שער-הרשאה.
 *  ‏DoD (דיבר 12): node receipt.test.mjs ⇒ exit 0. מייבאת אך-ורק את הקופסה-שלה (חוק-4).
 *  amountInWords = שקע-שכן מוזרק (סטאב, כמו בבדיקת אטום receipt-lines) — ראה כותרת-הקופסה. */
import * as R from './receipt.mjs';
import { readFileSync } from 'node:fs';
let f = 0;
const eq = (got, want, msg) => { if (got !== want) { console.error(`✗ ${msg}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; } };
const ok = (c, msg) => { if (!c) { console.error('✗ ' + msg); f = 1; } };
const AIW = () => 'מאה ושמונים שקלים חדשים';

// 1) §46 מלאה (שכן amountInWords מוזרק) — פריסה רשמית
const tax = R.receiptLines({ rid: 'D-0007', amount: 1234, date: '2026-08-05', payer: 'דוד לוי', forWhat: 'תרומה כללית', taxReceipt: true, orgName: 'מאור', orgTaxId: '580123456', payerId: '012345678', method: 'מזומן', signatory: 'הרב כהן', site: 'maor.org', verify: true }, AIW);
eq(tax.length, 23, '§46 אורך');
eq(tax[0], 'מקור', '§46 [0] מקור');
eq(tax[4], 'קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה', '§46 [4] נוסח');
eq(tax[5], 'קבלה מס׳: D-0007', '§46 [5] מס׳');
eq(tax[6], 'קוד-אימות: ' + R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05'), '§46 [6] קוד-אימות מחווט');
eq(tax[11], 'סכום: ₪1,234', '§46 [11] toLocaleString (1234⇒1,234)');
eq(tax[12], 'במילים: מאה ושמונים שקלים חדשים', '§46 [12] amountInWords מחווט');
eq(tax[20], 'הרב כהן  ______________________', '§46 [20] חתימה');
eq(tax[22], 'אתר: maor.org', '§46 [22] אתר');

// 2) רגילה עם סיכום-עסקה + copy
const reg = R.receiptLines({ rid: 'R-0042', amount: 400, date: '2026-08-05', payer: 'רות', forWhat: 'כרטיסייה', copy: true, summary: { totalDue: 1000, paidSoFar: 400, balance: 600, nextDate: '2026-09-01' } });
eq(reg.length, 12, 'רגילה אורך');
eq(reg[0], 'העתק נאמן למקור', 'רגילה [0] העתק');
eq(reg[1], 'קבלה — מאור החסד', 'רגילה [1] orgName ברירת-מחדל');
eq(reg[2], 'קבלה מס׳: R-0042', 'רגילה [2] מס׳');
eq(reg[5], 'סכום: ₪400', 'רגילה [5] סכום כמות-שהוא');
eq(reg[8], 'סה"כ עסקה: ₪1000 · שולם עד כה: ₪400 · יתרה: ₪600', 'רגילה [8] סיכום-עסקה');
eq(reg[11], 'תודה על תמיכתכם', 'רגילה שורה-אחרונה');

// 3) אישור-חנות S- בלי סימון
const s = R.receiptLines({ rid: 'S-0003', amount: 20, date: '2026-08-05', payer: 'משפחת כהן', forWhat: 'מימוש קופון', mark: false, currency: '₪' });
eq(s[0], 'אישור תשלום — מאור החסד', 'S- [0] אישור-תשלום (בלי מקור)');
eq(s[1], 'אישור מס׳: S-0003', 'S- [1] אישור מס׳');
eq(s[s.length - 1], 'תודה על תמיכתכם', 'S- שורה-אחרונה');

// 4) תאריך שבור ⇒ שורת-התאריך כמות-שהיא (hebDateFull מחווט מחזיר '')
eq(R.receiptLines({ rid: 'R-1', amount: 5, date: 'שטויות', payer: 'א', forWhat: 'ב' })[3], 'תאריך: שטויות', 'תאריך-שבור');

// 5) קוד-אימות — דטרמיניסטי + פורמט XXX-XXX
const vc = R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05');
eq(vc, R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05'), 'verify דטרמיניסטי');
ok(/^[0-9A-Z]{3}-[0-9A-Z]{3}$/.test(vc), 'verify פורמט XXX-XXX: ' + vc);

// 6) HTML — doctype/rtl/esc/שורת-mark = השורה-הראשונה
const html = R.receiptHtml({ rid: 'D-1', amount: 5, date: '2026-08-05', payer: 'a<b>', forWhat: 'x' });
ok(html.startsWith('<!doctype html>'), 'html doctype');
ok(html.includes('dir="rtl"'), 'html rtl');
ok(html.includes('a&lt;b&gt;'), 'html esc — < בורח');
ok(html.includes('class="mark">מקור<'), 'html שורת-mark = השורה הראשונה (מקור)');

// 7) fmtOf — דלוק ⇒ הבחירה; כבוי ⇒ undefined
eq(R.receiptFmtOf({ features: {}, modules: {} }, { receiptFmt: 'pdf' }), 'pdf', 'fmtOf דגל-דלוק');
eq(R.receiptFmtOf({ features: { 'core.receipt.pdf': false }, modules: {} }, { receiptFmt: 'pdf' }), undefined, 'fmtOf דגל-כבוי');

// ── io מזויף: מקליט createElement + BOM + שם-קובץ + שער-הרשאה ──
const mkIo = (extra = {}) => {
  const rec = { tags: [], anchor: null, frame: null, revoked: 0 };
  const doc = {
    createElement: (tag) => {
      rec.tags.push(tag);
      const el = { tag, style: {}, setAttribute() {}, click() {}, remove() {} };
      if (tag === 'a') rec.anchor = el;
      if (tag === 'iframe') rec.frame = el;
      return el;
    },
    body: { appendChild() {} },
  };
  const io = {
    document: doc,
    Blob: class { constructor(parts) { this.text = parts.join(''); rec.blobText = this.text; } },
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => { rec.revoked++; } },
    setTimeout: () => 0,
    ...extra,
  };
  return { io, rec };
};

// 8) הורדה — שם-קובץ receipt-<rid>.txt + BOM בתחילת התוכן
{
  const { io, rec } = mkIo();
  R.downloadReceipt({ rid: 'D-1', amount: 5, date: '2026-08-05', payer: 'a', forWhat: 'x' }, io);
  eq(rec.anchor && rec.anchor.download, 'receipt-D-1.txt', 'הורדה שם-קובץ');
  ok(rec.blobText && rec.blobText.startsWith('﻿'), 'הורדה BOM בתחילת התוכן');
  ok(rec.tags.includes('a'), 'הורדה יצרה עוגן');
}

// 8ב) שער חסום ⇒ אפס createElement, אפס תוכן
{
  const { io, rec } = mkIo({ exportBlocked: true });
  let notified = 0;
  io.exportNotify = () => { notified++; };
  R.downloadReceipt({ rid: 'D-9', amount: 1, date: '2026-08-05', payer: 'a', forWhat: 'x' }, io);
  eq(rec.tags.length, 0, 'שער-חסום: אפס createElement');
  eq(notified, 1, 'שער-חסום: הריץ התרעה');
}

// 9) מסירה — 'pdf' ⇒ iframe (הדפסה), 'txt'/חסר ⇒ anchor (הורדה)
{
  const { io, rec } = mkIo();
  R.deliverReceipt({ rid: 'D-2', amount: 5, date: '2026-08-05', payer: 'a', forWhat: 'x' }, 'pdf', io);
  ok(rec.tags.includes('iframe') && !rec.tags.includes('a'), "deliver 'pdf' ⇒ iframe");
  ok(rec.frame && typeof rec.frame.srcdoc === 'string' && rec.frame.srcdoc.startsWith('<!doctype html>'), 'deliver pdf ⇒ srcdoc=HTML');
}
{
  const { io, rec } = mkIo();
  R.deliverReceipt({ rid: 'D-3', amount: 5, date: '2026-08-05', payer: 'a', forWhat: 'x' }, 'txt', io);
  ok(rec.tags.includes('a') && !rec.tags.includes('iframe'), "deliver 'txt' ⇒ anchor");
}

// 10) שקע-§46 חסר ⇒ ברירת-מחדל זורקת בבירור (מתעד את בלוקר amount-in-words; Diber 9)
{
  let threw = '';
  try { R.receiptLines({ rid: 'D-1', amount: 5, date: '2026-08-05', payer: 'a', forWhat: 'x', taxReceipt: true }); }
  catch (e) { threw = e.message; }
  ok(threw.includes('amountInWords'), '§46 בלי שקע ⇒ שגיאה מפורשת (בלוקר amount-in-words): ' + threw.slice(0, 30));
}

/* 🛡 מגן-הכרעה: הכרעות-החיווט חתומות verbatim במקור-הקופסה. */
const src = readFileSync(new URL('./receipt.mjs', import.meta.url), 'utf8');
// שער-ההרשאה קודם לתוכן — בהורדה ובהדפסה
ok(src.indexOf('if (!guardExport(io)) return;') < src.indexOf('receiptLines(o, amountInWords).filter'), 'מגן: שער-הרשאה לפני התוכן (הורדה)');
ok(src.indexOf('if (!guardExport(io)) return;') < src.indexOf('receiptHtml(o, amountInWords)'), 'מגן: שער-הרשאה לפני התוכן (הדפסה)');
// קבועי-המסירה verbatim
ok(src.includes("const BOM = '﻿';"), 'מגן: BOM verbatim');
ok(src.includes('`receipt-${o.rid}.txt`'), 'מגן: שם-קובץ verbatim');
ok(src.includes('const REVOKE_MS = 5000;'), 'מגן: revoke 5000');
ok(src.includes('const FRAME_MS = 60_000;'), 'מגן: frame 60000');
// מילון NAV_MODULE_KEYS (9 מודולי-ניווט) + כלל-הצהריים
ok(src.includes("const NAV_MODULE_KEYS = ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'];"), 'מגן: NAV_MODULE_KEYS 9-מודולים verbatim');
ok(src.includes("'T12:00:00'"), 'מגן: hebrewLocaleDate צהריים-מקומי');

if (f) process.exit(1);
console.log('✓ קופסת-הקבלה: §46/רגילה/S-/שבור + verify/html/fmtOf + מסירה(io)+שער-הרשאה + מגן-הכרעה — ירוק');
