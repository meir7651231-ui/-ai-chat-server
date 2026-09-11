# ADR: Add Counter for סיווג=דגל מוגן to peruk25 Dashboard

## Context
The peruk25 app (פיטורים / סיום חוזה) manages severance cases with a סיווג (classification) field containing 4 enum values:
- סיום רגיל מכתב
- לחץ לחתום היום
- **דגל מוגן** (protected flag cases)
- עצמאי חוזה קבלן

The dashboard (לוח בקרה) previously showed only a total counter of all cases. The requirement is to add a second counter showing only cases where סיווג = דגל מוגן.

## Decision
Add a conditional counter to the dashboard using the spec language syntax:
```
לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)
```

This follows the established SPEC-LANG.md pattern used in other apps (e.g., peruk01 with `מונה(ממצא: צבע=אדום)`).

## Rationale
- **Spec-first approach**: The task is expressible in spec language; no engine changes needed
- **Pattern consistency**: Identical to conditional counter syntax in other apps
- **Zero breakage**: Modifying only peruk25.txt leaves all other apps byte-identical
- **Automatic generation**: render-ds compiler handles the filtering logic; no hand-edits required
- **Reactive UI**: Dashboard counters automatically update via AnimatedBuilder(animation: appStore)

## Alternatives Rejected
1. **Manually editing generated Dart code** — Violates protocol (no_hand_edit gate); changes would be lost on regen
2. **Creating a custom atom** — Unnecessary; spec language already supports this
3. **Adding app-level logic** — Belongs in spec (declarative), not in engine or generated code

## Consequences
- Dashboard now displays 2 KPIs: "תיק" (all cases) and "דגל מוגן" (protected-flag cases)
- Subtitle shows "2 מדדים · סקירת-על" (2 metrics · overview)
- Content file (gen_app_peruk25_scr2_content.dart) auto-generated with Hebrew labels
- Bar chart compares the two metrics visually
- Zero manual code changes; zero analyzer warnings

## Verification
- ✅ Machine report: all 8 checks passed
- ✅ Dart analyzer: 0 errors
- ✅ Byte-identical-others: all 27 other apps unchanged
- ✅ dash_counter gate: confirmed counter filters by סיווג field correctly
- ✅ Generated screen code verified in gen_app_peruk25_scr2.dart and content file
