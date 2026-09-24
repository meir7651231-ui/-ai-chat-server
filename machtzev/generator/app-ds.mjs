#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  app-ds.mjs — הדלת-האחת על מערכת-העיצוב: אפיון ⇒ אפליקציה שלמה מעוצבת-פרימיום.
//  ישויות ⇒ טופס-DS (טיפוס נאחז מהאטומים) · דשבורדים ⇒ רשת-KPI מנתוני-הישויות ·
//  לוח-ניווט · מסכי-מערכת. הכל דרך render-ds (טהור). שימוש: node app-ds.mjs -f spec.txt
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { interpret as entInterpret } from './entity.mjs';
import { renderEntity, renderDashboard, renderHub, renderSystem, renderWizard, renderMain, renderScreenBind, renderCompose, renderRecordDetail, SCREEN_REGISTRY, makeConsts, write, setLook, getLook, isPaper } from './render-ds.mjs';
import { DEFAULT_LOOK } from './look.mjs';
import { PARTICLE_RE, CONTENT_RE, REPORT_RE, parseParticleLines, parseContentLines, parseReportLines, planParticles, planReports, renderParticles, renderReport, renderReportTest, planReport, reportsMd } from './particles.mjs';   // G23 · הכרעה-27
import { nlToSpec } from './nl-spec.mjs';
import { rule as yeshivaRule } from '../../yeshiva/purpose.mjs';   // המנוע הישיבתי — פוסק לפני שנבנה מסך
import { specFromSentence } from './tzinor.mjs';   // combined pipeline (§20-c): wraps nlToSpec — source-of-truth wins, otherwise reports empty
import { REL_FILE as CAPREL } from './capability.mjs';
import { pickRoot, renderRootPage, renderShell, renderHome, renderBehavior } from './app-shell.mjs';
import fs0 from 'node:fs';
const SL = JSON.parse(fs0.readFileSync(new URL('./spec-lang.data.json', import.meta.url), 'utf8'));
import { L, T } from './chrome.mjs';
import * as R from '../root.mjs';

const ROOT = R.ROOT;
const OUT = R.outDir();
// מרחב-שמות (L95): --name X ⇒ קבצי gen_app_X_* בלבד (ניקוי-פלט רק בתוך המרחב); בלי --name ⇒ app_ (ביט-זהה לאפליקציית-הקבלה)
const NS = (() => { const i = process.argv.indexOf('--name'); return i > 0 ? String(process.argv[i + 1] || '').toLowerCase().replace(/[^a-z0-9]/g, '') : ''; })();
const P = NS ? `app_${NS}_` : 'app_';
const DATA = R.dataOutDir();
const ENTITY_RE = /^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/;
const ROLE_RE = /^\s*(תפקיד|הרשאת)\s+/;
const clean = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]).join(' ').slice(0, 40);

// אשף-תפקיד: 'תפקיד NAME: א, ב, ג' ⇒ {name, all, ents}. 'הכל' ⇒ גישה-מלאה.
function parseRole(line) {
  const body = line.replace(ROLE_RE, '');
  const ci = body.indexOf(':');
  const name = (ci >= 0 ? body.slice(0, ci) : body).trim();
  const afterName = ci >= 0 ? body.slice(ci + 1) : '';
  // סעיפי-'|' (RLS · read-side): '... | היקף: תלמיד.מורה | שדות: תלמיד.ציון=הסתר'.
  const segs = afterName.split('|');
  const entPart = segs[0];
  const all = entPart.includes('הכל');   // ‏\b הוא ASCII בלבד — לא נדלק על עברית
  const ents = all ? [] : entPart.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
  const scope = [], hide = [], ro = [];
  for (let i = 1; i < segs.length; i++) {
    const hm = segs[i].match(/^\s*(היקף|שדות)\s*:(.*)$/);
    if (!hm) continue;
    const items = hm[2].split(/[,،]/).map((x) => x.trim()).filter(Boolean);
    if (hm[1] === 'היקף') {
      for (const it of items) { const d = it.match(/^(.+?)\.(.+)$/); if (d) scope.push({ ent: clean(d[1]), field: clean(d[2]) }); }
    } else {
      // שדות: X.Y=הסתר (הסתרה מלאה כרטיס+טופס) · X.Y=נעל/קריאה (נעילת-קלט בטופס בלבד)
      for (const it of items) { const d = it.match(/^(.+?)\.(.+?)\s*=\s*(.+)$/); if (!d) continue; const e = { ent: clean(d[1]), field: clean(d[2]) }; if (/הסתר/.test(d[3])) hide.push(e); else if (/נעל|קריאה/.test(d[3])) ro.push(e); }
    }
  }
  return { name, all, ents, scope, hide, ro };
}

// «עיצוב: <עור> [<ערכה>]» — העור = הרצף הארוך ביותר מתחילת הערך שהוא מפתח ב-SL.looks («בנייה חכמה» = שתי מילים); המילה שאחריו = ערכה (SL.themes).
// לא-מוכר ⇒ null (הדלת הופכת לשאלה); העור ⇒ DEFAULT_LOOK מהדאטה.
export function parseLookLine(value) {
  const ws = String(value || '').trim().split(/\s+/).filter(Boolean);
  let look = null, used = 0;
  for (let n = ws.length; n >= 1; n--) { const key = ws.slice(0, n).join(' '); if (SL.looks[key]) { look = SL.looks[key]; used = n; break; } }
  const themeWord = look ? ws[used] || null : null;   // עור לא-מוכר ⇒ השאלה על העור בלבד
  const theme = themeWord ? (SL.themes || {})[themeWord] || null : null;
  return { look: look || DEFAULT_LOOK, theme, unknownLook: ws.length && !look ? ws.join(' ') : null, unknownTheme: themeWord && !theme ? themeWord : null };
}

