# Report — calendar: `משך בדקות` + computed `משך בשעות`

## What I changed
1. `machtzev/generator/specs-ds/calendar.txt` — meeting entity now reads:
   `ישות פגישה עם מה*, מועד*, שעה, מקום, משך בדקות, משך בשעות = משך בדקות / 60, הערה | שלבים: קבוע, התקיים`
2. `machtzev/generator/spec-lang.data.json` — added `דקות` to `typeNum` (the parser types a field by words in its
   name; `דקות` was not a number word, so the field would have been text). `שעות` was already a number word.
3. Same file — new list `typeDuration: [דקות, בדקות, שעות, בשעות]`, and in `app-shell.mjs` (home-screen "₪ on the row")
   and `balagan.mjs` (module money list) duration fields are excluded from the *money* field pick. Without this, the
   home row and the combined app showed a 45-minute meeting as "₪ 45" (first numeric field = money heuristic).
   Prefixed forms are listed because those helpers match whole words.
4. `spec-lang-doc.mjs` — doc template mentions the new list; `SPEC-LANG.md` regenerated (gate `speclangdoc`).
5. Regenerated: `node machtzev/generator/spec-lang-doc.mjs`, `app-ds.mjs -f …/calendar.txt --name calendar --skin`,
   `balagan.mjs` (combined app consumes the calendar manifest). `tighten-types` skipped as instructed. No git ops.

## Generated result (bytes, `new/dart-gen-bs/gen_app_calendar_ent1.dart`)
- slot 4: `DsField(label: 'משך בדקות', …)` free input; manifest `apps/calendar.json` types it `num`.
- slot 5: `_calc('משך בשעות', (num.tryParse(_v[4] ?? '') ?? 0)  / 60)` read-only; saved as `.toStringAsFixed(2)`;
  both fields appear in labels, record card, CSV export and data grid. Same `/` pattern already compiles in sechirut.
- `gen_app_calendar_home.dart` is byte-identical to git (`_nums = []`, as before); root page diff = constant renumbering.
- `gen_balagan_moments.dart`: calendar module fields +2, `numFields` stays `[]`; other modules differ only in TF-IDF weights.

## Verification
`node machtzev/police.mjs --fast`: 39 ran · 12 skipped · 4 failed. All gates touching this change are green:
particles (448/32 specs), formulafns, speclangdoc, peruk (28/28, disk ≡ generator), balagan look 35/36 (floor 35, 0 red),
balaganone 30/30, genratchet, acceptance, nlsmoke-level purity scanners (datapurity/deeppurity/puredata/freeref).
The 4 red gates are pre-existing at HEAD, not caused by this change:
- `pins`: files render-ds.mjs, police.mjs, LEARNINGS.md, gates.tsv, particles.mjs differ from pins.sha256 — I did not
  edit any of them (git status clean for all five).
- `truth`: TRUTH.md/CLAUDE.md record 53 gates, live gates.tsv has 55 rows; all three files untouched by me.
- `index-complete`: INDEX.md lacks rows for formula-fns/sort-cmp/spec-lang-doc, all committed in HEAD (5405387).
- `learn`: references git blobs missing from this clone.
Flutter/Dart unavailable, so no analyze/build here; the emitted shapes are the same ones the existing green paper apps use.

## Pre-existing working-tree state left as-is
`gen_app_sechirut_ent2*.dart` were already modified and `panuy*`/`_prompt-builder.md` untracked before I started.
