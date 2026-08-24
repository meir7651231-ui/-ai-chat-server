/** חוט · kit-progress — התקדמות ערכת-התקנה/מסירה של פרויקט (ורטיקל-הסטודיו).
 *  חוזה: kit-progress.contract.md
 *  חולץ כלשונו מ-maor/src/lib/installKit.ts:17-24 (תורגם TS→JS);
 *  אפס שקעים — נגזרת טהורה של a.kit בלבד (חוק-1). */
export function kitProgress(a) {
    const kit = a?.kit || [];
    const total = kit.length;
    const done = kit.reduce((n, k) => n + (k.done ? 1 : 0), 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, ready: total > 0 && done === total };
}
