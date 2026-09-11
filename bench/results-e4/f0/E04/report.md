# Report: add stage בוטל (cancelled) to משימה in specs-ds/tasks.txt

## Why this was not a one-line change
The engine treats **the last stage index as "closed"** everywhere: open = `stage < last`, "סיים"/advance caps at last,
"סגור תיק" sets last, the chain's `done()` uses `>= last`, balagan's open-count/duplicates/person-card/stale-close use `stages - 1`.
Appending בוטל as a third stage naively would make נעשה tasks count as *open*, and "סיים" on a done task would *cancel* it.

## What I did
1. **Spec**: `ישות משימה … | שלבים: פתוח, נעשה, בוטל | סופיים: נעשה, בוטל` (machtzev/generator/specs-ds/tasks.txt).
2. **Grammar (data, not engine)**: new clause `| סופיים:` / `| סגורים:` in spec-lang.data.json (`sectionMarkers`, `markTerminal`, warning text).
3. **entity.mjs**: parses the clause ⇒ `closedFrom` = index of the first terminal stage; default = last stage (bit-identical for every other spec).
   Unknown terminal name ⇒ warning, ignored (no guessing).
4. **Consumers switched from "last" to `closedFrom`**: render-ds.mjs (`stageDone`, advance cap = closedFrom+1, progress %),
   app-shell.mjs (`closedFromOf` helper; open filter, "סגור תיק", "סיים", chain `done()` now `== closedFrom` when later terminal
   stages exist so a cancelled record never triggers the next step), app-ds.mjs (plumbs `closedFrom`; emitted into apps/<ns>.json
   only when it differs from last), balagan.mjs (`BalaganModule.closedFrom`, all `stages - 1` sites, `balaganOpenCount` keeps its
   gated signature and looks the module up).
5. **Docs**: spec-lang-doc.mjs template updated and SPEC-LANG.md regenerated (its `--gate` passes).
6. **Regenerated**: tasks (`app-ds … --name tasks --skin`), balagan (`balagan.mjs`), pins refreshed (`pins-check --write`), `truth.mjs --write`.

## How I know it works (no Flutter here; verified in bytes)
- Parser check (scratch script): tasks ⇒ stages [פתוח,נעשה,בוטל] closedFrom=1; calendar ⇒ closedFrom=1 (last); 5-stage peruk ⇒ 4 (last);
  bad terminal name ⇒ warning + fallback to last; synonym `סגורים` works.
- **Control**: regenerating calendar.txt with the new engine produced **zero diff** vs HEAD (default path bit-identical).
- Generated tasks Dart (git diff): stage list has 3 entries; `stageDone … >= 1`; `appStore.advance('app_tasks_ent1', rid, 2)` in both
  entity and home (finish stops at נעשה); home `open()` still `< 1`; root-page "סגור תיק" sets `'1'`; subtitle clamp `(0, 2)`;
  chain `done()` uses `== 1`. apps/tasks.json: `"stages": [פתוח,נעשה,בוטל], "closedFrom": 1`. Cancelling = tapping בוטל in the
  DsRecordCard stage strip (`onStage` ⇒ `setStage`), which already exists.
- Balagan diff: only `closedFrom:` per module (1 for base modules, 4 for the 28 peruks) and the `stages - 1` ⇒ `closedFrom` sites;
  the generated Dart test now expects `stageOf == closedFrom` after "סגור".
- Comment-only follow-up edits left the tasks output byte-identical (sha256 of all gen_app_tasks_* + tasks.json unchanged).
- `node machtzev/police.mjs --fast`: 41 ran · 2 failed — **index-complete** and **learn**, both pre-existing and unrelated
  (scripts from commit 5405387 missing in INDEX.md; `learn` needs git blobs absent from this 2-commit shallow clone).
  genratchet green (Hebrew-in-engine debt kept at baselines: warning text moved to data, block comment ⇒ line comment).
- Skipped as instructed: tighten-types. Not run: flutter analyze/build (not installed).

## Notes
- Pre-existing working-tree changes (sechirut ent2, untracked panuy files) were left untouched.
- `pins.sha256` and root `TRUTH.md` also absorbed pre-existing drift (LEARNINGS/gates.tsv/particles/police pins; 49⇒52 scripts, 53⇒55 gates)
  because the gates' own `--write` rituals regenerate them; CLAUDE.md's truth block was restored to HEAD (git checkout was denied).
