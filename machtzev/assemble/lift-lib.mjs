/** 🔧 מחצב · lift-lib — אטום-עזר טהור משותף למנועי-ההרמה (shelf-lift · data-lift).
 *  אפס-IO, אפס-מצב: חילוץ-מאוזן, ניקוי-הערות, גיבוב-מבני, שערי-ניקיון, היקש-imports. */
import crypto from 'node:crypto';

export const OK_TYPES = new Set(['String', 'int', 'double', 'bool', 'num', 'Color', 'VoidCallback',
  'IconData', 'Widget', 'List<Widget>', 'List<String>', 'EdgeInsets', 'EdgeInsetsGeometry',
  'BorderRadius', 'TextStyle', 'Key', 'Duration', 'ValueChanged<String>', 'ValueChanged<bool>',
  'ValueChanged<int>', 'ValueChanged<double>', 'TextEditingController', 'FocusNode', 'ScrollController']);
export const okType = (t) => OK_TYPES.has(t.replace(/\?$/, '').replace(/\s+/g, ''));

export const IMPORT_RULES = [
  [/\bTimer\b|\bscheduleMicrotask\b|\bStreamSubscription\b/, "import 'dart:async';"],
  [/\bmath\./, "import 'dart:math' as math;"],
  [/\bImageFilter\b|\blerpDouble\b/, "import 'dart:ui';"],
  [/\bHapticFeedback\b|\bClipboard\b|\bSystemChrome\b|\bTextInputFormatter\b|\bFilteringTextInputFormatter\b/, "import 'package:flutter/services.dart';"],
];
export const inferImports = (code) => IMPORT_RULES.filter(([re]) => re.test(code)).map(([, imp]) => imp);

/** חילוץ-גוף מאוזן-סוגריים מודע-מחרוזות מ-startIdx (חוק-4: verbatim). */
export function classBody(src, startIdx) {
  let i = src.indexOf('{', startIdx); if (i < 0) return null;
  let d = 0, j = i, inS = 0;
  for (; j < src.length; j++) {
    const c = src[j];
    if (inS) { if (c === '\\') j++; else if ((inS === 1 && c === "'") || (inS === 2 && c === '"')) inS = 0; continue; }
    if (c === "'") inS = 1; else if (c === '"') inS = 2;
    else if (c === '{') d++; else if (c === '}') { d--; if (!d) break; }
  }
  return src.slice(startIdx, j + 1);
}

export const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
/** הערות ⇒ רווחים באותו-אורך (שימור-אינדקסים לסריקות-מיקום). */
export const maskComments = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|\n)([ \t]*\/\/[^\n]*)/g, (m, a, b) => a + b.replace(/./g, ' '));

