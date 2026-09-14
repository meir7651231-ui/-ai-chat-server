// gen/sentence.mjs — משפט-בעברית-רגילה ⇒ ספק. מנוע עיוור: כל מילה עברית מגיעה מ-LANG (דאטה).
// מבנה בלבד: פיצול למשפטים · ראש/זנב לפי סמן-שדות («עם», «יש», «לכל X») · רבים=ישות, יחיד=שדה ·
// צורת-שדה מרמזי-טיפוס (תאריך/מספר/טלפון) או מרשימת-ערכים בסוגריים/לוכסן ⇒ ערך-מנוי.
// מחזיר {specText, notes} — ההערות אומרות לבעלים בדיוק מה הונח, כדי שיתקן.
const HE = '֐-׿';
const words = (s) => [...String(s || '').matchAll(new RegExp(`[${HE}][${HE}'"׳״\\-]*`, 'g'))].map((m) => m[0]);
const tokens = (s) => [...String(s || '').matchAll(new RegExp(`[${HE}A-Za-z][${HE}A-Za-z0-9'"׳״\\-]*`, 'g'))].map((m) => m[0]);
// פסיקים בתוך סוגריים הם רשימת-ערכים, לא מפריד-שדות ⇒ ממוסכים לפני הפיצול ומוחזרים אחריו
const maskParens = (s) => s.replace(/\(([^)]*)\)/g, (m) => m.replace(/[,،]/g, '\u2063'));
const unmask = (s) => s.replace(/\u2063/g, ',');

