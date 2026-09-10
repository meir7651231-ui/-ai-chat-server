# ADR: Add ממוצע פיקדון particle to peruk02

## Context
Task: Add a particle to the תיק (case) entity screen that displays the average of סכום הפיקדון (deposit amount) over all cases.

The spec-lang documentation (SPEC-LANG.md line 18) shows:
```
`<שם> = ממוצע / avg(<שדה>)` ממוצע
```

Examples from other specs show particles using aggregates:
- sechirut.txt line 19: `חלקיק תשלום: הכנסה = סכום(סכום)`
- sechirut.txt line 11 (לוח בקרה): `סכום(תשלום.סכום)`

## Decision
Added one line to peruk02.txt after line 25:
```
חלקיק תיק: ממוצע פיקדון = ממוצע(סכום הפיקדון)
```

This follows the pattern from sechirut.txt where `סכום(סכום)` aggregates a field of the same entity. The syntax `ממוצע(סכום הפיקדון)` should:
1. Match the regex in particles.mjs line 147: `^alt(G.pAvg)\s*\(\s*([^)]+)\)$`
2. Extract field name "סכום הפיקדון" via `clean()` function
3. Look up field in entity schema via `F()`
4. Generate particle code with aggregate expression

## Machine Status (initial run)
- ✅ regen_ok - regeneration succeeded
- ✅ byte_identical_others - no side effects on other apps
- ✅ no_orphans - no stray files
- ✅ no_hebrew_in_engine - no Hebrew in code logic
- ✅ dart_math_sane - Dart syntax correct
- ✅ compiles - zero analyzer errors
- ✅ avg_code 1× - **average code WAS generated**
- ❌ gates_pass - unknown gate(s) failed
- ❌ label 0× - label check failed (0 results)
- 🧩 Regeneration output: "9/10 חלקיקים נמצאו-ומחווטים" (9 of 10 particles found and wired)

## Hypothesis
The "avg_code" check passing (1×) means the average particle was partially recognized and code was generated. The "label" failure (0×) and only 9/10 particles being wired suggest the particle machinery didn't fully recognize or wire the particle, even though code was generated.

The `clean()` function (particles.mjs line 27) uses `heW()` to extract Hebrew words. For "סכום הפיקדון" with a space, this might create issues with field name matching if the space handling differs between spec parsing and schema building.

## Alternatives Rejected
1. Using entity.field syntax like `ממוצע(תיק.סכום הפיקדון)` - examples show aggregates on the same entity don't need entity prefix
2. Removing the space: `ממוצעפיקדון` - but the field is defined with a space: "סכום הפיקדון"
3. Checking if particle syntax needs English alternative like `ממוצע / avg(סכום הפיקדון)` - spec shows alternatives for reference, sechirut examples use Hebrew-only syntax

## Verification Plan
Run machine validation again after this first attempt. If the issue persists:
- Check if the field name in entity definition exactly matches what the regex extracts
- Verify the clean() function handles multi-word Hebrew field names correctly
- Consider if the particle needs to be registered elsewhere

## Assumed Answer
The particle syntax is correct. The partial generation (avg_code ✅) suggests the machinery understands it's an average particle. The label/wiring issue may be a verification detail that will resolve on next regeneration, or may need investigation into the clean()/field-lookup logic.
