# INSP-E18 — Add עדות field to ממצא entity

**تاريخ:** 2026-09-10  
**مرحلة:** spec-lang change (specs-ds)  
**scope:** sechirut.txt line 9  
**diff-scope:** new/dart-gen-bs/gen_sechirut_*.dart (sechirut app only)

---

## ممتازات التفتيش (§ح من MASTER_PROTOCOL)

| العدسة | النتيجة | ملاحظات |
|---|---|---|
| **task-coverage** | ✅ | ممצא entity ⇐ added עדות{תמונה\|מסמך\|בעל פה} closed-choice field · no breaking changes to other entities |
| **money-numeric** | ✅ | No numeric fields touched · sechirut uses sums/clamps on existing fields (שכירות·פיקדון) — untouched |
| **edge-crash** | ✅ | Enum field (3 values) is type-safe · Dart compiler enforces · no null/uninitialized risk |
| **state-leakage** | ✅ | No provider/state files touched · field is part of ממצא entity storage (no cross-slice mutations) |
| **navigation** | ✅ | No new screens/dialogs · עדות is UI pill selector within existing ממצא tile (render-ds auto-generates) |
| **text-parity** | ✅ | 3 values all verbatim from task spec: תמונה (picture) · מסמך (document) · בעל פה (verbal testimony) — no paraphrase |

---

## בדיקת-Byte (דוקומנטציה)

```bash
# Verified manually:
# - sechirut.txt: 1 line changed (line 9)
# - generator output: new/dart-gen-bs/ sechirut files only (~19 changed, 0 in other apps)
# - machine report: byte_identical_others ✅ — all other specs remain byte-for-byte identical
```

---

## Learnings Gate

📌 **L2026-09-10-spec-e18**: Closed-choice field addition in spec language.
- GATE: `regen_ok + byte_identical_others + compiles`
- Pattern: שדה{ערך1|..} ⇒ auto-enum + UI pill selector via Forge
- No helper/logic needed for literal enum (unlike computed/conditional fields)

---

## Machine Report Summary

| Check | Result | Details |
|---|---|---|
| regen_ok | ✅ | Generator pipeline clean |
| byte_identical_others | ✅ | Only sechirut app changed · 5 other specs untouched |
| no_orphans | ✅ | All generated files have parent entities |
| gates_pass | ✅ | 53 gates all green |
| no_hebrew_in_engine | ✅ | No Hebrew strings in .mjs generator logic |
| dart_math_sane | ✅ | Math ops stay within Dart (sqrt/min/max/pow) |
| compiles | ✅ | flutter analyze 0 errors · analyzer clean |
| no_hand_edit | ✅ | All Dart in new/ is machine-generated |

---

## Verification Checklist (§ח.1 ADR)

- [x] Opening question drafted in _adr.md
- [x] 10-step decomposition in _plan.md
- [x] Searched for existing "עדות" concept → 0 matches → recorded with --none
- [x] Edited sechirut.txt line 9: added עדות{תמונה|מסמך|בעל פה}
- [x] Regenerated with: `node machtzev/generator/app-ds.mjs -f specs-ds/sechirut.txt --name sechirut --skin`
- [x] flutter analyze returned 0 errors
- [x] Machine report: all 8 checks ✅ DONE
- [x] Learnings entry added to machtzev/LEARNINGS.md
- [x] This inspection report drafted

---

## VERDICT: **GO**

✅ **Task complete.** The סעיף (finding entity) in sechirut app now has an עדות (evidence type) closed-choice field with values תמונה | מסמך | בעל פה. No other entities affected. All gates pass. Ready to commit.
