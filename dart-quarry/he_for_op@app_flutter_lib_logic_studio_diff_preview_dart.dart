// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _heForOp — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:165-183 (19 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): actionHe, allowedValues
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _heForOp(ConfigOp op, RegistryView registry) => switch (op) {
      SetText() => 'שינוי טקסט: ${op.id}',
      SetEmoji() => 'שינוי אמוג׳י: ${op.id}',
      SetHidden(:final hidden) => hidden == null
          ? 'שינוי נראות: ${op.id}'
          : (hidden ? 'הסתרה: ${op.id}' : 'הצגה: ${op.id}'),
      SetOrder(:final order) => order == null
          ? 'שינוי סדר: ${op.id}'
          : 'שינוי סדר: ${op.id} ← $order', // before→after: the new position
      SetStyle(:final style) => _styleHe(op.id, style, registry),
      SetAction(:final action) => action == null
          ? 'ניקוי פעולה: ${op.id}'
          : 'פעולה: ${actionHe(action.kind) ?? action.kind}',
    };

/// The Hebrew line for a `SetStyle`. A color change renders the precise new color
/// (§10 before→after) when the registry CONSTRAINS the token
/// (`allowedValues(id,'color')` contains it) — best-effort, skipped otherwise; a
/// non-color style change is the generic "שינוי עיצוב".
