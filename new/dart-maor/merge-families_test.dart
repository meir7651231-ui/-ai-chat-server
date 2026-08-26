import '../dart-data-maor/merge-families-terms.dart';
import 'merge-families.dart';
import 'dart:convert';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/merge-families.test.mjs.
/// אם עובר — Dart ≡ JS (חוק-4). שקעי-deps מזויפים זהים לבדיקת-ה-JS.

// normPhone — replace(/\D/g,'') : משאיר ספרות בלבד.
String normPhone(String s) => s.replaceAll(RegExp(r'\D'), '');

// dedupById — דה-דופ לפי id, שומר-סדר (זהה ל-Set+push של ה-JS).
List<dynamic> dedupById(List<dynamic> items) {
  final seen = <dynamic>{};
  final out = <dynamic>[];
  for (final it in items) {
    final id = (it as Map)['id'];
    if (!seen.contains(id)) {
      seen.add(id);
      out.add(it);
    }
  }
  return out;
}

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

void eq(dynamic a, dynamic b, String msg) =>
    ok(jsonEncode(a) == jsonEncode(b), '$msg ⇒ ${jsonEncode(a)}');

void main() {
  // 1) השלמת-ריקים + phone2 + איחוד-חברים + הערות + createdAt מוקדם
  final keeper = <String, dynamic>{
    'id': 'f1', 'name': 'כהן', 'father': '', 'phone': '050-1111111',
    'status': 'inactive', 'members': [{'id': 'm1'}], 'docs': [],
    'createdAt': '2026-02-01', 'notes': '',
  };
  final loser = <String, dynamic>{
    'id': 'f2', 'name': 'כהן', 'father': 'יוסף', 'phone': '0502222222',
    'status': 'active', 'members': [{'id': 'm1'}, {'id': 'm2'}], 'docs': [],
    'createdAt': '2026-01-15', 'notes': 'ותיקה',
  };
  {
    final out = mergeFamilies(keeper, [loser], normPhone, dedupById, term: (k)=>kTerms[k]!);
    ok(out['father'] == 'יוסף', "father לא הושלם ⇒ ${out['father']}");
    ok(out['phone'] == '050-1111111', "phone השומר לא נשמר ⇒ ${out['phone']}");
    ok(out['phone2'] == '0502222222', "phone2 לא מולא מטלפון-שונה ⇒ ${out['phone2']}");
    ok(out['status'] == 'active', "status לא עלה ל-active ⇒ ${out['status']}");
    eq(out['members'], [{'id': 'm1'}, {'id': 'm2'}], 'איחוד-חברים בדה-דופ שגוי');
    ok(out['createdAt'] == '2026-01-15', "createdAt לא המוקדם ⇒ ${out['createdAt']}");
    ok(out['notes'] == 'ותיקה | מוזג: כהן', "notes שגוי ⇒ ${out['notes']}");
    ok(out['id'] == 'f1', "id השומר לא נשמר ⇒ ${out['id']}");
  }

  // 2) דירוג-סטטוס: pending + [inactive, active] ⇒ active
  {
    final out = mergeFamilies(
      {'id': 'a', 'status': 'pending'},
      [{'id': 'b', 'status': 'inactive'}, {'id': 'c', 'status': 'active'}],
      normPhone, dedupById,
     term: (k)=>kTerms[k]!);
    ok(out['status'] == 'active', "דירוג-סטטוס שגוי ⇒ ${out['status']}");
  }

  // 3) מונים = מקסימום; fullSefach = OR
  {
    final out = mergeFamilies(
      {'id': 'a', 'kidsHome': 2, 'fullSefach': false},
      [{'id': 'b', 'kidsHome': 5, 'fullSefach': true}],
      normPhone, dedupById,
     term: (k)=>kTerms[k]!);
    ok(out['kidsHome'] == 5, "kidsHome לא מקסימום ⇒ ${out['kidsHome']}");
    ok(out['fullSefach'] == true, 'fullSefach לא OR');
  }

  // 4) טלפון זהה-מנורמל אינו הופך phone2
  {
    final out = mergeFamilies(
      {'id': 'a', 'phone': '0501111111'},
      [{'id': 'b', 'phone': '050-111-1111'}],
      normPhone, dedupById,
     term: (k)=>kTerms[k]!);
    ok(out['phone2'] == '', "phone2 מולא מטלפון זהה-מנורמל ⇒ ${out['phone2']}");
  }

  // 5) הערות זהות לא מוכפלות
  {
    final out = mergeFamilies(
      {'id': 'a', 'notes': 'חשוב'},
      [{'id': 'b', 'name': 'לוי', 'notes': 'חשוב'}],
      normPhone, dedupById,
     term: (k)=>kTerms[k]!);
    ok(out['notes'] == 'חשוב | מוזג: לוי', "הערות הוכפלו ⇒ ${out['notes']}");
  }

  // 6) immutability — הקלט לא שוכתב
  ok((keeper['father'] == '') && (keeper['members'] as List).length == 1,
      'keeper הנכנס שוכתב');

  if (_f != 0) throw StateError('merge-families: סטייה מהמקור');
  print('✓ merge-families: 6 דוגמאות-חוזה — ירוק');
}
