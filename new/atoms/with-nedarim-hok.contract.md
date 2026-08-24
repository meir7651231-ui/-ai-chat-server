# חוזה · חוט with-nedarim-hok
**תפקיד:** מילוי-אוטומטי של משבצת-ההו"ק בכרטיס-תומך מחיוב-נדרים חוזר (הכרעת-בעלים
19.8: "שיתמלא אוטומטית מנדרים ישר למשבצת של הו"ק"). חיוב עם kevaId ⇒ מחזיר תומך
חדש עם ‏hok מלא: סכום/מטבע/יום מהעסקה, ‏method='card', ‏active=true,
‏note='הו״ק נדרים · '+kevaId, ‏startedAt=המוקדם-מבין (prevStart, תאריך-העסקה).
**לא נוגע** (מחזיר את sp עצמו): זיכוי/ביטול (amount≤0) · בלי kevaId ·
הו"ק **ידני** קיים (sp.hok בלי kevaId — לא דורסים את המשרד).
**שקעים (חוק-1 — שכני-הקובץ הוזרקו כפרמטרים):**
- ‏curOf(charge) ⇒ '₪'|'$' — מטבע מנורמל מהעסקה (שכן באותו קובץ).
- ‏hokDayFromDate(iso) ⇒ 1–28 — יום-החיוב מתאריך-העסקה (שכן).
**קלט:** ‏sp (Supporter) · ‏charge (SyncCharge) · שני השקעים. **פלט:** Supporter
(עותק-חדש עם hok, או sp כלשונו). טהור — sp המקורי לא משתנה.
**דוגמאות מחייבות** (שקעים מזויפים: ‏curOf=currency==='$'?'$':'₪' · ‏hokDayFromDate=יום-מה-ISO):
1. ‏charge={amount:0, kevaId:'K1'} ⇒ מוחזר **בדיוק** sp (אותה הפניה); גם amount:-50.
2. ‏charge={amount:180} (בלי kevaId, גם ' ' רווחים) ⇒ מוחזר בדיוק sp.
3. הו"ק ידני: ‏sp.hok={amount:100, active:true} (בלי kevaId), ‏charge={amount:180, kevaId:'K7', d:'2026-08-15'}
   ⇒ מוחזר בדיוק sp — המשרד לא נדרס.
4. מילוי מלא: ‏sp={id:'s1', name:'לוי'} (בלי hok), ‏charge={amount:180, kevaId:'K7', d:'2026-08-15'}
   ⇒ ‏hok={amount:180, cur:'₪', day:15, method:'card', note:'הו״ק נדרים · K7',
   active:true, startedAt:'2026-08-15', kevaId:'K7'}; ‏id/name נשמרים; sp המקורי בלי hok.
5. שימור-התחלה מוקדמת: ‏sp.hok={kevaId:'K7', amount:100, startedAt:'2026-05-01'},
   ‏charge={amount:220, kevaId:'K7', d:'2026-08-15'} ⇒ ‏startedAt נשאר '2026-05-01',
   ‏amount מתעדכן ל-220.
6. ‏prevStart מאוחר מהעסקה: ‏sp.hok={kevaId:'K7', startedAt:'2026-09-01'},
   ‏charge d='2026-08-15' ⇒ ‏startedAt='2026-08-15' (העסקה המוקדמת מנצחת).
7. בלי ‏d — נופל ל-at: ‏charge={amount:50, kevaId:'K9', at:'2026-08-20T10:30:00'}
   ⇒ ‏startedAt='2026-08-20' (10 התווים הראשונים), ‏day=hokDayFromDate('2026-08-20')=20.
**מוצא:** maor/src/lib/nedarimSync.ts:172-192 (‏withNedarimHok). השכנים
‏curOf/hokDayFromDate הפכו לשקעים (חוק-1).
