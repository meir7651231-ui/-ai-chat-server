#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  app.mjs — הדלת-האחת של המחולל: אפיון ⇒ אפליקציה שלמה
//  כל שורה בתיאור מנותבת למנוע הנכון: "ישות X עם …" ⇒ entity.mjs (טופס+טבלה);
//  אחרת ⇒ nl.mjs (מסך UI+לוגיקה). כל המסכים מחוללים + לוח-ניווט אחד + workflow
//  (קידום-סטטוס לישות עם שדה-סטטוס) + אינוונטר-פלט מלא. הכל מהמדף, מתקמפל.
//  שימוש:  node app.mjs "<שורה לכל מסך/ישות>"   |   node app.mjs -f spec.txt
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { interpret as nlInterpret } from './nl.mjs';
import { interpret as entInterpret } from './entity.mjs';
import { retrieveLogic } from './match.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ENTITY_RE = /^\s*(צור\s+)?(ישות|טופס|טבלת)(\s|$)/;
const ROLE_RE = /^\s*(תפקיד|הרשאת)\s+/;
const slugify = (i, kind) => `app_${kind}${i}`;
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]).join(' ').slice(0, 30);

function buildApp(specText) {
  const allLines = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const roleLines = allLines.filter((l) => ROLE_RE.test(l));
  const lines = allLines.filter((l) => !ROLE_RE.test(l));
  const screens = [];
  let i = 0;
  for (const line of lines) {
    i++;
    const isEntity = ENTITY_RE.test(line);
    let r, slug, kind;
    if (isEntity) {
      kind = 'ent'; slug = slugify(i, kind);
      r = entInterpret(line);
      screens.push({ slug, kind, name: r.entity, spec: r.spec, schema: r.schema, stages: r.stages || [] });
    } else {
      kind = 'scr'; slug = slugify(i, kind);
      r = nlInterpret(line);
      screens.push({ slug, kind, name: r.title, spec: r.spec, atoms: (r.spec.match(/^אטום (\w+)/gm) || []).length });
    }
    // חילול המסך
    fs.writeFileSync(path.join(HERE, `specs/${slug}.txt`), r.spec + '\n');
    execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), slug, r.spec], { encoding: 'utf8' });
  }
  // 🧩 שכבות-מערכת אוטומטיות (audit · דגלים · סנכרון) — כל אפליקציה מקבלת אותן.
  const entNames = screens.filter((s) => s.kind === 'ent').map((s) => s.name);
  const sysSpecs = {
    app_audit: ['הירו 🧾 יומן פעולות | audit — כל שינוי מתועד', 'כותרת פעולות אחרונות', 'אטום DataGrid יומן פעולות', 'חישוב תיעוד פעולה (runAudit)', 'באנר audit: משתמש · פעולה · ערך-קודם · ערך-חדש · תאריך'],
    app_flags: ['הירו 🎚️ דגלי-יכולת | הפעלה/כיבוי מודולים', 'כותרת מודולים', ...entNames.slice(0, 12).map((n) => `אטום AnimatedToggle ${n}`), 'באנר כיבוי מודול לא מוחק נתונים — rollback נשמר'],
    app_settings: ['הירו ⚙️ הגדרות | סנכרון · גיבוי · הרשאות', 'אטום LiveStatusDot מחובר · מסונכרן', 'אטום AnimatedToggle עבודה אופליין', 'אטום NeonButton גיבוי עכשיו', 'באנר סנכרון · זיהוי-התנגשויות · גיבוי · ייצוא'],
  };
  const sysScreens = [];
  for (const [slug, sl] of Object.entries(sysSpecs)) {
    const spec = sl.join('\n');
    fs.writeFileSync(path.join(HERE, `specs/${slug}.txt`), spec + '\n');
    execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), slug, spec], { encoding: 'utf8' });
    sysScreens.push({ slug, kind: 'sys', name: { app_audit: '🧾 יומן פעולות', app_flags: '🎚️ דגלי-יכולת', app_settings: '⚙️ הגדרות' }[slug] });
  }

  // 🧭 לוח-ניווט: מסך-אב שמקשר לכל המסכים + מסכי-המערכת
  const hubLines = ['הירו 🏗️ האפליקציה שלי | נבנתה מאפיון-חופשי', 'אטום LiveStatusDot מחובר · מסונכרן'];
  for (const s of screens) hubLines.push(`ניווט ${s.slug} ${s.kind === 'ent' ? '🗂️' : '📊'} ${s.name}`);
  for (const s of sysScreens) hubLines.push(`ניווט ${s.slug} ${s.name}`);
  hubLines.push(`באנר ${screens.length + sysScreens.length} מסכים · אפליקציה שלמה: ישויות · workflows · הרשאות · audit · דגלים · סנכרון`);
  const hubSpec = hubLines.join('\n');
  fs.writeFileSync(path.join(HERE, 'specs/app_hub.txt'), hubSpec + '\n');
  execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), 'app_hub', hubSpec], { encoding: 'utf8' });

  // 🔐 מטריצת-הרשאות: "תפקיד <שם>: <מסכים>" ⇒ תפקיד → אילו מסכים גלויים.
  const roles = roleLines.map((l) => {
    const [rn, allow] = l.replace(ROLE_RE, '').split(/\s*:\s*/);
    const role = heWords(rn);
    const all = /הכל|כל המסכים/.test(allow || '');
    const allowed = all ? screens.map((s) => s.slug)
      : screens.filter((s) => (allow || '').split(/[,\n]/).some((w) => s.name.includes(w.trim()) || w.trim().includes(s.name))).map((s) => s.slug);
    return { role, all, allowed };
  });
  return { screens, roles, sysScreens };
}