export const HEB_STR = /'((?:[^'\\\n]|\\.)*[֐-׿](?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*[֐-׿](?:[^"\\\n]|\\.)*)"/;
export const IO_PAT = /\b(?:watch|read)\(\s*[a-zA-Z0-9_]+Provider|Navigator\.|showDialog|showModalBottomSheet|MethodChannel|http\.|SharedPreferences/;
export const RIVERPOD = /\b(WidgetRef|ProviderScope|StateNotifier|AsyncValue|ConsumerState)\b/;

/** null=נקי · 'hebrew' · 'io' — על קוד-בלבד. */
export const bodyIssue = (body) => {
  const code = stripComments(body);
  if (HEB_STR.test(code)) return 'hebrew';
  if (IO_PAT.test(code)) return 'io';
  return null;
};

/** גיבוב-מבני: מחרוזות/מספרים/שם-המחלקה מסונוורים (זהות-מנגנון, הכרעה-5). */
export const blind = (body, name) => crypto.createHash('sha1').update(
  stripComments(body).replace(/'[^'\n]*'/g, 'S').replace(/"[^"\n]*"/g, 'S')
    .replace(/\b[0-9]+(\.[0-9]+)?\b/g, 'N').replaceAll(name, 'W').replace(/\s+/g, ' ')
).digest('hex').slice(0, 10);

/** יסודות-בנייה-חכמה שאטום רשאי לצרוך: שקעי-סטודיו/עזרה + קטלוג-הפיגמנטים.
 *  ‏import-היעד מוזרק בפליטה (האטומים מיועדים להידור בתוך buildsmart — חוק-7). */
export const FOUNDATION = new Map([
  ['BsTokens', "import 'bs_tokens.dart';"],
  ['CfgText', "import 'package:buildsmart/widgets/studio/cfg_text.dart';"],
  ['CfgVisible', "import 'package:buildsmart/widgets/studio/cfg_visible.dart';"],
  ['HelpTarget', "import 'package:buildsmart/widgets/help_target.dart';"],
]);

/** פונקציות-יסוד (theme-helpers) שאטום רשאי לקרוא — import-היעד מוזרק בפליטה. */
export const FOUNDATION_FN = new Map([
  ['bsOnAccent', "import 'package:buildsmart/theme/app_theme.dart';"],
  ['cfgRadius', "import 'package:buildsmart/theme/config_theme.dart';"],
]);

export const ANY_LIT_RE = /'(?:[^'\\\n]|\\.)*'/g;
export const maskLits = (s) => s.replace(ANY_LIT_RE, (m) => "'" + 'x'.repeat(m.length - 2) + "'");

/** ארגומנטי-קריאה גולמיים של widget החל-מ-from: {named, positional, index} או null. */
export function parseCallArgs(src, widget, from = 0) {
  const scan = maskLits(maskComments(src));
  const re = new RegExp('(?<!class )\\b' + widget + '\\s*\\(', 'g');
  re.lastIndex = from;
  const m = re.exec(scan);
  if (!m) return null;
  let d = 0, j = scan.indexOf('(', m.index), open = j;
  for (; j < scan.length; j++) { const c = scan[j]; if (c === '(' || c === '[' || c === '{') d++; else if (c === ')' || c === ']' || c === '}') { d--; if (!d) break; } }
  const named = {}; const positional = [];
  let s0 = open + 1, dep = 0;
  const push = (a, b) => {
    const raw = src.slice(a, b).trim();
    if (!raw) return;
    const nm = raw.match(/^([a-zA-Z_]\w*)\s*:\s*([\s\S]+)$/);
    if (nm) named[nm[1]] = nm[2].trim(); else positional.push(raw);
  };
  for (let k = open + 1; k <= j; k++) {
    const c = scan[k];
    if (c === '(' || c === '[' || c === '{') dep++;
    else if (c === ']' || c === '}') dep--;
    else if (c === ')' && k < j) dep--;
    else if ((c === ',' && !dep) || k === j) { push(s0, k); s0 = k + 1; }
  }
  return { named, positional, index: m.index };
}

/** הקשר-לולאה של widget: {list, as, callIndex} או null — map/collection-for. */
export function loopContext(src, widget) {
  const scan = maskLits(maskComments(src));
  let m = new RegExp('([\\w.\\]\\[!?]+(?:\\([^()]*\\))?)\\.map\\(\\s*\\(\\s*(\\w+)\\s*\\)\\s*=>\\s*(?:const\\s+)?' + widget + '\\s*\\(', 'd').exec(scan);
  if (m) return { list: src.slice(m.indices[1][0], m.indices[1][1]), as: m[2], callIndex: m.index + m[0].length - widget.length - 2 };
  m = new RegExp('for\\s*\\(final\\s+(\\w+)\\s+in\\s+([^)]+)\\)\\s*(?:\\.\\.\\.)?\\s*\\[?\\s*(?:const\\s+)?' + widget + '\\s*\\(', 'd').exec(scan);
  if (m) return { list: src.slice(m.indices[2][0], m.indices[2][1]).trim(), as: m[1], callIndex: m.index + m[0].length - widget.length - 2 };
  return null;
}

export const snake = (n) => n.replace(/^_/, '').replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
export const screenPascal = (screen) => screen.replace(/^(screens|features)__/, '').replace(/_screen$/, '')
  .split(/__|_/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
