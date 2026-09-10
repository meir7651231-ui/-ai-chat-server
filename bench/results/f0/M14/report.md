# Report: stages for אדם in panuy

## What I did
- Edited `machtzev/generator/specs-ds/panuy.txt`: appended ` | שלבים: פנוי, הוזמן, בוצע` to the
  `ישות אדם עם …` line (the same section-marker grammar used by peruk01–28 and calendar.txt).
  The marker is placed after the last field so the `boqLineAmount(...)` formula stays intact.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`.
  Before editing I ran the same command on the untouched spec and snapshotted all 28 panuy outputs
  in the scratchpad, so every change below is a byte diff against that baseline.
- No other files changed (`git status` shows only the panuy outputs, which were already untracked).
  No commits, no git remotes, tighten-types skipped as instructed.

## What changed in the generated output (diff vs baseline)
- `apps/panuy.json`: `root.stages` is now `["פנוי","הוזמן","בוצע"]` (was `[]`). Nothing else in the JSON moved.
- `gen_app_panuy_ent1.dart`: new records get `'__stage': '0'`; view switch gains a `📋 לוח` (kanban) tab;
  `DsRecordCard` receives `stage/stageDone/stages/stageIndex/onStage/onAdvance`; a `DsWorkflow` strip is added;
  `ForgeKanbanBoard` view with tap-to-advance / long-press-to-go-back.
- `gen_app_panuy_over1.dart`: overview shows a completion `Bar` (% of records at the final stage) and the kanban board.
- `gen_app_panuy_root.dart`: root page subtitle shows the record's current stage name.
- `*_content.dart`: the three stage strings added; entity/hub subtitle reads `14 שדות · 3 שלבים`.
- `particle-plan-panuy.json/.md`: identical to baseline (12/12 particles still resolved and wired).

## How I know it works (Flutter is not installed, so no compile)
- Generator run succeeded: 6 screens, 12/12 particles wired, forge skin now includes `board×2`.
- Structural checks on the three changed screens: balanced `()`, `{}`, `[]`; every `gen_app_panuy_*_cN`
  constant used is defined in the matching `_content.dart`.
- Every new symbol exists on disk with the parameters used: `DsRecordCard` (ds.dart:806) has
  `stage, stageDone, stages, stageIndex, onStage, onAdvance`; `DsWorkflow` (ds.dart:569);
  `ForgeKanbanBoard` (kanban_board.dart:88, exported by spatial.dart) has `bare, items, onCell, onCellLong`;
  `AppStore.stageOf/advance/setStage` exist; `ds_board.dart`, `bar.dart`, `spatial.dart` imports resolve.
- The emitted pattern is byte-for-byte the same shape as peruk01 (an existing staged entity); the import
  differences between the two are only field-type related (dates vs boqLineAmount).
- Gates: `particles --gate` ✓ (448 particles / 32 specs), `app-from-sentences --gate --test` ✓,
  `police.mjs --fast`: 40 ran, 0 yellow, 1 failed = `learn` only. That failure is environmental:
  this clone has a single commit, so the LEARNINGS.md blob refs (e.g. 0bc0365…) cannot resolve
  (`git cat-file` fails). It is unrelated to this change. `genverify` is ⚪ (no buildsmart checkout).
