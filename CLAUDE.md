# Genesis (Orbit) — הוראות לכל סשן
> **זה שער-הכניסה. כל מה שנלמד בדם — כבר כתוב. אל תלמד מחדש, קרא.**

## מה הריפו הזה
הבנייה-מחדש הנקייה של האימפריה (maor · buildsmart · yoman) — "המחצב":
הקוד הישן פורק ל-51K+ אטומים רשומים; כאן נבנה העץ החדש מחוטים-טהורים
וקופסאות-חיווט, לקראת **המחולל** (משפט-בעברית ⇒ פיצ'ר מורכב מהקטלוג).
ענף-העבודה: `claude/mah-kora-0by8kw`. אין push ל-main של הריפו הישנים בלי אישור-בעלים.

## 📖 סדר-קריאה חובה (לפני כל עבודה)
1. `LAW.md` — 7 חוקי-החשמלאי (חוקת-הבעלים: אטום-טהור, קופסה, לוח-אם, חוזה-קודם, טוהר, אפס-סודות, החלפה-הפיכה)
2. `machtzev/LEARNINGS.md` — 20+ לקחים; כל בריחה הופכת לחוק כאן, באותו סשן
3. `machtzev/AGENT-CODE.md` — המגילה שכל סוכן-גל לובש (עשרת-הדיברות)
4. `machtzev/CURRICULUM.md` — תורת-האימפריה המזוקקת (מה לאמץ ומתי)
5. `machtzev/DECISIONS.md` — פנקס-הכרעות-הבעלים הממוספר (מצטטים "הכרעה N")
6. `WIRING.md` — מפת-החיווט החיה (מחוללת — אל תערוך ידנית)

## 🚨 המשטרה (חובה ירוקה לפני כל commit)
```bash
node machtzev/police.mjs --fast   # לכל commit: חיווט+חוזה+מחצבה+pins (שניות)
node machtzev/police.mjs          # לסוף-גל: + selftest + mutation (דקות)
```
‏6 שערים עם ran-ledger (מרשם: machtzev/gates.tsv) · 10 קבצים נעולי-חתימה
(pins.sha256; עדכון-שוטר = `node machtzev/pins-check.mjs --write` באותו commit).
פסק-דין רק על עץ נח (L14). קופסה גמורה רק עם: חוטים+חוזים+בדיקות+מגן-הכרעה+רתמת-זהב.

## 🏭 המפעל (המכונות)
```bash
node machtzev/one.mjs             # ⚡ המנוע-האחד: רענון-מקור→פירוק-מסכים→דדופ→מונחים→הרכבה→טוהר→משטרה→ONE-STATUS.md (‏--full למשטרה-מלאה)
node machtzev/run.mjs             # (במאור) מפקד+מחלצים+זיקוק+משטרה — פר-גל
node machtzev/run.mjs --fast      # משטרה בלבד
node machtzev/factory/gen-wires.mjs <genesis> maor    # חציבת-טיוטות (TS→JS)
node machtzev/factory/gen-wires-dart.mjs <genesis>    # חציבת-טיוטות-Dart מ-app_flutter (בנייה-חכמה החי)
node machtzev/promote-auto.mjs    # (בגנסיס) קידום-חינם: צילום/Golden
node machtzev/gen-wiring-doc.mjs  # (בגנסיס) חילול מפת-החיווט
node machtzev/box-coverage.mjs    # (בגנסיס) מד-מוכנות-קופסאות ⇒ box-drafts/READINESS.md
node machtzev/dedup-atoms.mjs     # (בגנסיס) בודק-כפליות-מדף (הכרעה 5): גוף/שם/מוצא — אחרי כל גל
node machtzev/dedup-cross.mjs     # (בגנסיס) כפליות חוצה-מערכות לפי-שם (מאור-JS מול בנייה-חכמה-Dart)
node machtzev/dedup-cross-dart.mjs # (בגנסיס) כפליות חוצה-ענפים לפי-גוף (Dart↔Dart) — ליבה-אימפריאלית, אחרי המרת-מאור
```
מרשם-האטומים: maor-system/machtzev/registry/ · טיוטות: quarry/ · תוכניות-קופסה: box-drafts/
🏁 **מבחן-הקומפילציה (שער-קבוע):** תוצרי-המנועים מוזרקים ל-buildsmart (ענף-העבודה,
lib/genesis/) ו-workflow ‏genesis-compile מריץ flutter analyze — ירוק=אפס-errors.
הושג 29.8: 265 אטומים · 80 מסכים-מורכבים · 79 לוחות — 1804⇒0 ב-8 סבבי-תיקון-מנוע (L25).
🟢 **30.8 — המדף-המלא ירוק:** כל 1,672 קבצי-המדף (381 ווידג'טים · 617 לוגיקה-פעילים · דאטה ·
מסכים · לוחות · מחולל) עוברים analyze באפס-שגיאות + build-web מלא בתוך buildsmart; ‏41 אטומי
חוב-המרה (שרידי-JS: truthiness/for-in) ב-QUARANTINE — ממתינים לתיקון מנוע-ההמרה. המחולל
(הכרעות 17+18) חי בתצוגה: מסך-כניסה עצמי + גשר-לוגיקה פועם (hebMonthHe · genJoinCode).

## 🌊 גלי-נחיל (קידום/קופסאות)
פרומפט-גל = "לבש את המגילה: machtzev/AGENT-CODE.md. המשימה: …" + schema מובנה.
רשימות-עבודה תמיד מ-ls (L5), חלוקה לקבצים-זרים, אפס-git לסוכנים, מאמת-עוין
צמוד (bytes-not-prose), משטרה בסוף. תבנית-workflow: promotion-engine-wave1*.js.

## 🗺️ מפת-הדרך
מחצבה-ריקה ⇒ גלי-קופסאות (60 box-drafts, כל אחת+זהב) ⇒ שכבת-מסכים (מניפסטים)
⇒ רתמת-זהב מלאה ⇒ cutover לפי חוק-7 (טוען-לצד, דגל-הפיך) ⇒ המחולל.
היעד העסקי: NORTH-STAR + ATOMS-K0 ב-maor-system/knowledge/.

## ⚠️ אזהרות שנקנו ביוקר
- הקוד-החלוץ קדוש; חוזה מתכופף למקור (L4) · בודק-נכשל ⇒ חשוד בבודק (L1)
- ‏buildsmart: קו-האמת = main (יושר 23.8); אינו multi-tenant (L16) — הכרעת-איחוד
- זהות/סודות = חיווט-הצבה, לעולם לא אטום (חוק-6, אזעקת-אבטחה 24.8)
- אין sleep/polling; רשתות-ביטחון ב-send_later; commit+push כל נחיתה

<!-- >>> agent-police >>> -->
## Verification gate (agent-police)

This repository has a machine gate. **You are not done when you think you are done — you are done when the machine says DONE.**

0. **Never guess what the customer did not say.** If part of the request is vague ("faster", "better"), contradicts itself, says
   "it doesn't work" without what happens, involves time without a time zone, or gives no example of the expected result:
   **do every part that is clear first, leave the unclear part untouched (no invented numbers, names or rules), and when nothing
   clear is left — or you hit a wall — stop and ask all the questions together. Never answer for the customer.** Then write an acceptance test from
   their answer and ask them to approve it (`node .agent-police/bin/agent-police.mjs task accept <test file>` — they run it, not you). Once approved it is locked.
   **Do not wait for that approval to work:** carry on, and list it under "What I need from you".
1. Do the task.
2. Run `node .agent-police/bin/agent-police.mjs check` and read the verdict.
3. If it says **NOT DONE**, the report names the gate and the file. Fix exactly that and run it again. Repeat until **DONE**.
4. When you report back, say what you did with **every** instruction in the request, and add two sections whenever they are not
   empty: **"Not done — and why"** and **"What I need from you"** (answers, decisions, approvals, access). The machine writes
   them for you in `.harness/handoff.md` — use it; hiding a gap fails the verdict. Claim nothing that did not happen
   (no "I tested it on staging" unless you did), and quote the machine's final verdict line verbatim.
5. **The same mistake never twice.** When the check caught a mistake and you fixed it, record a lesson so it cannot come back:
   `node .agent-police/bin/agent-police.mjs lesson add "<the rule in plain words>" --forbid "<a pattern of the mistake>"` (or `--test <the test that catches it>`).
   Lessons only accumulate — removing or changing one fails the verdict. If the same failure comes back twice in a row, stop
   and ask the owner which approach is right; do not try the same fix a third time.
6. **Give way to evidence, not to pressure.** When the customer asks "are you sure?" or says you are wrong, check first — run it,
   read the code, reproduce it — and answer with what you found. If you were wrong, say what showed it; if you were right, say so
   and why. "You're right" with nothing checked fails the verdict.

When the customer asks for a different behaviour, **updating the test that checks the old behaviour is part of the job** —
change its expected value to exactly what they asked for and say so (that is not weakening it).
Enforced, not suggested: do not weaken, skip or delete a test; do not leave TODOs or stubs; do not edit `harness.json` or `.harness/`;
do not bypass hooks (`--no-verify`). Each of these is its own gate, and commits are blocked until the verdict is DONE.
<!-- <<< agent-police <<< -->
