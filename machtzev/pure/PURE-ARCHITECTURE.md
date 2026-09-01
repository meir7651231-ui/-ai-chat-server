# PURE — ארכיטקטורת ההטמעה במחולל (סינתזת נחיל 7-עדשות)
> איך שכבת-Pure נכנסת לאטומים המפורקים כך שהמחולל משתמש בהם · עומדת בכל 13 שערי-המשטרה ·
> ומאפשרת לבעלים בעתיד: (א) לשנות עיצוב **פר-אטום** — לא רק צבע אלא טיפוגרפיה/גודל/רדיוס/ריווח/תנועה/כל property ·
> (ב) להצמיד **מראה של אטום אחד לאטום אחר, גם חוצה-משפחה** · (ג) מענה-תצוגתי גם ל**אטומים-מורכבים** (מולקולות/אורגניזמים).
> מקור: 7 סוכני-חשיבה read-only, ראיות file:line. תאריך: 2026-09-01.

---

## 0. שני ממצאים שחייבים הכרעת-בעלים לפני בנייה

1. **סתירת-רישום/branch.** `machtzev/generator/atom-index.json` (522 אטומים) ש-PURE-STATE הפנה אליו **לא קיים בענף `claude/mah-kora-0by8kw`**. הרישום החי שהמחולל צורך הוא **`machtzev/generator/atlas.json`** (478 widgets · 759 functions · 3002 data). ה-522 היו כנראה מ-`hei-rxv1v1`. → **כל כלי-העיצוב חייב לקרוא `atlas.json`.** משפחות Action/Input שכבר נבנו רובן מופו ב-atlas (NeonButton/GlowField/GlassCard/DsField מאומתים שם) — אך צריך ביקורת-הצלבה מלאה.
2. **שתי מערכות-טוקן + שני צינורות-הרכבה חיים במקביל:**
   - עולם-האטומים (משטרה): `new/atoms/palette.mjs` (פיגמנטים `p_<hex>`) + `theme-wiring.mjs` (role→pigment light/dark) + `theme-terms.mjs` — **תקדים ירוק ב-13 השערים.**
   - עולם-המנועים (Dart-DS): `new/dart-ui-bs/ds/` (`ds.dart`,`ds_scale.dart`,`design-seed.json`) + מנועי `machtzev/ds-*.mjs`.
   - צינור-מחולל בהיר (`genesis-gen.mjs`, ListView שטוח, מראה צרוב) מול צינור מעוצב (`render-ds.mjs`, עטוף `DsSection`).
   הסינתזה למטה **מאחדת אותם לשכבות — לא מערכת שלישית** (L15: "היובל אינו הנהר").

---

## 1. מודל 5 השכבות (הזהות/עיצוב תמיד בחיווט, לעולם לא באטום — LAW-5/6)

```
E. GENERATOR   pickLook() ממשפט-עברית → הזרקה בהרכבה + עטיפת-מורכבים ב-STAGE   (genesis-gen/render-ds/compose)
D. WIRING/BOX  הכרעת-override פר-מופע · binder חוצה-משפחה · הרכבת-מורכב        (הקופסה — כאן חיה כל הניידות)
C. ATOM        חוזה-slots (design-seams) שהאטום חושף · אטום נשאר טהור ועיוור-למראה
B. ENGINE      ds-pure.mjs → ds_pure.dart (דורמנטי לצד DsDark) · בורר DsActive = החוט ההפיך היחיד
A. DATA        DsLook = תכנית role→pigment (הרחבת palette+theme-wiring) · export const טהור → עובר משטרה
```

---

## 2. שכבה A · DATA — "מראה" = תכנית-חיווט role→pigment (עדשות 1+2)

**"מראה" (`DsLook`) הוא דאטה טהורה, הרחבת `palette.mjs`+`theme-wiring.mjs` הקיימים — לא תת-מערכת חדשה.**

- **אוצר-תפקידים (השמות היחידים שאטום מורשה להזכיר):**
  - סולם-נייטרל (לא מורף): `canvas sunken surface raised raised2 ink mut faint hair hair2`
  - סט-אקצנט (מורף יחד בהחלפת-ערכה): `a aHi a800 gl c2 c3`
  - סמנטי-קבוע (לעולם לא מורף): `err warn gold`
