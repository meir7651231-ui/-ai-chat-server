# חוזה · חוט preview-telephony
**תפקיד:** תצוגה-מקדימה חיה לקונפיג-טלפוניה — בונה tenant, מריץ סימולטור-שיחה
על 3 תרחישים מייצגים (יום-חול בשעות · יום-חול אחרי-שעות · שבת), ומחשב דוח-אמון.
downstream, קריאה-בלבד, אפס PBX. ולידציה נכשלת ⇒ יציאה מוקדמת עם השגיאות
(buildTenant/explainCall/trustReport לא נקראים כלל).
**שקעים (חוק-1 — קריאות-השכן הוזרקו כפרמטרים, בסדר הזה):**
- ‏telephonyToTenant(tc, orgName, tenantId) ⇒ raw-tenant.
- ‏anchorToday() ⇒ מחרוזת ISO של היום (במקור: new Date מקומי — אי-הדטרמיניזם
  שוקע; האטום עצמו דטרמיניסטי בהינתן השקע).
- ‏validateTenant(raw) ⇒ {ok, errors, warnings, tenant?}.
- ‏buildTenant(raw, opts) ⇒ {ok, warnings?, files?}.
- ‏explainCall(tenant, call, opts) ⇒ {summary, outcome}.
- ‏trustReport(built) ⇒ {grade, score, ready, failing:[{label,detail,severity,...}]}.
**קלט:** tc (קונפיג-טלפוניה עם numbers:[{kind,e164}...]) · orgName · tenantId ·
ששת השקעים. **פלט:** {ok, errors, warnings, rows, trust, files}.
**התנהגות מחייבת:** ‏opts תמיד { anchorDate: anchorToday(), calendarWindow: 400 } ·
מספר-הקול = הראשון מסוג sim/virtual, ואם אין — המספר הראשון; בלי מספרים ⇒ '' ·
המתקשר בתרחישים קבוע '050-1234567' · התרחישים: dow=2 ‏10:00 · dow=2 ‏20:00 ·
dow=6 ‏11:00.
**דוגמאות מחייבות (עם שקעי-בדיקה רושמי-קריאות):**
1. ולידציה נכשלת (validateTenant⇒{ok:false, errors:['אין DID'], warnings:['w1']})
   ⇒ {ok:false, errors:['אין DID'], warnings:['w1'], rows:[], trust:null, files:null},
   ו-buildTenant נקרא 0 פעמים.
2. ולידציה עוברת ⇒ ‏rows באורך 3, ‏explainCall נקרא 3 פעמים עם
   calls: (dow:2,'10:00') · (dow:2,'20:00') · (dow:6,'11:00'), כולן עם
   callerId='050-1234567' ו-opts={anchorDate:'2026-08-24', calendarWindow:400}.
3. בחירת-DID: numbers=[{kind:'landline',e164:'+97221111111'},{kind:'sim',e164:'+972501111111'}]
   ⇒ כל שיחות-התרחיש עם did='+972501111111' (ה-sim גובר על הראשון).
4. ‏built.ok=true עם trustReport⇒{grade:'A', score:95, ready:true, failing:[{label:'l',
   detail:'d', severity:'warn', extra:'זולג'}]} ⇒ ‏trust={grade:'A', score:95, ready:true,
   failing:[{label:'l', detail:'d', severity:'warn'}]} (רק 3 שדות ממופים) ·
   files=הקבצים מ-buildTenant · warnings=built.warnings.
5. ‏built.ok=false (וולידציה עברה) ⇒ ‏ok:true אבל trust=null; ‏warnings נופל
   ל-built.warnings ואם אין — ל-v.warnings ואם אין — []; ‏files=built.files||null.
**מוצא:** maor/src/components/telephony/lib.ts:133-185 (‏previewTelephony);
‏anchorToday היה helper פרטי שם (שם:124-127) — הפך לשקע (חוק-1).
