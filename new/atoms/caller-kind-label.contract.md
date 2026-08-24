# חוזה · חוט caller-kind-label
**תפקיד:** תווית-סוג-המתקשר בכרטיס-השיחה (screen-pop) — דרך מילון-המונחים,
כך שבורטיקל מסחרי "תורם" הופך ל"ליד/ספק", "משפחה" ל"לקוח" וכו'. ה-fallback
לכל סוג = התווית ההיסטורית בדיוק ⇒ ללקוח-החי (בלי דריסות-מונחים) ביט-זהה.
מיפוי הסוג→מפתח-מונח: ‏family→entity.family · member→entity.member ·
supporter→entity.supporter · volunteer→entity.volunteer · coordinator→entity.tzCoordinator.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר שלישי):**
- ‏termOf(cfg, key, fallback)⇒string — מילון-המונחים (במקור: lib/config.ts —
  דריסה ריקה/רווחים = "אין דריסה" ⇒ fallback).
**קלט:** ‏cfg (קונפיג-הארגון, מועבר לשקע כמות-שהוא) ·
‏kind ‏('family'|'member'|'supporter'|'volunteer'|'coordinator') · השקע.
**פלט:** מחרוזת-התווית; kind לא-מוכר ⇒ undefined (נפילת-ברירת-מחדל של switch).
**דוגמאות מחייבות** (עם שקע-termOf בסמנטיקת-המקור, cfg בלי דריסות):
1. ‏'family'→'משפחה' · ‏'member'→'בן/בת משפחה' · ‏'supporter'→'תורם/ת' ·
   ‏'volunteer'→'מתנדב/ת' · ‏'coordinator'→'רכז/ת' (חמש התוויות ההיסטוריות).
2. ‏cfg.terms['entity.supporter']='ליד' ⇒ ‏'supporter'→'ליד' (הדריסה מנצחת).
3. ‏cfg.terms['entity.family']='   ' (רווחים) ⇒ ‏'family'→'משפחה' (ריק=אין-דריסה, דרך השקע).
4. ‏kind='alien' ⇒ ‏undefined.
**מוצא:** maor/src/lib/callerId.ts:24-56 (‏callerKindLabel).
