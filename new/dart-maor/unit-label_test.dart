import '../dart-data-maor/unit-label-sockets.dart' as sk_unit_label;
// בדיקת-חוזה · unitLabel — מתרגמת את new/atoms/unit-label.test.mjs אחד-לאחד.
// הרצה: dart run --enable-asserts new/dart-maor/unit-label_test.dart ⇒ OK
import 'unit-label.dart';

void main() {
  // 1) מונח-הארגון גובר
  if (unitLabel(<String, dynamic>{}, (c, k, fb) => 'שעות', sk_unit_label.unitLabel_T) != 'שעות') {
    throw StateError('מונח-הארגון לא גבר');
  }

  // 2) נפילה לברירת-המחדל (termOf אמיתי: terms[k] ?? fb)
  dynamic termOf(dynamic c, String k, String fb) {
    final t = (c is Map) ? c['terms'] : null;
    final v = (t is Map) ? t[k] : null;
    return v ?? fb;
  }
  if (unitLabel(<String, dynamic>{}, termOf, sk_unit_label.unitLabel_T) != 'כמות') {
    throw StateError('ברירת-המחדל שגויה');
  }

  // 3) השקע נקרא פעם-אחת עם (cfg, 'entity.ayinUnit', 'כמות') — זהות-רפרנס
  final cfg = <String, dynamic>{'tag': 'cfg'};
  var calls = 0;
  List<dynamic>? got;
  unitLabel(cfg, (c, k, fb) {
    calls++;
    got = [c, k, fb];
    return 'x';
  }, sk_unit_label.unitLabel_T);
  if (calls != 1 ||
      !identical(got![0], cfg) ||
      got![1] != 'entity.ayinUnit' ||
      got![2] != 'כמות') {
    throw StateError('קריאת-השקע שגויה ⇒ $got');
  }

  print('OK unitLabel: 3 asserts passed');
}
