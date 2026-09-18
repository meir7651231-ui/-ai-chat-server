#!/usr/bin/env node
/** 🔍 בודק-כפליות למדף-החוזה (הכרעה 5) — ארבע עדשות:
 *  א) תאומי-גוף: אותו קוד בדיוק (נרמול הערות/רווחים) בשמות שונים.
 *  ב) תאומי-שם: וריאנטים (kebab/underscore/מילים-הפוכות) של אותו שם.
 *  ג) תאומי-מוצא: שני אטומים שמצביעים על אותו מקור (קובץ:שורות).
 *  ד) תאומי-פעולה (--semantic · G62 · משפחת-gen-max #5 «קיפול op-שקילות סמנטי»): לא סינטקס אלא **הוכחה** —
 *     שני מנועי-Dart עם אותה חתימה (logic-census) שכל אחד עובר את דוגמאות-הזהב (‎_eq‎) של השני, דרך המוכיח-האחד
 *     (generator/logic-proof · proveCandidates). דו-כיווני מלא = תאום-פעולה (מועמד-לאיחוד, הכרעת-בעלים — לא ממזגים לבד);
 *     חד-כיווני = «מכיל». דוח: dedup/OPTWINS-REPORT.md + optwins.json. (הבדיקה-ידנית לפני הבנייה: 75 קבוצות-חתימה · 285 מנועים.) */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const DIR = new URL('../../new/atoms/', import.meta.url).pathname;
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
const norm = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')   // הערות
  .replace(/\s+/g, ' ').trim();
