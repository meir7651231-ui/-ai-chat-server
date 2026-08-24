# WIRING — מפת-החיווט החיה של Genesis
> **מחולל אוטומטית מה-imports — אל תערוך ידנית** (`node machtzev/gen-wiring-doc.mjs`).
> כל קופסה: אילו חוטים היא מחווטת + ההכרעה-החתומה שלה (מהחוזה) + הזהב שלה.

**מלאי:** 665 אטומים · 62 קופסאות · מחווטים: 603/665 (91%)

## #a11y
הקופסה של סולם-הגופן ומתגי-הנגישות (P2 פער 31) — זום 0.8–1.6 בצעדי 0.1
- **חוטים (7):** scale-min · scale-max · scale-step · a11y-fab-toggles · clamp-scale · step-scale · parse-acc
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #annual-report
הקופסה של `lib/annualReport.ts` (ROADMAP-100 ‏#4) — מסמך-ריכוז של
- **חוטים (5):** donation-years · donations-of-year · annual-report-lines · annual-all-lines · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #audit

- **חוטים (11):** audit-cat-colors · audit-categories · phone-issue · run-audit · audit-report-lines · term-of · norm-name · norm-search · valid-israeli-id · age-of · supporter-aggregates
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #ayin
קופסת-החיווט של מודול-העין — כל הלוגיקה הטהורה של `feature supporters.ayin`
- **חוטים (32):** ayin-stages · stage-label · feat-label · item-label · unit-label · stage-index · next-stage · revert-patch · norm-name · ayin-active · eyes-total · boq-line-amount · boq-total · time-hours-total · time-cost-total · mat-cost-total · names-to-template-lines · template-lines-to-names · ayin-action-visible · ayin-advance-label · plan-ayin-advance · plan-add-name · ayin-daily-rows · ayin-all-rows · ayin-board-items · filter-ayin-board · ayin-sheet-header · ayin-sheet-rows · parse-ayin-sheet · apply-ayin-sheet · term-of · norm-search
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #caller-id

- **חוטים (5):** phone-key · find-caller · caller-kind-label · family-context · term-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-crypto
הקופסה שמחווטת את מנוע הצפנת-הענן הדורמנטית של מאור — הצפנה/פענוח
- **חוטים (6):** is-enc-doc · encrypt-doc · decrypt-doc · create-cloud-key · open-cloud-key · is-encrypted
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-diff
המנוע-הטהור שמחשב מה לדחוף ל-Firestore — מודל: אוסף פר-סוג-ישות
- **חוטים (11):** entity-collections · col-path · meta-path · env-path · donations-col · donations-path · strip-supporter-donations · meta-of · diff-db · full-db-diff · empty-diff
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-merge
קופסת-החיבורים של צד-הקבלה בסנכרון-הענן — מחווטת 4 חוטים טהורים
- **חוטים (5):** entity-collections · sanitize-incoming · merge-donations-preserving · apply-entity-partial · apply-meta-partial
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #components-courses
הקופסה של מודול-החוגים — מחווטת את חוטי `courses/lib.ts` (ימים, מפגשים,
- **חוטים (60):** fmt-date · iso-today · iso-local · default-course-dates · presents-in-month · course-date-error · age-of · term-of · norm-search · day-names · day-letters · sessions-of · groups-hint-from-audience · courses-of-teacher · rooms-now · group-label-of · group-remap-on-removal · group-options-of · plan-word · price-suffix · model-meta · weeks-per-month · pricing-terms · term-label · lessons-in-term · lesson-price-for-tier · lesson-tier-options · weighted-quote · enrollment-quote · paid-of · pay-bal · enrollment-paid-status · enroll-count · duplicate-course · pending-makeups · waitlist-for · next-session-date · sheet-roster · sheet-summary · other · other-label · add-teacher · cat-options · semester-options · pay-methods · tints · enroll-status-meta · plan-label-of · chip-style · grade-order · grade-index · grade-fits · course-fits-member · schedule-clash-text · enroll-new-family · offer-new-family · resolve-enroll-family · punch-confirm-ms · punch-confirm-step · wheel-index-under-pointer
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #csvx
קופסת עזרי-ה-CSV המשותפים — ייצוא (בריחת-תא + הגנת-הזרקה + BOM),
- **חוטים (7):** csv-escape · to-csv · decode-csv-buffer · read-csv-file-text · parse-csv · parse-any-date · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #custom-export
הקופסה של מסך "דו"ח מותאם" — יעד (חוגים/אירועים/תומכות) + טווח-תאריכים
- **חוטים (26):** exp-field-defs · override-column · build-custom-export · feature-on · module-on · term-of · feat-label · item-label · unit-label · stage-label · sessions-of · enroll-count · heb-parts · heb-annual-eq · heb-date-full · gematria · gem-year · sup-count · sup-ils · sup-usd · sup-last · sup-total-ils · sup-score · sup-tier · ev-meta · day-names
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #date-util
הקופסה של ‏maor/src/lib/date-util.ts — ארבעת חוטי-התאריך מחווטים
- **חוטים (4):** iso-local · iso-today · iso-days-ago · date-in-range
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #dedup
זיהוי כפילויות ומיזוגן — משפחות ותורמים — בשמירה מלאה של נתונים
- **חוטים (17):** norm-phone · norm-id · find-duplicate-groups · merge-families · dup-fields · dup-field-value · merge-families-by-fields · find-supporter-dup-groups · merge-supporter-into · merge-supporters-group · sup-dup-fields · sup-dup-field-value · merge-supporters-by-fields · merge-hist · photo-max · name-sort-key · norm-search
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #dialer
מכונת-המצב של קמפיין-שיחות מ-`maor/src/lib/dialer.ts` — תור לפי-סדר,
- **חוטים (14):** requeue-outcomes · terminal-outcomes · outcome-labels · start-campaign · current-id · apply-outcome · progress · is-done · undo-last · call-log-cap · append-call · pop-call · call-stats · campaign-csv-rows
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #diary

- **חוטים (22):** fmt-date · iso-local · iso-today · week-day-names · pad2 · time-to-min · min-to-hm · group-label-of · absence-reason-chips · makeup-eligibility · block-reason · build-slots · enrollments-for-session · weekly-room-sessions · inactive-room-courses · chip-style · room-info-label · heb-parts · holidays · sessions-of · term-of · plan-word
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #distribution
מודול מתנדבים · יום-חלוקה · מסירות. מחווט את 14 חוטי-SHOP7 במקום אחד.
- **חוטים (12):** advance-status · deliveries-of-day · deliveries-of-volunteer · eligible-assignments-for-day · day-progress · volunteer-load-hint · deliveries-of-family · pending-deliveries-today · delivery-list-lines · deliveries-csv-rows · volunteer-route-stops · term-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #donation-partition
שכבת-פיצול-תרומות (מסלול-B) — פירוק `Supporter.donations[]` למסמכי-ענן
- **חוטים (6):** shared-purpose-key · purpose-key-of · don-allowed-keys · explode-supporter · reassemble-donations · donation-partition-diff
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #export-gate
נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8
- **חוטים (3):** set-export-blocked · export-allowed · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #export-rows

- **חוטים (9):** families-import-format-rows · supporters-import-format-rows · events-csv-rows · term-of · heb-date-full · gematria · gem-year · heb-parts · ev-meta
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #families

- **חוטים (22):** fmt-date · iso-today · iso-local · age-of · status-meta · cred-red-threshold · cred-help-text · tier-of · fam-enrollments · fam-live-enrollments · finder-axes · finder-axis-value · finder-matches · num-match · fam-history-of · marital-options · language-options · other · other-label · chip-style · marital-chip-style · term-of
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

## #ics-feed
מנוי-יומן חי (הרחבת gcal, 9.8) — במקום קובץ-ICS חד-פעמי, המערכת
- **חוטים (4):** mint-feed-token · read-ics-feed-token · publish-ics-feed · ics-feed-url
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #image-pick
שתי זרימות של פיצ׳ר-הגלריה/ההטמעה, מחווטות במקום אחד:
- **חוטים (3):** max-upload-bytes · max-embed-bytes · read-file-as-data-url
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-ai
קופסת הרחבת 🤖 `ai` ("עד-המפתח") — כל מה שהיה מולחם ב-`maor/src/lib/ai.ts`
- **חוטים (2):** thanks-prompt · ask-claude
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-cloud-config

- **חוטים (37):** platform-orgs · platform-requests · platform-leads · support-chats · team-chats · org-secret-keys · support-msg-max · fetch-org-cloud-config · watch-org-cloud-config · write-org-cloud-doc · write-org-cloud-config · write-org-secrets · read-org-secrets-meta · delete-org-request · write-org-request · fetch-org-requests · find-member-org-slugs · fetch-all-orgs · write-org-join-request · fetch-org-join-requests · delete-org-join-request · delete-org-member-config · clear-employee-field · add-org-member · remove-org-member · delete-org-completely · write-org-lead · fetch-org-leads · send-support-message · send-support-reply · watch-support-messages · watch-support-thread-meta · watch-all-support-threads · mark-support-read · send-team-message · watch-team-messages · sanitize-support-text
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-cloud
לוח-החיבורים של `maor/src/lib/cloud.ts` (770ש). כל 36 חוטי-הענן
- **חוטים (27):** set-cloud-scope · set-allowed-purposes · col-path · meta-path · env-path · donations-path · entity-collections · encrypt-doc · decrypt-doc · shared-sup-key · shared-purpose-key · sup-keyed-cols · sup-key-of · sup-key-map-of · doc-skey · strip-audit-meta · strip-sup-key · sup-allowed-keys · don-allowed-keys · full-db-diff · cloud-db · sign-out-cloud · push-diff · read-cloud-envelope · write-cloud-envelope · encrypt-existing-cloud · migrate-supporters-to-keyed
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-config

- **חוטים (27):** module-on · feature-on · donation-split-on · sup-enforce-on · integration-on · telephony-on · integration-setting · safe-https-url · term-of · normalize-telephony · make-normalize-site · make-normalize-config · public-site-on · role-of · teacher-id-of · is-admin-user · can-granted-action · is-super-admin · sign-up-error · employee-sign-up-error · cloud-cfg-cache-key · resolve-org-config · org-slug-from-url · is-safe-accent · default-favicon · favicon-data-uri · apply-config
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-crypto
ספריית ההצפנה-במנוחה (opt-in) של מאור — AES-GCM 256 עם DEK
- **חוטים (7):** gen-recovery-key · encrypt-db · is-encrypted · open-dek · decrypt-db · reencrypt-db · rewrap-password
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-ics
קופסת-החיווט של `maor/src/lib/ics.ts` — ‏4 חוטי-הפורמט של קובץ-היומן
- **חוטים (4):** ics-escape · fold-ics-line · build-ics · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-lock
קופסת נעילת-ה-PIN של maor — מה שהיה מולחם ב-`src/lib/lock.ts`
- **חוטים (6):** lock-zones · default-lock-zones · lock-key · is-valid-pin · hash-pin · verify-pin
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-nedarim-sync
מנוע-הסנכרון נדרים→מאור (כיוון-נכנס) — מתאים כל תורם/עסקה לכרטיס-התומך
- **חוטים (19):** norm-id · norm-phone · norm-search · name-sort-key · clearing-providers · provider-clearer · charge-to-hist · charge-dedup-key · with-nedarim-hok · detect-recurring-hok · candidate-supporters-for-charge · fill-card-from-charge · attach-charge-to · relabel-hist-by-txn · repair-cards-from-rows · strong-match-for-charge · auto-match-charges · attach-charges-bulk · plan-nedarim-sync
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-pwa
קופסת-החיבורים של מודול ה-PWA — רישום service-worker, זיהוי מצב-התקנה,
- **חוטים (4):** install-available · prompt-install · is-ios · feature-on
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #names-export
הקופסה של הכפתור מהדוגמה — "⬇ ייצוא CSV" ממסך מעקב-הטיפול.
- **חוטים (3):** csv-escape · to-csv · is-admin
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #navhist
הקופסה של פיצ'ר `shell.navhist` (P1.5) — מחסנית "↩ חזרה" של 20 צעדים
- **חוטים (5):** same-loc · push-nav · push-recent · nav-hist-max · recent-max
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #net-check
הקופסה של מאבחן-החסימות — בודקת מהדפדפן אילו נקודות-קצה נגישות
- **חוטים (2):** run-net-check · net-check-script
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #photo-gallery

- **חוטים (7):** photo-max · photo-max-dim · photo-max-len · can-add-photo · is-data-image · fit-dimensions · sanitize-photos
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #platform

- **חוטים (24):** slugify · is-valid-slug · all-modules · module-labels · all-off-config · org-link · norm-email · gen-join-code · org-join-link · org-join-full-code · parse-join-full-code · is-org-manager · org-enabled-modules · org-enabled-features · is-member · override-of · grantable-staff-features · is-grantable-feature · effective-config-for · allowed-designations-for · can-issue-receipt · approve-member · set-employee-override · remove-member
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #pricing
מחווטת את מנוע-התמחור המלא של המטמיע — טבלת-מחירי-ברירת-מחדל,
- **חוטים (6):** default-prices · size-labels · normalize-prices · compute-quote · shekel · all-modules
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #public-site
מנוע האתר-הציבורי (טהור, בלי store/DOM) — פותר טקסט רב-לשוני,
- **חוטים (11):** is-rtl-lang · coral-palette · site-palette · site-vocab · resolve-localized · site-langs · site-ui · site-ui-labels · site-campaign-progress · has-public-site · site-donate-url
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #receipt
מסירת-קבלה שלמה — התוכן הטהור (שורות/HTML/קוד-אימות/פורמט) + נתיבי-המסירה
- **חוטים (12):** receipt-verify-code · receipt-lines · receipt-html · receipt-fmt-of · deliver-receipt · heb-date-full · feature-on · module-on · gematria · gem-year · heb-parts · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #reenroll

- **חוטים (16):** academic-year-label · next-year-dates · renew-of · is-renewed · enroll-summary · build-reenroll-rows · reenroll-counts · renew-targets · fresh-next-year-enrollment · next-year-course-draft · student-history · student-history-text · reenroll-csv-rows · reenroll-list-text · pay-bal · paid-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #reports

- **חוטים (12):** fmt-date · in-range · range-label · paid-of · round2 · paid-in-range · balance-of · month-key · month-label · name-index · status-label · count-by
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #search
חיפוש-חכם מלא: נרמול עברי + תעתיקים (עברית/אנגלית/רוסית/כינויים) +
- **חוטים (11):** levenshtein · norm-search · xlat · rule-exact · rule-prefix · rule-plural · rule-contains · rule-skeleton · rule-typo · smart-score · smart-filter
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ✅

## #shop
מחווטת את 31 חוטי-מודול-החנות לכדי ה-API של העמודה. מקור-האמת:
- **חוטים (35):** live-redemptions · item-of · holiday-allowed · item-remaining · effective-price · max-discount-pct · upcoming-holidays · holiday-names · assignment-redeemed · component-remaining · coupon-expiry · shop-holiday-due-days · needs-care-shop · shop-expiry-warn-days · expiring-intakes · upcoming-meetings · given-value · collected-paid · subsidy-total · product-assignments · component-redeemed-now · filter-assignments · filter-products · filter-items · filter-redemptions · intake-log · eligible-families · distribution-list-lines · redemptions-csv-rows · beneficiary-label · component-counts · term-of · date-in-range · heb-parts · iso-local
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #signup-wizard
הקופסה של אשף-ההרשמה 5-השלבים של אורביט (SIGNUP3): תחום → גודל →
- **חוטים (11):** vertical-packs · wizard-industries · org-sizes · org-needs · wizard-steps · empty-wizard · wizard-step-error · sign-up-error · industry-label · size-label · need-label
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #smtp-url
הלקוח מקליד כתובת-מייל + סיסמת-אפליקציה — הקופסה מרכיבה לבד את
- **חוטים (3):** smtp-hosts · smtp-host-for · compose-smtp-url
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #sup-partition
שכבה טהורה שאוכפת ייעוד-פר-תורם (`forWho`) בשכבת-הנתונים — מזריקה
- **חוטים (8):** shared-sup-key · sup-key-of · sup-keyed-cols · doc-skey · sup-key-map-of · sup-allowed-keys · strip-sup-key · strip-audit-meta
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #support-chat

- **חוטים (9):** support-msg-max · sanitize-support-text · is-sendable-support-text · sort-support-msgs · support-msg-time · support-day-label · support-preview · support-unread · sort-team-msgs
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #supporters

- **חוטים (45):** fmt-date · supporter-purposes · supporter-visible-for-designations · all-donation-purposes · sup-ils · sup-usd · sup-count · sup-last · sup-last-in-period · sup-total-ils · sup-score · sup-tier · tier-order · sup-score-bins · sup-avg-don · sup12m · chip-style · fix-phone · total-label · sup-don-events · personal-cal-entries · org-cal-entries · don-cal-month-line · norm-name · sup-name-keys · excel-serial-to-iso · parse-supporter-grid · parse-supporter-csv · apply-ayin-names · merge-hist · plan-supporter-import · merge-supporter-row · new-supporter-from-row · hok-cat · hok-effectively-active · hok-recorded-this-month · hok-due · hok-monthly-total · hok-method-label · term-of · norm-search · format-israeli-phone · parse-any-date · parse-csv · plan-add-name
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #telephony
הגשר בין אשף-ההקמה של מאור למנוע-הטלפוניה הטהור. ממיר שדות-אשף
- **חוטים (6):** empty-telephony-config · to-tenant-id · telephony-to-tenant · preview-telephony · next-closure · explain-one
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

## #tzedaka
קופסת-החיווט של מנוע קופות-הצדקה. כל 19 החוטים של
- **חוטים (23):** tz-score-rules · tz-stale-days · last-collection-iso · collection-score-delta · box-total · coordinator-boxes · coordinator-total · grand-total · campaign-total · stale-boxes · needs-care-tzedaka · leaderboard · campaign-progress · filter-coordinators · boxes-overview · filter-collections · coordinator-print-lines · collections-csv-rows · build-tz-grid · term-of · date-in-range · iso-local · week-day-names
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #validate
בדיקות-תקינות לקלט ישראלי: ת"ז (לוהן מותאם) · טלפון (נרמול-זיהוי + עיצוב-תצוגה,
- **חוטים (6):** valid-israeli-id · normalize-phone · format-israeli-phone · norm-search · norm-name · name-sort-key
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #vcard-import

- **חוטים (4):** parse-vcards · is-junk-contact · importable-contacts · contact-to-row
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #vertical-packs

- **חוטים (3):** vertical-packs · commercial-off · apply-vertical-pack
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #wa
הקופסה של הרחבת-`whatsapp` — קישורי wa.me click-to-chat + נוסחי-ההודעה,
- **חוטים (7):** wa-digits · wa-link · wa-delivery-text · wa-payment-text · wa-birthday-text · render-template · template-defs
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #worktasks
מנוע משימות-העבודה (WORKPREP) — סינון-פר-עובדת, מיון-עדיפות,
- **חוטים (7):** task-identity · open-tasks-for · done-today-for · task-overdue · task-stats-for · overdue-contact-task-drafts · pri-labels
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## אטומים-במלאי (טרם-חווטו): 62
_ההתקדמות האמיתית = אחוז-המחווט (L10)._
