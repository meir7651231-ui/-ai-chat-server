import 'filter-ayin-board.dart';

// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/filter-ayin-board.test.mjs.
// שקע normSearch נאמן-למקור (validate.ts:51) — מומר ל-Dart ביט-אחר-ביט.
String normSearch(dynamic t) {
  final falsy = t == null || t == false || t == 0 || t == '';
  var s = falsy ? '' : t.toString();
  s = s.toLowerCase();
  s = s.replaceAll(RegExp('[֑-ׇ]'), ''); // ניקוד עברי
  const fin = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};
  s = s.replaceAllMapped(RegExp('[ךםןףץ]'), (m) => fin[m[0]]!); // סופיות
  s = s.replaceAll(RegExp('[\'"׳״\\-–._]'), ''); // גרש/מקף/נקודה
  return s.trim();
}

List<Map<String, dynamic>> mkItems() => [
      {
        'supporter': 'רבקה כהן',
        'name': 'עיניים',
        'note': 'טלפון דחוף',
        'done': false,
        'stage': 'call'
      },
      {
        'supporter': 'שרה לוי',
        'name': 'ברכה',
        'note': '',
        'done': true,
        'stage': 'visit'
      },
      {
        'supporter': 'לאה',
        'name': 'עיניים',
        'note': '',
        'done': false,
        'stage': 'visit'
      },
    ];

List<String> sup(List<Map<String, dynamic>> rows) =>
    rows.map((r) => r['supporter'] as String).toList();

// השוואת-מערך איבר-איבר (DART-PORTING-RULES §8 — לא join).
bool listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var f = 0;
  void check(String name, bool ok) {
    if (!ok) {
      print('✗ $name');
      f = 1;
    }
  }

  final items = mkItems();

  check(
      'דוגמה 1 · wait',
      listEq(sup(filterAyinBoard(items, '', 'wait', null, normSearch)),
          ['רבקה כהן', 'לאה']));
  check(
      'דוגמה 2 · done',
      listEq(sup(filterAyinBoard(items, '', 'done', null, normSearch)),
          ['שרה לוי']));
  check(
      'דוגמה 3 · stage=visit',
      listEq(sup(filterAyinBoard(items, '', null, 'visit', normSearch)),
          ['שרה לוי', 'לאה']));
  check('דוגמה 4 · הכול-פתוח',
      filterAyinBoard(items, '', null, null, normSearch).length == 3);
  check(
      'דוגמה 5 · סופיות מנורמלות',
      listEq(sup(filterAyinBoard(items, 'טלפונ', null, null, normSearch)),
          ['רבקה כהן']));
  check(
      'דוגמה 6 · שילוב wait+visit',
      listEq(sup(filterAyinBoard(items, '', 'wait', 'visit', normSearch)),
          ['לאה']));
  check('הקלט לא השתנה', items.length == 3);

  if (f != 0) throw StateError('filter-ayin-board: סטייה מהמקור');
  print('✓ filter-ayin-board: 6 דוגמאות-חוזה — ירוק');
}
