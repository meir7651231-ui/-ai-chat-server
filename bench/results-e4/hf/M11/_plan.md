# Plan: Add WhatsApp export to peruk25 case report

## Goal
Add export line ([ייצוא]) named "שליחה בוואטסאפ" using phone field to the case report in peruk25.txt, without breaking the app.

## 10-step decomposition
1. Read SPEC-LANG.md to understand export syntax: `[ייצוא] <שם> = <שדה-טלפון>, <טקסט>`
2. Examine peruk25.txt current state to identify where to add the export
3. Run search-record.mjs to check if atom names already exist
4. Check SPEC-LANG.data.json for available atom choices for phone/WhatsApp export
5. Add the export line to peruk25.txt (within the דוח תיק section)
6. Regenerate app via: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
7. Verify regeneration succeeded (check new/ directory outputs)
8. Run machine's police-bench report to validate
9. Write LEARNINGS entry for the spec change
10. Write claims.json with verified facts and run final audit

## Notes
- Export lines follow pattern: `[ייצוא] <label> = <phone-field>, <description-text>`
- Must use app-ds.mjs with --name flag (no orphans)
- Generated files must pass `flutter analyze` in Dart
- Every other app must remain byte-identical after regeneration
