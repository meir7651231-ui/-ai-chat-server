// בדיקת-חוזה (רתמת-זהב) · applyAyinNames — מייבאת אך ורק את האטום-שלה (חוק-4).
// שמונה דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-ayin-names.test.mjs:
//   sp בלי ayin · names=['ראובן','','ראובן','שמעון'] ⇒ נוספו 2 (ראובן,שמעון) ·
//   mkId נקרא בדיוק פעמיים (ריק+כפול לא שרפו מזהה) · eyes=''·done=false ·
//   names=[] ⇒ אותה הפניה (identical) · sp2 עם 'ראובן' קיים · הכל-כפול ⇒ אותה הפניה ·
//   ['ראובן','שמעון'] ⇒ קיים מדולג, חדש נוסף · sp2.ayin המקורי לא שונה (אימוטביליות).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/apply-ayin-names_test.dart  ⇒ exit 0
import 'apply-ayin-names.dart';

// מימושי-שקע לבדיקה — נאמנים למקור (domain.emptyAyin · ayin.planAddName):
Map<String, dynamic> emptyAyin() => {
      'stage': 'new',
      'note': '',
      'answeredNote': '',
      'answerPushed': false,
      'nextTalk': '',
      'nextTalkTime': '',
      'lastTouch': '',
      'names': <Map<String, dynamic>>[],
      'answers': <dynamic>[],
      'log': <dynamic>[],
      'time': <dynamic>[],
      'mat': <dynamic>[],
    };

String _norm(String s) => s.trim().toLowerCase();

Map<String, dynamic> planAddName(
    Map<String, dynamic> a, String rawName, String eyes, String id) {
  final nm = rawName.trim();
  if (nm.isEmpty) return {'ok': false, 'error': 'ריק'};
  final existing = (a['names'] as List).cast<Map<String, dynamic>>();
  if (existing.any((x) => _norm(x['name'] as String) == _norm(nm))) {
    return {'ok': false, 'error': 'כפול'};
  }
  return {
    'ok': true,
    'names': [
      ...existing,
      {'id': id, 'name': nm, 'eyes': eyes, 'done': false}
    ],
  };
}

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var ids = 0;
  String mkId() => 'id-${++ids}';

  final sp = <String, dynamic>{'id': 's1', 'name': 'לוי'};
  final out = applyAyinNames(
      sp, ['ראובן', '', 'ראובן', 'שמעון'], mkId, emptyAyin, planAddName);
  final outNames = (out['ayin']['names'] as List).cast<Map<String, dynamic>>();

  _check(outNames.length == 2, 'נוספו 2 שמות, בפועל ${outNames.length}');
  _check(outNames[0]['name'] == 'ראובן' && outNames[1]['name'] == 'שמעון',
      'השמות: ראובן, שמעון');
  _check(ids == 2,
      'mkId נקרא בדיוק פעמיים (בפועל $ids) — ריק/כפול לא שרפו מזהה');
  _check(outNames.every((n) => n['eyes'] == '' && n['done'] == false),
      "eyes='' · done=false");

  _check(
      identical(
          applyAyinNames(sp, <String>[], mkId, emptyAyin, planAddName), sp),
      'בלי שמות ⇒ אותה הפניה');

  final sp2 = <String, dynamic>{
    'id': 's2',
    'name': 'כהן',
    'ayin': {
      ...emptyAyin(),
      'names': [
        {'id': 'n1', 'name': 'ראובן', 'eyes': 3, 'done': false}
      ],
    },
  };
  _check(
      identical(
          applyAyinNames(sp2, ['ראובן'], mkId, emptyAyin, planAddName), sp2),
      'הכל-כפול ⇒ אותה הפניה');

  final out2 =
      applyAyinNames(sp2, ['ראובן', 'שמעון'], mkId, emptyAyin, planAddName);
  final out2Names = (out2['ayin']['names'] as List).cast<Map<String, dynamic>>();
  _check(out2Names.length == 2 && out2Names[1]['name'] == 'שמעון',
      'קיים מדולג, חדש נוסף');

  _check((sp2['ayin']['names'] as List).length == 1,
      'sp.ayin המקורי לא שונה (אימוטביליות)');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(applyAyinNames(sp, <String>[], mkId, emptyAyin, planAddName), sp),
      'assert-live guard');

  print('OK applyAyinNames: 8 דוגמאות-חוזה — ירוק');
}
