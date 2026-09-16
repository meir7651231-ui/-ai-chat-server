# 2א · תשתית — hooks · workflows · box-drafts · server-gen · yeshiva

**11/34 מנועים ממופו** · מיפוי בלבד — לא חובר, לא נבנה, לא תוקן, לא שונה קוד.

הרשימה נגזרה מהפקודה, לא מפרוזה:
```bash
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' \
  | grep -E '^(\.githooks/|\.github/workflows/|\.claude/hooks/|box-drafts/|server-gen/balagan/|yeshiva/)'
# ⇒ 34
```

| מנוע | s22 | connectAt | תמצית |
| --- | :-: | --- | --- |
| `.github/workflows/gen.yml` | 3 | machtzev/generator/regen.mjs — כשלב-פרסום; או הפוך: .github/workflows/gen.yml:53-62 להחליף node gen/build.mjs ב-node machtzev/generator/regen.mjs. זו  | זהו הצינור היחיד בריפו שמממש «משפט בעברית ⇒ אתר» מקצה-לקצה בלי אדם באמצע, כולל טופס workflow_dispatch עם שדה «המשפט בעברית» |
| `.githooks/pre-commit` | 2 | machtzev/generator/regen.mjs — שלב-אימות אחרי הפליטה. היום הקשר הפוך ולא-מוצהר: machtzev/generator/genesis-gen.mjs:638 כותב ל-new/atoms, ו-.githooks/p | טבעת-commit מלאה: הגנה-עצמית ⇒ staging ⇒ מנועי-hook ⇒ ראצ׳ט ⇒ משטרה ⇒ ledger |
| `.claude/hooks/pre-tool.sh` | 1 | machtzev/census/engine-index.mjs — מקור ל«מה מחולל». היום רשימת-GENERATED ב-.claude/hooks/pre-tool.sh:28 היא מחרוזת-יד (TRUTH.md\|WIRING.md\|atom-inde | tripwire על Bash/Edit/Write/MultiEdit/NotebookEdit — כל כלי אחר יוצא 0 מיד |
| `.claude/hooks/session-start.sh` | 1 | machtzev/generator/regen.mjs — שלב-כשירות בפתיחה. :18-31 (Dart) ו-:38-41 (typescript vendored) הם תנאי-הריצה של המחולל עצמו: בלי Dart אין logic-proof  | מפעיל את הפרוטוקול: מכוון את שכבת-ההפעלה ל-.githooks · chmod +x · merge-driver regen — אידמפוטנטי ואפס-רשת |
| `.githooks/pre-push` | 1 | ∅ לחיבור-למחולל. הנקודה הכנה היחידה הפוכה: .githooks/pre-push:47-48 (פתרון BUILDSMART) מחזיק את הידע ששער-שרץ-בלי-buildsmart מדווח ירוק-שקר — ידע ששיי | סקופ לפי יעד-הדחיפה (remote_ref) ולא לפי הענף המקומי, וקורא את שורות-ה-stdin שגit מזרים |
| `.github/workflows/police.yml` | 1 | ∅ לחיבור-למחולל בהגדרת connected(). machtzev/generator/regen.mjs אינו רץ ב-CI הזה כלל; הצינור נבנה סביב truth/police/verify-independent | «עד, לא חומה»: non-required, מדווח — רץ על כל ענף, על PR ועל workflow_dispatch, בלי cancel-in-progress |
| `.githooks/commit-msg` | 0 | ∅ | פוסל הודעה מתחת ל-15 תווים (תווים ולא בייטים — locale מוזרק כי ב-hook אין LANG) |
| `.githooks/post-commit` | 0 | ∅ | מוסיף ל-index את TRUTH.md · WIRING.md · CLAUDE.md רק אם הם כבר זהים ל-HEAD |
| `.githooks/post-rewrite` | 0 | ∅ לחיבור-למחולל | אחרי rebase/amend מוסיף שורה (חותמת+סוג) ל-.git/REGEN_NEEDED ומדפיס הודעה |
| `.githooks/pre-applypatch` | 0 | ∅ | exec ישיר ל-.githooks/pre-commit דרך הנתיב המוחלט של שורש-הריפו |
| `.githooks/pre-merge-commit` | 0 | ∅ | exec ישיר ל-.githooks/pre-commit |

## פיזור-הציונים
- **s22=3** — 1 מנועים
- **s22=2** — 1 מנועים
- **s22=1** — 4 מנועים
- **s22=0** — 5 מנועים

אחוז-הראיה: 11/11 מנועים עם סעיף (6) מלא. פריט בלי ראיה אינו פריט.
