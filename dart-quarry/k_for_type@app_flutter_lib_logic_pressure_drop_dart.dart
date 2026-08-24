// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _kForType — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:29-72 (44 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double _kForType(String? productType) {
  switch (productType) {
    case 'ברך':
    case 'זווית':
      return 0.9; // 90° elbow
    case 'מסעף':
    case 'הסתעפות':
    case 'טי':
      return 1.5; // tee (through-run) — branch-run is higher
    case 'מצמד':
    case 'מחבר':
    case 'מופה':
    case 'מקשר':
    case 'רקורד':
      return 0.1; // straight coupling — minimal disturbance
    case 'ניפל':
    case 'מאריך':
      return 0.05; // straight extension
    case 'בושינג':
      return 0.2; // reducer
    case 'ברז':
    case 'ברז גן':
      return 0.05; // ball valve fully open
    case 'אל חזור':
      return 2.0; // swing check valve
    case 'מסנן':
      return 5.0; // Y-strainer with cartridge
    case 'מצוף':
      return 4.0; // float valve, throttled
    case 'מקטין':
      return 10.0; // pressure-reducing valve
    case 'משחרר':
      return 0.0; // air vent
    case 'כפה':
    case 'פקק':
    case 'אטם':
      return 0.0; // terminal — flow stops here, no through-loss
    default:
      return 0.3; // unknown fitting: small conservative estimate
  }
}

/// Internal nominal-bore of a connector end in metres. Returns null when the
/// end is a thread (which has its own size convention) or unknown.
