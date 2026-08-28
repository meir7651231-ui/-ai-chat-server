import '../dart-data-maor/commands-build-commands-terms.dart' as td_commands_build_commands;
// רתמת-זהב · commands-build-commands — פלט מקודד JSON נאמן-JS מול WANT המדויק
// מ-new/atoms/commands-build-commands.test.mjs (זהות: אותו CTX→אותו JSON.stringify).
import 'commands-build-commands.dart';

String _enc(dynamic v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return _numStr(v);
  if (v is String) return _strStr(v);
  if (v is List) return '[${v.map(_enc).join(',')}]';
  if (v is Map) {
    return '{${v.entries.map((e) => '${_strStr(e.key.toString())}:${_enc(e.value)}').join(',')}}';
  }
  throw StateError('unencodable: $v');
}

String _numStr(num n) {
  if (n is int) return n.toString();
  final d = n as double;
  if (d.isNaN) return 'NaN';
  if (d.isInfinite) return d.isNegative ? '-Infinity' : 'Infinity';
  if (d == d.truncateToDouble() && d.abs() < 1e21) return d.toInt().toString();
  return d.toString();
}

String _strStr(String s) {
  final b = StringBuffer('"');
  for (final r in s.runes) {
    if (r == 0x22) {
      b.write('\\"');
    } else if (r == 0x5C) {
      b.write('\\\\');
    } else if (r == 0x0A) {
      b.write('\\n');
    } else if (r == 0x0D) {
      b.write('\\r');
    } else if (r == 0x09) {
      b.write('\\t');
    } else if (r == 0x08) {
      b.write('\\b');
    } else if (r == 0x0C) {
      b.write('\\f');
    } else if (r < 0x20) {
      b.write('\\u${r.toRadixString(16).padLeft(4, '0')}');
    } else {
      b.writeCharCode(r);
    }
  }
  b.write('"');
  return b.toString();
}

void main() {
  final ctx = <String, dynamic>{
    'supporters': [
      {'id': '1', 'name': 'אבי', 'phone': '050'},
      {'id': '2', 'name': '', 'phone': ''},
    ],
    'cockpitOn': true,
    'importOn': true,
    'customReportOn': false,
    'dedupCount': 2,
    'paymentsOn': false,
    'supporterTerm': 'תורם/ת',
  };
  const want =
      '[{"id":"cmd:add","kind":"add","label":"➕ הוספת תורם/ת","group":"פעולה","keywords":"➕ הוספת תורם/ת הוספה חדש חדשה תורם add new"},{"id":"cmd:work","kind":"work","label":"🎯 חלון העבודה","group":"ניווט","keywords":"🎯 חלון העבודה קוקפיט משימות עבודה היום cockpit"},{"id":"cmd:data","kind":"data","label":"☰ מסך הנתונים","group":"ניווט","keywords":"☰ מסך הנתונים טבלה נתונים רשימה סינון data"},{"id":"cmd:import","kind":"import","label":"⬆ ייבוא מקובץ CSV","group":"פעולה","keywords":"⬆ ייבוא מקובץ csv ייבוא csv excel קובץ import"},{"id":"cmd:dedup","kind":"dedup","label":"🔗 איחוד כפולים · 2","group":"פעולה","keywords":"🔗 איחוד כפולים · 2 כפולים מיזוג איחוד dedup merge"},{"id":"donor:1","kind":"openDonor","arg":"1","label":"אבי","hint":"פתיחת כרטיס","group":"תורם","keywords":"אבי אבי 050"},{"id":"donor:2","kind":"openDonor","arg":"2","label":"ללא שם","hint":"פתיחת כרטיס","group":"תורם","keywords":"ללא שם"}]';
  final got = _enc(buildCommands(ctx, term: (k)=>td_commands_build_commands.kTerms[k]!));
  if (got != want) {
    throw StateError('✗ commands-build-commands\n$got\n≠\n$want');
  }

  // ratchet · באג-חוצה-שפות: ‏JS `ctx.dedupCount > 0` על undefined ⇒ false (לא זורק);
  // הפורט הקודם `(x as num) > 0` זרק על null. נאמן: ctx בלי dedupCount ⇒ בלי cmd:dedup.
  final noDedup = buildCommands(<String, dynamic>{
    'supporters': [
      {'id': '1', 'name': 'אבי', 'phone': '050'},
      {'id': '2', 'name': '', 'phone': ''},
    ],
    'supporterTerm': 'תורם/ת',
  }, term: (k)=>td_commands_build_commands.kTerms[k]!);
  if (noDedup.any((c) => c['id'] == 'cmd:dedup')) {
    throw StateError('✗ commands-build-commands: dedupCount חסר לא אמור לייצר cmd:dedup');
  }
  if (noDedup.length != 3) {
    throw StateError('✗ commands-build-commands: ctx-רזה ⇒ צפוי 3 (add+2 כרטיסים), התקבל ${noDedup.length}');
  }

  print('✓ commands-build-commands (Dart): Golden + ratchet dedup-חסר — ירוק');
}
