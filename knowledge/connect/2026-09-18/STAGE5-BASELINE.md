# שלב 5 · ורמינהו בכל מנוע — מדידת-רצפה (18.9, לפני הגל הראשון)

ענף: `claude/w-yeshiva-engines-260918` · בסיס: `claude/up-connect-260917` @ 506a3aa1

כל מספר כאן מלווה בפקודה. מה שלא נמדד כתוב «לא נמדד».

---

## 0 · שני תיקוני-מדידה לפני שמתחילים

### 0א · 46 מנועים, לא 43

```
awk -F'\t' '{print $2}' engines.txt | while read f; do [ -f "$f" ] && echo OK || echo MISSING; done
```

הרשימה ב-`PLAN-100.md` §2 מונה 9+5+5+5+6+5+11 = **46**. הכותרת «43 OK» הייתה ספירת-קיום
שבה 4 נתיבים היו שגויים (חיפשו תחת `machtzev/` מה שיושב בשורש). הנתיבים האמיתיים:

```
yeshiva/purpose.mjs      (לא machtzev/yeshiva/purpose.mjs)
engine/atlas.mjs         (לא machtzev/engine/atlas.mjs)
engine/lib.mjs           (לא machtzev/engine/lib.mjs)
gen/packs-apply.mjs      (לא machtzev/gen/packs-apply.mjs)
```

אחרי התיקון: **46 מתוך 46 קיימים · 0 חסרים.**

### 0ב · 4 אוכפים היום, לא 5

```
grep -c 'ורמינהו\|rminhu\|--none' <46 המנועים>
```

| מנוע | אזכורים |
|---|---|
| `machtzev/search-record.mjs` | 8 |
| `machtzev/generator/particles.mjs` | 7 |
| `machtzev/search-proof-check.mjs` | 2 |
| `machtzev/generator/tzinor.mjs` | 2 |
| **כל 42 האחרים** | **0** |

`LEARNED-2026-09-18.md` §2 מונה את `cross-source-check.mjs` כאוכף חמישי. **הוא 0** — אין בו
אף אזכור. המספר הנכון: **4 מתוך 46 מזכירים · 42 לא · 0 מדווחים לפנקס.**

---

## 1 · הרצפה שנחתמת — משטרה מלאה לפני הגל

```
node machtzev/police.mjs
⇒ 57 ran · 0 skipped · 1 yellow · 0 failed · מרשם 58
   הצהוב: nlcompile [tool=flutter]
```

**המנהל מסר «58 ran · 0 failed · 0 skipped». בקונטיינר הזה זה 57+1-צהוב, וזה אינו פער —
זה ההיקף** (CLAUDE.md: «ההיקף תלוי-קונטיינר»):

```
ls /root/flutter/bin/flutter   ⇒ No such file or directory
ls /tmp/wt-bs-gen/app_flutter  ⇒ No such file or directory
ls /root/dart-sdk/bin/dart     ⇒ קיים
```

אין Flutter ואין עץ-buildsmart ⇒ `nlcompile` צהוב מבנית. **זו הרצפה שאני נועל: 57 ran ·
1 yellow (nlcompile) · 0 failed.** כל אדום שיופיע הוא שלי.

### 1ב · באג-סביבה שנסגר לפני הרצפה (L110 מילה-במילה)

הריצה הראשונה החזירה **`failed learn`** — 9 שורות `fatal: bad object <blob>`. זו לא רגרסיה
ולא באג במנוע: הקלון היה **רדוד** (`.git/shallow` · 97 קומיטים), ושער `learn` מאמת בלובים
של הלקחים ההיסטוריים. חֶסֶר-פיגום, לא נסיגה — בדיוק L110 §3.

```
git rev-list --count HEAD                              ⇒ 97
git fetch --depth=2000 origin claude/up-connect-260917
git rev-list --count HEAD                              ⇒ 1365
node machtzev/police.mjs --fast                        ⇒ ran learn · 45 ran · 0 failed
```

**לקח למי שמריץ את המשטרה בקלון-טרי: `learn` אדום עם `bad object` = קלון רדוד, לא שער שבור.**
לא נגעתי בשער.

---

## 2 · שש-עשרה מתוך 46 נעוצות — חסימה, לא בחירה

```
for f in <46>; do grep -F "$f" machtzev/pins.sha256 >/dev/null && echo "PIN: $f"; done
```

```
machtzev/cross-source-check.mjs          machtzev/generator/auto-logic.mjs
machtzev/generator/cover.mjs             machtzev/generator/auto-skin.mjs
machtzev/generator/particles.mjs         machtzev/census/oracle.mjs
machtzev/generator/op-census.mjs         machtzev/census/atom-index.mjs
machtzev/generator/peruk.mjs             machtzev/census/atom-census.mjs
machtzev/generator/hamtzaa.mjs           machtzev/census/logic-census.mjs
machtzev/generator/quarry-golden.mjs     machtzev/census/import-graph.mjs
machtzev/generator/behavior-plan.mjs
machtzev/generator/synth.mjs
```

