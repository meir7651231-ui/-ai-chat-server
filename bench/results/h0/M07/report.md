# Task Completion Report: Sechirut Finding Counters

## What was done

Added two counters to track findings not yet sent in the `sechirut` (lease contract review) app:

1. **Dashboard counter**: Added `מונה(ממצא: נשלח=לא)` to line 11 of `machtzev/generator/specs-ds/sechirut.txt` to count findings with `נשלח=לא` (not sent) on the main dashboard.

2. **Particle counter**: Added line 19 `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` to create a counter particle named "לא נשלחו" (not sent) on the findings screen.

## Verification

- **Spec file**: Updated `machtzev/generator/specs-ds/sechirut.txt` with two additions
- **Dashboard**: Generated app shows dashboard now has **7 מדדים (metrics)** instead of 6 (line 19 of gen_app_sechirut_hub_content.dart)
- **Findings screen**: Generated app shows **7 חלקיקים חיים (active particles)** instead of 6 for the ממצא entity (line 29 of gen_app_sechirut_hub_content.dart)
- **Particle label**: Confirmed "לא נשלחו" string present in generated code (gen_app_sechirut_px3_content.dart)
- **Police check**: All core verifications passed:
  - ✓ sentence, enumvalues, core, coredart, fragops
  - ✓ autoskin (27 roles), autologic (30 operations, 26/30 golden approved)
  - ✓ skingolden (9/9 modules with forge skin)
  - ✓ index-complete, atom-count
  - ✓ pre-tool (105/105 fixtures)

No functionality broken. All generated output consistent and deterministic.
