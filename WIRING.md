# WIRING — מפת-החיווט החיה של Genesis
> **מחולל אוטומטית מה-imports — אל תערוך ידנית** (`node machtzev/gen-wiring-doc.mjs`).
> כל קופסה: אילו חוטים היא מחווטת + ההכרעה-החתומה שלה (מהחוזה) + הזהב שלה.

**מלאי:** 1114 אטומים · 64 קופסאות · מחווטים: 986/1114 (89%)

## #a11y
הקופסה של סולם-הגופן ומתגי-הנגישות (P2 פער 31) — זום 0.8–1.6 בצעדי 0.1
- **חוטים (8):** scale-min · scale-max · scale-step · a11y-fab-toggles · clamp-scale · step-scale · step-scale-strings · parse-acc
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #annual-report
הקופסה של `lib/annualReport.ts` (ROADMAP-100 ‏#4) — מסמך-ריכוז של
- **חוטים (8):** donation-years · donations-of-year · annual-report-lines · annual-report-lines-strings · annual-all-lines · annual-all-lines-strings · guard-export · annual-report-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #audit

- **חוטים (19):** audit-cat-colors · audit-categories · audit-categories-strings · phone-issue · phone-issue-strings · run-audit · run-audit-strings · audit-report-lines · audit-report-lines-strings · term-of · integration-setting-strings · norm-name · norm-search · norm-search-strings · valid-israeli-id · valid-israeli-id-strings · age-of · age-of-strings · supporter-aggregates
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #ayin
קופסת-החיווט של מודול-העין — כל הלוגיקה הטהורה של `feature supporters.ayin`
- **חוטים (51):** ayin-stages · stage-label · stage-label-strings · feat-label · feat-label-strings · item-label · item-label-strings · unit-label · unit-label-strings · stage-index · ayin-stages · next-stage · revert-patch · revert-patch-strings · norm-name · ayin-active · ayin-active-strings · eyes-total · boq-line-amount · boq-total · time-hours-total · time-cost-total · mat-cost-total · names-to-template-lines · template-lines-to-names · ayin-action-visible · ayin-action-visible-strings · ayin-advance-label · ayin-advance-label-strings · plan-ayin-advance · plan-ayin-advance-strings · plan-add-name · plan-add-name-strings · ayin-daily-rows · ayin-daily-rows-strings · ayin-all-rows · ayin-all-rows-strings · ayin-board-items · filter-ayin-board · filter-ayin-board-strings · ayin-sheet-header · ayin-sheet-rows · ayin-sheet-rows-strings · parse-ayin-sheet · parse-ayin-sheet-strings · apply-ayin-sheet · apply-ayin-sheet-strings · term-of · integration-setting-strings · norm-search · norm-search-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #caller-id

- **חוטים (10):** phone-key · find-caller · find-caller-strings · caller-kind-label · caller-kind-label-strings · family-context · family-context-strings · term-of · integration-setting-strings · caller-id-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-crypto
הקופסה שמחווטת את מנוע הצפנת-הענן הדורמנטית של מאור — הצפנה/פענוח
- **חוטים (11):** is-enc-doc · is-enc-doc-strings · encrypt-doc · encrypt-doc-strings · decrypt-doc · decrypt-doc-strings · create-cloud-key · create-cloud-key-strings · open-cloud-key · is-encrypted · is-encrypted-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-diff
המנוע-הטהור שמחשב מה לדחוף ל-Firestore — מודל: אוסף פר-סוג-ישות
- **חוטים (16):** entity-collections · col-path · col-path-strings · meta-path · meta-path-strings · env-path · env-path-strings · donations-col · donations-path · strip-supporter-donations · strip-supporter-donations-strings · meta-of · diff-db · full-db-diff · empty-diff · cloud-meta-keys
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #cloud-merge
קופסת-החיבורים של צד-הקבלה בסנכרון-הענן — מחווטת 4 חוטים טהורים
- **חוטים (8):** entity-collections · sanitize-incoming · sanitize-incoming-strings · merge-donations-preserving · merge-donations-preserving-strings · apply-entity-partial · apply-meta-partial · apply-meta-partial-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #components-courses
הקופסה של מודול-החוגים — מחווטת את חוטי `courses/lib.ts` (ימים, מפגשים,
- **חוטים (92):** fmt-date · fmt-date-strings · iso-today · iso-local · default-course-dates · default-course-dates-strings · presents-in-month · integration-setting-strings · course-date-error · course-date-error-strings · age-of · age-of-strings · term-of · integration-setting-strings · norm-search · norm-search-strings · day-names · day-letters · sessions-of · groups-hint-from-audience · groups-hint-from-audience-strings · courses-of-teacher · rooms-now · rooms-now-strings · group-label-of · group-label-of-strings · group-remap-on-removal · group-options-of · group-options-of-strings · plan-word · plan-word-strings · price-suffix · price-suffix-strings · model-meta · model-meta-strings · weeks-per-month · pricing-terms · term-label · term-label-strings · lessons-in-term · lessons-in-term-strings · lesson-price-for-tier · lesson-tier-options · lesson-tier-options-strings · weighted-quote · enrollment-quote · paid-of · pay-bal · enrollment-paid-status · enrollment-paid-status-strings · enroll-count · enroll-count-strings · duplicate-course · duplicate-course-strings · pending-makeups · enroll-count-strings · waitlist-for · waitlist-for-strings · next-session-date · sheet-roster · enroll-count-strings · sheet-summary · other · other-label · add-teacher · cat-options · semester-options · pay-methods · tints · enroll-status-meta · enroll-status-meta-strings · plan-label-of · plan-label-of-strings · chip-style · chip-style-strings · grade-order · grade-index · grade-fits · course-fits-member · course-fits-member-strings · schedule-clash-text · schedule-clash-text-strings · enroll-new-family · enroll-new-family-strings · offer-new-family · resolve-enroll-family · resolve-enroll-family-strings · punch-confirm-ms · punch-confirm-step · punch-confirm-step-strings · wheel-index-under-pointer · wheel-index-under-pointer-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #csvx
קופסת עזרי-ה-CSV המשותפים — ייצוא (בריחת-תא + הגנת-הזרקה + BOM),
- **חוטים (11):** csv-escape · to-csv · decode-csv-buffer · decode-csv-buffer-strings · read-csv-file-text · parse-csv · parse-any-date · parse-any-date-strings · guard-export · csvx-terms · csvx-wiring-data
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #custom-export
הקופסה של מסך "דו"ח מותאם" — יעד (חוגים/אירועים/תומכות) + טווח-תאריכים
- **חוטים (46):** exp-field-defs · exp-field-defs-strings · override-column · build-custom-export · build-custom-export-data · build-custom-export-strings · feature-on · module-on · term-of · integration-setting-strings · feat-label · feat-label-strings · item-label · item-label-strings · unit-label · unit-label-strings · stage-label · stage-label-strings · sessions-of · enroll-count · enroll-count-strings · heb-parts · heb-parts-strings · heb-annual-eq · heb-annual-eq-strings · heb-date-full · heb-date-full-strings · gematria · gematria-strings · gematria-data · gem-year · gem-year-strings · sup-count · sup-ils · sup-usd · sup-last · sup-total-ils · sup-score · sup-score-strings · sup-tier · sup-tier-strings · ev-meta · day-names · nav-module-keys · heb-cal-data · custom-export-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #date-util
הקופסה של ‏maor/src/lib/date-util.ts — ארבעת חוטי-התאריך מחווטים
- **חוטים (4):** iso-local · iso-today · iso-days-ago · date-in-range
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #dedup
זיהוי כפילויות ומיזוגן — משפחות ותורמים — בשמירה מלאה של נתונים
- **חוטים (24):** norm-phone · norm-id · find-duplicate-groups · merge-families · merge-families-strings · dup-fields · dup-fields-strings · dup-field-value · merge-families-by-fields · merge-families-by-fields-strings · find-supporter-dup-groups · merge-supporter-into · merge-supporters-group · sup-dup-fields · sup-dup-fields-strings · sup-dup-field-value · merge-supporters-by-fields · merge-supporters-by-fields-strings · merge-hist · photo-max · name-sort-key · norm-search · norm-search-strings · dedup-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #dialer
מכונת-המצב של קמפיין-שיחות מ-`maor/src/lib/dialer.ts` — תור לפי-סדר,
- **חוטים (17):** requeue-outcomes · terminal-outcomes · outcome-labels · start-campaign · current-id · apply-outcome · progress · is-done · undo-last · call-log-cap · append-call · append-call-strings · pop-call · call-stats · call-stats-strings · campaign-csv-rows · campaign-csv-rows-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #diary

- **חוטים (36):** fmt-date · fmt-date-strings · iso-local · iso-today · week-day-names · pad2 · time-to-min · time-to-min-strings · min-to-hm · min-to-hm-strings · group-label-of · group-label-of-strings · absence-reason-chips · makeup-eligibility · makeup-eligibility-strings · block-reason · block-reason-strings · block-reason-data · build-slots · build-slots-strings · enrollments-for-session · weekly-room-sessions · inactive-room-courses · inactive-room-courses-strings · chip-style · chip-style-strings · room-info-label · room-info-label-strings · heb-parts · heb-parts-strings · holidays · sessions-of · term-of · integration-setting-strings · plan-word · plan-word-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #distribution
מודול מתנדבים · יום-חלוקה · מסירות. מחווט את 14 חוטי-SHOP7 במקום אחד.
- **חוטים (22):** advance-status · pending-deliveries-today-strings · advance-status-data · deliveries-of-day · deliveries-of-volunteer · eligible-assignments-for-day · eligible-assignments-for-day-strings · day-progress · day-progress-strings · volunteer-load-hint · deliveries-of-family · pending-deliveries-today · pending-deliveries-today-strings · delivery-list-lines · delivery-list-lines-strings · deliveries-csv-rows · deliveries-csv-rows-strings · volunteer-route-stops · term-of · integration-setting-strings · shop7-status-labels · distribution-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #donation-partition
שכבת-פיצול-תרומות (מסלול-B) — פירוק `Supporter.donations[]` למסמכי-ענן
- **חוטים (8):** shared-purpose-key · purpose-key-of · purpose-key-of-strings · don-allowed-keys · don-allowed-keys-strings · explode-supporter · reassemble-donations · donation-partition-diff
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #empowerment

- **חוטים (70):** cockpit-days-since · cockpit-days-since-strings · cockpit-at-risk · cockpit-at-risk-strings · cockpit-thanks · cockpit-thanks-strings · cockpit-calls · cockpit-calls-strings · cockpit-hok-tasks · cockpit-hok-tasks-strings · cockpit-feed · cockpit-feed-strings · cockpit-kpis · cockpit-queue · cockpit-collected-this-month · cockpit-progress · cockpit-csv-rows · cockpit-csv-rows-strings · cockpit-work-list-text · cockpit-work-list-text-strings · intel-day-diff · intel-day-diff-strings · intel-donor-scan · intel-donor-scan-strings · intel-rfm-from-scan · intel-rfm-from-scan-strings · intel-churn-from-scan · intel-churn-from-scan-strings · intel-forecast-from-scan · intel-forecast-from-scan-strings · intel-trend-from-scan · intel-trend-from-scan-strings · intel-donor-intel · intel-donor-intel-strings · segments-match-segment · segments-match-segment-strings · segments-segment-counts · segments-segment-counts-strings · portfolio-active-by-month · portfolio-active-by-month-strings · portfolio-portfolio-intel · portfolio-portfolio-intel-data · portfolio-tier-trend-counts · portfolio-tier-trend-counts-strings · portfolio-tier-trend-counts-data · constellation-donor-constellation · constellation-donor-constellation-strings · constellation-donor-constellation-data · commands-build-commands · commands-build-commands-strings · commands-filter-commands · commands-filter-commands-strings · sup-count · sup-last · sup-ils · sup-usd · sup-tier · sup-tier-strings · hok-due · hok-monthly-total · hok-effectively-active · hok-effectively-active-strings · hok-recorded-this-month · hok-effectively-active-strings · hok-cat · hok-cat-strings · org-cal-entries · org-cal-entries-strings · sup-don-events · sup-don-events-strings
- 🛡 מגן-הכרעה: — · 🏆 רתמת-זהב: ⏳

## #export-gate
נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8
- **חוטים (3):** set-export-blocked · export-allowed · guard-export
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #export-rows

- **חוטים (18):** families-import-format-rows · families-import-format-rows-strings · supporters-import-format-rows · supporters-import-format-rows-strings · events-csv-rows · events-csv-rows-strings · term-of · integration-setting-strings · heb-date-full · heb-date-full-strings · gematria · gematria-strings · gematria-data · gem-year · gem-year-strings · heb-parts · heb-parts-strings · ev-meta
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #families

- **חוטים (33):** fmt-date · fmt-date-strings · iso-today · iso-local · age-of · age-of-strings · status-meta · cred-red-threshold · cred-help-text · tier-of · tier-of-strings · fam-enrollments · fam-live-enrollments · enroll-count-strings · finder-axes · finder-axes-strings · finder-axis-value · finder-axis-value-strings · finder-matches · num-match · fam-history-of · fam-history-of-strings · marital-options · language-options · other · other-label · chip-style · chip-style-strings · marital-chip-style · marital-chip-style-strings · marital-chip-style-data · term-of · integration-setting-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #guide
הקופסה של תוכן-המדריך — הקבועים מילה-במילה + שתי פונקציות-ההתאמה-פר-עסק,
- **חוטים (11):** guide-intro-label · guide-intro · guide-sections · guide-recipes-label · guide-recipes · guide-foot · guide-foot-strings · guide-sections-of · guide-sections-of-strings · term-of · integration-setting-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #heb-cal-box

- **חוטים (7):** cycle-hit · lin-cycles · cycle-carry · step-postpone · span-correction · pick-name · heb-cal-data
- 🛡 מגן-הכרעה: — · 🏆 רתמת-זהב: ⏳

## #hebdate
המרות עברי↔לועזי דרך Intl בלבד — המערכת שומרת ISO לועזי; העברי = שכבת
- **חוטים (17):** heb-parts · heb-parts-strings · pad2 · month-he-of · month-en-of-data · month-en-of · month-en-of-data · heb-year-now · is-heb-leap-year · is-heb-leap-year-strings · heb-months-of · heb-months-of-data · heb-to-iso · iso-to-heb-parts · validate-heb-month-names · validate-heb-month-names-strings · heb-cal-data
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #hebrew-calendar
התאריך העברי המלא מקצה-לקצה. החיווט (=ההכרעות) שחי כאן:
- **חוטים (8):** gematria · gematria-strings · gematria-data · heb-parts · heb-parts-strings · heb-month-he · adar-norm · adar-norm-strings
- 🛡 מגן-הכרעה: — · 🏆 רתמת-זהב: ⏳

## #hebrew
כל ה-API הציבורי של הלוח העברי — maor/src/lib/hebrew.ts (מקור-האמת, L4) —
- **חוטים (19):** gematria · gematria-strings · gematria-data · gem-year · gem-year-strings · adar-norm · adar-norm-strings · heb-annual-eq · heb-annual-eq-strings · heb-parts · heb-parts-strings · heb-parts-of-iso · heb-parts-of-iso-data · heb-date-full · heb-date-full-strings · holidays · holiday-of · holiday-of-strings · heb-cal-data
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #ics-feed
מנוי-יומן חי (הרחבת gcal, 9.8) — במקום קובץ-ICS חד-פעמי, המערכת
- **חוטים (8):** mint-feed-token · read-ics-feed-token · read-ics-feed-token-strings · publish-ics-feed · publish-ics-feed-strings · ics-feed-url · ics-feed-url-strings · ics-feed-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #image-pick
שתי זרימות של פיצ׳ר-הגלריה/ההטמעה, מחווטות במקום אחד:
- **חוטים (5):** max-upload-bytes · max-embed-bytes · read-file-as-data-url · read-file-as-data-url-strings · image-pick-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-ai
קופסת הרחבת 🤖 `ai` ("עד-המפתח") — כל מה שהיה מולחם ב-`maor/src/lib/ai.ts`
- **חוטים (5):** thanks-prompt · thanks-prompt-strings · ask-claude · ask-claude-strings · lib-ai-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-cloud-config

- **חוטים (66):** platform-orgs · platform-requests · platform-leads · support-chats · team-chats · org-secret-keys · support-msg-max · fetch-org-cloud-config · fetch-org-cloud-config-strings · watch-org-cloud-config · watch-org-cloud-config-strings · write-org-cloud-doc · write-org-cloud-doc-strings · write-org-cloud-config · write-org-secrets · write-org-secrets-strings · read-org-secrets-meta · read-org-secrets-meta-strings · delete-org-request · delete-org-request-strings · write-org-request · write-org-request-strings · fetch-org-requests · fetch-org-requests-strings · find-member-org-slugs · find-member-org-slugs-strings · fetch-all-orgs · fetch-all-orgs-strings · write-org-join-request · write-org-join-request-strings · fetch-org-join-requests · fetch-org-join-requests-strings · delete-org-join-request · delete-org-join-request-strings · delete-org-member-config · delete-org-member-config-strings · clear-employee-field · clear-employee-field-strings · add-org-member · add-org-member-strings · remove-org-member · remove-org-member-strings · delete-org-completely · delete-org-completely-strings · write-org-lead · write-org-lead-strings · fetch-org-leads · fetch-org-leads-strings · send-support-message · send-support-message-strings · send-support-reply · send-support-reply-strings · watch-support-messages · watch-support-messages-strings · watch-support-thread-meta · watch-all-support-threads-strings · watch-all-support-threads · watch-all-support-threads-strings · mark-support-read · mark-support-read-strings · send-team-message · send-team-message-strings · watch-team-messages · watch-team-messages-strings · sanitize-support-text · sanitize-support-text-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-cloud
לוח-החיבורים של `maor/src/lib/cloud.ts` (770ש). כל 36 חוטי-הענן
- **חוטים (42):** set-cloud-scope · set-allowed-purposes · col-path · col-path-strings · meta-path · meta-path-strings · env-path · env-path-strings · donations-path · entity-collections · encrypt-doc · encrypt-doc-strings · decrypt-doc · decrypt-doc-strings · shared-sup-key · shared-purpose-key · sup-keyed-cols · sup-key-of · sup-key-map-of · doc-skey · doc-skey-strings · strip-audit-meta · strip-audit-meta-strings · strip-sup-key · strip-sup-key-strings · sup-allowed-keys · sup-allowed-keys-strings · don-allowed-keys · don-allowed-keys-strings · full-db-diff · cloud-db · cloud-db-strings · sign-out-cloud · push-diff · push-diff-strings · read-cloud-envelope · read-cloud-envelope-strings · write-cloud-envelope · encrypt-existing-cloud · migrate-supporters-to-keyed · migrate-supporters-to-keyed-strings · lib-cloud-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-config

- **חוטים (43):** module-on · feature-on · donation-split-on · sup-enforce-on · integration-on · telephony-on · integration-setting · integration-setting-strings · safe-https-url · safe-https-url-strings · term-of · integration-setting-strings · normalize-telephony · normalize-telephony-strings · normalize-telephony-data · make-normalize-site · make-normalize-site-data · make-normalize-site-strings · make-normalize-config · make-normalize-config-strings · public-site-on · public-site-on-strings · role-of · role-of-strings · teacher-id-of · is-admin-user · can-granted-action · is-super-admin · sign-up-error · sign-up-error-strings · employee-sign-up-error · employee-sign-up-error-strings · cloud-cfg-cache-key · cloud-cfg-cache-key-strings · resolve-org-config · org-slug-from-url · org-slug-from-url-strings · is-safe-accent · default-favicon · favicon-data-uri · favicon-data-uri-strings · apply-config · lib-config-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-crypto
ספריית ההצפנה-במנוחה (opt-in) של מאור — AES-GCM 256 עם DEK
- **חוטים (13):** gen-recovery-key · gen-recovery-key-strings · encrypt-db · encrypt-db-strings · is-encrypted · is-encrypted-strings · open-dek · open-dek-strings · decrypt-db · reencrypt-db · rewrap-password · rewrap-password-strings · lib-crypto-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-ics
קופסת-החיווט של `maor/src/lib/ics.ts` — ‏4 חוטי-הפורמט של קובץ-היומן
- **חוטים (7):** ics-escape · fold-ics-line · fold-ics-line-strings · build-ics · build-ics-strings · guard-export · lib-ics-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-lock
קופסת נעילת-ה-PIN של maor — מה שהיה מולחם ב-`src/lib/lock.ts`
- **חוטים (9):** lock-zones · default-lock-zones · lock-key · lock-key-strings · is-valid-pin · hash-pin · hash-pin-strings · verify-pin · lib-lock-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-nedarim-sync
מנוע-הסנכרון נדרים→מאור (כיוון-נכנס) — מתאים כל תורם/עסקה לכרטיס-התומך
- **חוטים (29):** norm-id · norm-phone · norm-search · norm-search-strings · name-sort-key · clearing-providers · provider-clearer · provider-clearer-strings · charge-to-hist · charge-to-hist-strings · charge-dedup-key · charge-dedup-key-strings · with-nedarim-hok · with-nedarim-hok-strings · detect-recurring-hok · detect-recurring-hok-strings · candidate-supporters-for-charge · candidate-supporters-for-charge-strings · fill-card-from-charge · attach-charge-to · relabel-hist-by-txn · repair-cards-from-rows · strong-match-for-charge · candidate-supporters-for-charge-strings · auto-match-charges · attach-charges-bulk · plan-nedarim-sync · plan-nedarim-sync-strings · lib-nedarim-sync-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #lib-pwa
קופסת-החיבורים של מודול ה-PWA — רישום service-worker, זיהוי מצב-התקנה,
- **חוטים (6):** install-available · prompt-install · prompt-install-strings · is-ios · is-ios-strings · feature-on
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #names-export
הקופסה של הכפתור מהדוגמה — "⬇ ייצוא CSV" ממסך מעקב-הטיפול.
- **חוטים (4):** csv-escape · to-csv · is-admin · names-export-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #navhist
הקופסה של פיצ'ר `shell.navhist` (P1.5) — מחסנית "↩ חזרה" של 20 צעדים
- **חוטים (7):** same-loc · push-nav · push-nav-data · push-recent · nav-hist-max · recent-max · navhist-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #net-check
הקופסה של מאבחן-החסימות — בודקת מהדפדפן אילו נקודות-קצה נגישות
- **חוטים (5):** run-net-check · run-net-check-strings · net-check-script · net-check-script-strings · net-check-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #photo-gallery

- **חוטים (9):** photo-max · photo-max-dim · photo-max-len · can-add-photo · is-data-image · integration-setting-strings · fit-dimensions · sanitize-photos · sanitize-photos-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #platform

- **חוטים (31):** slugify · org-slug-from-url-strings · slugify-data · is-valid-slug · all-modules · module-labels · all-off-config · org-link · org-link-strings · norm-email · gen-join-code · gen-join-code-strings · org-join-link · org-join-link-strings · org-join-full-code · parse-join-full-code · is-org-manager · org-enabled-modules · org-enabled-features · is-member · override-of · grantable-staff-features · grantable-staff-features-strings · is-grantable-feature · effective-config-for · allowed-designations-for · can-issue-receipt · approve-member · set-employee-override · remove-member · platform-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #pricing
מחווטת את מנוע-התמחור המלא של המטמיע — טבלת-מחירי-ברירת-מחדל,
- **חוטים (11):** default-prices · default-prices-strings · size-labels · normalize-prices · normalize-prices-strings · compute-quote · compute-quote-strings · shekel · shekel-strings · all-modules · integration-prices
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #public-site
מנוע האתר-הציבורי (טהור, בלי store/DOM) — פותר טקסט רב-לשוני,
- **חוטים (17):** is-rtl-lang · coral-palette · coral-palette-strings · site-palette · site-palette-strings · site-vocab · site-vocab-strings · resolve-localized · integration-setting-strings · site-langs · site-ui · site-ui-labels · site-campaign-progress · site-campaign-progress-strings · has-public-site · site-donate-url · integration-setting-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #receipt
מסירת-קבלה שלמה — התוכן הטהור (שורות/HTML/קוד-אימות/פורמט) + נתיבי-המסירה
- **חוטים (25):** receipt-verify-code · receipt-verify-code-strings · receipt-lines · receipt-lines-strings · receipt-html · receipt-html-strings · receipt-fmt-of · receipt-fmt-of-strings · deliver-receipt · deliver-receipt-strings · heb-date-full · heb-date-full-strings · feature-on · module-on · gematria · gematria-strings · gematria-data · gem-year · gem-year-strings · heb-parts · heb-parts-strings · guard-export · receipt-terms · nav-module-keys · receipt-wiring-data
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #reenroll

- **חוטים (26):** academic-year-label · academic-year-label-strings · next-year-dates · renew-of · is-renewed · enroll-summary · enroll-summary-strings · build-reenroll-rows · build-reenroll-rows-strings · reenroll-counts · reenroll-counts-strings · renew-targets · renew-targets-strings · fresh-next-year-enrollment · eligible-assignments-for-day-strings · next-year-course-draft · student-history · student-history-text · student-history-text-strings · reenroll-csv-rows · reenroll-csv-rows-strings · reenroll-csv-rows-data · reenroll-list-text · reenroll-list-text-strings · pay-bal · paid-of
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #reports

- **חוטים (15):** fmt-date · fmt-date-strings · in-range · range-label · range-label-strings · paid-of · round2 · round2-strings · paid-in-range · balance-of · month-key · month-label · name-index · status-label · count-by
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #search
חיפוש-חכם מלא: נרמול עברי + תעתיקים (עברית/אנגלית/רוסית/כינויים) +
- **חוטים (20):** levenshtein · norm-search · norm-search-strings · xlat · xlat-strings · rule-exact · rule-exact-strings · rule-prefix · rule-prefix-strings · rule-plural · rule-plural-strings · rule-contains · rule-contains-strings · rule-skeleton · rule-skeleton-strings · rule-typo · rule-typo-strings · smart-score · smart-score-strings · smart-filter
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ✅

## #shop
מחווטת את 31 חוטי-מודול-החנות לכדי ה-API של העמודה. מקור-האמת:
- **חוטים (49):** live-redemptions · item-of · holiday-allowed · item-remaining · effective-price · effective-price-strings · max-discount-pct · max-discount-pct-strings · upcoming-holidays · upcoming-holidays-strings · holiday-names · holiday-names-strings · assignment-redeemed · component-remaining · coupon-expiry · shop-holiday-due-days · needs-care-shop · needs-care-shop-strings · shop-expiry-warn-days · expiring-intakes · upcoming-meetings · upcoming-meetings-strings · given-value · collected-paid · subsidy-total · product-assignments · component-redeemed-now · component-redeemed-now-strings · filter-assignments · filter-products · filter-items · filter-items-strings · filter-redemptions · intake-log · eligible-families · eligible-assignments-for-day-strings · distribution-list-lines · distribution-list-lines-strings · redemptions-csv-rows · redemptions-csv-rows-strings · beneficiary-label · beneficiary-label-strings · component-counts · term-of · integration-setting-strings · date-in-range · heb-parts · heb-parts-strings · iso-local
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #signup-wizard
הקופסה של אשף-ההרשמה 5-השלבים של אורביט (SIGNUP3): תחום → גודל →
- **חוטים (13):** vertical-packs · wizard-industries · org-sizes · org-needs · wizard-steps · empty-wizard · wizard-step-error · wizard-step-error-strings · sign-up-error · sign-up-error-strings · industry-label · size-label · need-label
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #smtp-url
הלקוח מקליד כתובת-מייל + סיסמת-אפליקציה — הקופסה מרכיבה לבד את
- **חוטים (6):** smtp-hosts · smtp-host-for · smtp-hosts · compose-smtp-url · compose-smtp-url-strings · smtp-url-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #sup-partition
שכבה טהורה שאוכפת ייעוד-פר-תורם (`forWho`) בשכבת-הנתונים — מזריקה
- **חוטים (12):** shared-sup-key · sup-key-of · sup-keyed-cols · doc-skey · doc-skey-strings · sup-key-map-of · sup-allowed-keys · sup-allowed-keys-strings · strip-sup-key · strip-sup-key-strings · strip-audit-meta · strip-audit-meta-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #support-chat

- **חוטים (15):** support-msg-max · sanitize-support-text · sanitize-support-text-strings · is-sendable-support-text · sort-support-msgs · support-msg-time · support-msg-time-strings · support-day-label · support-day-label-strings · support-preview · support-preview-strings · support-unread · sort-support-threads-strings · sort-team-msgs · support-chat-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #supporters

- **חוטים (67):** fmt-date · fmt-date-strings · supporter-purposes · supporter-visible-for-designations · all-donation-purposes · sup-ils · sup-usd · sup-count · sup-last · sup-last-in-period · sup-total-ils · sup-score · sup-score-strings · sup-tier · sup-tier-strings · tier-order · sup-score-bins · sup-score-bins-strings · sup-avg-don · sup12m · sup12m-strings · chip-style · chip-style-strings · fix-phone · total-label · sup-don-events · sup-don-events-strings · personal-cal-entries · personal-cal-entries-strings · org-cal-entries · org-cal-entries-strings · don-cal-month-line · don-cal-month-line-strings · norm-name · sup-name-keys · excel-serial-to-iso · excel-serial-to-iso-strings · parse-supporter-grid · parse-supporter-grid-strings · parse-supporter-csv · apply-ayin-names · merge-hist · plan-supporter-import · merge-supporter-row · new-supporter-from-row · hok-cat · hok-cat-strings · hok-effectively-active · hok-effectively-active-strings · hok-recorded-this-month · hok-effectively-active-strings · hok-due · hok-monthly-total · hok-method-label · hok-method-label-strings · term-of · integration-setting-strings · norm-search · norm-search-strings · format-israeli-phone · format-israeli-phone-strings · parse-any-date · parse-any-date-strings · parse-csv · plan-add-name · plan-add-name-strings · supporters-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #telephony
הגשר בין אשף-ההקמה של מאור למנוע-הטלפוניה הטהור. ממיר שדות-אשף
- **חוטים (13):** empty-telephony-config · empty-telephony-config-strings · to-tenant-id · to-tenant-id-strings · telephony-to-tenant · telephony-to-tenant-strings · preview-telephony · preview-telephony-data · preview-telephony-strings · next-closure · next-closure-strings · explain-one · explain-one-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #templates
הקופסה של `maor/src/lib/templates.ts` (ROADMAP-100 ‏#12) — נוסחי-הוואטסאפ
- **חוטים (3):** template-defs · template-keys · render-template
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #theme
מחווטת תפקידים (שקעים: ‎--bg, ‎--ink…) לפיגמנטים מהפלטה, פר-מצב
- **חוטים (2):** palette · theme-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #tour
הסיור-המודרך (spotlight) על המסכים האמיתיים — תסריט-הלגאסי מילה-במילה,
- **חוטים (8):** tour-stop-label · tour-steps · tour-steps-strings · tour-advance · spotlight-box · spotlight-box-strings · term-of · integration-setting-strings
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #tzedaka
קופסת-החיווט של מנוע קופות-הצדקה. כל 19 החוטים של
- **חוטים (31):** tz-score-rules · tz-stale-days · last-collection-iso · collection-score-delta · collection-score-delta-strings · box-total · coordinator-boxes · coordinator-total · grand-total · campaign-total · stale-boxes · stale-boxes-strings · needs-care-tzedaka · needs-care-tzedaka-strings · leaderboard · campaign-progress · campaign-progress-strings · filter-coordinators · boxes-overview · boxes-overview-strings · filter-collections · coordinator-print-lines · coordinator-print-lines-strings · collections-csv-rows · collections-csv-rows-strings · build-tz-grid · term-of · integration-setting-strings · date-in-range · iso-local · week-day-names
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #validate
בדיקות-תקינות לקלט ישראלי: ת"ז (לוהן מותאם) · טלפון (נרמול-זיהוי + עיצוב-תצוגה,
- **חוטים (10):** valid-israeli-id · valid-israeli-id-strings · normalize-phone · format-israeli-phone · format-israeli-phone-strings · norm-search · norm-search-strings · norm-name · name-sort-key · validate-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #vcard-import

- **חוטים (6):** parse-vcards · parse-vcards-strings · is-junk-contact · importable-contacts · contact-to-row · vcard-import-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #vertical-packs

- **חוטים (3):** vertical-packs · commercial-off · apply-vertical-pack
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #wa
הקופסה של הרחבת-`whatsapp` — קישורי wa.me click-to-chat + נוסחי-ההודעה,
- **חוטים (13):** wa-digits · wa-digits-strings · wa-link · wa-link-strings · wa-delivery-text · wa-delivery-text-strings · wa-payment-text · wa-payment-text-strings · wa-birthday-text · wa-birthday-text-strings · render-template · template-defs · wa-terms
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## #worktasks
מנוע משימות-העבודה (WORKPREP) — סינון-פר-עובדת, מיון-עדיפות,
- **חוטים (11):** task-identity · task-identity-strings · open-tasks-for · done-today-for · done-today-for-strings · task-overdue · task-stats-for · task-stats-for-strings · overdue-contact-task-drafts · overdue-contact-task-drafts-strings · pri-labels
- 🛡 מגן-הכרעה: ✅ · 🏆 רתמת-זהב: ⏳

## אטומים-במלאי (טרם-חווטו): 128
_ההתקדמות האמיתית = אחוז-המחווט (L10)._
