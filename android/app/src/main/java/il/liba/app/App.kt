package il.liba.app

import android.app.Application

/** Records the last crash so it can be shown (and sent to Claude) instead of vanishing. */
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        val prev = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                val sw = java.io.StringWriter(); e.printStackTrace(java.io.PrintWriter(sw))
                getSharedPreferences("liba", MODE_PRIVATE).edit().putString("crash", "${java.util.Date()}\n${sw.toString().take(4000)}").commit()
            } catch (x: Exception) {}
            prev?.uncaughtException(t, e)
        }
    }
}
