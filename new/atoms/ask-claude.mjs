/** חוט · ask-claude — קריאה ל-Claude מהדפדפן: פרומפט ⇒ טקסט או שגיאה בעברית.
 *  חוזה: ask-claude.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ai.ts:61-87 (תורגם TS→JS); שכבת-הרשת = השקע
 *  doFetch (במקור: AiFetch — "ניתנת-להזרקה בטסטים, בלי רשת אמיתית"). */
export async function askClaude(apiKey, prompt, doFetch = fetch) {
    const res = await doFetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            // הכותרת הרשמית של Anthropic לקריאות-דפדפן ישירות (מפתח-הארגון, בבחירתו)
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }],
        }),
    });
    if (!res.ok) {
        if (res.status === 401)
            throw new Error('מפתח ה-API לא תקין — בדקו בהגדרות');
        if (res.status === 429)
            throw new Error('חריגה ממכסת-השימוש — נסו בעוד רגע');
        throw new Error('הקריאה לעוזר נכשלה (' + res.status + ')');
    }
    const data = (await res.json());
    const text = (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('');
    if (!text.trim())
        throw new Error('לא התקבלה תשובה — נסו שוב');
    return text.trim();
}
