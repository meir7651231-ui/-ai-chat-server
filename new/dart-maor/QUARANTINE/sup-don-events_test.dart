// בדיקת-חוזה (רתמת-זהב) · supDonEvents — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-don-events.test.mjs
// (אותם קלטים→פלטים; דוגמאות-החוזה sup-don-events.contract.md הן אותן 7).
// השוואת-מערכים = אורך + איבר-איבר (כלל-8); ‏`rid === undefined` של JS מתורגם
// ל-`!containsKey('rid')` (חוק-2 — בשורת-hist המפתח אינו-קיים כלל, כמו במקור).
// כשל ⇒ StateError; ירוק ⇒ מדפיס OK.
// הרצה: dart run --enable-asserts new/dart-maor/sup-don-events_test.dart ⇒ exit 0
import 'sup-don-events.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

void main() {
  // 1) תרומה-עם-קבלה: cur חסר ⇒ '₪', src='קבלה R-N', rid נשמר
  {
    final r = supDonEvents({
      'donations': [
        {'date': '2026-01-05', 'amount': 100, 'rid': 'R-3'},
      ],
    });
    _ok(r.length == 1, 'תרומה יחידה ⇒ שורה אחת');
    _ok(r[0]['date'] == '2026-01-05' && r[0]['amount'] == 100,
        'תאריך וסכום עוברים כמות-שהם');
    _ok(r[0]['cur'] == '₪', "cur חסר ⇒ '₪'");
    _ok(r[0]['src'] == 'קבלה R-3' && r[0]['rid'] == 'R-3',
        "src='קבלה R-3' + rid");
  }
  // 2) hist עם clearer ⇒ "תרומה" + מטא-דאטת-סליקה מופרדת ' · '
  {
    final r = supDonEvents({
      'hist': [
        {
          'd': '2026-02-01',
          'a': 250,
          'c': '\$',
          'clearer': 'נדרים',
          'last4': '1234',
          'pays': 3,
        },
      ],
    });
    _ok(r.length == 1, 'שורת-hist אחת');
    _ok(r[0]['amount'] == 250 && r[0]['cur'] == '\$', 'סכום 250 ומטבע \$');
    _ok(r[0]['src'] == 'תרומה · •1234 · נדרים · 3 תשלומים',
        'clearer ⇒ תרומה + מטא בסדר-המקור: ' + r[0]['src'].toString());
    _ok(r[0]['date'] == '2026-02-01', 'תאריך שורת-hist עובר כמות-שהוא');
  }
  // 3) hist בלי clearer ובלי מטא ⇒ 'מהקובץ ההיסטורי', cur ברירת-מחדל ₪, בלי rid
  {
    final r = supDonEvents({
      'hist': [
        {'d': '2026-03-01', 'a': 80},
      ],
    });
    _ok(r[0]['src'] == 'מהקובץ ההיסטורי', 'בלי clearer ⇒ מהקובץ ההיסטורי');
    // ‏r[0].rid === undefined במקור: בשורת-hist המפתח 'rid' לא קיים כלל (חוק-2).
    _ok(r[0]['cur'] == '₪' && !r[0].containsKey('rid'),
        "c חסר ⇒ '₪'; אין rid");
  }
  // 4) אפס donations/hist + first/last ⇒ 2 שורות-אפס ממוינות מהחדש לישן
  {
    final r = supDonEvents({'first': '2025-01-01', 'last': '2025-06-01'});
    _ok(r.length == 2, 'first+last ⇒ 2 שורות');
    _ok(r[0]['date'] == '2025-06-01' && r[0]['src'] == 'תרומה אחרונה (מהקובץ)',
        'האחרונה ראשונה (מיון desc)');
    _ok(r[1]['date'] == '2025-01-01' && r[1]['src'] == 'תרומה ראשונה (מהקובץ)',
        'הראשונה שנייה');
    _ok(
        r[0]['amount'] == 0 &&
            r[0]['cur'] == '' &&
            r[1]['amount'] == 0 &&
            r[1]['cur'] == '',
        'סכום 0 ומטבע ריק');
  }
  // 5) first שתאריכו כבר מכוסה בתרומה ⇒ אין כפל-שורה
  {
    final r = supDonEvents({
      'donations': [
        {'date': '2025-01-01', 'amount': 10, 'rid': 'R-1'},
      ],
      'first': '2025-01-01',
    });
    _ok(r.length == 1 && r[0]['src'] == 'קבלה R-1',
        'תאריך-first שנראה כבר לא מוסיף שורה');
  }
  // 6) יש hist ⇒ שורות first/last לא נוצרות כלל
  {
    final r = supDonEvents({
      'hist': [
        {'d': '2026-02-01', 'a': 5},
      ],
      'first': '2020-01-01',
    });
    _ok(r.length == 1 && r[0]['src'] == 'מהקובץ ההיסטורי',
        'hist קיים ⇒ בלי שורות מהקובץ-first/last');
  }
  // 7) שקע-מונחים מוזרק + pays:1 לא מציג "תשלומים"
  {
    dynamic term(String k, String fb) => k == 'entity.donation' ? 'נדבה' : fb;
    final r = supDonEvents({
      'hist': [
        {'d': '2026-02-01', 'a': 250, 'clearer': 'נדרים', 'pays': 1},
      ],
    }, term);
    _ok(r.length == 1, 'שורת-hist אחת (שקע)');
    _ok(r[0]['src'] == 'נדבה · נדרים',
        'שקע-המונחים מחליף את התווית; pays=1 מושמט: ' + r[0]['src'].toString());
  }
  // כלל-8 — השוואת-מערך מלאה אורך+איבר-איבר על דוגמה-1 של החוזה (הפלט כולו):
  {
    final r = supDonEvents({
      'donations': [
        {'date': '2026-01-05', 'amount': 100, 'rid': 'R-3'},
      ],
    });
    final expected = <Map<String, dynamic>>[
      {
        'date': '2026-01-05',
        'amount': 100,
        'cur': '₪',
        'src': 'קבלה R-3',
        'rid': 'R-3',
      },
    ];
    _ok(r.length == expected.length, 'חוזה-1: אורך המערך');
    for (var i = 0; i < expected.length; i++) {
      _ok(r[i].length == expected[i].length,
          'חוזה-1: מספר-מפתחות בשורה ' + i.toString());
      for (final e in expected[i].entries) {
        _ok(r[i].containsKey(e.key) && r[i][e.key] == e.value,
            'חוזה-1: שורה ' + i.toString() + ' מפתח ' + e.key);
      }
    }
  }
  // ignore: avoid_print
  print('OK — sup-don-events: 7 דוגמאות-חוזה ≡ JS (termOf=שקע; מיון desc יציב)');
}
