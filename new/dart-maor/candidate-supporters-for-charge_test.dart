// gold-test · candidateSupportersForCharge — 6 דוגמאות-חוזה (מ-.test.mjs) + מבחן-יציבות (הסגר).
// חוק-1: אטום לא-מייבא — העוזרים keysOf/nameSortKey הם שקעי-הבדיקה (תואמי-חוזה), inline.
import 'candidate-supporters-for-charge.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

// שקעים-מדומים תואמי-חוזה (מ-.test.mjs).
List<String> keysOf(Map<String, Object?> o) {
  final ks = <String>[];
  final ext = o['extId'];
  if (ext != null && ext != false && ext != '' && ext != 0) {
    ks.add('ext:' + ext.toString().trim());
  }
  final id = (o['idNum'] != null && o['idNum'] != '' && o['idNum'] != false)
      ? o['idNum']
      : o['zeout'];
  if (id != null && id != false && id != '' && id != 0) {
    ks.add('id:' + id.toString().trim());
  }
  final phone = o['phone'];
  if (phone != null && phone != false && phone != '') {
    ks.add('ph:' + phone.toString().trim());
  }
  final email = o['email'];
  if (email != null && email != false && email != '') {
    ks.add('em:' + email.toString().trim().toLowerCase());
  }
  return ks;
}

String nameSortKey(Object? t) {
  final s = (t ?? '').toString().trim().toLowerCase();
  final parts = s.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
  parts.sort();
  return parts.join(' ');
}

List<Map<String, Object?>> run(
  Map<String, Object?> charge,
  List<Map<String, Object?>> sps, {
  int limit = 8,
}) =>
    candidateSupportersForCharge(charge, sps, keysOf, nameSortKey, limit: limit);

void main() {
  // 1) מפתח-חזק ext — בדיוק התואם
  final a = <String, Object?>{'extId': 'T1'};
  final b = <String, Object?>{'extId': 'T9'};
  var got = run({'toremId': 'T1'}, [a, b]);
  ok(got.length == 1 && identical(got[0], a), 'ext לא בורר בדיוק את התואם');

  // 2) דירוג ext(5) → ph(3) → em(2) → שם(1)
  final spName = <String, Object?>{'name': 'כהן ישראל'};
  final spEm = <String, Object?>{'email': 'X@Y.com'};
  final spPh = <String, Object?>{'phone': '0501234567'};
  final spExt = <String, Object?>{'extId': 'T1'};
  got = run(
    {
      'toremId': 'T1',
      'phone': '0501234567',
      'email': 'x@y.com',
      'name': 'ישראל כהן'
    },
    [spName, spEm, spPh, spExt],
  );
  ok(
      got.length == 4 &&
          identical(got[0], spExt) &&
          identical(got[1], spPh) &&
          identical(got[2], spEm) &&
          identical(got[3], spName),
      'סדר-הדירוג שגוי');

  // 3) שם חד-מילתי — לא מועמד
  ok(
      run({'name': 'ישראל'}, [
        {'name': 'ישראל'}
      ]).isEmpty,
      'שם חד-מילתי עבר');

  // 4) שם דו-מילתי חסין-סדר
  final rev = <String, Object?>{'name': 'ישראל כהן'};
  got = run({'name': 'כהן ישראל'}, [rev]);
  ok(got.length == 1 && identical(got[0], rev), 'שם הפוך-סדר לא נמצא');

  // 5) limit נאכף
  got = run({'toremId': 'T1'}, [
    {'extId': 'T1'},
    {'extId': 'T1'},
    {'extId': 'T1'}
  ], limit: 2);
  ok(got.length == 2, 'limit=2 לא נאכף');

  // 6) אפס התאמה
  ok(
      run({'toremId': 'T1', 'name': 'משה לוי'}, [
        {'extId': 'T2', 'name': 'דוד כץ'}
      ]).isEmpty,
      'אי-התאמה ≠ []');

  // 7) 🔧 יציבות ≥32 — כל התומכים באותו ציון (ext:T1); הבורר חייב להיות סדר-ההוספה.
  //    בלי decorate, Dart quicksort ל-≥32 היה מחזיר קבוצה שונה.
  final many = <Map<String, Object?>>[];
  for (var i = 0; i < 40; i++) {
    many.add({'extId': 'T1', 'tag': i});
  }
  got = run({'toremId': 'T1'}, many, limit: 8);
  ok(got.length == 8, 'יציבות: limit=8 לא נאכף על 40');
  var stable = true;
  for (var i = 0; i < 8; i++) {
    if (got[i]['tag'] != i) stable = false;
  }
  ok(stable, 'יציבות: שוויון-ציון ב-≥32 לא שמר סדר-הוספה (מיון-לא-יציב)');

  if (_f != 0) throw StateError('gold-test נכשל');
  print('✓ candidate-supporters-for-charge: 6 דוגמאות-חוזה + יציבות — ירוק');
}
