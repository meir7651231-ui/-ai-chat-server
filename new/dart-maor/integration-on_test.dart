import 'integration-on.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/integration-on.test.mjs.
void main() {
  final c = <List<dynamic>>[
    [
      {
        'integrations': {
          'whatsapp': {'enabled': true}
        }
      },
      'whatsapp',
      true
    ],
    [
      {
        'integrations': {
          'whatsapp': {'enabled': false}
        }
      },
      'whatsapp',
      false
    ],
    [<String, dynamic>{}, 'maps', false],
    [
      {
        'integrations': {'maps': <String, dynamic>{}}
      },
      'maps',
      false
    ],
    [
      {
        'integrations': {
          'ai': {'enabled': 'true'}
        }
      },
      'ai',
      false
    ],
    [
      {
        'integrations': {
          'gcal': {'enabled': true}
        }
      },
      'maps',
      false
    ],
  ];
  var f = 0;
  for (final row in c) {
    final cfg = row[0] as Map;
    final key = row[1] as String;
    final w = row[2] as bool;
    final g = integrationOn(cfg, key);
    if (g != w) {
      print('✗ $cfg · $key ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('integration-on: סטייה מהמקור');
  print('✓ integration-on: 6 דוגמאות-חוזה — ירוק (opt-in: חסר=כבוי, רק true בוליאני מדליק)');
}
