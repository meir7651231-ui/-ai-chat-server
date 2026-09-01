# PURE — חוזה שפת-עיצוב מלא (Visual Spec)
> מקור: pure-design-language.zip · **המסמך הזה הוא החוק לקטלוג ה-HTML.** לא דשבורד. לא מוצר. לא דאטה מדומה.
> נשמר כמסמך-הסמכות הרשמי (2026-09-01). כל משפחה נבדקת מולו לפני "Done".

## 0. מה מותר ומה אסור
**מותר:** קובץ משפחה אחד לארכיטיפ. טיפוס קנוני + חתימות + יורשים ב-chips.
**אסור:** דשבורד · טבלת מוצר · ₪ · שם עסק · רשומה · אימוג'י במקום SVG · 13 ארכיטיפים בקובץ אחד כ«מקסימום».
**אסור:** לסמן PASS עצמי · family-N מאפס אם נכשל סעיף אחד.
`zero` = חוב באינדקס (אריח dashed). `self` = פקד שהקלדה היא הדאטה. **לא לערבב.**
תוכן רק: **Label / Value / Meta / Action / Option / Title / Add…**
מספרים LTR + tnum. המסמך RTL.

## 1. טוקנים (מקור אמת יחיד)
**נייטרל קבוע:** `--canvas #0C0C0E · --sunken #0A0A0C · --surface #151517 · --raised #1B1B1E · --raised2 #212126 · --ink #ECE9E2 · --mut #9B968C · --faint #6E6A62 · --hair/--hair2`
**סמנטי קבוע (לא ממורף):** `--ok #43D08C · --warn #E6B84F · --err #E0574E`
**אקצנט ממורף יחד** (t-indigo / t-teal / t-amber): `--a --a-hi --a-800 --gl --c2 --c3`
**פונטים:** Fraunces (לטינית) · Frank Ruhl Libre (עברית כותרת) · Space Grotesk (utility) · Heebo (גוף).
מתג ערכה אחד למעלה · `getBoundingClientRect` למיקום ה-pill · החלפת-ערכה = מבנה לא זז · Gold נשאר זהב · ok/warn/err לא הופכים לסגול · `reduced-motion` מכבה pulse/shimmer/flip/float/blink.

## 2. כלל-העל
אטום עבר רק אם: (א) מזוהה בלי לקרוא שם · (ב) גימור-לייבררי: ≥44px, ניגוד ≥4.5:1, focus-visible, RTL נכון · (ג) מצבים חיים היכן שרלוונטי.
שני אטומים זהים חוץ מהשם = אחד קנוני + השני יורש ב-chip (לא גריד כפול). איקון-לבד על אותו כפתור ×20 = **Fail**.

## 3. מודל קובץ-משפחה
קנוני אחד עם תיאטרון-מצבים · עד ~8 חתימות שנבדלות בצורה/גימור · השאר inherit→chips · תאים רחבים ל-Card/Row/Sheet/Overlay (לא minmax(188) על הכל).

## 4. חוקים לפי ארכיטיפ

**01 CARD/SURFACE** — Flat≠Elevated בעין (מילוי+צל) · Outlined=קו · Glass=blur · Gradient=c2→a→c3 דיו-כהה · Spotlight=הילת-עכבר · Hero=type-גדול+aura · Stat tnum, up=ok/down=err קבועים, KPI עם spark, Strip 4-up · Record=אווטאר+Title+Meta+KV · Hub לחיץ + selected פס inset-inline-start · Product מדיה-למעלה · Accordion open/closed · נקודת-סטטוס תמיד עם Label.

**02 ACTION** — *נסגר.* PrimaryBtn תיאטרון 6-מצבים · מקס' 8 Filled · Gold/Glass/Neon/Soft/Grad/Pulse נבדלים בלי שם · Card-tile/SwitchRow/Segmented מלא-רוחב · FabAction/FabMenu/DsToggleTile=zero · Cart=SVG.

**03 COMPOSITE** — לא אוסף-תאים. במה אחת: 2–4 אטומים מחוברים (Hero+Stat+Action, Carousel+Pager) · ריתמוס קבוע · בלי דשבורד-מלא · בלי דאטה-דומיין.

**04 SELECTION/CHIP** — unselected≠selected בלי שם (מילוי/קו/V) · single מול multi · מונה על צ׳יפ כשצריך · **no-color-alone** (אין צבע בלי תווית/איקון) · Segmented מחוון getBoundingClientRect.

