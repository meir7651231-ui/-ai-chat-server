# Report — «שלח הודעה» action button on the people (אדם) particle screen

## What I did
1. `machtzev/generator/specs-ds/panuy.txt` — added one line, directly after the existing action particle:
   `חלקיק אדם: [פעולה] שלח הודעה`
   This uses the `[פעולה] <label>` shape already defined by `particles.mjs` (`shapeOf` ⇒ kind `act`),
   the same shape the existing «הזמן עכשיו» button uses. No generator code was touched.
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
   (skipped `tighten-types.mjs`, as instructed). No git operations were performed.

## How I know it works
- Generator output: `🧩 חלקיקים: 13/13 נמצאו-ומחווטים` (was 12/12 before the edit). App still emits 6 screens.
- Byte diff against a pre-edit snapshot of all 28 panuy output files: only 3 files changed, all as expected.
  - `new/dart-gen-bs/gen_app_panuy_px1.dart` (the אדם particle screen): one new widget line
    `ProposePrimaryBtn(label: gen_app_panuy_px1_c90, onTap: () => Navigator...push(... GenAppPanuyEnt1Screen()))`
    placed right after the existing `BigButton` («הזמן עכשיו»), plus its import and the header comment line
    `פעולה שלח הודעה = [פעולה] שלח הודעה ⇒ act ⇒ [action] ⇒ ProposePrimaryBtn`. Existing button unchanged (still BigButton).
  - `new/dart-data-bs/auto/gen_app_panuy_px1_content.dart`: new constant `gen_app_panuy_px1_c90 = 'שלח הודעה'`
    (later constants renumbered; all references in px1.dart were regenerated consistently).
  - `new/dart-data-bs/auto/gen_app_panuy_hub_content.dart`: derived counter `'12 חלקיקים חיים'` → `'13 חלקיקים חיים'`.
- `particle-plan-panuy.md/json` now list `פעולה שלח הודעה | אדם | act | action⇒ProposePrimaryBtn`.
- Atom sanity (Flutter not installed, so verified by reading): `new/dart-ui-bs/auto/propose_primary_btn.dart`
  declares `required this.label` and `required this.onTap` (`VoidCallback?`), matching the emitted call.
- Gate `particles`: `node machtzev/generator/particles.mjs --gate` ⇒ ✓ 449 particles in 32 specs, all wired.
- `node machtzev/police.mjs --fast`: 40 gates ran, 12 skipped (--fast), 1 failed: `learn`.
  The `learn` failure is environmental and pre-existing: it resolves historical git blob refs from
  LEARNINGS.md, and this checkout is a shallow clone with 1 commit (`git rev-parse --is-shallow-repository` ⇒ true;
  `git cat-file -t <ref>` ⇒ "could not get object info"). Nothing in my change touches git objects or LEARNINGS.md.
- `git status` shows no changes outside the panuy namespace (all panuy files were already untracked before I started).

## Notes
- The engine chose `ProposePrimaryBtn` for «שלח הודעה» (vs `BigButton` for «הזמן עכשיו») via its open catalog search
  on the label words — per doctrine §20 (best-for-purpose, not first-fit). Both navigate to the אדם entity screen,
  which is the only navigation target the `act` shape currently wires.
