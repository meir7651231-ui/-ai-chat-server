#!/usr/bin/env node
// 🧭 balagan — «בלגן» האפליקציה-האחת (GENMAX · G33 · הכרעה-29): כל המודולים (ספקי specs-ds בעור-נייר, נגזרים מ-peruks/) בתוך אפליקציה אחת.
//   «היום» מאוחד = מיזוג ספקי-ה-Today של כל המודולים (באיחור · היום · ממתין · עשיתי-לבד · מחר) ·
//   «מה קרה?» = מזהה-הרגע: TF-IDF דטרמיניסטי על מסמכי-הפירוקים (כותרת+«הרגע» מוגברים) ⇒ המודול; עובדות (תאריך · סכום · טלפון) ⇒ טופס-השורש ממולא-מראש ·
//   «נושאים» = 8 כפתורי-הנושא של מסמך-המוצר (balagan-topics.data.json) ⇒ המודולים לפי חפיפת-מילים ·
//   «חיבורים» = מפתח-הבינה של הלקוח (חוק-6, במכשיר) ⇒ צילום ⇒ קריאה ⇒ זיהוי.
//   אפס רשימה סגורה: N = מה שיש ב-apps/*.json ∩ peruk-index.json. פירוק חדש ⇒ מודול חדש, בלי יד. אפס מילון-דומייני של המנוע.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeConsts, write, setLook } from './render-ds.mjs';
import { searchOp, wireAtom, pickWired } from './particles.mjs';
import { renderBehavior } from './app-shell.mjs';
import { L, T } from './chrome.mjs';
import * as R from '../root.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APPS = path.join(HERE, 'apps'), PERUKS = path.join(HERE, 'peruks');
const TOPICS = JSON.parse(fs.readFileSync(path.join(HERE, 'balagan-topics.data.json'), 'utf8')).topics;
const TIME_WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'spec-lang.data.json'), 'utf8')).typeTime || [];   // דקדוק-האפיון: תווית-שדה-שעה (שפה, לא דומיין)
const SLB = JSON.parse(fs.readFileSync(path.join(HERE, 'spec-lang.data.json'), 'utf8'));
const labelIn = (f, words) => !/^(num|date|bool|multiline)$/.test(f.type || '') && !(f.enumVals && f.enumVals.length) && f.label.split(/\s+/).some((w) => words.includes(w));
const isPhoneField = (f) => labelIn(f, SLB.typePhone || []);
const isPersonField = (f) => labelIn(f, SLB.typePerson || []) || (SLB.typePerson || []).some((w) => w.includes(' ') && f.label.includes(w));
const isPercentField = (f) => (f.type === 'num' || !f.type) && f.label.split(/\s+/).some((w) => (SLB.typePercent || []).includes(w));
const isTimeField = (f) => !/^(num|date|bool|multiline)$/.test(f.type || '') && !(f.enumVals && f.enumVals.length) && f.label.split(/\s+/).some((w) => TIME_WORDS.includes(w));
const clsOf = (slug) => 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;
const dq = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;   // Dart string literal

// ── מילים (עברית): טוקנים ≥2, נורמליזציית סופיות, וגרסה בלי אות-שימוש קדמית (ו/ה/ב/ל/מ/ש/כ) לאורך ≥4 ──
const definal = (w) => w.replace(/ך$/, 'כ').replace(/ם$/, 'מ').replace(/ן$/, 'נ').replace(/ף$/, 'פ').replace(/ץ$/, 'צ');
const heWords = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => definal(m[0].replace(/[״׳]/g, ''))).filter((w) => w.length >= 2);
export const variants = (w) => { const out = [w]; if (w.length >= 4 && /^[והבלמשכ]/.test(w)) out.push(w.slice(1)); return out; };

export function loadModules() {
  const index = JSON.parse(fs.readFileSync(path.join(HERE, 'peruk-index.json'), 'utf8'));
  const mods = [];
  // מודולי-הבסיס (שכבה: בסיס — משימות · יומן) קודם: הם היום-יום; אחריהם הפירוקים לפי סדרם
  for (const f of fs.existsSync(APPS) ? fs.readdirSync(APPS).sort() : []) {
    const m = JSON.parse(fs.readFileSync(path.join(APPS, f), 'utf8'));
    if (m.layer === 'base' && m.home && m.look === 'paper') mods.push({ ...m, id: 0, moment: '', category: '', doc: `${m.title} ${m.root.name} ${m.root.fields.map((x) => x.label).join(' ')}` });
  }
  for (const node of index) {
    const mp = path.join(APPS, `${node.ns}.json`); if (!fs.existsSync(mp)) continue;
    const m = JSON.parse(fs.readFileSync(mp, 'utf8')); if (!m.home || m.look !== 'paper') continue;
    const doc = fs.existsSync(path.join(PERUKS, `peruk-${String(node.id).padStart(2, '0')}.md`)) ? fs.readFileSync(path.join(PERUKS, `peruk-${String(node.id).padStart(2, '0')}.md`), 'utf8') : '';
    mods.push({ ...m, id: node.id, moment: node.moment || '', category: node.category || '', doc, layer: m.layer || 'peruk' });
  }
  return mods;
}

