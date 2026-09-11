# PLAN — Task M11: Add WhatsApp Export to peruk25.txt

**Goal (one line):**
Ensure the case report (דוח תיק) in peruk25.txt includes an export line ([ייצוא]) named שליחה בוואטסאפ that uses the phone field to enable WhatsApp message sending, without breaking other apps.

## 10-Step Decomposition

1. **Requirement verification**: Confirm the spec syntax for [ייצוא] export per SPEC-LANG.md §24
   - Format: `[ייצוא] <name> = <phone-field>, <message-text>`
   - Phone field must be a טלפון type field
   - Message text is static or derived from content groups

2. **Current state inspection**: Check if export line already exists in peruk25.txt
   - Look for "שליחה בוואטסאפ" in the file
   - If present, verify format matches spec
   - If absent, determine exact location to insert (after which dיוח line)

3. **Field availability check**: Verify "טלפון" field exists in the תיק entity
   - Scan line 6 of peruk25.txt for entity field declarations
   - Confirm טלפון is declared as a phone type field

4. **Message text determination**: Decide what static text to use
   - Review SPEC-LANG for message format options
   - Use placeholder "קישור לפתיחת שיחה" if already established in spec

5. **Specification edit** (if needed): Add/update the export line in peruk25.txt
   - Target location: after other דוח תיק entries, before תוכן group declarations
   - Format: `דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה`
   - No hand edits to generated files in new/ directories

6. **Syntax validation**: Run generator to ensure spec is valid
   - Execute: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
   - Check for spec parsing errors in generator output

7. **Byte-identity check**: Verify other apps remain unchanged
   - Machine will verify via `byte_identical_others` check
   - Any other app output change = failure

8. **Dart compilation check**: Ensure generated app compiles
   - Machine will run `flutter analyze` on generated Dart
   - Must produce 0 errors

9. **Gate checks**: All custom gates must pass
   - Machine runs gates listed in machtzev/gates.tsv
   - All must be GREEN

10. **Final machine verification**: Run police-bench
    - Command: `node /tmp/.../police-bench.mjs --root . --task M11 --claims ./claims.json --base /tmp/base-hashes-fix4.txt --compile /tmp/.../bs-compile-3`
    - Result must be: DONE with all checks passing

## Key Constraints
- Do NOT edit generated files (new/dart-gen-bs/, new/dart-data-bs/, new/dart-forge-bs/)
- Do NOT hand-edit exported app code
- Generator engine changes must be justified and not alter other apps
- Every claim in claims.json must be byte-verified
- No Hebrew literals in engine logic (specs-ds files are allowed to have Hebrew)
