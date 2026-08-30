import { deliverReceipt as __pure_deliverReceipt } from './deliver-receipt.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_deliverReceipt_DELIVER_RECEIPT_T = {
  k1: "pdf",
};
const deliverReceipt = (...a) => __pure_deliverReceipt(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_deliverReceipt_DELIVER_RECEIPT_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const o = { rid: 'R-7', ils: 180 };
const run = (fmt) => {
  const prints = [], downloads = [];
  const ret = deliverReceipt(o, fmt, (x) => prints.push(x), (x) => downloads.push(x));
  return { prints, downloads, ret };
};

// 1) pdf ⇒ הדפסה בלבד, עם בדיוק o
{
  const { prints, downloads, ret } = run('pdf');
  chk('1 pdf ⇒ הדפסה', prints.length === 1 && prints[0] === o && downloads.length === 0);
  chk('5א מחזיר undefined', ret === undefined);
}
// 2) txt ⇒ הורדה בלבד
{
  const { prints, downloads } = run('txt');
  chk('2 txt ⇒ הורדה', downloads.length === 1 && downloads[0] === o && prints.length === 0);
}
// 3) חסר ⇒ הורדה (ברירת-המחדל ההיסטורית)
{
  const { prints, downloads, ret } = run(undefined);
  chk('3 חסר ⇒ הורדה', downloads.length === 1 && downloads[0] === o && prints.length === 0);
  chk('5ב מחזיר undefined', ret === undefined);
}
// 4) השוואה קפדנית — 'PDF' ברישיות שונה איננו pdf
{
  const { prints, downloads } = run('PDF');
  chk("4 'PDF' ⇒ הורדה", downloads.length === 1 && prints.length === 0);
}

if (f) process.exit(1);
console.log('✓ deliver-receipt: 5 דוגמאות-חוזה (שקעי הדפסה/הורדה) — ירוק');
