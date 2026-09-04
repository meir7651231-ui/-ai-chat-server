# ✅ CLOSED · GENMAX · G10b-א — סינון-לפי-מדד: הקפיצה מהרכזת פותחת כרטיס **וגם** מסננת את הטבלה (4.9.2026)

> שלב G10b-א של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא נחיל (הכרעה-24). כלים: `retarget.mjs` (תפר-סינון) · `app-from-sentences.mjs` (הרכזת שולחת מדד + בדיקה).

## מה נבנה
1. **תפר-סינון `initialMetric`** בכל מסך-retarget שיש לו מדד בצורת-where (10/16): קונסטרקטור `this.initialMetric` + שדה · `String? _metric` ב-State, ננעל ב-`initState` **רק אם למדד יש שורות** (`heroRows(key).isNotEmpty` — מדד-ריק ⇒ ללא סינון, לא טבלה-ריקה בשקט) · שורת `final visible = …;` — **היחידה** ב-build של כל 9 הזהבים (צורה אחידה: `X.filter(X.search(rows, _q), _locks)`) — הופכת ל-`visibleAll` + `visible` מסונן **לפי מזהה** לשורות-המדד (L66: שורות-המדד וטבלת-המסך = אותו סוג-רשומה) · `AlertBanner('🎯 מסונן למדד: <תווית> · N מתוך M')` + `SoftButton('✖ בטל סינון-מדד')` נשתלים מיד אחרי `children: [` של ה-DsScaffold הראשי (העוגן של G6c). ייבוא `soft_button.dart` נוסף רק כשחסר.
2. **הרכזת:** טאפ על אריח-ה-hero ⇒ `<E>Screen(initialPanelId: heroFirstId, initialMetric: heroKey)` — הכרטיס של הרשומה-הראשונה פתוח **והטבלה מאחוריו מסוננת** לכל הרשומות שדורשות פעולה. כותרת-הרכזת מדווחת פר-מודול `initialMetric|∅`.
3. **הבדיקה המחוללת** (hero-jump, פר-מודול): בנוסף ל-BottomSheet/גרעין — `find.textContaining('מסונן למדד')` = 1 · `find.textContaining('· <heroRows.length> מתוך')` = 1.

## מה נמדד (אמת)
- **Kehila 12/12 · Tzedaka 16/16** — ללא סבב-תיקון (הצורה האחידה של `final visible` החזיקה בכל המודולים שנבדקו: rooms · courses · students).
- תפר-סינון ב-10/16 פלטים: Volunteer/Room/ShopProduct ⇐ rooms · ShopItem/TzCampaign ⇐ courses · Family/ShopStore/Teacher ⇐ students · Supporter/TzBox ⇐ teachers (+ Member ⇐ attendance בבדיקת-מנוע). **בלי תפר (6):** Donation/Volunteer/TzCoordinator/Enrollment/Supporter ⇐ fees · WorkTask ⇐ dashboard — אין getter-סטטי בצורת-where ⇒ אין שורות-מדד ⇒ אין מה לסנן; מדווח בכותרת, לא מזויף.
- `flutter analyze lib/genesis/dart-gen-bs`: **0 errors** · `retarget` ≡ · `appgen` ≡ · `sentence` 10/10 · `fragops` ≡ · `coredart` ≡.
- `gen-verify --gate`: **47/85 רונדרו · 38 אטומים · 182 טאפים · 0 חריגות · exit 0** (ללא שינוי — הסים דורמנטי ברנדר-ברירת-מחדל).

## כנות / מה לא אומת
- הסינון הוא **לפי מזהה** בין שורות-המדד לטבלה — נכון כששני הצדדים אותו סוג-רשומה (L66); במודול שבו הטבלה מציגה סוג אחר מהמדד (לא נמצא ב-9 הזהבים, אבל אפשרי) הטבלה תתרוקן והבאנר יראה `0 מתוך M` — גלוי, לא שקט.
- הבדיקה מאמתת באנר+מונה; לא סופרת שורות-DsTable בפועל (מבנה-פנימי של האטום).
- fees/dashboard: hero=count ⇒ הקפיצה פותחת את המודול רגיל. הרחבה אפשרית: חציבת ביטויי-KPI מקומיים של הזהב ל-getters (שינוי-זהב — רק עם בדיקה חושפת).

## הבא (G10b-ב)
`<E>Facts.seed()` למודולי-`db` + בדיקה מחוללת שמזריקה שדה-סכמה שמור על רשומת-המסך ורואה את עמודת-המקום-השמור מאירה (G5h בפועל) · הכרעות-בעלים פתוחות.
