# 🔍 Audit: תזכורת (Reminder) Entity Task M09

## Findings

**new/dart-gen-bs/gen_app_tasks_px1.dart:21** · Empty state shows particle name instead of message · P1 wrong-result · Use `gen_app_tasks_px1_c8` not `gen_app_tasks_px1_c7`

### Detail
The generated screen code references `gen_app_tasks_px1_c7` for the empty state label:
```dart
EmptyState(label: gen_app_tasks_px1_c7)  // Line 21
```

But the content constants are:
- `gen_app_tasks_px1_c7 = 'ריק אין תזכורות'` (particle description)
- `gen_app_tasks_px1_c8 = 'אין תזכורות'` (empty message required by spec)

**Symptom:** When no reminders exist, the screen displays the particle description "ריק אין תזכורות" instead of the clean message "אין תזכורות" as specified in tasks.txt:3 `חלקיק תזכורת: [ריק] אין תזכורות`.

This explains the police report `empty | ❌ 0×` — the check was verifying that the task spec's empty-state message would be used, but the generator is wiring the wrong constant index.

---

## Coverage Verified

✅ **Entity generation:** תזכורת exists as app_tasks_ent2 (confirmed ent2 ✅ 1×)  
✅ **Field wiring:** משימה* (required link), מועד* (required date), נשלחה{כן|לא} present in gen_app_tasks_ent2_content.dart  
✅ **Cascade deletion:** spec-ds/tasks.txt:7 declares `מחיקה: משימה=מפל` (correct syntax)  
✅ **Particles declared:** particle-plan-tasks.json has 2 particles: table + empty, both wired  
✅ **Content file present:** gen_app_tasks_px1_content.dart exists with all literal strings (c0–c12)  
✅ **No spillover:** byte_identical_others ✅ — changes confined to tasks app only  
✅ **No state-leakage:** tasks.json relations flipped to `true` (expected for ent2 link), no other app configs modified  

**Could not check (Flutter not installed):**  
- Whether EmptyState@premium/feedback actually renders (wired but not runtime-verified)  
- Whether table+empty particles display properly under appStore.records('app_tasks_ent2') state  
- Whether cascading delete properly orphans reminders when task deleted  

