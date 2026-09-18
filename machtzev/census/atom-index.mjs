#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  atom-index.mjs — אינדקס-האמת האחד לכל אטום (מונע פספוס-חוצה-סוכנים).
//  לכל אטום-חזות: מחלקה · קובץ · מקור-מסך · **מטרה-אמיתית** (מונחי-מסך-המקור אם
//  הורם, אחרת התיאור-העצמי מנוקה-בוילרפלייט) · **טוהר** (עברית-בקוד=חוב) · תפר · ייעוד.
//  כל האמת במקום אחד ⇒ סוכן לא צריך להצליב 5 קבצים ולנחש מדוגמה. דטרמיניסטי.
//  פלט: machtzev/generator/atom-index.json + סיכום-אמת. ריצה: node machtzev/census/atom-index.mjs
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
import { analyzeAtom } from './atom-census.mjs';
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo, printNotes } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const ROOT = R.NEW;
const SEED = R.p('screens-seed/machine') + '/';
const OUT = (R.GEN_DIR + 'atom-index.json');
const BOILER = new Set(['מהמקור', 'אל', 'תערוך', 'ידנית', 'מוצא', 'בנייה', 'חכמה', 'הורם', 'ע"י', 'מנוע', 'המדף', 'verbatim', 'Stateless', 'Stateful', 'main', 'v2', 'shelf', 'lift']);
const heToks = (s) => [...String(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => m[0]);

// מפת מסך→מונחים-עבריים (המטרה-האמיתית מהפירוק).
// 🕯️ שני `catch {}` ריקים: החיצוני בולע «תיקיית-הזרעים אינה קיימת», הפנימי «קובץ-זרע פגום».
//    בשני המקרים `screenTerms` נשאר ריק, וכל אטום נופל ל-`own-he` — כלומר **המטרה-האמיתית
//    ממסך-המקור נעלמת בשקט** וההצהרה-העצמית תופסת את מקומה. L26/L110 מילה-במילה.
const screenTerms = {};
const seedBad = [];
try {
  const files = fs.readdirSync(SEED).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    try { const d = JSON.parse(fs.readFileSync(path.join(SEED, f), 'utf8')); screenTerms[f.replace('.json', '')] = [...new Set((d.terms || []).flatMap((t) => heToks(t)))].slice(0, 24); }
    catch (e) { seedBad.push([f, String((e && e.message) || e).slice(0, 80)]); }
  }
  if (seedBad.length) rminhu({ engine: 'atom-index.seed', matter: 'זרעי-המסכים ⇒ מונחי-מסך-המקור',
    searched: [`${path.relative(R.ROOT, SEED)} (${files.length} קובצי-זרע)`],
    rulings: seedBad.map(([f, m]) => lo(f, `קובץ-זרע לא נקרא (${m}) — המסך הזה לא יתרום מונחים, וכל אטום שמוצאו בו ייפול ל«תיאור-עצמי» בלי שאיש ידע`)) });
} catch (e) {
  rminhu({ engine: 'atom-index.seed', matter: 'זרעי-המסכים ⇒ מונחי-מסך-המקור',
    searched: [path.relative(R.ROOT, SEED)],
    none: `לא מצינו: תיקיית-הזרעים אינה נקראת (${String((e && e.code) || e)}) — **אפס** מונחי-מסך, וכל האטומים ייפלו לתיאור-עצמי. ∅ עם שם-המדף החסר, לא «אין מטרה» (L110 §3)` });
}

const walk = (d) => { let o = []; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) o = o.concat(walk(p)); else if (e.name.endsWith('.dart')) o.push(p); } return o; };

