# חוזה · קופסה telephony

**תפקיד:** הגשר בין אשף-ההקמה של מאור למנוע-הטלפוניה הטהור. ממיר שדות-אשף
ידידותיים ל-tenant שהמנוע מבין, ומריץ תצוגה-מקדימה חיה (סימולטור-שיחה + דוח-אמון)
ווידג'ט-סגירה-הלכתית בדפדפן — הכול downstream, קריאה-בלבד, אפס PBX/ספק.
**מוצא:** `maor/src/components/telephony/lib.ts` (כל הקובץ, שורות 34-205).

## חוטים מחווטים (6)
| חשיפה | אטום | מוצא-שורה |
|---|---|---|
| `emptyTelephonyConfig()` | empty-telephony-config | lib.ts:34-51 |
| `toTenantId(slug, orgName)` | to-tenant-id | lib.ts:54-62 |
| `telephonyToTenant(tc, orgName, tenantId)` | telephony-to-tenant | lib.ts:68-110 |
| `previewTelephony(tc, orgName, tenantId, io)` | preview-telephony | lib.ts:133-167 |
| `nextClosure(config, todayIso, io)` | next-closure | lib.ts:186-196 |
| `explainOne(tc, orgName, tenantId, call, io)` | explain-one | lib.ts:199-205 |

## הכרעת-החיווט (חיה בקופסה)
החוט `telephonyToTenant` (בבעלות הקופסה) ממלא את **שקע-ההמרה** של `previewTelephony`
ושל `explainOne` — במקור זו קריאה-פנימית ישירה (lib.ts:134 · lib.ts:200). כאן היא
חיווט גלוי: הקופסה מזריקה את חוט-ההמרה שלה, אפס import-חוט-לחוט (חוק-3).

## שקעי-IO (חוק-1 — מנוע-חיצוני + Date מוזרקים ע"י הצרכן דרך `io`)
- `previewTelephony`/`explainOne`: `io.anchorToday()` ⇒ ISO-של-היום (במקור helper
  פרטי `new Date()`, lib.ts:124-127 — אי-הדטרמיניזם שוקע לשקע).
- `previewTelephony`: `io.validateTenant`, `io.buildTenant`, `io.explainCall`,
  `io.trustReport` (מנוע-הטלפוניה, lib.ts:12-15).
- `explainOne`: `io.validateTenant`, `io.explainCall`.
- `nextClosure`: `io.hebrewClosedWindows(fromIso, windowDays, tenant, opt)` +
  `io.CITIES` (מילון-ערים, lib.ts:15).

## התנהגות מחייבת (מהמקור)
- **emptyTelephonyConfig** — קו-ראשי sim ריק · officeDays `[0,1,2,3,4]` ·
  09:00–17:00 · ext 101/201 · vm 100 · hebrewCalendar+shabbat+voicemail=true, השאר
  false (lib.ts:35-50).
- **toTenantId** — slug≠'default' גובר על orgName; חיטוט ל-`[a-z0-9-]`, חיתוך-מקפים,
  38 תווים; פחות-מ-3 ⇒ `<base>-org`; לא-מתחיל-באות/ספרה ⇒ `x-…` חתוך-40 (lib.ts:55-61).
- **telephonyToTenant** — מסננת מספרים ריקי-e164; SIM מקבל `gatewayChannel` רץ (1,2…);
  `outbound.defaultNumberId` = ה-SIM-הראשון, ואם אין — המספר-הראשון, ואם אין — `'n1'`;
  `officeHours.days` ממוין; `city`/`kosher` מוצגים רק כשקיימים (lib.ts:69-109).
- **previewTelephony** — ולידציה נכשלת ⇒ יציאה מוקדמת `{ok:false,…,rows:[],trust:null,
  files:null}` (buildTenant/explainCall/trustReport לא נקראים); עוברת ⇒ 3 תרחישים
  (dow2/10:00 · dow2/20:00 · dow6/11:00, caller '050-1234567', did=ה-sim/virtual-הראשון
  או המספר-הראשון או ''); opts תמיד `{anchorDate:anchorToday(), calendarWindow:400}`;
  trust ממופה ל-4 שדות (grade/score/ready/failing[label,detail,severity]) רק כש-built.ok
  (lib.ts:134-166).
