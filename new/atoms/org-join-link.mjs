/** חוט · org-join-link — קישור-הזמנה לעובד/ת: ‏{origin}{base}?org={slug}&join={code}.
 *  חוזה: org-join-link.contract.md · טהור, אפס שקעים.
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts. */
export function orgJoinLink(origin, basePath, slug, code) {
  return origin + basePath + '?org=' + slug + '&join=' + code;
}