// ── מזהה-הרגע: TF-IDF על מסמכי-הפירוקים. כותרת+«הרגע» ×3. מילים ב->50% מהמסמכים = 0 (נגזר, לא רשימת-עצירה) ──
export function buildIdentifier(mods) {
  const N = mods.length; const df = new Map();
  const docs = mods.map((m) => {
    const tf = new Map(); const boost = new Set();
    for (const w of heWords(m.title + ' ' + m.moment)) for (const v of variants(w)) boost.add(v);
    for (const w of heWords(m.doc)) for (const v of variants(w)) tf.set(v, (tf.get(v) || 0) + 1);
    for (const v of boost) tf.set(v, (tf.get(v) || 0) + 3);
    for (const v of tf.keys()) df.set(v, (df.get(v) || 0) + 1);
    return { tf, boost };
  });
  const idf = (v) => { const d = df.get(v) || 0; return d > N * 0.5 ? 0 : Math.log((N + 1) / (d + 1)); };
  return mods.map((m, i) => {
    const { tf, boost } = docs[i];
    const w = [...tf.entries()].map(([v, c]) => [v, (1 + Math.log(c)) * idf(v) * (boost.has(v) ? 3 : 1)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 140);
    return { ns: m.ns, weights: Object.fromEntries(w.map(([v, s]) => [v, Math.round(s * 100) / 100])) };
  });
}
export function identify(ident, text, k = 3) {
  const toks = new Set(); for (const w of heWords(text)) for (const v of variants(w)) toks.add(v);
  return ident.map((d, i) => ({ i, ns: d.ns, score: [...toks].reduce((s, v) => s + (d.weights[v] || 0), 0) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i).slice(0, k);
}
export function selfTest(mods, ident) {
  const bad = [];
  for (const m of mods) { for (const [what, q] of [['כותרת', m.title], ['הרגע', m.moment]]) { if (!q || (m.layer === 'base' && what === 'הרגע')) continue; const h = identify(ident, q, 1); if (!h.length || h[0].ns !== m.ns) bad.push(`${m.ns} · ${what} ⇒ ${h.length ? h[0].ns : '—'}`); } }
  return bad;
}
const topicOf = (m) => {
  const words = new Set([...heWords(m.title + ' ' + m.category + ' ' + m.moment)].flatMap(variants));
  let best = null;
  for (const t of TOPICS) { const n = t.words.reduce((s, w) => s + (heWords(w).every((x) => words.has(x)) ? 1 : 0), 0); if (n > 0 && (!best || n > best.n)) best = { name: t.name, n }; }
  if (!best) { const all = new Set([...heWords(m.doc)].flatMap(variants)); for (const t of TOPICS) { const n = t.words.reduce((s, w) => s + (heWords(w).every((x) => all.has(x)) ? 1 : 0), 0); if (n > 0 && (!best || n > best.n)) best = { name: t.name, n }; } }
  return best ? best.name : L.topicOther;
};

export function buildBalagan() {
  setLook('paper');
  const mods = loadModules();
  if (!mods.length) { console.log('בלגן: אין מודולי-נייר (apps/*.json) — דלג'); return null; }
  for (const d of [R.outDir(), R.dataOutDir()]) if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (/^gen_balagan_[a-z]+(_content)?\.dart$/.test(f)) fs.unlinkSync(path.join(d, f));
  const ident = buildIdentifier(mods);
  const bad = selfTest(mods, ident);
  const selfScores = mods.map((m) => (identify(ident, m.title + ' ' + m.moment, 1)[0] || { score: 1 }).score);   // מכנה-הביטחון פר-מודול
  const titleConf = mods.map((m, i) => { const h = identify(ident, m.title, 1)[0]; return h && h.ns === m.ns ? h.score / selfScores[i] : 1; });
  const weak = Math.round(Math.min(...titleConf) * 0.5 * 1000) / 1000;   // סף-החולשה = חצי מביטחון-הכותרת-הנמוך: כותרת-לבד תמיד מזוהה, שורה-כללית («לשלם ארנונה מחר») נופלת לבסיס
  mods.forEach((m) => { m.topic = topicOf(m); });
  const todayCls = (m) => `${m.home.cls}Today`;

  // ── 1 · moments: נתוני-הזיהוי + identify + facts (Dart טהור) ──
  {
    const slug = 'balagan_moments';
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — מזהה-הרגע: TF-IDF דטרמיניסטי מ-${mods.length} מסמכי-פירוק (כותרת+«הרגע» ×3). אפס-בינה, אפס-מילון. אל תערוך ידנית.
import 'dart:convert';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_behaviors.dart';
class BalaganField { const BalaganField(this.label, this.type, this.required, this.options); final String label, type; final bool required; final List<String> options; }
class BalaganModule {
  const BalaganModule(this.index, this.ns, this.title, this.moment, this.topic, this.weights, this.dateFields, this.numFields, this.descField, this.longField, this.rootSlug, this.fields, this.stages, this.chain, {this.selfScore = 1, this.layer = '', this.required = 0, this.timeFields = const [], this.phoneFields = const [], this.personFields = const [], this.percentFields = const []});
  final int index; final String ns, title, moment, topic, rootSlug; final Map<String, double> weights; final List<String> dateFields, numFields; final String descField, longField; final List<BalaganField> fields; final int stages; final List<String> chain;
  final double selfScore;   // ציון הכותרת+הרגע של המודול עצמו — מכנה-הביטחון
  final String layer;       // 'base' = שכבת-הבסיס (משימות · יומן)
  final int required;       // מספר שדות-החובה — המודול הכללי-ביותר = הכי-פחות
  final List<String> timeFields;   // שדות-שעה (תווית מדקדוק-האפיון typeTime) — «ב-16:30» נכנס לכאן
  final List<String> phoneFields, personFields, percentFields;   // טלפון · מי (עם/אצל/מול X) · אחוז — לפי דקדוק-האפיון
}
class BalaganHit { const BalaganHit(this.module, this.score); final BalaganModule module; final double score; }

const List<BalaganModule> kBalaganModules = [
${mods.map((m, i) => `  BalaganModule(${i}, '${m.ns}', ${dq(m.title)}, ${dq(m.moment)}, ${dq(m.topic)}, {${Object.entries(ident[i].weights).map(([v, s]) => `${dq(v)}: ${s}`).join(', ')}}, [${m.root.fields.filter((f) => f.type === 'date').map((f) => dq(f.label)).join(', ')}], [${m.root.fields.filter((f) => f.type === 'num').map((f) => dq(f.label)).join(', ')}], ${dq(m.root.descField || '')}, ${dq((m.root.fields.find((f) => f.type === 'multiline') || {}).label || '')}, '${m.root.slug}', [${m.root.fields.map((f) => `BalaganField(${dq(f.label)}, '${f.type}', ${f.required ? 'true' : 'false'}, [${(f.enumVals || []).map(dq).join(', ')}])`).join(', ')}], ${(m.root.stages || []).length}, [${(m.chain || []).map(dq).join(', ')}], selfScore: ${selfScores[i]}, layer: '${m.layer || ''}', required: ${m.root.fields.filter((f) => f.required).length}, timeFields: [${m.root.fields.filter(isTimeField).map((f) => dq(f.label)).join(', ')}], phoneFields: [${m.root.fields.filter(isPhoneField).map((f) => dq(f.label)).join(', ')}], personFields: [${m.root.fields.filter(isPersonField).map((f) => dq(f.label)).join(', ')}], percentFields: [${m.root.fields.filter(isPercentField).map((f) => dq(f.label)).join(', ')}]),`).join('\n')}
];
/// סף-החולשה — נגזר מהנתונים (לא קבוע-קסם): חצי מביטחון-הכותרת-הנמוך-ביותר בין המודולים. מתחתיו הרגע «כללי» ⇒ שכבת-הבסיס ראשונה.
const double kBalaganWeak = ${weak};

Set<String> balaganTokens(String s) { final out = <String>{}; for (final m in RegExp(r'[\\u0590-\\u05FF][\\u0590-\\u05FF״׳]*').allMatches(s)) { final w = bhNormSearch(m.group(0)!.replaceAll(RegExp(r'[״׳]'), '')); if (w.length < 2) continue; out.add(w); if (w.length >= 4 && '${SLB.prefixLetters}'.contains(w[0])) out.add(w.substring(1)); } return out; }   // G34 · דבק: מילים-בעברית (שפה) ⇒ חלקיק normSearch (סופיות) ⇒ אות-שימוש מדקדוק-האפיון
/// זיהוי: סכום-משקלים של מילות-הטקסט לכל מודול ⇒ 3 הטובים (ציון > 0). דטרמיניסטי; שוויון ⇒ המוקדם.
/// מילות-דקדוק (תאריך · חזרה · שעה · טלפון) אינן זהות של רגע: «ב-15 לחודש» העלה את «לא משלם» (חודש) מעל הסף. מסירים את הטווחים לפני הזיהוי.
String balaganStripGrammar(String text) {
  final spans = [...balaganDates(text, DateTime.now()), ...balaganRepeat(text), ...balaganTimes(text), ...balaganPhones(text)]..sort((a, b) => a.start.compareTo(b.start));
  var out = ''; var pos = 0; for (final sp in spans) { if (sp.start > pos) out += text.substring(pos, sp.start); if (sp.end > pos) pos = sp.end; } out += text.substring(pos);
  return out;
}
List<BalaganHit> balaganIdentify(String text, {int k = 3}) {
  final toks = balaganTokens(balaganStripGrammar(balaganWaStrip(text)));
  final hits = <BalaganHit>[];
  for (final m in kBalaganModules) { var s = 0.0; for (final t in toks) { s += m.weights[t] ?? 0; } if (s > 0) hits.add(BalaganHit(m, s)); }
  hits.sort((a, b) { final c = b.score.compareTo(a.score); return c != 0 ? c : a.module.index.compareTo(b.module.index); });
  // רגע כללי (אין מודול שמזהה אותו בביטחון) ⇒ שכבת-הבסיס ראשונה: הבסיס עם הציון-הגבוה, ואם אין — הכללי-ביותר (הכי-פחות שדות-חובה: משימה לפני פגישה). המודולים החלשים נשארים כחלופות («לא זה? אולי»).
  // רגע עם תאריך שהמודול-שנבחר אינו יכול להחזיק (אין לו שדה-תאריך) — «מחר בבוקר תור לרופא» ⇒ יומן, לא «תור שבוטל»; המודול נשאר חלופה
  final hasDate = balaganDates(balaganWaStrip(text), DateTime.now()).isNotEmpty;
  final weak = hits.isEmpty || hits.first.score / hits.first.module.selfScore < kBalaganWeak || (hasDate && hits.first.module.dateFields.isEmpty);
  if (weak) {
    final base = kBalaganModules.where((m) => m.layer == 'base').toList();
    if (base.isNotEmpty) {
      double sc(BalaganModule m) { var s = 0.0; for (final t in toks) { s += m.weights[t] ?? 0; } return s; }
      final hasTime = balaganTimes(text).isNotEmpty;   // «ב-16:30» = פגישה לפני משימה (הבסיס-עם-שדה-שעה), מבנית
      base.sort((a, b) { final c = sc(b).compareTo(sc(a)); if (c != 0) return c; if (hasTime) { final t = (b.timeFields.isNotEmpty ? 1 : 0).compareTo(a.timeFields.isNotEmpty ? 1 : 0); if (t != 0) return t; } final r = a.required.compareTo(b.required); return r != 0 ? r : a.index.compareTo(b.index); });
      final b = base.first;
      hits.removeWhere((h) => h.module.index == b.index);
      hits.insert(0, BalaganHit(b, sc(b)));
    }
  }
  if (hits.isEmpty && text.trim().isNotEmpty) { final base = kBalaganModules.where((m) => m.layer == 'base' && m.dateFields.isNotEmpty); if (base.isNotEmpty) return [BalaganHit(base.first, 0)]; }   /* ב׳-סב · אין מבוי-סתום: מה שלא זוהה נשמר כמשימה (הבסיס), האדם מתקן בטופס */
  return hits.take(k).toList();
}
/// תאריך-יחסי בעברית — דקדוק-זמן, לא מילון-דומייני: היום · מחר · מחרתיים · אתמול · בעוד N ימים/שבועות/חודשים (גם במילים) · ביום ראשון…שבת / יום א׳ · בשבוע/בחודש הבא · בסוף החודש · ב-N לחודש · dd.mm
class _DateAt { const _DateAt(this.start, this.end, this.iso); final int start, end; final String iso; }
class _NumAt { const _NumAt(this.start, this.end, this.value); final int start, end; final String value; }
int? _heNum(String w) { const m = {'אחד': 1, 'אחת': 1, 'שני': 2, 'שתי': 2, 'שניים': 2, 'שתיים': 2, 'שלושה': 3, 'שלוש': 3, 'ארבעה': 4, 'ארבע': 4, 'חמישה': 5, 'חמש': 5, 'שישה': 6, 'שש': 6, 'שבעה': 7, 'שבע': 7, 'שמונה': 8, 'תשעה': 9, 'תשע': 9, 'עשרה': 10, 'עשר': 10}; return m[w]; }
String _isoOf(DateTime d) => d.toIso8601String().substring(0, 10);
List<_DateAt> balaganDates(String text, DateTime today) {
  final out = <_DateAt>[];
  final t0 = DateTime(today.year, today.month, today.day);
  DateTime add(int days) => DateTime(t0.year, t0.month, t0.day + days);
  void put(RegExp re, DateTime? Function(RegExpMatch) f) { for (final x in re.allMatches(text)) { final d = f(x); if (d != null) out.add(_DateAt(x.start, x.end, _isoOf(d))); } }
  put(RegExp(r'(\\d{4})-(\\d{2})-(\\d{2})'), (x) => DateTime(int.parse(x.group(1)!), int.parse(x.group(2)!), int.parse(x.group(3)!)));
  put(RegExp(r'(?<![\\d.])(\\d{1,2})[./](\\d{1,2})[./](\\d{2,4})(?![\\d.])'), (x) { var y = int.parse(x.group(3)!); if (y < 100) y += 2000; final mo = int.parse(x.group(2)!), d = int.parse(x.group(1)!); return (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) ? DateTime(y, mo, d) : null; });
  put(RegExp(r'(?<![\\u0590-\\u05FF\\d])([\\u05D0-\\u05EA\\u05F3\\u05F4]{1,4}|\\d{1,2})\\s+ב?(אדר א[\\u05F3\\u0027]?|אדר ב[\\u05F3\\u0027]?|חשוון|סיוון|תמוז|אלול|כסלו|ניסן|תשרי|אייר|טבת|שבט|אדר|אב)(?![\\u0590-\\u05FF])'), (x) { final iso = bhHebInputIso(x.group(1)!, x.group(2)!.replaceAll('\\u0027', '\\u05F3'), bhIso(today)); return iso.isEmpty ? null : DateTime.parse(iso + 'T12:00:00'); });   /* ב׳-קנו · G49 · «ט״ו אלול» / «כ״ט באלול» ⇒ תאריך לועזי (חודשים מ-heb-month-he-sockets) */
  put(RegExp(r'(?<![\\d.])(\\d{1,2})\\.(\\d{1,2})(?![\\d.%]|\\s*(?:אלף|%|₪))'), (x) { final mo = int.parse(x.group(2)!), d = int.parse(x.group(1)!); if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) return null; var c = DateTime(t0.year, mo, d); if (c.isBefore(t0)) c = DateTime(t0.year + 1, mo, d); return c; });   // dd.mm בלי שנה: הקרוב-הבא
  const months = kBalaganMonths;
  put(RegExp(r'(?<![\\d.])(\\d{1,2})\\s*ב?(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)(?:\\s+(\\d{4}))?(?![\\u0590-\\u05FF])'), (x) { final d = int.parse(x.group(1)!); final mo = months[x.group(2)!]!; if (d < 1 || d > 31) return null; if (x.group(3) != null) return DateTime(int.parse(x.group(3)!), mo, d); var c = DateTime(t0.year, mo, d); if (c.isBefore(t0)) c = DateTime(t0.year + 1, mo, d); return c; });   // «15 בספטמבר» · «3 באוקטובר 2027»: שמות-חודשים = לוח, לא דומיין
  put(RegExp(r'(?<![\\u0590-\\u05FF])מחרתיים'), (_) => add(2));
  put(RegExp(r'(?<![\\u0590-\\u05FF])מחר(?![\\u0590-\\u05FF])'), (_) => add(1));
  put(RegExp(r'(?<![\\u0590-\\u05FF])היום(?![\\u0590-\\u05FF])'), (_) => add(0));
  put(RegExp(r'(?<![\\u0590-\\u05FF])אתמול'), (_) => add(-1));
  put(RegExp(r'(?<![\\u0590-\\u05FF])שלשום'), (_) => add(-2));
  put(RegExp(r'בעוד\\s+(?:(\\d+|[\\u0590-\\u05FF]+)\\s+)?(ימים|יום|יומיים|שבועות|שבוע|שבועיים|חודשים|חודש|חודשיים)(?![\\u0590-\\u05FF])'), (x) { final q = x.group(1); final u = x.group(2)!; var n = q == null ? 1 : (int.tryParse(q) ?? _heNum(q) ?? 1); if (u == 'יומיים' || u == 'שבועיים' || u == 'חודשיים') n = 2; if (u.startsWith('שבוע')) return add(7 * n); if (u.startsWith('חודש')) return DateTime(t0.year, t0.month + n, t0.day); return add(n); });
  put(RegExp(r'לפני\\s+(\\d+|[\\u0590-\\u05FF]+)\\s+(ימים|שבועות|חודשים)'), (x) { final q = x.group(1)!; final u = x.group(2)!; final n = int.tryParse(q) ?? _heNum(q) ?? 1; if (u == 'שבועות') return add(-7 * n); if (u == 'חודשים') return DateTime(t0.year, t0.month - n, t0.day); return add(-n); });
  const wd = {'ראשון': 7, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6, 'א': 7, 'ב': 1, 'ג': 2, 'ד': 3, 'ה': 4, 'ו': 5};
  DateTime next(int w) { final wd = bhWeekday(_isoOf(t0)); var d = (w - (wd == 0 ? 7 : wd) + 7) % 7; if (d == 0) d = 7; return add(d); }   // הבא, לא היום · G34 · חלקיק יום-בשבוע
  put(RegExp(r'ב?יום\\s+(ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת|[אבגדהו])(?:[׳\\u0027]|(?![\\u0590-\\u05FF]))'), (x) => next(wd[x.group(1)!]!));
  put(RegExp(r'(?<![\\u0590-\\u05FF])ב?שבת(?![\\u0590-\\u05FF])'), (_) => next(6));
  put(RegExp(r'בשבוע\\s+הבא'), (_) => add(7));
  put(RegExp(r'בחודש\\s+הבא'), (_) => DateTime(t0.year, t0.month + 1, t0.day));
  put(RegExp(r'ב?סוף\\s+החודש'), (_) => DateTime(t0.year, t0.month + 1, 0));
  put(RegExp(r'ב?תחילת\\s+החודש'), (_) => DateTime(t0.year, t0.month + 1, 1));
  put(RegExp(r'ב-?(\\d{1,2})\\s+[לב]חודש'), (x) { final d = int.parse(x.group(1)!); if (d < 1 || d > 31) return null; return d >= t0.day ? DateTime(t0.year, t0.month, d) : DateTime(t0.year, t0.month + 1, d); });
  out.sort((a, b) => a.start.compareTo(b.start));
  final res = <_DateAt>[]; for (final d in out) { if (res.any((r) => d.start < r.end && d.end > r.start)) continue; res.add(d); }   // חפיפה (יום ראשון ⊃ ראשון) ⇒ הראשון-שנמצא
  return res;
}
/// שעה-ביום: 16:30 · ב-16:30 · בשעה 16 (⇒ 16:00). הטווח כולל את מילת-היחס (המתאר נשאר נקי).
List<_DateAt> balaganTimes(String text, {DateTime? now}) {
  final out = <_DateAt>[];
  for (final x in RegExp(r'(?:ב-?)?(?<![\\d:])(\\d{1,2}):(\\d{2})(?![\\d:])').allMatches(text)) { final h = int.parse(x.group(1)!), mi = int.parse(x.group(2)!); if (h > 23 || mi > 59) continue; out.add(_DateAt(x.start, x.end, '\${h.toString().padLeft(2, '0')}:\${mi.toString().padLeft(2, '0')}')); }
  // יחסי-לעכשיו: «בעוד שעה» · «בעוד שעתיים» · «בעוד חצי שעה» · «בעוד 20 דקות» ⇒ שעה (עכשיו מוזרק)
  final nowT = now ?? DateTime.now();
  for (final x in RegExp(r'בעוד\\s+(שעה|שעתיים|חצי\\s+שעה|רבע\\s+שעה|(\\d{1,3})\\s+דקות|(\\d{1,2})\\s+שעות)(?![\\u0590-\\u05FF])').allMatches(text)) {
    if (out.any((o) => x.start < o.end && x.end > o.start)) continue;
    final g = x.group(1)!; var mins = 60; if (g == 'שעתיים') mins = 120; else if (g.startsWith('חצי')) mins = 30; else if (g.startsWith('רבע')) mins = 15; else if (x.group(2) != null) mins = int.parse(x.group(2)!); else if (x.group(3) != null) mins = int.parse(x.group(3)!) * 60;
    final t = nowT.add(Duration(minutes: mins)); out.add(_DateAt(x.start, x.end, '\${t.hour.toString().padLeft(2, '0')}:\${t.minute.toString().padLeft(2, '0')}'));
  }
  // חלקי-יום (שפה, לא דומיין): בבוקר 09:00 · בצהריים 13:00 · אחה"צ 16:00 · בערב 19:00 · בלילה 21:00 — רק כשאין שעה מפורשת באותו טווח
  const dayParts = {'בבוקר': '09:00', 'בצהריים': '13:00', 'אחה"צ': '16:00', 'אחר הצהריים': '16:00', 'אחרי הצהריים': '16:00', 'בערב': '19:00', 'בלילה': '21:00'};
  for (final x in RegExp(r'(?<![\\u0590-\\u05FF])(בבוקר|בצהריים|אחה"צ|אחר הצהריים|אחרי הצהריים|בערב|בלילה)(?![\\u0590-\\u05FF])').allMatches(text)) { if (out.any((o) => x.start < o.end && x.end > o.start)) continue; out.add(_DateAt(x.start, x.end, dayParts[x.group(1)!]!)); }
  for (final x in RegExp(r'בשעה\\s+(\\d{1,2})(?![\\d:])').allMatches(text)) { final h = int.parse(x.group(1)!); if (h > 23) continue; if (out.any((o) => x.start < o.end && x.end > o.start)) continue; out.add(_DateAt(x.start, x.end, '\${h.toString().padLeft(2, '0')}:00')); }
  out.sort((a, b) => a.start.compareTo(b.start));
  return out;
}
/// טלפון ישראלי: 052-1234567 · 0521234567 · 03-1234567 ⇒ ספרות בלבד. הטווח נצרך (לא סכום, לא מתאר).
List<_DateAt> balaganPhones(String text) => [for (final x in RegExp(r'(?<![\\d-])0\\d{1,2}[- ]?\\d{3}[- ]?\\d{4}(?![\\d-])').allMatches(text)) _DateAt(x.start, x.end, x.group(0)!.replaceAll(RegExp(r'[- ]'), ''))];
/// אחוז: 3.5% · 12 % ⇒ הערך; אינו סכום.
List<_DateAt> balaganPercents(String text) => [for (final x in RegExp(r'(?<![\\d.,])(\\d+(?:[.,]\\d+)?)\\s*%').allMatches(text)) _DateAt(x.start, x.end, x.group(1)!.replaceAll(',', '.'))];
/// מי: «עם דני» · «אצל הרו"ח» · «מול המשכיר» ⇒ המילה שאחרי מילת-היחס (≥3 אותיות, לא בתוך תאריך/שעה). דקדוק, לא רשימת-שמות.
List<_DateAt> balaganPersons(String text, List<_DateAt> taken, [List<_DateAt> phones = const []]) {
  final out = [for (final x in RegExp(r'(?<![\\u0590-\\u05FF])(?:עם|אצל|מול)\\s+([\\u0590-\\u05FF][\\u0590-\\u05FF"״׳\\u0027]{2,})').allMatches(text)) if (!taken.any((t) => x.start < t.end && x.end > t.start)) _DateAt(x.start, x.end, x.group(1)!)];
  // «רות לוי 052-…»: עד שתי מילים צמודות לפני מספר-טלפון = בעל הטלפון (ל-קידומת נקלפת: «לרות לוי»)
  for (final ph in phones) {
    final m = RegExp(r'([\\u0590-\\u05FF"״׳\\u0027]{2,}(?:\\s+[\\u0590-\\u05FF"״׳\\u0027]{2,})?)[\\s,:\\-]*\$').firstMatch(text.substring(0, ph.start));
    if (m == null) continue; final st = m.start; if (taken.any((t) => st < t.end && m.end > t.start) || out.any((o) => st < o.end && m.end > o.start)) continue;
    var name = m.group(1)!; if (name.length >= 4 && name.startsWith('ל')) name = name.substring(1);
    out.add(_DateAt(st, m.end, name));
  }
  out.sort((a, b) => a.start.compareTo(b.start));
  return out;
}
/// חזרה: «כל חודש» · «כל שבועיים» · «כל 3 ימים» · «כל שלושה שבועות» · «כל יום ראשון» · «כל שנה» ⇒ קוד d/w/m/y + N (דקדוק-זמן). הטווח נצרך.
List<_DateAt> balaganRepeat(String text) {
  final out = <_DateAt>[];
  void put(RegExp re, String Function(RegExpMatch) f) { for (final x in re.allMatches(text)) { if (out.any((o) => x.start < o.end && x.end > o.start)) continue; out.add(_DateAt(x.start, x.end, f(x))); } }
  put(RegExp(r'כל\\s+יום\\s+(?:ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת|[אבגדהו][׳\\u0027]?)(?![\\u0590-\\u05FF])'), (_) => 'w1');
  put(RegExp(r'כל\\s+(יום|שבוע|חודש|שנה|יומיים|שבועיים|חודשיים)(?![\\u0590-\\u05FF])'), (x) { final u = x.group(1)!; if (u == 'יומיים') return 'd2'; if (u == 'שבועיים') return 'w2'; if (u == 'חודשיים') return 'm2'; return u == 'יום' ? 'd1' : u == 'שבוע' ? 'w1' : u == 'חודש' ? 'm1' : 'y1'; });
  put(RegExp(r'כל\\s+(\\d+|[\\u0590-\\u05FF]+)\\s+(ימים|שבועות|חודשים|שנים)(?![\\u0590-\\u05FF])'), (x) { final n = int.tryParse(x.group(1)!) ?? _heNum(x.group(1)!) ?? 1; final u = x.group(2)!; return (u == 'ימים' ? 'd' : u == 'שבועות' ? 'w' : u == 'חודשים' ? 'm' : 'y') + n.toString(); });
  out.sort((a, b) => a.start.compareTo(b.start));
  return out;
}
/// תיאור-החזרה לאדם (אותן מילים של הדקדוק).
String balaganRepeatLabel(String code) {
  if (code.length < 2) return '';
  final n = int.tryParse(code.substring(1)) ?? 1; final u = code[0];
  if (u == 'h') return ${dq(L.repeatHeb)};   /* ב׳-קנח */
  if (n == 1) return u == 'd' ? 'כל יום' : u == 'w' ? 'כל שבוע' : u == 'm' ? 'כל חודש' : 'כל שנה';
  if (n == 2) return u == 'd' ? 'כל יומיים' : u == 'w' ? 'כל שבועיים' : u == 'm' ? 'כל חודשיים' : 'כל שנתיים';
  return 'כל \$n ' + (u == 'd' ? 'ימים' : u == 'w' ? 'שבועות' : u == 'm' ? 'חודשים' : 'שנים');
}
/// תיק כפול: רשומה פתוחה באותו מודול עם אותו מתאר/אדם (השוואה מנורמלת) — לפני «שמור» שואלים «זה אותו עניין?» במקום לפתוח תיק שני.
List<Map<String, String>> balaganDuplicates(BalaganModule m, Map<String, String> v) {
  String norm(String x) => x.trim().toLowerCase().replaceAll(RegExp(r'\\s+'), ' ');
  final keys = [m.descField, ...m.personFields].where((f) => f.isNotEmpty && norm(v[f] ?? '').length >= 3).toList();
  if (keys.isEmpty) return const [];
  return appStore.records(m.rootSlug).where((r) { final st = int.tryParse(r['__stage'] ?? '0') ?? 0; if (m.stages > 0 && st >= m.stages - 1) return false; return keys.any((f) => m.personFields.contains(f) ? bhSameName(r[f] ?? '', v[f]!) : norm(r[f] ?? '') == norm(v[f]!)); }).toList();   /* ב׳-קג · שדה-אדם: אותו-אדם לפי דמיון-שם (bhSameName) — «לוי רות» = «רות לוי» */
}
/// ב׳-קכב · «השבוע» / «שבוע הבא» / «שבוע שעבר» לבד ⇒ היסט-שבוע (דקדוק: spec-lang.weekWords); אחרת null
int? balaganWeekOf(String q) { final t = q.trim(); const w = <String, int>{${Object.entries(SLB.weekWords).map(([k2, v]) => `${dq(k2)}: ${v}`).join(', ')}}; return w[t]; }
/// ב׳-קכב · כל התיקים שמועדם (כל שדה-תאריך) בטווח [from, to] (bhInRange) ⇒ [[iso, entity, rid, כותרת-מודול]…] ממוין לפי יום
List<List<String>> balaganRangeItems(String from, String to) { final out = <List<String>>[]; final seen = <String>{}; for (final m in kBalaganModules) { for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; for (final f in m.dateFields) { final d = (r[f] ?? '').trim(); if (bhInRange(d, from, to) && seen.add(m.rootSlug + '|' + rid + '|' + d)) out.add([d.substring(0, 10), m.rootSlug, rid, m.title]); } } } out.sort((a, b) => a[0].compareTo(b[0])); return out; }
/// ב׳-קכג · «מעל 5000» / «פחות מ-300» ⇒ [op, ערך] (דקדוק: spec-lang.amountAbove/Below + bhDigitsQuery); אחרת ריק
List<String> balaganAmountFilter(String q) { final t = q.trim().replaceFirst(RegExp(r'-(?=\\d)'), '- '); for (final e in [['>', bhPrefixRest(t, [${SLB.amountAbove.map(dq).join(', ')}])], ['<', bhPrefixRest(t, [${SLB.amountBelow.map(dq).join(', ')}])]]) { if (e[1].isEmpty) continue; final v = bhDigitsQuery(e[1]); if (v.isNotEmpty) return [e[0], v.replaceAll(',', '')]; } return const []; }   // G40 · דרך bhPrefixRest (prefix.rule), «מ-300» ⇒ «מ- 300»
/// ב׳-קכח · למי שייך הטלפון: שם-אדם מהתיקים עם אותו מפתח-טלפון (bhPhoneKey); אין/ריק ⇒ ''
String balaganPersonByPhone(String phone) { final key = bhPhoneKey(phone); if (key.length < 7) return ''; for (final m in kBalaganModules) { if (m.personFields.isEmpty || m.phoneFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { for (final pf in m.phoneFields) { if (bhPhoneKey(r[pf]) != key) continue; for (final f in m.personFields) { final v = (r[f] ?? '').trim(); if (v.length >= 2) return v; } } } } for (final e in balaganPhonebook()) { if (bhPhoneKey(e['phone']) == key && (e['name'] ?? '').length >= 2) return e['name']!; } return ''; }   // ב׳-קנד · G48 · גם ספר-הטלפונים
/// ב׳-קל · «בין 1.9 ל-15.9» / «מ-1.9 עד 15.9» ⇒ [from, to] (שני תאריכים מהמנתח + רק מילות-טווח ביניהם, דקדוק spec-lang.rangeWords); אחרת ריק
List<String> balaganRangeOf(String q, DateTime today) { final t = q.trim(); final dd = balaganDates(t, today); if (dd.length != 2) return const []; var rest = t; for (final d in [dd[1], dd[0]]) { rest = rest.substring(0, d.start) + ' ' + rest.substring(d.end); } const words = <String>{${SLB.rangeWords.map(dq).join(', ')}}; for (final w in rest.split(RegExp(r'\\s+'))) { if (w.isNotEmpty && !words.contains(w)) return const []; } var a = dd[0].iso, b = dd[1].iso; if (bhDaysSince(a, b).abs() > 180) { /* המנתח מגלגל תאריך-שעבר לשנה-הבאה («1.9» ב-8.9 ⇒ 2027); בטווח שני התאריכים באותה שנה */ if (a.compareTo(b) > 0) { a = b.substring(0, 4) + a.substring(4); } else { b = a.substring(0, 4) + b.substring(4); } } if (a.compareTo(b) > 0) { final t2 = a; a = b; b = t2; } return [a, b]; }
/// ב׳-קלא · שולם-כבר-לאחרונה: תיק באותו מודול עם אותו מתאר (נרמול-חיפוש) ואותו סכום, שנסגר ('done' ביומן) ב-7 הימים האחרונים (bhDaysSince) ⇒ [כותרת, iso-הסגירה]; אחרת ריק
List<String> balaganPaidRecently(BalaganModule m, Map<String, String> v, DateTime today) { if (m.descField.isEmpty) return const []; final d0 = bhNormSearch(v[m.descField] ?? ''); if (d0.length < 3) return const []; final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); final amt = fs.isEmpty ? 0.0 : bhMoney(v[fs.first]); for (final e in appStore.log) { if (e['kind'] != 'done' || e['undone'] == '1' || e['entity'] != m.rootSlug) continue; final r = appStore.byId(m.rootSlug, e['rid'] ?? ''); if (r == null || bhNormSearch(r[m.descField] ?? '') != d0) continue; if (amt > 0 && fs.isNotEmpty && bhMoney(r[fs.first]) != amt) continue; final at = (e['at'] ?? ''); if (at.length < 10) continue; final days = bhDaysSince(at.substring(0, 10), bhIso(today)); if (days < 0 || days > 7) continue; return [appStore.displayOf(m.rootSlug, e['rid'] ?? ''), at.substring(0, 10)]; } return const []; }
/// ב׳-קלו · המתארים השכיחים בכל התיקים (נרמול-חיפוש ⇒ bhGroupRows ⇒ count.by) ⇒ [[מתאר-כפי-שנכתב, n]…] רק ≥2
List<List<Object>> balaganTopDescs({int min = 2}) { final rows = <Map<String, String>>[]; final raw = <String, String>{}; for (final m in kBalaganModules) { if (m.descField.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final v = (r[m.descField] ?? '').trim(); if (v.length < 3) continue; final n = bhNormSearch(v); rows.add({'d': n}); raw.putIfAbsent(n, () => v); } } return [for (final g in bhGroupRows(rows, 'd')) if ((g[1] as int) >= min) [raw[g[0] as String] ?? (g[0] as String), g[1]]]; }
/// ב׳-קלט · השעה הרגילה: חציון שדה-השעה של תיקים עם אותו מתאר (נרמול-חיפוש; bhMedianHm); פחות מ-2 ⇒ ''
String balaganUsualTime(BalaganModule m, Map<String, String> v) { if (m.descField.isEmpty || m.timeFields.isEmpty) return ''; final d0 = bhNormSearch(v[m.descField] ?? ''); if (d0.length < 3) return ''; return bhMedianHm([for (final r in appStore.records(m.rootSlug)) if (bhNormSearch(r[m.descField] ?? '') == d0) (r[m.timeFields.first] ?? '').trim()]); }
/// ב׳-קמא · פג-תוקף בקרוב: שדות-תאריך שתוויתם מכילה מילת-תוקף (דקדוק spec-lang.expiryWords) בתיקים פתוחים, בטווח [היום, היום+days] (bhInRange) ⇒ [[iso, entity, rid, תווית-שדה]…] לפי יום
List<List<String>> balaganExpiring(DateTime today, {int days = 30}) { const words = <String>[${SLB.expiryWords.map(dq).join(', ')}]; final t = bhIso(today), to = bhPlusDays(t, days); final out = <List<String>>[]; for (final m in kBalaganModules) { final fs = m.dateFields.where((f) => words.any((w) => f.contains(w))).toList(); if (fs.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; for (final f in fs) { final d = (r[f] ?? '').trim(); if (bhInRange(d, t, to)) out.add([d.substring(0, 10), m.rootSlug, rid, f]); } } } out.sort((a, b) => a[0].compareTo(b[0])); return out; }
/// ב׳-קמד · «מתי X» / «מתי היה X» ⇒ X (דקדוק spec-lang.whenWords, bhPrefixRest); אחרת ''
String balaganWhenOf(String q) => bhPrefixRest(q.trim(), [${[...SLB.whenWords].sort((a, b) => b.length - a.length).map(dq).join(', ')}]);   // הארוך קודם: «מתי היה» לפני «מתי»
/// ב׳-קמד · הפעם האחרונה של X: התיק המתאים ביותר (bhSearchScore על המתאר) שנסגר ('done' ביומן) — [כותרת, iso-הסגירה]; אין ⇒ ריק
List<String> balaganLastDone(String what) { var best = 0; var out = const <String>[]; for (final e in appStore.log) { if (e['kind'] != 'done' || e['undone'] == '1') continue; final ent = e['entity'] ?? '', rid = e['rid'] ?? ''; final ms = kBalaganModules.where((m) => m.rootSlug == ent); if (ms.isEmpty || ms.first.descField.isEmpty) continue; final r = appStore.byId(ent, rid); if (r == null) continue; final sc = bhSearchScore(what, r[ms.first.descField] ?? ''); if (sc > best && (e['at'] ?? '').length >= 10) { best = sc; out = [appStore.displayOf(ent, rid), e['at']!.substring(0, 10)]; } } return out; }
/// ב׳-קמה · תיקים פתוחים עם אדם ובלי טלפון (בשום שדה-טלפון של המודול) ⇒ [[entity, rid]…]
List<List<String>> balaganNoPhone() { final out = <List<String>>[]; for (final m in kBalaganModules) { if (m.personFields.isEmpty || m.phoneFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; if (!m.personFields.any((f) => (r[f] ?? '').trim().length >= 2)) continue; if (m.phoneFields.any((f) => bhPhoneKey(r[f]).isNotEmpty)) continue; out.add([m.rootSlug, rid]); } } return out; }
/// ב׳-קמב · מופעי-ICS מפריטי-טווח ([iso, entity, rid, כותרת-מודול]) — שעה משדה-השעה של התיק אם יש (bhIcs)
String balaganIcsOf(List<List<String>> items, String calName, DateTime now) { final occ = <Map<String, String?>>[]; for (final it in items) { final ms = kBalaganModules.where((m) => m.rootSlug == it[1]); final r = appStore.byId(it[1], it[2]); if (ms.isEmpty || r == null) continue; final tf = ms.first.timeFields.isEmpty ? '' : (r[ms.first.timeFields.first] ?? '').trim(); occ.add({'uid': it[1] + '-' + it[2] + '-' + it[0] + '@balagan', 'date': it[0], 'time': tf.isEmpty ? null : tf, 'title': appStore.displayOf(it[1], it[2]), 'notes': it[3]}); } return bhIcs(occ, calName, now); }
/// ב׳-קמז · CSV מפריטי-טווח ([iso, entity, rid, כותרת]) — יום · מודול · תיק · ₪ (bhCsv)
String balaganCsvOf(List<List<String>> items) { final rows = <List<Object?>>[['תאריך', 'נושא', 'תיק', '₪']]; for (final it in items) { final ms = kBalaganModules.where((m) => m.rootSlug == it[1]); final r = appStore.byId(it[1], it[2]); if (ms.isEmpty || r == null) continue; final fs = ms.first.numFields.where((f) => !ms.first.percentFields.contains(f)).toList(); rows.add([it[0], it[3], appStore.displayOf(it[1], it[2]), fs.isEmpty ? '' : (r[fs.first] ?? '')]); } return bhCsv(rows); }
/// ב׳-קמח · ייבוא CSV: שורת-הכותרת מזהה את המודול (הכי הרבה כותרות ≡ שמות-שדות, נרמול-חיפוש; ≥1) ⇒ רשומה לכל שורה ⇒ [כותרת-המודול, n]; אין ⇒ ['', 0]
List<Object> balaganImportCsv(String text) { final rows = bhCsvParse(text.trim()); if (rows.length < 2) return ['', 0]; final head = [for (final h in rows.first) bhNormSearch(h)]; BalaganModule? best; var bestN = 0; for (final m in kBalaganModules) { final labels = {for (final f in m.fields) bhNormSearch(f.label): f.label}; final n = head.where((h) => labels.containsKey(h)).length; if (n > bestN) { bestN = n; best = m; } } if (best == null) return ['', 0]; final labels = {for (final f in best.fields) bhNormSearch(f.label): f.label}; var n = 0; final b = best; appStore.grouped(() { for (final row in rows.skip(1)) { final rec = <String, String>{}; for (var i = 0; i < head.length && i < row.length; i++) { final lb = labels[head[i]]; if (lb != null && row[i].trim().isNotEmpty) rec[lb] = row[i].trim(); } if (rec.isEmpty) continue; final id = appStore.add(b.rootSlug, rec); appStore.logAction('add', b.title + ' · ' + appStore.displayOf(b.rootSlug, id), entity: b.rootSlug, rid: id); n++; } }); return [best.title, n]; }   // ב׳-קנב · G47 · ייבוא = קבוצה אחת ⇒ החזר אחד
/// ב׳-קו · כינויי-אדם: כל השמות שהם אותו אדם (טלפון משותף במפתח-קנוני או אותו שם-מנורמל) — bhPersonGroups; לפחות השם עצמו
Set<String> balaganAliases(String name) { final n = name.trim().toLowerCase(); final out = <String>{n}; if (n.length < 2) return out; final phonesOf = <String, List<String>>{}; final names = <String>{}; for (final m in kBalaganModules) { if (m.personFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { for (final f in m.personFields) { final v = (r[f] ?? '').trim(); if (v.length < 2) continue; names.add(v); for (final pf in m.phoneFields) { final ph = (r[pf] ?? '').trim(); if (ph.isNotEmpty) (phonesOf[v] ??= <String>[]).add(ph); } } } } for (final g in bhPersonGroups(names.toList(), phonesOf)) { if (g.any((x) => x.toLowerCase() == n)) { out.addAll(g.map((x) => x.toLowerCase())); break; } } return out; }
/// ב׳-קנד · ספר-הטלפונים (הגדרה 'phonebook' = JSON [{name, phone}]) — נקרא/נכתב כאן בלבד
List<Map<String, String>> balaganPhonebook() { try { final raw = appStore.setting('phonebook'); if (raw.isEmpty) return const []; return [for (final e in (jsonDecode(raw) as List)) {'name': (e['name'] ?? '').toString(), 'phone': (e['phone'] ?? '').toString()}]; } catch (_) { return const []; } }
/// ב׳-קנד · ייבוא-VCF לספר-הטלפונים (bhVcardRows ⇒ קופסת-vcard-import): דדופ לפי מפתח-טלפון (bhPhoneKey) ⇒ [נוספו, סה"כ]
List<int> balaganImportVcf(String text) { final rows = bhVcardRows(text); if (rows.isEmpty) return const [0, 0]; final book = [...balaganPhonebook()]; final keys = {for (final e in book) bhPhoneKey(e['phone'])}; var n = 0; for (final r in rows) { for (final ph in [r['phone'] ?? '', r['phone2'] ?? '']) { final key = bhPhoneKey(ph); if (key.isEmpty || keys.contains(key)) continue; keys.add(key); book.add({'name': r['name'] ?? '', 'phone': ph}); n++; } } appStore.setSetting('phonebook', jsonEncode(book)); return [n, book.length]; }
/// ב׳-קנד · טלפון מספר-הטלפונים לפי שם (אותו-אדם: bhSameName); אין ⇒ ''
String balaganBookPhone(String name) { for (final e in balaganPhonebook()) { if (bhSameName(e['name'] ?? '', name)) return e['phone'] ?? ''; } return ''; }
/// ב׳-קנט · «₪ 350 כמו תמיד»: השכיח (bhMode) של סכומי-התיקים עם אותו מתאר, כשיש ≥2 שווים; אחרת ''
String balaganUsualAmount(BalaganModule m, Map<String, String> v) { if (m.descField.isEmpty) return ''; final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); if (fs.isEmpty) return ''; final d0 = bhNormSearch(v[m.descField] ?? ''); if (d0.length < 3) return ''; final xs = <num>[for (final r in appStore.records(m.rootSlug)) if (bhNormSearch(r[m.descField] ?? '') == d0 && bhMoney(r[fs.first]) > 0) bhMoney(r[fs.first])]; if (xs.length < 2) return ''; final md = bhMode(xs); return xs.where((x) => x == md).length >= 2 ? bhThousands(md) : ''; }
/// ב׳-קסב · תווית-חזרה עם יום-החודש: «כל חודש (ב-15)» כשיש מועד (bhMonthDay)
String balaganRepeatLabelFor(String code, String dateIso) { if (code == 'm1' && dateIso.length >= 10) return ${dq(L.repeatMonthDay)}.replaceAll('{d}', bhMonthDay(dateIso).toString()); return balaganRepeatLabel(code); }
/// ב׳-קנ · טלפון מתיק אחר של אותו אדם (כולל כינויים): הראשון שנמצא; אין ⇒ ''
String balaganPhoneOfPerson(String name) { final al = balaganAliases(name); for (final m in kBalaganModules) { if (m.personFields.isEmpty || m.phoneFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { if (!m.personFields.any((f) => al.contains((r[f] ?? '').trim().toLowerCase()))) continue; for (final pf in m.phoneFields) { final ph = (r[pf] ?? '').trim(); if (bhPhoneKey(ph).isNotEmpty) return ph; } } } return ''; }
/// ב׳-קנג · «טלפון של רות לוי» / «סכום של ביטוח» ⇒ [תווית-שדה, מי]; אין «של» ⇒ ריק
List<String> balaganFieldOf(String q) { final t = q.trim(); final i = t.indexOf(${dq(SLB.ofWord)}); if (i <= 0) return const []; final f = t.substring(0, i).trim(), who = t.substring(i + ${dq(SLB.ofWord)}.length).trim(); return f.length < 2 || who.length < 2 ? const [] : [f, who]; }
/// ב׳-קנג · ערך-השדה אצל האדם/התיק: מחפש בתיקי-האדם (כינויים) ואז בכל התיקים שהמתאר שלהם מתאים (bhSearchScore), שדה לפי תווית (bhSearchScore ≥ 62) ⇒ [כותרת-התיק, תווית, ערך]; אין ⇒ ריק
List<String> balaganFieldValue(String field, String who) { final al = balaganAliases(who); for (final m in kBalaganModules) { final fl = m.fields.map((f) => f.label).where((l) => bhSearchScore(field, l) >= 62).toList(); if (fl.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final byPerson = m.personFields.any((f) => al.contains((r[f] ?? '').trim().toLowerCase())); final byDesc = m.descField.isNotEmpty && bhSearchScore(who, r[m.descField] ?? '') >= 62; if (!byPerson && !byDesc) continue; for (final l in fl) { final v = (r[l] ?? '').trim(); if (v.isNotEmpty) return [appStore.displayOf(m.rootSlug, r[AppStore.idKey] ?? ''), l, v]; } } } return const []; }
/// ב׳-קנא · CSV של כל התיקים: נושא · מודול · תיק · מה · מועד · סכום · אדם · טלפון · שלב (bhCsv)
String balaganCsvAll() { final rows = <List<Object?>>[['נושא', 'מודול', 'תיק', 'מה', 'מועד', 'סכום', 'אדם', 'טלפון', 'שלב']]; for (final m in kBalaganModules) { final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; rows.add([m.topic, m.title, appStore.displayOf(m.rootSlug, rid), m.descField.isEmpty ? '' : (r[m.descField] ?? ''), m.dateFields.isEmpty ? '' : (r[m.dateFields.first] ?? ''), fs.isEmpty ? '' : (r[fs.first] ?? ''), m.personFields.isEmpty ? '' : (r[m.personFields.first] ?? ''), m.phoneFields.isEmpty ? '' : (r[m.phoneFields.first] ?? ''), r['__stage'] ?? '']); } } return bhCsv(rows); }
const Map<String, int> kBalaganMonths = {'ינואר': 1, 'פברואר': 2, 'מרץ': 3, 'מרס': 3, 'אפריל': 4, 'מאי': 5, 'יוני': 6, 'יולי': 7, 'אוגוסט': 8, 'ספטמבר': 9, 'אוקטובר': 10, 'נובמבר': 11, 'דצמבר': 12};
/// ב׳-קכא · שם-חודש לבד («ספטמבר» · «באוקטובר» · «אוקטובר 2027») ⇒ מפתח-חודש 'YYYY-MM' (השנה הנוכחית); אחרת ''
String balaganMonthOf(String q, DateTime today) { final t = q.trim(); final m = RegExp(r'^ב?(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)(?:\\s+(\\d{4}))?\$').firstMatch(t); if (m == null) return ''; final mo = kBalaganMonths[m.group(1)!]!; final y = int.tryParse(m.group(2) ?? '') ?? today.year; return bhMonthKey(y.toString().padLeft(4, '0') + '-' + mo.toString().padLeft(2, '0') + '-01'); }
String balaganMonthName(String key) { final mo = int.tryParse(key.length >= 7 ? key.substring(5, 7) : '') ?? 0; for (final e in kBalaganMonths.entries) { if (e.value == mo && e.key != 'מרס') return e.key; } return key; }
/// ב׳-קכא · כל התיקים שמועדם (כל שדה-תאריך) בחודש (bhSameMonth) ⇒ [[iso, entity, rid, כותרת-מודול]…] ממוין לפי יום
List<List<String>> balaganMonthItems(String monthKey) { final out = <List<String>>[]; final seen = <String>{}; for (final m in kBalaganModules) { for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; for (final f in m.dateFields) { final d = (r[f] ?? '').trim(); if (d.length >= 10 && bhSameMonth(d, monthKey + '-01') && seen.add(m.rootSlug + '|' + rid + '|' + d)) out.add([d.substring(0, 10), m.rootSlug, rid, m.title]); } } } out.sort((a, b) => a[0].compareTo(b[0])); return out; }
/// ב׳-קיא · «נראה חוזר»: תיקים קיימים עם אותו מתאר (נרמול-חיפוש) + המועד החדש ⇒ bhRecurCode על המועדים; אין מתאר/מועד ⇒ ''
String balaganRecurHint(BalaganModule m, Map<String, String> v) { if (m.descField.isEmpty || m.dateFields.isEmpty) return ''; final d0 = bhNormSearch(v[m.descField] ?? ''); final nd = (v[m.dateFields.first] ?? '').trim(); if (d0.length < 3 || nd.length < 10) return ''; final dates = <String>[nd]; for (final r in appStore.records(m.rootSlug)) { if (bhNormSearch(r[m.descField] ?? '') != d0) continue; final d = (r[m.dateFields.first] ?? '').trim(); if (d.length >= 10 && (r['__repeat'] ?? '').isEmpty) dates.add(d); } return bhRecurCode(dates); }
/// מיזוג לתיק קיים: שדה ריק בקיים מקבל את הערך החדש · «מה כתבת» נצבר (שורה חדשה) · שדה מלא לא נדרס. פעולה אחת עם החזר (prev = JSON של מה שנגע).
int balaganMerge(BalaganModule m, String id, Map<String, String> v, String logText) {
  final r = appStore.byId(m.rootSlug, id); if (r == null) return 0;
  final prev = <String, String>{}; final next = <String, String>{};
  for (final e in v.entries) {
    final val = e.value.trim(); if (val.isEmpty || e.key == '__id' || e.key == '__at' || e.key == '__stage') continue;
    final cur = (r[e.key] ?? '').trim();
    if (e.key == '__note') { if (cur.contains(val)) continue; prev[e.key] = r[e.key] ?? ''; next[e.key] = cur.isEmpty ? val : cur + '\\n' + val; continue; }
    if (cur.isNotEmpty) { final isDate = m.dateFields.contains(e.key); final dc = isDate ? DateTime.tryParse(cur) : null; final dn = isDate ? DateTime.tryParse(val) : null; final now = DateTime.now(); final t0 = DateTime(now.year, now.month, now.day); if (!(dc != null && dn != null && dc.isBefore(t0) && !dn.isBefore(t0))) continue; }   /* ב׳-נז · מועד שכבר עבר ⇒ המועד החדש (הרגע הבא של אותו עניין) — עם החזר; כל השאר: מלא לא נדרס */
    prev[e.key] = r[e.key] ?? ''; next[e.key] = val;
  }
  if (next.isEmpty) return 0;
  appStore.update(m.rootSlug, id, next);
  appStore.logAction('merge', logText.replaceAll('{n}', next.length.toString()), entity: m.rootSlug, rid: id, prev: jsonEncode(prev));
  return next.length;
}
/// שורת-ייצוא-וואטסאפ: «[8.9.2026, 16:30] דני: …» / «8.9.26, 16:30 - דני: …» ⇒ הטקסט בלי הכותרת + השולח (מבנה, לא מילון). חותמת-ההודעה אינה מועד.
final RegExp _waHead = RegExp(r'${SLB.waHead}');   // דקדוק-ייצוא-וואטסאפ (spec-lang), לא מילון
String balaganWaStrip(String text) { final m = _waHead.firstMatch(text); return m == null ? text : text.substring(m.end); }
String balaganWaSender(String text) { final m = _waHead.firstMatch(text); return m == null ? '' : m.group(3)!.trim(); }
/// שורה עם כמה רגעים («שילמתי ארנונה. מחר תור לרופא») ⇒ חלקים לפי שורה/נקודה-ורווח/נקודה-פסיק — כל חלק רגע משלו (טופס-אישור אחר טופס-אישור). חלק = ≥2 מילים.
List<String> balaganSplit(String text) { final parts = text.split(RegExp(r'${SLB.momentSeparators}')).map((p) => p.trim()).where((p) => balaganWaStrip(p).split(RegExp(r'\\s+')).where((w) => w.isNotEmpty).length >= 2).toList(); return parts.length >= 2 ? parts : [text.trim()]; }   // מפרידי-רגעים מדקדוק-האפיון · חלק = ≥2 מילים
/// סכום במילים: «מאתיים» · «שלוש מאות» · «אלף וחמש מאות» · «שלושת אלפים ומאתיים» · «עשרת אלפים» ⇒ מספר (דקדוק-מספרים, לא מילון-דומייני)
List<_NumAt> balaganNumberWords(String text) {
  const hundreds = {'מאה': 100, 'מאתיים': 200};
  const hMul = {'שלוש': 3, 'ארבע': 4, 'חמש': 5, 'שש': 6, 'שבע': 7, 'שמונה': 8, 'תשע': 9};
  const thousands = {'אלף': 1000, 'אלפיים': 2000};
  const tMul = {'שלושת': 3, 'ארבעת': 4, 'חמשת': 5, 'ששת': 6, 'שבעת': 7, 'שמונת': 8, 'תשעת': 9, 'עשרת': 10};
  final re = RegExp(r'(?<![\\u0590-\\u05FF])((?:(?:\\d+\\s+אלף|(?:שלושת|ארבעת|חמשת|ששת|שבעת|שמונת|תשעת|עשרת)\\s+אלפים|אלפיים|אלף)(?:\\s+ו?)?)?(?:(?:שלוש|ארבע|חמש|שש|שבע|שמונה|תשע)\\s+מאות|מאתיים|מאה)?)(?![\\u0590-\\u05FF])');
  final out = <_NumAt>[];
  for (final x in re.allMatches(text)) {
    final g = x.group(1)!.trim(); if (g.isEmpty) continue;
    var v = 0; final parts = g.split(RegExp(r'\\s+ו?\\s*|\\s+'));
    for (var i = 0; i < parts.length; i++) {
      final w = parts[i].replaceFirst(RegExp(r'^ו'), '');
      if (thousands.containsKey(w)) { v += thousands[w]!; continue; }
      if (hundreds.containsKey(w)) { v += hundreds[w]!; continue; }
      if (int.tryParse(w) != null && i + 1 < parts.length && parts[i + 1] == 'אלף') { v += int.parse(w) * 1000; i++; continue; }
      if (tMul.containsKey(w) && i + 1 < parts.length && parts[i + 1] == 'אלפים') { v += tMul[w]! * 1000; i++; continue; }
      if (hMul.containsKey(w) && i + 1 < parts.length && parts[i + 1] == 'מאות') { v += hMul[w]! * 100; i++; continue; }
      if (w == 'אלף' || w == 'אלפים' || w == 'מאות') continue;
    }
    var end = x.end; final tail = RegExp(r'^\\s*(?:₪|ש"ח|ש״ח|שקל|שקלים|שח(?![\\u0590-\\u05FF])|דולר|יורו|€)').firstMatch(text.substring(x.end)); if (tail != null) end += tail.end;   // המטבע נצרך עם המילים («אלף וחמש מאות שקל») — המתאר נשאר נקי
    if (v > 0) out.add(_NumAt(x.start + (x.group(0)!.length - x.group(0)!.trimLeft().length), end, v.toString()));
  }
  return out;
}
/// סכומים: 8,000 · 8000 · 8 אלף · 8.5 אלף · 8k · אלפיים · 350 ש"ח / ₪350 (מספר קטן רק עם מטבע). לא חלק מתאריך/טלפון.
List<_NumAt> balaganNums(String text, List<_DateAt> dates) {
  final out = <_NumAt>[];
  bool inDate(int s, int e) => dates.any((d) => s < d.end && e > d.start);
  String fmt(double v) => v == v.roundToDouble() ? v.round().toString() : v.toString();
  void put(RegExp re, String? Function(RegExpMatch) f) { for (final x in re.allMatches(text)) { if (inDate(x.start, x.end)) continue; final v = f(x); if (v != null) out.add(_NumAt(x.start, x.end, v)); } }
  put(RegExp(r'(?<![\\d.,-])(\\d+(?:[.,]\\d{1,2})?)\\s*(?:אלף|א׳|[kK])(?![\\u0590-\\u05FFa-zA-Z])'), (x) { final v = double.tryParse(x.group(1)!.replaceAll(',', '.')); return v == null ? null : fmt(v * 1000); });
  for (final w in balaganNumberWords(text)) { if (!inDate(w.start, w.end) && !out.any((o) => w.start < o.end && w.end > o.start)) out.add(w); }   // מילים לפני ספרות: «אלף וחמש מאות» טווח אחד
  put(RegExp(r'(?<![\\d.,-])(\\d{1,3}(?:,\\d{3})+|\\d+(?:[.,]\\d{1,2})?)\\s*(?:₪|ש"ח|ש״ח|שח(?![\\u0590-\\u05FF])|שקל|שקלים|דולר|\\$|יורו|€)'), (x) { final g = x.group(1)!; return RegExp(r'^\\d{1,3}(,\\d{3})+\$').hasMatch(g) ? g.replaceAll(',', '') : g.replaceAll(',', '.'); });   // עם מטבע: הטווח כולל את המטבע (המתאר נשאר נקי)
  put(RegExp(r'(?:₪|\\$|€)\\s*(\\d{1,3}(?:,\\d{3})+|\\d+(?:[.,]\\d{1,2})?)(?![\\d,])'), (x) { final g = x.group(1)!; return RegExp(r'^\\d{1,3}(,\\d{3})+\$').hasMatch(g) ? g.replaceAll(',', '') : g.replaceAll(',', '.'); });
  put(RegExp(r'(?<![\\d-])(\\d{1,3}(?:,\\d{3})+|\\d{3,7})(?![\\d-])'), (x) => x.group(1)!.replaceAll(',', ''));
  out.sort((a, b) => a.start.compareTo(b.start));
  final res = <_NumAt>[]; for (final n in out) { if (res.any((r) => n.start < r.end && n.end > r.start)) continue; res.add(n); }   // «8 אלף» ⊃ «8»
  return res;
}
/// עובדות מהטקסט (תאריכים — גם יחסיים · סכומים · שורה-ראשונה) ⇒ שדות-השורש לפי טיפוס + קרבה למילות-תווית-השדה. \`today\` מוזרק (דטרמיניסטי; ברירת-מחדל עכשיו).
/// ב׳-נט · האם השם כבר בתיקים (שדות-האדם של כל המודולים) — «רות לוי: …» בתחילת שורה = האדם, רק לשם מוכר (אפס-ניחוש)
/// ב׳-צט · «שילמתי ארנונה» = לשון-עבר בגוף-ראשון: המילה הראשונה (אחרי הסרת-דקדוק) נגמרת ב«תי» ואורכה ≥5 כולל «תי» — דקדוק-שפה, לא מילון; «רותי» (4) ושם-מוכר לא נתפסים
bool balaganIsPast(String text) { final t = balaganStripGrammar(balaganWaStrip(text)).trim(); if (t.contains(':')) return false; final w = t.split(RegExp(r'\\s+')).first; return w.length >= ${SLB.pastMinLen} && w.endsWith('${SLB.pastSuffix}') && RegExp(r'^[\\u05d0-\\u05ea]+\$').hasMatch(w) && !balaganKnownPerson(w); }   // לשון-עבר = סיומת מדקדוק-האפיון (pastSuffix), לא מילון
/// ב׳-צט · תיקים פתוחים שחולקים מילה (≥3) עם הרגע-שבעבר — «שילמתי ארנונה» מול «לשלם ארנונה»; המילה-בעבר עצמה לא נספרת
List<Map<String, String>> balaganPastMatches(BalaganModule m, String text) { if (!balaganIsPast(text) || m.descField.isEmpty) return const []; final toks = balaganTokens(balaganStripGrammar(balaganWaStrip(text))).where((x) => x.length >= 3 && !x.endsWith('תי')).toSet(); if (toks.isEmpty) return const []; return appStore.records(m.rootSlug).where((r) { final st = int.tryParse(r['__stage'] ?? '0') ?? 0; if (m.stages > 0 && st >= m.stages - 1) return false; return balaganTokens(r[m.descField] ?? '').any((x) => x.length >= 3 && toks.contains(x)); }).toList(); }
bool balaganKnownPerson(String name) { final n = name.trim().toLowerCase(); if (n.length < 2) return false; for (final m in kBalaganModules) { for (final r in appStore.records(m.rootSlug)) { for (final f in m.personFields) { if ((r[f] ?? '').trim().toLowerCase() == n) return true; } } } return false; }
Map<String, String> balaganFacts(String text0, BalaganModule m, {DateTime? today}) {
  final out = <String, String>{};
  final t0 = today ?? DateTime.now();
  final sender0 = balaganWaSender(text0); final textA = balaganWaStrip(text0);   // כותרת-וואטסאפ: לא תאריך, לא שעה — השולח = אדם (רק כשלא נמצא אחר)
  final pm = sender0.isEmpty ? RegExp(r'^([^:\\n]{2,30}):\\s+(.+)$', dotAll: true).firstMatch(textA) : null; final known = pm != null && balaganKnownPerson(pm.group(1)!.trim());   /* ב׳-נט · «רות לוי: להתקשר מחר» — שם מוכר בתחילת השורה = האדם, והשורה ממשיכה בלעדיו */
  final sender = known ? pm!.group(1)!.trim() : sender0; final text = known ? pm!.group(2)!.trim() : textA;
  final dateMs = balaganDates(text, t0);
  final phoneMs = balaganPhones(text);
  final pctMs = balaganPercents(text);
  final numMs = balaganNums(text, [...dateMs, ...phoneMs, ...pctMs]);
  // קרבה למילות-השדה (מבני: המילים של תווית-השדה עצמה, לא מילון): «מהפיקדון של 8,000» ⇒ פיקדון ⇐ 8000. סדר-מילים: אחרי עדיף · לפני −20 · «מ» −10. אין קרבה ⇒ לפי סדר.
  int nearest(List<int> starts, String label) {
    final ws = <String>{}; for (final x in RegExp(r'[\\u0590-\\u05FF]{3,}').allMatches(label)) { final w = x.group(0)!; ws.add(w); if (w.length >= 4 && 'והבלמשכ'.contains(w[0])) ws.add(w.substring(1)); }
    var best = -1; var bestD = 1 << 30;
    for (var i = 0; i < starts.length; i++) { final a = starts[i]; for (final w in ws) { var from = 0; while (true) { final at = text.indexOf(w, from); if (at < 0) break; from = at + 1; var d = (at - a).abs(); if (a < at) d += 20; if (at > 0 && text[at - 1] == 'מ') d += 10; if (d < bestD && d <= 60) { bestD = d; best = i; } } } }
    return best;
  }
  final nStarts = [for (final n in numMs) n.start];
  final usedN = <int>{};
  final numOnly = m.numFields.where((f) => !m.percentFields.contains(f)).toList();   // שדה-אחוז מקבל אחוז, לא סכום
  for (final f in numOnly) { final i = nearest(nStarts, f); if (i >= 0 && !usedN.contains(i)) { out[f] = numMs[i].value; usedN.add(i); } }
  var ni = 0; for (final f in numOnly) { if (out.containsKey(f)) continue; while (ni < numMs.length && usedN.contains(ni)) { ni++; } if (ni < numMs.length) { out[f] = numMs[ni].value; usedN.add(ni); } }
  final timeMs = balaganTimes(text, now: today == null ? null : DateTime(today.year, today.month, today.day, 10, 0));   // בבדיקה: «עכשיו» = 10:00 של היום-המוזרק
  final personMs = balaganPersons(text, [...dateMs, ...timeMs, ...phoneMs], phoneMs);
  final repMs = balaganRepeat(text); if (repMs.isNotEmpty) out['__repeat'] = repMs.first.iso;   // ↻ נשמר ברשומה; «סיים» יוצר את הבא
  if ([${SLB.hebYearlyWords.map(dq).join(', ')}].any((w) => text.contains(w))) out['__repeat'] = 'h1';   // ב׳-קנח · G49 · חזרה שנתית לפי הלוח העברי
  void assign(List<String> fields, List<_DateAt> ms, Set<int> used) {
    final st = [for (final x in ms) x.start];
    for (final f in fields) { final i = nearest(st, f); if (i >= 0 && !used.contains(i)) { out[f] = ms[i].iso; used.add(i); } }
    var j = 0; for (final f in fields) { if (out.containsKey(f)) continue; while (j < ms.length && used.contains(j)) { j++; } if (j < ms.length) { out[f] = ms[j].iso; used.add(j); } }
  }
  final usedP = <int>{}; assign(m.phoneFields, phoneMs, usedP);
  final usedPc = <int>{}; assign(m.percentFields, pctMs, usedPc);
  final usedPe = <int>{}; assign(m.personFields, personMs, usedPe);   // «עם דני» ⇒ שדה-האדם; לא מוסר מהמתאר (השם הוא חלק מהמשפט)
  final tStarts = [for (final t in timeMs) t.start];
  final usedT = <int>{};
  for (final f in m.timeFields) { final i = nearest(tStarts, f); if (i >= 0 && !usedT.contains(i)) { out[f] = timeMs[i].iso; usedT.add(i); } }
  var ti = 0; for (final f in m.timeFields) { if (out.containsKey(f)) continue; while (ti < timeMs.length && usedT.contains(ti)) { ti++; } if (ti < timeMs.length) { out[f] = timeMs[ti].iso; usedT.add(ti); } }
  final dStarts = [for (final d in dateMs) d.start];
  final usedD = <int>{};
  for (final f in m.dateFields) { final i = nearest(dStarts, f); if (i >= 0 && !usedD.contains(i)) { out[f] = dateMs[i].iso; usedD.add(i); } }
  var di = 0; for (final f in m.dateFields) { if (out.containsKey(f)) continue; while (di < dateMs.length && usedD.contains(di)) { di++; } if (di < dateMs.length) { out[f] = dateMs[di].iso; usedD.add(di); } }
  if (text0.trim().isNotEmpty) out['__note'] = text0.trim();   // הטקסט המקורי לעולם לא אובד (מוצג בתיק: «מה כתבת»)
  if (sender.isNotEmpty && m.personFields.isNotEmpty && !m.personFields.any((f) => out.containsKey(f))) out[m.personFields.first] = sender;
  // המתאר = השורה בלי העובדות שכבר נקלטו לשדות («לשלם ארנונה מחר 350 ש"ח» ⇒ «לשלם ארנונה»): הסרת-הטווחים שנצרכו + ניקוי מילת-יחס תלויה. אינו מילון — טווחי-ההתאמה עצמם.
  final spans = <List<int>>[for (final i in usedD) [dateMs[i].start, dateMs[i].end], for (final i in usedN) [numMs[i].start, numMs[i].end], for (final i in usedT) [timeMs[i].start, timeMs[i].end], for (final i in usedP) [phoneMs[i].start, phoneMs[i].end], for (final i in usedPc) [pctMs[i].start, pctMs[i].end], for (final x in repMs) [x.start, x.end]]..sort((a, b) => a[0].compareTo(b[0]));
  var cleaned = ''; var pos = 0; for (final sp in spans) { if (sp[0] > pos) cleaned += text.substring(pos, sp[0]); pos = sp[1] > pos ? sp[1] : pos; } cleaned += text.substring(pos);
  cleaned = cleaned.replaceAll(RegExp(r'\\s+'), ' ').replaceAll(RegExp(r'[\\s,\\-–—:]+\$'), '').replaceAll(RegExp(r'\\s[בלמוה]-?\$'), '').replaceAll(RegExp(r'^[\\s,\\-–—:]+'), '').trim();
  final rawLine = text.trim().split(RegExp(r'[\\n.]')).first.trim();
  final line = (cleaned.length >= 2 ? cleaned.split(RegExp(r'[\\n]')).first.trim() : rawLine);
  if (m.descField.isNotEmpty && !out.containsKey(m.descField) && line.isNotEmpty && line.length <= 40 && !m.dateFields.contains(m.descField) && !m.numFields.contains(m.descField)) { out[m.descField] = line; }   // מתאר שהוא גם שדה-אדם («לקוח») ושכבר קיבל שם — לא נדרס בשורה   // שורה קצרה = שם/מתאר; משפט ארוך אינו שם
  if (m.longField.isNotEmpty && text.trim().length > 40) { out[m.longField] = text.trim(); }
  // עובדה מטופסת בלי שדה-יעד (אחוז · טלפון · שעה) לא אובדת: נכנסת ל«הערה» (שדה-הטקסט-הארוך), אם הוא פנוי
  final left = <String>[for (var i = 0; i < pctMs.length; i++) if (!usedPc.contains(i)) pctMs[i].iso + '%', for (var i = 0; i < phoneMs.length; i++) if (!usedP.contains(i)) phoneMs[i].iso, for (var i = 0; i < timeMs.length; i++) if (!usedT.contains(i)) timeMs[i].iso];
  if (left.isNotEmpty && m.longField.isNotEmpty && !out.containsKey(m.longField)) { out[m.longField] = left.join(' · '); }   // הטקסט המלא ⇒ שדה-הטקסט-הארוך הראשון (multiline), אם יש
  return out;
}
`;
    write(slug, code, '');
  }

  // ── 1b · בדיקת-Dart מחוללת לעובדות: תאריכים-יחסיים · סכומים · קרבה-למילת-השדה — היום מוזרק (2026-09-08, יום ג׳) ⇒ דטרמיניסטי; רצה ב-ship (flutter test genesis_*) ──
  {
    const bsTest = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'test');
    const cases = [
      ['לשלם ארנונה מחר 350 ש"ח', ['תאריך תשלום'], ['סכום'], { 'תאריך תשלום': '2026-09-09', 'סכום': '350', 'מה': 'לשלם ארנונה' }],
      ['המשכיר מקזז 6,200 מהפיקדון של 8,000, מסרתי מפתח ב-1.8.2026', ['תאריך מסירת מפתח'], ['סכום הפיקדון'], { 'תאריך מסירת מפתח': '2026-08-01', 'סכום הפיקדון': '8000' }],
      ['פגישה עם הרו"ח בעוד שבועיים', ['מועד'], [], { 'מועד': '2026-09-22', 'מה': 'פגישה עם הרו"ח' }],
      ['תשובה ביום ראשון', ['מועד'], [], { 'מועד': '2026-09-13' }],
      ['לשלם בסוף החודש 8 אלף', ['מועד'], ['סכום'], { 'מועד': '2026-09-30', 'סכום': '8000' }],
      ['ההמחאה ב-15 לחודש', ['מועד'], [], { 'מועד': '2026-09-15', 'מה': 'ההמחאה' }],
      ['בעוד שלושה ימים מגיע הטכנאי, 12.5 ₪ לדקה', ['מועד'], ['סכום'], { 'מועד': '2026-09-11', 'סכום': '12.5' }],
      ['החוזה נגמר 30.11', ['מועד'], [], { 'מועד': '2026-11-30' }],
      ['ריבית 3.5% על 2,400', ['מועד'], ['סכום', 'ריבית'], { 'סכום': '2400', 'ריבית': '3.5' }, { pc: ['ריבית'] }],
      ['יום ה׳ אצל הרופא', ['מועד'], [], { 'מועד': '2026-09-10' }],
      ['פגישה עם רו"ח מחר ב-16:30', ['מועד'], [], { 'מועד': '2026-09-09', 'שעה': '16:30', 'מה': 'פגישה עם רו"ח' }, { tm: ['שעה'] }],
      ['בשעה 9 אצל דני בשבוע הבא', ['מועד'], [], { 'מועד': '2026-09-15', 'שעה': '09:00', 'מה': 'אצל דני', 'לקוח': 'דני' }, { tm: ['שעה'], pe: ['לקוח'] }],
      ['רות לוי 052-123-4567 פיקדון 8,000', [], ['סכום הפיקדון'], { 'טלפון': '0521234567', 'סכום הפיקדון': '8000', 'מה': 'רות לוי פיקדון' }, { ph: ['טלפון'] }],
      ['לדבר עם המשכיר על התיקון', [], [], { 'לקוח': 'המשכיר' }, { pe: ['לקוח'] }],
      ['רות לוי 052-123-4567 פיקדון 8,000', [], ['סכום הפיקדון'], { 'לקוח': 'רות לוי', 'טלפון': '0521234567' }, { ph: ['טלפון'], pe: ['לקוח'] }],
      ['התקשרתי ללאה כהן 03-1234567', [], [], { 'לקוח': 'לאה כהן', 'טלפון': '031234567' }, { ph: ['טלפון'], pe: ['לקוח'] }],
      ['לשלם ארנונה כל חודשיים ב-15 לחודש 350 ש"ח', ['מועד'], ['סכום'], { 'מועד': '2026-09-15', 'סכום': '350', '__repeat': 'm2', 'מה': 'לשלם ארנונה' }],
      ['כל יום ראשון חוג ג׳ודו', ['מועד'], [], { 'מועד': '2026-09-13', '__repeat': 'w1', 'מה': 'חוג ג׳ודו' }],
      ['ריבית 3.5% מול הבנק', [], [], { 'הערה': '3.5%' }, { lf: 'הערה' }],
      ['ההמחאה ב-15 בספטמבר', ['מועד'], [], { 'מועד': '2026-09-15', 'מה': 'ההמחאה' }],
      ['החוזה נגמר 3 באוקטובר 2027', ['מועד'], [], { 'מועד': '2027-10-03' }],
      ['שילמתי אלף וחמש מאות שקל לגנן', [], ['סכום'], { 'סכום': '1500', 'מה': 'שילמתי לגנן' }],
      ['הפיקדון שלושת אלפים ומאתיים', [], ['סכום'], { 'סכום': '3200' }],
      ['קנס של מאתיים', [], ['סכום'], { 'סכום': '200' }],
      ['רות לוי 052-123-4567 המשכיר עדיין לא החזיר', [], [], { 'לקוח': 'רות לוי', 'טלפון': '0521234567' }, { ph: ['טלפון'], pe: ['לקוח'], desc: 'לקוח' }],
      ['[8.9.2026, 16:30] דני: מחר ב-9:00 אצל הרופא', ['מועד'], [], { 'מועד': '2026-09-09', 'שעה': '09:00', 'לקוח': 'הרופא', 'מה': 'אצל הרופא' }, { tm: ['שעה'], pe: ['לקוח'] }],
      ['[8.9.2026, 16:30] דני: מחר ב-9:00 פגישה', ['מועד'], [], { 'מועד': '2026-09-09', 'שעה': '09:00', 'לקוח': 'דני', 'מה': 'פגישה' }, { tm: ['שעה'], pe: ['לקוח'] }],
      ['מחר בבוקר תור לרופא', ['מועד'], [], { 'מועד': '2026-09-09', 'שעה': '09:00', 'מה': 'תור לרופא' }, { tm: ['שעה'] }],
      ['להתקשר לבנק בעוד שעה', [], [], { 'שעה': '11:00', 'מה': 'להתקשר לבנק' }, { tm: ['שעה'] }],
      ['תזכיר לי בעוד 20 דקות לכבות את התנור', [], [], { 'שעה': '10:20' }, { tm: ['שעה'] }],
      ['בערב פגישה עם דני', ['מועד'], [], { 'שעה': '19:00', 'מה': 'פגישה עם דני' }, { tm: ['שעה'] }],
      ['8.9.26, 16:30 - רות לוי: מסרתי מפתח ב-1.8.2026', ['תאריך מסירת מפתח'], [], { 'תאריך מסירת מפתח': '2026-08-01', 'לקוח': 'רות לוי' }, { pe: ['לקוח'] }],
    ];
    const baseMod = mods.find((m) => m.layer === 'base') || mods[0]; const baseTodayCls = baseMod.home.cls + 'Today';
    const dq = (x) => "'" + String(x).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    const code = `// 🧭 חולל ע"י balagan (G33 ב׳-ה · הכרעה-29) — הוכחת-עובדות: תאריכים-יחסיים בעברית · צורות-סכום · קרבה-למילת-השדה. היום מוזרק ⇒ דטרמיניסטי. אל תערוך ידנית.
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_moments.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_${baseMod.home.slug}.dart' show ${baseTodayCls};
import 'dart:convert';
import 'package:buildsmart/genesis/dart-ui-bs/ds/ds_store.dart';
import 'package:buildsmart/genesis/dart-ui-bs/ds/ds.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_home.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_confirm.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_topics.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final today = DateTime(2026, 9, 8);   // יום שלישי
  BalaganModule mod(List<String> dates, List<String> nums, {List<String> tm = const [], List<String> ph = const [], List<String> pe = const [], List<String> pc = const [], String lf = '', String desc = 'מה'}) => BalaganModule(0, 't', 'בדיקה', 'בדיקה', '', const <String, double>{}, dates, nums, desc, lf, 'x', const <BalaganField>[], 1, const <String>[], timeFields: tm, phoneFields: ph, personFields: pe, percentFields: pc);
${cases.map(([text, dates, nums, exp, extra = {}], i) => `  test('עובדות ${i + 1}: ${text.replace(/'/g, '’')}', () {
    final f = balaganFacts(${dq(text)}, mod([${dates.map(dq).join(', ')}], [${nums.map(dq).join(', ')}]${Object.entries(extra).map(([kk, v]) => Array.isArray(v) ? `, ${kk}: [${v.map(dq).join(', ')}]` : `, ${kk}: ${dq(v)}`).join('')}), today: today);
${Object.entries(exp).map(([k, v]) => `    expect(f[${dq(k)}], ${dq(v)});`).join('\n')}
${dates.filter((d) => !(d in exp)).map((d) => `    expect(f.containsKey(${dq(d)}), isFalse);`).join('\n')}
    expect(f['__note'], ${dq(text)});
  });`).join('\n')}
  test('זיהוי: רגע כללי ⇒ שכבת-הבסיס ראשונה, המודול-החלש חלופה', () {
    final h = balaganIdentify('לשלם ארנונה מחר 350 ש"ח');
    expect(h.first.module.layer, 'base');
    expect(h.first.module.required, kBalaganModules.where((m) => m.layer == 'base').map((m) => m.required).reduce((a, b) => a < b ? a : b));
  });
  test('זיהוי: מילות-דקדוק לא מזהות — «ב-15 לחודש» / «כל חודש» ⇒ הבסיס, לא «לא משלם»', () {
    expect(balaganIdentify('לשלם ארנונה כל חודשיים ב-15 לחודש 350 ש"ח').first.module.layer, 'base');
    expect(balaganIdentify('לשלם לגנן כל חודש 400 ש"ח').first.module.layer, 'base');
    expect(balaganStripGrammar('לשלם ארנונה כל חודשיים ב-15 לחודש 350 ש"ח').contains('חודש'), isFalse);
  });
  test('זיהוי: רגע מובהק ⇒ המודול שלו, לא הבסיס', () {
    final h = balaganIdentify('המשכיר מקזז 6,200 מהפיקדון של 8,000, מסרתי מפתח');
    expect(h.first.module.layer, isNot('base'));
    expect(h.first.score / h.first.module.selfScore >= kBalaganWeak, isTrue);
  });
  test('תאריך שהמודול לא יכול להחזיק ⇒ הבסיס; בלי תאריך המודול נשאר', () {
    final a = balaganIdentify('מחר בבוקר תור לרופא'); expect(a.first.module.layer, 'base'); expect(a.first.module.timeFields, isNotEmpty); expect(a.any((h) => h.module.layer != 'base'), isTrue);
    final b = balaganIdentify('תור לרופא'); expect(b.first.module.layer, isNot('base'));
  });
  test('שעה + רגע כללי ⇒ הבסיס עם שדה-שעה (פגישה), לא משימה', () {
    final h = balaganIdentify('מחר ב-9:00 עם דני');
    expect(h.first.module.layer, 'base');
    expect(h.first.module.timeFields, isNotEmpty);
  });
  test('↻ המועד-הבא: חודש קצר ⇒ היום-האחרון · שבועיים · 3 ימים · שנה', () {
    expect(${baseTodayCls}.nextRepeat(DateTime(2026, 1, 31), 'm1'), DateTime(2026, 2, 28));
    expect(${baseTodayCls}.nextRepeat(DateTime(2026, 9, 8), 'w2'), DateTime(2026, 9, 22));
    expect(${baseTodayCls}.nextRepeat(DateTime(2026, 9, 8), 'd3'), DateTime(2026, 9, 11));
    expect(${baseTodayCls}.nextRepeat(DateTime(2028, 2, 29), 'y1'), DateTime(2029, 2, 28));
    expect(balaganRepeatLabel('m2'), 'כל חודשיים');
  });
  test('גיבוי: ייצוא ⇒ שחזור מחזיר את התיקים · טקסט זר נדחה · חיפוש מוצא בכל שדה', () {
    final st = AppStore();
    final id = st.add('x_ent', {'מה': 'לשלם ארנונה', 'טלפון': '0521234567'});
    final dump = st.exportJson();
    expect(st.importJson('לא גיבוי'), -1);
    expect(st.records('x_ent').length, 1);
    st.add('x_ent', {'מה': 'עוד אחד'});
    expect(st.importJson(dump), 1);
    expect(st.records('x_ent').first['מה'], 'לשלם ארנונה');
    expect(st.search('052').first[1], id);
    expect(st.search('ארנונה').length, 1);
    expect(st.search('x'), isEmpty);
  });
  test('«סיים» עם החזר: השורה מוסתרת והשלב מתקדם; החזר מחזיר את שניהם', () {
    final st = AppStore();
    final id = st.add('e_ent', {'מה': 'x', 'מועד': '2026-09-08', '__stage': '0'});
    st.advance('e_ent', id, 3); st.decide('ign:\$id:מועד', 'no');
    final lid = st.logAction('done', 'סיים', entity: 'e_ent', rid: id, field: 'מועד', prev: '0');
    expect(st.stageOf('e_ent', id), 1); expect(st.decision('ign:\$id:מועד'), 'no');
    expect(st.undo(lid), isTrue);
    expect(st.stageOf('e_ent', id), 0); expect(st.decision('ign:\$id:מועד'), '');
  });
  test('תיק כפול: אותו אדם/מתאר במודול פתוח ⇒ נמצא; סגור ⇒ לא', () {
    final m = BalaganModule(0, 't', 'בדיקה', 'בדיקה', '', const <String, double>{}, const [], const [], 'מה', '', 'dup_ent', const <BalaganField>[], 3, const <String>[], personFields: const ['לקוח']);
    final a = appStore.add('dup_ent', {'מה': 'פיקדון', 'לקוח': 'רות לוי', '__stage': '0'});
    appStore.add('dup_ent', {'מה': 'אחר', 'לקוח': 'דן כהן', '__stage': '2'});
    expect(balaganDuplicates(m, {'לקוח': ' רות  לוי '}).map((r) => r['__id']), [a]);
    expect(balaganDuplicates(m, {'לקוח': 'דן כהן'}), isEmpty);
    expect(balaganDuplicates(m, {'מה': 'פי'}), isEmpty);
    expect(balaganDuplicates(m, {'לקוח': 'לוי רות'}).map((r) => r['__id']), [a]);   // ב׳-קג · סדר-מילים הפוך = אותו אדם
    expect(balaganDuplicates(m, {'לקוח': 'רות כהן'}), isEmpty);   // ב׳-קג · מילה-אחת חופפת אינה אותו אדם
  });
  test('מיזוג לתיק קיים: ריק מתמלא · מלא לא נדרס · «מה כתבת» נצבר · החזר מחזיר הכל', () {
    final m = BalaganModule(0, 't', 'בדיקה', 'בדיקה', '', const <String, double>{}, const [], const [], 'לקוח', '', 'mrg_ent', const <BalaganField>[], 3, const <String>[], personFields: const ['לקוח'], phoneFields: const ['טלפון']);
    final id = appStore.add('mrg_ent', {'לקוח': 'רות לוי', 'טלפון': '', 'סכום': '8000', '__note': 'ראשון', '__stage': '0'});
    final n = balaganMerge(m, id, {'לקוח': 'רות לוי', 'טלפון': '0521234567', 'סכום': '9999', '__note': 'שני'}, 'מוזג {n}');
    expect(n, 2);
    final r = appStore.byId('mrg_ent', id)!;
    expect(r['טלפון'], '0521234567'); expect(r['סכום'], '8000'); expect(r['__note'], 'ראשון\\nשני');
    final lid = appStore.log.first['id']!; expect(appStore.log.first['kind'], 'merge');
    expect(appStore.undo(lid), isTrue);
    final r2 = appStore.byId('mrg_ent', id)!; expect(r2['טלפון'], ''); expect(r2['__note'], 'ראשון');
  });
  test('«שתף את היום»: טקסט עם באיחור/היום ושעות', () {
    final a = DsTodayItem(title: 'רופא שיניים', sub: '', due: DateTime(2026, 9, 8), hard: false, overdue: false, module: 'יומן', actions: const [], act: (_) {}, time: '09:30');
    final o = DsTodayItem(title: 'ארנונה', sub: '', due: DateTime(2026, 9, 5), hard: true, overdue: true, module: 'משימות', actions: const [], act: (_) {});
    final t = balaganDayText([o], [a], DateTime(2026, 9, 8));
    expect(t.contains('8.9'), isTrue); expect(t.contains('2026-09-08'), isFalse);   // ב׳-מא · כותרת כמו שאומרים expect(t.contains('• ארנונה (משימות)'), isTrue); expect(t.contains('• 09:30 רופא שיניים (יומן)'), isTrue);
  });
  test('ייצוא-וואטסאפ: הכותרת נקלפת, השולח = אדם, חותמת-ההודעה אינה מועד', () {
    expect(balaganWaStrip('[8.9.2026, 16:30] דני: מחר ב-9:00'), 'מחר ב-9:00');
    expect(balaganWaSender('8.9.26, 16:30 - רות לוי: שלום'), 'רות לוי');
    expect(balaganWaSender('מחר ב-9:00'), '');
    expect(balaganSplit('[8.9.2026, 16:30] דני: מחר אצל הרופא\\n[8.9.2026, 16:31] דני: ok').length, 1);
  });
  test('מחיקה עם החזר: הרשומה חוזרת כמו שהייתה', () {
    final st = AppStore();
    final id = st.add('d_ent', {'מה': 'x', 'טלפון': '05', '__stage': '1'});
    final snap = Map<String, String>.from(st.byId('d_ent', id)!);
    st.removeById('d_ent', id); expect(st.byId('d_ent', id), isNull);
    final lid = st.logAction('del', 'נמחק', entity: 'd_ent', rid: id, prev: jsonEncode(snap));
    expect(st.undo(lid), isTrue);
    expect(st.byId('d_ent', id)!['טלפון'], '05'); expect(st.byId('d_ent', id)!['__stage'], '1');
  });
  test('בלי תאריך: תיק בלי מועד לא נעלם — «קבע למחר»/«לשבוע» נותנים מועד עם החזר · «התעלם» מסתיר', () {
    final id = appStore.add('${baseMod.root.slug}', {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'לתקן את הברז'});
    final u = ${baseTodayCls}.undated(today);
    expect(u.any((x) => x.rid == id), isTrue);
    final it = u.firstWhere((x) => x.rid == id);
    it.act(0);
    expect(appStore.byId('${baseMod.root.slug}', id)![it.field], '2026-09-09');
    expect(${baseTodayCls}.undated(today).any((x) => x.rid == id), isFalse);
    expect(appStore.undo(appStore.log.first['id']!), isTrue);
    expect(appStore.byId('${baseMod.root.slug}', id)![it.field], '');
    ${baseTodayCls}.undated(today).firstWhere((x) => x.rid == id).act(1);
    expect(appStore.byId('${baseMod.root.slug}', id)![it.field], '2026-09-15');
    expect(appStore.undo(appStore.log.first['id']!), isTrue);
    ${baseTodayCls}.undated(today).firstWhere((x) => x.rid == id).act(2);
    expect(${baseTodayCls}.undated(today).any((x) => x.rid == id), isFalse);
    expect(appStore.byId('${baseMod.root.slug}', id)![it.field], '');
  });
  test('כסף-במבט: סכום שדה-הסכום הראשי של שורות-היום — תיק פעם אחת · פסיקים נקראים · עיצוב-אלפים · בשיתוף', () {
    final m = kBalaganModules.firstWhere((x) => x.numFields.any((f) => !x.percentFields.contains(f)));
    final f = m.numFields.firstWhere((x) => !m.percentFields.contains(x));
    final a = appStore.add(m.rootSlug, {f: '1250'}); final b = appStore.add(m.rootSlug, {f: '8,000'}); final c = appStore.add(m.rootSlug, {f: ''});
    DsTodayItem it(String rid) => DsTodayItem(title: 'x', sub: '', due: today, hard: false, overdue: false, module: m.title, actions: const [], act: (_) {}, rid: rid);
    expect(balaganMoney([it(a), it(a), it(b), it(c)]), 9250);
    expect(balaganMoney(const []), 0);
    expect(balaganFmtMoney(9250), '9,250'); expect(balaganFmtMoney(350), '350');
    expect(balaganDayText(const [], [it(a)], today, money: 1250).contains('1,250'), isTrue);
    expect(balaganDayText(const [], [it(a)], today).contains('סה'), isFalse);
  });
  test('נשכחים: תיק ישן שכל מועדיו עברו ונדחו-בהתעלם ⇒ מופיע; טרי/עתידי ⇒ לא; «סגור תיק» עם החזר; «קבע למחר» מחזיר ל«היום»', () {
    const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)}; const S = '${baseMod.root.slug}';
    final old = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'ישן', F: '2026-08-01', '__at': '2026-07-30'}); appStore.decide('ign:\$old:' + F, 'no');
    final fresh = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'טרי', F: '2026-08-01', '__at': '2026-09-01'}); appStore.decide('ign:\$fresh:' + F, 'no');
    final fut = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'עתידי', F: '2026-10-01', '__at': '2026-07-30'});
    final s = ${baseTodayCls}.stale(today);
    expect(s.map((x) => x.rid), contains(old)); expect(s.map((x) => x.rid), isNot(contains(fresh))); expect(s.map((x) => x.rid), isNot(contains(fut)));
    expect(s.firstWhere((x) => x.rid == old).sub.contains('40'), isTrue);
    s.firstWhere((x) => x.rid == old).act(0);
    expect(appStore.stageOf(S, old), ${(baseMod.root.stages || []).length - 1});
    expect(${baseTodayCls}.stale(today).any((x) => x.rid == old), isFalse);
    expect(appStore.undo(appStore.log.first['id']!), isTrue);
    expect(${baseTodayCls}.stale(today).any((x) => x.rid == old), isTrue);
    ${baseTodayCls}.stale(today).firstWhere((x) => x.rid == old).act(1);
    expect(appStore.byId(S, old)![F], '2026-09-09');
    expect(${baseTodayCls}.stale(today).any((x) => x.rid == old), isFalse);
    expect(${baseTodayCls}.items(today.add(const Duration(days: 1)), dayDelta: 0).any((x) => x.rid == old), isTrue);
  });
  test('צ׳יפי-מועד: כל תווית ⇒ תאריך דרך מנתח-הרגעים (היום · מחר · ביום ראשון · בעוד שבוע)', () {
    final c = balaganDateChips(today);
    expect(c.length, 4);
    expect(c.map((x) => x[1]).toList(), ['2026-09-08', '2026-09-09', '2026-09-13', '2026-09-15']);
  });
  test('«התעלם» עם החזר: שורת-באיחור נעלמת, נרשמת ביומן, והחזר מחזיר אותה', () {
    const S = '${baseMod.root.slug}'; const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)};
    final id = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'להתעלם', F: '2026-09-01'});
    final it = ${baseTodayCls}.items(today, dayDelta: 0).firstWhere((x) => x.rid == id);
    expect(it.overdue, isTrue); it.act(it.actions.length - 1);
    expect(${baseTodayCls}.items(today, dayDelta: 0).any((x) => x.rid == id), isFalse);
    expect(appStore.log.first['kind'], 'decide'); expect(appStore.log.first['field'], 'ign:' + id + ':' + F);
    expect(appStore.undo(appStore.log.first['id']!), isTrue);
    expect(${baseTodayCls}.items(today, dayDelta: 0).any((x) => x.rid == id), isTrue);
  });
  test('צ׳יפי-שעה: חלקי-יום ⇒ שעה דרך מנתח-הרגעים · צ׳יפי-אנשים: מי שכבר בתיקים לפי תדירות, בלי תיקים אין', () {
    expect(balaganTimeChips(DateTime(2026, 9, 8, 10)).map((x) => x[1]).toList(), ['09:00', '13:00', '16:00', '19:00']);
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty);
    final before = balaganPeople();
    appStore.add(m.rootSlug, {m.personFields.first: 'משה פרץ'}); appStore.add(m.rootSlug, {m.personFields.first: 'משה פרץ'}); appStore.add(m.rootSlug, {m.personFields.first: 'שרה גל'});
    final p = balaganPeople();
    expect(p.indexOf('משה פרץ') < p.indexOf('שרה גל') || !p.contains('שרה גל'), isTrue);
    expect(p.first, before.isEmpty ? 'משה פרץ' : p.first);
    expect(p.length <= 6, isTrue);
  });
  test('צ׳יפי-חזרה: כל תווית ⇒ קוד דרך מנתח-הרגעים (יום · שבוע · חודש · שנה)', () {
    expect(balaganRepeatChips().map((x) => x[1]).toList(), ['d1', 'w1', 'm1', 'y1']);
    expect(balaganRepeatChips().map((x) => balaganRepeatLabel(x[1])).toList(), balaganRepeatChips().map((x) => x[0]).toList());
  });
  test('כרטיס-אדם: תיקים · פתוחים · ₪ פתוח (שדה ראשי, פסיקים) · טלפונים · לא-קיים ⇒ null · 0⇒972', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f)));
    final nf = m.numFields.firstWhere((f) => !m.percentFields.contains(f));
    appStore.add(m.rootSlug, {m.personFields.first: 'יעל ברק', nf: '1,000', if (m.phoneFields.isNotEmpty) m.phoneFields.first: '0501234567'});
    appStore.add(m.rootSlug, {m.personFields.first: ' יעל ברק ', nf: '250', if (m.stages > 0) '__stage': (m.stages - 1).toString()});
    final p = balaganPerson('יעל ברק')!;
    expect(p.files, 2); expect(p.open, m.stages > 0 ? 1 : 2); expect(p.money, m.stages > 0 ? 1000 : 1250);
    if (m.phoneFields.isNotEmpty) expect(p.phones, ['0501234567']);
    expect(balaganIntl('050-123-4567'), '972501234567'); expect(balaganIntl('+972501234567'), '972501234567');
    expect(balaganPerson('אין כזה'), isNull);
  });
  test('גיבוי: גיל בימים (מעולם = −1) · מזכירים רק מ-10 תיקים ורק מעולם/≥30 יום', () {
    expect(balaganBackupAge('', today), -1); expect(balaganBackupAge('לא תאריך', today), -1);
    expect(balaganBackupAge('2026-08-09', today), 30); expect(balaganBackupAge('2026-09-08', today), 0);
    expect(balaganBackupDue(3, -1), isFalse); expect(balaganBackupDue(10, -1), isTrue);
    expect(balaganBackupDue(10, 29), isFalse); expect(balaganBackupDue(10, 30), isTrue);
  });
  test('תזכורות-מרוכזות: מועדים קרובים בלי הכרעה נמנים · שהוכרע יוצא · החזר-מרוכז מוחק את כל ההכרעות', () {
    const S = '${baseMod.root.slug}'; const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)};
    final ids = [for (var i = 1; i <= 4; i++) appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'תזכורת \$i', F: '2026-09-1\$i'})];
    expect(ids.every((id) => ${baseTodayCls}.remPending(today).any((x) => x.rid == id)), isTrue);
    appStore.decide('rem:' + ids[0] + ':' + F, 'ok');
    expect(${baseTodayCls}.remPending(today).any((x) => x.rid == ids[0]), isFalse);
    final keys = [for (final id in ids.skip(1)) 'rem:' + id + ':' + F];
    for (final k in keys) { appStore.decide(k, 'ok'); }
    final lid = appStore.logAction('decide', 'תזכורות', field: keys.first, prev: keys.skip(1).join(','));
    expect(appStore.undo(lid), isTrue);
    expect(keys.every((k) => appStore.decision(k).isEmpty), isTrue);
    expect(ids.skip(1).every((id) => ${baseTodayCls}.remPending(today).any((x) => x.rid == id)), isTrue);
  });
  test('כרטיס-אדם מחיפוש-חלקי: יחיד-שמכיל ⇒ הכרטיס · שניים ⇒ אין · קצר ⇒ אין', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty);
    appStore.add(m.rootSlug, {m.personFields.first: 'נועה שגב'}); appStore.add(m.rootSlug, {m.personFields.first: 'נועה לב'});
    expect(balaganPersonFor('שגב')!.name, 'נועה שגב');
    expect(balaganPersonFor('נועה'), isNull);
    expect(balaganPersonFor('ש'), isNull);
    expect(balaganPersonFor('שגב נועה')!.name, 'נועה שגב');   // ב׳-קג · סדר-מילים הפוך ⇒ אותו אדם
  });
  test('ב׳-קי/קיא/קיב · החודש (מונה+₪ של תיקים פתוחים) · נראה-חוזר (3 ארנונות חודשיות ⇒ m1) · שלחת-ואין-תשובה (3 ימים; פעולה מאוחרת מבטלת)', () {
    final m = kBalaganModules.firstWhere((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))); final S = m.rootSlug; final D = m.descField; final df = m.dateFields.first; final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    appStore.add(S, {D: 'ארנונה', df: '2026-07-15', nf: '350', '__stage': '0'}); appStore.add(S, {D: 'ארנונה', df: '2026-08-15', nf: '350', '__stage': '0'}); appStore.add(S, {D: 'ביטוח', df: '2026-09-20', nf: '1,200', '__stage': '0'});
    expect(balaganRecurHint(m, {D: 'ארנונה', df: '2026-09-15'}), 'm1'); expect(balaganRecurHint(m, {D: 'ביטוח', df: '2026-09-15'}), ''); expect(balaganRecurHint(m, {D: 'ארנונה', df: ''}), '');
    final ms = balaganMonthSummary(DateTime(2026, 9, 8)); expect(ms[0] >= 1, isTrue); expect(ms[1] >= 1200, isTrue);
    final id = appStore.add(S, {D: 'לשלוח הצעה', df: '2026-09-01'}); appStore.logAction('send', 'שלח', entity: S, rid: id); final i0 = appStore.log.first['id'] ?? '';
    expect(balaganSilentSends(DateTime.now().add(const Duration(days: 4))).any((s) => s[1] == id), isTrue); expect(balaganSilentSends(DateTime.now()).any((s) => s[1] == id), isFalse);
    appStore.logAction('done', 'סיים', entity: S, rid: id); expect(balaganSilentSends(DateTime.now().add(const Duration(days: 4))).any((s) => s[1] == id), isFalse); expect(i0.isNotEmpty, isTrue);
  });
  test('ב׳-קנט/קסב · «₪ 350 כמו תמיד» = השכיח (≥2 שווים) · תווית «כל חודש (ב-15)»', () {
    final m = kBalaganModules.where((x) => x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))).skip(1).first; final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    appStore.add(m.rootSlug, {m.descField: 'ועד בית', nf: '350'}); appStore.add(m.rootSlug, {m.descField: 'ועד בית', nf: '350'}); appStore.add(m.rootSlug, {m.descField: 'ועד בית', nf: '400'});
    expect(balaganUsualAmount(m, {m.descField: 'ועד בית'}), '350'); expect(balaganUsualAmount(m, {m.descField: 'אחר'}), '');
    expect(balaganRepeatLabelFor('m1', '2026-09-15').contains('15'), isTrue); expect(balaganRepeatLabelFor('w1', '2026-09-15'), balaganRepeatLabel('w1'));
  });
  test('ב׳-קנו/קנח · «ט״ו אלול» ⇒ תאריך · «כ״ט באלול» · «כל שנה עברית» ⇒ h1 · תווית', () {
    final m = kBalaganModules.firstWhere((x) => x.dateFields.isNotEmpty);
    final f1 = balaganFacts('לשלם ארנונה ט״ו אלול', m, today: DateTime(2026, 8, 1)); expect(f1[m.dateFields.first], '2026-08-28');
    final f2 = balaganFacts('חתונה כ״ט באלול', m, today: DateTime(2026, 8, 1)); expect(f2[m.dateFields.first], '2026-09-11');
    final f3 = balaganFacts('יארצייט כל שנה עברית ט״ו אלול', m, today: DateTime(2026, 8, 1)); expect(f3['__repeat'], 'h1'); expect(balaganRepeatLabel('h1').isNotEmpty, isTrue);
  });
  test('ב׳-קנד · ייבוא-VCF ⇒ ספר-טלפונים (דדופ לפי מפתח) · טלפון-לפי-שם · שם-לפי-טלפון מהספר', () {
    appStore.setSetting('phonebook', '');
    final r1 = balaganImportVcf('BEGIN:VCARD\\nFN:יעל ברק\\nTEL;CELL:054-333-4444\\nEND:VCARD\\nBEGIN:VCARD\\nFN:יעל ברק\\nTEL:+972543334444\\nEND:VCARD\\n'); expect(r1, [1, 1]);
    expect(balaganBookPhone('ברק יעל'), '054-333-4444'); expect(balaganBookPhone('אין'), ''); expect(balaganPersonByPhone('0543334444'), 'יעל ברק');
    expect(balaganImportVcf('שטויות'), [0, 0]); appStore.setSetting('phonebook', '');
  });
  test('ב׳-קנ/קנא/קנג · טלפון מתיק אחר · CSV-הכל · «טלפון של X» ⇒ ערך · «של» בלי צדדים ⇒ ריק', () {
    final mp = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.phoneFields.isNotEmpty);
    appStore.add(mp.rootSlug, {mp.personFields.first: 'גדי פרץ', mp.phoneFields.first: '053-999-1111'}); expect(balaganPhoneOfPerson('גדי פרץ'), '053-999-1111'); expect(balaganPhoneOfPerson('אין כזה'), '');
    expect(balaganFieldOf('טלפון של גדי פרץ'), ['טלפון', 'גדי פרץ']); expect(balaganFieldOf('של גדי'), isEmpty); expect(balaganFieldOf('טלפון'), isEmpty);
    final fv = balaganFieldValue(mp.phoneFields.first, 'גדי פרץ'); expect(fv.isNotEmpty, isTrue); expect(fv[2], '053-999-1111'); expect(balaganFieldValue('זזזז', 'גדי פרץ'), isEmpty);
    final all = balaganCsvAll(); expect(all.contains('גדי פרץ'), isTrue); expect(all.startsWith('\\uFEFF') || all.codeUnitAt(0) == 0xFEFF, isTrue);
  });
  test('ב׳-קמז/קמח · CSV מפריטי-טווח · ייבוא-CSV לפי כותרות ⇒ רשומות · כותרות זרות ⇒ אין', () {
    final m = kBalaganModules.where((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))).last; final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    final csv = m.descField + ',' + m.dateFields.first + ',' + nf + '\\nייבוא-א,2034-01-05,"1,500"\\nייבוא-ב,2034-01-06,200';
    final r = balaganImportCsv(csv); expect(r[0], m.title); expect(r[1], 2);
    expect(appStore.records(m.rootSlug).any((x) => x[m.descField] == 'ייבוא-א' && x[nf] == '1,500'), isTrue);
    expect(balaganImportCsv('זזז,קקק\\n1,2')[1], 0); expect(balaganImportCsv('')[1], 0);
    final out = balaganCsvOf(balaganRangeItems('2034-01-01', '2034-01-31')); expect(out.contains('ייבוא-א'), isTrue); expect(out.contains('"1,500"'), isTrue);
  });
  test('ב׳-קמב/קמד/קמה · ICS מפריטי-טווח · «מתי ארנונה» ⇒ הפעם האחרונה · חסר-טלפון', () {
    final m = kBalaganModules.where((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty).skip(4).first;
    final id = appStore.add(m.rootSlug, {m.descField: 'ביקורת רכב', m.dateFields.first: '2033-04-05'}); final ics = balaganIcsOf(balaganRangeItems('2033-04-01', '2033-04-30'), 'בדיקה', DateTime(2026, 9, 8, 10));
    expect(ics.contains('DTSTART;VALUE=DATE:20330405'), isTrue); expect(ics.contains('X-WR-CALNAME:בדיקה'), isTrue);
    expect(balaganWhenOf('מתי ארנונה'), 'ארנונה'); expect(balaganWhenOf('מתי היה ביקורת רכב'), 'ביקורת רכב'); expect(balaganWhenOf('ארנונה'), '');
    expect(balaganLastDone('ביקורת רכב'), isEmpty); appStore.logAction('done', 'סיים', entity: m.rootSlug, rid: id); expect(balaganLastDone('ביקורת רכב').isNotEmpty, isTrue); expect(balaganLastDone('זזזזז'), isEmpty);
    final mp = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.phoneFields.isNotEmpty); final a = appStore.add(mp.rootSlug, {mp.personFields.first: 'בלי טלפון', '__stage': '0'}); final b = appStore.add(mp.rootSlug, {mp.personFields.first: 'עם טלפון', mp.phoneFields.first: '050-1112222', '__stage': '0'});
    final np = balaganNoPhone(); expect(np.any((e) => e[1] == a), isTrue); expect(np.any((e) => e[1] == b), isFalse);
  });
  test('ב׳-קלט/קמא · השעה הרגילה (חציון של אותו מתאר, ≥2) · פג-תוקף בקרוב (שדה-תוקף ב-30 יום, פתוח בלבד)', () {
    final mt = kBalaganModules.where((x) => x.descField.isNotEmpty && x.timeFields.isNotEmpty).firstOrNull;
    if (mt != null) { appStore.add(mt.rootSlug, {mt.descField: 'חוג שחייה', mt.timeFields.first: '16:00'}); appStore.add(mt.rootSlug, {mt.descField: 'חוג שחייה', mt.timeFields.first: '17:00'}); appStore.add(mt.rootSlug, {mt.descField: 'חוג שחייה', mt.timeFields.first: '16:30'}); expect(balaganUsualTime(mt, {mt.descField: 'חוג שחייה'}), '16:30'); expect(balaganUsualTime(mt, {mt.descField: 'אחר'}), ''); }
    final me = kBalaganModules.where((x) => x.dateFields.any((f) => f.contains('תוקף') || f.contains('חידוש') || f.contains('סיום'))).firstOrNull;
    if (me != null) { final f = me.dateFields.firstWhere((x) => x.contains('תוקף') || x.contains('חידוש') || x.contains('סיום')); final id = appStore.add(me.rootSlug, {f: DateTime.now().add(const Duration(days: 10)).toIso8601String().substring(0, 10), '__stage': '0'}); appStore.add(me.rootSlug, {f: DateTime.now().add(const Duration(days: 90)).toIso8601String().substring(0, 10), '__stage': '0'}); final ex = balaganExpiring(DateTime.now()); expect(ex.any((e) => e[2] == id), isTrue); expect(ex.length, 1); }
  });
  test('ב׳-קלו · המתארים השכיחים: «ארנונה» ×3 (גם «ארנונה ») ראשון · יחיד לא נכנס', () {
    final m = kBalaganModules.where((x) => x.descField.isNotEmpty).skip(3).first;
    appStore.add(m.rootSlug, {m.descField: 'ארנונה-בדיקה'}); appStore.add(m.rootSlug, {m.descField: 'ארנונה-בדיקה '}); appStore.add(m.rootSlug, {m.descField: 'ארנונה-בדיקה'}); appStore.add(m.rootSlug, {m.descField: 'יחיד-בדיקה'});
    final top = balaganTopDescs(); expect(top.any((t) => t[0] == 'ארנונה-בדיקה' && t[1] == 3), isTrue); expect(top.any((t) => t[0] == 'יחיד-בדיקה'), isFalse);
  });
  test('ב׳-קל/קלא · «בין 1.9 ל-15.9» ⇒ טווח · «מ-15.9 עד 1.9» ⇒ ממוין · טקסט-זר ⇒ ריק · שולם-כבר ב-7 ימים ⇒ אזהרה', () {
    final today = DateTime(2026, 9, 8);
    expect(balaganRangeOf('בין 1.9 ל-15.9', today), ['2026-09-01', '2026-09-15']); expect(balaganRangeOf('מ-15.9 עד 1.9', today), ['2026-09-01', '2026-09-15']); expect(balaganRangeOf('לשלם בין 1.9 ל-15.9', today), isEmpty); expect(balaganRangeOf('15.9', today), isEmpty);
    final m = kBalaganModules.where((x) => x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))).skip(2).first; final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    final id = appStore.add(m.rootSlug, {m.descField: 'ביטוח רכב', nf: '1,200'}); appStore.logAction('done', 'סיים', entity: m.rootSlug, rid: id);
    expect(balaganPaidRecently(m, {m.descField: 'ביטוח רכב', nf: '1200'}, DateTime.now()).isNotEmpty, isTrue); expect(balaganPaidRecently(m, {m.descField: 'ביטוח רכב', nf: '900'}, DateTime.now()), isEmpty); expect(balaganPaidRecently(m, {m.descField: 'ביטוח דירה', nf: '1200'}, DateTime.now()), isEmpty); expect(balaganPaidRecently(m, {m.descField: 'ביטוח רכב', nf: '1200'}, DateTime.now().add(const Duration(days: 30))), isEmpty);
  });
  test('ב׳-קכח · טלפון מוכר ⇒ שם-האדם (052… = +972…) · קצר/זר ⇒ ריק', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.phoneFields.isNotEmpty);
    appStore.add(m.rootSlug, {m.personFields.first: 'יוסי ברק', m.phoneFields.first: '054-777-8899'});
    expect(balaganPersonByPhone('+972547778899'), 'יוסי ברק'); expect(balaganPersonByPhone('054-000-0000'), ''); expect(balaganPersonByPhone('054'), '');
  });
  test('ב׳-קכב/קכג/קכה · «שבוע הבא» ⇒ היסט · «מעל 5000» ⇒ סינון-סכום · פריטי-טווח · ספירת-דחיות', () {
    expect(balaganWeekOf('שבוע הבא'), 1); expect(balaganWeekOf(' השבוע '), 0); expect(balaganWeekOf('שבוע שעבר'), -1); expect(balaganWeekOf('שבוע'), isNull);
    expect(balaganAmountFilter('מעל 5,000'), ['>', '5000']); expect(balaganAmountFilter('פחות מ-300'), ['<', '300']); expect(balaganAmountFilter('מעל הכל'), isEmpty); expect(balaganAmountFilter('5000'), isEmpty);
    final m = kBalaganModules.firstWhere((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))); final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    final big = appStore.add(m.rootSlug, {m.descField: 'גדול', m.dateFields.first: '2032-05-13', nf: '9,999'}); appStore.add(m.rootSlug, {m.descField: 'קטן', m.dateFields.first: '2032-05-09', nf: '10'});
    expect(balaganAmountItems('>', '5000').any((r) => r[1] == big), isTrue); expect(balaganAmountItems('<', '5000').any((r) => r[1] == big), isFalse);
    final it = balaganRangeItems('2032-05-10', '2032-05-16'); expect(it.length, 1); expect(it.first[2], big); expect(balaganRangeItems('2032-05-01', '2032-05-16').length, 2);
    for (var i = 0; i < 3; i++) { appStore.logAction('auto', ${dq(L.actSnooze)} + ' · מועד', entity: m.rootSlug, rid: big, field: m.dateFields.first); } expect(balaganSnoozeCounts()[big], 3);
  });
  test('ב׳-קכא · «ספטמבר» ⇒ מפתח-חודש · «באוקטובר 2027» · לא-חודש ⇒ ריק · פריטי-החודש ממוינים לפי יום', () {
    final today = DateTime(2026, 9, 8);
    expect(balaganMonthOf('ספטמבר', today), '2026-09'); expect(balaganMonthOf(' באוקטובר 2027 ', today), '2027-10'); expect(balaganMonthOf('ספטמבר 15', today), ''); expect(balaganMonthOf('שלום', today), ''); expect(balaganMonthName('2026-09'), 'ספטמבר');
    final m = kBalaganModules.firstWhere((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty); appStore.add(m.rootSlug, {m.descField: 'חודש-ב', m.dateFields.first: '2031-03-20'}); appStore.add(m.rootSlug, {m.descField: 'חודש-א', m.dateFields.first: '2031-03-05'});
    final it = balaganMonthItems('2031-03'); expect(it.length, 2); expect(it.first[0], '2031-03-05'); expect(balaganMonthItems('2031-04'), isEmpty);
  });
  test('ב׳-קיד/קטו/קיז · החודש לפי נושא · בדרך-כלל נסגר תוך n · נסגר אחרי n', () {
    final m = kBalaganModules.where((x) => x.dateFields.isNotEmpty && x.descField.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))).skip(1).first;   /* מודול אחר מזה של ב׳-קי — ה-store משותף בין הבדיקות */ final S = m.rootSlug; final df = m.dateFields.first; final nf = m.numFields.where((f) => !m.percentFields.contains(f)).first;
    appStore.add(S, {m.descField: 'א', df: '2026-09-03', nf: '100', '__stage': '0'}); appStore.add(S, {m.descField: 'ב', df: '2026-09-25', nf: '250', '__stage': '0'});
    final bt = balaganMonthByTopic(DateTime(2026, 9, 8)); expect(bt.any((r) => r[0] == (m.topic.isEmpty ? m.title : m.topic) && (r[2] as double) >= 350), isTrue);
    expect(balaganTypicalDays(m), 0);
    final a = appStore.add(S, {m.descField: 'ג', df: '2026-09-01', '__at': DateTime.now().subtract(const Duration(days: 4)).toIso8601String()}); appStore.logAction('done', 'סיים', entity: S, rid: a);
    final b = appStore.add(S, {m.descField: 'ד', df: '2026-09-01', '__at': DateTime.now().subtract(const Duration(days: 2)).toIso8601String()}); appStore.logAction('done', 'סיים', entity: S, rid: b);
    expect(balaganTypicalDays(m), 4); expect(balaganClosedAfter(appStore.log.first), 2); expect(balaganClosedAfter({'entity': S, 'rid': 'zz', 'at': ''}), -1);
  });
  test('ב׳-קו · אותו אדם בכמה שמות: טלפון משותף ⇒ כינויים · הכרטיס מאחד את התיקים · שם זר לא נדבק', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.phoneFields.isNotEmpty);
    appStore.add(m.rootSlug, {m.personFields.first: 'רות לוי', m.phoneFields.first: '052-111-2233'}); appStore.add(m.rootSlug, {m.personFields.first: 'רותי לוי', m.phoneFields.first: '+972521112233'}); appStore.add(m.rootSlug, {m.personFields.first: 'דן כהן', m.phoneFields.first: '03-5551234'});
    expect(balaganAliases('רות לוי'), {'רות לוי', 'רותי לוי'}); expect(balaganAliases('דן כהן'), {'דן כהן'});
    expect(balaganPerson('רות לוי')!.files, 2); expect(balaganPerson('רותי לוי')!.files, 2); expect(balaganPerson('דן כהן')!.files, 1);
    expect(balaganPersonFor(' נועה לב ')!.files, 1);
  });
  test('פותח-תיק: ישות מוכרת ⇒ עמוד-השורש שלה; לא מוכרת ⇒ ריק', () {
    expect(balaganOpenRoot('nope', 'x') is SizedBox, isTrue);
    for (final m in kBalaganModules) { expect(balaganOpenRoot(m.rootSlug, 'x') is SizedBox, isFalse, reason: m.rootSlug); }
  });
  test('תאריך כמו שאומרים: היום · מחר · אתמול · יום שלישי 15.9 · 30.11 · 3.10.2027', () {
    expect(balaganDayLabel(DateTime(2026, 9, 8), today), 'היום');
    expect(balaganDayLabel(DateTime(2026, 9, 9), today), 'מחר');
    expect(balaganDayLabel(DateTime(2026, 9, 7), today), 'אתמול');
    expect(balaganDayLabel(DateTime(2026, 9, 13), today).endsWith(' 13.9'), isTrue);
    expect(balaganDayLabel(DateTime(2026, 9, 13), today).startsWith('יום'), isTrue);
    expect(balaganDayLabel(DateTime(2026, 11, 30), today), '30.11');
    expect(balaganDayLabel(DateTime(2027, 10, 3), today), '3.10.2027');
    expect(balaganDayText(const [], const [], today, tomorrow: [DsTodayItem(title: 'ביטוח', sub: '', due: DateTime(2026, 9, 9), hard: false, overdue: false, module: 'משימות', actions: const [], act: (_) {})]).contains('• ביטוח (משימות)'), isTrue);
  });
  test('היסטי-תזכורת כמו שאומרים: 3,1,0 ⇒ «3 ימים לפני · יום לפני · ביום»', () {
    expect(balaganOffsetsLabel('3,1,0'), '3 ימים לפני · יום לפני · ביום');
    expect(balaganOffsetsLabel('7'), '7 ימים לפני');
  });
  test('מתי זה קרה: עכשיו · לפני 5 דק׳ · לפני שעה · לפני 3 שעות · אתמול', () {
    final now = DateTime(2026, 9, 8, 14, 0);
    expect(balaganAgo(DateTime(2026, 9, 8, 13, 59, 40), now), 'עכשיו');
    expect(balaganAgo(DateTime(2026, 9, 8, 13, 55), now), 'לפני 5 דק׳');
    expect(balaganAgo(DateTime(2026, 9, 8, 12, 50), now), 'לפני שעה');
    expect(balaganAgo(DateTime(2026, 9, 8, 11, 0), now), 'לפני 3 שעות');
    expect(balaganAgo(DateTime(2026, 9, 7, 23, 0), now), 'אתמול');
  });
  test('הקשר לכרטיס-הכפול (מודול · מועד · ₪) · «n פתוחים» למודול', () {
    final m = kBalaganModules.firstWhere((x) => x.dateFields.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f)));
    final nf = m.numFields.firstWhere((f) => !m.percentFields.contains(f));
    expect(balaganDupSub(m, {m.dateFields.first: '2026-09-09', nf: '8000'}, today), m.title + ' · מחר · ₪ 8,000');
    expect(balaganDupSub(m, {}, today), m.title);
    final before = balaganOpenCount(m.rootSlug, m.stages);
    appStore.add(m.rootSlug, {nf: '1'}); if (m.stages > 0) appStore.add(m.rootSlug, {nf: '2', '__stage': (m.stages - 1).toString()});
    final after = balaganOpenCount(m.rootSlug, m.stages);
    expect(after, isNot(before)); expect(after.contains('פתוחים'), isTrue);
  });
  test('«שם: רגע» — שם מוכר בתחילת השורה = האדם, לא-מוכר = טקסט רגיל · מיזוג מעדכן מועד-שעבר בלבד', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.dateFields.isNotEmpty);
    appStore.add(m.rootSlug, {m.personFields.first: 'גלית בר'});
    final f = balaganFacts('גלית בר: להתקשר מחר', m, today: today);
    expect(f[m.personFields.first], 'גלית בר'); expect(f[m.dateFields.first], '2026-09-09');
    final g = balaganFacts('הערה: להתקשר מחר', m, today: today);
    expect(g[m.personFields.first], isNot('הערה'));
    final id = appStore.add(m.rootSlug, {m.personFields.first: 'גלית בר', m.dateFields.first: '2020-01-01'});
    balaganMerge(m, id, {m.dateFields.first: '2099-01-01'}, 'x'); expect(appStore.byId(m.rootSlug, id)![m.dateFields.first], '2099-01-01');
    balaganMerge(m, id, {m.dateFields.first: '2098-01-01'}, 'x'); expect(appStore.byId(m.rootSlug, id)![m.dateFields.first], '2099-01-01');
    final id2 = appStore.add(m.rootSlug, {m.personFields.first: 'גלית בר', m.dateFields.first: '2020-01-01'});
    balaganMerge(m, id2, {m.dateFields.first: '2019-01-01'}, 'x'); expect(appStore.byId(m.rootSlug, id2)![m.dateFields.first], '2020-01-01');
  });
  test('אין מבוי-סתום: טקסט שלא זוהה ⇒ הבסיס (משימות) · שיתוף עם בלי-מועד/נשכחים', () {
    final h = balaganIdentify('קסםקסם'); expect(h, isNotEmpty); expect(h.first.module.layer, 'base'); expect(h.first.module.dateFields, isNotEmpty);
    expect(balaganDayText(const [], const [], today, undated: 2, stale: 1).contains('2 בלי מועד · 1 נשכחים'), isTrue);
    expect(balaganDayText(const [], const [], today).contains('בלי מועד'), isFalse);
  });
  test('פיצול שורה לכמה רגעים', () {
    expect(balaganSplit('שילמתי ארנונה. מחר תור לרופא ב-9:00'), ['שילמתי ארנונה', 'מחר תור לרופא ב-9:00']);
    expect(balaganSplit('מסרתי מפתח ב-1.8.2026 והמשכיר מקזז 6,200'), ['מסרתי מפתח ב-1.8.2026 והמשכיר מקזז 6,200']);
    expect(balaganSplit('שורה אחת\\nשורה שתיים; ועוד אחת').length, 3);
  });
  test('זיהוי: כל כותרת-מודול ⇒ עצמו (הסף אינו בולע כותרות)', () {
    for (final m in kBalaganModules) { expect(balaganIdentify(m.title).first.module.ns, m.ns, reason: m.title); }
  });
  test('ב׳-פו · «דחה למחר» מבאיחור = מחר (לא יום-אחרי-המועד-שעבר) · «דחה לשבוע» = בעוד שבוע · החזר', () {
    const S = '${baseMod.root.slug}'; const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)};
    final id = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'ישן', F: '2026-09-01'});
    final it = ${baseTodayCls}.items(today, dayDelta: 0).firstWhere((x) => x.rid == id); expect(it.overdue, isTrue);
    it.act(it.actions.indexOf('דחה למחר')); expect(appStore.byId(S, id)![F], '2026-09-09');
    expect(${baseTodayCls}.items(today, dayDelta: 0).any((x) => x.rid == id), isFalse); expect(${baseTodayCls}.items(today, dayDelta: 1).any((x) => x.rid == id), isTrue);
    expect(appStore.undo(appStore.log.first['id']!), isTrue); expect(appStore.byId(S, id)![F], '2026-09-01');
    final it2 = ${baseTodayCls}.items(today, dayDelta: 0).firstWhere((x) => x.rid == id); it2.act(it2.actions.indexOf('דחה לשבוע')); expect(appStore.byId(S, id)![F], '2026-09-15');
  });
  test('ב׳-פז · החזר-קבוצתי: כמה שורות-יומן עם group אחד ⇒ החזר של אחת מחזיר את כולן', () {
    const S = '${baseMod.root.slug}'; const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)};
    final a = appStore.add(S, {F: '2026-09-01'}); final b = appStore.add(S, {F: '2026-09-02'});
    final ia = appStore.logAction('auto', 'א', entity: S, rid: a, field: F, prev: '2026-09-01', group: 'g1'); appStore.update(S, a, {F: '2026-09-09'});
    appStore.logAction('auto', 'ב', entity: S, rid: b, field: F, prev: '2026-09-02', group: 'g1'); appStore.update(S, b, {F: '2026-09-09'});
    expect(appStore.undo(ia), isTrue);
    expect(appStore.byId(S, a)![F], '2026-09-01'); expect(appStore.byId(S, b)![F], '2026-09-02');
    expect(appStore.log.where((e) => e['group'] == 'g1' && e['undone'] != '1'), isEmpty);
  });
  test('ב׳-פח/פט · טלפון מהאדם המוכר · «כמו בפעם הקודמת» = הסכום של התיק האחרון (אותו אדם כשיש)', () {
    final ms = kBalaganModules.where((x) => x.personFields.isNotEmpty && x.phoneFields.isNotEmpty && x.numFields.any((f) => !x.percentFields.contains(f))).toList();
    expect(ms, isNotEmpty);
    final m = ms.first; final nf = m.numFields.firstWhere((f) => !m.percentFields.contains(f));
    expect(balaganPhoneOf('אבי כהן'), ''); expect(balaganLastAmount(m, 'אבי כהן'), '');
    appStore.add(m.rootSlug, {m.personFields.first: 'אבי כהן', m.phoneFields.first: '052-1234567', nf: '1,500'});
    appStore.add(m.rootSlug, {m.personFields.first: 'אבי כהן', nf: '2,000'});
    appStore.add(m.rootSlug, {m.personFields.first: 'דנה לוי', nf: '300'});
    expect(balaganPhoneOf('אבי כהן'), '052-1234567'); expect(balaganPhoneOf('אבי'), '');
    expect(balaganLastAmount(m, 'אבי כהן'), '2,000'); expect(balaganLastAmount(m, 'דנה לוי'), '300'); expect(balaganLastAmount(m, ''), '300');
    expect(balaganLastAmount(m, 'מישהו אחר'), '');
  });
  test('ב׳-צ · «שלח לו את הפתוחים»: שורה לכל תיק פתוח עם האדם, סגור לא נכלל', () {
    final m = kBalaganModules.firstWhere((x) => x.personFields.isNotEmpty && x.stages > 0);
    expect(balaganPersonOpenText('גל רון', today), '');
    appStore.add(m.rootSlug, {m.personFields.first: 'גל רון', if (m.descField.isNotEmpty && m.descField != m.personFields.first) m.descField: 'פתוח'});   // שדה-התיאור יכול להיות שדה-האדם עצמו
    appStore.add(m.rootSlug, {m.personFields.first: 'גל רון', if (m.descField.isNotEmpty && m.descField != m.personFields.first) m.descField: 'סגור', '__stage': (m.stages - 1).toString()});
    final t = balaganPersonOpenText('גל רון', today);
    expect(t.startsWith('גל רון, מה שפתוח אצלנו:'), isTrue); expect(t.split('\\n').length, 2); expect(t.contains(m.title), isTrue);
  });
  test('ב׳-צא · הצעת-התזכורת אומרת רק מה שעוד לפנינו: מועד מחר ⇒ [1, 0], מועד בעוד 10 ימים ⇒ [3, 1, 0]', () {
    expect(${baseTodayCls}.aheadOf(DateTime(2026, 9, 9), true, today), [1, 0]);
    expect(${baseTodayCls}.aheadOf(DateTime(2026, 9, 18), true, today), [3, 1, 0]);
    expect(${baseTodayCls}.aheadOf(DateTime(2026, 9, 8), true, today), [0]);
  });
  test('ב׳-צב · חיפוש-ספרות: «1250» מוצא «1,250» · «052-123» מוצא «0521234567» · טקסט רגיל לא נשבר', () {
    const S = '${baseMod.root.slug}';
    final id = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'ארנונה 1,250 · 0521234567'});
    expect(appStore.search('1250').any((h) => h[1] == id), isTrue); expect(appStore.search('052-123').any((h) => h[1] == id), isTrue);
    expect(appStore.search('ארנונה').any((h) => h[1] == id), isTrue); expect(appStore.search('9999').any((h) => h[1] == id), isFalse);
  });
  test('ב׳-קב · חיפוש-סלחן מדורג: «ארנונא» מוצא «ארנונה» · מדויק לפני מכיל · ספרות דרך המחסן · אין-כלום ⇒ ריק', () {
    const S = '${baseMod.root.slug}';
    final a = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'חשמל לעירייה'});
    final b = appStore.add(S, {${dq(baseMod.root.descField || baseMod.root.fields[0].label)}: 'חשמל'});
    final r = balaganSearchRanked('חשמל'); expect(r.first[1], b); expect(r.any((h) => h[1] == a), isTrue);   // מדויק (100) לפני קידומת (80)
    expect(balaganSearchRanked('חשמא').any((h) => h[1] == b), isTrue);   // שגיאת-כתיב אחת
    expect(balaganSearchRanked('1250').any((h) => h[0] == S), isTrue); expect(balaganSearchRanked('זזזז'), isEmpty); expect(balaganSearchRanked('ח'), isEmpty);
  });
  test('ב׳-צג · grouped: «סיים» על שני תיקים-באיחור בתוך grouped ⇒ החזר אחד מחזיר את שניהם', () {
    const S = '${baseMod.root.slug}'; const F = ${dq(baseMod.root.fields.find((f) => f.type === 'date').label)};
    final a = appStore.add(S, {F: '2026-09-01'}); final b = appStore.add(S, {F: '2026-09-02'});
    final its = ${baseTodayCls}.items(today, dayDelta: 0).where((x) => x.rid == a || x.rid == b).toList(); expect(its.length, 2);
    appStore.grouped(() { for (final it in its) { it.act(it.actions.indexOf('סיים')); } });
    expect(${baseTodayCls}.items(today, dayDelta: 0).any((x) => x.rid == a || x.rid == b), isFalse);
    final g = appStore.log.first['group'] ?? ''; expect(g, isNotEmpty); expect(appStore.log.where((e) => e['group'] == g).length, 2);
    expect(appStore.undo(appStore.log.first['id']!), isTrue);
    expect(${baseTodayCls}.items(today, dayDelta: 0).where((x) => x.rid == a || x.rid == b).length, 2);
    appStore.logAction('auto', 'בודד'); expect(appStore.log.first['group'], isNull);   // מחוץ ל-grouped אין group
  });
  test('ב׳-צה/צז · שורה-מהירה: ספרות = חיפוש · «איפה X»/«חפש X»/«מה עם X» = חיפוש X · רגע רגיל = לא', () {
    expect(balaganSearchQuery('1250'), '1250'); expect(balaganSearchQuery('052-123'), '052-123'); expect(balaganSearchQuery('7'), '');
    expect(balaganSearchQuery('איפה הפיקדון של רות'), 'הפיקדון של רות'); expect(balaganSearchQuery('חפש ארנונה'), 'ארנונה'); expect(balaganSearchQuery('מה עם הגנן'), 'הגנן');
    expect(balaganSearchQuery('שילמתי ארנונה 1,250'), ''); expect(balaganSearchQuery('איפה'), ''); expect(balaganSearchQuery('איפהשהו בעיר'), '');
  });
  test('ב׳-צח · התוכנית מתחילה מעכשיו: 15:03 ⇒ 15:05 · 07:00 ⇒ 09:00 · יום אחר ⇒ 09:00', () {
    expect(balaganPlanStart(today, 9, DateTime(2026, 9, 8, 15, 3)), DateTime(2026, 9, 8, 15, 5));
    expect(balaganPlanStart(today, 9, DateTime(2026, 9, 8, 7, 0)), DateTime(2026, 9, 8, 9, 0));
    expect(balaganPlanStart(today, 9, DateTime(2026, 9, 9, 15, 3)), DateTime(2026, 9, 8, 9, 0));
    expect(balaganPlanStart(today, 9, DateTime(2026, 9, 8, 9, 0)), DateTime(2026, 9, 8, 9, 0));
  });
  test('ב׳-צט · לשון-עבר: «שילמתי ארנונה» כן · «לשלם ארנונה» לא · «אתמול קיבלתי מכתב» כן · «רותי: …» לא · תיק-פתוח-תואם ⇒ «סיימת אותו?» ⇒ סגירה עם החזר', () {
    expect(balaganIsPast('שילמתי ארנונה'), isTrue); expect(balaganIsPast('לשלם ארנונה'), isFalse); expect(balaganIsPast('אתמול קיבלתי מכתב מהעירייה'), isTrue);
    expect(balaganIsPast('רותי: תור לרופא'), isFalse); expect(balaganIsPast('בית ספר מחר'), isFalse); expect(balaganIsPast(''), isFalse);
    final m = kBalaganModules.firstWhere((x) => x.stages > 0 && x.descField.isNotEmpty && x.dateFields.isNotEmpty && (x.personFields.isEmpty || x.descField != x.personFields.first));
    final S = m.rootSlug; final D = m.descField; final F = m.dateFields.first;
    final id = appStore.add(S, {D: 'להחזיר מקדחה לשכן', F: '2026-09-01', '__stage': '0'});   // מילה ייחודית — בדיקות קודמות זרעו «ארנונה» באותו מודול
    final closed = appStore.add(S, {D: 'להחזיר מקדחה ישנה', F: '2026-08-01', '__stage': (m.stages - 1).toString()});
    final hits = balaganPastMatches(m, 'החזרתי מקדחה'); expect(hits.map((r) => r['__id']).toList(), [id]); expect(hits.any((r) => r['__id'] == closed), isFalse);
    expect(balaganPastMatches(m, 'שילמתי לגנן'), isEmpty); expect(balaganPastMatches(m, 'לשלם ארנונה'), isEmpty);
    balaganCloseFile(m, id);
    expect(appStore.stageOf(S, id), m.stages - 1); expect(appStore.decision('ign:' + id + ':' + appStore.log.first['field']!), 'no'); expect(appStore.log.first['kind'], 'done');
    expect(appStore.undo(appStore.log.first['id']!), isTrue); expect(appStore.stageOf(S, id), 0); expect(appStore.decision('ign:' + id + ':' + appStore.log.first['field']!), '');
  });
}
`;
    if (fs.existsSync(path.join(bsTest, '..', 'pubspec.yaml'))) fs.writeFileSync(path.join(bsTest, 'genesis_gen_balagan_facts_test.dart'), code);
  }

  // ── 2 · «היום» המאוחד ──
  {
    const slug = 'balagan_home'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «היום» של בלגן: מיזוג ספקי-ה-Today של ${mods.length} מודולים — באיחור ראשון · היום · הרשומות הפתוחות (3 למעלה, השאר מקופל) · ממתין-לאישורך · עשיתי-לבד · מחר. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_mail.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_behaviors.dart';
import 'gen_balagan_confirm.dart';
import 'gen_balagan_moments.dart';
import 'gen_balagan_topics.dart';
${mods.map((m) => `import 'gen_${m.home.slug}.dart';`).join('\n')}
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/services.dart';
import '../dart-ui-bs/ds/ds_voice.dart';
import 'package:url_launcher/url_launcher.dart';

typedef _Items = List<DsTodayItem> Function(DateTime today, {required int dayDelta});
typedef _Props = List<Widget> Function(BuildContext context, DateTime today);
typedef _Card = Widget Function(BuildContext context, Map<String, String> r);
typedef _Props2 = List<Widget> Function(BuildContext context, DateTime today, {bool chain, bool rem});
typedef _Undated = List<DsTodayItem> Function(DateTime today);
class _Mod { const _Mod(this.name, this.open, this.items, this.proposals, this.card, this.autopilot, this.done, this.undated, this.stale, this.remPending, this.index); final String name; final List<Map<String, String>> Function() open; final _Items items; final _Props2 proposals; final _Card card; final void Function() autopilot; final List<Map<String, String>> Function() done; final _Undated undated; final _Undated stale; final _Undated remPending; final int index; }

/// ב׳-מא · תאריך כמו שאומרים אותו (היום · מחר · אתמול · יום שלישי 8.9 · 15.9 · 3.10.2027) — ל«היום», לשיתוף ולכרטיס-האדם
String _isoD(DateTime d) => d.toIso8601String().substring(0, 10);
String _isoT(DateTime d) => d.toIso8601String().substring(0, 19);
int _wd(DateTime d) => bhWeekday(_isoD(d));
DateTime _dayPlus(DateTime d, int n) => bhDate(bhPlusDays(_isoD(d), n));   // G34ב · שכבת-ההרכבה
String balaganDayLabel(DateTime d, DateTime today) { final p = bhDayLabelParts(_isoD(d), _isoD(today)); switch (p[0]) { case 'today': return ${k(L.homeToday)}; case 'tomorrow': return ${k(L.homeTomorrow)}; case 'yesterday': return ${k(L.dayYesterday)}; case 'weekday': return ${k(L.dayPrefix)}.replaceAll('{day}', ${k(L.dayNames)}.split(',')[int.parse(p[1])]) + ' ' + p[2]; default: return p[2]; } }   // G34ב · שכבת-ההרכבה מחזירה חלקים; כאן רק מונחים
/// ב׳-מב · «3 ימים לפני · יום לפני · ביום» — תיאור-ההיסטים כמו שאומרים (ל«בלגן» ולכרטיס-המרוכז)
/// ב׳-צה · שורה של ספרות («1250» · «052-123») = חיפוש, לא רגע · ב׳-צז · «איפה X» / «חפש X» / «מה עם X» = חיפוש X (מילות-החיפוש מהכרום — דקדוק-ממשק, לא מילון-דומיין)
String balaganSearchQuery(String s) { if (bhDigitsQuery(s).isNotEmpty) return s.trim(); return bhPrefixRest(s, ${k(L.searchWords)}.split('|')); }   // G34ב · ב׳-צה/צז
/// ב׳-צח · תחילת-התוכנית: תחילת-היום (הגדרה) — ואם היום כבר התקדם, מעכשיו מעוגל-מעלה ל-5 דק׳ (תוכנית שמתחילה בשעה שעברה אינה תוכנית)
DateTime balaganPlanStart(DateTime today, int startHour, DateTime now) { final hm = bhPlanStart(_isoD(today), startHour, _isoT(now)); return DateTime(today.year, today.month, today.day, int.parse(hm.substring(0, 2)), int.parse(hm.substring(3, 5))); }   // G34ב · ב׳-צח
String balaganOffsetsLabel(String offsets) => [for (final x in offsets.split(',')) int.tryParse(x.trim()) ?? 0].map((o) => o == 0 ? ${k(L.offDay)} : o == 1 ? ${k(L.offOne)} : ${k(L.offN)}.replaceAll('{n}', o.toString())).join(' · ');
/// ב׳-מח · מתי זה קרה, כמו שאומרים: עכשיו · לפני 5 דק׳ · לפני שעה · לפני 3 שעות · אתמול · יום שני 7.9
String balaganAgo(DateTime at, DateTime now) { final p = bhAgoParts(_isoT(at), _isoT(now)); switch (p[0]) { case 'now': return ${k(L.agoNow)}; case 'min': return ${k(L.agoMin)}.replaceAll('{n}', p[1]); case 'hour': return ${k(L.agoHour)}; case 'hours': return ${k(L.agoHours)}.replaceAll('{n}', p[1]); default: return balaganDayLabel(at, now); } }   // G34ב · ב׳-מח
/// «שתף את היום»: טקסט קריא של באיחור/היום (עם שעות) — נגזרת של אותן שורות; ללוח + wa.me (הנמען נבחר בוואטסאפ)
String balaganDayText(List<DsTodayItem> overdue, List<DsTodayItem> todayItems, DateTime today, {double money = 0, List<DsTodayItem> tomorrow = const [], int undated = 0, int stale = 0, double month = 0, List<String> done = const []}) {
  final b = StringBuffer(${k(L.shareDayTitle)} + ' · ' + ${k(L.dayNames)}.split(',')[_wd(today)] + ' ' + bhDayMonth(_isoD(today), false) + (bhHebDate(_isoD(today)).isEmpty ? '' : ' · ' + bhHebDate(_isoD(today))) + '\\n');   // ב׳-מא · תאריך כמו שאומרים · ב׳-קד · והעברי
  if (overdue.isNotEmpty) { b.write(${k(L.shareDayOverdue)} + ':\\n'); for (final it in overdue) { b.write('• ' + it.title + ' (' + it.module + ')\\n'); } }
  if (todayItems.isNotEmpty) { b.write(${k(L.shareDayToday)} + ':\\n'); for (final it in todayItems) { b.write('• ' + (it.time.isNotEmpty ? it.time + ' ' : '') + it.title + ' (' + it.module + ')\\n'); } }
  if (money > 0) b.write(${k(L.shareDayMoney)}.replaceAll('{n}', balaganFmtMoney(money)) + '\\n');   // ב׳-כט · כסף-במבט גם בשיתוף
  if (tomorrow.isNotEmpty) { b.write(${k(L.homeTomorrow)} + ':\\n'); for (final it in tomorrow) { b.write('• ' + (it.time.isNotEmpty ? it.time + ' ' : '') + it.title + ' (' + it.module + ')\\n'); } }   // ב׳-מא · בערב משתפים גם את מחר
  if (month > 0) b.write(${k(L.shareDayMonth)}.replaceAll('{n}', balaganFmtMoney(month)) + '\\n');   // ב׳-קיג · G37 · כמה יוצא החודש
  if (done.isNotEmpty) { b.write(${k(L.shareDone)} + ':\\n'); for (final t in done) { b.write('• ' + t + '\\n'); } }   // ב׳-קכד · G40 · מה סיימת היום, מהיומן
  if (undated + stale > 0) b.write(${k(L.shareDayFooter)}.replaceAll('{n}', undated.toString()).replaceAll('{m}', stale.toString()) + '\\n');   // ב׳-סג · מה שלא על השולחן, בשורה אחת
  return b.toString().trim();
}

/// ב׳-כט · כסף-במבט: סכום שדה-הסכום הראשי (הראשון שאינו אחוז) של התיקים שבשורות — כל תיק פעם אחת. נגזרת של הרשומות, אפס-שדה-חדש, אפס-ניחוש: אין סכום ⇒ 0
double balaganMoney(List<DsTodayItem> items) { var total = 0.0; final seen = <String>{}; for (final m in kBalaganModules) { final fs = m.numFields.where((f) => !m.percentFields.contains(f)); if (fs.isEmpty) continue; final recs = <Map<String, String>>[for (final it in items) if (it.module == m.title && it.rid.isNotEmpty && seen.add(m.title + '|' + it.rid)) for (final r in [appStore.byId(m.rootSlug, it.rid)]) if (r != null) r]; for (final r in recs) { total += bhMoney(r[fs.first]); } } return total; }   // כסף-במבט: סכום שדה-הכסף-הראשי של תיקי-השורות (כל תיק פעם אחת)
String balaganFmtMoney(double v) => bhThousands(v);   // G34ב
/// ב׳-קי · «החודש»: תיקים פתוחים שמועדם (שדה-התאריך הראשון) בחודש של היום (bhSameMonth) ⇒ [מונה, ₪ מצטבר של שדה-הכסף-הראשי]
List<num> balaganMonthSummary(DateTime today) { var n = 0; var money = 0.0; final t = _isoD(today); for (final m in kBalaganModules) { if (m.dateFields.isEmpty) continue; final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; final d = (r[m.dateFields.first] ?? '').trim(); if (!bhSameMonth(d, t)) continue; n++; if (fs.isNotEmpty) money += bhMoney(r[fs.first]); } } return [n, money]; }
/// ב׳-קיד · «החודש לפי נושא»: אותם תיקי-החודש, מקובצים לפי נושא-המודול (bhSumBy) ⇒ [[נושא, n, ₪]…] לפי ₪ יורד
List<List<Object>> balaganMonthByTopic(DateTime today) { final rows = <Map<String, String>>[]; final t = _isoD(today); for (final m in kBalaganModules) { if (m.dateFields.isEmpty) continue; final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; if (!bhSameMonth((r[m.dateFields.first] ?? '').trim(), t)) continue; rows.add({'t': m.topic.isEmpty ? m.title : m.topic, 'n': fs.isEmpty ? '' : (r[fs.first] ?? '')}); } } final out = bhSumBy(rows, 't', 'n'); out.sort((a, b) => (b[2] as double).compareTo(a[2] as double)); return out; }
/// ב׳-קטו · «בדרך-כלל נסגר תוך n ימים»: חציון (bhMedianInt) של ימים מיצירת-התיק (__at) עד ה-'done' ביומן, לתיקים שנסגרו במודול; פחות מ-2 ⇒ 0
int balaganTypicalDays(BalaganModule m) { final days = <int>[]; for (final e in appStore.log) { if (e['kind'] != 'done' || e['undone'] == '1' || e['entity'] != m.rootSlug) continue; final r = appStore.byId(m.rootSlug, e['rid'] ?? ''); if (r == null) continue; final c = (r['__at'] ?? ''), d = (e['at'] ?? ''); if (c.length < 10 || d.length < 10) continue; days.add(bhDaysSince(c.substring(0, 10), d.substring(0, 10))); } return days.length < 2 ? 0 : bhMedianInt(days); }
/// ב׳-קיז · «נסגר אחרי n ימים» לשורת-'done' ביומן (מיצירת-התיק); לא-ידוע ⇒ -1
int balaganClosedAfter(Map<String, String> e) { final r = appStore.byId(e['entity'] ?? '', e['rid'] ?? ''); if (r == null) return -1; final c = r['__at'] ?? '', d = e['at'] ?? ''; if (c.length < 10 || d.length < 10) return -1; return bhDaysSince(c.substring(0, 10), d.substring(0, 10)); }
String balaganWeekName(int delta) => delta == 0 ? ${k(L.weekThis)} : delta > 0 ? ${k(L.weekNext)} : ${k(L.weekPrev)};
/// ב׳-קכג · תיקים ששדה-הכסף-הראשי שלהם מעל/מתחת לערך ⇒ [[entity, rid, סכום]…] לפי סכום יורד
List<List<String>> balaganAmountItems(String op, String value) { final v = double.tryParse(value) ?? 0; final out = <List<dynamic>>[]; for (final m in kBalaganModules) { final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); if (fs.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final raw = (r[fs.first] ?? '').trim(); if (raw.isEmpty) continue; final a = bhMoney(raw); if (op == '>' ? a > v : a < v) out.add([m.rootSlug, r[AppStore.idKey] ?? '', a]); } } out.sort((x, y) => (y[2] as double).compareTo(x[2] as double)); return [for (final o in out) [o[0] as String, o[1] as String, balaganFmtMoney(o[2] as double)]]; }
/// ב׳-קכה · כמה פעמים נדחה כל תיק («דחה למחר»/«דחה לשבוע» = 'auto' עם קידומת-הדחייה ביומן) ⇒ {rid: n} (bhGroupRows ⇒ count.by)
Map<String, int> balaganSnoozeCounts() { final rows = <Map<String, String>>[for (final e in appStore.log) if (e['kind'] == 'auto' && e['undone'] != '1' && (e['rid'] ?? '').isNotEmpty && ((e['what'] ?? '').startsWith(${k(L.actSnooze)}) || (e['what'] ?? '').startsWith(${k(L.actSnoozeWeek)}))) {'rid': e['rid']!}]; return {for (final g in bhGroupRows(rows, 'rid')) g[0] as String: g[1] as int}; }
/// ב׳-קמ · ₪ של שורה אחת (שדה-הכסף-הראשי של התיק, bhMoney); אין ⇒ 0
double balaganItemMoney(DsTodayItem it) { final ms = kBalaganModules.where((m) => m.title == it.module); if (ms.isEmpty || it.rid.isEmpty) return 0; final fs = ms.first.numFields.where((f) => !ms.first.percentFields.contains(f)).toList(); if (fs.isEmpty) return 0; final r = appStore.byId(ms.first.rootSlug, it.rid); return r == null ? 0 : bhMoney(r[fs.first]); }
/// ב׳-קכט · «פתוח»: כל התיקים הפתוחים עם שדה-כסף ⇒ [מונה, ₪] (bhMoney)
List<num> balaganOpenSummary() { var n = 0; var money = 0.0; for (final m in kBalaganModules) { final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); if (fs.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; final v = bhMoney(r[fs.first]); if (v <= 0) continue; n++; money += v; } } return [n, money]; }
/// ב׳-קכו · ₪ של פריטי-טווח/חודש ([iso, entity, rid, כותרת]) — שדה-הכסף-הראשי של כל תיק פעם אחת (bhMoney)
double balaganItemsMoney(List<List<String>> items) { var total = 0.0; final seen = <String>{}; for (final it in items) { if (!seen.add(it[1] + '|' + it[2])) continue; final ms = kBalaganModules.where((m) => m.rootSlug == it[1]); if (ms.isEmpty) continue; final fs = ms.first.numFields.where((f) => !ms.first.percentFields.contains(f)).toList(); if (fs.isEmpty) continue; final r = appStore.byId(it[1], it[2]); if (r != null) total += bhMoney(r[fs.first]); } return total; }
/// ב׳-קיב · שלחת ואין תשובה: רשומות-'send' ביומן שאין אחריהן פעולה על אותו תיק, ≥ minDays ימים, לא-הותעלמו ⇒ [[entity, rid, ימים, logId]…] (חדש ראשון)
List<List<String>> balaganSilentSends(DateTime today, {int minDays = 3}) { final out = <List<String>>[]; final seen = <String>{}; final log = appStore.log; for (var i = 0; i < log.length; i++) { final e = log[i]; if (e['kind'] != 'send' || e['undone'] == '1') continue; final ent = e['entity'] ?? '', rid = e['rid'] ?? ''; if (ent.isEmpty || rid.isEmpty || !seen.add(ent + '|' + rid)) continue; if (appStore.byId(ent, rid) == null) continue; String? later; for (var j = 0; j < i; j++) { final x = log[j]; if (x['rid'] == rid && x['undone'] != '1' && x['kind'] != 'send') { later = x['at']; break; } } final days = bhSilentDays(e['at'] ?? '', later, _isoD(today)); if (days < minDays) continue; if (appStore.decision('silent:' + rid + ':' + (e['at'] ?? '')).isNotEmpty) continue; out.add([ent, rid, days.toString(), e['id'] ?? '', e['at'] ?? '']); } return out; }
/// ב׳-לו · גיבוי: הכל במכשיר בלבד (חוק-6) ⇒ גיל-הגיבוי בימים (−1 = מעולם) ומתי מזכירים (≥10 תיקים · מעולם או ≥30 יום). היום מוזרק
int balaganBackupAge(String backupAt, DateTime today) => backupAt.length < 10 ? -1 : bhDaysSince(backupAt.substring(0, 10), _isoD(today));   // G34ב · ב׳-לו
bool balaganBackupDue(int records, int age) => records >= 10 && (age < 0 || age >= 30);

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  static const _mods = <_Mod>[
${mods.map((m, i) => `    _Mod(${todayCls(m)}.module, ${todayCls(m)}.open, ${todayCls(m)}.items, ${todayCls(m)}.proposals, ${todayCls(m)}.card, ${todayCls(m)}.autopilot, ${todayCls(m)}.done, ${todayCls(m)}.undated, ${todayCls(m)}.stale, ${todayCls(m)}.remPending, ${i}),`).join('\n')}
  ];
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);
  /// ב׳-פז · כל הבאיחור ⇒ מחר (לא בשבת), שורת-יומן לכל תיק עם group אחד ⇒ «החזר» אחד מחזיר את כולם
  void _snoozeAll(List<DsTodayItem> overdue, DateTime today) {
    final g = 'g' + DateTime.now().microsecondsSinceEpoch.toString(); var d = _dayPlus(today, 1); if (_wd(d) == 6) d = _dayPlus(d, 1);
    for (final it in overdue) { final ms = kBalaganModules.where((mm) => mm.title == it.module); if (ms.isEmpty || it.field.isEmpty || bhDaysSince(_isoD(it.due), _isoD(today)) < 0) continue;   /* ב׳-קה · מועד שעוד לפנינו לא זז */ final slug = ms.first.rootSlug; final r = appStore.byId(slug, it.rid); if (r == null) continue; appStore.logAction('auto', ${k(L.actSnooze)} + ' · ' + it.title, entity: slug, rid: it.rid, field: it.field, prev: r[it.field] ?? '', group: g); appStore.update(slug, it.rid, {it.field: _iso(d)}); }
  }
  void _openItem(BuildContext context, DsTodayItem it) { final ms = kBalaganModules.where((m) => m.title == it.module); if (ms.isEmpty || it.rid.isEmpty) return; Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(ms.first.rootSlug, it.rid))); }   // ב׳-לט · הקשה על השורה ⇒ התיק

  Future<void> _digest(String lead, int hardToday) async {
    if (kIsWeb) return;
    final now = DateTime.now(); final hour = int.tryParse(appStore.setting('digestHour', '8')) ?? 8; final key = _iso(_day(now));
    if (now.hour < hour || appStore.setting('digestShown') == key) return;
    try {
      final n = FlutterLocalNotificationsPlugin();
      await n.initialize(const InitializationSettings(android: AndroidInitializationSettings('@mipmap/ic_launcher'), iOS: DarwinInitializationSettings()));
      await n.show(1, ${k(L.digestTitle)}, lead, const NotificationDetails(android: AndroidNotificationDetails('balagan_digest', 'digest')));
      if (hardToday > 0) await n.show(2, ${k(L.homeToday)}, '\$hardToday', const NotificationDetails(android: AndroidNotificationDetails('balagan_hard', 'hard')));
      appStore.setSetting('digestShown', key);
    } catch (_) {}
  }
  void _autopilotAll() { for (final m in _mods) { m.autopilot(); } }
  // «הגיע» — שקע-המייל (טוקן-הלקוח, חוק-6): פעם בפתיחה; כל מכתב שטרם הוכרע ⇒ זיהוי-הרגע ⇒ הצעה. בלי טוקן ⇒ כלום. כשל ⇒ שורה אחת כנה.
  List<DsMailItem> _mail = const []; bool _mailTried = false; String _mailNote = '';
  Future<void> _fetchMail() async {
    if (_mailTried) return; _mailTried = true;
    final tok = appStore.setting('mail.token'); if (tok.isEmpty) return;
    final r = await dsMailRecent(token: tok, query: appStore.setting('mail.query', 'newer_than:7d'));
    if (!mounted) return;
    setState(() { if (r == null) { _mailNote = ${k(L.mailFail)}; } else { _mail = r; } });
  }
  // התוכנית להיום (Motion/Reclaim בגרסת-בלגן): הדברים של היום מסודרים לבלוקים מתחילת-היום (עריך) — דחוף/קשיח ראשון, בלוק-מיקוד שמור אם יש ≤4 דברים. דטרמיניסטי; «ליומן» לכל בלוק.
  Future<void> _shareDay(List<DsTodayItem> overdue, List<DsTodayItem> todayItems, int planN, [List<DsTodayItem> tomorrow = const [], int undated = 0, int stale = 0]) async {
    final t = balaganDayText(overdue, todayItems, _day(DateTime.now()), money: balaganMoney([...overdue, ...todayItems]), tomorrow: tomorrow, undated: undated, stale: stale, month: balaganMonthSummary(_day(DateTime.now()))[1].toDouble(), done: [for (final e in appStore.log) if (e['kind'] == 'done' && e['undone'] != '1' && bhDaysSince((e['at'] ?? '').length >= 10 ? e['at']!.substring(0, 10) : '1970-01-01', _isoD(_day(DateTime.now()))) == 0) e['what'] ?? '']);
    await Clipboard.setData(ClipboardData(text: t)); setState(() => _mailNote = ${k(L.shareDayCopied)});
    launchUrl(Uri.parse('https://wa.me/?text=' + Uri.encodeComponent(t)), mode: LaunchMode.externalApplication);
  }
  List<Widget> _plan(BuildContext context, DateTime today, List<DsTodayItem> overdue, List<DsTodayItem> todayItems) {
    final start = (int.tryParse(appStore.setting('dayStart', '9')) ?? 9).clamp(0, 23); final block = (int.tryParse(appStore.setting('blockMin', '30')) ?? 30).clamp(5, 240);
    final items = [...overdue.where((x) => x.hard), ...overdue.where((x) => !x.hard), ...todayItems.where((x) => x.hard), ...todayItems.where((x) => !x.hard)];
    if (items.isEmpty) return const [];
    final out = <Widget>[]; var t = balaganPlanStart(today, start, DateTime.now()); final planFrom = t;   /* ב׳-צח · מעכשיו, לא מתחילת-היום שכבר עברה */
    String hm(DateTime d) => '\${d.hour.toString().padLeft(2, '0')}:\${d.minute.toString().padLeft(2, '0')}';
    // רגע עם שעה קבועה (16:30) = בלוק מקובע; השאר ממלאים סביבו — לא דורסים אותו
    final fixed = <List<dynamic>>[]; for (final it in items) { if (it.time.isEmpty) continue; final hh = int.tryParse(it.time.substring(0, 2)) ?? 0, mm = int.tryParse(it.time.substring(3, 5)) ?? 0; final a = DateTime(today.year, today.month, today.day, hh, mm); fixed.add([a, a.add(Duration(minutes: block)), it]); }
    fixed.sort((x, y) => (x[0] as DateTime).compareTo(y[0] as DateTime));
    DateTime free(DateTime from) { var x = from; var moved = true; while (moved) { moved = false; for (final f in fixed) { final a = f[0] as DateTime, e = f[1] as DateTime; if (x.isBefore(e) && x.add(Duration(minutes: block)).isAfter(a)) { x = e; moved = true; } } } return x; }
    final rows = <List<dynamic>>[for (final f in fixed) [f[0], f[1], f[2]]];
    String cal(DateTime a, DateTime b, String title) { String z(DateTime d) => d.toIso8601String().substring(0, 16).replaceAll(RegExp(r'[-:]'), ''); return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + Uri.encodeComponent(title) + '&dates=' + z(a) + '00/' + z(b) + '00'; }
    var i = 0;
    for (final it in items.where((x) => x.time.isEmpty)) {
      if (i == 2 && items.length <= 4) { final a0 = free(t); final e = a0.add(const Duration(minutes: 60)); rows.add([a0, e, null]); t = e; }
      final a = free(t); final e = a.add(Duration(minutes: block));
      rows.add([a, e, it]); t = e; i++;
    }
    rows.sort((x, y) => (x[0] as DateTime).compareTo(y[0] as DateTime));
    final dayEnd = (int.tryParse(appStore.setting('dayEnd', '18')) ?? 18).clamp(1, 24); final fw = bhFreeWindows([for (final r in rows) [hm(r[0] as DateTime), hm(r[1] as DateTime)]], hm(planFrom), (dayEnd == 24 ? '23:59' : dayEnd.toString().padLeft(2, '0') + ':00'), 30);
    if (fw.isNotEmpty) out.add(DsNote(message: ${k(L.freeWindows)}.replaceAll('{w}', [for (final w in fw) w[0] + '–' + w[1]].join(' · ')), label: '', tone: 0));   // ב׳-קח · G36 · חלונות-פנויים ≥30 דק׳ בין הבלוקים עד סוף-היום
    for (final r in rows) {
      final a = r[0] as DateTime, e = r[1] as DateTime; final it = r[2] as DsTodayItem?;
      final title = it == null ? ${k(L.planFocus)} : it.title;
      out.add(DsActionRow(title: ${k(L.planBlock)}.replaceAll('{time}', hm(a)).replaceAll('{title}', title), sub: it == null ? '' : it.module, onOpen: it == null ? null : () => _openItem(context, it), actions: it == null ? [${k(L.planCal)}] : [${k(L.actDone)}, ${k(L.planCal)}], onAct: (i) { if (it != null && i == 0) { it.act(0); return; } launchUrl(Uri.parse(cal(a, e, title)), mode: LaunchMode.externalApplication); }));   /* ב׳-עג · «סיים» גם מהתוכנית */
    }
    return out;
  }
  List<Widget> _inbox(BuildContext context) {
    final out = <Widget>[];
    for (final m in _mail) {
      if (appStore.decision('mail:\${m.id}').isNotEmpty) continue;
      final hits = balaganIdentify(m.subject + ' ' + m.snippet, k: 1); if (hits.isEmpty) continue;
      final mod = hits.first.module;
      out.add(DsApproveCard(question: ${k(L.inboxAsk)}.replaceAll('{subject}', m.subject).replaceAll('{module}', mod.title), source: ${k(L.inboxFrom)}.replaceAll('{from}', m.from).replaceAll('{date}', m.date), okLabel: ${k(L.askOpen)}, noLabel: ${k(L.actNo)},
        onOk: () { appStore.decide('mail:\${m.id}', 'ok'); final facts = balaganFacts(m.subject + ' · ' + m.snippet, mod); Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: mod, facts: facts))); },
        onNo: () => appStore.decide('mail:\${m.id}', 'no')));
    }
    return out;
  }
  // שרשרת חוצת-מודולים: רשומה שנסגרה ⇒ הצעד-הבא (שם מהפירוק) מזוהה כמודול ⇒ «להתחיל עכשיו?» ⇒ טופס-האישור של המודול השני (הזיכרון ממלא)
  final _standing = <String>{};
  List<Widget> _chain(BuildContext context) {
    final out = <Widget>[];
    // תיק שעומד: פתוח ≥7 ימים מאז יצירתו, בלי שום פעולה ביומן ⇒ «לסגור?» (סגירה = השלב-האחרון; דחייה = הכרעה נזכרת)
    final today = DateTime.now(); _standing.clear();   // ב׳-ל · מי שכבר שואלים עליו «לסגור?» לא חוזר גם ב«נשכחים» (שאלה אחת לתיק)
    for (final m in _mods) {
      final bm = kBalaganModules[m.index]; if (bm.stages == 0) continue;
      for (final r in m.open()) {
        final rid = r[AppStore.idKey] ?? ''; final at = DateTime.tryParse(r['__at'] ?? ''); if (at == null) continue;
        final days = bhDaysSince(_isoD(at), _isoD(today)); if (days < 7 || appStore.decision('stale:\$rid').isNotEmpty) continue;
        if (appStore.log.any((e) => e['rid'] == rid && e['undone'] != '1' && e['kind'] != 'add')) continue;
        final who = bm.title + ' · ' + appStore.displayOf(bm.rootSlug, rid); _standing.add(rid);
        out.add(DsApproveCard(question: ${k(L.staleAsk)}.replaceAll('{who}', who).replaceAll('{n}', days.toString()), source: who, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)},
          onOk: () { final prev = appStore.stageOf(bm.rootSlug, rid).toString(); appStore.update(bm.rootSlug, rid, {AppStore.stageKey: (bm.stages - 1).toString()}); appStore.decide('stale:\$rid', 'ok'); appStore.logAction('auto', ${k(L.staleDid)}.replaceAll('{who}', who).replaceAll('{n}', days.toString()), entity: bm.rootSlug, rid: rid, field: AppStore.stageKey, prev: prev); },
          onNo: () => appStore.decide('stale:\$rid', 'no')));
      }
    }
    for (final m in _mods) {
      final bm = kBalaganModules[m.index]; if (bm.chain.isEmpty) continue;
      for (final r in m.done()) {
        final rid = r[AppStore.idKey] ?? '';
        final hits = balaganIdentify(bm.chain.first, k: 1); if (hits.isEmpty || hits.first.module.index == m.index) continue;
        final to = hits.first.module;
        out.add(DsApproveCard(question: ${k(L.chainAsk)}.replaceAll('{from}', bm.title).replaceAll('{to}', to.title), source: bm.title + ' · ' + appStore.displayOf(bm.rootSlug, rid), okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)},
          onOk: () { appStore.decide('next:\$rid', 'ok'); appStore.logAction('next', ${k(L.chainDid)}.replaceAll('{to}', to.title).replaceAll('{from}', bm.title), entity: bm.rootSlug, rid: rid, field: 'next:\$rid'); Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: to, facts: const {}))); },
          onNo: () => appStore.decide('next:\$rid', 'no')));
      }
    }
    return out;
  }
  @override
  void initState() { super.initState(); WidgetsBinding.instance.addPostFrameCallback((_) { _autopilotAll(); _fetchMail(); }); appStore.addListener(_onStore); }
  void _onStore() { WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _autopilotAll(); }); }
  @override
  void dispose() { appStore.removeListener(_onStore); super.dispose(); }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final today = _day(DateTime.now());
    final all0 = <DsTodayItem>[for (final m in _mods) ...m.items(today, dayDelta: 0)]..sort((a, b) => a.due.compareTo(b.due));
    final overdue = all0.where((x) => x.overdue).toList()..sort((a, b) { final h = (b.hard ? 1 : 0).compareTo(a.hard ? 1 : 0); if (h != 0) return h; final mo = balaganItemMoney(b).compareTo(balaganItemMoney(a)); if (mo != 0) return mo; return a.due.compareTo(b.due); });   /* ב׳-קמ · G44 · באיחור: קשיח ⇒ ₪ גבוה ⇒ הישן */
    final todayItems = all0.where((x) => !x.overdue).toList()..sort((a, b) { final ta = a.time.isEmpty ? '99:99' : a.time, tb = b.time.isEmpty ? '99:99' : b.time; final c = ta.compareTo(tb); return c != 0 ? c : a.due.compareTo(b.due); });   // עם-שעה לפי השעה, בלי-שעה אחריהם
    final tomorrow = <DsTodayItem>[for (final m in _mods) ...m.items(today, dayDelta: 1)]..sort((a, b) { final ta = a.time.isEmpty ? '99:99' : a.time, tb = b.time.isEmpty ? '99:99' : b.time; final c = ta.compareTo(tb); return c != 0 ? c : a.due.compareTo(b.due); });   /* ב׳-עט · מחר לפי שעה, כמו היום */
    final soon = <List<dynamic>>[for (var d = 2; d <= 7; d++) for (final m in _mods) for (final it in m.items(today, dayDelta: d)) [d, it]];   // השבוע הקרוב: ימים 2–7, לפי יום ⇒ הוא רואה מה בא, לא רק מחר
    // ב׳-לז · תזכורות-מרוכזות: יותר מ-3 מועדים קרובים בלי הכרעה ⇒ כרטיס אחד לכולם (הכרעה אחת · יומן אחד · החזר אחד) במקום n כרטיסים שמציפים את «ממתין» ואת מד-העומס
    final rems = <DsTodayItem>[for (final m in _mods) ...m.remPending(today)]; final groupRem = rems.length >= 2;   /* ב׳-קה · מ-2 מועדים כבר מרכזים */
    final remKeys = [for (final r in rems) 'rem:' + r.rid + ':' + r.field]; final remDays = balaganOffsetsLabel(bhAheadOffsetsUnion([for (final r in rems) _isoD(r.due)], true, _isoD(today), [for (final x in appStore.setting('offsets', '3,1,0').split(',')) int.tryParse(x.trim()) ?? 0]).join(','));   /* ב׳-קה · רק ההיסטים שעוד לפנינו לפחות למועד-אחד */
    void remAll(String v) { for (final k in remKeys) appStore.decide(k, v); appStore.logAction('decide', ${k(L.remManyDid)}.replaceAll('{n}', remKeys.length.toString()), field: remKeys.first, prev: remKeys.skip(1).join(',')); }
    final pending = <Widget>[..._inbox(context), ..._chain(context), if (groupRem) DsApproveCard(question: ${k(L.remAskMany)}.replaceAll('{n}', rems.length.toString()).replaceAll('{days}', remDays), source: ${k(L.remManySrc)}, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)}, alwaysLabel: ${k(L.actAlways)}, onOk: () => remAll('ok'), onNo: () => remAll('no'), onAlways: () { appStore.setSetting('always:rem', '1'); remAll('ok'); }), for (final m in _mods) ...m.proposals(context, today, chain: false, rem: !groupRem)];
    final undated = <DsTodayItem>[for (final m in _mods) ...m.undated(today)];
    final stale = <DsTodayItem>[for (final m in _mods) for (final it in m.stale(today)) if (!_standing.contains(it.rid)) it];   // ב׳-ל · נשכחים: תיק פתוח ש«היום» הפסיק לדבר עליו — לא נעלם; מי שכבר ב«לסגור?» לא מוכפל
    final money = balaganMoney([...overdue, ...todayItems]); final moneyTm = balaganMoney(tomorrow); final moneyWk = balaganMoney([for (final x in soon) x[1] as DsTodayItem]);   // ב׳-כט · כסף-במבט: כמה כסף עומד היום/מחר — מהשורות עצמן   // ב׳-כח · תיקים בלי מועד: לא נעלמים — מקופלים עם «קבע למחר / לשבוע / התעלם»
    // סדר-הכרטיסים = דחיפות: מועד קרוב קודם (מהשורות של היום/מחר/השבוע), ואז החדש-ביותר (__at) — 3 למעלה שמשנים משהו
    final dueOf = <String, DateTime>{}; for (final it in [...all0, ...tomorrow, for (final x in soon) x[1] as DsTodayItem]) { final key = it.module + '|' + it.rid; if (!dueOf.containsKey(key) || it.due.isBefore(dueOf[key]!)) dueOf[key] = it.due; }
    final cardRows = <List<dynamic>>[for (final m in _mods) for (final r in m.open()) [dueOf[m.name + '|' + (r['__id'] ?? '')], r['__at'] ?? '', m.card(context, r), m.name, r['__id'] ?? '']];
    cardRows.sort((a, b) { final da = a[0] as DateTime?, db = b[0] as DateTime?; if (da != null && db != null) { final c = da.compareTo(db); if (c != 0) return c; } else if (da != null) { return -1; } else if (db != null) { return 1; } return (b[1] as String).compareTo(a[1] as String); });
    final cards = <Widget>[for (final x in cardRows) x[2] as Widget];
    final did = appStore.log.where((e) => (e['kind'] == 'decide' || e['kind'] == 'auto' || e['kind'] == 'next' || e['kind'] == 'add' || e['kind'] == 'done' || e['kind'] == 'del' || e['kind'] == 'merge') && e['undone'] != '1').take(5).toList();
    final gCount = {for (final g in bhGroupRows(did, 'group')) g[0] as String: g[1] as int}; final seenG = <String>{}; final didRows = [for (final e in did) if ((e['group'] ?? '').isEmpty || seenG.add(e['group']!)) e];   // ב׳-קה · פעולה-מרוכזת = שורה אחת («3 יחד · דחה למחר…»), החזר-הקבוצה כבר בהחזר-היחיד
    // «השבוע» — שמירת-זמן (§המוצר): נגזרת של היומן מיום-ראשון; הדקות-לפעולה = הגדרה עריכה, לא טענה
    final weekStart = bhDate(bhWeekStart(_isoD(today)));   // G34ב
    final wk = appStore.log.where((e) => e['undone'] != '1' && !(DateTime.tryParse(e['at'] ?? '') ?? DateTime(2000)).isBefore(weekStart)).toList();
    int cnt(String kind) => wk.where((e) => e['kind'] == kind).length;
    int mins(String key, String def) => int.tryParse(appStore.setting(key, def)) ?? int.parse(def);
    final wAdd = cnt('add'), wSend = cnt('send'), wAuto = cnt('auto') + cnt('decide') + cnt('next') + cnt('done');
    final wSaved = wAdd * mins('minAdd', '4') + wSend * mins('minSend', '12') + wAuto * mins('minAuto', '3');
    final n = overdue.length + todayItems.length + pending.length;
    final lead = n == 0 && cards.isEmpty ? ${k(L.homeNone)} : n <= 1 ? ${k(L.homeOne)} : ${k(L.homeMany)}.replaceAll('{n}', n.toString());
    final first = overdue.isNotEmpty ? overdue.first : (todayItems.isNotEmpty ? todayItems.first : null);   // הדבר-האחד (הכרעה-29): הכותרת = מה שדחוף עכשיו, לא ספירה
    // ערב: מהשעה שנקבעה «היום» מראה גם את מחר פתוח — סיכום-היום ומה מחכה, בלי לפתוח קיפול
    final evening = DateTime.now().hour >= ((int.tryParse(appStore.setting('eveningHour', '18')) ?? 18).clamp(0, 23));
    final lead2 = evening && (todayItems.isNotEmpty || tomorrow.isNotEmpty) ? ${k(L.homeEvening)}.replaceAll('{n}', (overdue.length + todayItems.length).toString()).replaceAll('{m}', tomorrow.length.toString()) : lead;
    final headline = first != null ? first.title : lead2;
    // הפעולה האחרונה (עד 90 שניות) עם «החזר» — «סיים» מעלים שורה, וההחזר צריך להיות איפה שהעין
    final lastAct = appStore.log.isNotEmpty ? appStore.log.first : null;
    final lastAt = lastAct == null ? null : DateTime.tryParse(lastAct['at'] ?? '');
    final showUndo = lastAct != null && lastAt != null && lastAct['undone'] != '1' && DateTime.now().difference(lastAt).inSeconds <= 90 && (lastAct['kind'] == 'done' || lastAct['kind'] == 'auto' || lastAct['kind'] == 'add' || lastAct['kind'] == 'merge' || lastAct['kind'] == 'del' || lastAct['kind'] == 'decide' || lastAct['kind'] == 'next');   /* ב׳-עב · גם צעד-הבא עם החזר מיידי */
    final nRec = [for (final m in kBalaganModules) ...appStore.records(m.rootSlug)].length; final bAge = balaganBackupAge(appStore.setting('backupAt'), today); final backupDue = balaganBackupDue(nRec, bAge);   // ב׳-לו
    final hardToday = todayItems.where((x) => x.hard && x.due == today).length;
    final plan = _plan(context, today, overdue, todayItems); final monthSum = balaganMonthSummary(today); final silent = balaganSilentSends(today); final monthTopics = balaganMonthByTopic(today); final freeD = (() { for (var d = 1; d <= 14; d++) { if (bhWeekday(bhPlusDays(_isoD(today), d)) == 6) continue; if (_mods.every((m) => m.items(today, dayDelta: d).isEmpty)) return d; } return 0; })(); /* ב׳-קלה · G43 · היום הפנוי הבא (לא שבת) */ final snoozed = balaganSnoozeCounts(); String snz(DsTodayItem it) { final n = snoozed[it.rid] ?? 0; return n >= 3 ? ${k(L.snoozedN)}.replaceAll('{n}', n.toString()) : ''; } /* ב׳-קכה · G40 */ final streak = bhStreakDays([for (final e in appStore.log) if (e['kind'] == 'done' && e['undone'] != '1') e['at'] ?? ''], _isoD(today));   // ב׳-קי · ב׳-קיב · ב׳-קיד · ב׳-קטז
    WidgetsBinding.instance.addPostFrameCallback((_) { _digest(lead, hardToday); });
    final lk = DsLook.of(context);
    final empty = n == 0 && cards.isEmpty;
    return DsScaffold(title: ${k(L.navToday)} + (bhHebDate(_isoD(today)).isEmpty ? '' : ' · ' + bhHebDate(_isoD(today))), subtitle: empty ? ${k(L.askSub)} : lead, icon: ${k('')}, children: [
      Row(crossAxisAlignment: CrossAxisAlignment.center, children: [Expanded(child: DsQuickAdd(hint: evening ? ${k(L.homeQuickEvening)} : ${k(L.homeQuick)}, autofocus: true, onSubmit: (s0) { final parts = balaganSplit(s0); final s = parts.first; if (parts.length == 1 && balaganPerson(s) != null) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: s.trim()))); return; } /* ב׳-לו · שם שכבר בתיקים ⇒ הכרטיס שלו */ for (final dd in [balaganDates(s.trim(), today)]) { if (parts.length == 1 && dd.length == 1 && dd.first.start == 0 && dd.first.end == s.trim().length) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: -bhDaysSince(dd.first.iso, _isoD(today))))); return; } } /* ב׳-מד · «מחר» / «יום ראשון» לבד ⇒ מסך-היום של אותו יום */ for (final mk in [balaganMonthOf(s, today)]) { if (parts.length == 1 && mk.isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganMonth(monthKey: mk))); return; } } /* ב׳-קכא · «ספטמבר» לבד ⇒ מסך-החודש */ for (final wd in [balaganWeekOf(s)]) { if (parts.length == 1 && wd != null) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganWeek(delta: wd))); return; } } if (parts.length == 1 && balaganAmountFilter(s).isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: s.trim()))); return; } /* ב׳-קכב/קכג · G40 · «שבוע הבא» ⇒ מסך-שבוע · «מעל 5000» ⇒ חיפוש-סכום */ for (final rg in [balaganRangeOf(s, today)]) { if (parts.length == 1 && rg.isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganRange(from: rg[0], to: rg[1]))); return; } } /* ב׳-קל · G42 · «בין 1.9 ל-15.9» ⇒ מסך-טווח */ if (parts.length == 1 && balaganWhenOf(s).isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: s.trim()))); return; } /* ב׳-קמד · G45 · «מתי X» ⇒ תשובה */ if (parts.length == 1 && balaganFieldOf(s).isNotEmpty && balaganFieldValue(balaganFieldOf(s)[0], balaganFieldOf(s)[1]).isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: s.trim()))); return; } /* ב׳-קנג · G47 · «טלפון של רות» ⇒ תשובה (רק כשיש) */ for (final q in [balaganSearchQuery(s)]) { if (parts.length == 1 && q.isNotEmpty) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: q))); return; } } /* ב׳-צה · «1250» = חיפוש-סכום · ב׳-צז · «איפה הפיקדון» = חיפוש */ final hits = balaganIdentify(s); if (hits.isEmpty) { setState(() => _mailNote = ${k(L.askNoHit)}); return; } final m = hits.first.module; Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: m, facts: balaganFacts(s, m), alternatives: hits.skip(1).map((h) => h.module).toList(), text: s, queue: parts.sublist(1)))); })), const SizedBox(width: 8), DsChipButton(label: ${k(L.voiceLabel)}, onTap: () async { if (!voiceSupported) { setState(() => _mailNote = ${k(L.voiceUnsupported)}); return; } setState(() => _mailNote = ${k(L.voiceListening)}); final t = await voiceListen('he-IL'); if (!mounted) return; setState(() => _mailNote = (t == null || t.isEmpty) ? ${k(L.voiceNone)} : ''); if (t == null || t.isEmpty) return; final parts = balaganSplit(t); final s = parts.first; if (parts.length == 1 && balaganPerson(s) != null) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${clsOf('balagan_topics')}(initialQuery: s.trim()))); return; } /* ב׳-מ · «רות לוי» בקול ⇒ הכרטיס */ final hits = balaganIdentify(s); if (hits.isEmpty) { setState(() => _mailNote = ${k(L.askNoHit)}); return; } Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: hits.first.module, facts: balaganFacts(s, hits.first.module), alternatives: hits.skip(1).map((h) => h.module).toList(), text: s, queue: parts.sublist(1)))); })]),   // שורה אחת / קול מהמסך-הראשון ⇒ זיהוי ⇒ טופס-אישור: אפס ניווט
      if (!empty) DsLoadMeter(count: n, label: ${k(L.loadOf)}.replaceAll('{n}', n.toString()), stateLabels: [${k(L.loadOk)}, ${k(L.loadWarn)}, ${k(L.loadBad)}]),
      if (money > 0 || moneyTm > 0 || monthSum[1] > 0 || balaganOpenSummary()[1] > 0) Padding(padding: const EdgeInsets.only(top: 6), child: Text([if (money > 0) ${k(L.moneyToday)}.replaceAll('{n}', balaganFmtMoney(money)), if (moneyTm > 0) ${k(L.moneyTomorrow)}.replaceAll('{n}', balaganFmtMoney(moneyTm)), if (monthSum[1] > 0) ${k(L.monthLine)}.replaceAll('{n}', balaganFmtMoney(monthSum[1].toDouble())).replaceAll('{m}', monthSum[0].toString()), for (final os in [balaganOpenSummary()]) if (os[1] > 0 && os[1] != monthSum[1]) ${k(L.openLine)}.replaceAll('{n}', balaganFmtMoney(os[1].toDouble())).replaceAll('{m}', os[0].toString()) /* ב׳-קכט · G41 */, if (monthSum[1] > 0) ${k(L.monthEndLine)}.replaceAll('{n}', bhDaysSince(_isoD(today), bhMonthEnd(_isoD(today))).toString()) /* ב׳-קלד · G43 */].join(' · '), style: TextStyle(color: lk.ink, fontSize: 15, fontWeight: FontWeight.w600))),   // ב׳-כט · כסף-במבט
      if (showUndo) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [Expanded(child: DsNote(message: ${k(L.undoNow)}.replaceAll('{what}', lastAct['what'] ?? ''), label: '', tone: 0)), const SizedBox(width: 8), DsChipButton(label: ${k(L.undo)}, onTap: () => appStore.undo(lastAct['id'] ?? ''))])),
      if (backupDue) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [Expanded(child: DsNote(message: bAge < 0 ? ${k(L.backupNever)} : ${k(L.backupNudge)}.replaceAll('{n}', bAge.toString()), label: '', tone: 1)), const SizedBox(width: 8), DsChipButton(label: ${k(L.backupCopy)}, onTap: () async { final t = appStore.exportJson(); await Clipboard.setData(ClipboardData(text: t)); appStore.setSetting('backupAt', _iso(today)); setState(() => _mailNote = ${k(L.backupCopied)}.replaceAll('{n}', t.length.toString())); })])),   // ב׳-לו · גיבוי: מקומי-בלבד ⇒ תזכורת מעולם/30 יום, העתקה בהקשה
      for (final hn in [bhHolidayOn(_isoD(today))]) if (hn.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: DsNote(message: ${k(L.holidayToday)}.replaceAll('{name}', hn), label: '', tone: 0)),   // ב׳-קנה · G49
      for (final hs in [bhHolidaysAhead(_isoD(today), 30).where((h) => h['iso'] != _isoD(today)).toList()]) if (hs.isNotEmpty) for (final h in [hs.first]) for (final dd in [bhDaysSince(_isoD(today), (h['iso'] as String))]) Padding(padding: const EdgeInsets.only(top: 6), child: DsNote(message: dd == 1 ? ${k(L.holidayTomorrow)}.replaceAll('{name}', h['name'] as String) : ${k(L.holidayAhead)}.replaceAll('{n}', dd.toString()).replaceAll('{name}', h['name'] as String).replaceAll('{day}', balaganDayLabel(DateTime.parse((h['iso'] as String) + 'T12:00:00'), today)), label: '', tone: 0)),   // ב׳-קנה · G49 · החג הבא ב-30 יום
      for (final bd in [bhMoney(appStore.setting('budget'))]) if (bd > 0 && monthSum[1] > 0) Padding(padding: const EdgeInsets.only(top: 6), child: DsNote(message: ${k(L.budgetLine)}.replaceAll('{n}', balaganFmtMoney(monthSum[1].toDouble())).replaceAll('{b}', balaganFmtMoney(bd)).replaceAll('{p}', (monthSum[1] * 100 / bd).round().toString()) + (monthSum[1] > bd ? ' · ' + ${k(L.budgetOver)} : ''), label: '', tone: monthSum[1] > bd ? 2 : 0)),   // ב׳-קלב · G42 · תקציב-חודשי (הגדרה ב«חיבורים») מול «החודש»
      for (final nx in [(() { final now = DateTime.now(); final nowT = _isoT(now); List<dynamic>? best; for (final it in todayItems) { if (it.time.isEmpty) continue; final mn = bhMinutesUntil(nowT, _isoD(today), it.time); if (mn >= 0 && mn <= 90 && (best == null || mn < (best[0] as int))) best = [mn, it]; } return best; })()]) if (nx != null) Padding(padding: const EdgeInsets.only(top: 6), child: DsNote(message: ${k(L.soonMin)}.replaceAll('{n}', (nx[0] as int).toString()).replaceAll('{title}', (nx[1] as DsTodayItem).title), label: '', tone: 1)),   // ב׳-קיח · G39 · הדבר הבא עם שעה, כשהוא קרוב (≤90 דק׳)
      if (monthTopics.length >= 2) DsFold(title: ${k(L.monthByTopic)}.replaceAll('{n}', monthTopics.length.toString()), details: [for (final r in monthTopics) DsActionRow(title: ${k(L.monthTopicRow)}.replaceAll('{topic}', r[0] as String).replaceAll('{n}', balaganFmtMoney(r[2] as double)).replaceAll('{m}', r[1].toString()))]),   // ב׳-קיד · G38 · לאן הכסף הולך החודש
      if (!empty) Padding(padding: const EdgeInsets.only(top: 6), child: Row(children: [DsChipButton(label: ${k(L.toCalAll)}, onTap: () async { final its = <List<String>>[for (final it in [...overdue, ...todayItems, ...tomorrow]) for (final mm in kBalaganModules.where((x) => x.title == it.module)) if (it.rid.isNotEmpty) [_isoD(it.due), mm.rootSlug, it.rid, mm.title]]; await Clipboard.setData(ClipboardData(text: balaganIcsOf(its, ${k(L.navToday)}, DateTime.now()))); setState(() => _mailNote = ${k(L.icsCopied)}); }), const SizedBox(width: 8), /* ב׳-קמו · G46 */ DsChipButton(label: ${k(L.shareDay)}, onTap: () => _shareDay(overdue, todayItems, plan.length, evening ? tomorrow : const [], undated.length, stale.length))])),   // היום כטקסט: ללוח + וואטסאפ (לעצמו / לבן-הזוג) — אפס-שרת
      Padding(padding: const EdgeInsets.only(top: 16, bottom: 4), child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: first == null ? null : () => _openItem(context, first), child: Text(headline, style: TextStyle(color: lk.ink, fontSize: 28, fontWeight: FontWeight.w600, height: 1.2)))),   // ב׳-סו · הדבר-האחד: הקשה ⇒ התיק
      if (first != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: Text([if (first.overdue) ${k(L.homeOverdue)}, first.sub, first.module, lead2].where((x) => x.isNotEmpty).join(' · '), style: TextStyle(color: lk.muted, fontSize: 14))),
      if (overdue.isNotEmpty) DsSection(title: ${k(L.homeOverdue)} + ' · ' + overdue.length.toString() + (balaganMoney(overdue) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganMoney(overdue))) : ''), tone: 2, trailing: overdue.length < 2 ? null : Row(mainAxisSize: MainAxisSize.min, children: [DsChipButton(label: ${k(L.doneAll)}, onTap: () => appStore.grouped(() { for (final it in overdue) { final i = it.actions.indexOf(${k(L.actDone)}); if (i >= 0) it.act(i); } })), const SizedBox(width: 8), DsChipButton(label: ${k(L.snoozeAll)}, onTap: () => _snoozeAll(overdue, today))]), children: [for (final it in overdue) DsActionRow(title: it.title, sub: [it.sub, it.module, snz(it)].where((x) => x.isNotEmpty).join(' · '), tone: 2, onOpen: () => _openItem(context, it), actions: it.actions, onAct: it.act)]),   // D6/P6/P7 · באיחור ראשון · ב׳-פז · «דחה הכל למחר» = הקשה אחת, החזר אחד
      if (todayItems.isNotEmpty) DsSection(title: ${k(L.homeToday)} + ' · ' + todayItems.length.toString() + (balaganMoney(todayItems) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganMoney(todayItems))) : ''), trailing: !evening || todayItems.where((x) => x.field.isNotEmpty).isEmpty ? null : DsChipButton(label: ${k(L.snoozeRest)}, onTap: () => _snoozeAll(todayItems, today)), /* ב׳-קה · בערב: מה שנשאר עובר למחר בהקשה אחת, החזר אחד */ children: [for (final it in todayItems) DsActionRow(title: it.title, sub: [it.sub, it.module, snz(it)].where((x) => x.isNotEmpty).join(' · '), onOpen: () => _openItem(context, it), actions: it.actions, onAct: it.act)]),
      if (plan.isNotEmpty) DsFold(title: ${k(L.planFold)}.replaceAll('{n}', plan.length.toString()), details: plan),   // תזמון-אוטומטי: מקופל — הוא מסתכל כשהוא רוצה
      ...cards.take(3),   // 3 למעלה
      if (cards.length > 3) DsFold(title: ${k(L.homeMore)}.replaceAll('{n}', (cards.length - 3).toString()), details: [for (final x in cardRows.skip(3)) for (final ms in [kBalaganModules.where((mm) => mm.title == x[3])]) DsActionRow(title: ms.isEmpty ? (x[3] as String) : appStore.displayOf(ms.first.rootSlug, x[4] as String), sub: [x[3] as String, if ((x[0] as DateTime?) != null) balaganDayLabel(x[0] as DateTime, today), if (ms.isNotEmpty) for (final nf in ms.first.numFields.where((f) => !ms.first.percentFields.contains(f)).take(1)) for (final v in [double.tryParse(((appStore.byId(ms.first.rootSlug, x[4] as String) ?? const <String, String>{})[nf] ?? '').replaceAll(',', '').trim())]) if (v != null && v > 0) '₪ ' + balaganFmtMoney(v)].join(' · '),   /* ב׳-ע · ₪ גם בשורות «עוד» */ onOpen: () { if (ms.isNotEmpty) Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(ms.first.rootSlug, x[4] as String))); })]),   // ב׳-מו · «עוד» = שורה לכל תיק (שם · מודול · המועד הקרוב), הקשה ⇒ התיק — לא כרטיס של 200px
      if (_mailNote.isNotEmpty) DsNote(message: _mailNote, label: '', tone: 0),
      if (pending.isNotEmpty) DsSection(title: ${k(L.homePending)} + ' · ' + pending.length.toString(), children: pending),   // D5 · הגיע (מייל) · הצעד-הבא (שרשרת) · תזכורות
      if (silent.isNotEmpty) DsSection(title: ${k(L.silentTitle)} + ' · ' + silent.length.toString(), tone: 1, children: [for (final s in silent.take(3)) DsActionRow(title: appStore.displayOf(s[0], s[1]), sub: ${k(L.silentSub)}.replaceAll('{n}', s[2]), tone: 1, onOpen: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(s[0], s[1]))), actions: [${k(L.silentOpen)}, ${k(L.silentIgnore)}], onAct: (i) { if (i == 0) { Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(s[0], s[1]))); return; } appStore.decide('silent:' + s[1] + ':' + s[4], 'ign'); appStore.logAction('decide', ${k(L.silentIgnore)} + ' · ' + appStore.displayOf(s[0], s[1]), entity: s[0], rid: s[1], field: 'silent:' + s[1] + ':' + s[4]); })]),   // ב׳-קיב · G37 · שלחת ולא נענה ≥3 ימים — פתח / התעלם (עם החזר דרך היומן)
      if (did.isNotEmpty) DsSection(title: ${k(L.homeDid)} + ' · ' + didRows.length.toString(), children: [for (final e in didRows) DsLogRow(text: ((gCount[e['group'] ?? ''] ?? 1) > 1 && (e['group'] ?? '').isNotEmpty ? ${k(L.groupDid)}.replaceAll('{n}', (gCount[e['group']] ?? 1).toString()) + ' · ' : '') + (e['what'] ?? ''), sub: (() { final at = DateTime.tryParse(e['at'] ?? ''); final ago = at == null ? '' : balaganAgo(at, DateTime.now()); final ca = e['kind'] == 'done' ? balaganClosedAfter(e) : -1; return [ago, if (ca >= 1) ${k(L.closedAfter)}.replaceAll('{n}', ca.toString())].where((x) => x.isNotEmpty).join(' · '); })(),   /* ב׳-קיז · G38 */ undoLabel: ${k(L.undo)}, onUndo: () => appStore.undo(e['id'] ?? ''))]),   // T2
      if (wk.isNotEmpty) DsFold(title: ${k(L.weekFold)}.replaceAll('{n}', wk.length.toString()).replaceAll('{m}', wSaved.toString()) + (streak >= 2 ? ' · ' + ${k(L.streak)}.replaceAll('{n}', streak.toString()) : ''), details: [Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [DsChipButton(label: ${k(L.yesterdayAsk)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const BalaganDay(delta: -1))))])), /* ב׳-פ */ if (wAdd > 0) DsActionRow(title: ${k(L.weekAdded)}.replaceAll('{n}', wAdd.toString())), if (wSend > 0) DsActionRow(title: ${k(L.weekSent)}.replaceAll('{n}', wSend.toString())), if (wAuto > 0) DsActionRow(title: ${k(L.weekAuto)}.replaceAll('{n}', wAuto.toString())), if (cnt('done') > 0) DsActionRow(title: ${k(L.weekDone)}.replaceAll('{n}', cnt('done').toString()), sub: (() { var mm = 0.0; final seen = <String>{}; for (final e in wk) { if (e['kind'] != 'done') continue; final ent = e['entity'] ?? '', rid = e['rid'] ?? ''; if (!seen.add(ent + '|' + rid)) continue; final ms = kBalaganModules.where((m) => m.rootSlug == ent); if (ms.isEmpty) continue; final fs = ms.first.numFields.where((f) => !ms.first.percentFields.contains(f)).toList(); final r = appStore.byId(ent, rid); if (fs.isEmpty || r == null) continue; mm += bhMoney(r[fs.first]); } return mm > 0 ? ${k(L.weekClosed)}.replaceAll('{n}', seen.length.toString()).replaceAll('{m}', balaganFmtMoney(mm)) : ''; })()),   /* ב׳-קלג · G42 · כמה כסף נסגר השבוע */   /* ב׳-סז · מה סיימת השבוע */ DsNote(message: ${k(L.weekNote)}, label: '', tone: 0)]),   // שמירת-זמן: מקופל, מוכח מהיומן
      if (soon.isNotEmpty) DsFold(title: ${k(L.soonFold)}.replaceAll('{n}', soon.length.toString()) + (moneyWk > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(moneyWk)) : ''), details: [for (final g in [bhGroupRows([for (final x in soon) {'d': (x[0] as int).toString()}], 'd')]) if (g.isNotEmpty && (g.first[1] as int) >= 3) Padding(padding: const EdgeInsets.only(bottom: 6), child: DsNote(message: ${k(L.busiestDay)}.replaceAll('{day}', balaganDayLabel(_dayPlus(today, int.parse(g.first[0] as String)), today)).replaceAll('{n}', g.first[1].toString()), label: '', tone: 0)),   /* ב׳-קיט · G39 · היום העמוס בשבוע (bhGroupRows ⇒ count.by, ממוין-יורד) */ if (freeD > 0) Padding(padding: const EdgeInsets.only(bottom: 6), child: Row(children: [DsChipButton(label: ${k(L.freeDay)}.replaceAll('{day}', balaganDayLabel(_dayPlus(today, freeD), today)), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: freeD))))])), /* ב׳-קלה · G43 */ Padding(padding: const EdgeInsets.only(bottom: 8), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final d in soon.map((x) => x[0] as int).toSet().toList()) DsChipButton(label: balaganDayLabel(_dayPlus(today, d), today) + ' · ' + soon.where((x) => x[0] == d).length.toString(), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: d))))])), /* ב׳-מה · יום ⇒ מסך-היום */ for (final x in soon) DsActionRow(title: balaganDayLabel(_dayPlus(today, x[0] as int), today) + ' · ' + (x[1] as DsTodayItem).title, sub: [(x[1] as DsTodayItem).sub, (x[1] as DsTodayItem).module].where((x) => x.isNotEmpty).join(' · '), onOpen: () => _openItem(context, x[1] as DsTodayItem), actions: (x[1] as DsTodayItem).actions, onAct: (x[1] as DsTodayItem).act)]),   // ב׳-לד · גם השבוע עם פעולות
      if (tomorrow.isNotEmpty) DsFold(open: evening, title: ${k(L.homeTomorrow)} + ' (' + tomorrow.length.toString() + ')' + (moneyTm > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(moneyTm)) : ''), details: [Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [DsChipButton(label: ${k(L.openDay)}.replaceAll('{day}', ${k(L.homeTomorrow)}), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const BalaganDay(delta: 1))))])), /* ב׳-סה · מהקיפול למסך-היום של מחר */ for (final it in tomorrow) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), onOpen: () => _openItem(context, it), actions: it.actions, onAct: it.act)]),   // D8
      for (final np in [balaganNoPhone()]) if (np.isNotEmpty) DsFold(title: ${k(L.noPhoneFold)}.replaceAll('{n}', np.length.toString()), details: [DsNote(message: ${k(L.noPhoneNote)}, label: '', tone: 0), for (final e in np.take(10)) for (final mm in [kBalaganModules.where((m) => m.rootSlug == e[0]).firstOrNull]) for (final who in [mm == null ? '' : ((appStore.byId(e[0], e[1]) ?? const {})[mm.personFields.first] ?? '')]) for (final ph in [mm == null ? '' : (balaganPhoneOfPerson(who).isNotEmpty ? balaganPhoneOfPerson(who) : balaganBookPhone(who))]) DsActionRow(title: appStore.displayOf(e[0], e[1]), sub: mm?.title ?? '', onOpen: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(e[0], e[1]))), actions: [if (ph.isNotEmpty) (balaganPhoneOfPerson(who).isNotEmpty ? ${k(L.phoneFromOther)} : ${k(L.phoneFromBook)}).replaceAll('{phone}', ph)], onAct: (i) { if (mm == null || ph.isEmpty) return; final r = appStore.byId(e[0], e[1]); if (r == null) return; appStore.logAction('auto', ${k(L.phoneFromOther)}.replaceAll('{phone}', ph) + ' · ' + appStore.displayOf(e[0], e[1]), entity: e[0], rid: e[1], field: mm.phoneFields.first, prev: r[mm.phoneFields.first] ?? ''); appStore.update(e[0], e[1], {mm.phoneFields.first: ph}); })]),   // ב׳-קמה · G45 · ב׳-קנ · G47 · הטלפון מתיק אחר של אותו אדם, בהקשה + החזר
      for (final ex in [balaganExpiring(today)]) if (ex.isNotEmpty) DsFold(title: ${k(L.expiryFold)}.replaceAll('{n}', ex.length.toString()), details: [for (final e in ex) DsNavTile(glyph: '', title: appStore.displayOf(e[1], e[2]), sub: ${k(L.expiryRow)}.replaceAll('{field}', e[3]).replaceAll('{day}', balaganDayLabel(DateTime.parse(e[0] + 'T12:00:00'), today)), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(e[1], e[2]))))]),   // ב׳-קמא · G44 · תוקף/פקיעה/חידוש ב-30 הימים הבאים
      if (undated.isNotEmpty) DsFold(title: ${k(L.undatedFold)}.replaceAll('{n}', undated.length.toString()), details: [DsNote(message: ${k(L.undatedNote)}, label: '', tone: 0), for (final it in undated) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), onOpen: () => _openItem(context, it), actions: [...it.actions, if (freeD > 0 && it.field.isNotEmpty) ${k(L.setFree)}.replaceAll('{day}', balaganDayLabel(_dayPlus(today, freeD), today))], onAct: (i) { if (i < it.actions.length) { it.act(i); return; } final ms = kBalaganModules.where((mm) => mm.title == it.module); if (ms.isEmpty) return; final slug = ms.first.rootSlug; final r = appStore.byId(slug, it.rid); if (r == null) return; final iso = _isoD(_dayPlus(today, freeD)); appStore.logAction('auto', ${k(L.setFree)}.replaceAll('{day}', balaganDayLabel(_dayPlus(today, freeD), today)) + ' · ' + it.title, entity: slug, rid: it.rid, field: it.field, prev: r[it.field] ?? ''); appStore.update(slug, it.rid, {it.field: iso}); })]),   // ב׳-כח · בלי תאריך · ב׳-קלז · G43 · «קבע ליום פנוי» עם החזר
      if (stale.isNotEmpty) DsFold(title: ${k(L.staleFold)}.replaceAll('{n}', stale.length.toString()), details: [DsNote(message: ${k(L.staleNote)}, label: '', tone: 0), for (final it in stale) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), onOpen: () => _openItem(context, it), actions: it.actions, onAct: it.act)]),   // ב׳-ל · נשכחים
      if (!empty && overdue.isEmpty && todayItems.isEmpty && pending.isEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Text(${k(L.homeAll)}, style: TextStyle(color: lk.muted, fontSize: 14))),
      if (empty) DsNote(message: ${k(L.homeEmptyWay)}, label: '', tone: 0),
      if (empty) Padding(padding: const EdgeInsets.only(top: 14), child: Text(${k(L.homeTry)}, style: TextStyle(color: lk.muted, fontSize: 13))),
      if (empty) Padding(padding: const EdgeInsets.only(top: 6), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ex in ${k(L.askExamples)}.split('|')) DsChipButton(label: ex, onTap: () { final hits = balaganIdentify(ex); if (hits.isEmpty) return; Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: hits.first.module, facts: balaganFacts(ex, hits.first.module), alternatives: hits.skip(1).map((h) => h.module).toList(), text: ex))); })])),   // מסך ריק = הדרך בהקשה אחת
    ]);
  });
}

/// ב׳-מד · מסך-יום: «מה מחכה ביום ראשון?» — אותן שורות של «היום» (פעולות · הקשה ⇒ תיק · ₪), לכל יום; נגזרת, אפס-נתון-חדש
/// ב׳-קכא · G39 · מסך-חודש: כל מה שיש בחודש, לפי יום (bhSameMonth · bhDayLabelParts דרך balaganDayLabel); הקשה ⇒ התיק
class BalaganMonth extends StatelessWidget {
  const BalaganMonth({required this.monthKey, super.key});
  final String monthKey;
  @override
  Widget build(BuildContext context) {
    final items = balaganMonthItems(monthKey); final today = DateTime.now(); final t0 = DateTime(today.year, today.month, today.day);
    return DsScaffold(title: ${k(L.monthTitle)}.replaceAll('{month}', balaganMonthName(monthKey)).replaceAll('{n}', items.length.toString()) + (balaganItemsMoney(items) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganItemsMoney(items))) : ''), subtitle: ${k(L.monthSub)}, icon: ${k('')}, children: [
      if (items.isEmpty) DsNote(message: ${k(L.monthNone)}, label: '', tone: 0),
      if (items.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: Wrap(spacing: 8, runSpacing: 8, children: [DsChipButton(label: ${k(L.toCalAll)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganIcsOf(items, balaganMonthName(monthKey), DateTime.now()))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.icsCopied)}))); }), DsChipButton(label: ${k(L.toCsvLabel)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganCsvOf(items))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.csvCopied)}.replaceAll('{n}', items.length.toString())))); }) /* ב׳-קמז · G46 */, DsChipButton(label: ${k(L.shareMonth)}, onTap: () { final t = balaganMonthName(monthKey) + ' · ' + items.length.toString() + (balaganItemsMoney(items) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganItemsMoney(items))) : '') + '\\n' + [for (final it in items) '• ' + bhDayMonth(it[0], false) + ' ' + appStore.displayOf(it[1], it[2]) + ' (' + it[3] + ')'].join('\\n'); Clipboard.setData(ClipboardData(text: t)); launchUrl(Uri.parse('https://wa.me/?text=' + Uri.encodeComponent(t)), mode: LaunchMode.externalApplication); })])),   // ב׳-קמב/קמג · G45 · ליומן (ICS דרך buildIcs) · שתף את החודש
      for (final it in items) DsNavTile(glyph: '', title: balaganDayLabel(DateTime.parse(it[0] + 'T12:00:00'), t0) + ' · ' + appStore.displayOf(it[1], it[2]), sub: it[3], onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(it[1], it[2])))),
    ]);
  }
}
/// ב׳-קל · G42 · מסך-טווח: כל מה שיש בין שני תאריכים, לפי יום (bhInRange); הקשה ⇒ התיק
class BalaganRange extends StatelessWidget {
  const BalaganRange({required this.from, required this.to, super.key});
  final String from, to;
  @override
  Widget build(BuildContext context) {
    final today = DateTime.now(); final t0 = DateTime(today.year, today.month, today.day); final items = balaganRangeItems(from, to);
    return DsScaffold(title: ${k(L.rangeTitle)}.replaceAll('{from}', bhDayMonth(from, false)).replaceAll('{to}', bhDayMonth(to, false)).replaceAll('{n}', items.length.toString()) + (balaganItemsMoney(items) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganItemsMoney(items))) : ''), subtitle: ${k(L.rangeSub)}, icon: ${k('')}, children: [
      if (items.isEmpty) DsNote(message: ${k(L.monthNone)}, label: '', tone: 0),
      if (items.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [DsChipButton(label: ${k(L.toCalAll)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganIcsOf(items, bhDayMonth(from, false) + '–' + bhDayMonth(to, false), DateTime.now()))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.icsCopied)}))); }), DsChipButton(label: ${k(L.toCsvLabel)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganCsvOf(items))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.csvCopied)}.replaceAll('{n}', items.length.toString())))); }) /* ב׳-קמז · G46 */])),   // ב׳-קמב · G45
      for (final it in items) DsNavTile(glyph: '', title: balaganDayLabel(DateTime.parse(it[0] + 'T12:00:00'), t0) + ' · ' + appStore.displayOf(it[1], it[2]), sub: it[3], onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(it[1], it[2])))),
    ]);
  }
}
/// ב׳-קכב · G40 · מסך-שבוע: כל מה שיש בשבוע (ראשון–שבת, bhWeekRange · bhInRange), לפי יום; הקשה ⇒ התיק
class BalaganWeek extends StatelessWidget {
  const BalaganWeek({required this.delta, super.key});
  final int delta;
  @override
  Widget build(BuildContext context) {
    final today = DateTime.now(); final t0 = DateTime(today.year, today.month, today.day); final rg = bhWeekRange(bhIso(t0), delta); final items = balaganRangeItems(rg[0], rg[1]);
    return DsScaffold(title: ${k(L.weekTitle)}.replaceAll('{week}', balaganWeekName(delta)).replaceAll('{n}', items.length.toString()) + (balaganItemsMoney(items) > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(balaganItemsMoney(items))) : ''), subtitle: ${k(L.weekSub)}.replaceAll('{from}', bhDayMonth(rg[0], false)).replaceAll('{to}', bhDayMonth(rg[1], false)), icon: ${k('')}, children: [
      if (items.isEmpty) DsNote(message: ${k(L.monthNone)}, label: '', tone: 0),
      if (items.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [DsChipButton(label: ${k(L.toCalAll)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganIcsOf(items, balaganWeekName(delta), DateTime.now()))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.icsCopied)}))); }), DsChipButton(label: ${k(L.toCsvLabel)}, onTap: () async { await Clipboard.setData(ClipboardData(text: balaganCsvOf(items))); if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(${k(L.csvCopied)}.replaceAll('{n}', items.length.toString())))); }) /* ב׳-קמז · G46 */])),   // ב׳-קמב · G45
      for (final it in items) DsNavTile(glyph: '', title: balaganDayLabel(DateTime.parse(it[0] + 'T12:00:00'), t0) + ' · ' + appStore.displayOf(it[1], it[2]), sub: it[3], onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(it[1], it[2])))),
    ]);
  }
}
class BalaganDay extends StatelessWidget {
  const BalaganDay({required this.delta, super.key});
  final int delta;
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final today = DateTime.now(); final t0 = DateTime(today.year, today.month, today.day);
    final items = <DsTodayItem>[for (final m in _${cls}State._mods) ...m.items(t0, dayDelta: delta)]..sort((a, b) { final ta = a.time.isEmpty ? '99:99' : a.time, tb = b.time.isEmpty ? '99:99' : b.time; return ta.compareTo(tb); });
    final money = balaganMoney(items);
    void open(DsTodayItem it) { final ms = kBalaganModules.where((m) => m.title == it.module); if (ms.isEmpty || it.rid.isEmpty) return; Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(ms.first.rootSlug, it.rid))); }
    return DsScaffold(title: balaganDayLabel(_dayPlus(t0, delta), t0) + (items.isEmpty ? '' : ' · ' + items.length.toString()), subtitle: [bhHebDate(_isoD(_dayPlus(t0, delta))), ${k(L.daySub)}].where((x) => x.isNotEmpty).join(' · '),   /* ב׳-קד · התאריך העברי של היום הזה */ icon: ${k('')}, children: [
      Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: '‹ ' + balaganDayLabel(_dayPlus(t0, delta - 1), t0), onTap: () => Navigator.of(context).pushReplacement(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: delta - 1)))), const SizedBox(width: 8), DsChipButton(label: balaganDayLabel(_dayPlus(t0, delta + 1), t0) + ' ›', onTap: () => Navigator.of(context).pushReplacement(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: delta + 1))))])),   // ב׳-מה · דפדוף: יום קודם / יום הבא
      Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [Expanded(child: DsQuickAdd(hint: ${k(L.dayQuick)}, autofocus: false, onSubmit: (s0) { final s = s0.trim(); if (s.isEmpty) return; final hits = balaganIdentify(s); if (hits.isEmpty) return; final m = hits.first.module; final facts = balaganFacts(s, m); if (m.dateFields.isNotEmpty && !m.dateFields.any((f) => (facts[f] ?? '').trim().isNotEmpty)) { final hard = m.fields.where((f) => f.type == 'date' && f.required); facts[hard.isNotEmpty ? hard.first.label : m.dateFields.first] = _${cls}State._iso(_dayPlus(t0, delta)); } Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: m, facts: facts, alternatives: hits.skip(1).map((h) => h.module).toList(), text: s))); })), const SizedBox(width: 8), DsChipButton(label: ${k(L.shareDay)}, onTap: () { final t = balaganDayText(const [], items, _dayPlus(t0, delta), money: money); Clipboard.setData(ClipboardData(text: t)); launchUrl(Uri.parse('https://wa.me/?text=' + Uri.encodeComponent(t)), mode: LaunchMode.externalApplication); })])),   // ב׳-מט · רגע ליום הזה: המועד כבר מוכן · ב׳-נא · «שתף» את היום ההוא
      if (delta < 0) for (final past in [appStore.log.where((e) => e['undone'] != '1' && (e['at'] ?? '').startsWith(_${cls}State._iso(_dayPlus(t0, delta)))).toList()]) if (past.isNotEmpty) DsSection(title: ${k(L.dayLog)} + ' · ' + past.length.toString(), children: [for (final e in past) DsLogRow(text: e['what'] ?? '', sub: (e['at'] ?? '').length >= 16 ? e['at']!.substring(11, 16) : '', undoLabel: '', onUndo: null)]),   // ב׳-פא · «מה עשיתי אתמול?» — היומן של אותו יום
      if (items.isEmpty && delta >= 0) DsNote(message: ${k(L.dayEmpty)}, label: '', tone: 0),
      if (money > 0) Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(money)), style: TextStyle(color: DsLook.of(context).ink, fontSize: 15, fontWeight: FontWeight.w600))),
      for (final it in items) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), onOpen: () => open(it), actions: it.actions, onAct: it.act),
    ]);
  });
}
`;
    write(slug, code, dump());
  }

  // ── 3 · «מה קרה?» ──
  {
    const slug = 'balagan_ask'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «מה קרה?»: שורה/הדבקה/צילום ⇒ זיהוי-הרגע (דטרמיניסטי) ⇒ «הבנתי כך?» ⇒ טופס-השורש של המודול ממולא-מראש. צילום נקרא רק עם מפתח-הלקוח (ds_ai). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_ai.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_voice.dart';
import 'gen_balagan_confirm.dart';
import 'gen_balagan_home.dart';
import 'gen_balagan_moments.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';`).join('\n')}
import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';

Widget balaganOpen(int index, Map<String, String> initial) {
  switch (index) {
${mods.map((m, i) => `    case ${i}: return ${m.root.cls}(initial: initial);`).join('\n')}
    default: return const SizedBox.shrink();
  }
}

class ${cls} extends StatefulWidget {
  const ${cls}({this.initialText = '', super.key});
  final String initialText;   // שיתוף (share_target ?text=) / הדבקה ⇒ נכנס לשדה ומזוהה מיד
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  final _c = TextEditingController();
  @override
  void initState() { super.initState(); if (widget.initialText.trim().isNotEmpty) { _c.text = widget.initialText.trim(); _note = ${k(L.sharedNote)}; WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _go(); }); } }   // הגיע משיתוף ⇒ אפס-הקשות עד טופס-האישור
  Future<void> _voice() async {   // «דבר»: זיהוי-דיבור של הדפדפן (he-IL) ⇒ השדה ⇒ זיהוי — אפס-הקלדה; לא נתמך/לא שמע ⇒ הודעה כנה
    if (!voiceSupported) { setState(() => _note = ${k(L.voiceUnsupported)}); return; }
    setState(() { _busy = true; _note = ${k(L.voiceListening)}; });
    final t = await voiceListen('he-IL');
    if (!mounted) return;
    setState(() { _busy = false; _note = (t == null || t.isEmpty) ? ${k(L.voiceNone)} : ''; });
    if (t != null && t.isNotEmpty) { _c.text = t; _go(); }
  }
  Future<void> _paste() async { final d = await Clipboard.getData('text/plain'); final t = (d?.text ?? '').trim(); if (t.isEmpty) { setState(() => _note = ${k(L.pasteEmpty)}); return; } _c.text = t; _go(); }   // «הדבק» = הקשה אחת מהודעה שהועתקה
  List<BalaganHit> _hits = const [];
  Map<String, String> _extra = const {};
  String _doc = '';   // data:URI של הצילום (מוקטן) — נשמר עם הרשומה (מחסנית-מסמכים)
  bool _asked = false, _busy = false;
  String _note = '';

  void _go() { final hits = balaganIdentify(balaganSplit(_c.text).first); setState(() { _asked = true; _hits = hits; _note = hits.isEmpty ? ${k(L.askNoHit)} : ''; }); if (hits.isNotEmpty) _open(context, hits.first, hits.skip(1).map((h) => h.module).toList()); }   // הקשה אחת: זיהוי ⇒ ישר לטופס-האישור (החלופות בתוכו)
  void _skip() { setState(() { _hits = _hits.length > 1 ? _hits.sublist(1) : const []; if (_hits.isEmpty) _note = ${k(L.askNone)}; }); }
  void _open(BuildContext context, BalaganHit h, [List<BalaganModule> alts = const []]) {
    final parts = balaganSplit(_c.text); final first = parts.first;
    final facts = {...balaganFacts(first, h.module), ..._extra}..removeWhere((key, v) => v.trim().isEmpty || !(h.module.dateFields.contains(key) || h.module.numFields.contains(key) || h.module.timeFields.contains(key) || h.module.phoneFields.contains(key) || h.module.personFields.contains(key) || h.module.percentFields.contains(key) || key == h.module.descField || key == h.module.longField || key.startsWith('__')));
    Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: h.module, facts: facts, doc: _doc, alternatives: alts, text: first, queue: parts.sublist(1)))).then((saved) { if (saved == true && mounted) setState(() { _c.clear(); _hits = const []; _extra = const {}; _doc = ''; _asked = false; _note = ${k(L.askSaved)}; }); });
  }
  Future<void> _photo() async {
    final key = appStore.setting('ai.key');
    if (key.isEmpty) { setState(() => _note = ${k(L.askNoKey)}); return; }
    final x = await ImagePicker().pickImage(source: kIsWeb ? ImageSource.gallery : ImageSource.camera, imageQuality: 60, maxWidth: 900);
    if (x == null) return;
    setState(() { _busy = true; _note = ${k(L.askReading)}; });
    final bytes = await x.readAsBytes();
    _doc = bytes.length <= 160000 ? 'data:' + (x.mimeType ?? 'image/jpeg') + ';base64,' + base64Encode(bytes) : '';   // ≤160KB במכשיר; גדול ⇒ רק התמלול (כנות במסך)
    final r = await dsAiExtract(apiKey: key, image: bytes, imageMime: x.mimeType ?? 'image/jpeg', fields: const ['תאריך', 'סכום', 'שם'], model: appStore.setting('ai.model', 'claude-sonnet-5'));
    if (!mounted) return;
    if (r == null) { setState(() { _busy = false; _note = ${k(L.askFailed)}; }); return; }
    final text = (r['_text'] ?? '').trim();
    setState(() { _busy = false; _note = _doc.isEmpty ? ${k(L.docTooBig)} : ${k(L.docKept)}; if (text.isNotEmpty) _c.text = text; _extra = {for (final e in r.entries) if (e.key != '_text' && e.value.trim().isNotEmpty) e.key: e.value}; });
    _go();
  }

  @override
  Widget build(BuildContext context) {
    final lk = DsLook.of(context);
    final top = _hits.isNotEmpty ? _hits.first : null;
    return DsScaffold(title: ${k(L.askTitle)}, subtitle: ${k(L.askSub)}, icon: ${k('')}, children: [
      Container(
        decoration: BoxDecoration(border: Border.all(color: lk.line), borderRadius: BorderRadius.circular(lk.r)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: TextField(controller: _c, minLines: 3, maxLines: 8, autofocus: true, textInputAction: TextInputAction.done, style: TextStyle(color: lk.ink, fontSize: 16, height: 1.5), decoration: InputDecoration(border: InputBorder.none, hintText: ${k(L.askHint)}, hintStyle: TextStyle(color: lk.faint)), onSubmitted: (_) => _go()),
      ),
      Padding(padding: const EdgeInsets.only(top: 10), child: Row(children: [
        Expanded(child: DsPrimaryButton(label: ${k(L.askGo)}, onTap: _busy ? null : _go)),
        const SizedBox(width: 8),
        DsChipButton(label: ${k(L.voiceLabel)}, onTap: _busy ? null : _voice),
        const SizedBox(width: 8),
        DsChipButton(label: ${k(L.pasteLabel)}, onTap: _busy ? null : _paste),
        const SizedBox(width: 8),
        GestureDetector(onTap: _busy ? null : _photo, child: Container(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9), decoration: BoxDecoration(border: Border.all(color: lk.line), borderRadius: BorderRadius.circular(9)), child: Text(${k(L.askPhoto)}, style: TextStyle(color: lk.ink, fontSize: 14, fontWeight: FontWeight.w600)))),
      ])),
      if (!_asked && _c.text.trim().isEmpty) Padding(padding: const EdgeInsets.only(top: 14), child: Text(${k(L.askExamplesTitle)}, style: TextStyle(color: lk.muted, fontSize: 13))),
      if (!_asked && _c.text.trim().isEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ex in ${k(L.askExamples)}.split('|')) DsChipButton(label: ex, onTap: () { _c.text = ex; _go(); })])),   // אפס-הקלדה: דוגמה = הקשה אחת ⇒ טופס-האישור
      if (!_asked && _c.text.trim().isEmpty) for (final people in [balaganPeople()]) if (people.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final p in people) DsChipButton(label: p + ':', onTap: () => setState(() { _c.text = p + ': '; }))])),   // ב׳-ס · «רות לוי: » — השורה מתחילה מהאדם, בלי להקליד שם
      if (!_asked && _c.text.trim().isEmpty) for (final recent in [appStore.log.where((e) => e['kind'] == 'add' && e['undone'] != '1' && (e['entity'] ?? '').isNotEmpty && appStore.byId(e['entity'] ?? '', e['rid'] ?? '') != null).take(3).toList()]) if (recent.isNotEmpty) DsSection(title: ${k(L.askRecent)}, children: [for (final e in recent) DsNavTile(glyph: '', title: appStore.displayOf(e['entity'] ?? '', e['rid'] ?? ''), sub: (() { final at = DateTime.tryParse(e['at'] ?? ''); return at == null ? '' : balaganAgo(at, DateTime.now()); })(), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpenRoot(e['entity'] ?? '', e['rid'] ?? ''))))]),   // ב׳-פה · «כבר הוספתי את זה?» — 3 האחרונים, הקשה ⇒ התיק
      if (_note.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 10), child: DsNote(message: _note, label: '', tone: 0)),
      if (_asked && top != null) DsSection(title: ${k(L.askUnderstood)}, children: [   // חזר בלי לשמור ⇒ הזיהוי נשאר על המסך (הקשה אחת חוזרת)
        DsApproveCard(question: ${k(L.askIs)}.replaceAll('{title}', top.module.title).replaceAll('{moment}', top.module.moment), source: _c.text.length > 80 ? _c.text.substring(0, 80) : _c.text, okLabel: ${k(L.askOpen)}, noLabel: ${k(L.askNot)}, onOk: () => _open(context, top, _hits.skip(1).map((h) => h.module).toList()), onNo: _skip),
        if (_hits.length > 1) DsFold(title: ${k(L.askAlso)} + ' (' + (_hits.length - 1).toString() + ')', details: [for (final h in _hits.skip(1)) DsNavTile(glyph: '', title: h.module.title, sub: h.module.moment, onTap: () => _open(context, h))]),
      ]),
    ]);
  }
}
`;
    write(slug, code, dump());
  }

  // ── 3b · «הבנתי כך?» — טופס-האישור: שדות-החובה + מה-שזוהה (≤6 שורות), השאר מקופל; זיכרון-חיים לפי תווית-שדה (הכרעה-29: לא מתחיל מאפס) ──
  {
    const slug = 'balagan_confirm'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «הבנתי כך?»: שורות-לאישור (חובה + זוהה) · «עוד פרטים» מקופל · שמירה ⇒ הרשומה ב«היום» · זיכרון לפי תווית (טלפון/עיר/… פעם אחת לכל המודולים). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_enum_field.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_behaviors.dart';
import 'gen_balagan_moments.dart';
${mods.map((m) => `import 'gen_${m.rootPage.slug}.dart';`).join('\n')}
import 'gen_balagan_home.dart';
import 'gen_balagan_ask.dart';
import 'package:flutter/material.dart';

/// זיכרון-חיים: שדה-טקסט קצר (≤30) נזכר לפי התווית שלו ומוצע בכל מודול עם אותה תווית. מקומי-למכשיר (AppStore.settings).
String balaganRemember(String label) => appStore.setting('mem:' + label);
void balaganLearn(BalaganField f, String v) { if (f.type == 'text' && f.options.isEmpty && v.trim().isNotEmpty && v.trim().length <= 30) appStore.setSetting('mem:' + f.label, v.trim()); }
/// ב׳-לא · צ׳יפי-מועד: תווית ⇒ תאריך דרך אותו מנתח-התאריכים של הרגעים (אפס-כפל-לוגיקה) — «מתי?» בהקשה אחת, אפס-הקלדה; תווית שהמנתח לא מבין נופלת (לא מומצאת)
/// ב׳-לט · פותח-תיק לפי ישות (כל 31 עמודי-השורש) — ל«היום»: הקשה על שורה ⇒ התיק
Widget balaganOpenRoot(String entity, String id) {
  switch (entity) {
${mods.map((m) => `    case '${m.root.slug}': return ${m.rootPage.cls}(id: id);`).join('\n')}
    default: return const SizedBox.shrink();
  }
}
/// ב׳-נ · הקשר לכרטיס-הכפול: המודול · המועד הקרוב של התיק הקיים · ₪ — כדי להכריע «אותו עניין?» בלי לפתוח
/// ב׳-צט · סגירת-תיק בהקשה: שלב אחרון + שורת-המועד טופלה + יומן «סיים» (החזר מחזיר שלב ושורה)
void balaganCloseFile(BalaganModule m, String id) { final r = appStore.byId(m.rootSlug, id); if (r == null) return; final prevStage = r['__stage'] ?? '0'; if (m.stages > 0) appStore.update(m.rootSlug, id, {'__stage': (m.stages - 1).toString()}); final req = m.fields.where((x) => x.type == 'date' && x.required).map((x) => x.label).toList(); final f = req.isNotEmpty ? req.first : (m.dateFields.isNotEmpty ? m.dateFields.first : ''); if (f.isNotEmpty) appStore.decide('ign:' + id + ':' + f, 'no'); appStore.logAction('done', ${k(L.doneLog)}.replaceAll('{what}', appStore.displayOf(m.rootSlug, id)), entity: m.rootSlug, rid: id, field: f, prev: prevStage); }
String balaganDupSub(BalaganModule m, Map<String, String> d, DateTime today) { final parts = <String>[m.title]; for (final f in m.dateFields) { final dd = DateTime.tryParse((d[f] ?? '').trim()); if (dd != null) { parts.add(balaganDayLabel(dd, today)); break; } } for (final f in m.numFields.where((x) => !m.percentFields.contains(x)).take(1)) { final v = double.tryParse((d[f] ?? '').replaceAll(',', '').trim()); if (v != null && v > 0) parts.add('₪ ' + balaganFmtMoney(v)); } return parts.join(' · '); }
List<List<String>> balaganDateChips(DateTime today) => [for (final c in ${k(L.dateChips)}.split('|')) for (final d in balaganDates(c, today).take(1)) [c, d.iso]];
/// ב׳-לג · צ׳יפי-שעה: חלקי-יום דרך אותו balaganTimes של הרגעים (בבוקר 09:00 · בצהריים 13:00 · אחר הצהריים 16:00 · בערב 19:00)
List<List<String>> balaganTimeChips(DateTime now) => [for (final c in ${k(L.timeChips)}.split('|')) for (final t in balaganTimes(c, now: now).take(1)) [c, t.iso]];
/// ב׳-לד · צ׳יפי-חזרה: «כל שבוע» ⇒ קוד-חזרה דרך אותו balaganRepeat של הרגעים (d1 · w1 · m1 · y1) — רגע חוזר בהקשה, אפס-הקלדה
List<List<String>> balaganRepeatChips() => [for (final c in ${k(L.repeatChips)}.split('|')) for (final r in balaganRepeat(c).take(1)) [c, r.iso]];
/// ב׳-לג · צ׳יפי-אנשים: מי שכבר בתיקים (שדות-האדם של כל המודולים, לפי תדירות, עד 6) — «עם מי?» בהקשה; אפס-ניחוש: אין תיקים ⇒ אין צ׳יפים
/// ב׳-פח · הטלפון של אדם מוכר — מהתיקים שכבר יש (שדה-אדם == השם · שדה-טלפון שנראה כמו טלפון)
String _nn(String s) => bhNormName(s);   // G34ב · שכבת-ההרכבה
String balaganPhoneOf(String name) { final n = _nn(name); if (n.length < 2) return ''; for (final m in kBalaganModules) { if (m.phoneFields.isEmpty || m.personFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { if (!m.personFields.any((f) => _nn(r[f] ?? '') == n)) continue; for (final pf in m.phoneFields) { if (bhPhoneDigits(r[pf]).length >= 9) return (r[pf] ?? '').trim(); } } } return ''; }   // G34 · דבק: שם-מנורמל · ספרות-טלפון — חלקיקים
/// ב׳-פט · «כמו בפעם הקודמת»: הסכום (שדה-הכסף הראשי) של התיק האחרון באותו מודול — עם אותו אדם כשיש; מהנתונים, לא ניחוש
String balaganLastAmount(BalaganModule m, String person) { final nf = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); if (nf.isEmpty) return ''; final p = _nn(person); Map<String, String>? best; for (final r in appStore.records(m.rootSlug)) { if (p.isNotEmpty && m.personFields.isNotEmpty && !m.personFields.any((f) => _nn(r[f] ?? '') == p)) continue; final v = (r[nf.first] ?? '').trim(); if (v.isEmpty || (double.tryParse(v.replaceAll(',', '')) ?? 0) <= 0) continue; if (best == null || (r['__at'] ?? '').compareTo(best['__at'] ?? '') >= 0) best = r; } return best == null ? '' : (best[nf.first] ?? '').trim(); }   // «כמו בפעם הקודמת»: הרשומה האחרונה (מאוחר-ביותר לפי __at) של אותו אדם — דבק על חלקיק נרמול-השם
List<String> balaganPeople({int max = 6}) { final counts = <String, int>{}; for (final m in kBalaganModules) { for (final r in appStore.records(m.rootSlug)) { for (final f in m.personFields) { final v = (r[f] ?? '').trim(); if (v.length >= 2) counts[v] = (counts[v] ?? 0) + 1; } } } final names = counts.keys.toList()..sort((a, b) => counts[b]!.compareTo(counts[a]!)); return names.take(max).toList(); }

class ${cls} extends StatefulWidget {
  const ${cls}({required this.module, required this.facts, this.doc = '', this.alternatives = const [], this.text = '', this.queue = const <String>[], super.key});
  final BalaganModule module;
  final List<String> queue;   // רגעים נוספים מאותה שורה — טופס-אישור אחר טופס-אישור, בלי לחזור
  final Map<String, String> facts;
  final List<BalaganModule> alternatives;   // «לא זה? אולי» — החלפת-מודול בתוך הטופס (בלי לחזור)
  final String text;
  final String doc;   // מחסנית-מסמכים: data:URI של הצילום ⇒ נשמר ברשומה כ-'__doc'
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  bool _forceNew = false;
  Widget _openRoot(String entity, String id) => balaganOpenRoot(entity, id);   // ב׳-לט · פותח-אחד לכולם
  late final Map<String, String> _v = {for (final f in widget.module.fields) if (balaganRemember(f.label).isNotEmpty) f.label: balaganRemember(f.label), ...widget.facts};
  Widget _field(BalaganField f) {
    final v = _v[f.label] ?? '';
    if (f.type == 'date') return DsDateField(label: f.label, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    if (f.type == 'num') return DsNumberField(label: f.label, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    if (f.options.isNotEmpty) return DsEnumField(label: f.label, options: f.options, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    return DsField(label: f.label, hint: '', value: v, onChanged: (x) => _v[f.label] = x);
  }
  void _save({bool again = false}) {
    final map = <String, String>{for (final e in _v.entries) if (e.value.trim().isNotEmpty) e.key: e.value.trim()};
    if (map.isEmpty) return;
    for (final f in widget.module.fields) { if (map.containsKey(f.label)) balaganLearn(f, map[f.label]!); }
    final past = widget.module.stages > 0 && balaganIsPast(widget.text);   /* ב׳-קא · לשון-עבר ⇒ נשמר כבוצע */
    final id = appStore.add(widget.module.rootSlug, {...map, if (widget.module.stages > 0) '__stage': past ? (widget.module.stages - 1).toString() : '0', if (widget.doc.isNotEmpty) '__doc': widget.doc});
    appStore.logAction('add', ${k(L.savedLog)}.replaceAll('{title}', widget.module.title + ' · ' + appStore.displayOf(widget.module.rootSlug, id)), entity: widget.module.rootSlug, rid: id);   // «עשיתי» + החזר (מחיקה)
    if (widget.queue.isNotEmpty) { _next(); return; }
    if (again) { Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_ask')}())); return; }   /* ב׳-עח · רשימת-קניות: שומרים וממשיכים לרגע הבא בלי לחזור */
    Navigator.of(context).pop(true);
  }
  void _next() {   // הרגע הבא מאותה שורה: זיהוי ⇒ טופס-אישור במקום הנוכחי
    final t = widget.queue.first; final hits = balaganIdentify(t);
    if (hits.isEmpty) { if (widget.queue.length > 1) { Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => ${cls}(module: widget.module, facts: balaganFacts(t, widget.module), alternatives: const [], text: t, queue: widget.queue.sublist(1)))); } else { Navigator.of(context).pop(true); } return; }
    Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => ${cls}(module: hits.first.module, facts: balaganFacts(t, hits.first.module), alternatives: hits.skip(1).map((h) => h.module).toList(), text: t, queue: widget.queue.sublist(1))));
  }
  @override
  Widget build(BuildContext context) {
    final m = widget.module;
    final dateF = m.fields.every((f) => f.type != 'date') ? '' : m.fields.firstWhere((f) => f.type == 'date' && f.required, orElse: () => m.fields.firstWhere((f) => f.type == 'date')).label;   // ב׳-לא · שדה-המועד של «היום» (הקשה אם יש)
    // ≤6 שורות-לאישור (הכרעה-29 · מסך ב׳): מה-שזוהה תמיד; שדות-חובה עד המכסה; השאר מקופל
    final shown = <BalaganField>[]; for (final f in m.fields) { if (widget.facts.containsKey(f.label)) shown.add(f); } for (final f in m.fields) { if (shown.length >= 6) break; if (f.required && !shown.contains(f)) shown.add(f); }
    if (dateF.isNotEmpty && shown.length < 6 && !shown.any((f) => f.label == dateF)) shown.add(m.fields.firstWhere((f) => f.label == dateF));   // ב׳-לא · המועד תמיד על השולחן — בלי מועד התיק נעלם מ«היום»
    if (m.timeFields.isNotEmpty && shown.length < 6 && !shown.any((f) => f.label == m.timeFields.first)) shown.add(m.fields.firstWhere((f) => f.label == m.timeFields.first));   // ב׳-לג · השעה על השולחן (ביומן היא העיקר)
    if (m.personFields.isNotEmpty && shown.length < 6 && !shown.any((f) => f.label == m.personFields.first)) shown.add(m.fields.firstWhere((f) => f.label == m.personFields.first));   // ב׳-עד · האדם על השולחן (צ׳יפי-אנשים)
    shown.sort((a, b) => m.fields.indexOf(a).compareTo(m.fields.indexOf(b)));
    final rest = m.fields.where((f) => !shown.contains(f)).toList();
    return DsScaffold(title: m.title, subtitle: ${k(L.confirmSub)}, icon: ${k('')}, children: [
      if (m.moment.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: DsNote(message: ${k(L.confirmIs)}.replaceAll('{title}', m.title).replaceAll('{moment}', m.moment) + (balaganTypicalDays(m) > 0 ? ' ' + ${k(L.typicalDays)}.replaceAll('{n}', balaganTypicalDays(m).toString()) : ''), label: '', tone: 0)),   // ב׳-קטו · G38 · מהניסיון שלו, לא ניחוש
      if (widget.alternatives.isNotEmpty) DsFold(title: ${k(L.confirmNot)}.replaceAll('{n}', widget.alternatives.length.toString()), details: [for (final a in widget.alternatives) DsNavTile(glyph: '', title: a.title, sub: a.moment, onTap: () => Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: a, facts: balaganFacts(widget.text, a), doc: widget.doc, alternatives: [for (final x in [widget.module, ...widget.alternatives]) if (x.index != a.index) x], text: widget.text, queue: widget.queue))))]),
      if ((_v['__repeat'] ?? '').isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.confirmRepeat)}.replaceAll('{every}', balaganRepeatLabelFor(_v['__repeat']!, m.dateFields.isEmpty ? '' : (_v[m.dateFields.first] ?? ''))), label: '', tone: 0)),   // ב׳-לד · גם מצ׳יפ · ב׳-קסב · G50
      if (!_forceNew) for (final pr in [balaganPaidRecently(m, _v, DateTime.now())]) if (pr.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.paidAsk)}.replaceAll('{when}', balaganDayLabel(DateTime.parse(pr[1] + 'T12:00:00'), DateTime.now())).replaceAll('{who}', pr[0]), label: '', tone: 2)),   // ב׳-קלא · G42 · אותו מתאר+סכום נסגר ב-7 הימים האחרונים ⇒ אזהרת-כפל (לא חוסם)
      if (m.personFields.isNotEmpty && m.phoneFields.isNotEmpty) for (final who in [balaganPersonByPhone(_v[m.phoneFields.first] ?? '')]) if (who.isNotEmpty && (_v[m.personFields.first] ?? '').trim().toLowerCase() != who.toLowerCase()) Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [Expanded(child: DsNote(message: ${k(L.phoneOf)}.replaceAll('{who}', who), label: '', tone: 0)), const SizedBox(width: 8), DsChipButton(label: ${k(L.phoneYes)}.replaceAll('{who}', who), onTap: () => setState(() => _v[m.personFields.first] = who))])),   // ב׳-קכח · G41 · טלפון מוכר תחת שם אחר ⇒ אותו אדם? (bhPhoneKey)
      if ((_v['__repeat'] ?? '').isEmpty) for (final code in [balaganRecurHint(m, _v)]) if (code.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [Expanded(child: DsNote(message: ${k(L.recurAsk)}.replaceAll('{every}', balaganRepeatLabel(code)), label: '', tone: 0)), const SizedBox(width: 8), DsChipButton(label: ${k(L.recurMark)}.replaceAll('{every}', balaganRepeatLabel(code)), onTap: () => setState(() => _v['__repeat'] = code))])),   // ב׳-קיא · G37 · אותו מתאר חזר במרווחים קבועים ⇒ הצעה לסמן ↻
      if (widget.queue.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.confirmQueue)}.replaceAll('{n}', widget.queue.length.toString()), label: '', tone: 0)),
      if (!_forceNew) for (final d in balaganPastMatches(m, widget.text).take(1)) DsApproveCard(question: ${k(L.pastAsk)}.replaceAll('{who}', appStore.displayOf(m.rootSlug, d['__id'] ?? '')), source: balaganDupSub(m, d, DateTime.now()), okLabel: ${k(L.pastDone)}, noLabel: ${k(L.dupNew)}, onOk: () { balaganCloseFile(m, d['__id'] ?? ''); Navigator.of(context).pop(true); }, onNo: () => setState(() => _forceNew = true)),   // ב׳-צט · «שילמתי ארנונה» + תיק פתוח «לשלם ארנונה» ⇒ «סיימת אותו?» — הקשה אחת סוגרת, עם החזר
      if (!_forceNew) for (final d in balaganDuplicates(m, _v).where((d) => !balaganPastMatches(m, widget.text).contains(d)).take(1)) DsApproveCard(question: ${k(L.dupAsk)}.replaceAll('{who}', appStore.displayOf(m.rootSlug, d['__id'] ?? '')), source: balaganDupSub(m, d, DateTime.now()), okLabel: ${k(L.dupOpen)}, noLabel: ${k(L.dupNew)}, onOk: () { final id = d['__id'] ?? ''; final n = balaganMerge(m, id, {for (final e in _v.entries) if (e.value.trim().isNotEmpty) e.key: e.value, if (widget.doc.isNotEmpty) '__doc': widget.doc}, ${k(L.mergeLog)}.replaceAll('{who}', appStore.displayOf(m.rootSlug, id))); Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => _openRoot(m.rootSlug, id))); if (n == 0) return; }, onNo: () => setState(() => _forceNew = true)),   // «פתח את הקיים» = המידע החדש נכנס לתיק הקיים (שדות ריקים + «מה כתבת» נצבר), עם החזר   // תיק כפול: «זה אותו עניין?» לפני שנפתח תיק שני
      for (final f in shown) ...[_field(f), if (f.label == dateF && (_v[dateF] ?? '').trim().isEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final c in balaganDateChips(DateTime.now())) DsChipButton(label: c[0], onTap: () => setState(() => _v[dateF] = c[1]))])),   // ב׳-לא · «מתי?» — הקשה אחת
        if (f.label == dateF && (_v[dateF] ?? '').trim().isNotEmpty) for (final d in [DateTime.tryParse(_v[dateF]!.trim())]) if (d != null) Padding(padding: const EdgeInsets.only(bottom: 6), child: Text(balaganDayLabel(d, DateTime.now()), style: TextStyle(color: DsLook.of(context).muted, fontSize: 13))),   // ב׳-מג · «מחר» מתחת ל-2026-09-10
        if (f.label == dateF && (_v[dateF] ?? '').trim().isNotEmpty && (_v['__repeat'] ?? '').trim().isEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [Text(${k(L.repeatAsk)}, style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)), for (final c in balaganRepeatChips()) DsChipButton(label: c[0], onTap: () => setState(() => _v['__repeat'] = c[1]))])),   // ב׳-לד · «חוזר?» — אחרי שיש מועד
        if (m.numFields.where((x) => !m.percentFields.contains(x)).isNotEmpty && f.label == m.numFields.where((x) => !m.percentFields.contains(x)).first && (_v[f.label] ?? '').trim().isEmpty) for (final ua in [balaganUsualAmount(m, _v)]) if (ua.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, children: [DsChipButton(label: ${k(L.usualAmount)}.replaceAll('{n}', ua), onTap: () => setState(() => _v[f.label] = ua))])),   // ב׳-קנט · G50 · השכיח, לא הממוצע
        if (m.timeFields.isNotEmpty && f.label == m.timeFields.first && (_v[f.label] ?? '').trim().isEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ut in [balaganUsualTime(m, _v)]) if (ut.isNotEmpty) DsChipButton(label: ${k(L.usualTime)}.replaceAll('{t}', ut), onTap: () => setState(() => _v[m.timeFields.first] = ut)), /* ב׳-קלט · G44 · מהניסיון שלו */ for (final c in balaganTimeChips(DateTime.now())) DsChipButton(label: c[0], onTap: () => setState(() => _v[m.timeFields.first] = c[1]))])),   // ב׳-לג · «באיזו שעה?»
        if (m.personFields.isNotEmpty && f.label == m.personFields.first && (_v[f.label] ?? '').trim().isEmpty) for (final people in [balaganPeople()]) if (people.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final p in people) DsChipButton(label: p, onTap: () => setState(() { _v[m.personFields.first] = p; if (m.phoneFields.isNotEmpty && (_v[m.phoneFields.first] ?? '').trim().isEmpty) { final ph = balaganPhoneOf(p); if (ph.isNotEmpty) _v[m.phoneFields.first] = ph; } }))])),   // ב׳-לג · «עם מי?» — מי שכבר בתיקים · ב׳-פח · והטלפון שלו כבר בתיקים ⇒ ממולא
        if (m.numFields.isNotEmpty && f.type == 'num' && !m.percentFields.contains(f.label) && f.label == m.numFields.firstWhere((x) => !m.percentFields.contains(x), orElse: () => '') && (_v[f.label] ?? '').trim().isEmpty) for (final a in [balaganLastAmount(m, m.personFields.isEmpty ? '' : (_v[m.personFields.first] ?? ''))]) if (a.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 8, children: [DsChipButton(label: ${k(L.amountLast)}.replaceAll('{n}', a), onTap: () => setState(() => _v[f.label] = a))]))],   // ב׳-פט · «₪ 1,500 כמו בפעם הקודמת» — הסכום מהתיק האחרון (אותו אדם אם יש), מהנתונים
      if (rest.isNotEmpty) DsFold(title: ${k(L.confirmMore)}.replaceAll('{n}', rest.length.toString()), details: [for (final f in rest) _field(f)]),
      Padding(padding: const EdgeInsets.only(top: 10), child: Row(children: [DsChipButton(label: ${k(L.saveAgain)}, onTap: () => _save(again: true))])),   // ב׳-עח
      Padding(padding: const EdgeInsets.only(top: 14), child: DsPrimaryButton(label: (() { if (m.stages > 0 && balaganIsPast(widget.text)) return ${k(L.saveDone)}; /* ב׳-קא */ if (dateF.isEmpty) return ${k(L.askSave)}; final d = DateTime.tryParse((_v[dateF] ?? '').trim()); if (d == null) return ${k(L.askSave)}; final t0 = DateTime.now(); final n = -bhDaysSince(bhIso(d), bhIso(t0)); return n == 0 ? ${k(L.askSave)} : n < 0 ? ${k(L.savePast)} : ${k(L.saveWhen)}.replaceAll('{day}', balaganDayLabel(d, t0)); })(), onTap: () => _save())   /* ב׳-סא · «יופיע במחר» — האדם יודע לאן זה הולך */),
    ]);
  }
}
`;
    write(slug, code, dump());
  }

  // ── 4 · «חיבורים» (מפתחות-הלקוח) · «נושאים» · «התנהגות» ──
  const bh = renderBehavior('balagan_behavior', { extraFields: [['minAdd', '4', 'minAddLabel'], ['minSend', '12', 'minSendLabel'], ['minAuto', '3', 'minAutoLabel'], ['eveningHour', '18', 'eveningHourLabel']] });   // שמירת-זמן (§המוצר): הדקות-לפעולה עריכות, לא קבועות
  {
    const slug = 'balagan_keys'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29 · חוק-6) — «חיבורים»: המפתחות של הלקוח, במכשיר בלבד. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import 'gen_balagan_home.dart';
import 'gen_balagan_moments.dart';   // G46 · balaganImportCsv
import 'gen_behaviors.dart';   // G50 · bhTextScale
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  String _paste = '', _note = '';
  // גיבוי = טקסט (אותו JSON של ההתמדה) שהלקוח שומר איפה שנוח; שחזור מחליף הכל ושומר את הקודם פעם אחת ⇒ «בטל שחזור». אפס-שרת (חוק-6).
  Future<void> _copy() async { final t = appStore.exportJson(); await Clipboard.setData(ClipboardData(text: t)); appStore.setSetting('backupAt', DateTime.now().toIso8601String().substring(0, 10)); setState(() => _note = ${k(L.backupCopied)}.replaceAll('{n}', t.length.toString())); }
  void _restore() { final n = appStore.importJson(_paste); setState(() { _note = n < 0 ? ${k(L.backupBad)} : ${k(L.backupRestored)}.replaceAll('{n}', n.toString()); if (n >= 0) _paste = ''; }); }
  void _undo() { final ok = appStore.undoImport(); setState(() => _note = ok ? ${k(L.backupUndone)} : ${k(L.backupBad)}); }
  String _csv = '', _csvNote = '', _vcf = '', _vcfNote = '';
  void _importVcf() { final r = balaganImportVcf(_vcf); setState(() { _vcfNote = r[1] == 0 && r[0] == 0 ? ${k(L.vcfNone)} : ${k(L.vcfImported)}.replaceAll('{n}', r[0].toString()).replaceAll('{m}', r[1].toString()); if (r[0] > 0) _vcf = ''; }); }   // ב׳-קנד · G48
  void _importCsv() { final r = balaganImportCsv(_csv); setState(() { _csvNote = (r[1] as int) == 0 ? ${k(L.csvNoMatch)} : ${k(L.csvImported)}.replaceAll('{n}', r[1].toString()).replaceAll('{module}', r[0] as String); if ((r[1] as int) > 0) _csv = ''; }); }   // ב׳-קמח · G46
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) => DsScaffold(title: ${k(L.keysTitle)}, subtitle: ${k(L.keysSub)}, icon: ${k('')}, children: [
    DsSection(title: ${k(L.backupTitle)}, children: [
      for (final d in [DateTime.tryParse(appStore.setting('backupAt'))]) Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(d == null ? ${k(L.backupNever)} : ${k(L.backupLast)}.replaceAll('{d}', balaganDayLabel(d, DateTime.now())), style: TextStyle(color: DsLook.of(context).muted, fontSize: 13))),   // ב׳-מז · מתי גיבית לאחרונה
      DsPrimaryButton(label: ${k(L.backupCopy)}, onTap: _copy),
      Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.exportAll)}, onTap: () async { final t = balaganCsvAll(); await Clipboard.setData(ClipboardData(text: t)); setState(() => _note = ${k(L.exportAllDone)}.replaceAll('{n}', (t.split('\\n').length - 1).toString())); })])),   // ב׳-קנא · G47 · כל התיקים לאקסל
      Padding(padding: const EdgeInsets.only(top: 8), child: DsField(label: ${k(L.backupPasteLabel)}, hint: '{…}', value: _paste, onChanged: (v) => _paste = v)),
      Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.backupRestore)}, onTap: _restore), const SizedBox(width: 8), DsChipButton(label: ${k(L.backupUndo)}, onTap: _undo)])),
      if (_note.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: _note, label: '', tone: 0)),
      Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.backupNote)}, label: '', tone: 0)),
    ]),
    DsSection(title: ${k(L.csvImportTitle)}, children: [
      DsField(label: ${k(L.csvPasteLabel)}, hint: 'מה,מועד,סכום', value: _csv, onChanged: (v) => _csv = v),
      Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.csvImport)}, onTap: _importCsv)])),
      if (_csvNote.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: _csvNote, label: '', tone: 0)),   // ב׳-קמח · G46 · ייבוא CSV לפי שמות-שדות
    ]),
    DsSection(title: ${k(L.vcfTitle)}, children: [
      DsField(label: ${k(L.vcfPasteLabel)}, hint: 'BEGIN:VCARD…', value: _vcf, onChanged: (v) => _vcf = v),
      Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.vcfImport)}, onTap: _importVcf)])),
      if (_vcfNote.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: _vcfNote, label: '', tone: 0)),   // ב׳-קנד · G48 · אנשי-קשר ⇒ ספר-טלפונים (לא תיקים)
      Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.installNote)}, label: '', tone: 0)),
    ]),
    DsField(label: ${k(L.aiKeyLabel)}, hint: ${k(L.aiKeyHint)}, value: appStore.setting('ai.key'), onChanged: (v) => appStore.setSetting('ai.key', v.trim())),
    DsField(label: ${k(L.budgetLabel)}, hint: ${k(L.budgetHint)}, value: appStore.setting('budget'), onChanged: (v) => appStore.setSetting('budget', v.trim())),   // ב׳-קלב · G42
    Padding(padding: const EdgeInsets.only(top: 10), child: Row(children: [Text(${k(L.textSizeLabel)}, style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)), const SizedBox(width: 10), DsChipButton(label: ${k(L.textSizeSmaller)}, onTap: () => appStore.setSetting('textScale', bhTextScaleStep(bhTextScale(appStore.setting('textScale')), -1).toString())), const SizedBox(width: 8), Text((bhTextScale(appStore.setting('textScale')) * 100).round().toString() + '%'), const SizedBox(width: 8), DsChipButton(label: ${k(L.textSizeBigger)}, onTap: () => appStore.setSetting('textScale', bhTextScaleStep(bhTextScale(appStore.setting('textScale')), 1).toString()))])),   // ב׳-קסא · G50 · נגישות: 80%–160% (clampScale · stepScale מהמדף)
    DsField(label: ${k(L.aiModelLabel)}, hint: ${k(L.aiModelHint)}, value: appStore.setting('ai.model'), onChanged: (v) => appStore.setSetting('ai.model', v.trim())),
    Padding(padding: const EdgeInsets.only(top: 12), child: DsNote(message: ${k(L.keysNote)}, label: '', tone: 0)),
    DsField(label: ${k(L.mailTokenLabel)}, hint: ${k(L.mailTokenHint)}, value: appStore.setting('mail.token'), onChanged: (v) => appStore.setSetting('mail.token', v.trim())),
    Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.mailNote)}, label: '', tone: 0)),
    Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.keysSoon)}, label: '', tone: 0)),
  ]));
}
`;
    write(slug, code, dump());
  }
  {
    const slug = 'balagan_topics'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    mods.forEach((m) => { if (m.layer === 'base') m.topic = L.topicsBase; });
    const order = [L.topicsBase, ...TOPICS.map((t) => t.name), L.topicOther].filter((t) => mods.some((m) => m.topic === t));
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «נושאים»: ${order.length} נושאים (מסמך-המוצר §7) ⇒ ${mods.length} מודולים לפי חפיפת-מילים · חיבורים · התנהגות. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'gen_balagan_behavior.dart';
import 'gen_balagan_keys.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';\nimport 'gen_${m.rootPage.slug}.dart';`).join('\n')}
import 'gen_balagan_moments.dart';
import 'gen_balagan_home.dart';
import 'package:flutter/services.dart';
import 'gen_behaviors.dart';
import 'gen_balagan_confirm.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/material.dart';

/// ב׳-לה · כרטיס-אדם: כל התיקים של אדם חוצה-מודולים (שדות-האדם), נגזרת טהורה — תיקים · פתוחים · ₪ פתוח (שדה-הסכום הראשי של הפתוחים) · טלפונים · נגיעה אחרונה. אין תיקים ⇒ null
class BalaganPerson { const BalaganPerson(this.name, this.files, this.open, this.money, this.phones, this.last, [this.rids = const []]); final String name; final int files, open; final double money; final List<String> phones; final String last; final List<String> rids; }
BalaganPerson? balaganPerson(String name) {
  final n = name.trim().toLowerCase(); if (n.length < 2) return null; final al = balaganAliases(n);   /* ב׳-קו · רותי לוי עם אותו טלפון = רות לוי */
  var files = 0, open = 0; var money = 0.0; final phones = <String>{}; var last = ''; final rids = <String>[];
  for (final m in kBalaganModules) {
    if (m.personFields.isEmpty) continue;
    final numF = m.numFields.where((f) => !m.percentFields.contains(f)).toList();
    for (final r in appStore.records(m.rootSlug)) {
      if (!m.personFields.any((f) => al.contains((r[f] ?? '').trim().toLowerCase()))) continue;
      files++; rids.add(r[AppStore.idKey] ?? '');
      final isOpen = m.stages == 0 || appStore.stageOf(m.rootSlug, r[AppStore.idKey] ?? '') < m.stages - 1;
      if (isOpen) { open++; if (numF.isNotEmpty) money += bhMoney(r[numF.first]); }
      for (final f in m.phoneFields) { final p = (r[f] ?? '').trim(); if (p.isNotEmpty) phones.add(p); }
      final at = (r['__at'] ?? '').length >= 10 ? (r['__at'] ?? '').substring(0, 10) : ''; if (at.compareTo(last) > 0) last = at; for (final e in appStore.log) { if (e['rid'] != (r[AppStore.idKey] ?? '') || e['undone'] == '1') continue; final la = (e['at'] ?? '').length >= 10 ? e['at']!.substring(0, 10) : ''; if (la.compareTo(last) > 0) last = la; }   /* ב׳-עא · נגיעה-אחרונה = גם פעולות ביומן, לא רק יצירה */
    }
  }
  return files == 0 ? null : BalaganPerson(name.trim(), files, open, money, phones.toList(), last, rids);
}
/// טלפון ⇒ בינלאומי ל-wa.me (0… ⇒ 972…; + נופל) — אותו כלל של כרטיס-התיק
/// ב׳-לח · כרטיס-אדם מחיפוש-חלקי: «שגב» ⇒ נועה שגב אם היא היחידה שמכילה; שניים ⇒ אין כרטיס (לא מנחשים)
List<String> balaganPersonNames() { final out = <String>{}; for (final m in kBalaganModules) { for (final r in appStore.records(m.rootSlug)) { for (final f in m.personFields) { final v = (r[f] ?? '').trim(); if (v.length >= 2) out.add(v); } } } return out.toList(); }
BalaganPerson? balaganPersonFor(String q) { final t = q.trim().toLowerCase(); if (t.length < 2) return null; final exact = balaganPerson(t); if (exact != null) return exact; final c = balaganPersonNames().where((n) => n.toLowerCase().contains(t) || bhSameName(n, t)).toList(); return c.length == 1 ? balaganPerson(c.first) : null; }   // ב׳-קג · גם סדר-מילים הפוך
/// ב׳-נב · כמה תיקים פתוחים במודול (שלב < אחרון; בלי שלבים = הכל) — «דירה · 3 פתוחים»; 0 ⇒ ריק
String balaganOpenCount(String slug, int stages) { final n = bhOpenCount(appStore.records(slug), stages); return n == 0 ? '' : ${k(L.openCount)}.replaceAll('{n}', n.toString()); }   // G34ב · ב׳-נב
/// ב׳-צ · מה שפתוח עם אדם — שורה לכל תיק פתוח (כותרת · מודול · מועד · ₪), חוצה-מודולים, מהנתונים
String balaganPersonOpenText(String name, DateTime today) { final n = name.trim().toLowerCase(); if (n.length < 2) return ''; final lines = <String>[]; for (final m in kBalaganModules) { if (m.personFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { if (!m.personFields.any((f) => (r[f] ?? '').trim().toLowerCase() == n)) continue; final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; lines.add('• ' + appStore.displayOf(m.rootSlug, rid) + ' · ' + balaganDupSub(m, r, today)); } } return lines.isEmpty ? '' : ${k(L.personSendTitle)}.replaceAll('{who}', name.trim()) + '\\n' + lines.join('\\n'); }
/// ב׳-קכז · פתוחים לפי נושא: [n, ₪] על כל מודולי-הנושא (bhOpenCount · bhMoney)
List<num> balaganTopicOpen(String topic) { var n = 0; var money = 0.0; for (final m in kBalaganModules) { if (m.topic != topic) continue; n += bhOpenCount(appStore.records(m.rootSlug), m.stages); final fs = m.numFields.where((f) => !m.percentFields.contains(f)).toList(); if (fs.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { final rid = r[AppStore.idKey] ?? ''; if (m.stages > 0 && appStore.stageOf(m.rootSlug, rid) >= m.stages - 1) continue; money += bhMoney(r[fs.first]); } } return [n, money]; }
/// ב׳-קב · חיפוש-סלחן מדורג: כל התיקים בכל המודולים, ציון-שדה דרך bhSearchScore (מדויק › קידומת › מכיל › שגיאת-כתיב אחת) — «ארנונא» מוצא «ארנונה»; שאילתת-ספרות ⇒ חיפוש-המחסן (ספרות-מול-ספרות)
List<List<String>> balaganSearchRanked(String q) { final t = q.trim(); if (t.length < 2) return const []; if (bhDigitsQuery(t).isNotEmpty) return appStore.search(t); final out = <List<dynamic>>[]; for (final slug in {for (final m in kBalaganModules) m.rootSlug}) { for (final r in appStore.records(slug)) { var best = 0; var text = ''; for (final e in r.entries) { if (e.key == AppStore.idKey || e.key == '__doc' || e.key == '__at' || e.key == '__stage') continue; final sc = bhSearchScore(t, e.value); if (sc > best) { best = sc; text = e.value; } } if (best > 0) out.add([slug, r[AppStore.idKey] ?? '', text, best]); } } out.sort((a, b) => (b[3] as int).compareTo(a[3] as int)); return [for (final h in out) [h[0] as String, h[1] as String, h[2] as String]]; }
String balaganIntl(String ph) => bhWaPhone(ph);   // ב׳-קט · G36 · 972 + מפתח-הטלפון-הקנוני (bhPhoneKey) — הדבק הידני הוחלף בחלקיק

/// ב׳-קלח · G44 · היסטוריית-אדם: כל שורות-היומן של תיקי-האדם (כולל כינויים), חדש ⇒ ישן
class BalaganPersonLog extends StatelessWidget {
  const BalaganPersonLog({required this.name, super.key});
  final String name;
  @override
  Widget build(BuildContext context) {
    final p = balaganPerson(name); final rows = p == null ? const <Map<String, String>>[] : appStore.log.where((e) => e['undone'] != '1' && p.rids.contains(e['rid'] ?? '')).toList();
    return DsScaffold(title: ${k(L.personLogTitle)}.replaceAll('{who}', name), subtitle: ${k(L.personLogSub)}, icon: ${k('')}, children: [
      if (rows.isEmpty) DsNote(message: ${k(L.monthNone)}, label: '', tone: 0),
      for (final e in rows) DsLogRow(text: e['what'] ?? '', sub: (() { final at = DateTime.tryParse(e['at'] ?? ''); return at == null ? '' : balaganDayLabel(at, DateTime.now()) + ' · ' + balaganAgo(at, DateTime.now()); })(), undoLabel: '', onUndo: null),
    ]);
  }
}
class ${cls} extends StatefulWidget {
  const ${cls}({this.initialQuery = '', super.key});
  final String initialQuery;   // ב׳-לו · «רות לוי» בשורה-המהירה ⇒ הכרטיס שלה, לא תיק חדש
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  late String _q = widget.initialQuery;
  // חיפוש בכל התיקים (30 מודולים, כל שדה, גם «מה כתבת») ⇒ פתיחת התיק. במכשיר-בלי-מקלדת אין ⌘K — זה המסך.
  static const Map<String, String> _titleOf = {${mods.map((m) => `'${m.root.slug}': ${dq(m.title)}`).join(', ')}};
  Widget _open(String entity, String id) {
    switch (entity) {
${mods.map((m) => `      case '${m.root.slug}': return ${m.rootPage.cls}(id: id);`).join('\n')}
      default: return const SizedBox.shrink();
    }
  }
  @override
  Widget build(BuildContext context) {
    final hits = balaganSearchRanked(_q);   // ב׳-קב · G35
    return DsScaffold(title: ${k(L.topicsTitle)}, subtitle: ${k(L.topicsSub)}, icon: ${k('')}, children: [
    DsField(label: ${k(L.searchLabel)}, hint: ${k(L.searchHint)}, value: _q, onChanged: (v) => setState(() => _q = v)),
    for (final dd in [balaganDates(_q.trim(), DateTime.now())]) if (_q.trim().isNotEmpty && dd.length == 1 && dd.first.start == 0 && dd.first.end == _q.trim().length) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.openDay)}.replaceAll('{day}', balaganDayLabel(DateTime.parse(dd.first.iso + 'T12:00:00'), DateTime.now())), onTap: () { final n = DateTime.now(); Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganDay(delta: -bhDaysSince(dd.first.iso, bhIso(n))))); })])),   // ב׳-סח · «מחר» בחיפוש ⇒ מסך-היום
    for (final fo in [balaganFieldOf(_q)]) if (fo.isNotEmpty) for (final fv in [balaganFieldValue(fo[0], fo[1])]) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: fv.isEmpty ? ${k(L.fieldNone)}.replaceAll('{field}', fo[0]).replaceAll('{who}', fo[1]) : ${k(L.fieldAnswer)}.replaceAll('{who}', fv[0]).replaceAll('{field}', fv[1]).replaceAll('{value}', fv[2]), label: '', tone: 0)),   // ב׳-קנג · G47 · «טלפון של רות לוי» ⇒ הערך מהתיק
    for (final w in [balaganWhenOf(_q)]) if (w.isNotEmpty) for (final ld in [balaganLastDone(w)]) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ld.isEmpty ? ${k(L.whenNone)}.replaceAll('{what}', w) : ${k(L.whenAnswer)}.replaceAll('{what}', ld[0]).replaceAll('{day}', balaganDayLabel(DateTime.parse(ld[1] + 'T12:00:00'), DateTime.now())).replaceAll('{ago}', ${k(L.lastTalk)}.replaceAll('{n}', bhDaysSince(ld[1], bhIso(DateTime.now())).toString())), label: '', tone: 0)),   // ב׳-קמד · G45 · «מתי X» ⇒ הפעם האחרונה מהיומן
    for (final rg in [balaganRangeOf(_q, DateTime.now())]) if (rg.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.openRange)}.replaceAll('{from}', bhDayMonth(rg[0], false)).replaceAll('{to}', bhDayMonth(rg[1], false)).replaceAll('{n}', balaganRangeItems(rg[0], rg[1]).length.toString()), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganRange(from: rg[0], to: rg[1]))))])),   // ב׳-קל · G42 · «בין 1.9 ל-15.9»
    for (final wd in [balaganWeekOf(_q)]) if (wd != null) for (final rg in [bhWeekRange(bhIso(DateTime.now()), wd)]) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.openWeek)}.replaceAll('{week}', balaganWeekName(wd)).replaceAll('{n}', balaganRangeItems(rg[0], rg[1]).length.toString()), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganWeek(delta: wd))))])),   // ב׳-קכב · G40
    for (final af in [balaganAmountFilter(_q)]) if (af.isNotEmpty) for (final items in [balaganAmountItems(af[0], af[1])]) DsSection(title: (af[0] == '>' ? ${k(L.amountAbove)} : ${k(L.amountBelow)}).replaceAll('{n}', balaganFmtMoney(double.tryParse(af[1]) ?? 0)).replaceAll('{m}', items.length.toString()), children: [for (final it in items.take(30)) DsNavTile(glyph: '', title: (_titleOf[it[0]] ?? it[0]) + ' · ' + appStore.displayOf(it[0], it[1]), sub: '₪ ' + it[2], onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _open(it[0], it[1]))))]),   // ב׳-קכג · G40 · «מעל 5000»
    for (final mk in [balaganMonthOf(_q, DateTime.now())]) if (mk.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.openMonth)}.replaceAll('{month}', balaganMonthName(mk)).replaceAll('{n}', balaganMonthItems(mk).length.toString()), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganMonth(monthKey: mk))))])),   // ב׳-קכא · G39 · «ספטמבר» ⇒ מסך-החודש
    for (final p in [balaganPersonFor(_q)]) if (p != null) DsSection(title: p.name, children: [
      Text(${k(L.personLine)}.replaceAll('{n}', p.files.toString()).replaceAll('{open}', p.open.toString()) + (p.money > 0 ? ' · ' + ${k(L.personMoney)}.replaceAll('{n}', balaganFmtMoney(p.money)) : '') + (p.last.isNotEmpty ? ' · ' + ${k(L.personLast)}.replaceAll('{d}', (() { final d = DateTime.tryParse(p.last); return d == null ? p.last : balaganDayLabel(d, DateTime.now()); })()) : ''), style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)),
      if (p.open > 0) for (final t in [balaganPersonOpenText(p.name, DateTime.now())]) if (t.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.personSend)}, onTap: () { appStore.logAction('send', ${k(L.personSend)} + ' · ' + p.name); Clipboard.setData(ClipboardData(text: t)); launchUrl(Uri.parse('https://wa.me/' + (p.phones.isEmpty ? '' : balaganIntl(p.phones.first)) + '?text=' + Uri.encodeComponent(t)), mode: LaunchMode.externalApplication); })])),   // ב׳-צ · «שלח לו את הפתוחים» — ההודעה מוכנה מהתיקים, ללוח + לוואטסאפ שלו
      if (p.phones.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ph in p.phones.take(2)) ...[DsChipButton(label: ${k(L.callLabel)} + ' ' + bhPhoneFmt(ph), onTap: () => launchUrl(Uri.parse('tel:' + ph), mode: LaunchMode.externalApplication)), DsChipButton(label: ${k(L.waLabel)}, onTap: () => launchUrl(Uri.parse('https://wa.me/' + balaganIntl(ph)), mode: LaunchMode.externalApplication))]])),
      for (final nAll in [appStore.log.where((e) => e['undone'] != '1' && p.rids.contains(e['rid'] ?? '')).length]) if (nAll > 3) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.allHistory)}.replaceAll('{n}', nAll.toString()), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => BalaganPersonLog(name: p.name))))])),   // ב׳-קלח · G44
      for (final recent in [appStore.log.where((e) => e['undone'] != '1' && p.rids.contains(e['rid'] ?? '')).take(3).toList()]) if (recent.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(${k(L.personRecent)}, style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)), for (final e in recent) DsLogRow(text: e['what'] ?? '', sub: (() { final at = DateTime.tryParse(e['at'] ?? ''); return at == null ? '' : balaganAgo(at, DateTime.now()); })(), undoLabel: '', onUndo: null)])),   // ב׳-פג · מה עשיתי איתו לאחרונה
      Padding(padding: const EdgeInsets.only(top: 8), child: DsQuickAdd(hint: ${k(L.personQuick)}.replaceAll('{who}', p.name), autofocus: false, onSubmit: (s0) { final s = s0.trim(); if (s.isEmpty) return; final hits = balaganIdentify(s); if (hits.isEmpty) return; final m = hits.first.module; final facts = balaganFacts(s, m); if (m.personFields.isNotEmpty && !m.personFields.any((f) => (facts[f] ?? '').trim().isNotEmpty)) facts[m.personFields.first] = p.name; Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: m, facts: facts, alternatives: hits.skip(1).map((h) => h.module).toList(), text: s))); })),   // ב׳-נח · רגע עם האדם הזה: השם כבר בטופס
    ]),   // ב׳-לה · כרטיס-אדם: השם בחיפוש = אדם מהתיקים ⇒ סיכום + התקשר/וואטסאפ מעל התוצאות
    if (_q.trim().length >= 2 && hits.isEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.searchNone)}, label: '', tone: 0)),
    if (_q.trim().length >= 2 && hits.isEmpty) for (final sug in [bhClosest(_q, [...balaganPersonNames(), ..._titleOf.values])]) if (sug.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.didYouMean)}.replaceAll('{s}', sug), onTap: () => setState(() => _q = sug))])),   // ב׳-קז · «התכוונת ל…?» — הקרוב ביותר במרחק-עריכה מבין האנשים והמודולים
    if (_q.trim().isEmpty) ...(() { final counts = <String, int>{}; for (final m in kBalaganModules) { if (m.personFields.isEmpty) continue; for (final r in appStore.records(m.rootSlug)) { for (final f in m.personFields) { final v = (r[f] ?? '').trim(); if (v.length >= 2) counts[v] = (counts[v] ?? 0) + 1; } } } final names = counts.keys.toList()..sort((a, b) => counts[b]!.compareTo(counts[a]!)); final covered = <String>{}; final rows = <List<String>>[]; for (final n in names) { if (covered.contains(n.toLowerCase())) continue; final al = balaganAliases(n); covered.addAll(al); final others = [for (final x in names) if (x != n && al.contains(x.toLowerCase())) x]; rows.add([n, others.join(' · ')]); }   /* ב׳-קו · אותו אדם בכמה שמות = צ׳יפ אחד */ return rows.isEmpty ? <Widget>[] : [DsSection(title: ${k(L.peopleTitle)}, children: [for (final nd in [rows.where((r) => r[1].isNotEmpty).length]) if (nd > 0) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.dupPeopleNote)}.replaceAll('{n}', nd.toString()), label: '', tone: 0)), /* ב׳-קמט · G46 */ Wrap(spacing: 8, runSpacing: 8, children: [for (final row in rows.take(12)) DsChipButton(label: [row[0], for (final p in [balaganPerson(row[0])]) if (p != null) p.files.toString(), for (final p in [balaganPerson(row[0])]) if (p != null && p.money > 0) '₪ ' + balaganFmtMoney(p.money), for (final p in [balaganPerson(row[0])]) if (p != null && p.open > 0 && p.last.length >= 10 && bhDaysSince(p.last, bhIso(DateTime.now())) >= 14) (bhDaysSince(p.last, bhIso(DateTime.now())) >= 60 ? ${k(L.agoMonths)}.replaceAll('{n}', bhMonthsAgo(p.last, bhIso(DateTime.now())).toString()) : ${k(L.lastTalk)}.replaceAll('{n}', bhDaysSince(p.last, bhIso(DateTime.now())).toString())), /* ב׳-קס · G50 */ /* ב׳-קכ · G39 · תיק פתוח ואין נגיעה 14 יום */ if (row[1].isNotEmpty) ${k(L.alias)}.replaceAll('{names}', row[1])].join(' · '), onTap: () => setState(() => _q = row[0]))])])]; })(),   // «אנשים»: מי מופיע בתיקים (שדות-אדם מכל המודולים) ⇒ הקשה = חיפוש לפי השם
    if (_q.trim().isEmpty) for (final top in [balaganTopDescs()]) if (top.isNotEmpty) DsSection(title: ${k(L.topDesc)}, children: [Wrap(spacing: 8, runSpacing: 8, children: [for (final t in top.take(8)) DsChipButton(label: (t[0] as String) + ' · ' + t[1].toString(), onTap: () => setState(() => _q = t[0] as String))])]),   // ב׳-קלו · G43 · מה חוזר הכי הרבה בתיקים ⇒ הקשה = חיפוש
    if (_q.trim().isEmpty) ...(() { final seen = <String>{}; final rows = <Widget>[]; for (final e in appStore.log) { if (rows.length >= 5) break; final ent = e['entity'] ?? '', rid = e['rid'] ?? ''; if (ent.isEmpty || rid.isEmpty || e['undone'] == '1' || !_titleOf.containsKey(ent) || !seen.add(ent + '|' + rid) || appStore.byId(ent, rid) == null) continue; rows.add(DsNavTile(glyph: '', title: (_titleOf[ent] ?? ent) + ' · ' + appStore.displayOf(ent, rid), sub: [(() { final at = DateTime.tryParse(e['at'] ?? ''); return at == null ? '' : balaganAgo(at, DateTime.now()); })(), e['what'] ?? ''].where((x) => x.isNotEmpty).join(' · '), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _open(ent, rid))))); } return rows.isEmpty ? <Widget>[] : [DsSection(title: ${k(L.recentTitle)}, children: rows)]; })(),   // «איפה הייתי»: התיקים שנגעת בהם לאחרונה, מהיומן
    if (hits.isNotEmpty) DsSection(title: ${k(L.searchTitle)}.replaceAll('{n}', hits.length.toString()), children: [for (final h in hits.take(30)) DsNavTile(glyph: '', title: (_titleOf[h[0]] ?? h[0]) + ' · ' + appStore.displayOf(h[0], h[1]), sub: (() { final ms = kBalaganModules.where((m) => m.rootSlug == h[0]); final r = appStore.byId(h[0], h[1]); final ctx = ms.isEmpty || r == null ? '' : balaganDupSub(ms.first, r, DateTime.now()); final t = h[2].length > 60 ? h[2].substring(0, 60) + '…' : h[2]; return [ctx, t].where((x) => x.isNotEmpty).join(' · '); })(), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _open(h[0], h[1]))))]),
${order.map((t) => `    for (final to in [balaganTopicOpen(${dq(t)})]) DsSection(title: ${k(t)} + ((to[0] as int) > 0 ? ' · ' + ${k(L.openCount)}.replaceAll('{n}', to[0].toString()) + (to[1] > 0 ? ' · ' + ${k(L.moneyShort)}.replaceAll('{n}', balaganFmtMoney(to[1].toDouble())) : '') : ''), children: [
${mods.filter((m) => m.topic === t).map((m) => `      DsNavTile(glyph: '', title: ${k(m.title)}, sub: [${k(m.moment)}, balaganOpenCount('${m.root.slug}', ${(m.root.stages || []).length})].where((x) => x.isNotEmpty).join(' · '), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${m.root.cls}()))),`).join('\n')}
    ]),`).join('\n')}
    DsSection(title: ${k(L.topicsSystem)}, children: [
      DsNavTile(glyph: '', title: ${k(L.keysTitle)}, sub: ${k(L.keysSub)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${clsOf('balagan_keys')}()))),
      DsNavTile(glyph: '', title: ${k(L.behaviorTitle)}, sub: ${k(L.behaviorSub)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${bh.cls}()))),
    ]),
  ]);
  }
}
`;
    write(slug, code, dump());
  }

  // ── 5 · השלד: היום · מה קרה? · נושאים + מקשים + פלטה ──
  {
    const slug = 'balagan_shell'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const imports = new Set();
    const firstWired = (pick, ctx) => { const w = pickWired([...pick.atoms, ...pick.alts], (c) => wireAtom(c, ctx)); if (w) imports.add(impOf(w)); return w; };
    const labels = [L.navToday, L.navAsk, L.navTopics];
    const nav = firstWired(searchOp('switch', `${L.balaganTitle} ${labels.join(' ')}`, ['items', 'selected', 'onSelect'], 12), { items: `[${labels.map((l) => k(l)).join(', ')}]`, selected: '_t', onSelect: '(i) => setState(() => _t = i)', bare: true, must: ['items', 'selected', 'onSelect'] });
    const paletteItems = `[DsPaletteItem(label: ${k(L.navAsk)}, sub: ${k(L.askSub)}, onTap: () => setState(() => _t = 1)), ${mods.map((m) => `DsPaletteItem(label: ${k(m.title)}, sub: ${k(m.moment)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${m.root.cls}())))`).join(', ')}]`;
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — השלד של בלגן: היום · מה קרה? · נושאים. T/A/N · Ctrl/Cmd+K. אל תערוך ידנית.
${nav ? '' : '//   ⚪ ' + L.shellNoNav}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'gen_balagan_ask.dart';
import 'gen_balagan_home.dart';
import 'gen_balagan_topics.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';`).join('\n')}
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  // שיתוף-מהמכשיר (share_target במניפסט ⇒ ?text=/?title=/?url=): נפתחים ישר ב«מה קרה?» עם הטקסט
  static String _sharedText() { try { final q = Uri.base.queryParameters; return [q['text'] ?? '', q['title'] ?? '', q['url'] ?? ''].where((x) => x.trim().isNotEmpty).join(' '); } catch (_) { return ''; } }
  late int _t = _sharedText().isEmpty ? 0 : 1;
  @override
  Widget build(BuildContext context) => CallbackShortcuts(
    bindings: <ShortcutActivator, VoidCallback>{
      const SingleActivator(LogicalKeyboardKey.keyT, alt: true): () => setState(() => _t = 0),
      const SingleActivator(LogicalKeyboardKey.keyA, alt: true): () => setState(() => _t = 1),
      const SingleActivator(LogicalKeyboardKey.keyN, alt: true): () => setState(() => _t = 2),
      const SingleActivator(LogicalKeyboardKey.keyK, control: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
      const SingleActivator(LogicalKeyboardKey.keyK, meta: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
    },
    child: Focus(autofocus: true, child: Scaffold(
      backgroundColor: DsLook.of(context).bg,
      body: IndexedStack(index: _t.clamp(0, 2), children: [const ${clsOf('balagan_home')}(), ${clsOf('balagan_ask')}(initialText: _sharedText()), const ${clsOf('balagan_topics')}()]),
      bottomNavigationBar: ${nav ? `SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: ${nav.call})))` : 'null'},
    )));
}
`;
    write(slug, code, dump());
  }

  // ── 6 · main: PureScope נייר + רישום קשרי כל המודולים ──
  {
    const slug = 'balagan_main'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const rel = mods.filter((m) => m.relations);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — שורש בלגן: אפליקציה אחת, ${mods.length} מודולים, חנות אחת. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds_pure.dart';
import '../dart-ui-bs/ds/ds_seam.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_behaviors.dart';   // G50 · bhTextScale
import '../dart-ui-bs/ds/ds_store.dart';   // G50 · appStore
import 'gen_balagan_shell.dart';
${rel.map((m) => `import 'gen_app_${m.ns}_relations.dart' as r_${m.ns};`).join('\n')}
import 'package:flutter/material.dart';

void main() {
${rel.map((m) => `  r_${m.ns}.registerAppRelations(appStore);`).join('\n')}
  runApp(const ${cls}());
}

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: ${k(L.balaganTitle)},
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, brightness: Brightness.light, fontFamily: 'Heebo', scaffoldBackgroundColor: DsPure.skins['paper']!.canvas, colorScheme: ColorScheme.fromSeed(seedColor: DsPure.themes['t-balagan']!.a, brightness: Brightness.light)),
        builder: (context, child) => AnimatedBuilder(animation: appStore, builder: (context, _) => MediaQuery(data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(bhTextScale(appStore.setting('textScale')))), child: PureScope(theme: DsPure.themes['t-balagan']!, skin: DsPure.skins['paper']!, fonts: DsPure.fontSets['heebo']!, child: Directionality(textDirection: TextDirection.rtl, child: child ?? const SizedBox.shrink())))),   // ב׳-קסא · G50 · גודל-טקסט מההגדרה
        home: const ${clsOf('balagan_shell')}(),
      );
}
`;
    write(slug, code, dump());
  }
  fs.writeFileSync(path.join(HERE, 'balagan-index.json'), JSON.stringify({ modules: mods.map((m, i) => ({ index: i, ns: m.ns, layer: m.layer || 'peruk', title: m.title, topic: m.topic, home: m.home.cls, root: m.root.cls, dates: m.root.fields.filter((f) => f.type === 'date').length })), selfTest: bad }, null, 1));
  console.log(`🧭 בלגן: ${mods.length} מודולים ⇒ אפליקציה אחת (היום · מה קרה? · נושאים ${[...new Set(mods.map((m) => m.topic))].length}) · מזהה-הרגע: ${bad.length ? '🔴 ' + bad.join(' · ') : '✓ כותרת+הרגע ⇒ עצמו ב-' + mods.length + '/' + mods.length}`);
  return { mods, bad };
}

const __isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (__isMain) { const r = buildBalagan(); if (r && r.bad.length) process.exit(1); }
