// רתמת-זהב · commands-filter-commands — פלט (רשימות-מזהים) מקודד JSON נאמן-JS מול WANT
// מ-new/atoms/commands-filter-commands.test.mjs (זהות: אותם CMDS/שאילתות→אותו JSON.stringify).
import 'commands-filter-commands.dart';

String _encStrList(List<List<String>> v) =>
    '[${v.map((inner) => '[${inner.map((s) => '"$s"').join(',')}]').join(',')}]';

void main() {
  final cmds = <Map<String, dynamic>>[
    {'id': 'cmd:add', 'kind': 'add', 'label': '➕ הוספת תורם/ת', 'group': 'פעולה', 'keywords': '➕ הוספת תורם/ת הוספה חדש חדשה תורם add new'},
    {'id': 'cmd:work', 'kind': 'work', 'label': '🎯 חלון העבודה', 'group': 'ניווט', 'keywords': '🎯 חלון העבודה קוקפיט משימות עבודה היום cockpit'},
    {'id': 'cmd:data', 'kind': 'data', 'label': '☰ מסך הנתונים', 'group': 'ניווט', 'keywords': '☰ מסך הנתונים טבלה נתונים רשימה סינון data'},
    {'id': 'cmd:import', 'kind': 'import', 'label': '⬆ ייבוא מקובץ CSV', 'group': 'פעולה', 'keywords': '⬆ ייבוא מקובץ csv ייבוא csv excel קובץ import'},
    {'id': 'cmd:dedup', 'kind': 'dedup', 'label': '🔗 איחוד כפולים · 2', 'group': 'פעולה', 'keywords': '🔗 איחוד כפולים · 2 כפולים מיזוג איחוד dedup merge'},
    {'id': 'donor:1', 'kind': 'openDonor', 'arg': '1', 'label': 'אבי', 'hint': 'פתיחת כרטיס', 'group': 'תורם', 'keywords': 'אבי אבי 050'},
    {'id': 'donor:2', 'kind': 'openDonor', 'arg': '2', 'label': 'ללא שם', 'hint': 'פתיחת כרטיס', 'group': 'תורם', 'keywords': 'ללא שם'},
  ];
  const want =
      '[["cmd:add","cmd:work","cmd:data","cmd:import","cmd:dedup"],["cmd:import"],["donor:1"]]';
  List<String> ids(List<Map<String, dynamic>> r) =>
      r.map((c) => c['id'] as String).toList();
  final got = _encStrList([
    ids(filterCommands(cmds, '')),
    ids(filterCommands(cmds, 'ייבוא')),
    ids(filterCommands(cmds, 'אבי')),
  ]);
  if (got != want) {
    throw StateError('✗ commands-filter-commands\n$got\n≠\n$want');
  }
  print('✓ commands-filter-commands (Dart): Golden — ירוק');
}
