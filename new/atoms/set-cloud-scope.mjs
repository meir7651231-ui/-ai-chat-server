/** חוט · set-cloud-scope — חישוב ערך תחום-הארגון החדש (slug + cloudRoot) לנתיבי-הענן.
 *  חוזה: set-cloud-scope.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:79-99; במקור הושם למשתנה-המודול scope —
 *  ההשמה (וברירת-המחדל הבטוחה {slug:'default',cloudRoot:true}) הן חיווט-קופסה
 *  (חוק-1/חוק-5 — האטום מחשב את הערך בלבד, לא מחזיק מצב). */
export function setCloudScope(slug, cloudRoot) {
    return { slug, cloudRoot };
}
