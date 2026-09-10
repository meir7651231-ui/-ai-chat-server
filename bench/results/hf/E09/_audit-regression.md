# Audit Report: peruk25 Numeric & Computed Fields (E09)

## Findings
No findings.

## Coverage
**Verified sound:**
- Field definitions: סכום פיצויים (type: num, index 6 → c19) and פיצויים לשנה (type: text, index 7 → c20) correctly added to peruk25.json and wired into gen_app_peruk25_ent1.dart
- Computed field formula: line 49 (save) and line 162 (display) both use identical formula `(num.tryParse(_v[6] ?? '') ?? 0) * 12`; parsed safely with default 0 fallback; result converted to string with `.toStringAsFixed(2)` for persistence; displayed via _calc() widget which re-formats with 2 decimals — consistent and correct
- UI wiring: c19 is editable DsNumberField (line 161); c20 is read-only computed display (line 162); both appear in record labels (line 30, 90, 96, 98, 173)
- Data flow: field values stored/loaded correctly via appStore in _save() and _edit(); c20 persisted as computed string; edit mode recovers both c19 and c20 from stored record (line 61)
- No cross-app state leakage: grep confirms field names only in peruk25.txt, peruk25.json, and generated peruk25 Dart modules; no substring collisions with other apps
- No regressions: police.md byte_identical_others ✅ confirms only intended files modified; no hand-edits in generated/; stage names unchanged; other peruk apps unaffected
- Spec compliance: peruk25.txt line 6 syntax correct ("fieldname = formula"); header update reflects 8 total fields (6 original + 2 new)
- Dart math sound: num.tryParse returns num?, ?? 0 provides safe default, * 12 is valid num multiplication, .toStringAsFixed(2) produces well-formed string — all Dart null-safety and type-safe

**Could not verify (not in scope for read-only audit):**
- Runtime behavior in flutter (no Flutter installed)
- Downstream consumer apps if any depend on peruk25 entity schema
- Historical data migration if database contains existing תיק records without c20 field

