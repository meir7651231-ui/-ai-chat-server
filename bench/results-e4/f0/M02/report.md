# Report — peruk12: second entity «בדיקה» (inspection)

## What changed
`specs-ds/peruk12.txt` now has exactly the three requested lines (everything else byte-identical):
- `ישות בדיקה עם תיק*, מה נבדק*, תקין{כן|לא} | מחיקה: תיק=מפל`
- `לוח בקרה עם מונה(תיק), מונה(בדיקה: תקין=לא)`
- `חלקיק בדיקה: [טבלה]`

The spec is **generated** from the owner's document (`peruks/peruk-12.md`) and the `peruk` police gate
requires disk spec ≡ reader output, so a hand edit alone would have turned that gate red. Instead:
- `peruks/peruk-12.md`: new section `## 10. ישויות-בת` → `### בדיקה` with `חובה: מה נבדק` and `רשות: תקין (כן/לא)`.
- `peruk-lang.data.json`: new heading kind `sections.children`, `yesNoRe` (parenthesised `(כן/לא)`), `yesNo`.
- `peruk.mjs`: structural child-entity rule — each `###` under that section ⇒ entity with `תיק*` first,
  `מחיקה: תיק=מפל`, a `[טבלה]` particle; each yes/no field ⇒ dashboard counter on `לא` (mirrors the
  existing "count the red findings" rule). `(כן/לא)` marker ⇒ `{כן|לא}`; bare `כן/לא` (peruk-18) untouched.
  `peruk-index.json` nodes gain a `children` array.
- Regenerated: `apps/peruk12.json`, particle/report plans, `new/dart-*/gen_app_peruk12_*` (ent2, px2,
  relations, dashboard renumbered scr2→scr3), and the combined app (`gen_balagan_main/moments.dart`,
  relations import for peruk12; moment self-identification still 30/30).

## How I know it works
- `peruk.mjs --all` then `--gate`: 28/28 ✓; `git status` shows peruk12.txt as the only changed spec.
- `app-ds.mjs -f …peruk12.txt --name peruk12 --skin`: 8 screens, 2 entities, 7/7 particles wired,
  1 child entity in navigation (baseline: 7 screens, 1 entity, 6/6).
- Generated Dart bytes: `ent2` validates only `תיק` and `מה נבדק` as required, `תקין` is an enum with
  constants `כן`/`לא`; `scr3` counts `records('app_peruk12_ent2').where(r[תקין] == לא)`; `px2` is a
  `ForgeDataGrid` over the three inspection fields; `relations.dart` registers ent2→ent1 cascade.
- Gates: `particles` ✓ (449 particles), `peruk` ✓, `balagan` 35/36 (unchanged floor), `balaganone` ✓.
- `police --fast` before and after: identical result — 4 failed (`truth`, `pins`, `index-complete`, `learn`),
  all pre-existing (missing git blobs, unsigned drift in police.mjs/render-ds.mjs/etc., TRUTH.md stale).
  No new red gate. Bracket-balance check on the new Dart files: all balanced (Dart/Flutter not installed).

## Caveats
- `pins` now also lists `peruk.mjs` (my change). The ledger is hook-protected; `pins-check --write` would
  also bless pre-existing unsigned changes I did not make, so I left it for the committer to run.
- `tighten-types.mjs` was skipped as instructed. No commits, no git remote activity.
