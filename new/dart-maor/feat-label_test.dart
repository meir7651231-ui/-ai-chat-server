// רתמת-זהב · feat-label — assert-ים = בדיוק דוגמאות-החוזה של בדיקת-ה-JS (feat-label.test.mjs).
// אם עובר, Dart ≡ JS.
import 'feat-label.dart';

void main() {
  // 1) מונח-ארגון גובר — termOf מתעלם מהארגומנטים ומחזיר 'פרויקטים'.
  assert(
    featLabel(<String, Object?>{}, (c, k, fb) => 'פרויקטים') == 'פרויקטים',
    '✗ מונח-הארגון לא גבר',
  );

  // 2) נפילה לברירת-המחדל — termOf = (c,k,fb) => c.terms?.[k] ?? fb, cfg={} ⇒ 'מעקב טיפול'.
  String termOf(Object? c, String k, String fb) {
    final terms = (c as Map)['terms'];
    final v = terms is Map ? terms[k] : null;
    return (v as String?) ?? fb;
  }

  assert(
    featLabel(<String, Object?>{}, termOf) == 'מעקב טיפול',
    '✗ ברירת-המחדל שגויה',
  );

  // 3) השקע נקרא בדיוק פעם אחת עם (cfg, 'nav.ayin', 'מעקב טיפול') — אותו אובייקט-cfg כלשונו.
  final cfg = <String, Object?>{'tag': 'cfg'};
  var calls = 0;
  List<Object?>? got;
  featLabel(cfg, (c, k, fb) {
    calls++;
    got = [c, k, fb];
    return 'x';
  });
  assert(
    calls == 1 &&
        identical(got![0], cfg) &&
        got![1] == 'nav.ayin' &&
        got![2] == 'מעקב טיפול',
    '✗ קריאת-השקע שגויה ⇒ ${got}',
  );

  print('✓ feat-label (Dart): 3 דוגמאות-חוזה — ירוק');
}
