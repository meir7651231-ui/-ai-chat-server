// בדיקת-חוזה (רתמת-זהב) · safeHttpsUrl — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/safe-https-url.test.mjs:
//   [['https://example.com','https://example.com/'],['  https://a.b/c?x=1  ','https://a.b/c?x=1'],
//    ['http://example.com',null],['javascript:alert(1)',null],['not a url',null],['',null]]
// בנוסף: ~60 קצוות שאומתו ביט-אחר-ביט מול node v22 (new URL — מפרש-WHATWG + ada-idna,
// המנוע שה-JS-המקורי רץ עליו): נורמליזציית-שורש, סלאשים/backslash, port, מקטעי-נקודה,
// קידוד-אחוז, IPv4/IPv6, ‏IDN עברית/punycode/Bidi, userinfo. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/safe-https-url_test.dart  ⇒ exit 0 + OK
import 'safe-https-url.dart';

void _eq(String? got, String? want) {
  if (got != want) {
    throw StateError('FAIL: got=${got == null ? 'null' : '"$got"'} want=${want == null ? 'null' : '"$want"'}');
  }
}

void main() {
  var n = 0;

  // — שש דוגמאות-החוזה verbatim (safe-https-url.test.mjs) —
  final contract = <List<String?>>[
    ['https://example.com', 'https://example.com/'],
    ['  https://a.b/c?x=1  ', 'https://a.b/c?x=1'],
    ['http://example.com', null],
    ['javascript:alert(1)', null],
    ['not a url', null],
    ['', null],
  ];
  for (final row in contract) {
    _eq(safeHttpsUrl(row[0]), row[1]);
    n++;
  }

  // — (raw||'') — ‏null/undefined ב-JS ⇒ null —
  _eq(safeHttpsUrl(null), null);
  n++;

  // — מבנה: path ריק, query/fragment ריקים, סלאשים, backslash, רישיות-סכמה —
  _eq(safeHttpsUrl('https://a.b?q'), 'https://a.b/?q');
  n++;
  _eq(safeHttpsUrl('https://a.b#f'), 'https://a.b/#f');
  n++;
  _eq(safeHttpsUrl('https://a.b/x?'), 'https://a.b/x?');
  n++;
  _eq(safeHttpsUrl('https://a.b/x#'), 'https://a.b/x#');
  n++;
  _eq(safeHttpsUrl('https://'), null);
  n++;
  _eq(safeHttpsUrl('https:///path'), 'https://path/');
  n++;
  _eq(safeHttpsUrl('https:example.com'), 'https://example.com/');
  n++;
  _eq(safeHttpsUrl('https:/example.com'), 'https://example.com/');
  n++;
  _eq(safeHttpsUrl('https:\\\\a.b\\c'), 'https://a.b/c');
  n++;
  _eq(safeHttpsUrl('https://a.b\\c\\d'), 'https://a.b/c/d');
  n++;
  _eq(safeHttpsUrl('HtTpS://Ex.Co/Path'), 'https://ex.co/Path');
  n++;
  _eq(safeHttpsUrl('  \thttps://a.b/x\n '), 'https://a.b/x');
  n++;

  // — port: ברירת-מחדל 443, אפסים-מובילים, טווח, ריק —
  _eq(safeHttpsUrl('https://a.b:443/x'), 'https://a.b/x');
  n++;
  _eq(safeHttpsUrl('https://a.b:08443/p'), 'https://a.b:8443/p');
  n++;
  _eq(safeHttpsUrl('https://a.b:65535/'), 'https://a.b:65535/');
  n++;
  _eq(safeHttpsUrl('https://a.b:65536/'), null);
  n++;
  _eq(safeHttpsUrl('https://a.b:/x'), 'https://a.b/x');
  n++;
  _eq(safeHttpsUrl('https://a.b:0/x'), 'https://a.b:0/x');
  n++;

  // — מקטעי-נקודה ו-encoding בנתיב/שאילתה/עוגן —
  _eq(safeHttpsUrl('https://a.b/../x/./y'), 'https://a.b/x/y');
  n++;
  _eq(safeHttpsUrl('https://a.b/x/..'), 'https://a.b/');
  n++;
  _eq(safeHttpsUrl('https://a.b/x/%2E%2e'), 'https://a.b/');
  n++;
  _eq(safeHttpsUrl('https://a.b//x'), 'https://a.b//x');
  n++;
  _eq(safeHttpsUrl('https://a.b/c d'), 'https://a.b/c%20d');
  n++;
  _eq(safeHttpsUrl('https://a.b/{x}?{y}#{z}'), 'https://a.b/%7Bx%7D?{y}#{z}');
  n++;
  _eq(safeHttpsUrl('https://a.b/%7bx%7d'), 'https://a.b/%7bx%7d');
  n++;
  _eq(safeHttpsUrl('https://a.b/^|'), 'https://a.b/^|');
  n++;
  _eq(safeHttpsUrl('https://a.b/c?a b'), 'https://a.b/c?a%20b');
  n++;
  _eq(safeHttpsUrl('https://a.b/?q="x"<y>'), 'https://a.b/?q=%22x%22%3Cy%3E');
  n++;
  _eq(safeHttpsUrl('https://a.b/?it\'s'), 'https://a.b/?it%27s');
  n++;
  _eq(safeHttpsUrl('https://a.b/פ'), 'https://a.b/%D7%A4');
  n++;
  _eq(safeHttpsUrl('https://a.b/?ש'), 'https://a.b/?%D7%A9');
  n++;
  _eq(safeHttpsUrl('https://a.b/#ש'), 'https://a.b/#%D7%A9');
  n++;
  _eq(safeHttpsUrl('https://a.b/c%zz'), 'https://a.b/c%zz');
  n++;
  _eq(safeHttpsUrl('https://a.b/c\td'), 'https://a.b/cd');
  n++;

  // — host: רישיות, tab/newline, נקודות, escapes —
  _eq(safeHttpsUrl('https://EXAMPLE.com:443/x'), 'https://example.com/x');
  n++;
  _eq(safeHttpsUrl('https://a\nb.c/'), 'https://ab.c/');
  n++;
  _eq(safeHttpsUrl('https://a.b./x'), 'https://a.b./x');
  n++;
  _eq(safeHttpsUrl('https://a..b/x'), 'https://a..b/x');
  n++;
  _eq(safeHttpsUrl('https://a_b.c/'), 'https://a_b.c/');
  n++;
  _eq(safeHttpsUrl('https://%41.com/'), 'https://a.com/');
  n++;
  _eq(safeHttpsUrl('https://a%3Ab.com/'), null);
  n++;
  _eq(safeHttpsUrl('https://%zz.com/'), null);
  n++;

  // — IPv4: נורמליזציה hex/octal, טווחים, נקודה-סופית —
  _eq(safeHttpsUrl('https://0x7f.1/'), 'https://127.0.0.1/');
  n++;
  _eq(safeHttpsUrl('https://192.168.1.256/'), null);
  n++;
  _eq(safeHttpsUrl('https://1.2.3.4./x'), 'https://1.2.3.4/x');
  n++;
  _eq(safeHttpsUrl('https://4294967295/'), 'https://255.255.255.255/');
  n++;
  _eq(safeHttpsUrl('https://0300.0.0.1/'), 'https://192.0.0.1/');
  n++;
  _eq(safeHttpsUrl('https://foo.0x7f/'), null);
  n++;

  // — IPv6: קנוניזציה, port, סוגר-חסר —
  _eq(safeHttpsUrl('https://[::1]:443/x'), 'https://[::1]/x');
  n++;
  _eq(safeHttpsUrl('https://[2001:DB8::FF00:42:8329]/x'), 'https://[2001:db8::ff00:42:8329]/x');
  n++;
  _eq(safeHttpsUrl('https://[::ffff:1.2.3.4]/'), 'https://[::ffff:102:304]/');
  n++;
  _eq(safeHttpsUrl('https://[::1'), null);
  n++;

  // — IDN: עברית/גרמנית, punycode, אימות-xn--, Bidi (התנהגות ada 2.9.2 של node) —
  _eq(safeHttpsUrl('https://münchen.de/'), 'https://xn--mnchen-3ya.de/');
  n++;
  _eq(safeHttpsUrl('https://MÜNCHEN.de/x'), 'https://xn--mnchen-3ya.de/x');
  n++;
  _eq(safeHttpsUrl('https://שלום.co.il/'), 'https://xn--9dbne9b.co.il/');
  n++;
  _eq(safeHttpsUrl('https://הצדקה-שלנו.co.il/'), 'https://xn----5hccbg5b2a7bkw.co.il/');
  n++;
  _eq(safeHttpsUrl('https://xn--mnchen-3ya.de/'), 'https://xn--mnchen-3ya.de/');
  n++;
  _eq(safeHttpsUrl('https://xn--x.y/'), null);
  n++;
  _eq(safeHttpsUrl('https://ΑΣ.gr/x'), 'https://xn--mxa0b.gr/x');
  n++;
  _eq(safeHttpsUrl('https://straße.de/x'), 'https://xn--strae-oqa.de/x');
  n++;
  _eq(safeHttpsUrl('https://ש!a.b/'), null);
  n++;
  _eq(safeHttpsUrl('https://aש.b/'), 'https://xn--a-gjc.b/');
  n++;
  _eq(safeHttpsUrl('https://1ש.a/'), 'https://xn--1-gjc.a/');
  n++;
  _eq(safeHttpsUrl('https://ש4٤.a/'), null);
  n++;

  // — userinfo: קידוד, @ כפול, ריק —
  _eq(safeHttpsUrl('https://user:p w@a.b/'), 'https://user:p%20w@a.b/');
  n++;
  _eq(safeHttpsUrl('https://a@b@c.d/'), 'https://a%40b@c.d/');
  n++;
  _eq(safeHttpsUrl('https://u@a.b/'), 'https://u@a.b/');
  n++;
  _eq(safeHttpsUrl('https://@a.b/'), 'https://a.b/');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(safeHttpsUrl('https://example.com') == 'https://example.com/', 'assert-live guard');

  print('OK safeHttpsUrl: $n asserts passed');
}
