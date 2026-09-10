# ADR-H13-001: Table Column Selection in panuy.txt Spec

## Context
The app generated from `machtzev/generator/specs-ds/panuy.txt` currently shows all fields in the people table. The SPEC-LANG supports specifying which columns to show via the syntax: `[טבלה] עמודה, עמודה, …`. 

## Opening Question
**Q: How should the spec language express table column selection, and what is the minimal change to the spec to accomplish this?**

**Assumed Answer:** 
The spec language at line 17 of SPEC-LANG.md already supports column selection syntax. The change is purely in the spec file panuy.txt, line 6:
- From: `חלקיק אדם: [טבלה]` (show all columns)
- To: `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` (show 4 columns in order)

This is a spec-layer change only; the engine already supports it. No code changes needed in the generator.

## Decision
Change panuy.txt line 6 to specify the four desired columns in the correct order.

## Verification Plan
1. Edit spec file only
2. Regenerate app via machine
3. Verify: table shows exactly 4 columns in order
4. Verify: no other apps affected (byte-identical check)
5. Verify: gates pass
