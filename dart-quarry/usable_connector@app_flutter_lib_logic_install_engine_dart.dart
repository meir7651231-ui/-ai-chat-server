// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _usableConnector — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:495-497 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): flowRole
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _usableConnector(LipskeyCatalogProduct p) =>
    flowRole(p) == FlowRole.connector && kVerifiedSpecs[p.sku] != null;

