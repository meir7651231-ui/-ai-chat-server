# Report — peruk02: cases table sorted by «תאריך מסירת מפתח», earliest first

## What I did
`specs-ds/peruk02.txt` is generated from `peruks/peruk-02.md` by `peruk.mjs`, and the `peruk` gate enforces
disk ≡ generated, so I did not hand-edit the spec. Instead the sort is expressed in the source document and
carried through the reader into the existing `[טבלה] | מיון:` grammar (sort-cmp.mjs, L105):

- `machtzev/generator/peruk-lang.data.json` — new vocabulary key `sortKey: "מיון"` (no Hebrew in code, §19).
- `machtzev/generator/peruk.mjs` — header parser reads `מיון: <שדה>` (next to `הרגע:`/`קטגוריה:`); the
  emitter appends `| מיון: <שדה> עולה` to the root table particle only when the field is an exact root-field
  label; `peruk-index.json` node gets `sort`; `--gate` reports a sort field that is not a root field.
- `machtzev/generator/peruks/peruk-02.md` — added header line `מיון: תאריך מסירת מפתח`.
- Ran `node machtzev/generator/peruk.mjs --all`: only `specs-ds/peruk02.txt` and `peruk-index.json` changed
  (the other 27 specs are byte-identical). The table line is now
  `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`.
- Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`:
  regenerated `new/dart-gen-bs/gen_app_peruk02_px1.dart` (+ its `_content.dart`) and
  `particle-plan-peruk02.{json,md}`. 9/9 particles found and wired, as before.

## How I know it works
- The generated table now iterates `appStore.records('app_peruk02_ent1').toList()..sort((a, b) { … })`
  keyed on the constant whose value is `'תאריך מסירת מפתח'`, ascending, empties last (see the diff of
  `gen_app_peruk02_px1.dart`). Only the table widget changed; the other particles are unchanged.
- Dates are stored by `DsDateField` as ISO `yyyy-mm-dd` (`ds_date_field.dart:25`), so the comparator's
  lexical branch (numeric parse fails on ISO strings) is chronological.
- Semantic test: I extracted the comparator text verbatim from the generated Dart, transliterated it to JS,
  and sorted five records (three ISO dates out of order, one missing field, one empty string). Result
  `אבגדה` = earliest first, empties last. (Dart/Flutter can't run here; the dart binary present needs
  an approval I could not obtain, so this is a JS execution of the emitted text, not a Dart compile.)
- `node machtzev/generator/peruk.mjs --gate` → `✓ peruk: 28 פירוקים ⇒ 28 ספקים`.
- `node machtzev/police.mjs --fast` before vs after: identical outcome — 39 ran, 4 failed, and the same four
  gates fail both times (`truth`, `pins`, `index-complete`, `learn`), all for pre-existing reasons:
  TRUTH.md drift, missing signatures for formula-fns/spec-lang-doc plus drift in particles/render-ds/
  police/LEARNINGS/gates.tsv, INDEX.md lines missing for three unrelated scripts, and learn refs to git
  blobs absent from this shallow clone. The gates that cover my change (`peruk`, `particles`, `balagan`,
  `balaganone`, `oracle`) all ran green.

## Notes / left for the owner
- `peruk.mjs` is signature-pinned; its pin is now stale like the other already-stale pins. I did not run
  `pins-check --write` because it would also re-pin unrelated pre-existing drift; run it at commit time.
- Pre-existing untracked/modified files (panuy, sechirut, _prompt-builder.md) were not touched.
- Skipped `tighten-types.mjs --record --apply` as instructed. No commits, no git remotes touched.
