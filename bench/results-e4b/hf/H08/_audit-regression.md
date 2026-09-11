# 🔍 AUDITOR FINDINGS — panuy computed field

## 🚨 Critical Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · Computed field reads non-existent map index; always returns 0 · P1 wrong-result · Field c24 should compute abs((num.parse(_v[2]??'0') - num.parse(_v[4]??'0'))) not abs(num.parse(_v[8]??'0'))**

When creating a new record, `_v` is initialized with only raw input fields (indices 0–7). The form save method (line 51) and display logic (line 175) attempt to access `_v[8]`, the "הפרש רוחב" computed field, which does not exist until the record is loaded from the database. Since `_v[8]` is undefined, `num.tryParse(null ?? '')` returns `null`, coalescing to `0` via `?? 0`, so `abs(0) = 0` is saved/displayed for every new record. Contrast with c22 and c23 on the same line, which correctly compute inline: `(num.parse(_v[2]??'0') - num.parse(_v[4]??'0'))`. The spec defines `מרחק אבסולוטי = abs(הפרש רוחב)`, where "הפרש רוחב" is a computed reference (latitude difference), not a saved column. The generated code mistakenly treats it as a stored column index.

**new/dart-gen-bs/gen_app_panuy_ent1.dart:177 · Same pattern for מרחק בקמ field; reads _v[11] (non-existent) and always returns 0 · P1 wrong-result · Should compute sqrt of the distance-squared formula inline, not read _v[11]**

The `מרחק בקמ = sqrt(מרחק בריבוע)` field has the same bug: line 51 and line 177 try to read `_v[11]`, but during new record creation, only `_v[0..7]` are populated. Result: always 0.

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51,178 · Related issue: _v[13] accessed for מחיר לשעתיים, but c28 is hardcoded to empty string · P2 minor · Inconsistent field handling**

Line 51 references `_v[13]` (should be מחיר לשעתיים derived field); line 178 then assigns it. But line 51 stores `gen_app_panuy_ent1_c28: ''` (hardcoded empty), contradicting the `_v[13]` read on the same line. This creates confusion about whether the field is computed or input.

## ✅ Verified Correct

- **Spec was updated correctly**: panuy.txt line 4 now includes `מרחק אבסולוטי = abs(הפרש רוחב)` as specified.
- **abs() function is valid**: Line 17 defines `num _m_abs(num x) => x.abs();` which is correct Dart (num.abs() is a valid method).
- **Police gates passed**: All 53 gates passed; abs() is counted exactly 1× as expected.
- **Compilation**: Zero analyzer errors reported; syntax is valid.
- **No orphan files**: gen_app_panuy_* files are correctly scoped and not duplicated.
- **No state leakage to other apps**: byte_identical_others passed; no other app generated files modified.

## Coverage

**Checked**: Field reference chain (spec → generated constants → computed logic); inline arithmetic for c22/c23 vs deferred indices for c24/c25/c26; _v map initialization and lifecycle (new record vs edit); function validity (abs() is num method, not String method). **Could not check**: Runtime behavior on actual form interaction (no test harness available); whether the database schema actually has columns for intermediate computed fields; downstream widgets that consume c24 values.

**Verdict: TASK NOT DONE · The computed field exists in spec and is syntactically valid, but its computation is broken for new records, yielding always-0 instead of abs(latitude difference).**
