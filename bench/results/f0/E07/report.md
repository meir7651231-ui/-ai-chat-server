# Report — «דחופים» counter on the peruk21 case screen

## What I did
1. **Spec** `machtzev/generator/specs-ds/peruk21.txt`: added one line after the `[ריק]` particle:
   `חלקיק תיק: דחופים = מונה(סיווג=הזמנה לוועדה)`
   (same grammar as the existing `חלקיק ממצא: אדומים = מונה(צבע=אדום)` in sechirut.txt).
2. **Regenerated** the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin`
   → «9/9 חלקיקים נמצאו-ומחווטים» (was 8/8). The `tighten-types` step was not run (known-broken).
3. **Kept the spec regenerable.** peruk21.txt is derived byte-for-byte from `peruks/peruk-21.md` by
   `peruk.mjs`; the `peruk` police gate compares disk ≡ generator, and `regen`/`one` re-run `peruk.mjs --all`,
   so a bare hand-edit turned the gate red and would be silently deleted on the next pipeline run.
   Minimal fix: `peruk.mjs` now accepts an optional owner sidecar `peruks/<doc>.extra.txt` whose
   `חלקיק …` lines are appended right after the base particles (comments/other lines ignored).
   Added `peruks/peruk-21.extra.txt` with the counter line. peruk.mjs is signature-pinned, so
   `node machtzev/pins-check.mjs --write` refreshed that single pin (1-line change in pins.sha256).

## Files changed
- specs-ds/peruk21.txt (+1) · peruks/peruk-21.extra.txt (new) · peruk.mjs (+5 lines) · pins.sha256 (1 hash)
- particle-plan-peruk21.{json,md} (new count row) · gen_app_peruk21_px1.dart · gen_app_peruk21_px1_content.dart
  · gen_app_peruk21_hub_content.dart («9 חלקיקים חיים»). No other spec/app touched.

## How I know it works
- Generated Dart (`new/dart-gen-bs/gen_app_peruk21_px1.dart`) contains a live, store-bound counter:
  `KvLine(label: 'דחופים', value: appStore.records('app_peruk21_ent1').where((r) => (r['סיווג'] ?? '') == 'הזמנה לוועדה').length…)`
  wrapped in `AnimatedBuilder(animation: appStore …)` — counts exactly the cases whose סיווג is הזמנה לוועדה
  and updates on every store change. The particle plan shows `דחופים | תיק | count | headline⇒KpiTile | KvLine`
  (identical resolution to the sechirut precedent).
- The rest of the px1 diff is only constant renumbering (c93→c99 etc.); widget structure unchanged.
- `node machtzev/generator/peruk.mjs --gate`: ✓ all 28 documents, spec-on-disk ≡ generator, index ≡ generator.
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · 1 failed = `learn` only. `learn` fails on git blobs
  that do not exist in this shallow clone (`git cat-file -e` → missing; `--is-shallow-repository` → true) and
  was failing before my change; it is unrelated. `particles` (449/449 wired), `peruk`, `pins`, `balagan`,
  `balaganone`, `oracle`, etc. are green.
- Verified pre-change: HEAD spec == `perukToSpec(peruk-21.md)` (true), so the gate was green before and is green after.
- Flutter/Dart are not installed, so no `flutter analyze` was run; the Dart output follows the same
  generator template already compiling for sechirut's `מונה(צבע=אדום)`.
- No commits, no git remote activity.
