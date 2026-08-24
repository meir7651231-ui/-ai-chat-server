// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · dryCountScope — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:484-564 (81 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): expandScope, buildScopeEdit, empty, parseConfigEdit, jsonEncode
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ScopeCount dryCountScope(String token, RegistryView registry) {
  final expanded = expandScope(token, registry);
  if (expanded.length > kStudioMaxBatch) {
    return ScopeCount._(
      const <String>[],
      expanded.length,
      _batchRejectHe(expanded.length),
    );
  }
  return ScopeCount._(expanded, expanded.length, null);
}

/// The outcome of a BROADCAST build ([buildScopeEdit]). Carries the step-75 [result]
/// (its `ops` survived per-field validation; `dropped` counts the ones an element
/// rejected) plus the early-ceiling verdict: when [rejectedReasonHe] is non-null the
/// broadcast was refused BEFORE building (over [kStudioMaxBatch]) and [result] is empty.
class ScopeEditResult {
  const ScopeEditResult({
    required this.token,
    required this.requested,
    required this.result,
    required this.rejectedReasonHe,
  });

  final String token;

  /// How many real ids the scope expanded to (pre-ceiling / pre-validation).
  final int requested;

  /// The step-75 parse outcome (registry-validated ops + dropped count).
  final ConfigEditResult result;

  /// Non-null ⇒ refused early over the batch ceiling (then [result] is empty).
  final String? rejectedReasonHe;

  bool get rejected => rejectedReasonHe != null;

  /// The surviving, registry-validated broadcast ops (empty when [rejected]).
  List<ConfigOp> get ops => result.ops;
}

/// Build a BROADCAST edit: stamp ONE desired [editTemplate] (an op map WITHOUT an
/// `id` — e.g. `{'op': 'setStyle', 'style': {'colorToken': 'brand'}}`) onto every REAL
/// id the [token] expands to, then run the whole array through the step-75
/// [parseConfigEdit] pipeline so EACH op is independently registry-validated and an
/// element that rejects a field drops ONLY its own op (§4/§9 — the pipeline is never
/// bypassed). The §10 dry-count guards FIRST: an over-[kStudioMaxBatch] scope is refused
/// before any op is built. NO id comes from a model list — [expandScope] enumerates the
/// registry.
ScopeEditResult buildScopeEdit(
  String token,
  Map<String, Object?> editTemplate,
  RegistryView registry,
) {
  final counted = dryCountScope(token, registry);
  if (counted.rejected) {
    return ScopeEditResult(
      token: token,
      requested: counted.requested,
      result: const ConfigEditResult.empty(),
      rejectedReasonHe: counted.rejectedReasonHe,
    );
  }
  // Stamp the edit onto each REAL target (the per-target `id` is applied LAST so a stray
  // `id` in the template can never override it), then VALIDATE through the existing
  // pipeline — the SAME JSON path a model reply takes (never a bypass).
  final opsJson = <Map<String, Object?>>[
    for (final id in counted.ids) {...editTemplate, 'id': id},
  ];
  return ScopeEditResult(
    token: token,
    requested: counted.requested,
    result: parseConfigEdit(jsonEncode(opsJson), registry),
    rejectedReasonHe: null,
  );
}

/// The Hebrew scope LABEL for a token (§6) — the human phrase step-79's preview shows
/// beside the broadcast count ("כל הכפתורים: 12 שינויים" / "מסך «cart»"). Distinct from
/// step 74's `scopeLabel` (which prefixes "מתוך: " for the Stage-B target line); this is
/// the bare phrase for a count row.
