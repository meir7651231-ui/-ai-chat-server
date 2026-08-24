// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _actionFromString — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:99-123 (25 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
AssistantAction? _actionFromString(String s) {
  switch (s) {
    case 'answer':
      return AssistantAction.answer;
    case 'findProduct':
      return AssistantAction.findProduct;
    case 'summarizeOrders':
      return AssistantAction.summarizeOrders;
    case 'checkBudget':
      return AssistantAction.checkBudget;
    case 'addToCart':
      return AssistantAction.addToCart;
    default:
      return null;
  }
}

/// A single prior turn, decoupled from the screen's widget model (a plain record).
typedef IntentTurn = ({bool user, String text});

const int kIntentHistoryWindow = 12;

/// The grounded prompt — folds the bounded history, lists the CLOSED action set +
/// the real category set, and demands ONE line of strict JSON. Mirrors how
/// `describeToCartPrompt`/`aiFinderPrompt` embed their closed sets.
