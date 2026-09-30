package il.liba.app

import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * step keystore-vault: what Meir said and what ליבה said is sealed at rest - AES-256-GCM, a fresh 12-byte nonce each
 * time, "v1:" + base64(nonce || ciphertext+tag). A changed byte does not open (null), it never opens as garbage. The key
 * lives in the Android Keystore and never leaves it (Vault); here it is only a parameter, so the JVM tests use their own.
 */
object VaultCore {
    fun seal(key: SecretKey, plain: String, aad: String = "liba"): String {
        val c = Cipher.getInstance("AES/GCM/NoPadding"); c.init(Cipher.ENCRYPT_MODE, key)   // the provider picks the nonce
        c.updateAAD(aad.toByteArray()); val ct = c.doFinal(plain.toByteArray(Charsets.UTF_8)); val iv = c.iv
        return "v1:" + Base64.getEncoder().encodeToString(iv + ct)
    }
    fun open(key: SecretKey, blob: String, aad: String = "liba"): String? = runCatching {
        require(blob.startsWith("v1:")); val b = Base64.getDecoder().decode(blob.substring(3)); require(b.size > 28)
        val c = Cipher.getInstance("AES/GCM/NoPadding"); c.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(128, b, 0, 12))
        c.updateAAD(aad.toByteArray()); String(c.doFinal(b, 12, b.size - 12), Charsets.UTF_8)
    }.getOrNull()
    /** a crash that could not be sealed: keep where it broke, never what it was holding (the messages may carry words) */
    fun scrubStack(trace: String): String = trace.lineSequence().map { l -> val t = l.trim()
        if (t.startsWith("at ")) l else l.substringBefore(':').trim() }.filter { it.isNotBlank() }.take(40).joinToString("\n")
}
