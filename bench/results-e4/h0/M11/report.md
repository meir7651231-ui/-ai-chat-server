# Report: peruk25.txt WhatsApp Export Verification

## Task
Add to the case report an export line ([ייצוא]) named שליחה בוואטסאפ using the phone field.

## Finding
The requested export line **already exists** in `machtzev/generator/specs-ds/peruk25.txt` at line 22:

```
דוח תיק: [ייצוא] שליחה בוואטסאפ = טלפון, קישור לפתיחת שיחה
```

## Translation
- **Report Type**: דוח תיק (Report Tile)
- **Action Type**: [ייצוא] (Export)
- **Name**: שליחה בוואטסאפ (Send via WhatsApp)
- **Field**: טלפון (Phone)
- **Context**: קישור לפתיחת שיחה (Link to start conversation)

## Verification
✅ File is valid — generator runs successfully:
```
🧩 חלקיקים (הכרעה-27): 7/7 נמצאו-ומחווטים
✨ אפליקציה חוללה — 7 מסכים
```

✅ Atom count check passes (pre-existing police issues unrelated)

✅ No breaking changes — file structure intact

## Status
**Nothing to change** — the required export line is already correctly implemented in peruk25.txt.
