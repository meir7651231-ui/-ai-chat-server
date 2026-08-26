// ⚛️ אטום-Dart (דרגת-חוזה) · buildCommands — בונה פקודות ⌘K לפי דגלי-ההקשר + כרטיס-לכל-תורם.
// מוצא: maor-system/src/components/supporters/commands.ts:50 · המקור: new/atoms/commands-build-commands.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import-אטום (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        טהור, אפס-שקעים; העוזר `norm` מוטבע inline.
//
// הערות-המרה (JS→Dart):
//  • `norm = s.toLowerCase().replace(/\s+/g,' ').trim()` ⇒ `.toLowerCase().replaceAll(RegExp(r'\s+'),' ').trim()`
//    (הנתונים כאן ללא תווי-קצה-יוניקוד/İ/Σ ⇒ toLowerCase/trim הרגילים זהים-JS).
//  • `push(c) = out.push({...c, keywords: norm(c.label+' '+c.keywords)})` — spread+override:
//    ⇒ `Map<String,dynamic>.from(c)..['keywords'] = norm(...)` — 'keywords' כבר קיים במפתח ⇒
//    העדכון משמר את מיקומו (סדר-מפתחות זהה ל-JS).
//  • ctx = Map; `ctx.cockpitOn` ⇒ `ctx['cockpitOn'] == true` · `ctx.dedupCount > 0` ⇒ num-compare.
//  • `sp.name || 'ללא שם'` (falsy) ⇒ `(name==null||name=='') ? 'ללא שם' : name`.
//  • `(sp.name||'') + ' ' + (sp.phone||'')` ⇒ falsy-fallback ל-'' לכל אחד.

/// Builds the ⌘K command list from context flags + one card per supporter.
/// Pure (no sockets); `norm` is inlined. Verbatim port of
/// new/atoms/commands-build-commands.mjs (`buildCommands`).
List<Map<String, dynamic>> buildCommands(Map<String, dynamic> ctx) {
  String norm(String s) =>
      s.toLowerCase().replaceAll(RegExp(r'\s+'), ' ').trim();
  final out = <Map<String, dynamic>>[];
  void push(Map<String, dynamic> c) {
    out.add(Map<String, dynamic>.from(c)
      ..['keywords'] = norm('${c['label']} ${c['keywords']}'));
  }

  push({
    'id': 'cmd:add',
    'kind': 'add',
    'label': '➕ הוספת ${ctx['supporterTerm']}',
    'group': 'פעולה',
    'keywords': 'הוספה חדש חדשה תורם add new',
  });
  if (ctx['cockpitOn'] == true) {
    push({
      'id': 'cmd:work',
      'kind': 'work',
      'label': '🎯 חלון העבודה',
      'group': 'ניווט',
      'keywords': 'קוקפיט משימות עבודה היום cockpit',
    });
    push({
      'id': 'cmd:data',
      'kind': 'data',
      'label': '☰ מסך הנתונים',
      'group': 'ניווט',
      'keywords': 'טבלה נתונים רשימה סינון data',
    });
  }
  if (ctx['importOn'] == true) {
    push({
      'id': 'cmd:import',
      'kind': 'import',
      'label': '⬆ ייבוא מקובץ CSV',
      'group': 'פעולה',
      'keywords': 'ייבוא csv excel קובץ import',
    });
  }
  if (ctx['customReportOn'] == true) {
    push({
      'id': 'cmd:customreport',
      'kind': 'customreport',
      'label': '📊 דו״ח מותאם',
      'group': 'פעולה',
      'keywords': 'דוח מותאם ייצוא טווח report export',
    });
  }
  if ((ctx['dedupCount'] as num) > 0) {
    push({
      'id': 'cmd:dedup',
      'kind': 'dedup',
      'label': '🔗 איחוד כפולים · ${ctx['dedupCount']}',
      'group': 'פעולה',
      'keywords': 'כפולים מיזוג איחוד dedup merge',
    });
  }
  if (ctx['paymentsOn'] == true) {
    push({
      'id': 'cmd:incoming',
      'kind': 'incoming',
      'label': '💰 תשלומים נכנסים',
      'group': 'פעולה',
      'keywords': 'תשלומים נכנסים סליקה payments',
    });
    push({
      'id': 'cmd:nedarim',
      'kind': 'nedarim',
      'label': '🔄 סנכרון מנדרים',
      'group': 'פעולה',
      'keywords': 'נדרים סנכרון nedarim sync',
    });
  }
  for (final sp in (ctx['supporters'] as List)) {
    final name = sp['name'];
    final phone = sp['phone'];
    push({
      'id': 'donor:${sp['id']}',
      'kind': 'openDonor',
      'arg': sp['id'],
      'label': (name == null || name == '') ? 'ללא שם' : name,
      'hint': 'פתיחת כרטיס',
      'group': 'תורם',
      'keywords':
          '${(name == null || name == '') ? '' : name} ${(phone == null || phone == '') ? '' : phone}',
    });
  }
  return out;
}
