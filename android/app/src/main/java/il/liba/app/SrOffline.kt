package il.liba.app

/**
 * What the bubble says when it cannot understand speech without a network (phone test, airplane mode: it flashed
 * "אין אינטרנט לזיהוי" and then "שגיאת מיקרופון" and said nothing). Pure Kotlin (JVM-tested).
 */
object SrOffline {
    fun say(err: Int, onDevice: Boolean): String =
        if (onDevice && (err == 12 || err == 13)) "בלי אינטרנט אני לא מבינה דיבור: אין בטלפון זיהוי עברית מקומי. אפשר להוריד עברית בהגדרות של Google, זיהוי דיבור אופליין."
        else "אין אינטרנט, ולכן אני לא מבינה מה אמרת. כשהרשת תחזור, תגיד שוב."
}
