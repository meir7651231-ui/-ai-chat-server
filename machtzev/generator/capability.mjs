// capability.mjs — שכבת כוונה⇒הרכבה (§23): קורא מבנה-משפט-צורך ⇒ פירוק לפעולות + בחירת-אטומים.
// אפס-מילון-דומייני: ה"מילון" היחיד = דקדוק-יחסי (אופרטורים) + מרקרי-תנאי מבניים. האטומים
// נבחרים דרך match (מטרות-אטומים · נלמד מ-254 מסכים), לא מיפוי-קשיח. עיוור-דומיין.
import { retrieve } from './match.mjs';
import { selectAtom } from './render-ds.mjs';
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const ATOM_INDEX = JSON.parse(fs.readFileSync((R.GEN_DIR + 'atom-index.json'), 'utf8'));
const fileOf = (cls) => { const a = ATOM_INDEX.find((e) => e.cls === cls); return a ? a.file : null; };

// דקדוק-יחסי — קבוצה סגורה של אופרטורי-השוואה (כמו >,< במתמטיקה). לא דומיין. \S* סופג נטיית-מין/מספר.
// דפוסים בצורה מנוטרלת-סופיות (definalize) — סופג ך/כ · ם/מ · נטיית-מין/מספר.
// מהדאטה (knowledge/conditions.json · הכרעת-בעלים 23.9): מילות-התנאי · דקדוק-היחסים · מחברי-הריבוי — אפס עברית בקוד
const COND = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'knowledge/conditions.json'), 'utf8'));
const REL = COND.rel.map((r) => ({ re: new RegExp(r.pattern), op: r.op }));
// 🎓 יחסים נלמדים (yeshiva/ein · learnForms · הכרעת-בעלים 24.9): צורה שלא בנויה מ-< > = נלמדה מסימון-דוגמאות כאטום-השוואה מאומת («מתחיל ב» ⇒ startsWithStr).
//    הזיכרון מקומי (MAVIN_FORMS · .maimatai/forms.learned.jsonl, כמו יומן-התשובות); op = «@<אטום>», והקובץ ב-REL_FILE. נטענים לפני הדקדוק הסגור (ספציפיים יותר).
export const REL_FILE = {};
export function addLearnedRel(e) { if (!e || e.kind !== 'atom' || !e.pattern || !e.atom) return; if (REL.some((r) => r.op === '@' + e.atom && r.re.source === e.pattern)) return; REL.unshift({ re: new RegExp(e.pattern), op: '@' + e.atom }); REL_FILE['@' + e.atom] = e.file; }
{ const f = process.env.MAVIN_FORMS || path.join(R.ROOT, '.maimatai', 'forms.learned.jsonl'); try { if (fs.existsSync(f)) for (const l of fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)) addLearnedRel(JSON.parse(l)); } catch {} }
const escRe = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const AND_RE = new RegExp('\\s+(?:' + COND.and.map(escRe).join('|') + ')\\s+');
const OR_RE = new RegExp('\\s+(?:' + (COND.or || []).map(escRe).join('|') + ')\\s+');
const CONN_RE = new RegExp('(\\s+(?:' + [...COND.and, ...(COND.or || [])].map(escRe).join('|') + ')\\s+)');   // פיצול עם המחבר (כדי לדעת אם ההמשך הוא «וגם» או «או»)
const SEP_RE = new RegExp(COND.sep.map(escRe).join('|'));
/** אופרטור-השוואה של רצף-מילים לפי דקדוק-היחסים הסגור (אותו REL) — כדי שהדלת תזהה תנאי לפי צורה (מילת-יחס + מספר) גם בלי מרקר-WHEN. */
export const relOpOf = (words) => { const t = definalize([].concat(words).join(' ')); for (const r of REL) if (r.re.test(t)) return r.op; return null; };
const definalize = (s) => String(s).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');
// מרקרי-תנאי מבניים (כמו 'עם' מפריד-שדות) — סגור. בלי \b (ASCII-בלבד, לא נדלק על עברית).
const WHEN = new RegExp('(' + COND.when.map(escRe).join('|') + ')');
const hw = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
// קילוף-קידומת חד-אותית (ה/ו/ש/כ/ל/ב/מ) לצורך התאמת-שדה — רק אם המילה נשארת ≥2 אותיות.
// קילוף-קידומת שמרני: "מה..." (מן-ה) ⇒ קלף 2 · "ה..." (יידוע) ⇒ קלף 1. לעולם לא מ' בודדת
// (שורש: מעבד/מלאי/מחיר) ⇒ מונע over-strip. עיוור-דומיין, מבני.
const deprefix = (w) => { const s = String(w); if (/^מה../.test(s)) return s.slice(2); if (/^ה./.test(s) && s.length > 2) return s.slice(1); return s; };
// שם-הערך = צירוף-השם המלא של סעיף-הערך (לא מילה בודדת) — כך סמיכות/שייכות נשמרות נכון:
// "עומס המעבד"·"יתרת החשבון"·"לחות הקרקע"·"דופק של המטופל". קילוף-יידוע על המילה הראשונה בלבד.
const cleanPhrase = (words) => words.length ? [deprefix(words[0]), ...words.slice(1)].join(' ') : '';

