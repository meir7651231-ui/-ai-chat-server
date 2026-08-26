// 📦 קופסת-חיבורים · הסיור-המודרך 🎬 (Dart) — מחווטת אטומי-Dart. מקבילה ל-new/boxes/tour.mjs.
// חוזה משותף: new/boxes/tour.contract.md. מקור-האמת: maor/src/lib/tour.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// מילון-התסריט (TOUR_STEPS) הוא הכרעת-הקופסה — חי כאן בלבד (LAW חוק-5), verbatim מ-tour.mjs;
// הקבועים והחוטים מוזרקים כשקעים (חוק-1: הקופסה מייבאת אך-ורק אטומים).
import '../dart-maor/tour-stop-label.dart' as tsl; // הקבוע (getter tourStopLabel)
import '../dart-maor/tour-steps.dart' as ts; // חוט הסינון+המיתוג
import '../dart-maor/tour-advance.dart' as ta; // חוט הניווט
import '../dart-maor/spotlight-box.dart' as sb; // חוט הגאומטריה
import '../dart-maor/term-of.dart' as tof; // חוט ה-white-label

// ── מילון-התסריט — הכרעת-הקופסה (באטום tour-steps זה שקע `steps`) ──
// 14 צעדים, כיתובים מילה-במילה מכיתובי-ההדמיה של הלגאסי (script:1133-1256),
// בסדר-הלגאסי; מקור verbatim: maor/src/lib/tour.ts:36-57 / new/boxes/tour.mjs.
// final (לא getter) ⇒ מופע-יחיד יציב ⇒ זהות-הצעד נשמרת (tourSteps מחזיר את אותו s).
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
final List<Map<String, dynamic>> TOUR_STEPS = [
  {'view': 'home', 'caption': '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים'},
  {'view': 'home', 'caption': 'סטטיסטיקות חיות — כל אריח לחיץ', 'anchorText': 'מדד אמינות'},
  {'view': 'home', 'caption': '⌘K — חיפוש חכם מכל מקום', 'anchorText': 'חיפוש'},
  {
    'view': 'families',
    'module': 'families',
    'caption': '🎡 מאתר המשפחות — גלגל בתוך הדף',
    'anchorText': 'סינון מורחב',
  },
  {'view': 'families', 'module': 'families', 'caption': 'ניקוב נוכחות — היתרה יורדת + 5 נק׳ אמינות'},
  {'view': 'families', 'module': 'families', 'caption': 'רישום חיסור — עם כלל 48 השעות'},
  {'view': 'courses', 'module': 'courses', 'caption': '🎡 מאתר החוגים', 'anchorText': 'מצא חוג'},
  {'view': 'courses', 'module': 'courses', 'caption': 'חיזוי חוגים: רק תואמי גיל ומגדר'},
  {'view': 'calendar', 'module': 'calendar', 'caption': '📅 עברי + לועזי · שכבות סינון'},
  // העמודות המבודדות (CONNECT חיבור 5) — צעד לכל עמודה, מגודר במודול שלה
  {'view': 'tzedaka', 'module': 'tzedaka', 'caption': '🪙 קופות צדקה — רכזים, קופות בבתים, ריקונים ומבצעים'},
  {'view': 'shop', 'module': 'shop', 'caption': '🛍 החנות — חבילות שירות, מלאי משותף ומימושים עם אישור'},
  {'view': 'settings', 'caption': '⚙ ארגון, התראות, דוחות, מנוע אמינות'},
  {'view': 'home', 'caption': 'ובחזרה הביתה — הכל התעדכן'},
  {'view': 'home', 'caption': 'זו המערכת. חיה, מלאה, במקום אחד ✦'},
];

// ── החיווט ──
// שקע-IO מוזרק: isModuleOn(module)⇒bool — מצב-המודולים חי ב-store/config של המארח
// (moduleOn), לא כאן. config (OrgConfig) אופציונלי — בלעדיו הנוסח המקורי מילה-במילה
// וזהות-האובייקט נשמרת (tour.ts:65,72). termOf מוזרק כשקע לחוט (חוק-1).
List<dynamic> steps(dynamic isModuleOn, [dynamic config]) =>
    ts.tourSteps(TOUR_STEPS, isModuleOn, tof.termOf, config);

// ניווט הבא/הקודם: לפני-ההתחלה נצמד ל-0, אחרי-הסוף = null (סיום). tour.ts:80-85.
// tear-off ישיר של האטום (מקביל ל-export const advance = tourAdvance).
final advance = ta.tourAdvance;

// גאומטריית ה-spotlight: rect + vw/vh = מדידת-DOM מוזרקת (חוק-1, אפס DOM כאן);
// ריפוד ברירת-מחדל pad=10 מהמקור (tour.ts:98) חי באטום. tear-off ישיר.
final spotlight = sb.spotlightBox;

// ── החשיפה: קבוע-הכפתור (שם-ה-API כמו במקור-ה-JS; מוזן מהאטום lowerCamel) ──
final String TOUR_STOP_LABEL = tsl.tourStopLabel;
