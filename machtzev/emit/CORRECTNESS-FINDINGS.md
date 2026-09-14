# 🩺 ממצאי-נכונות — האם המקור נכון (לא רק נקי)

נסרקו new/atoms · new/boxes · new/dart-maor · new/dart · ממצאים: 209 · 🔴 קריטיים: 4

| חומרה | קובץ | סוג | קטע | הסבר |
|---|---|---|---|---|
| 🔴 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.idNum || drop.idNum` | 'idNum' מאוחד keep.idNum || drop.idNum — אם שונים, אחד אובד בשקט (קריטי — זהות/כסף!) |
| 🔴 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.extId || drop.extId` | 'extId' מאוחד keep.extId || drop.extId — אם שונים, אחד אובד בשקט (קריטי — זהות/כסף!) |
| 🔴 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.hok || drop.hok` | 'hok' מאוחד keep.hok || drop.hok — אם שונים, אחד אובד בשקט (קריטי — זהות/כסף!) |
| 🔴 | new/dart-maor/merge-supporter-into.dart | בליעה-שקטה | `keep.hok ?? drop.hok` | 'hok' מאוחד keep.hok ?? drop.hok — אם שונים, אחד אובד בשקט (קריטי — זהות/כסף!) |
| 🟡 | new/atoms/annual-report-lines.mjs | חשבון-כסף-בצפים | `reduce((a, d) => a + (Number.isFinite(d.amount) ? d.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/block-reason.mjs | קבוע-קסם | `>= 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/box-total.mjs | חשבון-כסף-בצפים | `reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/build-custom-export.mjs | בליעה-שקטה | `m.phone || fam.phone` | 'phone' מאוחד m.phone || fam.phone — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/build-custom-export.mjs | בליעה-שקטה | `dons.length || answers.length` | 'length' מאוחד dons.length || answers.length — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/build-custom-export.mjs | חשבון-כסף-בצפים | `reduce((a, p) => a + (p.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/cockpit-collected-this-month.mjs | חשבון-כסף-בצפים | `.amount *` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/compute-quote.mjs | חשבון-כסף-בצפים | `reduce((s, l) => s + l.price` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/coral-palette.mjs | קבוע-קסם | `> 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/cred-help-text.mjs | קבוע-קסם | `<48` | '48' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/cred-red-threshold.mjs | קבוע-קסם | `<500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/fam-history-of.mjs | חשבון-כסף-בצפים | `.amount +` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/gematria.mjs | קבוע-קסם | `=== 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/hok-monthly-total.mjs | חשבון-כסף-בצפים | `.amount *` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/item-of.mjs | בליעה-שקטה | `comp.value ?? item.value` | 'value' מאוחד comp.value ?? item.value — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/item-of.mjs | בליעה-שקטה | `comp.basePrice ?? item.basePrice` | 'basePrice' מאוחד comp.basePrice ?? item.basePrice — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/match-incoming-to-planned.mjs | חשבון-כסף-בצפים | `.amount *` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.nextNote || drop.nextNote` | 'nextNote' מאוחד keep.nextNote || drop.nextNote — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.phone || drop.phone` | 'phone' מאוחד keep.phone || drop.phone — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.email || drop.email` | 'email' מאוחד keep.email || drop.email — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.address || drop.address` | 'address' מאוחד keep.address || drop.address — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.city || drop.city` | 'city' מאוחד keep.city || drop.city — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.cat || drop.cat` | 'cat' מאוחד keep.cat || drop.cat — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.forWho || drop.forWho` | 'forWho' מאוחד keep.forWho || drop.forWho — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.nextDate || drop.nextDate` | 'nextDate' מאוחד keep.nextDate || drop.nextDate — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | בליעה-שקטה | `keep.ayin || drop.ayin` | 'ayin' מאוחד keep.ayin || drop.ayin — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/merge-supporter-into.mjs | חשבון-כסף-בצפים | `reduce((a, d) => a + d.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/normalize-telephony.mjs | קבוע-קסם | `164 ===` | '164' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/paid-in-range.mjs | חשבון-כסף-בצפים | `reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/paid-of.mjs | חשבון-כסף-בצפים | `reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/preview-telephony.mjs | בליעה-שקטה | `built.warnings || v.warnings` | 'warnings' מאוחד built.warnings || v.warnings — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/pull-nedarim.mjs | בליעה-שקטה | `r.ok || j.ok` | 'ok' מאוחד r.ok || j.ok — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/pull-sola.mjs | בליעה-שקטה | `r.ok || j.ok` | 'ok' מאוחד r.ok || j.ok — אם שונים, אחד אובד בשקט |
| 🟡 | new/atoms/run-audit.mjs | חשבון-כסף-בצפים | `reduce((a, x) => a + x.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/atoms/signals-data.mjs | קבוע-קסם | `< 50` | '50' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/site-palette.mjs | קבוע-קסם | `> 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/atoms/status-meta.mjs | קבוע-קסם | `<500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/broadcast.mjs | בליעה-שקטה | `f.phone || m.phone` | 'phone' מאוחד f.phone || m.phone — אם שונים, אחד אובד בשקט |
| 🟡 | new/boxes/heb-cal-box.mjs | קבוע-קסם | `400 ===` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/helpers.mjs | קבוע-קסם | `> 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/intel.mjs | קבוע-קסם | `>= 5000` | '5000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/intel.mjs | קבוע-קסם | `>= 2000` | '2000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/intel.mjs | קבוע-קסם | `>= 500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/lib-cloud.mjs | בליעה-שקטה | `r.ok || j.ok` | 'ok' מאוחד r.ok || j.ok — אם שונים, אחד אובד בשקט |
| 🟡 | new/boxes/planned.mjs | חשבון-כסף-בצפים | `reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/boxes/signals.mjs | חשבון-כסף-בצפים | `reduce((a, e) => a + e.ils` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/boxes/team-intel.mjs | קבוע-קסם | `< 14` | '14' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/tier-migration.mjs | קבוע-קסם | `>= 5000` | '5000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/tier-migration.mjs | קבוע-קסם | `>= 2000` | '2000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/boxes/tier-migration.mjs | קבוע-קסם | `>= 500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/age-of.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/amount-in-words.dart | קבוע-קסם | `>999` | '999' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/amount-in-words.dart | קבוע-קסם | `< 20` | '20' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/amount-in-words.dart | קבוע-קסם | `> 999999999` | '999999999' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/apply-meta-partial.dart | קבוע-קסם | `< 9007199254740992` | '9007199254740992' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/block-reason.dart | קבוע-קסם | `>= 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/block-reason.dart | קבוע-קסם | `<= 21` | '21' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/block-reason.dart | קבוע-קסם | `<= 20` | '20' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/box-total.dart | חשבון-כסף-בצפים | `reduce((a,c) => a + (Number.isFinite(c.amount) ? c.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/dart-maor/build-custom-export.dart | בליעה-שקטה | `dons.isNotEmpty || answers.isNotEmpty` | 'isNotEmpty' מאוחד dons.isNotEmpty || answers.isNotEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/build-ics.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/build-slots.dart | קבוע-קסם | `< 96` | '96' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/build-slots.dart | קבוע-קסם | `>= 900` | '900' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/build-slots.dart | קבוע-קסם | `< 960` | '960' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/cockpit-calls.dart | קבוע-קסם | `>= 5000` | '5000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/compose-smtp-url.dart | בליעה-שקטה | `em.isEmpty || pw.isEmpty` | 'isEmpty' מאוחד em.isEmpty || pw.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/constellation-donor-constellation.dart | קבוע-קסם | `16 <` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/cred-help-text.dart | קבוע-קסם | `<48` | '48' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/cred-red-threshold.dart | קבוע-קסם | `< 500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/decode-csv-buffer.dart | קבוע-קסם | `< 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/decode-quoted-printable.dart | קבוע-קסם | `< 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/decrypt-db.dart | קבוע-קסם | `< 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/default-course-dates.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/detect-recurring-hok.dart | קבוע-קסם | `> 28` | '28' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/don-allowed-keys.dart | קבוע-קסם | `<29` | '29' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/donations-of-year.dart | קבוע-קסם | `>=32` | '32' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/excel-serial-to-iso.dart | קבוע-קסם | `> 8640000000000000` | '8640000000000000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/fam-history-of.dart | קבוע-קסם | `< 40` | '40' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/freshen-demo-db.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/gematria.dart | קבוע-קסם | `== 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/gematria.dart | קבוע-קסם | `== 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/gen-join-code.dart | קבוע-קסם | `65535 <` | '65535' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/gen-join-code.dart | קבוע-קסם | `16777619 <` | '16777619' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-cal-box.dart | קבוע-קסם | `400 ==` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 356` | '356' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 382` | '382' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 355` | '355' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 385` | '385' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 353` | '353' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 383` | '383' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `== 13` | '13' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `400 ==` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-date-full.dart | קבוע-קסם | `<= 11` | '11' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 356` | '356' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 382` | '382' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 355` | '355' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 385` | '385' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 353` | '353' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 383` | '383' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `== 13` | '13' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `400 ==` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-month-he.dart | קבוע-קסם | `<= 11` | '11' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 356` | '356' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 382` | '382' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 355` | '355' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 385` | '385' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 353` | '353' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 383` | '383' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `== 13` | '13' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/heb-parts.dart | קבוע-קסם | `400 ==` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/hok-monthly-total.dart | חשבון-כסף-בצפים | `.amount *` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/dart-maor/holiday-names.dart | קבוע-קסם | `< 400` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/holiday-of.dart | קבוע-קסם | `== 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/holiday-of.dart | קבוע-קסם | `== 11` | '11' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/integer-in-words.dart | קבוע-קסם | `> 999` | '999' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/integer-in-words.dart | קבוע-קסם | `> 999999999` | '999999999' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/intel-donor-scan.dart | קבוע-קסם | `== 185` | '185' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/intel-rfm-from-scan.dart | קבוע-קסם | `>= 5000` | '5000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/intel-rfm-from-scan.dart | קבוע-קסם | `>= 2000` | '2000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/intel-rfm-from-scan.dart | קבוע-קסם | `>= 500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/makeup-eligibility.dart | קבוע-קסם | `>= 48` | '48' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/merge-hist.dart | קבוע-קסם | `< 4294967295` | '4294967295' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/migrate-supporters-to-keyed.dart | קבוע-קסם | `400 <` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/mint-feed-token.dart | קבוע-קסם | `<16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/minutes-between-iso.dart | קבוע-קסם | `< 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/minutes-between-iso.dart | קבוע-קסם | `>= 19` | '19' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/name-matches.dart | בליעה-שקטה | `na.isEmpty || nb.isEmpty` | 'isEmpty' מאוחד na.isEmpty || nb.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/normalize-telephony.dart | קבוע-קסם | `<= 20` | '20' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/orbit-theme.dart | קבוע-קסם | `>= 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/orbit-theme.dart | קבוע-קסם | `<= 70` | '70' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/orbit-theme.dart | קבוע-קסם | `<= 265` | '265' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/org-slug-from-url.dart | קבוע-קסם | `20 !=` | '20' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/paid-in-range.dart | חשבון-כסף-בצפים | `reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/dart-maor/parse-any-date.dart | קבוע-קסם | `<= 99` | '99' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/parse-supporter-grid.dart | קבוע-קסם | `< 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/plan-nedarim-sync.dart | קבוע-קסם | `< 40` | '40' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/punch-confirm-step.dart | קבוע-קסם | `<= 3000` | '3000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/push-diff.dart | קבוע-קסם | `400 <` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/push-donations.dart | קבוע-קסם | `400 <` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/reencrypt-db.dart | קבוע-קסם | `> 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/room-info-label.dart | קבוע-קסם | `<= 4294967294` | '4294967294' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/rule-contains.dart | קבוע-קסם | `> 62` | '62' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/rule-plural.dart | קבוע-קסם | `> 70` | '70' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/run-audit.dart | קבוע-קסם | `> 25` | '25' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/run-audit.dart | קבוע-קסם | `<= 4294967294` | '4294967294' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/run-audit.dart | חשבון-כסף-בצפים | `reduce((a,x)=>a+x.amount` | סכימת סכומים ב-+/* על float — סיכון-עיגול מצטבר (עדיף אגורות) |
| 🟡 | new/dart-maor/safe-https-url.dart | בליעה-שקטה | `userRaw.isNotEmpty || passRaw.isNotEmpty` | 'isNotEmpty' מאוחד userRaw.isNotEmpty || passRaw.isNotEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `>65535` | '65535' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `!= 443` | '443' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `> 255` | '255' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `== 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `> 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `> 18` | '18' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/safe-https-url.dart | קבוע-קסם | `< 26` | '26' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sanitize-photos.dart | בליעה-שקטה | `ln.isNaN || mx.isNaN` | 'isNaN' מאוחד ln.isNaN || mx.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/segula-reminders.dart | קבוע-קסם | `> 8640000000000000` | '8640000000000000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/set-employee-override.dart | קבוע-קסם | `<= 4294967294` | '4294967294' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/site-campaign-progress.dart | בליעה-שקטה | `a.isNaN || b.isNaN` | 'isNaN' מאוחד a.isNaN || b.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/site-palette.dart | קבוע-קסם | `> 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/site-palette.dart | קבוע-קסם | `< 120` | '120' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/site-palette.dart | קבוע-קסם | `< 240` | '240' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/site-palette.dart | קבוע-קסם | `< 300` | '300' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/smart-score.dart | בליעה-שקטה | `a.isNaN || b.isNaN` | 'isNaN' מאוחד a.isNaN || b.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/sort-support-msgs.dart | בליעה-שקטה | `na.isNaN || nb.isNaN` | 'isNaN' מאוחד na.isNaN || nb.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/sort-team-msgs.dart | בליעה-שקטה | `x.isNaN || y.isNaN` | 'isNaN' מאוחד x.isNaN || y.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/spotlight-box.dart | בליעה-שקטה | `a.isNaN || b.isNaN` | 'isNaN' מאוחד a.isNaN || b.isNaN — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart-maor/strip-audit-meta.dart | קבוע-קסם | `> 4294967294` | '4294967294' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/strip-sup-key.dart | קבוע-קסם | `< 4294967295` | '4294967295' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-allowed-keys.dart | קבוע-קסם | `<29` | '29' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-count.dart | קבוע-קסם | `< 9007199254740992` | '9007199254740992' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-ils.dart | קבוע-קסם | `< 9007199254740992` | '9007199254740992' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-score.dart | קבוע-קסם | `>= 5000` | '5000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-score.dart | קבוע-קסם | `>= 2000` | '2000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-score.dart | קבוע-קסם | `>= 500` | '500' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-tier.dart | קבוע-קסם | `>= 800` | '800' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-tier.dart | קבוע-קסם | `< 400` | '400' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/sup-tier.dart | קבוע-קסם | `< 9007199254740992` | '9007199254740992' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/support-day-label.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/support-msg-max.dart | קבוע-קסם | `> 2000` | '2000' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/support-msg-time.dart | קבוע-קסם | `> 59` | '59' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/tier-of.dart | קבוע-קסם | `>= 950` | '950' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/tier-of.dart | קבוע-קסם | `>= 800` | '800' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/trust-report.dart | קבוע-קסם | `>= 95` | '95' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/trust-report.dart | קבוע-קסם | `>= 85` | '85' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/trust-report.dart | קבוע-קסם | `>= 70` | '70' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/validate-heb-month-names.dart | קבוע-קסם | `< 440` | '440' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/wa-digits.dart | קבוע-קסם | `> 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart-maor/warehouse-value.dart | קבוע-קסם | `<= 9007199254740992` | '9007199254740992' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/can_connect.dart | בליעה-שקטה | `sA.isEmpty || sB.isEmpty` | 'isEmpty' מאוחד sA.isEmpty || sB.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart/connection_fail_reason.dart | בליעה-שקטה | `sA.isEmpty || sB.isEmpty` | 'isEmpty' מאוחד sA.isEmpty || sB.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart/edge_cost.dart | קבוע-קסם | `>= 15` | '15' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/elbow_auto.dart | קבוע-קסם | `>= 160` | '160' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/estimate_pressure_drop.dart | קבוע-קסם | `< 2300` | '2300' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/friction_factor.dart | קבוע-קסם | `< 2300` | '2300' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/fuzzy_match.dart | בליעה-שקטה | `q.isEmpty || c.isEmpty` | 'isEmpty' מאוחד q.isEmpty || c.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart/fuzzy_score.dart | בליעה-שקטה | `q.isEmpty || c.isEmpty` | 'isEmpty' מאוחד q.isEmpty || c.isEmpty — אם שונים, אחד אובד בשקט |
| 🟡 | new/dart/material_rank.dart | קבוע-קסם | `< 20` | '20' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/recommended_kit_for_product.dart | קבוע-קסם | `<= 40` | '40' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/size_system.dart | קבוע-קסם | `>= 16` | '16' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/size_system.dart | קבוע-קסם | `<= 63` | '63' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/size_system.dart | קבוע-קסם | `>= 75` | '75' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/weather_icon_for.dart | קבוע-קסם | `<= 48` | '48' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/weather_icon_for.dart | קבוע-קסם | `<= 67` | '67' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/weather_icon_for.dart | קבוע-קסם | `<= 77` | '77' מקובע בהשוואה — מועמד למדיניות/הגדרה |
| 🟡 | new/dart/weather_icon_for.dart | קבוע-קסם | `<= 82` | '82' מקובע בהשוואה — מועמד למדיניות/הגדרה |
