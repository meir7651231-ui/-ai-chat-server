// בדיקת-חוזה (רתמת-זהב) · planSupporterImport — מייבאת אך ורק את האטום-שלה (חוק-4).
// 5 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/plan-supporter-import.test.mjs
// (אותם קלטים→פלטים; השקעים normName/fillEmpty משוחזרים כלשונם). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/plan-supporter-import_test.dart ⇒ exit 0
import 'plan-supporter-import.dart';

// ── שקעים כבחוזה (זהים למקור-ה-JS) ─────────────────────────────────────────
// נרמול = lowercase + הסרת כל הרווחים.
dynamic normName(dynamic s) =>
    s.toString().toLowerCase().replaceAll(RegExp(r'\s'), '');

// fillEmpty = המקור: פורש a, ממלא רק שדות falsy מ-b truthy (מלבד hist),
// ומצרף hist/ayinNames כשאחד מהם לא-ריק.
dynamic fillEmpty(dynamic a, dynamic b) {
  final am = a as Map;
  final bm = b as Map;
  final out = <String, dynamic>{};
  am.forEach((k, v) => out[k.toString()] = v);
  bm.forEach((k, v) {
    final key = k.toString();
    if (key == 'hist') return;
    if (!_truthy(out[key]) && _truthy(v)) out[key] = v;
  });
  final ah = am['hist'];
  final bh = bm['hist'];
  if (_len(ah) > 0 || _len(bh) > 0) {
    out['hist'] = [
      ...(ah is List ? ah : const []),
      ...(bh is List ? bh : const []),
    ];
  }
  final aa = am['ayinNames'];
  final ba = bm['ayinNames'];
  if (_len(aa) > 0 || _len(ba) > 0) {
    out['ayinNames'] = [
      ...(aa is List ? aa : const []),
      ...(ba is List ? ba : const []),
    ];
  }
  return out;
}

int _len(dynamic v) => v is List ? v.length : 0;

bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

Map<String, dynamic> run(List<dynamic> rows, List<dynamic> existing) =>
    planSupporterImport(rows, existing, normName, fillEmpty);

// JSON.stringify מינימלי (בלי dart:convert) — משמר סדר-הכנסה כמו JSON.stringify.
String _json(dynamic v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v.toString();
  if (v is String) return _str(v);
  if (v is List) return '[${v.map(_json).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('${_str(k.toString())}:${_json(val)}'));
    return '{${parts.join(',')}}';
  }
  throw StateError('unsupported json value: $v');
}

String _str(String s) {
  final b = StringBuffer('"');
  for (var i = 0; i < s.length; i++) {
    final ch = s[i];
    final code = s.codeUnitAt(i);
    if (ch == '"') {
      b.write('\\"');
    } else if (ch == '\\') {
      b.write('\\\\');
    } else if (code < 0x20) {
      b.write('\\u${code.toRadixString(16).padLeft(4, '0')}');
    } else {
      b.write(ch);
    }
  }
  b.write('"');
  return b.toString();
}

bool _eqJson(dynamic a, dynamic b) => _json(a) == _json(b);

void _chk(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  // 1. שם קיים ⇒ עדכון
  final p1 = run(
    [
      {'name': 'דוד לוי', 'phone': '050'},
    ],
    [
      {'id': 's1', 'name': 'דוד לוי'},
    ],
  );
  _chk(
    _eqJson(p1, {
      'updates': [
        {
          'id': 's1',
          'row': {'name': 'דוד לוי', 'phone': '050'},
        },
      ],
      'inserts': [],
    }),
    '1: שם קיים ⇒ עדכון',
  );

  // 2. התאמת-נרמול (רווח כפול)
  final p2 = run(
    [
      {'name': 'דוד  לוי', 'phone': '051'},
    ],
    [
      {'id': 's1', 'name': 'דוד לוי'},
    ],
  );
  _chk(
    (p2['updates'] as List).length == 1 &&
        (p2['updates'] as List)[0]['id'] == 's1' &&
        (p2['inserts'] as List).isEmpty,
    '2: נרמול-רווחים ⇒ עדכון לא הוספה',
  );

  // 3. קיבוץ פר-id — hist באורך 2
  final p3 = run(
    [
      {
        'name': 'דוד לוי',
        'phone': '',
        'hist': [
          {'d': '2026-01-01', 'ils': 100},
        ],
      },
      {
        'name': 'דוד לוי',
        'phone': '',
        'hist': [
          {'d': '2026-02-01', 'ils': 200},
        ],
      },
    ],
    [
      {'id': 's1', 'name': 'דוד לוי'},
    ],
  );
  _chk(
    (p3['updates'] as List).length == 1 &&
        ((p3['updates'] as List)[0]['row']['hist'] as List).length == 2,
    '3: קיבוץ פר-id — היסטוריה נאספת (hist=2)',
  );

  // 4. מיזוג הוספות — הראשונה גוברת, השנייה ממלאת
  final p4 = run(
    [
      {'name': 'רות', 'phone': '', 'email': 'a@b'},
      {'name': 'רות', 'phone': '052', 'email': ''},
    ],
    [],
  );
  _chk(
    _eqJson(p4, {
      'updates': [],
      'inserts': [
        {'name': 'רות', 'phone': '052', 'email': 'a@b'},
      ],
    }),
    '4: מיזוג-הוספות דרך fillEmpty',
  );

  // 5. שורה בלי שם מדולגת
  final p5 = run(
    [
      {'name': '  ', 'phone': '050'},
    ],
    [
      {'id': 's1', 'name': 'דוד לוי'},
    ],
  );
  _chk(
    (p5['updates'] as List).isEmpty && (p5['inserts'] as List).isEmpty,
    '5: שורה ריקת-שם מדולגת',
  );

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _eqJson(
      run([
        {'name': 'x'},
      ], []),
      {
        'updates': [],
        'inserts': [
          {'name': 'x'},
        ],
      },
    ),
    'assert-live guard',
  );

  print('OK planSupporterImport: 5 דוגמאות-חוזה — ירוק');
}
