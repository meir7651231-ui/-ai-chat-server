package il.liba.app

import android.content.Intent
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import androidx.core.content.ContextCompat

/** Step 33: one tap from the lock screen / quick settings = "דבר". */
class TalkTile : TileService() {
    override fun onStartListening() { super.onStartListening(); qsTile?.let { it.state = if (BubbleService.running) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE; it.label = "ליבה – דבר"; it.updateTile() } }
    override fun onClick() {
        super.onClick()
        val i = Intent(this, BubbleService::class.java).setAction("il.liba.TALK")
        if (BubbleService.running) startService(i)
        else { try { ContextCompat.startForegroundService(this, Intent(this, BubbleService::class.java)) } catch (e: Exception) {} }
        if (isLocked && Build.VERSION.SDK_INT >= 24) unlockAndRun { }
    }
}
