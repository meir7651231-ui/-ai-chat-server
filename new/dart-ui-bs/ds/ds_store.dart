// 🗄️ חנות-מצב חיה (חוט-טהור) — מודל-נתונים כללי לאפליקציה: רשומות פר-ישות +
// התראה-על-שינוי. אפס-דאטה, אפס-תלות חיצונית (foundation בלבד). זהו ה"מוח":
// שמירה מוסיפה רשומה · טבלה קוראת · דשבורד סופר · שלב-מסע מתקדם — הכל מגיב לאותו מקור.
import 'package:flutter/foundation.dart';

class AppStore extends ChangeNotifier {
  final Map<String, List<Map<String, String>>> _rec = {};

  // מפתח-שמור לשלב-המסע הנוכחי של רשומה (אינדקס בתוך רשימת-השלבים).
  static const stageKey = '__stage';

  List<Map<String, String>> records(String entity) => _rec[entity] ?? const [];
  int count(String entity) => _rec[entity]?.length ?? 0;

  // ערכי-תצוגה של ישות (לשדות-קשר): הערך-הראשון-הלא-ריק בכל רשומה = "שם" הרשומה.
  List<String> options(String entity) {
    final out = <String>[];
    for (final r in records(entity)) {
      for (final e in r.entries) {
        if (e.key == stageKey) continue;
        if (e.value.trim().isNotEmpty) { out.add(e.value.trim()); break; }
      }
    }
    return out;
  }

  int stageOf(String entity, int i) {
    final list = _rec[entity];
    if (list == null || i < 0 || i >= list.length) return 0;
    return int.tryParse(list[i][stageKey] ?? '0') ?? 0;
  }

  void add(String entity, Map<String, String> record) {
    (_rec[entity] ??= <Map<String, String>>[]).add(record);
    notifyListeners();
  }

  // קידום שלב-מסע ברשומה (חסום בשלב-האחרון) — מנוע-המסע החי.
  void advance(String entity, int i, int stageCount) {
    final list = _rec[entity];
    if (list == null || i < 0 || i >= list.length) return;
    final cur = int.tryParse(list[i][stageKey] ?? '0') ?? 0;
    if (cur + 1 < stageCount) {
      list[i][stageKey] = '${cur + 1}';
      notifyListeners();
    }
  }

  void removeAt(String entity, int i) {
    final list = _rec[entity];
    if (list != null && i >= 0 && i < list.length) {
      list.removeAt(i);
      notifyListeners();
    }
  }
}

// מקור-אמת יחיד לאפליקציה כולה (חוצה-מסכים דרך ה-Navigator).
final AppStore appStore = AppStore();
