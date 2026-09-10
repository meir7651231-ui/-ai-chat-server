# Report — sorted findings table (ממצא) in the sechirut app

## What I did
The ממצא particle screen (`gen_app_sechirut_px3.dart`) had no table at all — only the per-colour
partition (already emitted in enum order) plus counters/content. So the change is in two layers:

1. **Generator grammar** (`machtzev/generator/particles.mjs`, `spec-lang.data.json`):
   `[טבלה]` now accepts an optional sort clause `[טבלה] לפי <שדה>` (synonym `מיון`, optional colon).
   - enum field ⇒ rank = position in the *declared* enum order (`{אדום|צהוב|ירוק}` ⇒ red first); unknown/empty last
   - num field ⇒ numeric; anything else ⇒ string compare
   - ties keep insertion order (Dart `List.sort` is not stable, so the secondary key is the original index)
   - unknown sort field or unparsable tail ⇒ the particle is rejected with a reason (no guessing)
   - plain `[טבלה]` is byte-identical to before (all 30 other specs unaffected).
2. **Spec** (`specs-ds/sechirut.txt`): added `חלקיק ממצא: [טבלה] לפי צבע`.
3. Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   (skipped the known-broken tighten-types step). Re-pinned `particles.mjs` via `node machtzev/pins-check.mjs --write`.

Emitted (constants resolved): the px3 screen now has a `ForgeDataGrid` whose rows iterate
`appStore.records('app_sechirut_ent3')` sorted by `['אדום','צהוב','ירוק'].indexOf(r['צבע'])`, ties by index.

## How I know it works
- `node machtzev/generator/app-ds.mjs … --name sechirut --skin` ⇒ `20/20 particles found+wired` (was 19/19); plan row
  `טבלה לפי צבע | ממצא | table | table⇒DsTable`; hub subtitle went 6 ⇒ 7 live particles.
- `node machtzev/generator/particles.mjs --gate` ⇒ ✓ 449 particles in 32 specs, all resolved and wired.
- Scratch unit test (`test-table-sort.mjs`): shape parsing (plain / enum / synonym / num / unknown-field rejected),
  the emitted Dart line has balanced ( [ {, its rank list resolves to exactly אדום, צהוב, ירוק keyed on צבע, and a JS
  mirror of the emitted comparator orders `[ירוק, אדום, '', צהוב, אדום]` ⇒ `אדום, אדום, צהוב, ירוק, ''` (stable).
- `node machtzev/police.mjs --fast` ⇒ 40 ran · 12 skipped · 1 failed: gate `learn`, which fails on "ref blob … not found"
  (shallow clone; `git cat-file` cannot see those objects). Pre-existing and unrelated to these files.
- Not verified: Flutter compile (no Flutter; `dart format` needed an approval this session could not grant).
  Manual reading of the emitted expression: `List<Map<String,String>>.toList().asMap().entries.toList()..sort(cmp)` then
  `.map((e) => e.value)` — all standard Dart core APIs, typed local function `int rk(Map<String, String> r)`.

## Files changed
particles.mjs · spec-lang.data.json · specs-ds/sechirut.txt · pins.sha256 · particle-plan-sechirut.{json,md} ·
gen_app_sechirut_px3.dart · gen_app_sechirut_px3_content.dart · gen_app_sechirut_hub_content.dart (count only).
Untracked `panuy*` files and `_prompt-builder.md` were already present and were not touched.
