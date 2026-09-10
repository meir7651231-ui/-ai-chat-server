# Report — third stage «בוטל» for משימה (tasks)

## What I found
Every consumer of a stage list treats the *last* stage as "closed": `open() = stage < last`,
«עשיתי»/«סגור תיק»/stale-close set `stage = last`, `advance` walks to `last`, «צעד-הבא» uses `>= last`
(app-shell.mjs, render-ds.mjs, balagan.mjs, renderCompose). So a plain append (`פתוח, נעשה, בוטל`)
would make «עשיתי» mark tasks *cancelled* and count «נעשה» as open; the other order (`פתוח, בוטל, נעשה`)
would make «קדם» cancel tasks. Either spec-only change breaks silently (analyze would stay green).

## What I did
- Grammar (entity.mjs): a parenthesized stage is a **side-exit** — terminal, off the linear path.
  `| שלבים: פתוח, נעשה, (בוטל)` ⇒ `stages=[פתוח,נעשה,בוטל]`, `doneIdx=1`, `exits=[בוטל]`. Exits always sort after the path.
- Engines now ask `doneIdx` instead of `length-1`: render-ds (`stageDone >= D`, `advance(…, D+1)`, workflow strip = linear
  stages only, progress `>= D`), app-shell (`doneOf`/`hasExits`: open `< D`, close/«עשיתי» `= D`, `done()`/next-step `== D`
  only when an exit exists), balagan (`linearStages(m)` = D+1 for the closed/open tests), app-ds (propagates `doneIdx`
  into renderEntity/renderCompose/root page/home and writes it to `apps/<ns>.json`; readers without the key fall back).
- Spec: `machtzev/generator/specs-ds/tasks.txt` — stage line becomes `פתוח, נעשה, (בוטל)`.
- Regenerated tasks (`app-ds.mjs -f … --name tasks --skin`), refreshed pins (`pins-check --write`), added L107 to
  LEARNINGS.md and one grammar line to the reference table in knowledge/CLOSED-ENGINE-GAPMAP-2026-08-31.md.
- Skipped `tighten-types.mjs` as instructed. No commit / push.

## How I know it works (Flutter/Dart not installed — evidence is generator-level)
- `interpret()` on the new line and on the three existing stage forms (calendar, tasks-old, sechirut with guards):
  existing forms unchanged (`doneIdx = last`), new form gives doneIdx 1 with the exit last; guards still parse.
- Diff of regenerated tasks Dart is exactly the intended shape: 3 labels in stage picker / kanban / subtitle
  (`clamp(0, 2)`), `stageDone >= 1`, `advance(…, 2)`, `open() < 1`, close/«עשיתי` set `'1'`, `done()` is `== 1`,
  `DsWorkflow` strip shows only פתוח/נעשה; remaining lines are constant renumbering (new `'בוטל'` constant).
- Byte-stability: regenerated calendar, sechirut (6 stages + מעברים), peruk01 and the balagan one-app (30 modules)
  with the new engines — zero Dart changes (only their manifests would gain `doneIdx`; restored to HEAD to keep the tree focused).
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 1 failed — identical to the pre-change baseline. The one red
  (`learn`) is pre-existing: 9 lessons reference git blobs missing from this checkout; none involve L107.
  particles / peruk / balagan / balaganone / pins / rendermodule / cover etc. are green.

## Known behavior / notes
- Cancelling is an explicit choice only: stage picker on the record card or the board's last column; no auto-path reaches it.
- Kanban tap on a «נעשה» card moves it to «בוטל» (generic retarget board: tap = next column, long-press = back). Not changed.
- Untracked `panuy` files and `_prompt-builder.md` were present before I started and were left untouched.
