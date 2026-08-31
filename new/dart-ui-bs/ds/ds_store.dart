// 🗄️ חנות-מצב חיה (חוט-טהור) — מודל-נתונים אמיתי לאפליקציה. כל רשומה נושאת מזהה
// יציב (__id), נגישה לפי-מזהה (לא לפי-אינדקס), ומפתח-זר מצביע במזהה — לא במחרוזת-תצוגה.
// שמירה · עדכון · מחיקה · קידום-מסע · צבירה — הכל מגיב לאותו מקור-אמת (ChangeNotifier).
import 'dart:convert';
import 'package:flutter/foundation.dart';
// גבול-הפלטפורמה מבודד ב-conditional-import: web ⇒ localStorage · אחר ⇒ no-op (טהור).
import 'ds_persist_stub.dart' if (dart.library.js_interop) 'ds_persist_web.dart';

class AppStore extends ChangeNotifier {
  // ממופתח ב-slug יציב (app_entN) — לא בשם-תצוגה חתוך (שמנע דליפת-נתונים בין ישויות).
  final Map<String, List<Map<String, String>>> _rec = {};
  int _seq = 0;
  int _role = 0;   // התפקיד-הנבחר (נשמר בין רענונים — session רך; אימות-אמת = תשתית)

  int get role => _role;
  void setRole(int i) { _role = i; notifyListeners(); }

  static const idKey = '__id';       // מזהה-רשומה יציב
  static const stageKey = '__stage'; // אינדקס שלב-המסע הנוכחי
  static const _pkey = 'ds_app_v1';  // מפתח-ההתמדה

  AppStore() { _load(); }

  // התמדה: טעינה בלידה, שמירה בכל שינוי (מרוכב על notifyListeners). נכשל-רך.
  void _load() {
    final raw = persistLoad(_pkey);
    if (raw == null || raw.isEmpty) return;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      _seq = (data['seq'] as num?)?.toInt() ?? 0;
      _role = (data['role'] as num?)?.toInt() ?? 0;
      (data['rec'] as Map<String, dynamic>).forEach((k, v) {
        _rec[k] = (v as List)
            .map((e) => (e as Map).map((kk, vv) => MapEntry(kk.toString(), vv.toString())))
            .toList();
      });
    } catch (_) {}
  }

  @override
  void notifyListeners() {
    try {
      persistSave(_pkey, jsonEncode({'seq': _seq, 'role': _role, 'rec': _rec}));
    } catch (_) {}
    super.notifyListeners();
  }

  List<Map<String, String>> records(String entity) => _rec[entity] ?? const [];
  int count(String entity) => _rec[entity]?.length ?? 0;

  Map<String, String>? byId(String entity, String id) {
    for (final r in records(entity)) {
      if (r[idKey] == id) return r;
    }
    return null;
  }

  // "שם" רשומה = הערך-הראשון-הלא-ריק שאינו מטא (לתצוגת מפתח-זר ולבורר-קשר).
  String _display(Map<String, String> r) {
    for (final e in r.entries) {
      if (e.key == idKey || e.key == stageKey) continue;
      if (e.value.trim().isNotEmpty) return e.value.trim();
    }
    return r[idKey] ?? '';
  }

  // אפשרויות לבורר-קשר: זוגות (מזהה → תצוגה). הבורר שומר מזהה, מציג תצוגה.
  List<MapEntry<String, String>> options(String entity) {
    final out = <MapEntry<String, String>>[];
    for (final r in records(entity)) {
      final id = r[idKey] ?? '';
      if (id.isNotEmpty) out.add(MapEntry(id, _display(r)));
    }
    return out;
  }

  // תצוגת מפתח-זר: מזהה מאוחסן ⇒ שם-הרשומה ביעד (ריק אם היעד נמחק — מפתח יתום גלוי).
  String displayOf(String entity, String id) {
    if (id.isEmpty) return '';
    final r = byId(entity, id);
    return r == null ? '' : _display(r);
  }

  // אינדקס-הפוך (קשר-נגדי): רשומות של entity ששדה-הקשר שלהן מצביע על id.
  List<Map<String, String>> referencing(String entity, String field, String id) =>
      records(entity).where((r) => r[field] == id).toList();

  int stageOf(String entity, String id) {
    final r = byId(entity, id);
    return int.tryParse(r?[stageKey] ?? '0') ?? 0;
  }

  // צבירה טיפוסית (בסיס לדשבורדי-מדדים אמיתיים): סכום/ממוצע/מונה על שדה מספרי.
  double sum(String entity, String field) {
    var t = 0.0;
    for (final r in records(entity)) {
      t += double.tryParse((r[field] ?? '').replaceAll(RegExp(r'[^0-9.\-]'), '')) ?? 0;
    }
    return t;
  }

  double avg(String entity, String field) {
    final n = count(entity);
    return n == 0 ? 0 : sum(entity, field) / n;
  }

  String add(String entity, Map<String, String> record) {
    final id = 'r${++_seq}';
    final rec = <String, String>{idKey: id, ...record};
    (_rec[entity] ??= <Map<String, String>>[]).add(rec);
    notifyListeners();
    return id;
  }

  void update(String entity, String id, Map<String, String> values) {
    final r = byId(entity, id);
    if (r == null) return;
    values.forEach((k, v) {
      if (k != idKey) r[k] = v;
    });
    notifyListeners();
  }

  void advance(String entity, String id, int stageCount) {
    final r = byId(entity, id);
    if (r == null) return;
    final cur = int.tryParse(r[stageKey] ?? '0') ?? 0;
    if (cur + 1 < stageCount) {
      r[stageKey] = '${cur + 1}';
      notifyListeners();
    }
  }

  // קפיצה לכל שלב (מסע לא-ליניארי — כולל דחייה/חזרה/הסתעפות).
  void setStage(String entity, String id, int i) {
    final r = byId(entity, id);
    if (r == null || i < 0) return;
    r[stageKey] = '$i';
    notifyListeners();
  }

  void removeById(String entity, String id) {
    _rec[entity]?.removeWhere((r) => r[idKey] == id);
    notifyListeners();
  }
}

// מקור-אמת יחיד לאפליקציה כולה (חוצה-מסכים דרך ה-Navigator).
final AppStore appStore = AppStore();