// גלאי סעיף-התראה-מותנית: "<trigger> ... כש <X> <REL> <Y>". מבני בלבד.
// מחזיר {trigger, xWords, op, yWords} או null. אינו יודע מה X/Y — רק צורתם.
const SL_T = JSON.parse(fs.readFileSync((R.GEN_DIR + 'spec-lang.data.json'), 'utf8')); const TIME_UNITS = SL_T.timeUnits || {}; const TIME_ASK = new Set(SL_T.timeUnitsAsk || []);   // «חודש» = שאלה, לא 30
// ═══ form: condition (num · age · eq) = WHEN ⊕ REL ⊕ detectAlertClause
export function detectAlertClause(text) {
  const t = String(text || '');
  const wm = t.match(WHEN);
  if (!wm) return null;
  const before = t.slice(0, wm.index);          // ראש-הסעיף — כוונת-התצוגה (יתורגם ע"י match)
  let after = t.slice(wm.index + wm[0].length); // תנאי — X REL Y
  // התאמת-יחס על טקסט מנוטרל-סופיות (אורך זהה ⇒ אינדקסים תואמים ל-after המקורי).
  // חלון-זמן («ב-10 הדקות האחרונות», הכרעת-בעלים 24.9): מספר + יחידת-דקות + מילת-אחרון (spec-lang) ⇒ window בדקות; הביטוי יוצא מהסעיף לפני היחס
  let window = null; { const WW = (SL_T.windowWords || []).map(escRe).join('|'), MU = SL_T.minuteUnits || {};
    if (WW) { const wm = after.match(new RegExp('\\s*[֐-׿]?-?(\\d+(?:\\.\\d+)?)\\s+(\\S+)\\s+(?:' + WW + ')')); if (wm && MU[wm[2]]) { window = +wm[1] * MU[wm[2]]; after = after.slice(0, wm.index) + after.slice(wm.index + wm[0].length); } } }
  // אופק-חיזוי («בעוד 30 דקות»): מילת-אופק + מספר + יחידת-דקות ⇒ horizon בדקות; יוצא מהסעיף
  let horizon = null; { const HW = (SL_T.horizonWords || []).map(escRe).join('|'), MU = SL_T.minuteUnits || {};
    if (HW) { const hm = after.match(new RegExp('\\s*(?:' + HW + ')\\s+(\\d+(?:\\.\\d+)?)\\s+(\\S+)')); if (hm && MU[hm[2]]) { horizon = +hm[1] * MU[hm[2]]; after = after.slice(0, hm.index) + after.slice(hm.index + hm[0].length); } } }
  const afterN = definalize(after);
  let rel = null, relM = null;
  for (const r of REL) { const m = afterN.match(r.re); if (m) { rel = r; relM = m; break; } }
  if (!rel) return null;
  const xPart = after.slice(0, relM.index);
  const yPart = after.slice(relM.index + relM[0].length);
  const xWords = [...String(xPart).matchAll(/[֐-׿][֐-׿״׳]*|[A-Za-z][A-Za-z0-9_]*/g)].map((m) => m[0]), yWords = hw(yPart); /* שם-השדה: גם מזהה לועזי («stay clock» — מסמך חצי-אנגלי); עברית-בלבד ⇒ כמו hw */ const yNum = (yPart.match(/\d+(?:\.\d+)?/) || [null])[0];
  if (!xWords.length || (!yWords.length && yNum == null)) return null;   // «מעל 1» — מספר בלי מילה אחריו הוא סף כשר
  return {
    ...(window ? { window } : {}), ...(horizon != null ? { horizon } : {}),
    trigger: hw(before).slice(-2).join(' '),      // 2 המילים לפני 'כש' = אות-הכוונה (בלי שם-הערך)
    x: cleanPhrase(xWords),                        // שדה-הערך = צירוף-השם המלא (סמיכות נשמרת)
    op: rel.op,
    y: yWords.length ? deprefix(yWords[0]) : yNum,   // שדה-הסף (המילה הצמודה לתנאי) או המספר עצמו
    n: (yPart.match(/\d+(?:\.\d+)?/) || [null])[0] ?? (yWords.length && (TIME_UNITS[deprefix(yWords[0])] || TIME_ASK.has(deprefix(yWords[0]))) ? '1' : null),   // המספר של הבעלים אחרי היחס (כשיש) — סף-ההתראה; יחידת-זמן בלי מספר = 1; אין ⇒ null
    unit: (() => { const m = yPart.match(/\d+(?:\.\d+)?\s*([֐-׿]+)/); const w = m ? deprefix(m[1]) : (yWords.length ? deprefix(yWords[0]) : ''); return TIME_UNITS[w] || (TIME_ASK.has(w) ? 'ask' : null); })(),
    unitWord: (() => { const m = yPart.match(/\d+(?:\.\d+)?\s*([֐-׿]+)/); const w = m ? deprefix(m[1]) : (yWords.length ? deprefix(yWords[0]) : ''); return TIME_UNITS[w] || TIME_ASK.has(w) ? w : null; })(),   // «מעל 7 ימים» / «מעל שבוע» ⇒ ימים ליחידה (spec-lang.timeUnits — דאטה)
  };
}

