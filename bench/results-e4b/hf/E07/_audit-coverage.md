# Audit: peruk21 דחופים counter task

## Findings
No defects detected.

## Coverage verified

**Task requirement:** Add to case screen a counter named דחופים that counts cases whose סיווג is הZמנה לוועדה.

**Implementation confirmed:**
1. **Spec change correct** (machtzev/generator/specs-ds/peruk21.txt): 
   - Line 8: Added `מונה(תיק: סיווג=הZמנה לוועדה)` to dashboard
   - Line 11: Added `חלקיק תיק: דחופים = מונה(סיווג=הZמנה לוועדה)` particle

2. **Particle screen (px1)** — gen_app_peruk21_px1.dart:
   - Line 30: Counter rendered as KvLine with label 'דחופים' (c13)
   - Logic: `appStore.records('app_peruk21_ent1').where((r) => (r[gen_app_peruk21_px1_c15] ?? '') == gen_app_peruk21_px1_c16).length.toDouble().toStringAsFixed(0)`
   - Correctly filters on סיווג (c15) == 'הZמנה לוועדה' (c16)
   - Null-safe via `?? ''` coalescing

3. **Dashboard (scr2)** — gen_app_peruk21_scr2.dart:
   - Line 20: Same counter logic displayed as second KvLine metric
   - Dashboard label 'הZמנה לוועדה' (c5) correctly reflects the filtered classification

4. **Entity screen (ent1):** תיק entity with סיווג field and enum values ✓

5. **Content constants** — gen_app_peruk21_px1_content.dart & gen_app_peruk21_scr2_content.dart:
   - c13 = 'דחופים' ✓
   - c15/c9 = 'סיווג' ✓
   - c16/c10 = 'הZמנה לוועדה' ✓

6. **Machine verification** (./_police.md):
   - regen_ok ✅
   - byte_identical_others ✅ (only peruk21 changed)
   - compiles ✅ (flutter analyze: 0 errors)
   - counter ✅ (detected & verified as `consts=1`)
   - gates_pass ✅

**Task surfaces covered:**
- ✓ Case screen (entity list): px1 particle screen shows table + דחופים counter
- ✓ Particle table: ForgeDataGrid with 6 columns (לקוח, טלפון, המכתב, מה כבר יש, עד מתי, סיווג) + counter below
- ✓ Hub: Navigation screen (correctly displays screen tiles, metrics belong on px1/scr2, not hub)
- ✓ Report: Individual תיק report (rp1) shows detailed record view; counter not needed per design

**Nothing broken:** All generated outputs pass compilation & validation gates. No orphaned code. No other app data modified.

