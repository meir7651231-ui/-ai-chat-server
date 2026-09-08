#!/usr/bin/env node
// 📄 peruk — קורא-הפירוקים (GENMAX·G27 · הכרעה-27): מסמך «פירוק N» של הבעלים ⇒ צומת-ידע שלם ⇒ ספק-app-ds, בלי יד.
//   השלד הקבוע של הפירוקים (הרגע · מסגרת · פירוק ל-N בלוקים · סיווג/אדום-צהוב-ירוק · המוצר: מה-שולחים/מה-חוזר · דוגמה ·
//   מחיר · אסור · חובה · שרשרת) נקרא **מבנית** — כותרות, רשימות, מפרידים. כל מילה-עברית מהדאטה (peruk-lang.data.json; §19).
//   פלט: specs-ds/<ns>.txt (ישויות · שלבים · חלקיקים · תוכן · דוח · ייצוא) + peruk-index.json (צומת: מזהה · רגע · קטגוריה ·
//   מחירים · שרשרת) — ואז app-ds בונה את האפליקציה. מאות מסמכים = ריצה אחת.
//   שער `peruk`: לכל מסמך ב-peruks/ — ≥1 שדה-קליטה · ≥1 חלק-פלט · הסתייגות · אסור; והספק בדיסק ≡ הספק המחולל (טריות).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';

const GEN = R.GEN_DIR;
const P = JSON.parse(fs.readFileSync(GEN + 'peruk-lang.data.json', 'utf8'));
const G = JSON.parse(fs.readFileSync(GEN + 'spec-lang.data.json', 'utf8'));
const heW = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const clean = (s) => heW(s).join(' ').trim();
const norm = (s) => String(s || '').replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').trim();
const strip = (s) => norm(s).replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/\.$/, '').trim();

// ── 1 · פירוק המסמך לשלד: כותרת · פתיח · סעיפים (##) עם תת-סעיפים (###) ──
export function parsePeruk(md) {
  const lines = md.split(/\r?\n/);
  const doc = { id: null, title: null, moment: null, category: null, not: [], sections: [] };
  const tRe = new RegExp(P.titleRe);
  let cur = null, sub = null;
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const tm = line.match(tRe); if (tm && !doc.id) { doc.id = +tm[1]; doc.title = norm(tm[2]); continue; }
    if (/^---\s*$/.test(line)) continue;
    const h2 = line.match(/^##\s+(.+)$/); if (h2) { cur = { head: norm(h2[1]), kind: kindOf(h2[1]), lines: [], subs: [] }; sub = null; doc.sections.push(cur); continue; }
    const h3 = line.match(/^###\s+(.+)$/); if (h3 && cur) { sub = { head: norm(h3[1]), lines: [] }; cur.subs.push(sub); continue; }
    if (!cur) {   // פתיח: הרגע · קטגוריה · "לא X."
      const mm = line.match(new RegExp('^' + P.momentKey + '\\s*[:：]\\s*(.+)$')); if (mm) { doc.moment = norm(mm[1]); continue; }
      const cm = line.match(new RegExp('^' + P.categoryKey + '\\s*[:：]\\s*(.+)$')); if (cm) { doc.category = norm(cm[1]); continue; }
      if (new RegExp(P.notLine).test(line)) { doc.not.push(strip(line)); continue; }
      continue;
    }
    (sub ? sub.lines : cur.lines).push(line);
  }
  return doc;
}
function kindOf(head) {
  const h = String(head).replace(/^\d+[.)]\s*/, '');
  for (const [k, words] of Object.entries(P.sections)) if (words.some((w) => h.includes(w))) return k;
  return 'other';
}
const items = (lines) => lines.map((l) => l.trim()).filter((l) => /^([-*•]|\d+[.)])\s/.test(l)).map(strip).filter(Boolean);
const prose = (lines) => lines.map((l) => l.trim()).filter((l) => l && !/^([-*•]|\d+[.)])\s/.test(l)).map(norm);
const allText = (sec) => [...sec.lines, ...sec.subs.flatMap((s) => s.lines)];

