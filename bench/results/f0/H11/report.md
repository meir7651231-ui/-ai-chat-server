# Report — «תקרה נמוכה» (min of the two ceilings) on the תיק entity in sechirut

## What I did
1. **Spec** `machtzev/generator/specs-ds/sechirut.txt` — added to ישות תיק:
   `תקרה נמוכה = מינימום(תקרה לפי 3 חודשים, תקרה לפי שליש)`.
2. **Keyword table** `machtzev/generator/chrome.data.json` — added `"min": "מינימום"`, `"max": "מקסימום"`
   (all engine vocabulary lives in this data atom, not in the engine; `max` is the symmetric one-liner).
3. **Formula compiler** `machtzev/generator/render-ds.mjs` (`compileFormula`, new `expandFns`):
   - `מינימום(a, b, …)` / `מקסימום(…)` → Dart `<num>[a, b].reduce((x, y) => x < y ? x : y)` (n-ary, nestable, no import).
     Balanced parens required; a stray comma, an empty argument or a missing `)` → not a formula → field stays a plain input (honest fallback, as before for unknown words).
   - A formula that references a **sibling computed field** now inlines that sibling's compiled expression, so the value is live on a *new* form too (previously `_v[idx]` of a computed field is empty until saved). Cycle or non-inlinable sibling → falls back to the old stored-value read.
   - Label lookup tolerates digits between label words: the entity parser strips digits (`תקרה לפי 3 חודשים` is stored as `תקרה לפי חודשים`), so a formula reference written naturally never matched before.
4. Regenerated only sechirut: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
5. Re-pinned `render-ds.mjs` (`node machtzev/pins-check.mjs --write`; only that hash changed in `machtzev/pins.sha256`).

## How I know it works
- Generated `new/dart-gen-bs/gen_app_sechirut_ent1.dart` now has (שכירות=`_v[3]`, חודשים=`_v[4]`):
  `_calc(…_c29, <num>[((…_v[3]…) * 3), ((…_v[3]…) * (…_v[4]…) / 3)].reduce((x, y) => x < y ? x : y))`
  and the save map stores `(<same>).toStringAsFixed(2)`; edit-load, record card, CSV and grid all carry `_c29` ("תקרה נמוכה"); subtitle reads «13 שדות».
- The three pre-existing computed lines (c26/c27/c28) are byte-identical in the diff; the other regenerated sechirut files changed only by constant renumbering / «12 שדות»→«13 שדות».
- Scanned every spec in `specs-ds/` with the real entity parser: no other spec has a plain formula referencing a sibling computed field, so the inlining change affects no other app. No other app was regenerated; `git status` shows only the 12 intended files.
- Edge-case script against `renderEntity` (then cleaned up): nested `מקסימום(a, מינימום(b, c))`, single arg, self-cycle → stored read, stray comma / empty arg / missing paren → plain input, no leftover markers — all as designed.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped (--fast) · 0 yellow · **1 failed = `learn`**, which fails only on "ref blob … not found" because this checkout is a shallow clone with a single commit (verified `git rev-parse --is-shallow-repository` = true, `git cat-file -t` on those blobs errors). Unrelated to this change. particles, peruk, balagan, balaganone, pins, purity gates all green.
- Not verified: Dart compilation (Flutter/Dart not installed). The emitted construct is plain Dart: `List<num>.reduce` with a `num` ternary, fed to the existing `_calc(String, num)`.

## Notes / follow-ups (not done, out of scope)
- The same digit-stripping quirk already silently downgrades `חורג מול 3 חודשים` in ישות בטוחה (its `? :` condition never resolves `תקרה לפי 3 חודשים`, so it renders as a month-type field, unlike `חורג מול שליש` which is a live comparison). Fixing `compileGuard`/`compileRule` lookups the same way would change other apps' outputs, so I left it untouched.
- `תקרה נמוכה` is not yet referenced by any particle/report line (e.g. `דוח תיק: חישוב בטוחות`); add there if wanted.
- Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.
