/** חוט · spotlight-box — חלון-ה-spotlight של הסיור סביב מלבן-אלמנט.
 *  חוזה: spotlight-box.contract.md
 *  חולץ כלשונו מ-maor/src/lib/tour.ts:98-108 (תורגם TS→JS);
 *  גאומטריה טהורה — אפס שקעים, אפס DOM (המלבן מוזרק כנתון, חוק-1). */
export function spotlightBox(rect, vw, vh, pad , T) {
  if (pad === undefined) pad = T.k1;
    if (!rect || rect.width <= 0 || rect.height <= 0)
        return null;
    const left = Math.max(0, rect.left - pad);
    const top = Math.max(0, rect.top - pad);
    return {
        left,
        top,
        width: Math.min(vw - left, rect.width + pad * 2),
        height: Math.min(vh - top, rect.height + pad * 2),
    };
}
