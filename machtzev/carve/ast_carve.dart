// 🔨 חצב-AST · מוציא פונקציה-בודדת ממקור לאטום-טהור (analyzer אמיתי).
// ליבה-דטרמיניסטית: איתור-הפונקציה → פתירת-מזהים-חופשיים → סיווג
// (שכן-top-level=שקע · טיפוס-מקומי=הטבעה-verbatim · dart:core=נשאר) →
// פליטת אטום (פרטי→ציבורי, טיפוסים מוטבעים, header-מוצא). מדפיס JSON.
// שימוש: dart run ast_carve.dart <file> <fnName> [startLine]
import 'dart:convert';
import 'dart:io';
import 'package:analyzer/dart/analysis/utilities.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';

// dart:core / builtins שמותר להשאיר (לא שקע, לא הטבעה)
const _core = {
  'String','int','double','num','bool','List','Map','Set','Iterable','Object','dynamic','void','Function','DateTime','Duration','RegExp','StringBuffer','Comparable','Pattern','Symbol','Type','Null','Never','Enum','MapEntry','StringSink','Runes','BigInt','Uri','Stopwatch','Exception','Error','StateError','ArgumentError','FormatException','Future','Stream',
  'true','false','null','this','super','print','identical','assert',
};

// dart:math — נראה כמו core אך דורש ייבוא. הפרדה זו מונעת פליטת-אטום בלי `import 'dart:math';`.
const _mathCore = {'min','max','sqrt','pow','pi','e','log','exp','sin','cos','tan','atan','atan2','Random'};

// אוסף כל שם שמוצהר-מקומית בגוף (משתני-לולאה, final/var, catch, פונקציות-מקומיות)
class _Locals extends RecursiveAstVisitor<void> {
  final Set<String> names = {};
  @override
  void visitVariableDeclaration(VariableDeclaration n){ names.add(n.name.lexeme); super.visitVariableDeclaration(n); }
  @override
  void visitDeclaredIdentifier(DeclaredIdentifier n){ final id=n.name?.lexeme; if(id!=null) names.add(id); super.visitDeclaredIdentifier(n); }
  @override
  void visitCatchClause(CatchClause n){ final e=n.exceptionParameter?.name.lexeme; if(e!=null) names.add(e); final s=n.stackTraceParameter?.name.lexeme; if(s!=null) names.add(s); super.visitCatchClause(n); }
  @override
  void visitFunctionDeclarationStatement(FunctionDeclarationStatement n){ names.add(n.functionDeclaration.name.lexeme); super.visitFunctionDeclarationStatement(n); }
  @override
  void visitFormalParameterList(FormalParameterList n){ for(final p in n.parameters){ final id=p.name?.lexeme; if(id!=null) names.add(id); } super.visitFormalParameterList(n); }
}

class _FreeIds extends RecursiveAstVisitor<void> {
  final Set<String> bound; // params + locals
  final Set<String> ids = {};
  final Set<String> typeNames = {};
  _FreeIds(this.bound);
  @override
  void visitSimpleIdentifier(SimpleIdentifier node) {
    final n = node.name;
    if (n.isEmpty) return;
    // התעלם מגישת-חבר (a.b — ה-b)
    final p = node.parent;
    if (p is PropertyAccess && identical(p.propertyName, node)) return;
    if (p is PrefixedIdentifier && identical(p.identifier, node)) return;
    // קריאת-שיטה על מטרה, וגם על מטרה-משתמעת בשרשור (`x..remove('B')` — ה-target הוא null)
    if (p is MethodInvocation && identical(p.methodName, node) && (p.target != null || p.isCascaded)) return;
    // תווית של ארגומנט-בשם (`orElse:` · `child:`): ההורה הוא Label, לא NamedExpression —
    // ולכן הבדיקה הישנה מעולם לא נורתה וכל תווית נספרה כמזהה-חופשי.
    if (p is Label) return;
    // הפניית-dartdoc (`/// [foo]`) היא **קישור-תיעוד**, לא קוד. בלי זה
    // `productSubtype` — שמופיע רק בהערה — נספר כתלות וחסם 93 פונקציות.
    if (p is CommentReference) return;
    if (p is NamedExpression && identical(p.name.label, node)) return;
    if (bound.contains(n) || _core.contains(n)) return;
    // טיפוס (מתחיל באות-גדולה) — מועמד-הטבעה; אחרת — מזהה-ערך
    if (RegExp(r'^[A-Z]').hasMatch(n)) typeNames.add(n); else ids.add(n);
  }
  @override
  void visitTypeParameter(TypeParameter node){ bound.add(node.name.lexeme); super.visitTypeParameter(node); }

  // analyzer 6: שם-הטיפוס ב-NamedType הוא Token (name2), ולכן אינו מגיע ל-visitSimpleIdentifier.
  // בלי זה הערות-טיפוס וקריאות-בנאי אינן נראות והאטום נפלט בלי הגדרת-הטיפוס.
  @override
  void visitNamedType(NamedType node) {
    final n = node.name2.lexeme;
    if (!bound.contains(n) && !_core.contains(n)) typeNames.add(n);
    super.visitNamedType(node);
  }
}

/// האם הטיפוס [t] מופיע ברשימת-הפרמטרים עם ארגומנטים-גנריים (`Foo<Bar> x`)?
/// כזה אינו נמחק ב-v1 — המחיקה חייבת להיות החלפת-שם פשוטה.
bool tn_hasArgs(FormalParameterList ps, String t) {
  for (final p in ps.parameters) {
    if (p is! SimpleFormalParameter) continue;
    final tn = p.type;
    if (tn is NamedType && tn.name2.lexeme == t && tn.typeArguments != null) return true;
  }
  return false;
}

String _helper(String n) => '_src_' + (n.startsWith('_') ? n.substring(1) : n);

/// טיפוס-הפונקציה של שכן (`double Function(double)`), או null אם חתימתו אינה פוזיציונית.
String? _fnType(FunctionDeclaration d) {
  final ps = d.functionExpression.parameters;
  if (ps == null) return null;
  for (final p in ps.parameters) { if (p.isNamed || p.isOptionalPositional) return null; }
  final ret = d.returnType?.toSource() ?? 'dynamic';
  final types = ps.parameters
      .map((p) => (p is SimpleFormalParameter) ? (p.type?.toSource() ?? 'dynamic') : 'dynamic')
      .join(', ');
  return '$ret Function($types)';
}

