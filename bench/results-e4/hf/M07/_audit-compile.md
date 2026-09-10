# 🔍 Audit: sechirut dashboard + particle counters (M07)

## Findings

new/dart-gen-bs/gen_app_sechirut_scr5.dart:24 · Dashboard counter uses wrong label constant c17="לא" instead of c18="ממצא · לא" for findings-not-sent counter · P1 wrong-result · Use c18 instead: `KvLine(label: gen_app_sechirut_scr5_c18, value: appStore.records(…`

new/dart-gen-bs/gen_app_sechirut_scr5.dart:25 · Dashboard counter uses wrong label constant c29="לא" instead of c30="תשלום · לא" for payments-not-paid counter · P1 wrong-result · Use c30 instead: `KvLine(label: gen_app_sechirut_scr5_c30, value: appStore.records(…`

## Coverage

**Verified correct:**
- Particle counter for unsent findings (px3): correctly uses c34="לא נשלחו" label on line 26 ✅
- Content file (gen_app_sechirut_scr5_content.dart): correctly defines c18="ממצא · לא" and c30="תשלום · לא" ✅
- Null-safety: all `??` operators used correctly for record field access
- Code compiles: no analyzer errors, no non-existent Dart methods
- Entity logic: counters correctly filter records with `where((r) => (r[fieldKey] ?? '') == value)`
- Spec compliance: dashboard screen spec line 11 defines 6 counters; all 6 rows rendered; values query correctly
- Pattern: first 3 counters (c2, c5, c11) and last 2 (c23, c35) use correct labels; only counters 4–5 (c17, c29) hit the duplicate-value bug where short labels replaced qualified ones

**Not checked:**
- Flutter runtime rendering (no build environment)
- Dynamic data behavior (unit tests would verify)
- Cache invalidation on appStore updates
