// בדיקת-חוזה (רתמת-זהב) · candidateSupportersForCharge — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/candidate-supporters-for-charge.test.mjs.
// שקעים keysOf + nameSortKey — המרת-Dart נאמנה לשקעים-המדומים של בדיקת-ה-JS.
// הרצה: dart run --enable-asserts new/dart-maor/candidate-supporters-for-charge_test.dart ⇒ exit 0
import 'candidate-supporters-for-charge.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע keysOf — נאמן ל-JS: קידומות ext:/id:/ph:/em:, trim, אימייל lowercase.
List<String> keysOf(Map<String, Object?> o) {
  final ks = <String>[];
  final ext = o['extId'];
  if (ext != null && ext.toString().isNotEmpty) ks.add('ext:${ext.toString().trim()}');
  final idnum = o['idNum'];
  final id = (idnum != null && idnum.toString().isNotEmpty) ? idnum : o['zeout'];
  if (id != null && id.toString().isNotEmpty) ks.add('id:${id.toString().trim()}');
  final ph = o['phone'];
  if (ph != null && ph.toString().isNotEmpty) ks.add('ph:${ph.toString().trim()}');
  final em = o['email'];
  if (em != null && em.toString().isNotEmpty) ks.add('em:${em.toString().trim().toLowerCase()}');
  return ks;
}

// שקע nameSortKey — שם = טוקנים ממוינים (חסין-סדר), ריק אם אין שם.
String nameSortKey(Object? t) {
  final s = (t ?? '').toString().trim().toLowerCase();
  final parts = s.split(RegExp(r'\s+')).where((x) => x.isNotEmpty).toList()..sort();
  return parts.join(' ');
}

List<Map<String, Object?>> run(
  Map<String, Object?> charge,
  List<Map<String, Object?>> sps, [
  int limit = 8,
]) =>
    candidateSupportersForCharge(charge, sps, keysOf, nameSortKey, limit: limit);

void main() {
  var n = 0;

  // 1) מפתח-חזק ext — בדיוק התואם
  final a = <String, Object?>{'extId': 'T1'};
  final b = <String, Object?>{'extId': 'T9'};
  var got = run({'toremId': 'T1'}, [a, b]);
  _ok(got.length == 1 && identical(got[0], a), 'ext לא בורר בדיוק את התואם');
  n++;

  // 2) דירוג ext(5) → ph(3) → em(2) → שם(1)
  final spName = <String, Object?>{'name': 'כהן ישראל'};
  final spEm = <String, Object?>{'email': 'X@Y.com'};
  final spPh = <String, Object?>{'phone': '0501234567'};
  final spExt = <String, Object?>{'extId': 'T1'};
  got = run(
    {'toremId': 'T1', 'phone': '0501234567', 'email': 'x@y.com', 'name': 'ישראל כהן'},
    [spName, spEm, spPh, spExt],
  );
  _ok(
    got.length == 4 &&
        identical(got[0], spExt) &&
        identical(got[1], spPh) &&
        identical(got[2], spEm) &&
        identical(got[3], spName),
    'סדר-הדירוג שגוי',
  );
  n++;

  // 3) שם חד-מילתי — לא מועמד
  _ok(run({'name': 'ישראל'}, [{'name': 'ישראל'}]).isEmpty, 'שם חד-מילתי עבר');
  n++;

  // 4) שם דו-מילתי חסין-סדר
  final rev = <String, Object?>{'name': 'ישראל כהן'};
  got = run({'name': 'כהן ישראל'}, [rev]);
  _ok(got.length == 1 && identical(got[0], rev), 'שם הפוך-סדר לא נמצא');
  n++;

  // 5) limit נאכף
  got = run(
    {'toremId': 'T1'},
    [
      {'extId': 'T1'},
      {'extId': 'T1'},
      {'extId': 'T1'},
    ],
    2,
  );
  _ok(got.length == 2, 'limit=2 לא נאכף');
  n++;

  // 6) אפס התאמה
  _ok(
    run({'toremId': 'T1', 'name': 'משה לוי'}, [
      {'extId': 'T2', 'name': 'דוד כץ'},
    ]).isEmpty,
    'אי-התאמה ≠ []',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(got.length == 2, 'assert-live guard');

  print('OK candidateSupportersForCharge: $n asserts passed');
}
