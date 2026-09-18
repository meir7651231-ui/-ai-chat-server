// אטום-הצבה · טקסט⇒דיבור דרך speechSynthesis של הדפדפן (חוק-6: גבול-פלטפורמה מבוקר, אפס-שרת
// שלנו; ההקראה עצמה אצל ספק-הדפדפן). לא נתמך ⇒ false. אחיו ההפוך של ds_voice_web.dart.
//
// 🪨 **חצוב מהמסכים, לא נכתב מהראש.** שני מקורות מוצהרים בריפו, וכל שורה כאן נושאת את שלה:
//   knowledge/assets/screens/hamecholel.html:226-233         (‏say(t,cb))
//   knowledge/assets/screens/siha-im-hamecholel.html:211-223  (‏say(txt,done))
//
// ⚑ **מתג-בעלים אחד, לא הוכרע כאן:** שני המקורות חלוקים על הקצב — 1.03 מול 1.02
//   (‏hamecholel.html:230 · siha-im-hamecholel.html:218). אין מקור שלישי שמכריע, ולכן
//   `rate` הוא פרמטר-חובה של האטום: הקורא מצהיר, האטום אינו ממציא (§20-ג · הכרעה-24).
//
// מה שלא נחצב, ובכוונה: `document.body.dataset.mode='talk'` ו-`$('#stat').textContent`
// (‏hamecholel.html:231 · siha-im-hamecholel.html:219-221) הם מצב-המסך של אותו מסך, לא
// של ההקראה — אטום שנוגע ב-DOM של מסך מסוים מפר את חוק-5 (טוהר).
import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'package:web/web.dart' as web;

@JS('speechSynthesis')
external JSObject? get _synth;

bool get speakSupported => _synth != null;

/// בורר-הקול העברי. חצוב מ-siha-im-hamecholel.html:212-213 — הקריאה הרחבה משני
/// המקורות: `vs.find(v=>/^he/i.test(v.lang)) || vs.find(v=>/Hebrew/i.test(v.name))`.
/// (‏hamecholel.html:228 נושא רק את התנאי הראשון; הרחב מכיל את הצר.)
JSObject? _hebrewVoice(JSObject synth) {
  try {
    final list = synth.callMethod<JSObject>('getVoices'.toJS);
    final n = list.getProperty<JSNumber>('length'.toJS).toDartInt;
    JSObject? byName;
    for (var i = 0; i < n; i++) {
      final v = list.getProperty<JSObject>(i.toString().toJS);
      final lang = v.getProperty<JSString?>('lang'.toJS)?.toDart ?? '';
      if (RegExp(r'^he', caseSensitive: false).hasMatch(lang)) return v;
      final name = v.getProperty<JSString?>('name'.toJS)?.toDart ?? '';
      if (byName == null && RegExp('Hebrew', caseSensitive: false).hasMatch(name)) byName = v;
    }
    return byName;
  } catch (_) { return null; }
}

/// מקריא `text`. מחזיר true כשההקראה הסתיימה, false כשאין מנוע/נכשלה.
/// ‏`rate` — ראה מתג-הבעלים בראש הקובץ: אין ברירת-מחדל, הקורא מצהיר.
Future<bool> speakText(String text, String lang, {required double rate}) async {
  final synth = _synth;
  // hamecholel.html:228 · siha-im-hamecholel.html:216 — לא-נתמך ⇒ חוזר מיד, לא זורק
  if (synth == null || text.trim().isEmpty) return false;
  final ctor = web.window.getProperty<JSFunction?>('SpeechSynthesisUtterance'.toJS);
  if (ctor == null) return false;
  final u = ctor.callAsConstructorVarArgs<JSObject>([text.toJS]);   // :229 / :217
  final v = _hebrewVoice(synth);
  if (v != null) u.setProperty('voice'.toJS, v);                    // :230 / :218 — `if(VOICE)u.voice=VOICE`
  u.setProperty('lang'.toJS, lang.toJS);                            // :230 / :218 — `u.lang='he-IL'` (הקורא מצהיר)
  u.setProperty('rate'.toJS, rate.toJS);                            // :230 / :218 — ⚑ 1.03 מול 1.02
  final done = Completer<bool>();
  void finish(bool ok) { if (!done.isCompleted) done.complete(ok); }
  // :232 / :219-222 — `u.onend=u.onerror=…` : שני המקורות מסיימים באותה נקודה
  u.setProperty('onend'.toJS, ((JSObject e) { finish(true); }).toJS);
  u.setProperty('onerror'.toJS, ((JSObject e) { finish(false); }).toJS);
  try {
    synth.callMethod('cancel'.toJS);   // :233 / :223 — `speechSynthesis.cancel()` לפני `speak`
    synth.callMethod('speak'.toJS, u);
  } catch (_) { return false; }        // :233 / :223 — `catch(e){u.onend();}`
  return done.future;
}
