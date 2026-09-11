# Report: computed field «תקרה נמוכה» on תיק (sechirut)

## What I did
1. **Spec** `machtzev/generator/specs-ds/sechirut.txt` line 7: appended to entity תיק
   `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` (last field, before `| שלבים`),
   so no existing field index shifts. `min` is already a `math` formula function in `spec-lang.data.json`,
   and the field splitter is depth-aware, so the comma inside `min(...)` is not a field separator.
2. **Engine fix** `machtzev/generator/render-ds.mjs` (`compileFormula` + the schema loop): a formula that
   references another *computed* field now inlines that field's compiled Dart expression instead of reading
   `_v[idx]`. Without this the new field would be `min(0, 0)` on a new record (computed slots in `_v` are
   empty) and stale on edit (slot holds the last-saved value). New optional param `inline` (Map idx⇒expr),
   populated in field order; formulas without computed references emit byte-identical output.
3. Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
4. Re-signed pins (`node machtzev/pins-check.mjs --write`) because render-ds.mjs is a pinned file.

## How I know it works
- `new/dart-gen-bs/gen_app_sechirut_ent1.dart`: `import 'dart:math';` added; form shows
  `_calc(c29, min(((rent)*3), ((rent)*(months)/3)))` live; save map stores
  `c29: (min(...)).toStringAsFixed(2)`; `_edit` loads slot 12 from the record; label constant
  `gen_app_sechirut_ent1_c29 = 'תקרה נמוכה'` emitted. No `min`/`max` identifier shadowing in the file.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 3 failed. Gates covering this change are green:
  `formulafns` (dart:math import + no method-call misuse), `particles`, `balagan`, `balaganone`, `pins`.
- The 3 remaining failures pre-exist at HEAD and are unrelated: `truth` (generator-script count 49→52 and gate
  count 53→55, from files committed in HEAD), `index-complete` (three committed scripts missing from INDEX.md),
  `learn` (git blobs missing in this clone). `pins` was also failing at HEAD (5 pinned files drifted before my edit);
  re-signing fixed it.
- Cross-spec scan (all 41 entities in specs-ds/ + specs/): the inlining changes output for exactly one other
  spec, the **untracked** in-progress `panuy.txt` (`מרחק בקמ = sqrt(מרחק בריבוע)`), where `_v` was equally
  wrong (0 on new record). I did not regenerate panuy (not in scope, not tracked).
- Other diffs in generated sechirut files (px1/root/hub content) are constant renumbering from the new label.
  `gen_app_sechirut_ent2*` already differed from HEAD before I started (stale committed output); regeneration
  overwrote it with the same fresh output.

## Not done / notes
- Flutter/Dart not installed, so no `analyze`/`build`; Dart typing checked by reading: `min<num>` over `num`
  and `double` args, fed to `_calc(String, num)` and `.toStringAsFixed(2)`.
- Pre-existing, unchanged: the בטוחה conditional fields (`חורג מול …`) compare `_v[סך בטוחות]`, a computed slot,
  through `compileCond`/`guardBool`; they have the same staleness but are outside this task.
- No commits, no git remote operations.
