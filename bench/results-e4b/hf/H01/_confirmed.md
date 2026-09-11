# ✅ Validation Report — panuy (H01)

## Finding Verdicts

**BUG-50-SQRT** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:50 `gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))` · Extract squared-distance calculation into variable (not inline), pass to sqrt instead of _v[10] which is never populated during CREATE.

**BUG-175-SQRT** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:175 `_calc(gen_app_panuy_ent1_c25, sqrt( (num.tryParse(_v[10] ?? '') ?? 0) ))` · Replace _v[10] with the squared-distance formula or extract to helper function.

## Evidence & Reasoning

**Byte evidence:**
- Line 50 in _save(): calculates c24 (squared distance) inline but tries to use _v[10] for c25 (real distance)
- Line 175 in _calc(): same pattern during form display
- _v initialization at line 32: `{4: ..., 5: ..., 7: ...}` — only prefilled form fields (indices 0-7, 12)
- _edit() at line 62 populates index 10 ONLY when loading a stored record (from `r[gen_app_panuy_ent1_c24]`)
- NEW record flow: indices 0-7, 12 set from form → _save() → indices 8-11 never populated → _v[10] remains empty
- Result: `sqrt(0.00)` for every new record, sort fails for nearest-first ordering

**Auditor consensus:** Two auditors (regression, compile) identified same bug; coverage auditor missed it.

**Machine report:** All generic checks pass (✅), but logic bug not caught (runtime-only).

**Task requirement:** "List sorted by distance (nearest first), real distance in km" — BROKEN for new records because distance always = 0.

## Severity

Both findings are **P1** (task not done): new records permanently sort to the end of the list with distance=0.00, violating the core requirement.

FIX-LIST: BUG-50-SQRT, BUG-175-SQRT
