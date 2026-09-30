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
}
