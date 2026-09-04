# ✅ CLOSED · GENMAX · G5b — רנדר-בפועל של פלטי-המחולל כשער (4.9.2026)

> שלב 5b של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא סוכן (L51). לקח: L54. קוד: `machtzev/generator/gen-verify.mjs` · שער `genverify` (push).

## מה נבנה
לכל `new/dart-gen-bs/gen_*.dart` עם `class XScreen extends StatefulWidget` — **בדיקת-widget מחוללת** נכתבת למראה-buildsmart (`test/genesis_gen_verify_test.dart`, נמחקת אחרי הריצה): `pumpWidget(MaterialApp(home: XScreen()))` ב-800×1400 ⇒ `takeException()==null` ⇒ `DsScaffold` קיים ⇒ ספירת מחלקות-הווידג׳ט שרונדרו בפועל מול `ops-map` (תצוגה) ⇒ `GENVERIFY {json}`. רק קבצים שהמראה ≡ המקור מיובאים (סחף מדווח ✗ בנפרד — L54).

## מדידה
| קבוצה | רונדרו | הערה |
|---|---|---|
| פלטי G4/G5 (9 מודולי-משנה + 2 הרכבות) | **11/11** | קפדני: כשל = שער אדום |
| מחולל-ישן (app-ds · gen_quest/rich/showcase/app_rec…) | **8/46** | 38 זורקים בזמן-ריצה (‏RenderFlex overflow ×9 בלוג, ועוד) — analyze ירוק עליהם מ-30.8 ⇒ **ממצא על המחולל-הישן**, ראצ׳ט רק-עולה |
| אטומי-תצוגה ייחודיים על המסך | **36** | מתוך המחלקות ב-ops-map |
בלוק-האמת (CLAUDE.md): "פלטי-מחולל שרונדרו-בפועל (G5b) 19/57 · 36".

## מה לא אומת (כנות)
- "רונדר" = נטען בלי חריגה; לא נבדק שהמסך **נכון-למטרה** (אסרטות-טקסט/טאפ/מצב פר-op) — נשאר ל-G5 המלא, אחרי retarget.
- 38 כשלי המחולל-הישן לא תוקנו כאן (מחוץ להיקף G4/G5; הם של `app-ds`/`render-ds`) — הראצ׳ט מונע נסיגה, הרשימה ב-`gen-verify-report.json`.
- הרתמה כבדה (~3 דק׳) ⇒ push; מדולגת בלי buildsmart.

## אימות
`gen-verify.mjs --write-baseline` ⇒ 19/57 · 36 · שער רשום (gates.tsv 36 · police · INDEX) · truth מציג את המדד · police --fast ירוק (ראה commit).