/// טיפוס של קבוע-שכן (לשקע-ערך): מההצהרה אם קיימת, אחרת נגזר מהליטרל.
/// null אם האתחול אינו ליטרל-טהור — אז אין מה להזריק ואין מה להטביע בבדיקה.
String? _varType(String src, VariableDeclaration v) {
  final init = v.initializer;
  if (init == null) return null;
  final fr = _FreeIds(<String>{});
  init.visitChildren(fr);
  for (final id in fr.ids) { if (!_core.contains(id)) return null; }
  for (final t in fr.typeNames) { if (!_core.contains(t)) return null; }
  final parent = v.parent;
  if (parent is VariableDeclarationList && parent.type != null) return parent.type!.toSource();
  if (init is IntegerLiteral) return 'int';
  if (init is DoubleLiteral) return 'double';
  if (init is BooleanLiteral) return 'bool';
  if (init is SimpleStringLiteral || init is StringInterpolation) return 'String';
  if (init is ListLiteral) return init.typeArguments?.toSource().replaceAll('<', 'List<') ?? null;
  return null;
}

/// סגור-טרנזיטיבי של שכן: השכן **וכל מי שהוא קורא לו** נאספים יחד, ורק אם כולם
/// טהורים (core/dart:math בלבד) — אחרת פסילה. השמות משוכתבים ל-`_src_<שם>` כדי
/// שהבדיקה תוכל להטביע אותם verbatim בלי לייבא אף אטום (חוק-4).
/// שכן לא-טהור אינו כשל של המכונה: הוא **חייב** להיות שקע, אך התחליף בבדיקה
/// דורש שיפוט-אדם — והמצאתו ע"י מכונה היא זיוף-דאטה (§20-ג). לכן: דיווח, לא ניחוש.

// ── טיפוס-שכן דרך ייבוא-יחסי ─────────────────────────────────────────────────
// עד היום הוטבעו רק טיפוסים שהוצהרו **באותו קובץ**; טיפוס שהגיע דרך
// `import '../data/x.dart'` נספר `type:X` בלתי-פתיר — גם כשהקובץ השכן טהור
// לגמרי. זה חסם 77 פונקציות על `LipskeyCatalogProduct` לבדו, מחלקת-דאטה
// בקובץ בלי שום ייבוא. כאן אותו מנגנון-הטבעה מורחב אל השכן, בתנאים זהים:
// הקובץ כולו טהור, וההצהרה סגורה על עצמה.
const _pureDartLibs = {'dart:convert','dart:math','dart:typed_data','dart:collection','dart:core'};

class _ImpFile {
  final String src;
  final Map<String, Declaration> types;
  // קבועי-top-level של אותו קובץ. בלי אלה מחלקה שמפנה לקבוע-של-קובצה
  // (`kLipskeyConnectionSizeOverride` — 93 פונקציות) נפסלה כאילו היא לא-טהורה.
  final Map<String, Declaration> vars;
  _ImpFile(this.src, this.types, [this.vars = const {}]);
}

// אינדקס טיפוסים מכל ייבוא-יחסי שקובצו טהור (אפס `package:`, אפס dart: לא-טהור)
// שם-החבילה + תיקיית lib שלה, מתוך pubspec.yaml של הפרויקט שהקובץ שייך לו.
// `package:buildsmart/data/x.dart` הוא ייבוא-עצמי — אותו דבר בדיוק כמו נתיב-יחסי.
// בלי הפתירה הזו כל האימפריה נראתה «זרה» לחצב, כי היא מייבאת את עצמה ב-package:.
(String, String)? _ownPackage(String file) {
  var dir = File(file).parent;
  for (var i = 0; i < 12; i++) {
    final pub = File('${dir.path}/pubspec.yaml');
    if (pub.existsSync()) {
      for (final line in pub.readAsLinesSync()) {
        final m = RegExp(r'^name:\s*([A-Za-z_][A-Za-z0-9_]*)').firstMatch(line);
        if (m != null) return (m.group(1)!, '${dir.path}/lib');
      }
      return null;
    }
    final up = dir.parent;
    if (up.path == dir.path) break;
    dir = up;
  }
  return null;
}

Map<String, _ImpFile> _neighborTypes(String file, CompilationUnit unit) {
  final out = <String, _ImpFile>{};
  final dir = File(file).parent.path;
  final own = _ownPackage(file);
  for (final d in unit.directives) {
    if (d is! ImportDirective) continue;
    final uri = d.uri.stringValue ?? '';
    if (uri.isEmpty) continue;
    if (d.prefix != null) continue;                       // ייבוא-בתחילית — לא ב-v1
    String path;
    if (!uri.contains(':')) {
      path = File('$dir/$uri').absolute.path;
    } else if (own != null && uri.startsWith('package:${own.$1}/')) {
      path = '${own.$2}/${uri.substring('package:${own.$1}/'.length)}';
    } else {
      continue;                                           // dart: או חבילה זרה
    }
    if (!File(path).existsSync()) continue;
    final nsrc = File(path).readAsStringSync();
    final nunit = parseString(content: nsrc, throwIfDiagnostics: false).unit;
    var pure = true;
    for (final nd in nunit.directives) {
      if (nd is ImportDirective) {
        final u = nd.uri.stringValue ?? '';
        if (!_pureDartLibs.contains(u)) { pure = false; break; }
      } else if (nd is ExportDirective || nd is PartDirective) { pure = false; break; }
    }
    if (!pure) continue;
    final types = <String, Declaration>{};
    for (final nd in nunit.declarations) {
      if (nd is EnumDeclaration) types[nd.name.lexeme] = nd;
      else if (nd is ClassDeclaration) types[nd.name.lexeme] = nd;
      else if (nd is MixinDeclaration) types[nd.name.lexeme] = nd;
      else if (nd is TypeAlias) types[nd.name.lexeme] = nd;
    }
    final vars = <String, Declaration>{};
    for (final nd in nunit.declarations) {
      if (nd is TopLevelVariableDeclaration) {
        if (!nd.variables.isConst && !nd.variables.isFinal) continue;   // רק קבוע
        for (final v in nd.variables.variables) vars[v.name.lexeme] = nd;
      } else if (nd is FunctionDeclaration && !nd.isGetter && !nd.isSetter) {
        // פונקציית-עזר top-level. מחלקה שקוראת לעוזרת-של-קובצה
        // (`lipskeyConnectionSizes` — 93 פונקציות) נפסלה כאילו אינה טהורה.
        vars[nd.name.lexeme] = nd;
      }
    }
    final f = _ImpFile(nsrc, types, vars);
    for (final k in types.keys) out.putIfAbsent(k, () => f);
  }
  return out;
}

// סגירה טרנזיטיבית של הצהרת-טיפוס-שכן: ההצהרה + כל טיפוס שהיא מזכירה,
// ובלבד שכולם `dart:core` או מוצהרים באותו קובץ-שכן. כל ספק ⇒ null (פסילה).
List<String>? _neighborClosure(String name, Map<String, _ImpFile> idx, [List<String>? why]) {
  final f = idx[name];
  if (f == null) { why?.add('אין-קובץ'); return null; }
  return _typeClosure(name, f, why, idx);
}

