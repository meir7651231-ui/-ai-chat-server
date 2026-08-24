/** חוט · sign-out-cloud — ניתוק מהענן, כשל-רך: כל שגיאה (רשת / ענן-לא-אותחל)
 *  נבלעת בכוונה — מצב ה-auth המקומי יתעדכן בהזדמנות הבאה.
 *  חוזה: sign-out-cloud.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:338-346; השכנים signOut · requireAuth
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export async function signOutCloud(signOut, requireAuth) {
  try {
    await signOut(requireAuth());
  }
  catch {
    /* ניתוק נכשל (רשת) — מצב ה-auth המקומי יתעדכן בהזדמנות הבאה */
  }
}