// בחירת אטום-תצוגה לכוונה — דרך match (מטרת-אטום), לא מיפוי. מחזיר cls או null.
// 🕯️ ורמינהו לפני ה-null: הראשון-בדירוג ⇒ חד שיעורא · השאר ⇒ פליגא עם הציון · אפס ⇒ «לא מצינו».
export function pickAtom(phrase) {
  const r = retrieve(phrase, 3) || [];
  const p = rminhu({ engine: 'capability.pickAtom', matter: `אות-כוונה «${String(phrase).slice(0, 50)}»`,
    searched: ['match.retrieve מעל atlas.widgets (מטרות-אטומים מאינדקס-המסכים)'],
    rulings: r.map((c, i) => (i === 0
      ? had(c.cls, `ציון ${c.s} · כיסוי ${c.cover} — הגבוה בדירוג`)
      : pliga(c.cls, `ציון ${c.s} מול ${r[0].s} של ${r[0].cls} — אותו מנגנון-חפיפה, ציון נמוך, הגבוה גובר`))) });
  return p.hit ? r[0].cls : null;
}

const NUM_RE = /^(value|val|pct|level|amount|reading|num|score|percent)$/;
const NUME = () => NUM_RE.source;
const STR_RE = /^(label|title|caption|name|text|msg|message)$/;

