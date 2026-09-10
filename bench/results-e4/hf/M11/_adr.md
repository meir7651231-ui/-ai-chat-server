# ADR: WhatsApp Export Line in peruk25

## Context
Task: Add export line ([ייצוא]) named "שליחה בוואטסאפ" using phone field to peruk25.txt case report.

Observed: The export line already exists in peruk25.txt at line 22:
```
דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה
```

## Decision
Verify that the existing export line is:
1. Syntactically correct per SPEC-LANG.md
2. Properly wired in generated Dart
3. Not breaking other apps

## Rationale
The spec syntax matches SPEC-LANG.md line 24:
`[ייצוא] <שם> = <שדה-טלפון>, <טקסט>` (שליחה)

Actual line matches perfectly:
- [ייצוא] = export marker
- שליחה בוואטסאפ = export name
- טלפון = phone field
- קישור לפתיחת שיחה = description text

Dart generation shows correct wiring in gen_app_peruk25_rp1.dart:
`שליחה בוואטסאפ⇒DsChipButton+waLink`

## Alternatives Rejected
- Add a new export line (would create duplication)
- Modify existing line (no changes needed)

## Consequences
- Export is properly wired and functional
- No app breakage observed (police.mjs gates pass for guardexport, autoskin, autologic)
- Task completed as specified

## Verification
- SPEC-LANG.md syntax check: PASS
- Dart generation check: PASS (rp1.dart contains correct wiring)
- Police gates: PASS (guardexport, autoskin, autologic all green)
- No other apps modified: verified via police datapurity gates
