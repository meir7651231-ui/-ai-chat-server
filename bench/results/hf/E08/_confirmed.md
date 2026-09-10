# Validation Report — E08 sechirut counter

## Findings Verified

**P0-001** · CONFIRMED · gen_app_sechirut_px1.dart:35 `where((r) => (r[gen_app_sechirut_px1_c8] ?? '') == gen_app_sechirut_px1_c9)` with c8='תיק מתווך' (line 10 of px1_content.dart) when field is actually keyed as c19='מתווך' (line 21 of px1_content.dart); filter will return zero because record keys do not contain concatenated entity-field names · Replace gen_app_sechirut_px1_c8 with gen_app_sechirut_px1_c19

**P1-002** · CONFIRMED · gen_app_sechirut_scr5.dart:25 uses label from gen_app_sechirut_scr5_c29='כן' (line 31 of scr5_content.dart) instead of particle name 'עם מתווך'; dashboard displays enum value not semantic label, confusing user about what metric counts · Change gen_app_sechirut_scr5_c29 from 'כן' to 'עם מתווך'

## Coverage Sweep

- Reviewed px1 particle screen (lines 1–44 of gen_app_sechirut_px1.dart, all constants 0–130+ in px1_content.dart): particle label c6 correct; filter field key c8 wrong.
- Reviewed dashboard screen (lines 1–31 of gen_app_sechirut_scr5.dart, constants 0–39 in scr5_content.dart): filter logic correct (c33='מתווך', c34='כן'); display label c29 wrong.
- Verified spec additions (machtzev/generator/specs-ds/sechirut.txt lines 11–12 and 22–23): counter correctly added to dashboard entity, particle correctly defined.
- No Dart-specific issues (null-safety pattern `?? ''` is safe; field accesses are string-keyed; no `sqrt/min/max/pow` misuse).
- No cross-app leakage (px1 and scr5 are both sechirut; no mutations to other apps).

## Regression Auditor Discrepancy

_audit-regression.md claimed "No genuine defects found" but only checked px1 particle, not scr5 dashboard. The px1 label (c6) is indeed correct, but px1's filter (c8) is broken, and scr5's label (c29) is broken. Both need fixing.

## FIX-LIST

FIX-LIST: P0-001, P1-002
