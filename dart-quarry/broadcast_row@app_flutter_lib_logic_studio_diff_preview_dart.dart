// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _broadcastRow — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:112-139 (28 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
DiffLine _broadcastRow(List<ConfigOp> ops) {
  final counts = <ConfigOpKind, int>{};
  // Track whether EVERY SetStyle in the group is a color change, so the label can
  // sharpen "עיצובים" → "צבעים" (the §9 example) only when it is truly all colors.
  var styleAllColor = true;
  for (final op in ops) {
    final kind = op.kind;
    counts[kind] = (counts[kind] ?? 0) + 1;
    if (kind == ConfigOpKind.setStyle &&
        !(op is SetStyle && op.style?.colorToken != null)) {
      styleAllColor = false;
    }
  }
  // §4 — a same-kind broadcast collapses to the plain total.
  if (counts.length == 1) {
    return DiffLine('${ops.length} שינויים');
  }
  // §9 — grouped-by-kind, in the stable enum order for a deterministic string.
  final frags = <String>[
    for (final kind in ConfigOpKind.values)
      if (counts[kind] != null)
        '${_kindEmoji(kind)} ${counts[kind]} ${_kindPlural(kind, styleAllColor)}',
  ];
  return DiffLine(frags.join(' · '));
}

/// The scannable emoji for a kind's grouped summary (§9). Legacy-flavoured, matching
/// the app's emoji-heavy Hebrew UI.
