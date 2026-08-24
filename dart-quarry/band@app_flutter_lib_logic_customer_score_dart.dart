// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _band — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/customer_score.dart:61-64 (4 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _band(int value, int high, int mid) =>
    value >= high ? 2 : (value >= mid ? 1 : 0);

/// מדרג לקוח בודד. טהור, נקי-משעון (ה-recency כבר בא כמספר-ימים).
