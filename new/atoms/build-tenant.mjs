/** חוט · build-tenant — תזמור: קונפיג-דייר גולמי ⇒ אימות ⇒ קבצי-מרכזייה. חוזה: build-tenant.contract.md
 *  חולץ כלשונו מ-maor/telephony/lib/index.mjs; קריאות-החוץ (validateTenant /
 *  generateConfig / effectiveConfig) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function buildTenant(raw, opts = {}, validateTenant, generateConfig, effectiveConfig) {
  // שכבות-הרשאה (מפעיל→לקוח→עובד) — נמזגות לפני הוולידציה. בלי layers = ביט-זהה.
  let cfg = raw;
  if (opts.layers && (opts.layers.base || opts.layers.member)) {
    const eff = effectiveConfig(opts.layers.base || {}, raw, opts.layers.member || null);
    cfg = { ...raw, features: eff.features, terms: eff.terms };
  }
  const { ok, errors, warnings, tenant } = validateTenant(cfg);
  if (!ok) return { ok: false, errors, warnings };
  const { files, manifest, warnings: genWarns } = generateConfig(tenant, warnings, opts);
  return { ok: true, errors: [], warnings: genWarns || warnings, files, manifest, tenant };
}
