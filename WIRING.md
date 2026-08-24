# WIRING — מפת-החיווט החיה של Genesis
> **מחולל אוטומטית מה-imports — אל תערוך ידנית** (`node machtzev/gen-wiring-doc.mjs`).
> כל קופסה: אילו חוטים היא מחווטת + ההכרעה-החתומה שלה (מהחוזה) + הזהב שלה.

**מלאי:** 663 אטומים · 22 קופסאות · מחווטים: 128/663 (19%)

## #a11y
הקופסה של סולם-הגופן ומתגי-הנגישות (P2 פער 31) — זום 0.8–1.6 בצעדי 0.1
- **חוטים (7):** scale-min · scale-max · scale-step · a11y-fab-toggles · clamp-scale · step-scale · parse-acc
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #audit

- **חוטים (11):** audit-cat-colors · audit-categories · phone-issue · run-audit · audit-report-lines · term-of · norm-name · norm-search · valid-israeli-id · age-of · supporter-aggregates
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #caller-id

- **חוטים (5):** phone-key · find-caller · caller-kind-label · family-context · term-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #custom-export
הקופסה של מסך "דו"ח מותאם" — יעד (חוגים/אירועים/תומכות) + טווח-תאריכים
- **חוטים (26):** exp-field-defs · override-column · build-custom-export · feature-on · module-on · term-of · feat-label · item-label · unit-label · stage-label · sessions-of · enroll-count · heb-parts · heb-annual-eq · heb-date-full · gematria · gem-year · sup-count · sup-ils · sup-usd · sup-last · sup-total-ils · sup-score · sup-tier · ev-meta · day-names
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #date-util
הקופסה של ‏maor/src/lib/date-util.ts — ארבעת חוטי-התאריך מחווטים
- **חוטים (4):** iso-local · iso-today · iso-days-ago · date-in-range
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #export-gate
נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8
- **חוטים (3):** set-export-blocked · export-allowed · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #export-rows

- **חוטים (9):** families-import-format-rows · supporters-import-format-rows · events-csv-rows · term-of · heb-date-full · gematria · gem-year · heb-parts · ev-meta
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #guide
הקופסה של תוכן-המדריך — הקבועים מילה-במילה + שתי פונקציות-ההתאמה-פר-עסק,
- **חוטים (8):** guide-intro-label · guide-intro · guide-sections · guide-recipes-label · guide-recipes · guide-foot · guide-sections-of · term-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #hebdate
המרות עברי↔לועזי דרך Intl בלבד — המערכת שומרת ISO לועזי; העברי = שכבת
- **חוטים (10):** heb-parts · pad2 · month-he-of · month-en-of · heb-year-now · is-heb-leap-year · heb-months-of · heb-to-iso · iso-to-heb-parts · validate-heb-month-names
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #hebrew-calendar
התאריך העברי המלא מקצה-לקצה. החיווט (=ההכרעות) שחי כאן:
- **חוטים (4):** gematria · heb-parts · heb-month-he · adar-norm
- 🛡 מגן-הכרעה: — · 🏆 רתמת-זהב: ⏳

## #hebrew
כל ה-API הציבורי של הלוח העברי — maor/src/lib/hebrew.ts (מקור-האמת, L4) —
- **חוטים (9):** gematria · gem-year · adar-norm · heb-annual-eq · heb-parts · heb-parts-of-iso · heb-date-full · holidays · holiday-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #names-export
הקופסה של הכפתור מהדוגמה — "⬇ ייצוא CSV" ממסך מעקב-הטיפול.
- **חוטים (3):** csv-escape · to-csv · is-admin
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #navhist
הקופסה של פיצ'ר `shell.navhist` (P1.5) — מחסנית "↩ חזרה" של 20 צעדים
- **חוטים (5):** same-loc · push-nav · push-recent · nav-hist-max · recent-max
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #search
חיפוש-חכם מלא: נרמול עברי + תעתיקים (עברית/אנגלית/רוסית/כינויים) +
- **חוטים (11):** levenshtein · norm-search · xlat · rule-exact · rule-prefix · rule-plural · rule-contains · rule-skeleton · rule-typo · smart-score · smart-filter
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ✅

## #signup-wizard
הקופסה של אשף-ההרשמה 5-השלבים של אורביט (SIGNUP3): תחום → גודל →
- **חוטים (11):** vertical-packs · wizard-industries · org-sizes · org-needs · wizard-steps · empty-wizard · wizard-step-error · sign-up-error · industry-label · size-label · need-label
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #smtp-url
הלקוח מקליד כתובת-מייל + סיסמת-אפליקציה — הקופסה מרכיבה לבד את
- **חוטים (3):** smtp-hosts · smtp-host-for · compose-smtp-url
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #templates
הקופסה של `maor/src/lib/templates.ts` (ROADMAP-100 ‏#12) — נוסחי-הוואטסאפ
- **חוטים (3):** template-defs · template-keys · render-template
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #theme
מחווטת תפקידים (שקעים: ‎--bg, ‎--ink…) לפיגמנטים מהפלטה, פר-מצב
- **חוטים (1):** palette
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #tour
הסיור-המודרך (spotlight) על המסכים האמיתיים — תסריט-הלגאסי מילה-במילה,
- **חוטים (5):** tour-stop-label · tour-steps · tour-advance · spotlight-box · term-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #validate
בדיקות-תקינות לקלט ישראלי: ת"ז (לוהן מותאם) · טלפון (נרמול-זיהוי + עיצוב-תצוגה,
- **חוטים (6):** valid-israeli-id · normalize-phone · format-israeli-phone · norm-search · norm-name · name-sort-key
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #vertical-packs

- **חוטים (3):** vertical-packs · commercial-off · apply-vertical-pack
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #wa
הקופסה של הרחבת-`whatsapp` — קישורי wa.me click-to-chat + נוסחי-ההודעה,
- **חוטים (7):** wa-digits · wa-link · wa-delivery-text · wa-payment-text · wa-birthday-text · render-template · template-defs
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## אטומים-במלאי (טרם-חווטו): 535
_ההתקדמות האמיתית = אחוז-המחווט (L10)._
