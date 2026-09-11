# Report — «שלח הודעה» action on the people (אדם) particle screen of panuy

## What I did
1. `machtzev/generator/specs-ds/panuy.txt`: added one line after the existing action particle:
   `חלקיק אדם: [פעולה] שלח הודעה`
   (`[פעולה] <text>` is the documented action-button form in `specs-ds/SPEC-LANG.md`; `particles.mjs` `shapeOf` ⇒ kind `act`.)
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
   (skipped the known-broken `tighten-types.mjs --record --apply`; no git commit/push).

## Resulting changes (byte-diff of every generated file before vs after, 1350 files snapshotted)
Exactly 5 files changed, all panuy-specific; `apps/panuy.json` and all other apps unchanged:
- `new/dart-gen-bs/gen_app_panuy_px1.dart` — new row on the particle screen:
  `ProposePrimaryBtn(label: gen_app_panuy_px1_c90, onTap: () => Navigator…push(… GenAppPanuyEnt1Screen()))`
  + `import '../dart-ui-bs/auto/propose_primary_btn.dart';` + header comment `פעולה שלח הודעה ⇒ act ⇒ [action] ⇒ ProposePrimaryBtn`.
  The existing `BigButton(label: …c87 /* הזמן עכשיו */)` row is still present (count = 1).
- `new/dart-data-bs/auto/gen_app_panuy_px1_content.dart` — `c90 = 'שלח הודעה'`, subtitle `13 חלקיקים חיים · 0 לא-פתורים` (was 12); other constants renumbered.
- `new/dart-data-bs/auto/gen_app_panuy_hub_content.dart` — hub counter `13 חלקיקים חיים` (was 12).
- `machtzev/generator/particle-plan-panuy.{json,md}` — new plan row: `פעולה שלח הודעה | אדם | act | action⇒ProposePrimaryBtn`.

## How I know it works
- Generator output: `🧩 חלקיקים: 13/13 נמצאו-ומחווטים · 1 מסכי-חלקיקים` (was 12/12); 0 unresolved.
- Selected atom `ProposePrimaryBtn` (`new/dart-ui-bs/auto/propose_primary_btn.dart`) has `required this.label` (String) and `required this.onTap` (VoidCallback?) — exactly the named args emitted.
- Every `import` in the regenerated `gen_app_panuy_px1.dart` resolves to an existing file (checked with a node script; 14 relative imports ok + package:flutter).
- `node machtzev/police.mjs --fast`: the `particles` gate is green — `449 חלקיקים ב-32 ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים`; `compose-determinism`, `no-fakers`, `cover`, `opcensus`, `skingolden`, `atom-count` all green.
- Flutter/Dart are not installed, so no `flutter analyze`; the emitted Dart follows the identical pattern the generator already used for the existing `[פעולה]` button.

## Pre-existing police failures (not caused by this change — verified)
- `truth`: TRUTH.md drift is only `generator/ קנוני 49⇒52` and `gates 53⇒55` (diffed TRUTH.md vs `truth.mjs` output). Nothing about panuy.
- `pins`: reports `render-ds.mjs` / `police.mjs` changed without signature update; `git diff` on both is empty — I did not touch them, the pin file is stale in the checkout.
- `index-complete`: 3 scripts (`formula-fns`, `sort-cmp`, `spec-lang-doc`) missing from INDEX.md — not mine.
- `learn`: 9 lessons reference git blobs absent from this checkout (`fatal: bad object`) — environmental.
- Note: `new/dart-*-bs/*sechirut_ent2*` were already modified in the working tree before I started; left untouched.
