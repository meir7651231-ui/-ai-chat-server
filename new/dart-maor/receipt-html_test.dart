import '../dart-data-maor/receipt-html-sockets.dart' as sk_receipt_html;
// בדיקת-חוזה (רתמת-זהב) · receiptHtml — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/receipt-html.test.mjs:
//   1) XSS: !html.includes('<script>') · html.includes('&lt;script&gt;') · '&amp; בניו'
//   2) מבנה: mark = שורה-ראשונה · ריקות מסוננות · סדר-גוף נשמר · 3 שורות-ln
//   3) מעטפת: dir="rtl" · lang="he" · charset · @media print · 'קבלה R-77'
//   4) דטרמיניזם: html == receiptHtml(o, fakeLines, sk_receipt_html.receiptHtml_T)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/receipt-html_test.dart  ⇒ exit 0
import 'receipt-html.dart';

// שקע-הבדיקה: אותן חמש שורות של המקור-ה-JS (השנייה ריקה — חייבת להיות מסוננת).
List<String> fakeLines(Map<String, dynamic> o) => [
      '*** מקור ***',
      '',
      "קבלה מס' " + o['rid'].toString(),
      'התקבל מ: ' + o['name'].toString(),
      'סכום: 100 ₪',
    ];

void main() {
  var n = 0;
  final o = <String, dynamic>{
    'rid': 'R-77',
    'name': 'ישראל <script>alert(1)</script> & בניו',
  };
  final html = receiptHtml(o, fakeLines, sk_receipt_html.receiptHtml_T);

  // 1) XSS — הקלט העוין לא מגיע חי.
  assert(!html.contains('<script>'), 'FAIL: script חי ב-HTML!');
  n++;
  assert(html.contains('&lt;script&gt;'), 'FAIL: escaping חסר');
  n++;
  assert(html.contains('&amp; בניו'), 'FAIL: אמפרסנד לא בורח');
  n++;

  // 2) מבנה: שורה ראשונה = mark · ריקות מסוננות · סדר-גוף נשמר.
  assert(html.contains('<div class="mark">*** מקור ***</div>'),
      'FAIL: mark שגוי');
  n++;
  final bodyIdx = [
    html.indexOf('קבלה מס'),
    html.indexOf('התקבל מ'),
    html.indexOf('סכום'),
  ];
  assert(
      bodyIdx[0] > 0 && bodyIdx[0] < bodyIdx[1] && bodyIdx[1] < bodyIdx[2],
      'FAIL: סדר-שורות התהפך');
  n++;
  assert(RegExp('class="ln"').allMatches(html).length == 3,
      'FAIL: שורה ריקה חדרה לגוף');
  n++;

  // 3) מעטפת רשמית.
  for (final frag in const [
    'dir="rtl"',
    'lang="he"',
    'charset="utf-8"',
    '@media print',
    'קבלה R-77',
  ]) {
    assert(html.contains(frag), 'FAIL: חסר: $frag');
    n++;
  }

  // 4) דטרמיניזם.
  assert(html == receiptHtml(o, fakeLines, sk_receipt_html.receiptHtml_T), 'FAIL: לא-דטרמיניסטי');
  n++;

  print('OK receiptHtml: $n asserts passed');
}
