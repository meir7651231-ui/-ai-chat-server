# Audit: Counter Particle Field Key Mismatch (peruk08)

## Findings

new/dart-gen-bs/gen_app_peruk08_px1.dart:35 · counter particle filter uses scoped field name `תיק האם כבר פנו למוכר` instead of unscoped `האם כבר פנו למוכר` · P1 wrong result · change `r[gen_app_peruk08_px1_c123]` to `r[gen_app_peruk08_px1_c13]`

## Defect Details

**Location**: `gen_app_peruk08_px1.dart:35` (counter particle "לא פנו")

**Issue**: The counter filter accesses record fields with an inconsistent key pattern:
- Table (line 28): `(r[gen_app_peruk08_px1_c13] ?? '')` where `c13 = 'האם כבר פנו למוכר'` (unscoped field name)
- Counter (line 35): `(r[gen_app_peruk08_px1_c123] ?? '')` where `c123 = 'תיק האם כבר פנו למוכר'` (scoped entity.field name)

**Root cause**: The code generator produced a scoped field name for the counter constant, but AppStore record access uses unscoped field names (as evidenced by the table pattern). When records are keyed by unscoped names, `r['תיק האם כבר פנו למוכר']` returns `null`, causing the filter to always fail.

**Runtime behavior**: 
- Filter evaluates: `(null ?? '') == 'לא'` → `'' == 'לא'` → `false`
- Result: counter always returns 0, regardless of actual data

**Why police didn't catch this**: Police checks compile-time syntax correctness and analyzer errors. This is a semantic/logic defect that compiles valid Dart but produces wrong runtime behavior. The `??` operator prevents a null-safety error, masking the logic bug.

## Coverage

✅ **Checked:**
- Enum field successfully created with 3 closed values (כן, לא, לא יודע) in peruk08.json
- Counter particle syntax valid: `מונה(תיק: האם כבר פנו למוכר=לא)` correctly parsed
- Dart code compiles with 0 analyzer errors
- Spec file correctly modified with enum and counter definitions
- All generated files syntactically valid

❌ **Could not check without execution:**
- Actual runtime counter value (would fail at runtime on real data)
- AppStore record key naming convention (assumed unscoped based on table pattern)
- Cross-entity field reference semantics

## Verdict

Task partially complete. Enum successfully created, counter particle wired, but counter logic broken due to field key mismatch. Fix required before deployment.