// אותה סגירה בדיוק, על קובץ **כלשהו** — גם הקובץ הנוכחי. ההטבעה מאותו-קובץ
// הייתה verbatim בלי שום אימות: מחלקה עם `@immutable` או מחלקה שמפנה למחלקה
// שכנה נפלטה חלקית, והאטום לא התקמפל. עכשיו אותו חוק לשני המקרים.
List<String>? _typeClosure(String name, _ImpFile primary,
    [List<String>? why, Map<String, _ImpFile> idx = const {}]) {
  final emitted = <String, String>{};
  final work = <String>[name];
  final seen = <String>{};

  // איתור הצהרה בשם נתון: קודם בקובץ-הראשי, אחר-כך בכל קובץ-שכן טהור.
  // בלי החיפוש-החוצה, `Mat4` שמפנה ל-`Vec3` בקובץ אחר נפסל אף שהשניים טהורים.
  (Declaration, String)? find(String n) {
    final d = primary.types[n] ?? primary.vars[n];
    if (d != null) return (d, primary.src);
    final f = idx[n];
    if (f != null) { final e = f.types[n] ?? f.vars[n]; if (e != null) return (e, f.src); }
    for (final f in idx.values) {
      final e = f.types[n] ?? f.vars[n];
      if (e != null) return (e, f.src);
    }
    return null;
  }

  while (work.isNotEmpty) {
    final t = work.removeLast();
    if (!seen.add(t)) continue;
    final hit = find(t);
    if (hit == null) { why?.add('לא-נמצא:$t'); return null; }
    final (d, fsrc) = hit;
    emitted[t] = fsrc.substring(d.offset, d.end);

    final bound = <String>{};
    final loc = _Locals(); d.visitChildren(loc); bound.addAll(loc.names);
    if (d is ClassDeclaration) {
      for (final m in d.members) { if (m is MethodDeclaration) bound.add(m.name.lexeme); }
      bound.add(t);
    }
    if (d is EnumDeclaration) { for (final c in d.constants) bound.add(c.name.lexeme); bound.add(t); }
    if (d is MixinDeclaration) { for (final m in d.members) { if (m is MethodDeclaration) bound.add(m.name.lexeme); } bound.add(t); }

    final fi = _FreeIds(bound); d.visitChildren(fi);
    for (final tn in fi.typeNames) {
      if (_core.contains(tn) || _mathCore.contains(tn)) continue;
      if (find(tn) != null) { work.add(tn); continue; }
      why?.add('טיפוס:$tn בתוך $t'); return null;
    }
    // גם מזהי-**ערך**: קבוע-top-level נגרר פנימה, כל דבר אחר ⇒ פסילה.
    // בלי זה הוטבעו מחלקות שנשענות על `@immutable` (package:meta) והאטום לא התקמפל.
    for (final id in fi.ids) {
      if (_core.contains(id) || _mathCore.contains(id)) continue;
      if (find(id) != null) { work.add(id); continue; }
      why?.add('ערך:$id בתוך $t'); return null;
    }
  }
  return emitted.values.toList();
}

bool _collectPure(String src, Map<String, FunctionDeclaration> topFns, String root,
    Map<String, String> out, Set<String> mathHit) {
  final work = <String>[root];
  final seen = <String>{};
  while (work.isNotEmpty) {
    final name = work.removeLast();
    if (!seen.add(name)) continue;
    final d = topFns[name];
    if (d == null) return false;
    final fe = d.functionExpression;
    final ps = fe.parameters;
    if (ps == null) return false;
    final bound = <String>{name};
    for (final p in ps.parameters) { final n = p.name?.lexeme; if (n != null) bound.add(n); }
    final loc = _Locals(); fe.body.visitChildren(loc); bound.addAll(loc.names);
    final fr = _FreeIds(bound); fe.body.visitChildren(fr); ps.accept(fr);
    for (final id in fr.ids) {
      if (_core.contains(id)) continue;
      if (_mathCore.contains(id)) { mathHit.add('y'); continue; }
      if (topFns.containsKey(id)) { work.add(id); continue; }
      return false;   // תלות שאינה שכן-טהור ⇒ פסילה
    }
    for (final t in fr.typeNames) {
      if (_core.contains(t)) continue;
      if (_mathCore.contains(t)) { mathHit.add('y'); continue; }
      return false;
    }
  }
  for (final name in seen) {
    var body = src.substring(topFns[name]!.offset, topFns[name]!.end);
    for (final other in seen) {
      body = body.replaceAll(RegExp('\\b' + RegExp.escape(other) + '\\b'), _helper(other));
    }
    out[name] = body;
  }
  return true;
}

/// האם הגוף נוגע בחברים של המשתנים ב-[names] (‏`p.title` · `p.foo()`)?
/// אם לא — הטיפוס שלהם הוא **אטום-אטום** שעובר דרך הפונקציה בלי שהיא מכירה אותו,
/// והוא ניתן להחלפה בטיפוס-גנרי בלי לשנות שום התנהגות (הדפוס של `drain_now<T>`).
class _MemberUse extends RecursiveAstVisitor<void> {
  final Set<String> names;     // שמות-הפרמטרים מהטיפוס הנבדק
  final String typeName;       // שם-הטיפוס עצמו — גישה סטטית אליו פוסלת מחיקה
  bool used = false;
  _MemberUse(this.names, this.typeName);
  @override
  void visitPrefixedIdentifier(PrefixedIdentifier n) {
    // ⚠️ `Family.coupler` — ערך-enum או חבר-סטטי. מחיקת-הטיפוס תהפוך אותו
    // ל-`T.coupler` ותשנה **התנהגות**, לא רק טיפוס. פסילה מוחלטת.
    if (names.contains(n.prefix.name) || n.prefix.name == typeName) used = true;
    super.visitPrefixedIdentifier(n);
  }
  @override
  void visitPropertyAccess(PropertyAccess n) {
    final t = n.target;
    if (t is SimpleIdentifier && names.contains(t.name)) used = true;
    super.visitPropertyAccess(n);
  }
  @override
  void visitMethodInvocation(MethodInvocation n) {
    final t = n.target;
    if (t is SimpleIdentifier && names.contains(t.name)) used = true;
    super.visitMethodInvocation(n);
  }
  @override
  void visitIndexExpression(IndexExpression n) {
    final t = n.target;
    if (t is SimpleIdentifier && names.contains(t.name)) used = true;
    super.visitIndexExpression(n);
  }
}

String? _pub(String name) => name.startsWith('_') ? name.substring(1) : name;

