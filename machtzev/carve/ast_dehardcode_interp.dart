// 🎯 מכונת-AST · דה-הרדקוד לאינטרפולציה — מרחיב את הקרוב-הבסיסי לקטעי-מחרוזת-מוטבעים.
// מחליף כל קטע-עברי בתוך StringInterpolation ב-${term('<מטרה>')} + מחליף גם ליטרל-פשוט
// (כמו הבסיסי). מדלג: const עליון · ארג׳-3 של termOf · פונקציה שכבר-נושאת פרמטר term.
// מדפיס JSON: {ok, source, terms, fn, count, hadTerm}. hadTerm=true ⇒ אין לחווט-מחדש בדיקה/צרכן.
import 'dart:convert';
import 'dart:io';
import 'package:analyzer/dart/analysis/utilities.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';

final _heb = RegExp(r'[֐-׿]');

const _t = {'א':'a','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t','י':'y','כ':'k','ך':'k','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'a','פ':'p','ף':'f','צ':'ts','ץ':'ts','ק':'k','ר':'r','ש':'sh','ת':'t',' ':'-'};
String? _slug(String s){var o='';for(final c in s.split('')){o+=_t[c]??'';}o=o.replaceAll(RegExp('-+'),'-').replaceAll(RegExp(r'^-|-$'),'');return o.isEmpty?null:o;}

class _Hit { final int offset,end; final String value; final bool interp; _Hit(this.offset,this.end,this.value,{this.interp=false}); }

bool _inTopConst(AstNode node){
  for(AstNode? a=node; a!=null; a=a.parent){
    if(a is TopLevelVariableDeclaration && a.variables.isConst) return true;
    if(a is FunctionDeclaration) break;
  }
  return false;
}

class _Collector extends RecursiveAstVisitor<void> {
  final List<_Hit> hits = [];
  final String src;
  _Collector(this.src);

  @override
  void visitSimpleStringLiteral(SimpleStringLiteral node){
    final v = node.value;
    if(!_heb.hasMatch(v)) return;
    final p = node.parent;
    if(p is ArgumentList){
      final gp = p.parent;
      String? name;
      if(gp is MethodInvocation) name = gp.methodName.name;
      if(gp is FunctionExpressionInvocation){ final f=gp.function; if(f is SimpleIdentifier) name=f.name; }
      if(name=='termOf' && p.arguments.length>=3 && identical(p.arguments[2], node)) return;
    }
    if(_inTopConst(node)) return;
    hits.add(_Hit(node.offset, node.end, v));
  }

  @override
  void visitStringInterpolation(StringInterpolation node){
    if(!_inTopConst(node)){
      // חשב אורך-תוחם פתיחה/סגירה (', ", ''' , """) — מחרוזת-מוטבעת אינה raw.
      final o = node.offset;
      final triple = src.startsWith("'''", o) || src.startsWith('"""', o);
      final delim = triple ? 3 : 1;
      final els = node.elements;
      for(var idx=0; idx<els.length; idx++){
        final el = els[idx];
        if(el is InterpolationString){
          final v = el.value;
          if(_heb.hasMatch(v)){
            final innerStart = el.offset + (idx==0 ? delim : 0);
            final innerEnd = el.end - (idx==els.length-1 ? delim : 0);
            if(innerEnd > innerStart) hits.add(_Hit(innerStart, innerEnd, v, interp:true));
          }
        }
      }
    }
    super.visitStringInterpolation(node); // רדת לביטויים (ליטרל-פשוט בתוך ${..})
  }
}

void main(List<String> args){
  final file = args[0];
  final src = File(file).readAsStringSync();
  final unit = parseString(content: src, throwIfDiagnostics: false).unit;

  FunctionDeclaration? fn;
  for(final d in unit.declarations){ if(d is FunctionDeclaration && !d.isGetter && !d.isSetter){ fn=d; break; } }
  if(fn==null){ print(jsonEncode({'ok':false,'reason':'no top-level function'})); return; }
  if(fn.functionExpression.parameters==null){ print(jsonEncode({'ok':false,'reason':'no parameter list (getter/data?)'})); return; }

  final col = _Collector(src);
  fn.functionExpression.body.visitChildren(col);
  if(col.hits.isEmpty){ print(jsonEncode({'ok':false,'reason':'no raw hebrew in body'})); return; }

  final terms = <String,String>{}; final keyOf = <String,String>{}; final used=<String>{}; var i=0;
  // מפתחות עם קידומת 'xi_' — מונע התנגשות עם מפתחות מסלול-1 קיימים (בעת מיזוג לקובץ-שמות).
  for(final h in col.hits){ if(keyOf.containsKey(h.value)) continue; final s=_slug(h.value); var k=(s==null)?'xi${i}':'xi_${s}'; if(used.contains(k)) k='xi${i}'; used.add(k); keyOf[h.value]=k; terms[k]=h.value; i++; }

  final edits = [...col.hits]..sort((a,b)=>b.offset-a.offset);
  var out = src;
  for(final h in edits){
    final rep = h.interp ? "\${term('${keyOf[h.value]}')}" : "term('${keyOf[h.value]}')";
    out = out.substring(0,h.offset) + rep + out.substring(h.end);
  }

  // האם הפונקציה כבר נושאת פרמטר term? (⇒ אל תזריק שוב, ואל תחווט-מחדש בדיקה/צרכן)
  final pl = fn.functionExpression.parameters!;
  final hasTerm = pl.parameters.any((p)=> p.name?.lexeme == 'term');
  String out2;
  if(hasTerm){
    out2 = out;
  } else {
    const decl = 'required String Function(String) term';
    final named = pl.parameters.where((p)=>p.isNamed).toList();
    if(named.isNotEmpty){
      final firstNamed = named.first;
      final braceOff = src.lastIndexOf('{', firstNamed.offset);
      out2 = out.substring(0,braceOff+1) + decl + ', ' + out.substring(braceOff+1);
    } else {
      final close = pl.rightParenthesis.offset;
      var p = close-1; while(p>0 && src[p].trim().isEmpty) p--;
      final trailingComma = src[p]==',';
      final sep = pl.parameters.isEmpty ? '' : (trailingComma ? ' ' : ', ');
      out2 = out.substring(0,close) + '$sep{$decl}' + out.substring(close);
    }
  }

  stdout.write(jsonEncode({'ok':true,'source':out2,'terms':terms,'fn':fn.name.lexeme,'count':terms.length,'hadTerm':hasTerm}));
}
