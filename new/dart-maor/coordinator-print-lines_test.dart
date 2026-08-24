import 'coordinator-print-lines.dart';

/// רתמת-זהב: אותן 3 דוגמאות-חוזה (8 בדיקות) בדיוק מ-new/atoms/coordinator-print-lines.test.mjs.
/// אם עובר — Dart ≡ JS.

// שקעים חוזיים (מדמים את שכני-המקור, מומרים מ-JS):
String termOf(Map<String, dynamic> config, String key, String fb) {
  final terms = config['terms'];
  if (terms is Map && terms[key] != null) return terms[key].toString();
  return fb;
}

List<dynamic> coordinatorBoxes(dynamic boxes, String coordId) =>
    (boxes as List).where((b) => (b as Map)['coordinatorId'] == coordId).toList();

String lastCollectionIso(dynamic box) {
  var last = '';
  for (final c in (box as Map)['collections'] as List) {
    final d = (c as Map)['date'] as String;
    if (d.compareTo(last) > 0) last = d; // c.date > last (השוואה לקסיקוגרפית = כרונולוגית ל-ISO)
  }
  return last;
}

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ ' + msg);
      f = 1;
    }
  }

  final db = <String, dynamic>{
    'tzCoordinators': [
      {'id': 'c1', 'name': 'רחל'},
    ],
    'families': [
      {'id': 'f1', 'name': 'לוי', 'address': 'הרצל 3', 'city': 'צפת', 'phone': '050-1'},
    ],
    'tzBoxes': [
      {'id': 'b1', 'num': 7, 'coordinatorId': 'c1', 'status': 'home', 'famId': 'f1', 'collections': [{'date': '2026-05-01'}, {'date': '2026-06-15'}]},
      {'id': 'b2', 'num': 9, 'coordinatorId': 'c1', 'status': 'office', 'famId': '', 'collections': []},
      {'id': 'b3', 'num': 11, 'coordinatorId': 'c1', 'status': 'lost', 'famId': '', 'collections': []},
      {'id': 'b4', 'num': 12, 'coordinatorId': 'c2', 'status': 'home', 'famId': 'f1', 'collections': []},
    ],
  };

  // 1) בלי config — נוסח היסטורי
  final r1 = coordinatorPrintLines(db, 'c1', null, termOf, coordinatorBoxes, lastCollectionIso);
  ok(r1.length == 4, '1: מספר-שורות ≠ 4 (קיבלנו ' + r1.length.toString() + ')');
  ok(r1[0] == 'רשימת קופות — רחל', '1: כותרת שגויה: "' + r1[0] + '"');
  ok(r1[1] == '=' * 30, '1: קו-מפריד ≠ 30×"="');
  ok(r1[2] == '#7 · משפחת לוי · הרצל 3, צפת · 050-1 · ריקון אחרון: 2026-06-15', '1: שורת-#7 שגויה: "' + r1[2] + '"');
  ok(r1[3] == '#9 · במשרד · טרם רוקנה', '1: שורת-#9 שגויה: "' + r1[3] + '"');

  // 2) עם config — דריסת-מונח
  final cfg = <String, dynamic>{'terms': {'entity.familyOf': 'בית'}};
  final r2 = coordinatorPrintLines(db, 'c1', cfg, termOf, coordinatorBoxes, lastCollectionIso);
  ok(r2[2].startsWith('#7 · בית לוי · '), '2: דריסת-מונח לא כובדה: "' + r2[2] + '"');

  // 3) רכז לא-מוכר
  final r3 = coordinatorPrintLines(db, 'cX', null, termOf, coordinatorBoxes, lastCollectionIso);
  ok(r3.length == 3 && r3[0] == 'רשימת קופות — ' && r3[2] == 'אין קופות פעילות', '3: מקרה-רכז-לא-מוכר שגוי');

  if (f != 0) throw StateError('coordinator-print-lines: סטייה מהמקור');
  print('✓ coordinator-print-lines: 3 דוגמאות-חוזה (8 בדיקות) — ירוק');
}
