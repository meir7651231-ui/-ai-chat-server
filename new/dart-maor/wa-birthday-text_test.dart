// בדיקת-חוזה · waBirthdayText — תרגום new/atoms/wa-birthday-text.test.mjs אחד-לאחד.
// ‏split('{k}').join(v) ≡ replaceAll (החלפה-גלובלית בלי regex).
// הרצה: dart run --enable-asserts ⇒ OK
import 'wa-birthday-text.dart';

const defs = {'wa.birthday': 'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, {org}'};

dynamic renderTemplate(dynamic cfg, String key, Map<String, dynamic> vars) {
  final def = defs[key] ?? '';
  final tpl = (cfg is Map) ? cfg['templates'] : null;
  final ovRaw = (tpl is Map) ? (tpl[key] ?? '') : '';
  var t = (ovRaw as String).trim();
  if (t.isEmpty) t = def;
  vars.forEach((k, v) {
    t = t.split('{$k}').join(v as String);
  });
  return t;
}

dynamic orgOf(dynamic orgName) {
  final s = (orgName as String).trim();
  return s.isEmpty ? 'העמותה' : s;
}

void main() {
  final cases = <List<dynamic>>[
    ['מאור החסד', 'שרה', null, 'מזל טוב לשרה ליום ההולדת! 🎂 באהבה, מאור החסד'],
    ['  ', 'דוד', null, 'מזל טוב לדוד ליום ההולדת! 🎂 באהבה, העמותה'],
    ['מאור', '', null, 'מזל טוב ל ליום ההולדת! 🎂 באהבה, מאור'],
    [
      'מאור', 'שרה',
      {'templates': {'wa.birthday': '{first} — מזל טוב מ{org} 🎈'}},
      'שרה — מזל טוב ממאור 🎈'
    ],
  ];
  for (final c in cases) {
    final g = waBirthdayText(c[0], c[1], c[2], renderTemplate, orgOf);
    if (g != c[3]) throw StateError('(${c[0]},${c[1]}) ⇒ $g ≠ ${c[3]}');
  }
  print('OK waBirthdayText: 4 asserts passed');
}
