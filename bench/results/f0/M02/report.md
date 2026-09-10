# peruk12: second entity «בדיקה» (inspection)

## What changed
`machtzev/generator/specs-ds/peruk12.txt` (grammar copied from `sechirut.txt`, the existing multi-entity spec):
- `ישות בדיקה עם תיק*, מה נבדק*, תקין{כן|לא} | מחיקה: תיק=מפל` — child entity; `תיק*` is a required link to the case (name matches the entity), cascade on case delete.
- `לוח בקרה עם מונה(תיק), מונה(בדיקה: תקין=לא)` — dashboard counter of inspections where תקין is לא (replaces the old one-counter line).
- `חלקיק בדיקה: [טבלה]` + `חלקיק בדיקה: [ריק] אין בדיקות עדיין` — table screen with an empty state.

Regenerated: `node machtzev/generator/app-ds.mjs -f …/peruk12.txt --name peruk12 --skin` (exit 0, 8 screens, 2 entities)
and `node machtzev/generator/balagan.mjs` (the aggregated app must register peruk12's new relations; only `gen_balagan_main.dart` changed: one import + one `registerAppRelations` call).
New files: `gen_app_peruk12_{ent2,px2,relations,scr3}.dart` (+ `_content` twins). Dashboard moved `scr2` → `scr3` (sequential numbering); no stale `scr2` reference remains. `tighten-types` was skipped as instructed.

## How I know it works (bytes, not prose)
- Determinism: regenerating the *unchanged* spec first produced zero git diffs, so every diff below is from the 4 spec lines.
- `gen_app_peruk12_ent2.dart`: link = `DsSelect(entity: 'app_peruk12_ent1')` (l.140); required checks `חסר תיק` / `חסר מה נבדק` (l.44–45); `DsEnumField(options: [כן, לא])` (l.142); table view `ForgeDataGrid` with the 3 columns (l.152).
- `gen_app_peruk12_relations.dart`: `registerRelation('app_peruk12_ent2', 'תיק', 'app_peruk12_ent1', 1)` (policy 1 = cascade).
- `gen_app_peruk12_scr3.dart` (dashboard): `records('app_peruk12_ent2').where((r) => r['תקין'] == 'לא').length` as a KvLine and in the bars.
- `gen_app_peruk12_px2.dart`: `ForgeDataGrid` over `records('app_peruk12_ent2')` + `EmptyState`.
- `ent1.dart` only gained the standard back-reference chip (inspection count per case); `apps/peruk12.json` lists both entities and `relations: true`.
- Static check (no Dart SDK available): 33 changed/new Dart files — all relative imports resolve, brackets balance, every `gen_app_peruk12_*_cN` constant referenced is defined in its content file. Only `package:`/`dart:` imports are unresolvable here, as expected.
- `node machtzev/police.mjs --fast`: 39 ran · 2 failed (was 3 before the Balagan regen; `balaganone` is now green).

## Remaining red gates (not fixed on purpose)
1. `peruk`: "spec on disk ≠ generator". `specs-ds/peruk12.txt` is itself *generated* from the owner's document `peruks/peruk-12.md` by `peruk.mjs`, whose reader can only emit a fixed "finding" child entity. I verified `perukToSpec(peruk-12.md) === HEAD spec` and current = HEAD + exactly the 4 lines above. Making this gate green would require either changing the pinned reader (`peruk.mjs` is in `pins.sha256`) or a document schema the reader does not support. That is an owner decision; the task said to edit the spec, so I did and left the reader untouched. Running `peruk.mjs --all` would revert the edit.
2. `learn`: git blob refs missing (`fatal: bad object …`); this is a shallow clone. Environmental, unrelated to this change.

No git commits/pushes were made. Pre-existing untracked `panuy` files were left alone.
