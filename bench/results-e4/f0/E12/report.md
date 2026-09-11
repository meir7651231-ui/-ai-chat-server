# Report — «סך הכל» particle on the payments screen (sechirut)

## What I did
1. `machtzev/generator/specs-ds/sechirut.txt`: added one line after the existing payment particles:
   `חלקיק תשלום: סך הכל = סכום(סכום)`
   (same open grammar as the existing `הכנסה = סכום(סכום)`; no generator code touched).
2. Regenerated the app with the documented command:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   Output: `20/20 נמצאו-ומחווטים` (was 19/19). tighten-types was not run (known-broken).

## Files changed by regeneration (only these, verified by diffing every sechirut output vs a pre-change snapshot)
- `new/dart-gen-bs/gen_app_sechirut_px4.dart` — the payments particle screen: a third row
  `KvLine(label: 'סך הכל', value: appStore.sum('app_sechirut_ent4', 'סכום').toStringAsFixed(0))`
  inside an `AnimatedBuilder(animation: appStore, …)`, identical in shape to the existing הכנסה row.
- `new/dart-data-bs/auto/gen_app_sechirut_px4_content.dart` — new string constants (label 'סך הכל', field 'סכום', subtitle '3 חלקיקים חיים').
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart` — hub tile subtitle '2 חלקיקים חיים' ⇒ '3 חלקיקים חיים'.
- `machtzev/generator/particle-plan-sechirut.{json,md}` — one new plan row: סך הכל · תשלום · sum · headline⇒KpiTile · wired KvLine.
- `apps/sechirut.json` and `report-plan-sechirut.json`: byte-identical to before.

## How I know it works
- The shape parser maps `סכום(שדה)` to kind `sum`; the emitter wires it to `appStore.sum(entity, field)`
  (`ds_store.dart:184` folds every record's field, parsing digits) — a real aggregate, no invented data (§20-ג).
- `KvLine` (`new/dart-ui-bs/auto/kv_line.dart`) takes exactly `label: String, value: String`, which is what is emitted;
  the same atom/call already compiles for the neighbouring הכנסה particle, so this row is type-identical.
- `node machtzev/generator/particles.mjs --gate` ⇒ `✓ particles: 449 חלקיקים ב-32 ספקים — כולם נמצאו ומחווטים`.
- Determinism: ran app-ds a second time; all 7 regenerated files are byte-identical to the first run.
- Flutter/Dart are not installed, so no `flutter analyze`/build was run; the genverify gate self-skips (no buildsmart).

## Police (`node machtzev/police.mjs --fast`): 39 ran · 4 failed — all 4 pre-existing, none caused by this change
- `truth`: TRUTH.md/CLAUDE.md truth-block drift = generator scripts 49⇒52 and gates 53⇒55 (from HEAD commit 5405387).
  Proven by `truth.mjs --write` diff (then restored originals); every input truth.mjs reads is unmodified vs HEAD.
- `pins`: flags render-ds.mjs, police.mjs, particles.mjs, gates.tsv, LEARNINGS.md — all unmodified vs HEAD (stale pins.sha256 at HEAD).
- `index-complete`: formula-fns.mjs / sort-cmp.mjs / spec-lang-doc.mjs missing from INDEX.md — committed files, not mine.
- `learn`: 9 lessons reference git blobs absent from this checkout.

## Notes
- `gen_app_sechirut_ent2.dart` + its content file were already modified in the working tree before I started
  (bug-fixed formula columns vs the committed version); regeneration reproduces them byte-for-byte, so they are unchanged by me.
- No git commit/push/remote operations were performed.