// ── 2 · שדות-קליטה מ«מה שולחים»: חובה/רשות · פריט-עם-פסיקים ⇒ כמה שדות · "X או Y" ⇒ enum · ≤N מילים ──
function fieldsFrom(lines) {
  const out = []; let req = false;
  const push = (txt, required) => {
    const base = txt.split('/')[0].replace(/\(.*?\)/g, '').trim();
    const or = base.split(new RegExp('\\s+' + P.orWord + '\\s+'));
    if (or.length === 2 && or.every((x) => heW(x).length && heW(x).length <= 2)) { out.push({ label: clean(or[0]) + ' ' + P.orWord + ' ' + clean(or[1]), enumVals: [clean(or[0]), clean(or[1])], required }); return; }
    const cj = base.match(new RegExp('^(.+?)\\s+ו(' + [...G.typeDate, ...G.typeNum].join('|') + ')(.*)$'));   // "שכ״ד נוכחי ותאריך סיום" ⇒ שניים (ו + שם-עצם מוקלד)
    if (cj) { push(cj[1], required); push(cj[2] + cj[3], required); return; }
    const label = heW(base).slice(0, P.fieldMaxWords).join(' ');
    if (label.length > 1 && !out.some((f) => f.label === label)) out.push({ label, required });
  };
  for (const l0 of lines) {
    const l = l0.trim(); if (!l) continue;
    if (l.startsWith(P.requiredKey)) { req = true; continue; }
    if (l.startsWith(P.optionalKey)) { req = false; continue; }
    if (/[:：]$/.test(l) && heW(l).length <= 5) { req = false; continue; }   // תת-כותרת אחרת («חזק מאוד אם יש:») = רשות; לא שדה
    const it = /^([-*•]|\d+[.)])\s/.test(l) ? strip(l) : norm(l);
    if (!heW(it).length) continue;
    // פריט-רשימה שהוא רשימת-פריטים קצרים ⇒ כמה שדות; פריט ארוך ⇒ שדה אחד (התיאור נשמט)
    const parts = it.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
    if (parts.length >= 2 && parts.every((p) => heW(p).length <= P.fieldMaxWords)) parts.forEach((p) => push(p, req));
    else push(parts[0], req);
  }
  return out;
}

// ── 3 · חלקי-הפלט מ«מה חוזר»: פריט ממוספר = חלק; שורות-המשך = פירוט (⇒ refs לשדות או תוכן-החלק); תת-רשימה קצרה = אפשרויות-החלטה ──
function outputsFrom(lines) {
  const secs = []; let cur = null;
  for (const l0 of lines) {
    const l = l0.replace(/\s+$/, ''); if (!l.trim()) continue;
    const num = l.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (num && !/^\s{3,}/.test(l)) { cur = { name: clean(num[2].split(/[:：]/)[0]).split(' ').slice(0, 4).join(' ') || strip(num[2]), detail: [], options: [] }; const rest = num[2].split(/[:：]/).slice(1).join(':').trim(); if (rest) cur.detail.push(norm(rest)); secs.push(cur); continue; }
    if (!cur) continue;
    const opt = l.match(/^\s+[-*•]\s+(.+)$/);
    if (opt) { const o = strip(opt[1]); if (heW(o).length <= P.decisionMaxWords) cur.options.push(o); else cur.detail.push(o); continue; }
    cur.detail.push(norm(l));
  }
  return secs.filter((s) => s.name);
}

// ── 4 · תוכן: תת-סעיפים (###) עם רשימות ⇒ תוכן מתויג; רשימות ⇒ תוכן; פרוזה ⇒ תוכן ──
function contentOf(sec, group) {
  const out = [];
  const add = (tag, text) => { const t = norm(text); if (heW(t).length) out.push({ group, tag, text: t }); };
  for (const l of items(sec.lines)) add(null, l);
  for (const l of prose(sec.lines)) add(null, l);
  for (const s of sec.subs) { const tag = clean(s.head).split(' ').slice(0, 2).join(' '); const its = items(s.lines); (its.length ? its : prose(s.lines)).forEach((l) => add(tag, l)); }
  return out;
}
const q = (s) => String(s).replace(/[|\[\]=]/g, ' ').replace(/\s+/g, ' ').trim();   // טקסט-תוכן בספק: בלי סימני-הדקדוק ({…} = מקום-שמור של הודעה, G29 — נשמר)

