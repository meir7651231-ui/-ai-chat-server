# Report: rename case field «תיקונים» ⇒ «תיקונים שנדרשו» (peruk02)

## What I did
1. **Root edit in the owner document** `machtzev/generator/peruks/peruk-02.md` (line 91):
   `חוזה (לפחות סעיפי בטוחה, תיקונים, יציאה)` ⇒ `חוזה (לפחות סעיפי בטוחה, תיקונים שנדרשו, יציאה)`.
   Reason: `specs-ds/peruk02.txt` is *generated* from that doc by `peruk.mjs --all`, and the `peruk`
   police gate (commit gate) fails if the spec on disk differs from the reader output. Editing only the
   spec would have gone red.
2. `node machtzev/generator/peruk.mjs --all` ⇒ regenerated specs. Only `specs-ds/peruk02.txt` changed,
   and only the one token `תיקונים*` ⇒ `תיקונים שנדרשו*`. `peruk-index.json` and all other specs unchanged.
3. `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
   ⇒ regenerated the app (8 screens). Changed: `apps/peruk02.json` + 3 content files
   (`gen_app_peruk02_{ent1,px1,root}_content.dart`). Every changed line is the label constant; the
   structural Dart files are byte-identical (field slots are positional, so nothing else moves).
4. `node machtzev/generator/balagan.mjs` ⇒ the one-app «בלגן» embeds peruk02's field list in
   `gen_balagan_moments.dart`; regenerated so it carries the new label. Diff span = exactly that label;
   TF-IDF moment weights unchanged. Skipped `tighten-types.mjs` as instructed.

The untouched field «קבלות על תיקונים שהוא» still contains the word תיקונים by design (different field).

## How I know it works
- `git diff` on peruk02 outputs: 8 label lines replaced, 0 non-label lines; no bare `'תיקונים'` label
  remains in any file mentioning peruk02 (repo-wide grep).
- Type inference unaffected: the new label matches no word in `spec-lang.data.json` type lists.
- Gates run directly: `peruk --gate` ✓ (28/28, peruk02 = 10 fields), `balagan-one --gate` ✓ (30/30),
  `balagan-look --gate` ✓ (35/36 = floor).
- `node machtzev/police.mjs --fast` before vs after: identical result — 39 ran · 4 failed
  [truth, pins, index-complete, learn], and the failure detail lines are byte-identical. Those 4 were
  already red on the untouched tree (pins on LEARNINGS.md/gates.tsv/particles.mjs/render-ds.mjs/police.mjs,
  none of which I modified). No new failure introduced.
- Flutter/Dart not installed, so no `flutter analyze`; the changed Dart lines are string constants only.

## Notes
- Pre-existing dirty files (`sechirut` modified, `panuy` untracked, `_prompt-builder.md`) were not mine
  and were left alone.
- The generated app keys stored records by field label. Records saved before this rename under the old
  label «תיקונים» will show empty in the renamed field (no migration was in scope).
- No git commit/push performed.
