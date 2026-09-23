// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/atom-psak.mjs — 🕯️ **הישיבה על בחירת-אטום.** (הכרעת-בעלים 23.9: «זה לא מה שהישיבה עושה?» ⇒ «תתחיל לחבר»)
//  ──────────────────────────────────────────────────────────────────────────
//  L114: «בחירה בין מועמדים — לא בתוך המנוע; המנוע שואל את הישיבה». עד כאן המנוע בחר לפי
//  ספירת-חורים (pickWired: הראשון-שמתחבר / הכי-הרבה-מולא). כאן כל מועמד עולה לפסק, לפי
//  המהלכים של הפוסק (PSAK.md), על **צורת** המטרה — לא על משמעות:
//    · §20-ג      שקע-חובה בלי דאטה           ⇒ פליגא
//    · שיעור      סף במקור (מספר+יחס) ואין חור לסף/מצב ⇒ פליגא   («ציון מתחת ל-55» ≠ מונה)
//    · איכא דאמרי ערכים במקור ואין חור לבחירה   ⇒ פליגא
//    · ייתור      חור-קישוט שאין לו נתון (trend/delta/series — L73) ⇒ פליגא
//    · ורמינהו    כל מועמד נפסק בשמו לפני «אין»; «אין» = לא-חיפשת
//    · ממה נפשך   שני שורדים עם אותם חורים מלאים ⇒ אין שאלה, הראשון
//    · אות-צורה   (L83 · auto-skin) אטום מדוד ב-forge-manifest נמדד לתפקיד (purpose.role): הצורה לא מקיימת את
//                 דרישת-התפקיד (fits) או ניקוד-הייעוד אין (למשל kpi בלי הדגשת-מספר) ⇒ פליגא. לא-מדוד ⇒ בלי פסק, מצוין.
//    · הכרעה-20א  אחרת: מכסה הכי הרבה מהצורך, ואז ניקוד-הצורה (מדוד-חיובי > לא-מדוד > מדוד-שלילי), ואז הכי-מעט חורים נותרים
//  🔒 אפס היוריסטיקה של יופי, אפס שם-אטום בניקוד (L83). כל הכרעה נושאת מהלך וראיה.
//  שימוש: judge({ purpose, cands, wire, widgetOf, sigOf? }) ⇒ { pick, rulings, said }
//    purpose = { kind: 'עובדה'|'שיעור', need: ['label','value',…], threshold?: n, op?: '<'|'>', enumVals?: [] , text, role?: 'kpi'|…, roles?: [] }
//    sigOf(cls) ⇒ רשומת forge-manifest (אותות-צורה) | null · ברירת-מחדל: new/dart-forge-bs/forge-manifest.json לפי cls
//    cands   = ['Cls@…', …] (מה שהחיפוש הביא, בסדרו) · wire(cls) ⇒ {cls, filled, sockets, call, file} | null
//    widgetOf(cls) ⇒ { types: Map, required: Set, positional: [] } (האטלס)
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import { fits, score, ROLES } from '../machtzev/generator/auto-skin.mjs';   // אותות-הצורה של ds-forge (L83) — אותו מודד, בלי העתק
import { atomSigs } from '../machtzev/generator/atom-sig.mjs';   // אותם אותות לאטומי-Dart (atlas + פיגמנטים) — «יש לך את המנועים ⇒ תחבר»
export const KIND = { fact: 'עובדה', shiur: 'שיעור' };   // סוגי-מטרה (צורה): עובדה = תווית+ערך · שיעור = סף במקור
const DATA = JSON.parse(fs.readFileSync(new URL('./atom-psak.data.json', import.meta.url), 'utf8'));
export const roleOf = (op) => DATA.roleOf[op] || null;   // פעולת-חיפוש ⇒ תפקיד-עור מדוד (דאטה); אין ⇒ null = אין מדידת-צורה
let MAN = null;
const manifest = () => (MAN ||= new Map(JSON.parse(fs.readFileSync(new URL('../new/dart-forge-bs/forge-manifest.json', import.meta.url), 'utf8')).atoms.map((a) => [a.cls, a])));
export const sigOfDefault = (cls) => manifest().get(cls) || atomSigs().get(cls) || null;   // forge (CSS) ⇒ אחרת Dart
// אות-צורה: אטום מדוד מול התפקידים המבוקשים ⇒ { ok, score, role, why } · לא-מדוד ⇒ null
function shapeOf(a, roles) {
  if (!a || !roles.length) return null;
  let best = null; const fails = [];
  for (const role of roles) {
    const R = ROLES[role]; if (!R) continue;
    if (R.fam && a.family == null) continue;   // תפקיד שדורש משפחה ואטום בלי משפחה מוצהרת ⇒ לא נמדד לתפקיד הזה (לא נפסל)
    if (!fits(a, R)) { fails.push(`${role}: הצורה לא מקיימת ${R.need}`); continue; }
    const sc = score(role, a);
    if (sc == null) { fails.push(`${role}: ניקוד-ייעוד אין (numEmph ${(a.sig && a.sig.numEmph) || 0})`); continue; }
    if (!best || sc > best.score) best = { ok: true, score: sc, role };
  }
  if (!best && !fails.length) return null;   // אף תפקיד לא נמדד ⇒ לא-מדוד
  return best || { ok: false, score: null, role: null, why: fails.join(' · ') };
}
const SOCK_THR = /^(threshold|thr|limit|max|min|target|goal|of|total|cap|bound)$/i;
const SOCK_STATE = /^(tone|severity|level|status|state|ok|danger|warn|alert)$/i;
const SOCK_ENUM = /^(items|options|values|choices)$/i;
const SOCK_DECOR = /^(trend|delta|series|spark|sparkline|history|points|change|diff)$/i;
const SOCK_MATCH = { label: /^(label|title|caption|name|text)$/, value: /^(value|val|amount|total|count|num)$/, sub: /^(sub|subtitle|desc|body|note)$/, glyph: /^(glyph|emoji|icon)$/, onTap: /^(onTap|onPressed)$/, message: /^(message)$/, items: SOCK_ENUM, labels: /^(labels|cols|columns|headers)$/, rows: /^(rows|data)$/, fraction: /^(fraction|pct|percent|progress)$/ };   // אותן צורות-שקע כמו particles.SOCK

