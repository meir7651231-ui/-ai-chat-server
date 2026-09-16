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
      doc.open.push({ word: e.word, options: n });
      ev.push(`- «${e.word}» — ${n} מועמדי-סכמה, אין יחיד ⇒ מתג (לא הוכרע)`);
      continue;
    }
    doc.entities.push({ word: e.word, cls: o.cls });
    for (const f of o.fields) {
      if (!f.src) continue;                                  // שדה בלי מוצא אינו ראיה
      const n = norm(f.name); if (!n || doc.sources.has(n)) continue;
      (f.optional ? doc.optional : doc.mandatory).push(n);
      doc.sources.set(n, f.src);
    }
    ev.push(`- «${e.word}» ≡ ${o.cls} (${o.fields.length} שקעים) · ${(o.evidence || []).join(' · ')}`);
  }
  doc.sections['חובה'] = ev;
  return doc;
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
