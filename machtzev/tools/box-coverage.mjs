#!/usr/bin/env node
/** 📏 מד-מוכנות-קופסאות — לכל תוכנית-קופסה (box-drafts/): כמה מחוטיה כבר
 *  בדרגת-חוזה (new/atoms), כמה במחצבה (quarry), ומה חסר — מסווג:
 *  · io-boundary — פונקציית-גבול (DOM/localStorage/fetch/firebase) ⇒ חיווט-קופסה, לא אטום
 *  · law-6 — זהות/סודות ⇒ לעולם לא אטום (חוק-6)
 *  · missing — חור-כיסוי אמיתי ⇒ אזעקה (לחצוב או לתעד)
 *  שמות: camelCase⇒kebab (מספר נצמד: pad2) · UPPER_SNAKE⇒lower_snake במחצבה,
 *  ובדרגת-חוזה גם kebab (הסוכנים מקדמים לשם-kebab). */
import fs from 'node:fs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const ROOT = new URL('../..', import.meta.url).pathname;
const atoms = new Set(fs.readdirSync(ROOT + 'new/atoms').map(f => f.replace(/\..*$/, '')));
const quarry = new Set((fs.existsSync(ROOT + 'quarry') ? fs.readdirSync(ROOT + 'quarry') : []).map(f => f.replace(/@.*$/, '')));
// טיוטות שהוכרעו כחיווט-קופסה (מדף io-wiring — סוף ריקון-המחצבה 24.8)
// אליאסים מדדופ-המדף (הכרעה 5): שם-ישן ⇒ קנוני. החוט קיים, רק התוכנית לא עודכנה.
const DEDUP_ALIAS = { gem: 'gematria', 'local-iso': 'iso-local', localIso: 'iso-local' };
const IO_DRAFTS = new Set(fs.existsSync(ROOT + 'box-drafts/io-wiring')
  ? fs.readdirSync(ROOT + 'box-drafts/io-wiring').filter(f => f.endsWith('.mjs')).map(f => f.replace(/@.*$/, '').replace(/_/g, '-'))
  : []);

// גבולות-IO ידועים (הכרעה: אלה חיווט-קופסה — שקעים מוזרקים, לא אטומים)
const IO_RE = /^(download|print|apply|register|init|pick|read|write|save|clear|load)[A-Z]/;
const IO_NAMES = new Set(['isStandalone', 'initCloud', 'netCheckTargets']); // netCheckTargets = fetch/AbortController
const LAW6 = new Set(['SUPER_ADMIN_EMAILS']); // זהות/סודות — חוק-6
// אשכולות-תלות מתועדים ב-box-drafts/CLUSTERS.md — עבודת-יד לגל-הסוגר, לא חור
const CLUSTERED = new Set(['termOf','normalizeSite','normalizeConfig','employeeSignUpError','resolveOrgConfig','orgSlugFromUrl','SIZE_LABELS','receiptHtml','VERTICAL_PACKS','DEFAULT_LOCK_ZONES','LOCK_ZONES']);

const names = (w) => {
  if (DEDUP_ALIAS[w]) w = DEDUP_ALIAS[w];
  const out = new Set();
  if (/^[A-Z0-9_]+$/.test(w)) { out.add(w.toLowerCase()); out.add(w.toLowerCase().replace(/_/g, '-')); }
  else { out.add(w.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()); }
  out.add(w.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()); // הנוסחה המדויקת של מכונת-החוטים (גם על UPPER: a11-y_fab_toggles)
  // שקילות _↔- (המחצבה שומרת snake, הקידום מוציא kebab; וגם המנגלה a11-y)
  for (const n of [...out]) { out.add(n.replace(/_/g, '-')); out.add(n.replace(/-/g, '_')); }
  return [...out];
};

