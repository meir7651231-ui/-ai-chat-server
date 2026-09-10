# Validation Report — M09 (tasks תזכורת entity)

## Finding 1: EmptyState label constant mismatch

**Verdict:** CONFIRMED P1 (wrong result)

**Evidence:**
- Spec (tasks.txt:9): `חלקיק תזכורת: [ריק] אין תזכורות` — shape [ריק] = empty particle type; text = "אין תזכורות"
- Generated const (gen_app_tasks_px1_content.dart:9): `const String gen_app_tasks_px1_c7 = 'ריק אין תזכורות';` ← concatenates shape into label
- Generated const (gen_app_tasks_px1_content.dart:10): `const String gen_app_tasks_px1_c8 = 'אין תזכורות';` ← correct extraction
- Usage (gen_app_tasks_px1.dart:21): `EmptyState(label: gen_app_tasks_px1_c7)` ← references wrong constant

**Fix:** Change line 21 in gen_app_tasks_px1.dart from `gen_app_tasks_px1_c7` to `gen_app_tasks_px1_c8`

**Impact:** User will see "ריק אין תזכורות" (redundant) instead of "אין תזכורות" when reminder list is empty.

---

## Verified Correct

✅ **Entity תזכורת** — 3 fields correctly defined (משימה*, מועד*, נשלחה)
  - gen_app_tasks_ent2.dart lines 46–47: validation enforces משימה and מועד as required

✅ **Cascade delete** — policy registered
  - gen_app_tasks_relations.dart line 6: registers relation to app_tasks_ent1 with policy=1 (cascade)
  - Matches spec: `מחיקה: משימה=מפל`

✅ **Table particle** — both columns and data correct
  - gen_app_tasks_px1.dart line 20: ForgeDataGrid with 3 columns (משימה, מועד, נשלחה)
  - Data bound to `appStore.records('app_tasks_ent2')`

✅ **Navigation** — hub and main.dart wired
  - Both screens reachable; relations registered before startup

✅ **Null safety** — all field accesses guarded with `?? ''`

✅ **Type safety** — correct widgets (DsSelect for link, ForgeDsDateFieldInput for date)

✅ **Dart compilation** — flutter analyze: 0 errors (confirmed by ./_police.md: compiles ✅)

✅ **Isolation** — only tasks app modified (byte_identical_others ✅ per ./_police.md)

✅ **No orphans** — all gen_app_tasks_* files belong to app_tasks namespace

---

FIX-LIST:
1. gen_app_tasks_px1.dart:21 · CONFIRMED P1 · change `gen_app_tasks_px1_c7` to `gen_app_tasks_px1_c8`