- **nextClosure** — בלי `config.telephony` ⇒ null (השקע לא נקרא); `city =
  telephony.city||'default'`; קריאה אחת `(todayIso,10,{city,timezone:'Asia/Jerusalem'},{})`;
  חלון-ראשון או null; `cityHe` = `CITIES[city].he` או נפילת-`CITIES.jerusalem.he`;
  `startTime⇒candle`, `endTime⇒tzeis`, `days` לא מועתק (lib.ts:187-195).
- **explainOne** — ולידציה נכשלת ⇒ `{summary:'⚠️ תצורה לא-תקינה: '+errors.join(' · '),
  outcome:'invalid', reason:''}`; עוברת ⇒ `explainCall(tenant, call, opts)` (lib.ts:200-204).

## דוגמאות מספריות (מחייבות — הבדיקה מוכיחה אותן דרך הקופסה)
1. `emptyTelephonyConfig().officeDays` ≡ `[0,1,2,3,4]`, `.officeStart='09:00'`,
   `.numbers[0].kind='sim'`.
2. `toTenantId('My Org!!', 'x')` ⇒ `'my-org'`; `toTenantId('default','חסד קהילה')`
   ⇒ `'x--org'` (שם-לא-לטיני ⇒ ריצת-מקפים ⇒ חיתוך ל-`''` ⇒ padding `'-org'` ⇒
   לא-מתחיל-באות ⇒ קידומת `x-` = `'x--org'`); `toTenantId('ab','')` ⇒ `'ab-org'`.
3. `telephonyToTenant({numbers:[{id:'n1',e164:' +9721 ',kind:'sim'},{id:'n2',e164:'',
   kind:'virtual'}],officeDays:[4,0,2],officeStart:'08',officeEnd:'16',officeExt:'1',
   managerExt:'2',vmBox:'3',city:''}, '', 'ten')` ⇒ `numbers` באורך 1 (n2 סוננה),
   `numbers[0].gatewayChannel=1`, `outbound.defaultNumberId='n1'`,
   `officeHours.days=[0,2,4]`, `orgName='ארגון'`, אין שדה `city`.
4. `previewTelephony(tc,'org','ten', io)` עם `io.validateTenant⇒{ok:false,
   errors:['e'],warnings:['w']}` ⇒ `{ok:false,errors:['e'],warnings:['w'],rows:[],
   trust:null,files:null}`, ו-`io.buildTenant` נקרא 0 פעמים.
5. אותה קריאה עם ולידציה-עוברת + `io.explainCall` רושם-קריאות ⇒ `rows.length===3`,
   `explainCall` נקרא 3× עם `opts.anchorDate=anchorToday()` ו-`calendarWindow=400`.
6. `nextClosure({}, '2026-08-24', io)` ⇒ null, `io.hebrewClosedWindows` נקרא 0 פעמים.
7. `nextClosure({telephony:{city:'telaviv'}}, '2026-08-24', io)` עם שקע שמחזיר
   `[{reason:'שבת',kind:'shabbat',startIso:'a',startTime:'18:42',endIso:'b',
   endTime:'19:53',days:1}]` ו-`CITIES={telaviv:{he:'תל אביב'},jerusalem:{he:'ירושלים'}}`
   ⇒ `{reason:'שבת',kind:'shabbat',startIso:'a',candle:'18:42',endIso:'b',tzeis:'19:53',
   cityHe:'תל אביב'}`.
8. `explainOne(tc,'org','ten',{dow:2,hhmm:'10:00'}, io)` עם `io.validateTenant⇒{ok:false,
   errors:['אין DID']}` ⇒ `{summary:'⚠️ תצורה לא-תקינה: אין DID', outcome:'invalid',
   reason:''}`.

## DoD (פקודה+פלט-צפוי, לפני-הקוד — דיבר 12)
- `node new/boxes/telephony.test.mjs` ⇒ exit 0 + `✓ קופסת-טלפוניה…`.
- `node maor-system/machtzev/parity/telephony.parity.mjs` ⇒ exit 0 + `🥇 זהב-טלפוניה…`
  (ישן≡חדש על קורפוס-LCG seed=20260824, אפס-סטייה).
- `node machtzev/police.mjs --fast` ⇒ ירוק (חיווט+חוזה+מחצבה+pins).
