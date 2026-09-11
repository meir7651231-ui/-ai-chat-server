# Report — "not yet sent" findings counter (sechirut)

## What I changed
`machtzev/generator/specs-ds/sechirut.txt` — two lines, using the grammar already in the file
(same shape as the existing `מונה(תשלום: שולם=לא)` / `חלקיק תשלום: לא שולם = מונה(שולם=לא)`):

1. Dashboard: `לוח בקרה עם … מונה(תשלום: שולם=לא), מונה(ממצא: נשלח=לא), סכום(תשלום.סכום)`
2. Findings screen: `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` (placed after `אדומים`)

Then regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
(the known-broken `tighten-types.mjs --record --apply` step was not run). No generator code was touched.

## Regenerated files
- `new/dart-gen-bs/gen_app_sechirut_scr5.dart` + `_content` — dashboard: 7 metrics (was 6); new KvLine
  counts `appStore.records('app_sechirut_ent3')` where `r['נשלח'] == 'לא'`; also feeds the ForgeWaveformBars.
- `new/dart-gen-bs/gen_app_sechirut_px3.dart` + `_content` — findings particle screen: new
  `KvLine(label: 'לא נשלחו', value: count of ent3 where 'נשלח' == 'לא')`; 7 live particles (was 6).
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart` — hub labels "7 מדדים" / "7 חלקיקים חיים".
- `machtzev/generator/particle-plan-sechirut.{json,md}` — new row `לא נשלחו | ממצא | count | KvLine`.

## How I know it works (Flutter is not installed, so no analyze/build)
- app-ds output: `חלקיקים: 20/20 נמצאו-ומחווטים` (was 19) — the new particle resolved through the open search.
- ent3 is `ממצא` (`gen_app_sechirut_ent3_c0`), and its form saves the yes/no field under key `'נשלח'`
  (`_c17`); both new counters compare that same key to `'לא'`, so store key and filter agree.
- Scan of all `gen_app_sechirut_*.dart`: 875 `_cN` constant references, 0 undefined, all files bracket-balanced.
- `node machtzev/police.mjs --fast`: 39 ran, particles gate green (449 particles / 32 specs, all wired),
  autoskin/autologic/skingolden/opcensus/shapeops green. Non-fast app gates run directly:
  `appgen` green; `genverify` skipped (no buildsmart tree here).
- 4 red gates are all pre-existing and unrelated to this change (verified against HEAD):
  `pins` (render-ds.mjs, police.mjs — untouched, identical to HEAD), `truth` (drift = generator script
  count 49→52 and gate count 53→55), `index-complete` (3 un-indexed scripts), `learn` (missing git blobs).

## Notes
- `machtzev/generator/apps/sechirut.json` is unchanged by design: it carries only root/entities/shell, not counters.
- The working tree already had an uncommitted regen diff in `gen_app_sechirut_ent2*` (18+/18−) before I
  started; regeneration reproduced it byte-for-byte in size, so it is unrelated to this task.
- The generated Dart report test is only emitted when a Flutter pubspec exists, so none was written here.
- Semantics match the existing `שולם=לא` counter: a finding counts as "not sent" only when נשלח is explicitly `לא`.
