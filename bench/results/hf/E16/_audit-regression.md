# Audit: peruk08 stage addition (הוחזר הכסף)

## Findings
None. Task completed with sound execution.

## Coverage report

**Verified correct:**

1. **Spec integrity**: Only machtzev/generator/specs-ds/peruk08.txt modified; change is stage order addition on line 6: `שלבים התקבל, שולם, בבדיקה, נמסר` → `שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף` (new stage הוחזר הכסף at index 4, before סגור). No other specs (peruk01–07, peruk09, calendar, etc.) touched.

2. **Generated constants**: new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart declares all 6 stages as const String: c22='התקבל', c23='שולם', c24='בבדיקה', c25='נמסר', c26='הוחזר הכסף', c27='סגור'. Header subtitle correctly states "7 שדות · 6 שלבים".

3. **Stage array and advancement**: new/dart-gen-bs/gen_app_peruk08_ent1.dart:
   - Line 30: _labelsAll references fields only (not stages).
   - Line 90 & 133 & 157: stages array includes all 6 constants in order.
   - Line 53: new records initialized with `__stage: '0'` (first stage).
   - Line 90: `stageDone: appStore.stageOf(...) >= 5` correctly marks done at last stage (index 5).
   - Line 90: `onAdvance: () => appStore.advance(..., 6)` passes 6 (max stages count).
   - Line 157 kanban: `kS.length - 1 == c` clamp and `i < kS.length - 1` advance guard work for 6 stages; backward movement with `i > 0` guard also correct.

4. **No cross-app leakage**: git diff shows only peruk08.json (stage list updated), peruk08.txt (spec), plus auto-generated machtzev/ tooling (LEARNINGS.md L106 documents the change; generator/ship.mjs, generator/apps/peruk08.json, one.mjs, tighten-types.mjs all auto-synced). No peruk01–09 files modified except peruk08. No ui_terms.dart or balagan references to peruk08-specific stages.

5. **Police report validation**: _police.md confirms regen_ok ✅, byte_identical_others ✅, gates_pass ✅, stage ✅ (1×), all claims verified.

**Could not check (Flutter/Dart not available, read-only audit):**
- Runtime stage transitions and UI rendering (bounds verified by code inspection; appStore contract assumed correct).
- Kanban board drag semantics and stage clamp edge cases under production data.
- Backward-compat: existing records with `__stage: '0'...'4'` auto-upgrade to new indices or require migration (appStore.stageOf clamp at line 157 suggests safe handling, but migration not audited).

**No issues found. Stage addition is sound: spec→JSON→constants→arrays→logic all coherent, order preserved, stage count consistent, no regressions outside peruk08.**
