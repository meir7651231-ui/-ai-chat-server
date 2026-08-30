# 🔬 ממצאי טוהר-עומק (הכרעה 19) — דאטה בתוך מנגנון

נסרקו אטומי-מנגנון ב-new/atoms · new/boxes · הפרות: 327

| אטום | ציון | עברית | טבלאות | מחרוזות-דומיין | מספרי-קסם |
|---|---|---|---|---|---|
| new/boxes/lib-cloud.mjs | 35 | אימייל או סיסמה שגויים · אין חיבור לאינטרנט — בדקו את ה · יותר מדי ניסיונות — המתינו מספ · החשבון הושבת — פנו למנהל המערכ | const DEFAULT_SCOPE = { slug: 'default', clo · const META_COUNTER_KEYS = ['seq', 'receiptSe · const safe = { ...meta } | ../atoms/set-cloud-scope.mjs · ../atoms/set-allowed-purposes. · ../atoms/col-path.mjs · ../atoms/col-path-strings.mjs | 500 400 |
| new/atoms/ayin-sheet-rows.mjs | 31 | תומכת · טלפון · שם למסירה · כמה עיניים | const AYIN_SHEET_HEADER = [ 'תומכת', 'טל · const rows = [[...AYIN_SHEET_HEADER]] · const leadDone = ['eyes', 'answer', 'done']. | eyes · answer · done | — |
| new/atoms/ask-claude.mjs | 29 | מפתח ה-API לא תקין — בדקו בהגד · חריגה ממכסת-השימוש — נסו בעוד  · הקריאה לעוזר נכשלה ( · לא התקבלה תשובה — נסו שוב | — | https://api.anthropic.com/v1/m · POST · content-type · application/json | 06 20251001 600 401 429 |
| new/boxes/tour.mjs | 28 | 👋 הדמיה מלאה — המערכת מדגימה  · סטטיסטיקות חיות — כל אריח לחיץ · מדד אמינות · ⌘K — חיפוש חכם מכל מקום | const TOUR_STEPS = [ { view: 'home', capti | ../atoms/tour-stop-label.mjs · ../atoms/tour-steps.mjs · ../atoms/tour-steps-strings.mj · ../atoms/tour-advance.mjs | 48 |
| new/atoms/dup-fields.mjs | 27 | שם משפחה · שם האם · שם האב · טלפון | const DUP_FIELDS = [ { key: 'name', label: | name · mother · father · phone | — |
| new/atoms/sup-dup-fields.mjs | 27 | שם · טלפון · אימייל · ת"ז | const SUP_DUP_FIELDS = [ { key: 'name',  | name · phone · email · idNum | — |
| new/atoms/xlat.mjs | 27 | כהן · לוי · מזרחי · פרידמן | const XLAT = { 'כהן': ['cohen', 'kohen', ' | cohen · kohen · levi · mizrahi | — |
| new/boxes/guide.mjs | 27 | ליד השיבוץ · ליד ה · שיבוץ · כדי שיבוץ | const RECIPE_SWAPS = [ ['ליד השיבוץ', 'ליד | ../atoms/guide-intro-label.mjs · ../atoms/guide-intro.mjs · ../atoms/guide-sections.mjs · ../atoms/guide-recipes-label.m | — |
| new/atoms/dict-he.mjs | 25 | משפחה · חוג · משפחות · משפחת | const DICT_HE = {"משפחה":126,"חוג":121,"משפח | — | 126 121 91 76 69 53 |
| new/atoms/suggestions.mjs | 25 | מתנת-חג · ${hol.name} בעוד ${h · ${activeFams.length} ${T('nav. · ערכת בית-ספר · ${m.first} (${f · בן/בת ${age} — לקראת/בתחילת כי | — | sug:holiday:${hol.name}:${hol. · sug:school:${m.id}:${age} · sug:baby:${m.id} · sug:renew:${e.id}:${e.purchase | 30 |
| new/boxes/navhist.mjs | 25 | ↩ חזרה · חזרה למסך הקודם | const next = { view, selFamilyId: prev.selFa · const next = { view: 'families', selFamilyId · const next = { view: 'courses', selFamilyId: | ../atoms/same-loc.mjs · ../atoms/push-nav.mjs · ../atoms/push-nav-data.mjs · ../atoms/push-recent.mjs | — |
| new/atoms/sign-up.mjs | 24 | האימייל כבר רשום — נסו להתחבר  · הסיסמה חלשה מדי — לפחות 6 תווי · כתובת האימייל אינה תקינה · ההרשמה סגורה כרגע — פנו למנהל  | — | auth/email-already-in-use · auth/weak-password · auth/invalid-email · auth/operation-not-allowed | — |
| new/boxes/diary.mjs | 24 | כרטיסייה · יתרה ${Math.max(0,  · מוקפא · הסתיים · רשימת-המתנה ⏳ | — | ../atoms/fmt-date.mjs · ../atoms/iso-local.mjs · ../atoms/iso-today.mjs · ../atoms/week-day-names.mjs | — |
| new/atoms/trust-report.mjs | 23 | יתומים: ${[...ar.dangling, ... · נפילה למנהל ${fs.fallback} · חסרים ${pf.missing.length} (שע · ${leak.violations.length} דליפ | const SEV = { critical: 3, high: 2, info: 1  | — | 100 95 85 70 |
| new/boxes/distribution.mjs | 23 | איסוף · בדרך · נמסר | const STATUS_LABEL = { pickup: 'איסוף', enro | ../atoms/advance-status.mjs · ../atoms/pending-deliveries-to · ../atoms/advance-status-data.m · ../atoms/deliveries-of-day.mjs | — |
| new/atoms/heb-cal-data.mjs | 22 | ניסן · אייר · סיוון · תמוז | — | — | -1373427 98496 35975351 19 235 234 |
| new/atoms/change-password.mjs | 20 | אין משתמש מחובר — התחברו ונסו  · הסיסמה הנוכחית שגויה · הסיסמה החדשה חלשה מדי — לפחות  | — | auth/wrong-password · auth/invalid-credential · auth/invalid-login-credentials · auth/weak-password | — |
| new/atoms/explain-call.mjs | 20 | יום ${DOW_HE[call.dow]} ${call · 📞 חיוג-יוצא: ${call.did || '' · ✅ יוצא דרך: ${sim.outcome.repl · 📲 מתקשר ${call.callerId}${whe | — |  (${reason}) · ${call.date} ${call.hhmm || '' | — |
| new/atoms/plan-ayin-advance.mjs | 20 | נרשמו ${a.names.length} — נכנס · אושר — נרשם בלוח ובדוח. עכשיו: · נרשם — נכנס ללוח: ${stageLabel | — | ${feat}: ${stageLabel(cfg, 'le · ${feat}: ${stageLabel(cfg, 'le · ${feat}: ${stageLabel(cfg, 'an · ${feat}: ${stageLabel(cfg, 'an | — |
| new/atoms/audit-categories.mjs | 19 | כפילות · ת"ז · טלפון · אימייל | const AUDIT_CATEGORIES = [ 'כפילות',  | — | — |
| new/atoms/telephony-to-tenant.mjs | 19 | — | const ONRAMP = { sim: T.k1, virtual: · const CHANNELS = { sim: [T.k4], virt · const base = { id: n.id, e16 | voice.kosher · calendar.hebrew · calendar.shabbat · calendar.fasts | 25 30 |
| new/atoms/enroll-new-family.mjs | 18 | כ · מ · נ · פ | — | __new | — |
| new/atoms/schedule-clash-text.mjs | 18 | ראשון · שני · שלישי · רביעי | — | ended | — |
| new/boxes/custom-export.mjs | 18 | — | const NAV_MODULE_KEYS = [ 'families', 'c · const res = { seq, has30 } | ../atoms/exp-field-defs.mjs · ../atoms/exp-field-defs-string · ../atoms/override-column.mjs · ../atoms/build-custom-export.m | 3761 440 12 30 |
| new/boxes/lib-nedarim-sync.mjs | 18 | — | const extraPhones = [d.phone2, d.phone3].map · const notes = [d.notes, extraPhones.length ? | ../atoms/norm-id.mjs · ../atoms/norm-phone.mjs · ../atoms/norm-search.mjs · ../atoms/norm-search-strings.m | 10 28 999 12 |
| new/boxes/hebdate.mjs | 17 | ⚠ שם חודש עברי לא-צפוי מ-Intl  | — | ../atoms/heb-parts.mjs · ../atoms/heb-parts-strings.mjs · ../atoms/pad2.mjs · ../atoms/month-he-of.mjs | 30 7000 3761 440 12 |
| new/boxes/lib-config.mjs | 17 | — | const NAV_MODULE_KEYS = ['families', 'course · const DEFAULT_CONFIG = { slug: 'default', or · const INTEGRATION_KEYS = ['receipts', 'payme | ../atoms/module-on.mjs · ../atoms/feature-on.mjs · ../atoms/donation-split-on.mjs · ../atoms/sup-enforce-on.mjs | — |
| new/boxes/pricing.mjs | 17 | — | const DEFAULT_INTEGRATION_PRICES = { recei | ../atoms/default-prices.mjs · ../atoms/size-labels.mjs · ../atoms/normalize-prices.mjs · ../atoms/normalize-prices-stri | 60 90 50 40 90 30 |
| new/atoms/pull-nedarim.mjs | 16 | נדרשת התחברות-ענן · משיכה נכשלה ( | — | root · org · full · reset | — |
| new/atoms/pull-sola.mjs | 16 | נדרשת התחברות-ענן · משיכה נכשלה ( | — | root · org · default · vault | — |
| new/atoms/coral-palette.mjs | 15 | — | const CORAL_PALETTE = { c1: '#EC9C9C', c | #FFFCFA · #FBF1EF · #FFF3F0 | 156 156 127 127 39 42 |
| new/boxes/hebrew.mjs | 15 | — | const res = { seq, has30 } | ../atoms/gematria.mjs · ../atoms/gematria-strings.mjs · ../atoms/gematria-data.mjs · ../atoms/gem-year.mjs | 3761 440 12 30 |
| new/boxes/net-check.mjs | 15 | — | const LABEL = { site: NET_CHECK_TERMS.k1,  · const list = [ { key: 'site', label: LAB | ../atoms/run-net-check.mjs · ../atoms/net-check-script.mjs · ../atoms/net-check-script-stri · ../atoms/net-check-terms.mjs | 8000 |
| new/atoms/make-normalize-config.mjs | 14 | — | const req = [f.apiKey, f.authDomain, f.proje · const out = { apiKey: f.apiKey,  · const cfg = { ...DEFAULT_CONFIG,  | — | 20 500 12 120 12 |
| new/atoms/normalize-telephony.mjs | 14 | — | const num = { id, e164, label: telStr(o.labe · const officeDays = [ ...new Set(daysRaw. | 101 · 201 · 100 | 24 20 |
| new/atoms/orbit-theme.mjs | 14 | — | — | ${Math.round(c.r)},${Math.roun · rgba(${accentRgb},0.30) · rgba(${auroraHi},0.20) · rgba(${auroraLo},0.15) | 255 255 255 360 360 360 |
| new/boxes/theme.mjs | 14 | — | const WIRING = { "light": { "--c-ink": "p · const pal = { ...PALETTE, ...overrides } | ../atoms/palette.mjs · ../atoms/theme-terms.mjs · light · --c-ink | — |
| new/boxes/receipt.mjs | 13 | — | const NAV_MODULE_KEYS = ['families', 'course | ../atoms/receipt-verify-code.m · ../atoms/receipt-lines.mjs · ../atoms/receipt-lines-strings · ../atoms/receipt-html.mjs | 10 5000 |
| new/atoms/build-custom-export.mjs | 12 | — | const rows = [defs.map((f) => f.label)] · const rec = { title: ev.titl · const obj = { name: sp.name,  | ${d.getFullYear()}-${p2(d.getM | 86400000 |
| new/atoms/make-normalize-site.mjs | 12 | — | const it = { year, title } · const pm = { label, detail } | — | 24 12 200 60 24 60 |
| new/atoms/reset-password.mjs | 12 | לא נמצא משתמש עם האימייל הזה · כתובת האימייל אינה תקינה | — | auth/user-not-found · auth/invalid-email | — |
| new/boxes/empowerment.mjs | 12 | — | — | ../atoms/cockpit-days-since.mj · ../atoms/cockpit-at-risk.mjs · ../atoms/cockpit-thanks.mjs · ../atoms/cockpit-thanks-string | 60 60 12 12 |
| new/boxes/shop.mjs | 12 | — | const sockets = { upcomingHolidays: (fro | ../atoms/live-redemptions.mjs · ../atoms/item-of.mjs · ../atoms/holiday-allowed.mjs · ../atoms/item-remaining.mjs | 45 |
| new/atoms/manual-driver.mjs | 11 | חיוג בלחיצה (טלפון קיים) | const manualDriver = { id: 'manual',  | tel: · manual | — |
| new/atoms/send-support-message.mjs | 11 | — | — | supportChats · messages · user · supportChats | 120 120 120 |
| new/boxes/cloud-diff.mjs | 11 | — | const META_KEYS = [ 'orgName', 'orgSite' | ../atoms/entity-collections.mj · ../atoms/col-path.mjs · ../atoms/col-path-strings.mjs · ../atoms/meta-path.mjs | — |
| new/boxes/platform.mjs | 11 | — | const DEFAULT_CONFIG = { slug: 'default', or | ../atoms/slugify.mjs · ../atoms/org-slug-from-url-str · ../atoms/slugify-data.mjs · ../atoms/is-valid-slug.mjs | — |
| new/boxes/search.mjs | 11 | — | const CASCADE = [ruleExact, rulePrefix, rule | ../atoms/levenshtein.mjs · ../atoms/norm-search.mjs · ../atoms/norm-search-strings.m · ../atoms/xlat.mjs | — |
| new/boxes/vcard-import.mjs | 11 | — | const PHONE_LABELS = { CELL: VCARD_IMPORT_ | ../atoms/parse-vcards.mjs · ../atoms/parse-vcards-strings. · ../atoms/is-junk-contact.mjs · ../atoms/importable-contacts.m | — |
| new/atoms/ayin-daily-rows.mjs | 10 | ${unit} היום | const rows = [ [T.k1, T.k2, `${unit} · const a = { ...emptyAyin(), ...sp.ayin } | — | — |
| new/atoms/build-course-daily-rows.mjs | 10 | הדוח נקטע ב-${MAX_DAYS} ימי מפ | const rows = [ [T2.k1, T2.k2, T2.k3, | ${d.getFullYear()}-${p2(d.getM | 500 |
| new/atoms/wa-digits.mjs | 10 | — | — | 972 · 972 · 972 · 972 | 10 15 |
| new/boxes/lib-pwa.mjs | 10 | — | — | ../atoms/install-available.mjs · ../atoms/prompt-install.mjs · ../atoms/is-ios.mjs · ../atoms/is-ios-strings.mjs | 12 192 |
| new/atoms/build-slots.mjs | 9 | — | — | crs|${hh}|${c.id}|${i} · out|${c.id}|${i} | 60 20 60 60 96 |
| new/atoms/events-csv-rows.mjs | 9 | — | const PRIORITY_LABEL = { green: T2.k1,  · const rows = [ [T2.k4, T2.k5, T2.k6, T2. · const evs = [...db.events].sort((a, b) => (a | — | — |
| new/atoms/merge-supporter-into.mjs | 9 | — | const donations = [...keep.donations, ...dro · const photos = [...new Set([...(keep.photos  · const notes = [keep.notes, drop.notes].map(( | — | — |
| new/atoms/plan-nedarim-sync.mjs | 9 | — | const summary = { existing: existing.len · const nextHist = [...(out[idx].hist || []),  | — | 40 40 40 |
| new/atoms/send-support-reply.mjs | 9 | — | — | supportChats · messages · admin · admin | 120 |
| new/boxes/annual-report.mjs | 9 | — | — | ../atoms/donation-years.mjs · ../atoms/donations-of-year.mjs · ../atoms/annual-report-lines.m · ../atoms/annual-report-lines-s | 5000 |
| new/boxes/csvx.mjs | 9 | — | — | ../atoms/csv-escape.mjs · ../atoms/to-csv.mjs · ../atoms/decode-csv-buffer.mjs · ../atoms/decode-csv-buffer-str | 5000 |
| new/boxes/hebrew-calendar.mjs | 9 | — | — | ../atoms/gematria.mjs · ../atoms/gematria-strings.mjs · ../atoms/gematria-data.mjs · ../atoms/heb-parts.mjs | 10 |
| new/boxes/image-pick.mjs | 9 | — | — | ../atoms/max-upload-bytes.mjs · ../atoms/max-embed-bytes.mjs · ../atoms/read-file-as-data-url · ../atoms/image-pick-terms.mjs | 320 |
| new/boxes/lib-crypto.mjs | 9 | — | — | ../atoms/gen-recovery-key.mjs · ../atoms/gen-recovery-key-stri · ../atoms/encrypt-db.mjs · ../atoms/is-encrypted.mjs | 12 |
| new/boxes/lib-ics.mjs | 9 | — | — | ../atoms/ics-escape.mjs · ../atoms/fold-ics-line.mjs · ../atoms/build-ics.mjs · ../atoms/build-ics-strings.mjs | 5000 |
| new/boxes/reports.mjs | 9 | — | — | ../atoms/fmt-date.mjs · ../atoms/in-range.mjs · ../atoms/range-label.mjs · ../atoms/range-label-strings.m | 10 |
| new/atoms/annual-report-lines.mjs | 8 | — | const out = [ '='.repeat(46), T.k1 + | — | 46 46 46 12 46 |
| new/atoms/default-course-dates.mjs | 8 | — | — | ${startYear}-09-01 · ${startYear + 1}-07-31 | 10 -09 -07 31 |
| new/atoms/delete-org-completely.mjs | 8 | — | — | donations · auditlog · incomingPayments · smsOutbox | — |
| new/atoms/encrypt-db.mjs | 8 | — | — | raw · AES-GCM · encrypt · decrypt | — |
| new/atoms/grade-index.mjs | 8 | ׳״]/g,  · ).replace(/^כיתה\s*/,  | — | — | — |
| new/atoms/grantable-staff-features.mjs | 8 | — | — | supporters.bulkselect · supporters.bulkdelete · supporters.purpose · supporters.delete | — |
| new/atoms/mark-support-read.mjs | 8 | — | — | admin · unreadAdmin · unreadUser · supportChats | — |
| new/atoms/migrate-supporters-to-keyed.mjs | 8 | — | — | supporters · events · events | 400 400 |
| new/atoms/open-dek.mjs | 8 | — | — | pass · pass · raw · AES-GCM | — |
| new/atoms/read-file-as-data-url.mjs | 8 | הקובץ גדול מדי להטמעה (מקסימום · MB) — הוסיפו קישור במקום | — | — | — |
| new/boxes/a11y.mjs | 8 | — | — | ../atoms/scale-min.mjs · ../atoms/scale-max.mjs · ../atoms/scale-step.mjs · ../atoms/a11y-fab-toggles.mjs | — |
| new/boxes/audit.mjs | 8 | — | — | ../atoms/audit-cat-colors.mjs · ../atoms/audit-categories.mjs · ../atoms/phone-issue.mjs · ../atoms/phone-issue-strings.m | — |
| new/boxes/ayin.mjs | 8 | — | — | ../atoms/ayin-stages.mjs · ../atoms/stage-label.mjs · ../atoms/stage-label-strings.m · ../atoms/feat-label.mjs | — |
| new/boxes/caller-id.mjs | 8 | — | — | ../atoms/phone-key.mjs · ../atoms/find-caller.mjs · ../atoms/find-caller-strings.m · ../atoms/caller-kind-label.mjs | — |
| new/boxes/cloud-crypto.mjs | 8 | — | — | ../atoms/is-enc-doc.mjs · ../atoms/is-enc-doc-strings.mj · ../atoms/encrypt-doc.mjs · ../atoms/decrypt-doc.mjs | — |
| new/boxes/cloud-merge.mjs | 8 | — | — | ../atoms/entity-collections.mj · ../atoms/sanitize-incoming.mjs · ../atoms/sanitize-incoming-str · ../atoms/merge-donations-prese | — |
| new/boxes/components-courses.mjs | 8 | — | — | ../atoms/fmt-date.mjs · ../atoms/iso-today.mjs · ../atoms/iso-local.mjs · ../atoms/default-course-dates. | — |
| new/boxes/date-util.mjs | 8 | — | — | ../atoms/iso-local.mjs · ../atoms/iso-today.mjs · ../atoms/iso-days-ago.mjs · ../atoms/date-in-range.mjs | — |
| new/boxes/dedup.mjs | 8 | — | — | ../atoms/norm-phone.mjs · ../atoms/norm-id.mjs · ../atoms/find-duplicate-groups · ../atoms/merge-families.mjs | — |
| new/boxes/dialer.mjs | 8 | — | — | ../atoms/requeue-outcomes.mjs · ../atoms/terminal-outcomes.mjs · ../atoms/outcome-labels.mjs · ../atoms/start-campaign.mjs | — |
| new/boxes/donation-partition.mjs | 8 | — | — | ../atoms/shared-purpose-key.mj · ../atoms/purpose-key-of.mjs · ../atoms/don-allowed-keys.mjs · ../atoms/explode-supporter.mjs | — |
| new/boxes/export-rows.mjs | 8 | — | — | ../atoms/families-import-forma · ../atoms/families-import-forma · ../atoms/supporters-import-for · ../atoms/supporters-import-for | — |
| new/boxes/families.mjs | 8 | — | — | ../atoms/fmt-date.mjs · ../atoms/iso-today.mjs · ../atoms/iso-local.mjs · ../atoms/age-of.mjs | — |
| new/boxes/heb-cal-box.mjs | 8 | — | — | ../atoms/cycle-hit.mjs · ../atoms/lin-cycles.mjs · ../atoms/cycle-carry.mjs · ../atoms/step-postpone.mjs | — |
| new/boxes/ics-feed.mjs | 8 | — | — | ../atoms/mint-feed-token.mjs · ../atoms/read-ics-feed-token.m · ../atoms/publish-ics-feed.mjs · ../atoms/ics-feed-url.mjs | — |
| new/boxes/lib-ai.mjs | 8 | — | — | ../atoms/thanks-prompt.mjs · ../atoms/thanks-prompt-strings · ../atoms/ask-claude.mjs · maor_ai_key | — |
| new/boxes/lib-cloud-config.mjs | 8 | — | — | ../atoms/platform-orgs.mjs · ../atoms/platform-requests.mjs · ../atoms/platform-leads.mjs · ../atoms/support-chats.mjs | — |
| new/boxes/lib-lock.mjs | 8 | — | — | ../atoms/lock-zones.mjs · ../atoms/default-lock-zones.mj · ../atoms/lock-key.mjs · ../atoms/lock-key-strings.mjs | — |
| new/boxes/names-export.mjs | 8 | — | — | ../atoms/csv-escape.mjs · ../atoms/to-csv.mjs · ../atoms/is-admin.mjs · ../atoms/names-export-terms.mj | — |
| new/boxes/photo-gallery.mjs | 8 | — | — | ../atoms/photo-max.mjs · ../atoms/photo-max-dim.mjs · ../atoms/photo-max-len.mjs · ../atoms/can-add-photo.mjs | — |
| new/boxes/public-site.mjs | 8 | — | — | ../atoms/is-rtl-lang.mjs · ../atoms/coral-palette.mjs · ../atoms/site-palette.mjs · ../atoms/site-vocab.mjs | — |
| new/boxes/reenroll.mjs | 8 | — | — | ../atoms/academic-year-label.m · ../atoms/next-year-dates.mjs · ../atoms/renew-of.mjs · ../atoms/is-renewed.mjs | — |
| new/boxes/signup-wizard.mjs | 8 | — | — | ../atoms/vertical-packs.mjs · ../atoms/wizard-industries.mjs · ../atoms/org-sizes.mjs · ../atoms/org-needs.mjs | — |
| new/boxes/smtp-url.mjs | 8 | — | — | ../atoms/smtp-hosts.mjs · ../atoms/smtp-host-for.mjs · ../atoms/smtp-hosts.mjs · ../atoms/compose-smtp-url.mjs | — |
| new/boxes/sup-partition.mjs | 8 | — | — | ../atoms/shared-sup-key.mjs · ../atoms/sup-key-of.mjs · ../atoms/sup-keyed-cols.mjs · ../atoms/doc-skey.mjs | — |
| new/boxes/support-chat.mjs | 8 | — | — | ../atoms/support-msg-max.mjs · ../atoms/sanitize-support-text · ../atoms/is-sendable-support-t · ../atoms/sort-support-msgs.mjs | — |
| new/boxes/supporters.mjs | 8 | — | — | ../atoms/fmt-date.mjs · ../atoms/supporter-purposes.mj · ../atoms/supporter-visible-for · ../atoms/all-donation-purposes | — |
| new/boxes/telephony.mjs | 8 | — | — | ../atoms/empty-telephony-confi · ../atoms/empty-telephony-confi · ../atoms/to-tenant-id.mjs · ../atoms/to-tenant-id-strings. | — |
| new/boxes/tzedaka.mjs | 8 | — | — | ../atoms/tz-score-rules.mjs · ../atoms/tz-stale-days.mjs · ../atoms/last-collection-iso.m · ../atoms/collection-score-delt | — |
| new/boxes/validate.mjs | 8 | — | — | ../atoms/valid-israeli-id.mjs · ../atoms/normalize-phone.mjs · ../atoms/format-israeli-phone. · ../atoms/norm-search.mjs | — |
| new/boxes/wa.mjs | 8 | — | — | ../atoms/wa-digits.mjs · ../atoms/wa-link.mjs · ../atoms/wa-link-strings.mjs · ../atoms/wa-delivery-text.mjs | — |
| new/boxes/worktasks.mjs | 8 | — | — | ../atoms/task-identity.mjs · ../atoms/task-identity-strings · ../atoms/open-tasks-for.mjs · ../atoms/done-today-for.mjs | — |
| new/atoms/plan-add-name.mjs | 7 | השם "${nm}" כבר ברשימה | const names = [...a.names, { id, name: nm, e | — | — |
| new/atoms/preview-telephony.mjs | 7 | — | const opts = { anchorDate: anchor, calendarW · const scenarios = [ { when: T.k3, ca | — | 400 |
| new/atoms/ayin-all-rows.mjs | 6 | — | const rows = [[T.k1, T.k2, T.k3, unit, T.k4, · const a = { ...emptyAyin(), ...sp.ayin } | — | — |
| new/atoms/compute-quote.mjs | 6 | — | const lines = [...all.filter((l) => l.price  | subscription | 12 |
| new/atoms/constellation-donor-constellation.mjs | 6 | — | — | — | 2166136261 16777619 30 90 180 365 |
| new/atoms/create-cloud-key.mjs | 6 | יצירת מפתח-הצפנה נכשלה | — | pass | — |
| new/atoms/default-prices.mjs | 6 | — | — | — | 290 120 70 180 60 90 |
| new/atoms/effective-config-for.mjs | 6 | — | const modules = { ...orgConfig.modules } · const features = { ...orgConfig.features } | — | — |
| new/atoms/empty-telephony-config.mjs | 6 | — | — | 101 · 201 · 100 | — |
| new/atoms/exp-field-defs.mjs | 6 | — | const defs = [ { key: T.k3, labe · const defs = [ { key: T.k3, label: T | — | — |
| new/atoms/fetch-incoming-payments.mjs | 6 | — | — | incomingPayments · status · pending | — |
| new/atoms/find-member-org-slugs.mjs | 6 | — | — | platformOrgs · members · array-contains | — |
| new/atoms/intel-rfm-from-scan.mjs | 6 | — | — | — | 30 350 90 280 180 200 |
| new/atoms/merge-families.mjs | 6 | — | const all = [keeper, ...losers] · const baseNotes = [...new Set(notesParts)].j | — | — |
| new/atoms/parse-any-date.mjs | 6 | — | — | — | 31 2000 1900 31 1899 11 |
| new/atoms/run-audit.mjs | 6 | — | const a = [...new Set(g2[k])] · const a = [...new Set(g3[k])] | — | — |
| new/atoms/segments-match-segment.mjs | 6 | — | const SEGMENTS = [ { key: T.k1, match: ( | — | 5000 60 365 |
| new/atoms/segments-segment-counts.mjs | 6 | — | const SEGMENTS = [ { key: T.k1, label: T | — | 5000 60 365 |
| new/atoms/send-team-message.mjs | 6 | — | — | teamChats · messages | 120 60 |
| new/atoms/site-palette.mjs | 6 | — | — | — | 255 255 255 60 360 360 |
| new/atoms/student-history-text.mjs | 6 | — | — | [${h.yearLabel}]  ·  · ${h.group} · ${yr}${h.courseName}${grp}${T. | — |
| new/atoms/sup-score.mjs | 6 | — | — | — | 86400000 9999 30 350 90 280 |
| new/atoms/to-tenant-id.mjs | 6 | — | — | ${base}-org · x-${padded} | 38 40 |
| new/boxes/export-gate.mjs | 6 | — | — | ../atoms/set-export-blocked.mj · ../atoms/export-allowed.mjs · ../atoms/guard-export.mjs | — |
| new/boxes/templates.mjs | 6 | — | — | ../atoms/template-defs.mjs · ../atoms/template-keys.mjs · ../atoms/render-template.mjs | — |
| new/boxes/vertical-packs.mjs | 6 | — | — | ../atoms/vertical-packs.mjs · ../atoms/commercial-off.mjs · ../atoms/apply-vertical-pack.m | — |
| new/atoms/hok-cat.mjs | 5 | הו"ק | — | — | 12 |
| new/atoms/intel-forecast-from-scan.mjs | 5 | — | — | — | 365 15 92 30 25 |
| new/atoms/normalize-phone.mjs | 5 | — | — | 972 · +972 | 972 |
| new/atoms/portfolio-portfolio-intel.mjs | 5 | — | — | — | 10 30 90 12 365 |
| new/atoms/push-donations.mjs | 5 | — | const payload = { supporterId: d.supporterId | — | 400 400 |
| new/atoms/remove-org-member.mjs | 5 | — | const variants = [...new Set([email.trim(),  | platformOrgs | — |
| new/atoms/segula-reminders.mjs | 5 | — | — | ${startIso}T12:00:00 | 21 35 40 |
| new/atoms/slugify.mjs | 5 | — | const lat = [...orgName.trim().toLowerCase() | — | 30 30 |
| new/atoms/block-reason.mjs | 4 | — | — | ${hp.month} ${hp.day} | 10 20 |
| new/atoms/build-month-grid.mjs | 4 | — | — | — | 42 15 15 31 |
| new/atoms/clear-employee-field.mjs | 4 | — | — | platformOrgs · memberConfigs | — |
| new/atoms/collection-score-delta.mjs | 4 | — | — | — | 10 50 60 86400000 |
| new/atoms/commands-filter-commands.mjs | 4 | — | — | — | 12 60 40 20 |
| new/atoms/coordinator-print-lines.mjs | 4 | — | const lines = [ T2.k3 + (coord?.name | — | 30 |
| new/atoms/delete-org-join-request.mjs | 4 | — | — | platformOrgs · joinRequests | — |
| new/atoms/delete-org-member-config.mjs | 4 | — | — | platformOrgs · memberConfigs | — |
| new/atoms/delivery-list-lines.mjs | 4 | — | — | 🦺 ${volName} (${list.length}$ ·   • ${r.familyName} · ${status | — |
| new/atoms/distribution-list-lines.mjs | 4 | — | const lines = [T.k1 + (product?.name ?? ''), | — | 30 |
| new/atoms/don-allowed-keys.mjs | 4 | — | const clean = [...new Set(allowed.map((s) => | — | 29 |
| new/atoms/excel-serial-to-iso.mjs | 4 | — | — | ${dt.getUTCFullYear()}-${mo}-$ | 25569 86400000 |
| new/atoms/fetch-org-join-requests.mjs | 4 | — | — | platformOrgs · joinRequests | — |
| new/atoms/fetch-provider-rows.mjs | 4 | — | — | incomingPayments · provider | — |
| new/atoms/gen-join-code.mjs | 4 | — | — | — | 2166136261 16777619 36 36 |
| new/atoms/gen-recovery-key.mjs | 4 | — | const chars = [...bytes].map((b) => ALPHABET | — | 24 |
| new/atoms/guide-foot.mjs | 4 | המדריך המלא והמפורט נמצא בקובץ | — | — | — |
| new/atoms/heb-month-he.mjs | 4 | — | — | he-u-ca-hebrew · long | — |
| new/atoms/maps-route-url.mjs | 4 | — | — | https://www.google.com/maps/se · https://www.google.com/maps/di | — |
| new/atoms/next-closure.mjs | 4 | — | const tenant = { city, timezone: T.k2 } | — | 10 |
| new/atoms/norm-search.mjs | 4 | "׳״\-–._]/g,  | — | — | — |
| new/atoms/parse-supporter-grid.mjs | 4 | — | const row = { name, phone: g(r,  | — | 15 |
| new/atoms/publish-ics-feed.mjs | 4 | לוח-השנה גדול מדי לפרסום כפיד  | — | — | — |
| new/atoms/read-ics-feed-token.mjs | 4 | — | — | icsFeeds · string | — |
| new/atoms/reenroll-list-text.mjs | 4 | ${r.memberName} · ${r.courseNa | — | — | — |
| new/atoms/sup-allowed-keys.mjs | 4 | — | const clean = [...new Set(allowed.map((s) => | — | 29 |
| new/atoms/wheel-index-under-pointer.mjs | 4 | — | — | — | 360 360 360 360 |
| new/atoms/write-mail-outbox.mjs | 4 | — | — | mailOutbox · pending | — |
| new/atoms/write-org-join-request.mjs | 4 | — | — | platformOrgs · joinRequests | — |
| new/atoms/write-org-secrets.mjs | 4 | — | — | orgSecrets · orgSecretsMeta | — |
| new/atoms/write-sms-outbox.mjs | 4 | — | — | smsOutbox · pending | — |
| new/atoms/academic-year-label.mjs | 3 | — | — | ${startYear}/${nn} | 100 |
| new/atoms/amount-in-words.mjs | 3 | — | — | — | 100 20 20 |
| new/atoms/append-call.mjs | 3 | — | const next = [...(calls ?? []), { at: iso, o | — | — |
| new/atoms/apply-entity-partial.mjs | 3 | — | const next = [...incoming.values(), ...kept] | — | — |
| new/atoms/apply-outcome.mjs | 3 | — | const entry = { id, outcome, at: iso } | — | — |
| new/atoms/apply-vertical-pack.mjs | 3 | — | const next = { ...config, terms: { ...pack.t | — | — |
| new/atoms/approve-member.mjs | 3 | — | const members = [...new Set([...(org.members | — | — |
| new/atoms/audit-report-lines.mjs | 3 | — | const L = [T.k1 + (orgName || T.k2), T.k3 +  | — | — |
| new/atoms/ayin-board-items.mjs | 3 | — | const a = { ...emptyAyin(), ...sp.ayin } | — | — |
| new/atoms/boxes-overview.mjs | 3 | — | const cmp = { num: (a, b) => (parseI | — | — |
| new/atoms/build-ics.mjs | 3 | — | const lines = [ T2.k1, T2.k2 | — | — |
| new/atoms/campaign-csv-rows.mjs | 3 | — | const rows = [[T.k1, T.k2, T.k3, T.k4]] | — | — |
| new/atoms/charge-to-hist.mjs | 3 | — | const h = { d: (charge.d || (charge. | — | — |
| new/atoms/chip-style.mjs | 3 | — | — | — | 999 12 700 |
| new/atoms/cockpit-csv-rows.mjs | 3 | — | const KIND_LABEL = { call: T.k1, thanks: T.k | — | — |
| new/atoms/cockpit-queue.mjs | 3 | — | const tasks = [...calls, ...thanks, ...hok] | — | — |
| new/atoms/cockpit-work-list-text.mjs | 3 | — | const KIND_ICON = { call: T.k1, thanks: T.k2 | — | — |
| new/atoms/collections-csv-rows.mjs | 3 | — | const rows = [[T2.k1, T2.k2, T2.k3, T(T2.k4, | — | — |
| new/atoms/component-counts.mjs | 3 | — | const out = { meeting: 0, coupon: 0, gift: 0 | — | — |
| new/atoms/compose-smtp-url.mjs | 3 | — | — | ${scheme}://${encodeURICompone | 465 |
| new/atoms/contact-to-row.mjs | 3 | — | const notes = [c.org ? '🏢 ' + c.org : '', c | — | — |
| new/atoms/cooldown-for-fails.mjs | 3 | — | — | — | 30000 15000 5000 |
| new/atoms/decode-quoted-printable.mjs | 3 | — | const PHONE_LABELS = { CELL: T.k2,  | — | — |
| new/atoms/deliveries-csv-rows.mjs | 3 | — | const rows = [[T2.k1, T(T2.k2, T2.k3), T2.k4 | — | — |
| new/atoms/demo-anchor.mjs | 3 | — | — | ${d.getFullYear()}-${p2(d.getM | 10 |
| new/atoms/encrypt-doc.mjs | 3 | — | — | AES-GCM | 12 |
| new/atoms/enroll-summary.mjs | 3 | — | const STATUS_LABEL = { active: T.k1,  | — | — |
| new/atoms/families-import-format-rows.mjs | 3 | — | const rows = [ [T.k1, T.k2, T.k3, T. | — | — |
| new/atoms/favicon-data-uri.mjs | 3 | — | — | <svg xmlns='http://www.w3.org/ | 2000 |
| new/atoms/filter-assignments.mjs | 3 | — | const cmp = { pending: (a, b) => {  | — | — |
| new/atoms/filter-coordinators.mjs | 3 | — | const cmp = { name: (a, b) => a.name | — | — |
| new/atoms/format-israeli-phone.mjs | 3 | — | — | 972 | 10 |
| new/atoms/heb-date-full.mjs | 3 | — | — | ${gem(hebParts(d).day)} ${fmtH | 10 |
| new/atoms/holiday-of.mjs | 3 | — | — | ${p.month} ${p.day} | 18 |
| new/atoms/intel-churn-from-scan.mjs | 3 | — | — | — | 365 30 50 |
| new/atoms/intel-donor-scan.mjs | 3 | — | — | — | 12 12 12 |
| new/atoms/lesson-tier-options.mjs | 3 | — | const out = [{ v: '', t: T.k1 + (c.lessonPri | — | — |
| new/atoms/lessons-in-term.mjs | 3 | — | — | — | 52 12 12 |
| new/atoms/maps-search-url.mjs | 3 | — | const q = [address, city].map(cleanStop).fil | — | — |
| new/atoms/match-all.mjs | 3 | — | const pool = [...allOpen] | — | — |
| new/atoms/merge-families-by-fields.mjs | 3 | — | const out = { ...base } | — | — |
| new/atoms/merge-supporters-by-fields.mjs | 3 | — | const out = { ...base } | — | — |
| new/atoms/parse-acc.mjs | 3 | — | const off = { contrast: false, noanim: false | — | — |
| new/atoms/parse-families-csv.mjs | 3 | — | const obj = { name, father: '',  | — | — |
| new/atoms/plan-demo-cleanup.mjs | 3 | — | const FP_FIELDS = { families: [T.k1, T.k | — | — |
| new/atoms/pull-audit-ring.mjs | 3 | — | — | auditlog | 500 |
| new/atoms/push-audit-ring.mjs | 3 | — | — | auditlog | 500 |
| new/atoms/push-nav.mjs | 3 | — | const h = [...hist, prev] | — | — |
| new/atoms/redemptions-csv-rows.mjs | 3 | — | const rows = [[T.k1, T.k2, T.k3, T.k4, T.k5, | — | — |
| new/atoms/reenroll-counts.mjs | 3 | — | const c = { total: 0, yes: 0, no: 0, hold: 0 | — | — |
| new/atoms/remove-member.mjs | 3 | — | const memberConfigs = { ...org.memberConfigs | — | — |
| new/atoms/resolve-localized.mjs | 3 | — | const SITE_LANGS = ['he', 'en', 'yi'] | — | — |
| new/atoms/resolve-org-config.mjs | 3 | — | const merged = { ...cloud, slug: staticCfg.s | — | — |
| new/atoms/sanitize-incoming.mjs | 3 | — | const LIST_FIELDS = { families: [T.k1, T | — | — |
| new/atoms/site-langs.mjs | 3 | — | const uniq = [...new Set(raw)] | — | — |
| new/atoms/stage-label.mjs | 3 | — | const STAGE_FALLBACK = { new: T.k1,  | — | — |
| new/atoms/strip-audit-meta.mjs | 3 | — | const rest = { ...meta } | — | — |
| new/atoms/strip-sup-key.mjs | 3 | — | const rest = { ...data } | — | — |
| new/atoms/sup-don-events.mjs | 3 | — | const meta = [ h.receipt && T2.k | — | — |
| new/atoms/sup-tier.mjs | 3 | — | — | — | 800 600 400 |
| new/atoms/sup12m.mjs | 3 | — | — | ${d.getFullYear()}-${p2(d.getM | 365 |
| new/atoms/supporters-import-format-rows.mjs | 3 | — | const rows = [[T.k1, T.k2, T.k3, T.k4, T.k5, | — | — |
| new/atoms/validate-heb-month-names.mjs | 3 | — | — | — | 3761 440 12 |
| new/atoms/volunteer-route-stops.mjs | 3 | — | const stop = [fam.address, fam.city].map((s) | — | — |
| new/atoms/add-org-member.mjs | 2 | — | — | platformOrgs | — |
| new/atoms/build-reenroll-rows.mjs | 2 | — | — | ${memberName} ${family} ${cour | — |
| new/atoms/cockpit-calls.mjs | 2 | — | — | — | 60 5000 |
| new/atoms/decrypt-doc.mjs | 2 | — | — | AES-GCM | — |
| new/atoms/delete-org-request.mjs | 2 | — | — | platformRequests | — |
| new/atoms/fetch-all-orgs.mjs | 2 | — | — | platformOrgs | — |
| new/atoms/fetch-nedarim-donors.mjs | 2 | — | — | nedarimDonors | — |
| new/atoms/fetch-org-cloud-config.mjs | 2 | — | — | platformOrgs | — |
| new/atoms/fetch-org-leads.mjs | 2 | — | — | platformLeads | — |
| new/atoms/fetch-org-requests.mjs | 2 | — | — | platformRequests | — |
| new/atoms/fold-ics-line.mjs | 2 | — | — | — | 75 75 |
| new/atoms/gematria.mjs | 2 | — | — | — | 100 15 |
| new/atoms/group-options-of.mjs | 2 | — | — | ${v}${T.k1}${dayNames[s.day]}  | — |
| new/atoms/groups-hint-from-audience.mjs | 2 | — | — | — | 10 12 |
| new/atoms/hash-pin.mjs | 2 | — | — | SHA-256 | — |
| new/atoms/iso-local.mjs | 2 | — | — | ${d.getFullYear()}-${p2(d.getM | — |
| new/atoms/match-incoming-to-planned.mjs | 2 | — | — | — | 100 60 |
| new/atoms/min-to-hm.mjs | 2 | — | — | — | 60 60 |
| new/atoms/next-academic-year-label.mjs | 2 | — | — | — | -12 31 |
| new/atoms/norm-phone.mjs | 2 | — | — | 972 | — |
| new/atoms/phone-key.mjs | 2 | — | — | 972 | — |
| new/atoms/prompt-install.mjs | 2 | — | — | accepted | — |
| new/atoms/purpose-key-of.mjs | 2 | — | — | _shared_ | — |
| new/atoms/push-diff.mjs | 2 | — | — | — | 400 400 |
| new/atoms/range-label.mjs | 2 | — | — | ${fmtDate(r.from)} – ${fmtDate | — |
| new/atoms/read-cloud-envelope.mjs | 2 | — | — | object | — |
| new/atoms/read-org-secrets-meta.mjs | 2 | — | — | orgSecretsMeta | — |
| new/atoms/receipt-verify-code.mjs | 2 | — | — | — | 10 36 |
| new/atoms/resolve-enroll-family.mjs | 2 | — | — | __new | — |
| new/atoms/rewrap-password.mjs | 2 | — | — | raw | — |
| new/atoms/rooms-now.mjs | 2 | — | — | — | 60 60 |
| new/atoms/task-stats-for.mjs | 2 | — | — | — | 10 86400000 |
| new/atoms/tier-of.mjs | 2 | — | — | — | 950 800 |
| new/atoms/write-org-cloud-doc.mjs | 2 | — | — | platformOrgs | — |
| new/atoms/write-org-lead.mjs | 2 | — | — | platformLeads | — |
| new/atoms/write-org-request.mjs | 2 | — | — | platformRequests | — |
| new/atoms/age-of.mjs | 1 | — | — | — | 10 |
| new/atoms/campaign-progress.mjs | 1 | — | — | — | 100 |
| new/atoms/cockpit-at-risk.mjs | 1 | — | — | — | 60 |
| new/atoms/cockpit-hok-tasks.mjs | 1 | — | — | — | 100 |
| new/atoms/col-ref-to-index.mjs | 1 | — | — | — | 26 |
| new/atoms/decode-csv-buffer.mjs | 1 | — | — | — | 400 |
| new/atoms/detect-recurring-hok.mjs | 1 | — | — | — | 28 |
| new/atoms/done-today-for.mjs | 1 | — | — | — | 10 |
| new/atoms/effective-price.mjs | 1 | — | — | — | 100 |
| new/atoms/explain-one.mjs | 1 | — | — | — | 400 |
| new/atoms/fam-history-of.mjs | 1 | — | — | — | 40 |
| new/atoms/finder-axis-value.mjs | 1 | — | — | — | 700 |
| new/atoms/fmt-date.mjs | 1 | — | — | — | 10 |
| new/atoms/freshen-demo-db.mjs | 1 | — | — | — | 10 |
| new/atoms/gem-year.mjs | 1 | — | — | — | 1000 |
| new/atoms/heb-parts-of-iso.mjs | 1 | — | — | — | 10 |
| new/atoms/hok-effectively-active.mjs | 1 | — | — | — | 12 |
| new/atoms/holiday-names.mjs | 1 | — | — | — | 400 |
| new/atoms/integer-in-words.mjs | 1 | — | — | — | 1000 |
| new/atoms/intel-day-diff.mjs | 1 | — | — | — | 10 |
| new/atoms/intel-donor-intel.mjs | 1 | — | — | — | 12 |
| new/atoms/intel-trend-from-scan.mjs | 1 | — | — | — | 100 |
| new/atoms/is-safe-accent.mjs | 1 | — | — | — | 20 |
| new/atoms/is-valid-slug.mjs | 1 | — | — | — | 40 |
| new/atoms/kit-progress.mjs | 1 | — | — | — | 100 |
| new/atoms/makeup-eligibility.mjs | 1 | — | — | — | 48 |
| new/atoms/max-discount-pct.mjs | 1 | — | — | — | 100 |
| new/atoms/needs-care-tzedaka.mjs | 1 | — | — | — | 14 |
| new/atoms/org-slug-from-url.mjs | 1 | — | — | — | 40 |
| new/atoms/pay-link.mjs | 1 | — | — | — | 100 |
| new/atoms/portfolio-active-by-month.mjs | 1 | — | — | — | 12 |
| new/atoms/portfolio-tier-trend-counts.mjs | 1 | — | — | — | 12 |
| new/atoms/punch-confirm-step.mjs | 1 | — | — | — | 3000 |
| new/atoms/receipt-lines.mjs | 1 | — | — | — | 10 |
| new/atoms/round2.mjs | 1 | — | — | — | 100 |
| new/atoms/rule-contains.mjs | 1 | — | — | — | 62 |
| new/atoms/rule-exact.mjs | 1 | — | — | — | 100 |
| new/atoms/rule-plural.mjs | 1 | — | — | — | 70 |
| new/atoms/rule-prefix.mjs | 1 | — | — | — | 80 |
| new/atoms/rule-skeleton.mjs | 1 | — | — | — | 58 |
| new/atoms/rule-typo.mjs | 1 | — | — | — | 52 |
| new/atoms/run-net-check.mjs | 1 | — | — | — | 8000 |
| new/atoms/sanitize-support-text.mjs | 1 | — | — | — | 2000 |
| new/atoms/site-campaign-progress.mjs | 1 | — | — | — | 100 |
| new/atoms/smart-score.mjs | 1 | — | — | — | 100 |
| new/atoms/spotlight-box.mjs | 1 | — | — | — | 10 |
| new/atoms/stale-boxes.mjs | 1 | — | — | — | 90 |
| new/atoms/step-scale.mjs | 1 | — | — | — | 10 |
| new/atoms/sup-score-bins.mjs | 1 | — | — | — | 10 |
| new/atoms/support-day-label.mjs | 1 | — | — | — | 10 |
| new/atoms/support-preview.mjs | 1 | — | — | — | 40 |
| new/atoms/time-to-min.mjs | 1 | — | — | — | 60 |
| new/atoms/upcoming-holidays.mjs | 1 | — | — | — | 45 |
| new/atoms/valid-israeli-id.mjs | 1 | — | — | — | 10 |
| new/atoms/with-nedarim-hok.mjs | 1 | — | — | — | 10 |
