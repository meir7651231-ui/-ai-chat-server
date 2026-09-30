package il.liba.app

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.io.File
import java.security.KeyStore
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey

/**
 * step keystore-vault on the device: the key is made in the Android Keystore (it never leaves the secure hardware) and
 * seals filesDir/vault/<name>.bin. No user authentication on the key itself - the bubble writes while the screen is off;
 * reading the log on the screen is what asks for Meir's finger or code (MainActivity.unlock).
 */
object Vault {
    private const val ALIAS = "liba-vault-v1"
    @Volatile private var k: SecretKey? = null
    @Synchronized fun key(): SecretKey {
        k?.let { return it }
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val got = (ks.getEntry(ALIAS, null) as? KeyStore.SecretKeyEntry)?.secretKey ?: KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore").apply {
            init(KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setKeySize(256).build()) }.generateKey()
        k = got; return got
    }
    private fun f(c: Context, name: String) = File(File(c.filesDir, "vault").apply { mkdirs() }, "$name.bin")
    fun put(c: Context, name: String, plain: String) { val t = File(f(c, name).path + ".tmp"); t.writeText(VaultCore.seal(key(), plain, name)); t.renameTo(f(c, name)) }
    fun get(c: Context, name: String): String? = runCatching { val x = f(c, name); if (!x.exists()) null else VaultCore.open(key(), x.readText(), name) }
        .onFailure { Trace.e(Trace.Code.E_PREFS, "vault:" + it.javaClass.simpleName) }.getOrNull()
    fun remove(c: Context, name: String) { f(c, name).delete() }
    /** read a store: an old plaintext file is sealed into the vault and erased the first time; then only the vault */
    fun load(c: Context, name: String, legacy: File): String? {
        if (legacy.exists()) { val t = runCatching { legacy.readText() }.getOrNull(); if (t != null) runCatching { put(c, name, t); legacy.delete() }.onFailure { Trace.e(Trace.Code.E_PREFS, "vault-migrate:" + it.javaClass.simpleName) }; return t }
        return get(c, name) }
}
