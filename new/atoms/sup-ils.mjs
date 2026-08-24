/** חוט · sup-ils — סה"כ ₪ של תומכת כולל היסטוריה (הכרעת-בעלים 9.8 "לכולל").
 *  חוזה: sup-ils.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:106-110; נגזרת טהורה —
 *  המונה-השמור ils (קבלות-בלבד) + שורות-hist שאינן c==='$'. */
export function supIls(sp) {
    return (sp.ils || 0) + (sp.hist ?? []).reduce((a, h) => a + (h.c === '$' ? 0 : h.a), 0);
}
