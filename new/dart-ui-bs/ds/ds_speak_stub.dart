// אטום-הצבה · טקסט⇒דיבור — גרסת-סטאב (לא-web): אין מנוע-הקראה ⇒ false. הקורא מציג הודעה כנה.
// חצוב מ-knowledge/assets/screens/hamecholel.html:228 ו-siha-im-hamecholel.html:216:
// `if(!('speechSynthesis' in window)){cb&&cb();return;}` — לא-נתמך חוזר מיד, לא זורק.
Future<bool> speakText(String text, String lang, {required double rate}) async => false;
bool get speakSupported => false;