- **פיגמנט = אטום** (`"#7A6BF0"` הוא הפיגמנט "אינדיגו", לא "accent"). התפקיד = שקע בקופסה (LAW-5).
- **ערכה = חיווט אחד של פיגמנטים על סט-האקצנט.** `t-indigo/t-teal/t-amber` = שלוש תכניות-חיווט של אותו מבנה.
- **צורת-הקובץ (קריטי למשטרה):** `export const` literal בלי `if/for/while/switch` → `isPureData` מקצר את deep-purity (`deep-purity-scan.mjs:19-26`). כל ערך-עיצוב (hex/spacing/radii/duration/opacity) יושב ב-data-atom; מנגנון לעולם לא מכיל literal ≥10 או שם-תפקיד inline.
- `DsLook` הוא **superset של `design-seed.json`** (type/space/radius/elev/motion/gradientHues נשארים) → מנוע `ds-tokens.mjs` ממשיך לעבוד.

## 3. שכבה B · ENGINE — טעינה-לצד + החוט ההפיך (עדשות 7+1)

- **תקדים מוכח:** `DsDark` כבר קיים ב-`ds_scale.dart:82-96` **בלי צרכנים** — בדיוק צורת load-beside של חוק-7, מוכחת-קומפילציה. Pure רוכב על אותה מסילה.
- מנוע חדש `machtzev/ds-pure.mjs` → `ds_pure.dart` (סולם-נייטרל + `DsAccentIndigo/Teal/Amber` + `DsGold`/`DsErr` קבועים). ה-`color-mix(...)` של Pure מומר ל-`Color.withValues(alpha:)` **בזמן-חילול** (דטרמיניסטי, בלי מיזוג-ריצה) → אנלייזר ירוק.
- **בורר `DsActive` = אינדירקציה אחת** שהאטומים קוראים במקום `DsTokens` ישירות. ברירת-מחדל = `DsTokens` הקיים (light) → כל מסך נוכחי ביט-זהה. הפיכת מתג יחיד → Pure+ערכה. Gold/Error מחוץ למסלול-ההחלפה.
- שער `--check` (העתק `ds-tokens.mjs:132-136`) שומר טריות.

## 4. שכבה C · ATOM — חוזה ה-slots (עדשה 4)

**ממצא-מפתח מ-atlas.json (478):** 83 אטומים כבר חושפים slots (`accentColor`/`fillColor`/`radius` — `NeonButton`/`GlowField`/`GlassCard`); **110 אטומים אינטראקטיביים עיוורי-סגנון** חושפים רק תוכן/התנהגות (`Field`/`SwitchRow`/`DsField`/`PickerOption`) — המראה צרוב בגופם מול `DsTokens`.

→ **החסם הקונקרטי:** אי-אפשר להצמיד מראה לאטום בלי slots. **המשׂימה הראשונה:** לקדם את 110 העיוורים לחוזה-ה-slots, לפי חתימת 83 הפרימיום.

**חוזה-ה-slots (union של הקיים + טוקני-Pure):**
- משטח: `surface surfaceAlt ink mut accent accentHi accent800 border`
- צורה/מידות: `radius height pad gap`
- עומק/אפקט: `elevation glow sheen(flag) gradient`
- תנועה: `motion` (curve+duration+pulse/ripple flags · מכבד prefers-reduced-motion)
- לפי-מצב: `focusRing hoverSurface activeSurface disabledTreatment errorSlot(נעול)`
- לפי-תפקיד (מורכבים): `label value title subtitle icon badge* track chevron`

האטום רק **מכריז** slots (מניפסט `AtomStyle` ליד ה-record ב-atlas.json) — לעולם לא יודע איזה מראה הוא לובש.

## 5. שכבה D · WIRING/BOX — override, ניידות, הפיכות (עדשות 3+4)

**5.1 override פר-אטום (עדשה 3):** `DsStyle?` — value-object nullable (fill/ink/radius/pad/textStyle/elevation/motion), כולו pigments+geometry, בלי שמות-תפקיד. נשמר ב-`new/dart-ui-bs/ds/design-overrides.json` ממופתח לפי **instance-id יציב** שה-seam טובע: `${slug}#${cls}@${index}`. נפתר ב-`buildCall` (`genesis-gen.mjs:349`, כבר יש שם ערוץ `overrides`).

