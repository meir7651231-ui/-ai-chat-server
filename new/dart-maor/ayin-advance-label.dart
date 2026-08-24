/// חוט · ayin-advance-label — תווית הכפתור-החכם לפי שלב.
/// המרה נאמנה מ-new/atoms/ayin-advance-label.mjs (חוק-4: המקור קדוש).
/// שקע: stageLabel(cfg, st) ⇒ תווית-השלב; a = פרטי-ה"עין" (stage/answerPushed).
/// אפס import (רק dart-core). התנהגות זהה-לחלוטין ל-JS.
String ayinAdvanceLabel(
  dynamic cfg,
  Map<String, dynamic> a,
  String Function(dynamic cfg, String st) stageLabel,
) {
  final st = a['stage'];
  if (st == 'new') return stageLabel(cfg, 'lead') + ' ←';
  if (st == 'lead') return '✓ אישור — ' + stageLabel(cfg, 'lead');
  if (st == 'eyes') return stageLabel(cfg, 'answer') + ' ←';
  if (st == 'answer') {
    return a['answerPushed'] == true
        ? '✓ ' + stageLabel(cfg, 'done')
        : '📞 דחיפה ללוח';
  }
  return '';
}
