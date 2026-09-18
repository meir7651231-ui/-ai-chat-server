#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  intent.mjs — שכבת-הכוונה (הכרעה 23): משפט-חופשי ⇒ פרופיל-יכולות, נגזר
//  מ**מטרות-האטומים** בלבד (אפס-מילון · עיוור-דומיין). מריץ retrieve-לפי-מטרה
//  (match.mjs, נלמד מ-254 מסכי-המקור) ⇒ מצרף את תגי-היכולת (caps · נגזרי-צורה:
//  kpi/list/card/status/progress/trend) של האטומים-שהותאמו ⇒ אילו יכולות להרכיב.
//  'חללית' ו-'מסעדה' עוברים אותו מסלול — המנוע לא יודע מה הם. חלק מ-intent→purpose→compose.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import { retrieve } from './match.mjs';
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const IDX = JSON.parse(fs.readFileSync((R.GEN_DIR + 'atom-index.json'), 'utf8'));
const CAPS = {}; for (const a of IDX) CAPS[a.cls] = a.caps || [];
// detail = ~65% מהאטומים (רועש) · chrome = לא-יכולת. שאר-התגים = סיגנל-אמת.
const NOISE = new Set(['detail', 'chrome']);

export function intentProfile(sentence, k = 14) {
  const atoms = retrieve(sentence, k);
  const cap = {};
  for (const a of atoms) for (const c of (CAPS[a.cls] || [])) if (!NOISE.has(c)) cap[c] = +((cap[c] || 0) + a.s).toFixed(2);
  const sorted = Object.entries(cap).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;
  // יכולת "נוכחת" = מעל 12% מהמשקל (רצפה מבנית, לא מילון)
  const present = sorted.filter(([, v]) => v / total >= 0.12).map(([c]) => c);
  // 🕯️ «יכולות-נוכחות: (אין)» היה משפט בלי מקורות: המנוע לא אמר שסרק k אטומים, ולא אמר
  //    אילו תגים כן הופיעו ונשרו מתחת לרצפת-12%, ולא הבדיל בין «אין אטום» ל«אין תג-יכולת
  //    לאטומים שנמצאו» — שתי «אין» שונות לגמרי. עכשיו כל תג נפסק בשמו ובמשקלו.
  rminhu({ engine: 'intent', matter: `משפט «${String(sentence).slice(0, 60)}»`,
    searched: [`match.retrieve top-${k}`, `atom-index.caps של ${atoms.length} אטומים שהותאמו`,
      atoms.length ? `אטומים: ${atoms.slice(0, 4).map((a) => a.cls).join('/')}` : 'אפס אטומים הותאמו'],
    rulings: sorted.map(([c, v]) => (v / total >= 0.12
      ? had(c, `משקל ${v} = ${(100 * v / total).toFixed(0)}% ≥ רצפה 12%`)
      : pliga(c, `משקל ${v} = ${(100 * v / total).toFixed(0)}% מתחת לרצפה המבנית 12% — תג-רקע של האטומים שהותאמו, לא יכולת שהמשפט ביקש`)))
      .concat(atoms.length && !sorted.length ? [lo(`caps של ${atoms.length} אטומים`, 'האטומים הותאמו אך כל תגיהם detail/chrome (רעש) — נמצא אטום, אין תג-יכולת: זו «אין» אחרת מ«אין אטום»')] : []) });
  return { present, caps: Object.fromEntries(sorted), atoms: atoms.slice(0, 6).map((a) => `${a.cls}(${a.s})`) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = process.argv.slice(2).join(' ');
  if (!s) { console.log('usage: node intent.mjs "<free hebrew>"'); process.exit(0); }
  const p = intentProfile(s);
  console.log('IN: ' + s);
  console.log('  יכולות-נוכחות:', p.present.join(' · ') || '(אין)');
  console.log('  משקלים:', JSON.stringify(p.caps));
  console.log('  אטומים:', p.atoms.join(' · '));
  (await import('../../yeshiva/rminhu.mjs')).printNotes('intent');
}