export function buildApp(specText, opts = {}) {   // up-plan · opts.writePlan=false: בנייה בלי כתיבת particle-plan/report-plan (שערי-דגימה nl-smoke/nl-quality) — אחרת שלושה שערים דורסים את אותו particle-plan-app.json והאחרון-במצב מנצח
  const writePlan = opts.writePlan !== false;
  // 🗣️ צפן §22: קלט חסר-מבנה לגמרי (אף ישות/דשבורד/תפקיד) ⇒ עברית-חופשית ⇒ nlToSpec.
  // מבנה קיים ⇒ ביט-זהה (לא נוגעים). כך אותה דלת מקבלת גם משפט-חופשי וגם אפיון-מדויק.
  const raw = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2 && !PARTICLE_RE.test(l));
  // חסר ישות-מפורשת ⇒ עברית-חופשית לשורות-שאינן-תפקיד (שורות-תפקיד נשמרות כמות-שהן ומצורפות
  // בחזרה). באג-שנתפס: קלט מעורב (משפט-ישויות-חופשי + 'תפקיד ...') דילג על nlToSpec כי שורת-
  // תפקיד קיימת ⇒ 0 ישויות, אפליקציה מנוונת. עכשיו רק ישות-מפורשת ⇒ ביט-זהה; אחרת החופשי מתפרש.
  if (raw.length && !raw.some((l) => ENTITY_RE.test(l))) {
    const roleLines = raw.filter((l) => ROLE_RE.test(l));
    const freeLines = raw.filter((l) => !ROLE_RE.test(l));
    // combined pipeline first; nlToSpec stays as fallback (BUILD-ORDER-INTENT:16).
    const free = freeLines.join('\n');
    let nl = '';
    try { const t = specFromSentence(free); if (t.spec.trim()) nl = t.spec; } catch (e) { nl = ''; }
    if (!nl.trim()) nl = nlToSpec(free);   // data skeleton — when the pipeline knew no word
    // ⚖️ הישיבתי **לפני הבנייה** (הכרעה-27): הטיוטה עוברת את שבעת המהלכים מול
    // מסמך-המטרה, ומה שהוכרע מיושם לפני שנבנה מסך אחד. מה שלא הוכרע נשאר מתג —
    // המנוע לא ממציא כדי לסגור פער (L57). כישלון ⇒ הטיוטה כמות-שהיא, לא קריסה.
    // (‏catch ריק במתכוון: פסק שנכשל אינו חוסם בנייה.)
    try { const y = yeshivaRule(free, nl); if (y && y.spec && y.spec.trim()) nl = y.spec; } catch (e) { void e; }
    if (nl.trim()) specText = [nl, ...roleLines].join('\n');   // חסר-מבנה ⇒ עברית-חופשית + תפקידים
  }
  for (const d of [OUT, R.dataOutDir()]) if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (new RegExp(`^gen_${P}[a-z]+\\d*(_content)?\\.dart$`).test(f)) fs.unlinkSync(path.join(d, f));   // G28 · המחולל בעל מרחב-השמות: תוצר-ישן שלא חולל-מחדש (מסך-מגירה שנגרע) לא נשאר
  const all0 = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const particleLines = all0.filter((l) => PARTICLE_RE.test(l));   // G23 · חלקיקים (צעד 2) — לא ישויות
  const contentLines = all0.filter((l) => CONTENT_RE.test(l));     // G24 · אטומי-תוכן (מילה-במילה מהמסמך)
  const reportLines = all0.filter((l) => REPORT_RE.test(l));       // G24 · חלקיקי-דוח
  const APP_RE = new RegExp('^\\s*' + SL.appWord + '\\s*:\\s*(.+)$');   // G26 · `אפליקציה: <שם>` — שם-המוצר על המסך (במקום כרום-המנוע)
  const appLine = all0.map((l) => l.match(APP_RE)).find(Boolean); const appName = appLine ? appLine[1].trim() : null;
  // G28 · `עיצוב: נייר` ⇒ עור-הנייר (setLook) · `שאלה <מסך>: <טקסט>` ⇒ המסך עונה על שאלה (PLAN §1: מסך = שאלה אחת)
  const LOOK_RE = new RegExp('^\\s*' + SL.lookWord + '\\s*:\\s*(.+)$');
  const lookLine = all0.map((l) => l.match(LOOK_RE)).find(Boolean); const lk = parseLookLine(lookLine ? lookLine[1] : '');   // הכרעת-בעלים 23.9: לא 'dark' קשיח — ברירת-המחדל מהדאטה (look.mjs ⇐ spec-lang.defaultLook) · «עיצוב: נייר טורקיז» = עור + ערכה
  setLook(lk.look, lk.theme);
  const Q_RE = new RegExp('^\\s*' + SL.questionWord + '\\s+(\\S+)\\s*:\\s*(.+)$');
  const questions = {}; for (const l of all0) { const m = l.match(Q_RE); if (m && SL.questionTargets[m[1]]) questions[SL.questionTargets[m[1]]] = m[2].trim(); }
  const CHAIN_RE = new RegExp('^\\s*' + SL.chainWord + '\\s*:\\s*(.+)$');   // G32 · `שרשרת: א, ב, ג` — הצעד-הבא בשלב-האחרון (P14)
  const chainLine = all0.map((l) => l.match(CHAIN_RE)).find(Boolean); const chain = chainLine ? chainLine[1].split(/[,،]/).map((x) => x.trim()).filter(Boolean) : [];
  const LAYER_RE = new RegExp('^\\s*' + SL.layerWord + '\\s*:\\s*(.+)$');   // G33 · `שכבה: בסיס` — מודול-בסיס של בלגן (משימות · יומן), לא פירוק
  const layerLine = all0.map((l) => l.match(LAYER_RE)).find(Boolean); const layer = layerLine ? (SL.layers[layerLine[1].trim()] || null) : null;
  // G57 · שורות-הצהרה יוצאות **לפני** האינדוקס: מזהה-הישות הוא `<ns>_ent<מספר-שורה>`,
  //   ולכן כל שורה חדשה מעל הישות מזיזה את המזהה ומיתמת את הנתונים של המשתמש.
  //   `שרת:` נוסף כאן ברגע שנולד; שער `server` נועל את המפה כדי שזה לא יקרה בשקט שוב.
  const SERVER_RE = new RegExp('^\\s*' + SL.serverWord + '\\s*:\\s*(.+)$');
  const EXAMPLE_RE = SL.exampleWord ? new RegExp('^\\s*' + SL.exampleWord + '\\s+(.+?)\\s*:\\s*(.+)$') : /$^/;   // דוגמאות של הבעלים ⇒ רשומות (לא לוח, לא ישות)
  const examples = {}; for (const l of all0) { const m = l.match(EXAMPLE_RE); if (m) (examples[m[1].trim()] ||= []).push(...m[2].split(';').map((r) => { const c = r.split(/[,،]/).map((v) => v.trim()); while (c.length && !c[c.length - 1]) c.pop(); return c; }).filter((r) => r.some(Boolean))); }   // תא ריק בתחילה/באמצע נשמר (אחרת הערכים זזים עמודה)
  const all = all0.filter((l) => !PARTICLE_RE.test(l) && !CONTENT_RE.test(l) && !REPORT_RE.test(l) && !APP_RE.test(l) && !LOOK_RE.test(l) && !Q_RE.test(l) && !CHAIN_RE.test(l) && !LAYER_RE.test(l) && !SERVER_RE.test(l) && !EXAMPLE_RE.test(l));
  const roles = all.filter((l) => ROLE_RE.test(l)).map(parseRole);
  const lines = all.filter((l) => !ROLE_RE.test(l));
  const info = lines.map((line, idx) => ({ line, i: idx + 1, isEnt: ENTITY_RE.test(line) }));
  const extraScreens = Array.isArray(opts.extraScreens) ? opts.extraScreens : [];   // מסכים שנבנו ליד (התראה של capability) ⇒ אריח בלוח-הבית וברכזת

  // מקדימים: כל הישויות (לתוכן-הדשבורדים ולזיהוי-קשרים בין-ישויות) + מפת שם→slug יציב
  const entRes = {};
  for (const li of info) if (li.isEnt) entRes[li.i] = entInterpret(li.line);
  // הכרעה-37 «תתקן את כל השאר»: סוג-שדה מערכי-הדוגמאות של הבעלים (צורה: כל הערכים בעמודה מספר ⇒ num · כל הערכים תאריך ⇒ date). רק שדה שהרמז-הלשוני השאיר 'text'; הדאטה של הבעלים, לא השלמה.
  const isNumV = (v) => /^[+-]?\d+([.,]\d+)?%?$/.test(String(v).trim()), isDateV = (v) => /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{4}-\d{2}-\d{2}([ T]\d{1,2}:\d{2}(:\d{2})?)?)$/.test(String(v).trim());   // גם תאריך+שעה (זמן-מאז בדקות)
  for (const r of Object.values(entRes)) { const ex = r && examples[r.entity]; if (!ex || !ex.length) continue; r.schema.forEach((f, i) => { if (f.type !== 'text') return; const col = ex.map((row) => row[i]).filter((v) => v != null && String(v).trim()); if (!col.length) return; if (col.every(isNumV)) f.type = 'num'; else if (col.every(isDateV)) f.type = 'date'; }); }
  // §22 · ישות בלי שדות = ספק שבור, לא פלט שבור. בלי השער הזה נפלט
  //   DsTable(labels: const [], rows: rs.map((r) => []).toList()) ⇒ List<List<dynamic>>
  //   שאינו מתקמפל, והכשל צף רק ב-flutter build web ~70s אחר-כך, בלי שם-הישות.
  //   הנוסח ב-chrome.data.json (§19 · המנוע עיוור לעברית — ratchet genratchet).
  {
    const empty = info.filter((li) => li.isEnt && !(entRes[li.i].schema || []).length);
    if (empty.length) {
      // li.i הוא אינדקס ב-lines (אחרי סינון-ההצהרות) ולא מספר-שורה בקובץ ⇒ מצטטים את השורה.
      const rows = empty.map((li) => T('entNoFieldsRow', { name: entRes[li.i].entity || '?', line: JSON.stringify(li.line.trim().slice(0, 60)) }));
      throw new Error([T('entNoFields', { n: empty.length }), ...rows, L.entNoFieldsHow].join('\n'));
    }
  }
  const entMeta = [];
  const nameToSlug = {};
  for (const li of info) if (li.isEnt) {
    const r = entRes[li.i];
    const eslug = `${P}ent${li.i}`;
    entMeta.push({ name: r.entity, slug: eslug, fields: r.schema.length, stages: (r.stages || []).length, stageLabels: r.stages || [], icon: '🗂️', numFields: r.schema.filter((s) => s.type === 'num').map((s) => s.label), labels: r.schema.map((s) => s.label) });
    if (!(r.entity in nameToSlug)) nameToSlug[r.entity] = eslug;   // שם ⇒ slug-היעד לקשרים
  }
  const entityNames = entMeta.map((e) => e.name);
  // 🔁 קשר-הפוך: לכל ישות-יעד — מי מצביע עליה (ישות F · שדה · יחיד/רבים). משקף את
  // סדר-הקדימות של render-ds: קשר-יחיד (pickRelation, תת-קבוצת-מילים) קודם, ואם אין —
  // קשר-רבים (pickMultiRelation, צורת-רבים של ישות חד-מילית). כך גרף-הקשרים שלם ל-M2M.
  const hw = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
  const definal = (w) => w.replace(/ך$/, 'כ').replace(/ם$/, 'מ').replace(/ן$/, 'נ').replace(/ף$/, 'פ').replace(/ץ$/, 'צ');
  const pluralForms = (en) => { const b = definal(en.replace(/ה$/, '')); const b2 = definal(en); return new Set([`${b}ים`, `${b}ות`, `${b2}ים`, `${b2}ות`]); };
  const relOf = (label, self) => {
    const fw = new Set(hw(label));
    for (const en of entityNames) {                                   // (א) קשר-יחיד — כמו pickRelation
      if (en === self) continue;
      const ew = hw(en);
      if (ew.length && ew.every((w) => fw.has(w))) return { en, multi: false };
    }
    for (const en of entityNames) {                                   // (ב) קשר-רבים — כמו pickMultiRelation
      if (en === self || hw(en).length !== 1) continue;
      const forms = pluralForms(en);
      for (const w of fw) if (forms.has(w)) return { en, multi: true };
    }
    return null;
  };
  const backRefs = {};
  // 🗑 קשתות-שלמות (Referential Integrity, opt-in): רק שדות-קשר שהילד הכריז עליהם
  // ב-'| מחיקה:'. בלי-הכרזה ⇒ אין-קשת ⇒ removeById מתנהג כמקודם (ביט-זהה). מדיניות-מחיקה
  // חמורה-ביותר פר-ישות-הורה (חסימה=0 גוברת) ⇒ שער-מחיקה בכרטיס-ההורה.
  const edges = [];
  const delGuardByName = {};
  for (const li of info) if (li.isEnt) {
    const F = entRes[li.i]; const fslug = `${P}ent${li.i}`;
    const dp = F.delPolicy || [];
    for (const s of F.schema) {
      // רק שדות שמתרנדרים כקשר: לא נוסחה/צבירה, לא enum, לא מקונן (משקף את קדימות render-ds).
      if (s.formula || (s.enumVals && s.enumVals.length) || (s.members && s.members.length)) continue;
      const hit = relOf(s.label, F.entity);
      if (hit) (backRefs[hit.en] ??= []).push({ fslug, ffield: s.label, fname: F.entity, multi: hit.multi });
      const decl = hit ? dp.find((d) => d.field === s.label) : null;
      if (hit && decl && nameToSlug[hit.en]) {
        edges.push({ childSlug: fslug, field: s.label, parentSlug: nameToSlug[hit.en], parentName: hit.en, policy: decl.policy, multi: hit.multi });
        const cur = delGuardByName[hit.en];
        delGuardByName[hit.en] = cur === undefined ? decl.policy : (cur === 0 || decl.policy === 0 ? 0 : decl.policy);
      }
    }
  }

  // ניקוי פלט-app קודם
  // L95: ניקוי רק בתוך מרחב-השמות — בלי --name היה מוחק גם gen_app_kehila/tzedaka/… של app-from-sentences (אותה מחלה כמו genesis-gen, L93)
  const own = NS ? new RegExp(`^gen_${P}(ent|px|rp|scr|bind|rec|over|audit|flags|settings|hub|main|relations|shell|root)\\d*(_content)?\\.dart$`) : /^gen_app_(ent|px|rp|scr|bind|rec|over|audit|flags|settings|hub|main|relations|shell|root)\d*(_content)?\.dart$/;
  for (const f of fs.readdirSync(OUT)) if (own.test(f)) fs.unlinkSync(path.join(OUT, f));
  for (const f of fs.readdirSync(DATA)) if (own.test(f)) fs.unlinkSync(path.join(DATA, f));

  const screens = [];
  for (const li of info) {
    if (li.isEnt) {
      const r = entRes[li.i];
      const slug = `${P}ent${li.i}`;
      const authz = roles.length ? {
        scope: roles.map((role) => { const sc = (role.scope || []).find((x) => x.ent === r.entity); return sc ? sc.field : ''; }),
        hidden: roles.map((role) => r.schema.map((s, i) => (role.hide || []).some((h) => h.ent === r.entity && h.field === s.label) ? i : -1).filter((i) => i >= 0)),
        readonly: roles.map((role) => r.schema.map((s, i) => (role.ro || []).some((h) => h.ent === r.entity && h.field === s.label) ? i : -1).filter((i) => i >= 0)),
      } : null;
      const { cls } = renderEntity(slug, { name: r.entity, icon: '🗂️', schema: r.schema, stages: r.stages || [], entityNames, nameToSlug, backRefs: backRefs[r.entity] || [], vrules: r.vrules || [], delGuard: delGuardByName[r.entity], guards: r.guards || [], authz });
      screens.push({ slug, cls, kind: 'entity', name: r.entity, icon: '🗂️', sub: `${r.schema.length} ${L.fieldsWord}${(r.stages || []).length ? ` · ${r.stages.length} ${L.stagesWord}` : ''}` });
    } else {
      const slug = `${P}scr${li.i}`;
      const title = (li.line.split(/\s+עם\s+/)[0] || li.line).trim();     // כותרת = לפני 'עם'
      // פיצול-מדדים מודע-עומק: רווח/פסיק מפרידים רק ברמה-0 — רווח בתוך '(...)' (מונה-מסונן
      // 'מונה(מערכת: סטטוס=קריטי)') אינו מפריד. באג-קודם: split גלובלי שבר אגרגט-עם-רווח.
      const splitMetrics = (str) => { const out = []; let d = 0, cur = ''; for (const ch of str) { if (ch === '(') d++; else if (ch === ')') d = Math.max(0, d - 1); if ((ch === ' ' || ch === ',' || ch === '\t') && d === 0) { if (cur.trim()) out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
      const rawMetrics = splitMetrics(li.line.split(/\s+עם\s+/)[1] || '');   // מדדים = אחרי 'עם'
      // אגרגט מהאפיון: סכום(ישות.שדה) · ממוצע(ישות.שדה) · מונה(ישות). בלי-סוגריים ⇒ מונה-לפי-שם.
      const aggs = [], countWords = [];
      // מונה-מסונן (KPI 'בסיכון' · דשבורד-מפקד): 'מונה(ישות: שדה=ערך)' ⇒ סופר רשומות במצב.
      const FILT_RE = new RegExp('^' + L.count + '\\(([^:)]+):\\s*([^=)]+)=([^)]+)\\)$');
      for (const t of rawMetrics) {
        const mf = t.match(FILT_RE);
        if (mf) { const en = mf[1].trim(); aggs.push({ kind: L.count, entityName: en, field: mf[2].trim(), value: mf[3].trim(), slug: nameToSlug[en] || '', filtered: true }); continue; }
        const m = t.match(/^(סכום|ממוצע|מונה)\(([^.)]+)(?:\.([^)]+))?\)$/);
        if (m) aggs.push({ kind: m[1], entityName: m[2].trim(), field: (m[3] || '').trim(), slug: nameToSlug[m[2].trim()] || '' });
        else countWords.push(t);
      }
      const { cls } = renderDashboard(slug, { title: clean(title), icon: '📊', entities: entMeta, metrics: countWords, aggs, extras: extraScreens });
      screens.push({ slug, cls, kind: 'dashboard', name: clean(title), icon: '📊', sub: `${(countWords.length + aggs.length) || entMeta.length} ${L.metricsWord}` });
    }
  }

  // 🖥 מחבר-ישות-למסך: הישויות-הראשונות ממלאות מסכי-Composed מפורקים אמיתיים, מחזוריות
  // על רישום-המסכים (כל ישות ⇒ תבנית-מסך אחרת) — הוכחת-הכללה על 3 צורות-שקע גנריות.
  // 🔐 היקף-RLS פר-ישות: שדה-ההיקף שתפקיד מגביל לפיו (role.scope). כל מסכי-החיווט
  // (בינד/הרכבה/כרטיס) מכבדים אותו (scoped) כמו מסך-הישות — אחרת משתמש-מוגבל רואה הכל.
  const scopeByEnt = {};
  for (const role of roles) for (const sc of (role.scope || [])) { const sl = nameToSlug[sc.ent]; if (sl && !scopeByEnt[sl]) scopeByEnt[sl] = sc.field; }

  const bindScreens = [];
  // G28 · נייר: מסכי-המגירה (מסך-אמת · כרטיס-רשומה · סקירה) לא קיימים למשתמש (PLAN §2.3) ותבניותיהם נושאות אטומים בצבע-קשיח ⇒ לא מחוללים
  const drawer = !isPaper();
  const bindN = drawer ? Math.min(entMeta.length, SCREEN_REGISTRY.length) : 0;
  for (let bi = 0; bi < bindN; bi++) {
    const ent = entMeta[bi];
    const spec = SCREEN_REGISTRY[bi % SCREEN_REGISTRY.length];
    const bslug = `${P}bind${bi + 1}`;
    const { cls } = renderScreenBind(bslug, { entitySlug: ent.slug, spec, scopeField: scopeByEnt[ent.slug] || null });
    bindScreens.push({ slug: bslug, cls, kind: 'entity', name: `🖥 ${ent.name} · ${L.screenTag}`, icon: '🖥', sub: T('realScreenSub', { cls: spec.cls.replace('Composed', '') }) });
  }

  // 🔎 מסכי-רשומה-בודדת: בורר-רשומה ⇒ שדות + KPI-יחסים (ילדים שמצביעים על הרשומה).
  // היחסים הם ערך פר-רשומה (countRef) — שייכים למסך-הפרט, לא לסקירה. נבנים ראשונים
  // כדי שמסך-הסקירה יוכל לנווט אליהם (הקלקה על שורה ⇒ הכרטיס של אותה רשומה).
  const detailScreens = [];
  const detailByEnt = {};
  let detN = 0;
  for (const e of drawer ? entMeta : []) {
    const rels = (backRefs[e.name] || []).map((b) => ({ childSlug: b.fslug, childField: b.ffield, childName: b.fname }));
    const recSub = rels.length ? T('recordRels', { n: rels.length }) : L.singleRecord;
    const d = renderRecordDetail(`${P}rec${++detN}`, { entitySlug: e.slug, entityName: e.name, fields: e.labels || [], relations: rels, scopeField: scopeByEnt[e.slug] || null, icon: '🔎', sub: recSub });
    if (d) { detailScreens.push({ slug: d.slug, cls: d.cls, kind: 'entity', name: `🔎 ${e.name} · ${L.cardTag}`, icon: '🔎', sub: recSub }); detailByEnt[e.slug] = { cls: d.cls, slug: d.slug }; }
    else detN--;
  }

  // 🧩 מסכי-הרכבה: אטום+אטום ⇒ מסך-סקירה חדש (לא ממחזר מסך-מוכן — מרכיב מלבנים).
  // לכל ישות "עשירה" (שדה-מספרי ו/או שלבים) נבנה מסך-סקירה: KPI + מגמה + התקדמות +
  // מבט-ראשי (לוח / רשימה-לחיצה⇒כרטיס). האטומים נבחרים מהמצע לפי-צורה.
  const composeScreens = [];
  let overN = 0;
  for (const e of drawer ? entMeta : []) {
    if (!(e.stageLabels || []).length && !(e.numFields || []).length) continue;   // אין מה להרכיב מעבר ללי מסך-הישות
    const c = renderCompose(`${P}over${++overN}`, { entitySlug: e.slug, entityName: e.name, fields: e.labels || [], numFields: e.numFields || [], stages: e.stageLabels || [], detail: detailByEnt[e.slug] || null, scopeField: scopeByEnt[e.slug] || null });
    if (c) composeScreens.push({ slug: c.slug, cls: c.cls, kind: 'entity', name: `🧩 ${e.name} · ${L.overviewTag}`, icon: '🧩', sub: L.composedSub });
    else overN--;
  }

  // 🧩 G23 · הכרעה-27: מסך-חלקיקים לכל ישות שיש לה חלקיקים — כל חלקיק נמצא בחיפוש בכל הקטלוג ומורכב מחדש
  const particleScreens = []; const reportScreens = []; const reportByEnt = {};
  let planAll = [], pentsAll = [];   // G30 · חשופים לשלד («היום» משתמש בחלקיק-ההודעה של השורש)
  if (particleLines.length || reportLines.length) {
    const content = parseContentLines(contentLines);
    const pents = entMeta.map((e) => { const li = info.find((x) => x.isEnt && `${P}ent${x.i}` === e.slug); const r = li ? entRes[li.i] : null; const sc = screens.find((x) => x.slug === e.slug); return { name: e.name, slug: e.slug, cls: sc ? sc.cls : 'Gen' + e.slug, schema: r ? r.schema : [] }; });
    const plan = planParticles({ particles: parseParticleLines(particleLines), entities: pents, content }); planAll = plan; pentsAll = pents;
    let pi = 0;
    for (const e of pents) {
      const mine = plan.filter((p) => p.entSlug === e.slug); if (!mine.length) continue;
      const pslug = `${P}px${++pi}`; const { k, dump } = makeConsts(pslug);
      const r = renderParticles({ slug: pslug, entity: e, plan: mine, k });
      write(pslug, r.code, dump());
      particleScreens.push({ slug: pslug, cls: r.cls, kind: 'entity', name: `🧩 ${T('particlesTitle', { ent: e.name })}`, icon: '🧩', sub: `${r.count} ${L.particlesLive}${r.notes.length ? ` · ${r.notes.length} ${L.particlesUnres}` : ''}` });
    }
    const gen = R.GEN_DIR; const nsName = NS || 'app';
    if (writePlan) fs.writeFileSync(path.join(R.GEN_DIR, `particle-plan-${nsName}.json`), JSON.stringify(plan.map((p) => ({ entity: p.entity, name: p.name, expr: p.expr, ok: p.ok, why: p.why || null, shape: p.shape ? p.shape.kind : null, ops: p.ops || [], picks: (p.picks || []).map((k) => ({ op: k.op, atoms: k.atoms, alts: k.alts.slice(0, 3) })), wired: p.wired || [] })), null, 1) + '\n');
    const reports = planReports({ reports: parseReportLines(reportLines), plan, entities: pents, content });
    let ri = 0;
    for (const rp of reports) {
      if (!rp.root) continue;
      const rslug = `${P}rp${++ri}`; const { k, dump } = makeConsts(rslug);
      const r = renderReport({ slug: rslug, report: rp, k, question: questions.report || null });
      write(rslug, r.code, dump());
      if (r.exported) {   // G25 · בדיקה מחוללת לסריאליזציית-הדוח — ל-buildsmart/test (כמו app-from-sentences), רק כשיש pubspec
        const bsTest = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'test');
        if (fs.existsSync(path.join(bsTest, '..', 'pubspec.yaml'))) fs.writeFileSync(path.join(bsTest, `genesis_gen_${rslug}_report_test.dart`), renderReportTest({ ns: nsName, slug: rslug, report: rp, textFn: r.textFn }));
      }
      reportScreens.push({ slug: rslug, cls: r.cls, kind: 'entity', name: `📄 ${T('reportTitle', { ent: rp.entity })}`, icon: '📄', sub: `${r.count} ${L.reportSections}${r.notes.length ? ` · ${r.notes.length} ${L.reportUnres}` : ''}` });
      reportByEnt[rp.entity] = { slug: rslug, cls: r.cls, textFn: r.textFn, export: r.export };
    }
    if (writePlan) fs.writeFileSync(path.join(gen, `particle-plan-${nsName}.md`), planReport(plan) + (reports.length ? reportsMd(reports) : ''));
    if (writePlan && reportLines.length) fs.writeFileSync(path.join(gen, `report-plan-${nsName}.json`), JSON.stringify(reports.map((r) => ({ entity: r.entity, ok: r.ok, unresolved: r.unresolved, export: r.export ? { label: r.export.label, toField: r.export.toField, ok: r.export.ok, action: (r.export.action.atoms[0] || null), link: r.export.link ? r.export.link.name : null } : null, sections: r.sections.map((s) => ({ name: s.name, refs: s.refs.map((x) => ({ raw: x.raw, mode: x.mode || null, why: x.why || null, wired: x.p && x.p.wired ? x.p.wired : [] })) })) })), null, 1));
    console.log(`🧩 ${L.particlesLog}: ${plan.filter((p) => p.wired && p.wired.length).length}/${plan.length} ${L.particlesFound} · ${particleScreens.length} ${L.particleScreens}${content.length ? ` · ${content.length} ${L.contentItems}` : ''}${reports.length ? ` · ${reportScreens.length} ${L.reportScreens}` : ''}`);
  }
  if (writePlan && !particleLines.length && !reportLines.length && NS) { fs.writeFileSync(path.join(R.GEN_DIR, `particle-plan-${NS}.json`), '[]'); }   // G33 · ספק בלי חלקיקים (משימות/יומן) = תוכנית ריקה, מדווחת — לא חסרה
  // מסכי-מערכת (kind='system' — גלויים רק לתפקיד 'הכל')
  const sys = [];
  const a = renderSystem(`${P}audit`, { title: L.auditTitle, icon: '🧾', sectionTitle: L.auditSection, kind: 'empty', items: [L.auditEmpty] });
  sys.push({ ...a, kind: 'system', name: L.auditTitle, icon: '🧾', sub: L.auditSub });
  const fl = renderSystem(`${P}flags`, { title: L.flagsTitle, icon: '🎚️', sectionTitle: L.flagsSection, kind: 'toggles', items: entMeta.slice(0, 12).map((e) => e.name) });
  sys.push({ ...fl, kind: 'system', name: L.flagsTitle, icon: '🎚️', sub: L.flagsSub });
  const st = renderSystem(`${P}settings`, { title: L.settingsTitle, icon: '⚙️', sectionTitle: L.settingsSection, kind: 'toggles', items: [L.settingsItem1, L.settingsItem2, L.settingsItem3] });
  sys.push({ ...st, kind: 'system', name: L.settingsTitle, icon: '⚙️', sub: L.settingsSub });
  if (isPaper()) { const bh = renderBehavior(`${P}behavior`); sys.push({ ...bh, kind: 'system', name: L.behaviorTitle, icon: '', sub: L.behaviorSub }); }   // G32 · התנהגות (נייר)

  // RLS · שדות-היקף ייחודיים (slug+שדה) — למילוי בורר-"מי-אני" בלוח.
  const scopeFields = [];
  for (const role of roles) for (const sc of (role.scope || [])) { const sl = nameToSlug[sc.ent]; if (sl && !scopeFields.some((x) => x.slug === sl && x.field === sc.field)) scopeFields.push({ slug: sl, field: sc.field }); }
  const appTitle = appName || L.appTitle;
  // wizard: one per app, assembled over shelf atoms (THE-WAY). Failure is non-fatal.
  let wizTile = null;
  try {
    const wEnts = Object.values(entRes).map((r) => ({ name: r.entity, schema: r.schema, stages: r.stages || [] }));
    const wiz = renderWizard(`${P}wizard`, { entities: wEnts, screenCount: screens.length + sys.length + 2 });
    if (wiz && wiz.slug) wizTile = { slug: wiz.slug, cls: wiz.cls, name: L.wizTitle, icon: '🧙', sub: `${wiz.steps} ${L.wizSteps} · ${wiz.options} ${L.wizOpts} · ${wiz.inventions} ${L.wizInv}` };
  } catch (e) { wizTile = null; }
  // הרכבה (הדלת): מסכים שנבנו ליד (התראה של capability) ⇒ אריח ברכזת, לא קובץ-יתום
  const hub = renderHub(`${P}hub`, { title: appTitle, icon: '🏗️', screens: [...screens, ...extraScreens, ...reportScreens, ...particleScreens, ...composeScreens, ...detailScreens, ...bindScreens, ...sys, ...(wizTile ? [wizTile] : [])], roles, scopeFields });
  // 🧭 G26 · ניווט-מקשרים: השורש = הישות עם הכי-הרבה מצביעים (backRefs); יש שורש ⇒ שלד (בית · שורש · עוד) הוא הבית, הרכזת = "עוד" (ביט-זהה)
  // הרכבה: אין שורש לפי קשרים אבל יש לוח-בית (ראש-המשפט) ⇒ הישות הראשונה שנאמרה = לשונית-השורש, והלוח = לשונית-הבית (לא הרכזת, לא «היום» של ישות אחת)
  // רשומות-דוגמה של הבעלים: ערכים לפי סדר-השדות של הישות; עודף ⇒ מדווח, לא מומצא (הטקסטים מ-chrome.data.json)
  let seed = null; const seedNotes = [];
  { const { k, dump } = makeConsts(`${P}seed`); const adds = []; let count = 0;
    for (const [ent, recs] of Object.entries(examples)) { const li = info.find((x) => x.isEnt && entRes[x.i] && entRes[x.i].entity === ent); const r = li ? entRes[li.i] : null; const sl = nameToSlug[ent];
      if (!r || !sl) { seedNotes.push(T('seedNoEntity', { word: SL.exampleWord, ent })); continue; }
      const labels = r.schema.map((f) => f.label);
      for (const rec of recs) { const pairs = rec.slice(0, labels.length).map((v, j) => `${k(labels[j])}: ${k(v)}`); if (rec.length > labels.length) seedNotes.push(T('seedOverflow', { word: SL.exampleWord, ent, extra: rec.length - labels.length, n: labels.length })); adds.push(`  appStore.add('${sl}', {${pairs.join(', ')}});`); count++; } }
    if (adds.length) { seed = { slug: `${P}seed`, fn: 'seedExamples', count }; write(seed.slug, `// 🌱 ${T('seedHeader', { word: SL.exampleWord })}\nimport '../dart-data-bs/auto/gen_${seed.slug}_content.dart';\nimport '../dart-ui-bs/ds/ds_store.dart';\n\nbool _seeded = false;\nvoid seedExamples() {\n  if (_seeded) return; _seeded = true;\n${adds.join('\n')}\n}\n`, dump()); } }
  let liveExtrasOut = extraScreens;   // ההתראות עם קישור-הנתונים (slug/field) — הדלת מרכיבה מהן מסך-תובנה (insight.mjs)
  const rootByRefs = pickRoot(entMeta, backRefs);
  const headDash = screens.find((x) => x.kind === 'dashboard') || null;
  const rootMeta = rootByRefs || (headDash && entMeta.length ? entMeta[0] : null);
  const rootIsFirst = !rootByRefs && !!rootMeta;
  let home = { slug: `${P}hub`, cls: hub.cls };
  if (rootMeta) {
    const entOf = (name) => { const sc = screens.find((x) => x.kind === 'entity' && x.name === name); const li = info.find((x) => x.isEnt && entRes[x.i] && entRes[x.i].entity === name); const r = li ? entRes[li.i] : null; return { name, slug: nameToSlug[name], cls: sc ? sc.cls : null, schema: r ? r.schema : [], stages: r ? (r.stages || []) : [], icon: '🗂️' }; };
    const descRank = (f) => (f.required && !(f.enumVals && f.enumVals.length) && !/^(num|date|bool|multiline)$/.test(f.type || '')) ? -1 : f.type === 'multiline' ? 0 : (f.enumVals && f.enumVals.length) ? 3 : f.type === 'num' ? 4 : f.type === 'date' ? 5 : f.type === 'bool' ? 6 : f.label.split(/\s+/).length > 1 ? 1 : 2;   // מתאר-רשומה לפי צורה: טקסט-חובה (זהות) > רב-שורתי > תווית-רב-מילים > טקסט > enum > מספר > תאריך; שוויון = סדר-הספק
    const descOf = (e, skip = []) => { const t = e.schema.filter((f) => !f.formula && !(f.members && f.members.length) && !skip.includes(f.label) && !entMeta.some((x) => x.name === f.label)).map((f, i) => [descRank(f), i, f]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); return t.length ? t[0][2].label : null; };
    const rootE = entOf(rootMeta.name); rootE.descField = descOf(rootE); rootE.subField = (rootE.schema.find((f) => f.label !== rootE.descField && !(f.members && f.members.length) && !entMeta.some((x) => x.name === f.label)) || {}).label || null;
    const kids = (backRefs[rootMeta.name] || []).map((b) => { const e = entOf(b.fname); e.link = b.ffield; e.descField = descOf(e, [b.ffield]); e.subField = (e.schema.find((f) => f.label !== e.descField && f.label !== b.ffield && !(f.members && f.members.length)) || {}).label || null; return e; }).filter((e) => e.cls);
    const rootPage = renderRootPage(`${P}root`, { root: rootE, children: kids, report: reportByEnt[rootMeta.name] || null, title: appTitle });
    const dash = screens.find((x) => x.kind === 'dashboard') || null;
    // G30 · נייר: «היום» = דבר-אחד לכל רשומה פתוחה (חלקיק-ההודעה של השורש + שליחת-הדוח) במקום לוח-הבקרה בלשונית-הבית
    let homeScr = null;
    if (isPaper() && !rootIsFirst) {
      const rep = reportByEnt[rootMeta.name] || null;
      const msgP = planAll.find((x) => x.ok && x.entity === rootMeta.name && x.shape && x.shape.kind === 'message') || null;
      homeScr = renderHome(`${P}home`, { root: rootE, rootPage, report: rep, message: msgP ? { entity: pentsAll.find((e) => e.name === rootMeta.name), p: msgP } : null, title: questions.home || L.shellHome, chain, appTitle });
    }
    const PFX = new RegExp('^[' + (SL.prefixLetters || '') + ']'), SFX = new RegExp('(' + (SL.stemSuffixes || []).join('|') + ')$');   // אותיות-קידומת וסיומות-ריבוי מהדאטה (spec-lang)
    const stemOf = (w) => String(w || '').replace(PFX, '').replace(SFX, '');
    // צורות-התנאי (הכרעת-בעלים 23.9 «תסיים»): «שדה יחס מספר» · «שדה-תאריך יחס משך» · «<ממוצע|סכום|מונה> שדה» על הקבוצה · «<בנות> של <הורה>» מונה-קשר לכל הורה · «חודש» ⇒ שאלה
    const AGG = { avg: SL.pAvg || [], sum: SL.pSum || [], count: SL.pCount || [] };
    AGG.trend = SL.pTrend || [];   // צפי (חיזוי קו-מגמה על קריאות עם זמן) — צורת-צבירה על הקבוצה
    const aggOf = (w) => Object.keys(AGG).find((a) => AGG[a].includes(w)) || null;
    const entByStem = (w) => { for (const li of info) { if (!li.isEnt || !entRes[li.i]) continue; const r = entRes[li.i]; if (stemOf(r.entity) === stemOf(w) || r.entity === w) return r; } return null; };
    // ═══ liveOf = clause ⊕ entity ⊕ field ⇒ live (num · age · refCount · agg · aggBy · levels · eq)
    const liveOf = (x) => { const y = liveOf0(x); const w = x.clause && x.clause.window, h = x.clause && x.clause.horizon, off = x.clause && x.clause.off; return (w || h != null || off != null) && y.live ? { ...y, live: { ...y.live, ...(w ? { window: w } : {}), ...(h != null ? { horizon: h } : {}), ...(off != null ? { off } : {}) } } : y; };   // חלון-זמן · אופק · נקודת-כיבוי (היסטרזיס) על כל צורת-תנאי   // חלון-זמן על כל צורת-תנאי
    const liveOf0 = (x) => { const c = x.clause;
      // 🔗 תוצאה של טבלאות קשורות = שדה של ישות-האב (opts.derived): «התראה כשצפי מעל 250» ⇒ הערך המחושב לכל אזור — לפני מילות-הצבירה («צפי» היא גם קו-מגמה)
      for (const d of (Array.isArray(opts.derived) ? opts.derived : [])) { if (!c || !c.x || !/^[<>]$/.test(c.op) || c.n == null || isNaN(+c.n)) break; const xw0 = String(c.x).split(/\s+/)[0];
        if ((stemOf(xw0) === stemOf(d.name) || xw0 === d.name) && nameToSlug[d.ent]) {
          // 🔗⊕ צירוף-סוגים (הכרעת-בעלים 24.9 «תסגור הכל»): «צפי חלקי שטח» = תוצאת-קשר <פעולה> שדה של האב (arithWords בדאטה)
          const xs = String(c.x).split(/\s+/).slice(1); const AW = SL.arithWords || {}; const ai = xs.findIndex((w, i) => AW[xs.slice(0, i + 1).slice(-2).join(' ')] || AW[w]); let arith = null;
          if (ai >= 0) { const w2 = AW[xs.slice(Math.max(0, ai - 1), ai + 1).join(' ')] ? xs.slice(Math.max(0, ai - 1), ai + 1).join(' ') : xs[ai]; const rest = xs.slice(ai + 1).join(' '); const P = Object.values(entRes).find((r) => r && r.entity === d.ent); const f = P && P.schema.find((fd) => stemOf(fd.label) === stemOf(rest) || fd.label === rest); if (!f) { const why = T('liveNoField', { name: x.name, field: rest, ent: d.ent }); seedNotes.push(why); return { ...x, why }; } arith = { op: AW[w2], field: f.label, word: w2 }; }
          return { ...x, live: { slug: nameToSlug[d.ent], kind: 'linked', field: arith ? `${d.name} ${arith.word} ${arith.field}` : d.name, base: d.name, parentKey: d.parentKey, terms: d.terms.map((t) => ({ ...t, slug: nameToSlug[t.child] })), ...(arith ? { arith } : {}), op: c.op, n: +c.n } }; } }
      if (c && c.kind === 'levels' && c.x) { for (const li of info) { if (!li.isEnt || !entRes[li.i]) continue; const r = entRes[li.i]; const f = r.schema.find((fd) => stemOf(fd.label) === stemOf(c.x) || fd.label === c.x); if (f && nameToSlug[r.entity]) return { ...x, live: { slug: nameToSlug[r.entity], kind: 'levels', field: f.label, by: c.label, agg: 'count', high: c.high, mid: c.mid, thresholds: c.thresholds || [c.high, c.mid], op: null, n: null } }; } return x; }
      // @אטום = יחס נלמד (capability.addLearnedRel) — סף-טקסט כמו «=»
      if (!c || !c.x || !/^([<>=]|@\w+)$/.test(c.op) || ((c.op === '=' || c.op[0] === '@') ? !c.y : (c.n == null || isNaN(+c.n)))) return x;
      if (c.unit === 'ask') { const why = T('liveMonthAsk', { name: x.name, unit: c.unitWord || '' }); seedNotes.push(why); return { ...x, why, ask: 'timeUnit' }; }   // שאלה לדלת, לא הנחה
      const xw = String(c.x).split(/\s+/).filter(Boolean); const agg = aggOf(xw[0]); const rest = agg ? xw.slice(1) : xw;
      const ofI = rest.indexOf('של');
      if (ofI > 0 && ofI < rest.length - 1) {   // «<בנות> של <הורה>» ⇒ מונה-קשר לכל רשומת-הורה (השדה המצביע מ-backRefs, לא מנוחש)
        const child = entByStem(rest.slice(0, ofI).join(' ')), parent = entByStem(rest.slice(ofI + 1).join(' '));
        if (child && parent) { const b = (backRefs[parent.entity] || []).find((q) => q.fname === child.entity); if (!b) { const why = T('liveNoRelation', { name: x.name, child: child.entity, parent: parent.entity }); seedNotes.push(why); return { ...x, why }; }
          return { ...x, live: { slug: nameToSlug[parent.entity], kind: 'refCount', field: b.ffield, childSlug: b.fslug, childField: b.ffield, childName: child.entity, parentKey: (parent.schema[0] || {}).label, op: c.op, n: +c.n } }; }
      }
      const byI = rest.findIndex((w) => (SL.perEach || []).includes(w));   // «ממוצע ציון לכל כיתה» ⇒ ערך-הצבירה לכל קבוצה (השדה אחרי מילת-החלוקה)
      if (agg && byI > 0 && byI < rest.length - 1) {
        const fw = rest.slice(0, byI).join(' '), bw = rest.slice(byI + 1).join(' ');
        for (const li of info) { if (!li.isEnt || !entRes[li.i]) continue; const r = entRes[li.i]; const f = r.schema.find((fd) => stemOf(fd.label) === stemOf(fw) || fd.label === fw); const b = r.schema.find((fd) => stemOf(fd.label) === stemOf(bw) || fd.label === bw);
          if (f && b && nameToSlug[r.entity]) return { ...x, live: { slug: nameToSlug[r.entity], kind: 'aggBy', agg, field: f.label, by: b.label, op: c.op, n: +c.n } }; }
        return x;
      }
      if (agg) {   // על הקבוצה: מונה של ישות («מונה תלמידים») או ממוצע/סכום של שדה («ממוצע ציון»)
        const ent0 = agg === 'count' ? entByStem(rest.join(' ')) : null;
        if (ent0) return { ...x, live: { slug: nameToSlug[ent0.entity], kind: 'agg', agg, field: (ent0.schema[0] || {}).label, op: c.op, n: +c.n } };
        for (const li of info) { if (!li.isEnt || !entRes[li.i]) continue; const r = entRes[li.i]; const f = r.schema.find((fd) => stemOf(fd.label) === stemOf(rest.join(' ')) || fd.label === rest.join(' ')); if (f && nameToSlug[r.entity]) return { ...x, live: { slug: nameToSlug[r.entity], kind: 'agg', agg, field: f.label, op: c.op, n: +c.n } }; }
        return x;
      }
      // «תאריך הכרעה» (שדה + ישות בסמיכות) ⇒ השדה של אותה ישות קודם; אחרת השדה בכל ישות
      const xw2 = String(c.x).split(/\s+/).filter(Boolean); const entTail = xw2.length >= 2 ? entByStem(xw2[xw2.length - 1]) : null; const fieldHead = entTail ? xw2.slice(0, -1).join(' ') : null;
      const ordered = [...(entTail ? [entTail] : []), ...info.filter((li) => li.isEnt && entRes[li.i] && entRes[li.i] !== entTail).map((li) => entRes[li.i])];
      for (const r of ordered) { const cx = (r === entTail && fieldHead) ? fieldHead : c.x; const f = r.schema.find((fd) => stemOf(fd.label) === stemOf(cx) || fd.label === cx); if (f && nameToSlug[r.entity]) { if (c.op === '=' || c.op[0] === '@') return { ...x, live: { slug: nameToSlug[r.entity], field: f.label, op: c.op, kind: 'eq', value: String(c.y), n: null, ...(c.op[0] === '@' ? { atomFile: CAPREL[c.op] || null } : {}) } }; if ((c.unit || c.unitMin) && f.type !== 'date') { const why = T('liveNotDate', { name: x.name, label: f.label, type: f.type }); seedNotes.push(why); return { ...x, why }; }
            if (c.unitMin && !c.unit) return { ...x, live: { slug: nameToSlug[r.entity], field: f.label, op: c.op, n: +c.n, kind: 'ageMin', minutes: +c.n * c.unitMin } };   // ⊕ זמן-מאז בדקות (_ageMin הקיים) — «נסרק מעל 270 דקות»
            return { ...x, live: { slug: nameToSlug[r.entity], field: f.label, op: c.op, n: +c.n, kind: c.unit ? 'age' : 'num', days: c.unit ? +c.n * c.unit : null } }; } }
      return x; };   // אין ישות עם השדה ⇒ השורה נשארת סטטית (הסף בלבד), לא מומצא
    const liveExtras = extraScreens.map((x) => { const y = liveOf(x); const c = x.clause; if (!y.live || !c || !((c.and && c.and.length) || (c.or && c.or.length))) return y;
      const pre = [], alt = [], dropped = [];
      const same = (z) => z.live && z.live.slug === y.live.slug && !['agg', 'aggBy', 'refCount', 'levels'].includes(z.live.kind || 'num');
      for (const cj of c.and || []) { const z = liveOf({ ...x, clause: cj }); if (same(z)) pre.push(z.live); else dropped.push(`${cj.x} ${cj.op} ${cj.n}`); }
      for (const cj of c.or || []) { const z = liveOf({ ...x, clause: cj }); if (same(z)) alt.push(z.live); else dropped.push(`${cj.x} ${cj.op} ${cj.n}`); }
      if (dropped.length) { const why = T('liveAndDropped', { name: x.name, parts: dropped.join(', ') }); seedNotes.push(why); }
      return (pre.length || alt.length) ? { ...y, live: { ...y.live, ...(pre.length ? { pre } : {}), ...(alt.length ? { alt } : {}) } } : y; });
    liveExtrasOut = liveExtras;
    let sync = null;
    if (opts.server) {   // «שרת בענן»: הרשומות מהשרת (צורת-התאום) — קריאה בעלייה, בלי המצאה כשאין שרת
      const sslug = `${P}sync`; const { k: ks, dump: dumps } = makeConsts(sslug); const entsS = info.filter((li) => li.isEnt && entRes[li.i]).map((li) => entRes[li.i]);
      const slugs = entsS.map((r) => `'${nameToSlug[r.entity]}'`).join(', '), fields = entsS.map((r) => `[${r.schema.map((f) => ks(f.label)).join(', ')}]`).join(', '), stages = entsS.map((r) => `[${(r.stages || []).map((st) => ks(st)).join(', ')}]`).join(', ');
      write(sslug, `// 🔄 ${T('syncHeader')}\nimport 'dart:convert';\nimport 'package:http/http.dart' as http;\nimport '../dart-data-bs/auto/gen_${sslug}_content.dart';\nimport '../dart-ui-bs/ds/ds_store.dart';\n\nbool _synced = false;\nFuture<void> syncFromServer() async {\n  if (_synced) return; _synced = true;\n  final slugs = <String>[${slugs}];\n  final fields = <List<String>>[${fields}];\n  final stages = <List<String>>[${stages}];\n  try {\n    final r = await http.get(Uri.base.resolve('api/data'));\n    if (r.statusCode != 200) return;\n    final d = jsonDecode(r.body);\n    if (d is! List) return;\n    final rec = <String, List<Map<String, String>>>{};\n    for (var i = 0; i < slugs.length && i < d.length; i++) { final rows = d[i]; if (rows is! List) continue;\n      rec[slugs[i]] = [for (var j = 0; j < rows.length; j++) if (rows[j] is List) { AppStore.idKey: 'srv-\$i-\$j', for (var f = 0; f < fields[i].length && f < (rows[j] as List).length; f++) fields[i][f]: (rows[j] as List)[f].toString(), if (stages[i].isNotEmpty && (rows[j] as List).length > fields[i].length && stages[i].contains((rows[j] as List)[fields[i].length].toString())) AppStore.stageKey: stages[i].indexOf((rows[j] as List)[fields[i].length].toString()).toString() }]; }\n    appStore.importJson(jsonEncode({'seq': 0, 'role': 0, 'actor': '', 'rec': rec, 'log': <Object>[], 'decided': <String, String>{}, 'settings': <String, String>{}}));\n  } catch (_) {}\n}\n`, dumps());
      sync = { slug: sslug, fn: 'syncFromServer' };
    }
    // מקור מבחוץ (opts.feeds · הכרעת-בעלים 24.9): הישות מתמלאת מעצמה — ingestFeed (שורה = מערך לפי סדר-השדות או אובייקט לפי שם) · pullFeeds (api/feed/<slug>?since) · startFeeds (רק כשמוגש מ-http, כל 3 שניות)
    let feed = null; const feedEnts = (opts.feeds || []).map((n) => info.find((li) => li.isEnt && entRes[li.i] && entRes[li.i].entity === n)).filter(Boolean).map((li) => entRes[li.i]).filter((r) => nameToSlug[r.entity]);
    if (feedEnts.length) { const fslug = `${P}feed`; const { k: kf, dump: dumpf } = makeConsts(fslug);
      const fmap = feedEnts.map((r) => `'${nameToSlug[r.entity]}': <String>[${r.schema.map((f) => kf(f.label)).join(', ')}]`).join(', ');
      write(fslug, `// 📡 ${T('feedHeader')}\nimport 'dart:async';\nimport 'dart:convert';\nimport 'package:http/http.dart' as http;\nimport '../dart-data-bs/auto/gen_${fslug}_content.dart';\nimport '../dart-ui-bs/ds/ds_store.dart';\n\nfinal Map<String, int> _feedSince = {};\nbool _feedOn = false;\nfinal Map<String, List<String>> feedFields = {${fmap}};\nint ingestFeed(String slug, String raw) {\n  final fs = feedFields[slug]; if (fs == null) return 0;\n  dynamic d; try { d = jsonDecode(raw); } catch (_) { return 0; }\n  final rows = d is Map ? (d['rows'] ?? const []) : d; if (rows is! List) return 0;\n  final ats = d is Map && d['at'] is List ? d['at'] as List : const [];\n  var n = 0; var i0 = -1;\n  for (final r in rows) { i0++; final rec = <String, String>{'__at': i0 < ats.length ? '\${ats[i0]}' : DateTime.now().toIso8601String()};\n    if (r is List) { for (var i = 0; i < fs.length && i < r.length; i++) { rec[fs[i]] = '\${r[i]}'; } } else if (r is Map) { for (final f in fs) { if (r[f] != null) rec[f] = '\${r[f]}'; } }\n    if (rec.length < 2) continue; appStore.add(slug, rec); n++; }\n  if (d is Map && d['next'] is num) _feedSince[slug] = (d['next'] as num).toInt();\n  return n;\n}\nFuture<void> pullFeeds() async { for (final slug in feedFields.keys) { try { final r = await http.get(Uri.base.resolve('api/feed/\$slug?since=\${_feedSince[slug] ?? 0}')); if (r.statusCode == 200) ingestFeed(slug, r.body); } catch (_) {} } }\nvoid startFeeds() { if (_feedOn || !Uri.base.scheme.startsWith('http')) return; _feedOn = true; pullFeeds(); Timer.periodic(const Duration(seconds: 3), (_) => pullFeeds()); }\n`, dumpf());
      feed = { slug: fslug, fn: 'startFeeds', slugs: feedEnts.map((r) => nameToSlug[r.entity]) }; }
    // חוקים על האפליקציה (opts.rules · הכרעת-בעלים 24.9): מצב נוכחי (הגדרה mode) ותפקיד נוכחי (appStore.role) ⇒ visibleOf(slug) · gateOf · rulesBar; הרכזת עוברת סינון (אריח ⇒ if visibleOf · כניסה ⇒ gateOf)
    let rulesF = null; const RU = opts.rules || null;
    if (RU && (RU.modes.length || RU.roles.length)) { const rslug = `${P}rules`; const { k: kr, dump: dumpr } = makeConsts(rslug); const slugOf = (n) => nameToSlug[n];
      const setMap = (o) => Object.entries(o).map(([key, es]) => `${kr(key)}: <String>{${es.map(slugOf).filter(Boolean).map((x) => `'${x}'`).join(', ')}}`).join(', ');
      write(rslug, `// 🧭 ${T('rulesHeader')}\nimport 'package:flutter/material.dart';\nimport '../dart-data-bs/auto/gen_${rslug}_content.dart';\nimport '../dart-ui-bs/ds/ds_store.dart';\n\nconst ruleModes = <String>[${RU.modes.map((m) => kr(m)).join(', ')}];\nconst ruleRoles = <String>[${RU.roles.map((r) => kr(r)).join(', ')}];\nconst Map<String, Set<String>> _hide = {${setMap(RU.hide)}};\nconst Map<String, Set<String>> _only = {${setMap(RU.only)}};\nconst Map<String, Set<String>> _see = {${setMap(RU.see)}};\nString currentMode() => appStore.setting('mode', ruleModes.isEmpty ? '' : ruleModes.first);\nString currentRole() => ruleRoles.isEmpty ? '' : ruleRoles[appStore.role.clamp(0, ruleRoles.length - 1)];\nbool visibleOf(String slug) {\n  final m = currentMode(); if ((_hide[m] ?? const <String>{}).contains(slug)) return false;\n  if (_only.containsKey(m) && !_only[m]!.contains(slug)) return false;\n  final r = currentRole(); if (_see.containsKey(r) && !_see[r]!.contains(slug)) return false;\n  return true;\n}\nWidget gateOf(String slug, Widget child) => AnimatedBuilder(animation: appStore, builder: (context, _) => visibleOf(slug) ? child : Scaffold(appBar: AppBar(), body: Center(child: Text(${kr(T('rulesHidden'))}))));\nWidget rulesBar() => AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), child: Wrap(spacing: 6, runSpacing: 6, crossAxisAlignment: WrapCrossAlignment.center, children: [\n  if (ruleModes.isNotEmpty) Text(${kr(T('rulesMode'))}),\n  for (final m in ruleModes) ChoiceChip(key: Key('mode-\$m'), label: Text(m), selected: currentMode() == m, onSelected: (_) => appStore.setSetting('mode', m)),\n  if (ruleRoles.isNotEmpty) Text(${kr(T('rulesRole'))}),\n  for (var i = 0; i < ruleRoles.length; i++) ChoiceChip(key: Key('role-\$i'), label: Text(ruleRoles[i]), selected: appStore.role == i, onSelected: (_) => appStore.setRole(i)),\n])));\n`, dumpr());
      rulesF = { slug: rslug };
      // הרכזת: אריח של ישות ⇒ if (visibleOf) · הכניסה ⇒ gateOf (שער גם לכניסה ישירה)
      const hubF = path.join(OUT, `gen_${P}hub.dart`); if (fs.existsSync(hubF)) { let hc = fs.readFileSync(hubF, 'utf8'); let n = 0;
        for (const sc of screens.filter((x) => x.kind === 'entity' && x.cls && x.slug)) { const re = new RegExp(`(\\n\\s*)(DsNavTile\\([^\\n]*?builder: \\(_\\) => )const ${sc.cls}\\(\\)`, 'g'); hc = hc.replace(re, (m0, ind, pre) => { n++; return `${ind}!visibleOf('${sc.slug}') ? const SizedBox.shrink() : ${pre}gateOf('${sc.slug}', const ${sc.cls}())`; }); }
        if (n) { hc = hc.replace(/\n(\s*)Widget build\(BuildContext context\) \{/, (m0, ind) => `\n${ind}Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) => _buildRules(context));   // מצב/תפקיד משתנים ⇒ הרכזת נבנית מחדש\n${ind}Widget _buildRules(BuildContext context) {`); if (!hc.includes("ds/ds_store.dart'")) hc = hc.replace(/^(import 'package:flutter\/material\.dart';)$/m, "$1\nimport '../dart-ui-bs/ds/ds_store.dart';"); hc = hc.replace(/^(import 'package:flutter\/material\.dart';)$/m, `$1\nimport 'gen_${rslug}.dart';`); if (!hc.includes(`gen_${rslug}.dart`)) hc = `import 'gen_${rslug}.dart';\n` + hc; fs.writeFileSync(hubF, hc); } rulesF.gated = n; }
    }
    const shell = renderShell(`${P}shell`, { title: appTitle, root: rootE, rootPage, dashboard: dash, hub: { slug: `${P}hub`, cls: hub.cls }, questions, home: homeScr, homeIsRoot: rootIsFirst, extras: liveExtras, seed, sync, feed, rules: rulesF });
    home = { slug: `${P}shell`, cls: shell.cls };
    // G33 · מניפסט-המודול (הכרעה-29): מה ש«בלגן» (האפליקציה-האחת) צריך כדי למזג את המודול — מסכים · שורש · שדות · שרשרת. נגזר, לא יד.
    if (NS) { const APPS = path.join(R.GEN_DIR, 'apps'); fs.mkdirSync(APPS, { recursive: true }); fs.writeFileSync(path.join(APPS, `${NS}.json`), JSON.stringify({ ns: NS, title: appTitle, look: getLook(), layer, chain, questions, home: homeScr ? { slug: homeScr.slug, cls: homeScr.cls } : null, shell: { slug: shell.slug, cls: shell.cls }, rootPage: { slug: rootPage.slug, cls: rootPage.cls }, root: { slug: rootE.slug, cls: rootE.cls, name: rootE.name, descField: rootE.descField || null, stages: rootE.stages || [], fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [] })) }, entities: entMeta.map((e) => ({ name: e.name, slug: e.slug })), relations: edges.length > 0, report: reportByEnt[rootMeta.name] ? { slug: reportByEnt[rootMeta.name].slug, cls: reportByEnt[rootMeta.name].cls } : null }, null, 1)); }
    console.log(`🧭 ${L.shellLog}: ${L.shellRootWord} ${rootMeta.name}${rootIsFirst ? ' (1st)' : ''} · ${kids.length} ${L.shellChildrenWord} · ${shell.nav || '—'}${[...rootPage.notes, ...shell.notes].length ? ' · ⚪ ' + [...rootPage.notes, ...shell.notes].join(' · ') : ''}`);
  }
  // שורש-האפליקציה: main + MaterialApp ⇒ אפליקציה עצמאית שרצה בלי entry-זמני.
  for (const n of seedNotes) console.log(`⚪ ${n}`); if (seed) console.log(`🌱 ${T('seedLog', { word: SL.exampleWord, count: seed.count, slug: seed.slug })}`);
  renderMain(`${P}main`, { title: appTitle, hubSlug: home.slug, hubCls: home.cls, edges });

  return { screens, sys, roles, liveExtras: liveExtrasOut, nameToSlug };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  let spec;
  if (process.argv[2] === '-f') spec = fs.readFileSync(process.argv[3], 'utf8');
  else spec = process.argv.slice(2).join('\n');
  if (!spec.trim()) { console.error('שימוש: node app-ds.mjs -f spec.txt'); process.exit(1); }
  const { screens, sys } = buildApp(spec);
  // G23 · --skin: אותו בורר-עור של מסלול-א׳ (auto-skin ⇒ skinPass) על מסכי מסלול-ב׳ — ישות-חדשה בעיצוב-החדש (היה: DS ישן בלבד)
  if (process.argv.includes('--skin')) {
    const [{ skinPass }, { resolveSkin }, { autoSkin }] = await Promise.all([import('./retarget.mjs'), import('./app-from-sentences.mjs'), import('./auto-skin.mjs')]);
    const sk = resolveSkin(autoSkin().skin); const tot = {};
    if (sk && isPaper()) { delete sk.navTile; delete sk.section; delete sk.pageHeader; delete sk.button; }   // G28 · נייר: שורה-לא-כרטיס (DsNavTile 52px · קו) · חלק שטוח (DsSection: כותרת 15/700 + שורות, בלי כרטיס-בתוך-כרטיס) · כותרת-מסך של ה-DS (22/600 + קו) — כלל-13 של PLAN §5.3
    for (const f of fs.readdirSync(OUT)) {
      if (!new RegExp(`^gen_${P}(ent|px|rp|scr|bind|rec|over|audit|flags|settings|hub|main|shell|root|home|behavior)\\d*\\.dart$`).test(f)) continue;
      const fp = path.join(OUT, f); let { code, stats } = skinPass(fs.readFileSync(fp, 'utf8'), sk);
      if (isPaper()) code = code.replace(/^import '\.\.\/dart-ui-bs\/((?:premium|auto)\/[^']+)';\n/gm, (line, rel) => { const src = fs.readFileSync(path.join(R.ROOT, 'new/dart-ui-bs', rel), 'utf8'); const cls = (src.match(/^class ([A-Za-z0-9_]+)/m) || [])[1]; return cls && new RegExp('\\b' + cls + '\\(').test(code) ? line : ''; });   // G28 · נייר: ייבוא-אטום שהוחלף בעור ולא נותר בשימוש נגזם (אחרת האטום הקשיח "מיובא" למסך-נייר)
      fs.writeFileSync(fp, code); for (const [k, v] of Object.entries(stats)) tot[k] = (tot[k] || 0) + v;
    }
    console.log(`🎨 ${L.skinLog}: ${Object.entries(tot).filter(([, v]) => v).map(([k, v]) => `${k}×${v}`).join(' · ') || '—'}`);
  }
  const ents = screens.filter((s) => s.icon === '🗂️');
  console.log(`\n✨ אפליקציה (מערכת-עיצוב) חוללה — ${screens.length + sys.length + 1} ${L.wizScreens}`);
  console.log(`   ${ents.length} ${L.wizEntities} · ${screens.length - ents.length} דשבורדים · ${sys.length} מערכת · 1 לוח`);
  console.log('   הכל דרך render-ds הטהור (טיפוס נאחז מהאטומים · אפס regex).');
}
