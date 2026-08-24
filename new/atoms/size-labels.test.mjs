/** בדיקת-חוזה · size-labels — צילום. (הצלבה מול sizeMult של default-prices = בדיקת-קופסת-התמחור — חוק-2.) */
import { SIZE_LABELS } from './size-labels.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(SIZE_LABELS, { small: 'קטן', medium: 'בינוני', large: 'גדול' });
console.log('✓ size-labels');
