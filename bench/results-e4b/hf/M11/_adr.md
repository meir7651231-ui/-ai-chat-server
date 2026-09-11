# ADR — Task M11: Add WhatsApp export to peruk25.txt case report

## Context
The task is to add an export line ([ייצוא]) named "שליחה בוואטסאפ" (Send via WhatsApp) to the case report (דוח תיק) in machtzev/generator/specs-ds/peruk25.txt, using the phone field.

## Question (Opened)
**Is the export line already present in peruk25.txt, or does it need to be added?**

**Assumed Answer:** 
Upon inspection of machtzev/generator/specs-ds/peruk25.txt line 22, the export is ALREADY PRESENT:
```
דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה
```

This line specifies:
- Type: דוח תיק (case report)
- Export marker: [ייצוא]
- Export name: שליחה בוואטסאפ
- Phone field: טלפון
- Message text: קישור לפתיחת שיחה

**Decision:** 
If the export is already present, the task may be asking to:
1. Verify it's correctly formatted per SPEC-LANG.md line 24
2. Confirm the generated app includes this export in the compiled Dart code
3. Ensure no regressions in other apps

**Verification Plan:**
Run police-bench machine to check if all checks pass, specifically:
- `regen_ok`: Generator produces valid output
- `no_hand_edit`: No manual edits to generated files
- `byte_identical_others`: Other apps remain byte-identical
- `gates_pass`: All custom gates pass
- `compiles`: Generated Dart code compiles without errors

**Next Step:**
Run the machine report to confirm the task is complete or identify what's missing.
