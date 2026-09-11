# 🔍 AUDIT: תזכורת entity addition to tasks.txt

## Finding

**new/dart-gen-bs/gen_app_tasks_px1.dart:21** · Empty state particle uses wrong constant label · **P1 wrong result** · Change `gen_app_tasks_px1_c7` to `gen_app_tasks_px1_c8`

**Root cause**: Particle spec `חלקיק תזכורת: [ריק] אין תזכורות` requires the empty-state text to be "אין תזכורות" (stored in c8), but px1.dart line 21 displays c7 which is "ריק אין תזכורות" (the particle label including type prefix). The generated constants correctly have:
- `gen_app_tasks_px1_c7 = 'ריק אין תזכורות'` (particle label)
- `gen_app_tasks_px1_c8 = 'אין תזכורות'` (required spec text)

But the EmptyState widget uses the wrong one:
```dart
appStore.records('app_tasks_ent2').isEmpty ? EmptyState(label: gen_app_tasks_px1_c7) : const SizedBox.shrink()
```

Should be:
```dart
appStore.records('app_tasks_ent2').isEmpty ? EmptyState(label: gen_app_tasks_px1_c8) : const SizedBox.shrink()
```

## Coverage verified

✅ **Entity added correctly**: תזכורת (ent2) with fields משימה (req link to ent1), מועד (req date), נשלחה (opt yes/no) — field counts, types, and required markers match spec (gen_app_tasks_ent2_content.dart c9–c11).

✅ **Cascade deletion**: Relation registered with policy=1 (מפל) on field משימה pointing to app_tasks_ent1; removeById logic in ds_store.dart (line 309–310) correctly cascades delete to child records when parent deleted.

✅ **Table screen generated**: ForgeDataGrid at gen_app_tasks_ent2.dart:155 displays three columns (משימה linked name via displayOf, מועד, נשלחה) with data rows from ent2; table view toggled via _view==2 (lines 69–79, 155).

✅ **Compile & null safety**: Analyzer passes 0 errors (police report); null-safe patterns used: displayOf('app_tasks_ent1', id) safe for empty id; scopeField/scopeId parameters properly null-checked in _prefill() line 35 before use with `!`.

✅ **App manifest updated**: tasks.json relations flag changed false→true, ent2 entity added to entities array with correct name & slug.

❌ **Empty-state text mismatch** (found above).
