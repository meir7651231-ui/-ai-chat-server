# Report: stages for אדם in panuy.txt

## What I did
1. `machtzev/generator/specs-ds/panuy.txt` line 4: appended ` | שלבים: פנוי, הוזמן, בוצע` to the `ישות אדם` line
   (same grammar as `tasks.txt` / `calendar.txt` / `sechirut.txt`, per `specs-ds/SPEC-LANG.md`).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
   (skipped `tighten-types.mjs` as instructed). Output: 6 screens, particles 12/12 found-and-wired, root = אדם.
3. No git operations. No other files edited by hand.

## How I know it works
- Parser proof: `entity.interpret()` on the edited line returns entity `אדם`, 14 fields (unchanged),
  `stages: ["פנוי","הוזמן","בוצע"]`, and the last field still carries its formula
  `boqLineAmount(שעות→eyes, מחיר לשעה→rate)` — the `|` marker did not swallow the engine call.
- `apps/panuy.json` → `root.stages = ["פנוי","הוזמן","בוצע"]`.
- Generated Dart (diff vs. pre-change snapshot, `gen_app_panuy_ent1.dart`):
  - `appStore.add(..., '__stage': '0')` on create; new `📋 לוח` view using `appStore.stageOf/setStage`
    (both exist in `new/dart-ui-bs/ds/ds_store.dart`); `DsWorkflow(steps: [c32,c33,c34])`; new import `ds_board.dart` (exists).
  - `gen_app_panuy_root.dart`: subtitle/header show the current stage label via `stageOf(...).clamp(0, 2)`.
  - `gen_app_panuy_over1.dart` + content files carry the three stage labels as constants.
  - Same shape as the tracked, already-green `gen_app_sechirut_ent1.dart` (also has `__stage`, DsWorkflow, ds_board).
- Flutter is not installed, so instead: brace/paren/bracket balance check on all 13 `gen_app_panuy_*.dart` files → all OK.
- Blast radius: exactly 8 files changed (md5 before/after), all `*panuy*`; `git status --short` is byte-identical
  before and after regeneration (the pre-existing modified sechirut files were already dirty and I did not touch them).
- `node machtzev/police.mjs --fast`: 39 ran, 0 yellow, 4 failed — all 4 pre-existing at HEAD, none panuy-related:
  - `truth`: TRUTH.md says generator/ canonical 49 & gates 53; live is 52 & 55 — exactly the 3 scripts + 2 gates added by HEAD commit 5405387.
  - `pins`: stale signatures for render-ds.mjs / police.mjs / particles.mjs / gates.tsv / LEARNINGS.md — all modified by that same commit, none by me (`git diff HEAD -- machtzev/` is empty).
  - `index-complete`: formula-fns / sort-cmp / spec-lang-doc missing from INDEX.md — added by that commit.
  - `learn`: references git blobs absent from this clone (`fatal: bad object`).
  - Relevant green gates: particles (448 particles in 32 specs incl. panuy), autoskin, autologic, skingolden, oracle, no-fakers, shapeops, pre-tool 105/105.

## Not done / caveats
- No `flutter analyze` (toolchain absent); confidence rests on the parser proof, structural diff against a green sibling, and balance check.
- The 4 red police gates need the owner's `truth.mjs --write` / `pins-check.mjs --write` / INDEX.md rows for the HEAD commit — out of scope here.
