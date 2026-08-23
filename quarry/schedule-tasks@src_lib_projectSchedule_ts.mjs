/** 🪨 טיוטת-חוט (דרגת-מחצבה) · scheduleTasks — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/projectSchedule.ts:38-93 (56 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): scheduleTasks, earliest, deps, latestStart
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function scheduleTasks(names) {
    const tasks = names.filter(isTask);
    const ids = new Set(tasks.map((t) => t.id));
    const byId = new Map(tasks.map((t) => [t.id, t]));
    const deps = (t) => (t.deps || []).filter((d) => ids.has(d) && d !== t.id);
    // מעבר-קדימה: ES = max(EF של התלויות). memo + visiting למניעת-מחזור.
    const es = new Map();
    const visiting = new Set();
    function earliest(id) {
        if (es.has(id))
            return es.get(id);
        if (visiting.has(id))
            return 0; // מחזור — עוצרים, נחשב כ-0 (בלי לולאה אינסופית)
        visiting.add(id);
        const t = byId.get(id);
        let start = 0;
        for (const d of deps(t))
            start = Math.max(start, earliest(d) + (byId.get(d).days || 0));
        visiting.delete(id);
        es.set(id, start);
        return start;
    }
    for (const t of tasks)
        earliest(t.id);
    const total = tasks.reduce((m, t) => Math.max(m, (es.get(t.id) || 0) + (t.days || 0)), 0);
    // מעבר-אחורה: LF = min(LS של היורשים) או total; LS = LF - days.
    const successors = new Map();
    for (const t of tasks)
        for (const d of deps(t))
            successors.set(d, [...(successors.get(d) || []), t.id]);
    const ls = new Map();
    const visitingB = new Set();
    function latestStart(id) {
        if (ls.has(id))
            return ls.get(id);
        if (visitingB.has(id))
            return es.get(id) || 0;
        visitingB.add(id);
        const t = byId.get(id);
        const succ = successors.get(id) || [];
        let lf = total;
        if (succ.length) {
            lf = Infinity;
            for (const s of succ)
                lf = Math.min(lf, latestStart(s));
        }
        visitingB.delete(id);
        const v = lf - (t.days || 0);
        ls.set(id, v);
        return v;
    }
    for (const t of tasks)
        latestStart(t.id);
    const out = tasks.map((t) => {
        const start = es.get(t.id) || 0;
        return {
            id: t.id, name: t.name, start, end: start + (t.days || 0), days: t.days || 0,
            deps: deps(t), critical: start === (ls.get(t.id) || 0),
        };
    });
    // מיון לתצוגה: לפי התחלה, ואז לפי סיום.
    out.sort((a, b) => a.start - b.start || a.end - b.end);
    return { tasks: out, total };
}
