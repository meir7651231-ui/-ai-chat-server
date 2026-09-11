# Report — calendar: participants field + weekly empty-state

## What changed
1. `machtzev/generator/specs-ds/calendar.txt`
   - entity line: `... שעה, מקום, משתתפים, הערה | שלבים: ...` (new free-text field `משתתפים`, no type-word ⇒ text)
   - new line: `חלקיק פגישה: [ריק] אין פגישות השבוע` (uses the existing `[ריק]` particle grammar from SPEC-LANG.md)
2. Engine (small, default-preserving): the entity list screen previously always used the generic
   `emptyHint` ("אין {name} עדיין — ..."); a `[ריק]` particle only produced a separate particle screen.
   - `particles.mjs`: new export `emptyTextByEntity(particles)` — entity ⇒ first `[ריק]` text (via `shapeOf`).
   - `render-ds.mjs` `renderEntity`: new optional `emptyText`; `cEmpty = k(emptyText || T('emptyHint', {name}))`.
   - `app-ds.mjs`: pre-parses particle lines and passes `emptyText` per entity into `renderEntity`.
   Without a `[ריק]` particle the output is byte-identical (see verification 3).
3. Regenerated calendar: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   (tighten-types step not used, as instructed).

## How I know it works
1. `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart`: `c7 = 'אין פגישות השבוע'` (was the generic hint),
   `c13 = 'משתתפים'`; `gen_app_calendar_ent1.dart` line 155 `if (all.isEmpty) return const DsEmpty(label: ..._c7)`,
   form row `_v[5]` for the new field, labels/CSV/grid/record-card lists now 6 entries; `_vis = [[0..5]]`.
2. `apps/calendar.json` has the `משתתפים` field; `particle-plan-calendar.json` shows the `[ריק]` particle
   ok+wired (EmptyState); new `gen_app_calendar_px1.dart` particle screen also shows the text when empty;
   hub gained the particle tile; root page shows `פרטים (6)` incl. participants.
3. Byte-identity of the default path: regenerated `tasks` (no `[ריק]` particle) ⇒ `git diff` on all tasks outputs is empty.
4. Gates run (all green): `particles.mjs --gate` (449 particles / 32 specs wired),
   `balagan-one.mjs --gate` (30 modules, base layer incl. calendar OK), `app-from-sentences.mjs --gate` (app-golden ≡ fresh).
5. `police.mjs --fast`: 39 ran, 4 failed — all pre-existing, not caused by this change:
   - `pins`: pinned sha256 of particles.mjs / render-ds.mjs / police.mjs / gates.tsv / LEARNINGS.md already ≠ HEAD
     before my edits (checked HEAD blobs vs pins.sha256). Not rewritten, since `--write` would also bless unrelated drift;
     the owner should run `node machtzev/pins-check.mjs --write` in the commit that lands this.
   - `truth`: TRUTH.md vs live differs only in "generator/ canonical 49→52" and "gates 53→55"; I added no scripts/gates.
   - `index-complete`: formula-fns/sort-cmp/spec-lang-doc missing from INDEX.md (not mine).
   - `learn`: references git blobs absent from this clone.
6. Flutter/Dart not installed, so no analyze/build; generated Dart follows the identical templates used by
   the other 31 specs (same field-row / DsEmpty emitters), only constants and list lengths changed.

## Not done / notes
- No commit, no git remote, no pins/TRUTH rewrite. Pre-existing uncommitted `sechirut`/`panuy` changes untouched.
- New untracked generator outputs: `gen_app_calendar_px1*.dart`, `particle-plan-calendar.md` (normal for a spec with particles).