**05 LIST/ROW** — hover + selected-bar ב-inset-inline-start (RTL) · צפיפות default/compact · פעולת ⋯ עם תפריט (לא אימוג'י) · יעד 44px · מספרים LTR.

**06 DATAVIZ** — ערך tnum · count-up מותר (כבוי ב-reduced-motion) · קשת/טבעת לפי ניגוד על הקנבס · לא צבע-דקורטיבי בלי מקרא/ערך · Series=תג series · בלי מטבע.

**07 INPUT** — *נסגר.* DsField תיאטרון (empty באמת ריק+placeholder faint · focus aura · filled · error+alert · disabled) · Premium float+aurora · Glow≠focus · Search≠InputBar · Date/Number/Enum affordance שונה · Stepper קנוני+boxed+smart+inherit · Slider native חי · DualRange שני-thumbs חיים · OTP caret · PinPad SVG delete · TagInput מוחק · self≠zero.

**08 FEEDBACK/OVERLAY** — *נסגר.* Toast ב-dock מעל תוכן-דמה · Modal מעל scrim-מוכל · Sheet מלמטה רדיוס-עליון · Banner info-ממורף/ok-warn-err-קבוע · Empty קנוני=אייקון+Title+Meta+Action+inherit · Skeleton shimmer · Progress linear/ring/spin/dots/story נבדלים · Badge נקודה≠מונה · Tooltip בועה≠hint-שורה.

**09 HEADER/SECTION** — eyebrow + היררכיית-type (Title>Meta) · sticky מוכח בבמה-קצרה (לא כל הדף) · crumb שייך גם ל-10 · Toolbar=פעולות-בשורה (לא כותרת לבד).

**10 NAV** — *נסגר.* Tabs underline≠pill, מחוון getBoundingClientRect, חצים · Breadcrumb מפריד ‹ אחרון-current · Menu selected פס-RTL · Bottom≠Rail · Badge על אייקון-אחד ב-Bottom · Pager חי · Fab סגור≠פתוח.

**11 TEXT** — סולם-type קבוע · 3 דרגות-דיו ink/mut/faint · GradientText ממורף · KvLine Label/Value · כיוון RTL/LTR לפי תוכן.

**12 MEDIA** — Avatar=ראשי-תיבות או placeholder (לא פנים-מדומות של אדם אמיתי) · conic-ring/status-dot על אווטאר · stack חופף · Thumb יחס-קבוע · IconGrid ריווח-אחיד.

**13 STATUS** — Dot+Label · LiveDot pulse (כבוי ב-reduced-motion) · אין נקודה בלי הקשר · Loader≠Dot.

**14 TEMPORAL** — MiniCalendar גריד-חודש RTL (מספרי-יום LTR+tnum) · WeekStrip · DateCell תיאטרון (default/today/selected/event/disabled) · CountdownTimer/LiveClock tnum-מתקתק · MetaTicker (Label·Value, reduced-motion פארק) · today/selected=accent · live=--ok קבוע.

**נספח · SPATIAL · DATA** (לא ארכיטיפ) — שכבה מעל 01 Card + 05 List + 06 DataViz: המשטחים שמחזיקים הרבה רשומות בבת-אחת. MapSurface טרֵין-מופשט (אפס-גאוגרפיה, אפס שם-עיר/מדינה) + markers(default/selected/cluster/disabled)+route+rnode · DataTable **מיון-חי** (לחיצה על header-Value ממזגת שורות asc/desc; zebra מחושב-מחדש; שורה-נבחרת פס inset-inline-start(RTL)+tint; עמודת-Value tnum LTR; תא-Status dot+Label ok/warn/err קבועים) · SortHeader theater(unsorted/asc/desc) · Minimap viewport-rect · TreeGrid **caret-חי** (open/close ילדים רקורסיבי, leaf ללא-פעולה) tnum · תוכן Label/Value/Meta בלבד · אפס דומיין/מטבע/דשבורד · יורשים(Carousel→03 · Pagination→10 · Legend · ColumnResize) ב-chip.

**נספח · MOTION** (לא ארכיטיפ) — שכבת-תנועה מעל 13 הארכיטיפים: aurora/particles/organism/pulse/sweep/tilt/typewriter/confetti · accent ממורף · נקודת-live קבועה (--ok) · **reduced-motion מקפיא כל תא** · canvas לגנרטיבי · תוכן Label/Value/Meta/Action · 8 תאים תפקיד-אחד-לכל.

## 5. נגישות (פסילה)
ניגוד ≥4.5:1 · יעד ≥44px (איקון-מעגל ≥40) · focus-visible · Tab/Enter/Space · error=`aria-invalid`+`role="alert"` · reduced-motion.

## 6. איך עובדים מכאן
`index.html` = מפת-משפחות בלבד (לא לייבררי-אחידה) · `pure-lib.html` = חוק-ויזואלי ישן (לא לעדכן כמקסימום) · משפחה שסומנה **נסגר** — לא סיבוב חדש בלי באג-בעין · `atlas.json` הוא הרישום-החי (לא atom-index.json אם חסר בענף) · אטום-בקוד = קובץ-אחד, טוקנים-בלבד, תוכן-ב-seam, בלי דומיין.

**Done לכל משפחה** = גוללים ואין בלוק-כפול · חתימות נקראות בלי שם · מתג-ערכה ממורף רק אקצנט.
