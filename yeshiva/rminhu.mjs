// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/rminhu.mjs — 🕯️ הדפוס הישיבתי «ורמינהו» כשכבה אחת, לכל מנוע-חיפוש.
//  ────────────────────────────────────────────────────────────────────────
//  למה שכבה ולא עותק בכל מנוע: L111 מילה-במילה — «פותר אחד, מיוצא, ולא *רק
//  שתי שורות, מהר להעתיק*». 38 עותקים של אותו דפוס = 38 אמיתות שסוחפות.
//  הדפוס עצמו אינו חדש: הוא חולץ מ-`machtzev/generator/particles.mjs`
//  (`rminhuAtom` · קומיט 80fabc33 · 27 שורות) ששם הוא כבר פסק על 8 מקורות
//  ולא דיווח. מה שנוסף כאן הוא **הדיווח** (L114: «מהלך בלי דיווח = חצי מהלך»)
//  והנגישות לכל מנוע.
//
//  החוזה (הכרעה-23 · LAW.md:48-85): מנוע **לא אומר «אין»** לפני שהוא
//   (א) אומר על מה חיפש  (ב) פוסק על **כל** מקור שהחיפוש הביא, בשמו
//   (ג) מדווח לפנקס.  «אין» = «לא-חיפשת».
//
//  שלושת הפסקים (אותם שלושה שהשער הישיבתי מקבל — `gate.py:cmd_rminhu`):
//    • חד שיעורא — המקור הזה **הוא** התשובה ⇒ המנוע פולט אותו, לא «אין».
//    • פליגא      — נמצא ואינו מתאים, **ולמה** (≥25 תווים: «פליגא» בלי חילוק
//                   אינו פסק — השער הישיבתי דוחה אותו, וכך גם כאן).
//    • לא שייך    — נמצא ואינו בעניין בכלל.
//
//  הפנקס (L114: «פנקס אחד אצל הישיבה»): `.maimatai/log.jsonl` בשורש —
//  **אותו קובץ ואותה צורת-רשומה** ש-`python -m yeshiva.gate rminhu` כותב
//  (`{t, prompt, rminhu:{matter, sources|none}}`), כך ש-`gate log` קורא את
//  מהלכי-המנועים בלי שינוי בישיבה. לא פנקס שני.
//
//  שימוש במנוע (בנקודה שבה הוא עומד להחזיר ריק):
//    import { rminhu, HAD, PLIGA, LO } from '<...>/yeshiva/rminhu.mjs';
//    const r = rminhu({ engine: 'match', matter: `בקשה «${q}»`,
//      searched: ['atlas.widgets', 'atlas.functions'],
//      rulings: cands.map((c) => ({ src: c.id, verdict: ok(c) ? HAD : PLIGA,
//        why: ok(c) ? `ציון ${c.s}` : `ציון ${c.s} מתחת לרצפה ${FLOOR} — אין חפיפת-טוקנים` })) });
//    if (r.hit) return r.hit.src;        // חד שיעורא ⇒ פליטה
//    console.log(r.line);               // «לא מצינו» — עם מה שנחפש ולמה כל מקור נדחה
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../machtzev/root.mjs';

export const HAD = 'חד שיעורא';
export const PLIGA = 'פליגא';
export const LO = 'לא שייך';
const VERDICTS = [HAD, PLIGA, LO];

export const LEDGER = () => (process.env.YESHIVA_LEDGER
  ? path.resolve(process.env.YESHIVA_LEDGER)
  : path.join(R.ROOT, '.maimatai', 'log.jsonl'));

// ── אימות-הפסק: אותן ארבע דחיות של `gate.py:cmd_rminhu`, בשפת-המנוע. ─────
//    פסק שהשער הישיבתי דוחה — נדחה גם כאן, אחרת הפנקס מתמלא ב«פליגא» ריקים.
export function checkRuling(r) {
  if (!r || !r.src) return 'מקור בלי שם (src) — «ורמינהו» חייב לנקוב את המקור';
  const v = String(r.verdict || '');
  if (!VERDICTS.includes(v)) return `פסק אינו אחד משלושה (${VERDICTS.join(' / ')}): «${v}»`;
  const why = String(r.why || '');
  //    «פליגא» בלי חילוק אינו פסק (gate.py: unresolved אם len<25 על המחרוזת המלאה).
  if (v === PLIGA && (v + ': ' + why).length < 25) return `«פליגא» בלי הכרעה על ${r.src}: מי גובר ולמה? (חילוק לפני הכרעה)`;
  if (!why) return `פסק בלי סיבה על ${r.src}`;
  return null;
}

