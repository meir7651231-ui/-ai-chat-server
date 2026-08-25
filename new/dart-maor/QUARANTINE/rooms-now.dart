// ⚛️ אטום-Dart (דרגת-חוזה) · roomsNow — מצב-החדרים ברגע נתון (חדר-פעיל תפוס/פנוי + החוג התופס).
// מוצא: maor/src/components/courses/lib.ts:120-147 · המקור: new/atoms/rooms-now.mjs · חוזה: rooms-now.contract.md
// טוהר: פונקציית top-level, אפס import של אטום אחר (חוק-1) — השכן sessionsOf מוזרק כשקע-פרמטר.
// חוק-4 — התנהגות זהה-ביט למקור-ה-JS, כולל קצוות.
//
// הערות-המרה (מקור→Dart):
// • ‏JS ‏getDay() ‏(0=ראשון) ⇒ ‏Dart ‏weekday % 7 ‏(weekday: ‏1=שני..7=ראשון ⇒ ‏7%7=0 ראשון). זהה-ביט.
// • ‏truthiness (כלל-7): ‏`r.active` / ‏`!s.time` / ‏`room.slot || 60` / ‏`h || 0` / ‏`if (busyWith)`
//   של JS ⇒ עוזר מקומי ‏_falsy ‏(null/false/0/''/NaN) — לא תנאי-Dart גולמי.
// • ‏Number(x) של JS (כלל-10): מחרוזת-ריקה/רווחים ⇒ 0; לא-מספר ⇒ NaN (בלי זריקה) ⇒ ‏_jsNumber
//   עם ‏num.tryParse ?? NaN; ואז ‏`h || 0` ממפה גם NaN ל-0 (דרך ‏_falsy).
// • פירוק ‏`const [h, m]` על מערך קצר: איבר-חסר = ‏undefined ⇒ ‏(undefined||0)=0 — משוקף ב-‏_part.
// • ‏`!==` של JS על ‏day/roomId ⇒ ‏`!=` של Dart (פרימיטיבים; ‏null≠מספר בדיוק כמו ‏undefined!==מספר).
// • הפלט: ‏{room, busyWith} — המפתח ‏busyWith קיים תמיד (undefined של JS ⇒ null), זהות-רפרנס
//   נשמרת (החדר/החוג מוחזרים כמו-שהם — ‏=== של JS ⇒ ‏identical ב-Dart).
// • אין לוח-עברי/Intl (חוק-11 לא נדרש) — רק שעון-מקומי מוזרק (now פרמטר, טוהר).

/// ‏truthiness של JS: ‏null (גם undefined), ‏false, ‏0, ‏'' ו-NaN הם falsy.
bool _falsy(dynamic v) =>
    v == null ||
    v == false ||
    (v is num && (v == 0 || v.isNaN)) ||
    v == '';

/// ‏Number(x) של JS על מקטע-מחרוזת: ריק/רווחים ⇒ 0, לא-מספרי ⇒ NaN (בלי זריקה).
num _jsNumber(dynamic s) {
  if (s is num) return s;
  if (s == null) return double.nan; // Number(undefined) = NaN
  final t = s.toString().trim();
  if (t.isEmpty) return 0; // Number('') = 0
  return num.tryParse(t) ?? double.nan;
}

/// מצב-החדרים ברגע נתון: לכל חדר **פעיל** ⇒ ‏{room, busyWith} — ‏busyWith = החוג
/// הראשון שמפגש שלו בחדר חל באותו יום-שבוע והשעה בתוך ‏[start, start+slot)
/// (‏slot = ‏room.slot או 60). ‏sessionsOf — שקע: המפגשים-בפועל של חוג (חוק-1).
List<dynamic> roomsNow(dynamic db, DateTime now, dynamic sessionsOf) {
  final day = now.weekday % 7; // JS getDay(): 0=ראשון..6=שבת
  final mins = now.hour * 60 + now.minute;

  // ‏toMin של המקור: split(':').map(Number) ⇒ ‏(h||0)*60+(m||0).
  num toMin(dynamic t) {
    final parts = t.toString().split(':');
    num part(int i) {
      // איבר-חסר בפירוק-JS = undefined ⇒ Number(undefined)=NaN ⇒ (NaN||0)=0
      final v = i < parts.length ? _jsNumber(parts[i]) : double.nan;
      return _falsy(v) ? 0 : v; // ‏(x || 0) של JS
    }

    return part(0) * 60 + part(1);
  }

  final out = <dynamic>[];
  for (final room in (db['rooms'] as List)) {
    if (_falsy(room['active'])) continue; // filter((r) => r.active)
    dynamic busyWith;
    for (final c in (db['courses'] as List)) {
      if (c['roomId'] != room['id']) continue; // ‏!== של JS
      for (final s in (sessionsOf(c) as List)) {
        if (s['day'] != day || _falsy(s['time'])) continue;
        final num start = toMin(s['time']);
        final num slot =
            _falsy(room['slot']) ? 60 : room['slot']; // ‏room.slot || 60
        if (mins >= start && mins < start + slot) {
          busyWith = c;
          break;
        }
      }
      if (!_falsy(busyWith)) break; // ‏if (busyWith) של JS
    }
    // המפתח קיים תמיד (כמו האובייקט ב-JS); ‏undefined ⇒ null.
    out.add({'room': room, 'busyWith': busyWith});
  }
  return out;
}
