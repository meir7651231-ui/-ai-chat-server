# חוזה · חוט install-available
**תפקיד:** האם הדפדפן מוכן להציג דיאלוג-התקנת-PWA — כלומר האם נלכד אירוע
‏beforeinstallprompt (Chrome/Edge). ההחלטה: השקע אינו null.
**שקעים (חוק-1 — מצב-המודול הוזרק כפרמטר):**
- ‏deferredInstall — האירוע-שנלכד (‏InstallPromptEvent) או **null** כשטרם
  נלכד / כבר נוצל. במקור זה משתנה-מודול שמאזין-window ממלא; הלכידה
  (addEventListener + preventDefault) היא חיווט-דפדפן — נשארת בקופסה,
  והקופסה מזריקה את הערך.
**קלט:** deferredInstall (אובייקט-אירוע או null). **פלט:** boolean.
**דוגמאות מחייבות:**
‏(null)→false · ‏({prompt(){}, userChoice:{}})→true (אירוע-שנלכד) ·
‏({})→true (כל אובייקט ≠ null) · ‏(undefined)→true (נאמן-למקור: הבדיקה
היא ‏`!== null` בלבד — במקור המשתנה מאותחל ל-null, כך ש-undefined לא קורה;
חובת-הקופסה להזריק null-או-אירוע).
**מוצא:** maor/src/lib/pwa.ts:32-34 (‏installAvailable, "האם הדפדפן מוכן
להציג דיאלוג-התקנה (Chrome/Edge אנדרואיד+דסקטופ)"; ‏deferredInstall
מאותחל null ומתמלא ב-listener של beforeinstallprompt, שורות 22-29).
