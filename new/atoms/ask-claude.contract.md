# חוזה · חוט ask-claude
**תפקיד:** קריאה בודדת ל-Claude (Anthropic Messages API) מהדפדפן — פרומפט ⇒ טקסט-
תשובה גזום, או שגיאה קריאה בעברית. אסינכרוני; שכבת-הרשת כולה עוברת דרך השקע.
**שקעים (חוק-1 — קריאת-החוץ הוזרקה כפרמטר):**
- ‏doFetch(url, init) ⇒ ‏Promise<Response-דמוי {ok, status, json()}> — חתימת-fetch.
  ברירת-מחדל: ‏fetch הגלובלי (סטנדרט-שפה — מותר). בבדיקות מוזרק זיוף, אפס רשת.
**קלט:** apiKey (מפתח-הארגון — מוזרק, לא שמור באטום · חוק-6) · prompt (string) ·
doFetch?. **פלט:** ‏Promise<string> — הטקסט הגזום; או זריקת ‏Error בעברית.
**צורת-הבקשה (מחייבת, נבדקת דרך הזיוף):** ‏POST ל-
‏https://api.anthropic.com/v1/messages · כותרות: ‏x-api-key=apiKey ·
‏anthropic-version=2023-06-01 · ‏anthropic-dangerous-direct-browser-access=true
(הכותרת הרשמית לקריאות-דפדפן ישירות) · גוף: ‏model='claude-haiku-4-5-20251001'
(כלשון-המקור) · ‏max_tokens=600 · ‏messages=[{role:'user', content:prompt}].
**דוגמאות מחייבות:**
1. תשובה תקינה ‏content=[{type:'text',text:'  שלום עולם  '}] ⇒ ‏'שלום עולם' (גזום).
2. איחוי בלוקים: ‏[{type:'thinking',text:'X'},{type:'text',text:'א'},{type:'text',text:'ב'}]
   ⇒ ‏'אב' (רק type='text' נאסף, בסדר; text חסר ⇒ '').
3. ‏status=401 ⇒ זריקה: 'מפתח ה-API לא תקין — בדקו בהגדרות'.
4. ‏status=429 ⇒ זריקה: 'חריגה ממכסת-השימוש — נסו בעוד רגע'.
5. ‏status=500 ⇒ זריקה: 'הקריאה לעוזר נכשלה (500)'.
6. ‏ok אך ‏content=[] (או טקסט-רווחים בלבד) ⇒ זריקה: 'לא התקבלה תשובה — נסו שוב'.
7. הזיוף מקבל בדיוק את צורת-הבקשה שלמעלה (url · method · headers · body).
**מוצא:** maor/src/lib/ai.ts:61-87 (‏askClaude — הרחבת 🤖 ai, מפתח מקומי-למכשיר).
חולץ כלשונו; ‏doFetch כבר היה שקע-מוזרק במקור (AiFetch — "בלי רשת אמיתית").
