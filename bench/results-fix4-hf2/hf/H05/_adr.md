# ADR-H05 · Sort Cases Table by Key-Handover Date

## Opening Question (§ג.1)

**What:** Sort the cases table (particle תיק: [טבלה]) by key-handover date (תאריך מסירת מפתח), earliest first.

**Source:** peruk02.txt, line 10 (particle תיק: [טבלה])

**Translation to spec:** The spec language supports sorting via `| מיון: <שדה> עולה` in particle definitions (SPEC-LANG.md line 17). Add sorting directive to the table particle.

**Helper needed:** None — sorting is a declarative spec feature, not a helper.

**Strings (verbatim):** None — Hebrew field names already in spec.

**Blocked (⛔):** None — sorting is a local feature of the generated app.

## Assumed Answer

The cases table (`חלקיק תיק: [טבלה]`) currently lists cases with no specific order. 
The task requires adding a sorting directive to order by תאריך מסירת מפתח ascending (earliest first).
Method: Modify line 10 in peruk02.txt from `חלקיק תיק: [טבלה]` to include `| מיון: תאריך מסירת מפתח עולה`.

## Decision

Use spec-level sorting declarative syntax. No engine changes needed.

## Verification

After generation:
- Run machine report (police-bench.mjs) to confirm bytes are identical across other apps
- Verify peruk02 app table displays cases sorted by תאריך מסירת מפתח, earliest first
- No errors in flutter analyze
