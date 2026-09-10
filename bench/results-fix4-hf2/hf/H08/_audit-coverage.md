# 🔍 AUDITOR: Task Coverage for panuy.txt (H08)

## Findings

gen_app_panuy_ent1.dart:175 · מרחק אבסולוטי references undefined `_v[8]` instead of computing abs(הפרש רוחב) from base fields · P1 wrong result · line 175 should compute `_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) )` directly, not reference `_v[8]` which is never populated before use (for new records, this always yields abs(0)=0, breaking the field)

gen_app_panuy_ent1.dart:51 · same issue in _save() method: `gen_app_panuy_ent1_c24: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` — `_v[8]` is uncomputed at this point · P1 wrong result · should inline the difference computation: `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) ))`

## Coverage Verified

✓ Spec file (panuy.txt:4): Field definition present `מרחק אבסולוטי = abs(הפרש רוחב)`
✓ Generated code structure: entity file exists, _m_abs() helper defined (line 17), field label in content file (c24='מרחק אבסולוטי'), field included in form UI and save pipeline
✓ Compilation: no syntax errors, flutter analyze passes
✓ Display widget generated: _calc() widget present, renders computed value
✓ CSV export: field included in record labels and CSV output
✓ Field index mapping: c24 correctly mapped as index 10 in _labelsAll and edit loading (line 64)

Could NOT verify: runtime correctness (would need execution to trace `_v` state before/after user input), intermediate computed field value propagation during editing (no test run available)