// מונע התנפחות: אותו (מנוע · עניין · טביעת-הפסקים) נרשם פעם אחת לריצה.
const seen = new Set();
let wrote = 0;
// 🔴 **התקרה נקראת בכל קריאה, לא בזמן-ייבוא.** נמדד (w-agg-26 · 18.9): `const CAP = …`
//    ב-top-level נתפס ברגע הייבוא, ולכן תוכנית שקובעת `YESHIVA_LEDGER_CAP` בתוך עצמה
//    (‏ולא בשורת-הפקודה) לא השפיעה כלל. אותה מחלקת-באג של L110 («קונפיג שנתפס בזמן-ייבוא»).
const cap = () => Number(process.env.YESHIVA_LEDGER_CAP || 400);
const SEP = String.fromCharCode(0);

/** רשומה לפנקס — בצורת-הרשומה של `gate rminhu`, בקובץ שלו. מחזיר את הנתיב, או null אם לא נרשם.
 *  ‏`rec.always` — **מהלך-הכותרת של המנוע עוקף את התקרה.** נמדד: סריקת-קורפוס מייצרת
 *  אלפי מהלכי-מִשנה, התקרה נסגרת עליהם, והמהלך שבשבילו רץ הכלי (‏7 פסקי-ישיבה) **לא נרשם
 *  כלל** — «מהלך בלי דיווח = חצי מהלך» (L114) נשבר דווקא במקום היחיד שחשוב. התקרה נועדה
 *  נגד לולאה, לא נגד הכותרת; לכן `always` פטור ממנה (וגם ממנו נספר ב-`wrote`). */
export function report(rec) {
  const key = [rec.engine, rec.matter, rec.fp].join(SEP);
  if (seen.has(key)) return null;
  seen.add(key);
  if (!rec.always && wrote >= cap()) return null;      // תקרה, לא בליעה: reported().capped אומר שנחתך
  const body = rec.none ? { matter: rec.matter, none: rec.none }
    : { matter: rec.matter, sources: rec.rulings.map((r) => [r.src, `${r.verdict}: ${r.why}`]) };
  const line = JSON.stringify({ t: Date.now() / 1000, prompt: `${rec.engine} · ${rec.matter}`, engine: rec.engine, searched: rec.searched || [], rminhu: body });
  const f = LEDGER();
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.appendFileSync(f, line + '\n');                   // בלי try: פנקס שנכשל בשקט = L110 מילה-במילה
  wrote += 1;
  return f;
}

/** כמה מהלכים נרשמו בריצה הזאת, וכמה נחתכו בתקרה — למי שמדפיס סיכום. */
export const reported = () => ({ wrote, distinct: seen.size, capped: Math.max(0, seen.size - wrote) });

// ── שורות-הפסק של הריצה. מנוע-ספרייה אינו מדפיס בתוך לולאה (מזהם פלט של קוראים);
//    הוא אוסף, וה-CLI/השער מדפיס — בדיוק כמו `notes` ב-particles.mjs. הפנקס נכתב בכל מקרה.
const lines = [];
export const notes = () => lines.slice();
export function printNotes(label = '') {
  if (!lines.length) return 0;
  if (label) console.log(`🕯️ ורמינהו · ${label}: ${lines.length} מהלכים (פנקס: ${LEDGER()})`);
  for (const l of lines) console.log('   ' + l);
  return lines.length;
}

/**
 * 🕯️ ורמינהו על עניין אחד.
 *  { engine, matter, searched:[מה נסרק], rulings:[{src,verdict,why}], none:'<מה חיפשתי>' }
 *  ⇒ { hit, rulings, digest, line, ledger }
 *  `hit` = הפסק הראשון «חד שיעורא» (⇒ המנוע פולט אותו ואינו אומר «אין»).
 *  `line` = המשפט שהמנוע מדפיס: מה נחפש · כמה מקורות · ולמה כל אחד נדחה.
 */
