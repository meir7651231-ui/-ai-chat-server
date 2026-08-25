import 'revert-patch.dart';

/// רתמת-זהב: 5 דוגמאות-החוזה מ-revert-patch.contract.md + בדיקת-ה-JS
/// (new/atoms/revert-patch.test.mjs) — כלשונן.
/// שקע-stageIndex אמיתי כמתועד בחוזה (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה).
void main() {
  const ayinStages = ['new', 'lead', 'eyes', 'answer', 'done'];
  num stageIndex(dynamic stage) {
    final i = ayinStages.indexOf(stage as String);
    return i < 0 ? 0 : i;
  }

  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1-3 — חזרה אל לפני 'answer' ⇒ מבטלת את דגל-הדחיפה
  for (final s in ['new', 'lead', 'eyes']) {
    final p = revertPatch(s, stageIndex);
    ok(p['stage'] == s && p['answerPushed'] == false && p.keys.length == 2,
        'דוגמה $s: $p');
  }
  // 4-5 — 'answer'/'done' ⇒ רק {stage}, בלי מפתח answerPushed כלל
  for (final s in ['answer', 'done']) {
    final p = revertPatch(s, stageIndex);
    ok(p['stage'] == s && !p.containsKey('answerPushed') && p.keys.length == 1,
        'דוגמה $s: $p');
  }

  if (f != 0) throw StateError('revert-patch: סטייה מהמקור');
  print('✓ revert-patch: 5 דוגמאות-חוזה — ירוק');
}
