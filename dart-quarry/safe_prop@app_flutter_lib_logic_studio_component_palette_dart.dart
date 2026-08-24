// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _safeProp — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:284-438 (155 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, promptSafeText, accepted, rejected, validateAddComponent, templateFor, matchCatalogActionId, unmodifiable
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _safeProp(String key, String value) {
  if (kLabelProps.contains(key)) {
    return promptSafeText(value, maxLen: 200, collapseWhitespace: true);
  }
  if (kBodyProps.contains(key)) {
    // Length-cap IN PLACE (promptSafeText default: 600 chars, no collapse) — a
    // multi-line body keeps its line structure while an over-long payload is
    // still bounded (§6).
    return promptSafeText(value);
  }
  return value.trim();
}

/// A proposed component-add — mirrors the future `AddComponent` ConfigOp (step 69):
/// a [type], its [props] map, and an optional attached [actionId] (§9). Pure data.
class AddComponentRequest {
  const AddComponentRequest({
    required this.type,
    this.props = const {},
    this.actionId,
  });

  /// The component type to add (typically already grounded via
  /// [matchComponentTypeName] before an [AddComponentRequest] is built).
  final ComponentType type;

  /// The proposed props (free-text values are DEFANGED in the verdict, §6).
  final Map<String, String> props;

  /// The attached action id, grounded against the step-72 catalog when the template
  /// is `optionalAction:true` (§9); `null` when none is attached.
  final String? actionId;
}

/// The verdict of [validateAddComponent]: either ACCEPTED (carrying the resolved
/// [template] + the DEFANGED [safeProps] / [safeActionId] the caller should store,
/// §6) or REJECTED (carrying a non-empty Hebrew [reasonHe] — never a silent drop).
/// Mirrors the `SafetyVerdict{applied, blocked:(op, reasonHe)}` idiom (step 77).
class AddComponentVerdict {
  /// An ACCEPT — the add is legal and well-formed; [safeProps] are the defanged
  /// values to store, [safeActionId] the grounded attached action (or `null`).
  const AddComponentVerdict.accepted(
    this.template, {
    required this.safeProps,
    this.safeActionId,
  })  : ok = true,
        reasonHe = null;

  /// A REJECT — [reasonHe] is a non-empty Hebrew reason shown to the owner.
  const AddComponentVerdict.rejected(this.reasonHe)
      : ok = false,
        template = null,
        safeProps = const {},
        safeActionId = null;

  /// True ⇔ the add is legal and well-formed.
  final bool ok;

  /// The Hebrew rejection reason — non-null ⇔ `!ok`, never empty on reject.
  final String? reasonHe;

  /// The resolved template — non-null ⇔ `ok`.
  final ComponentTemplate? template;

  /// The DEFANGED props (free-text run through `promptSafeText`, §6) the caller
  /// should store — empty on reject.
  final Map<String, String> safeProps;

  /// The grounded attached action id (or `null`) — always `null` on reject.
  final String? safeActionId;
}

/// Validate a proposed [req] dropped into a container of kind [container], given
/// [existingOfType] instances of the SAME component already present there. Returns
/// an ACCEPT (with defanged props) or a REJECT with a Hebrew reason. Pure, TOTAL,
/// NEVER throws. The four rejection axes are exactly:
///   §4  — an illegal / non-content container ([canPlace] false);
///   §5  — any required prop missing (after §6 defanging — no half-built add);
///   §9  — an attached action that is unsupported by the type, or not in the
///         step-72 catalog closed set;
///   §10 — an add that would exceed the [ComponentTemplate.maxPerContainer] ceiling.
/// Grounding matches the step-72 idiom (closed set → deterministic verify).
AddComponentVerdict validateAddComponent(
  AddComponentRequest req, {
  required ElementKind container,
  int existingOfType = 0,
}) {
  final t = templateFor(req.type);
  // Fail-closed — unreachable while the palette covers every enum value (pinned by
  // a golden test), but a dangling type resolves to NO template (never a guess).
  if (t == null) {
    return const AddComponentVerdict.rejected('רכיב לא מוכר');
  }

  // §4 — the target must be a legal CONTENT container for this type. `action` /
  // `text` / `theme` are never in `allowedContainers`, so a "button into a
  // control / auth surface" is rejected HERE (`validateSafe` step-77 is the second
  // gate, on `kImmutable` ids).
  if (!t.allowedContainers.contains(container)) {
    return AddComponentVerdict.rejected(
      'לא ניתן להוסיף ${t.he} לתוך מיכל מסוג «${container.name}» — '
      'רכיבים נוספים רק לתוך מיכל תוכן (container / list)',
    );
  }

  // §6 — defang free-text props up front, so the §5 presence check tests the
  // SANITISED value (a label that is only whitespace / newlines is "missing").
  final safe = <String, String>{
    for (final e in req.props.entries) e.key: _safeProp(e.key, e.value),
  };

  // §5 — every required prop must be supplied non-empty (after defanging). The
  // special key `'actionId'` is satisfied by the dedicated [req.actionId] field
  // (an attached action), not the props map. A miss DROPS the op.
  for (final key in t.requiredProps) {
    final value =
        key == 'actionId' ? (req.actionId ?? '').trim() : (safe[key] ?? '');
    if (value.isEmpty) {
      return AddComponentVerdict.rejected('חסר שדה חובה «$key» עבור ${t.he}');
    }
  }

  // §9 — an attached action is legal ONLY on an `optionalAction` template, and only
  // when it grounds to the step-72 catalog closed set (a new component cannot
  // receive an action illegal for its context).
  final attached = (req.actionId ?? '').trim();
  String? groundedAction;
  if (attached.isNotEmpty) {
    if (!t.optionalAction) {
      return AddComponentVerdict.rejected('${t.he} אינו תומך בפעולה מוצמדת');
    }
    groundedAction = matchCatalogActionId(attached);
    if (groundedAction == null) {
      return AddComponentVerdict.rejected(
        'פעולה לא-חוקית «$attached» — אינה בקטלוג הפעולות',
      );
    }
  }

  // §10 — a per-container flood ceiling (e.g. divider): adding one more must not
  // exceed [maxPerContainer].
  final cap = t.maxPerContainer;
  if (cap != null && existingOfType >= cap) {
    return AddComponentVerdict.rejected(
      'לא ניתן להוסיף עוד ${t.he} — מוגבל ל-$cap במיכל אחד',
    );
  }

  return AddComponentVerdict.accepted(
    t,
    safeProps: Map<String, String>.unmodifiable(safe),
    safeActionId: groundedAction,
  );
}

