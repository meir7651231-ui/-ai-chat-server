/// חוט · suggestions — מנוע מקדים-הצורך (SHOP8): חג מתקרב · גיל בית-ספר ·
/// תינוק · כרטיסייה נגמרת. המרה נאמנה מ-new/atoms/suggestions.mjs
/// (חוק-4: המקור קדוש). השכנים termOf/moduleOn/upcomingHoliday/ageAt מוזרקים
/// כשקעים במפת-sockets — כמו הדה-סטרקטור בחתימת ה-JS (חוק-1: אפס import פנימי).
/// ‏db/config = מבנים דינמיים (Map/List); ‏undefined מיוצג בהיעדר-מפתח (חוק-2).

/// truthiness של JS (חוק-7): null/false/0/NaN/'' ⇒ falsy; כל אובייקט ⇒ truthy.
bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

/// ‏String(num) של JS — shortest-round-trip (חוק-12): שלם-בטוח ⇒ עשרוני;
/// ‏2^53–1e21 ⇒ פריסה-מרופדת-אפסים; ‏≥1e21 ⇒ מעריכי; ‏-0 ⇒ '0'.
String _jsNum(num v) {
  if (v is int) return v.toString();
  final d = v as double;
  if (d.isNaN) return 'NaN';
  if (d.isInfinite) return d > 0 ? 'Infinity' : '-Infinity';
  if (d == 0) return '0'; // גם ‎-0.0‎ — JS String(-0) === '0'
  if (d == d.truncateToDouble() && d.abs() < 9007199254740992.0) {
    return d.truncate().toString();
  }
  if (d == d.truncateToDouble() && d.abs() < 1e21) {
    // Dart מדפיס מדעי בטווח הזה; JS פורס עשרוני מרופד-אפסים.
    final s = d.toString();
    final m = RegExp(r'^(-?)(\d)(?:\.(\d+))?e\+(\d+)$').firstMatch(s);
    if (m != null) {
      final sign = m.group(1)!;
      final digits = m.group(2)! + (m.group(3) ?? '');
      final exp = int.parse(m.group(4)!);
      if (exp >= digits.length - 1) {
        return sign + digits + '0' * (exp - digits.length + 1);
      }
    }
    return s;
  }
  return d.toString(); // ‏≥1e21: Dart וגם JS ⇒ '1e+21'
}

/// ToString של תבנית-מחרוזת JS (`${v}`).
String _jsStr(dynamic v) {
  if (v == null) return 'null';
  if (v is String) return v;
  if (v is num) return _jsNum(v);
  if (v is bool) return v ? 'true' : 'false';
  return v.toString();
}

/// גישת-מאפיין לתבנית: מפתח-חסר = undefined ⇒ 'undefined' (חוק-2 — containsKey!).
String _strAt(dynamic obj, String key) {
  if (obj is Map && obj.containsKey(key)) return _jsStr(obj[key]);
  return 'undefined';
}

/// ‏ToNumber של JS על ערך-מאפיין (חוק-15): null ⇒ 0 · bool ⇒ 0/1 ·
/// מחרוזת-גזומה-ריקה ⇒ 0 · לא-מספר ⇒ NaN (num.tryParse, לא parse-זורק — חוק-10).
num _jsToNum(dynamic v) {
  if (v == null) return 0;
  if (v is num) return v;
  if (v is bool) return v ? 1 : 0;
  if (v is String) {
    final t = _jsTrim(v);
    if (t.isEmpty) return 0;
    if (t == 'Infinity' || t == '+Infinity') return double.infinity;
    if (t == '-Infinity') return double.negativeInfinity;
    return num.tryParse(t) ?? double.nan;
  }
  return double.nan;
}

/// ‏trim בקבוצת-הרווחים של ECMAScript בלבד (חוק-16) — בלי U+0085/U+180E.
const _esWs = '\t\n\x0B\f\r \u00A0\uFEFF\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029';
String _jsTrim(String s) {
  var start = 0, end = s.length;
  while (start < end && _esWs.contains(s[start])) start++;
  while (end > start && _esWs.contains(s[end - 1])) end--;
  return s.substring(start, end);
}

/// ‏obj.key מספרי לחיסור: מפתח-חסר = undefined ⇒ NaN (חוק-2), אחרת ToNumber.
num _numAt(dynamic obj, String key) {
  if (obj is Map) return obj.containsKey(key) ? _jsToNum(obj[key]) : double.nan;
  return double.nan;
}

/// ‏Array.prototype.find: האיבר הראשון שמקיים, אחרת null (undefined של JS).
dynamic _find(dynamic list, bool Function(dynamic) pred) {
  if (list is List) {
    for (final x in list) {
      if (pred(x)) return x;
    }
  }
  return null;
}

