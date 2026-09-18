// 🧩 מריץ את `particleWidgets` **בזיכרון** על ספק אמיתי — בלי לכתוב לעץ.
//   למה לא `app-ds`: הרצת app-ds על ספק בודד **מוחקת** מסכים של אותו ns שהצנרת המלאה מייצרת
//   (אותה אזהרה של CLAUDE.md על genesis-gen/nl-smoke). כאן רק זיכרון, ולכן גם הראיה נקייה.
//   שימוש: node particles-probe.mjs <ns> [<ns>…]   (מהשורש)
import fs from 'node:fs';
import * as P from '../../../../machtzev/generator/particles.mjs';
import { interpret } from '../../../../machtzev/generator/entity.mjs';
for (const ns of process.argv.slice(2)) {
  const f = `machtzev/generator/specs-ds/${ns}.txt`;
  if (!fs.existsSync(f)) { console.log(`⚪ ${ns}: אין ספק ב-${f}`); continue; }
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const ents = [];
  for (const l of lines) {
    let r; try { r = interpret(l.trim()); } catch { continue; }
    if (r && r.entity && (r.schema || []).length) ents.push({ name: r.entity, slug: `ns_ent${ents.length + 1}`, cls: `GenEnt${ents.length + 1}`, schema: r.schema });
  }
  const plan = P.planParticles({ particles: P.parseParticleLines(lines), entities: ents, content: P.parseContentLines(lines) });
  let screens = 0;
  for (const e of ents) {
    const mine = plan.filter((p) => p.entSlug === e.slug);
    if (!mine.length) continue;
    let n = 0; P.particleWidgets({ entity: e, plan: mine, k: () => `K${++n}` }); screens++;
  }
  console.log(`🧩 ${ns}: ${ents.length} ישויות · ${plan.length} חלקיקים · ${screens} מסכי-חלקיקים (בזיכרון)`);
}