let alarms = 0;
const rows = [];
for (const bd of fs.readdirSync(ROOT + 'box-drafts').filter(f => f.endsWith('.box-draft.md')).sort()) {
  const box = bd.replace(/\.box-draft\.md$/, '');
  const wires = [...fs.readFileSync(ROOT + 'box-drafts/' + bd, 'utf8').matchAll(/^· ([a-zA-Z0-9_]+)/gm)].map(m => m[1]);
  let have = 0, inq = 0, clustered = 0; const io = [], law6 = [], missing = [];
  for (const w of wires) {
    const ns = names(w);
    // גם שם-מפורק-בהתנגשות: <שם>-<סיומת-הקופסה> (needs-care-shop)
    const suffixed = ns.map(n => n + '-' + box.split('-').pop());
    if (ns.some(n => atoms.has(n)) || suffixed.some(n => atoms.has(n))) have++;
    else if (ns.some(n => quarry.has(n))) inq++;
    else if (ns.some(n => IO_DRAFTS.has(n))) io.push(w);
    else if (LAW6.has(w)) law6.push(w);
    else if (IO_RE.test(w) || IO_NAMES.has(w)) io.push(w);
    else if (CLUSTERED.has(w)) clustered++;
    else { missing.push(w); alarms++; }
  }
  // 🕯️ ורמינהו על המוכנות: כל חוט עובר **שרשרת של שש בדיקות** ונופל באחת מהן — ובדוח
  //    זה הופך לשש עמודות-מונה. מונה אינו פסק: «חסר» ו«גבול-IO» ו«חוק-6» הם שלוש «אין»
  //    שונות לחלוטין — הראשונה חור-כיסוי (לחצוב), השנייה חיווט-קופסה (לא אטום מעולם),
  //    השלישית איסור-חרוט (חוק-6, לעולם לא אטום). עכשיו כל קבוצה נפסקת בשמה ובסיבתה.
  rminhu({ engine: 'box-coverage', matter: `קופסה ${box} (${wires.length} חוטים)`,
    searched: [`new/atoms (${atoms.size} בדרגת-חוזה)`, `quarry (${quarry.size} במחצבה)`, 'IO_DRAFTS · IO_RE/IO_NAMES · LAW6 · CLUSTERED'],
    rulings: [
      have ? had(`${have} בדרגת-חוזה`, 'קיימים ב-new/atoms בשם או בשם-מפורק-בהתנגשות — מחווטים כמו-שהם') : null,
      inq ? pliga(`${inq} במחצבה`, 'קיימים ב-quarry ולא בדרגת-חוזה — חסר **קידום** (חוזה+בדיקה), לא חסר-קוד: הקוד נחצב וממתין') : null,
      clustered ? lo(`${clustered} באשכול`, 'מכוסים ע"י אטום-אשכול אחר — אינם חור, הם כבר מיוצגים') : null,
      io.length ? lo(`${io.length} גבול-IO`, `${io.slice(0, 4).join(',')} — פונקציית-גבול (DOM/localStorage/fetch/firebase): חיווט-קופסה, **לא אטום** — לעולם לא תהיה כאן חציבה, וזה ייעוד ולא פער`) : null,
      law6.length ? lo(`${law6.length} חוק-6`, `${law6.slice(0, 4).join(',')} — זהות/סודות: חיווט-הצבה, לעולם לא אטום (חוק-6 חרוט)`) : null,
      missing.length ? pliga(`${missing.length} חסר`, `${missing.slice(0, 5).join(',')} — **חור-כיסוי אמיתי**: לא בחוזה, לא במחצבה, לא גבול-IO, לא חוק-6, לא באשכול; זה לחצוב או לתעד, ואינו אותו דבר כמו חמש הקבוצות שמעליו`) : null,
      wires.length ? null : pliga(box, '0 חוטים בתוכנית-הקופסה — «🟢 מוכנה» על אפס-חוטים הוא ירוק-חלול (have===wires.length===0)'),
    ].filter(Boolean) });
  const ready = have === wires.length ? '🟢 מוכנה' : missing.length ? '🔴' : '🟡';
  rows.push({ box, total: wires.length, have, inq, clustered, io, law6, missing, ready });
}

const md = ['# 📏 מוכנות-הקופסאות (מחולל — node machtzev/tools/box-coverage.mjs)', '',
  '| קופסה | חוטים | בחוזה | במחצבה | אשכול | גבול-IO | חוק-6 | חסר | מצב |', '|---|---|---|---|---|---|---|---|---|'];
for (const r of rows) {
  md.push(`| ${r.box} | ${r.total} | ${r.have} | ${r.inq} | ${r.clustered} | ${r.io.length} | ${r.law6.length} | ${r.missing.join(' ') || '—'} | ${r.ready} |`);
}
const green = rows.filter(r => r.ready === '🟢 מוכנה').length;
md.push('', `**${green}/${rows.length} קופסאות מוכנות-לחיווט · ${alarms} חורי-כיסוי (אזעקה אם >0 אחרי מחצבה-ריקה)**`);
fs.writeFileSync(ROOT + 'box-drafts/READINESS.md', md.join('\n') + '\n');
console.log(`מד-מוכנות: ${green}/${rows.length} קופסאות מוכנות · ${alarms} חורים אמיתיים · דוח: box-drafts/READINESS.md`);
(await import('../../yeshiva/rminhu.mjs')).printNotes('box-coverage');
if (process.argv.includes('--strict') && alarms > 0) process.exit(1);
