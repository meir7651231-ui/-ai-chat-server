# ADR: Add "שלח הודעה" action button to people screen (אדם particle)

## Context
Task E20: Add action button "שלח הודעה" to the particle screen of אדם (people).

## Opening Question (ג.1)
```
מה: [שלח הודעה action button on אדם particle]
מקור: spec panuy.txt (פנויים לידי עכשיו app)
תרגום ל-dial: "one action button in the אדם particle screen with label 'שלח הודעה'"
helper נדרש: [none — this is a UI-only addition to an existing particle, no new logic]
מחרוזות verbatim: ["שלח הודעה" — new action label]
חסום (⛔): [none identified yet]
```

## Assumed Answer
The spec file panuy.txt already defines one action: `[פעולה] הזמן עכשיו` (book now).
This task adds a second action in the same format: `[פעולה] שלח הודעה` (send message).
The machine's generator (particles.mjs) will:
1. Parse the new action from the spec
2. Wire it to the אדם particle's action menu
3. Emit the corresponding Dart code in the generated app

No new helpers needed. No new rules violated (R2 allows action buttons; they are dial elements, not new screens).

## Decision
Add one line to panuy.txt at line 18 (after the existing action):
```
חלקיק אדם: [פעולה] שלח הודעה
```

## Rationale
- Minimal change, localized to one spec file
- Reuses existing particle-action machinery
- No new logic layer required
- String "שלח הודעה" is Hebrew, will be registered in the generated app
