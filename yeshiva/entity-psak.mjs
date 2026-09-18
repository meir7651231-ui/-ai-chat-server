#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/entity-psak.mjs — 🕯️ **«ישות-לא-מוכרעת» עולה לישיבה.**
//  ────────────────────────────────────────────────────────────────────────
//  הפער שזה סוגר (PLAN-100 §4 · מדידה): 12 יחידות בקורפוס נופלות על
//  «ישות-לא-מוכרעת» — מילה שיש לה **כמה** מועמדי-מחלקה, ו-`soleClassOf`
//  פולט מתג. L114 פסקה על המקרה הזה בשמו: «החלטה בין מועמדים: **לא בתוך
//  המנוע** — המנוע שואל את הישיבה דרך הממשק הקיים… בקשה אחת לריצה»;
//  ו«מה שאין הוא **מנוע במחולל שקורא לו**». כאן הוא קורא.
//
//  🔒 **מה שאין כאן: היוריסטיקה.** אין שורה שמשווה ניקוד ובוחרת גבוה, אין
//  «הראשון-שמתאים», ואין מילון-דומייני. הקובץ **מקודד עובדות-מדודות**
//  (מי מצהיר · באיזה מקור · באיזו דרגת-התאמה), ומוסר אותן ל-`YeshivaEngine`.
//  ההלכתא נולדת שם. מי שיחשוד — ה-trace המלא שמור בפסק, שורה-שורה.
//
//  🔢 **הקידוד — כל מקור והדרגה שלו, עם הנימוק לדרגה:**
//   • `KATUV`   ‏LAW.md §20-ג · הכרעה-24 — חוקת-הבעלים. אין מעליה.
//   • `MISHNA`  ‏machtzev/LEARNINGS.md L114 — פסק-ישיבה שנרשם כלקח.
//   • `BRAITA`  ‏entity-terms.data.json — **אטום-המונחים הגלובלי**: הצהרה
//               מפורשת «מונח ⇒ ישות», שנכתבה בדיוק לשאלה הזאת (tzinor.mjs:47-49
//               מונה אותה כאחד משלושה «מקורות-אמת»).
//   • `AMORA+MAASEH` ‏vertical-packs.mjs — מדידה: החבילה מצהירה מונח, אבל
//               המונח שם הוא **שם-התפקיד בוורטיקל**, לא מונח-גלובלי. הראיה
//               לכך היא בדאטה עצמה: `shop` מצהירה `entity.family:"לקוח"`
//               **וגם** `entity.supporter:"לקוח"` — אותה מילה לשני תפקידים
//               באותה חבילה. מקור שסותר את עצמו בכל גווני אינו מונח-גלובלי.
//               ‏🔴 L115: `MAASEH` הוא `kind`, לא `rank` — מדידה = AMORA+MAASEH.
//   • `AMORA+MAASEH` ‏tzinor.scoreForm — דרגת-ההתאמה שנמדדה (3 מדויקת ·
//               2 נטייה · 1 תחילית-בלבד).
//   • `SEVARA`  ‏חילוק.
//   • `HAVA_AMINA` ‏הנחת-הנוחות («קח את בעל-הניקוד-הגבוה») — נרשמת כדי
//               שהסוגיא תראה שהיא **נדחתה**, לא שלא עלתה.
//
//  ⏱️ **בקשה אחת לריצה** (L114): כל השאלות של כל המילים נשלחות בקידוד אחד.
//  🕯️ **פנקס אחד** (L114): כל פסק מדווח ל-`.maimatai/log.jsonl` דרך `rminhu`.
//
//  📄 **הפסק יושב בדיסק** (`yeshiva/psak/entity-psak.json`) ולא נשאל בזמן-ריצה:
//    (א) אחרת המחולל היה מתנהג אחרת בקונטיינר עם ישיבה ובקונטיינר בלעדיה —
//        בדיוק הבאג-השקט של L110; (ב) הפסק נכנס ל-diff ונקרא ע"י אדם;
//    (ג) לכל פסק **טביעת-שאלה** (`fp`): השתנו המועמדים ⇒ הפסק אינו על השאלה
//        הזאת ⇒ מתעלמים ממנו (פסק ישן = ירוק-חלול · L27). הרענון הוא הפקודה
//        הזאת, והשער מריץ אותה ומשווה.
//
//  שימוש:
//    node yeshiva/entity-psak.mjs            # מדידה + פסק, לתצוגה (לא כותב)
//    node yeshiva/entity-psak.mjs --write    # + כתיבת yeshiva/psak/entity-psak.json
//    node yeshiva/entity-psak.mjs --gate     # ראצ'ט-טריות: הפסק שבדיסק ≡ ריצה טרייה
//    node yeshiva/entity-psak.mjs --sugya    # + הסוגיא המלאה (שקלא-וטריא) לעין
//  ENV: YESHIVA_ENGINE=<נתיב> · YESHIVA_PSAK_OFF=1 (מכבה את קריאת-הפסק ב-tzinor)
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { askYeshiva, yeshivaHome, KATUV, MISHNA, BRAITA, AMORA, SEVARA, HAVA_AMINA, MAASEH } from './ask.mjs';
import { rminhu, had, pliga, lo, reported, LEDGER } from './rminhu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PSAK_FILE = path.join(HERE, 'psak', 'entity-psak.json');

