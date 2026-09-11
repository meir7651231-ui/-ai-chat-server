# peruk02: third entity «תשלום» (payment) — report

## What I did
- `specs-ds/peruk02.txt` is **generated** from the owner's doc `peruks/peruk-02.md` by `peruk.mjs`, and the `peruk` police gate fails if the spec on disk differs from the generator output. A hand edit alone would have turned that gate red on the next run and been overwritten by `regen`. So I added the entity at the source and let the generator emit it:
  - `peruks/peruk-02.md`: new section `## 13. עוד עוקבים לתיק` → `### תשלום` with `חובה: - סכום` and `רשות: - שולם: כן או לא`.
  - `peruk-lang.data.json`: new section vocabulary `children: ["עוד עוקבים"]` (no Hebrew in engine code, per §19). Checked: no existing h2 heading in the 28 docs matches it.
  - `peruk.mjs`: `childrenFrom()` — each `###` under that section becomes a child entity: required link to the root (`תיק*`), `חובה/רשות` items, `שם: א או ב` ⇒ closed choice, `| מחיקה: תיק=מפל` (cascade), plus a `חלקיק <ent>: [טבלה]` table screen. Node gets `children: [...]` only when non-empty.
- Ran `node machtzev/generator/peruk.mjs --all` → `peruk02.txt` now contains
  `ישות תשלום עם תיק*, סכום*, שולם{כן|לא} | מחיקה: תיק=מפל` and `חלקיק תשלום: [טבלה]`. The other 27 specs are byte-identical (git status). `peruk-index.json` gained `children: ["תשלום"]` on node 2 only.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin` → 3 entities, `relations: true`; new `gen_app_peruk02_ent3` (form + grid), `gen_app_peruk02_px3` (dedicated table screen), dashboard renumbered scr3→scr4 (no external references to the old name, verified by grep). Root case page imports ent3 (payments section).
- Ran `node machtzev/generator/balagan.mjs` (consumes all paper modules) — only `gen_balagan_moments.dart` TF-IDF weights shifted (corpus grew by 3 words); moment identification still 30/30.
- Skipped `tighten-types.mjs --record --apply` (known-broken). No git commit/push.

## How I know it works
- Generated Dart for `תשלום`: `DsSelect(entity:'app_peruk02_ent1')` for the link, `DsNumberField` for סכום, `DsEnumField(options:[כן,לא])` for שולם; validation adds "חסר תיק"/"חסר סכום" when empty (required); `ForgeDataGrid` with 3 columns in ent3 and px3.
- Cascade: `gen_app_peruk02_relations.dart` now registers `app_peruk02_ent3 → app_peruk02_ent1` with policy 1 (= cascade per `ds_store.dart` comment; `מפל: 1` in `spec-lang.data.json`).
- All 382 relative imports in regenerated peruk02/balagan Dart files resolve; braces balanced (script check). Flutter is not installed, so no `analyze`.
- Gates run directly: `peruk --gate` ✓ (28/28, spec ≡ generator), `particles --gate` ✓ (449 particles / 32 specs, 0 unresolved), `balagan-one --gate` ✓ (30 modules), `balagan-look --gate` ✓ 35/36 (unchanged floor).
- `police.mjs --fast` baseline BEFORE my change was already red on 4 pre-existing gates: truth, pins (6 files others changed without re-signing), index-complete, learn (missing git objects in this clone). AFTER: POLICE_AFTER_PLACEHOLDER

## Known follow-up for the owner
- `peruk.mjs` is signature-pinned. The pre-tool hook blocks hand-editing `pins.sha256`, and `pins-check.mjs --write` would also re-sign the 6 unrelated files others changed, so I did not run it. Expected one-liner in the landing commit: `node machtzev/pins-check.mjs --write`.
