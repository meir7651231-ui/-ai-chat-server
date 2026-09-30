package il.liba.app

/**
 * step update-trust: the chain an update has to pass before the installer sees it. version.json is signed (Ed25519, the
 * command key, over "v1|versionCode|sha256|url") by ship/release.mjs - a manifest without a signature or a sha256 is
 * not an update. The file then has to be whole, an APK, exactly those bytes, signed by the key of what is running, and
 * newer. Each refusal has its own reason, said aloud and written to the black box. Pure JVM - tested in tests/kt.
 */
object UpdateTrust {
    fun manifestMsg(code: Int, sha: String, url: String) = "v1|$code|$sha|$url"
    /** null when the manifest may be believed; else why not */
    fun manifest(code: Int, sha: String, url: String, sig: String, pub: String = Signed.PUB): String? = when {
        sig.isEmpty() -> "הגרסה לא חתומה"
        !Regex("^[0-9a-f]{64}$").matches(sha) -> "אין טביעה לגרסה"
        !url.startsWith("https://") -> "הקישור לגרסה אינו מאובטח"
        !Signed.verify(manifestMsg(code, sha, url), sig, pub) -> "החתימה על הגרסה לא נכונה"
        else -> null
    }
    data class Got(val bytes: Long, val expected: Long, val isApk: Boolean, val sha: String, val sameSigner: Boolean, val code: Int)
    /** null when the downloaded file may go to the installer; else why not */
    fun file(want: String, g: Got, mine: Int): String? = when {
        g.expected > 0 && g.bytes != g.expected -> "ההורדה נקטעה"
        !g.isApk -> "הקובץ שהתקבל אינו אפליקציה"
        want.isEmpty() || g.sha != want -> "הקובץ שהתקבל אינו הגרסה שנשלחה"
        !g.sameSigner -> "הקובץ חתום במפתח אחר ממה שמותקן"
        g.code <= mine -> "זו לא גרסה חדשה יותר"
        else -> null
    }
    /** step verified-install: before a byte is written - the permission, the server's answer, what it sent, the room */
    fun before(canInstall: Boolean, http: Int, contentType: String, expected: Long, freeBytes: Long): String? = when {
        !canInstall -> "אין לי הרשאה להתקין אפליקציות"
        http == 404 -> "הגרסה לא נמצאה בשרת"
        http != 200 -> "שרת העדכון ענה $http"
        contentType.startsWith("text/html") -> "קיבלתי דף שגיאה במקום אפליקציה"
        freeBytes < maxOf(expected, 20_000_000L) * 3 -> "אין מספיק מקום בטלפון"
        else -> null
    }
    /** what Android's installer answered, in words (PackageInstaller.STATUS_*); null = installed */
    fun installed(status: Int, msg: String?): String? = when (status) {
        0 -> null
        -1 -> "מחכה לאישור שלך בחלון ההתקנה"
        2 -> "המערכת חסמה את ההתקנה"
        3 -> "ההתקנה בוטלה"
        4 -> "הקובץ פגום"
        5 -> "יש התנגשות עם הגרסה המותקנת"
        6 -> "אין מספיק מקום להתקנה"
        7 -> "הגרסה לא מתאימה לטלפון הזה"
        else -> "ההתקנה נכשלה" + (if (!msg.isNullOrBlank()) " (" + msg.take(60) + ")" else "")
    }
    /** a rollback: Android never installs an older version over a newer one (only an uninstall, which erases everything) -
     *  so going back means the previous code shipped again under a new version number */
    fun rollbackWords(prevName: String?): String = if (prevName == null) "אין לי גרסה קודמת שמורה."
        else "אנדרואיד לא מרשה להתקין גרסה ישנה מעל חדשה בלי למחוק הכול. שמרתי את $prevName; הדרך הנכונה היא להעלות אותה שוב כגרסה חדשה - תגיד למנהל \"תעלה שוב את הגרסה הקודמת\"."
}
