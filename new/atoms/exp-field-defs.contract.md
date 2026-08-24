# חוזה · חוט exp-field-defs
**תפקיד:** הגדרות-השדות (key+label) של "הדו"ח המותאם" לפי יעד — חוגים /
אירועים / תומכות. הדגל 'reports.custom.full' (חסר=פעיל) בוחר רשימה מלאה או
מקוצרת; ביעד תומכות שדות מעקב-הטיפול נוספים רק כשדגל 'supporters.ayin' דלוק.
תוויות עוברות דרך מילון-המונחים.
**שקעים (חוק-1):** featureOn(cfg, key)→boolean · termOf(cfg, key, fb)→מונח ·
featLabel(cfg)→שם-מעקב-הטיפול · itemLabel(cfg)→שם-פריט · unitLabel(cfg)→שם-מונה.
**קלט:** cfg · target∈{'courses','events','supporters'} + חמשת השקעים.
**פלט:** מערך ‎{key, label}‎.
**דוגמאות מחייבות (שקעי-ברירת-מחדל: featureOn קורא cfg.features — חסר=פעיל,
false=כבוי; termOf מחזיר fb; featLabel='מעקב טיפול', itemLabel='שם לטיפול',
unitLabel='כמות'):**
- courses, full (חסר) ⇒ 14 שדות; ‏[0]={key:'name',label:'שם החוג'} ·
  ‏[1].label='מורה + טלפון' · ‏[9].key='studentsFull' · ‏[13].key='notes'.
- courses, full=false ⇒ 7 שדות; ‏[0].label='שם החוג' · keys=
  name,teacher,model,occ,students,pays,abs (בלי grade/room/notes).
- events ⇒ תמיד 8 שדות (הדגל לא משנה); keys=
  title,type,hdate,gdate,time,fam,notes,done · ‏[5].label='משפחה'.
- supporters, full+ayin ⇒ 17: ‏10 בסיס (name…tier, ‏[9].key='tier') +
  ‏6 ayin (stage·names·eyesTotal·paid·answers·next; stage.label='שלב מעקב טיפול' ·
  names.label='שם לטיפול + כמות') + notes אחרון.
- supporters, full, ayin=false ⇒ 11 (בסיס+notes, אפס שדות-מעקב).
- supporters, full=false, ayin=false ⇒ 4 (name·phone·email·dons,
  ‏dons.label='תרומות בטווח (מספר + סכום)'); עם ayin ⇒ 8 (+stage·names·answers·next).
**מוצא:** חולץ כלשונו מ-maor/src/lib/customExport.ts:36-126 (‏expFieldDefs;
קריאות-השכן featureOn/termOf/featLabel/itemLabel/unitLabel שוקעו).