// רב-סעיפים: פיצול לפי מחברי-ריבוי **דקדוקיים** (וגם/גם/;/שורה) ⇒ סעיף-תנאי בכל מקטע. כך "A וגם B"
// = 2 מסגרות (יכולת-ההתראה מופעלת פעמיים). מחברים = חלקיקים מבניים (כמו של/עם), אפס-מילון-דומייני.
/** צורת-מדרגות (הכרעת-בעלים 23.9 «צא לדרך»): ראש «<תווית> לפי <שדה>» + זנב «<n>, <n>» (שני קטעים, כי הדלת מפצלת על נקודתיים). מבני בלבד. */
// ═══ form: levels = levels.head ⊕ levels.tail
export function detectLevelsClause(head, tail) {
  if (!COND.levels) return null;
  const hm = String(head || '').trim().match(new RegExp(COND.levels.head)), tm = String(tail || '').trim().match(new RegExp(COND.levels.tail));
  if (!hm || !tm) return null;
  const thresholds = [...new Set(tm[1].split(',').map((v) => +v.trim()).filter((v) => !isNaN(v)))].sort((a, b) => b - a);   // N ספים, מהגבוה לנמוך; מדרגה = כמה ספים הערך עובר
  if (thresholds.length < 2) return null;
  return { kind: 'levels', label: hm[1].trim(), x: cleanPhrase(hw(hm[2])), thresholds, high: thresholds[0], mid: thresholds[1], op: null, n: null, y: null, trigger: hm[1].trim() };
}
// ═══ form: and / or = CONN_RE ⊕ detectAlertClause
export function detectAllClauses(text) {
  const out = [];
  // קטע = תנאי אחד; מחבר-ריבוי («וגם») בתוך קטע = צירוף: הסעיף הבא יורש את מילת-התנאי של הראשון ומסומן and (הרכבה: מסנן על מסנן — whereList בתוך whereList)
  for (const seg of String(text || '').split(SEP_RE)) {
    let whenWord = null; const pieces = seg.split(CONN_RE);   // [חלק, מחבר, חלק, מחבר, …]
    for (let i = 0; i < pieces.length; i += 2) { const part = pieces[i], conn = i > 0 ? pieces[i - 1] : null;
      let d = detectAlertClause(part);
      if (!d && conn && whenWord) d = detectAlertClause(`${whenWord} ${part}`);
      if (!d) continue;
      if (!whenWord) { const m = part.match(WHEN); whenWord = m ? m[0] : null; }
      if (conn) { if (OR_RE.test(conn)) d.or = true; else d.and = true; }   // «או» = חלופה (איחוד) · «וגם» = צירוף (חיתוך)
      if (!out.some((o) => o.x === d.x && o.op === d.op && o.y === d.y)) out.push(d);
    }
  }
  return out;
}

