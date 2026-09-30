package il.liba.app.sense

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * step sense-bus-ears: the ears. Android asks Meir himself, in its own settings screen, before any app can read
 * notifications - ליבה only opens that screen when he says "תקשיבי להתראות של …". Group summaries and ongoing
 * notifications (music, a running call, ליבה's own) are not events. Only title and text travel, and only from the apps
 * he named (SenseCore drops the rest before anything is written).
 */
class NotifEars : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val s = sbn ?: return; val n = s.notification ?: return
        if (s.packageName == packageName) return
        if (n.flags and Notification.FLAG_GROUP_SUMMARY != 0 || n.flags and Notification.FLAG_ONGOING_EVENT != 0) return
        val x = n.extras ?: return
        val title = x.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val big = x.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
        val msgs = runCatching { x.getParcelableArray(Notification.EXTRA_MESSAGES)?.mapNotNull { (it as? android.os.Bundle)?.getCharSequence("text")?.toString() }?.lastOrNull() }.getOrNull()
        val text = msgs ?: big ?: x.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        SenseBus.emit(this, "notif", s.key + ":" + text.hashCode().toString(36), s.packageName, title, text)
    }
    override fun onNotificationRemoved(sbn: StatusBarNotification?) {}
}