void main(List<String> args) {
  // מצב --ops: פעולות-היסוד שבתוך גוף-הפונקציה ⇒ חלקיקים עם חתימה (רמה אחת מתחת לפונקציה).
  //   --ops <file> <fnName> [startLine]  ·  --ops-batch jobs.json ⇒ [{file,name,line}] → חלקיקים-ייחודיים + ספירת-מוצא
  if (args.isNotEmpty && args[0] == '--ops') {
    final startLine = args.length > 3 ? int.tryParse(args[3]) : null;
    stdout.write(jsonEncode(ops(args[1], args[2], startLine)));
    return;
  }
  if (args.isNotEmpty && args[0] == '--ops-batch') {
    final jobs = (jsonDecode(File(args[1]).readAsStringSync()) as List);
    final uniq = <String, Map<String, dynamic>>{}; final origins = <String, List<String>>{}; var okFns = 0, failed = 0;
    for (final j in jobs) {
      Map<String, dynamic> r;
      try { r = ops(j['file'], j['name'], j['line'] is int ? j['line'] : int.tryParse('${j['line']}')); } catch (e) { r = {'ok': false, 'reason': 'exception: $e'}; }
      if (r['ok'] != true) { failed++; continue; }
      okFns++;
      for (final p in (r['particles'] as List)) {
        final key = p['name'] as String;
        uniq.putIfAbsent(key, () => Map<String, dynamic>.from(p));
        (origins[key] ??= []).add('${j['file']}#${j['name']}');
      }
    }
    final list = uniq.values.map((p) { final o = origins[p['name']]!; return {...p, 'count': o.length, 'origins': o.take(5).toList()}; }).toList()
      ..sort((a, b) => (b['count'] as int).compareTo(a['count'] as int));
    stdout.write(jsonEncode({'functions': okFns, 'failed': failed, 'particles': list}));
    return;
  }
  // מצב-אצווה: VM אחד, פרסור-רב. --batch jobs.json ⇒ [{file,name,line}] → [{result}]
  if (args.isNotEmpty && args[0] == '--batch') {
    final jobs = (jsonDecode(File(args[1]).readAsStringSync()) as List);
    final out = [];
    for (final j in jobs) {
      try { out.add(carve(j['file'], j['name'], j['line'] is int ? j['line'] : int.tryParse('${j['line']}'))); }
      catch (e) { out.add({'ok': false, 'reason': 'exception: $e', 'name': j['name']}); }
    }
    stdout.write(jsonEncode(out));
    return;
  }
  final startLine = args.length > 2 ? int.tryParse(args[2]) : null;
  stdout.write(jsonEncode(carve(args[0], args[1], startLine)));
}


// ── ערך-דוגמה לטיפוס שהוטבע ─────────────────────────────────────────────────
// מחברת-הנחיתה הניחה ש**כל** טיפוס מוטבע הוא enum ובנתה `X.values.first`.
// למחלקת-דאטה זה קרס (9 אטומים). החצב יודע מה ההצהרה באמת — הוא זה שיאמר.
String? _litFor(String t) {
  final nul = t.endsWith('?');
  final b = t.replaceAll('?', '').trim();
  if (nul) return 'null';
  switch (b) {
    case 'String': return "'a'";
    case 'int': return '0';
    case 'double': return '0.0';
    case 'num': return '0';
    case 'bool': return 'true';
  }
  final mL = RegExp(r'^(List|Set|Iterable)<(.+)>$').firstMatch(b);
  if (mL != null) return 'const <${mL.group(2)}>${mL.group(1) == 'List' ? '[]' : '{}'}';
  final mM = RegExp(r'^Map<\s*(.+?)\s*,\s*(.+)>$').firstMatch(b);
  if (mM != null) return 'const <${mM.group(1)}, ${mM.group(2)}>{}';
  return null;
}

List<String> _samplesFor(String name, String declSrc) {
  final u = parseString(content: declSrc, throwIfDiagnostics: false).unit;
  if (u.declarations.isEmpty) return const [];
  final d = u.declarations.first;
  if (d is EnumDeclaration) return ['$name.values.first', '$name.values.last'];
  if (d is! ClassDeclaration) return const [];
  for (final m in d.members) {
    if (m is! ConstructorDeclaration || m.name != null) continue;
    final args = <String>[];
    for (final prm in m.parameters.parameters) {
      final isReq = prm.isRequiredPositional || prm.isRequiredNamed;
      if (!isReq) continue;                       // אופציונלי ⇒ מדלגים
      String? ty;
      final inner = prm is DefaultFormalParameter ? prm.parameter : prm;
      if (inner is SimpleFormalParameter) ty = inner.type?.toSource();
      if (inner is FieldFormalParameter) {
        ty = inner.type?.toSource();
        if (ty == null) {                          // `this.x` — הטיפוס מהשדה
          for (final f in d.members) {
            if (f is! FieldDeclaration) continue;
            for (final v in f.fields.variables) {
              if (v.name.lexeme == inner.name.lexeme) ty = f.fields.type?.toSource();
            }
          }
        }
      }
      if (ty == null) return const [];
      final lit = _litFor(ty);
      if (lit == null) return const [];            // אין ערך-אמת ⇒ אין דוגמה
      args.add(prm.isRequiredNamed ? '${inner.name!.lexeme}: $lit' : lit);
    }
    final kw = m.constKeyword != null ? 'const ' : '';
    return ['$kw$name(${args.join(', ')})'];
  }
  return const [];
}

