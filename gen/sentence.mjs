// gen/sentence.mjs — משפט-בעברית-רגילה ⇒ ספק. מנוע עיוור: כל מילה עברית מגיעה מ-LANG (דאטה).
// מבנה בלבד: פיצול למשפטים · ראש/זנב לפי סמן-שדות («עם», «יש», «לכל X») · רבים=ישות, יחיד=שדה ·
// צורת-שדה מרמזי-טיפוס (תאריך/מספר/טלפון) או מרשימת-ערכים בסוגריים/לוכסן ⇒ ערך-מנוי.
// מחזיר {specText, notes} — ההערות אומרות לבעלים בדיוק מה הונח, כדי שיתקן.
const HE = '֐-׿';
const words = (s) => [...String(s || '').matchAll(new RegExp(`[${HE}][${HE}'"׳״\\-]*`, 'g'))].map((m) => m[0]);
const tokens = (s) => [...String(s || '').matchAll(new RegExp(`[${HE}A-Za-z0-9][${HE}A-Za-z0-9'"׳״\\-]*`, 'g'))].map((m) => m[0]);
// פסיקים בתוך סוגריים הם רשימת-ערכים, לא מפריד-שדות ⇒ ממוסכים לפני הפיצול ומוחזרים אחריו
const maskParens = (s) => s.replace(/\(([^)]*)\)/g, (m) => m.replace(/[,،]/g, '\u2063'));
const unmask = (s) => s.replace(/\u2063/g, ',');

