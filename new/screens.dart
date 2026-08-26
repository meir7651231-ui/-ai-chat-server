// 🖥️ שכבת-המסכים · מניפסטים — מעל לוח-האם, מתחת למחולל.
// כל מסך = הצהרה טהורה: אילו יכולות הוא דורש (requires) ואילו קטעים הוא מרכיב
// (sections — הפניות למתודות-הלוח). מסך מוצג רק אם כל היכולות שהוא דורש דולקות
// בהצבה הנוכחית. זה מה שהמחולל **פולט**: לא קוד — מניפסט שהשלד מרנדר.
//
// חוק-7 (החלפה-הפיכה): המניפסט הוא נתון, לא לוגיקה. שינוי-מסך = עריכת-נתון,
// אפס-מגע-בקוד. אפס IO, אפס store — נגזרת טהורה של רשימת-היכולות הדולקות.
//
// מקור-היכולות: board.dart::capabilityCatalog (15 — 7 מאור · 8 בנייה-חכמה +
// bs.pipe כשמחווט). המניפסטים כאן מכסים את היכולות הקיימות; הוספת-יכולת ⇒
// הוספת-מניפסט (ratchet כיסוי בהמשך).

/// מקטע-מסך: הפניה למתודת-לוח שהמסך מרנדר (label לתצוגה · call = שם-המתודה).
class ScreenSection {
  final String call; // שם מתודת-הלוח (למשל 'bsPlanShortestPath', 'supportersCockpit')
  final String labelHe;
  final String icon;
  const ScreenSection(this.call, this.labelHe, {this.icon = ''});
}

/// מניפסט-מסך טהור: זהות + היכולות-הנדרשות + המקטעים שהוא מרכיב.
class ScreenManifest {
  final String id;
  final String titleHe;
  final String icon;

  /// היכולות שחייבות להיות דולקות כדי שהמסך יופיע (⊆ של היכולות הדולקות).
  final List<String> requires;

  /// המקטעים שהמסך מרכיב — כל אחד קורא למתודת-לוח.
  final List<ScreenSection> sections;

  const ScreenManifest({
    required this.id,
    required this.titleHe,
    required this.icon,
    required this.requires,
    this.sections = const [],
  });

  /// המסך זמין בהצבה שבה [lit] דולק? — כל היכולות הנדרשות דולקות.
  bool availableIn(Set<String> lit) => requires.every(lit.contains);
}

/// קטלוג-המסכים — כל מסך והיכולות שהוא מרכיב.
/// מיזוג חוצה-דומיין: מסך יכול לדרוש יכולות ממאור ומבנייה-חכמה יחד
/// (למשל מתכנן-הצנרת עם תור-משימות; מבט-ההנהלה חוצה-מודולים).
const List<ScreenManifest> kScreenManifests = [
  // ── מסכי-מאור (ליבה) ──────────────────────────────────────────────
  ScreenManifest(
    id: 'cockpit', titleHe: 'חלון-העבודה', icon: '🎯',
    requires: ['supporters.cockpit'],
    sections: [
      ScreenSection('supportersCockpit', 'קוקפיט התורמים', icon: '🎯'),
      ScreenSection('cockpitFeed', 'פעילות חיה', icon: '📡'),
    ],
  ),
  ScreenManifest(
    id: 'families', titleHe: 'משפחות', icon: '👨‍👩‍👧',
    requires: ['families'],
    sections: [ScreenSection('familiesList', 'רשימת המשפחות', icon: '📋')],
  ),
  ScreenManifest(
    id: 'diary', titleHe: 'יומן', icon: '📅',
    requires: ['diary'],
    sections: [ScreenSection('diaryBoard', 'יומן החדרים', icon: '📅')],
  ),
  ScreenManifest(
    id: 'reports', titleHe: 'דוחות', icon: '📊',
    requires: ['reports'],
    sections: [ScreenSection('reportsManagement', 'מבט הנהלה', icon: '📈')],
  ),
  ScreenManifest(
    id: 'hebcal', titleHe: 'לוח עברי', icon: '🕎',
    requires: ['hebrew'],
    sections: [ScreenSection('hebrewCalendar', 'הלוח העברי', icon: '🕎')],
  ),
  // ── מסכי-בנייה-חכמה ───────────────────────────────────────────────
  ScreenManifest(
    id: 'pipe-planner', titleHe: 'מתכנן הצנרת', icon: '🔧',
    requires: ['bs.pipe'],
    sections: [
      ScreenSection('bsPlanShortestPath', 'מסלול חיבור קצר', icon: '🔀'),
      ScreenSection('bsAlternativePaths', 'מסלולים חלופיים', icon: '🔱'),
      ScreenSection('bsPressureDrop', 'חישוב אובדן-לחץ', icon: '💧'),
      ScreenSection('bsKitForChain', 'ערכת התקנה', icon: '🧰'),
      ScreenSection('bsPriceEstimate', 'הערכת מחיר', icon: '₪'),
      ScreenSection('bsCompliance', 'צ׳קליסט תקינה', icon: '✅'),
    ],
  ),
  ScreenManifest(
    id: 'manager', titleHe: 'לוח מנהל', icon: '👔',
    requires: ['bs.workflow'],
    sections: [
      ScreenSection('bsWorkflowNextStage', 'שלבי הזמנות', icon: '🚚'),
      ScreenSection('bsManagerBrief', 'תדריך המנהל', icon: '📋'),
    ],
  ),
  ScreenManifest(
    id: 'studio', titleHe: 'סטודיו', icon: '🏢',
    requires: ['bs.studio'],
    sections: [ScreenSection('bsStudioScope', 'טווח הפרויקט', icon: '🎯')],
  ),
  ScreenManifest(
    id: 'assistant', titleHe: 'עוזר חכם', icon: '🤖',
    requires: ['bs.assistant'],
    sections: [ScreenSection('bsAssistantCategory', 'ניתוב שאלה', icon: '🧭')],
  ),
  // ── מסך מיזוג חוצה-דומיין (מאור+בנייה-חכמה יחד) ────────────────────
  ScreenManifest(
    id: 'crm-invoices', titleHe: 'לקוחות + חשבוניות', icon: '🧾',
    requires: ['supporters.cockpit', 'bs.projects'],
    sections: [
      ScreenSection('supportersCockpit', 'תיק הלקוח', icon: '👤'),
      ScreenSection('bsInvoiceHebrewLine', 'חשבונית בתאריך עברי', icon: '🧾'),
    ],
  ),
];

/// המסכים הזמינים בהצבה שבה [litCaps] דולק — כל מסך שכל-דרישותיו דולקות.
/// זה מה שהשלד מרנדר: הצבה ⇒ רשימת-מסכים, אפס-קוד.
List<ScreenManifest> screensFor(Iterable<String> litCaps) {
  final lit = litCaps.toSet();
  return kScreenManifests.where((m) => m.availableIn(lit)).toList();
}
