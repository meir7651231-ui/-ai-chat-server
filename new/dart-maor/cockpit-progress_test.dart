// רתמת-זהב · cockpit-progress — אותם קלטים/WANT של בדיקת-ה-JS (השוואת-JSON).
import 'dart:convert';
import 'cockpit-progress.dart';

void main() {
  final q = {
    'tasks': [
      {'id': 'call:1'},
      {'id': 'thanks:2'},
      {'id': 'hok:3'},
    ],
    'total': 3,
  };

  final cases = <List<dynamic>>[
    [{'call:1', 'hok:3'}, '{"done":2,"total":3}'],
    [<String>{}, '{"done":0,"total":3}'],
    [{'call:1', 'thanks:2', 'hok:3', 'x'}, '{"done":3,"total":3}'],
  ];

  for (final c in cases) {
    final got = jsonEncode(cockpitProgress(q, c[0] as Set));
    assert(got == c[1], '✗ $got ≠ ${c[1]}');
  }
  print('✓ cockpit-progress (Dart): 3 Golden — ירוק');
}
