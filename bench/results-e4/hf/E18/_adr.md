# ADR — Add עדות field to ממצא

## Opening Question (§ג.1)

**מה:** הוספת שדה עדות לישות ממצא (finding entity)  
**מקור:** spec language (specs-ds/sechirut.txt · line 9)  
**תרגום ל-spec:** 
```
בחירה סגורה עם 3 ערכים: תמונה | מסמך | בעל פה
```

**helper נדרש:** לא (שדה בחירה-סגורה, לא דורש לוגיקה)  
**מחרוזות verbatim:** תמונה, מסמך, בעל פה (עברית, מקור: task description)  
**חסום:** אין  

---

## Assumed Answer

The spec language supports closed-choice fields via the syntax `שדה{ערך1|ערך2|ערך3}`.  
Adding `עדות{תמונה|מסמך|בעל פה}` to line 9 of sechirut.txt will be sufficient.  
The generator will emit the Dart enum and UI selectors automatically.

---

## Verification Step

- [ ] Check if "עדות" or similar concept already exists in atom-index (search-record.mjs)
- [ ] Regenerate sechirut app using `node machtzev/generator/app-ds.mjs`
- [ ] Verify Dart compiles (flutter analyze 0 errors)
- [ ] Check that byte_identical_others gate passes (no other apps broken)
