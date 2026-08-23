/** 🪨 טיוטת-חוט (דרגת-מחצבה) · TOUR_STEPS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/tour.ts:36-63 (28 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const TOUR_STEPS = [
    { view: 'home', caption: '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים' },
    { view: 'home', caption: 'סטטיסטיקות חיות — כל אריח לחיץ', anchorText: 'מדד אמינות' },
    { view: 'home', caption: '⌘K — חיפוש חכם מכל מקום', anchorText: 'חיפוש' },
    {
        view: 'families',
        module: 'families',
        caption: '🎡 מאתר המשפחות — גלגל בתוך הדף',
        anchorText: 'סינון מורחב',
    },
    { view: 'families', module: 'families', caption: 'ניקוב נוכחות — היתרה יורדת + 5 נק׳ אמינות' },
    { view: 'families', module: 'families', caption: 'רישום חיסור — עם כלל 48 השעות' },
    { view: 'courses', module: 'courses', caption: '🎡 מאתר החוגים', anchorText: 'מצא חוג' },
    { view: 'courses', module: 'courses', caption: 'חיזוי חוגים: רק תואמי גיל ומגדר' },
    { view: 'calendar', module: 'calendar', caption: '📅 עברי + לועזי · שכבות סינון' },
    // העמודות המבודדות (CONNECT חיבור 5) — צעד לכל עמודה, מגודר במודול שלה
    { view: 'tzedaka', module: 'tzedaka', caption: '🪙 קופות צדקה — רכזים, קופות בבתים, ריקונים ומבצעים' },
    { view: 'shop', module: 'shop', caption: '🛍 החנות — חבילות שירות, מלאי משותף ומימושים עם אישור' },
    { view: 'settings', caption: '⚙ ארגון, התראות, דוחות, מנוע אמינות' },
    { view: 'home', caption: 'ובחזרה הביתה — הכל התעדכן' },
    { view: 'home', caption: 'זו המערכת. חיה, מלאה, במקום אחד ✦' },
];
/**
 * סינון הצעדים לפי מודולים פעילים — צעד בלי מודול תמיד נשאר.
 * הכיתובים/עוגנים ממותגים-מחדש דרך termOf (התיוג פר-עסק מחלחל לסיור); בלי
 * config = הנוסח מהלגאסי מילה-במילה (ratchet — TOUR_STEPS עצמו לא נגע).
 */
