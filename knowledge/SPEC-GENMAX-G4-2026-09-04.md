# 🧬 SPEC · GENMAX · G4 — render-module: חלקיקים ⇒ קובץ-מודול-Dart במבנה-הזהב (4.9.2026)

> שלב 4 של `PLAN-GENERATOR-MAX-2026-09-04.md` — **השער הקשה.** מפרט-מקסימום ("מה") לסשן-בנאי; ה"איך" אצל הבנאי, בדרך (THE-WAY), בלי קיצורים.
> קלט קיים: G1 `ops-map.json` (1,958 אטומים ⇒ op + שקעים) · G2 `shape-ops.mjs entityOps(e)` (ישות ⇒ ops) · G3 `cover.mjs cover({op,need,goal})` (op ⇒ אטומים) · `compose-engine.mjs` (60 חלקיקים = הצורות שהזהב מימש) · הזהב: `new/dart-gen-bs/schoolos*.dart` + `buildsmart/app_flutter/test/genesis_*_test.dart` (84 בדיקות).

## מטרה
**`node machtzev/generator/render-module.mjs --entity <E>` (או `--particles <json>`) ⇒ `new/dart-gen-bs/gen_<e>.dart`** — מודול שלם ומתקמפל, במבנה-הזהב, שעובר את **בדיקות-הזהב של אותו מודול** בלי שינוי-בדיקה. רצפת-קבלה: שחזור **מסך-המלאי** (25 חלקיקים) ⇒ `genesis_inventory_states_test.dart` ירוק; ואז נוכחות (5 בדיקות) ⇒ הורים (13) ⇒ … עד 84/84.

## מבנה-הפלט (מבנה-הזהב — נגזר מ-`schoolos.dart` `_Inventory`/`_InvData` ומ-8 המודולים)
1. **`_<E>Data`** (לוגיקה-טהורה, static): דמו-דאטה (רק שדות עם מקור-אמת · §20-ג) · **פנקס-התאמות** (`curOf`-style: ledger ⇒ ערך-נוכחי = בסיס+Σ תנועות) · פעולות (receive/issue/count…) · מנועי-מדף מחווטים לפי `cover` (איתור: smartFilter⊕smartScore⊕normSearch · חריגה: finderMatches · ייצוא: toCsv⊕csvEscape⊕exportAllowed · הרשאות: roleOf⊕canGrantedAction · אוטומציות: expiringIntakes/…) · `columnDefs` = **מקום-שמור** (חוק-7: עמודה מאירה רק כשיש ערך) · `roleDefs`.
2. **`<E>Screen`** (StatefulWidget, `const`, ללא `main()`): `_loading/_error/_refresh` (מצבי-מסך שמורים) · פס-עליון (DsSearch + FilterChipPill×N + יצירה/ייצוא/רענון מגודרי-הרשאה + SegmentedSwitch-תפקיד) · KPI (BareStat×N מנגזרות-אמת, אפס-StatBlock) · StatHero (המטרה) · מבטים (SegmentedSwitch: חכם/טבלה/תנועות) · DsTable מונחית-`columnDefs` · פאנל-נבחר (GlassCard ⊕ MediaRow ⊕ StatRow ⊕ SoftButton) · TimelineItem לתנועות · AlertBanner לאוטומציות · EmptyState לאין-תוצאות · StatusChip למחזור-חיים.
3. **imports** יחסיים כמו הזהב (`../dart-ui-bs/...`, `../dart-maor/...`) — רק אטומים ש-`cover` בחר; **אפס-ציור-ביד** (Container/Text כתחליף-ליכולת = כשל); **FAKERS לעולם לא**.
4. **חוק-6:** זהות/קשר/סודות = שקעי-הזרקה (`today`, `role`, `phone`) — לא ליטרלים. **אין `DateTime.now()` במנוע.**

## הרכבה (איך המנוע מחליט — דטרמיניסטי, §20-ד)
- `entityOps(E)` ⇒ רשימת-ops · לכל op: `need` = שקעי-הדאטה **מהסכמה** (למשל `table.need = [rows(שדות-הישות), labels]`, `ratio.need = [value, fraction]` מזוג מספרי-שדות, `clash.need = [slots(IsoDate+TimeHM), text]`) · `goal` = שם-הישות + שמות-השדות + שם-ה-op (עברית מ-`terms`/`strings` של המדף, לא מילון) ⇒ `cover` ⇒ אטומים.
- **חוק-ההרכבה:** תובנה = ≥2 אטומים (תצוגה⊕לוגיקה); עובדה = אטום-יחיד. אין-יחיד ⇒ `cover` מרכיב עד 4.
- **תבניות-פליטה פר-op** (Dart-templates): stat/ratio/table/panel/timeline/alert/filter/search/action/switch/empty/fact — כל תבנית מקבלת `{atom, sockets⇐fields}` ופולטת קוד עם השקעים מחוברים לדאטה; **תבנית = צורה, לא דומיין**.
- **פנקס/state:** כל op-פעולה (act) ⇒ מתודה ב-`_<E>Data` + `setState` ב-Screen; מצבי-טעינה/שגיאה/ריק — תמיד.

## שער-הקבלה (בדרך §6 — "מתקמפל" ≠ מאומת)
1. `flutter analyze --no-fatal-infos lib/genesis` — **0 errors** (מראה ל-buildsmart כמו הבנאים).
2. **בדיקות-הזהב** של המודול המשוחזר — ירוקות **ללא שינוי** בקובץ-הבדיקה (הבדיקה = החוזה). סדר: מלאי ⇒ נוכחות ⇒ הורים ⇒ לוח-הנהלה ⇒ תלמידים ⇒ חדרים ⇒ חוגים ⇒ מורים ⇒ גבייה.
3. golden-render (800×1400) + `goal-card.mjs` לקובץ-המחולל (goal-proof).
4. `no-fakers` · `opcensus` · `shapeops` · `cover` · `compose-determinism` ירוקים · `police --fast` ירוק.
5. **מדד:** `golden-regenerated/9` בבלוק-אמת (`truth.mjs`) — ראצ׳ט רק-עולה (`render-module-baseline.json`).

## מה מותר/אסור לבנאי
- **מותר:** `machtzev/generator/render-module.mjs` (+ `render-templates/` אם צריך) · שער חדש `rendermodule` (gates.tsv/police/INDEX עם `Allow: pins-write:… הכרעה-24`) · הרחבת `cover.mjs`/`shape-ops.mjs` **רק דרך need/goal עשירים יותר** (לא טבלאות-ידניות חדשות) · תיקון באג-אמת בזהב **רק אם הבדיקה חושפת אותו** (ואז L-לקח).
- **אסור:** לשנות קובצי-בדיקה של הזהב · מילון-דומייני/LLM במנוע · ליטרלים של דאטה במנוע (datapurity/puredata) · `DateTime.now` · ציור-ביד · לגעת ב-`schoolos*.dart` הידניים (הם ה-fixture).
- **תיעוד:** commit לכל גל (`גל N · GENMAX-G4 · …`) · `knowledge/CLOSED-GENMAX-G4-<תאריך>.md` (בנוי-מול-יעד כנה · מה-לא-אומת · לקחים ⇒ `LEARNINGS.md`) · עדכון §7 ב-PLAN.
- **DONE:** `DONE GENMAX-G4 · genesis <sha> · buildsmart <sha> · golden-regenerated N/9 · tests K/84 · ❌ J`.
