// בדיקת-חוזה (רתמת-זהב) · strongMatchForCharge — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את new/atoms/strong-match-for-charge.test.mjs — כל 6
// דוגמאות-החוזה, עם שקע-keysOf אמיתי-לפורמט-החוזה (מקומי לבדיקה, קידומת _):
//   ext:/id:/ph:/em: · נרמול-ספרות לטלפון/ת"ז · lowercase לאימייל · ריק ⇒ אין מפתח.
// המרה: השוואת-תוצאה ב-JS היא `!==` (רפרנס) ⇒ identical ב-Dart; ‏o.idNum || o.zeout
// (שרשור-falsy) ⇒ עוזר _or שמדלג על null/'' (ערכי-הבדיקה: מחרוזות לא-ריקות או חסר).
// הרצה: dart run --enable-asserts new/dart-maor/strong-match-for-charge_test.dart ⇒ OK
import 'strong-match-for-charge.dart';

// שרשור-falsy של JS ‏(a || b) לערכי-הבדיקה (מחרוזת/null): null או '' ⇒ b.
dynamic _or(dynamic a, dynamic b) => (a == null || a == '') ? b : a;

// שקע-keysOf — תרגום ישיר של השקע מבדיקת-ה-JS (שורות 5–16).
List<dynamic> _keysOf(dynamic o) {
  final ks = <dynamic>[];
  final ext = (_or(o['extId'], '') as String).trim();
  if (ext.isNotEmpty) ks.add('ext:$ext');
  final id =
      (_or(_or(o['idNum'], o['zeout']), '') as String).replaceAll(RegExp(r'\D'), '');
  if (id.isNotEmpty) ks.add('id:$id');
  final ph = (_or(o['phone'], '') as String).replaceAll(RegExp(r'\D'), '');
  if (ph.length >= 7) ks.add('ph:$ph');
  final em = (_or(o['email'], '') as String).trim().toLowerCase();
  if (em.isNotEmpty) ks.add('em:$em');
  return ks;
}

void _chk(String n, dynamic got, dynamic want) {
  // ‏JS: ‏got !== want ⇒ כישלון. ‏identical = המקבילה המדויקת (וגם null≡null).
  if (!identical(got, want)) {
    throw StateError('✗ $n: ${got is Map ? got['id'] : got} ≠ '
        '${want is Map ? want['id'] : want}');
  }
}

void main() {
  final a = {'id': 'A', 'extId': 'T1'};
  final b = {'id': 'B', 'phone': '0501234567'};
  final c = {'id': 'C', 'idNum': '123456789'};
  final d = {'id': 'D', 'email': 'a@b.co'};
  final e = {'id': 'E', 'email': 'a@b.co'};

  // 1. ext (5) גובר על ph (3)
  _chk('דוגמה-1',
      strongMatchForCharge({'toremId': 'T1', 'phone': '0501234567'}, [b, a], _keysOf), a);
  // 2. התאמת-טלפון דרך נרמול-השקע ('050-1234567' ⇒ '0501234567')
  _chk('דוגמה-2', strongMatchForCharge({'phone': '050-1234567'}, [a, b], _keysOf), b);
  // 3. zeout בעסקה מול idNum בכרטיס (ציון 4)
  _chk('דוגמה-3', strongMatchForCharge({'zeout': '123456789'}, [a, b, c], _keysOf), c);
  // 4. עסקה בלי אף-מפתח ⇒ null (יציאה מוקדמת)
  _chk('דוגמה-4', strongMatchForCharge(<String, dynamic>{}, [a, b, c], _keysOf), null);
  // 5. אין התאמה ⇒ null (בלי ניחוש)
  _chk('דוגמה-5',
      strongMatchForCharge({'email': 'x@y.com'}, [a, b, c], _keysOf), null);
  // 6. שוויון-ציון ⇒ הראשון ברשימה (score > best.score קפדני, לא ≥)
  _chk('דוגמה-6', strongMatchForCharge({'email': 'a@b.co'}, [d, e], _keysOf), d);

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      identical(
          strongMatchForCharge({'toremId': 'T1'}, [b, a], _keysOf), a),
      'assert-live guard');

  print('OK strongMatchForCharge: 6 דוגמאות-חוזה — ירוק');
}
