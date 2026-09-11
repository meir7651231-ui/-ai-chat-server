# Report: priority field on תיק in peruk02

## What was done
- `specs-ds/peruk02.txt` line 6 now ends `…, קבלות על תיקונים שהוא, עדיפות{גבוהה|בינונית|נמוכה} | שלבים …` (closed choice, optional).
- That spec is a **generated** file: `peruk.mjs --all` (run by `regen.mjs` before every app build) derives it from the
  owner document `peruks/peruk-02.md`, and the `peruk` police gate requires disk ≡ generator. A hand edit alone went red
  and would be overwritten on the next pipeline run. So the field was added at the source:
  - `peruks/peruk-02.md`: one optional-input line `- עדיפות: גבוהה / בינונית / נמוכה` under «מה שולחים».
  - `peruk.mjs` (`fieldsFrom/push`): one additive rule — an input item shaped `label: a / b / c` (≥2 short
    slash-separated values after a colon) becomes `label{a|b|c}`. Structural only (punctuation), no Hebrew in engine.
    The existing "decision" grammar was rejected because a decision would also re-key this app's WhatsApp-message
    part onto the new field.
- Regenerated: `peruk.mjs --all` → `specs-ds/peruk02.txt` + `peruk-index.json` (peruk02 fields 10→11);
  `app-ds.mjs … --name peruk02 --skin` → `apps/peruk02.json` + 7 `gen_app_peruk02_*` Dart files;
  `balagan.mjs` → `gen_balagan_moments.dart` (only peruk02's term-weight line).
- `pins.sha256` re-signed via the sanctioned `pins-check.mjs --write` (hand edits are hook-blocked).
- `tighten-types.mjs` skipped as instructed. No git commit/push.

## How I know it works
- Baseline: regenerating peruk02 before any change left the tree unchanged (generator is deterministic).
- Generated Dart: `gen_app_peruk02_ent1_content.dart` has c21..c24 = עדיפות/גבוהה/בינונית/נמוכה; `gen_app_peruk02_ent1.dart`
  adds `import ds_enum_field.dart` and a `ForgeDsEnumField(… options: const [c22,c23,c24] …)` on the form; the new
  column is in the card, table, CSV and root detail views; hub shows «13 שדות». app-ds log: enumField×1 → ×2.
- Parser rule is inert elsewhere: with the rule in place and documents untouched, `peruk.mjs --gate` passed 27/28 and
  flagged only peruk-02 (my manual spec edit). A scan of all 28 docs' input sections found no other `label: a / b` line.
- After the doc change, `peruk.mjs --all` changed only `specs-ds/peruk02.txt` and the peruk02 index node; the
  regenerated spec line is byte-identical to the intended hand edit.
- Gates: `peruk --gate` ✓ 28/28; `balagan-one --gate` ✓ 30/30; `police.mjs --fast`: 40 ran, 0 yellow, 3 failed.
- Idempotence: rerunning peruk → app-ds → balagan yields the identical changed-file set (16 files).
- Flutter/Dart not installed, so no `flutter analyze`; the Dart diff is shape-identical to peruk01's existing enum field.

## Pre-existing failures (not caused by this change, verified)
- `pins` was already red at HEAD (render-ds.mjs, police.mjs byte-identical to HEAD yet mismatched); `--write` also
  corrected those stale lines (LEARNINGS.md, gates.tsv, particles.mjs, render-ds.mjs, police.mjs, +formula-fns.mjs,
  +spec-lang-doc.mjs, all identical to HEAD). Only the peruk.mjs line is due to my change.
- `truth`: TRUTH.md vs live drifts only in script count (49→52) and gate count (53→55). `index-complete`: three
  scripts I never touched lack INDEX.md rows. `learn`: 9 lesson refs point at git blobs missing from this clone.
- Working tree already had unrelated uncommitted changes (sechirut, panuy); untouched.