/// המנוע: 4 כללים ⇒ רשימת-הצעות {key,emoji,title,detail,famId?,courseId?,act}.
/// ‏sockets = {termOf, moduleOn, upcomingHoliday, ageAt} — שקעי-השכנים המוזרקים.
List<dynamic> suggestions(
  dynamic db,
  dynamic todayIso,
  dynamic config,
  Map<String, dynamic> sockets,
) {
  final dynamic termOf = sockets['termOf'];
  final dynamic moduleOn = sockets['moduleOn'];
  final dynamic upcomingHoliday = sockets['upcomingHoliday'];
  final dynamic ageAt = sockets['ageAt'];

  // JS: const T = (k, fb) => (config ? termOf(config, k, fb) : fb)
  dynamic t(dynamic k, dynamic fb) => _truthy(config) ? termOf(config, k, fb) : fb;
  // גידור-מודולים: בלי config (בדיקות ישנות) הכול פעיל, כמו חוזה-הדגלים.
  bool modOn(dynamic m) => !_truthy(config) || _truthy(moduleOn(config, m));

  final out = <dynamic>[];
  final activeFams = <dynamic>[];
  for (final f in (db['families'] as List)) {
    if ((f as Map)['status'] == 'active') activeFams.add(f);
  }

  // A — חג מתקרב (מודול חנות בלבד — היעד הוא מתנת-חג בחנות)
  final hol = upcomingHoliday(todayIso, 30);
  if (modOn('shop') && _truthy(hol) && activeFams.length > 0) {
    // מפתח 'sug:' פטור מגיזום-30-הימים — השנה העברית במפתח ⇒ החג הבא עולה מחדש.
    out.add(<String, dynamic>{
      'key': 'sug:holiday:${_strAt(hol, 'name')}:${_strAt(hol, 'hebYear')}',
      'emoji': '🎁',
      'title': 'מתנת-חג · ${_strAt(hol, 'name')} בעוד ${_strAt(hol, 'inDays')} ימים',
      'detail':
          '${_jsNum(activeFams.length)} ${_jsStr(t('nav.families', 'משפחות'))} פעילות — שקלו חלוקת מתנות לקראת החג',
      'act': 'shop',
    });
  }

  // B/C — לפי גיל הילדים
  for (final f in activeFams) {
    for (final m in ((f as Map)['members'] as List)) {
      if (_truthy((m as Map)['isParent'])) continue;
      final age = ageAt(m['birth'], todayIso);
      if (age == 6 || age == 5) {
        // הגיל במפתח — ביטול בגיל 5 לא מסתיר את ההצעה המחודשת בגיל 6.
        out.add(<String, dynamic>{
          'key': 'sug:school:${_strAt(m, 'id')}:${_jsStr(age)}',
          'emoji': '🎒',
          'title': 'ערכת בית-ספר · ${_strAt(m, 'first')} (${_strAt(f, 'name')})',
          'detail': 'בן/בת ${_jsStr(age)} — לקראת/בתחילת כיתה א׳',
          'famId': f['id'],
          'act': 'families',
        });
      } else if (age == 0) {
        out.add(<String, dynamic>{
          'key': 'sug:baby:${_strAt(m, 'id')}',
          'emoji': '👶',
          'title':
              'ערכת תינוק · ${_jsStr(t('entity.familyOf', 'משפחת'))} ${_strAt(f, 'name')}',
          'detail':
              '${_strAt(m, 'first')} — תינוק/ת חדש/ה ב${_jsStr(t('entity.family', 'משפחה'))}',
          'famId': f['id'],
          'act': 'families',
        });
      }
    }
  }

  // D — כרטיסייה נגמרת (מודול חוגים בלבד — הנתון והיעד שניהם בחוגים)
  for (final e
      in (modOn('courses') ? (db['enrollments'] as List) : const <dynamic>[])) {
    if ((e as Map)['plan'] != 'punch' || e['status'] != 'active') continue;
    final rem = _numAt(e, 'purchased') - _numAt(e, 'used');
    // NaN: שתי ההשוואות false — כמו ב-JS ההצעה נוצרת עם 'נותרו NaN ניקובים'.
    if (rem > 2 || rem < 0) continue;
    final course = _find(db['courses'], (c) => (c as Map)['id'] == e['courseId']);
    final fam = _find(
      db['families'],
      (f) => ((f as Map)['members'] as List)
          .any((m) => (m as Map)['id'] == e['memberId']),
    );
    final member = fam == null
        ? null
        : _find(fam['members'], (m) => (m as Map)['id'] == e['memberId']);
    // purchased = סמן-דור-מילוי דטרמיניסטי במפתח — חידוש מציף מחדש.
    out.add(<String, dynamic>{
      'key': 'sug:renew:${_strAt(e, 'id')}:${_strAt(e, 'purchased')}',
      'emoji': '🎫',
      'title':
          'חידוש כרטיסייה · ${_jsStr((member is Map ? member['first'] : null) ?? '—')} · ${_jsStr((course is Map ? course['name'] : null) ?? '—')}',
      'detail': rem <= 0 ? 'הכרטיסייה נגמרה' : 'נותרו ${_jsStr(rem)} ניקובים',
      'famId': fam == null ? null : fam['id'],
      'courseId': e['courseId'],
      'act': 'courses',
    });
  }
  return out;
}
