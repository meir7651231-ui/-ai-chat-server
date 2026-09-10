#!/usr/bin/env node
// 📖 spec-lang-doc — דף-השפה של הספק, מחולל מהדאטה (spec-lang.data.json) — לא נכתב ביד (§19-ד: מקור-אמת יחיד).
//   כותב machtzev/generator/specs-ds/SPEC-LANG.md · --gate ⇒ exit 1 אם הדף בדיסק ≠ המחולל (סחף-תיעוד).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import * as R from '../root.mjs';
const G = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8'));
const j = (a) => (a || []).join(' / ');
export function specLangDoc() {
  const fns = Object.entries(G.formulaFns || {}).map(([f, k]) => `${f}(…)${k === 'method' ? '' : ''}`).join(', ');
  return `# שפת-הספק (specs-ds) — דף מחולל מ-spec-lang.data.json. אל תערוך ידנית (node machtzev/generator/spec-lang-doc.mjs).

## מבנה קובץ
- \`${G.appWord}: <שם>\` · \`${G.lookWord}: ${Object.keys(G.looks || {}).join(' | ')}\` · \`${G.questionWord} ${Object.keys(G.questionTargets || {}).join('|')}: <שאלה>\` · \`${G.chainWord}: …\`
- \`${j(G.entityNouns)} <שם> ${G.withWord} <שדה>, <שדה>, …  | ${j(G.stagePrefixes)}: א, ב, ג | ${j(G.markDelete)}: <ישות>=${Object.keys(G.delPolicies || {}).slice(0, 3).join('|')} | ${j(G.markGuards)}: <שלב>: <תנאי> | ${j(G.markSort)}: <שדה> ${j(G.sortAsc)}|${j(G.sortDesc)}, <שדה2>\` (מיון רשימת-הישות; שדה-בחירה ⇒ סדר-ההכרזה)
- \`לוח בקרה ${G.withWord} ${j(G.pCount)}(<ישות>), ${j(G.pCount)}(<ישות>: <שדה>=<ערך>), ${j(G.pSum)}(<ישות>.<שדה>)\`
- \`${G.particleWord} <ישות>: <צורה>\` · \`${G.reportWord} <ישות>: <שם> = …\` · \`${G.contentWord} <קבוצה>: <טקסט>\`

## שדות (בתוך שורת-הישות)
- חובה \`שם*\` · ייחודי \`שם!\` · בחירה-סגורה \`שדה{א|ב|ג}\` · ברירת-מחדל \`שדה[ערך]\` · טווח \`שדה(0..100)\`
- טיפוס לפי מילה בשם: תאריך ${j(G.typeDate)} · מספר ${j(G.typeNum)} · כן/לא ${j(G.typeBool)} · טלפון ${j(G.typePhone)} · שעה ${j(G.typeTime)} · אחוז ${j(G.typePercent)} · מקום ${j(G.typeLocation)} · רב-שורתי ${j(G.typeMultiline)}
- **שדה מחושב** \`שם = <נוסחה>\`: שדות-אחות, מספרים, + - * / ( ) ופונקציות: ${fns} (למשל \`מרחק בקמ = sqrt(מרחק בריבוע)\`, \`תקרה = max(תקרה א, תקרה ב)\`)
- **שדה מותנה** \`שם = <שדה> <op> <שדה|מספר> ? <ערך-אם-כן> : <ערך-אם-לא>\` (op: > < >= <=) — למשל \`קרוב = מרחק בריבוע < 100 ? קרוב : רחוק\`
- קישור לישות-אם: שם-הישות כשם-שדה (\`תיק*\`)

## חלקיקים (\`${G.particleWord} <ישות>: …\`)
- \`[${j(G.pTable)}]\` טבלה של כל השדות · **\`[${G.pTable[0]}] עמודה, עמודה, … | ${j(G.pSort)}: <שדה> ${j(G.sortAsc)}|${j(G.sortDesc)}, <שדה2>\`** — עמודות נבחרות ומיון (מספרי כשניתן, ריק אחרון, מפתחות משורשרים)
- \`<שם> = ${j(G.pCount)}(<שדה>=<ערך>)\` מונה · \`<שם> = ${j(G.pSum)}(<שדה>)\` סכום · \`<שם> = ${j(G.pAvg)}(<שדה>)\` ממוצע · \`A ${j(G.pVs)} B\` השוואה · \`A / B\` יחס
- \`[${j(G.pEmpty)}] <טקסט>\` מצב-ריק · \`[${j(G.pAct)}] <טקסט>\` כפתור-פעולה · \`[${j(G.pSearch)}]\` · \`[${j(G.pFilter)}]\` · \`[${j(G.pExport)}]\`
- \`<שם> = [${j(G.pNumber)}] <טקסט>\` "המספר שלך" · \`<שם> = [${j(G.pMessage)}] <שדה-בחירה> = [${G.contentWord} <קבוצה>]\` הודעה · \`<שם> = [${j(G.pDates)}]\` לוח-תאריכים · \`<שדה>\` לבד = עובדה/חלוקה-למצבים
- \`<שם> = [${G.contentWord} <קבוצה>]\` תוכן-קבוע מקבוצת \`${G.contentWord} <קבוצה>: …\`

## דוח (\`${G.reportWord} <ישות>: …\`)
- \`<שם> = <שדה>\` · \`<שם> = [${G.contentWord} <קבוצה>]\` · \`[${j(G.pExport)}] <שם> = <שדה-טלפון>, <טקסט>\` (שליחה)
`;
}
const OUT = path.join(R.GEN_DIR, 'specs-ds', 'SPEC-LANG.md');
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) { const doc = specLangDoc(); if (process.argv.includes('--gate')) { const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''; if (cur !== doc) { console.log('🔴 spec-lang-doc: SPEC-LANG.md ≠ המחולל (הרץ node machtzev/generator/spec-lang-doc.mjs)'); process.exit(1); } console.log('✓ spec-lang-doc: דף-השפה טרי'); } else { fs.writeFileSync(OUT, doc); console.log('📖 ' + OUT); } }