// 🧩 מרכיב (compositor): המבנה **נגזר** ממספר-הצרכים במשפט, לא חרוט. סורק את **כל** מופעי-הצורך,
// ולכל אחד בונה יחידה (ערך + קריאה + התראה-מותנית). אפס תנאים ⇒ תצוגה-בלבד (עוגן דקדוקי 'את',
// מושא-ישיר — חלקיק, לא מילון). N תנאים ⇒ N יחידות (יכולת-ההתראה חוזרת). האטומים נגזרים פעם-אחת.
export function emitApp(text, cls = 'GenCapScreen') { return emitAppFrom(detectAllClauses(text), text, cls); }
/** הרכבה מסעיפים שכבר זוהו (מהטקסט — detectAllClauses — או מצורת-המשפט של מנוע 2 דרך הדלת). סף = המספר של הבעלים (n) כשיש; אחרת קבוע-המצע הישן. */
export function emitAppFrom(clauses, text, cls = 'GenCapScreen') {
  let units;
  if (clauses.length) {
    units = clauses.map((f, i) => ({ i, label: f.x, op: f.op === '<' ? '<' : '>', alert: true, trigger: f.trigger, thr: f.n != null && f.n !== '' && !isNaN(+f.n) ? +f.n : null }));
  } else {
    // אין תנאי ⇒ צורך של יכולת-**אחת** (תצוגה). עוגן: מושא-ישיר 'את X' (חלקיק דקדוקי, אפס-מילון).
    const m = String(text || '').match(/(?:^|\s)את\s+(.+)/);
    const val = m ? cleanPhrase(hw(m[1]).slice(0, 3)) : '';
    if (!val) {
      //    🕯️ «לא נמצאו יכולות» היא «אין» על **המשפט**, ולכן נפסק על כל חלקיק-דקדוק שנסרק בשמו
      //    (הכרעה-23: אומרים את החסר בשפת-החלקיקים — «ל-X אין מילוי», לא «אין יכולת»).
      const r = rminhu({ engine: 'capability.emitApp', matter: `משפט «${String(text || '').slice(0, 60)}»`,
        searched: [`WHEN (${COND.when.join('/')})`, `REL (${REL.map((x) => x.op).join(',')})`, 'מושא-ישיר «את X»'],
        rulings: [
          (WHEN.test(String(text || '')) ? pliga : lo)(`חלקיק WHEN (${COND.when.join('/')})`, WHEN.test(String(text || '')) ? 'נמצא במשפט אך detectAllClauses לא הוציא ממנו סעיף — אין יחס (REL) או שאחד מצדדיו ריק' : 'אין במשפט מרקר-תנאי — המשפט אינו מותנה, וזו צורה תקינה, לא חסר'),
          lo('מושא-ישיר «את X»', 'אין במשפט «את» ואחריו צירוף-שם — אין עוגן-תצוגה שממנו נגזרת יכולת-אחת'),
        ] });
      throw new Error(`לא נמצאו יכולות במשפט — ${r.digest}`);
    }
    units = [{ i: 0, label: val, op: null, alert: false, trigger: '' }];
  }
  // אטומים נגזרים פעם-אחת: ערך/קריאה לפי-צורה (selectAtom), התראה לפי-מטרה (match).
  const gauge = selectAtom({ value: { re: NUM_RE, ty: /double|num/ } });
  const readout = selectAtom({ value: { re: NUM_RE, ty: /double|num/ }, label: { re: STR_RE, ty: /String/ } });
  if (!gauge || !readout) {
    //    🕯️ «לא נגזר אטום» היא «אין» על **המדף**: כל אחת משתי הדרישות נפסקת בשמה ובשקעיה.
    const r = rminhu({ engine: 'capability.emitApp', matter: `אטומי-ערך/קריאה למצע «${String(text || '').slice(0, 40)}»`,
      searched: ['selectAtom(value:double|num)', 'selectAtom(value:double|num + label:String)'],
      rulings: [
        (gauge ? had : pliga)(`מד-ערך ${gauge || '(אין)'}`, gauge ? `נבחר מהמדף עם שקע-ערך ${NUM_RE.source}` : `אף אטום במדף אינו נושא שקע-ערך בשם ${NUME()} ובטיפוס double|num — השקע ריק, ואטום שמציג ערך חייב שקע-דאטה (הכרעה-26)`),
        (readout ? had : pliga)(`קריאה ${readout || '(אין)'}`, readout ? `נבחר מהמדף עם שקע-ערך + שקע-תווית` : `אף אטום במדף אינו נושא שקע-ערך double|num **וגם** שקע-תווית String — צירוף-השקעים הוא שחסר, לא האטום`),
      ] });
    throw new Error(`לא נגזר אטום-ערך/קריאה מהמצע — ${r.digest}`);
  }
  const trig = units.find((u) => u.alert)?.trigger || '';
  const picked = pickAtom(trig);
  const alertAtom = new Set(['AlertBanner']).has(picked) ? picked : 'AlertBanner';
  const alertFile = (fileOf(alertAtom) || 'dart-ui-bs/alert_banner.dart').replace(/\.dart$/, '');
  const gFills = gauge.fills.length ? ', ' + gauge.fills.join(', ') : '';
  const rFills = readout.fills.length ? ', ' + readout.fills.join(', ') : '';
  const hasAlert = units.some((u) => u.alert);   // ייבוא-התראה רק כשיש התראה בפועל (אחרת ייבוא-מת)
  const impPaths = [`../${gauge.file.replace(/\.dart$/, '')}.dart`, `../${readout.file.replace(/\.dart$/, '')}.dart`];
  if (hasAlert) impPaths.push(`../${alertFile}.dart`);
  const imps = [...new Set(impPaths)].map((p) => `import '${p}';`).join('\n');
  const stateVars = units.map((u) => `  double _v${u.i} = ${u.thr != null ? u.thr : 55};`).join('\n');   // ערך-פתיחה = הסף של הבעלים (על הגבול) כשיש
  // גוף-הילדים **נבנה בלולאה** על היחידות — כאן המבנה נגזר (כמה, ואילו) ולא נחרט.
  const body = units.map((u) => {
    const thr = u.thr != null ? u.thr : 60, smax = Math.max(100, thr * 2);
    const cmp = u.alert ? `_v${u.i} ${u.op} ${thr}` : 'false';
    const rLabel = u.alert ? `(${cmp}) ? 'חריגה · ${u.label}' : 'תקין · ${u.label}'` : `'${u.label}'`;
    const alertW = u.alert
      ? `\n        if (${cmp})\n          Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: ${alertAtom}(label: 'חריגה — ${u.label}', height: 46, radius: 14, accentColor: skin.err, baseColor: skin.raised, fillColor: skin.surface)),`
      : '';
    return `        Padding(padding: const EdgeInsets.only(top: 10, right: 14), child: Align(alignment: Alignment.centerRight, child: Text('${u.label}', style: TextStyle(color: skin.mut, fontSize: 13)))),
        Padding(padding: const EdgeInsets.symmetric(vertical: 6), child: Center(child: ${gauge.cls}(${gauge.p.value}: (_v${u.i} / ${smax}).clamp(0.0, 1.0)${gFills}))),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: ${readout.cls}(${readout.p.value}: _v${u.i}, ${readout.p.label}: ${rLabel}${rFills})),${alertW}
        Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Slider(value: _v${u.i}, max: ${smax}, onChanged: (v) => setState(() => _v${u.i} = v))),
        Divider(color: skin.hair, height: 24),`;
  }).join('\n');
  const heCount = units.length + (clauses.length ? ' ניטורים' : ' תצוגה');
  return `// ✨ חולל ע"י capability.mjs (מרכיב) — כוונה⇒הרכבה (§23). המשפט: "${String(text).replace(/"/g, "'")}".
// **המבנה נגזר, לא חרוט:** ${units.length} יחידות (${clauses.length} תנאים) ⇒ ${units.length}× ערך⇒${gauge.cls}/${readout.cls} + ${units.filter((u) => u.alert).length}× התראה⇒${alertAtom}.
// אפס שם-אטום חרוט · אפס-מילון-דומייני · מספר-היחידות מהמבנה (§20-ב · הרכבה-עד-שמושג).
import 'package:flutter/material.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_seam.dart';
${imps}

void main() => runApp(const _CapApp());

class _CapApp extends StatelessWidget {
  const _CapApp();
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, fontFamily: 'Heebo', scaffoldBackgroundColor: DsTokens.bg, colorScheme: ColorScheme.fromSeed(seedColor: DsTokens.accent)),
        builder: (c, ch) => Directionality(textDirection: TextDirection.rtl, child: ch ?? const SizedBox.shrink()),
        home: const ${cls}(),
      );
}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
${stateVars}
  @override
  Widget build(BuildContext context) {
    final skin = DsSeam.skinOf(context); // מלוא-העיצוב מהחריץ (חוק-7: נופל ל-DsPure.skin בלי PureScope)
    return DsScaffold(
      title: 'מסך שחולל',
      subtitle: '${units.length}${heCount}',
      icon: '📟',
      children: [
${body}
      ],
    );
  }
}
`;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const arg = process.argv.slice(2).join(' ');
  if (arg) { process.stdout.write(emitApp(arg)); }
  else { console.error('שימוש: node capability.mjs "<משפט-צורך>"'); process.exit(1); }
}
