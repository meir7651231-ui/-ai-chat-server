# חוזה · חוט write-org-cloud-config
**תפקיד:** כתיבת קונפיג-הארגון **בשלמותו** לענן — עוטף את הקונפיג במעטפת
‏{config: <עותק>} ומוסר לכתיבת-המסמך החלקית (merge אצל השכן) — כך כל מתג
באשף/לוח-הבקרה מגיע ללקוח חי, בלי לגעת בשאר שדות מסמך-הארגון
(members/manager/joinOpen…). הקונפיג עובר **עיקור-JSON**
(‏JSON.parse(JSON.stringify(config))) — מפיל ‏undefined/פונקציות ומנתק את
ההפניה מה-state שבזיכרון.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏writeOrgCloudDoc(slug, data) ⇒ ‏Promise — חוט-השכן ‏write-org-cloud-doc
  (הכתיבה בפועל: ‏platformOrgs/{slug} עם merge). החיווט — בקופסה.
**קלט:** ‏slug · ‏config (אובייקט-קונפיג מלא) · ‏writeOrgCloudDoc.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקע מזויף רושם-קריאות):
1. ‏('kehila', {features:{'shop':false}, terms:{member:'חניך'}}) ⇒ השכן נקרא
   **בדיוק פעם אחת** עם ‏slug='kehila' וארגומנט שני שהוא ‏{config: <deep-equal
   לקונפיג>} — מפתח יחיד ‏config.
2. ניתוק-הפניה: ‏העותק שבמעטפת ‏deep-equal לקונפיג אך ‏!== ממנו (עיקור-JSON).
3. עיקור-undefined: ‏config={theme:'tsohar', accent:undefined} ⇒ במעטפת
   ‏{config:{theme:'tsohar'}} — המפתח ‏accent לא קיים כלל.
4. הערך המוחזר (אחרי await) הוא ‏undefined.
5. השכן נדחה (reject 'offline') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:125-128 (‏writeOrgCloudConfig, CLOUD2).
הקריאה הפנימית ל-writeOrgCloudDoc הפכה לשקע-פרמטר (חוק-1).
