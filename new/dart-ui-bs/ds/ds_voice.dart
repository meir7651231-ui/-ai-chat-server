// שקע-דיבור (שני כיוונים): web ⇒ SpeechRecognition + speechSynthesis של הדפדפן · אחרת ⇒ סטאב.
// הקורא: null/false ⇒ הודעה כנה, לא המצאה. voiceSpeak חצוב מהמוקאפים — ראה ds_voice_web.dart.
export 'ds_voice_stub.dart' if (dart.library.js_interop) 'ds_voice_web.dart';
