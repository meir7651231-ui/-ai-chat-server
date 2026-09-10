# Report — peruk25: WhatsApp export line in the case report

## Outcome
The requested line already exists in `machtzev/generator/specs-ds/peruk25.txt` (line 22), byte-identical to HEAD:

```
דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה
```

It uses the `טלפון` field declared on the `תיק` entity (line 6) and matches the exact form used in
peruk01–peruk24. No edit to the spec was needed, and I made no spec change (a second copy would have
been a duplicate export button, i.e. "breaking" rather than adding).

## How I know it works
1. **Spec vs HEAD:** `git diff HEAD -- machtzev/generator/specs-ds/peruk25.txt` is empty; `grep -n ייצוא` shows the line.
2. **Generated output already wires it** (`new/dart-gen-bs/gen_app_peruk25_rp1.dart`):
   - line 14 comment: `שליחה בוואטסאפ⇒DsChipButton+waLink`
   - line 32: `reportTextGenAppPeruk25Rp1Screen(...)` (particleText export body)
   - line 61: `waLink((r0[gen_app_peruk25_rp1_c67] ?? ''), text, waDigits)`
   - `gen_app_peruk25_rp1_c67 = 'טלפון'` in `new/dart-data-bs/auto/gen_app_peruk25_rp1_content.dart:69`
   So the button reads the phone field and builds the WhatsApp link from it, as the spec asks.
3. **Regeneration is stable:** ran
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
   ⇒ "7/7 particles found and wired · 1 report screen · 7 screens". Afterwards `git status` / `git diff --stat HEAD`
   show zero changes to any tracked file, i.e. the checked-in outputs are exactly what the spec produces.
4. **Police (`node machtzev/police.mjs --fast`):** 40 gates ran, 0 yellow; `particles` (448 particles in 32 specs,
   all wired), `peruk`, `wiring`, `contract`, `oracle`, `pins` all green.
   The single failing gate is `learn`, which dies with `fatal: bad object <sha>`: this checkout has exactly one
   commit (`git rev-list --count HEAD` = 1), so the historical commits the gate inspects do not exist here.
   That is a property of the truncated checkout, not of peruk25.

## Not done / notes
- Skipped `tighten-types.mjs --record --apply` as instructed (known-broken).
- No commits, no git remote access. Flutter/Dart not available, so no `flutter analyze`; the Dart file is
  structurally identical to the 24 sibling peruk reports that already carry the same export.
- Pre-existing untracked files (`panuy.*`, `_prompt-builder.md`) were left untouched.