export function atomIndex() {
  const out = []; const seen = new Map();
  // 🕯️ `seen.has(cls) ⇒ continue` הוא **הכרעה-K** («הראשון-אלפביתית מנצח בשקט») — ו«בשקט» היא
  //    המילה. op-census נאלץ לבנות `unindexedDisplay` שלם כדי לתפוס את מה שנופל כאן. עכשיו
  //    המפסידים נאמרים בשמם ובקובץ שלהם. המפתח לא שוּנה (זה תיקון-שורש, הכרעת-בעלים).
  const shadowed = [];
  const forgeDir = path.join(ROOT, 'dart-forge-bs');
  if (!fs.existsSync(forgeDir)) rminhu({ engine: 'atom-index', matter: 'מדף-החישול (forge) ⇒ אטומי-תצוגה',
    searched: [path.relative(R.ROOT, forgeDir)],
    none: 'לא מצינו: new/dart-forge-bs אינו על הדיסק — 353 אטומי-forge לא ייכנסו לאינדקס, והתנאי המשולש מדלג עליו בשקט (L110 §1)' });
  // §21 · כל אטומי-התצוגה: המדף (dart-ui-bs) + ספריית-החישול (dart-forge-bs, G12 — 353 אטומים פיקסל-נאמנים ל-Pure)
  for (const abs of [...walk(path.join(ROOT, 'dart-ui-bs')), ...(fs.existsSync(path.join(ROOT, 'dart-forge-bs')) ? walk(path.join(ROOT, 'dart-forge-bs')) : [])].sort()) {
    const src = fs.readFileSync(abs, 'utf8');
    const rel = path.relative(ROOT, abs);
    const origin = (src.match(/מוצא:\s*(screens__[a-z0-9_]+)/) || [])[1] || null;
    const ownHe = [...new Set(heToks(src.split('\n').filter((l) => /^\s*\/\//.test(l)).join(' ')))].filter((w) => !BOILER.has(w));
    const purityHe = (src.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n').match(/[֐-׿]{2,}/g) || []).filter((w) => !/^[֐׿׳״]+$/.test(w)).length;
    for (const m of src.matchAll(/class ([A-Za-z0-9]+) extends (?:StatelessWidget|StatefulWidget)/g)) {
      const cls = m[1];
      if (seen.has(cls)) { shadowed.push([cls, seen.get(cls), rel]); continue; }
      seen.set(cls, rel);
      const a = analyzeAtom(src, cls, rel);
      // מטרה: מונחי-מסך-המקור (אמיתי) אם הורם, אחרת התיאור-העצמי מנוקה.
      const purpose = origin && screenTerms[origin] && screenTerms[origin].length ? screenTerms[origin] : ownHe;
      out.push({ cls, file: rel, origin, purpose, purposeFrom: (origin && screenTerms[origin]?.length) ? 'source-screen' : (ownHe.length >= 2 ? 'own-he' : 'none'), purityHe, seam: a.seam, caps: a.caps, str: a.str, num: a.num, list: a.list, cb: a.cb });
    }
  }
  const noPurpose = out.filter((a) => a.purposeFrom === 'none');
  rminhu({ engine: 'atom-index', matter: `מדפי-התצוגה ⇒ אינדקס-האמת (${out.length} אטומים)`,
    searched: [`dart-ui-bs + dart-forge-bs · ${out.length} נרשמו · ${shadowed.length} הוסתרו בשם-מחלקה כפול · זרעי-מסך: ${Object.keys(screenTerms).length}`],
    rulings: [
      ...shadowed.slice(0, 8).map(([c, first, dup]) => pliga(c, `נרשם מ-${first}; המחלקה באותו שם ב-${dup} **הוסתרה** — מפתח-האינדקס הוא שם-המחלקה בלבד (הכרעה-K), והמפסיד אינו נראה לאף מנוע-חיפוש`)),
      shadowed.length ? lo('seen (שם-מחלקה כפול)', `סה"כ ${shadowed.length} מחלקות הוסתרו כך. זה בדיוק מה ש-op-census מתקן ב-unindexedDisplay — כלומר הפער ידוע, ולא נאמר כאן מעולם`) : null,
      noPurpose.length ? lo('purposeFrom=none', `${noPurpose.length} אטומים בלי מטרה משום מקור: אין מוצא-מסך **וגם** פחות משתי מילים עבריות בתיאור-העצמי (דוגמה: ${noPurpose.slice(0, 3).map((a) => a.cls).join(',')}) — שתי «אין» שונות בדגל אחד`) : null,
    ].filter(Boolean),
    none: `לא מצינו: אף אטום-תצוגה ב-dart-ui-bs/dart-forge-bs — המדף ריק או אינו נקרא` });
  return out.sort((x, y) => x.cls.localeCompare(y.cls));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const idx = atomIndex();
  fs.writeFileSync(OUT, JSON.stringify(idx, null, 1) + '\n');
  const withPurpose = idx.filter((a) => a.purposeFrom !== 'none').length;
  const dirty = idx.filter((a) => a.purityHe > 0).length;
  const bySrc = {}; for (const a of idx) bySrc[a.purposeFrom] = (bySrc[a.purposeFrom] || 0) + 1;
  printNotes('atom-index');
  console.log(`אינדקס-האמת · ${idx.length} אטומים · → generator/atom-index.json`);
  console.log(`  מטרה-אמיתית: ${withPurpose}/${idx.length}  (${JSON.stringify(bySrc)})`);
  console.log(`  טוהר: ${idx.length - dirty} נקיים · ${dirty} עם-עברית-בקוד (חוב)`);
  console.log('  דוגמה:', JSON.stringify({ cls: idx.find((a) => a.origin)?.cls, purpose: idx.find((a) => a.origin)?.purpose?.slice(0, 6) }));
}
