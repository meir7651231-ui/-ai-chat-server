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
  final String path;   // G69 · נתיב-הקובץ (מנורמל) — טבלת-מדף מזוהה לפי «מוצא|שם», לא לפי שם (99 קבצי-דאטה מייצאים kTerms)
  _ImpFile(this.src, this.types, [this.vars = const {}, this.path = '']);
}
String _norm(String p) => Uri.file(File(p).absolute.path).normalizePath().toFilePath();   // G69 · `lib/a/../b.dart` ≡ `lib/b.dart` — זהות-מוצא בבייטים

// G69 · טבלאות-המדף (new/dart-data/*-table.dart, שנחתו ע"י carveVar): מפתח = «מוצא|שם». הכותרת נושאת `// ייצוא: <שם> ← <מוצא>` לכל הצהרה
//   שהסגירה משכה (גם טיפוס מקובץ-שכן של הטבלה). פונקציה שמפנה למזהה שהמוצא שלו נחת ⇒ **מייבאת** את הטבלה במקום לשכפל/להיפסל.
class _ShelfEntry { final String imp; final String src; final List<String> keys; final bool isFn; _ShelfEntry(this.imp, this.src, [this.keys = const [], this.isFn = false]); }
final Map<String, Map<String, String>> _shelfDecls = {};   // ייבוא ⇒ {שם-מוצהר ⇒ מקור} (לדדופ-עותקים ולזיהוי התנגשות-שמות בין ייבואים)
// G69 · מפתחות-אמת של טבלת-מפה (6 הראשונים, ליטרלי-מחרוזת פשוטים) — דוגמאות-String לפונקציות שמפנות לטבלה; אפס-המצאה
List<String> _mapKeys(Declaration d) {
  if (d is! TopLevelVariableDeclaration) return const [];
  final out = <String>[];
  for (final v in d.variables.variables) { final init = v.initializer; if (init is SetOrMapLiteral) for (final e in init.elements) { if (e is MapLiteralEntry && e.key is SimpleStringLiteral) out.add((e.key as SimpleStringLiteral).value); } }
  if (out.length <= 6) return out;
  if (out.length <= 12) return out;
  return [for (var i = 0; i < 12; i++) out[(i * (out.length - 1)) ~/ 11]];   // פיזור שווה על פני הטבלה (הראשונים = משפחה אחת)
}
Map<String, _ShelfEntry>? _shelfCache;
Map<String, _ShelfEntry> _shelf() {
  if (_shelfCache != null) return _shelfCache!;
  final out = <String, _ShelfEntry>{};
  final envDir = Platform.environment['CARVE_SHELF_DIR'];
  final cands = [if (envDir != null) envDir, File(Platform.script.toFilePath()).parent.path + '/../../new/dart-data', 'new/dart-data'];
  final dir = cands.map((d) => Directory(d)).firstWhere((d) => d.existsSync(), orElse: () => Directory(''));
  if (dir.path.isNotEmpty) for (final f in dir.listSync()) {
    if (f is! File || !f.path.endsWith('-table.dart')) continue;
    final s = f.readAsStringSync();
    final origins = <String, String>{};
    for (final m in RegExp(r'^// ייצוא: ([A-Za-z_][A-Za-z0-9_]*) ← (\S+)$', multiLine: true).allMatches(s)) { final o = m.group(2)!; origins[m.group(1)!] = o.startsWith('/') ? o : '/home/user/' + o; }
    if (origins.isEmpty) continue;
    final imp = '../dart-data/' + f.uri.pathSegments.last;
    final u = parseString(content: s, throwIfDiagnostics: false).unit;
    for (final d in u.declarations) { for (final n in _declNames(d)) { (_shelfDecls[imp] ??= {})[n] = s.substring(d.offset, d.end); final o = origins[n]; if (o != null) out['$o|$n'] = _ShelfEntry(imp, s.substring(d.offset, d.end), _mapKeys(d)); } }
  }
  // G70 · גם אטומי-הלוגיקה שכבר במדף (new/dart/<x>.dart): כותרת `// מוצא: <קובץ>:<שורה>` + `· <שם>` ⇒ קריאה-חוצת-קבצים לפונקציה שכבר נחצבה = **ייבוא האטום**
  //   (אטום+אטום, הכרעה-20), לא עותק-שני ולא שקע. אטום עם שקעים-מוזרקים (חתימה שונה) — לא מיובא.
  final adir = Directory(dir.path.replaceFirst(RegExp(r'dart-data/?$'), 'dart'));
  if (adir.existsSync()) for (final f in adir.listSync()) {
    if (f is! File || !f.path.endsWith('.dart') || f.path.endsWith('_test.dart') || f.path.endsWith('-proof.dart')) continue;
    final s = f.readAsStringSync();
    final o = RegExp(r'^// מוצא: (\S+?):\d+', multiLine: true).firstMatch(s); final nm = RegExp(r'^// ⚛️ אטום-Dart[^·\n]*· (\w+)', multiLine: true).firstMatch(s);
    if (o == null || nm == null || RegExp(r'^// שקעים \(חוק-3', multiLine: true).hasMatch(s)) continue;
    final origin = o.group(1)!.startsWith('/') ? o.group(1)! : '/home/user/' + o.group(1)!;
    final imp = f.uri.pathSegments.last;
    final u = parseString(content: s, throwIfDiagnostics: false).unit;
    for (final d in u.declarations) for (final n in _declNames(d)) (_shelfDecls[imp] ??= {})[n] = s.substring(d.offset, d.end);
    final fnSrc = _shelfDecls[imp]?[nm.group(1)!]; if (fnSrc == null) continue;
    out.putIfAbsent('$origin|${nm.group(1)!}', () => _ShelfEntry(imp, fnSrc, const [], true));
  }
  return _shelfCache = out;
}
List<String> _declNames(Declaration d) => d is NamedCompilationUnitMember ? [d.name.lexeme] : d is TopLevelVariableDeclaration ? d.variables.variables.map((v) => v.name.lexeme).toList() : const [];
List<String> _declNamesOf(String text) { try { return parseString(content: text, throwIfDiagnostics: false).unit.declarations.expand(_declNames).toList(); } catch (_) { return const []; } }

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
    path = _norm(path);
    final nsrc = File(path).readAsStringSync();
    final nunit = parseString(content: nsrc, throwIfDiagnostics: false).unit;
    var pure = true;
    for (final nd in nunit.directives) {
      if (nd is ImportDirective) {
        final u = nd.uri.stringValue ?? '';
        if (!_pureDartLibs.contains(u)) { pure = false; break; }
      } else if (nd is ExportDirective || nd is PartDirective) { pure = false; break; }
    }
    // G68 · קובץ לא-טהור (מייבא flutter) עדיין יכול להצהיר `const double kVatRate = 0.17` — הקבוע טהור גם אם קובצו לא.
    //   לכן: טיפוסים נרשמים רק מקובץ טהור (כמו קודם), אבל קבועי-`const` נרשמים מכל קובץ-שכן (ליטרל שמפנה לטיפוס ⇒ הבדיקה לא תתקמפל ⇒ נפילה בטוחה).
    if (!pure) {
      final cvars = <String, Declaration>{};
      for (final nd in nunit.declarations) if (nd is TopLevelVariableDeclaration && nd.variables.isConst) for (final v in nd.variables.variables) cvars[v.name.lexeme] = nd;
      // G70 · גם פונקציות-top-level מקובץ לא-טהור — הטוהר של כל אחת נבדק ב-_collectPure (סגירה בתוך קובצה בלבד), כמו קבועי-G68
      for (final nd in nunit.declarations) if (nd is FunctionDeclaration && !nd.isGetter && !nd.isSetter) cvars[nd.name.lexeme] = nd;
      if (cvars.isNotEmpty) { final cf = _ImpFile(nsrc, const {}, cvars, path); for (final k in cvars.keys) out.putIfAbsent('var:$k', () => cf); }
      continue;
    }
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
    final f = _ImpFile(nsrc, types, vars, path);
    for (final k in types.keys) out.putIfAbsent(k, () => f);
    // G68 · קבוע-שכן חוצה-קבצים (`kBspInchToMm` מקובץ-דאטה) — נגיש גם בשם-המשתנה, לשקע-ערך (חוק-3). 69 פונקציות נפלו על מזהה-אחד כזה.
    for (final k in vars.keys) out.putIfAbsent('var:$k', () => f);
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
  // מצב-אצווה: VM אחד, פרסור-רב. --batch jobs.json ⇒ [{file,name,line}] → [{result}]
  if (args.isNotEmpty && args[0] == '--batch') {
    final jobs = (jsonDecode(File(args[1]).readAsStringSync()) as List);
    final out = [];
    for (final j in jobs) {
      // G64 · _srcRef נפלט מהחצב עצמו (היה: הוסף ע"י מריץ-חיצוני ⇒ אצווה בלי-מריץ איבדה את המקור ⇒ ייעוד-מהמסך 0)
      try { final r = Map<String, dynamic>.from(j['kind'] == 'var' ? carveVar(j['file'], j['name']) : carve(j['file'], j['name'], j['line'] is int ? j['line'] : int.tryParse('${j['line']}'))); r['_srcRef'] = '${j['file'].toString().replaceFirst(RegExp(r'^/home/user/'), '')}:${j['line']}'; out.add(r); }
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
// G67 · ליטרלי-ההכרעה של הגוף (מחרוזות/מספרים) — הדוגמאות הכי-טובות לזהב: פונקציה שמחזירה '' על כל דוגמה-גנרית
//   נראית חלולה; עם `'cart'` מתוך `key == 'cart'` הזהב מבחין. נאספים מהגוף עצמו, אפס-ניחוש.
class _BodyLits extends RecursiveAstVisitor<void> {
  final strs = <String>{}; final ints = <String>{}; final dbls = <String>{};
  @override void visitSimpleStringLiteral(SimpleStringLiteral n) { final v = n.value; if (v.isNotEmpty && v.length <= 40 && !v.contains('\n')) strs.add(v); super.visitSimpleStringLiteral(n); }
  @override void visitIntegerLiteral(IntegerLiteral n) { ints.add(n.literal.lexeme); super.visitIntegerLiteral(n); }
  @override void visitDoubleLiteral(DoubleLiteral n) { dbls.add(n.literal.lexeme); super.visitDoubleLiteral(n); }
}
Map<String, List<String>> _bodyLits(AstNode body) {
  final v = _BodyLits(); body.visitChildren(v);
  String q(String s) => "'" + s.replaceAll(r'\', r'\\').replaceAll("'", r"\'").replaceAll(r'$', r'\$') + "'";
  final out = <String, List<String>>{};
  if (v.strs.isNotEmpty) out['String'] = v.strs.take(8).map(q).toList();
  if (v.ints.isNotEmpty) { out['int'] = v.ints.take(8).toList(); out['num'] = out['int']!; }
  if (v.dbls.isNotEmpty) { out['double'] = v.dbls.take(8).toList(); out['num'] = [...(out['num'] ?? []), ...out['double']!]; }
  return out;
}
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

// G69 · `known`: דוגמאות שכבר נבנו לטיפוסים אחרים (enum ⇒ `X.values.first`) — מחלקה שבנאי-שלה מקבל טיפוס-פרויקט (`ConnectorEnd(EndType, String)`) נבנית בסבב-שני
List<String> _samplesFor(String name, String declSrc, [Map<String, String> known = const {}]) {
  final u = parseString(content: declSrc, throwIfDiagnostics: false).unit;
  if (u.declarations.isEmpty) return const [];
  final d = u.declarations.first;
  // G69 · ערך-enum כ**שם-קבוע** (`EndType.hdpeCompression`), לא `.values.first` — האחרון אינו ביטוי-קבוע ו-`const ConnectorEnd(EndType.values.first, 'a')` לא התקמפל (6 unparsed)
  if (d is EnumDeclaration) { final cs = d.constants.map((c) => '$name.${c.name.lexeme}').toList(); return cs.isEmpty ? const [] : [cs.first, cs.last]; }
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
      final lit = _litFor(ty) ?? known[ty.replaceAll('?', '')];
      if (lit == null) return const [];            // אין ערך-אמת ⇒ אין דוגמה
      args.add(prm.isRequiredNamed ? '${inner.name!.lexeme}: $lit' : lit);
    }
    final kw = m.constKeyword != null ? 'const ' : '';
    return ['$kw$name(${args.join(', ')})'];
  }
  return const [];
}

// G69 · חציבת **טבלה-מוקלדת** (משתנה-top-level `final`/`const` עם ליטרל-אוסף): הסגירה הטרנזיטיבית של ההצהרה — טיפוסים · עוזרים · קבועים —
//   דרך אותו `_typeClosure` שמטביע טיפוסי-שכן. יוצא אטום-דאטה אחד שהפונקציות **מייבאות** (לא 37 עותקים מוטבעים). כל ספק ⇒ פסילה עם `why`.
Map<String, dynamic> carveVar(String file, String varName) {
  file = _norm(file);
  final src = File(file).readAsStringSync();
  final unit = parseString(content: src, throwIfDiagnostics: false).unit;
  final topTypes = <String, Declaration>{}; final topVarDecls = <String, Declaration>{};
  TopLevelVariableDeclaration? target;
  for (final d in unit.declarations) {
    if (d is FunctionDeclaration && !d.isGetter && !d.isSetter) topVarDecls[d.name.lexeme] = d;
    else if (d is TopLevelVariableDeclaration) { if (d.variables.isConst || d.variables.isFinal) for (final v in d.variables.variables) { topVarDecls[v.name.lexeme] = d; if (v.name.lexeme == varName) target = d; } }
    else if (d is EnumDeclaration || d is ClassDeclaration || d is MixinDeclaration || d is TypeAlias) topTypes[(d as NamedCompilationUnitMember).name.lexeme] = d;
  }
  if (target == null) return {'ok': false, 'reason': 'var not found: $varName', 'name': varName};
  final v = target!.variables.variables.firstWhere((x) => x.name.lexeme == varName);
  final init = v.initializer;
  if (init == null || !(init is ListLiteral || init is SetOrMapLiteral)) return {'ok': false, 'reason': 'not a collection literal', 'name': varName};
  final impIdx = _neighborTypes(file, unit);
  final selfFile = _ImpFile(src, topTypes, topVarDecls, file);
  final why = <String>[];
  final cl = _typeClosure(varName, selfFile, why, impIdx);
  if (cl == null) return {'ok': false, 'reason': 'closure: ' + why.join(' · '), 'name': varName};
  final declSrc = src.substring(target!.offset, target!.end);
  final deps = cl.where((x) => x != declSrc).toList();
  final typeNames = <String>[]; for (final t in deps) { final m = RegExp(r'(?:class|enum|mixin|typedef)\s+([A-Za-z_][A-Za-z0-9_]*)').firstMatch(t); if (m != null) typeNames.add(m.group(1)!); }
  final typeText = target!.variables.type?.toSource() ?? 'dynamic';
  // G69 · מוצא לכל הצהרה בסגירה — בהכלת-בייטים (הקובץ שהטקסט נלקח ממנו), לא בניחוש: הכותרת של הטבלה נושאת `// ייצוא: שם ← מוצא`
  final depOrigins = <String, String>{};
  for (final t in [declSrc, ...deps]) {
    final origin = src.contains(t) ? file : impIdx.values.where((f) => f.path.isNotEmpty && f.src.contains(t)).map((f) => f.path).firstOrNull;
    if (origin == null) return {'ok': false, 'reason': 'מוצא לא-נמצא להצהרה: ' + t.substring(0, t.length < 60 ? t.length : 60).replaceAll('\n', ' '), 'name': varName};
    for (final n in _declNamesOf(t)) depOrigins[n] = origin;
  }
  return {
    'ok': true, 'isData': true, 'name': varName, 'origName': varName, 'type': typeText, 'kind': target!.variables.isConst ? 'const' : 'final',
    'decl': declSrc, 'deps': deps, 'exports': [varName, ...typeNames], 'depOrigins': depOrigins,
    'hebrew': RegExp(r'[\u0590-\u05FF]').hasMatch(cl.join('\n')),
  };
}

Map<String, dynamic> carve(String file, String fnName, int? startLine) {
  file = _norm(file);
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
  final selfFile = _ImpFile(src, topTypes, topVarDecls, file); // הקובץ הנוכחי — נבדק באותו חוק

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
  // G68 · קבוע-`const` מקובץ-שכן ⇒ שקע-ערך (רק const: ליטרל טהור; `final` מחושב/מוטטי = מצב-מודול, נשאר לא-פתור בכנות)
  final crossVars = <String, (String, VariableDeclaration)>{};   // שם ⇒ (מקור-הקובץ, ההצהרה)
  // G69 · טבלת-מדף: מזהה/טיפוס שמוצאו (קובץ+שם) כבר נחת כאטום-דאטה ⇒ ייבוא — לא שקע, לא הטבעה, לא «לא-פתור». זהות לפי מוצא, אפס-ניחוש.
  final shelf = _shelf();
  final shelfImports = <String>{}; final shelfVals = <String>[]; final shelfTypes = <String>[]; final shelfSrc = <String, String>{}; final shelfKeys = <String>[];
  _ShelfEntry? shelfOf(String name, String? declPath) => declPath == null ? null : shelf['$declPath|$name'];
  final shelfFns = <String>[];
  final shelfByImp = <String, Set<String>>{};   // G71 · ייבוא ⇒ השמות שנפתרו דרכו (הרתמה/הזהב מייבאים רק ייבוא ששם-שלו מוזכר בקוד — לא את כולם)
  final crossFns = <String, _ImpFile>{};   // G70 · פונקציה-שכנה חוצת-קבצים ⇒ שקע (הטוהר נבדק ב-_collectPure על קובץ-השכן)
  final used = <String>{...free.ids, ...free.typeNames};
  // ייבוא-מדף שמצהיר שם שכבר מגיע מייבוא-מדף אחר **ומשמש** את הפונקציה ⇒ ambiguous_import ⇒ לא מייבאים (נופל לשקע/לא-פתור, בכנות)
  bool importable(String imp) { final names = _shelfDecls[imp]?.keys ?? const <String>[]; for (final other in shelfImports) { if (other == imp) continue; final on = _shelfDecls[other]?.keys ?? const <String>[]; for (final n in names) if (on.contains(n) && used.contains(n)) return false; } return true; }
  for (final id in free.ids) {
    if (!topFns.containsKey(id)) {
      final se = shelfOf(id, topVars.containsKey(id) ? file : impIdx['var:$id']?.path);
      final nf = impIdx['var:$id']; final nd = nf?.vars[id];
      // G70 · אטום-מדף מיובא רק אם **חתימתו ≡ חתימת-המקור** (פרמטרים+החזרה, בבייטים): `normName` במדף קיבל `{required normSearch}` ו-`canConnect` נחצב-ביד על
      //   `ConnPart` — אותו שם, אותו מוצא, חתימה אחרת ⇒ הקריאה במקור לא מתקמפלת. חתימה שונה ⇒ לא ייבוא; נופל לשקע-חוצה-קבצים (המקור verbatim).
      if (se != null && se.isFn && !(nd is FunctionDeclaration && _sameSignature(se.src, nd))) { /* לא-מיובא */ }
      else if (se != null && importable(se.imp)) { shelfImports.add(se.imp); (shelfByImp[se.imp] ??= {}).add(id); (se.isFn ? shelfFns : shelfVals).add(id); shelfKeys.addAll(se.keys.where((k) => !shelfKeys.contains(k))); continue; }
      if (!topVars.containsKey(id) && nf != null && nd is FunctionDeclaration && !nd.isGetter && !nd.isSetter) { crossFns[id] = nf; sockets.add(id); continue; }
    }
    if (!topFns.containsKey(id) && !topVars.containsKey(id)) {
      final f = impIdx['var:$id'];
      final d = f?.vars[id];
      if (f != null && d is TopLevelVariableDeclaration && d.variables.isConst) {
        for (final v in d.variables.variables) { if (v.name.lexeme == id) crossVars[id] = (f.src, v); }
      }
    }
    if (topFns.containsKey(id) || topVars.containsKey(id) || crossVars.containsKey(id)) sockets.add(id);
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
      if (shelfOf(t, topTypes.containsKey(t) ? file : impIdx[t]?.path) != null) continue;   // G69 · מיובא מטבלת-מדף — לא נמחק
      if (_core.contains(t) || topTypes.containsKey(t) || _mathCore.contains(t)) continue;
      if (impIdx.containsKey(t) && _neighborClosure(t, impIdx) != null) continue;  // יוטבע — לא שקע
      if (tn_hasArgs(params, t)) continue;          // טיפוס-גנרי בעצמו — לא ב-v1
      final mu = _MemberUse(e.value, t);
      body.visitChildren(mu);
      if (!mu.used) erasable.add(t);                // אפס-קריאת-חבר ⇒ ניתן-למחיקה
    }
  }

  for (final t in free.typeNames) {
    { final se = shelfOf(t, topTypes.containsKey(t) ? file : impIdx[t]?.path); if (se != null && importable(se.imp)) { shelfImports.add(se.imp); (shelfByImp[se.imp] ??= {}).add(t); shelfTypes.add(t); shelfSrc[t] = se.src; continue; } }   // G69
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
  // G69 · הצהרה שהסגירה משכה ושכבר מיוצאת מטבלת-מדף **מיובאת** ⇒ לא מועתקת (עותק+ייבוא = `already defined`).
  //   שם-זהה עם מקור-שונה-בבייטים ⇒ «לא-פתור» בכנות (לא בוחרים, לא מנחשים).
  if (shelfImports.isNotEmpty) {
    final exported = <String, String>{};
    for (final imp in shelfImports) for (final e in (_shelfDecls[imp] ?? const <String, String>{}).entries) exported[e.key] = e.value;
    copiedTypes.removeWhere((c) { for (final n in _declNamesOf(c)) { final s = exported[n]; if (s != null) { if (s.trim() != c.trim()) unresolved.add('type:$n ←שם-כפול-מול-טבלת-מדף'); return true; } } return false; });
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
        final cf = crossFns[sName];
        if (d == null && cf != null) {
          // G70 · שקע-פונקציה חוצה-קבצים: הטיפוס מהחתימה, הגוף+עוזריו verbatim מקובץ-השכן (סגירה טהורה בתוך קובצו בלבד — _collectPure)
          final nd = cf.vars[sName] as FunctionDeclaration;
          final t = _fnType(nd); if (t == null) { ok = false; break; }
          final nTop = <String, FunctionDeclaration>{ for (final e in cf.vars.entries) if (e.value is FunctionDeclaration) e.key: e.value as FunctionDeclaration };
          final tmp = <String, String>{};
          if (!_collectPure(cf.src, nTop, sName, tmp, mathHit)) { ok = false; break; }
          var clash = false; for (final e in tmp.entries) { final prev = emitted[e.key]; if (prev != null && prev != e.value) { clash = true; break; } }   // שני עוזרים באותו שם מקבצים שונים ⇒ פסילה
          if (clash) { ok = false; break; }
          emitted.addAll(tmp);
          socketMeta.add({'name': _pub(sName)!, 'init': _helper(sName)});
          socketTypes.add(t);
          continue;
        }
        if (d == null) {
          // שקע-**ערך**: קבוע-שכן (`kDeliveredStage`) ⇒ פרמטר מוקלד, כמו
          // `{required int kIndexMinWordLen}` שבמדף. השם נשמר, כולל תחילית-k.
          final cv = crossVars[sName];
          final v = topVars[sName] ?? cv?.$2;
          final vsrc = topVars[sName] != null ? src : (cv?.$1 ?? src);   // G68 · המקור של הקובץ שבו הקבוע מוצהר
          if (v == null) { ok = false; break; }
          final vt = _varType(vsrc, v);
          if (vt == null) { ok = false; break; }           // ערך לא-טהור / בלי טיפוס נגזר
          socketMeta.add({'name': _pub(sName)!, 'init': _helper(sName)});
          socketTypes.add(vt);
          emitted[sName] = 'final ${_helper(sName)} = ' + vsrc.substring(v.initializer!.offset, v.initializer!.end) + ';';
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
    'typeSamples': _twoPass({ for (final t in seenType) t: copiedTypes.firstWhere((c) => RegExp('(?:class|enum|mixin|typedef)\\s+' + t + r'\b').hasMatch(c), orElse: () => '') }),
    // G69 · שמות-ערכי-enum (מוטבע/מטבלה) כדוגמאות-String: `EndType.values.firstWhere((e) => e.name == n)` — הדוגמאות הגנריות מחטיאות תמיד; השמות = ערך-אמת מההצהרה
    'enumNames': [for (final src in [...copiedTypes, ...shelfSrc.values]) ...?_enumNames(src)],
    'typeShow': { for (final e in { for (final t in seenType) t: copiedTypes.firstWhere((c) => RegExp('(?:class|enum|mixin|typedef)\\s+' + t + r'\b').hasMatch(c), orElse: () => ''), ...shelfSrc }.entries) if (_showFor(e.key, e.value) != null) e.key: _showFor(e.key, e.value)! },
    // G69 · דוגמאות לטיפוס מיובא-מטבלה — מהמקור שבטבלה (החצב ראה אותו), לא מהאטום
    'shelfSamples': _twoPass(shelfSrc),
    'shelfImports': shelfImports.toList(), 'shelfVals': shelfVals, 'shelfTypes': shelfTypes, 'shelfKeys': shelfKeys, 'shelfFns': shelfFns,
    'shelfByImp': { for (final e in shelfByImp.entries) e.key: e.value.toList() },
    'shelfKeyFields': () { if (shelfVals.isEmpty || params == null) return const <String, List<String>>{}; final pt = <String, String>{}; for (final p in params.parameters) { final nm = p.name?.lexeme; if (p is SimpleFormalParameter && nm != null && p.type != null) pt[nm] = p.type!.toSource().replaceAll('?', ''); } final kf = _KeyFieldUse(shelfVals.toSet(), pt); body.visitChildren(kf); return { for (final e in kf.out.entries) e.key: e.value.toList() }; }(),
    'bodyLits': _bodyLits(body),
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

// G69 · דוגמאות בשני סבבים: קודם טיפוסים שנבנים מליבה/enum, אחר-כך מחלקות שבנאיהן מקבלים את הראשונים (ConnectorEnd(EndType, String))
Map<String, List<String>> _twoPass(Map<String, String> srcOf) {
  final out = <String, List<String>>{};
  for (var pass = 0; pass < 2; pass++) {
    final known = { for (final e in out.entries) e.key: e.value.first };
    for (final e in srcOf.entries) { if (out.containsKey(e.key) || e.value.isEmpty) continue; final s = _samplesFor(e.key, e.value, known); if (s.isNotEmpty) out[e.key] = s; }
  }
  return out;
}
// G69 · «זהב-מבני»: מחלקה בלי toString ⇒ `Instance of 'X'` לכל תוצאה ⇒ הזהב עיוור (6 חלולים: ConnectorEnd). החצב פולט מציג-שדות מההצהרה
//   (`x.type` · `x.size` — כל שדה-מופע ציבורי, verbatim), והרתמה/הזהב משווים אותו במקום toString. אפס-ניחוש: אין שדות ⇒ אין מציג.
String? _showFor(String name, String declSrc) {
  try {
    final d = parseString(content: declSrc, throwIfDiagnostics: false).unit.declarations.firstOrNull;
    if (d is! ClassDeclaration) return null;
    final fs = <String>[];
    for (final m in d.members) { if (m is FieldDeclaration && !m.isStatic) for (final v in m.fields.variables) { if (!v.name.lexeme.startsWith('_')) fs.add(v.name.lexeme); } }
    if (fs.isEmpty) return null;
    return "'$name(' + " + fs.map((f) => "'$f=' + x.$f.toString()").join(" + ', ' + ") + " + ')'";
  } catch (_) { return null; }
}
bool _sameSignature(String atomFnSrc, FunctionDeclaration origin) {
  try {
    final d = parseString(content: atomFnSrc, throwIfDiagnostics: false).unit.declarations.firstOrNull;
    if (d is! FunctionDeclaration) return false;
    String norm(String? x) => (x ?? '').replaceAll(RegExp(r'\s+'), ' ').trim();
    return norm(d.functionExpression.parameters?.toSource()) == norm(origin.functionExpression.parameters?.toSource()) && norm(d.returnType?.toSource()) == norm(origin.returnType?.toSource());
  } catch (_) { return false; }
}
List<String>? _enumNames(String src) { try { final d = parseString(content: src, throwIfDiagnostics: false).unit.declarations.firstOrNull; return d is EnumDeclaration ? d.constants.map((c) => c.name.lexeme).toList() : null; } catch (_) { return null; } }

// G69 · שדה-מפתח: `kTable[p.sku]` / `kTable.containsKey(p.sku)` ⇒ השדה `sku` של הטיפוס של p הוא מפתח-הטבלה — הדוגמה-הבנויה לטיפוס מקבלת מפתח-אמת
class _KeyFieldUse extends RecursiveAstVisitor<void> {
  final Set<String> tables; final Map<String, String> paramType; final Map<String, Set<String>> out = {};
  _KeyFieldUse(this.tables, this.paramType);
  void _hit(Expression? tgt, Expression? idx) { if (tgt is SimpleIdentifier && tables.contains(tgt.name) && idx is PrefixedIdentifier) { final pt = paramType[idx.prefix.name]; if (pt != null) (out[pt] ??= <String>{}).add(idx.identifier.name); } }
  @override void visitIndexExpression(IndexExpression n) { _hit(n.target, n.index); super.visitIndexExpression(n); }
  @override void visitMethodInvocation(MethodInvocation n) { if (n.methodName.name == 'containsKey' && n.argumentList.arguments.isNotEmpty) _hit(n.target, n.argumentList.arguments.first); super.visitMethodInvocation(n); }
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
