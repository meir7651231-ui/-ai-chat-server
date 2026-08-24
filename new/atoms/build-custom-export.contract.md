# חוזה · חוט build-custom-export
**תפקיד:** בונה "דו"ח מותאם" — טהור לחלוטין: לפי יעד ('courses' / 'events' /
'supporters'), טווח-תאריכים {from,to} (ריק = בלי-גבול) ורשימת שדות נבחרים ⇒
שורות CSV: שורה ראשונה = תוויות השדות שנבחרו (הסדר לפי סדר-ה-defs מהשקע
expFieldDefs, מסונן ל-selectedKeys), ואז שורת-נתונים לכל רשומה; שדה חסר ⇒ ''.
אפס שדות ⇒ ‏[[]] בלבד.
- **courses:** לכל חוג — שם · מורה+טלפון · כיתות (gradeMin–gradeMax) · קהל ·
  חדר · 'יום <שם-יום> <שעה>' לכל מפגש (' · ') · מסלול ('כרטיסייה'/'מנוי
  חצי-שנתי'/'מנוי שנתי'/'מנוי חודשי' + ' · ₪'+מחיר) · תפוסה
  (enrollCount+'/'+maxStudents||'—') · תלמידות (שם-פרטי) · studentsFull
  (שם+טלפון-ילדה-או-משפחה+' · יתרה ₪'+max(0,totalDue−שולם)) · תשלומים/חיסורים
  **בטווח** · הכנסות (כל-הזמן) · הערות.
- **events:** אירוע רגיל — נכלל כש-inR או כשהטווח כולו ריק. אירוע עברי-חוזר
  (HEBREW_RECURRING) **רק בטווח חסום משני-הצדדים**: פריסה יום-יום מ-from עד
  to (תקרה CAP_DAYS=4000), מופע כש-hebAnnualEq(עוגן, hebParts(יום)) **וגם**
  iso≥ev.date (בלי שורות-רפאים לפני האירוע). המופעים ממוינים לפי תאריך. עמודות:
  כותרת · סוג (customType || EV_META[type].label) · תאריך-עברי (hebDateFull) ·
  לועזי (DD/MM/YYYY) · שעה · משפחה · הערות · בוצע ('כן'/'לא').
- **supporters:** תומכת נכללת רק אם יש לה תרומות-בטווח, תשובות-בטווח, או
  (כשדגל supporters.ayin דלוק) מגע-ayin-בטווח (lastTouch/log). ‏dons =
  'N <תרומות> · ₪ils[ + $usd]' (מטבע '$' נפרד); ‏donsAll דרך supCount/supIls/
  supUsd; ‏tier = supTier(supScore(sp, db.usdRate)).label. שדות-ayin (stage ·
  names 'שם ·כמות[ ✓]' · eyesTotal · paid · answers-בטווח 'א | ב' · next
  'DD/MM/YYYY[ שעה]') רק כשהדגל דלוק וגם יש תיק — אחרת ''.
**שקעים (חוק-1 — אובייקט s אחד, 17 שקעים):** ‏expFieldDefs(cfg,target)⇒
{key,label}[] · ‏featureOn(cfg,key)⇒bool · ‏termOf(cfg,key,fb)⇒string ·
‏sessionsOf(c)⇒{day,time,label}[] · ‏enrollCount(db,courseId)⇒number ·
‏hebParts(Date)⇒{day,month,year} · ‏hebAnnualEq(anchor,query)⇒bool ·
‏hebDateFull(iso)⇒string · ‏supCount/supIls/supUsd(sp)⇒number ·
‏supScore(sp,rate)⇒number · ‏supTier(score)⇒{label} · ‏stageLabel(cfg,stage)⇒
string · ונתוני-שקע: ‏EV_META (מפת label לסוג-אירוע) · ‏HEBREW_RECURRING
(‏Set: memorial/anniversary/bday) · ‏DAY_NAMES (שמות-ימים עבריים 0-6).
העוזרים inR/isoOf/fmtD היו פרטיים בקובץ-המקור — נשארו באטום.
**קלט:** cfg · db · target · range{from,to} · selectedKeys[] · s. **פלט:** Cell[][].
**דוגמאות מחייבות** (שקעי-בדיקה מתועדים בבדיקה; ‏hebParts-מדומה = לוח-לועזי:
{day:getDate(), month:String(getMonth()), year} · ‏hebAnnualEq = day+month שווים ·
‏hebDateFull='ע:'+iso · ‏termOf=fb · ‏stageLabel='ש:'+stage):
1. ‏selectedKeys=[] ⇒ ‏[[]] (כותרת-ריקה בלבד, בלי שורות-נתונים).
2. **courses** (חוג 'ציור', punch ‏₪120, מורה 'הדס 050', חדר 'אולם', כיתות
   'ג'-'ה', ראשון 16:00, ‏maxStudents=10, ‏enrollCount-מדומה=1; שיבוץ רות
   (טלפון-ילדה ריק ⇒ '03' של המשפחה, ‏totalDue=300, תשלומים 100 באוג׳ + 50
   במאי, חיסורים 10.8 + 1.1), טווח אוג׳-2026 ⇒ שורת-הנתונים:
   ['ציור','הדס 050','ג–ה','אולם','יום ראשון 16:00','כרטיסייה · ₪120','1/10',
   'רות','רות 03 · יתרה ₪150','1 תשלומים · ₪100','₪150','1 חיסורים'].
3. **events רגיל** (טווח 2026-08): 'ישיבה' (org, 20.8, שעה 10:00, משפחת פרץ,
   done) ⇒ ['ישיבה','אירוע','ע:2026-08-20','20/08/2026','10:00','פרץ','כן'];
   ‏customType 'מסיבה' דורס את EV_META; אירוע מחוץ-לטווח נעדר; המיון לפי תאריך.
4. **events חוזר** (‏memorial מ-'2025-08-20', בלוח-המדומה) ⇒ בטווח החסום
   2026-08 נולד מופע '2026-08-20'; ‏memorial עתידי '2026-08-25' מופיע פעם-אחת
   (חסם iso≥ev.date — אין רפאים); בטווח ריק-כולו ({from:'',to:''}) החוזר נופל
   לענף-הרגיל ומופיע בתאריך-המקור בלבד.
5. **supporters — סינון-נגיעה:** תומכת בלי תרומות-בטווח, בלי תשובות ובלי מגע
   ⇒ מוחרגת; תרומות [₪100 באוג׳, $20 באוג׳, ₪999 ב-2025] בטווח אוג׳-2026 ⇒
   ‏dons='2 תרומות · ₪100 + $20', ‏donsAll='3 תרומות · ₪1099 + $20',
   ‏tier מהשקעים ('זהב' במדומה: score=מס׳-תרומות×10, ‏≥30='זהב').
6. **supporters — ayin דלוק:** תומכת בלי תרומות אך ‏lastTouch באוג׳ ⇒ נכללת;
   ‏stage='ש:eyes' · ‏names='משה ·4 ✓ · רות' (‏eyes:'' לא מוצג) · ‏eyesTotal='4' ·
   ‏paid='כן' · ‏answers='א' (רק-בטווח) · ‏next='01/09/2026 10:30'.
7. **supporters — ayin כבוי** (features['supporters.ayin']=false): תומכת
   שאות-החיים היחיד שלה הוא lastTouch-בטווח מוחרגת (המגע לא נספר); תומכת עם
   תשובה-בטווח נשארת (answers נבדקות בלי-קשר-לדגל) אך עמודות-ayin שלה ריקות.
**מוצא:** maor/src/lib/customExport.ts:159-323 (‏buildCustomExport). חולץ
כלשונו; 17 קריאות/קבועי-השכן שוקעו באובייקט s (שינוי-שם פנימי יחיד:
‏map((s)⇒…) של ה-schedule הפך ‏map((ss)⇒…) כדי לא להאפיל על אובייקט-השקעים —
אפס שינוי-התנהגות).
