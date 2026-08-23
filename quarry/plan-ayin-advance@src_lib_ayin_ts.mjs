/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planAyinAdvance — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:175-225 (51 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planAyinAdvance, ayinActionVisible, featLabel, itemLabel, unitLabel, stageLabel, eyesTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planAyinAdvance(cfg, name, a) {
    if (!ayinActionVisible(a))
        return null;
    const feat = featLabel(cfg);
    const item = itemLabel(cfg);
    const unit = unitLabel(cfg);
    const st = a.stage;
    if (st === 'new') {
        return {
            patch: { stage: 'lead' },
            event: { title: `${feat}: ${stageLabel(cfg, 'lead')} — ${name} (${a.names.length} ${item})`, done: false },
            toast: `נרשמו ${a.names.length} — נכנס ללוח: ${stageLabel(cfg, 'lead')}`,
        };
    }
    if (st === 'lead') {
        return {
            patch: { stage: 'eyes' },
            event: { title: `${feat}: ${stageLabel(cfg, 'lead')} ✓ — ${name}`, done: true },
            toast: `אושר — נרשם בלוח ובדוח. עכשיו: ${stageLabel(cfg, 'eyes')}`,
        };
    }
    if (st === 'eyes') {
        const eyes = eyesTotal(a);
        return {
            patch: { stage: 'answer' },
            event: { title: `${feat}: ${stageLabel(cfg, 'answer')} — ${name} (${eyes} ${unit})`, done: false },
            toast: `נרשם — נכנס ללוח: ${stageLabel(cfg, 'answer')}`,
        };
    }
    // st === 'answer'
    if (!a.answerPushed) {
        return {
            patch: { answerPushed: true },
            event: { title: `${feat}: ${stageLabel(cfg, 'answer')} — ${name}`, done: false },
            toast: 'נמסר — נרשם בלוח היומי ובכרטיס',
        };
    }
    return {
        patch: { stage: 'done' },
        event: { title: `${feat}: ${stageLabel(cfg, 'done')} — ${name}`, done: true },
        toast: 'הטיפול הושלם ✓ — נרשם בלוח',
    };
}
/**
 * הוספת פריט לתיק — טהור. dedup לפי שם מנורמל. מחזיר תיק חדש + אולי רשומת log,
 * או שגיאה (השם ריק / כבר קיים).
 */
