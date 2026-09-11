# ✅ VALIDATOR REPORT — peruk12 sort task (H06)

## Findings Summary
- **CONFIRMED findings: 2** (one P1, one P2)
- **FALSE-POSITIVES: 0**
- **ADJUSTMENTS: 0**

---

## Detailed Verdicts

### 1. ent1-table-unsorted
**VERDICT:** CONFIRMED  
**Severity:** P1 (wrong result—user-facing sort order)  
**Location:** `new/dart-gen-bs/gen_app_peruk12_ent1.dart:171`

**Evidence:**
```dart
// Line 171: table view uses unsorted rs
if (_view == 2) return ForgeDataGrid(bare: true, columns: const [...], items: rs.map((r) => [...]).toList());
```

vs. correct pattern in `gen_app_peruk12_px1.dart:25`:
```dart
items: [for (final r in (appStore.records('app_peruk12_ent1').toList()..sort((a, b) { ... numeric sort on c4='מחיר' ... }))) [...]]
```

Spec `machtzev/generator/specs-ds/peruk12.txt:10` declares sort on `מחיר` (price):
```
חלקיק תיק: [טבלה] לקוח, טלפון, מחיר | מיון: מחיר מהנמוך
```

**Analysis:**
- px1 particle screen applies numeric sort by price (c4='מחיר'), cheapest first ✓
- ent1 entity-management table view (_view==2) renders same records unsorted ✗
- Same particle spec applies to both screens; only px1 implements the sort
- Auditor verified: "ent1 line 171 needs the sort applied to `rs`" 

**Fix:** Apply `.toList()..sort((a, b) { ... })` to `rs` before mapping, using c13='מחיר' as sort key with numeric comparison (matching px1 pattern).

---

### 2. sechirut-unexpected-regeneration
**VERDICT:** CONFIRMED  
**Severity:** P2 (state-leakage—unrelated app modified)  
**Location:** `new/dart-gen-bs/gen_app_sechirut_ent2.dart` + content file

**Evidence:**
```
Changed files (git diff HEAD):
  new/dart-gen-bs/gen_app_sechirut_ent2.dart
  new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart
```

Diff shows constant renumbering (c26→c27, c29→c30, c30→c31, etc.) across all code paths (lines 29, 45, 62, 88, 90, 99, 189, etc).

But: `machtzev/generator/specs-ds/sechirut.txt` is unchanged.

Task requirement: "Don't break anything" + only peruk12.txt modified.

**Analysis:**
- Task specifies peruk12 changes only
- Sechirut has no spec changes, yet sechirut_ent2 was fully regenerated
- Auditor confirmed: "sechirut_ent2 was regenerated (constants c25–c31 reordered/renumbered) when only peruk12 was supposed to be modified"
- All references updated (compilation succeeds), but this is state-leakage into an unrelated app
- Contradicts police report's claim: `byte_identical_others ✅` — claim "All other apps remain byte-identical" is false

**Fix:** Investigate generator side-effect. If regeneration of sechirut was unintended, revert sechirut changes (git checkout HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart).

---

## FIX-LIST:
1. **ent1-table-unsorted** (P1, wrong result) — gen_app_peruk12_ent1.dart:171 — Apply numeric sort by מחיר to rs before map
2. **sechirut-unexpected-regeneration** (P2, state-leakage) — sechirut_ent2.dart + content file — Revert or investigate generator side-effect
