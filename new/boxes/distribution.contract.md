# חוזה · קופסת-חיבורים "חלוקה (SHOP7)"
**תפקיד:** מודול מתנדבים · יום-חלוקה · מסירות. מחווט את 14 חוטי-SHOP7 במקום אחד.
**מקור-אמת:** `maor/src/components/shop7/lib.ts` (עוגני-שורה למטה) — הקוד קדוש (L4).
**ייבוא:** אך-ורק אטומים מ-`new/atoms`. **שקע מוזרק:** `smartFilter` — חוט מודול-החיפוש
(‏maor/src/lib/search.ts), לא מיובא (L3 — קופסה לא מייבאת קופסה); מוזרק בקריאה.

## הכרעות שחיות בקופסה
- **מילון-תוויות** (shop7/lib.ts:20-22): `pickup→איסוף · enroute→בדרך · delivered→נמסר`.
- **בוררי-שדות-סינון** (shop7/lib.ts:150-162): מתנדב ⇒ `[name, phone, area??'']` ·
  מסירה ⇒ `[familyName, volunteerName, statusLabel(status)]`. שאילתה-ריקה ⇒ הרשימה כמות-שהיא.
- **קיצור-דרך שאילתה-ריקה** לפני `smartFilter` — שמירה על סמנטיקת-המקור.

## החשיפה
- `advanceStatus(status)` (‏lib.ts:14-17) ⇒ הבא במכונה-הקדימה; `delivered` סופי.
- `statusLabel(status)` (‏lib.ts:20-22) ⇒ תווית עברית.
- `deliveriesOfDay(db, dayId)` (‏lib.ts:25-27) · `deliveriesOfVolunteer(db, volId, dayId?)` (‏lib.ts:29-31).
- `eligibleAssignmentsForDay(db, dayId)` (‏lib.ts:38-41) ⇒ שיוכים פעילים שטרם נמסרו היום.
- `progressOfDay(db, dayId)` (‏lib.ts:43-51) ⇒ `{ total, pickup, enroute, delivered }` (מחווט `deliveriesOfDay`).
- `loadHint(db, vol, dayId)` (‏lib.ts:57-61) ⇒ `{ count, over } | null` (מחווט `deliveriesOfVolunteer`).
- `deliveriesOfFamily(db, famId)` (‏lib.ts:64-66) · `pendingDeliveriesToday(db, todayIso)` (‏lib.ts:73-85).
- `listLines(rows)` (‏lib.ts:86-113) ⇒ שורות-תדפיס פר-מתנדב (מחווט `statusLabel`).
- `csvRows(db, config?)` (‏lib.ts:114-135) ⇒ שורות-CSV (מחווט `termOf`+`statusLabel`).
- `volunteerRouteStops(db, dayId, volunteerId)` (‏lib.ts:136-146) ⇒ עצירות-מסלול מסוננות-ריקים.
- `filterVolunteers(vols, q, smartFilter)` (‏lib.ts:149-154) · `filterDeliveries(rows, q, smartFilter)` (‏lib.ts:156-163).

## דוגמאות מחייבות
- `advanceStatus('pickup')='enroute'` · `advanceStatus('delivered')='delivered'` · `advanceStatus('zzz')='delivered'`.
- `statusLabel('enroute')='בדרך'`.
- `db` עם 2 מסירות (pickup+delivered) ליום D ⇒ `progressOfDay ⇒ {total:2, pickup:1, enroute:0, delivered:1}`.
- מתנדב `maxDeliveries=1` עם מסירה אחת ⇒ `loadHint ⇒ {count:1, over:true}`; ללא `maxDeliveries` ⇒ `{count:0, over:false}`.
- `pendingDeliveriesToday`: יום פתוח בעבר עם מסירת-pickup נספר; יום `closed` לא צף.
- `csvRows` שורת-כותרת = `['תאריך','משפחה','כתובת','מתנדב','סטטוס','הערה']` (‏config?⇒termOf על `entity.family`).
- `volunteerRouteStops`: משפחה בלי כתובת מדולגת; `[address, city]` מסונן-ריקים.
- `filterVolunteers(vols,'',fn)` ⇒ `vols` (בלי קריאה ל-smartFilter); `q` לא-ריק ⇒ `smartFilter(q, vols, בורר)`.
