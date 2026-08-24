# חוזה · חוט normalize-telephony
**תפקיד:** חיטוי תצורת-הטלפוניה לפני התמדה/ייצוא — allowlist **מלא**: כל שדה
זר נזרק, כל ערך פסול נופל לברירת-מחדל. חסר/לא-אובייקט/מערך ⇒ undefined
(⇒ אין telephony ⇒ ביט-זהה להיום). `enabled` הוא opt-in: נשמר רק כשהוא
בדיוק true (חסר/false/כל-דבר-אחר ⇒ מושמט).
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏telStr(v,max) — מחרוזת נקייה מתווי-בקרה (Unicode Cc), מגוזמת ל-max; לא-מחרוזת ⇒ ''.
- ‏telExt(v,def) — שלוחה: ספרות בלבד עד 8; ריק/לא-מחרוזת ⇒ ברירת-המחדל def.
**קלט:** raw כלשהו + שני השקעים. **פלט:** אובייקט-תצורה מחוטא, או undefined.
**דוגמאות מחייבות:**
1. ‏null / 'x' / [1] ⇒ undefined.
2. ‏{} ⇒ ‏{numbers:[], officeDays:[0,1,2,3,4], officeStart:'09:00',
   officeEnd:'17:00', officeExt:'101', managerExt:'201', vmBox:'100', city:'',
   kosherMode:false, hebrewCalendar:true, zmanim:false, shabbat:true,
   fasts:false, voicemail:true} — ובלי מפתח enabled בכלל.
3. ‏{enabled:true} ⇒ ‏enabled===true; ‏{enabled:'yes'} ⇒ אין מפתח enabled.
4. מספרים: ‏numbers:[{e164:'03-123x4567!', label:'משרד', kind:'זבל', kosher:true}, 7]
   ⇒ מספר יחיד ‏{id:'n1', e164:'03-1234567', label:'משרד', kind:'sim', kosher:true}
   (תווים זרים ב-e164 נזרקים; kind מחוץ ל-allowlist ‏['sim','virtual','whatsapp'] ⇒ 'sim';
   לא-אובייקט נזרק; id ריק ⇒ ‏n<אינדקס+1>; label ריק ⇒ ה-id). ‏kosher:'true' (מחרוזת) ⇒ מושמט.
5. ‏officeDays:[3,1,3,9,-1,'a',2] ⇒ ‏[1,2,3] (ייחוד+טווח 0–6+מיון); לא-מערך ⇒ ‏[0,1,2,3,4].
6. ‏officeStart:'25:00' ⇒ '09:00' (פסול⇒ברירת-מחדל); ‏'08:30' ⇒ '08:30'
   (תבנית HH:MM ‏00:00–23:59 בלבד).
7. ‏city:'Tel-Aviv6' ⇒ 'telaviv' (‏lowercase, ‏[a-z] בלבד); ‏'a' ⇒ '' (מתחת 2);
   ‏'a'.repeat(21) ⇒ '' (מעל 20 — זבל לא נגזם, נופל לריק).
**מוצא:** maor/src/lib/config.ts:169-211 (‏normalizeTelephony); השכנים
telStr/telExt הפכו לשקעים; הקבועים TEL_KINDS/TEL_HHMM_RE (שכני-ערך באותו
קובץ) שוכנו בגוף האטום כלשונם.
