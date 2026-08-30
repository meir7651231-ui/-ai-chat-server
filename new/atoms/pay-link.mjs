/** חוט · pay-link — בניית קישור-תשלום: amount/name על ה-URL של הארגון.
 *  חוזה: pay-link.contract.md · שקעים: safeHttpsUrl
 *  חולץ כלשונו מ-maor/src/lib/payLink.ts:15-38 (השכן safeHttpsUrl שוקע — חוק-1). */
export function payLink(payUrl, amount, name = '', safeHttpsUrl, T) {
  const base = safeHttpsUrl(payUrl);
  if (!base) return null;
  const amt = String(Math.max(0, Math.round(amount * 100) / 100));
  if (base.includes(T.k1) || base.includes(T.k2)) {
    // תבנית-מותאמת — החלפה בתוך ה-URL (גם בצורה המקודדת שה-URL parser מייצר).
    // סכום 0 ("לא-ידוע", קישור-תרומה-כללי) ⇒ שדה-ריק, עקבי עם מצב-הפרמטרים (לא Amount=0).
    return base
      .replace(/%7Bamount%7D|\{amount\}/g, amt === '0' ? '' : encodeURIComponent(amt))
      .replace(/%7Bname%7D|\{name\}/g, encodeURIComponent(name));
  }
  const u = new URL(base);
  // כיוון-יוצא נדרים-פלוס: עמוד-הסליקה שלהם קורא **Amount/ClientName** (PascalCase),
  // לא amount/name. זיהוי-מארח ⇒ מילוי-מראש שבאמת נתפס ("המערכת לוחצת על הקישור").
  if (/(^|\.)matara\.pro$/i.test(u.hostname) && /nedarimplus/i.test(u.pathname + u.search)) {
    if (amt !== '0') u.searchParams.set(T.k3, amt);
    if (name.trim()) u.searchParams.set(T.k4, name.trim());
    return u.toString();
  }
  if (amt !== '0') u.searchParams.set(T.k5, amt);
  if (name.trim()) u.searchParams.set(T.k6, name.trim());
  return u.toString();
}
