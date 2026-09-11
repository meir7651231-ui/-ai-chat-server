# Plan: Calendar Meetings Sort (H04)

## Goal (One Line)
Add a sorted table particle for meetings (פגישה) in the calendar app, sorted by date (מועד) then time (שעה), ascending.

---

## 10-Step Decomposition

1. **Verify current state:** Read `calendar.txt` — confirm entity פגישה exists, no particle defined yet.
2. **Search registry:** Run `node machtzev/search-record.mjs "table sort פגישה meetings"` to check for prior patterns.
3. **Read SPEC-LANG:** Confirm syntax for `[טבלה]` + `מיון:` clause in specs-ds/SPEC-LANG.md.
4. **Draft spec edit:** Write particle line: `חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה`
5. **Edit calendar.txt:** Append particle definition to spec file.
6. **Regenerate app:** Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
7. **Verify generated output:** Check `new/dart-gen-bs/` for calendar app tables with sort applied.
8. **Run machine validation:** Execute `node /tmp/…/police-bench.mjs --root . --task H04 --claims ./claims.json …`
9. **Write LEARNINGS:** Document lesson (format M4) in machtzev/LEARNINGS.md.
10. **Write claims.json:** Record proven checks with byte-verification (grep/diff).

---

## Checkpoints

| Step | Blocker? | Proof |
|------|----------|-------|
| 1–3 | No | grep calendar.txt; read SPEC-LANG.md |
| 4–5 | No | edit calendar.txt |
| 6 | No | app-ds.mjs output |
| 7 | Yes | `grep "פגישה" new/dart-gen-bs/` & diff order |
| 8 | Yes | machine DONE verdict |

---
