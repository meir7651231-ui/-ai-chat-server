# Task Audit: תזכורת (reminder) entity in tasks.txt

## Findings

new/dart-gen-bs/gen_app_tasks_px1.dart:21 · EmptyState widget uses wrong constant for label — uses c7 ('ריק אין תזכורות') instead of c8 ('אין תזכורות') · P1 wrong result · Change EmptyState(label: gen_app_tasks_px1_c7) to EmptyState(label: gen_app_tasks_px1_c8)

## Coverage

✅ **Verified correct:**
- Entity תזכורת added to tasks.txt with all three fields: משימה* (required link), מועד* (required date), נשלחה{כן|לא} ✓ (ent2 gate CONFIRMED)
- Cascade delete relationship registered: gen_app_tasks_relations.dart line 6 wires 'משימה' as parent field to 'app_tasks_ent1' with mode 1 (cascade) ✓
- Table particle correctly generated: gen_app_tasks_px1.dart imports ForgeDataGrid, renders columns (משימה, מועד, נשלחה), iterates appStore.records('app_tasks_ent2') ✓
- Entity screen (ent2) properly generated with form inputs (DsSelect for משימה, DsDateField for מועד, DsEnumField for נשלחה), validation for required fields (lines 46-47), delete handler (line 92) ✓
- Navigation hub properly wired: gen_app_tasks_hub.dart line 8 imports ent2, line 26 renders nav tile to GenAppTasksEnt2Screen ✓
- Particle plan created with both particles: [טבלה] and [ריק] אין תזכורות (particle-plan-tasks.json) ✓
- Empty state constant exists (gen_app_tasks_px1_c8 = 'אין תזכורות') ✓

❌ **Cannot verify:**
- Empty state widget correctly uses the message constant (currently fails — uses c7 not c8)
- Flutter compilation result (Flutter/Dart not installed in audit environment)
- Runtime behavior of cascade delete, form validation, data display

