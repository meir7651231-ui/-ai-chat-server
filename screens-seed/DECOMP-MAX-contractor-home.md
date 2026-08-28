# 🔬 פירוק-מקסימלי · מסך בית-הקבלן (smart_home_screen.dart · 1,174 שורות)
> הדגם לכל 123 המסכים. כל שורה כאן חולצה מהמקור ב-origin/main (28.8.2026).
> העיקרון: בסוף הפירוק **המסך = מניפסט-דאטה + חוטים מהקטלוג**. אפס קוד ייחודי-למסך.

## שכבה 0 · פיגמנטים וטוקנים (18 אטומי-עיצוב)
| אטום | ערך במקור | הערה |
|---|---|---|
| רווחים | space2 · space4 · space6 (BsTokens) | כבר בקטלוג-הטוקנים |
| צבע-מותג | BsTokens.brand | אייקוני-האריחים |
| רדיוס | cfgRadius(context) | שקע-ערכה (config-theme) |
| תפקידי-צבע | card·ink·muted·border·box | **תפקיד≠פיגמנט (חוק-3):** muted=ink@62% · border=ink@10%/18%(כהה) · box=ink@6% — מצב-לילה = תוכנית-חיווט שנייה, לא צבע שני |
| טיפוגרפיה | 16/w800 (כותרת-סקציה) · 10/w600 (תווית-אריח) · 9 (הערת-אריח) | |
| מידות | icon=22 · tile=86/104 · dim-opacity=0.5 | |

## שכבה 1 · מחרוזות = מונחים (35 אטומי-term)
כל תווית הופכת ל-key שה-white-label יכול להחליף (termOf):
`בית` · `מחלקות` · `עוד` · `כלים מהירים` · `המלאי שלי` · `משימות העבודה` ·
`מסלול עבודה חכם` · `🌳 עץ חכם — אינסטלציה` · `הוסף לסל` · `${name} נוסף לסל` ·
`הזמנות אחרונות לאתר` · `${n} פריטים` · `₪${sum}` · `עדיין אין הזמנות — …` ·
`מועדפים` · `עדיין אין מועדפים — סמן ☆ …` · `תכנון חיבור` · `בחר מה לחבר — …` ·
`🕸️ מאתר-על` · `גלגל-חיפוש-על — …` · `🎛️ קטלוג מגדיר` · `כרטיס-הגדרה לכל מוצר …` ·
`🃏 כרטיס פנימי` · `כל המנוע במקום אחד — 13 סקציות` · `סרוק תוכנית עבודה` ·
`צלם שרטוט אינסטלציה — …` · `חלק משימות לעובדים …` · `גמר אמבטיה — מלווה אותך שלב-שלב` ·
`4 שלבים בסדר הנכון…` · `מחיר לפי ספק` · `בקרוב` · `מה כבר יש לך — במחסן ובאתר` · `—` ועוד.

## שכבה 2 · אייקונים (7+4 גליפים)
account_tree · article_outlined · chevron_left · hub_outlined · more_horiz · star · tune
‏+ אימוג'י-סקציות: 📐 📦 📋 ☆.

## שכבה 3 · חוטי-לוגיקה טהורים (7 אטומים — ניתנים-לחציבה כבר עכשיו)
| חוט | קלט ⇒ פלט |
|---|---|
| `palRoles` | ‏ColorScheme+isDark ⇒ {card,ink,muted,border,box} — חיווט-תפקידים טהור |
| `gridColsClamp` | ‏settings.gridColumns ⇒ clamp(2,6) |
| `imgFactor` | ‏small/medium/large ⇒ 0.85/1.0/1.18 |
| `textScaleClamp` | ‏scaler ⇒ clamp(1.0,1.4) |
| `cardW` / `rowH` | ‏base×compact×img(×ts) — מטריקת-מידות |
| `tileH` | ‏compact?86:104 ×ts |
| `deptsVisible` | ‏departments ⇒ ‏where(live).take(3) — הכרעת-בעלים "מסתירים, לא מעמעמים" |
(+ שכנים שכבר בקטלוג: `groupThousands` · `kOrderStageLabel`.)

