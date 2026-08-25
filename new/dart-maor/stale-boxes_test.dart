import 'stale-boxes.dart';

/// רתמת-זהב: בדיוק דוגמאות-החוזה מ-new/atoms/stale-boxes.test.mjs
/// (חוזה: stale-boxes.contract.md, דוגמאות 1–6).

/// מימוש-השקע isoOf לבדיקה (כחוזה iso-local — ISO מקומי, בלי הזחת-אזור-זמן).
String _isoOf(DateTime d) {
  String p2(int n) => n.toString().padLeft(2, '0');
  return '${d.year}-${p2(d.month)}-${p2(d.day)}';
}

/// מימוש-השקע lastCollectionIso לבדיקה (כחוזה last-collection-iso —
/// המאוחר ב-collections, או '' כשאין; `c.date > last` ⇒ compareTo > 0).
String _lastCollectionIso(dynamic box) {
  var last = '';
  for (final c in (box['collections'] as List)) {
    if ((c['date'] as String).compareTo(last) > 0) last = c['date'] as String;
  }
  return last;
}

Map<String, dynamic> _box(
        String id, String status, String since, List<String> dates) =>
    {
      'id': id,
      'status': status,
      'since': since,
      'collections': [
        for (final date in dates) {'date': date, 'amount': 10}
      ],
    };

void main() {
  var f = 0;
  // השוואת-מערכים לפי כלל-8: אורך + איבר-איבר (לעולם לא join).
  void eq(List<dynamic> a, List<dynamic> b, String msg) {
    var bad = a.length != b.length;
    if (!bad) {
      for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) bad = true;
      }
    }
    if (bad) {
      print('✗ $msg ⇒ $a ≠ $b');
      f = 1;
    }
  }

  const today = '2026-08-24'; // קו-חיתוך ל-90 יום: 2026-05-26
  List<dynamic> ids(dynamic bs) =>
      [for (final b in (bs as List)) b['id']];

  // 1) בדיוק 90 יום ⇒ ישנה (גבול כולל) · 2) 89 יום ⇒ לא
  final a = _box('a', 'home', '2026-01-01', ['2026-05-26']);
  final b = _box('b', 'home', '2026-01-01', ['2026-05-27']);
  // 3) בלי ריקונים ⇒ נפילה ל-since
  final c = _box('c', 'home', '2026-01-01', []);
  // 4) ישנה אבל 'lost' ⇒ מוחרגת
  final d = _box('d', 'lost', '2026-01-01', ['2026-02-01']);
  // 5) בלי ריקונים ובלי since ⇒ מוחרגת
  final e = _box('e', 'home', '', []);

  eq(ids(staleBoxes([a, b, c, d, e], today, 90, _isoOf, _lastCollectionIso)),
      ['a', 'c'], 'סינון-90-יום שגוי (דוגמאות 1-5)');

  // 6) days=30 ⇒ קו-חיתוך 2026-07-25
  final g = _box('g', 'home', '2026-01-01', ['2026-07-25']);
  final h = _box('h', 'home', '2026-01-01', ['2026-07-26']);
  eq(ids(staleBoxes([g, h], today, 30, _isoOf, _lastCollectionIso)),
      ['g'], 'סף-days מותאם (30) שגוי');

  if (f != 0) throw StateError('stale-boxes: סטייה מהמקור');
  print('✓ stale-boxes: 6 דוגמאות-חוזה — ירוק');
  print('OK');
}
