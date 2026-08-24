// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfStageLabel — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:60-69 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): termOf, wfStageKey, wfFeatureLabel, wfItemLabel, wfUnitLabel, wfStageIndex
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String wfStageLabel(OrgConfig cfg, WfStage s) =>
    termOf(cfg, 'workflow.stage.${wfStageKey(s)}', _kStageFallback[s]!);

/// שם-הפיצ'ר / שם-הפריט / שם-היחידה — ניתנים-לשם.
String wfFeatureLabel(OrgConfig cfg) => termOf(cfg, 'nav.workflow', 'מעקב טיפול');
String wfItemLabel(OrgConfig cfg) => termOf(cfg, 'entity.wfItem', 'פריט');
String wfUnitLabel(OrgConfig cfg) => termOf(cfg, 'entity.wfUnit', 'כמות');

int wfStageIndex(WfStage s) => kWfStages.indexOf(s);

