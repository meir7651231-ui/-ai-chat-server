# חוזה · חוט read-csv-file-text
**תפקיד:** קריאת קובץ-טקסט לייבוא — helper משותף לכל מסלולי-הייבוא (ילדים /
משפחות / תומכות / גיליון-מעקב, ‏P0.5): מושך את הבייטים מהקובץ
(‏file.arrayBuffer) ומעביר אותם למפענח-הקידוד. כל חוכמת-הקידוד
(‏UTF-8 / BOM של UTF-16 / windows-1255) חיה במפענח — לא כאן.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר):**
- ‏decodeCsvBuffer(buf: ArrayBuffer) ⇒ string — המפענח (במקור: השכן
  ‏decodeCsvBuffer מאותו קובץ; קיים כחוט ‏decode-csv-buffer — החיווט בקופסה).
**קלט:** ‏file (אובייקט עם ‏arrayBuffer() ⇒ ‏Promise<ArrayBuffer>) ·
‏decodeCsvBuffer. **פלט:** ‏Promise<string>.
**דוגמאות מחייבות:**
1. עדות-צנרת: קובץ מזויף ש-arrayBuffer שלו מחזיר buffer מסומן ‏B, ומפענח מזויף
   שמחזיר ‏'a,b\nc,d' ⇒ התוצאה ‏'a,b\nc,d', והמפענח נקרא **בדיוק פעם אחת** עם
   ‏B עצמו (זהות-הפניה, לא העתק).
2. קובץ שה-buffer שלו הוא הבייטים ‏[104,105] ומפענח אמיתי-מינימלי
   ‏(TextDecoder utf-8) ⇒ ‏'hi'.
3. ‏arrayBuffer שנדחה (‏reject Error('קריאה נכשלה')) ⇒ השגיאה מבעבעת החוצה —
   אין בליעה.
4. שגיאת-מפענח (המפענח זורק ‏Error('קידוד זר')) ⇒ מבעבעת החוצה.
**מוצא:** maor/src/lib/csvx.ts:64-71 (‏readCsvFileText). חולץ כלשונו; השכן
‏decodeCsvBuffer הפך לשקע (חוק-1).
