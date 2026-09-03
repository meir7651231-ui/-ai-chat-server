// 🔬 pixel-forge-audit · gen-forge-dart — קורא shots/index.json ומחולל בדיקת-flutter שמציירת כל
// אטום-FORGE (Forge<Pascal>) ל-PNG, ממוסגר זהה ל-ORIG (438/pad16/#08080A/2x). ייבוא-ממוספר למניעת
// התנגשות-שמות חוצת-משפחות. פלט: buildsmart/app_flutter/test/zz_pixel_audit_test.dart.
import fs from 'node:fs';
import path from 'node:path';
import { SHOTS, FONTS } from './lib.mjs';

const TEST = '/home/user/buildsmart/app_flutter/test/zz_pixel_audit_test.dart';
let idx = JSON.parse(fs.readFileSync(path.join(SHOTS, 'index.json'), 'utf8'));
// ONLY=fam__slug,fam__slug… ⇒ מרנדר תת-קבוצה בלבד (ל-self-heal ממוקד ומהיר).
const only = (process.env.ONLY || '').split(',').filter(Boolean);
if (only.length) idx = idx.filter(a => only.includes(`${a.family}__${a.slug}`));
const fams = [...new Set(idx.map(a => a.family))].sort();
const forgeDir = path.join(SHOTS, 'forge');

const imports = fams.map(f => `import 'package:buildsmart/genesis/dart-forge-bs/${f}/${f}.dart' as f_${f};`).join('\n');
const shots = idx.map(a => `  await s('${a.family}__${a.slug}.png', ${a.hug}, const f_${a.family}.${a.cls}());`).join('\n');

const src = `// מחולל-אוטומטית ע"י machtzev/audit/gen-forge-dart.mjs — אל תערוך. מצייר כל אטום-FORGE ל-PNG לביקורת-פיקסל.
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
${imports}
const forgeDir='${forgeDir}';
const fonts='${FONTS}';
Future<void> _load(String f,List<String> p)async{final l=FontLoader(f);for(final x in p){final b=await File(x).readAsBytes();l.addFont(Future.value(ByteData.view(Uint8List.fromList(b).buffer)));}await l.load();}
Future<void> _shot(WidgetTester t,String name,bool hug,Widget a)async{final k=GlobalKey();
 try{
  // מסגור נאמן ל-Pure (רוחב-תוכן 406, מסגרת 438 עם pad16):
  //  hug (inline/inline-flex/גודל-קבוע כפתור/צ'יפ/FAB) ⇒ Align(topRight,heightFactor) ⇒ הילד loose ⇒ מתכווץ-לימין.
  //  block (כרטיס/פאנל בלי רוחב) ⇒ SizedBox(406) הדוק ⇒ הילד ממלא-רוחב. (SizedBox מכתיב רוחב לילד — נכון לבלוק.)
  final inner=hug?Align(alignment:Alignment.topRight,heightFactor:1.0,child:a):a;
  final framed=Container(color:const Color(0xFF08080A),padding:const EdgeInsets.all(16),child:SizedBox(width:406,child:inner));
  await t.pumpWidget(MediaQuery(data:const MediaQueryData(devicePixelRatio:2.0),child:Directionality(textDirection:TextDirection.rtl,child:Align(alignment:Alignment.topLeft,child:RepaintBoundary(key:k,child:framed)))));
  await t.pump(const Duration(milliseconds:50));
  // בליעת שגיאות-פריסה (hasSize/unbounded) — נרשמות ע"י ה-binding, לא נזרקות. אטום-שנכשל = ממצא (no-forge בדיף).
  final ex=t.takeException();
  if(ex!=null){ // ignore: avoid_print
   print('MISS forge \$name : \$ex'); return; }
  await t.runAsync(()async{final b=k.currentContext!.findRenderObject() as RenderRepaintBoundary;final im=await b.toImage(pixelRatio:2.0);final by=await im.toByteData(format:ui.ImageByteFormat.png);await File('\$forgeDir/\$name').writeAsBytes(by!.buffer.asUint8List());});
 }catch(e){t.takeException(); // ignore: avoid_print
  print('MISS forge \$name : \$e'); }
}
void main(){testWidgets('pixel-audit',(t)async{
 Directory(forgeDir).createSync(recursive:true);
 await t.runAsync(()async{
  await _load('Fraunces',['\$fonts/Fraunces-600.ttf','\$fonts/Fraunces-700.ttf']);
  await _load('Frank Ruhl Libre',['\$fonts/FrankRuhlLibre-700.ttf']);
  await _load('Space Grotesk',['\$fonts/SpaceGrotesk-400.ttf','\$fonts/SpaceGrotesk-600.ttf','\$fonts/SpaceGrotesk-700.ttf']);
  await _load('Heebo',['\$fonts/Heebo-Regular.ttf','\$fonts/Heebo-SemiBold.ttf','\$fonts/Heebo-Bold.ttf']);
  await _load('JetBrains Mono',['\$fonts/JetBrainsMono-Regular.ttf','\$fonts/JetBrainsMono-Bold.ttf']);
 });
 Future<void> s(String n,bool h,Widget w)=>_shot(t,n,h,w);
${shots}
});}
`;
fs.mkdirSync(forgeDir, { recursive: true });
fs.writeFileSync(TEST, src);
console.log(`✓ gen-forge-dart: ${idx.length} shots ⇒ ${TEST}`);
