# ✅ CLOSED · GENMAX · G6a — שכבת-הגרעין נגזרת מהסכמה: Registry · Relations · Workflow · Events · Rules · Notification (4.9.2026)

> שלב 6a של `PLAN-GENERATOR-MAX-2026-09-04.md` (G6 · core-from-shape, חלק-הנתונים). המנוע גוזר את הגרעין מהסכמה **בלי סשן ובלי המצאה**; policy-config (שבת/כשרות/הרשאות) נשאר **שקע-בעלים מוצהר** (הכרעה נדרשת — PLAN §6). קוד: `enum-values.mjs` (דאטה חצוב) · `core-from-shape.mjs` · שערים `enumvalues` · `core`.

## המנגנון (§20-ד · §19-ד · חוק-7)
1. **ערכי-enum כאטום-דאטה חצוב:** `export type X = 'a' | 'b'` מ-`maor-system/src/types/domain.ts` (גם רב-שורתי) ⇒ `enum-values.data.json` — **13 טיפוסים** (EnrollmentStatus · FamilyStatus · DeliveryStatus · AyinStage · TzBoxStatus · DialOutcome · …) בסדר-ההצהרה; שער ≡ חציבה-טרייה.
2. **Registry:** ישות · מונח (מ-entity-terms) · מספר-שדות · קיום-`id`.
3. **Relations:** שדה `xId:Id` ⇒ ישות: שם-זהה ⇒ סיומת באותו מרחב-שמות (`TzBox.coordinatorId`⇒TzCoordinator · `ShopItem.storeId`⇒ShopStore) ⇒ תחילית-קצרה-ביותר (`famId`⇒Family, לא FamilyCred) ⇒ מילה-אחרונה-של-הבסיס עם עדיפות-שורש (`mainEventId`/`dueEventId`⇒OrgEvent — כמו בלגאסי) ⇒ `self?` (prevYearId/renewedToId) ⇒ reserved. **32/33** פתורים; `OrgEvent.spId` נשאר reserved (קיצור של 2 תווים — לא נגזר, לא מומצא).
4. **Workflow:** שדות `status/stage/outcome` עם enum ⇒ מצבים חצובים; מעברים = **אטום-מדף** כשקיים (`Delivery.status`⇒`advance-status` · `AyinCase.stage`⇒`next-stage`) אחרת `'declared'` — סדר-ההצהרה כברירת-מחדל **מסומן כהצבה** (6 מ-8), לא כאמת.
5. **Events:** שדות-IsoDate של מחזור-חיים (`…At/…Date/start/end/expiry/due`) ⇒ 35 אירועים (`createdAt`⇒created · `deliveredAt`⇒delivered).
6. **Rules:** חובה (o:false) · תחום-enum · שלמות-יחסים (ref) · ייחודיות-id ⇒ 383 חוקים · **Notification:** שדות-ערוץ phone/email ⇒ 14.

## מדידה
`49 ישויות · יחסים 32/33 · workflows 8 (2 אטום-מעבר · 6 declared) · אירועים 35 · חוקים 383 · ערוצים 14` — `core-registry.json` + `core-registry-report.md` (טבלה פר-ישות).

## מה לא אומת (כנות)
- **זה גרעין-כנתונים, לא גרעין-כקוד:** אין עדיין Dart מקומפל ומרונדר שמפעיל את ה-Registry/Workflow — G6b (פליטת `core_<entity>.dart` שמחווט `nextStage`/`advanceStatus`/`canGrantedAction` מהמדף + gen-verify).
- 6 workflows ב-`declared` = ניחוש-מסודר שמוצהר ככזה; מעברי-אמת (מותר/אסור, מי-רשאי) הם **הכרעות-בעלים** (PLAN §6) — נשארים שקע.
- `ShopEvent.mainEventId`⇒OrgEvent נכון לפי הלגאסי (CLAUDE של maor: "OrgEvent מקושר (mainEventId)"), אך הכלל "מוקדם+Event⇒שורש" הוא היוריסטיקה מוצהרת — כלל שמדווח `how` בכל שורה.
- policy-config ריק במכוון.

## אימות
`enum-values.mjs --gate` ✓ (13 ≡ domain.ts) · `core-from-shape.mjs --gate` ✓ (≡ סכמה) · police --fast ירוק (ראה commit).
