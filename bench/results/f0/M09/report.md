# Report — תזכורת (reminder) child entity in `specs-ds/tasks.txt`

## What I changed
`machtzev/generator/specs-ds/tasks.txt` — 3 lines appended after the משימה entity, using the
same grammar every existing spec uses (sechirut/peruk*):

```
ישות תזכורת עם משימה*, מועד*, נשלחה{כן|לא} | מחיקה: משימה=מפל
חלקיק תזכורת: [טבלה]
חלקיק תזכורת: [ריק] אין תזכורות
```

- משימה* → required link (label contains the entity name ⇒ relation; `*` = required)
- מועד* → required date (`מועד` is in `spec-lang.data.json` typeDate)
- נשלחה{כן|לא} → yes/no enum (the repo's convention for yes/no; typeBool hints don't cover נשלחה)
- `| מחיקה: משימה=מפל` → cascade (delPolicies מפל=1)

Then regenerated: `node machtzev/generator/app-ds.mjs -f …/tasks.txt --name tasks --skin`
and `node machtzev/generator/balagan.mjs` (the unified app imports per-module relations).
Skipped `tighten-types.mjs` as instructed. No git commit/push.

## Evidence it works (bytes, not prose)
- `apps/tasks.json`: entities now [משימה, תזכורת], `relations: true`; root stays משימה (base layer for בלגן intact).
- `gen_app_tasks_relations.dart`: `registerRelation('app_tasks_ent2', 'משימה', 'app_tasks_ent1', 1, multi:false)` — policy 1 = cascade;
  `gen_app_tasks_main.dart` calls `registerAppRelations(appStore)` before runApp.
- `gen_app_tasks_ent2.dart`: `_save` rejects empty index 0 (משימה) and 1 (מועד); משימה = `DsSelect(entity:'app_tasks_ent1')`,
  מועד = `DsDateField`, נשלחה = `DsEnumField(options:[כן, לא])`.
- `gen_app_tasks_px1.dart`: `[טבלה]` ⇒ `ForgeDataGrid` over `app_tasks_ent2` (3 columns); `[ריק]` ⇒ `EmptyState` shown when
  records are empty. `particle-plan-tasks.json`: 2/2 ok, wired DsTable + EmptyState.
- Task card (`ent1`) now shows a "תזכורת · n" back-chip and a delete confirmation when reminders reference it;
  root page (`root`) gets a scoped reminders section + "הוספת תזכורת" prefilled with the task.
- `gen_balagan_main.dart`: only diff is the new `r_tasks.registerAppRelations` import/call.
- Untouched: LEARNINGS.md, pins.sha256, gates.tsv; other specs' outputs unchanged (git diff limited to tasks + balagan main).

## Gates
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped (--fast) · 0 yellow · **1 failed: `learn`** — it wants git blobs
  (e.g. 0bc0365…) that `git cat-file` cannot find; the clone is shallow (`--is-shallow-repository` = true).
  Pre-existing/environmental, unrelated to this change (I did not touch LEARNINGS.md).
- Direct: `particles --gate` ✓ 450 particles / 32 specs all wired · `balagan-one --gate` ✓ 30 modules · `balagan-look --gate` ✓ 35/36
  (floor 35, 0 red, 31 paper apps incl. tasks) · pins ✓ 133 files match.
- Flutter/Dart not installed: no analyze. Sanity: bracket balance is 0 on all generated tasks Dart files; the code is emitted by the same
  engine paths already used by sechirut (child entity + cascade + [טבלה]/[ריק]), which the repo records as analyze-green.

## Note (pre-existing engine behaviour, not changed)
For `[ריק] <text>` the engine passes the particle *name* ("ריק אין תזכורות") to the EmptyState `label` seam and keeps the raw text
("אין תזכורות") as a separate constant — identical to how sechirut's `[ריק] אין ממצאים עדיין` renders. Left as-is to avoid
changing every other spec's output.
