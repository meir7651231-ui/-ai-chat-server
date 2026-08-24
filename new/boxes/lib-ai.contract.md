# חוזה · קופסת-חיבורים "עוזר-AI" (lib-ai)
**תפקיד:** קופסת הרחבת 🤖 `ai` ("עד-המפתח") — כל מה שהיה מולחם ב-`maor/src/lib/ai.ts`
מחווט כאן במקום אחד: כספת-מפתח-מקומית (קריאה/כתיבה) · בונה-פרומפט-תודה · קריאה ל-Claude.
**מוצא (מקור-האמת, L4):** `maor/src/lib/ai.ts` — כלשונו, החוזה מתכופף למקור.

## שקעי-IO (חוק-1/חוק-6 — קריאת-החוץ הוזרקה כפרמטר, לא ממומשת בקופסה)
- `nsLsKey(base) ⇒ string` — עוטף בסיס-מפתח למרחב-הארגון (default ⇒ הבסיס עצמו).
- `storage` — דמוי-localStorage: `getItem(k) ⇒ string|null` · `setItem(k,v)` · `removeItem(k)`.
- `doFetch(url, init) ⇒ Promise<Response-דמוי {ok, status, json()}>` — חתימת-fetch;
  ברירת-מחדל: `fetch` הגלובלי (סטנדרט-שפה). בבדיקות מוזרק זיוף, אפס רשת.

## הכרעות-החיווט (חיות בקופסה)
- `KEY_BASE = 'maor_ai_key'` — בסיס-מפתח-הכספת (מקומי-למכשיר בלבד). המקור: `ai.ts:13`.

## החשיפה
### `readAiKey(nsLsKey, storage) ⇒ string`  · המקור: `ai.ts:15-21`
המפתח השמור בתחום, או `''`. `storage` שזורק ⇒ `''` בשקט.
- דוגמה א׳: `storage={maor_ai_key:'sk-abc'}`, `nsLsKey=id` ⇒ `'sk-abc'`.
- דוגמה ב׳: מפתח חסר ⇒ `''`. `storage.getItem` שזורק ⇒ `''`.
- דוגמה ג׳: `nsLsKey=b=>b+':org1'`, `storage={ 'maor_ai_key:org1':'sk-x' }` ⇒ `'sk-x'`.

### `writeAiKey(nsLsKey, storage, key)` (void) · המקור: `ai.ts:23-31`
גוזם; ריק-אחרי-גזימה ⇒ `removeItem`; אחרת `setItem`. `storage` חסום ⇒ נבלע.
- דוגמה א׳: `key='  sk-abc  '` ⇒ `setItem('maor_ai_key','sk-abc')` (גזום).
- דוגמה ב׳: `key='   '` (רק רווחים) ⇒ `removeItem('maor_ai_key')` (בלי setItem).
- דוגמה ג׳: `key=''` ⇒ `removeItem`. `nsLsKey=b=>b+':org1'` ⇒ המפתח `'maor_ai_key:org1'`.

### `thanksPrompt(inp) ⇒ string` · המקור: `ai.ts:46-55` (כלשונו מהחוט)
- מינימלי `{orgName:'מאור', supporterName:'דנה', lastAmount:'₪500'}` ⇒ 4 שורות.
- `orgName:''` ⇒ שורה-1 מסתיימת ב-`'מארגון "הארגון"'`.
- מלא (designation+totalSoFar) ⇒ 6 שורות; שורה-3 `'התרומה יועדה ל: <ייעוד>.'`.

### `askClaude(apiKey, prompt, doFetch=fetch) ⇒ Promise<string>` · המקור: `ai.ts:61-86`
POST ל-`https://api.anthropic.com/v1/messages` · כותרות `x-api-key`/`anthropic-version=2023-06-01`/
`anthropic-dangerous-direct-browser-access=true` · גוף `model='claude-haiku-4-5-20251001'`,
`max_tokens=600`, `messages=[{role:'user',content:prompt}]`.
- `content=[{type:'text',text:'  שלום  '}]` ⇒ `'שלום'` (גזום).
- `status=401` ⇒ זריקה `'מפתח ה-API לא תקין — בדקו בהגדרות'`; `429` ⇒ `'חריגה ממכסת-השימוש — נסו בעוד רגע'`;
  `500` ⇒ `'הקריאה לעוזר נכשלה (500)'`; `ok` אך טקסט-ריק ⇒ `'לא התקבלה תשובה — נסו שוב'`.

## מגן-הכרעה
הבדיקה קוראת את מקור-הקופסה ב-fs ומאשרת `KEY_BASE='maor_ai_key'` verbatim +
שהקופסה מייבאת אך-ורק אטומים (thanks-prompt, ask-claude), אפס ייבוא-קופסה.
