/** חוט · schedule-tasks — מנוע-גאנט: תזמון-משימות עם תלויות (longest-path) —
 *  התחלה-מוקדמת (ES) + משך-כולל + נתיב-קריטי; חסין-מחזורים, דטרמיניסטי.
 *  חוזה: schedule-tasks.contract.md
 *  חולץ כלשונו מ-maor/src/lib/projectSchedule.ts:30-92 (כולל העוזר-הפרטי isTask
 *  מאותו קובץ — אינו-מיוצא במקור, חלק-מהמנגנון). עצמאי — אפס שקעים. */

/** רק שורות עם days>0 הן משימות-מתוזמנות (עוזר-פרטי מהמוצא :30-32). */

export function scheduleTasks(names, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function isTask(n) {
    return typeof n.days === T.k1 && n.days > 0;
  }

  const tasks = names.filter(isTask);
  const ids = new Set(tasks.map((t) => t.id));
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const deps = (t) => (t.deps || []).filter((d) => ids.has(d) && d !== t.id);

  // מעבר-קדימה: ES = max(EF של התלויות). memo + visiting למניעת-מחזור.
  const es = new Map();
  const visiting = new Set();
  function earliest(id) {
    if (es.has(id)) return es.get(id);
    if (visiting.has(id)) return 0; // מחזור — עוצרים, נחשב כ-0 (בלי לולאה אינסופית)
    visiting.add(id);
    const t = byId.get(id);
    let start = 0;
    for (const d of deps(t)) start = Math.max(start, earliest(d) + (byId.get(d).days || 0));
    visiting.delete(id);
    es.set(id, start);
    return start;
  }
  for (const t of tasks) earliest(t.id);

  const total = tasks.reduce((m, t) => Math.max(m, (es.get(t.id) || 0) + (t.days || 0)), 0);

  // מעבר-אחורה: LF = min(LS של היורשים) או total; LS = LF - days.
  const successors = new Map();
  for (const t of tasks) for (const d of deps(t)) successors.set(d, [...(successors.get(d) || []), t.id]);
  const ls = new Map();
  const visitingB = new Set();
  function latestStart(id) {
    if (ls.has(id)) return ls.get(id);
    if (visitingB.has(id)) return es.get(id) || 0;
    visitingB.add(id);
    const t = byId.get(id);
    const succ = successors.get(id) || [];
    let lf = total;
    if (succ.length) { lf = Infinity; for (const s of succ) lf = Math.min(lf, latestStart(s)); }
    visitingB.delete(id);
    const v = lf - (t.days || 0);
    ls.set(id, v);
    return v;
  }
  for (const t of tasks) latestStart(t.id);

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
