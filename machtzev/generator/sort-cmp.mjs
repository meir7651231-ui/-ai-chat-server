// 🔀 sort-cmp — מחולל-משווה אחד לכל רשימה ממוינת-מהספק (L105): מספרי כשניתן, אחרת לקסיקלי; שדה-בחירה ⇒ סדר-ההכרזה; ריק ⇒ אחרון; מפתחות משורשרים; יורד ⇒ היפוך.
//   קלט: sort=[{field, desc}] · k=מחרוזת⇒קבוע · schema (ל-enumVals). פלט: גוף-למבדה של Dart `(a, b) { … return 0; }`. אפס-מילון: שמות מהספק, מילים מהדאטה.
export function sortLambda(sort, k, schema) {
  const body = (sort || []).map((o) => {
    const kc = k(o.field); const f = (schema || []).find((s) => s.label === o.field);
    const ev = f && f.enumVals && f.enumVals.length ? f.enumVals : null;
    const evList = ev ? ev.map((v) => k(v)).join(', ') : '';   // קבועים פעם אחת (בייט-חסכוני)
    const cmp = ev
      ? `final o = [${evList}]; final c = o.indexOf(x).compareTo(o.indexOf(y));`
      : `final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);`;
    return `{ final x = a[${kc}] ?? '', y = b[${kc}] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; ${cmp} if (c != 0) return ${o.desc ? '-c' : 'c'}; }`;
  }).join(' ');
  return `(a, b) { ${body} return 0; }`;
}
// פירוק 'שדה עולה, שדה2 יורד' ⇒ [{field, desc}] · F=תווית⇒שדה-בסכמה או null · words מהדאטה
export function parseSortKeys(text, F, clean, G) {
  const out = [];
  for (const key of String(text).split(/[,،]/).map((x) => x.trim()).filter(Boolean)) {
    const words = [...(G.sortDesc || []), ...(G.sortAsc || [])];
    const dm = words.length ? key.match(new RegExp('^(.+?)\\s+(' + words.join('|') + ')$')) : null;
    const lab = clean(dm ? dm[1] : key); const f = F(lab); if (!f) return { error: lab };
    out.push({ field: f.label, desc: !!(dm && (G.sortDesc || []).includes(dm[2])) });
  }
  return { sort: out };
}
