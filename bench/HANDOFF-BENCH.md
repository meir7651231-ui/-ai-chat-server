# HANDOFF · מדד 50 — נעצר בנקודה בטוחה (11.9.2026 00:40 UTC) להחלפת-מודל

## מצב
- מנוע 4 = ענף `claude/engine-l105` (נדחף, על G60, משטרה 55/57; 2 אדומים סביבתיים זהים לבסיס). לא ממוזג.
- ענף זה (`claude/bench-50`) = הרתמה + המדד + כל התוצאות + הדו"חות (bench/research/45,46,47).
- **results-e4/f0** (Fable לבד על מנוע 4): **הושלם 50/50 ריצות** — עדיין לא סוכם ולא נשפט-לשקרים. סיכום: `node bench/aggregate.mjs` לא מכיר results-e4; להריץ את סקריפט-הסיכום ב-47 על `results-e4/f0`, ואז `RESULTS=results-e4 ARMS=f0 ./judge-reports.sh`.
- **results-e4b** (ריצה שנייה h0+hf על מנוע 4): **41/50 משימות הושלמו** כשנעצר; העובדים מתו עם הסשן. המשך: `BASE_DIR=<exp-BASE4> BASE_HASHES=<hashes של new/ ב-exp-BASE4> RESULTS=results-e4b ./bench.sh h0,hf 3` — מדלג על משימות עם final.json.
- results-e4 h0/hf (ריצה 1 על מנוע 4) הושלם וסוכם ב-47.

## איך משחזרים סביבה (הכל היה ב-/tmp של הסשן ונעלם)
1. exp-BASE4 = `git clone` של הריפו על `claude/engine-l105` + `node ../regen-run.mjs` (רשימת REGEN בלי tighten) ⇒ `find new/dart-gen-bs new/dart-data-bs -type f | sort | xargs sha256sum > base-hashes.txt`.
2. Flutter 3.47.3 ב-PATH · עותקי `buildsmart/app_flutter` (אחרי `flutter pub get`) בשם bs-compile-1..5 ליד הריפו (run-task.sh נועל אחד לכל עובד ל---compile).
3. `claude` CLI עם Haiku (`claude-haiku-4-5-20251001`) ו-Fable (`claude-fable-5-1`); `bench.sh` מריץ `claude -p` עם allowlist.
4. שופט-השקרים: `judge-reports.sh` (Haiku, ~0.05$ לדו"ח).

## מה נשאר לפי סדר
1. לסכם f0 על מנוע 4 (יש) ולעדכן את הטבלה ב-47 (העמודה "Fable לבד" כרגע מהמנוע הישן).
2. להשלים results-e4b (9 משימות) ולדווח ממוצע/רעש של שתי הריצות.
3. לא-חובה: מיזוג engine-l105, 3 הכישלונות, טסטים במקום analyze.
