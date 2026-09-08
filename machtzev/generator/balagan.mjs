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

String _definal(String w) => w.replaceAll(RegExp(r'ך\$'), 'כ').replaceAll(RegExp(r'ם\$'), 'מ').replaceAll(RegExp(r'ן\$'), 'נ').replaceAll(RegExp(r'ף\$'), 'פ').replaceAll(RegExp(r'ץ\$'), 'צ');
Set<String> balaganTokens(String s) {
  final out = <String>{};
  for (final m in RegExp(r'[\\u0590-\\u05FF][\\u0590-\\u05FF״׳]*').allMatches(s)) {
    final w = _definal(m.group(0)!.replaceAll(RegExp(r'[״׳]'), '')); if (w.length < 2) continue;
    out.add(w); if (w.length >= 4 && 'והבלמשכ'.contains(w[0])) out.add(w.substring(1));
  }
  return out;
}
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
  final weak = hits.isEmpty || hits.first.score / hits.first.module.selfScore < kBalaganWeak;
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
  put(RegExp(r'(?<![\\d.])(\\d{1,2})\\.(\\d{1,2})(?![\\d.%]|\\s*(?:אלף|%|₪))'), (x) { final mo = int.parse(x.group(2)!), d = int.parse(x.group(1)!); if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) return null; var c = DateTime(t0.year, mo, d); if (c.isBefore(t0)) c = DateTime(t0.year + 1, mo, d); return c; });   // dd.mm בלי שנה: הקרוב-הבא
  const months = {'ינואר': 1, 'פברואר': 2, 'מרץ': 3, 'מרס': 3, 'אפריל': 4, 'מאי': 5, 'יוני': 6, 'יולי': 7, 'אוגוסט': 8, 'ספטמבר': 9, 'אוקטובר': 10, 'נובמבר': 11, 'דצמבר': 12};
  put(RegExp(r'(?<![\\d.])(\\d{1,2})\\s*ב?(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)(?:\\s+(\\d{4}))?(?![\\u0590-\\u05FF])'), (x) { final d = int.parse(x.group(1)!); final mo = months[x.group(2)!]!; if (d < 1 || d > 31) return null; if (x.group(3) != null) return DateTime(int.parse(x.group(3)!), mo, d); var c = DateTime(t0.year, mo, d); if (c.isBefore(t0)) c = DateTime(t0.year + 1, mo, d); return c; });   // «15 בספטמבר» · «3 באוקטובר 2027»: שמות-חודשים = לוח, לא דומיין
  put(RegExp(r'(?<![\\u0590-\\u05FF])מחרתיים'), (_) => add(2));
  put(RegExp(r'(?<![\\u0590-\\u05FF])מחר(?![\\u0590-\\u05FF])'), (_) => add(1));
  put(RegExp(r'(?<![\\u0590-\\u05FF])היום(?![\\u0590-\\u05FF])'), (_) => add(0));
  put(RegExp(r'(?<![\\u0590-\\u05FF])אתמול'), (_) => add(-1));
  put(RegExp(r'(?<![\\u0590-\\u05FF])שלשום'), (_) => add(-2));
  put(RegExp(r'בעוד\\s+(?:(\\d+|[\\u0590-\\u05FF]+)\\s+)?(ימים|יום|יומיים|שבועות|שבוע|שבועיים|חודשים|חודש|חודשיים)(?![\\u0590-\\u05FF])'), (x) { final q = x.group(1); final u = x.group(2)!; var n = q == null ? 1 : (int.tryParse(q) ?? _heNum(q) ?? 1); if (u == 'יומיים' || u == 'שבועיים' || u == 'חודשיים') n = 2; if (u.startsWith('שבוע')) return add(7 * n); if (u.startsWith('חודש')) return DateTime(t0.year, t0.month + n, t0.day); return add(n); });
  put(RegExp(r'לפני\\s+(\\d+|[\\u0590-\\u05FF]+)\\s+(ימים|שבועות|חודשים)'), (x) { final q = x.group(1)!; final u = x.group(2)!; final n = int.tryParse(q) ?? _heNum(q) ?? 1; if (u == 'שבועות') return add(-7 * n); if (u == 'חודשים') return DateTime(t0.year, t0.month - n, t0.day); return add(-n); });
  const wd = {'ראשון': 7, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6, 'א': 7, 'ב': 1, 'ג': 2, 'ד': 3, 'ה': 4, 'ו': 5};
  DateTime next(int w) { var d = (w - t0.weekday + 7) % 7; if (d == 0) d = 7; return add(d); }   // הבא, לא היום
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
List<_DateAt> balaganTimes(String text) {
  final out = <_DateAt>[];
  for (final x in RegExp(r'(?:ב-?)?(?<![\\d:])(\\d{1,2}):(\\d{2})(?![\\d:])').allMatches(text)) { final h = int.parse(x.group(1)!), mi = int.parse(x.group(2)!); if (h > 23 || mi > 59) continue; out.add(_DateAt(x.start, x.end, '\${h.toString().padLeft(2, '0')}:\${mi.toString().padLeft(2, '0')}')); }
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
  if (n == 1) return u == 'd' ? 'כל יום' : u == 'w' ? 'כל שבוע' : u == 'm' ? 'כל חודש' : 'כל שנה';
  if (n == 2) return u == 'd' ? 'כל יומיים' : u == 'w' ? 'כל שבועיים' : u == 'm' ? 'כל חודשיים' : 'כל שנתיים';
  return 'כל \$n ' + (u == 'd' ? 'ימים' : u == 'w' ? 'שבועות' : u == 'm' ? 'חודשים' : 'שנים');
}
/// תיק כפול: רשומה פתוחה באותו מודול עם אותו מתאר/אדם (השוואה מנורמלת) — לפני «שמור» שואלים «זה אותו עניין?» במקום לפתוח תיק שני.
List<Map<String, String>> balaganDuplicates(BalaganModule m, Map<String, String> v) {
  String norm(String x) => x.trim().toLowerCase().replaceAll(RegExp(r'\\s+'), ' ');
  final keys = [m.descField, ...m.personFields].where((f) => f.isNotEmpty && norm(v[f] ?? '').length >= 3).toList();
  if (keys.isEmpty) return const [];
  return appStore.records(m.rootSlug).where((r) { final st = int.tryParse(r['__stage'] ?? '0') ?? 0; if (m.stages > 0 && st >= m.stages - 1) return false; return keys.any((f) => norm(r[f] ?? '') == norm(v[f]!)); }).toList();
}
/// מיזוג לתיק קיים: שדה ריק בקיים מקבל את הערך החדש · «מה כתבת» נצבר (שורה חדשה) · שדה מלא לא נדרס. פעולה אחת עם החזר (prev = JSON של מה שנגע).
int balaganMerge(BalaganModule m, String id, Map<String, String> v, String logText) {
  final r = appStore.byId(m.rootSlug, id); if (r == null) return 0;
  final prev = <String, String>{}; final next = <String, String>{};
  for (final e in v.entries) {
    final val = e.value.trim(); if (val.isEmpty || e.key == '__id' || e.key == '__at' || e.key == '__stage') continue;
    final cur = (r[e.key] ?? '').trim();
    if (e.key == '__note') { if (cur.contains(val)) continue; prev[e.key] = r[e.key] ?? ''; next[e.key] = cur.isEmpty ? val : cur + '\\n' + val; continue; }
    if (cur.isNotEmpty) continue;
    prev[e.key] = r[e.key] ?? ''; next[e.key] = val;
  }
  if (next.isEmpty) return 0;
  appStore.update(m.rootSlug, id, next);
  appStore.logAction('merge', logText.replaceAll('{n}', next.length.toString()), entity: m.rootSlug, rid: id, prev: jsonEncode(prev));
  return next.length;
}
/// שורת-ייצוא-וואטסאפ: «[8.9.2026, 16:30] דני: …» / «8.9.26, 16:30 - דני: …» ⇒ הטקסט בלי הכותרת + השולח (מבנה, לא מילון). חותמת-ההודעה אינה מועד.
final RegExp _waHead = RegExp(r'^\\s*\\[?(\\d{1,2}[./]\\d{1,2}[./]\\d{2,4}),?\\s+(\\d{1,2}:\\d{2})(?::\\d{2})?\\]?\\s*-?\\s*([^:\\n]{2,30}):\\s+');
String balaganWaStrip(String text) { final m = _waHead.firstMatch(text); return m == null ? text : text.substring(m.end); }
String balaganWaSender(String text) { final m = _waHead.firstMatch(text); return m == null ? '' : m.group(3)!.trim(); }
/// שורה עם כמה רגעים («שילמתי ארנונה. מחר תור לרופא») ⇒ חלקים לפי שורה/נקודה-ורווח/נקודה-פסיק — כל חלק רגע משלו (טופס-אישור אחר טופס-אישור). חלק = ≥2 מילים.
List<String> balaganSplit(String text) {
  final parts = text.split(RegExp(r'\\n|;|(?<=[\\u0590-\\u05FF\\d])\\.\\s+(?=[\\u0590-\\u05FF])')).map((p) => p.trim()).where((p) => balaganWaStrip(p).split(RegExp(r'\\s+')).where((w) => w.isNotEmpty).length >= 2).toList();   // חלק = ≥2 מילים אחרי הסרת כותרת-וואטסאפ
  return parts.length >= 2 ? parts : [text.trim()];
}
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
Map<String, String> balaganFacts(String text0, BalaganModule m, {DateTime? today}) {
  final out = <String, String>{};
  final t0 = today ?? DateTime.now();
  final sender = balaganWaSender(text0); final text = balaganWaStrip(text0);   // כותרת-וואטסאפ: לא תאריך, לא שעה — השולח = אדם (רק כשלא נמצא אחר)
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
  final timeMs = balaganTimes(text);
  final personMs = balaganPersons(text, [...dateMs, ...timeMs, ...phoneMs], phoneMs);
  final repMs = balaganRepeat(text); if (repMs.isNotEmpty) out['__repeat'] = repMs.first.iso;   // ↻ נשמר ברשומה; «סיים» יוצר את הבא
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
      ['8.9.26, 16:30 - רות לוי: מסרתי מפתח ב-1.8.2026', ['תאריך מסירת מפתח'], [], { 'תאריך מסירת מפתח': '2026-08-01', 'לקוח': 'רות לוי' }, { pe: ['לקוח'] }],
    ];
    const baseMod = mods.find((m) => m.layer === 'base') || mods[0]; const baseTodayCls = baseMod.home.cls + 'Today';
    const dq = (x) => "'" + String(x).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    const code = `// 🧭 חולל ע"י balagan (G33 ב׳-ה · הכרעה-29) — הוכחת-עובדות: תאריכים-יחסיים בעברית · צורות-סכום · קרבה-למילת-השדה. היום מוזרק ⇒ דטרמיניסטי. אל תערוך ידנית.
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_moments.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_${baseMod.home.slug}.dart' show ${baseTodayCls};
import 'package:buildsmart/genesis/dart-ui-bs/ds/ds_store.dart';
import 'package:buildsmart/genesis/dart-ui-bs/ds/ds.dart';
import 'package:buildsmart/genesis/dart-gen-bs/gen_balagan_home.dart';
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
    expect(t.contains('2026-09-08'), isTrue); expect(t.contains('• ארנונה (משימות)'), isTrue); expect(t.contains('• 09:30 רופא שיניים (יומן)'), isTrue);
  });
  test('ייצוא-וואטסאפ: הכותרת נקלפת, השולח = אדם, חותמת-ההודעה אינה מועד', () {
    expect(balaganWaStrip('[8.9.2026, 16:30] דני: מחר ב-9:00'), 'מחר ב-9:00');
    expect(balaganWaSender('8.9.26, 16:30 - רות לוי: שלום'), 'רות לוי');
    expect(balaganWaSender('מחר ב-9:00'), '');
    expect(balaganSplit('[8.9.2026, 16:30] דני: מחר אצל הרופא\\n[8.9.2026, 16:31] דני: ok').length, 1);
  });
  test('פיצול שורה לכמה רגעים', () {
    expect(balaganSplit('שילמתי ארנונה. מחר תור לרופא ב-9:00'), ['שילמתי ארנונה', 'מחר תור לרופא ב-9:00']);
    expect(balaganSplit('מסרתי מפתח ב-1.8.2026 והמשכיר מקזז 6,200'), ['מסרתי מפתח ב-1.8.2026 והמשכיר מקזז 6,200']);
    expect(balaganSplit('שורה אחת\\nשורה שתיים; ועוד אחת').length, 3);
  });
  test('זיהוי: כל כותרת-מודול ⇒ עצמו (הסף אינו בולע כותרות)', () {
    for (final m in kBalaganModules) { expect(balaganIdentify(m.title).first.module.ns, m.ns, reason: m.title); }
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
import 'gen_balagan_confirm.dart';
import 'gen_balagan_moments.dart';
${mods.map((m) => `import 'gen_${m.home.slug}.dart';`).join('\n')}
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

typedef _Items = List<DsTodayItem> Function(DateTime today, {required int dayDelta});
typedef _Props = List<Widget> Function(BuildContext context, DateTime today);
typedef _Card = Widget Function(BuildContext context, Map<String, String> r);
typedef _Props2 = List<Widget> Function(BuildContext context, DateTime today, {bool chain});
class _Mod { const _Mod(this.name, this.open, this.items, this.proposals, this.card, this.autopilot, this.done, this.index); final String name; final List<Map<String, String>> Function() open; final _Items items; final _Props2 proposals; final _Card card; final void Function() autopilot; final List<Map<String, String>> Function() done; final int index; }

/// «שתף את היום»: טקסט קריא של באיחור/היום (עם שעות) — נגזרת של אותן שורות; ללוח + wa.me (הנמען נבחר בוואטסאפ)
String balaganDayText(List<DsTodayItem> overdue, List<DsTodayItem> todayItems, DateTime today) {
  final b = StringBuffer(${k(L.shareDayTitle)} + ' · ' + today.toIso8601String().substring(0, 10) + '\\n');
  if (overdue.isNotEmpty) { b.write(${k(L.shareDayOverdue)} + ':\\n'); for (final it in overdue) { b.write('• ' + it.title + ' (' + it.module + ')\\n'); } }
  if (todayItems.isNotEmpty) { b.write(${k(L.shareDayToday)} + ':\\n'); for (final it in todayItems) { b.write('• ' + (it.time.isNotEmpty ? it.time + ' ' : '') + it.title + ' (' + it.module + ')\\n'); } }
  return b.toString().trim();
}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  static const _mods = <_Mod>[
${mods.map((m, i) => `    _Mod(${todayCls(m)}.module, ${todayCls(m)}.open, ${todayCls(m)}.items, ${todayCls(m)}.proposals, ${todayCls(m)}.card, ${todayCls(m)}.autopilot, ${todayCls(m)}.done, ${i}),`).join('\n')}
  ];
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);

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
  Future<void> _shareDay(List<DsTodayItem> overdue, List<DsTodayItem> todayItems, int planN) async {
    final t = balaganDayText(overdue, todayItems, _day(DateTime.now()));
    await Clipboard.setData(ClipboardData(text: t)); setState(() => _mailNote = ${k(L.shareDayCopied)});
    launchUrl(Uri.parse('https://wa.me/?text=' + Uri.encodeComponent(t)), mode: LaunchMode.externalApplication);
  }
  List<Widget> _plan(DateTime today, List<DsTodayItem> overdue, List<DsTodayItem> todayItems) {
    final start = (int.tryParse(appStore.setting('dayStart', '9')) ?? 9).clamp(0, 23); final block = (int.tryParse(appStore.setting('blockMin', '30')) ?? 30).clamp(5, 240);
    final items = [...overdue.where((x) => x.hard), ...overdue.where((x) => !x.hard), ...todayItems.where((x) => x.hard), ...todayItems.where((x) => !x.hard)];
    if (items.isEmpty) return const [];
    final out = <Widget>[]; var t = DateTime(today.year, today.month, today.day, start);
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
    for (final r in rows) {
      final a = r[0] as DateTime, e = r[1] as DateTime; final it = r[2] as DsTodayItem?;
      final title = it == null ? ${k(L.planFocus)} : it.title;
      out.add(DsActionRow(title: ${k(L.planBlock)}.replaceAll('{time}', hm(a)).replaceAll('{title}', title), sub: it == null ? '' : it.module, actions: [${k(L.planCal)}], onAct: (_) => launchUrl(Uri.parse(cal(a, e, title)), mode: LaunchMode.externalApplication)));
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
  List<Widget> _chain(BuildContext context) {
    final out = <Widget>[];
    // תיק שעומד: פתוח ≥7 ימים מאז יצירתו, בלי שום פעולה ביומן ⇒ «לסגור?» (סגירה = השלב-האחרון; דחייה = הכרעה נזכרת)
    final today = DateTime.now();
    for (final m in _mods) {
      final bm = kBalaganModules[m.index]; if (bm.stages == 0) continue;
      for (final r in m.open()) {
        final rid = r[AppStore.idKey] ?? ''; final at = DateTime.tryParse(r['__at'] ?? ''); if (at == null) continue;
        final days = today.difference(at).inDays; if (days < 7 || appStore.decision('stale:\$rid').isNotEmpty) continue;
        if (appStore.log.any((e) => e['rid'] == rid && e['undone'] != '1' && e['kind'] != 'add')) continue;
        final who = bm.title + ' · ' + appStore.displayOf(bm.rootSlug, rid);
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
    final overdue = all0.where((x) => x.overdue).toList();
    final todayItems = all0.where((x) => !x.overdue).toList()..sort((a, b) { final ta = a.time.isEmpty ? '99:99' : a.time, tb = b.time.isEmpty ? '99:99' : b.time; final c = ta.compareTo(tb); return c != 0 ? c : a.due.compareTo(b.due); });   // עם-שעה לפי השעה, בלי-שעה אחריהם
    final tomorrow = <DsTodayItem>[for (final m in _mods) ...m.items(today, dayDelta: 1)]..sort((a, b) => a.due.compareTo(b.due));
    final dayNames = ${k(L.dayNames)}.split(',');
    final soon = <List<dynamic>>[for (var d = 2; d <= 7; d++) for (final m in _mods) for (final it in m.items(today, dayDelta: d)) [d, it]];   // השבוע הקרוב: ימים 2–7, לפי יום ⇒ הוא רואה מה בא, לא רק מחר
    final pending = <Widget>[..._inbox(context), ..._chain(context), for (final m in _mods) ...m.proposals(context, today, chain: false)];
    // סדר-הכרטיסים = דחיפות: מועד קרוב קודם (מהשורות של היום/מחר/השבוע), ואז החדש-ביותר (__at) — 3 למעלה שמשנים משהו
    final dueOf = <String, DateTime>{}; for (final it in [...all0, ...tomorrow, for (final x in soon) x[1] as DsTodayItem]) { final key = it.module + '|' + it.rid; if (!dueOf.containsKey(key) || it.due.isBefore(dueOf[key]!)) dueOf[key] = it.due; }
    final cardRows = <List<dynamic>>[for (final m in _mods) for (final r in m.open()) [dueOf[m.name + '|' + (r['__id'] ?? '')], r['__at'] ?? '', m.card(context, r)]];
    cardRows.sort((a, b) { final da = a[0] as DateTime?, db = b[0] as DateTime?; if (da != null && db != null) { final c = da.compareTo(db); if (c != 0) return c; } else if (da != null) { return -1; } else if (db != null) { return 1; } return (b[1] as String).compareTo(a[1] as String); });
    final cards = <Widget>[for (final x in cardRows) x[2] as Widget];
    final did = appStore.log.where((e) => (e['kind'] == 'decide' || e['kind'] == 'auto' || e['kind'] == 'next' || e['kind'] == 'add' || e['kind'] == 'done') && e['undone'] != '1').take(5).toList();
    // «השבוע» — שמירת-זמן (§המוצר): נגזרת של היומן מיום-ראשון; הדקות-לפעולה = הגדרה עריכה, לא טענה
    final weekStart = today.subtract(Duration(days: today.weekday % 7));
    final wk = appStore.log.where((e) => e['undone'] != '1' && !(DateTime.tryParse(e['at'] ?? '') ?? DateTime(2000)).isBefore(weekStart)).toList();
    int cnt(String kind) => wk.where((e) => e['kind'] == kind).length;
    int mins(String key, String def) => int.tryParse(appStore.setting(key, def)) ?? int.parse(def);
    final wAdd = cnt('add'), wSend = cnt('send'), wAuto = cnt('auto') + cnt('decide') + cnt('next') + cnt('done');
    final wSaved = wAdd * mins('minAdd', '4') + wSend * mins('minSend', '12') + wAuto * mins('minAuto', '3');
    final n = overdue.length + todayItems.length + pending.length;
    final lead = n == 0 && cards.isEmpty ? ${k(L.homeNone)} : n <= 1 ? ${k(L.homeOne)} : ${k(L.homeMany)}.replaceAll('{n}', n.toString());
    final first = overdue.isNotEmpty ? overdue.first : (todayItems.isNotEmpty ? todayItems.first : null);   // הדבר-האחד (הכרעה-29): הכותרת = מה שדחוף עכשיו, לא ספירה
    final headline = first != null ? first.title : lead;
    final hardToday = todayItems.where((x) => x.hard && x.due == today).length;
    final plan = _plan(today, overdue, todayItems);
    WidgetsBinding.instance.addPostFrameCallback((_) { _digest(lead, hardToday); });
    final lk = DsLook.of(context);
    final empty = n == 0 && cards.isEmpty;
    return DsScaffold(title: ${k(L.navToday)}, subtitle: empty ? ${k(L.askSub)} : lead, icon: ${k('')}, children: [
      DsQuickAdd(hint: ${k(L.homeQuick)}, autofocus: true, onSubmit: (s0) { final parts = balaganSplit(s0); final s = parts.first; final hits = balaganIdentify(s); if (hits.isEmpty) { setState(() => _mailNote = ${k(L.askNoHit)}); return; } final m = hits.first.module; Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: m, facts: balaganFacts(s, m), alternatives: hits.skip(1).map((h) => h.module).toList(), text: s, queue: parts.sublist(1)))); }),   // שורה אחת מהמסך-הראשון ⇒ זיהוי ⇒ טופס-אישור: אפס ניווט
      if (!empty) DsLoadMeter(count: n, label: ${k(L.loadOf)}.replaceAll('{n}', n.toString()), stateLabels: [${k(L.loadOk)}, ${k(L.loadWarn)}, ${k(L.loadBad)}]),
      if (!empty) Padding(padding: const EdgeInsets.only(top: 6), child: Row(children: [DsChipButton(label: ${k(L.shareDay)}, onTap: () => _shareDay(overdue, todayItems, plan.length))])),   // היום כטקסט: ללוח + וואטסאפ (לעצמו / לבן-הזוג) — אפס-שרת
      Padding(padding: const EdgeInsets.only(top: 16, bottom: 4), child: Text(headline, style: TextStyle(color: lk.ink, fontSize: 28, fontWeight: FontWeight.w600, height: 1.2))),
      if (first != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: Text((first.overdue ? ${k(L.homeOverdue)} : first.sub) + ' · ' + first.module + ' · ' + lead, style: TextStyle(color: lk.muted, fontSize: 14))),
      if (overdue.isNotEmpty) DsSection(title: ${k(L.homeOverdue)}, tone: 2, children: [for (final it in overdue) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), tone: 2, actions: it.actions, onAct: it.act)]),   // D6/P6/P7 · באיחור ראשון
      if (todayItems.isNotEmpty) DsSection(title: ${k(L.homeToday)}, children: [for (final it in todayItems) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '), actions: it.actions, onAct: it.act)]),
      if (plan.isNotEmpty) DsFold(title: ${k(L.planFold)}.replaceAll('{n}', plan.length.toString()), details: plan),   // תזמון-אוטומטי: מקופל — הוא מסתכל כשהוא רוצה
      ...cards.take(3),   // 3 למעלה
      if (cards.length > 3) DsFold(title: ${k(L.homeMore)}.replaceAll('{n}', (cards.length - 3).toString()), details: cards.skip(3).toList()),
      if (_mailNote.isNotEmpty) DsNote(message: _mailNote, label: '', tone: 0),
      if (pending.isNotEmpty) DsSection(title: ${k(L.homePending)} + ' · ' + pending.length.toString(), children: pending),   // D5 · הגיע (מייל) · הצעד-הבא (שרשרת) · תזכורות
      if (did.isNotEmpty) DsSection(title: ${k(L.homeDid)} + ' · ' + did.length.toString(), children: [for (final e in did) DsLogRow(text: e['what'] ?? '', undoLabel: ${k(L.undo)}, onUndo: () => appStore.undo(e['id'] ?? ''))]),   // T2
      if (wk.isNotEmpty) DsFold(title: ${k(L.weekFold)}.replaceAll('{n}', wk.length.toString()).replaceAll('{m}', wSaved.toString()), details: [if (wAdd > 0) DsActionRow(title: ${k(L.weekAdded)}.replaceAll('{n}', wAdd.toString())), if (wSend > 0) DsActionRow(title: ${k(L.weekSent)}.replaceAll('{n}', wSend.toString())), if (wAuto > 0) DsActionRow(title: ${k(L.weekAuto)}.replaceAll('{n}', wAuto.toString())), DsNote(message: ${k(L.weekNote)}, label: '', tone: 0)]),   // שמירת-זמן: מקופל, מוכח מהיומן
      if (soon.isNotEmpty) DsFold(title: ${k(L.soonFold)}.replaceAll('{n}', soon.length.toString()), details: [for (final x in soon) DsActionRow(title: dayNames[today.add(Duration(days: x[0] as int)).weekday % 7] + ' · ' + (x[1] as DsTodayItem).title, sub: [(x[1] as DsTodayItem).sub, (x[1] as DsTodayItem).module].where((x) => x.isNotEmpty).join(' · '))]),
      if (tomorrow.isNotEmpty) DsFold(title: ${k(L.homeTomorrow)} + ' (' + tomorrow.length.toString() + ')', details: [for (final it in tomorrow) DsActionRow(title: it.title, sub: [it.sub, it.module].where((x) => x.isNotEmpty).join(' · '))]),   // D8
      if (!empty && overdue.isEmpty && todayItems.isEmpty && pending.isEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Text(${k(L.homeAll)}, style: TextStyle(color: lk.muted, fontSize: 14))),
      if (empty) DsNote(message: ${k(L.homeEmptyWay)}, label: '', tone: 0),
      if (empty) Padding(padding: const EdgeInsets.only(top: 14), child: Text(${k(L.homeTry)}, style: TextStyle(color: lk.muted, fontSize: 13))),
      if (empty) Padding(padding: const EdgeInsets.only(top: 6), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ex in ${k(L.askExamples)}.split('|')) DsChipButton(label: ex, onTap: () { final hits = balaganIdentify(ex); if (hits.isEmpty) return; Navigator.of(context).push<bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: hits.first.module, facts: balaganFacts(ex, hits.first.module), alternatives: hits.skip(1).map((h) => h.module).toList(), text: ex))); })])),   // מסך ריק = הדרך בהקשה אחת
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
import 'gen_balagan_confirm.dart';
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
        DsChipButton(label: ${k(L.pasteLabel)}, onTap: _busy ? null : _paste),
        const SizedBox(width: 8),
        GestureDetector(onTap: _busy ? null : _photo, child: Container(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9), decoration: BoxDecoration(border: Border.all(color: lk.line), borderRadius: BorderRadius.circular(9)), child: Text(${k(L.askPhoto)}, style: TextStyle(color: lk.ink, fontSize: 14, fontWeight: FontWeight.w600)))),
      ])),
      if (!_asked && _c.text.trim().isEmpty) Padding(padding: const EdgeInsets.only(top: 14), child: Text(${k(L.askExamplesTitle)}, style: TextStyle(color: lk.muted, fontSize: 13))),
      if (!_asked && _c.text.trim().isEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final ex in ${k(L.askExamples)}.split('|')) DsChipButton(label: ex, onTap: () { _c.text = ex; _go(); })])),   // אפס-הקלדה: דוגמה = הקשה אחת ⇒ טופס-האישור
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
import 'gen_balagan_moments.dart';
${mods.map((m) => `import 'gen_${m.rootPage.slug}.dart';`).join('\n')}
import 'package:flutter/material.dart';

/// זיכרון-חיים: שדה-טקסט קצר (≤30) נזכר לפי התווית שלו ומוצע בכל מודול עם אותה תווית. מקומי-למכשיר (AppStore.settings).
String balaganRemember(String label) => appStore.setting('mem:' + label);
void balaganLearn(BalaganField f, String v) { if (f.type == 'text' && f.options.isEmpty && v.trim().isNotEmpty && v.trim().length <= 30) appStore.setSetting('mem:' + f.label, v.trim()); }

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
  Widget _openRoot(String entity, String id) {
    switch (entity) {
${mods.map((m) => `      case '${m.root.slug}': return ${m.rootPage.cls}(id: id);`).join('\n')}
      default: return const SizedBox.shrink();
    }
  }
  late final Map<String, String> _v = {for (final f in widget.module.fields) if (balaganRemember(f.label).isNotEmpty) f.label: balaganRemember(f.label), ...widget.facts};
  Widget _field(BalaganField f) {
    final v = _v[f.label] ?? '';
    if (f.type == 'date') return DsDateField(label: f.label, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    if (f.type == 'num') return DsNumberField(label: f.label, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    if (f.options.isNotEmpty) return DsEnumField(label: f.label, options: f.options, value: v, onChanged: (x) => setState(() => _v[f.label] = x));
    return DsField(label: f.label, hint: '', value: v, onChanged: (x) => _v[f.label] = x);
  }
  void _save() {
    final map = <String, String>{for (final e in _v.entries) if (e.value.trim().isNotEmpty) e.key: e.value.trim()};
    if (map.isEmpty) return;
    for (final f in widget.module.fields) { if (map.containsKey(f.label)) balaganLearn(f, map[f.label]!); }
    final id = appStore.add(widget.module.rootSlug, {...map, if (widget.module.stages > 0) '__stage': '0', if (widget.doc.isNotEmpty) '__doc': widget.doc});
    appStore.logAction('add', ${k(L.savedLog)}.replaceAll('{title}', widget.module.title + ' · ' + appStore.displayOf(widget.module.rootSlug, id)), entity: widget.module.rootSlug, rid: id);   // «עשיתי» + החזר (מחיקה)
    if (widget.queue.isNotEmpty) { _next(); return; }
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
    // ≤6 שורות-לאישור (הכרעה-29 · מסך ב׳): מה-שזוהה תמיד; שדות-חובה עד המכסה; השאר מקופל
    final shown = <BalaganField>[]; for (final f in m.fields) { if (widget.facts.containsKey(f.label)) shown.add(f); } for (final f in m.fields) { if (shown.length >= 6) break; if (f.required && !shown.contains(f)) shown.add(f); }
    shown.sort((a, b) => m.fields.indexOf(a).compareTo(m.fields.indexOf(b)));
    final rest = m.fields.where((f) => !shown.contains(f)).toList();
    return DsScaffold(title: m.title, subtitle: ${k(L.confirmSub)}, icon: ${k('')}, children: [
      if (m.moment.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: DsNote(message: ${k(L.confirmIs)}.replaceAll('{title}', m.title).replaceAll('{moment}', m.moment), label: '', tone: 0)),
      if (widget.alternatives.isNotEmpty) DsFold(title: ${k(L.confirmNot)}.replaceAll('{n}', widget.alternatives.length.toString()), details: [for (final a in widget.alternatives) DsNavTile(glyph: '', title: a.title, sub: a.moment, onTap: () => Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => ${clsOf('balagan_confirm')}(module: a, facts: balaganFacts(widget.text, a), doc: widget.doc, alternatives: [for (final x in [widget.module, ...widget.alternatives]) if (x.index != a.index) x], text: widget.text, queue: widget.queue))))]),
      if ((widget.facts['__repeat'] ?? '').isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.confirmRepeat)}.replaceAll('{every}', balaganRepeatLabel(widget.facts['__repeat']!)), label: '', tone: 0)),
      if (widget.queue.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 8), child: DsNote(message: ${k(L.confirmQueue)}.replaceAll('{n}', widget.queue.length.toString()), label: '', tone: 0)),
      if (!_forceNew) for (final d in balaganDuplicates(m, _v).take(1)) DsApproveCard(question: ${k(L.dupAsk)}.replaceAll('{who}', appStore.displayOf(m.rootSlug, d['__id'] ?? '')), source: m.title, okLabel: ${k(L.dupOpen)}, noLabel: ${k(L.dupNew)}, onOk: () { final id = d['__id'] ?? ''; final n = balaganMerge(m, id, {for (final e in _v.entries) if (e.value.trim().isNotEmpty) e.key: e.value, if (widget.doc.isNotEmpty) '__doc': widget.doc}, ${k(L.mergeLog)}.replaceAll('{who}', appStore.displayOf(m.rootSlug, id))); Navigator.of(context).pushReplacement<bool, bool>(MaterialPageRoute<bool>(builder: (_) => _openRoot(m.rootSlug, id))); if (n == 0) return; }, onNo: () => setState(() => _forceNew = true)),   // «פתח את הקיים» = המידע החדש נכנס לתיק הקיים (שדות ריקים + «מה כתבת» נצבר), עם החזר   // תיק כפול: «זה אותו עניין?» לפני שנפתח תיק שני
      for (final f in shown) _field(f),
      if (rest.isNotEmpty) DsFold(title: ${k(L.confirmMore)}.replaceAll('{n}', rest.length.toString()), details: [for (final f in rest) _field(f)]),
      Padding(padding: const EdgeInsets.only(top: 14), child: DsPrimaryButton(label: ${k(L.askSave)}, onTap: _save)),
    ]);
  }
}
`;
    write(slug, code, dump());
  }

  // ── 4 · «חיבורים» (מפתחות-הלקוח) · «נושאים» · «התנהגות» ──
  const bh = renderBehavior('balagan_behavior', { extraFields: [['minAdd', '4', 'minAddLabel'], ['minSend', '12', 'minSendLabel'], ['minAuto', '3', 'minAutoLabel']] });   // שמירת-זמן (§המוצר): הדקות-לפעולה עריכות, לא קבועות
  {
    const slug = 'balagan_keys'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29 · חוק-6) — «חיבורים»: המפתחות של הלקוח, במכשיר בלבד. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
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
  Future<void> _copy() async { final t = appStore.exportJson(); await Clipboard.setData(ClipboardData(text: t)); setState(() => _note = ${k(L.backupCopied)}.replaceAll('{n}', t.length.toString())); }
  void _restore() { final n = appStore.importJson(_paste); setState(() { _note = n < 0 ? ${k(L.backupBad)} : ${k(L.backupRestored)}.replaceAll('{n}', n.toString()); if (n >= 0) _paste = ''; }); }
  void _undo() { final ok = appStore.undoImport(); setState(() => _note = ok ? ${k(L.backupUndone)} : ${k(L.backupBad)}); }
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) => DsScaffold(title: ${k(L.keysTitle)}, subtitle: ${k(L.keysSub)}, icon: ${k('')}, children: [
    DsSection(title: ${k(L.backupTitle)}, children: [
      DsPrimaryButton(label: ${k(L.backupCopy)}, onTap: _copy),
      Padding(padding: const EdgeInsets.only(top: 8), child: DsField(label: ${k(L.backupPasteLabel)}, hint: '{…}', value: _paste, onChanged: (v) => _paste = v)),
      Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [DsChipButton(label: ${k(L.backupRestore)}, onTap: _restore), const SizedBox(width: 8), DsChipButton(label: ${k(L.backupUndo)}, onTap: _undo)])),
      if (_note.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: _note, label: '', tone: 0)),
      Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.backupNote)}, label: '', tone: 0)),
      Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.installNote)}, label: '', tone: 0)),
    ]),
    DsField(label: ${k(L.aiKeyLabel)}, hint: ${k(L.aiKeyHint)}, value: appStore.setting('ai.key'), onChanged: (v) => appStore.setSetting('ai.key', v.trim())),
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
import 'package:flutter/material.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  String _q = '';
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
    final hits = appStore.search(_q);
    return DsScaffold(title: ${k(L.topicsTitle)}, subtitle: ${k(L.topicsSub)}, icon: ${k('')}, children: [
    DsField(label: ${k(L.searchLabel)}, hint: ${k(L.searchHint)}, value: _q, onChanged: (v) => setState(() => _q = v)),
    if (_q.trim().length >= 2 && hits.isEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.searchNone)}, label: '', tone: 0)),
    if (_q.trim().isEmpty) ...(() { final seen = <String>{}; final rows = <Widget>[]; for (final e in appStore.log) { if (rows.length >= 5) break; final ent = e['entity'] ?? '', rid = e['rid'] ?? ''; if (ent.isEmpty || rid.isEmpty || e['undone'] == '1' || !_titleOf.containsKey(ent) || !seen.add(ent + '|' + rid) || appStore.byId(ent, rid) == null) continue; rows.add(DsNavTile(glyph: '', title: (_titleOf[ent] ?? ent) + ' · ' + appStore.displayOf(ent, rid), sub: e['what'] ?? '', onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _open(ent, rid))))); } return rows.isEmpty ? <Widget>[] : [DsSection(title: ${k(L.recentTitle)}, children: rows)]; })(),   // «איפה הייתי»: התיקים שנגעת בהם לאחרונה, מהיומן
    if (hits.isNotEmpty) DsSection(title: ${k(L.searchTitle)}.replaceAll('{n}', hits.length.toString()), children: [for (final h in hits.take(30)) DsNavTile(glyph: '', title: (_titleOf[h[0]] ?? h[0]) + ' · ' + appStore.displayOf(h[0], h[1]), sub: h[2].length > 60 ? h[2].substring(0, 60) + '…' : h[2], onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _open(h[0], h[1]))))]),
${order.map((t) => `    DsSection(title: ${k(t)}, children: [
${mods.filter((m) => m.topic === t).map((m) => `      DsNavTile(glyph: '', title: ${k(m.title)}, sub: ${k(m.moment)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${m.root.cls}()))),`).join('\n')}
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
        builder: (context, child) => PureScope(theme: DsPure.themes['t-balagan']!, skin: DsPure.skins['paper']!, fonts: DsPure.fontSets['heebo']!, child: Directionality(textDirection: TextDirection.rtl, child: child ?? const SizedBox.shrink())),
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
