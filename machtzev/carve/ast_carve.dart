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
    if (p is MethodInvocation && identical(p.methodName, node) && p.target != null) return;
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
  final topTypes = <String, Declaration>{}; // enum/class/typedef → הצהרתן
  for (final d in unit.declarations) {
    if (d is FunctionDeclaration && !d.isGetter && !d.isSetter) topFns[d.name.lexeme] = d;
    else if (d is TopLevelVariableDeclaration) { for (final v in d.variables.variables) topVars[v.name.lexeme] = v; }
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
      if (tn_hasArgs(params, t)) continue;          // טיפוס-גנרי בעצמו — לא ב-v1
      final mu = _MemberUse(e.value, t);
      body.visitChildren(mu);
      if (!mu.used) erasable.add(t);                // אפס-קריאת-חבר ⇒ ניתן-למחיקה
    }
  }

  for (final t in free.typeNames) {
    if (topTypes.containsKey(t)) inlineTypes.add(t);
    else if (_mathCore.contains(t)) usesMath = true;
    else if (erasable.contains(t)) continue;   // יהפוך לגנרי — אינו תלות
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
