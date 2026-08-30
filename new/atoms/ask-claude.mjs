/** חוט · ask-claude — קריאה ל-Claude מהדפדפן: פרומפט ⇒ טקסט או שגיאה בעברית.
 *  חוזה: ask-claude.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ai.ts:61-87 (תורגם TS→JS); שכבת-הרשת = השקע
 *  doFetch (במקור: AiFetch — "ניתנת-להזרקה בטסטים, בלי רשת אמיתית"). */
export async function askClaude(apiKey, prompt, doFetch = fetch, T) {
    const res = await doFetch(T.k1, {
        method: T.k2,
        headers: {
            [T.k3]: T.k4,
            [T.k5]: apiKey,
            [T.k6]: '2023-06-01',
            // הכותרת הרשמית של Anthropic לקריאות-דפדפן ישירות (מפתח-הארגון, בבחירתו)
            [T.k7]: T.k8,
        },
        body: JSON.stringify({
            model: T.k9,
            max_tokens: 600,
            messages: [{ role: T.k10, content: prompt }],
        }),
    });
    if (!res.ok) {
        if (res.status === 401)
            throw new Error(T.k11);
        if (res.status === 429)
            throw new Error(T.k12);
        throw new Error(T.k13 + res.status + ')');
    }
    const data = (await res.json());
    const text = (data.content ?? []).filter((b) => b.type === T.k14).map((b) => b.text ?? '').join('');
    if (!text.trim())
        throw new Error(T.k15);
    return text.trim();
}
