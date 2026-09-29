#!/usr/bin/env node
// step one-life: one owner of "is ליבה alive". Exactly one receiver brings the bubble back (boot + update), it is
// gated on Meir's own choice (Prefs.on, cleared only by "כבה בועה"), the revive alarm is armed from the service, and
// the speaking wake lock is released on every path out. The real measure (10 reboots, 7 days of pulses) is the phone's.
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), A = join(root, 'android/app/src/main')
const man = readFileSync(join(A, 'AndroidManifest.xml'), 'utf8'), svc = readFileSync(join(A, 'java/il/liba/app/BubbleService.kt'), 'utf8')
const act = readFileSync(join(A, 'java/il/liba/app/MainActivity.kt'), 'utf8')
const bad = []
const boot = (man.match(/<action android:name="android\.intent\.action\.BOOT_COMPLETED"\/>/g) || []).length
if (boot !== 1) bad.push(`BOOT_COMPLETED action: ${boot} (want exactly 1)`)
if (!/<receiver android:name="\.life\.LifeReceiver"/.test(man)) bad.push('no LifeReceiver in the manifest')
if (!/MY_PACKAGE_REPLACED/.test(man)) bad.push('no MY_PACKAGE_REPLACED - an update would leave the bubble dead')
if (!/RECEIVE_BOOT_COMPLETED/.test(man)) bad.push('RECEIVE_BOOT_COMPLETED permission missing')
if (!/Prefs\.setOn\(this, true\)/.test(svc)) bad.push('the service never records that the bubble is on')
if (!/item\("⏻ כבה בועה"\) \{ Prefs\.setOn\(this, false\)/.test(svc)) bad.push('"כבה בועה" does not clear Prefs.on - boot would override Meir')
if (!/Prefs\.setOn\(this, false\); stopService/.test(act)) bad.push('the app\'s own off switch does not clear Prefs.on')
if (!/onDestroy\(\) \{ speakLock\(false\)/.test(svc)) bad.push('the wake lock is not released in onDestroy')
if (!/acquire\(90_000\)/.test(svc)) bad.push('the wake lock has no ceiling')
if (bad.length) { console.error('one-life: ' + bad.join(' · ')); process.exit(1) }
console.log('one-life: מקלט אחד לאתחול ולעדכון, מכבד את "כבה בועה", נעילת דיבור עם תקרה ושחרור')
