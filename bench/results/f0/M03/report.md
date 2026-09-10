# Report: סיכום section in the sechirut case report

## What I did
- `machtzev/generator/specs-ds/sechirut.txt`:
  - Added `דוח תיק: סיכום = [תוכן סיכום]` right after the הסתייגות report line (before the `[ייצוא]` line), following the existing `[תוכן <group>]` grammar (`parseReportLines` / `CONTENT_REF` in particles.mjs).
  - Added three content lines for group סיכום after the הסתייגות content line:
    - `תוכן סיכום: הממצאים האדומים ייבדקו קודם.`
    - `תוכן סיכום: הבטוחות ייבדקו מול התקרה.`  (exact required text)
    - `תוכן סיכום: ההחלטה תישלח עד מועד החתימה.`
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
  (skipped tighten-types as instructed; no git commit/push).

## Files changed (6, all expected)
- specs-ds/sechirut.txt (spec)
- report-plan-sechirut.json, particle-plan-sechirut.md (plans: new section סיכום, mode content, wired DsNote)
- new/dart-gen-bs/gen_app_sechirut_rp1.dart (report screen)
- new/dart-data-bs/auto/gen_app_sechirut_rp1_content.dart, gen_app_sechirut_hub_content.dart

## How I know it works
- Baseline: regenerating the unchanged spec first produced a zero diff, so every diff below is caused by the spec edit alone.
- Generator log: content items 50 → 53; particles still 19/19 wired; 1 report screen; no פסילה/warnings.
- Report screen diff: a new `DsSection(title: 'סיכום')` with three `DsNote` items, one per content line, appended after the הסתייגות section. The export text (`reportTextGenAppSechirutRp1Screen`) now includes the `*סיכום*` header and the three bullet lines, so the WhatsApp export carries the summary too. Hub card updated 9 → 10 parts; fold label 6 → 7.
- Byte check: `gen_app_sechirut_rp1_content.dart` contains `const String gen_app_sechirut_rp1_c302 = 'הבטוחות ייבדקו מול התקרה.';` and the exact phrase appears nowhere else in the tree (single source).
- Consistency check (Flutter is not installed, so no compile): a script verified every `gen_app_sechirut_rp1_c*` constant referenced in the screen file is defined exactly once in its content file (213 used, 321 defined, 0 missing).
- Police: `node machtzev/police.mjs --fast` → 40 ran · 12 skipped · 1 failed. The single failure is the `learn` gate, which references historical git blobs that do not exist in this single-commit clone (`git rev-list --count HEAD` = 1; `git cat-file` fails on them). It fails identically before and after my change, so it is environmental. All generator gates (particles, peruk, balagan, oracle, pins, truth, coverage, etc.) are green.

## Note
- One intermediate police run was cut short by a pipe and briefly left a `__twinreplay_*` temp file that a concurrent run flagged; it was cleaned up by the gate itself, and the final clean run confirms no stray files (git status shows only the six files above plus pre-existing untracked panuy files).
