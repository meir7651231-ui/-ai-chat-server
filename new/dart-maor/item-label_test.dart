import 'item-label.dart';

/// רתמת-זהב: אותן 3 דוגמאות-חוזה בדיוק מ-new/atoms/item-label.test.mjs.
/// אם עובר — Dart ≡ JS.
void main() {
  var f = 0;

  // 1) מונח-ארגון גובר: השקע מחזיר מונח ⇒ הוא הפלט.
  {
    final g = itemLabel(<String, dynamic>{}, (c, k, fb) => 'פרויקט');
    if (g != 'פרויקט') {
      print('✗ מונח-הארגון לא גבר ⇒ "$g"');
      f = 1;
    }
  }

  // 2) נפילה לברירת-המחדל: cfg.terms?[k] ?? fb.
  String termOf(Map<String, dynamic> c, String k, String fb) {
    final terms = c['terms'];
    if (terms is Map) {
      final v = terms[k];
      if (v != null) return v as String;
    }
    return fb;
  }
  {
    final g = itemLabel(<String, dynamic>{}, termOf);
    if (g != 'שם לטיפול') {
      print('✗ ברירת-המחדל שגויה ⇒ "$g"');
      f = 1;
    }
  }

  // 3) השקע נקרא פעם אחת עם (cfg, 'entity.ayinItem', 'שם לטיפול'), cfg זהה-בזהות.
  {
    final cfg = <String, dynamic>{'tag': 'cfg'};
    var calls = 0;
    List<dynamic>? got;
    itemLabel(cfg, (c, k, fb) {
      calls++;
      got = [c, k, fb];
      return 'x';
    });
    if (calls != 1 ||
        !identical(got![0], cfg) ||
        got![1] != 'entity.ayinItem' ||
        got![2] != 'שם לטיפול') {
      print('✗ קריאת-השקע שגויה ⇒ $got');
      f = 1;
    }
  }

  if (f != 0) throw StateError('item-label: סטייה מהמקור');
  print('✓ item-label: 3 דוגמאות-חוזה — ירוק');
}
