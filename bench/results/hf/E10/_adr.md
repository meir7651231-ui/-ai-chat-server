# ADR: Add ותק בשנים field to panuy.txt

## Context
Task requires adding a field `ותק בשנים` (years of experience) to the `אדם` (person) entity in panuy.txt, with range 0–77.

## Decision
Add the field using the spec syntax `ותק בשנים(0..77)` to the אדם entity declaration.

## Rationale
1. **Syntax verified:** grep confirms numeric range constraints use `fieldName(min..max)` format in sechirut.txt and peruk04.txt.
2. **No conflicts:** The field is appended to the entity definition, not replacing or altering existing fields.
3. **Spec structure:** panuy.txt currently has aדם entity with fields ending at line 4 before calculated fields. The new field integrates naturally as a base property.

## Alternatives rejected
- Enum-based representation (סווג): Unnecessary for a simple numeric range; range constraint is clearer.
- Default value: Task specifies only range constraint; no default given.

## Consequences
1. Generator will validate `ותק בשנים` input to [0..77].
2. All consumers of אדם entity will have access to the field; none should break.
3. Gate: police.mjs will verify wiring and contract integrity.

## Verification
1. Edit panuy.txt: add field to אדם entity line 4.
2. Run: `node machtzev/police.mjs --fast` (wiring + contract + quarry).
3. Run: `node machtzev/police.mjs` (full suite: selftest + mutation).
4. Byte-verify: grep the new field is present; verify panuy.txt diff.

---

## Assumed Answers (Q1–Q3 from _plan.md)
- **Q1:** Range syntax is `fieldName(min..max)` ✓ (verified in sechirut.txt:8, peruk04.txt:7)
- **Q2:** Numeric field (integer) ✓ (years are numeric; range 0–77 confirms)
- **Q3:** No default specified by task; field added without default.
