#!/usr/bin/env bash
# step release-drift: prove the key-rotation path works BEFORE it is ever needed. Uses two throwaway keys,
# never the real one. What it shows:
#   1. an APK signed by NEW with a lineage from OLD verifies, and its lineage names OLD - a phone that has the
#      OLD-signed app installed will accept it as an update (that is what v3 rotation is for);
#   2. an APK signed by NEW without the lineage has no link to OLD - Android would refuse it as an update.
# Procedure for a real rotation: keys/ROTATION.md.
set -euo pipefail
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/opt/android-sdk}}"; BT="${BUILD_TOOLS:-$(ls -d "$SDK"/build-tools/* | sort -V | tail -1)}"
APKSIGNER="${APKSIGNER:-$BT/apksigner}"
APK="${1:-$( [ -f android/app/build/outputs/apk/release/app-release.apk ] && echo android/app/build/outputs/apk/release/app-release.apk || echo dist/liba.apk )}"
T="$(mktemp -d)"; P=drillpass
for k in old new; do keytool -genkeypair -keystore "$T/$k.jks" -alias $k -storepass $P -keypass $P -keyalg RSA -keysize 2048 -validity 3650 -dname "CN=drill-$k" >/dev/null 2>&1; done
"$APKSIGNER" rotate --out "$T/lineage" --old-signer --ks "$T/old.jks" --ks-pass pass:$P --new-signer --ks "$T/new.jks" --ks-pass pass:$P
cp "$APK" "$T/a.apk"; cp "$APK" "$T/b.apk"
"$APKSIGNER" sign --ks "$T/old.jks" --ks-pass pass:$P --next-signer --ks "$T/new.jks" --ks-pass pass:$P --lineage "$T/lineage" --v3-signing-enabled true "$T/a.apk"
"$APKSIGNER" sign --ks "$T/new.jks" --ks-pass pass:$P --v3-signing-enabled true "$T/b.apk"
certs_a="$("$APKSIGNER" verify -v --print-certs "$T/a.apk")"; certs_b="$("$APKSIGNER" verify -v --print-certs "$T/b.apk")"
old=$(keytool -exportcert -keystore "$T/old.jks" -alias old -storepass $P | sha256sum | cut -c1-64)
lin=$("$APKSIGNER" lineage --in "$T/a.apk" --print-certs 2>/dev/null || true)
ok=0
echo "$certs_a" | grep -q "v3 scheme (APK Signature Scheme v3): true" && echo "$lin" | grep -qi "$old" && { echo "✓ חתום במפתח החדש, והשושלת כוללת את הישן — טלפון עם הגרסה הישנה יקבל אותו"; ok=$((ok+1)); } || echo "✗ שושלת הסבב חסרה"
"$APKSIGNER" lineage --in "$T/b.apk" --print-certs >/dev/null 2>&1 && echo "✗ חתימה בלי שושלת נראית מקושרת" || { echo "✓ חתימה במפתח חדש בלי שושלת אינה מקושרת לישן — בדיוק מה שהיה נועל את הטלפון"; ok=$((ok+1)); }
rm -rf "$T"
[ $ok -eq 2 ] && echo "תרגיל סבב המפתחות עבר" || { echo "תרגיל סבב המפתחות נכשל"; exit 1; }
