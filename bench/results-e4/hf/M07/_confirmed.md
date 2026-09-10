# VALIDATOR REPORT — M07 (sechirut) — 2026-09-10

## Machine Gate Verdict
- px_counter: ✅ (consts=1, particle counter added)
- hub_label: ❌ 0× (dashboard counter labels not corrected)
- All other generic gates: ✅

## Findings Verified Against Bytes

### F1: Dashboard counter #4 (unsent findings) uses short label instead of qualified label
- **Verdict:** CONFIRMED · P1
- **Evidence:** new/dart-gen-bs/gen_app_sechirut_scr5.dart:24, line 2 col 2
  - Code: `KvLine(label: gen_app_sechirut_scr5_c17, value: appStore.records('app_sechirut_ent3').where((r) => (r[gen_app_sechirut_scr5_c21] ?? '') == gen_app_sechirut_scr5_c22).length...`
  - Content file gen_app_sechirut_scr5_content.dart line 19: `const String gen_app_sechirut_scr5_c17 = 'לא';`
  - Should be line 20: `const String gen_app_sechirut_scr5_c18 = 'ממצא · לא';`
  - Issue: renders ambiguous label "לא" (same as unpaid payments counter in row 3); spec line 11 requires `מונה(ממצא: נשלח=לא)` with qualified label per qualified-label pattern (rows 1–2 cols 1–2 all qualified except this one; rows 1–2 cols 2 both should be "ממצא · X")
  - Fix: Replace `gen_app_sechirut_scr5_c17` with `gen_app_sechirut_scr5_c18` in line 24 col 2 KvLine widget

### F2: Dashboard counter #5 (unpaid payments) uses short label instead of qualified label
- **Verdict:** CONFIRMED · P1
- **Evidence:** new/dart-gen-bs/gen_app_sechirut_scr5.dart:25, line 3 col 2
  - Code: `KvLine(label: gen_app_sechirut_scr5_c29, value: appStore.records('app_sechirut_ent4').where((r) => (r[gen_app_sechirut_scr5_c33] ?? '') == gen_app_sechirut_scr5_c34).length...`
  - Content file gen_app_sechirut_scr5_content.dart line 31: `const String gen_app_sechirut_scr5_c29 = 'לא';`
  - Should be line 32: `const String gen_app_sechirut_scr5_c30 = 'תשלום · לא';`
  - Issue: renders ambiguous label "לא" (same as unsent findings counter in row 2); spec line 11 requires `מונה(תשלום: שולם=לא)` with qualified label per pattern
  - Fix: Replace `gen_app_sechirut_scr5_c29` with `gen_app_sechirut_scr5_c30` in line 25 col 2 KvLine widget

### F3: Particle counter (findings screen) uses correct label
- **Verdict:** FALSE-POSITIVE (mislabeled as finding; this is correct) · No action
- **Evidence:** new/dart-gen-bs/gen_app_sechirut_px3.dart:26
  - Code: `KvLine(label: gen_app_sechirut_px3_c34, value: appStore.records('app_sechirut_ent3').where((r) => (r[gen_app_sechirut_px3_c36] ?? '') == gen_app_sechirut_px3_c37).length...`
  - Content file gen_app_sechirut_px3_content.dart line 36: `const String gen_app_sechirut_px3_c34 = 'לא נשלחו';`
  - Correctly uses particle-specific label "לא נשלחו" (spec line 25: `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)`)
  - Pattern applied: counter particles do NOT use qualified entity prefix, they use domain-specific readable label
  - ✅ Correctly implemented

## Verification Scope
✅ Dart null-safety: `(r[field] ?? '')` guards on all counter filters  
✅ Code compiles: analyzer returns 0 errors  
✅ Entity logic: filters correct (ent3/ent4 with field-equals-value)  
✅ No orphans: all generated files tied to spec  
✅ Spec chain intact: line 11 & 25 → content constants → widget labels  
✅ No cross-app leakage: byte_identical_others gate passed  

⚠️ **Not verified (Flutter not installed):** runtime UI rendering of ambiguous labels in dashboard; whether users can distinguish the two "לא" counters on sight

---

## FIX-LIST

1. **P1-F1:** new/dart-gen-bs/gen_app_sechirut_scr5.dart:24 · Replace `gen_app_sechirut_scr5_c17` with `gen_app_sechirut_scr5_c18` in "unsent findings" counter KvLine widget (row 2, col 2)
2. **P1-F2:** new/dart-gen-bs/gen_app_sechirut_scr5.dart:25 · Replace `gen_app_sechirut_scr5_c29` with `gen_app_sechirut_scr5_c30` in "unpaid payments" counter KvLine widget (row 3, col 2)

---

## Summary
**Task status: NOT DONE** — 1 of 2 requirements complete.  
✅ Particle counter (screen): correct label `לא נשלחו`  
❌ Dashboard counter: 2 labels wrong (using c17, c29 instead of c18, c30); fixes are one-line constant replacements each.  
Both issues confirmed; both fixes safe (no behavioral change, only label text).
