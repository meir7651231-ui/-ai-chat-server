// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · softBatchWarnHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:373-473 (101 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): findDescriptor, allowedValues, contains, toStringAsFixed, actionIdsFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? softBatchWarnHe(int opCount) =>
    (opCount >= kStudioSoftBatchWarn && opCount <= kStudioMaxBatch)
        ? 'שים לב — $opCount פעולות בבת אחת. אפשר להמשיך, או לצמצם.'
        : null;

/// The single-op backstop — returns a non-empty Hebrew reason to BLOCK, or `null`
/// when [op] is safe. FAIL-CLOSED: a missing descriptor / an unresolvable token /
/// an empty legal-action set all BLOCK.
String? _reasonToBlock(
  ConfigOp op,
  List<ElementDescriptor> registry,
  RegistryView grounding,
  String? persona,
) {
  // 0 — FAIL-CLOSED on a target the frozen registry doesn't know (R1-2).
  final d = findDescriptor(registry, op.id);
  if (d == null) {
    return 'רכיב לא מוכר במרשם — חסום מטעמי בטיחות (fail-closed)';
  }

  // 1 — kImmutable: the whole element is frozen; EVERY op is refused (§7.2). The
  // product rule is "המנהל לא מתנתק" (manager_dashboard_screen.dart:200-209) +
  // board-isolation (sys_chat.dart §2.5).
  if (d.kImmutable) {
    return 'רכיב נעול (ניווט/הזדהות) — «${d.labelHe}» אינו ניתן לעריכה';
  }

  final crit = _criticalBusinessKind(d);

  switch (op) {
    // 2 — criticalBusiness VISIBILITY freeze (§4 · §9 prop-level: only the `hidden`
    // axis is locked; the element stays otherwise editable) + the step-78 role-
    // visibility floor. The criticalBusiness reasons stay FIRST so their exact
    // strings (pinned by step-77 tests) are unchanged; the role floor layers after.
    case SetHidden(:final hidden):
      if (hidden ?? false) {
        if (crit == _CriticalKind.price) {
          return 'אי-אפשר להסתיר מחיר';
        }
        if (crit == _CriticalKind.confirmOrder) {
          return 'אי-אפשר להסתיר את פקד «אשר הזמנה»';
        }
        final floorReason = _roleFloorBlock(d, persona);
        if (floorReason != null) return floorReason;
      }
      return null;

    // 3 — a confirm control's LABEL is frozen too (§4 — no relabel of "אשר הזמנה").
    case SetText():
      if (crit == _CriticalKind.confirmOrder) {
        return 'אי-אפשר לשנות את התווית של «אשר הזמנה»';
      }
      return null;

    // 4 — SetStyle: value legality (R1-9, EVERY element) + contrast (critical only).
    case SetStyle(:final style):
      final token = style?.colorToken;
      if (token == null) return null; // non-color style axes carry no floor
      // R1-9 — the token MUST be in the per-element-kind color subset; an
      // out-of-subset token or an arbitrary hex from the model fails closed.
      if (!grounding.allowedValues(op.id, 'color').contains(token)) {
        return 'צבע «$token» אינו בתת-הקבוצה החוקית לרכיב מסוג ${d.kind.name}';
      }
      // WCAG-AA contrast on a critical element (a legitimate token can still be
      // unreadable in context — the exact "legal-but-harmful" trap §3 names).
      if (crit != null) {
        final c = _colorForToken(token);
        if (c == null) {
          return 'לא ניתן לאמת ניגודיות עבור צבע «$token» — חסום (fail-closed)';
        }
        final ratio = _contrastRatio(c, _kRefSurface);
        if (ratio < kStudioMinContrast) {
          return 'ניגודיות נמוכה מדי (${ratio.toStringAsFixed(1)}:1) על רכיב '
              'קריטי — מתחת ל-WCAG-AA ($kStudioMinContrast:1)';
        }
      }
      return null;

    // 5 — SetAction legality (§7.5): the identifier must be wireable onto this
    // element; a read-only / unknown context (empty set) fails closed.
    case SetAction(:final action):
      if (action == null) return null; // clearing the action axis is safe
      final legal = <String>{...grounding.actionIdsFor(op.id), ...d.allowedActions};
      if (legal.isEmpty) {
        return 'רכיב זה אינו מקבל פעולות (קריאה-בלבד) — הפעולה נחסמה';
      }
      if (!legal.contains(action.kind)) {
        return 'פעולה «${action.kind}» אינה חוקית לרכיב זה';
      }
      return null;

    // 6 — axes with no criticalBusiness floor beyond kImmutable (handled above).
    case SetEmoji():
    case SetOrder():
      return null;
  }
}

// ─── §10 תוספת-ב — pure audit trail (dumpable to a future visual_log) ────────

/// The op-tag for an audit line (mirrors P1's `toJson` `'op'` tag, no allocation).
