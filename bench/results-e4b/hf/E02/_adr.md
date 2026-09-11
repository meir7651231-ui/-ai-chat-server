# ADR: Add Priority Field to Case Entity

## Opening Question (§ג.1 Protocol)

**Q:** Where in the field list should the priority field be inserted?

**Assumed Answer:** Priority is a control/state field similar to existing status fields. It should be inserted near other case-management fields. Given the current field order (lender, phone, deposit amount, landlord statement, key-handover date, contract sections, repairs, exit, protocol, photos, whatsapp, receipts) — priority logically belongs near the beginning or with status-like fields. I'll insert it after `סכום הפיקדון` (deposit amount) to group case-metadata together.

---

## Context

- **Task:** Add closed-choice field `עדיפות{גבוהה|בינונית|נמוכה}` to `תיק` entity in peruk02.txt
- **Rationale:** Case priority enables users to triage which cases to handle first
- **Risk:** Spec language change must not alter unrelated apps (byte-identical check)

## Decision

**Approach:** Add field as a closed-choice enum in the spec layer, letting the generator handle Dart emission.
- Spec syntax: `עדיפות{גבוהה|בינונית|נמוכה}`
- No engine logic needed (spec language already supports closed choices)
- No hand-edits of generated code

## Alternatives Rejected

1. **Add as string with validation** — loses the enum benefit; spec language has better syntax
2. **Add to DB schema first** — this is spec-driven; schema follows spec
3. **Use default priority** — task specifies "add field", no mention of defaults

## Consequences

- Dart model `Case` gains a `priority` field of type `Priority` enum
- Forge skins auto-wire this to UI dropdowns if used in forms
- Users can filter/sort by priority
- New apps using this spec will have priority built-in

## Verification

- [ ] police-bench.mjs passes all gates
- [ ] Byte-identical check passes (other apps not altered)
- [ ] Spec compiles to valid Dart enum
- [ ] No hand-edits in generated files
