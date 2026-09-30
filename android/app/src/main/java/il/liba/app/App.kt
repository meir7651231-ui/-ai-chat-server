package il.liba.app

import android.app.Application

/** Records the last crash so it can be shown (and sent to Claude) instead of vanishing. */
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        Trace.init(this)
        val prev = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                val sw = java.io.StringWriter(); e.printStackTrace(java.io.PrintWriter(sw))
                val text = "${java.util.Date()}\n${sw.toString().take(4000)}"
                // keystore-vault: sealed, or - if the keystore itself is what broke - only where it broke, never what it held
                try { Vault.put(this, "crash", text) } catch (v: Throwable) { getSharedPreferences("liba", MODE_PRIVATE).edit().putString("crash_min", VaultCore.scrubStack(text)).commit() }
            } catch (x: Exception) { Trace.crash(x.javaClass.simpleName) }
            prev?.uncaughtException(t, e)
        }
    }
}
