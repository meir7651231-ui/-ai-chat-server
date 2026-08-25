// רתמת-זהב · merge-supporters-by-fields — אותן 5 דוגמאות-חוזה בדיוק
// מ-new/atoms/merge-supporters-by-fields.test.mjs. עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts merge-supporters-by-fields_test.dart
import 'merge-supporters-by-fields.dart';

// truthiness של JS (עבור `s[key] || ''` וה-findIndex בשקע-supDupFieldValue).
bool _t(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !(v is double && v.isNaN);
  return true;
}

// שקעים בסמנטיקת-maor — זהים לבדיקת-ה-JS (מייבאת רק את האטום שלה).
// mergeSupportersGroup: losers.reduce((acc,l)=>({...acc, ils:(acc.ils??0)+(l.ils??0)}), keeper)
dynamic mergeSupportersGroup(dynamic keeper, dynamic losers) {
  var acc = Map<String, dynamic>.from(keeper as Map);
  for (final lAny in losers as List) {
    final l = lAny as Map;
    final next = Map<String, dynamic>.from(acc);
    next['ils'] = ((acc['ils'] ?? 0) as num) + ((l['ils'] ?? 0) as num);
    acc = next;
  }
  return acc;
}

// supDupFieldValue: edit גובר (`edited != null`); אחרת pick (`?? findIndex`); אחרת ראשון-עם-ערך.
dynamic supDupFieldValue(
    dynamic sups, dynamic def, dynamic pick, dynamic edit) {
  final d = def as Map;
  final key = d['key'];
  final get = d['get'] as dynamic Function(dynamic);
  final edited = (edit as Map)[key];
  if (edited != null) return edited; // JS: `edited != null`
  final supsL = sups as List;
  final picked = (pick as Map)[key];
  final int idx = picked ?? supsL.indexWhere((s) => _t(get(s)));
  return get(supsL[idx >= 0 ? idx : 0]);
}

// F(key) = {key, label:key, get:(s)=>s[key]||''}
Map<String, dynamic> _F(String key) => {
      'key': key,
      'label': key,
      'get': (dynamic s) {
        final v = (s as Map)[key];
        return _t(v) ? v : ''; // s[key] || ''
      },
    };

final List<Map<String, dynamic>> supDupFields = [
  'name', 'phone', 'email', 'idNum', 'city', 'address', 'cat', 'forWho', 'notes'
].map(_F).toList();

// sup(o) — אובייקט-בסיס עם כל השדות ריקים + ils:0, נדרס ע"י o.
Map<String, dynamic> _sup(Map<String, dynamic> o) => {
      'name': '', 'phone': '', 'email': '', 'idNum': '', 'city': '',
      'address': '', 'cat': '', 'forWho': '', 'notes': '', 'ils': 0, ...o,
    };

void main() {
  var f = 0;
  void chk(String name, bool cond) {
    if (!cond) {
      print('✗ $name');
      f = 1;
    }
  }

  // דוגמה 1 — הכסף מהבסיס-הקבוצתי, לא מהבחירה
  {
    final out = mergeSupportersByFields(
      [_sup({'name': 'דנה', 'ils': 100}), _sup({'name': 'דנה לוי', 'ils': 50})],
      {}, {}, mergeSupportersGroup, supDupFieldValue, supDupFields,
    );
    chk('1 ils=150', out['ils'] == 150);
  }
  // דוגמה 2 — pick בוחר רשומה
  {
    final out = mergeSupportersByFields(
      [_sup({'name': 'דנה'}), _sup({'name': 'דנה לוי'})],
      {'name': 1}, {}, mergeSupportersGroup, supDupFieldValue, supDupFields,
    );
    chk('2 pick-name', out['name'] == 'דנה לוי');
  }
  // דוגמה 3 — edit גובר גם על pick וגם על ערכים מלאים
  {
    final out = mergeSupportersByFields(
      [_sup({'notes': 'הערה א'}), _sup({'notes': 'הערה ב'})],
      {'notes': 1}, {'notes': 'ממוזג ידנית'},
      mergeSupportersGroup, supDupFieldValue, supDupFields,
    );
    chk('3 edit-גובר', out['notes'] == 'ממוזג ידנית');
  }
  // דוגמה 4 — ברירת-מחדל: הרשומה הראשונה עם ערך
  {
    final out = mergeSupportersByFields(
      [_sup({'city': ''}), _sup({'city': 'חיפה'})],
      {}, {}, mergeSupportersGroup, supDupFieldValue, supDupFields,
    );
    chk('4 ראשון-עם-ערך', out['city'] == 'חיפה');
  }
  // דוגמה 5 — שדה לא-מוכר (ils) ברשימת-השקע מדולג; הכסף מוגן
  {
    final hostile = [
      ...supDupFields,
      {'key': 'ils', 'label': 'כסף', 'get': (dynamic _) => '999999'},
    ];
    final out = mergeSupportersByFields(
      [_sup({'ils': 100}), _sup({'ils': 50})],
      {}, {}, mergeSupportersGroup, supDupFieldValue, hostile,
    );
    chk('5 כסף-מוגן', out['ils'] == 150);
  }

  if (f != 0) throw StateError('merge-supporters-by-fields: סטייה מהמקור');
  print('✓ merge-supporters-by-fields: 5 דוגמאות-חוזה — ירוק');
}
