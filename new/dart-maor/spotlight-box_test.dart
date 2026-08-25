// בדיקת-חוזה (רתמת-זהב) · spotlightBox — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/spotlight-box.test.mjs
// (5 הדוגמאות המחייבות של spotlight-box.contract.md — אותן דוגמאות בדיוק).
// השוואת-מבנה = מספר-מפתחות + סדר-מפתחות + ערך-ערך (רוח כלל-8: לעולם לא join/stringify).
// הרצה: dart run --enable-asserts new/dart-maor/spotlight-box_test.dart  ⇒ exit 0
import 'spotlight-box.dart';

void _fail(String label, String detail) {
  throw StateError('FAIL [$label]: $detail');
}

/// השוואת-קופסה: null↔null, או Map עם בדיוק המפתחות left/top/width/height
/// באותו סדר-הכנסה (JSON.stringify של JS רגיש-סדר) ובערכים מספריים שווים.
void _eqBox(dynamic got, Map<String, num>? want, String label) {
  if (want == null) {
    if (got != null) _fail(label, 'got=$got want=null');
    return;
  }
  if (got is! Map) _fail(label, 'got=$got (not a Map) want=$want');
  final m = got as Map;
  if (m.length != want.length) {
    _fail(label, 'key-count ${m.length} != ${want.length} (got=$m)');
  }
  const order = ['left', 'top', 'width', 'height'];
  final keys = m.keys.toList();
  for (var i = 0; i < order.length; i++) {
    if (keys[i] != order[i]) {
      _fail(label, 'key-order $keys != $order');
    }
    final g = m[order[i]];
    final w = want[order[i]]!;
    if (g is! num || g.isNaN || g != w) {
      _fail(label, "key '${order[i]}': got=$g want=$w (full got=$m)");
    }
  }
}

void main() {
  var n = 0;

  // 1) ריפוד 10 לכל כיוון
  _eqBox(
    spotlightBox({'left': 100, 'top': 50, 'width': 200, 'height': 80}, 1000, 600),
    {'left': 90, 'top': 40, 'width': 220, 'height': 100},
    'ריפוד בסיסי שגוי',
  );
  n++;

  // 2) צמוד-לפינה — left/top לא יורדים מ-0
  _eqBox(
    spotlightBox({'left': 5, 'top': 3, 'width': 50, 'height': 40}, 1000, 600),
    {'left': 0, 'top': 0, 'width': 70, 'height': 60},
    'הצמדה לפינה שגויה',
  );
  n++;

  // 3) גולש מהקצה — נחתך לגבול ה-viewport
  _eqBox(
    spotlightBox({'left': 950, 'top': 580, 'width': 60, 'height': 40}, 1000, 600),
    {'left': 940, 'top': 570, 'width': 60, 'height': 30},
    'חיתוך לגבול שגוי',
  );
  n++;

  // 4) מלבן חסר / מידות 0 ⇒ null
  _eqBox(spotlightBox(null, 1000, 600), null, 'null לא החזיר null');
  n++;
  _eqBox(
    spotlightBox({'left': 10, 'top': 10, 'width': 0, 'height': 40}, 1000, 600),
    null,
    'רוחב-0 לא החזיר null',
  );
  n++;

  // 5) pad=0 ⇒ ביט-זהה
  _eqBox(
    spotlightBox({'left': 20, 'top': 30, 'width': 40, 'height': 50}, 1000, 600, 0),
    {'left': 20, 'top': 30, 'width': 40, 'height': 50},
    'pad=0 שינה את המלבן',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(spotlightBox(null, 1, 1) == null, 'assert-live guard');

  print('OK spotlightBox: $n contract examples passed');
}