export function judge({ purpose, cands, wire, widgetOf, skinWired = null, sigOf = sigOfDefault }) {
  const rulings = [];
  const survivors = [];
  const roles = purpose ? (purpose.roles || (purpose.role ? [purpose.role] : [])).filter(Boolean) : [];
  for (const cand of cands) {
    const cls = String(cand).split('@')[0];
    const w0 = widgetOf ? widgetOf(cls) : null;
    const names = w0 ? [...w0.types.keys()].filter((n) => !/^(key|child|children|bare)$/.test(n)) : [];
    const w = wire(cls);
    if (!w) { const skin = skinWired && w0 && !skinWired(w0.file); rulings.push({ cls, verdict: 'פליגא', move: skin ? 'לובש-עור (L102)' : '§20-ג', why: skin ? 'צבע קשיח — לא לובש את העור' : 'שקע-חובה בלי דאטה' }); continue; }
    // אין מערבין: אטום שבנוי לשורה (flexRoot: Expanded/Flexible בשורש — עובדת-אטלס) בתוך עמודה ⇒ ממלא את כל המסך ⇒ פליגא
    if (w0 && w0.flexRoot && (!purpose || purpose.placement !== 'row')) { rulings.push({ cls, verdict: 'פליגא', move: 'אין מערבין', why: 'בנוי-לשורה (Expanded בשורש) בתוך עמודה' }); continue; }
    const unfilled = names.filter((n) => !w.filled.includes(n));
    // שיעור: יש סף במטרה ⇒ האטום חייב חור לסף או למצב-חריגה
    if (purpose && purpose.kind === KIND.shiur) {
      const has = names.some((n) => SOCK_THR.test(n) || SOCK_STATE.test(n));
      if (!has) { rulings.push({ cls, verdict: 'פליגא', move: 'שיעור', why: `סף ${purpose.op || ''}${purpose.threshold} במקור — אין חור לסף/מצב (חורים: ${names.join(',') || '—'})` }); continue; }
    }
    // איכא דאמרי: ערכים במקור ⇒ חור לבחירה
    if (purpose && purpose.enumVals && purpose.enumVals.length && !names.some((n) => SOCK_ENUM.test(n))) { rulings.push({ cls, verdict: 'פליגא', move: 'איכא דאמרי', why: `${purpose.enumVals.length} ערכים במקור — אין חור לבחירה` }); continue; }
    // ייתור: חור-קישוט-של-נתון שלא מולא = אות-שווא (L73)
    const decor = unfilled.filter((n) => SOCK_DECOR.test(n));
    if (decor.length) { rulings.push({ cls, verdict: 'פליגא', move: 'ייתור', why: `קישוט בלי נתון: ${decor.join(',')}` }); continue; }
    const need = (purpose && purpose.need) || [];
    const covered = need.filter((k) => (SOCK_MATCH[k] || new RegExp(`^${k}$`)).source && w.filled.some((n) => (SOCK_MATCH[k] || new RegExp(`^${k}$`)).test(n)));
    // ייתור · חובה בלי שדה: דרישה במטרה (value/label/…) שאין לה חור באטום ⇒ פליגא — המספר הוא התשובה, אטום בלי מקום למספר אינו תשובה
    const missingNeed = need.filter((k) => !covered.includes(k));
    if (missingNeed.length) { rulings.push({ cls, verdict: 'פליגא', move: 'ייתור · חובה בלי שדה', why: `אין חור ל-${missingNeed.join(',')} (מולאו: ${w.filled.join(',')})` }); continue; }
    // אות-צורה (L83): מדוד ⇒ חייב להתאים לתפקיד ולקבל ניקוד-ייעוד; לא-מדוד ⇒ מצוין, לא נפסל
    const shape = shapeOf(sigOf ? sigOf(cls) : null, roles);
    if (shape && !shape.ok) { rulings.push({ cls, verdict: 'פליגא', move: 'אות-צורה (L83)', why: shape.why }); continue; }
    survivors.push({ cls, w, covered: covered.length, left: unfilled.length, filledKey: [...w.filled].sort().join(','), shape: shape ? shape.score : 0, measured: !!shape });
    rulings.push({ cls, verdict: 'חד שיעורא', move: 'ורמינהו', why: `מתחווט (${w.filled.join(',')})${unfilled.length ? ` · נותרו ${unfilled.length}` : ''} · מכסה ${covered.length}/${need.length}${shape ? ` · צורה ${shape.role} ${shape.score.toFixed(1)}` : roles.length ? ' · לא-מדוד' : ''}` });
  }
  if (!survivors.length) return { pick: null, rulings, said: `אין: ${cands.length} מועמדים נפסקו בשמם`, pickShape: null, pickMeasured: false, bestMeasured: -Infinity };
  // ממה נפשך: אותם חורים מלאים ואותה צורה ⇒ אין שאלה ⇒ הראשון. אחרת הכרעה-20א: הכי-הרבה-מהצורך, ואז ניקוד-הצורה, ואז הכי-מעט-נותרים; שוויון ⇒ סדר-החיפוש
  const best = survivors.reduce((a, b) => (b.covered > a.covered || (b.covered === a.covered && (b.shape > a.shape || (b.shape === a.shape && b.left < a.left)))) ? b : a, survivors[0]);
  const same = survivors.filter((s) => s.filledKey === best.filledKey && s.shape === best.shape);
  const chosen = same.length > 1 ? same[0] : best;
  const move = same.length > 1 && same[0].cls !== best.cls ? 'ממה נפשך' : same.length > 1 ? 'ממה נפשך' : 'הכרעה-20א';
  rulings.push({ cls: chosen.cls, verdict: 'הלכתא', move, why: `מכסה ${chosen.covered}/${(purpose && purpose.need || []).length} · נותרו ${chosen.left}${chosen.measured ? ` · צורה ${chosen.shape.toFixed(1)}` : roles.length ? ' · לא-מדוד' : ''}${same.length > 1 ? ` · ${same.length} מועמדים עם אותם חורים מלאים` : ''}` });
  return { pick: chosen.w, rulings, said: `${chosen.cls} (${move})`, pickShape: chosen.shape, pickMeasured: chosen.measured, bestMeasured: Math.max(...survivors.filter((x) => x.measured).map((x) => x.shape), -Infinity) };
}

/** שורת-פנקס אחת לחלקיק: מי נבחר, ומי נפסל ולמה (L114: מהלך בלי דיווח = חצי מהלך). */
export function ledgerLine(name, r) {
  const fell = r.rulings.filter((x) => x.verdict === 'פליגא').map((x) => `${x.cls}: ${x.move} — ${x.why}`);
  return `⚖️ ${name} ⇒ ${r.pick ? r.said : r.said}${fell.length ? ` · פליגא ${fell.length}: ${fell.slice(0, 4).join(' | ')}${fell.length > 4 ? ' …' : ''}` : ''}`;
}