**סולם-קדימות (הגבוה מנצח, פר-property):**
```
prop-override של המופע  ▶  instance-override  ▶  family-default  ▶  theme(param)
```
accent → דרך הערכה הפעילה · semantic (err/warn/gold) → קבוע, לא-מאונדקס-לערכה. שינוי `radius` בודד לא נוגע בשאר (`?? token` לכל property בנפרד).

**5.2 ניידות חוצת-משפחה (עדשה 4) — ה-binder בקופסה, מקום יחיד:**
- **TYPE (נשאר):** מבנה · התנהגות · מכונת-מצבים · seam · רצפת-a11y · **הכרזת-ה-slots**.
- **LOOK (נודד, data-record):** ערכים ל-slots בלבד + דגלי-קישוט (sheen/aura/pulse/ripple).
- **4 כללים + 2 נעילות + מגן:**
  1. slot עודף שהאטום לא חושף → **מושמט בשקט** (אסור לייצר מבנה חדש).
  2. slot חסר → נגזר משרשרת-נפילה (accentHi←accent, focusRing←accentHi/ניטרלי, border←hair...).
  3. **נעול:** `errorSlot`=אדום תמיד גובר · מראה-אטום (Gold) = הכל-או-כלום, לא מתערכב · a11y שייך ל-TYPE, מראה לא מסיר.
  4. **מגן-ניגוד:** אחרי binding, אם ink/surface < 4.5:1 → החלפת-ink אוטומטית לגוון-עובר. קישוט חופשי, קריאוּת לא.

**5.3 הפיכות (LAW-7):** הכל additive · `enabled:false` → אפס-`style:` → ביט-זהה · הסרת-מפתח מחזירה מראה קודם · אפס-אובדן.

## 6. שכבה E · GENERATOR — בחירה + הזרקה (עדשות 5+6)

- **בחירה:** `pickLook(specText)` (טהור) קורא `knowledge/looks.json` (מילת-סיגנל-עברית → מראה) — במקביל ל-`lexicon.json` (מילה→role). סיגנלים כבר חלקית קיימים (`זכוכית`→glass, `ניאון`→neon); להוסיף פלטות (`שקיעה/אוקיינוס/יער`), `כהה`→dark, `רגוע/נועז`→motion.
- **הזרקה (LAW-6):** משרשרים `look` ל-`generate()` וצורכים רק ב-3 נקודות-הזהות הצרובות כיום: רקע-Scaffold (`genesis-gen.mjs:443`), `tokenFor(name)→tokenFor(name,look)` (`:304`), ועטיפת-הילדים במשטח-הווריאנט (`:398-404`).
- **ברירת-מחדל בלי-עיצוב = ביט-זהה** → שער ds-critic ו-shell-test נשארים ירוקים; המראה סוטה רק כשיש סיגנל.

## 7. מורכבים · מודל התצוגה (עדשה 6)

- 3 מנגנוני-הרכבה: `compose.mjs` (אורגניזם מפירוק-הפוך) · `genesis-gen.mjs:364-406` (מולקולה מ-הזחה) · `synth.mjs` (לוגיקה, בלי תצוגה).
- **מודל STAGE→HEAD/RHYTHM/FOOT** — כבר קיים כפרימיטיבים: `DsSection`/`DsScaffold`/`DsCard*` על סולמות `DsSpace/DsRadii/DsElev`.
- **קדימות-ירושה:** theme זורם (לעולם לא מועתק) → composite-look גובר בתוך-הערכה → child-override **סמנטי-בלבד** (error/gold).
- **כלל-קינון:** gap-פנימי < חיצוני בצעד-סולם אחד · רדיוס קטן פנימה · **מקור-ריווח יחיד לכל תפר** (הקונטיינר החיצוני מחזיק ריווח, המורכב-המקונן `margin:0`). מונע הכפלת-margin.
- **המשׂימה הקונקרטית:** לעטוף את עץ-ההזחה של `genesis-gen` באותו משטח-STAGE שיש ל-`render-ds` → שני הצינורות מייצרים מורכב קוהרנטי.

## 8. תאימות-משטרה (עדשה 2) — 13 שערים, לא 6

