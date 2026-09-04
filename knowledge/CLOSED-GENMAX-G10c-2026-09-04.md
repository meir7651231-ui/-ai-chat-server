# ✅ CLOSED · GENMAX · G10b-ב — הזרקת-שורה ⇒ עמודת-מקום-שמור מאירה: חוזה-העמודות (G5h) מאומת-בפועל (4.9.2026)

> שלב G10b-ב של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא נחיל (הכרעה-24). כלים: `retarget.mjs` (תפר-הזרקה ב-Facts) · `app-from-sentences.mjs` (בדיקה מחוללת).

## מה נבנה
1. **תפר-הזרקה** במודולים שהזהב שלהם כבר מזריק דאטה (`this.db` + `static seed()` — students): `<E>Facts.seed()` (זרע-ההצבה של הזהב, חוק-6: מוזרק לא מומצא) · `seedList` = הזרע-הראשי (`families`) · `rowList` = היכן **רשומת-המסך** חיה — נחצב מצורת `_build()` (`for (final m in (f['members'] as List))` ⇒ `members`; L66: הטבלה מציגה members, לא families) · `reservedColumns` = מפתחות עמודות-המקום-השמור של G5h (Family: fatherId·motherId·community·kidsHome·kidsMarried · Teacher: specialty…) · `tableView` = תווית-המבט שמגלה את הטבלה (L67).
2. **הבדיקה המחוללת** (פר-מודול עם תפר ועמודות-שמורות): מסך נקי ⇒ מבט-טבלה ⇒ `find.text(key)` = 0 (העמודה כבויה — חוק-7) · `db = seed()` · `rowList` ראשון של `seedList` ראשון מקבל `key = 'מוזרק-key'` ⇒ `<E>Screen(db: db)` ⇒ מבט-טבלה ⇒ כותרת-העמודה **וגם** הערך המוזרק נמצאים.

## מה נמדד (אמת)
- **Kehila 13/13** (+Family: `fatherId`) · **Tzedaka 17/17** (+Teacher: `specialty`). ShopStore ⇐ students: תפר קיים אך **0 עמודות-שמורות** (כל שדות ShopStore קיבלו מקור במיפוי) ⇒ אין בדיקה, מדווח בכותרת.
- `flutter analyze lib/genesis/dart-gen-bs`: **0 errors** · `retarget` ≡ · `appgen` ≡ · `sentence` 10/10 · `fragops` ≡ · `coredart` ≡ · `learn` ✓ (L67).
- `gen-verify --gate`: **47/85 רונדרו · 38 אטומים · 182 טאפים · 0 חריגות · exit 0** (ללא שינוי — התפר דורמנטי ברנדר-ברירת-מחדל).

## מה נתפס בדרך (L67)
הסבב הראשון: 0 תוצאות גם אחרי ההזרקה — הטבלה נבנית רק במבט `📋 טבלה` (`_mode == 1`), והמסך פותח בטריאז׳. ה-`findsNothing` הראשון "עבר" מאותה סיבה — ירוק-מטעה. תוקן ע"י חציבת תווית-המבט מהזהב (`if (_mode == N)` לפני `_table(` + `SegmentedSwitch(… selected: _mode)` ⇒ `items[N]`) והקשה עליה בבדיקה לפני כל חיפוש-עמודה.

## כנות / מה לא אומת
- התפר קיים רק במודולים שהזהב שלהם מזריק `db` (students-derived: 3/16). rooms/courses/fees/… משתמשים ב-`static const` seeds ⇒ אין הזרקה בלי שינוי-זהב (G11-ב: `loader`/`input` כמו attendance/dashboard, או הזרקת-רשומות additive).
- ההזרקה היא על **member** (רשומת-המסך) — שדה-Family על בן-משפחה: מדגים את המנגנון (העמודה מאירה כשהנתון זורם), לא טענה סמנטית; זו בדיוק מגבלת-ההצבה של Family⇐students (L66).
- הבדיקה מאמתת כותרת+ערך בטקסט; לא את מיקום-העמודה בטבלה.

## הבא (G11)
הכרעות-בעלים פתוחות · תפר-הזרקה למודולים בלי `db` · חציבת KPI-מקומיים ל-getters (fees/dashboard).
