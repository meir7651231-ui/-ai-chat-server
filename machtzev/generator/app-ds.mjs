#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  app-ds.mjs — הדלת-האחת על מערכת-העיצוב: אפיון ⇒ אפליקציה שלמה מעוצבת-פרימיום.
//  ישויות ⇒ טופס-DS (טיפוס נאחז מהאטומים) · דשבורדים ⇒ רשת-KPI מנתוני-הישויות ·
//  לוח-ניווט · מסכי-מערכת. הכל דרך render-ds (טהור). שימוש: node app-ds.mjs -f spec.txt
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { interpret as entInterpret } from './entity.mjs';
import { renderEntity, renderDashboard, renderHub, renderSystem, renderMain, renderScreenBind, renderCompose, renderRecordDetail, SCREEN_REGISTRY, makeConsts, write, setLook, getLook } from './render-ds.mjs';
import { PARTICLE_RE, CONTENT_RE, REPORT_RE, parseParticleLines, parseContentLines, parseReportLines, planParticles, planReports, renderParticles, renderReport, renderReportTest, planReport, reportsMd } from './particles.mjs';   // G23 · הכרעה-27
import { nlToSpec } from './nl-spec.mjs';
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

export function buildApp(specText) {
  // 🗣️ צפן §22: קלט חסר-מבנה לגמרי (אף ישות/דשבורד/תפקיד) ⇒ עברית-חופשית ⇒ nlToSpec.
  // מבנה קיים ⇒ ביט-זהה (לא נוגעים). כך אותה דלת מקבלת גם משפט-חופשי וגם אפיון-מדויק.
  const raw = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2 && !PARTICLE_RE.test(l));
  // חסר ישות-מפורשת ⇒ עברית-חופשית לשורות-שאינן-תפקיד (שורות-תפקיד נשמרות כמות-שהן ומצורפות
  // בחזרה). באג-שנתפס: קלט מעורב (משפט-ישויות-חופשי + 'תפקיד ...') דילג על nlToSpec כי שורת-
  // תפקיד קיימת ⇒ 0 ישויות, אפליקציה מנוונת. עכשיו רק ישות-מפורשת ⇒ ביט-זהה; אחרת החופשי מתפרש.
  if (raw.length && !raw.some((l) => ENTITY_RE.test(l))) {
    const roleLines = raw.filter((l) => ROLE_RE.test(l));
    const freeLines = raw.filter((l) => !ROLE_RE.test(l));
    const nl = nlToSpec(freeLines.join('\n'));
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
  const lookLine = all0.map((l) => l.match(LOOK_RE)).find(Boolean); const look = lookLine ? (SL.looks[lookLine[1].trim()] || 'dark') : 'dark';
  setLook(look);
  const Q_RE = new RegExp('^\\s*' + SL.questionWord + '\\s+(\\S+)\\s*:\\s*(.+)$');
  const questions = {}; for (const l of all0) { const m = l.match(Q_RE); if (m && SL.questionTargets[m[1]]) questions[SL.questionTargets[m[1]]] = m[2].trim(); }
  const CHAIN_RE = new RegExp('^\\s*' + SL.chainWord + '\\s*:\\s*(.+)$');   // G32 · `שרשרת: א, ב, ג` — הצעד-הבא בשלב-האחרון (P14)
  const chainLine = all0.map((l) => l.match(CHAIN_RE)).find(Boolean); const chain = chainLine ? chainLine[1].split(/[,،]/).map((x) => x.trim()).filter(Boolean) : [];
  const all = all0.filter((l) => !PARTICLE_RE.test(l) && !CONTENT_RE.test(l) && !REPORT_RE.test(l) && !APP_RE.test(l) && !LOOK_RE.test(l) && !Q_RE.test(l) && !CHAIN_RE.test(l));
  const roles = all.filter((l) => ROLE_RE.test(l)).map(parseRole);
  const lines = all.filter((l) => !ROLE_RE.test(l));
  const info = lines.map((line, idx) => ({ line, i: idx + 1, isEnt: ENTITY_RE.test(line) }));

  // מקדימים: כל הישויות (לתוכן-הדשבורדים ולזיהוי-קשרים בין-ישויות) + מפת שם→slug יציב
  const entRes = {};
  for (const li of info) if (li.isEnt) entRes[li.i] = entInterpret(li.line);
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
      const { cls } = renderDashboard(slug, { title: clean(title), icon: '📊', entities: entMeta, metrics: countWords, aggs });
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
  const drawer = getLook() !== 'paper';
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
    const d = renderRecordDetail(`${P}rec${++detN}`, { entitySlug: e.slug, entityName: e.name, fields: e.labels || [], relations: rels, scopeField: scopeByEnt[e.slug] || null });
    if (d) { detailScreens.push({ slug: d.slug, cls: d.cls, kind: 'entity', name: `🔎 ${e.name} · ${L.cardTag}`, icon: '🔎', sub: rels.length ? T('recordRels', { n: rels.length }) : L.singleRecord }); detailByEnt[e.slug] = { cls: d.cls, slug: d.slug }; }
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
    fs.writeFileSync(path.join(R.GEN_DIR, `particle-plan-${nsName}.json`), JSON.stringify(plan.map((p) => ({ entity: p.entity, name: p.name, expr: p.expr, ok: p.ok, why: p.why || null, shape: p.shape ? p.shape.kind : null, ops: p.ops || [], picks: (p.picks || []).map((k) => ({ op: k.op, atoms: k.atoms, alts: k.alts.slice(0, 3) })), wired: p.wired || [] })), null, 1) + '\n');
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
    fs.writeFileSync(path.join(gen, `particle-plan-${nsName}.md`), planReport(plan) + (reports.length ? reportsMd(reports) : ''));
    if (reportLines.length) fs.writeFileSync(path.join(gen, `report-plan-${nsName}.json`), JSON.stringify(reports.map((r) => ({ entity: r.entity, ok: r.ok, unresolved: r.unresolved, export: r.export ? { label: r.export.label, toField: r.export.toField, ok: r.export.ok, action: (r.export.action.atoms[0] || null), link: r.export.link ? r.export.link.name : null } : null, sections: r.sections.map((s) => ({ name: s.name, refs: s.refs.map((x) => ({ raw: x.raw, mode: x.mode || null, why: x.why || null, wired: x.p && x.p.wired ? x.p.wired : [] })) })) })), null, 1));
    console.log(`🧩 ${L.particlesLog}: ${plan.filter((p) => p.wired && p.wired.length).length}/${plan.length} ${L.particlesFound} · ${particleScreens.length} ${L.particleScreens}${content.length ? ` · ${content.length} ${L.contentItems}` : ''}${reports.length ? ` · ${reportScreens.length} ${L.reportScreens}` : ''}`);
  }
  // מסכי-מערכת (kind='system' — גלויים רק לתפקיד 'הכל')
  const sys = [];
  const a = renderSystem(`${P}audit`, { title: L.auditTitle, icon: '🧾', sectionTitle: L.auditSection, kind: 'empty', items: [L.auditEmpty] });
  sys.push({ ...a, kind: 'system', name: L.auditTitle, icon: '🧾', sub: L.auditSub });
  const fl = renderSystem(`${P}flags`, { title: L.flagsTitle, icon: '🎚️', sectionTitle: L.flagsSection, kind: 'toggles', items: entMeta.slice(0, 12).map((e) => e.name) });
  sys.push({ ...fl, kind: 'system', name: L.flagsTitle, icon: '🎚️', sub: L.flagsSub });
  const st = renderSystem(`${P}settings`, { title: L.settingsTitle, icon: '⚙️', sectionTitle: L.settingsSection, kind: 'toggles', items: [L.settingsItem1, L.settingsItem2, L.settingsItem3] });
  sys.push({ ...st, kind: 'system', name: L.settingsTitle, icon: '⚙️', sub: L.settingsSub });
  if (getLook() === 'paper') { const bh = renderBehavior(`${P}behavior`); sys.push({ ...bh, kind: 'system', name: L.behaviorTitle, icon: '', sub: L.behaviorSub }); }   // G32 · התנהגות (נייר)

  // RLS · שדות-היקף ייחודיים (slug+שדה) — למילוי בורר-"מי-אני" בלוח.
  const scopeFields = [];
  for (const role of roles) for (const sc of (role.scope || [])) { const sl = nameToSlug[sc.ent]; if (sl && !scopeFields.some((x) => x.slug === sl && x.field === sc.field)) scopeFields.push({ slug: sl, field: sc.field }); }
  const appTitle = appName || L.appTitle;
  const hub = renderHub(`${P}hub`, { title: appTitle, icon: '🏗️', screens: [...screens, ...reportScreens, ...particleScreens, ...composeScreens, ...detailScreens, ...bindScreens, ...sys], roles, scopeFields });
  // 🧭 G26 · ניווט-מקשרים: השורש = הישות עם הכי-הרבה מצביעים (backRefs); יש שורש ⇒ שלד (בית · שורש · עוד) הוא הבית, הרכזת = "עוד" (ביט-זהה)
  const rootMeta = pickRoot(entMeta, backRefs);
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
    if (getLook() === 'paper') {
      const rep = reportByEnt[rootMeta.name] || null;
      const msgP = planAll.find((x) => x.ok && x.entity === rootMeta.name && x.shape && x.shape.kind === 'message') || null;
      homeScr = renderHome(`${P}home`, { root: rootE, rootPage, report: rep, message: msgP ? { entity: pentsAll.find((e) => e.name === rootMeta.name), p: msgP } : null, title: questions.home || L.shellHome, chain });
    }
    const shell = renderShell(`${P}shell`, { title: appTitle, root: rootE, rootPage, dashboard: dash, hub: { slug: `${P}hub`, cls: hub.cls }, questions, home: homeScr });
    home = { slug: `${P}shell`, cls: shell.cls };
    console.log(`🧭 ${L.shellLog}: ${L.shellRootWord} ${rootMeta.name} · ${kids.length} ${L.shellChildrenWord} · ${shell.nav || '—'}${[...rootPage.notes, ...shell.notes].length ? ' · ⚪ ' + [...rootPage.notes, ...shell.notes].join(' · ') : ''}`);
  }
  // שורש-האפליקציה: main + MaterialApp ⇒ אפליקציה עצמאית שרצה בלי entry-זמני.
  renderMain(`${P}main`, { title: appTitle, hubSlug: home.slug, hubCls: home.cls, edges });

  return { screens, sys, roles };
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
    if (sk && getLook() === 'paper') { delete sk.navTile; delete sk.section; delete sk.pageHeader; }   // G28 · נייר: שורה-לא-כרטיס (DsNavTile 52px · קו) · חלק שטוח (DsSection: כותרת 15/700 + שורות, בלי כרטיס-בתוך-כרטיס) · כותרת-מסך של ה-DS (22/600 + קו) — כלל-13 של PLAN §5.3
    for (const f of fs.readdirSync(OUT)) {
      if (!new RegExp(`^gen_${P}(ent|px|rp|scr|bind|rec|over|audit|flags|settings|hub|main|shell|root|home|behavior)\\d*\\.dart$`).test(f)) continue;
      const fp = path.join(OUT, f); let { code, stats } = skinPass(fs.readFileSync(fp, 'utf8'), sk);
      if (getLook() === 'paper') code = code.replace(/^import '\.\.\/dart-ui-bs\/((?:premium|auto)\/[^']+)';\n/gm, (line, rel) => { const src = fs.readFileSync(path.join(R.ROOT, 'new/dart-ui-bs', rel), 'utf8'); const cls = (src.match(/^class ([A-Za-z0-9_]+)/m) || [])[1]; return cls && new RegExp('\\b' + cls + '\\(').test(code) ? line : ''; });   // G28 · נייר: ייבוא-אטום שהוחלף בעור ולא נותר בשימוש נגזם (אחרת האטום הקשיח "מיובא" למסך-נייר)
      fs.writeFileSync(fp, code); for (const [k, v] of Object.entries(stats)) tot[k] = (tot[k] || 0) + v;
    }
    console.log(`🎨 ${L.skinLog}: ${Object.entries(tot).filter(([, v]) => v).map(([k, v]) => `${k}×${v}`).join(' · ') || '—'}`);
  }
  const ents = screens.filter((s) => s.icon === '🗂️');
  console.log(`\n✨ אפליקציה (מערכת-עיצוב) חוללה — ${screens.length + sys.length + 1} מסכים`);
  console.log(`   ${ents.length} ישויות · ${screens.length - ents.length} דשבורדים · ${sys.length} מערכת · 1 לוח`);
  console.log('   הכל דרך render-ds הטהור (טיפוס נאחז מהאטומים · אפס regex).');
}
