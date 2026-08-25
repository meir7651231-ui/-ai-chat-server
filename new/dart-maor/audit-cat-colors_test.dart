/// רתמת-זהב · audit-cat-colors — Dart≡JS.
/// דוגמאות-החוזה = הצילום מ-new/atoms/audit-cat-colors.test.mjs (מקור-אמת).
/// אם עובר: מפת-הצבעים ב-Dart זהה ביט-אחר-ביט למקור-ה-JS (כולל סדר-מפתחות).
import 'audit-cat-colors.dart';

void main() {
  // הצילום מהמקור, כזוגות מסודרים (סדר-הכנסה = סדר-ה-JS).
  final expected = <List<dynamic>>[
    ['כפילות', ['#fdeaea', '#b91c1c']],
    ['ת"ז', ['#fdf1d4', '#9a6414']],
    ['טלפון', ['#e7edf5', '#3a5a86']],
    ['אימייל', ['#efe7f3', '#7c3aed']],
    ['כתובת', ['#eceae2', '#4d463c']],
    ['לוגיקה', ['#dff0ec', '#0f766e']],
    ['ילדים', ['#fbeef3', '#be185d']],
    ['קשר', ['#f6ead1', '#9a6414']],
  ];

  final actual = auditCatColors();
  final actualKeys = actual.keys.toList();

  // גודל וסדר-מפתחות זהים (JSON.stringify תלוי-סדר).
  assert(actualKeys.length == expected.length,
      'מספר-קטגוריות סטה: ${actualKeys.length} מול ${expected.length}');

  for (var i = 0; i < expected.length; i++) {
    final key = expected[i][0] as String;
    final vals = expected[i][1] as List<dynamic>;
    assert(actualKeys[i] == key, 'סדר-מפתח $i סטה: "${actualKeys[i]}" מול "$key"');
    final got = actual[key];
    assert(got != null, 'מפתח "$key" חסר');
    assert(got!.length == vals.length,
        'אורך-צבעים ל-"$key" סטה: ${got.length} מול ${vals.length}');
    for (var j = 0; j < vals.length; j++) {
      assert(got[j] == vals[j], 'צבע $j ל-"$key" סטה: "${got[j]}" מול "${vals[j]}"');
    }
  }

  print('✓ audit-cat-colors: רתמת-זהב עברה — Dart≡JS (8 קטגוריות, סדר+ערכים)');
}