Map<String, dynamic> carve(String file, String fnName, int? startLine) {
  final src = File(file).readAsStringSync();
  final unit = parseString(content: src, throwIfDiagnostics: false).unit;
  final lineInfo = parseString(content: src, throwIfDiagnostics: false).lineInfo;

  // תחיליות-ייבוא של dart:math (`import 'dart:math' as math;`): בלי זה המזהה
  // `math` נראה כמזהה-חופשי בלתי-פתיר, והפונקציה נדחית למרות שהיא טהורה.
  final mathPrefixes = <String>{};
  for (final dir in unit.directives) {
    if (dir is ImportDirective && (dir.uri.stringValue ?? '') == 'dart:math') {
      final pfx = dir.prefix?.name;
      if (pfx != null) mathPrefixes.add(pfx);
    }
  }

  // אינדקס הצהרות-top-level בקובץ
  final topFns = <String, FunctionDeclaration>{};
  final topVars = <String, VariableDeclaration>{};   // שם ⇒ ההצהרה (לשקע-ערך)
  final topVarDecls = <String, Declaration>{};       // שם ⇒ הצהרת-ה-top-level המלאה (להטבעה)
  final topTypes = <String, Declaration>{}; // enum/class/typedef → הצהרתן
  for (final d in unit.declarations) {
    if (d is FunctionDeclaration && !d.isGetter && !d.isSetter) { topFns[d.name.lexeme] = d; topVarDecls[d.name.lexeme] = d; }
    else if (d is TopLevelVariableDeclaration) {
      for (final v in d.variables.variables) topVars[v.name.lexeme] = v;
      if (d.variables.isConst || d.variables.isFinal) {
        for (final v in d.variables.variables) topVarDecls[v.name.lexeme] = d;
      }
    }
    else if (d is EnumDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is ClassDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is MixinDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is TypeAlias) topTypes[d.name.lexeme] = d;
  }

  // טיפוסי-שכן דרך ייבוא-יחסי מקובץ טהור (ראה _neighborTypes)
  final impIdx = _neighborTypes(file, unit);
  final impSrc = <String, List<String>>{};      // שם ⇒ מקור-ההצהרה + תלויותיה
  final selfFile = _ImpFile(src, topTypes, topVarDecls); // הקובץ הנוכחי — נבדק באותו חוק

  // אתר את הפונקציה (top-level או מתודה) לפי שם + שורה
  FunctionDeclaration? fn;
  MethodDeclaration? method;
  final target = fnName.startsWith('_') ? fnName : fnName;
  // ⚠️ `d.offset` של הצהרה-מתועדת מתחיל ב**הערת-התיעוד**, לא בשורת-ההצהרה.
  // עם dartdoc בן 4 שורות השורה המחושבת קטנה ב-4, סובלנות ה-±2 נכשלה,
  // והפונקציה דווחה «לא נמצאה» — 705 מתוך 1,508 העבודות (47%) נפלו כך.
  bool near(Declaration d) {
    if (startLine == null) return true;
    final a = lineInfo.getLocation(d.offset).lineNumber;
    final b = lineInfo.getLocation(d.firstTokenAfterCommentAndMetadata.offset).lineNumber;
    return (a - startLine).abs() <= 2 || (b - startLine).abs() <= 2;
  }
  void scan(AstNode n) {
    n.visitChildren(_FindDecl((d) {
      if (d is FunctionDeclaration && d.name.lexeme == target) { if (near(d)) fn = d; }
      else if (d is MethodDeclaration && d.name.lexeme == target) { if (near(d)) method = d; }
    }));
  }
  scan(unit);

  final body = fn?.functionExpression.body ?? method?.body;
  final params = fn?.functionExpression.parameters ?? method?.parameters;
  final declNode = (fn ?? method) as Declaration?;
  if (body == null || declNode == null) { return {'ok': false, 'reason': 'function not found: $target', 'name': fnName}; }

  // מזהים-כבולים: פרמטרים + type-params
  final bound = <String>{};
  if (params != null) for (final p in params.parameters) { final id = p.name?.lexeme; if (id != null) bound.add(id); }
  bound.add(target);
  // כבול גם כל מוצהר-מקומי (לולאות/final/catch/פונקציות-מקומיות)
  final locals = _Locals(); body.visitChildren(locals); bound.addAll(locals.names);

  final free = _FreeIds(bound);
  body.visitChildren(free);
  // אסוף גם טיפוסים מחתימת-הפונקציה
  if (params != null) params.accept(free);

  // סיווג המזהים-החופשיים
  final sockets = <String>[];   // שכן top-level (fn/var) ⇒ שקע
  final inlineTypes = <String>[]; // טיפוס מקומי ⇒ הטבעה verbatim
  final unresolved = <String>[];
  var usesMath = false;
  String? usedMathPrefix;   // אם הגוף משתמש ב-`math.x`, הייבוא חייב לשאת את התחילית
  for (final id in free.ids) {
    if (topFns.containsKey(id) || topVars.containsKey(id)) sockets.add(id);
    else if (mathPrefixes.contains(id)) { usesMath = true; usedMathPrefix = id; }
    else if (_mathCore.contains(id)) usesMath = true;
    else unresolved.add(id); // ערך-חופשי לא-מזוהה (אולי import) — חשוד
  }
  // ── שקע-טיפוס: טיפוס-זר שעובר דרך הפונקציה בלי שהיא מכירה אותו ─────────
  // פרמטר מטיפוס-פרויקט שאיש לא קורא ממנו שדה הוא **אטום-אטום**: הפונקציה רק
  // מעבירה אותו הלאה. החלפתו בטיפוס-גנרי מסירה את התלות בלי לשנות התנהגות —
  // הדפוס של `drain_now<T>` ו-`decode<T>` שנחצבו ביד.
  final erasable = <String>{};
  if (params != null) {
    final byType = <String, Set<String>>{};   // שם-טיפוס ⇒ שמות-הפרמטרים שלו
    for (final p in params.parameters) {
      if (p is! SimpleFormalParameter) continue;
      final tn = p.type;
      final nm = p.name?.lexeme;
      if (tn is! NamedType || nm == null) continue;
      (byType[tn.name2.lexeme] ??= <String>{}).add(nm);
    }
    for (final e in byType.entries) {
      final t = e.key;
      if (_core.contains(t) || topTypes.containsKey(t) || _mathCore.contains(t)) continue;
      if (impIdx.containsKey(t) && _neighborClosure(t, impIdx) != null) continue;  // יוטבע — לא שקע
      if (tn_hasArgs(params, t)) continue;          // טיפוס-גנרי בעצמו — לא ב-v1
      final mu = _MemberUse(e.value, t);
      body.visitChildren(mu);
      if (!mu.used) erasable.add(t);                // אפס-קריאת-חבר ⇒ ניתן-למחיקה
    }
  }

  for (final t in free.typeNames) {
    if (topTypes.containsKey(t)) {
      // הטבעה-מאותו-קובץ עוברת אימות זהה: סגירה טרנזיטיבית + אפס מזהה-חופשי.
      final w = <String>[];
      final cl = _typeClosure(t, selfFile, w, impIdx);
      if (cl == null) { unresolved.add('type:$t' + (w.isEmpty ? '' : ' ←${w.first}')); continue; }
      impSrc[t] = cl; inlineTypes.add(t); continue;
    }
    if (impIdx.containsKey(t)) {
      final w = <String>[];
      final cl = _neighborClosure(t, impIdx, w);
      if (cl != null && cl.isNotEmpty) { impSrc[t] = cl; inlineTypes.add(t); continue; }
      unresolved.add('type:$t' + (w.isEmpty ? '' : ' ←${w.first}'));
      continue;
    }
    else if (_mathCore.contains(t)) usesMath = true;
    else if (erasable.contains(t)) continue;   // יהפוך לגנרי — אינו תלות
    // טיפוס לא-מקומי שאינו core ⇒ יתכן import (unresolved-type)
    else if (!_core.contains(t)) unresolved.add('type:$t');
  }

  // הטבעת טיפוסים verbatim + הפונקציה (פרטי→ציבורי)
  final buf = StringBuffer();
  final copiedTypes = <String>[];
  final seenType = <String>{};                    // דדופ: שתי הטבעות של אותו טיפוס
  for (final t in inlineTypes) {                  // ⇒ `The name 'X' is already defined`
    for (final srcText in impSrc[t] ?? const <String>[]) {
      final m = RegExp(r'(?:class|enum|mixin|typedef)\s+([A-Za-z_][A-Za-z0-9_]*)').firstMatch(srcText);
      if (m != null && !seenType.add(m.group(1)!)) continue;
      copiedTypes.add(srcText);                   // טיפוס-שכן: המקור מגיע מקובצו
    }
  }
  // ── שקע-אוטומטי (חוק-3): קריאה-לשכן ⇒ פרמטר-שקע מוזרק ──────────────────
  // עד היום `sockets` היה תווית בלבד: אטום-עם-שכן סווג לא-טריוויאלי ונפל בשקט,
  // בזמן שאותם מקרים בדיוק נחצבו ביד עם שקע (למשל accessPasswordMatches).
  // כאן השכן הופך לפרמטר, בתנאים שמרניים בלבד — כל ספק ⇒ פסילה, לא ניחוש.
  final socketMeta = <Map<String, String>>[];
  final socketDecls = <String>[];
  final socketTypes = <String>[];
  final origParams = <Map<String, String>>[];
  var autoSocket = false;

  // ── הפרמטרים נקראים **מה-AST, תמיד** ─────────────────────────────────────
  // לקח: 3 באגים רצופים נפלו ב-`parseParams` של מחברת-הנחיתה, שמנתחת את
  // **הטקסט** (סוגריים מתוך dartdoc · חתימה-גנרית לא-מזוהה). לחצב יש עץ-תחביר;
  // הוא המקור, והנחיתה רק צורכת. `paramsSimple=false` ⇒ הנחיתה פוסלת, לא מנחשת.
  var paramsSimple = params != null;
  if (params != null) {
    final raw = src.substring(params.offset, params.end);
    if (raw.contains('{') || raw.contains('[')) paramsSimple = false;   // named/optional
    if (paramsSimple) {
      for (final p in params.parameters) {
        final n = p.name?.lexeme;
        if (n == null || n.isEmpty) { paramsSimple = false; break; }
        final t = (p is SimpleFormalParameter) ? (p.type?.toSource() ?? 'dynamic') : 'dynamic';
        origParams.add({'type': t, 'name': n});
      }
    }
    if (!paramsSimple) origParams.clear();
  }

  if (sockets.isNotEmpty && unresolved.isEmpty && params != null) {
    var ok = paramsSimple;
    if (ok) {
      final emitted = <String, String>{};   // שם-מקורי ⇒ מקור-משוכתב (דדופ בין שקעים)
      final mathHit = <String>{};
      for (final sName in sockets) {
        final d = topFns[sName];
        if (d == null) {
          // שקע-**ערך**: קבוע-שכן (`kDeliveredStage`) ⇒ פרמטר מוקלד, כמו
          // `{required int kIndexMinWordLen}` שבמדף. השם נשמר, כולל תחילית-k.
          final v = topVars[sName];
          if (v == null) { ok = false; break; }
          final vt = _varType(src, v);
          if (vt == null) { ok = false; break; }           // ערך לא-טהור / בלי טיפוס נגזר
          socketMeta.add({'name': _pub(sName)!, 'init': _helper(sName)});
          socketTypes.add(vt);
          emitted[sName] = 'final ${_helper(sName)} = ' + src.substring(v.initializer!.offset, v.initializer!.end) + ';';
          continue;
        }
        final t = _fnType(d);
        if (t == null) { ok = false; break; }
        if (!_collectPure(src, topFns, sName, emitted, mathHit)) { ok = false; break; }
        socketMeta.add({'name': _pub(sName)!, 'init': _helper(sName)});
        socketTypes.add(t);
      }
      if (ok) { socketDecls.addAll(emitted.values); if (mathHit.isNotEmpty) usesMath = true; }
    }
    autoSocket = ok && socketMeta.length == sockets.length;
  }

  // גוף-הפונקציה verbatim (כולל חתימה); שנה שם פרטי→ציבורי בכותרת בלבד
  var fnSrc = src.substring(declNode.offset, declNode.end);
  // מחיקת-טיפוס: `LipskeyCatalogProduct p` ⇒ `T p`, והחתימה מקבלת `<T>`.
  // אפס שינוי-התנהגות: איש לא קרא שדה מהטיפוס הזה (אומת ב-_MemberUse).
  final erasedTypes = <String, String>{};
  if (erasable.isNotEmpty && fn != null) {
    var i = 0;
    for (final t in erasable.toList()..sort()) {
      final tv = i == 0 ? 'T' : 'T${i + 1}';
      i++;
      erasedTypes[t] = tv;
      fnSrc = fnSrc.replaceAll(RegExp('\\b' + RegExp.escape(t) + '\\b'), tv);
    }
    // הוספת רשימת-טיפוסים לחתימה, מיד אחרי שם-הפונקציה
    final tp = erasedTypes.values.join(', ');
    final existing = fn!.functionExpression.typeParameters;
    if (existing != null) {
      fnSrc = fnSrc.replaceFirst('<' + src.substring(existing.offset + 1, existing.end - 1) + '>',
          '<' + src.substring(existing.offset + 1, existing.end - 1) + ', ' + tp + '>');
    } else {
      final nameEnd = fn!.name.end - declNode.offset;
      fnSrc = fnSrc.substring(0, nameEnd) + '<' + tp + '>' + fnSrc.substring(nameEnd);
    }
  }
  if (autoSocket) {
    // הזרקה לפני ה-')' של רשימת-הפרמטרים — מיקום מוחלט מה-AST, לא רגקס.
    final rel = params!.end - declNode.offset;
    final inject = List.generate(socketMeta.length,
        (i) => 'required ${socketTypes[i]} ${socketMeta[i]['name']}').join(', ');
    final sep = origParams.isEmpty ? '' : ', ';
    fnSrc = fnSrc.substring(0, rel - 1) + sep + '{' + inject + '}' + fnSrc.substring(rel - 1);
    // הגוף חייב לקרוא לשקע, לא לשכן: `_pow025(x)` ⇒ `pow025(x)`.
    // בטוח אחרי ההזרקה — הטקסט המוזרק נושא כבר את השם-הציבורי.
    for (var i = 0; i < sockets.length; i++) {
      final from = sockets[i], to = socketMeta[i]['name']!;
      if (from != to) fnSrc = fnSrc.replaceAll(RegExp('\\b' + RegExp.escape(from) + '\\b'), to);
    }
  }
  final pubName = _pub(target)!;
  if (target.startsWith('_')) {
    // החלף את המופע הראשון של השם בחתימה (שמור על גוף)
    fnSrc = fnSrc.replaceFirst(RegExp('\\b' + RegExp.escape(target) + '\\b'), pubName);
  }

  return {
    'ok': true,
    'name': pubName,
    'origName': target,
    'sockets': sockets,
    'inlineTypes': inlineTypes,
    'unresolved': unresolved,
    'erasedTypes': erasedTypes,
    'copiedTypes': copiedTypes,
    'typeSamples': {
      for (final t in seenType)
        if (_samplesFor(t, copiedTypes.firstWhere(
                (c) => RegExp('(?:class|enum|mixin|typedef)\\s+' + t + r'\b').hasMatch(c),
                orElse: () => '')).isNotEmpty)
          t: _samplesFor(t, copiedTypes.firstWhere(
              (c) => RegExp('(?:class|enum|mixin|typedef)\\s+' + t + r'\b').hasMatch(c),
              orElse: () => '')),
    },
    'fnSource': fnSrc,
    'imports': usesMath
        ? [usedMathPrefix == null ? "import 'dart:math';" : "import 'dart:math' as $usedMathPrefix;"]
        : <String>[],
    'autoSocket': autoSocket,
    'socketMeta': socketMeta,
    'socketDecls': socketDecls,
    'origParams': origParams,
    'paramsSimple': paramsSimple,
    'trivial': sockets.isEmpty && unresolved.isEmpty,
  };
}

