/** 🪨 טיוטת-חוט (דרגת-מחצבה) · startBarcodeScanner — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/barcode.ts:27-83 (57 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): startBarcodeScanner, getCtor, onError, getUserMedia, setAttribute, play, detect, onDetect, requestAnimationFrame, cancelAnimationFrame, getTracks, stop
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function startBarcodeScanner(videoEl, onDetect, onError) {
    const Ctor = getCtor();
    if (!Ctor) {
        onError('הדפדפן הזה לא תומך בסריקת ברקוד');
        return null;
    }
    const detector = new Ctor({
        formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code'],
    });
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
        });
    }
    catch (err) {
        onError('אין גישה למצלמה');
        return null;
    }
    videoEl.srcObject = stream;
    videoEl.setAttribute('playsinline', 'true');
    await videoEl.play();
    let running = true;
    let raf = 0;
    const tick = async () => {
        if (!running)
            return;
        try {
            const found = await detector.detect(videoEl);
            if (found.length > 0) {
                onDetect(found[0].rawValue);
                return;
            }
        }
        catch {
            /* transient detect error — keep scanning */
        }
        raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
        videoEl.srcObject = null;
        stream?.getTracks().forEach((t) => t.stop());
    };
    return { video: videoEl, stop };
}
