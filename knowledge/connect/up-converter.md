# up-converter — הממיר JS⇒Dart (ast-js-to-dart.mjs): מדידה ⇒ סגירת-פערים ⇒ מדידה

הוראת-הבעלים (בועה, 17.9 09:30): "צא לדרך ותעבוד בלולאה ותעדכן אותי בכל אבן דרך". ענף: claude/up-converter-260917 (מעל claude/mizug d897bc6e).
כל מספר כאן מלווה בפקודה; DART=/root/dart-sdk/bin/dart.

## מה שודרג (מנועים קיימים בלבד)
1. **parity-ast.mjs — `--errors <json>`**: שומר לכל אטום-נכשל את *כל* קודי-האנלייזר (היה: 70 תווים ראשונים ⇒ "error - <file>" יחידאי לכל אטום, ההתפלגות הייתה סמויה). עוזרי-H: `_round/_floor/_ceil/_trunc` מחזירים `int` (היו `num` ⇒ אינדקס-רשימה נפל); `import 'dart:convert'` ל-JSON.
2. **ast-js-to-dart.mjs** — 4 סבבים, כולם מבניים (אפס-מילון):
   - פרמטר עם ברירת-מחדל לפני פרמטר-חובה: Dart אוסר `[x = v]` באמצע ⇒ נפלט כחובה (הרתמה מעבירה את כל הארגומנטים). זה היה הפער הגדול ביותר: כל הפרמטרים שאחריו (בעיקר `T`, מפת-המונחים) יצאו "לא מוגדרים" — 335 שגיאות.
   - `STD[m] || m` / `MATH[m] || m` / `DATE[m]` ⇒ `Object.hasOwn`: `toLocaleString`/`toString`/`constructor` הם חברי `Object.prototype` ונפלטו כ-`function … { [native code] }`.
   - פונקציה-מקוננת (`function inner(){}` / `const f = () =>`) יורשת את טיפוסי-הפרמטרים של החיצונית (`T.k1` בתוך arrow ⇒ `T['k1']`).
   - עוזרים (`_padStart/_repeat/_concat`) הם פונקציות, לא מתודות (`x._padStart(2,'0')` ⇒ `_padStart(x, 2, '0')`).
   - פירוק: פרמטר `{a, b}`/`[a, b]` ⇒ `dynamic __pN` + `final a = __pN['a'];` בגוף; `const [d, m, y] = …` / `const {a} = …` / הצהרות-מרובות; `for (const [k, v] of …)`.
   - API: JS `Map.get/set/has/delete/size` ⇒ `[]`/`[]=`/`containsKey`/`remove`/`length` (למקומיים מ-`new Map` ולפרמטרים מוקלדים Map); `Set.has/delete/size` ⇒ `contains/remove/length`; `RegExp.test/exec` ⇒ `hasMatch/firstMatch`; `Object.entries/values`; `JSON.stringify/parse` ⇒ `jsonEncode/jsonDecode`; `encodeURIComponent` ⇒ `Uri.encodeComponent`; `Date.parse/now`, `new Date(y, m0, d)` ⇒ `DateTime(y, m0 + 1, d)`; `d.setDate(d.getDate()+k)` ⇒ `d = d.add(Duration(days: k))`; `Number.isNaN/isInteger`.
   - זהויות: `undefined` ⇒ `null`, `NaN`/`Infinity`, `Boolean`/`Number` כ-callback ⇒ `_truthy`/`_toNum`, `+x` ⇒ `_toNum(x)`, `delete a.b` ⇒ `a.remove('b')`.
   - `filter` ⇒ `.where(…).toList()` (JS מחזיר מערך; `where` = Iterable ⇒ `sublist` נפל); `push(...xs)` ⇒ `addAll`; `switch` עם `case` לא-קבוע (`case T['k1']:`) ⇒ שרשרת if/else; אובייקט-ליטרל ⇒ `<String, dynamic>{…}`; `let x;` ⇒ `dynamic x;`; `var sum = 0` ⇒ `num sum = 0` (Dart היה מסיק int ו-`+=` של num נפל; שמות-אינדקס i/j/k/n/idx נשארים int).
   - הסקה מקומית (מבנית): ליטרל/תבנית/`trim()`/… ⇒ String; `[ ]`/`split`/`map`/`filter` ⇒ List; אריתמטיקה/`length` ⇒ num; `{ }` ⇒ Map; תנאי עם `null` / `exec` ⇒ nullable (`x!` בשימוש, `x != null` בתנאי). מזין: `slice` ⇒ `substring`/`sublist` (עם `.toInt()` לארגומנטים), השוואת-מחרוזות `<,>,<=,>=` ⇒ `compareTo`, אינדקס-num על List ⇒ `.toInt()`, הקשר-בוליאני (`if (rem)`, `a && b`, `!m`) ⇒ `_truthy`/`!= null`; `||` בהקשר-ערך ⇒ `??` רק כשהצדדים אינם בוליאניים (היה: `+x || 0` נחשב בוליאני).

## מדידות (`node emit/parity-ast.mjs --evidence`, 1099 אטומי-JS)
| מצב | מתקמפלים | הערה |
|---|---|---|
| בסיס (claude/mizug d897bc6e) | 777/1099 (71%) | `--verified` (הורדת-טיפוסים): 814 |
| סבב 1 (פרמטרים, hasOwn, ירושת-הקשר, עוזרים, Map/Set/RegExp, זהויות) | 844/1099 (77%) | |
| סבב 2 (פירוק, Date, switch, `<String,dynamic>{}`, num-מקומיים, הסקה) | 897/1099 (82%) | |
| סבב 3 (Map-locals, addAll, JSON, compareTo, delete, boolCtx) | 943/1099 (86%) | רגרסיה 1: push-recent (`num RECENT_MAX` ⇒ sublist) — נסגרת בסבב 4 |
| סבב 4 (nullable-מקומיים, toInt לאינדקסים, `||` לא-בוליאני, for-of על split) | **958/1099 (87%)** | **0 רגרסיות** מול הבסיס (141 נכשלים, כולם מתוך 322 המקוריים) · `--gate` 43/43 · `police --fast` ירוקה 45/0 |

התפלגות-שגיאות על סט-הנכשלים המקורי (322 אטומים; `conv-agg.mjs`: פליטה לתיקייה אחת ⇒ `dart analyze` פעם אחת, 2s):
| מצב | קבצים-עם-שגיאה | שגיאות |
|---|---|---|
| בסיס | 320 | 2752 |
| סבב 1 | 253 | 1573 |
| סבב 2 | 199 | 795 |
| סבב 3 | 152 | 529 |
| סבב 4 | 138 | 449 |

הפער "for-in" שדווח קודם: 2 אטומים בלבד; "אמיתות-JS" ≈ 130 שגיאות (`non_bool_*`) — נסגרו ברובן דרך `boolCtx`/הסקה-מקומית.

## שקע חוצה-שפה אחרי השדרוג
`node generator/behavior-plan.mjs --needs /tmp/xl-needs.json` (38s): xl.monthKey ⇒ `monthKey(p0)` · sockets=[cross-language] · parity ok 3/3; תאומי-JS שנכנסו לרתמה: 15 (היו 10).

## מה נשאר (נמדד, לא נסגר)
`Intl`/`TextDecoder` (אין מקבילה מובנית) · טיפוסי-ראיות שגויים (`String amount` בשימוש מספרי) · `unchecked_use_of_nullable_value` על שדות (לא פרמטרים) · `return_of_invalid_type` (החזרה מוקלדת מהראיות מול ערך-דינמי) · `DeleteExpression` על ביטויים מורכבים.