// ── הממדים · שניהם **נמדדים**, לא מוצהרים ביד ──────────────────────────
export const DIM_PACK = 'חבילת_ורטיקל';      // האם המשפט הצהיר באיזו חבילה הוא
export const DIM_TIER = 'דרגת_ההתאמה';       // tzinor.scoreForm: 3 · 2 · 1
export const PACK_OFF = 'לא_מוצהרת', PACK_ON = 'מוצהרת';
export const TIERS = { 3: 'מילה_מדויקת', 2: 'צורת_נטייה', 1: 'תחילית_בלבד' };
/** החוק השני, ברמת-המילה: לפני «איזו מחלקה» — **האם זו מילת-ישות בכלל**. */
export const lawIsEntity = (w) => `«${w}» היא מילת-ישות`;
export const lawClass = (w, cls) => `«${w}» ⇒ ${cls}`;

// 🔒 **עותק אחד** (L111 מילה-במילה: «פותר אחד, מיוצא»): טביעת-השאלה וסיווג-הראיות
//   חיים ב-`tzinor.mjs` — שם הם **נקראים** בזמן-החלת-הפסק. כותב-הפסק מייבא אותם
//   משם ולא משכפל, אחרת שני חישובי-טביעה יסחפו והפסק «יתיישן» בלי שאיש יראה.
export { psakFingerprint as fingerprint, evidenceKinds as kindsOfEvidence } from '../machtzev/generator/tzinor.mjs';
import { psakFingerprint as fingerprint, evidenceKinds as kindsOfEvidence } from '../machtzev/generator/tzinor.mjs';

const SOURCES = {
  חוק20ג: { name: 'LAW.md §20-ג · הכרעה-24 — «לעולם לא לזייף דאטה»: ספק ⇒ מתג-לבעלים, לא הכרעה-במנוע', rank: KATUV },
  L114: { name: 'machtzev/LEARNINGS.md L114 — בחירה בין מועמדים אינה מוכרעת בתוך המנוע; המנוע שואל את הישיבה', rank: MISHNA },
  מונחים: { name: 'machtzev/generator/entity-terms.data.json — אטום-המונחים הגלובלי (מונח ⇒ ישות + צורות)', rank: BRAITA },
  מסך: { name: 'machtzev/generator/screen-entities.data.json — ישות-מסך חצובה שהבעלים נתן לה מונח (G64)', rank: BRAITA },
  חבילות: { name: 'new/atoms/vertical-packs.mjs — מדידה: המונח בחבילה הוא שם-התפקיד בוורטיקל, ואותה חבילה נותנת אותו מונח לשני תפקידים', rank: AMORA, kind: MAASEH },
  ניקוד: { name: 'מדידה: tzinor.scoreForm (machtzev/generator/tzinor.mjs) — דרגת-ההתאמה של הצורה למילה', rank: AMORA, kind: MAASEH },
  סברא: { name: 'סברא', rank: SEVARA },
  נוחות: { name: 'הנחת-הנוחות: «קח את בעל-הניקוד-הגבוה» / «הראשון-שמתאים»', rank: HAVA_AMINA },
};

