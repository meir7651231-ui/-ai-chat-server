import 'ayin-advance-label.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/ayin-advance-label.test.mjs.
/// מימוש-שקע לבדיקה — ברירות-המחדל של ayin.ts (STAGE_FALLBACK).
void main() {
  const fallback = {
    'new': 'חדש',
    'lead': 'בהכנה',
    'eyes': 'רישום',
    'answer': 'מסירה',
    'done': 'הושלם',
  };
  String stageLabel(dynamic cfg, String st) => fallback[st]!;
  final cfg = <String, dynamic>{};

  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  ok(ayinAdvanceLabel(cfg, {'stage': 'new'}, stageLabel) == 'בהכנה ←', 'new');
  ok(ayinAdvanceLabel(cfg, {'stage': 'lead'}, stageLabel) == '✓ אישור — בהכנה',
      'lead');
  ok(ayinAdvanceLabel(cfg, {'stage': 'eyes'}, stageLabel) == 'מסירה ←', 'eyes');
  ok(
      ayinAdvanceLabel(cfg, {'stage': 'answer', 'answerPushed': true},
              stageLabel) ==
          '✓ הושלם',
      'answer+pushed');
  ok(
      ayinAdvanceLabel(cfg, {'stage': 'answer', 'answerPushed': false},
              stageLabel) ==
          '📞 דחיפה ללוח',
      'answer-pushed');
  ok(ayinAdvanceLabel(cfg, {'stage': 'done'}, stageLabel) == '', 'done ⇒ ריק');

  if (f != 0) throw StateError('ayin-advance-label: סטייה מהמקור');
  print('✓ ayin-advance-label: 6 דוגמאות-חוזה — ירוק');
}
