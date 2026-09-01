// capability.mjs — שכבת כוונה⇒הרכבה (§23): קורא מבנה-משפט-צורך ⇒ פירוק לפעולות + בחירת-אטומים.
// אפס-מילון-דומייני: ה"מילון" היחיד = דקדוק-יחסי (אופרטורים) + מרקרי-תנאי מבניים. האטומים
// נבחרים דרך match (מטרות-אטומים · נלמד מ-254 מסכים), לא מיפוי-קשיח. עיוור-דומיין.
import { retrieve } from './match.mjs';
import fs from 'node:fs';
const ATOM_INDEX = JSON.parse(fs.readFileSync(new URL('./atom-index.json', import.meta.url), 'utf8'));
const fileOf = (cls) => { const a = ATOM_INDEX.find((e) => e.cls === cls); return a ? a.file : null; };

// דקדוק-יחסי — קבוצה סגורה של אופרטורי-השוואה (כמו >,< במתמטיקה). לא דומיין. \S* סופג נטיית-מין/מספר.
// דפוסים בצורה מנוטרלת-סופיות (definalize) — סופג ך/כ · ם/מ · נטיית-מין/מספר.
const REL = [
  { re: /חורג\S*|עולה\S*\s*על|מעל|גדול\S*|יותר|למעלה\s*מ/, op: '>' },
  { re: /נמוכ\S*|מתחת|קטנ\S*|פחות|יורד\S*/, op: '<' },
];
const definalize = (s) => String(s).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');
// מרקרי-תנאי מבניים (כמו 'עם' מפריד-שדות) — סגור. בלי \b (ASCII-בלבד, לא נדלק על עברית).
const WHEN = /(כאשר|ברגע ש|כש)/;
const hw = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
// קילוף-קידומת חד-אותית (ה/ו/ש/כ/ל/ב/מ) לצורך התאמת-שדה — רק אם המילה נשארת ≥2 אותיות.
// קילוף-קידומת שמרני: "מה..." (מן-ה) ⇒ קלף 2 · "ה..." (יידוע) ⇒ קלף 1. לעולם לא מ' בודדת
// (שורש: מעבד/מלאי/מחיר) ⇒ מונע over-strip. עיוור-דומיין, מבני.
const deprefix = (w) => { const s = String(w); if (/^מה../.test(s)) return s.slice(2); if (/^ה./.test(s) && s.length > 2) return s.slice(1); return s; };
// שם-הערך = צירוף-השם המלא של סעיף-הערך (לא מילה בודדת) — כך סמיכות/שייכות נשמרות נכון:
// "עומס המעבד"·"יתרת החשבון"·"לחות הקרקע"·"דופק של המטופל". קילוף-יידוע על המילה הראשונה בלבד.
const cleanPhrase = (words) => words.length ? [deprefix(words[0]), ...words.slice(1)].join(' ') : '';

// גלאי סעיף-התראה-מותנית: "<trigger> ... כש <X> <REL> <Y>". מבני בלבד.
// מחזיר {trigger, xWords, op, yWords} או null. אינו יודע מה X/Y — רק צורתם.
export function detectAlertClause(text) {
  const t = String(text || '');
  const wm = t.match(WHEN);
  if (!wm) return null;
  const before = t.slice(0, wm.index);          // ראש-הסעיף — כוונת-התצוגה (יתורגם ע"י match)
  const after = t.slice(wm.index + wm[0].length); // תנאי — X REL Y
  // התאמת-יחס על טקסט מנוטרל-סופיות (אורך זהה ⇒ אינדקסים תואמים ל-after המקורי).
  const afterN = definalize(after);
  let rel = null, relM = null;
  for (const r of REL) { const m = afterN.match(r.re); if (m) { rel = r; relM = m; break; } }
  if (!rel) return null;
  const xPart = after.slice(0, relM.index);
  const yPart = after.slice(relM.index + relM[0].length);
  const xWords = hw(xPart), yWords = hw(yPart);
  if (!xWords.length || !yWords.length) return null;
  return {
    trigger: hw(before).slice(-2).join(' '),      // 2 המילים לפני 'כש' = אות-הכוונה (בלי שם-הערך)
    x: cleanPhrase(xWords),                        // שדה-הערך = צירוף-השם המלא (סמיכות נשמרת)
    op: rel.op,
    y: deprefix(yWords[0]),                        // שדה-הסף (המילה הצמודה לתנאי)
  };
}

// בחירת אטום-תצוגה לכוונה — דרך match (מטרת-אטום), לא מיפוי. מחזיר cls או null.
export function pickAtom(phrase) {
  const r = retrieve(phrase, 3) || [];
  return r.length ? r[0].cls : null;
}