export function sentenceToSpec(text, LANG) {
  const LEAD = new Set([...(LANG.leadins || []), ...((LANG.extra && LANG.extra.leadins) || [])]);
  const MARKS = LANG.fieldMarks || [], CONJ = LANG.listConj || [], EACH = [...(LANG.eachWords || []), ...((LANG.extra && LANG.extra.eachWords) || [])], INTRO = LANG.introMarks || [':'];
  const PLURAL = new RegExp('(' + (LANG.pluralSuffixes || []).join('|') + ')$');
  const hint = (f, key) => (LANG[key] || []).some((w) => words(f).includes(w));
  const content = (s) => words(s).filter((w) => w.length > 1 && !LEAD.has(w) && !MARKS.includes(w));
  const SINGULAR = new Set((LANG.extra && LANG.extra.singular) || []);
  const plural = (w) => PLURAL.test(w || '') && !SINGULAR.has(w);
  const notes = [];
  const MARK_RE = new RegExp(`\\s+(?:${MARKS.join('|')})\\s+`);
  const ITEM_RE = new RegExp(`\\s*[,،]\\s*|\\s+(?:${CONJ.join('|')})(?=[${HE}])|\\s+(?:${CONJ.join('|')})-`);
  const IMPLIED = [...new Set([LANG.impliedMark, ...MARKS].filter(Boolean))];
  const EACH_RE = EACH.length ? new RegExp(`^(?:${EACH.join('|')})\\s+([${HE}][${HE}"׳״\\-]*(?:\\s+[${HE}][${HE}"׳״\\-]*){0,3}?)\\s+(?:${IMPLIED.join('|')})\\s+`) : null;
  const ENUM_RE = /\(([^)]+)\)|\[([^\]]+)\]/;

  // שדה גולמי ⇒ שדה-ספק (עם סמן-צורה)
  const toField = (raw, first) => {
    let s = raw.trim();
    let values = null;
    const em = ENUM_RE.exec(s);
    if (em) { values = (em[1] || em[2]).split(/[,،/|]/).map((v) => v.trim()).filter(Boolean); s = s.replace(ENUM_RE, '').trim(); }
    else if (/\//.test(s)) { const [head, ...rest] = s.split(/\s*[:\-]\s*/); if (rest.length) { values = rest.join(' ').split('/').map((v) => v.trim()).filter(Boolean); s = head.trim(); } }
    // «יתרה = סכום פחות הנחה» — נוסחה: מילות-החשבון מהדאטה ⇒ סימנים
    const FW = (LANG.extra && LANG.extra.formulaWords) || {};
    const eqi = s.indexOf('=');
    if (eqi > 0) {
      const lhs = content(s.slice(0, eqi)).join(' ');
      let rhs = s.slice(eqi + 1).trim();
      for (const [w, op] of Object.entries(FW)) rhs = rhs.replace(new RegExp(`\\s${w}\\s`, 'g'), op);
      return lhs + '=' + rhs.replace(/\s+/g, '') + (first ? '*' : '');
    }
    const name = tokens(s).filter((w) => (w.length > 1 && !LEAD.has(w) && !MARKS.includes(w)) || /^\d+$/.test(w)).join(' ') || s;
    if (!name) return null;
    const IDW = (LANG.extra && LANG.extra.idWords) || [];
    let shape = '';
    if (!values && IDW.some((w) => name === w || name.startsWith(w + ' '))) return name + '[מזהה]' + (first ? '*' : '');
    if (values && (values.length > 1 || (values.length === 1 && /\d/.test(values[0])))) shape = `{${values.join('|')}}`;
    else if (hint(name, 'typePhone')) shape = '[טלפון]';
    else if (hint(name, 'typeDate')) shape = '[תאריך]';
    else if (((LANG.extra && LANG.extra.countWords) || []).some((w) => name === w || name.split(' ').includes(w))) shape = '[כמות]';
    else if (hint(name, 'typePercent')) shape = '(0..100)';
    else if (hint(name, 'typeNum') || ((LANG.extra && LANG.extra.numWords) || []).some((w) => name === w || name.split(' ').includes(w))) shape = '(0..1000000)';
    return name + shape + (first ? '*' : '');
  };
  const ents = [];
  const addEnt = (name, rawFields, clause) => {
    name = content(name).join(' ') || name.trim();
    if (!name) return;
    const existing = ents.find((e) => e.name === name);
    if (existing) {   // «לכל X יש גם …» — אותה ישות שוב = הרחבה: שדות חדשים מצטרפים, קיימים לא משתכפלים
      for (const f of rawFields.map((f) => toField(f, false)).filter(Boolean)) { const key = f.replace(/[\[({*].*$/, ''); if (!existing.fields.some((g) => g.replace(/[\[({*].*$/, '') === key)) existing.fields.push(f); }
      return;
    }
    const fields = rawFields.map((f, i) => toField(f, i === 0)).filter(Boolean);
    if (!fields.length) { fields.push('שם*'); notes.push(`«${name}»: לא נאמר אילו שדות — הוספתי «שם» בלבד. אפשר לכתוב: לכל ${name} יש …`); }
    ents.push({ name, fields, clause });
  };
  const splitItems = (s) => maskParens(s).split(ITEM_RE).map((x) => unmask(x).trim()).filter((x) => content(x).length);
  const DATIVE = new Set((LANG.extra && LANG.extra.dativeAfter) || []);
  const STAGE_WORDS = [...new Set([...(LANG.stagePrefixes || []), ...(LANG.sectionMarkers || []).slice(0, 1)])].filter(Boolean);
  const STAGE_RE = STAGE_WORDS.length ? new RegExp(`(?:^|[\\s,;(])(?:${STAGE_WORDS.join('|')})\\s*[:\\-]?\\s*([^;.)]+)`) : null;

  const clauses = String(text || '').split(/[.;\n]+/).map((c) => c.trim()).filter((c) => words(c).length);
  let app = '';
  const GP = (LANG.extra && LANG.extra.guardPhrases) || [], GO = (LANG.extra && LANG.extra.guardOnly) || [], RS = (LANG.extra && LANG.extra.roleSee) || [];
  const roles = [];
  clauses.forEach((clause, ci) => {
    // «אפשר לעבור ל-X רק אם Y» — מעבר מותנה של הישות האחרונה
    const gm = GP.length && GO.length ? new RegExp(`^(?:${GP.join('|')})-?\\s*([^,]+?)\\s+(?:${GO.join('|')})\\s+(.+)$`).exec(clause) : null;
    if (gm) { const e = ents[ents.length - 1]; if (e) { (e.guards ||= []).push({ stage: gm[1].trim(), cond: gm[2].trim() }); } else notes.push(`«${clause}»: מעבר לפני כל ישות — התעלמתי`); return; }
    // «אסור למחוק X» · «אסור לשנות סכום ב-X» · «ב-X אסור: א, ב» — איסורים על ישות
    const FV = (LANG.extra && LANG.extra.forbidVerbs) || {};
    const fb = /^(?:ב-?)?(.+?)\s+אסור\s*:\s*(.+)$/.exec(clause) || (Object.keys(FV).length ? new RegExp(`^אסור\\s+(${Object.keys(FV).join('|')})\\s+(.+?)(?:\\s+ב-?(.+))?$`).exec(clause) : null);
    if (fb) {
      let entName, items;
      if (fb[0].startsWith('אסור')) { const verb = fb[1], obj = fb[2], ent = fb[3]; const noun = FV[verb]; entName = ent ? ent.trim() : (verb === 'למחוק' ? obj.trim() : null); items = [verb === 'למחוק' ? noun : noun + ' ' + obj.trim()]; }
      else { entName = fb[1].trim(); items = fb[2].split(/[,،]/).map((x) => x.trim()).filter(Boolean); }
      const e = entName ? ents.find((x) => x.name === entName) : ents[ents.length - 1];
      if (e) { (e.forbidden ||= []).push(...items); } else notes.push(`«${clause}»: איסור על ישות שלא הוזכרה («${entName}») — התעלמתי`);
      return;
    }
    // «תיקון ב-X: גזבר עד 30 ימים» / «ב-X מתקן גזבר עד 30 ימים» — מדיניות-תיקון (בדיעבד)
    const fxm = /^תיקון\s+ב-?(.+?)\s*:\s*(.+?)(?:\s+עד\s+(\d+)\s*ימים?)?$/.exec(clause) || /^ב-?(.+?)\s+מתקנ(?:ת|ים)?\s+(.+?)(?:\s+עד\s+(\d+)\s*ימים?)?$/.exec(clause);
    if (fxm) { const e = ents.find((x) => x.name === fxm[1].trim()); if (e) e.fix = { who: fxm[2].trim(), days: fxm[3] ? Number(fxm[3]) : null }; else notes.push(`«${clause}»: תיקון לישות שלא הוזכרה — התעלמתי`); return; }
    // «הרגע של X: …» — מה מדליק את הישות · «X במסך של Y» — באיזה מסך-תפקיד
    const mo = /^הרגע\s+של\s+(.+?)\s*:\s*(.+)$/.exec(clause);
    if (mo) { const e = ents.find((x) => x.name === mo[1].trim()); if (e) e.moment = mo[2].trim(); else notes.push(`«${clause}»: הרגע לישות שלא הוזכרה — התעלמתי`); return; }
    const sc = /^(.+?)\s+במסך\s+של\s+(.+)$/.exec(clause);
    if (sc) { const e = ents.find((x) => x.name === sc[1].trim()); if (e) (e.screens ||= []).push(...sc[2].split(/[,،]/).map((x) => x.trim()).filter(Boolean)); else notes.push(`«${clause}»: מסך לישות שלא הוזכרה — התעלמתי`); return; }
    // «רק X רואה Y, Z» / «תפקיד X: Y, Z» — הרשאה
    const rm = RS.length ? new RegExp(`^רק\\s+(.+?)\\s+(?:${RS.join('|')})\\s+(.+)$`).exec(clause) : null;
    const rm2 = /^תפקיד\s+(.+?)\s*:\s*(.+)$/.exec(clause);
    if (rm || rm2) { const m = rm || rm2; roles.push({ name: m[1].trim(), ents: m[2].split(/[,،]|\s+ו(?=[\u0590-\u05FF])/).map((x) => x.trim()).filter(Boolean) }); return; }
    // «שלבים: א, ב, ג» — שלבי הישות האחרונה שהוזכרה (או של הישות במשפט הזה)
    const sm = STAGE_RE ? STAGE_RE.exec(clause) : null;
    if (sm) {
      const stages = sm[1].split(/[,،]|\s+(?:${CONJ.join('|')})(?=[${HE}])/).map((x) => content(x).join(' ')).filter(Boolean);
      const before = clause.slice(0, sm.index).trim();
      clause = before;
      const target = () => ents[ents.length - 1];
      if (!words(before).length) { if (target()) target().stages = stages; else notes.push(`«שלבים» לפני כל ישות — לא ידעתי למי הם שייכים; כתוב אותם אחרי הישות`); return; }
      // ממשיכים לפרש את מה שלפני «שלבים», ואז מצמידים לישות שנוצרה
      const n0 = ents.length;
      parseClause(clause, ci);
      const e = ents.length > n0 ? ents[ents.length - 1] : target();
      if (e) e.stages = stages; else notes.push(`«שלבים» בלי ישות — התעלמתי`);
      return;
    }
    parseClause(clause, ci);
  });
  function parseClause(clause, ci) {
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
    if (em) { const rest = work.slice(em[0].length); addEnt(em[1], splitItems(rest), clause); return; }
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
  }
  if (!app) app = ents[0]?.name || '';
  if (!ents.length && app) { addEnt(app, [], text); notes.push('לא זוהתה שום ישות — הפכתי את שם-האפליקציה לישות אחת. כתוב: «לכל X יש a, b, c»'); }
  const dash = [];
  for (const e of ents) for (const f of e.fields) {
    const name = f.replace(/[\[({=].*$/, '').replace(/\*$/, '');
    if (/\(\d+\.\.\d+\)/.test(f) || /=/.test(f)) dash.push(`סכום(${e.name}.${name})`);
    if (/\{.*\}/.test(f)) dash.push(`מונה(${e.name}.${name})`);
  }
  const lines = [`אפליקציה: ${app}`, ...ents.map((e) => `ישות ${e.name} עם ${e.fields.join(', ')}${e.stages && e.stages.length ? ` | שלבים: ${e.stages.join(', ')}` : ''}${e.guards && e.guards.length ? ` | מעברים: ${e.guards.map((g) => g.stage + ': ' + g.cond).join(', ')}` : ''}${e.forbidden && e.forbidden.length ? ` | אסור: ${e.forbidden.join(', ')}` : ''}${e.moment ? ` | הרגע: ${e.moment}` : ''}${e.screens && e.screens.length ? ` | מסך: ${e.screens.join(', ')}` : ''}${e.fix ? ` | תיקון: ${e.fix.who}${e.fix.days ? ' עד ' + e.fix.days + ' ימים' : ''}` : ''}`), ...roles.map((r) => `תפקיד ${r.name}: ${r.ents.join(', ')}`)];
  if (dash.length) lines.push(`לוח בקרה עם ${dash.join(', ')}`);
  return { specText: lines.join('\n'), notes, app, entities: ents };
}
