# חצב-AST · מנוע-חציבה דטרמיניסטי (Dart→אטום)

מוציא פונקציה-בודדת ממקור לאטום-טהור, על analyzer אמיתי. ליבה מכנית:
פרסור → איתור-פונקציה (שם+שורה) → פותר-מזהים-חופשיים (כבילת-מקומיים) →
סיווג {שכן-top-level=שקע · טיפוס-מקומי=הטבעה-verbatim · dart:core=נשאר ·
module-state=פסילת-טוהר} → פליטת-אטום. שער-טוהר שני מעל המחלץ.

## הרצה (דורש harness analyzer — scratchpad/asttest/pubspec)
    dart run ast_carve.dart <file> <fnName> [line]        # יחיד → JSON
    dart run ast_carve.dart --batch jobs.json             # אצווה (VM אחד) → [JSON]
    # jobs.json = [{file,name,line},...]

## פלט
{ok, name(פרטי→ציבורי), sockets[], inlineTypes[], unresolved[],
 copiedTypes[], fnSource, trivial}
trivial=true ⇒ חציבה-אוטומטית בטוחה. sockets ⇒ שיקוע. unresolved ⇒ שיפוט/נחיל.

## מדד-הוכחה (בנייה-חכמה, 120 מועמדי-0-שכנים)
trivial 32 · sockets 19 · unresolved 36 (module-state שהמחלץ פספס) · fail 33.
9.2ש ל-120 (VM אחד).
