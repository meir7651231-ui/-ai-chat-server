# Report — «סיכום» section in the sechirut case report

## What I did
1. `machtzev/generator/specs-ds/sechirut.txt` — added one report line after «הסתייגות»:
   `דוח תיק: סיכום = [תוכן סיכום]`
   and three content lines after `תוכן הסתייגות: …`:
   - `תוכן סיכום: הבטוחות ייבדקו מול התקרה.`  (exact text required by the task)
   - `תוכן סיכום: הסעיפים האדומים קודמים לכל בקשה אחרת.`
   - `תוכן סיכום: ההחלטה נשלחת למשכיר עד מועד החתימה.`
   Same grammar as the existing «מה לא בדקנו» / «הסתייגות» sections (G24: `[תוכן <קבוצה>]` + `תוכן <קבוצה>: text`).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
   (Skipped `tighten-types.mjs` as instructed.)

## How I know it works
- Generator run: clean, no errors. Particles 19/19 found and wired · content items 50 → 53 · 1 report screen · 10 screens.
- `report-plan-sechirut.json`: new section `{"name":"סיכום","refs":[{"raw":"[תוכן סיכום]","mode":"content","wired":["DsNote"]}]}`.
- `particle-plan-sechirut.md`: new row `| תיק | סיכום | [תוכן סיכום] | content | DsNote |`.
- `new/dart-data-bs/auto/gen_app_sechirut_rp1_content.dart`: constants `c298='סיכום'`, `c299='הבטוחות ייבדקו מול התקרה.'`,
  `c302`/`c305` = the other two lines, `c309` = the joined bullet block for the WhatsApp export text.
- `new/dart-gen-bs/gen_app_sechirut_rp1.dart`: header comment `סיכום = [תוכן סיכום]` / `⇒DsNote`; `reportText…` now appends
  `c297` (`*סיכום*`) and `c309`, mirroring how «הסתייגות» is emitted.
- Hub card updated automatically: «תיק · דוח» now says «10 חלקים» (was 9).
- Flutter/Dart not installed, so no `flutter analyze`. Substitute check: a script verified every `gen_app_sechirut_<screen>_cN`
  constant referenced by each generated screen (rp1, ent2, hub, root, main, px1–px4) is defined in its content file — 0 missing.
- `node machtzev/police.mjs --fast`: 39 ran · 0 yellow · 4 failed. All 4 failures are pre-existing and unrelated to this change:
  - `pins`: `render-ds.mjs` / `police.mjs` flagged, but both are byte-identical to HEAD (`git status` clean) — stale pin file.
  - `truth`: TRUTH.md drift is only script count 49→52 and gate count 53→55, not content/report numbers.
  - `index-complete`: three pre-existing scripts (formula-fns, sort-cmp, spec-lang-doc) missing from INDEX.md.
  - `learn`: references git blobs absent from this checkout.
  Relevant gates that passed: `particles` (449 particles / 32 specs, all wired), `no-fakers`, `compose-determinism`, `autoskin`, `skingolden`, `oracle`.

## Notes
- Diff in `gen_app_sechirut_ent2*.dart` is generator drift (committed file still had a `monthKey` live field the current
  generator no longer emits); it was already dirty before my regen and is not caused by the spec edit.
- Untracked `panuy*` files and `_prompt-builder.md` were present before I started; untouched.
- No git commit/push/remote operations.
