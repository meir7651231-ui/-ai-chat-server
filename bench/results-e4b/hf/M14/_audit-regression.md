# 🔍 Audit Report — panuy.txt stages addition

## Findings

**1 confirmed regression (P1: wrong result):**

`new/dart-gen-bs/gen_app_sechirut_ent2.dart:175–180 · state-leakage: sechirut entity modified despite unchanged spec · P1 · remove sechirut_ent2 changes and regenerate panuy-only`

**Root cause:** Untracked: sechirut_ent2 display/calculation fields restructured when panuy was added. The _v[8] input field was removed and replaced with two computed _live() displays (lines 177–180), changing validation indexes and displayed values. Additionally, constants in gen_app_sechirut_ent2_content.dart were renumbered (c24–c30 in HEAD became c24–c31 in working tree with duplicates: c25='חורג', c28='חורג'; c26='תקין', c29='תקין'), breaking the content mapping.

**Specific violation in code:**
- HEAD: 3 constants from c27–c30 rendering a single condition `(((num.tryParse(_v[5]) > (num.tryParse(_v[7])) ? gen_app_sechirut_ent2_c27 : gen_app_sechirut_ent2_c28)` (line 88 old)
- Working: constants renumbered + structure doubled: two separate _live() calls (line 177–180 new), one with _v[6] comparison (was _v[7]), one with _v[7] comparison. Field _v[8] input removed without corresponding spec change to sechirut.txt.
- Consequence: Existing sechirut records' בטוחה.תקרה לפי שליש field (_v[8]) is now ignored in rendering; comparisons switch from _v[7] to _v[6]/_v[7], altering displayed "חורג" status.

**Machine report claim vs. reality:**
- Police: `byte_identical_others ✅` with verdict "No other apps modified; only panuy.txt spec changed. CONFIRMED"
- Reality: `git diff --stat HEAD | grep sechirut` shows 13 additions/removals in gen_app_sechirut_ent2_content.dart, 23 in gen_app_sechirut_ent2.dart. Both files are `modified` (not new/untracked).
- Audit-compile report: "byte_identical_others ✅ confirms only panuy-related files changed" — contradicted by `git status`.

---

## Coverage verified

✅ **panuy spec integrity**: machtzev/generator/specs-ds/panuy.txt line 4 correctly specifies `שלבים: פנוי, הוזמן, בוצע`

✅ **panuy entity stages generated**: gen_app_panuy_ent1_content.dart lines 33–35:
- c31 = 'פנוי'
- c32 = 'הוזמן'
- c33 = 'בוצע'

✅ **panuy dashboard counter**: gen_app_panuy_px1.dart correctly filters by סטטוס=פנוי (confirmed in px1_content.dart: c43='סטטוס', c44='פנוי')

✅ **Dart safety in panuy**: null-coalescing on lines 45–50 (_v[i] ?? ''), num.tryParse on lines 51/178 (sqrt call type-safe), sqrt() is top-level function from dart:math (line 8 import verified)

✅ **No orphan files**: All generated panuy files properly wired; no gen_app_panuy_*.dart with undefined namespace (would fail compile gate)

✅ **Compile gate passes**: Police report confirms 0 analyzer errors (`compiles ✅`)

❌ **State-leakage: sechirut_ent2 not byte-identical to HEAD** — Detailed above. Constants reordered, field structure changed, content duplicates introduced.

⚠️ **Mutation not checked** (read-only audit): Cannot verify whether sechirut.txt was SUPPOSED to change (spec-driven). If unintended: rerun panuy-only regen with sechirut excluded.

---

## Verdict

**REGRESSION CONFIRMED.**

✅ **Task done for panuy**: Stages פנוי, הוזמן, בוצע correctly added to אדם entity; generated code is safe and compiles.

❌ **Constraint violated**: "Don't break anything" — sechirut_ent2 was unintentionally modified (constants renumbered, field logic restructured) despite sechirut.txt being unchanged. This is state-leakage from a cross-app schema collision or reordering bug in the generator.

**Recommendation**: Verify sechirut_ent2 renders correctly with old data (deleted records' בטוחה.תקרה לפי שליש field was at index _v[8], now missing); confirm whether the doubled conditions (two חורג/תקין displays) is intended or a bug in render-ds' field-binding logic when panuy's new entity shifts the global constant namespace.
