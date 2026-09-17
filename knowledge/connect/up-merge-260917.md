# up-merge · מיזוג גל-העובדים 2026-09-17b ל-claude/up-connect-260917 — מדידות המנהל

כל מספר כאן — עם הפקודה שהפיקה אותו. סביבה: DART=/root/dart-sdk/bin/dart · PATH=/root/flutter/bin · BUILDSMART=/tmp/wt-bs-gen (buildsmart@hei-rxv1v1).

## 1 · מה נקמט (אישור-בעלים: בועה 21:23 "יש אישור צא לדרך" · צ׳אט "מאשר את שניהם")

| קומיט | מה | משטרה |
|---|---|---|
| 80e27ab8 | up-compile: renderWizard פולט קוד שמתקמפל (render-ds.mjs · Allow: pins-write הכרעה-22) | pre-commit 45 ran · 0 failed |
| 458ce738 | שער nlcompile (gates.tsv · police.mjs · KNOWN_TOOLS flutter/buildsmart · TRUTH 57⇒58) | 45 ran · 0 failed · מרשם 58 |
| 880e3c95 | merge w-psak-goal (e37427fc) | 45/0 |
| 41596556 | merge w-regen-oom (6a1355bb) | 45/0 |
| 6e4c0d3b | merge w-goal-pipeline (f484860a) — קונפליקט רק ב-pins.sha256 ⇒ `pins-check --write`; behavior-plan.mjs התמזג אוטומטית | 45/0 |

`git merge-tree --write-tree --name-only 458ce738 origin/claude/w-<name>-260917` — אף ענף לא התנגש עם up-connect; regen-oom⨉goal-pipeline רק pins.sha256.

## 2 · השער החדש, נמדד ישירות

```
node machtzev/mahulal/nl-smoke.mjs --compile        # BUILDSMART=/tmp/wt-bs-gen
📊 §22-קומפילציה · 35 משפטים · 35 ירוקים · 0 אדומים · 0 שגיאות-analyze · 0 קריסות-בנייה
   זמנים: בנייה 19.4s · analyze 22.7s · סה"כ 42.7s · exit 0
```
בלי buildsmart: `⚪ מדולג: אין buildsmart … tool=buildsmart` · exit 2 · 0.3s ⇒ yellow (לא failed) בזכות KNOWN_TOOLS.

## 3 · אימות-בריצה של behavior-plan.mjs הממוזג (שני עובדים נגעו באותו קובץ)

### 3.1 · regen-oom — צורך חיצוני x.phoneShow, מסלול --blind
```
node scratchpad/verify/peak.mjs <log> node machtzev/generator/behavior-plan.mjs --needs phone-needs.json --blind --out phone-plan.json
exit=0 elapsed=49.6s peakRSS=277MB · pick "formatIsraeliPhone∘normPhone"
```
דיווח-העובד: 41s · 283MB · אותו pick (לפני: 2m12s · 6,773MB). ✓ תואם.

### 3.2 · goal-pipeline — הפקודה-האחת על מטרת-התשלומים
```
node machtzev/generator/behavior-plan.mjs --goal goal.json --ns payments-verify     # goal.json = {text: goals/payments/goal.txt, needs: goals/payments/needs.json}
exit=0 elapsed=213.9s peakRSS=1388MB · 7/7 צרכים מוכחים · 3 סבבים
```
picks 7/7 זהים ל-`goals/payments/ledger.json` של העובד · `gen_goal_payments-verify.dart` ≡ `gen_goal_payments.dart` (עד שם-ה-ns). דיווח-העובד: 209s · 7/7. ✓ תואם.
הבדל אחד, צפוי: צעד 1 (פסק) — אצל העובד `0 מקורות · 3 מתגים`, אחרי המיזוג `7 מקורות · 13 מתגים` (purpose.mjs של psak-goal פעיל).

## 4 · ממצא-מיזוג: צעד 2 (אפס-המצאה) נשאר «לא-זמין» כוזב

`hamtzaaNeeds` קרא `j.needs || j.rows`; `hamtzaa --needs --goal --json` (psak-goal) מחזיר `{needs: 7, rows: […]}` ⇒ rows=7 ⇒ "הפלט אינו {need, ok, missing, sources}". שני העובדים ירוקים לבד — הפער נראה רק בריצה משותפת. תוקן: `Array.isArray` על rows ואז needs.

hamtzaa בפועל על 7 צרכי-התשלומים:
```
node machtzev/generator/hamtzaa.mjs --needs machtzev/generator/goals/payments/needs.json --goal machtzev/generator/goals/payments/goal.txt --json
g1 ✓ · g2 ✓ (30 ⇐ ליטרל במטרה) · g3a ✗ ('due'@consts · 'id'@examples) · g3 ✗ (אותו דבר) · g4 ✓ ('amount' ⇐ schema-fields Donation.amount ⇐ «תשלומי») · g5 ✓ · g6 ✓
```
⇒ גלאי-ההמצאה תופס שמות-שדות (`due`, `id`) שהופיעו בדוגמאות-הצורך ולא במטרה. **שאלה לבעלים** (לא הוכרע כאן): האם שמות-השדות due/id הם חוזה? צעד 2 אחרי התיקון — ראה §5.

## 5 · ריצה אחרי תיקון rows (ns=payments-verify2)

```
node machtzev/generator/behavior-plan.mjs --goal goal.json --ns payments-verify2
✓ 1/7 פסק: 7 מקורות · 13 מתגים
⛔ 2/7 אפס-המצאה לכל צורך: נפסל — 7 נבדקו · 5/7 המשיכו להוכחה · נפסלו: g3a.predicate.recordOverdue30, g3.collection.overdueList
✓ 5/7 חיווט ⇒ Dart: 5 התנהגויות מוכחות (bhOverdueDays, bhOverdue30, bhTotalDue, bhReminder, bhSendReminder) · ∅ 0
⇒ 5/7 צרכים מוכחים · 1 סבבים · exit=0 · 76.0s · שיא-RSS 1,028MB
```
זה המצב האמיתי לפי הדוקטרינה (אפס-המצאה): שני החלקיקים שנפסלו נשענים על שמות-שדות (`due`, `id`) שהמנהל הכניס לדוגמאות ולא הבעלים למטרה. לפני התיקון (§3.2) הם «עברו» רק כי צעד 2 דילג בשקט. הכרעת-הבעלים נשאלה בערוץ (inbox mgr-1758151500000 · tasks/mgr-goal): אם לתשלום יש «מועד» ולהורה «מזהה» — המטרה תורחב והחלקיקים יחזרו (7/7 כמו ב-§3.2, אותו קוד).
