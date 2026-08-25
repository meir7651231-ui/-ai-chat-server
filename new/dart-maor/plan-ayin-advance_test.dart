// בדיקת-חוזה (רתמת-זהב) · planAyinAdvance — מייבאת אך ורק את האטום-שלה (חוק-4).
// 15 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/plan-ayin-advance.test.mjs:
//   new(2 שמות)     ⇒ patch{stage:lead} · event 'בהכנה — רות (2 שם לטיפול)' done:false · toast
//   new ריק          ⇒ null (ayinActionVisible=false)
//   lead             ⇒ event 'בהכנה ✓ — רות' done:true · patch{stage:eyes}
//   eyes(3+2)        ⇒ patch{stage:answer} · event 'מסירה — רות (5 כמות)' · toast
//   answer(לפני)     ⇒ patch{answerPushed:true} · event 'מסירה — רות' done:false · toast
//   answer(אחרי)     ⇒ patch{stage:done} · event 'הושלם — רות' done:true · toast
//   done             ⇒ null
// השקעים = ברירת-המחדל של maor (ayin.ts): STAGE-map, featLabel/itemLabel/unitLabel,
// eyesTotal=Σ(+eyes||0). המרה: JSON.stringify של JS ⇒ _deep (שוויון-עמוק).
// הרצה: dart run --enable-asserts new/dart-maor/plan-ayin-advance_test.dart ⇒ exit 0
import 'plan-ayin-advance.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// שוויון-עמוק (מקביל להשוואת JSON.stringify של המקור).
bool _deep(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deep(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deep(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// שקעים בהתנהגות ברירת-המחדל של maor (ayin.ts):
const STAGE = {
  'new': 'חדש',
  'lead': 'בהכנה',
  'eyes': 'רישום',
  'answer': 'מסירה',
  'done': 'הושלם',
};

bool ayinActionVisible(Map a) {
  final st = a['stage'];
  if (st == 'done') return false;
  final names = a['names'] as List;
  if (st == 'new') return names.length > 0;
  if (st == 'eyes') {
    return names.any((n) {
      final e = (n as Map)['eyes'];
      return e != '' && e != null;
    });
  }
  return true;
}

String featLabel(Map cfg) => 'מעקב טיפול';
String itemLabel(Map cfg) => 'שם לטיפול';
String unitLabel(Map cfg) => 'כמות';
String stageLabel(Map cfg, String st) => STAGE[st] as String;

// eyesTotal = a.names.reduce((t,x) => t + (+x.eyes || 0), 0).
num eyesTotal(Map a) {
  final names = a['names'] as List;
  return names.fold<num>(0, (t, x) {
    final e = (x as Map)['eyes'];
    final n = e is num && !e.isNaN ? e : 0;
    return t + n;
  });
}

Map<String, Object?> nm(Object? eyes) =>
    {'id': 'n', 'name': 'x', 'eyes': eyes, 'done': false};

Map? plan(Map cfg, String name, Map a) => planAyinAdvance(cfg, name, a,
    ayinActionVisible, featLabel, itemLabel, unitLabel, stageLabel, eyesTotal);

void main() {
  var n = 0;
  final cfg = {};

  // stage='new' עם 2 שמות.
  final r1 = plan(cfg, 'רות', {
    'stage': 'new',
    'names': [nm(''), nm('')],
  })!;
  _ok(_deep(r1['patch'], {'stage': 'lead'}), "new ⇒ patch{stage:'lead'}");
  n++;
  _ok(
      (r1['event'] as Map)['title'] == 'מעקב טיפול: בהכנה — רות (2 שם לטיפול)' &&
          (r1['event'] as Map)['done'] == false,
      'new event');
  n++;
  _ok(r1['toast'] == 'נרשמו 2 — נכנס ללוח: בהכנה', 'new toast');
  n++;

  // stage='new' בלי שמות ⇒ null.
  _ok(plan(cfg, 'רות', {'stage': 'new', 'names': []}) == null, 'new ריק ⇒ null');
  n++;

  // stage='lead'.
  final r2 = plan(cfg, 'רות', {
    'stage': 'lead',
    'names': [nm('')],
  })!;
  _ok(_deep(r2['event'], {'title': 'מעקב טיפול: בהכנה ✓ — רות', 'done': true}),
      'lead event');
  n++;
  _ok(
      r2['toast'] == 'אושר — נרשם בלוח ובדוח. עכשיו: רישום' &&
          (r2['patch'] as Map)['stage'] == 'eyes',
      'lead toast+patch');
  n++;

  // stage='eyes' עם מונים 3+2.
  final r3 = plan(cfg, 'רות', {
    'stage': 'eyes',
    'names': [nm(3), nm(2)],
  })!;
  _ok(_deep(r3['patch'], {'stage': 'answer'}), "eyes ⇒ patch{stage:'answer'}");
  n++;
  _ok((r3['event'] as Map)['title'] == 'מעקב טיפול: מסירה — רות (5 כמות)',
      'eyes event.title');
  n++;
  _ok(r3['toast'] == 'נרשם — נכנס ללוח: מסירה', 'eyes toast');
  n++;

  // stage='answer' לפני-דחיפה.
  final r4 = plan(cfg, 'רות', {
    'stage': 'answer',
    'names': [nm(3)],
    'answerPushed': false,
  })!;
  _ok(_deep(r4['patch'], {'answerPushed': true}),
      'answer ⇒ patch{answerPushed:true}');
  n++;
  _ok(_deep(r4['event'], {'title': 'מעקב טיפול: מסירה — רות', 'done': false}),
      'answer event');
  n++;
  _ok(r4['toast'] == 'נמסר — נרשם בלוח היומי ובכרטיס', 'answer toast');
  n++;

  // stage='answer' אחרי-דחיפה.
  final r5 = plan(cfg, 'רות', {
    'stage': 'answer',
    'names': [nm(3)],
    'answerPushed': true,
  })!;
  _ok(_deep(r5['patch'], {'stage': 'done'}), "answerPushed ⇒ patch{stage:'done'}");
  n++;
  _ok(_deep(r5['event'], {'title': 'מעקב טיפול: הושלם — רות', 'done': true}),
      'done event');
  n++;
  _ok(r5['toast'] == 'הטיפול הושלם ✓ — נרשם בלוח', 'done toast');
  n++;

  // stage='done' ⇒ null.
  _ok(
      plan(cfg, 'רות', {
            'stage': 'done',
            'names': [nm(3)],
          }) ==
          null,
      'done ⇒ null');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(plan(cfg, 'רות', {'stage': 'done', 'names': []}) == null,
      'assert-live guard');

  print('OK planAyinAdvance: $n asserts passed');
}