/**
 * 🧩 **הקידוד**: מילה + מועמדיה (עובדות-מדודות) ⇒ טענות + שאלות.
 * ‏`cands`: `[{ cls, score, kinds:Set, packs:[], evidence:[] }]`.
 * מחזיר `{ claims, questions }` — ההכרעה **אינה** כאן.
 */
export function encodeWord(word, cands) {
  const claims = [], questions = [];
  const best = Math.max(...cands.map((c) => c.score));
  const tier = TIERS[best] || TIERS[1];

  // ── חוק א' · האם זו מילת-ישות בכלל (דרגת-ההתאמה מכריעה, לא אני) ──
  const LE = lawIsEntity(word);
  claims.push({ law: LE, truth: false, source: 'ניקוד', case: { [DIM_TIER]: TIERS[1] },
    text: `ניקוד 1 = ‏startsWith אחרי קילוף אות-שימוש (tzinor.scoreForm) — «${word}» נושאת את הצורה כתחילית בלבד; זו התאמת-צורה, לא מונח` });
  for (const t of [TIERS[2], TIERS[3]]) claims.push({ law: LE, truth: true, source: 'ניקוד', case: { [DIM_TIER]: t },
    text: `ניקוד ≥2 — הצורה תאמה את המילה במלואה (${t}), ולכן «${word}» היא מונח בשרשרת` });
  questions.push({ law: LE, case: { [DIM_TIER]: tier }, title: `בעי: «${word}» — מילת-ישות היא, או התאמת-צורה?` });

  // ── חוק ב' · מחלקה למחלקה. **טענה אחת לכל מקור שנמדד, ולא יותר.** ──
  for (const c of cands) {
    const law = lawClass(word, c.cls);
    const ct = TIERS[c.score] || TIERS[1];
    if (c.kinds.has('terms')) {
      claims.push({ law, truth: true, source: 'מונחים', case: {},
        text: `אטום-המונחים מצהיר «${word}» ⇒ ${c.cls} — הצהרה גלובלית, בכל גווני (${(c.evidence.find((e) => e.includes('entity-terms')) || '').slice(0, 120)})` });
    } else if (c.kinds.has('screens')) {
      claims.push({ law, truth: true, source: 'מסך', case: {},
        text: `ישות-מסך חצובה עם מונח-בעלים מוצהר: ${(c.evidence[0] || '').slice(0, 120)}` });
    } else if (c.kinds.has('packs')) {
      claims.push({ law, truth: true, source: 'חבילות', case: { [DIM_PACK]: PACK_ON },
        text: `חבילות ${c.packs.slice(0, 5).join('/')} קוראות ל-${c.cls} «${word}» — תקף כשהמשפט הצהיר את החבילה` });
      claims.push({ law, truth: false, source: 'סברא', case: { [DIM_PACK]: PACK_OFF },
        text: `«${word}»⇒${c.cls} נשען על שם-תפקיד בחבילת-ורטיקל בלבד, והמשפט לא הצהיר חבילה; שם-תפקיד בלי חבילה אינו מונח-גלובלי, ולכן אין לו תוקף כאן` });
    }
    if (c.score === 1) claims.push({ law, truth: false, source: 'ניקוד', case: { [DIM_TIER]: TIERS[1] },
      text: `«${word}»⇒${c.cls} נולד מהתאמת-תחילית (ניקוד 1) — אין כאן מונח שנאמר, יש מחרוזת שנחתכה` });
    if (c.score === best) claims.push({ law, truth: true, source: 'נוחות', case: {},
      text: `בעל-הניקוד-הגבוה (${c.score}) — מה שהיינו בוחרים לולא §20-ג` });
    questions.push({ law, case: { [DIM_PACK]: PACK_OFF, [DIM_TIER]: ct },
      title: `בעי: «${word}» ⇒ ${c.cls} — מאי?` });
  }
  return { claims, questions };
}

