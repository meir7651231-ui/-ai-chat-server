/** חוט · write-org-cloud-config — קונפיג-הארגון בשלמותו ⇒ מעטפת {config} לכתיבת-המסמך.
 *  חוזה: write-org-cloud-config.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:125-128 (תורגם TS→JS); הקריאה-לשכן
 *  writeOrgCloudDoc הוזרקה כפרמטר-שקע (חוק-1 — אפס import פנימי). */
export async function writeOrgCloudConfig(slug, config, writeOrgCloudDoc) {
  await writeOrgCloudDoc(slug, { config: JSON.parse(JSON.stringify(config)) });
}
