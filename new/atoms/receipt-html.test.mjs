/** בדיקת-חוזה · receipt-html — escaping-XSS · מבנה · דטרמיניזם. */
import { receiptHtml } from './receipt-html.mjs';
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
