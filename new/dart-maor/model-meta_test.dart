// בדיקת-חוזה ל-modelMeta — משקפת את new/atoms/model-meta.test.mjs + ratchet-הסגר.
// הרצה: dart run --enable-asserts model-meta_test.dart
import 'model-meta.dart';

int _f = 0;
void chk(String name, bool cond) {
  if (!cond) {
    _f = 1;
    // ignore: avoid_print
    print('✗ ' + name);
  }
}

bool eqMap(Map<String, dynamic> a, Map<String, dynamic> b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k) || a[k] != b[k]) return false;
  }
  return true;
}

void main() {
  // ── 6 דוגמאות-החוזה מהמקור ──
  chk('1 punch size=10', eqMap(modelMeta({'model': 'punch', 'size': 10}),
      {'label': 'כרטיסייה · 10 ניקובים', 'bg': '#fdf1d4', 'c': '#9a6414'}));

  chk('2 half_year', eqMap(modelMeta({'model': 'half_year'}),
      {'label': 'מנוי חצי-שנתי', 'bg': '#e7edf5', 'c': '#3a5a86'}));

  chk('3 year', eqMap(modelMeta({'model': 'year'}),
      {'label': 'מנוי שנתי', 'bg': '#efe7f3', 'c': '#7c3aed'}));

  chk('4 monthly ברירת-מחדל', eqMap(modelMeta({'model': 'monthly'}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'}));

  chk('5 model חסר ⇒ חודשי', eqMap(modelMeta({'model': null}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'}));

  chk('6 punch size=1',
      modelMeta({'model': 'punch', 'size': 1})['label'] == 'כרטיסייה · 1 ניקובים');

  // ── ratchet-הסגר (FIXES.md · כלל-12 · רוויית-int64) ──
  // באג-המקור: truncate() ריווה דאבל שלם גדול ל-int64-max.
  // 1e21 ⇒ JS "1e+21" (לא "9223372036854775807").
  chk('R1 punch size=1e21 ⇒ 1e+21',
      modelMeta({'model': 'punch', 'size': 1e21})['label'] == 'כרטיסייה · 1e+21 ניקובים');
  // 1e19 ⇒ JS עשרוני-מלא (מיוצג-מדויק, לא רווי).
  chk('R2 punch size=1e19 ⇒ עשרוני-מלא',
      modelMeta({'model': 'punch', 'size': 1e19})['label'] == 'כרטיסייה · 10000000000000000000 ניקובים');
  // חוק-2: size חסר ⇒ 'undefined' (לא 'null').
  chk('R3 punch size חסר ⇒ undefined',
      modelMeta({'model': 'punch'})['label'] == 'כרטיסייה · undefined ניקובים');
  // חוק-2: size null מפורש ⇒ 'null'.
  chk('R4 punch size=null ⇒ null',
      modelMeta({'model': 'punch', 'size': null})['label'] == 'כרטיסייה · null ניקובים');
  // דאבל שלם-ערך 10.0 ⇒ '10' (בלי ".0"), כמו JS.
  chk('R5 punch size=10.0 ⇒ 10',
      modelMeta({'model': 'punch', 'size': 10.0})['label'] == 'כרטיסייה · 10 ניקובים');
  // דאבל שברי 2.5 ⇒ '2.5'.
  chk('R6 punch size=2.5 ⇒ 2.5',
      modelMeta({'model': 'punch', 'size': 2.5})['label'] == 'כרטיסייה · 2.5 ניקובים');
  // model לא-מוכר (מחרוזת) ⇒ חודשי.
  chk('R7 model לא-מוכר ⇒ חודשי', eqMap(modelMeta({'model': 'weird'}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'}));
  // model מספרי (לא-מחרוזת-זהה) ⇒ חודשי (== קפדני).
  chk('R8 model מספרי ⇒ חודשי', eqMap(modelMeta({'model': 0}),
      {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'}));

  if (_f != 0) {
    // ignore: avoid_print
    print('FAIL');
    throw StateError('model-meta tests failed');
  }
  // ignore: avoid_print
  print('✓ model-meta: 6 חוזה + 8 ratchet — ירוק');
}
