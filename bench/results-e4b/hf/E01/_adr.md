# ADR: Add Email Field to תיק Entity (sechirut)

## Context
The sechirut app manages rental lease cases (תיק). It already has contact fields like טלפון (phone), but lacks an אימייל (email) field. Email is a common contact channel needed for business communications.

## Decision
Add an אימייל field to the תיק entity in machtzev/generator/specs-ds/sechirut.txt as a simple text field (no special type annotations needed). Placed after טלפון to keep contact info fields together.

## Rationale
- Email field type detection in spec language works through field name keywords; "אימייל" is a clear, unambiguous name
- No email type defined in spec-lang.data.json (only date/num/bool/multiline types), so field will be treated as 'text' type → DsField input, appropriate for emails
- Placed after phone field for UI/UX consistency (contact info section)
- Spec language allows plain field names for text fields; no special syntax needed
- Change is in spec only, no engine modifications required

## Alternatives Rejected
1. Add typeEmail to spec-lang.data.json: Unnecessary; text field is appropriate for email
2. Add custom regex pattern ~/.../ : Overkill for simple text field

## Consequences
- Form now displays email input field at position c11 (after phone at c10)
- Table view includes email column in record display
- Email data is persisted in appStore like other fields
- All other applications remain unaffected (byte-identical verification passed)

## Verification
Machine verification confirms:
✅ Email field appears in entity (c11 in content)
✅ Email field appears in table columns (2× — both in column list and data binding)
✅ Byte-identical for other apps (no cross-app impact)
✅ Regeneration successful (regen_ok)
✅ Dart code compiles with zero errors
