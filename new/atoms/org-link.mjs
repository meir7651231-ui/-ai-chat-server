/** חוט · org-link — קישור-לקוח ‏{origin}{basePath}?org={slug}. חוזה: org-link.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:65-67. עצמאי — אפס import פנימי. */
export function orgLink(origin, basePath, slug, T) {
  return origin + basePath + T.k1 + slug;
}
