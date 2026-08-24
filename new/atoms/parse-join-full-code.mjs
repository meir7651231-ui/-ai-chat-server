/** חוט · parse-join-full-code — פירוק "קוד מהבוס" ‏{slug}.{code}.
 *  חוזה: parse-join-full-code.contract.md · שקע: isValidSlug
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:113-123 (קריאת-השכן שוקעה — חוק-1). */
export function parseJoinFullCode(full, isValidSlug) {
  const t = full.trim();
  const dot = t.indexOf('.');
  if (dot <= 0) return null;
  const slug = t.slice(0, dot).trim().toLowerCase();
  const code = t.slice(dot + 1).trim();
  if (!isValidSlug(slug) || !code) return null;
  return { slug, code };
}