הנחיית-המנהל נקבה 11 נעוצים; `pins.sha256` (139 קבצים, **נגזר**) מוסיף 10 שלא היו ברשימה:
`cover` · `op-census` · `peruk` · `hamtzaa` · `quarry-golden` · `behavior-plan` · `synth` ·
`auto-logic` · `auto-skin` · `import-graph`.

**אין נגיעה בהם בלי `Allow: pins-write:<קובץ> <הכרעה-N>`** + `pins-check --write` באותו קומיט.
מתוכם `census/atom-index.mjs` ו-`census/oracle.mjs` שייכים לעובד של שלב-2 — עליהם אני מוותר
בכל מקרה.

**ההיקף הפתוח לי בלי אישור: 30 מתוך 46.**

---

## 3 · הפנקס — שאלה שנפתרה במדידה, לא בהצהרה

`gate.py:70` ⇒ `STATE_DIR = Path(".maimatai")` — **יחסי ל-CWD**. כלומר כשמריצים את השער
מתוך ריפו-המחולל, הפנקס נולד שם. הוא לא קיים כאן היום:

```
ls .maimatai/  ⇒ No such file or directory
```

ו-`seeds.json` (‏`asked`/`changed`) נגזר מ-`gate.py:seed_stats` שקורא **רק** רשומות `qa` —
לא `rminhu`. לכן **דיווח-מנוע אינו יכול להזיז `asked/changed` ב-`seeds.json`** בלי שינוי
ב-`gate.py`, שיושב בריפו אחר. (וממילא L117 אוסר לגעת ב-`seeds.json`.)

**ההכרעה שלי, בתוך היקף-הסמכות:** המנועים כותבים **לאותו קובץ ובאותה צורת-רשומה** שבה
`gate rminhu` כותב — `{t, prompt, engine, searched, rminhu:{matter, sources|none}}` ב-
`.maimatai/log.jsonl`. **פנקס אחד** (L114), לא שני. הוכחה שהישיבה קוראת אותם:

```
cd <תיקייה עם .maimatai/log.jsonl שנכתב ע"י yeshiva/rminhu.mjs>
PYTHONPATH=/home/user/yeshiva-engine python3 -m yeshiva.gate log </dev/null
⇒ — t · עניין-בדיקה
     ורמינהו על «עניין-בדיקה»:
       x  ⟶  פליגא: ציון 1 מתחת לרצפה 3 — אין חפיפת-טוקנים
   — t · שני
     ורמינהו על «שני»:
       y  ⟶  חד שיעורא: מתחווט
   — t · שלישי
     ורמינהו על «שלישי»:
       לא מצינו — חיפשתי ב-atlas.widgets; לא מצינו
```

**הקורא של הישיבה קרא את מה שהמנוע כתב, בלי שינוי בישיבה.** זה נמדד, לא הוצהר.

---

## 4 · השכבה — `yeshiva/rminhu.mjs`

לא מנוע חדש (יקום סגור, הכרעה-22): **חילוץ** של `rminhuAtom` מ-`machtzev/generator/particles.mjs`
(קומיט 80fabc33 · 27 שורות) לשכבה אחת מיוצאת, **בתוספת הדיווח** שחסר שם (L114: «מהלך בלי
דיווח = חצי מהלך»). למה שכבה ולא 42 עותקים — L111 מילה-במילה: «פותר אחד, מיוצא, ולא *רק שתי
שורות, מהר להעתיק*».

השכבה **אוכפת** את אותן דחיות שהשער הישיבתי אוכף (`gate.py:cmd_rminhu`), כדי שהפנקס לא
יתמלא ב«פליגא» ריקים — נבדק בחבלה מכוונת:

```
פסק «פליגא: לא» (קצר מ-25)  ⇒ DENIED «פליגא» בלי הכרעה: מי גובר ולמה? (חילוק לפני הכרעה)
«לא מצינו» בלי searched/none ⇒ DENIED «לא מצינו» חייב לומר מה חיפשת — «אין» = «לא-חיפשת»
```

---

## 5 · מה נמדד אחרי כל גל

```
grep -c 'rminhu\|ורמינהו' <46 המנועים>          # אזכור
grep -l "yeshiva/rminhu.mjs" <46 המנועים>       # אכיפה (ייבוא השכבה) — חזק יותר מאזכור
wc -l .maimatai/log.jsonl                        # מהלכים שנרשמו בריצה אמיתית
node machtzev/police.mjs                         # 57 ran · 1 yellow · 0 failed
node machtzev/generator/behavior-plan.mjs --goal knowledge/connect/goals/liba.txt
node machtzev/mahulal/nl-smoke.mjs --compile
```