export function rminhu({ engine, matter, searched = [], rulings = [], none = '', always = false } = {}) {
  if (!engine) throw new Error('ורמינהו: חסר engine — הפנקס נרשם בשם המנוע');
  if (!matter) throw new Error('ורמינהו: חסר matter — על איזה עניין מחפשים מקורות אחרים?');
  if (!rulings.length) {
    //    אין מקורות בכלל ⇒ «לא מצינו», והוא חייב לומר **מה** נחפש (gate.py: --none ≥12 תווים).
    const txt = none || (searched.length ? `חיפשתי ב-${searched.join(' · ')}; לא מצינו` : '');
    if (txt.length < 12) throw new Error(`ורמינהו על «${matter}»: «לא מצינו» חייב לומר מה חיפשת (searched או none) — «אין» = «לא-חיפשת»`);
    const ledger = report({ engine, matter, searched, none: txt, fp: 'none', always });
    const line = `⚪ ${engine}: ${matter} — ורמינהו: ${txt}`;
    if (ledger) lines.push(line);
    return { hit: null, rulings: [], digest: '', line, ledger };
  }
  const bad = rulings.map(checkRuling).filter(Boolean);
  if (bad.length) throw new Error(`ורמינהו על «${matter}» — פסק פסול:\n  ` + bad.join('\n  '));
  const hit = rulings.find((r) => r.verdict === HAD) || null;
  const digest = digestOf(rulings);
  const fp = rulings.map((r) => `${r.src}=${r.verdict}`).join('|');
  const ledger = report({ engine, matter, searched, rulings, fp, always });
  const line = hit
    ? `🕯️ ${engine}: ${matter} — ורמינהו: ${rulings.length} מקורות · חד שיעורא ${hit.src} · ${digest}`
    : `⚪ ${engine}: ${matter} — ורמינהו: ${rulings.length} מקורות נפסקו, לא מצינו חד-שיעורא: ${digest}${searched.length ? ` · חיפשתי: ${searched.join('/')}` : ''}`;
  if (ledger) lines.push(line);
  return { hit, rulings, digest, line, ledger };
}

// ── הפסק המלא נשמר **בפנקס**; השורה-לאדם מקבצת פסקים זהים. 38 פעולות-יסוד שנפלו על
//    אותה סיבה אחת הן עובדה אחת, לא 38 — ושורה של 6,000 תווים אינה דיווח, היא רעש
//    (ומי שקורא אותה לומד פחות ממי שקורא «34× פליגא: <הסיבה>»). מי שצריך את הכל: `gate log`.
function digestOf(rulings, maxGroups = 6) {
  const groups = new Map();
  for (const r of rulings) {
    const k = `${r.verdict}\u0001${r.why}`;
    if (!groups.has(k)) groups.set(k, { verdict: r.verdict, why: r.why, srcs: [] });
    groups.get(k).srcs.push(r.src);
  }
  const parts = [...groups.values()].slice(0, maxGroups).map((g) => {
    const names = g.srcs.slice(0, 3).join(',') + (g.srcs.length > 3 ? `,+${g.srcs.length - 3}` : '');
    const why = g.why.length > 110 ? g.why.slice(0, 110) + '…' : g.why;
    return g.srcs.length === 1 ? `${names}=${g.verdict}(${why})` : `${g.srcs.length}× ${g.verdict} [${names}]: ${why}`;
  });
  if (groups.size > maxGroups) parts.push(`ועוד ${groups.size - maxGroups} פסקים (בפנקס)`);
  return parts.join(' · ');
}

/** קיצור למנוע שכל המועמדים שלו נדחו על אותה רצפה: (src, why) ⇒ פסק מנומק. */
export const pliga = (src, why) => ({ src, verdict: PLIGA, why });
export const had = (src, why) => ({ src, verdict: HAD, why });
export const lo = (src, why) => ({ src, verdict: LO, why });
