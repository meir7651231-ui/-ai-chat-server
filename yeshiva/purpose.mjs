#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  purpose.mjs — הגשר: **חיפוש-לפי-מטרה ⇒ מסמך שהישיבתי יודע לקרוא**.
//  ────────────────────────────────────────────────────────────────────────
//  הבעיה שזה פותר: הישיבתי עובד בשיטת «השווה A ל-B» — הספק מול מסמך-הבעלים.
//  במשפט-חופשי אין מסמך, ולכן הוא לא רץ שם בכלל — וזה בדיוק המסלול שבו
//  המחולל ממציא הכי הרבה. ה-B החסר הוא **המטרה**: אילו שדות נדרשים כדי
//  להגשים את מה שנאמר, נגזר משרשרת-המקור (חבילות-ורטיקל ⇒ סכמה), עם ראיה.
//
//  ⚙️ לפי **צורה**, לא לפי מילים (L107): המקור הוא `tzinor.toSwitches` —
//  מילה ⇒ מועמדי-סכמה עם `fields[].src`. חיפוש-לפי-מילים (`match.retrieve`)
//  נמדד ונפסל: «תורים» ⇒ DotsLoader («נקודות קופצות בתור») — אותה מחלקת-
//  תקלה של התאמה-מקרית שהמנוע נועד למנוע.
//
//  🔒 אפס-המצאה: שדה בלי `src` לא נכנס למסמך. מילה בלי מועמד-סכמה ⇒ ∅
//  מדווח, לא ניחוש (L57). ישות עם כמה מועמדים ⇒ **לא מכריעים** — זה מתג.
//
//  שימוש: node yeshiva/purpose.mjs "<משפט חופשי>"
// ══════════════════════════════════════════════════════════════════════════
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toSwitches } from '../machtzev/generator/tzinor.mjs';
import { check, parseSpec } from './read.mjs';
import { pasak, applyPsak } from './apply.mjs';

const HE_RE = /[\u05d0-\u05ea]/;   // שם-שדה בלי אות-עברית = מפתח-סכמה, לא מונח
const norm = (s) => String(s).replace(/[״"'׳]/g, '').replace(/\s+/g, ' ').trim();

/** מועמד-אמת יחיד: יש מחלקה · יש שדות · לא רופף. אין יחיד ⇒ null (מתג, לא הכרעה). */
const soleOption = (e) => {
  const real = (e.options || []).filter((o) => o.cls && (o.fields || []).length && o.strict !== false);
  return real.length === 1 ? real[0] : null;
};

/**
 * משפט-חופשי ⇒ אובייקט בצורת-`doc` של read.mjs (‏title · sections · optional · mandatory).
 * `check(doc, spec)` רץ עליו בלי שינוי — אותם שבעה מהלכים, אותו פסק.
 * מחזיר גם `sources` (שדה ⇒ מוצא) ו-`open` (ישויות שלא הוכרעו — מתגים).
 */
export function purposeDoc(sentence, origin = 'משפט') {
  const sw = toSwitches(sentence, origin);
  const doc = {
    lines: [sentence], title: norm(sentence), sections: {}, optional: [], mandatory: [],
    sources: new Map(), open: [], domain: sw.domain, entities: [],
  };
  const ev = [];
  for (const e of sw.entities) {
    const o = soleOption(e);
    if (!o) {
      const n = (e.options || []).filter((x) => x.cls).length;
      doc.open.push({ word: e.word, options: n, fields: [], from: 'אין מועמד-סכמה יחיד', srcs: [] });
      ev.push(`- «${e.word}» — ${n} מועמדי-סכמה, אין יחיד ⇒ מתג (לא הוכרע)`);
      continue;
    }
    doc.entities.push({ word: e.word, cls: o.cls });
    const noTerm = [];
    for (const f of o.fields) {
      if (!f.src) continue;                                  // שדה בלי מוצא אינו ראיה
      const n = norm(f.name); if (!n || doc.sources.has(n)) continue;
      doc.sources.set(n, f.src);
      // 🔤 שפת-האפיון עברית-בלבד: שקע בלי מונח-עברי **אינו נכנס לחובה/רשות**,
      // כי אז הישיבתי היה מיישם אותו כשדה ו-`interpret` היה מתייג אותו «שדה»
      // (נמדד). אין מונח ⇒ מתג עם מוצא. הישיבתי לא ממציא שם — זה בדיוק תפקידו.
      if (!HE_RE.test(n)) { noTerm.push(n); continue; }
      (f.optional ? doc.optional : doc.mandatory).push(n);
    }
    if (noTerm.length) doc.open.push({ word: e.word, cls: o.cls, options: noTerm.length, fields: noTerm, from: 'שקע-סכמה בלי מונח-עברי', srcs: [...new Set(o.fields.filter((f) => noTerm.includes(norm(f.name))).map((f) => f.src))] });
    ev.push(`- «${e.word}» ≡ ${o.cls} (${o.fields.length} שקעים) · ${(o.evidence || []).join(' · ')}`);
  }
  doc.sections['חובה'] = ev;
  return doc;
}

/**
 * 🔨 **הישיבתי לפני הבנייה** — זה מה שהופך אותו משופט-שמודד לשופט-שמבצע.
 * טיוטת-ספק + משפט ⇒ מסמך-המטרה ⇒ שבעת המהלכים ⇒ פסק ⇒ **ספק מתוקן**.
 * מה שהוכרע מיושם; מה שלא — נשאר מתג, ולא מומצא (L57).
 * מחזיר `{ spec, rulings, decided, switches, changed }`.
 */
export function rule(sentence, draftSpec, origin = 'משפט') {
  const doc = purposeDoc(sentence, origin);
  const spec = parseSpec(draftSpec);
  const findings = check(doc, spec);
  const rulings = findings.map((f) => pasak(f, doc, spec));
  const built = applyPsak(spec, rulings);
  return {
    spec: built.text, changed: built.changed, rulings,
    decided: rulings.filter((r) => r.decided).length,
    switches: rulings.filter((r) => !r.decided),
    open: doc.open, sources: doc.sources,
  };
}

/** שמות-השדות שיש להם מוצא מוצהר בשרשרת-המטרה — סוג-המקור השני של שער-ההמצאה. */
export function purposeSources(sentence, origin = 'משפט') { return purposeDoc(sentence, origin).sources; }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = process.argv.slice(2).filter((a) => !a.startsWith('--')).join(' ');
  if (!s) { console.log('usage: node yeshiva/purpose.mjs "<משפט חופשי>"'); process.exit(0); }
  const d = purposeDoc(s);
  console.log('משפט: ' + d.title);
  console.log('תחום: ' + (d.domain.pick || '(אין)') + (d.domain.ranked?.[0]?.src ? ' · ' + d.domain.ranked[0].src : ''));
  for (const l of d.sections['חובה']) console.log(l);
  console.log(`\nשקעי-חובה (${d.mandatory.length}): ${d.mandatory.join(', ') || '—'}`);
  console.log(`שקעי-רשות (${d.optional.length}): ${d.optional.join(', ') || '—'}`);
  console.log(`מתגים (${d.open.length}): ${d.open.map((o) => `${o.word}[${o.options}]`).join(' · ') || '—'}`);
  const srcs = [...new Set(d.sources.values())];
  console.log(`מקורות (${srcs.length}): ${srcs.slice(0, 3).join(' · ')}${srcs.length > 3 ? ' …' : ''}`);
}
