// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · configOpEquals — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/config_op.dart:129-142 (14 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool configOpEquals(ConfigOp a, ConfigOp b) => switch ((a, b)) {
      (final SetText x, final SetText y) => x.id == y.id && x.text == y.text,
      (final SetEmoji x, final SetEmoji y) => x.id == y.id && x.emoji == y.emoji,
      (final SetHidden x, final SetHidden y) =>
        x.id == y.id && x.hidden == y.hidden,
      (final SetOrder x, final SetOrder y) => x.id == y.id && x.order == y.order,
      (final SetStyle x, final SetStyle y) => x.id == y.id && x.style == y.style,
      (final SetAction x, final SetAction y) =>
        x.id == y.id && x.action == y.action,
      _ => false, // mismatched variants
    };

/// String-keyed normalisation for a nested JSON map (the platform layer may hand
/// back `Map<Object?, Object?>`) — same tolerant cast as `config_doc._asStrMap`.
