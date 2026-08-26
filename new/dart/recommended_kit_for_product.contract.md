# חוזה · recommendedKitForProduct

**מוצא (קדוש, L4):** `buildsmart/app_flutter/lib/logic/install_kit.dart:42-124`
**אטום:** `new/dart/recommended_kit_for_product.dart` — `List<KitItem> recommendedKitForProduct(KitProduct p, {verifiedSpecs})`

## קלט
- `p` — `KitProduct`: `sku` (String) · `brand` (String) · `dims` (Map&lt;String,dynamic&gt;? — נקרא רק `dims['dn נומינלי']`). אלה השדות היחידים ש-recommendedKitForProduct קורא (install_kit.dart:43,48,50).
- `verifiedSpecs` — שקע `Map<String, KitSpec>` (מייצג `kVerifiedSpecs`, install_kit.dart:43). `KitSpec` = `material` (String) · `ends` (List&lt;KitEnd&gt;); `KitEnd` = `type` (EndType) · `size` (String). חסר-מפתח ⇒ `null`. ברירת-מחדל `const {}`.

## פלט
`List<KitItem>` — `KitItem` = `kind` (KitKind: tool/sealant/safety) · `label` (String) · `reason` (String) · `severity` (Severity: required[ברירת-מחדל]/recommended/optional).

## התנהגות (עוגני-שורה למקור)
1. **שער-PPR** — `brand=='פולירול'` **או** `spec?.material.startsWith('PPR')`: מחזיר ערכת-ריתוך קבועה בת **6 פריטים** (install_kit.dart:48-86). `dn = dims['dn נומינלי']?.toString() ?? ''`; ריק ⇒ הליבל ללא-קוטר, אחרת מוסיף ` $dn` / ` ⌀$dn מ"מ`. פריטים 0-3 = `required`, פריטים 4-5 = `recommended`.
2. `spec == null` (ולא-PPR) ⇒ `const []` (install_kit.dart:87).
3. אחרת — לכל `e` ב-`spec.ends`, `putIfAbsent` לפי-מפתח (מנקה-כפילויות, install_kit.dart:88-122):
   - `bspMale`/`bspFemale` ⇒ `wrench-bsp-<size>` (מפתח-שוודי) + `ptfe` (סרט-טפלון sealant) (install_kit.dart:92-102).
   - `hdpeCompression` ⇒ `wrench-comp-<material>-<size>` (install_kit.dart:103-108).
   - `pexPress` ⇒ `crimper-pex-<size>` (install_kit.dart:109-114).
   - `copperPress` ⇒ `press-cu-<size>` (install_kit.dart:115-121).

## דוגמאות מספריות (מוכחות ב-recommended_kit_for_product_test.dart)
| # | קלט | אורך | בולטים | עוגן |
|---|-----|------|--------|------|
| 1 | brand='פולירול', dims=null | 6 | [0]='מצמד PPR (אביזר חיבור)' · [2]='תבנית/ראש ריתוך' · [4].severity=recommended | :48-86 |
| 2 | brand='פולירול', dims={'dn נומינלי':40} | 6 | [0]='מצמד PPR 40 (אביזר חיבור)' · [2]='תבנית/ראש ריתוך ⌀40 מ"מ' | :52-66 |
| 3 | brand='x', spec.material='PPR-100' | 6 | זהה ל-#1 (שער דרך material) | :48 |
| 4 | brand='x', sku ללא-spec | 0 | `const []` | :87 |
| 5 | ends=[bspMale '1/2"', bspFemale '1/2"'], material='פליז' | 2 | 'מפתח שוודי מתכוונן להברגה 1/2"' + 'סרט טפלון (PTFE)' (ptfe מנוקה-כפילות) | :92-102 |
| 6 | ends=[hdpeCompression '32'], material='HDPE' | 1 | 'מפתח חבישה DN32 ל-HDPE' | :103-108 |
| 7 | ends=[pexPress '16'], material='PEX' | 1 | 'מכווץ PEX (Crimper) ל-16' | :109-114 |

## עדשה-עוינת (קלטי-קצה — CURRICULUM #6)
- שער-PPR גובר על ה-spec: גם spec==null עם brand='פולירול' ⇒ 6 פריטים (#1, :48).
- שער-PPR קופץ דרך **שני** מסלולים (brand או material) — `??false` מגן על spec==null (#3, :48).
- `ptfe` בעל-מפתח-קבוע ⇒ מופיע פעם-אחת גם על שני קצוות-BSP (putIfAbsent, #5, :98).
- קצה שאינו אחד מ-4 הסוגים המזוהים ⇒ נדלג בשקט (חסר ב-out); spec ריק-קצוות ⇒ `[]` (:88-123).