// עוזר: מבקר שמריץ callback על כל הצהרת-פונקציה/מתודה
class _FindDecl extends RecursiveAstVisitor<void> {
  final void Function(Declaration) cb;
  _FindDecl(this.cb);
  @override
  void visitFunctionDeclaration(FunctionDeclaration node){ cb(node); super.visitFunctionDeclaration(node); }
  @override
  void visitMethodDeclaration(MethodDeclaration node){ cb(node); super.visitMethodDeclaration(node); }
}


// ══════════════════════════════════════════════════════════════════════════
// --ops · פעולות-היסוד שבתוך גוף-הפונקציה ⇒ חלקיקים (רמה אחת מתחת לפונקציה).
//   כל ביטוי-בינארי / קריאת-מתודה-של-core / גישה-לתכונה הופך לפונקציה-עצמאית
//   עם חתימה (טיפוסים מ-cast/ליטרל/פרמטר-מוצהר; אחרת dynamic) — אפס ניחוש-דומיין.
//   ליטרל-מפתח בתוך `r['key'] == null` הופך לשקע (פרמטר), לא נשאר צרוב.
// ══════════════════════════════════════════════════════════════════════════
String _opWord(String op) => const {'<': 'Lt', '>': 'Gt', '<=': 'Le', '>=': 'Ge', '==': 'Eq', '!=': 'Ne', '+': 'Add', '-': 'Sub', '*': 'Mul', '/': 'Div', '%': 'Mod', '~/': 'IDiv'}[op] ?? 'Op';
String _tWord(String t) => t == 'num' ? 'Num' : t == 'String' ? 'Str' : t == 'bool' ? 'Bool' : t.startsWith('List') ? 'List' : 'Dyn';

