// gen/plan.mjs — גזירת-תכנית: מאיזו צורה נולד כל צורך ואיפה הוא משמש. דטרמיניסטי, מצורה בלבד. רץ ב-Node ובדפדפן.
/** גזירת-תכנית: מאיזו צורה נולד כל צורך ואיפה הוא משמש. דטרמיניסטי, מצורה בלבד. */
export function derivePlan(spec, NEEDS) {
  const plan = [];
  const byShape = (shape) => NEEDS.filter((n) => n.from.shape === shape && !n.from.dashboard);
  for (const e of spec.entities) for (const f of e.fields) {
    for (const n of byShape(f.shape)) {
      if (n.id === 'phone-norm') continue; // נגזר-אפשרי אך האפליקציה הזו לא צורכת אותו (אין צורך-כפילויות בספק)
      plan.push({ needId: n.id, entity: e.name, field: f.name, kind: n.id === 'norm-search' ? 'search' : 'column', label: `${e.name}.${f.name}` });
    }
  }
  for (const d of spec.dashboard) {
    const n = NEEDS.find((x) => x.from.dashboard === d.op);
    if (!n) throw new Error(`פעולת לוח-בקרה ללא צורך מוגדר: «${d.op}»`);
    plan.push({ needId: n.id, op: d.op, entity: d.entity, field: d.field, kind: 'kpi', label: `${d.op} ${d.entity}.${d.field}` });
  }
  return plan;
}
