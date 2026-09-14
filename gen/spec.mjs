// gen/spec.mjs — קורא-ספק. שפת-הספק: שורות בעברית; צורת-השדה נקבעת רק מסמן מפורש:
//   שם*            חובה
//   סכום(0..N)     מספר בטווח
//   סטטוס{א|ב|ג}   ערך מנוי
//   מועד[תאריך]    תאריך
//   נייד[טלפון]    טלפון
//   אחרת           טקסט
// לוח בקרה עם מונה(ישות.שדה), סכום(ישות.שדה)
const FIELD_RE = /^(.*?)(\*)?(?:\((-?\d+)\.\.(-?\d+)\))?(?:\{([^}]*)\})?(?:\[([^\]]+)\])?(\*)?$/;

export function parseField(raw) {
  const s = raw.trim();
  const m = FIELD_RE.exec(s);
  const f = { name: (m[1] || s).trim(), required: Boolean(m[2] || m[7]), shape: 'text' };
  if (m[3] !== undefined) { f.shape = 'number'; f.min = Number(m[3]); f.max = Number(m[4]); }
  else if (m[5] !== undefined) { f.shape = 'enum'; f.values = m[5].split('|').map((v) => v.trim()).filter(Boolean); }
  else if (m[6] === 'תאריך') f.shape = 'date';
  else if (m[6] === 'טלפון') f.shape = 'phone';
  else if (m[6]) throw new Error(`סמן-צורה לא מוכר: [${m[6]}] בשדה «${f.name}»`);
  return f;
}

export function parseSpec(text) {
  const spec = { app: '', entities: [], dashboard: [], lines: [] };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    spec.lines.push(line);
    let m;
    if ((m = /^אפליקציה:\s*(.+)$/.exec(line))) spec.app = m[1].trim();
    else if ((m = /^ישות\s+(.+?)\s+עם\s+(.+)$/.exec(line))) {
      spec.entities.push({ name: m[1].trim(), fields: m[2].split(',').map(parseField) });
    } else if ((m = /^לוח בקרה עם\s+(.+)$/.exec(line))) {
      for (const part of m[1].split(',')) {
        const w = /^\s*(\S+?)\((.+?)\.(.+?)\)\s*$/.exec(part);
        if (!w) throw new Error(`פריט לוח-בקרה לא מובן: «${part.trim()}» — הצורה: פעולה(ישות.שדה)`);
        spec.dashboard.push({ op: w[1], entity: w[2].trim(), field: w[3].trim() });
      }
    } else throw new Error(`שורת-ספק לא מובנת: «${line}»`);
  }
  if (!spec.app) throw new Error('חסר: אפליקציה: <שם>');
  for (const d of spec.dashboard) {
    const e = spec.entities.find((x) => x.name === d.entity);
    if (!e) throw new Error(`לוח-בקרה מפנה לישות שאינה בספק: «${d.entity}»`);
    if (!e.fields.find((f) => f.name === d.field)) throw new Error(`לוח-בקרה מפנה לשדה שאינו בישות «${d.entity}»: «${d.field}»`);
  }
  return spec;
}
