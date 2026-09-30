package il.liba.app

import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import java.util.Base64

/**
 * step signed-commands: the phone obeys a command only if it is signed (Ed25519, the key in tools/cmd.mjs), not expired,
 * and its nonce was never seen - so even a page that was broken into cannot make the phone act. Three local actions that
 * only open Android's own screens (where Meir himself decides) need no signature. "open" to a host outside the short list
 * becomes a notification he has to tap, signed or not. Pure JVM (java.util.Base64, java.net.URI) - tested in tests/kt.
 */
object Signed {
    const val PUB = "MCowBQYDK2VwAyEAMG4YGL185eVi8Z7kvOjIqysywHVj3VmLH/5mmld3Wp0="
    val LOCAL = setOf("sense_open", "cal_on", "cal_off")
    val OPEN_HOSTS = setOf("claude.ai", "github.com", "raw.githubusercontent.com")
    fun verify(msg: String, sigB64: String, pub: String = PUB): Boolean = runCatching {
        val pk = KeyFactory.getInstance("Ed25519").generatePublic(X509EncodedKeySpec(Base64.getDecoder().decode(pub)))
        Signature.getInstance("Ed25519").run { initVerify(pk); update(msg.toByteArray(Charsets.UTF_8)); verify(Base64.getDecoder().decode(sigB64)) }
    }.getOrDefault(false)
    fun openHostOk(url: String): Boolean = runCatching { val u = java.net.URI(url); u.scheme == "https" && (u.host ?: "") in OPEN_HOSTS }.getOrDefault(false)
    /** null when it may run; else why not. `seen` is the nonce memory (the caller keeps it on disk) */
    fun check(cmd: String, nonce: String, exp: Long, sig: String, seen: MutableList<String>, now: Long, pub: String = PUB): String? {
        if (cmd in LOCAL) return null
        if (cmd.startsWith("open ") && openHostOk(cmd.removePrefix("open ").trim())) return null
        if (sig.isEmpty() || nonce.isEmpty()) return "לא חתומה"
        if (exp < now) return "פג תוקף"
        if (nonce in seen) return "נשלחה כבר פעם"
        if (!verify("cmd|$nonce|$exp|$cmd", sig, pub)) return "חתימה לא נכונה"
        seen.add(nonce); while (seen.size > 200) seen.removeAt(0)
        return null
    }
}
