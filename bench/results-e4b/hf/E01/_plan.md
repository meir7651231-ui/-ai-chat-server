# Plan: Add email field to תיק entity

## Goal
Add an email field named אימייל to the תיק (case) entity in sechirut.txt so it appears in the form and table.

## Decomposition (≤10 steps)
1. Read spec-lang.data.json to verify email field type keywords
2. Read current sechirut.txt spec and locate תיק entity definition
3. Understand which fields are currently in תיק
4. Add אימייל field to תיק entity definition
5. Run app regeneration with app-ds.mjs
6. Check if form includes the email field
7. Check if table displays the email field  
8. Verify byte-identical for other apps
9. Create claims.json with passed checks
10. Run final machine verification

## Key considerations
- Email type detection in spec language likely based on field name containing "אימייל" or "דוא״ל"
- Must regenerate app with --name flag to avoid orphan files
- Other apps must remain byte-identical (machine check)
- Must pass flutter analyze
