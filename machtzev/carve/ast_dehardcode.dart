// 🎯 מכונת-AST · דה-הרדקוד מדויק — מנתח-תחביר Dart אמיתי (package:analyzer).
// מחליף כל מחרוזת-עברית בגוף-מנוע ב-term('<מטרה>'), אוסף {מטרה→שם} כ-JSON,
// מוסיף שקע term. מדלג על: ליטרל שכבר ארג׳-3 של termOf (מוכתב-מטרה), ליטרל
// בתוך const עליון (טבלת-דאטה, טיפול-נפרד). מדפיס JSON: {ok, source, terms, fn}.
import 'dart:convert';
import 'dart:io';
import 'package:analyzer/dart/analysis/utilities.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';

final _heb = RegExp(r'[֐-׿]');

// תעתיק-על לגזירת-מפתח קריא
const _t = {'א':'a','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t','י':'y','כ':'k','ך':'k','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'a','פ':'p','ף':'f','צ':'ts','ץ':'ts','ק':'k','ר':'r','ש':'sh','ת':'t',' ':'-'};
String? _slug(String s){var o='';for(final c in s.split('')){o+=_t[c]??'';}o=o.replaceAll(RegExp('-+'),'-').replaceAll(RegExp(r'^-|-$'),'');return o.isEmpty?null:o;}

class _Hit { final int offset,end; final String value; _Hit(this.offset,this.end,this.value); }

// סורק: האם קיימת תווית-case שהיא מחרוזת-עברית (case-label = חייב-קבוע ⇒ term() ישבור).
// עברית בגוף-ה-case (return) מותרת-לטיהור ולכן איננה נפסלת.
class _SwitchHebScan extends RecursiveAstVisitor<void> {
  bool found = false;
  @override
  void visitSwitchPatternCase(SwitchPatternCase node){
    if(_heb.hasMatch(node.guardedPattern.pattern.toSource())) found = true;
    super.visitSwitchPatternCase(node);
  }
  @override
  void visitSwitchCase(SwitchCase node){
    if(_heb.hasMatch(node.expression.toSource())) found = true;
    super.visitSwitchCase(node);
  }
}

// סורק: האם הפונקציה קוראת (לא-מוסמך) לאחת מהשמות שב-needs
class _CallScan extends RecursiveAstVisitor<void> {
  final Set<String> needs; bool calls = false;
  _CallScan(this.needs);
  @override
  void visitMethodInvocation(MethodInvocation node){
    if(node.target==null && needs.contains(node.methodName.name)) calls = true;
    super.visitMethodInvocation(node);
  }
}
// אוסף: אתרי-קריאה (לא-מוסמכים) לפונקציות שב-needs — להשחלת term: term
class _CallSites extends RecursiveAstVisitor<void> {
  final Set<String> needs; final List<(ArgumentList,)> sites = [];
  _CallSites(this.needs);
  @override
  void visitMethodInvocation(MethodInvocation node){
    if(node.target==null && needs.contains(node.methodName.name)) sites.add((node.argumentList,));
    super.visitMethodInvocation(node);
  }
}

class _Collector extends RecursiveAstVisitor<void> {
  final List<_Hit> hits = [];
  @override
  void visitSimpleStringLiteral(SimpleStringLiteral node){
    final v = node.value;
    if(!_heb.hasMatch(v)) return;
    // דלג: ארג׳-3 (index 2) של קריאת termOf — כבר מוכתב-מטרה
    final p = node.parent;
    if(p is ArgumentList){
      final gp = p.parent;
      String? name;
      if(gp is MethodInvocation) name = gp.methodName.name;
      if(gp is FunctionExpressionInvocation){ final f=gp.function; if(f is SimpleIdentifier) name=f.name; }
      if(name=='termOf' && p.arguments.length>=3 && identical(p.arguments[2], node)) return;
    }
    // דלג: בתוך הצהרת const עליונה (טבלת-דאטה)
    for(AstNode? a=node; a!=null; a=a.parent){
      if(a is TopLevelVariableDeclaration && a.variables.isConst) return;
      if(a is FunctionDeclaration) break;
    }
    hits.add(_Hit(node.offset, node.end, v));
  }
}

void main(List<String> args){
  final file = args[0];
  final src = File(file).readAsStringSync();
  final unit = parseString(content: src, throwIfDiagnostics: false).unit;

  // כל פונקציות-הראש (לא getter/setter, עם רשימת-פרמטרים)
  final funcs = <FunctionDeclaration>[];
  for(final d in unit.declarations){
    if(d is FunctionDeclaration && !d.isGetter && !d.isSetter && d.functionExpression.parameters!=null) funcs.add(d);
  }
  // פגיעות-עברית פר-פונקציה
  final hitsByFn = <FunctionDeclaration, List<_Hit>>{};
  for(final f in funcs){ final c=_Collector(); f.functionExpression.body.visitChildren(c); if(c.hits.isNotEmpty) hitsByFn[f]=c.hits; }
  if(hitsByFn.isEmpty){ print(jsonEncode({'ok':false,'reason':'no function with raw hebrew in body'})); return; }
  // פסילה: תווית-case עברית באיזושהי פונקציה (case-label חייב-קבוע — טעון switch→if, יד)
  for(final f in funcs){ final sc=_SwitchHebScan(); f.functionExpression.body.visitChildren(sc); if(sc.found){ print(jsonEncode({'ok':false,'reason':'hebrew in switch-case (needs switch to if, hand)'})); return; } }

  final byName = <String, FunctionDeclaration>{ for(final f in funcs) f.name.lexeme: f };
  // סגור-קריאות טרנזיטיבי: פונקציה שקוראת לפונקציה-נזקקת → נזקקת בעצמה
  final needs = <String>{ for(final f in hitsByFn.keys) f.name.lexeme };
  bool grew=true;
  while(grew){ grew=false;
    for(final f in funcs){ if(needs.contains(f.name.lexeme)) continue;
      final cc=_CallScan(needs); f.functionExpression.body.visitChildren(cc);
      if(cc.calls){ needs.add(f.name.lexeme); grew=true; }
    }
  }

  // מפתחות-מטרה ייחודיים (מכל הפונקציות-הנזקקות)
  final terms = <String,String>{}; final keyOf = <String,String>{}; final used=<String>{}; var i=0;
  for(final f in hitsByFn.keys){ for(final h in hitsByFn[f]!){ if(keyOf.containsKey(h.value)) continue; var k=_slug(h.value); if(k==null||used.contains(k)) k='t${i}'; used.add(k); keyOf[h.value]=k; terms[k]=h.value; i++; } }

  // איסוף כל-העריכות (offset יורד): (1) ליטרל-עברי→term (2) הזרקת-פרמטר (3) השחלת-קריאה-פנימית
  final edits = <List>[]; // [offset, end, text]
  const decl = 'required String Function(String) term';
  for(final f in hitsByFn.keys){ for(final h in hitsByFn[f]!) edits.add([h.offset, h.end, "term('${keyOf[h.value]}')"]); }
  for(final name in needs){
    final f = byName[name]!; final pl = f.functionExpression.parameters!;
    final named = pl.parameters.where((p)=>p.isNamed).toList();
    if(named.isNotEmpty){ final braceOff = src.lastIndexOf('{', named.first.offset); edits.add([braceOff+1, braceOff+1, decl+', ']); }
    else { final close = pl.rightParenthesis.offset; var p=close-1; while(p>0 && src[p].trim().isEmpty) p--; final tc=src[p]==','; final sep = pl.parameters.isEmpty ? '' : (tc ? ' ' : ', '); edits.add([close, close, sep+'{$decl}']); }
    // השחלת-קריאות בגוף f לכל פונקציה-נזקקת
    final ci=_CallSites(needs); f.functionExpression.body.visitChildren(ci);
    for(final site in ci.sites){ final al=site.$1; final hasArgs=al.arguments.isNotEmpty; final rp=al.rightParenthesis.offset; var q=rp-1; while(q>al.offset && src[q].trim().isEmpty) q--; final tc=src[q]==','; final sep = !hasArgs ? '' : (tc ? ' ' : ', '); edits.add([rp, rp, '${sep}term: term']); }
  }
  edits.sort((a,b)=> (b[0] as int) - (a[0] as int));
  var out = src;
  for(final e in edits){ out = out.substring(0, e[0] as int) + (e[2] as String) + out.substring(e[1] as int); }

  // פונקציות-כניסה = נזקקות-ציבוריות (החיווט-החיצוני יזין להן term)
  final entries = needs.where((n)=>!n.startsWith('_')).toList();
  stdout.write(jsonEncode({'ok':true,'source':out,'terms':terms,'fn':entries.isNotEmpty?entries.first:needs.first,'fns':entries.isNotEmpty?entries:needs.toList(),'count':terms.length}));
}
