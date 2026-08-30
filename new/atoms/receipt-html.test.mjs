/** בדיקת-חוזה · receipt-html — escaping-XSS · מבנה · דטרמיניזם. */
import { receiptHtml as __pure_receiptHtml } from './receipt-html.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_receiptHtml_RECEIPT_HTML_T = {
  k1: "&amp;",
  k2: "<div class=\"ln\">",
  k3: "</div>",
  k4: "<!doctype html><html dir=\"rtl\" lang=\"he\"><head><meta charset=\"utf-8\">",
  k5: "<title>",
  k6: "קבלה ",
  k7: "</title>",
  k8: "<style>",
  k9: "body{font-family:\"Segoe UI\",Arial,\"Noto Sans Hebrew\",sans-serif;color:#111;margin:0;padding:32px;direction:rtl}",
  k10: ".sheet{max-width:520px;margin:0 auto;border:1px solid #bbb;border-radius:10px;padding:28px 32px}",
  k11: ".mark{font-size:12px;letter-spacing:.08em;color:#555;text-align:left}",
  k12: ".ln{font-size:14.5px;line-height:1.9}",
  k13: ".ln:first-of-type{font-size:19px;font-weight:700;margin-bottom:6px}",
  k14: "@media print{body{padding:0}.sheet{border:none}}",
  k15: "</style></head><body><div class=\"sheet\">",
  k16: "<div class=\"mark\">",
  k17: "</div></body></html>",
};
const receiptHtml = (...a) => __pure_receiptHtml(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_receiptHtml_RECEIPT_HTML_T);
import assert from 'node:assert';

const fakeLines = (o) => ['*** מקור ***', '', 'קבלה מס\' ' + o.rid, 'התקבל מ: ' + o.name, 'סכום: 100 ₪'];
const o = { rid: 'R-77', name: 'ישראל <script>alert(1)</script> & בניו' };
const html = receiptHtml(o, fakeLines);

// 1) XSS — הקלט העוין לא מגיע חי
assert.ok(!html.includes('<script>'), 'script חי ב-HTML!');
assert.ok(html.includes('&lt;script&gt;'), 'escaping חסר');
assert.ok(html.includes('&amp; בניו'), 'אמפרסנד לא בורח');

// 2) מבנה: שורה ראשונה = mark, ריקות מסוננות, סדר-גוף נשמר
assert.ok(html.includes('<div class="mark">*** מקור ***</div>'));
const bodyIdx = [html.indexOf('קבלה מס'), html.indexOf('התקבל מ'), html.indexOf('סכום')];
assert.ok(bodyIdx[0] > 0 && bodyIdx[0] < bodyIdx[1] && bodyIdx[1] < bodyIdx[2], 'סדר-שורות התהפך');
assert.strictEqual((html.match(/class="ln"/g) || []).length, 3, 'שורה ריקה חדרה לגוף');

// 3) מעטפת רשמית
for (const frag of ['dir="rtl"', 'lang="he"', 'charset="utf-8"', '@media print', 'קבלה R-77']) {
  assert.ok(html.includes(frag), 'חסר: ' + frag);
}

// 4) דטרמיניזם
assert.strictEqual(html, receiptHtml(o, fakeLines));
console.log('✓ receipt-html — XSS חסום · מבנה · דטרמיניזם');
