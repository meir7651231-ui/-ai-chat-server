// 🥇 רתמת-זהב · findSupporterDupGroups — 6 דוגמאות-החוזה בדיוק כמו בבדיקת-ה-JS
// (new/atoms/find-supporter-dup-groups.test.mjs). אותם קלטים→פלטים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts find-supporter-dup-groups_test.dart  ⇒  exit 0.
import 'find-supporter-dup-groups.dart';

// שקעי-ייחוס כמוסכמת-maor (מקומיים לבדיקה — פורטו מילה-במילה מ-.test.mjs)
String normPhone(dynamic s) {
  var d = (s ?? '').toString().replaceAll(RegExp(r'\D'), '');
  if (RegExp(r'^(\d)\1+$').hasMatch(d)) return '';
  d = d.replaceFirst(RegExp(r'^00'), '');
  if (d.startsWith('972')) d = '0' + d.substring(3);
  return d.replaceFirst(RegExp(r'^0{2,}'), '0');
}

String normId(dynamic s) {
  final d = (s ?? '').toString().replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty || RegExp(r'^0+$').hasMatch(d)) return '';
  if (d.replaceFirst(RegExp(r'^0+'), '').length < 4) return '';
  return d.length >= 5 ? d : '';
}

String supNameCityKey(Map<String, dynamic> sp) {
  final n = (sp['name'] ?? '')
      .toString()
      .trim()
      .replaceAll(RegExp(r'\s+'), ' ')
      .toLowerCase();
  final c = (sp['city'] ?? '').toString().trim().toLowerCase();
  return (n.isNotEmpty && c.isNotEmpty) ? n + '|' + c : '';
}

String nameSortKey(dynamic t) {
  final parts = (t ?? '')
      .toString()
      .toLowerCase()
      .trim()
      .split(RegExp(r'\s+'))
      .where((s) => s.isNotEmpty)
      .toList();
  parts.sort();
  return parts.join(' ');
}

List<List<dynamic>> run(List<Map<String, dynamic>> sups) => findSupporterDupGroups(
      sups,
      normPhone: normPhone,
      normId: normId,
      supNameCityKey: supNameCityKey,
      nameSortKey: nameSortKey,
    );

// כל קבוצה ממוינת (סדר-בתוך-קבוצה לא מובטח) — כמו `sorted` בבדיקת-ה-JS.
List<List<String>> sortedGroups(List<List<dynamic>> gs) =>
    gs.map((g) => g.map((e) => e.toString()).toList()..sort()).toList();

void main() {
  // 1) טלפון מנורמל זהה ⇒ קבוצה אחת
  var g = run([
    {'id': 'a', 'phone': '050-1234567'},
    {'id': 'b', 'phone': '0501234567'},
  ]);
  assert(g.length == 1 && sortedGroups(g)[0].join(',') == 'a,b',
      'דוגמה 1: טלפון מנורמל לא קיבץ');

  // 2) טלפון <7 ספרות אינו מפתח
  g = run([
    {'id': 'a', 'phone': '123456'},
    {'id': 'b', 'phone': '123456'},
  ]);
  assert(g.isEmpty, 'דוגמה 2: טלפון קצר קיבץ בטעות');

  // 3) טרנזיטיביות: אימייל + ת"ז ⇒ קבוצה בגודל 3
  g = run([
    {'id': 'a', 'email': 'X@y.co'},
    {'id': 'b', 'email': 'x@y.co ', 'idNum': '123456782'},
    {'id': 'c', 'idNum': '123-456-782'},
  ]);
  assert(g.length == 1 && sortedGroups(g)[0].join(',') == 'a,b,c',
      'דוגמה 3: טרנזיטיביות נשברה');

  // 4) שם חסין-סדר (≥2 מילים)
  g = run([
    {'id': 'a', 'name': 'בן צבי רחל'},
    {'id': 'b', 'name': 'רחל בן צבי'},
  ]);
  assert(g.length == 1 && sortedGroups(g)[0].join(',') == 'a,b',
      'דוגמה 4: שם חסין-סדר לא קיבץ');

  // 5) שם-בודד (בלי רווח) אינו מפתח
  g = run([
    {'id': 'a', 'name': 'רחל'},
    {'id': 'b', 'name': 'רחל'},
  ]);
  assert(g.isEmpty, 'דוגמה 5: שם-בודד קיבץ בטעות');

  // 6) אין מפתח משותף ⇒ אין קבוצות (יחידים מוחרגים)
  g = run([
    {'id': 'a', 'phone': '0501111111', 'name': 'אהרן כהן'},
    {'id': 'b', 'phone': '0502222222', 'name': 'ברוך לוי'},
    {'id': 'c', 'phone': '0503333333', 'name': 'גד ישראלי'},
  ]);
  assert(g.isEmpty, 'דוגמה 6: נוצרה קבוצת-שווא');

  print('✓ find-supporter-dup-groups (Dart): 6 דוגמאות-חוזה — ירוק');
}
