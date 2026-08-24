# חוזה · חוט all-off-config
**תפקיד:** קונפיג-הלידה של ארגון חדש (הכרעת-ארכיטקט CLOUD2): ‏all-off — כל
מפתחות-המודולים ‏false **מפורש** (חוזה-הדגלים של maor: "חסר=דלוק", ולכן
לידה כבויה חייבת false כתוב); ‏features/terms ריקים; השאר מברירת-המחדל.
הבעלים מדליק בלייב מה שסוכם.
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏allModules — מערך מפתחות-המודולים (במקור: הקבוע ALL_MODULES; קיים כחוט
  נפרד ‏all-modules — החיווט ביניהם שייך לקופסה).
- ‏defaultConfig — אובייקט-הבסיס (במקור: DEFAULT_CONFIG מ-types/config).
**קלט:** slug · orgName · שני השקעים. **פלט:** אובייקט-קונפיג חדש
(‏{...defaultConfig, slug, orgName, modules: כולם-false, features:{}, terms:{}}).
**דוגמאות מחייבות:**
1. ‏slug='demo', orgName='מאור', allModules=['a','b'], defaultConfig={theme:'x'}
   ⇒ ‏{theme:'x', slug:'demo', orgName:'מאור', modules:{a:false,b:false}, features:{}, terms:{}}.
2. כל מודול ‏===false מפורש: ‏modules.a===false (לא undefined!).
3. דריסת-בסיס: ‏defaultConfig={slug:'default', modules:{a:true}, features:{f:1}}
   ⇒ בפלט ‏slug='s1', ‏modules={a:false} (ה-true נדרס), ‏features={} (רוקן).
4. עם ‏allModules של maor (9 המפתחות) ⇒ ‏Object.keys(modules).length===9
   וכולם false.
5. טוהר: ‏defaultConfig לא שונה (עותק-פרוש, לא מוטציה) והפלט אינו אותה רפרנס.
**מוצא:** maor/src/components/platform/lib.ts:58-64 (‏allOffConfig — "קונפיג-
הלידה של ארגון חדש… all-off — כל 8 המודולים false מפורש"). השכנים
ALL_MODULES ו-DEFAULT_CONFIG הפכו לשקעים (חוק-1).
