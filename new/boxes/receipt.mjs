/** קופסת-חיבורים · receipt — מסירת-קבלה (§46 / רגילה / אישור-חנות S-) בטקסט או PDF.
 *  חוזה: receipt.contract.md · מקור-האמת (L4): maor/src/lib/receipt.ts
 *  7 חוטים לפי box-drafts/lib-receipt.box-draft.md. זה המקום היחיד שבו החוטים
 *  נפגשים (חוקי-החשמלאי, LAW.md) — הקופסה מייבאת אך-ורק אטומים; קופסה לא מייבאת קופסה.
 *
 *  ── ההכרעות שחיות כאן (חיווט, לא אטום) ──
 *  · hebDateFull — שכן-מודול (lib/hebrew) מחווט מאטומים-בריאים בפנים (gem/gemYear/hebParts).
 *  · hebrewLocaleDate — עוזר-פנימי לא-מיוצא במקור (receipt.ts:59-62): צהריים-מקומי
 *    (T12:00:00) ⇒ he-IL; תאריך-שבור ⇒ ה-ISO כמות-שהוא. חי כאן כתפר-חיווט.
 *  · NAV_MODULE_KEYS — תשעת מודולי-הניווט (config.ts:20-30) — שקע-מילון של feature-on.
 *  · BOM='﻿' · שם-קובץ `receipt-${rid}.txt` · השהיות revoke=5000/frame=60000 —
 *    הכרעות-המסירה מ-receipt.ts:150-219; שער-ההרשאה (guard-export atom) לפני התוכן.
 *
 *  ── שקע-שכן: amountInWords (⚠️ Diber 9 — עולם-שבור) ──
 *  amountInWords הוא שכן-מודול טהור מ-lib/hebrewNumber (receipt.ts:6). היה ראוי לחווטו
 *  מאטומים, אך מחסן-האטומים חסר: `amount-in-words.mjs` שבור (integerInWords/agorotPhrase
 *  לא מוזרקים ⇒ ReferenceError בכל מספר) ו-`agorot-phrase.mjs` חסר. receipt אינו הבעלים
 *  של לוגיקת-hebrew-number ⇒ במקום להטמיע אותה כאן, נשמר כשקע-שכן מוזרק (בדיוק כפי
 *  שאטום receipt-lines מגדיר אותו כשקע). לוח-האם מזריק את שכן-hebrew-number; ברירת-מחדל
 *  זורקת בבירור (רק בענף-§46 שקורא אותו) — נתיב לא-§46 אינו נוגע בו כלל. כשהאטומים יתוקנו,
 *  הברירת-מחדל תוחלף בחיווט-אטומים כאן. */
import { receiptVerifyCode as receiptVerifyCodeX } from '../atoms/receipt-verify-code.mjs';
import { receiptLines as receiptLinesX } from '../atoms/receipt-lines.mjs';
import { receiptHtml as receiptHtmlX } from '../atoms/receipt-html.mjs';
import { receiptFmtOf as receiptFmtOfX } from '../atoms/receipt-fmt-of.mjs';
import { deliverReceipt as deliverReceiptX } from '../atoms/deliver-receipt.mjs';
import { hebDateFull as hebDateFullX } from '../atoms/heb-date-full.mjs';
import { featureOn as featureOnX } from '../atoms/feature-on.mjs';
import { moduleOn } from '../atoms/module-on.mjs';
import { gem } from '../atoms/gematria.mjs';
import { gemYear as gemYearX } from '../atoms/gem-year.mjs';
import { hebParts } from '../atoms/heb-parts.mjs';
import { guardExport as guardExportX } from '../atoms/guard-export.mjs';

// ── חיווט: תאריך-עברי-מלא (gem/gemYear/hebParts שוקעו לתוך heb-date-full) ──
const gemYear = (y) => gemYearX(y, gem);
const hebDateFull = (iso) => hebDateFullX(iso, gem, gemYear, hebParts);

