// אטום-הצבה · דיבור⇒טקסט — גרסת-סטאב (לא-web): אין זיהוי-דיבור ⇒ null. הקורא מציג הודעה כנה.
Future<String?> voiceListen(String lang) async => null;
bool get voiceSupported => false;

// האח: טקסט⇒דיבור — אין speechSynthesis מחוץ ל-web ⇒ false. הקורא מציג הודעה כנה, לא שותק.
Future<bool> voiceSpeak(String text, String lang, double rate) async => false;
bool get speakSupported => false;