const bodyOf = (f) => norm(fs.readFileSync(DIR + f, 'utf8'));
const srcOf = (f) => (fs.readFileSync(DIR + f, 'utf8').match(/מוצא:\s*([^\s(]+)/) || [])[1] || '';

// א) תאומי-גוף
const byHash = new Map();
for (const f of files) {
  const h = crypto.createHash('sha256').update(bodyOf(f)).digest('hex').slice(0, 16);
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}
const bodyTwins = [...byHash.values()].filter(g => g.length > 1);

// ב) תאומי-שם: נרמול שם (בלי מקפים/קווים, אותיות בלבד, מילים ממוינות)
const nameKey = (f) => f.replace(/\.mjs$/, '').split(/[-_]/).sort().join('|');
const byName = new Map();
for (const f of files) {
  const k = nameKey(f);
  if (!byName.has(k)) byName.set(k, []);
  byName.get(k).push(f);
}
const nameTwins = [...byName.values()].filter(g => g.length > 1);

// ג) תאומי-מוצא
const bySrc = new Map();
for (const f of files) {
  const s = srcOf(f);
  if (!s) continue;
  if (!bySrc.has(s)) bySrc.set(s, []);
  bySrc.get(s).push(f);
}
const srcTwins = [...bySrc.values()].filter(g => g.length > 1);

console.log(`מדף: ${files.length} אטומים`);
console.log(`\n— תאומי-גוף (${bodyTwins.length} קבוצות):`);
for (const g of bodyTwins) console.log('  ' + g.join(' ≡ '));
console.log(`\n— תאומי-שם (${nameTwins.length} קבוצות, גוף שונה):`);
for (const g of nameTwins) if (!bodyTwins.some(b => b.join() === g.join())) console.log('  ' + g.join(' ~ '));
console.log(`\n— תאומי-מוצא (${srcTwins.length} קבוצות):`);
for (const g of srcTwins) console.log('  ' + g.join(' + ') + '  ← ' + srcOf(g[0]));

// 🕯️ ורמינהו על ארבע העדשות (הכרעה-5). עד כה כל אחת הדפיסה מונה, ושלוש-עדשות-ריקות נראו
//    כמו «המדף נקי מכפילות» — אבל שלוש העדשות הראשונות הן **סינטקס** (גוף · שם · מוצא)
//    והרביעית היא **הוכחה** (‏--semantic). מדף שעבר שלוש ולא נבדק ברביעית אינו נקי, הוא
//    לא-נבדק, וזו בדיוק הטענה שנופלת כשמשווים לפי שם/מחרוזת ולא לפי המקור המוצהר (L112).
rminhu({ engine: 'dedup-atoms', matter: `מדף new/atoms (${files.length} אטומים) ⇒ תאומים`,
  searched: ['עדשה א: גוף-מנורמל (sha256)', 'עדשה ב: שם-מנורמל (מילים ממוינות)', 'עדשה ג: מוצא מוצהר (שורת «מוצא:»)', 'עדשה ד: הוכחה צולבת של דוגמאות-הזהב (--semantic)'],
  rulings: [
    bodyTwins.length ? had(`עדשה א · ${bodyTwins.length} קבוצות`, bodyTwins.map((g) => g.join('≡')).slice(0, 3).join(' | ')) : pliga('עדשה א: גוף-מנורמל', `0 קבוצות מתוך ${files.length} אטומים — אין שני אטומים עם גוף זהה אחרי נרמול-הערות/רווחים; עדשת-סינטקס, אינה רואה יכולת-שקולה בניסוח שונה`),
    nameTwins.length ? had(`עדשה ב · ${nameTwins.length} קבוצות`, 'וריאנטים של אותו שם (kebab/underscore/מילים-הפוכות)') : pliga('עדשה ב: שם-מנורמל', `0 קבוצות — אבל זו התאמה **לפי שם**, והיא בדיוק העדשה שהחמיצה שמונה באגים באותה משפחה (L112); «אין» כאן הוא «אין חפיפת-שם»`),
    srcTwins.length ? had(`עדשה ג · ${srcTwins.length} קבוצות`, 'שני אטומים מצביעים על אותו קובץ:שורות') : pliga('עדשה ג: מוצא מוצהר', `0 קבוצות · ${files.filter((f) => srcOf(f)).length} מתוך ${files.length} אטומים מצהירים מוצא בכלל — אטום בלי שורת «מוצא:» אינו בעדשה הזאת, ולכן 0 אינו ראיה`),
    process.argv.includes('--semantic')
      ? had('עדשה ד: הוכחה', 'רצה — הפסק בהמשך, פר-קבוצת-חתימה')
      : lo('עדשה ד: הוכחה', 'לא רצה (בלי --semantic) — ולכן «המדף נקי» אינו נאמר כאן: שלוש עדשות-סינטקס עברו, ההוכחה לא נבדקה, ומדף לא-נבדק אינו מדף-נקי'),
  ] });

if (!process.argv.includes('--semantic')) (await import('../../yeshiva/rminhu.mjs')).printNotes('dedup-atoms');

// ד) תאומי-פעולה — הוכחה צולבת של דוגמאות-הזהב (--semantic; איטי: ריצת-Dart לכל מנוע-עם-דוגמאות)
if (process.argv.includes('--semantic')) {
  const ROOT = new URL('../../', import.meta.url).pathname;
  const { proveCandidates } = await import('../generator/logic-proof.mjs');
  const LC = JSON.parse(fs.readFileSync(path.join(ROOT, 'machtzev/generator/logic-census.json'), 'utf8')).filter((e) => /^(dart|dart-maor)\//.test(e.file) && Array.isArray(e.params));
  const groups = new Map();
  for (const e of LC) { const k = `${e.ret}(${e.params.join(',')})`; (groups.get(k) || groups.set(k, []).get(k)).push(e); }
  // דוגמאות-הזהב של מנוע: שורות `_eq(<call>, <want>, <label>)` בבדיקה שלו ⇒ [argsDart, checkDart]. רק ליטרלים (בלי סגירות/אנומים של הקובץ — אחרת לא מתקמפל אצל המועמד האחר)
  const balanced = (s, i) => { let d = 0; for (let j = i; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')' && --d === 0) return s.slice(i + 1, j); } return null; };
  const splitTop = (s) => { const out = []; let d = 0, q = null, cur = ''; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { cur += c; if (c === q && s[i - 1] !== '\\') q = null; continue; } if (c === "'" || c === '"') q = c; else if ('([{'.includes(c)) d++; else if (')]}'.includes(c)) d--; if (c === ',' && d === 0) { out.push(cur.trim()); cur = ''; continue; } cur += c; } if (cur.trim()) out.push(cur.trim()); return out; };
  const examplesOf = (e) => {
    const tp = path.join(ROOT, 'new', e.file.replace(/\.dart$/, '_test.dart')); if (!fs.existsSync(tp)) return [];
    const out = [];
    for (const m of fs.readFileSync(tp, 'utf8').matchAll(/^\s*_eq\(/gm)) {
      const inner = balanced(fs.readFileSync(tp, 'utf8'), m.index + m[0].length - 1); if (!inner) continue;
      const [got, want] = splitTop(inner); if (!got || want === undefined) continue;
      const ci = got.indexOf(e.name + '('); if (ci < 0) continue;
      const args = balanced(got, ci + e.name.length); if (args === null) continue;
      if (/=>|\b[A-Z]\w*\.\w+|\btd_|\bk[A-Z]\w*\b/.test(args + want)) continue;   // סגירה / אנום-של-הקובץ / דאטה-מיובאת ⇒ לא-נייד
      out.push([args, `r.toString() == (${want}).toString()`]);
    }
    return out;
  };
  const pairs = [], contains = [], selfFailed = []; let tested = 0, proved = 0;
  for (const [sig, members] of groups) {
    if (members.length < 2) continue;
    const ex = new Map(members.map((m) => [m.name, examplesOf(m)]));
    const cands = members.map((m) => ({ id: m.name, file: m.file }));
    const pass = {};   // pass[owner][cand] = ok/total על דוגמאות-owner
    for (const m of members) {
      const exs = ex.get(m.name); if (exs.length < 3) continue;
      tested++;
      const r = proveCandidates('optwin__' + m.name, cands, exs);
      pass[m.name] = Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.total ? v.ok / v.total : 0]));
      if ((pass[m.name][m.name] ?? 0) >= 0.8) proved++; else selfFailed.push({ name: m.name, file: m.file, self: pass[m.name][m.name] ?? 0, n: exs.length });   // כנות: מנוע שלא עובר את דוגמאות-עצמו דרך המוכיח = חילוץ-הדוגמאות לא-נאמן (לא נשפט)
    }
    for (let i = 0; i < members.length; i++) for (let j = 0; j < members.length; j++) {
      if (i === j) continue; const a = members[i].name, b = members[j].name;
      const ab = pass[a]?.[b], ba = pass[b]?.[a], aa = pass[a]?.[a], bb = pass[b]?.[b];   // a's examples on b · b's examples on a · self
      // הכלל: המועמד עובר **כל מה שהבעלים עצמו עובר** (דוגמה שאינה מתקמפלת אצל הבעלים אינה ראיה); בעלים שעובר <80% מעצמו = חילוץ לא-נאמן ⇒ לא שופט
      const ok = (x, self) => x !== undefined && self !== undefined && self >= 0.8 && x >= self;
      if (ok(ab, aa) && ok(ba, bb) && i < j) pairs.push({ sig, a, b, na: ex.get(a).length, nb: ex.get(b).length });
      else if (ok(ab, aa) && ba !== undefined && bb !== undefined && bb >= 0.8 && ba < bb) contains.push({ sig, wide: b, narrow: a, n: ex.get(a).length });   // b עובר את כל דוגמאות-a, a לא את של-b ⇒ b מכיל את a
    }
  }
  const res = { groups: [...groups.values()].filter((g) => g.length >= 2).length, tested, proved, twins: pairs, contains, selfFailed };
  fs.writeFileSync(new URL('./optwins.json', import.meta.url), JSON.stringify(res, null, 1));
  let md = `# 🔁 תאומי-פעולה (dedup-atoms --semantic · הוכחה צולבת של דוגמאות-הזהב)\n\nקבוצות-חתימה ≥2: **${res.groups}** · מנועים עם ≥3 דוגמאות-ניידות: **${tested}** (מוכיחים את עצמם: ${proved}) · **תאומים דו-כיווניים: ${pairs.length}** · מכיל (חד-כיווני): ${contains.length}\n\n`;
  md += `## תאומים (כל אחד עובר 100% מדוגמאות השני — מועמד-לאיחוד, הכרעת-בעלים)\n| חתימה | א | ב | דוגמאות |\n|---|---|---|---|\n` + pairs.map((p) => `| \`${p.sig}\` | ${p.a} | ${p.b} | ${p.na}+${p.nb} |`).join('\n') + '\n\n';
  md += `## מכיל (הרחב עובר את כל דוגמאות הצר, לא להפך)\n| חתימה | רחב | צר | דוגמאות-הצר |\n|---|---|---|---|\n` + contains.map((c) => `| \`${c.sig}\` | ${c.wide} | ${c.narrow} | ${c.n} |`).join('\n') + '\n';
  md += `\n## לא-מוכחים-על-עצמם (${selfFailed.length}) — חילוץ-הדוגמאות לא-נאמן למנוע; לא נשפטים\n` + selfFailed.map((f) => `- ${f.name} (${f.file}) ${Math.round(f.self * f.n)}/${f.n}`).join('\n') + '\n';
  fs.writeFileSync(new URL('./OPTWINS-REPORT.md', import.meta.url), md);
  console.log(`\n— תאומי-פעולה (סמנטי · הוכחה): ${res.groups} קבוצות-חתימה · ${tested} נבדקו · ${pairs.length} תאומים · ${contains.length} מכיל ⇒ machtzev/dedup/OPTWINS-REPORT.md`);
  for (const p of pairs) console.log(`  ${p.a} ≡ ${p.b}  (${p.sig})`);
  // 🕯️ ופסק פר-תאום: דו-כיווני ⇒ חד שיעורא · חד-כיווני («מכיל») ⇒ פליגא, וההיקף הוא החילוק ·
  //    בעלים שלא עובר את דוגמאות-עצמו ⇒ לא שייך (חילוץ-הדוגמאות לא-נאמן — לא נשפט, ונאמר).
  rminhu({ engine: 'dedup-atoms --semantic', matter: `תאומי-פעולה · ${res.groups} קבוצות-חתימה · ${tested} נבדקו`,
    searched: ['logic-census.json (חתימה: ret(params))', 'דוגמאות-הזהב מ-<atom>_test.dart', 'logic-proof.proveCandidates (ריצת-Dart)'],
    rulings: [
      ...pairs.map((p) => had(`${p.a}≡${p.b}`, `דו-כיווני על ${p.sig} · ${p.na}+${p.nb} דוגמאות — מועמד-לאיחוד, הכרעת-בעלים`)),
      ...contains.map((c) => pliga(`${c.wide}⊃${c.narrow}`, `${c.wide} עובר את כל ${c.n} דוגמאות ${c.narrow}, ולא להפך — «מכיל» ולא תאום: האיחוד היה מאבד את מה שהרחב עושה מעבר`)),
      ...selfFailed.map((f) => lo(f.name, `עובר ${Math.round(f.self * 100)}% מדוגמאות-עצמו (<80%) — חילוץ-הדוגמאות אינו נאמן למנוע הזה, ולכן הוא אינו נשפט; זו כנות-המנוע ולא ממצא`)),
      ...(pairs.length || contains.length || selfFailed.length ? [] : [pliga('עדשת-ההוכחה', `${res.groups} קבוצות-חתימה נסרקו ו-${tested} מנועים נבדקו בריצת-Dart, ואין תאום ואין «מכיל» — זה ממצא מדוד ולא היעדר-בדיקה`)]),
    ] });
  (await import('../../yeshiva/rminhu.mjs')).printNotes('dedup-atoms --semantic');
}
