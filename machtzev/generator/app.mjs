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
const slugify = (i, kind) => `app_${kind}${i}`;
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]).join(' ').slice(0, 30);

function buildApp(specText) {
  const lines = specText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 2);
  const screens = [];
  let i = 0;
  for (const line of lines) {
    i++;
    const isEntity = ENTITY_RE.test(line);
    let r, slug, kind;
    if (isEntity) {
      kind = 'ent'; slug = slugify(i, kind);
      r = entInterpret(line);
      // 🔄 workflow: ישות עם שדה-סטטוס ⇒ כפתור קידום-סטטוס (הפעולה שתחווט את
      // advanceStatus כשהרשומה בהיקף — לא מאלצים wire שגוי על פונקציה לא-מתאימה).
      if (/סטטוס|מצב/.test(line)) {
        const hasAdvance = retrieveLogic('קידום סטטוס מצב', 8, false).some((l) => /advance|advanceStatus/i.test(l.name));
        r.spec = r.spec.replace(/\nבאנר/, `\nכותרת מעבר-סטטוס\nאטום NeonButton קדם סטטוס\nבאנר`);
        r.workflow = hasAdvance ? 'advanceStatus (מוכן)' : 'כפתור-קידום';
      }
      screens.push({ slug, kind, name: r.entity, spec: r.spec, schema: r.schema, workflow: r.workflow || null });
    } else {
      kind = 'scr'; slug = slugify(i, kind);
      r = nlInterpret(line);
      screens.push({ slug, kind, name: r.title, spec: r.spec, atoms: (r.spec.match(/^אטום (\w+)/gm) || []).length });
    }
    // חילול המסך
    fs.writeFileSync(path.join(HERE, `specs/${slug}.txt`), r.spec + '\n');
    execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), slug, r.spec], { encoding: 'utf8' });
  }
  // 🧭 לוח-ניווט: מסך-אב שמקשר לכל המסכים
  const hubLines = ['הירו 🏗️ האפליקציה שלי | נבנתה מאפיון-חופשי'];
  for (const s of screens) hubLines.push(`ניווט ${s.slug} ${s.kind === 'ent' ? '🗂️' : '📊'} ${s.name}`);
  hubLines.push(`באנר ${screens.length} מסכים · המחולל הרכיב אפליקציה שלמה מהמדף`);
  const hubSpec = hubLines.join('\n');
  fs.writeFileSync(path.join(HERE, 'specs/app_hub.txt'), hubSpec + '\n');
  execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), 'app_hub', hubSpec], { encoding: 'utf8' });
  return screens;
}

// ── CLI ──
if (import.meta.url === 'file://' + process.argv[1]) {
  let specText;
  if (process.argv[2] === '-f') specText = fs.readFileSync(process.argv[3], 'utf8');
  else specText = process.argv.slice(2).join('\n');
  if (!specText.trim()) { console.error('שימוש: node app.mjs "<שורה לכל מסך/ישות>"  |  node app.mjs -f spec.txt'); process.exit(1); }

  const screens = buildApp(specText);
  const ents = screens.filter((s) => s.kind === 'ent');
  const scrs = screens.filter((s) => s.kind === 'scr');
  console.log('\n🏗️ ═══ אפליקציה חוללה ═══');
  console.log(`📦 ${screens.length} מסכים · ${ents.length} ישויות · ${scrs.length} מסכי-UI · 1 לוח-ניווט\n`);
  console.log('🗂️ ישויות (טופס + טבלה):');
  for (const e of ents) console.log(`   ${e.name} — ${e.schema.length} שדות${e.workflow ? ` · 🔄 workflow: ${e.workflow}` : ''}`);
  console.log('\n📊 מסכי-UI:');
  for (const s of scrs) console.log(`   ${s.name} — ${s.atoms} אטומים`);
  console.log('\n🧭 לוח-ניווט: app_hub (מקשר את כל ' + screens.length + ' המסכים)');
  console.log('▶ הכל חולל דרך genesis-gen — מתקמפל.');
}
