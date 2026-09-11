# VALIDATOR REPORT — E03 (peruk12 computed field)

## Machine Report Verdict
Police report shows `no_hand_edit: FALSE` — flagging hand-edits outside spec. All generic checks pass (regen_ok ✅, byte_identical_others ✅, gates_pass ✅, compiles ✅, dart_math_sane ✅, no_hebrew_in_engine ✅).

## Findings

### 1. CRITICAL: Generator infrastructure files gutted (P0)
**VERDICT: CONFIRMED**

**Evidence:**
- git diff shows:
  - `machtzev/generator/ship.mjs`: 138 lines → ~3 lines (shebang only)
  - `machtzev/one.mjs`: 247 lines → ~3 lines (shebang only)  
  - `machtzev/generator/tighten-types.mjs`: 256 lines → ~3 lines (shebang only)
- Police report: `no_hand_edit: FALSE` — detected hand edits beyond spec
- Impact: Core generator pipeline destroyed; cannot run regen/one/ship without these files

**Analysis:** These are critical infrastructure files that must never be hand-edited or truncated. They form the regen pipeline (ship.mjs, one.mjs) and type-tightening engine (tighten-types.mjs). Deleting them breaks the entire build system.

**Fix:** Restore files from HEAD (git checkout HEAD -- machtzev/generator/ship.mjs machtzev/one.mjs machtzev/generator/tighten-types.mjs)

---

### 2. Computed field formula (Dart implementation) - CORRECT
**VERDICT: FALSE-POSITIVE (not a bug)**

**Evidence verified:**
- Spec: `machtzev/generator/specs-ds/peruk12.txt:7` → `מחיר עם אגרה = מחיר * 1.03` ✓
- Dart implementation (new/dart-gen-bs/gen_app_peruk12_ent1.dart:48):
  ```dart
  gen_app_peruk12_ent1_c14: ((num.tryParse(_v[3] ?? '') ?? 0) * 1.03).toStringAsFixed(2)
  ```
- Display (line 173):
  ```dart
  _calc(gen_app_peruk12_ent1_c14, (num.tryParse(_v[3] ?? '') ?? 0) * 1.03)
  ```

**Validation:**
- num.tryParse() correctly returns num? (nullable) — standard Dart parsing ✓
- ?? 0 provides safe default for null/empty/parse-failure ✓
- * 1.03 multiplication preserves full precision (only .toStringAsFixed(2) rounds) ✓
- toStringAsFixed(2) correctly formats to 2 decimals ✓
- Field excluded from user input (read-only via _calc() widget) ✓
- Field included in all views: labels (line 29), card (line 89), CSV (lines 95,97), table (line 186) ✓
- Load on edit (line 60): stored value loaded from appStore ✓
- All auditors confirmed correct: compile✅, calc_fee✅, coverage✓

**No bug found.** Formula is mathematically and syntactically correct per Dart semantics.

---

### 3. Documentation learning entry (acceptable hand-edit)
**VERDICT: FALSE-POSITIVE (not a problem)**

**Evidence:**
- machtzev/LEARNINGS.md: Single entry added `L2026-09-10-computed-peruk12`
- Documented the pattern: field_computed = field_base * numeric_constant
- Documented safeguards: null-coalescing in render engine, storage format

**Justification:** Recording lessons learned is intended. This documents the right way to handle computed fields (no LLM, pure data-driven). Not destructive, aids future builders.

---

## FIX-LIST

**CRITICAL (blocks entire pipeline):**
- ID: infra-gutted · CONFIRMED · machtzev/generator/ship.mjs:1-3 (shebang only; was 138 lines) · **Restore: `git checkout HEAD -- machtzev/generator/ship.mjs machtzev/one.mjs machtzev/generator/tighten-types.mjs`**

All other findings are false-positives or acceptable (computed field correct, learning entry documented, no regressions). Machine checks all pass.