// ── CLI ──
if (import.meta.url === 'file://' + process.argv[1]) {
  let specText;
  if (process.argv[2] === '-f') specText = fs.readFileSync(process.argv[3], 'utf8');
  else specText = process.argv.slice(2).join('\n');
  if (!specText.trim()) { console.error('שימוש: node app.mjs "<שורה לכל מסך/ישות>"  |  node app.mjs -f spec.txt'); process.exit(1); }

  const { screens, roles, sysScreens } = buildApp(specText);
  const ents = screens.filter((s) => s.kind === 'ent');
  const scrs = screens.filter((s) => s.kind === 'scr');
  const wfs = ents.filter((e) => e.stages && e.stages.length >= 2);
  console.log('\n🏗️ ═══ אפליקציה חוללה ═══');
  console.log(`📦 ${screens.length} מסכים · ${ents.length} ישויות · ${scrs.length} מסכי-UI · ${wfs.length} workflows · ${roles.length} תפקידים · 1 לוח-ניווט\n`);
  console.log('🗂️ ישויות (טופס + טבלה):');
  for (const e of ents) console.log(`   ${e.name} — ${e.schema.length} שדות${e.stages && e.stages.length ? ` · 🔄 ${e.stages.join('›')}` : ''}`);
  console.log('\n📊 מסכי-UI:');
  for (const s of scrs) console.log(`   ${s.name} — ${s.atoms} אטומים`);
  if (roles.length) {
    console.log('\n🔐 מטריצת-הרשאות:');
    for (const r of roles) console.log(`   ${r.role} → ${r.all ? 'כל המסכים' : r.allowed.length + ' מסכים'}`);
  }
  console.log('\n🧩 שכבות-מערכת אוטומטיות: ' + sysScreens.map((s) => s.name).join(' · '));
  console.log('🧭 לוח-ניווט: app_hub (מקשר את כל ' + (screens.length + sysScreens.length) + ' המסכים) + חיווי-סנכרון');
  console.log('▶ הכל חולל דרך genesis-gen — מתקמפל.');
  // אינוונטר-פלט מלא (§49) — JSON לצריכה/דמו
  const inv = { screens: screens.length, entities: ents.map((e) => ({ name: e.name, fields: e.schema.length, stages: e.stages || [] })), uiScreens: scrs.map((s) => s.name), workflows: wfs.length, roles };
  fs.writeFileSync(path.join(HERE, 'app-inventory.json'), JSON.stringify(inv, null, 1));
  console.log('📄 אינוונטר: machtzev/generator/app-inventory.json');
}