export function sentenceToSpec(text, LANG) {
  const LEAD = new Set([...(LANG.leadins || []), ...((LANG.extra && LANG.extra.leadins) || [])]);
  const MARKS = LANG.fieldMarks || [], CONJ = LANG.listConj || [], EACH = [...(LANG.eachWords || []), ...((LANG.extra && LANG.extra.eachWords) || [])], INTRO = LANG.introMarks || [':'];
  const PLURAL = new RegExp('(' + (LANG.pluralSuffixes || []).join('|') + ')$');
  const hint = (f, key) => (LANG[key] || []).some((w) => words(f).includes(w));
  const content = (s) => words(s).filter((w) => w.length > 1 && !LEAD.has(w) && !MARKS.includes(w));
  const plural = (w) => PLURAL.test(w || '');
  const notes = [];
  const MARK_RE = new RegExp(`\\s+(?:${MARKS.join('|')})\\s+`);
  const ITEM_RE = new RegExp(`\\s*[,،]\\s*|\\s+(?:${CONJ.join('|')})(?=[${HE}])|\\s+(?:${CONJ.join('|')})-`);
  const EACH_RE = EACH.length ? new RegExp(`^(?:${EACH.join('|')})\\s+([${HE}][${HE}"׳״\\-]*)\\s+`) : null;
  const ENUM_RE = /\(([^)]+)\)|\[([^\]]+)\]/;

  // שדה גולמי ⇒ שדה-ספק (עם סמן-צורה)
  const toField = (raw, first) => {
    let s = raw.trim();
    let values = null;
    const em = ENUM_RE.exec(s);
    if (em) { values = (em[1] || em[2]).split(/[,،/|]/).map((v) => v.trim()).filter(Boolean); s = s.replace(ENUM_RE, '').trim(); }
    else if (/\//.test(s)) { const [head, ...rest] = s.split(/\s*[:\-]\s*/); if (rest.length) { values = rest.join(' ').split('/').map((v) => v.trim()).filter(Boolean); s = head.trim(); } }
    const name = content(s).join(' ') || s;
    if (!name) return null;
    let shape = '';
    if (values && values.length > 1) shape = `{${values.join('|')}}`;
    else if (hint(name, 'typePhone')) shape = '[טלפון]';
    else if (hint(name, 'typeDate')) shape = '[תאריך]';
    else if (hint(name, 'typePercent')) shape = '(0..100)';
    else if (hint(name, 'typeNum')) shape = '(0..1000000)';
    return name + shape + (first ? '*' : '');
  };
  const ents = [];
  const addEnt = (name, rawFields, clause) => {
    name = content(name).join(' ') || name.trim();
    if (!name || ents.some((e) => e.name === name)) return;
    const fields = rawFields.map((f, i) => toField(f, i === 0)).filter(Boolean);
    if (!fields.length) { fields.push('שם*'); notes.push(`«${name}»: לא נאמר אילו שדות — הוספתי «שם» בלבד. אפשר לכתוב: לכל ${name} יש …`); }
    ents.push({ name, fields, clause });
  };
  const splitItems = (s) => maskParens(s).split(ITEM_RE).map((x) => unmask(x).trim()).filter((x) => content(x).length);
  const DATIVE = new Set((LANG.extra && LANG.extra.dativeAfter) || []);

  const clauses = String(text || '').split(/[.;\n]+/).map((c) => c.trim()).filter((c) => words(c).length);
  let app = '';
  clauses.forEach((clause, ci) => {
    // ראש-האפליקציה: לפני סמן-פתיחה (:) או לפני סמן-שדות, במשפט הראשון
    let work = clause;
    // סמן-פתיחה (:) נחשב רק כשלפניו אין סמן-שדות ואין פסיק — אחרת הוא חלק מרשימת-ערכים («מצב: חדש/משומש»)
    const ci0 = clause.search(new RegExp(`[${INTRO.join('')}]`));
    const introOk = ci0 > 0 && !MARK_RE.test(clause.slice(0, ci0) + ' ') && !/[,،]/.test(clause.slice(0, ci0)) && !new RegExp(`\\s(?:${MARKS.join('|')})$`).test(clause.slice(0, ci0));
    const ip = introOk ? [clause.slice(0, ci0), clause.slice(ci0 + 1)] : [clause];
    const isHead = ci === 0 && ip.length === 1;
    if (ci === 0) {
      const headStr = ip.length > 1 ? ip[0] : clause.split(MARK_RE)[0];
      const hw = tokens(headStr);
      const out = [];
      for (let i = 0; i < hw.length; i++) {
        const w = hw[i];
        if (LEAD.has(w)) continue;
        // «אפליקציה לחנות» ⇒ «חנות»: קידומת-ל נופלת רק אחרי מילת-פיגום שלוקחת ל- (דאטה: dativeAfter)
        if (w.length >= 4 && w[0] === 'ל' && i > 0 && DATIVE.has(hw[i - 1])) out.push(w.slice(1)); else out.push(w);
      }
      app = out.join(' ');
    }
    if (ip.length > 1) work = ip.slice(1).join(' ');
    // «לכל X יש a, b» — X ישות עם שדות
    const em = EACH_RE ? EACH_RE.exec(work) : null;
    if (em) { const rest = work.slice(em[0].length).replace(MARK_RE, ' ').replace(new RegExp(`^(?:${MARKS.join('|')})\\s+`), ''); addEnt(em[1], splitItems(rest), clause); return; }
    const seg = work.split(MARK_RE);
    let head = seg[0], tail = seg.slice(1).join(' ');
    // «X עם Y שיש להם a, b» — סמן שני בתוך הזנב: הישות היא ראש-הזנב, השדות אחריו
    if (seg.length > 2 && !isHead) { head = seg[1]; tail = seg.slice(2).join(' '); }
    else if (seg.length > 2 && isHead) { head = seg[1]; tail = seg.slice(2).join(' '); }
    // «לרכב יש …» — ראש של מילה-אחת עם ל-הנטייה לפני סמן-מובלע ⇒ הקידומת נופלת
    if (seg.length > 1 && words(head).length === 1 && head.trim()[0] === 'ל' && head.trim().length >= 4 && !plural(head.trim())) head = head.trim().slice(1);
    const headItems = splitItems(head), tailItems = tail ? splitItems(tail) : [];
    const firstW = (s) => content(s)[0] || '';
    if (!tailItems.length) {
      if (isHead && headItems.length <= 1) return; // רק שם-אפליקציה
      headItems.forEach((h) => addEnt(h, [], clause));
      return;
    }
    const tailPlural = tailItems.filter((x) => plural(firstW(x)));
    if (tailPlural.length === tailItems.length) {
      // «X עם a-ים, b-ים» ⇒ כל פריט-רבים = ישות
      if (!isHead && headItems.length === 1 && plural(firstW(head))) addEnt(head, [], clause);
      tailItems.forEach((t) => addEnt(t, [], clause));
    } else if (tailPlural.length) {
      // מעורב: הרבים ישויות, היחידים שדות של הראש
      const headName = isHead ? (plural(firstW(head)) ? head : null) : head;
      const singles = tailItems.filter((x) => !plural(firstW(x)));
      if (headName) addEnt(headName, singles, clause);
      else singles.forEach((x) => notes.push(`«${content(x).join(' ')}»: לא הבנתי אם זו ישות או שדה (אין צורת-רבים) — התעלמתי. כתוב: «לכל ${content(x).join(' ')} יש …»`));
      tailPlural.forEach((t) => addEnt(t, [], clause));
    } else {
      // «X עם a, b, c» ⇒ X ישות עם שדות; במשפט הראשון הראש הוא שם-האפליקציה ⇒ הישות נקראת כמוהו
      const headName = isHead && seg.length === 2 ? (headItems.length > 1 ? headItems[headItems.length - 1] : app) : head;
      addEnt(headName, tailItems, clause);
    }
  });
  if (!app) app = ents[0]?.name || '';
  if (!ents.length && app) { addEnt(app, [], text); notes.push('לא זוהתה שום ישות — הפכתי את שם-האפליקציה לישות אחת. כתוב: «לכל X יש a, b, c»'); }
  const dash = [];
  for (const e of ents) for (const f of e.fields) {
    const name = f.replace(/[\[({].*$/, '').replace(/\*$/, '');
    if (/\(\d+\.\.\d+\)/.test(f)) dash.push(`סכום(${e.name}.${name})`);
    if (/\{.*\}/.test(f)) dash.push(`מונה(${e.name}.${name})`);
  }
  const lines = [`אפליקציה: ${app}`, ...ents.map((e) => `ישות ${e.name} עם ${e.fields.join(', ')}`)];
  if (dash.length) lines.push(`לוח בקרה עם ${dash.join(', ')}`);
  return { specText: lines.join('\n'), notes, app, entities: ents };
}