// ── חיווט: הלועזי של קבלה — צהריים-מקומי, he-IL (receipt.ts:59-62) ──
const hebrewLocaleDate = (iso) => {
  const d = new Date(iso.slice(0, 10) + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('he-IL');
};

// ── חיווט: חוזה-הדגלים — תשעת מודולי-הניווט + moduleOn שוקעו לתוך feature-on (config.ts:20-30) ──
const NAV_MODULE_KEYS = ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'];
const featureOn = (cfg, key) => featureOnX(cfg, key, NAV_MODULE_KEYS, moduleOn);

// ── שקע-שכן amountInWords: ברירת-מחדל זורקת (רק ענף-§46 קורא לו; ראה כותרת) ──
const AMOUNT_IN_WORDS_MISSING = () => {
  throw new Error('receipt: שקע amountInWords לא סופק — אטום amount-in-words שבור (integerInWords/agorotPhrase) ו-agorot-phrase חסר; לוח-האם מזריק את שכן hebrew-number.');
};

// ── הכרעות-המסירה (receipt.ts:150-219) ──
const BOM = '﻿';
const REVOKE_MS = 5000;
const FRAME_MS = 60_000;

// ── חיווט: שער-היציאה (guard-export atom; המצב blocked/notify מוזרק ב-io מלוח-האם) ──
const guardExport = (io) => guardExportX(io.exportBlocked, io.exportNotify);

// ── החשיפה: החוטים הטהורים ──
/** קוד-אימות FNV-1a לקבלה (XXX-XXX). */
export const receiptVerifyCode = receiptVerifyCodeX;

/** שורות-הקבלה (טהור) — §46 / רגילה / אישור-חנות S-. amountInWords = שקע-שכן (ראה כותרת). */
export const receiptLines = (o, amountInWords = AMOUNT_IN_WORDS_MISSING) =>
  receiptLinesX(o, hebDateFull, amountInWords, receiptVerifyCodeX, hebrewLocaleDate);

/** הקבלה כ-HTML מוכן-להדפסה (טהור — מחרוזת בלבד); receiptLines מקור-האמת היחיד לתוכן. */
export const receiptHtml = (o, amountInWords = AMOUNT_IN_WORDS_MISSING) =>
  receiptHtmlX(o, (x) => receiptLines(x, amountInWords));

/** הפורמט-האפקטיבי למסירה: הבחירה השמורה, רק כשדגל core.receipt.pdf דלוק. */
export const receiptFmtOf = (config, ui) => receiptFmtOfX(config, ui, featureOn);

// ── החשיפה: החוטים הלא-טהורים (io מוזרק) ──
/** הורדת-קבלה כקובץ-טקסט (BOM + שורות ריקות מסוננות). שער-ההרשאה קודם לתוכן. */
export function downloadReceipt(o, io, amountInWords = AMOUNT_IN_WORDS_MISSING) {
  if (!guardExport(io)) return; // 🔐 שער יציאת-מידע
  const text = BOM + receiptLines(o, amountInWords).filter((x) => x !== '').join('\n');
  const blob = new io.Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = io.document.createElement('a');
  a.href = io.URL.createObjectURL(blob);
  a.download = `receipt-${o.rid}.txt`;
  a.click();
  io.setTimeout(() => io.URL.revokeObjectURL(a.href), REVOKE_MS);
}

/** הדפסה/PDF דרך iframe נסתר (לא window.open — חוסמי-חלונות). שער-ההרשאה קודם. */
export function printReceipt(o, io, amountInWords = AMOUNT_IN_WORDS_MISSING) {
  if (!guardExport(io)) return; // 🔐 שער יציאת-מידע
  const frame = io.document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.insetInlineEnd = '-9999px';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.setAttribute('aria-hidden', 'true');
  frame.srcdoc = receiptHtml(o, amountInWords);
  frame.onload = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      io.setTimeout(() => frame.remove(), FRAME_MS);
    }
  };
  io.document.body.appendChild(frame);
}

/** מסירה לפי בחירת-הלקוח: 'pdf' ⇒ הדפסה; אחרת ⇒ קובץ-טקסט. */
export function deliverReceipt(o, fmt, io, amountInWords = AMOUNT_IN_WORDS_MISSING) {
  deliverReceiptX(o, fmt, (x) => printReceipt(x, io, amountInWords), (x) => downloadReceipt(x, io, amountInWords));
}
