// ⚛️ אטום-Dart (דרגת-חוזה) · matchClosed
// תפקיד: מקרקע [reply] לחבר-יחיד מקבוצה-סגורה [closed] — התאמה-מדויקת גוברת,
//        אחרת המפתח-הארוך-ביותר-המוכל; ריק/אין-התאמה ⇒ null (fail-closed).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:237-260 (‏_matchClosed; חוק-4 — התנהגות זהה, לא-משופרת).
// אחים: אין. private-במקור (`_matchClosed`) קודם לפונקציה top-level ציבורית `matchClosed`
//       (דפוס branch_label: private-מקור ⇒ ציבורי-קידום). אפס-שקע: הקבוצה [closed]
//       מגיעה כפרמטר-נתון (לא קריאה-לשכן).
// טוהר: dart:core בלבד; אפס import, אפס state, אפס טיפוס-שכן.

/// מקרקע [reply] לחבר מ-[closed]: התאמה-מדויקת גוברת (short-circuit),
/// אחרת המפתח-הארוך-ביותר המוכל ב-[reply]. ריק/אין-התאמה ⇒ null. לעולם לא זורק.
/// verbatim registry_view.dart:237-260.
String? matchClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null; // early guard (assistant_intent.dart:60,82)
  // Exact wins outright — short-circuits before the contained scan, so an exact
  // short key isn't shadowed by a longer key that merely contains it.
  for (final k in closed) {
    if (r == k) return k;
  }
  // Longest-contained fallback (the model may wrap the key in quotes/prose). Many
  // keys are prefixes of others (faucet⊂kitchenFaucet, card⊂card.order); first-match
  // would grab the short prefix → the wrong key (the central collision defect).
  String? best;
  for (final k in closed) {
    if (k.isNotEmpty &&
        r.contains(k) &&
        (best == null || k.length > best.length)) {
      best = k;
    }
  }
  return best;
}