// ── 5 · הצומת ⇒ ספק ──
export function perukToSpec(md, ns) {
  const d = parsePeruk(md);
  const S = (k) => d.sections.find((s) => s.kind === k) || null;
  const product = S('product');
  const inputSec = product ? product.subs.find((s) => P.inputsHead.some((h) => s.head.includes(h))) : null;
  const outputSec = product ? product.subs.find((s) => P.outputsHead.some((h) => s.head.includes(h))) : null;
  const fields = inputSec ? fieldsFrom(inputSec.lines) : [];
  const outputs = outputSec ? outputsFrom(outputSec.lines) : [];
  const content = []; const groups = P.groups;
  // מסגרת · בלוקים · סיווג/בדיקה · אסור · לא-נכנס · דוגמה · שרשרת
  const frame = S('frame'); if (frame) content.push(...contentOf(frame, groups.frame));
  const blocks = S('blocks'); const classify = S('classify');
  const sevSet = new Set(P.severity);
  const tagged = (sec) => sec && sec.subs.length && sec.subs.some((s) => sevSet.has(clean(s.head).split(' ')[0]));
  let severity = false; const classes = [];
  for (const sec of [blocks, classify].filter(Boolean)) {
    if (tagged(sec)) { severity = true; content.push(...contentOf(sec, groups.check).map((c) => ({ ...c, tag: sevSet.has(clean(c.tag || '').split(' ')[0]) ? clean(c.tag).split(' ')[0] : c.tag }))); }
    else if (sec.kind === 'classify' && sec.subs.length) { sec.subs.forEach((s) => { classes.push(clean(s.head).split(' ').slice(0, 3).join(' ')); }); content.push(...contentOf(sec, groups.classify)); }
    else content.push(...contentOf(sec, groups.blocks));
  }
  // אסור/חובה: סעיף «אסור» — או בלוק בתוך כל סעיף שמתחיל ב-"אסור…:" (רשימה) / "חובה…:" (שורה מצוטטת) — הכל מבני
  let disclaimer = null; const forbidden = [];
  const forbRe = new RegExp('^' + P.groups.forbidden + '(?![֐-׿])'), mustRe = new RegExp('^' + P.mustKey + '(?![֐-׿])');   // \b לא עובד על עברית
  const quoted = (raw) => /^\s*[«"]/.test(raw);
  for (const sec of d.sections) {
    const ls = allText(sec); let mode = sec.kind === 'forbidden' ? 'forb' : null;
    for (const raw of ls) {
      const t = norm(raw); if (!heW(t).length) { if (sec.kind !== 'forbidden') mode = null; continue; }
      if (forbRe.test(t) && /[:：]?$/.test(t) && heW(t).length <= 3) { mode = 'forb'; continue; }
      if (mustRe.test(t) && heW(t).length <= 3) { mode = 'must'; continue; }
      if (mode === 'must' || (sec.kind === 'forbidden' && quoted(raw) && (/^לא\s/.test(t) || /ייעוץ|חוות/.test(t)))) { if (quoted(raw) && !disclaimer) disclaimer = t; mode = sec.kind === 'forbidden' ? 'forb' : null; continue; }
      if (mode === 'forb') forbidden.push(strip(t));
    }
  }
  if (!disclaimer) { for (const sec of d.sections) for (const raw of allText(sec)) { const t = norm(raw); if (quoted(raw) && /לא ייעוץ|לא חוות/.test(t)) { disclaimer = t; break; } if (disclaimer) break; } }
  forbidden.forEach((t) => content.push({ group: groups.forbidden, tag: null, text: t }));
  let disclaimerDefault = false;
  if (!disclaimer && P.defaultDisclaimer) { disclaimer = P.defaultDisclaimer; disclaimerDefault = true; }   // הכרעה-29 §11: חוקי-האחריות של המוצר = ברירת-מחדל כשהפירוק לא כתב הסתייגות — מדווח (⚠), לא מומצא
  if (disclaimer) content.push({ group: groups.disclaimer, tag: null, text: disclaimer });
  const notin = S('notin'); if (notin) content.push(...contentOf(notin, groups.notin));
  const ex = S('example'); if (ex) content.push(...contentOf(ex, groups.example));
  const chainSec = S('chain'); const chain = chainSec ? items(chainSec.lines).map((x) => x.replace(/^\d+[.)]\s*/, '')) : [];
  const price = S('price'); const prices = price ? items(price.lines).concat(prose(price.lines)).map((l) => { const m = l.match(/(\d[\d,]*)\s*₪/); return m ? { label: l.split(/[:：]/)[0].trim(), ils: +m[1].replace(/,/g, '') } : null; }).filter(Boolean) : [];
  // G29 · זוגות ישן/חדש מהבלוקים ("שכ״ד ישן מול חדש") ⇒ שני שדות-מספר + חלקיק-דיף; מכפיל-לשנה כשהבסיס חודשי (peruk-lang.monthlyWords)
  const pairs = [];
  const longest = (ws) => ws.slice().sort((a, b) => b.length - a.length).join('|');   // הארוך קודם — אחרת 'חדש' תופס לפני 'חדשות'
  const pairRe = new RegExp('^(.+?)\\s+(' + longest(P.oldWords) + ')\\s+' + P.vsWord + '\\s+(' + longest(P.newWords) + ')');
  for (const sec of [blocks].filter(Boolean)) for (const raw of allText(sec)) { const m = norm(raw).replace(/^\d+[.)]\s*/, '').match(pairRe); if (!m) continue; const base = heW(m[1].replace(/\(.*?\)/g, '')).slice(-2).join(' '); if (!base) continue; const monthly = P.monthlyWords.some((w) => base.includes(w)); pairs.push({ a: `${base} ${m[2]}`, b: `${base} ${m[3]}`, factor: monthly ? 12 : 0 }); }
  for (const pr of pairs) for (const lbl of [pr.a, pr.b]) if (!fields.some((f) => f.label === lbl)) fields.push({ label: lbl, required: false, num: true });
  // החלטה: חלק-פלט עם אפשרויות קצרות ⇒ שדה-enum על השורש
  const decisions = outputs.filter((o) => o.options.length >= P.decisionMinOptions && o.options.length <= P.decisionMaxOptions).map((o) => ({ label: o.name, enumVals: o.options.map((x) => clean(x).split(' ').slice(0, 4).join(' ')).filter(Boolean) }));
  // ── ספק ──
  const root = P.rootNoun, fnd = P.findingNoun;
  const fieldStr = (f) => `${f.label}${f.enumVals ? `{${f.enumVals.join('|')}}` : ''}${f.num ? P.numRange : ''}${f.required ? '*' : ''}`;
  const rootFields = [...P.personFields, ...fields.map(fieldStr), ...decisions.map((dd) => `${dd.label}{${dd.enumVals.join('|')}}`), ...(classes.length ? [`${P.classifyField}{${classes.join('|')}}`] : [])];
  const lines = [];
  lines.push(`${G.appWord}: ${d.title || ns}`);
  lines.push(`${G.lookWord}: ${P.look}`);                                   // G28 · עור-הנייר של «בלגן»
  if (chain.length) lines.push(`${G.chainWord}: ${chain.map((c) => c.replace(/[,،]/g, ' ')).join(', ')}`);   // G32 · הצעד-הבא (P14)
  for (const [tgt, q] of P.questions || []) lines.push(`${G.questionWord} ${tgt}: ${q}`);   // G28 · מסך = שאלה אחת
  lines.push(`${G.entityNouns[0]} ${root} ${G.withWord} ${rootFields.join(', ')} | ${G.stagePrefixes[0]} ${P.stages.join(', ')}`);
  if (severity) lines.push(`${G.entityNouns[0]} ${fnd} ${G.withWord} ${P.findingFields.map((f, i) => i === 0 ? f.replace(/\*$/, '') + '*' : f).join(', ')}, ${P.severityField}{${P.severity.join('|')}} | ${G.markDelete[0]}: ${root}=${Object.keys(G.delPolicies)[0]}`);
  lines.push(`${P.dashWord} ${G.withWord} ${P.dashboardCount}(${root})${severity ? `, ${P.sevCount || P.dashboardCount}(${fnd}: ${P.severityField}=${P.severity[0]})` : ''}`);
  lines.push(`${P.roleWord} ${P.roleAll}`);
  lines.push(`${G.particleWord} ${root}: [${G.pTable[0]}]`);
  lines.push(`${G.particleWord} ${root}: [${G.pAct[0]}] ${P.openAction}`);
  lines.push(`${G.particleWord} ${root}: [${G.pEmpty[0]}] ${P.emptyText}`);
  const groupNames = [...new Set(content.map((c) => c.group))];
  for (const g of groupNames) if (g !== groups.disclaimer && g !== groups.example) lines.push(`${G.particleWord} ${severity && g === groups.check ? fnd : root}: ${g} = [${G.pContent[0]} ${g}]`);
  if (severity) lines.push(`${G.particleWord} ${fnd}: ${P.severityField}`);
  // דוח: חלק לכל פריט של «מה חוזר»; refs = שדות שתואמים בפירוט, אחרת תוכן-החלק
  const fieldLabels = rootFields.map((f) => f.replace(/[{*].*$/, '').trim());
  const stemOf = (w) => w.replace(/^[בלהומשכ](?=..)/, '').replace(/(יות|ים|ות|ה)$/, '');
  const matchField = (txt) => { const ws = heW(txt).map(stemOf); return fieldLabels.find((f) => { const fw = heW(f).map(stemOf); return fw.length && fw.every((w) => ws.includes(w)); }) || null; };
  const kindOfOut = (name) => Object.entries(P.outputKinds).find(([, ws]) => ws.some((w) => name.includes(w)))?.[0] || null;
  const dateFields = fieldLabels.filter((f) => G.typeDate.some((w) => f.includes(w)));
  const extraParticles = [];
  for (const o of outputs) {
    const kind = kindOfOut(o.name);
    // G29 · צורות-פלט: דיף (יש זוגות) · מספר (שדה-מספרי תואם) · הודעה (יש החלטה) · לוח (יש תאריכים) — אחרת נופל לתוכן
    if (kind === 'diff' && pairs.length) { extraParticles.push(`${G.particleWord} ${root}: ${o.name} = [${G.pDiff[0]}] ${pairs.map((pr) => `${pr.a} ${G.pairArrow[0]} ${pr.b}${pr.factor ? ` × ${pr.factor}` : ''}`).join('; ')}`); lines.push(`${G.reportWord} ${root}: ${o.name} = ${o.name}`); continue; }
    if (kind === 'number') { const nf = fields.find((f) => f.num && matchField(f.label) && heW(o.name).map(stemOf).some((w) => heW(f.label).map(stemOf).includes(w))); if (nf) { extraParticles.push(`${G.particleWord} ${root}: ${o.name} = [${G.pNumber[0]}] ${nf.label}${o.detail.length ? `: ${q(o.detail[0])}` : ''}`); lines.push(`${G.reportWord} ${root}: ${o.name} = ${o.name}`); continue; } }
    if (kind === 'message' && decisions.length) {
      const dec = decisions[0]; const tpl = P.messageTemplate.replace(/\{([^}]+)\}/g, (m0, ph) => ph === G.pValueWord || ph.includes('.') ? m0 : (matchField(ph) ? `{${matchField(ph)}}` : ''));
      content.push({ group: P.messageGroup, tag: null, text: tpl });
      extraParticles.push(`${G.particleWord} ${root}: ${o.name} = [${G.pMessage[0]}] ${dec.label} = [${G.pContent[0]} ${P.messageGroup}]`); lines.push(`${G.reportWord} ${root}: ${o.name} = ${o.name}`); continue;
    }
    if (kind === 'dates' && dateFields.length) { extraParticles.push(`${G.particleWord} ${root}: ${o.name} = [${G.pDates[0]}]`); lines.push(`${G.reportWord} ${root}: ${o.name} = ${o.name}`); continue; }
    const refs = []; const rest = [];
    for (const dline of o.detail) for (const part of dline.split(/(?<!\d)[,،.](?!\d)/).map((x) => x.trim()).filter(Boolean)) { const f = matchField(part); if (f && !refs.includes(f)) refs.push(f); else rest.push(part); }
    if (o.options.length) { const dec = decisions.find((dd) => dd.label === o.name); if (dec && !refs.includes(dec.label)) refs.push(dec.label); }
    if (severity && P.severity.some((c) => o.name.includes(c))) refs.push(`${fnd}.${P.severityField}`);
    const grp = o.name; const texts = rest.filter((t) => heW(t).length >= 2);
    texts.forEach((t) => content.push({ group: grp, tag: null, text: t }));
    if (texts.length) refs.push(`[${G.pContent[0]} ${grp}]`);
    if (!refs.length) { content.push({ group: grp, tag: null, text: o.name }); refs.push(`[${G.pContent[0]} ${grp}]`); }
    lines.push(`${G.reportWord} ${root}: ${o.name} = ${refs.join(', ')}`);
  }
  if (dateFields.length && !outputs.some((o) => kindOfOut(o.name) === 'dates')) { extraParticles.push(`${G.particleWord} ${root}: ${P.datesLabel} = [${G.pDates[0]}]`); lines.push(`${G.reportWord} ${root}: ${P.datesLabel} = ${P.datesLabel}`); }   // G29 · לוח תמיד כשיש תאריכים
  lines.push(...extraParticles);
  if (disclaimer) lines.push(`${G.reportWord} ${root}: ${P.reportDisclaimer} = [${G.pContent[0]} ${groups.disclaimer}]`);
  const phone = P.personFields.find((f) => /טלפון/.test(f));
  if (phone) lines.push(`${G.reportWord} ${root}: [${G.pExport[0]}] ${P.exportLabel} = ${phone.replace(/\*$/, '')}, ${P.exportGoal}`);
  for (const c of content) lines.push(`${G.contentWord} ${c.group}${c.tag ? ` [${c.tag}]` : ''}: ${q(c.text)}`);
  const node = { id: d.id, ns, title: d.title, moment: d.moment, category: d.category, not: d.not, fields: fields.length, outputs: outputs.map((o) => o.name), severity, classes, decisions: decisions.map((x) => x.label), prices, chain, forbidden: forbidden.length, disclaimer: disclaimerDefault ? 'default' : !!disclaimer, content: content.length };
  return { spec: lines.join('\n') + '\n', node, doc: d };
}