## שכבה 4 · חוטי-תצוגה (6 widget-atoms טהורים)
| widget | props (הכול מוזרק) | טוהר |
|---|---|---|
| `Pad` | child | ✅ נקי |
| `SectionTitle` | text · ink | ✅ אחרי הזרקת-צבע |
| `MiniTile` | icon·label·note?·dim·onTap · פיגמנטים | ✅ (Semantics מובנה: `label — note`) |
| `OrderCard` | order{stage,items,sum}·onOpen · פיגמנטים | ✅ |
| `EmptyCard` | text · פיגמנטים | ✅ |
| `HeroCard` | title·subtitle·cta·onTap · פיגמנטים | ✅ (תבנית ל-3 ההירואים) |

## שכבה 5 · עשר הסקציות (המניפסט)
| # | סקציה | קורא (שקע-קריאה) | פועל (שקע-פעולה) | שער |
|---|---|---|---|---|
| 1 | מחלקות `_Departments` | departments·homeDepartment | ‏select(dept)⇒tab=1 | ‏!rawShell · גריד-2 קבוע |
| 2 | עץ-חכם `_SmartTreeRow` | catalog-products | ‏addToCart(p)+toast | |
| 3 | מסלול-עבודה `_WorkPath` | work-paths | ‏open(path) | |
| 4 | כלים-מהירים `_QuickTools` | — | ‏nav:Stock · nav:tasks · scanPlan | |
| 5 | הזמנות `_RecentOrders` | sysOrders | ‏open(order)/סטטוס-ריק | |
| 6 | תכנון-חיבור `_InstallStudioHero` | — | ‏nav:InstallStudio | מודול `compat` |
| 7 | מועדפים `_Favorites` | productFavorites·catalog | ‏openProductSheet | בלי-רווח-סוגר |
| 8 | מאתר-על `_SuperFinderOpen` | catalogSection·diveQuery | גלגל-צירים חי | דגל-build ‏kAxisDive |
| 9 | קטלוג-מגדיר `_CatalogConfigOpen` | — | מסך-הגדרה חי בפנים | תמיד |
| 10 | כרטיס-פנימי `_InternalCardOpen` | related-info | כרטיס-13-סקציות חי | דגל-build ‏kInternalCard |

## שכבה 6 · הקומפוזר (חוט-סדר אחד + כללי-רווח)
`homeOrder`: ‏screenSections.visibleIds('home') ⇒ סדר-הסקציות (ריק ⇒ ברירת-מחדל ביט-זהה).
כללי-רווח: space4 אחרי כל סקציה · מועדפים בלי-רווח · פתיח space2 · פדינג-תחתון space6.
**זה כל "המסך": פונקציה-טהורה של (סדר, שערים) ⇒ רשימת-סקציות.**

## שכבה 7 · שקעי-הלוח (IO — לא-אטומים, הכרעה-13)
קריאה: catalogSettings · screenSections · sysOrders · productFavorites · catalogRepository · homeDepartment.
כתיבה: homeDepartment · mainTab · smartCart.add · catalogSection · diveQuery.
ניווט: Stock · InstallStudio · CatalogWheel · siteHub · scanPlanSheet · lipskeyProductSheet. ‏+toast.

## השורה
**1,174 שורות ⇒ ‏18 פיגמנטים + 35 מונחים + 11 גליפים + 7 חוטי-לוגיקה + 6 חוטי-תצוגה
+ מניפסט-10-סקציות + קומפוזר-אחד + 15 שקעי-לוח.** ‏~66 אטומים, שמתוכם ~25 (פיגמנטים,
מונחים, MiniTile, HeroCard, EmptyCard, palRoles, המטריקות) **משותפים לכל 123 המסכים** —
המסך הבא כבר יתחיל עם חצי-מדף מלא. זהב-ההוכחה: קומפוזר(מניפסט-ריק) ≡ המסך-החי ביט-זהה.