/** הפסק ברמת-המילה, **מתוך תשובות הישיבה בלבד** (אפס הכרעה כאן). */
export function foldAnswers(word, cands, answers) {
  const by = new Map(answers.map((a) => [a.law, a]));
  const ent = by.get(lawIsEntity(word));
  if (ent && ent.outcome === false) return { psak: 'לא-ישות', cls: null, why: 'הישיבה: «אינה מילת-ישות» — התאמת-צורה, לא מונח' };
  const yes = cands.filter((c) => (by.get(lawClass(word, c.cls)) || {}).outcome === true).map((c) => c.cls);
  const none = cands.filter((c) => (by.get(lawClass(word, c.cls)) || {}).outcome === null).map((c) => c.cls);
  if (yes.length === 1) return { psak: 'הלכתא', cls: yes[0], why: `הישיבה פסקה ${yes[0]} מתוך ${cands.length} מועמדים`, rejected: cands.filter((c) => c.cls !== yes[0]).map((c) => c.cls) };
  return { psak: 'תיקו', cls: null, yes, unresolved: none,
    why: yes.length ? `${yes.length} מחלקות עברו את הישיבה (${yes.join(' · ')}) — אין יחידה` : `אף מחלקה לא עברה את הישיבה${none.length ? ` (${none.length} לא-איפשיטא)` : ''}` };
}

