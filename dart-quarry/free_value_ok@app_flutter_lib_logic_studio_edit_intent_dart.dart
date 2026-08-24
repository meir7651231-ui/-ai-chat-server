// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _freeValueOk — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:231-286 (56 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): allowedValues, matchValue
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _freeValueOk(RegistryView reg, String target, String prop, String? value) {
  if (value == null) return true;
  if (reg.allowedValues(target, prop).isEmpty) return true; // free content.
  return matchValue(reg, target, prop, value) != null;
}

/// Resolve every string token of a [style] against its per-element closed set (where
/// the registry constrains it), returning the rebuilt style with REGISTRY-REAL tokens
/// — or `ok:false` when any CONSTRAINED token is invented (drop the whole op). A null
/// style (a "clear") is passed through unchanged.
({bool ok, CfgStyle? style}) _resolveStyle(
  RegistryView reg,
  String target,
  CfgStyle? style,
) {
  if (style == null) return (ok: true, style: null);
  final color = _resolveToken(reg, target, 'color', style.colorToken);
  if (!color.ok) return (ok: false, style: null);
  final bg = _resolveToken(reg, target, 'bg', style.bgToken);
  if (!bg.ok) return (ok: false, style: null);
  final weight = _resolveToken(reg, target, 'weight', style.weightToken);
  if (!weight.ok) return (ok: false, style: null);
  final size = _resolveToken(reg, target, 'size', style.sizeToken);
  if (!size.ok) return (ok: false, style: null);
  return (
    ok: true,
    style: CfgStyle(
      colorToken: color.value,
      bgToken: bg.value,
      weightToken: weight.value,
      sizeToken: size.value,
      fontScale: style.fontScale, // clamped by CfgStyle itself (no closed set).
      pad: style.pad, // an EdgeKey enum — validated by CfgStyle.fromJson.
    ),
  );
}

/// Ground ONE style token: `null` passes (absent); an UNCONSTRAINED prop (empty
/// closed set) keeps the raw token; a CONSTRAINED prop must resolve via `matchValue`
/// (else `ok:false` → drop), and the RESOLVED value is returned.
({bool ok, String? value}) _resolveToken(
  RegistryView reg,
  String target,
  String prop,
  String? token,
) {
  if (token == null) return (ok: true, value: null);
  if (reg.allowedValues(target, prop).isEmpty) {
    return (ok: true, value: token); // unconstrained axis — free.
  }
  final resolved = matchValue(reg, target, prop, token);
  return resolved == null ? (ok: false, value: null) : (ok: true, value: resolved);
}

/// The candidate action id from a `setAction` op: the bare string per the grammar
/// (edit_prompt.dart:113), or a nested `{kind}` (the CfgAction shape). Blank → null.
