// בדיקת-צילום · image-pick-terms — המונחים זהים ביט-אחר-ביט למקור.
import { IMAGE_PICK_TERMS } from './image-pick-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(IMAGE_PICK_TERMS), "{\"k1\":\"הקובץ אינו תמונה\",\"k2\":\"התמונה גדולה מדי (מקסימום 8MB)\",\"k3\":\"דפדפן אינו תומך בעיבוד תמונה\"}");
console.log('OK image-pick-terms');
