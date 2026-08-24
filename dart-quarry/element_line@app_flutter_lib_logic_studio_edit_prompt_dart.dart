// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _elementLine — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:236-248 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): propKeysFor, toList, actionIdsFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _elementLine(RegistryView registry, String id) {
  final props = registry.propKeysFor(id).toList()..sort();
  final actions = registry.actionIdsFor(id).toList()..sort();
  final rhs = <String>[];
  if (props.isNotEmpty) rhs.add('props ${props.join('/')}');
  if (actions.isNotEmpty) rhs.add('actions ${actions.join('/')}');
  return rhs.isEmpty ? id : '$id = ${rhs.join(' · ')}';
}

/// ONE tiny valid few-shot (§10) built from a REAL slice id — never an invented id.
/// Prefers a `setText` on an id that actually exposes a `text` prop; otherwise a
/// `setHidden` on the first slice id (needs only a real id). `null` on an empty
/// slice. The example proves the JSON SHAPE while pinning "target must be real".
