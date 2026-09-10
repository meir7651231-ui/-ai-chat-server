# INSP-H07 — תקרה מחייבת בבטוחה

**תאריך:** 2026-09-10  
**שלב:** ג.2 + VERIFY  
**diff-scope:** `machtzev/generator/specs-ds/sechirut.txt` only  

## Audit Lenses (Protocol ח)

### task-coverage
✅ **Entity list:** ישות בטוחה מכילה שני שדות תקרה קיימים (לפי 3 חודשים, לפי שליש) + שדה תקרה מחייבת חדש. כל שלושה מחושבים כראוי.  
✅ **Particle table:** חלקיקים בעמודה 14–15 של sechirut.txt מציגים בטוחה.חורג + בטוחה.מעל התקרה; התקרה מחייבת מהווה בסיס לשניהם כטקטיקת בחירה (max).  
✅ **Hub (dashboard):** לוח בקרה בשורה 11 מונה מעל-תקרה; מקורו בחורג מול 3 חודשים שמשתמש בתקרה לפי 3 חודשים. תקרה מחייבת לא מופיעה ישירות בלוח — זו עזרת חישוב בלבד (כדי בחר max עבור comparisons).  
✅ **Report:** דוח תיק בשורה 33–42 מפרט חישוב בטוחות (שורה 38: תקרה לפי 3 חודשים, תקרה לפי שליש, חורג). תקרה מחייבת לא מופיעה ב-report רשמי — זו computed helper בלבד.

### money-numeric
✅ **Ceilings:** שני השדות הקיימים (תקרה לפי 3 חודשים, תקרה לפי שליש) הם דיות עברית (מחושב מ-שכירות × חודשים / 3). תקרה מחייבת = max(שניים אלה) → מחזיר מספר בטווח [0..1000000] (כמו מקורות).

### edge-crash
✅ **Zero ceilings:** אם שכירות=0, שני התקרות יהיו 0; max(0,0)=0 תקין.  
✅ **Unequal ceilings:** תקרה לפי 3 חודשים בדרך כלל גדולה מתקרה לפי שליש (שכירות×3 > שכירות×חודשים÷3 כשחודשים>9). max() בחרת בצדק הגדול.  
✅ **Overflow:** לא אפשרי; שני הקלטים bounded [0..1000000], max ≤ max קלט.

### state-leakage
✅ **No new state introduced:** תקרה מחייבת היא computed field בלבד, לא persisted; אין SharedPreferences, אין Riverpod provider.  
✅ **Pure calculation:** max(שתי דיות) = טהור; אפס side-effects.

### navigation
✅ **No new screens:** שדה חדש לא מוביל ל-drill / bottom-sheet / Navigator.push. פעולה שלם תעדכן ישות בטוחה → מסך קיים (תיק) רענן → particle display עובדות.

### text-parity
✅ **Hebrew field name:** "תקרה מחייבת" — טקסט מקורי לא נמצא ב-sechirut.txt עד כה (זה חדש). בחרתי מילים שחוקיות: תקרה (מהקיימים), מחייבת (= mandatory / enforced, מציין את ה-binding/max constraint).  
✅ **Verbatim check:** שני התקרות הקיימים נשארים לשונם בדיוק: "תקרה לפי 3 חודשים", "תקרה לפי שליש" ללא שינוי.

## VERDICT: **GO**

✅ כל 6 לנסים עברו.  
✅ שדה חדש בלבד, אפס מחיקה או שינוי לשדות קיימים.  
✅ משטרה: 10/10 checks pass.  
✅ compiler: 0 analyzer errors.  
✅ byte-identical_others: כל אפליקציות אחרות לא השתנו.  
