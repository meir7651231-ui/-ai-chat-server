# 📜 חוזה · קופסת-חיבורים `diary` (יומן-החדרים)

מקור-אמת (L4): `maor-system/src/components/diary/lib.ts`.
הקופסה מחווטת אך-ורק אטומים מ-`new/atoms/` (חוק-2/3). ההכרעות — סדר, ברירות-מחדל,
מילון-התוויות, והעוזר-הפרטי `courseOnDate` — חיות בקופסה. שקעי-השכן (hebParts,
HOLIDAYS, sessionsOf, termOf, planWord, pad2, isoLocal) מוזרקים לאטומים כחיווט-פנימי.

> ⚠️ **הכרעת-מקור (L4/L2):** לדיאורי שתי פונקציות משלו — `planLabelOf` ו-`enrollStatusMeta`
> — **הנבדלות** מהאטומים `plan-label-of` / `enroll-status-meta` (וריאנט-הקורסים). לכן
> הקופסה **אינה** מייבאת אותם, אלא מחווטת את **וריאנט-היומן** כהכרעת-קופסה (מילון-תוויות).
> ‏diary `planLabelOf` = `כרטיסייה · יתרה ${max(0,purchased-used)}/${purchased}` אחרת `planWord(plan)`
> (מקור: lib.ts:261-266). ‏diary `enrollStatusMeta` ⇒ **null** כברירת-מחדל (מקור: lib.ts:268-275),
> לעומת וריאנט-הקורסים שמחזיר `{label:'פעיל'…}`.

## החוטים (19) — קלט · פלט · עוגן-מקור

| חוט | חתימה | עוגן |
|---|---|---|
| `fmtDate(iso)` | ISO→`DD/MM/YYYY`; ריק/שבור→`—` | lib.ts:16-22 |
| `localIso(d)` | `Date`→`YYYY-MM-DD` מקומי | lib.ts:24-26 |
| `isoToday(now?)` | היום כ-ISO מקומי (now מוזרק לבדיקה) | lib.ts:28-30 |
| `DAY_NAMES` | 7 שמות (0=ראשון…6=שבת) | lib.ts:32 |
| `pad2(n)` | ריפוד-אפס ל-2 ספרות | lib.ts:34-36 |
| `timeToMin(t)` | `"HH:MM"`→דקות; שבור→NaN | lib.ts:39-43 |
| `minToHM(min)` | דקות→`"HH:MM"` | lib.ts:45-47 |
| `groupLabelOf(ss,i)` | `label` או `"קבוצה N"` | lib.ts:51-53 |
| `ABSENCE_REASON_CHIPS` | 5 צ'יפי-נימוק | lib.ts:65 |
| `makeupEligibility(kind,justified,rawHrs)` | `{eligible,dropsPunch}` | lib.ts:67-77 |
| `blockReason(d,blockingOn?)` | סיבת-חסימה או null | lib.ts:97-113 |
| `buildSlots(db,room,iso,blocked,config,cleaningOn?)` | `DiarySlot[]` | lib.ts:139-227 |
| `enrollmentsForSession(db,c,i)` | `Enrollment[]` | lib.ts:228-236 |
| `weeklyRoomSessions(db,roomId,iso)` | מספר מפגשים | lib.ts:237-243 |
| `inactiveRoomCourses(db,iso,config)` | `{course,roomName}[]` | lib.ts:244-259 |
| `planLabelOf(e)` | תווית-מסלול (וריאנט-יומן) | lib.ts:261-266 |
| `enrollStatusMeta(e)` | `{label,bg,c}` או null (וריאנט-יומן) | lib.ts:268-275 |
| `chipStyle(bg,c)` | אובייקט-סגנון | lib.ts:277-288 |
| `roomInfoLabel(room)` | שורת-מידע על חדר | lib.ts:291-304 |

## דוגמאות-מספריות (מתוך קריאת-המקור — הבדיקה מוכיחה בדיוק אותן)
- `fmtDate('2026-08-24')` → `'24/08/2026'` · `fmtDate('')` → `'—'` · `fmtDate('bad')` → `'—'`
- `localIso(new Date(2026,7,24,12,0))` → `'2026-08-24'`
- `timeToMin('09:30')` → `570` · `timeToMin('bad')` → `NaN` · `timeToMin(' 8:05 ')` → `485`
- `minToHM(570)` → `'09:30'` · `minToHM(0)` → `'00:00'`
- `groupLabelOf({label:''},0)` → `'קבוצה 1'` · `groupLabelOf({label:'א'},3)` → `'א'`
- `makeupEligibility('noshow',true,999)` → `{eligible:false,dropsPunch:true}`
- `makeupEligibility('cancel',false,48)` → `{eligible:true,dropsPunch:false}` (ביטול-מוקדם)
- `makeupEligibility('cancel',false,10)` → `{eligible:false,dropsPunch:true}`
- `makeupEligibility('cancel',true,null)` → `{eligible:true,dropsPunch:false}` (מוצדק)
- `blockReason(new Date(2026,7,22,12))` (שבת) → `'שבת'` · יום שישי → `'יום שישי (שעתיים לפני שבת)'`
- `blockReason(new Date(2022,7,7,12))` (י' באב נדחה, ראשון) → `'תשעה באב (נדחה)'`
- `blockReason(d,false)` → `null` (דגל-חסימה כבוי)
- `planLabelOf({plan:'punch',purchased:10,used:3})` → `'כרטיסייה · יתרה 7/10'`
- `enrollStatusMeta({status:'wait'})` → `{label:'רשימת-המתנה ⏳',bg:'#e7edf5',c:'#3a5a86'}`
- `enrollStatusMeta({status:'active'})` → `null`
- `roomInfoLabel({slot:45,cap:12,access:true,eq:{מקרן:true}})` → `'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן'`

## DoD (פקודה+פלט-צפוי — לפני הקוד, דיבר 12)
- `node new/boxes/diary.test.mjs` ⇒ exit 0 (כל דוגמאות-החוזה + מגן-הכרעה)
- `node maor-system/machtzev/parity/diary.parity.mjs` ⇒ exit 0 (ישן≡חדש, קורפוס-LCG seed=20260824, אפס-סטייה)