- ה-"6" = תת-קבוצת `--fast`. הרצה מלאה = 13 (`police.mjs:19-31` + `gates.tsv`, מרשם⇄ledger דו-כיווני).
- **הסיכון הגדול:** deep-purity על baseline ריק (0) → אטום-עיצוב לא-טהור ראשון = אדום מיידי. **נטרול:** פיצול data-atom/blind-mechanism — מוכח-ירוק ע"י `palette.mjs`+`theme-wiring.mjs`+`audit-cat-colors`.
- **10 ratchets חדשים:** look-is-data · look-never-bakes-role · look-never-bakes-domain · identity-in-wiring · reversible-skin · token-value-snapshot · look-twin-or-neutral-suffix · skin-rethread · motion-token-is-data · instance-override-is-socket.
- **מוטציה:** מבחני-snapshot של כל-הערכים (לא מפתחות) — אחרת השער ריק (`mutation-check.mjs:24`, L36).
- **pins:** הוספת אטומים לא נוגעת ב-11 הקבצים-הנעולים → ירוק בלי פעולה. שער-ratchet חדש → re-sign באותו commit.

## 9. מה זה נותן לבעלים (הדרישות שלך)

| דרישה | איך מסופק | הפיך? | משטרה |
|---|---|---|---|
| שינוי עיצוב **פר-אטום**, כל property (צבע/טיפו/גודל/רדיוס/ריווח/תנועה) | `DsStyle?` + `design-overrides.json` ממופתח instance-id · סולם-קדימות פר-property | כן (מפתח/דגל) | data-atom · snapshot |
| **הצמדת-מראה חוצת-משפחה** (מראה של אטום על אטום אחר) | look=data-record · binder בקופסה (4 כללים+2 נעילות+מגן-ניגוד) · חוזה-slots | כן | look-is-data · binder-in-box |
| **מענה-תצוגתי למורכבים** | STAGE→HEAD/RHYTHM/FOOT · ירושת-theme · כלל-קינון | כן | assembly ratchet |
| החלפת-ערכה גלובלית | `DsActive` חוט-יחיד · accent מורף, gold/error קבוע | כן | golden שוויון-טוקנים |

## 10. סדר-בנייה (כל פאזה: additive · דגל · משטרה-ירוקה · golden)

1. **DATA:** להרחיב `palette.mjs`+`theme-wiring.mjs` לסולם-Pure הכהה + 3 ערכות-אקצנט + סמנטי-קבוע. + שער golden שוויון-טוקנים מול ה-HTML (חוק-4). *(אין צרכנים → ביט-זהה)*
2. **ENGINE:** `ds-pure.mjs`→`ds_pure.dart` דורמנטי + בורר `DsActive` (ברירת-מחדל=היום).
3. **SLOTS:** לקדם 110 האטומים העיוורים לחוזה-ה-slots + מניפסט `AtomStyle` ב-atlas.json (לפי 83 הפרימיום). rethread-צרכנים באותה נחיתה (L29).
4. **OVERRIDE:** `DsStyle?` + `design-overrides.json` + טביעת instance-id ב-`buildCall` + אלגוריתם-הכרעה.
5. **BINDER:** ה-binder חוצה-המשפחה בקופסה (4 כללים+2 נעילות+מגן-ניגוד).
6. **GENERATOR:** `looks.json` + `pickLook()` + הזרקה ב-3 הנקודות + ברירת-מחדל ביט-זהה.
7. **COMPOSITE:** עטיפת עץ-ההזחה של `genesis-gen` ב-STAGE + כלל-קינון.
8. **CUTOVER:** הפיכת `DsActive`→Pure מאחורי דגל, כשה-golden ירוק והצי מאושר.

## 11. פתוח להכרעת-בעלים

- **[Q1]** להצליב את משפחות Action/Input (שנבנו מ-atom-index של hei-rxv1v1) מול `atlas.json` של mah-kora — לאחד רישום.
- **[Q2]** האם הפלטות = פר-ארגון בקונפיג (כמו maor `config.accent`) או קטלוג-מראות גלובלי? (משפיע על שכבה A ו-LAW-6).
- **[Q3]** עורך-ויזואלי לבעלים (click→כותב `instances[key]`) — עכשיו או אחרי שהצינור עובד?
- **[Q4]** כמה מראות פר-אטום נחשוף בקטלוג ההתחלתי (רק signature-looks של Pure, או כל 13 המשפחות)?
- **[Q5]** golden: שוויון-טוקנים (זול, אכיף) עכשיו, ו-screenshot-parity (chromium מול Flutter-web) בהמשך — לאשר.
