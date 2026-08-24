// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _locationToAvailability — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/equipment_stock_join.dart:69-129 (61 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): availabilityFor, annotate
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
StockAvailability _locationToAvailability(String location) =>
    location == 'warehouse'
        ? StockAvailability.warehouse
        : StockAvailability.site;

/// PURE join (the E2 cross-file contract, frozen — unit-tested by E2b):
/// resolve one [equipmentLabel] against the employer's [stock]. Matching is
/// WHOLE-TOKEN aware (both sides are normalized then split on space) — a stock
/// item matches the label iff:
///   • the normalized name EQUALS the normalized label (exact, any token
///     count), OR
///   • the name has ≥2 tokens AND its token-sequence is a contiguous
///     sub-sequence of the label's tokens, OR
///   • the label has ≥2 tokens AND its token-sequence is a contiguous
///     sub-sequence of the name's tokens.
/// A SINGLE-token name/label matches ONLY by exact equality — so a generic
/// short stock token (מפתח/שקע/עט) never fabricates availability merely by
/// sitting inside a longer label, and (token-based) no mid-word or
/// cross-space substring can ever match. Otherwise — empty stock or no
/// token-aligned correspondence — returns [StockAvailability.unknown]. NEVER
/// fabricates a correspondence. First match wins in the given (already
/// deterministic, warehouse-first) stock order.
StockAvailability availabilityFor(
  String equipmentLabel,
  List<EmployerStockItem> stock,
) {
  final label = _normalize(equipmentLabel);
  // No usable label → nothing to honestly match against.
  if (label.isEmpty) return StockAvailability.unknown;
  final labelTokens = _tokens(label);

  for (final item in stock) {
    final name = _normalize(item.name);
    if (name.isEmpty) continue;
    final nameTokens = _tokens(name);

    // Honest match: exact normalized equality, OR a whole-token contiguous
    // sub-sequence in either direction (the ≥2-token guard lives in
    // _isContiguousSubsequence, so a lone generic token cannot fabricate a
    // hit). The label may carry extra qualifiers like '(PTFE)'/'12"' that the
    // stock name omits, or vice-versa — those survive as a token subsequence.
    final hit = name == label ||
        _isContiguousSubsequence(nameTokens, labelTokens) ||
        _isContiguousSubsequence(labelTokens, nameTokens);
    if (hit) return _locationToAvailability(item.location);
  }
  return StockAvailability.unknown;
}

/// Optional convenience for the sheet: annotate a list of [labels] against the
/// employer's [stock] in one pass, preserving input order. Each entry pairs the
/// ORIGINAL (un-normalized) label with its [availabilityFor] result.
List<({String label, StockAvailability availability})> annotate(
  List<String> labels,
  List<EmployerStockItem> stock,
) =>
    [
      for (final label in labels)
        (label: label, availability: availabilityFor(label, stock)),
    ];

