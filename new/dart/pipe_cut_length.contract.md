# חוזה · pipeCutLength

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/features/fittings/plan/cut_list.dart:40

## התנהגות
אורך-הצינור לחיתוך בין שני מרכזי-אביזר במרחק [centerToCenter], בהינתן
הניכויים בשני הקצוות. `אורך = מרכז↔מרכז − Z₁ − Z₂`, מעוגל ל-מ״מ-עשירון.

## ייעוד-עברי
מקור: own-doc — אורך-הצינור · לחיתוך · בין · שני · מרכזי-אביזר · במרחק · בהינתן · הניכויים · בשני · הקצוות · אורך · מרכז

## אימות
בדיקת-Golden (`pipe_cut_length_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/pipe_cut_length_test.dart`.
