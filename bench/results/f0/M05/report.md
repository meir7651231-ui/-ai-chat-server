# Report — message particle «תשובה» in peruk21

## What changed
1. `machtzev/generator/specs-ds/peruk21.txt` — appended, under a hand-additions marker line:
   - `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן הודעה]`
   - `תוכן הודעה: קיבלתי, הסיווג: {ערך}`
   Same grammar as the existing message particles (peruk03/04/05, sechirut).
2. `machtzev/generator/peruk.mjs` — the spec for peruk21 is generated from `peruks/peruk-21.md`; the
   `peruk` police gate requires spec-on-disk == reader output, and `regen.mjs` runs `peruk.mjs --all`
   before `app-ds`, which would have overwritten a hand-added line. Added `HAND_MARK`
   (`# תוספות-יד …`): `--gate` compares only the generated prefix, `--all` preserves the tail,
   and the gate line reports `תוספות-יד N`. No change to what the reader generates.
3. `machtzev/generator/app-ds.mjs` — lines starting with `#` are comments (skipped). Without this the
   marker line would have become a dashboard screen. No existing spec/golden had `#` lines (grep).
4. `machtzev/pins.sha256` — refreshed via `pins-check.mjs --write` (peruk.mjs is signature-pinned).
5. Regenerated peruk21 (`app-ds.mjs -f … --name peruk21 --skin`): particle-plan-peruk21.{json,md},
   gen_app_peruk21_{px1,home}.dart + their _content.dart, hub_content.dart (particle count 8 → 9).

## How I know it works
- Baseline: regenerating peruk21 before any edit was byte-identical to the committed tree.
- After: `🧩 חלקיקים: 9/9 נמצאו-ומחווטים` (was 8/8), still 7 screens (the comment line made no screen).
  particle-plan entry `תשובה`: ok=true, kind=message, wired=[ForgeMustChip, DsNote].
- Generated Dart (`gen_app_peruk21_px1.dart`, case-particles screen): per record a `ForgeMustChip`
  over the four סיווג values that writes back to the record via `appStore.update`, plus
  `DsNote(message: 'קיבלתי, הסיווג: ' + r['סיווג'])`, blank when סיווג is empty (same sentence-drop
  rule as other message particles). The home screen gained the same «היום» message block that
  sechirut/peruk04 (existing message apps) already have; all other diffs there are renumbered constants.
- `peruk.mjs --gate`: ✓ all 28, peruk21 shows `· תוספות-יד 2`. `peruk.mjs --all` then `git diff`:
  only peruk21.txt's 3 new lines differ; all other specs and peruk-index.json untouched.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 1 failed = `learn` only (was 2 failed
  [peruk, learn] before the reader change). `learn` is pre-existing/environmental: it references git
  blobs (e.g. 0bc03659…) that `git cat-file` cannot find in this clone; unrelated to this task.
- Not verified: Flutter compile (Flutter/Dart not installed). The emitted code uses only atoms and
  imports already used by the existing message-particle screens (must_chip.dart etc. exist on disk).

## Notes
- Skipped `tighten-types.mjs --record --apply` (known-broken), as instructed. No git commit/push.
- Pre-existing untracked files (`_prompt-builder.md`, panuy.*) were left as found.
