# Report: sort peruk21 cases by deadline «עד מתי» (soonest first)

## What I did
The spec `specs-ds/peruk21.txt` is a generated artifact: `peruk.mjs --all` writes it from the owner
document `peruks/peruk-21.md`, and the commit gate `peruk` requires spec-on-disk ≡ reader output.
So hand-editing the spec would have broken that gate. Instead the reader now emits the existing
sort grammar (`| מיון: <field>`, L105) for deadline fields:

- `peruk-lang.data.json`: new vocabulary entry `deadlineWords: ["עד"]` (all Hebrew stays in data).
- `peruk.mjs`: if a root date field (typeDate) starts with a deadline word, append
  `| מיון: <field>` to the entity line and `| מיון: <field>` to the `[טבלה]` particle. Ascending
  is the grammar default; empty values sort last (existing `sort-cmp.mjs` comparator).
- `render-ds.mjs`: the entity-list sort now runs on a copy (`(...).toList()..sort(...)`) instead of
  calling `rs.sort` on the store's live record list inside `build`. Byte-identical when no sort.
- Regenerated: `peruk.mjs --all` (only peruk21.txt changed, peruk-index.json unchanged), then
  `app-ds.mjs -f specs-ds/peruk21.txt --name peruk21 --skin`.

Result in the generated Dart:
- `gen_app_peruk21_px1.dart` (particle screen table): `ForgeDataGrid` rows come from
  `appStore.records(...).toList()..sort(<עד מתי comparator>)`.
- `gen_app_peruk21_ent1.dart` (entity list): `rs` is sorted by `עד מתי` before the list, kanban and
  table branches, so all three views of the entity screen are soonest-first.

Only peruk21 is affected: of 28 documents, 7 have date fields but only peruk21 has one that starts
with «עד». (Generalising to "any date field ⇒ sort" would change 6 other apps; left as a follow-up.)

## How I know it works
- Flutter/Dart are not installed, so verification is generator-level:
  - `git diff` of the two screens shows the comparator on the `עד מתי` constant in both places.
  - Dates are stored as ISO `yyyy-mm-dd` (`ds_date_field.dart`), so the lexical comparator is
    chronological. A JS simulation of the emitted comparator on 5 rows (with one blank) yields
    12.9 → 15.9 → 1.10 → 3.1.27 → blank.
  - Regenerated peruk20 (no deadline) after the render-ds change: zero diff ⇒ byte-identical path.
- `node machtzev/police.mjs --fast` before vs after (timings stripped): identical output except one
  added line, the pin notice for `peruk.mjs`. Gates `peruk`, `particles`, `balagan`, `balaganone`
  are green. The 4 red gates (truth, pins, index-complete, learn) were already red before my change.
- Skipped per instructions: `tighten-types.mjs`. Not run: git commit/push. The pin for `peruk.mjs`
  and `render-ds.mjs` needs `node machtzev/pins-check.mjs --write` in the eventual commit.
