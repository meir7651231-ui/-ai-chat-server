// בדיקת-חוזה (רתמת-זהב) · expFieldDefs — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/exp-field-defs.test.mjs
// (אותם קלטים→פלטים). שקעי-הבדיקה נאמנים למקור (config.ts / ayin.ts):
//   featureOn = cfg?.features?.[key] !== false   (חסר=פעיל · false=כבוי)
//   termOf    = cfg?.terms?.[key] || fb
//   featLabel = termOf(cfg,'nav.ayin','מעקב טיפול')
//   itemLabel = termOf(cfg,'entity.ayinItem','שם לטיפול')
//   unitLabel = termOf(cfg,'entity.ayinUnit','כמות')
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/exp-field-defs_test.dart  ⇒ exit 0
import 'exp-field-defs.dart';

// cfg = Map<String,dynamic>: 'features'→Map<String,bool>, 'terms'→Map<String,String>.
typedef Cfg = Map<String, dynamic>;

// --- שקעי-הבדיקה, נאמנים למקור ה-JS ---
bool _featureOn(Cfg cfg, String key) {
  final features = cfg['features'] as Map<String, bool>?;
  return features == null ? true : (features[key] != false);
}

String _termOf(Cfg cfg, String key, String fb) {
  final terms = cfg['terms'] as Map<String, String>?;
  final v = terms == null ? null : terms[key];
  // JS: (v) || fb — מחרוזת-ריקה גם היא נופלת ל-fb.
  return (v == null || v.isEmpty) ? fb : v;
}

String _featLabel(Cfg cfg) => _termOf(cfg, 'nav.ayin', 'מעקב טיפול');
String _itemLabel(Cfg cfg) => _termOf(cfg, 'entity.ayinItem', 'שם לטיפול');
String _unitLabel(Cfg cfg) => _termOf(cfg, 'entity.ayinUnit', 'כמות');

List<Map<String, String>> _call(Cfg cfg, String target) => expFieldDefs<Cfg>(
      cfg,
      target,
      _featureOn,
      _termOf,
      _featLabel,
      _itemLabel,
      _unitLabel,
    );

String _keys(List<Map<String, String>> a) => a.map((x) => x['key']).join(',');

int _f = 0;
int _n = 0;
void _ok(bool cond, String msg) {
  _n++;
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

void main() {
  // courses — מלא (חסר=פעיל):
  final cf = _call(<String, dynamic>{}, 'courses');
  _ok(cf.length == 14, 'courses מלא: ${cf.length} ≠ 14');
  _ok(cf[0]['key'] == 'name' && cf[0]['label'] == 'שם החוג', 'courses[0]: ${cf[0]}');
  _ok(cf[1]['label'] == 'מורה + טלפון', 'courses[1].label: ${cf[1]['label']}');
  _ok(cf[9]['key'] == 'studentsFull', 'courses[9].key: ${cf[9]['key']}');
  _ok(cf[13]['key'] == 'notes', 'courses[13].key: ${cf[13]['key']}');

  // courses — מקוצר:
  final cs = _call(<String, dynamic>{'features': <String, bool>{'reports.custom.full': false}}, 'courses');
  _ok(cs.length == 7, 'courses מקוצר: ${cs.length} ≠ 7');
  _ok(cs[0]['label'] == 'שם החוג', 'courses מקוצר [0].label');
  _ok(_keys(cs) == 'name,teacher,model,occ,students,pays,abs', 'courses מקוצר keys: ${_keys(cs)}');

  // events — תמיד 8:
  for (final cfg in <Cfg>[
    <String, dynamic>{},
    <String, dynamic>{'features': <String, bool>{'reports.custom.full': false}}
  ]) {
    final ev = _call(cfg, 'events');
    _ok(ev.length == 8 && _keys(ev) == 'title,type,hdate,gdate,time,fam,notes,done', 'events: ${_keys(ev)}');
    _ok(ev[5]['label'] == 'משפחה', 'events[5].label: ${ev[5]['label']}');
  }

  // supporters — מלא+ayin:
  final sa = _call(<String, dynamic>{}, 'supporters');
  _ok(sa.length == 17, 'supporters מלא+ayin: ${sa.length} ≠ 17');
  _ok(sa[9]['key'] == 'tier', 'supporters[9].key: ${sa[9]['key']}');
  _ok(sa.firstWhere((x) => x['key'] == 'stage')['label'] == 'שלב מעקב טיפול', 'stage.label');
  _ok(sa.firstWhere((x) => x['key'] == 'names')['label'] == 'שם לטיפול + כמות', 'names.label');
  _ok(sa[16]['key'] == 'notes', 'notes אחרון');

  // supporters — מלא בלי ayin:
  final sn = _call(<String, dynamic>{'features': <String, bool>{'supporters.ayin': false}}, 'supporters');
  _ok(sn.length == 11 && !sn.any((x) => x['key'] == 'stage'), 'supporters מלא בלי-ayin: ${sn.length}');

  // supporters — מקוצר:
  final sm = _call(<String, dynamic>{'features': <String, bool>{'reports.custom.full': false, 'supporters.ayin': false}}, 'supporters');
  _ok(sm.length == 4 && _keys(sm) == 'name,phone,email,dons', 'supporters מקוצר: ${_keys(sm)}');
  _ok(sm[3]['label'] == 'תרומות בטווח (מספר + סכום)', 'dons.label: ${sm[3]['label']}');

  final sma = _call(<String, dynamic>{'features': <String, bool>{'reports.custom.full': false}}, 'supporters');
  _ok(sma.length == 8 && _keys(sma) == 'name,phone,email,dons,stage,names,answers,next', 'supporters מקוצר+ayin: ${_keys(sma)}');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_keys(_call(<String, dynamic>{}, 'events')) == 'title,type,hdate,gdate,time,fam,notes,done', 'assert-live guard');

  if (_f != 0) {
    throw StateError('FAIL exp-field-defs: לפחות דוגמת-חוזה אחת נכשלה');
  }
  // ignore: avoid_print
  print('OK exp-field-defs: $_n asserts passed — כל דוגמאות-החוזה ירוק');
}
