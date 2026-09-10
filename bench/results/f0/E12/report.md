# Report — «סך הכל» particle on the payments screen (sechirut)

## What I did
1. Read `machtzev/generator/specs-ds/sechirut.txt` and the particle grammar in `machtzev/generator/particles.mjs`
   (`חלקיק <ישות>: <שם> = <צורה>`; `סכום(שדה)` ⇒ shape `sum` ⇒ op `headline` ⇒ open catalog search ⇒ socket wiring).
2. Added one spec line, after the existing payment particles (line 21):
   `חלקיק תשלום: סך הכל = סכום(סכום)`
3. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   (skipped the known-broken `tighten-types.mjs --record --apply`, as instructed).

## What changed (git diff, 6 tracked files, nothing else)
- `specs-ds/sechirut.txt` — the new particle line.
- `particle-plan-sechirut.json` / `.md` — new row: סך הכל · תשלום · sum · headline⇒KpiTile · wired KvLine (ok:true).
- `new/dart-gen-bs/gen_app_sechirut_px4.dart` (payments particle screen) — new widget:
  `KvLine(label: 'סך הכל', value: appStore.sum('app_sechirut_ent4', 'סכום').toStringAsFixed(0))`
  (`app_sechirut_ent4` is the תשלום entity slug; `AppStore.sum` exists in `ds_store.dart:184`).
- `gen_app_sechirut_px4_content.dart` — the new string constants (label, field, expr) and subtitle «3 חלקיקים חיים».
- `gen_app_sechirut_hub_content.dart` — hub card for the payments screen now says «3 חלקיקים חיים».
No engine code was modified; the particle is resolved by the existing open search and wired to a real data socket (no invented value).

## How I know it works
- Generator output: «🧩 חלקיקים: 20/20 נמצאו-ומחווטים» (was 19/19).
- `node machtzev/generator/particles.mjs --gate` ⇒ ✓ 449 particles in 32 specs, all resolved and wired.
- `node machtzev/police.mjs --fast` ⇒ 40 ran · 0 yellow · 1 failed. The single failure is `learn`, which cannot find
  git blobs referenced in LEARNINGS.md (`fatal: bad object …`). The repo is a shallow clone
  (`git rev-parse --is-shallow-repository` = true) and those objects are absent locally; this is pre-existing and unrelated
  to the change. All other gates (wiring laws, contracts, pins 133/133, autoskin, autologic, skingolden, balagan-look,
  balagan-one, peruk, atom-count, pre-tool …) are green.
- `app-from-sentences.mjs --gate --test` (appgen) ⇒ ✓. `gen-verify.mjs --gate` is skipped in this environment (no buildsmart checkout).
- Flutter is not installed, so no `flutter analyze`. Instead: the new Dart line is structurally identical to the existing
  «הכנסה» sum particle that already compiled in earlier builds; bracket balance checked (32/32 parens, 5/5 brackets, 2/2 braces)
  and every `gen_app_sechirut_px4_c<n>` constant referenced by the screen is defined in the content file.
- Determinism: running the generator a second time changed nothing further (same 6 files in `git status`).

Note: the existing particle «הכנסה = סכום(סכום)» computes the same sum; «סך הכל» was added as requested rather than renaming it.
Nothing was committed or pushed.
