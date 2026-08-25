// רתמת-זהב · merge-families-by-fields — אותן 6 דוגמאות-חוזה בדיוק
// מ-new/atoms/merge-families-by-fields.test.mjs. עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts merge-families-by-fields_test.dart
import 'merge-families-by-fields.dart';

// truthiness של JS לצורך findIndex בשקע-dupFieldValue המזויף.
bool _t(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !(v is double && v.isNaN);
  return true;
}

// deps מזויפים — זהים לבדיקת-ה-JS (edit ⇒ pick ⇒ ראשונה-עם-ערך).
final Map<String, dynamic> deps = {
  'mergeFamilies': (dynamic k, dynamic losers) =>
      Map<String, dynamic>.from(k as Map),
  'dupFieldValue': (dynamic fams, dynamic def, dynamic pick, dynamic edit) {
    final d = def as Map;
    final key = d['key'];
    final get = d['get'] as dynamic Function(dynamic);
    final edited = (edit as Map)[key];
    if (edited != null) return edited; // JS: `edited != null`
    final famsL = fams as List;
    final picked = (pick as Map)[key];
    final int idx = picked ?? famsL.indexWhere((fm) => _t(get(fm)));
    return get(famsL[idx >= 0 ? idx : 0]);
  },
  'dupFields': [
    {
      'key': 'name',
      'get': (dynamic fm) {
        final v = (fm as Map)['name'];
        return (v == null || v == '') ? '' : v; // fm.name || ''
      },
    },
    {
      'key': 'status',
      'get': (dynamic fm) {
        final v = (fm as Map)['status'];
        return (v == null || v == '') ? '' : v; // fm.status || ''
      },
    },
    {
      'key': 'kidsHome',
      'get': (dynamic fm) {
        final v = (fm as Map)['kidsHome'];
        return v == null ? '' : v.toString(); // kidsHome==null?'':String(kidsHome)
      },
    },
  ],
};

final List<Map<String, dynamic>> fams = [
  {'id': 'f1', 'name': '', 'status': 'pending', 'kidsHome': 2},
  {'id': 'f2', 'name': 'לוי', 'status': 'active', 'kidsHome': 4},
];

bool _mapEq(Map a, Map b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k) || b[k] != a[k]) return false;
  }
  return true;
}

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) בלי pick/edit — הראשונה-עם-ערך לכל שדה
  final r1 = mergeFamiliesByFields(fams, {}, {}, deps);
  ok(_mapEq(r1, {'id': 'f1', 'name': 'לוי', 'status': 'pending', 'kidsHome': 2}),
      'ברירת-מחדל שגויה ⇒ $r1');

  // 2) pick בוחר מקור + המרת-מספר
  ok(mergeFamiliesByFields(fams, {'kidsHome': 1}, {}, deps)['kidsHome'] == 4,
      'pick למונה לא הומר ל-4');

  // 3) edit גובר על pick
  ok(mergeFamiliesByFields(fams, {'name': 1}, {'name': 'אדית'}, deps)['name'] ==
          'אדית',
      'edit לא גבר על pick');

  // 4) מונה ריק ⇒ 0
  ok(mergeFamiliesByFields(fams, {}, {'kidsHome': ''}, deps)['kidsHome'] == 0,
      "'' במונה לא הפך ל-0");

  // 5) סטטוס ריק ⇒ סטטוס-הבסיס
  ok(mergeFamiliesByFields(fams, {}, {'status': ''}, deps)['status'] ==
          'pending',
      "'' בסטטוס לא נפל לבסיס");

  // 6) שדה מחוץ ל-dupFields נשאר מהבסיס
  ok(mergeFamiliesByFields(fams, {'name': 1}, {}, deps)['id'] == 'f1',
      'id נדרס שלא-כדין');

  if (f != 0) throw StateError('merge-families-by-fields: סטייה מהמקור');
  print('✓ merge-families-by-fields: 6 דוגמאות-חוזה — ירוק');
}
