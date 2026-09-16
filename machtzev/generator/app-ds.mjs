#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  app-ds.mjs — הדלת-האחת על מערכת-העיצוב: אפיון ⇒ אפליקציה שלמה מעוצבת-פרימיום.
//  ישויות ⇒ טופס-DS (טיפוס נאחז מהאטומים) · דשבורדים ⇒ רשת-KPI מנתוני-הישויות ·
//  לוח-ניווט · מסכי-מערכת. הכל דרך render-ds (טהור). שימוש: node app-ds.mjs -f spec.txt
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { interpret as entInterpret } from './entity.mjs';
import { renderEntity, renderDashboard, renderHub, renderSystem, renderWizard } from './render-ds.mjs';
// 🧙 אטומי-האשף מהמדף — המחולל מרכיב מעליהם, לא כותב אשף חדש (THE-WAY).
import { VERTICAL_PACKS } from '../../new/atoms/vertical-packs.mjs';
import { wizardIndustries } from '../../new/atoms/wizard-industries.mjs';
import { WIZARD_STEPS } from '../../new/atoms/wizard-steps.mjs';
import { EMPTY_WIZARD } from '../../new/atoms/empty-wizard.mjs';
import { wizardStepError } from '../../new/atoms/wizard-step-error.mjs';
import { WIZARD_STEP_ERROR_T } from '../../new/atoms/wizard-step-error-strings.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = path.join(ROOT, 'new/dart-gen-bs');
const DATA = path.join(ROOT, 'new/dart-data-bs/auto');
const ENTITY_RE = /^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/;
const ROLE_RE = /^\s*(תפקיד|הרשאת)\s+/;
const clean = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]).join(' ').slice(0, 40);
// שם-האפליקציה ⇒ תו-שם לטיני יציב לקובץ ולמחלקה (דטרמיניסטי מהקלט, אפס-ניחוש).
const appSlug = (name, spec) => String(name || '').replace(/^.*\//, '').replace(/\.[^.]*$/, '')
  .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()
  || ('a' + createHash('sha1').update(spec).digest('hex').slice(0, 8));
// 🧙 בדיקת-חוזה בזמן-חילול: שלב-התחום הריק מחזיר בדיוק את מחרוזת-האטום (k1).
const wizardContractOk = () => wizardStepError(0, { ...EMPTY_WIZARD }, () => '', WIZARD_STEP_ERROR_T) === WIZARD_STEP_ERROR_T.k1;

export function buildApp(specText, appName) {
  const all = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const lines = all.filter((l) => !ROLE_RE.test(l));
  const info = lines.map((line, idx) => ({ line, i: idx + 1, isEnt: ENTITY_RE.test(line) }));

  // מקדימים: כל הישויות (לצורך תוכן-הדשבורדים)
  const entRes = {};
  for (const li of info) if (li.isEnt) entRes[li.i] = entInterpret(li.line);
  const entMeta = Object.values(entRes).map((r) => ({ name: r.entity, fields: r.schema.length, stages: (r.stages || []).length, icon: '🗂️' }));

  // ניקוי פלט-app קודם
  for (const f of fs.readdirSync(OUT)) if (/^gen_app_.*\.dart$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  for (const f of fs.readdirSync(DATA)) if (/^gen_app_.*_content\.dart$/.test(f)) fs.unlinkSync(path.join(DATA, f));

  const screens = [];
  for (const li of info) {
    if (li.isEnt) {
      const r = entRes[li.i];
      const slug = `app_ent${li.i}`;
      const { cls } = renderEntity(slug, { name: r.entity, icon: '🗂️', schema: r.schema, stages: r.stages || [] });
      screens.push({ slug, cls, name: r.entity, icon: '🗂️', sub: `${r.schema.length} שדות${(r.stages || []).length ? ` · ${r.stages.length} שלבים` : ''}` });
    } else {
      const slug = `app_scr${li.i}`;
      const title = clean(li.line);
      const { cls } = renderDashboard(slug, { title, icon: '📊', entities: entMeta });
      screens.push({ slug, cls, name: title, icon: '📊', sub: `${entMeta.length} מודולים` });
    }
  }

  // מסכי-מערכת
  const sys = [];
  const a = renderSystem('app_audit', { title: 'יומן פעולות', icon: '🧾', sectionTitle: 'פעולות אחרונות', kind: 'empty', items: ['כל שינוי במערכת יתועד כאן'] });
  sys.push({ ...a, name: 'יומן פעולות', icon: '🧾', sub: 'audit · תיעוד מלא' });
  const fl = renderSystem('app_flags', { title: 'דגלי-יכולת', icon: '🎚️', sectionTitle: 'מודולים', kind: 'toggles', items: entMeta.slice(0, 12).map((e) => e.name) });
  sys.push({ ...fl, name: 'דגלי-יכולת', icon: '🎚️', sub: 'הפעלה/כיבוי מודולים' });
  const st = renderSystem('app_settings', { title: 'הגדרות', icon: '⚙️', sectionTitle: 'סנכרון · גיבוי · הרשאות', kind: 'toggles', items: ['עבודה אופליין', 'גיבוי אוטומטי', 'הצפנת-ענן'] });
  sys.push({ ...st, name: 'הגדרות', icon: '⚙️', sub: 'סנכרון · הרשאות' });

  // ── 🧙 אשף-הבעלים של *האפליקציה הזאת*: הספקות שלה הם שלה — שלב-תחום (13 חבילות
  //    מאטום-הוורטיקל), שלב לכל ישות עם כל מועמד שהמנוע שקל, שלב-שדות, וסרגל-חי.
  if (!wizardContractOk()) throw new Error('🚨 אטום wizard-step-error אינו מקיים את חוזהו — אין מרכיבים אשף');
  const app = appSlug(appName, specText);
  const ents = Object.values(entRes).map((r) => ({ name: r.entity, schema: r.schema, stages: r.stages || [] }));
  // מסכים: ישויות+דשבורדים · מערכת · לוח · האשף עצמו.
  const screenCount = screens.length + sys.length + 2;
  const wiz = renderWizard(`app_wizard_${app}`, { entities: ents, screenCount });
  const wizTile = { slug: wiz.slug, cls: wiz.cls, name: 'אשף האפליקציה', icon: '🧙', sub: `${wiz.steps} שלבים · ${wiz.options} מתגים · ${wiz.inventions} המצאות` };

  renderHub('app_hub', { title: 'האפליקציה שלי', icon: '🏗️', screens: [...screens, ...sys, wizTile] });

  return { screens, sys, wiz, steps: WIZARD_STEPS, industries: wizardIndustries(VERTICAL_PACKS).length };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  let spec;
  if (process.argv[2] === '-f') spec = fs.readFileSync(process.argv[3], 'utf8');
  else spec = process.argv.slice(2).join('\n');
  if (!spec.trim()) { console.error('שימוש: node app-ds.mjs -f spec.txt'); process.exit(1); }
  const { screens, sys, wiz, industries } = buildApp(spec, process.argv[2] === '-f' ? process.argv[3] : '');
  const ents = screens.filter((s) => s.icon === '🗂️');
  console.log(`\n✨ אפליקציה (מערכת-עיצוב) חוללה — ${screens.length + sys.length + 2} מסכים`);
  console.log(`   ${ents.length} ישויות · ${screens.length - ents.length} דשבורדים · ${sys.length} מערכת · 1 לוח · 1 אשף`);
  console.log(`   🧙 ${wiz.slug}.dart — ${wiz.steps} שלבים (תחום ${industries} כפתורים ⇐ ישות-לכל-ישות ⇐ שדות) · ${wiz.options} מתגים דלוקים · ${wiz.inventions} המצאות`);
  console.log('   הכל דרך render-ds הטהור (טיפוס נאחז מהאטומים · אפס regex).');
}
