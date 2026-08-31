#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  app-ds.mjs — הדלת-האחת על מערכת-העיצוב: אפיון ⇒ אפליקציה שלמה מעוצבת-פרימיום.
//  ישויות ⇒ טופס-DS (טיפוס נאחז מהאטומים) · דשבורדים ⇒ רשת-KPI מנתוני-הישויות ·
//  לוח-ניווט · מסכי-מערכת. הכל דרך render-ds (טהור). שימוש: node app-ds.mjs -f spec.txt
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { interpret as entInterpret } from './entity.mjs';
import { renderEntity, renderDashboard, renderHub, renderSystem } from './render-ds.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = path.join(ROOT, 'new/dart-gen-bs');
const DATA = path.join(ROOT, 'new/dart-data-bs/auto');
const ENTITY_RE = /^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/;
const ROLE_RE = /^\s*(תפקיד|הרשאת)\s+/;
const clean = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]).join(' ').slice(0, 40);

// אשף-תפקיד: 'תפקיד NAME: א, ב, ג' ⇒ {name, all, ents}. 'הכל' ⇒ גישה-מלאה.
function parseRole(line) {
  const body = line.replace(ROLE_RE, '');
  const ci = body.indexOf(':');
  const name = (ci >= 0 ? body.slice(0, ci) : body).trim();
  const rest = ci >= 0 ? body.slice(ci + 1) : '';
  const all = rest.includes('הכל');   // ‏\b הוא ASCII בלבד — לא נדלק על עברית
  const ents = all ? [] : rest.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
  return { name, all, ents };
}

export function buildApp(specText) {
  const all = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const roles = all.filter((l) => ROLE_RE.test(l)).map(parseRole);
  const lines = all.filter((l) => !ROLE_RE.test(l));
  const info = lines.map((line, idx) => ({ line, i: idx + 1, isEnt: ENTITY_RE.test(line) }));

  // מקדימים: כל הישויות (לתוכן-הדשבורדים ולזיהוי-קשרים בין-ישויות)
  const entRes = {};
  for (const li of info) if (li.isEnt) entRes[li.i] = entInterpret(li.line);
  const entMeta = Object.values(entRes).map((r) => ({ name: r.entity, fields: r.schema.length, stages: (r.stages || []).length, icon: '🗂️' }));
  const entityNames = entMeta.map((e) => e.name);

  // ניקוי פלט-app קודם
  for (const f of fs.readdirSync(OUT)) if (/^gen_app_.*\.dart$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  for (const f of fs.readdirSync(DATA)) if (/^gen_app_.*_content\.dart$/.test(f)) fs.unlinkSync(path.join(DATA, f));

  const screens = [];
  for (const li of info) {
    if (li.isEnt) {
      const r = entRes[li.i];
      const slug = `app_ent${li.i}`;
      const { cls } = renderEntity(slug, { name: r.entity, icon: '🗂️', schema: r.schema, stages: r.stages || [], entityNames });
      screens.push({ slug, cls, kind: 'entity', name: r.entity, icon: '🗂️', sub: `${r.schema.length} שדות${(r.stages || []).length ? ` · ${r.stages.length} שלבים` : ''}` });
    } else {
      const slug = `app_scr${li.i}`;
      const title = (li.line.split(/\s+עם\s+/)[0] || li.line).trim();     // כותרת = לפני 'עם'
      const metrics = (li.line.split(/\s+עם\s+/)[1] || '').split(/[\s,]+/).filter(Boolean);   // מדדים = אחרי 'עם'
      const { cls } = renderDashboard(slug, { title: clean(title), icon: '📊', entities: entMeta, metrics });
      screens.push({ slug, cls, kind: 'dashboard', name: clean(title), icon: '📊', sub: `${metrics.length || entMeta.length} מדדים` });
    }
  }

  // מסכי-מערכת (kind='system' — גלויים רק לתפקיד 'הכל')
  const sys = [];
  const a = renderSystem('app_audit', { title: 'יומן פעולות', icon: '🧾', sectionTitle: 'פעולות אחרונות', kind: 'empty', items: ['כל שינוי במערכת יתועד כאן'] });
  sys.push({ ...a, kind: 'system', name: 'יומן פעולות', icon: '🧾', sub: 'audit · תיעוד מלא' });
  const fl = renderSystem('app_flags', { title: 'דגלי-יכולת', icon: '🎚️', sectionTitle: 'מודולים', kind: 'toggles', items: entMeta.slice(0, 12).map((e) => e.name) });
  sys.push({ ...fl, kind: 'system', name: 'דגלי-יכולת', icon: '🎚️', sub: 'הפעלה/כיבוי מודולים' });
  const st = renderSystem('app_settings', { title: 'הגדרות', icon: '⚙️', sectionTitle: 'סנכרון · גיבוי · הרשאות', kind: 'toggles', items: ['עבודה אופליין', 'גיבוי אוטומטי', 'הצפנת-ענן'] });
  sys.push({ ...st, kind: 'system', name: 'הגדרות', icon: '⚙️', sub: 'סנכרון · הרשאות' });

  renderHub('app_hub', { title: 'האפליקציה שלי', icon: '🏗️', screens: [...screens, ...sys], roles });

  return { screens, sys, roles };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  let spec;
  if (process.argv[2] === '-f') spec = fs.readFileSync(process.argv[3], 'utf8');
  else spec = process.argv.slice(2).join('\n');
  if (!spec.trim()) { console.error('שימוש: node app-ds.mjs -f spec.txt'); process.exit(1); }
  const { screens, sys } = buildApp(spec);
  const ents = screens.filter((s) => s.icon === '🗂️');
  console.log(`\n✨ אפליקציה (מערכת-עיצוב) חוללה — ${screens.length + sys.length + 1} מסכים`);
  console.log(`   ${ents.length} ישויות · ${screens.length - ents.length} דשבורדים · ${sys.length} מערכת · 1 לוח`);
  console.log('   הכל דרך render-ds הטהור (טיפוס נאחז מהאטומים · אפס regex).');
}
