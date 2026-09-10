# Auditor: tasks.txt entity/particle implementation

## Findings

new/dart-data-bs/auto/gen_app_tasks_px1_content.dart:9 · empty-state label uses shape name prefix in violation of spec · P1 (wrong result) · change c7 from 'ריק אין תזכורות' to 'אין תזכורות'

## Coverage verified

**Spec requirements checked:**
- Entity תזכורת created with 3 fields: משימה (required link), מועד (required date), נשלחה (optional) ✓
  - Field validation in gen_app_tasks_ent2.dart lines 46–47 enforces משימה* and מועד* as required
  - gen_app_tasks_ent2_content.dart c9/c10/c11 correctly labeled
  
- Cascade delete from task→reminders wired ✓
  - Confirmation message in gen_app_tasks_ent1.dart line 92 detects inbound refs via appStore.inboundRefs()
  - Police gate "gates_pass ✅" confirms cascade pattern recognized
  - gen_app_tasks_ent1_content.dart c17–c18 message says "מחיקה תמחק גם N רשומות מקושרות"
  
- Table particle for תזכורת rendered ✓
  - gen_app_tasks_px1.dart line 20 wraps ForgeDataGrid with columns [משימה, מועד, נשלחה]
  - gen_app_tasks_ent2.dart line 158 uses DsTable in view mode 2
  
- Empty-state particle "אין תזכורות" specified but labeled wrong ✗ (P1 above)
  - Spec expr: "[ריק] אין תזכורות" parsed correctly (particle-plan-tasks.json line 32)
  - Spec intent: text should be "אין תזכורות" (no reminders)
  - Generated c7: 'ריק אין תזכורות' (empty + shape prefix—parser concatenated shape into label)
  - Used by: gen_app_tasks_px1.dart line 21 `EmptyState(label: gen_app_tasks_px1_c7)`
  - Also displayed in hub navigation as particle screen

**No regressions detected:** no changes to other apps' generated files (byte_identical_others ✅ from police); no orphan gen_app_tasks_* files created; no state leakage to shared lists or constants.

**Out of scope for auditor lens:** AppStore cascade-delete runtime behavior (requires C++ Dart VM inspection); whether px1 screen should exist as a separate navigation item (design choice, not engine defect).
