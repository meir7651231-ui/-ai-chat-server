# 🧪 Validator Report — E04 (tasks stage addition)

## Findings

### Finding 1: stageDone condition regression [P1]
- **Verdict**: CONFIRMED
- **File**: new/dart-gen-bs/gen_app_tasks_ent1.dart:92
- **Evidence**: git diff shows `stageDone: appStore.stageOf(...) >= 1` → `>= 2`; tasks in stage 1 (נעשה) lose visual "done" marker despite being completed (regression from old system where >= 1 marked stage 1 as terminal)
- **Fix**: Change `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 2` to `>= 1` to mark both נעשה (stage 1) and בוטל (stage 2) as visually complete

---

FIX-LIST: E04-P1-stageDone (change >= 2 to >= 1 on line 92 of new/dart-gen-bs/gen_app_tasks_ent1.dart)
