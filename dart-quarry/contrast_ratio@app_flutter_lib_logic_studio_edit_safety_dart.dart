// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _contrastRatio — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:278-372 (95 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): computeLuminance, validateSafe, elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double _contrastRatio(Color a, Color b) {
  final la = a.computeLuminance();
  final lb = b.computeLuminance();
  final hi = la > lb ? la : lb;
  final lo = la > lb ? lb : la;
  return (hi + 0.05) / (lo + 0.05);
}

// ─── validateSafe — the backstop (§4) ────────────────────────────────────────

/// Partition [ops] into safe-to-stage vs blocked, checking EACH against the REAL
/// frozen descriptor metadata (see the file header for the reconciliation). Reads
/// `kImmutable` / `kind` / criticalBusiness / `kRoleFloor` from the concrete
/// descriptor and grounds value/action legality through [view] (defaulting to the
/// SAME source as [registry], so they never disagree). Pure, TOTAL, never throws.
///
/// [persona] is the `roleProvider`-dialect layer a `SetHidden` would apply to
/// (`null`/'' = the GLOBAL/contractor base every persona inherits; a non-empty
/// string = ONE persona's layer) — it drives the step-78 role-visibility floor.
/// [priorSessionOps] is the count of ops ALREADY staged in this draft session, so
/// the cumulative [kStudioSessionBudget] can be enforced across utterances. The
/// batch/session/registry ceilings are BATCH-LEVEL: a breach refuses the WHOLE
/// batch (every op → blocked) BEFORE the per-op backstop — nothing partial (§4).
///
/// ⚠️ ADVISORY (R1-1): a green verdict is NOT authorization — `publishConfig`
/// re-runs this server-side before anything goes live (see the file header).
SafetyVerdict validateSafe(
  List<ConfigOp> ops, {
  List<ElementDescriptor> registry = kElementRegistry,
  RegistryView? view,
  String? persona,
  int priorSessionOps = 0,
}) {
  final grounding = view ?? ElementRegistryView(registry);
  // ── Step 78 · BATCH-LEVEL ceilings FIRST — a breach fails CLOSED and WHOLE: the
  // entire batch is refused (every op → blocked with the Hebrew reason), so the
  // owner reduces the scope. Runs before the per-op backstop (nothing partial).
  final ceiling = _batchCeilingReason(ops, grounding, priorSessionOps);
  if (ceiling != null) {
    return SafetyVerdict(
      applied: const [],
      blocked: [for (final op in ops) BlockedEntry(op, ceiling)],
    );
  }
  final applied = <ConfigOp>[];
  final blocked = <BlockedEntry>[];
  for (final op in ops) {
    final reason = _reasonToBlock(op, registry, grounding, persona);
    if (reason == null) {
      applied.add(op);
    } else {
      blocked.add(BlockedEntry(op, reason));
    }
  }
  return SafetyVerdict(applied: applied, blocked: blocked);
}

/// The BATCH-LEVEL ceiling check (§4 · step 78) — a non-empty Hebrew reason when the
/// whole [ops] batch must be refused, or `null` when it is within every ceiling.
/// Order: per-utterance (the committed [kStudioMaxBatch]=25, REUSED not redefined) →
/// cumulative session budget → registry-breadth fraction. Fail-closed and WHOLE
/// (mirrors step-76 `dryCountScope`); an empty batch is vacuously fine.
String? _batchCeilingReason(
  List<ConfigOp> ops,
  RegistryView grounding,
  int priorSessionOps,
) {
  if (ops.isEmpty) return null;
  // 1 — PER-UTTERANCE ceiling: REUSE the step-76 committed value (never redefined),
  // so the 25/26 boundary its tests pin stays byte-identical.
  if (ops.length > kStudioMaxBatch) {
    return 'השינוי נרחב מדי — ${ops.length} פעולות (מעל התקרה '
        '$kStudioMaxBatch). צמצם את הטווח.';
  }
  // 2 — CUMULATIVE session budget across utterances in one draft.
  final cumulative = priorSessionOps + ops.length;
  if (cumulative > kStudioSessionBudget) {
    return 'השינוי נרחב מדי לסשן — $cumulative פעולות מצטברות '
        '(מעל $kStudioSessionBudget). צמצם.';
  }
  // 3 — REGISTRY-breadth fraction (R1-8): distinct targets vs the whole registry.
  final size = grounding.elementIds().length;
  final distinct = <String>{for (final op in ops) op.id}.length;
  if (size > 0 && distinct > size * kStudioMaxRegistryFraction) {
    final pct = (kStudioMaxRegistryFraction * 100).round();
    return 'השינוי נרחב מדי לסשן — נוגע ב-$distinct רכיבים '
        '(מעל $pct% מהמרשם). צמצם.';
  }
  return null;
}

/// §10 תוספת-א — a pure, ADVISORY Hebrew soft-warning for a batch that is large but
/// still UNDER the hard per-utterance ceiling ([kStudioSoftBatchWarn] ≤ n ≤
/// [kStudioMaxBatch]); `null` otherwise. NOT a block — a UX nudge only; [validateSafe]
/// never calls it, so it can never disturb the committed hard 25.
