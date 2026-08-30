import { receiptFmtOf as __pure_receiptFmtOf } from './receipt-fmt-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_receiptFmtOf_RECEIPT_FMT_OF_T = {
  k1: "core.receipt.pdf",
};
const receiptFmtOf = (...a) => __pure_receiptFmtOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_receiptFmtOf_RECEIPT_FMT_OF_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) עדות-שאילתה: config עצמו + המפתח המדויק, פעם אחת
const config = { features: {} };
const calls = [];
receiptFmtOf(config, { receiptFmt: 'pdf' }, (...args) => { calls.push(args); return true; });
chk("1 ‏featureOn(config,'core.receipt.pdf') פעם אחת",
  calls.length === 1 && calls[0][0] === config && calls[0][1] === 'core.receipt.pdf');

// 2) דגל דלוק + בחירת pdf ⇒ 'pdf'
chk("2 דלוק+'pdf' ⇒ 'pdf'", receiptFmtOf(config, { receiptFmt: 'pdf' }, () => true) === 'pdf');

// 3) דגל דלוק + בחירת txt ⇒ 'txt'
chk("3 דלוק+'txt' ⇒ 'txt'", receiptFmtOf(config, { receiptFmt: 'txt' }, () => true) === 'txt');

// 4) דגל דלוק + אין בחירה ⇒ undefined
chk('4 דלוק+{} ⇒ undefined', receiptFmtOf(config, {}, () => true) === undefined);

// 5) מתג-חירום: דגל כבוי ⇒ undefined גם כשנבחר pdf
const ui5 = { receiptFmt: 'pdf' };
chk("5 כבוי+'pdf' ⇒ undefined (מתג-חירום)", receiptFmtOf(config, ui5, () => false) === undefined);
chk('5 הבחירה השמורה לא נמחקה', ui5.receiptFmt === 'pdf');

if (f) process.exit(1);
console.log('✓ receipt-fmt-of: 5 דוגמאות-חוזה (שקע-featureOn + מתג-חירום) — ירוק');
