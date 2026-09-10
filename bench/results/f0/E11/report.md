# Report — rename case field «תיקונים» ⇒ «תיקונים שנדרשו» (peruk02)

## What I did
1. Discovered `specs-ds/peruk02.txt` is itself generated from `machtzev/generator/peruks/peruk-02.md`
   by `peruk.mjs`, and the `peruk` police gate requires disk-spec ≡ generated-spec. So I renamed the
   field at the source as well, otherwise the gate would go red:
   - `machtzev/generator/peruks/peruk-02.md` line 91: `חוזה (לפחות סעיפי בטוחה, תיקונים שנדרשו, יציאה)`
   - `machtzev/generator/specs-ds/peruk02.txt`: `תיקונים שנדרשו*` in the תיק entity (still required).
   The sibling field `קבלות על תיקונים שהוא` (which merely contains the word) was left untouched.
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
3. Regenerated the combined «בלגן» app, which embeds every module's field list: `node machtzev/generator/balagan.mjs`
4. Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.

## Files changed (git diff --stat: 7 files, 11 lines, all one-for-one label swaps)
- machtzev/generator/peruks/peruk-02.md, specs-ds/peruk02.txt (inputs)
- machtzev/generator/apps/peruk02.json (field `label`)
- new/dart-data-bs/auto/gen_app_peruk02_ent1_content.dart (1 const), _px1_content.dart (2), _root_content.dart (4)
- new/dart-gen-bs/gen_balagan_moments.dart (BalaganField for module peruk02)

## How I know it works
- Baseline first: regenerating peruk02 from the untouched spec produced zero diff, so the generator is
  deterministic and every diff below is caused only by the rename.
- `grep` for the bare old label (`'תיקונים'` / `"תיקונים"`) across apps/peruk02.json and all
  gen_app_peruk02_* Dart files returns nothing; the 7 old occurrences became `תיקונים שנדרשו`.
- Word-level diff of gen_balagan_moments.dart shows exactly one token changed (the field name);
  TF-IDF weights and the 30/30 moment-identification self-test are unchanged.
- `node machtzev/generator/peruk.mjs --gate` prints no red line: source doc ⇒ spec ⇒ index all consistent.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 0 yellow · 1 failed. Green includes wiring,
  pins, particles (448/448 wired), peruk (peruk02: 10 fields), balagan-look 35/36 (no reds), balagan-one 30/30.
  The single failure is the `learn` gate: it does `git cat-file` on historical blobs
  (`fatal: bad object 0bc0365…`) that don't exist in this single-commit checkout. It is unrelated to this change
  and would fail identically on a clean tree.
- Flutter/Dart are not installed, so no analyze/build was run; the Dart changes are string-constant values only
  (no identifiers, quotes, or `$` involved), so they cannot introduce a compile error.

## Note for the owner
Renaming a label changes the record key used by the generated store, so existing saved תיק records
would show the old field value under the old key. That is inherent to the requested rename.
