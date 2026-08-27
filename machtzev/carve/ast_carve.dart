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
  'String','int','double','num','bool','List','Map','Set','Iterable','Object','dynamic','void','Function','DateTime','Duration','RegExp','StringBuffer','Comparable','Pattern','Symbol','Type','Null','Never','Enum',
  'true','false','null','this','super','print','identical','assert',
  'min','max','abs','sqrt','pow','pi','e',
};

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
    if (p is MethodInvocation && identical(p.methodName, node) && p.target != null) return;
    if (p is NamedExpression && identical(p.name.label, node)) return;
    if (bound.contains(n) || _core.contains(n)) return;
    // טיפוס (מתחיל באות-גדולה) — מועמד-הטבעה; אחרת — מזהה-ערך
    if (RegExp(r'^[A-Z]').hasMatch(n)) typeNames.add(n); else ids.add(n);
  }
  @override
  void visitTypeParameter(TypeParameter node){ bound.add(node.name.lexeme); super.visitTypeParameter(node); }
}

String? _pub(String name) => name.startsWith('_') ? name.substring(1) : name;

void main(List<String> args) {
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

Map<String, dynamic> carve(String file, String fnName, int? startLine) {
  final src = File(file).readAsStringSync();
  final unit = parseString(content: src, throwIfDiagnostics: false).unit;
  final lineInfo = parseString(content: src, throwIfDiagnostics: false).lineInfo;

  // אינדקס הצהרות-top-level בקובץ
  final topFns = <String, FunctionDeclaration>{};
  final topVars = <String>{};
  final topTypes = <String, Declaration>{}; // enum/class/typedef → הצהרתן
  for (final d in unit.declarations) {
    if (d is FunctionDeclaration && !d.isGetter && !d.isSetter) topFns[d.name.lexeme] = d;
    else if (d is TopLevelVariableDeclaration) { for (final v in d.variables.variables) topVars.add(v.name.lexeme); }
    else if (d is EnumDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is ClassDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is MixinDeclaration) topTypes[d.name.lexeme] = d;
    else if (d is TypeAlias) topTypes[d.name.lexeme] = d;
  }

  // אתר את הפונקציה (top-level או מתודה) לפי שם + שורה
  FunctionDeclaration? fn;
  MethodDeclaration? method;
  final target = fnName.startsWith('_') ? fnName : fnName;
  void scan(AstNode n) {
    n.visitChildren(_FindDecl((d) {
      if (d is FunctionDeclaration && d.name.lexeme == target) {
        final ln = lineInfo.getLocation(d.offset).lineNumber;
        if (startLine == null || (ln - startLine).abs() <= 2) fn = d;
      } else if (d is MethodDeclaration && d.name.lexeme == target) {
        final ln = lineInfo.getLocation(d.offset).lineNumber;
        if (startLine == null || (ln - startLine).abs() <= 2) method = d;
      }
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
  for (final id in free.ids) {
    if (topFns.containsKey(id) || topVars.contains(id)) sockets.add(id);
    else unresolved.add(id); // ערך-חופשי לא-מזוהה (אולי import) — חשוד
  }
  for (final t in free.typeNames) {
    if (topTypes.containsKey(t)) inlineTypes.add(t);
    // טיפוס לא-מקומי שאינו core ⇒ יתכן import (unresolved-type)
    else if (!_core.contains(t)) unresolved.add('type:$t');
  }

  // הטבעת טיפוסים verbatim + הפונקציה (פרטי→ציבורי)
  final buf = StringBuffer();
  final copiedTypes = <String>[];
  for (final t in inlineTypes) {
    final d = topTypes[t]!;
    copiedTypes.add(src.substring(d.offset, d.end));
  }
  // גוף-הפונקציה verbatim (כולל חתימה); שנה שם פרטי→ציבורי בכותרת בלבד
  var fnSrc = src.substring(declNode.offset, declNode.end);
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
    'copiedTypes': copiedTypes,
    'fnSource': fnSrc,
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