// ══ CLI ════════════════════════════════════════════════════════════════
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const ARGV = process.argv.slice(2);
  const WRITE = ARGV.includes('--write'), GATE = ARGV.includes('--gate'), SUGYA = ARGV.includes('--sugya');
  process.env.YESHIVA_PSAK_OFF = '1';   // הסריקה מודדת את **השאלה**, לא את הפסק שכבר בדיסק
  const T = await import('../machtzev/generator/tzinor.mjs');
  const P = await import('./purpose.mjs');
  const { scanUnits } = await import('../machtzev/generator/behavior-plan.mjs');

  // ── (1) מדידה: אילו מילים בקורפוס באמת מגיעות ל«ישות-לא-מוכרעת» ──────
  const words = new Map();   // מילה ⇒ {units:Set}
  const units = scanUnits();
  for (const u of units) {
    let g; try { g = P.goalPsak(u.text, 'מטרה'); } catch { continue; }
    for (const r of g.requirements) {
      if (r.kind !== 'ישות' || r.cls) continue;
      if (!words.has(r.word)) words.set(r.word, new Set());
      words.get(r.word).add(`${u.src}/${u.id}`);
    }
  }
  console.log(`📏 ${units.length} יחידות ⇒ ${words.size} מילים לא-מוכרעות (${[...words.keys()].join(' · ')})`);

  // ── (2) קידוד: עובדות-מדודות ⇒ טענות. בקשה **אחת** לכל הריצה (L114). ──
  const spec = { title: 'סוגיא דישות-לא-מוכרעת', sugya: SUGYA,
    dimensions: [{ dim: DIM_PACK, values: [PACK_ON, PACK_OFF] },
      { dim: DIM_TIER, values: [TIERS[1], TIERS[2], TIERS[3]], severity: true }],
    sources: SOURCES, claims: [], rules: [], questions: [] };
  // חוקת-הבעלים נכנסת פעם אחת, כרקע-הסוגיא: היא מה שאוסר לנחש כשאין מקור.
  spec.claims.push({ law: 'המנוע מכריע בעצמו בין מועמדים', truth: false, source: 'חוק20ג', case: {},
    text: 'ספק ⇒ מתג-לבעלים; המחולל לא מחליט ואסור לו לנחש' });
  spec.claims.push({ law: 'המנוע מכריע בעצמו בין מועמדים', truth: false, source: 'L114', case: {},
    text: 'בחירה בין מועמדים עולה לישיבה, דרך הממשק הקיים' });

  const perWord = new Map();
  for (const [w, us] of [...words.entries()].sort()) {
    const cands = T.candidatesFor(w).filter((x) => x.cls && x.strict !== false && (x.fields || []).length)
      .map((x) => ({ cls: x.cls, score: x.score, evidence: x.evidence || [],
        kinds: kindsOfEvidence(x.evidence),
        packs: [...new Set((x.evidence || []).filter((e) => e.startsWith(T.SRC.packs)).map((e) => (e.match(/mjs:([a-zA-Z]+)\./) || [])[1]).filter(Boolean))] }));
    if (cands.length < 2) continue;   // אין בחירה ⇒ אין מה לשאול (L114: הישיבה למקרה-הבחירה)
    const { claims, questions } = encodeWord(w, cands);
    spec.claims.push(...claims); spec.questions.push(...questions);
    perWord.set(w, { cands, units: [...us].sort() });
  }
  console.log(`🧾 קידוד: ${spec.claims.length} טענות · ${spec.questions.length} שאלות · ${perWord.size} מילים`);

  // ── (3) הישיבה ─────────────────────────────────────────────────────────
  const r = askYeshiva(spec);
  if (!r.available) { console.log(`⚪ אין ישיבה — ${r.reason}`); process.stderr.write('tool=yeshiva-engine\n'); process.exit(2); }
  if (!r.ok) { console.log(`🚨 הישיבה לא פסקה: ${r.reason}`); process.exit(1); }
  console.log(`🕯️ הישיבה (${r.engine}): ${r.answers.length} תשובות · ${r.wall}ms`);

  // ── (4) קיפול + פנקס. **הדיווח הוא חלק מהמהלך** (L114: בלי דיווח = חצי מהלך). ──
  const out = { at: new Date().toISOString(), engine: path.basename(r.engine), wall: r.wall,
    cmd: 'node yeshiva/entity-psak.mjs --write', units: units.length, words: {} };
  let halakhta = 0, teiku = 0, notEnt = 0;
  for (const [w, { cands, units: us }] of perWord) {
    const mine = r.answers.filter((a) => a.law === lawIsEntity(w) || cands.some((c) => a.law === lawClass(w, c.cls)));
    const f = foldAnswers(w, cands, mine);
    if (f.psak === 'הלכתא') halakhta++; else if (f.psak === 'לא-ישות') notEnt++; else teiku++;
    // 🕯️ ורמינהו: כל מועמד נפסק **בשמו**, עם הפסק שהישיבה נתנה לו.
    rminhu({ engine: 'yeshiva.entity-psak', always: true,   // מהלך-הכותרת — לא נחתך בתקרת-הפנקס
      matter: `מילה «${w}» ⇒ מחלקת-סכמה (${cands.length} מועמדים · ${us.length} יחידות)`,
      searched: ['entity-terms.data.json', 'vertical-packs.mjs', 'screen-entities.data.json', 'sentence.resolve', 'tzinor.scoreForm'],
      rulings: cands.map((c) => {
        const a = mine.find((x) => x.law === lawClass(w, c.cls));
        const o = a ? a.outcome : undefined;
        return o === true && f.cls === c.cls ? had(c.cls, `הלכתא מהישיבה · ניקוד ${c.score} · מקורות ${[...c.kinds].join('+')}`)
          : o === false ? pliga(c.cls, `הישיבה פסקה «לא» · ניקוד ${c.score} · מקורות ${[...c.kinds].join('+')} — ${f.psak === 'לא-ישות' ? 'אינה מילת-ישות' : 'שם-תפקיד בחבילה בלי הצהרת-חבילה'}`)
            : o === null ? pliga(c.cls, `תיקו — לא איפשיטא בישיבה (ניקוד ${c.score} · מקורות ${[...c.kinds].join('+')}); ההכרעה לבעלים ולא במנוע`)
              : lo(c.cls, 'לא נשאל בישיבה — אינו מועמד-אמת בשרשרת');
      }) });
    out.words[w] = { fp: fingerprint(cands), psak: f.psak, cls: f.cls, why: f.why,
      cands: cands.map((c) => ({ cls: c.cls, score: c.score, kinds: [...c.kinds].sort(), packs: c.packs })),
      units: us, ask: { [DIM_PACK]: PACK_OFF },
      question: f.psak === 'תיקו' ? `«${w}»: ${cands.map((c) => c.cls).join(' / ')} — אף מקור גלובלי אינו מצהיר מי מהם; איזו מחלקה?` : null,
      trace: mine.map((a) => ({ law: a.law, outcome: a.outcome, steps: a.trace.steps.map((s) => `${s.marker}${s.marker ? ': ' : ''}${s.text}`) })) };
    console.log(`   ${f.psak === 'הלכתא' ? '✅' : f.psak === 'לא-ישות' ? '🚫' : '⚖️'} «${w}» (${us.length} יח׳) — ${f.psak}${f.cls ? ': ' + f.cls : ''} · ${f.why}`);
  }
  out.summary = { words: perWord.size, halakhta, notEntity: notEnt, teiku, withoutPsak: 0 };
  // 🕯️ הפנקס — מונה בלבד. `printNotes` מדפיס את **כל** מהלכי-הריצה (‏purpose ·
  //   tzinor · 315 יחידות ⇒ מאות שורות), ושורות-של-מנוע-אחר אינן הדיווח של הפסק הזה.
  const led = reported();
  console.log(`🕯️ פנקס: ${led.wrote} מהלכים נרשמו (${led.distinct} נבדלים${led.capped ? ` · ${led.capped} נחתכו בתקרה` : ''}) ⇒ ${LEDGER()}`);
  console.log(`\n📊 ${perWord.size} מילים · הלכתא ${halakhta} · לא-ישות ${notEnt} · תיקו ${teiku} · בלי-פסק 0`);
  if (SUGYA && r.sugya) { console.log(`\n=== ${r.sugya.title} ===`); for (const s of r.sugya.steps) console.log('    '.repeat(s.depth) + (s.marker ? s.marker + ': ' : '') + s.text); }

  const body = JSON.stringify(out, null, 1) + '\n';
  if (WRITE) { fs.mkdirSync(path.dirname(PSAK_FILE), { recursive: true }); fs.writeFileSync(PSAK_FILE, body);
    console.log(`✍️  פסק ⇒ ${path.relative(path.resolve(HERE, '..'), PSAK_FILE)}`); }
  else if (GATE) {
    if (!fs.existsSync(PSAK_FILE)) { console.log(`🚨 אין פסק בדיסק (${PSAK_FILE}) — הרץ --write`); process.exit(1); }
    const D = JSON.parse(fs.readFileSync(PSAK_FILE, 'utf8'));
    const bad = [];
    for (const w of new Set([...Object.keys(D.words || {}), ...Object.keys(out.words)])) {
      const a = (D.words || {})[w], b = out.words[w];
      if (!a) { bad.push(`«${w}»: בריצה-הטרייה ואינו בפסק`); continue; }
      if (!b) { bad.push(`«${w}»: בפסק ואינו בריצה-הטרייה`); continue; }
      if (a.fp !== b.fp) bad.push(`«${w}»: טביעת-השאלה השתנתה (${a.fp} ⇒ ${b.fp}) — המועמדים אינם אותם מועמדים`);
      else if (a.psak !== b.psak || a.cls !== b.cls) bad.push(`«${w}»: הפסק בדיסק ${a.psak}/${a.cls} ≠ ריצה טרייה ${b.psak}/${b.cls}`);
    }
    if (bad.length) { console.log(`🚨 סחף-פסק (פסק ישן = ירוק-חלול · L27):\n   ${bad.join('\n   ')}`); process.exit(1); }
    console.log(`✅ ראצ'ט-טריות: הפסק שבדיסק ≡ ריצה טרייה (${perWord.size} מילים)`);
  }
}
