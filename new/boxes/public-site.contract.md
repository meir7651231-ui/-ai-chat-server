# חוזה · קופסת-חיבורים public-site (lib-publicSite)

**תפקיד:** מנוע האתר-הציבורי (טהור, בלי store/DOM) — פותר טקסט רב-לשוני,
גוזר פלטת-ורטיקל, מחשב התקדמות-קמפיין+ספירה-לאחור, גוזר שפות/תוויות/מונחים,
ומכריע האם/לאן להציג. האתר מוזן ישירות מהקונפיג; שדה חסר נופל-בחן.
מקור-האמת: `maor/src/lib/publicSite.ts` (11 חוטים).

**הכרעות-החיווט (חיות בקופסה, לא בחוטים):**
- `FALLBACK_PALETTE = CORAL_PALETTE` — פלטת-הנפילה כשאין accent (chesed ביט-זהה);
  מוזרקת ל-`sitePalette` כארגומנט-שני. מקור: `publicSite.ts:123` (`return CORAL_PALETTE`).
- `KNOWN_LANGS = SITE_LANGS` (=`['he','en','yi']`) — הרשימה-הלבנה של `siteLangs`,
  וסדר-הנפילה של `resolveLocalized`. מקור: `publicSite.ts:192` + `types/config.ts:65`.
- `UI = SITE_UI_LABELS` — מילון-התוויות פר-שפה שמוזרק ל-`siteUi`.
  מקור: `publicSite.ts:199` (`SITE_UI[lang] ?? SITE_UI.he`).

**שקעי-IO (מוזרקים ע"י הקורא — לא ממומשים בקופסה):**
- `nowMs`⇒number — חותמת-הזמן של הקורא, נכנסת ל-`campaign(c, nowMs)` לספירה-לאחור.
  טהור/בדיק, אפס Date.now. מקור: `publicSite.ts:219-221` (הפרמטר `nowMs`).

**API (חוט⇒יצוא):**
| יצוא | חתימה | חוט-מקור | שורות-מקור |
|---|---|---|---|
| `isRtl` | `(lang)⇒bool` | isRtlLang | publicSite.ts:35-37 |
| `palette` | `(accent)⇒SitePalette` | sitePalette (fallback מחווט) | publicSite.ts:121-138 |
| `vocab` | `(commercial,lang)⇒SiteVocab` | siteVocab | publicSite.ts:153-171 |
| `localize` | `(t,lang)⇒string` | resolveLocalized | publicSite.ts:177-188 |
| `langs` | `(site)⇒SiteLang[]` | siteLangs (knownLangs מחווט) | publicSite.ts:191-195 |
| `ui` | `(lang,key)⇒string` | siteUi (uiLabels מחווט) | publicSite.ts:198-200 |
| `campaign` | `(c,nowMs)⇒CampaignProgress` | campaignProgress | publicSite.ts:218-236 |
| `hasSite` | `(config)⇒bool` | hasPublicSite | publicSite.ts:242-244 |
| `donateUrl` | `(config)⇒string\|null` | siteDonateUrl | publicSite.ts:247-253 |
| `LANGS`/`UI_LABELS`/`CORAL` | קבועים | SITE_LANGS/SITE_UI_LABELS/CORAL_PALETTE | — |

**דוגמאות מחייבות:**
1. `isRtl('en')⇒false` · `isRtl('he')⇒true` · `isRtl('yi')⇒true`.
2. `palette()` (בלי accent) ⇒ `CORAL_PALETTE` ביט-זהה (`c1:'#EC9C9C'`,`word:'#E29392'`).
   `palette('#3366cc').c2` שומר-גוון (כחול) ומחזיר hex תקין.
3. `vocab(false,'he').navCta ⇒ 'לתרומה ♡'` · `vocab(true,'en').heroCta ⇒ 'Get in touch'`.
4. `localize({he:'שלום',en:'Hi'},'en') ⇒ 'Hi'` · `localize({en:'Hi'},'yi') ⇒ 'Hi'`
   (נפילה: yi ריק ⇒ he ריק ⇒ ראשון לא-ריק) · `localize('טקסט','he') ⇒ 'טקסט'` ·
   `localize(undefined,'he') ⇒ ''`.
5. `langs({langs:['en','he','en','zz']}) ⇒ ['en','he']` (מסונן+ייחודי) ·
   `langs(undefined) ⇒ ['he']`.
6. `ui('he','donate') ⇒ 'לתרומה'` · `ui('en','goal') ⇒ 'Goal'` ·
   `ui('zz','donate') ⇒ 'לתרומה'` (שפה-לא-מוכרת נופלת ל-he).
7. `campaign({goal:1000,raised:250,end:'2026-09-11'}, <חצות 2026-09-01>)` ⇒
   `{goal:1000,raised:250,pct:25,currency:'₪',daysLeft:10,show:true}`.
   `campaign({raised:5}, now).show ⇒ false` (בלי goal).
8. `hasSite({site:{}}) ⇒ true` · `hasSite({site:{enabled:false}}) ⇒ false` ·
   `hasSite({}) ⇒ false`.
9. `donateUrl({site:{donateUrl:'https://a'}}) ⇒ 'https://a'` ·
   `donateUrl({integrations:{payments:{payUrl:'https://p'}}}) ⇒ 'https://p'` ·
   `donateUrl({}) ⇒ null`.

**DoD:** `node new/boxes/public-site.test.mjs ⇒ exit 0` ·
`node machtzev/parity/public-site.parity.mjs ⇒ exit 0` (ישן≡חדש) ·
`node machtzev/police.mjs --fast ⇒ exit 0`.
