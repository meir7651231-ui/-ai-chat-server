import '../dart-data-maor/stage-label.dart';
// בדיקת-חוזה (רתמת-זהב) · stageLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל 4 דוגמאות-החוזה (stage-label.contract.md) ואת בדיקת-ה-JS
// (new/atoms/stage-label.test.mjs) ביט-אחר-ביט: מונח-ארגון גובר / נפילה /
// חמשת-השלבים / קריאת-שקע יחידה עם (cfg, 'ayin.stage.done', 'הושלם') —
// אותו אובייקט-cfg כלשונו (identical). כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/stage-label_test.dart ⇒ exit 0
import 'stage-label.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// שקע-termOf נופל כמו בבדיקת-ה-JS: (c,k,fb) => c.terms?.[k] ?? fb.
dynamic _termOf(dynamic c, dynamic k, dynamic fb) {
  final terms = (c is Map) ? c['terms'] : null;
  final v = (terms is Map) ? terms[k] : null;
  return v ?? fb;
}

void main() {
  var n = 0;

  // 1) מונח-ארגון גובר — השקע מחזיר 'ביצוע' (ורטיקל הסטודיו).
  {
    final got = stageLabel(<String, dynamic>{}, 'eyes', (c, k, fb) => 'ביצוע', stageFallback: kStageFallback);
    _ok(got == 'ביצוע', "מונח-הארגון לא גבר (בפועל: $got)");
    n++;
  }

  // 2) נפילה לברירת-המחדל — cfg ריק ⇒ 'מסירה'.
  {
    final got = stageLabel(<String, dynamic>{}, 'answer', _termOf, stageFallback: kStageFallback);
    _ok(got == 'מסירה', "ברירת-המחדל של answer שגויה (בפועל: $got)");
    n++;
  }

  // 3) חמשת השלבים בנפילה.
  {
    final expected = <String, String>{
      'new': 'חדש',
      'lead': 'בהכנה',
      'eyes': 'רישום',
      'answer': 'מסירה',
      'done': 'הושלם',
    };
    expected.forEach((stage, want) {
      final got = stageLabel(<String, dynamic>{}, stage, _termOf, stageFallback: kStageFallback);
      _ok(got == want, "$stage שגוי (בפועל: $got ≠ $want)");
    });
    n++;
  }

  // 4) השקע נקרא בדיוק פעם אחת עם (cfg, 'ayin.stage.done', 'הושלם') —
  //    אותו אובייקט-cfg כלשונו (identical, כמו !== ב-JS).
  {
    final cfg = <String, dynamic>{'tag': 'cfg'};
    var calls = 0;
    List<dynamic>? got;
    stageLabel(cfg, 'done', (c, k, fb) {
      calls++;
      got = [c, k, fb];
      return 'x';
    }, stageFallback: kStageFallback);
    _ok(
        calls == 1 &&
            got != null &&
            identical(got![0], cfg) &&
            got![1] == 'ayin.stage.done' &&
            got![2] == 'הושלם',
        'קריאת-השקע שגויה (calls=$calls, args=$got)');
    n++;
  }

  print('OK stageLabel: $n contract examples passed');
}
