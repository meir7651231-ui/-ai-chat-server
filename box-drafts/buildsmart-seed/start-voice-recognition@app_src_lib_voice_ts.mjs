/** 🪨 טיוטת-חוט (דרגת-מחצבה) · startVoiceRecognition — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/voice.ts:40-76 (37 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): startVoiceRecognition, getCtor, onError, onEnd, onTranscript, start, stop
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function startVoiceRecognition(h) {
    const Ctor = getCtor();
    if (!Ctor) {
        h.onError('הדפדפן הזה לא תומך בחיפוש קולי');
        h.onEnd();
        return null;
    }
    const rec = new Ctor();
    rec.lang = 'he-IL';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
        let text = '';
        let isFinal = false;
        for (let i = 0; i < e.results.length; i++) {
            const r = e.results[i];
            text += r[0].transcript;
            if (r.isFinal)
                isFinal = true;
        }
        h.onTranscript(text.trim(), isFinal);
    };
    rec.onerror = (e) => {
        h.onError(e?.error ?? 'שגיאה');
    };
    rec.onend = () => h.onEnd();
    try {
        rec.start();
    }
    catch (err) {
        h.onError(err instanceof Error ? err.message : String(err));
        h.onEnd();
        return null;
    }
    return { stop: () => rec.stop() };
}