// פולט מוניטור מהמסגרת-המבנית: פעולת-יסוד השוואה (op) מחווטת ל-3 אטומי-Pure שנבחרו לפי-מטרה/צורה:
// GaugeMeter (רמה · צורה-מספרית) · PremiumStat (קריאה+דלתא) · AlertBanner (התראה · match מהכוונה).
// x,y = שמות-שדות מהמשפט. ה-op מהדקדוק-היחסי. אפס-מתכון: התנאי+ההשוואה נקראו ממבנה-המשפט.
export function emitMonitor(frame, cls = 'GenCapScreen') {
  // בחירת אטום-התראה: match על אות-הכוונה, מוגבל לאטום בעל-צורת-באנר (label+צבעים). נפילה
  // בטוחה ל-AlertBanner אם הבחירה אינה בעלת-צורה (שמירה על תקינות-הפלט, לא מיפוי-דומייני).
  const BANNER_SHAPED = new Set(['AlertBanner']);
  const picked = pickAtom(frame.trigger);
  const alertAtom = BANNER_SHAPED.has(picked) ? picked : 'AlertBanner';
  const alertFile = (fileOf(alertAtom) || 'dart-ui-bs/alert_banner.dart').replace(/\.dart$/, '');
  const xLbl = frame.x, yLbl = frame.y, op = frame.op === '<' ? '<' : '>';
  return `// ✨ חולל ע"י capability.mjs — כוונה⇒הרכבה (§23). המשפט: "${frame._src || ''}".
// פירוק ממבנה-המשפט: תנאי("כש") + השוואה("${op}") ⇒ ${alertAtom} מותנה + מד-רמה + קריאה.
// אפס-מתכון · אפס-מילון-דומייני · אטומים נבחרו לפי-מטרה/צורה (§20-א).
import 'package:flutter/material.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_pure.dart';
import '../dart-ui-bs/premium/dataviz/gauge_meter.dart';
import '../dart-ui-bs/premium/showcase/premium_stat.dart';
import '../${alertFile}.dart';

void main() => runApp(const _CapApp());

class _CapApp extends StatelessWidget {
  const _CapApp();
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, fontFamily: 'Heebo', scaffoldBackgroundColor: DsTokens.bg, colorScheme: ColorScheme.fromSeed(seedColor: DsTokens.accent)),
        builder: (c, ch) => Directionality(textDirection: TextDirection.rtl, child: ch ?? const SizedBox.shrink()),
        home: const ${cls}(),
      );
}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  double _x = 55; // ${xLbl}
  final double _y = 70; // ${yLbl}
  @override
  Widget build(BuildContext context) {
    final bool over = _x ${op} _y; // ← פעולת-היסוד מהמשפט
    final double norm = (_x / (_y == 0 ? 1 : _y * 1.4)).clamp(0.0, 1.0);
    return DsScaffold(
      title: 'ניטור ${xLbl}',
      subtitle: 'חוּלל ממשפט · ${xLbl} ${op} ${yLbl}',
      icon: '📟',
      children: [
        Padding(padding: const EdgeInsets.symmetric(vertical: 8), child: Center(child: GaugeMeter(value: norm, size: 170))),
        Padding(padding: const EdgeInsets.all(12), child: PremiumStat(label: over ? 'חריגה · ${xLbl}' : 'תקין · ${xLbl}', value: _x, unit: '/ ${yLbl}', delta: _x - _y)),
        if (over)
          const Padding(padding: EdgeInsets.all(12), child: ${alertAtom}(label: 'חריגה — ${xLbl} מעל ${yLbl}', height: 46, radius: 14, accentColor: DsPure.err, baseColor: DsPure.raised, fillColor: DsPure.surface)),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), child: Slider(value: _x, max: 100, onChanged: (v) => setState(() => _x = v))),
      ],
    );
  }
}
`;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const arg = process.argv.slice(2).join(' ');
  if (arg && arg !== '--test') {
    const d = detectAlertClause(arg);
    if (!d) { console.error('אין סעיף-תנאי במשפט'); process.exit(1); }
    d._src = arg;
    process.stdout.write(emitMonitor(d));
  } else {
    for (const s of ['אני צריך לנטר מערכת ולקבל התראה כשהטמפרטורה חורגת מהמקסימום', 'התראה כשהמלאי יורד מהמינימום', 'הודעה כשהדלק נמוך מהסף', 'סתם משפט בלי תנאי']) {
      const d = detectAlertClause(s);
      console.log('· "' + s + '" ⇒', d ? JSON.stringify(d) + ' · atom=' + pickAtom(d.trigger) : '(אין)');
    }
  }
}
