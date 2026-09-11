# Report: message particle «תשובה» on the peruk21 case screen

## What I did
- `specs-ds/peruk21.txt` now contains the two requested lines:
  `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן הודעה]` and `תוכן הודעה: קיבלתי, הסיווג: {ערך}`
  (plus the standard `דוח תיק: תשובה = תשובה` report part the reader emits for every «מה חוזר» item).
- That spec is a derived file: the `peruk` police gate requires it to equal `peruk.mjs`'s derivation of
  `peruks/peruk-21.md` byte-for-byte. A hand edit alone turned that gate red (verified: `node peruk.mjs --gate`
  reported `peruk-21.md: הספק בדיסק ≠ המחולל`). So I routed the change through the source:
  - `peruks/peruk-21.md`: added «מה חוזר» item `6. תשובה: קיבלתי, הסיווג: {ערך}`.
  - `peruk.mjs`: a message-kind output whose detail carries the `{ערך}` placeholder now uses that detail as its
    template and binds to the enum field its text names (matched structurally via the existing stem matcher;
    here `הסיווג` ⇒ `סיווג`). The old behaviour (global template + first decision field) is unchanged and still
    used when no placeholder is present. No new Hebrew literals in code; the placeholder word comes from `spec-lang.data.json`.
  - Regenerated: `node peruk.mjs --all` (specs + `peruk-index.json`), then
    `node app-ds.mjs -f specs-ds/peruk21.txt --name peruk21 --skin`, then `node machtzev/pins-check.mjs --write`
    (peruk.mjs is signature-locked).
- Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.

## How I know it works
- Determinism baseline: regenerating peruk21 from the HEAD spec reproduced HEAD bytes exactly (empty git diff),
  so every diff below is attributable to this change.
- Reader: `node peruk.mjs --gate` ⇒ `✓ peruk: 28 פירוקים ⇒ 28 ספקים`; the other 27 specs are byte-identical
  (no source doc contained a `{` placeholder before, so the new branch cannot fire for them).
- Generator: `app-ds` reports `9/9 חלקיקים נמצאו-ומחווטים` (was 8/8). `particle-plan-peruk21.md` gained the row
  `תשובה | תיק | message | switch⇒SegmentedSwitch · alert⇒AlertBanner | ForgeMustChip + DsNote`.
- Emitted Dart (`new/dart-gen-bs/gen_app_peruk21_px1.dart`): per record, a `ForgeMustChip` over the four
  `סיווג` values writing back via `appStore.update`, and a `DsNote` whose message is
  `'קיבלתי, הסיווג: ' + r['סיווג']`, blank when the field is empty. The same particle also appears on the home
  record card and in the report screen (rp1), which is the engine's normal treatment of message particles.
- Sanity without Flutter: bracket counts balance in px1/rp1/hub; every `gen_app_peruk21_px1_c*` constant referenced
  is defined; the shape matches the already-compiling sechirut message particle. (home.dart shows a 2-paren gap under
  my crude string-stripping checker, identical at HEAD ⇒ checker artifact, not a regression.)
- `node machtzev/police.mjs --fast`: 40 ran, 3 failed, all pre-existing and unrelated:
  `learn` (missing git blobs in this shallow clone), `index-complete` (formula-fns/sort-cmp/spec-lang-doc.mjs
  lack INDEX.md lines; committed at HEAD), `truth` (TRUTH.md says 49 scripts/53 gates, live is 52/55; gates.tsv
  and those scripts are unmodified by me). `pins.sha256` at HEAD was already stale for police.mjs, particles.mjs,
  render-ds.mjs, gates.tsv and LEARNINGS.md; the `--write` refresh covers those too.
- Pre-existing dirty files `gen_app_sechirut_ent2*` and untracked `panuy*` were left untouched.