class _OpsVisitor extends RecursiveAstVisitor<void> {
  final Map<String, String> paramTypes;
  final List<Map<String, dynamic>> out = [];
  _OpsVisitor(this.paramTypes);

  String norm(String t) {
    t = t.replaceAll('?', '').trim();
    if (t == 'int' || t == 'double') return 'num';
    if (t == 'Null') return 'dynamic';
    if (t.startsWith('List') || t.startsWith('Iterable')) return 'List<dynamic>';
    if (t.startsWith('Map')) return 'Map<dynamic, dynamic>';
    return t.isEmpty ? 'dynamic' : t;
  }
  String typeOf(Expression e) {
    if (e is ParenthesizedExpression) return typeOf(e.expression);
    if (e is IntegerLiteral || e is DoubleLiteral) return 'num';
    if (e is SimpleStringLiteral || e is StringInterpolation || e is AdjacentStrings) return 'String';
    if (e is BooleanLiteral) return 'bool';
    if (e is NullLiteral) return 'Null';
    if (e is ListLiteral) return 'List<dynamic>';
    if (e is AsExpression) return e.type.toSource();
    if (e is SimpleIdentifier) return paramTypes[e.name] ?? 'dynamic';
    if (e is PrefixExpression && e.operator.lexeme == '-') return typeOf(e.operand);
    String? prop; if (e is PropertyAccess) prop = e.propertyName.name; if (e is PrefixedIdentifier) prop = e.identifier.name;
    if (prop != null) { if (prop == 'length') return 'num'; if (prop == 'isEmpty' || prop == 'isNotEmpty') return 'bool'; return 'dynamic'; }
    if (e is MethodInvocation) {
      final m = e.methodName.name;
      if (const {'compareTo', 'indexOf', 'floor', 'round', 'ceil', 'truncate'}.contains(m)) return 'num';
      if (const {'toString', 'trim', 'toLowerCase', 'toUpperCase', 'substring', 'replaceAll', 'join', 'padLeft', 'padRight'}.contains(m)) return 'String';
      if (const {'contains', 'startsWith', 'endsWith', 'any', 'every'}.contains(m)) return 'bool';
      if (const {'split', 'where', 'map', 'toList', 'take', 'skip'}.contains(m)) return 'List<dynamic>';
      return 'dynamic';
    }
    if (e is BinaryExpression) {
      final op = e.operator.lexeme;
      if (const {'<', '>', '<=', '>=', '==', '!=', '&&', '||'}.contains(op)) return 'bool';
      final l = typeOf(e.leftOperand); return l == 'dynamic' ? typeOf(e.rightOperand) : l;
    }
    return 'dynamic';
  }
  void emit(String kind, String name, List<String> ps, List<String> names, String ret, String body, AstNode node) {
    final sig = '(' + [for (var i = 0; i < ps.length; i++) '${ps[i]} ${names[i]}'].join(', ') + ') => $ret';
    final src = '$ret $name(' + [for (var i = 0; i < ps.length; i++) '${ps[i]} ${names[i]}'].join(', ') + ') => $body;';
    out.add({'name': name, 'kind': kind, 'params': ps, 'ret': ret, 'sig': sig, 'source': src, 'expr': node.toSource()});
  }
  @override
  void visitBinaryExpression(BinaryExpression n) {
    final op = n.operator.lexeme; final L = n.leftOperand; final R = n.rightOperand;
    const cmp = {'<', '>', '<=', '>=', '==', '!='}; const ar = {'+', '-', '*', '/', '%', '~/'};
    if (cmp.contains(op) && L is MethodInvocation && L.methodName.name == 'compareTo' && L.target != null && L.argumentList.arguments.length == 1 && R is IntegerLiteral && R.value == 0) {
      final t = norm(typeOf(L.target!)); final u = norm(typeOf(L.argumentList.arguments.first)); final tt = t == 'dynamic' ? u : t;
      emit('predicate', 'cmp${_opWord(op)}${_tWord(tt)}', [tt, tt], ['a', 'b'], 'bool', 'a.compareTo(b) $op 0', n);
    } else if (cmp.contains(op) && (op == '==' || op == '!=')) {
      final idx = L is IndexExpression ? L : (R is IndexExpression ? R : null); final other = idx == null ? (L is NullLiteral ? L : R) : (identical(idx, L) ? R : L);
      if (idx != null && idx.index is SimpleStringLiteral && other is NullLiteral) {
        emit('predicate', op == '==' ? 'fieldIsNull' : 'fieldIsNotNull', ['dynamic', 'String'], ['r', 'key'], 'bool', '(r is Map ? r[key] : null) $op null', n);
      } else if (other is NullLiteral) {
        emit('predicate', op == '==' ? 'isNull' : 'isNotNull', ['dynamic'], ['a'], 'bool', 'a $op null', n);
      } else {
        final t = norm(typeOf(L)); final u = norm(typeOf(R)); final tt = t == 'dynamic' ? u : t;
        emit('predicate', '${op == '==' ? 'eq' : 'ne'}${_tWord(tt)}', [tt, tt], ['a', 'b'], 'bool', 'a $op b', n);
      }
    } else if (cmp.contains(op)) {
      final t = norm(typeOf(L)); final u = norm(typeOf(R)); final tt = t == 'dynamic' ? u : t;
      final w = _opWord(op); emit('predicate', '${w[0].toLowerCase()}${w.substring(1)}${_tWord(tt)}', [tt, tt], ['a', 'b'], 'bool', 'a $op b', n);
    } else if (ar.contains(op)) {
      final t = norm(typeOf(L)); final u = norm(typeOf(R)); final tt = (t == 'num' || u == 'num') ? 'num' : (t == 'String' && op == '+') ? 'String' : 'dynamic';
      final ret = tt == 'String' ? 'String' : tt == 'num' ? 'num' : 'dynamic';
      final w = _opWord(op); emit('measure', '${w[0].toLowerCase()}${w.substring(1)}${_tWord(tt)}', [tt, tt], ['a', 'b'], ret, 'a $op b', n);
    }
    super.visitBinaryExpression(n);
  }
  @override
  void visitMethodInvocation(MethodInvocation n) {
    final t = n.target; final m = n.methodName.name; final args = n.argumentList.arguments;
    if (t != null) {
      final tt = norm(typeOf(t));
      if (m == 'split' && args.length == 1) emit('collection', 'splitStr', ['String', 'String'], ['s', 'sep'], 'List<dynamic>', 's.split(sep)', n);
      else if (m == 'trim' && args.isEmpty) emit('format', 'trimStr', ['String'], ['s'], 'String', 's.trim()', n);
      else if (m == 'toLowerCase' && args.isEmpty) emit('format', 'lowerStr', ['String'], ['s'], 'String', 's.toLowerCase()', n);
      else if (m == 'contains' && args.length == 1 && tt == 'String') emit('predicate', 'containsStr', ['String', 'String'], ['s', 'q'], 'bool', 's.contains(q)', n);
      else if (m == 'startsWith' && args.length == 1) emit('predicate', 'startsWithStr', ['String', 'String'], ['s', 'q'], 'bool', 's.startsWith(q)', n);
      else if (m == 'where' && args.length == 1) emit('collection', 'whereList', ['List<dynamic>', 'bool Function(dynamic)'], ['xs', 'f'], 'List<dynamic>', 'xs.where(f).toList()', n);
      else if (m == 'join' && args.length == 1) emit('format', 'joinList', ['List<dynamic>', 'String'], ['xs', 'sep'], 'String', 'xs.join(sep)', n);
      else if (m == 'abs' && args.isEmpty) emit('measure', 'absNum', ['num'], ['a'], 'num', 'a.abs()', n);
      else if (m == 'floor' && args.isEmpty) emit('measure', 'floorNum', ['num'], ['a'], 'num', 'a.floor()', n);
    }
    super.visitMethodInvocation(n);
  }
  void _prop(String prop, Expression target, AstNode n) {
    final tt = norm(typeOf(target));
    if (prop == 'length') emit('measure', tt == 'String' ? 'lengthStr' : 'lengthList', [tt == 'String' ? 'String' : 'List<dynamic>'], ['xs'], 'num', 'xs.length', n);
    else if (prop == 'isEmpty') emit('predicate', tt == 'String' ? 'isEmptyStr' : 'isEmptyList', [tt == 'String' ? 'String' : 'List<dynamic>'], ['xs'], 'bool', 'xs.isEmpty', n);
    else if (prop == 'isNotEmpty') emit('predicate', tt == 'String' ? 'isNotEmptyStr' : 'isNotEmptyList', [tt == 'String' ? 'String' : 'List<dynamic>'], ['xs'], 'bool', 'xs.isNotEmpty', n);
  }
  @override
  void visitPropertyAccess(PropertyAccess n) { final t = n.target; if (t != null) _prop(n.propertyName.name, t, n); super.visitPropertyAccess(n); }
  @override
  void visitPrefixedIdentifier(PrefixedIdentifier n) { _prop(n.identifier.name, n.prefix, n); super.visitPrefixedIdentifier(n); }
}

