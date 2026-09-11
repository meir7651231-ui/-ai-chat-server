# 🔍 Auditor Report — State-Leakage & Regression Lens · M10 (calendar)

**Verdict: No findings**

## Scope Checked
- **Lens**: State-leakage (cross-app contamination) + regression (broken functionality) + orphans + over-triggering + shared-list mutation
- **Source change**: `machtzev/generator/specs-ds/calendar.txt` — added "משך בדקות" (numeric) + "משך בשעות = משך בדקות / 60" (computed)
- **Supporting changes**: spec-lang.data.json (added "דקות" to typeNum), apps/calendar.json (both fields added), LEARNINGS.md (documented rule)

## Key Verifications

### Formula Correctness (Line 51, gen_app_calendar_ent1.dart)
```dart
gen_app_calendar_ent1_c15: ((num.tryParse(_v[5] ?? '') ?? 0)  / 60).toStringAsFixed(2)
```
- ✅ Parses field 5 (minutes input) as `num` with fallback to 0
- ✅ Divides by 60: minutes → hours (mathematically correct)
- ✅ Formats to 2 decimals via `.toStringAsFixed(2)` (no precision loss)
- ✅ Display formula (line 163) correctly passes unformatted `num` to `_calc()` widget
- ✅ Field constant names correct: c14='משך בדקות' (minutes), c15='משך בשעות' (hours)

### No State-Leakage
- ✅ **byte_identical_others**: Other apps' generated output unchanged (police gate passed)
- ✅ **typeNum addition safe**: "דקות" added to spec-lang.data.json's typeNum list; used only as field-name hint; peruk23.txt pre-existing use of "דקות" in content is unaffected (different parsing context)
- ✅ **No orphans**: no_orphans gate passed; no gen_app_calendar_* files in new/ left orphaned

### No Regression
- ✅ **Generator passes**: regen_ok ✅, compiles ✅, dart_math_sane ✅, gates_pass ✅
- ✅ **Field count**: 7 fields declared (c1 label confirms); indices 0–6 map to _v[], computed field correctly reads from input field (_v[5])
- ✅ **No cross-contamination**: peruk23.txt not modified; its use of "דקות" in content (e.g., "סדר דקות") pre-existed and is safe (content ≠ field-name context)

### Verifiable Defects
- None found. All gates passed. Formula verified correct both for storage (line 51, formatted) and display (line 163, numeric). No over-triggering of typeNum hint on other specs. No mutation of shared data.

---

**Reviewed**: 
- git diff HEAD -- machtzev/ (key changes: calendar.txt, spec-lang.data.json, apps/calendar.json, LEARNINGS.md, + quarantine of pipeline scripts ship.mjs/tighten-types.mjs/one.mjs which is correct)
- Generated code: gen_app_calendar_ent1.dart (formula & display both verified)
- Generated content: gen_app_calendar_ent1_content.dart (constants verified)
- Police report checks: all critical gates passed
- Cross-app impact: peruk23.txt, other specs — no contamination
