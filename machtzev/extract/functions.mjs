#!/usr/bin/env node
/** מחצב · מחלץ L6b — פירוק-מקסימום: כל פונקציה מיוצאת = חוט נפרד,
 *  עם גבולות-שורה מדויקים ורשימת-מי-היא-קוראת (החיווט העתידי שלה).
 *  שדרוג-מקסימום (v2): סורק engines+source · חתימות רב-שורתיות · מסנן-טוהר Dart-מודע.
 *  אפס-כתיבה-למקור; פלט לרישום בלבד. */
import fs from 'node:fs';
const census = JSON.parse(fs.readFileSync(new URL(`../registry/census-${process.argv[2]}.json`, import.meta.url)));

// ── מסנן-טוהר: כל סימן שמפר טוהר (IO/DOM/UI/מצב/שעון/אקראי) ⇒ pure:false ──
const IMPURE = /\bdocument\.|\bwindow\.|localStorage|sessionStorage|indexedDB|\bfetch\(|XMLHttpRequest|WebSocket|\bfirebase|Firestore|FirebaseFirestore|collection\(|\.doc\(|SharedPreferences|\bFile\(|\bDirectory\(|\bHttpClient|\bhttp\.|\bDio\b|\bprint\(|debugPrint|\bWidget\b|BuildContext|StatelessWidget|StatefulWidget|\bState<|setState|Navigator\.|showDialog|showModal|MediaQuery|Theme\.of|Scaffold|\bStream\b|StreamController|\bTimer\b|DateTime\.now|\.microsecondsSinceEpoch|\bRandom\(|Math\.random|Date\.now|\basync\s*\*|Platform\.|rootBundle|Process\.|stdin|stdout|exit\(|\bCanvas\b|\bPaint\(|Offset\(|drawRect|drawLine|drawPath|CustomPainter/;

const RESERVED = /^(if|for|while|switch|return|catch|assert|super|this|else|do|try|finally|new|throw|yield|await|case|break|continue)$/;
// שמות שאינם-אטום-עסקי לעולם: מחזור-חיים Flutter · סריאליזציה-boilerplate · UI-hooks
const NON_ATOM = new Set(['build','initState','dispose','createState','setState','didUpdateWidget','didChangeDependencies','didChangeAppLifecycleState','deactivate','reassemble','createElement','toJson','fromJson','toDoc','fromDoc','toMap','fromMap','toString','noSuchMethod','copyWith','operator','hashCode','props','wantKeepAlive','debugFillProperties','Function','paint','shouldRepaint','call','get','set']);
// שמות-מובנים שלא נספרים כ"קריאה-לשכן"
const BUILTIN = new Set(['return','const','function','await','if','for','while','switch','String','Number','Math','Object','Array','JSON','Boolean','Date','Set','Map','List','Iterable','console','push','slice','filter','map','some','every','includes','replace','replaceAll','match','split','join','trim','sort','reduce','forEach','indexOf','startsWith','endsWith','toLowerCase','toUpperCase','test','exec','round','floor','ceil','abs','min','max','sqrt','pow','keys','values','entries','parse','stringify','from','isArray','find','findIndex','where','firstWhere','any','fold','expand','toList','toSet','toMap','contains','flat','concat','padStart','padEnd','padLeft','padRight','charAt','codeUnitAt','substring','localeCompare','toFixed','toStringAsFixed','toLocaleString','toString','add','addAll','has','get','put','set','delete','remove','elementAt','isEmpty','isNotEmpty','asMap']);

// ── זיהוי חתימת-פונקציה, כולל רב-שורתי: מחזיר {name, sigEndLine} או null ──
// Dart:  [static] <Type[<...>][?][ [] ]> name ( ...params )  [async] { | =>
// אנחנו סורקים תו-אחר-תו מתחילת-מועמד עד סגירת-הסוגריים ואז בודקים { או =>.
function dartSigAt(lines, i) {
  const l = lines[i];
  // מועמד-פתיחה: הזחה 0/2, אופציונלי static, טיפוס-מלא, שם, ואז '(' (אולי סוף-שורה)
  const head = l.match(/^(?: {2})?(?:static\s+)?(?:[A-Za-z_$][A-Za-z0-9_$]*(?:<[^;{}]*?>)?[?]?(?:\s*\[\])?\s+)+([a-zA-Z_$][A-Za-z0-9_$]*)\s*(?:<[^;{}]*?>)?\s*\(/);
  if (!head) return null;
  const name = head[1];
  if (RESERVED.test(name)) return null;
  // אזן סוגריים החל מה-'(' הראשון, אולי חוצה-שורות
  let depth = 0, started = false, j = i, col = l.indexOf('(');
  for (; j < lines.length && j < i + 40; j++) {
    const s = j === i ? lines[j].slice(col) : lines[j];
    for (const ch of s) { if (ch === '(') { depth++; started = true; } else if (ch === ')') { depth--; } }
    if (started && depth <= 0) break;
  }
  if (depth > 0) return null;
  // אחרי ה-')' הסוגר: על אותה שורה או הבאה — { או => (אולי async ביניהם)
  const tail = (lines[j] || '') + ' ' + (lines[j + 1] || '');
  if (!/\)\s*(?:async\s*)?(?:\{|=>)/.test(tail)) return null;
  return { name, sigEndLine: j };
}
function jsSigAt(lines, i) {
  const m = lines[i].match(/^export\s+(?:async\s+)?(?:function\*?|const)\s+([A-Za-z0-9_$]+)/);
  return m && !RESERVED.test(m[1]) ? { name: m[1], sigEndLine: i } : null;
}

const atoms = [];
for (const f of census.files.filter(f => ['engines', 'source'].includes(f.domain) && /\.(ts|mjs|dart)$/.test(f.path) && !/\.d\.ts$/.test(f.path))) {
  let txt; try { txt = fs.readFileSync(`${census.root}/${f.path}`, 'utf8'); } catch { continue; }
  const lines = txt.split('\n');
  const isDart = f.path.endsWith('.dart');
  const marks = []; // [שורת-פתיחה, שם]
  for (let i = 0; i < lines.length; i++) {
    const hit = isDart ? dartSigAt(lines, i) : jsSigAt(lines, i);
    if (hit && !NON_ATOM.has(hit.name)) { marks.push([i + 1, hit.name]); i = hit.sigEndLine; }
    else if (hit) i = hit.sigEndLine;
  }
  marks.forEach(([start, name], idx) => {
    const end = idx + 1 < marks.length ? marks[idx + 1][0] - 1 : lines.length;
    const body = lines.slice(start - 1, end).join('\n');
    if (end - start + 1 < 2) return; // span<2 = סגירה-מקוננת/getter-שורה false — לא אטום
    const calls = [...new Set([...body.matchAll(/\b([a-z][A-Za-z0-9_]{3,})\(/g)].map(m => m[1])
      .filter(c => !BUILTIN.has(c)))].slice(0, 12);
    atoms.push({ id: `L6b:${census.repo}:${f.path}#${name}@${start}`, level: 'L6b-function', name,
      lines: end - start + 1, calls, pure: !IMPURE.test(body), domain: f.domain,
      source: `${census.repo}/${f.path}:${start}-${end}` });
  });
}
fs.writeFileSync(new URL(`../registry/atoms-L6b-${census.repo}.json`, import.meta.url), JSON.stringify(atoms, null, 1));
const pure = atoms.filter(a => a.pure).length;
const fromSrc = atoms.filter(a => a.domain === 'source').length;
console.log(`L6b ${census.repo}: ${atoms.length} פונקציות-כחוטים (‏${pure} טהורות · ${fromSrc} מ-source) — פירוק-מקסימום`);
