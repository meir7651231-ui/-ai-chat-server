/** 🪨 טיוטת-חוט (דרגת-מחצבה) · askClaude — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ai.ts:61-87 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): askClaude, doFetch, json
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
