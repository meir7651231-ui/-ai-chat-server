# ADR-E01: Add Email Field to תיק Entity

## Context
The sechirut.txt spec defines entity תיק (case) with current fields: לקוח*, טלפון, עיר, שכירות*, etc.
The task requests adding an email field named אימייל to this entity.

## Question (ג.1)
**Should the email field be required (marked with *) or optional?**

**Assumed Answer:** Optional (no *). Email is useful for contact but not critical like client name (לקוח*) or rent amount (שכירות*). Users may have only phone or only email. This allows flexibility in form submission.

## Decision
Add "אימייל" as an optional text field to the תיק entity in sechirut.txt, positioned after טלפון to group contact fields together.

## Rationale
1. Email is a standard contact field, should be near phone
2. No special type definition exists in spec-lang.data.json for email; treat as default string field (like טלפון)
3. Optional prevents form validation issues with users who don't have/want to provide email
4. Pattern matches existing contact fields (טלפון, עיר)

## Alternatives Rejected
- Making it required (*): Too restrictive; not all rental agreements have email contacts
- Placing it elsewhere: Contact fields should be grouped for UX

## Consequences
- Form will display email input field
- Email data will appear in tables/reports showing תיק records
- No schema migrations needed (pure spec change)
- Generator will auto-wire field into UI/logic layers

## Verification
- Machine check passes (no hand-edits outside specs/)
- Form renders with email field
- Table displays email column
- No crashes on empty email values
