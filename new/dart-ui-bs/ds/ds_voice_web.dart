// אטום-הצבה · דיבור⇒טקסט דרך SpeechRecognition של הדפדפן (חוק-6: גבול-פלטפורמה מבוקר, אפס-שרת שלנו;
// הזיהוי עצמו אצל ספק-הדפדפן). לא נתמך ⇒ null. תוצאה = הטקסט הסופי של הביטוי הראשון.
//
// ‏voiceSpeak (טקסט⇒דיבור) הוא **אח** של voiceListen באותו שקע — לא אטום שנכתב מהראש.
// כל שורה בו חצובה משני מקורות-המוקאפ, ומופעה רשום ב-knowledge/connect/2026-09-18/CARVE-TTS.md:
//   knowledge/assets/screens/hamecholel.html:227-233        (say · rate 1.03)
//   knowledge/assets/screens/siha-im-hamecholel.html:212-224 (say · rate 1.02)
// ‏`rate` נמסר **כפרמטר** ולא צרוב: שני המקורות חולקים עליו (1.03 מול 1.02) — פליגא.
// קבוע ששני מקורות חולקים עליו אינו עובדה שבוחרים בה, הוא שקע (THE-WAY צעד 5).
import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'package:web/web.dart' as web;

@JS('webkitSpeechRecognition')
external JSFunction? get _webkitCtor;
@JS('SpeechRecognition')
external JSFunction? get _stdCtor;

bool get voiceSupported => _stdCtor != null || _webkitCtor != null;

Future<String?> voiceListen(String lang) async {
  final ctor = _stdCtor ?? _webkitCtor;
  if (ctor == null) return null;
  final rec = ctor.callAsConstructor<JSObject>();
  rec.setProperty('lang'.toJS, lang.toJS);
  rec.setProperty('interimResults'.toJS, false.toJS);
  rec.setProperty('maxAlternatives'.toJS, 1.toJS);
  final done = Completer<String?>();
  void finish(String? v) { if (!done.isCompleted) done.complete(v); }
  rec.setProperty('onresult'.toJS, ((JSObject e) {
    try {
      final results = e.getProperty<JSObject>('results'.toJS);
      final first = results.getProperty<JSObject>('0'.toJS);
      final alt = first.getProperty<JSObject>('0'.toJS);
      final t = alt.getProperty<JSString>('transcript'.toJS).toDart;
      finish(t.trim());
    } catch (_) { finish(null); }
  }).toJS);
  rec.setProperty('onerror'.toJS, ((JSObject e) { finish(null); }).toJS);
  rec.setProperty('onend'.toJS, ((JSObject e) { finish(null); }).toJS);
  try { rec.callMethod('start'.toJS); } catch (_) { return null; }
  // web.window נשמר ליבוא-עקבי עם שאר אטומי-ההצבה (localStorage) — כאן לא נדרש
  web.window;
  return done.future.timeout(const Duration(seconds: 15), onTimeout: () { try { rec.callMethod('stop'.toJS); } catch (_) {} return null; });
}

// ── האח: טקסט⇒דיבור ─────────────────────────────────────────────────────────
@JS('speechSynthesis')
external JSObject? get _synth;
@JS('SpeechSynthesisUtterance')
external JSFunction? get _uttCtor;

/// hamecholel.html:228 `if('speechSynthesis' in window)` — חד שיעורא עם siha:214.
bool get speakSupported => _synth != null && _uttCtor != null;

/// hamecholel.html:227 `v.find(x=>/^he/i.test(x.lang))`
/// ⊎ siha-im-hamecholel.html:213 `||vs.find(v=>/Hebrew/i.test(v.name))`
/// המקור-השני הוא על-קבוצה של הראשון (נפילה נוספת, לא סתירה) ⇒ §20-ב «אין-יחיד ⇒ שלב».
JSObject? _pickVoice(String lang) {
  final synth = _synth;
  if (synth == null) return null;
  final List<JSObject> voices;
  try { voices = synth.callMethod<JSArray<JSObject>>('getVoices'.toJS).toDart; } catch (_) { return null; }
  final pre = lang.split('-').first.toLowerCase();
  for (final v in voices) {
    final l = (v.getProperty<JSString?>('lang'.toJS))?.toDart ?? '';
    if (l.toLowerCase().startsWith(pre)) return v;
  }
  for (final v in voices) {
    final n = (v.getProperty<JSString?>('name'.toJS))?.toDart ?? '';
    if (n.toLowerCase().contains('hebrew')) return v;
  }
  return null;
}

/// טקסט⇒דיבור. `rate` = שקע (פליגא 1.03/1.02 — ראה כותרת-הקובץ).
/// לא נתמך ⇒ false מיד, בלי לזרוק — hamecholel.html:229 `{cb&&cb();return;}`.
/// אין timeout: לשני המקורות אין, והדפדפן תמיד פולט onend/onerror. אורך-דיבור אינו חסום מראש.
Future<bool> voiceSpeak(String text, String lang, double rate) async {
  final synth = _synth, ctor = _uttCtor;
  if (synth == null || ctor == null) return false;
  final u = ctor.callAsConstructor<JSObject>(text.toJS);   // :230 `new SpeechSynthesisUtterance(t)`
  final v = _pickVoice(lang);
  if (v != null) u.setProperty('voice'.toJS, v);           // :230 `if(VOICE)u.voice=VOICE`
  u.setProperty('lang'.toJS, lang.toJS);                   // :230 `u.lang='he-IL'` ⇒ הפרמטר, כמו ב-voiceListen
  u.setProperty('rate'.toJS, rate.toJS);                   // :230 `u.rate=1.03` · siha:218 `1.02` ⇒ שקע
  // ‏siha:218 מוסיף `u.pitch=1.0`; hamecholel אינו קובע pitch. 1.0 הוא ברירת-המחדל של
  // התקן, כך ששתי הצורות מתנהגות זהה — חד שיעורא בפועל, ולכן אינו שקע.
  final done = Completer<bool>();
  void finish(bool ok) { if (!done.isCompleted) done.complete(ok); }
  // :232 `u.onend=u.onerror=()=>{…cb&&cb();}` — שני המקורות קוראים לאותו callback.
  // ה-callback שם חסר-ערך; בחוזה-Dart ההבחנה נשמרת: onerror ⇒ false (לא דובר), כעיקרון
  // «null ⇒ הודעה כנה, לא המצאה» של השקע הזה (ds_voice.dart).
  u.setProperty('onend'.toJS, ((JSObject e) { finish(true); }).toJS);
  u.setProperty('onerror'.toJS, ((JSObject e) { finish(false); }).toJS);
  // :233 `try{speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){u.onend();}`
  try {
    synth.callMethod<JSAny?>('cancel'.toJS);
    synth.callMethod<JSAny?>('speak'.toJS, u);
  } catch (_) { finish(false); }
  return done.future;
}
