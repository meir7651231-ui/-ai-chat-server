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

// סורק: האם קיים SwitchStatement שתווית-מחרוזת שלו עברית (case-label = חייב-קבוע)
class _SwitchHebScan extends RecursiveAstVisitor<void> {
  bool found = false;
  @override
  void visitSwitchStatement(SwitchStatement node){
    final s = node.toSource();
    if(_heb.hasMatch(s)) found = true;
    super.visitSwitchStatement(node);
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

  // הפונקציה-הראשית = ההצהרה-העליונה הראשונה שהיא פונקציה-ממש **עם עברית-בגוף**
  // (מדלגים על עוזרים קטנים חסרי-עברית שקודמים לה; getter = דאטה).
  FunctionDeclaration? fn;
  _Collector? col;
  for(final d in unit.declarations){
    if(d is! FunctionDeclaration || d.isGetter || d.isSetter) continue;
    if(d.functionExpression.parameters==null) continue;
    final c = _Collector();
    d.functionExpression.body.visitChildren(c);
    if(c.hits.isNotEmpty){ fn=d; col=c; break; }
  }
  if(fn==null){ print(jsonEncode({'ok':false,'reason':'no function with raw hebrew in body'})); return; }
  // ‏case-label של מחרוזת חייב להיות קבוע ⇒ term() ישבור. פוסלים switch-על-מחרוזת-עברית
  // (טעון המרת switch→if — טיפול-נפרד/יד).
  {
    final sc=_SwitchHebScan(); fn.functionExpression.body.visitChildren(sc);
    if(sc.found){ print(jsonEncode({'ok':false,'reason':'hebrew in switch-case (needs switch to if, hand)'})); return; }
  }

  // מפתחות-מטרה ייחודיים
  final terms = <String,String>{}; final keyOf = <String,String>{}; final used=<String>{}; var i=0;
  for(final h in col!.hits){ if(keyOf.containsKey(h.value)) continue; var k=_slug(h.value); if(k==null||used.contains(k)) k='t${i}'; used.add(k); keyOf[h.value]=k; terms[k]=h.value; i++; }

  // עריכות בסדר-הפוך (שמירת-offsets)
  final edits = [...col!.hits]..sort((a,b)=>b.offset-a.offset);
  var out = src;
  for(final h in edits){ out = out.substring(0,h.offset) + "term('${keyOf[h.value]}')" + out.substring(h.end); }

  // הזרקת שקע term לרשימת-הפרמטרים
  final pl = fn.functionExpression.parameters!;
  const decl = 'required String Function(String) term';
  // מצא offset-הזרקה: לפני ה-) הסוגר; אם יש {} named — לתוכו
  final named = pl.parameters.where((p)=>p.isNamed).toList();
  String out2;
  if(named.isNotEmpty){
    // הכנס אחרי ה-{ (offset של הפרמטר-הנקוב הראשון)
    final firstNamed = named.first;
    // ה-{ נמצא לפני firstNamed.offset
    final braceOff = src.lastIndexOf('{', firstNamed.offset);
    // התאמה מול out (ה-offsets השתנו רק אחרי עריכות-הליטרלים; רשימת-הפרמטרים לפני הגוף ⇒ ללא-שינוי אם הליטרלים בגוף)
    out2 = out.substring(0,braceOff+1) + decl + ', ' + out.substring(braceOff+1);
  } else {
    // אין named — הוסף בלוק לפני ה-). זהירות מפסיק-נגרר קיים (⇒ פסיק-כפול).
    final close = pl.rightParenthesis.offset;
    var p = close-1; while(p>0 && src[p].trim().isEmpty) p--;
    final trailingComma = src[p]==',';
    final sep = pl.parameters.isEmpty ? '' : (trailingComma ? ' ' : ', ');
    out2 = out.substring(0,close) + '$sep{$decl}' + out.substring(close);
  }

  stdout.write(jsonEncode({'ok':true,'source':out2,'terms':terms,'fn':fn.name.lexeme,'count':terms.length}));
}
