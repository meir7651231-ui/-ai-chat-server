# ✅ CLOSED · GENMAX · G11a — פותר-משפטים: ספציפיות וחלופות · אפליקציה-שלישית (הוכחת-הכללה ×3) (4.9.2026)

> שלב G11a של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא נחיל (הכרעה-24). כלים: `sentence.mjs` · `app-golden-3.json` · `app-from-sentences.mjs` (ללא שינוי — אותו מנוע).

## מה נבנה
1. **פותר-המשפטים (L68):** (א) '/' בתוך מילה של צורה = חלופות — כלל-הפורמט של TERM_DEFS ("תלמיד/ה", "בן/בת משפחה") מורחב לצורות מלאות לפני ההתאמה; (ב) שוויון-ציון מוכרע לפי **ספציפיות** — הצורה הארוכה-יותר שתאמה במלואה מנצחת ("בני משפחה" ⇒ Member ולא "משפחה" ⇒ Family); סדר-הטבלה = שובר-שוויון אחרון. fixtures: "בני משפחה לפי גיל" ⇒ Member · "בן משפחה עם תאריך לידה" ⇒ Member. **sentence 12/12.**
2. **StudioApp** (`app-golden-3.json`, 6 משפטים): חוג(Course⇐courses) · בני משפחה(Member⇐students — 16/17 שמות-שדה זהים: Member הוא כמעט member-הזהב) · מורה(Teacher⇐students) · שיוך(ShopAssignment⇐teachers — **מחווט-גרעין**: `gen_core_shopassignment` על שלד-מורים, מסלול-גרעין חדש) · קריטריון(ShopCriterion⇐courses) · תרומות(Donation⇐fees). 4 פלטי-retarget חדשים.
3. **סה"כ: 3 אפליקציות · 18 מודולים · 15 ישויות שונות · 7 מודולי-זהב כמקור · אפס שינוי-מנוע בין האפליקציות.**

## מה נמדד (אמת)
- **Kehila 13/13 · Tzedaka 17/17 · Studio 16/16** (`flutter test`, בדיקות מחוללות: בית · חיפוש · hero-jump · הזרקה · ניווט).
- Studio hero-jump: Course c6 · Member m3 · Teacher m3 · ShopCriterion c6 — כרטיס פתוח + טבלה מסוננת; ShopAssignment (absentN = sum, בלי שורות) · Donation (count) — פתיחה רגילה, מדווח.
- `flutter analyze lib/genesis/dart-gen-bs`: **0 errors** · `retarget` ≡ · `appgen` ≡ (3 אפליקציות) · `fragops` ≡ · `coredart` ≡ · `learn` ✓ (L68).
- `gen-verify --gate`: **52/90 רונדרו · 38 אטומים · 211 טאפים · 0 חריגות · exit 0** (baseline עודכן: 47/85 ⇒ 52/90 — 5 פלטי-Studio, כולם ✓).

## כנות / מה לא אומת
- **4 ישויות-גרעין בלתי-נגישות במשפט:** Delivery · CallEntry · DialLogEntry · AyinCase — אין להן `entity.*` ב-TERM_DEFS של מאור ("משלוח", "שיחה", "חיוג", "תיק" ⇒ ∅). לא ממציאים מונחים (§20-ד) — הכרעת-בעלים/הרחבת-TERM_DEFS במקור.
- "שיוך מוצר למשפחה" ⇒ ShopProduct (3) לפני ShopAssignment (3) — שוויון בין צורות באותו אורך; הספציפיות לא מכריעה, סדר-הטבלה כן. משפט דו-ישותי הוא מקום-שמור להכרעת-משתמש (בורר), לא לניחוש.
- הבחירה `<E>⇐מודול` מבנית (ShopAssignment⇐teachers 3/9 בינוני) — עובד, מוצהר בכותרת.

## הבא (G11b)
הכרעות-בעלים · תפר-הזרקה למודולים בלי `db` · חציבת KPI-מקומיים ל-getters.