Map<String, dynamic> ops(String file, String fnName, int? startLine) {
  final src = File(file).readAsStringSync();
  final parsed = parseString(content: src, throwIfDiagnostics: false);
  final unit = parsed.unit; final lineInfo = parsed.lineInfo;
  FunctionDeclaration? fn; MethodDeclaration? method;
  bool near(Declaration d) {
    if (startLine == null) return true;
    final a = lineInfo.getLocation(d.offset).lineNumber;
    final b = lineInfo.getLocation(d.firstTokenAfterCommentAndMetadata.offset).lineNumber;
    return (a - startLine).abs() <= 2 || (b - startLine).abs() <= 2;
  }
  unit.visitChildren(_FindDecl((d) {
    if (d is FunctionDeclaration && d.name.lexeme == fnName) { if (near(d)) fn = d; }
    else if (d is MethodDeclaration && d.name.lexeme == fnName) { if (near(d)) method = d; }
  }));
  final body = fn?.functionExpression.body ?? method?.body;
  final params = fn?.functionExpression.parameters ?? method?.parameters;
  if (body == null) return {'ok': false, 'reason': 'function not found: $fnName', 'name': fnName};
  final pt = <String, String>{};
  for (final p in params?.parameters ?? const <FormalParameter>[]) {
    final q = p is DefaultFormalParameter ? p.parameter : p;
    if (q is SimpleFormalParameter) { final nm = q.name?.lexeme; if (nm != null) pt[nm] = q.type?.toSource() ?? 'dynamic'; }
  }
  final v = _OpsVisitor(pt); body.visitChildren(v);
  final seen = <String>{}; final uniq = <Map<String, dynamic>>[];
  for (final p in v.out) { if (seen.add(p['name'] as String)) uniq.add(p); }
  return {'ok': true, 'name': fnName, 'file': file, 'particles': uniq};
}
