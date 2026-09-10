# Audit Report: peruk21 Task Coverage

## Findings
No findings. The implementation correctly fulfills all task requirements.

## Coverage Verified

**Task:** Sort cases by deadline עד מתי (soonest first) on particle screen and entity list screen.

✅ **Particle Screen (gen_app_peruk21_px1.dart:28)**
- Cases table sorted by field `gen_app_peruk21_px1_c7` = 'עד מתי' (deadline)
- Sort algorithm: `.sort((a, b) { final x = a[field] ?? '', y = b[field] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; return 0; })`
- Logic: Empty values pushed to end; numeric comparison first, then lexical (works correctly for YYYY-MM-DD dates)
- Sort order: ASCENDING (soonest first) — compareTo() ascending behavior verified

✅ **Entity List Screen (gen_app_peruk21_ent1.dart:155)**
- Sorted by field `gen_app_peruk21_ent1_c24` = 'עד מתي' (deadline) — verified in ent1_content.dart:26
- Same sort algorithm as particle screen
- Applied to all view modes: list (view==0), kanban (view==1), data grid (view==2)

✅ **Spec → Code Translation**
- peruk21.txt line 7: `ישות תיק … | מיון: עד מתי עולה` → correctly generated sort on entity
- peruk21.txt line 10: `חלקיק תיק: [טבלה] | מיון: עד מתי עולה` → correctly generated sort on particle
- Generator correctly parsed `עולה` (ascending) and wired it to both surfaces

✅ **Compilation & Tests**
- `compiles` check passed (analyzer errors: 0)
- `sort_px` gate passed ✅ px1
- `sort_ent` gate passed ✅ ent1
- No orphaned files or hand-edits

✅ **No Regressions**
- Only peruk21 modified (byte_identical_others: ✅)
- Other apps unaffected
- No changes to core generator/maor/forge layers

**Result: Task fully covered, all surfaces sorted by deadline ascending (soonest first).**
