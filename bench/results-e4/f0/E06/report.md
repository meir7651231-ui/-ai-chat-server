# Report — «שלח תזכורת» action button on the תיק particle screen (peruk17)

## What I did
1. `machtzev/generator/specs-ds/peruk17.txt`: added one line after the existing action particle (line 12):
   `חלקיק תיק: [פעולה] שלח תזכורת`
   (grammar per SPEC-LANG.md: `[פעולה] <טקסט>` = action button; same form as the existing `[פעולה] פתח תיק`).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
   Output: `חלקיקים: 8/8 נמצאו-ומחווטים` (was 7/7). No other spec or engine file was touched.

## Files changed by the regeneration (git diff vs HEAD)
- `new/dart-gen-bs/gen_app_peruk17_px1.dart` — the תיק particle screen now has a second
  `DsChipButton(label: gen_app_peruk17_px1_c17, onTap: … GenAppPeruk17Ent1Screen …)` right after the «פתח תיק» button;
  header comment lists `פעולה שלח תזכורת = [פעולה] שלח תזכורת ⇒ act ⇒ [action] ⇒ DsChipButton`.
- `new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart` — `const String gen_app_peruk17_px1_c17 = 'שלח תזכורת';` (constants renumbered after it).
- `new/dart-data-bs/auto/gen_app_peruk17_hub_content.dart` — hub subtitle `7 חלקיקים חיים` ⇒ `8 חלקיקים חיים`.
- `machtzev/generator/particle-plan-peruk17.{json,md}` — new row `פעולה שלח תזכורת | תיק | act | … | DsChipButton`, ok=true.
- `apps/peruk17.json` and `report-plan-peruk17.json` are unchanged.

## How I know it works (Flutter/Dart not installed, so no compile)
- The emitted button is byte-for-byte the same shape as the pre-existing, known-compiling «פתח תיק» button; only the label constant differs.
- Scratch script cross-checked the screen against its content file: 60 constants referenced, 0 missing; both DsChipButton labels resolve
  (`c14 = פתח תיק`, `c17 = שלח תזכורת`).
- `node machtzev/police.mjs --fast`: the relevant gates are green — `particles` (449 particles in 32 specs, all found and wired),
  `balagan` (35/36, 0 red, peruk17 included), `balaganone`, `compose-determinism`, `oracle`, `pretool`.

## Police gates that are red, and why
- `truth`, `pins`, `index-complete`, `learn` — **pre-existing at HEAD**, not caused by this change. Proof: pins complains about
  `police.mjs`/`render-ds.mjs`, which are identical to HEAD; index-complete lists 3 scripts that are tracked at HEAD with INDEX.md untouched;
  truth's diff is script count 49→52 and gate count 53→55 (none added by me); learn references git blobs missing from this clone.
- `peruk` — **caused by this task, by design.** `peruk17.txt` is a generated file: `peruk.mjs` derives it from the owner's document
  `generator/peruks/peruk-17.md`, and hard-codes exactly one `[פעולה]` line (peruk.mjs:171, `P.openAction`). The gate checks
  spec-on-disk ≡ generator. I verified with a scratch script that HEAD's spec was identical to the generator output, and that the
  **only** difference now is the one added line. Running `node machtzev/generator/peruk.mjs --all` would delete the button.
  The task asked for the edit in peruk17.txt, so I did not change the reader; making this durable needs an owner decision
  (a way for the peruk document / reader to declare extra actions).

## Not done / notes
- Skipped `tighten-types.mjs --record --apply` as instructed. No commits, no git remote activity.
- The button navigates to the תיק entity screen, which is the only behaviour the `[פעולה]` shape supports (particles.mjs:398-401).
- Pre-existing uncommitted changes in the tree (panuy.*, sechirut ent2, _prompt-builder.md) were left untouched.