// ── main: --all ⇒ כל peruks/*.md ⇒ specs-ds/peruk-NN.txt + peruk-index.json · --gate ⇒ אימות ──
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dir = path.join(GEN, 'peruks'); const out = path.join(GEN, 'specs-ds');
  const docs = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
  const gate = process.argv.includes('--gate'); let bad = 0; const index = [];
  for (const f of docs) {
    const ns = f.replace(/\.md$/, '').replace(/-/g, '');
    const { spec, node } = perukToSpec(fs.readFileSync(path.join(dir, f), 'utf8'), ns);
    const specPath = path.join(out, `${ns}.txt`);
    const probs = [];
    if (!node.fields) probs.push('אין שדות-קליטה (מה שולחים)');
    if (!node.outputs.length) probs.push('אין חלקי-פלט (מה חוזר)');
    if (!node.disclaimer) probs.push('אין הסתייגות (חובה: «לא ייעוץ…»)');
    if (node.disclaimer === 'default') console.log(`⚠ ${f}: בלי הסתייגות כתובה — הסתייגות-המוצר (הכרעה-29 §11)`);
    if (!node.forbidden) probs.push('אין רשימת-אסור');
    if (gate) {
      const cur = fs.existsSync(specPath) ? fs.readFileSync(specPath, 'utf8') : null;
      if (cur !== spec) probs.push(`הספק בדיסק ≠ המחולל (הרץ node machtzev/generator/peruk.mjs --all)`);
    } else fs.writeFileSync(specPath, spec);
    index.push(node);
    if (probs.length) { bad++; console.log(`🔴 ${f}: ${probs.join(' · ')}`); }
    else console.log(`✓ ${f} ⇒ ${ns}: ${node.fields} שדות · ${node.outputs.length} חלקים · ${node.content} תוכן${node.severity ? ' · אדום/צהוב/ירוק' : ''}${node.classes.length ? ` · סיווג ${node.classes.length}` : ''}${node.decisions.length ? ` · החלטה ${node.decisions.length}` : ''} · שרשרת ${node.chain.length}`);
  }
  if (!gate) fs.writeFileSync(path.join(GEN, 'peruk-index.json'), JSON.stringify(index, null, 1));
  else { const stored = fs.existsSync(path.join(GEN, 'peruk-index.json')) ? fs.readFileSync(path.join(GEN, 'peruk-index.json'), 'utf8') : ''; if (stored !== JSON.stringify(index, null, 1)) { bad++; console.log('🔴 peruk-index.json ≠ המחולל'); } }
  if (bad) process.exit(1);
  console.log(`${gate ? '✓ peruk' : '📄 peruk'}: ${docs.length} פירוקים ⇒ ${docs.length} ספקים (הכרעה-27 · G27)`);
}
