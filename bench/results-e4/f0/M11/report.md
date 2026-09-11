# Report — peruk25: WhatsApp export line in the case report

## Outcome
No edit was needed. The requested line already exists, byte-identical at HEAD, at
`machtzev/generator/specs-ds/peruk25.txt:22`:

    דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה

It is the same form used by the other peruk specs (peruk03/05/06/08/10/12/14/16/22/28 …).
The `תיק` entity declares `טלפון` on line 6, so the export uses the phone field as asked.

## Why I did not add a second line
The spec is generated from `machtzev/generator/peruks/peruk-25.md` by `peruk.mjs`
(lines 208–209 emit the `[ייצוא]` line automatically whenever a person field matches `טלפון`).
The `peruk` police gate requires the on-disk spec to equal the freshly generated one, so a
hand-added duplicate would have broken that gate ("הספק בדיסק ≠ המחולל"). Adding it again
would violate "don't break anything".

## How I know it works
1. `node machtzev/generator/peruk.mjs --all` regenerated all 28 specs; `git diff` on
   specs-ds/ and peruk-index.json is empty, so the disk spec ≡ generated spec.
2. `node machtzev/generator/peruk.mjs --gate` → exit 0 (peruk-25: 3 fields · 5 parts · 34 content).
3. `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
   ran clean: 7 particles found+wired, 1 report screen, 7 screens generated; no peruk25 output changed.
4. Generated Dart proves the wiring (bytes):
   - `new/dart-gen-bs/gen_app_peruk25_rp1.dart:14` — `שליחה בוואטסאפ⇒DsChipButton+waLink`
   - `…rp1.dart:60-63` — `reportTextGenAppPeruk25Rp1Screen(...)` then
     `waLink((r0[gen_app_peruk25_rp1_c67] ?? ''), text, waDigits)` → launchUrl, Share fallback
   - `new/dart-data-bs/auto/gen_app_peruk25_rp1_content.dart:67,69` — c65 = 'שליחה בוואטסאפ', c67 = 'טלפון'
5. `node machtzev/police.mjs --fast`: 39 ran · 4 failed. Relevant gates green: peruk (28/28),
   particles (448 wired), shapeops, compose-determinism, skingolden.
   The 4 failures are pre-existing and unrelated to this task:
   - pins / truth / index-complete: flagged files (police.mjs, render-ds.mjs, gates.tsv, LEARNINGS.md,
     particles.mjs, TRUTH.md, INDEX.md) are byte-identical to HEAD (`git diff --quiet HEAD` passes),
     i.e. the committed pins.sha256/TRUTH/INDEX are stale at HEAD, not changed by me.
   - learn: shallow clone (depth 2) lacks the referenced git blobs.
   Not run: `tighten-types.mjs --record --apply` (known-broken, per instructions). No Dart test was
   emitted because no buildsmart pubspec.yaml exists here; Flutter is not installed, so no analyze.

## Files changed
None in the repo (only this report). Pre-existing dirty tree left untouched
(2 modified sechirut Dart files, untracked panuy app + `_prompt-builder.md`).
