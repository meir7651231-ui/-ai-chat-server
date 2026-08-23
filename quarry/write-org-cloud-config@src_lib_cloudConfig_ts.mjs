/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgCloudConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:126-137 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgCloudConfig, writeOrgCloudDoc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgCloudConfig(slug, config) {
    await writeOrgCloudDoc(slug, { config: JSON.parse(JSON.stringify(config)) });
}
/* ── כספת-מפתחות פר-ארגון (בקשת-בעלים 9.8: "כל מנהל יש את הסודות שלו") ──
   ‏orgSecrets/{slug} = הסודות עצמם — Rules: מנהל-הארגון כותב, **איש לא קורא
   מהדפדפן** (read:false; רק ה-functions ב-Admin-SDK). ‏orgSecretsMeta/{slug} =
   מדדי-"מוגדר ✓" בוליאניים בלבד — קריאים לחברי-הארגון, בלי הסוד עצמו. */
const ORG_SECRETS = 'orgSecrets';
const ORG_SECRETS_META = 'orgSecretsMeta';
/** המפתחות המוכרים — allowlist; כל השאר נזרק (כמו INTEGRATION_SETTING_KEYS). */
