/** בדיקת-קצה · קופסת אשף-ההרשמה — מוכיחה את דוגמאות-החוזה (signup-wizard.contract.md)
 *  דרך הקופסה בלבד (חוק-4; מותר לייבא רק את הקופסה-שלה). */
import assert from 'node:assert';
import {
  WIZARD_INDUSTRIES, ORG_SIZES, ORG_NEEDS, WIZARD_STEPS, EMPTY_WIZARD,
  wizardStepError, industryLabel, sizeLabel, needLabel,
} from './signup-wizard.mjs';

let n = 0;
const ok = (fn) => { fn(); n++; };

// ── קבועים ──
ok(() => assert.strictEqual(WIZARD_STEPS, 5));
ok(() => assert.strictEqual(WIZARD_INDUSTRIES.length, 13));
ok(() => assert.deepStrictEqual(WIZARD_INDUSTRIES[0],
  { id: 'chesed', emoji: '🕊️', label: 'עמותת חסד', sub: 'גמ"ח · קופת צדקה' }));
// בדיוק 4 מפתחות בכל תחום — theme/terms/modules לא דולפים מהחבילה
ok(() => WIZARD_INDUSTRIES.forEach((i) =>
  assert.deepStrictEqual(Object.keys(i).sort(), ['emoji', 'id', 'label', 'sub'], i.id)));
ok(() => assert.deepStrictEqual(ORG_SIZES.map((s) => s.id), ['small', 'medium', 'large']));
ok(() => assert.deepStrictEqual(ORG_NEEDS.map((o) => o.id),
  ['crm', 'billing', 'schedule', 'inventory', 'reports', 'multi', 'backup']));
ok(() => assert.deepStrictEqual(EMPTY_WIZARD, {
  industry: '', size: '', needs: [], orgName: '', contactName: '',
  phone: '', email: '', password: '', password2: '',
}));

// ── ולידציית-שלב ──
const full = {
  industry: 'clinic', size: 'small', needs: ['crm'], orgName: 'אור', contactName: 'מאיר',
  phone: '050-1234567', email: 'a@b.co', password: '123456', password2: '123456',
};
ok(() => assert.strictEqual(wizardStepError(0, EMPTY_WIZARD), 'בחרו את תחום העסק כדי להמשיך'));
ok(() => assert.strictEqual(wizardStepError(0, full), null));
ok(() => assert.strictEqual(wizardStepError(1, EMPTY_WIZARD), 'בחרו את גודל הארגון'));
ok(() => assert.strictEqual(wizardStepError(1, full), null));
ok(() => assert.strictEqual(wizardStepError(2, EMPTY_WIZARD), null)); // צרכים — אופציונלי
ok(() => assert.strictEqual(wizardStepError(3, { ...full, orgName: '   ' }), 'שם הארגון חובה')); // trim!
ok(() => assert.strictEqual(wizardStepError(3, { ...full, contactName: '' }), 'שם איש קשר חובה'));
ok(() => assert.strictEqual(wizardStepError(3, { ...full, phone: ' ' }), 'טלפון חובה — נחזור אליכם לאישור'));
ok(() => assert.strictEqual(wizardStepError(3, full), null));
// שלב 4 — דרך signUpError; '' מנורמל ל-null
ok(() => assert.strictEqual(wizardStepError(4, full), null));
ok(() => assert.strictEqual(wizardStepError(4, { ...full, phone: '12' }),
  'מספר טלפון תקין הוא שדה חובה — נחזור אליכם לאישור'));
ok(() => assert.strictEqual(wizardStepError(4, { ...full, email: 'x' }), 'כתובת האימייל אינה תקינה'));
ok(() => assert.strictEqual(wizardStepError(4, { ...full, password: '12345', password2: '12345' }),
  'הסיסמה חייבת להיות לפחות 6 תווים'));
ok(() => assert.strictEqual(wizardStepError(4, { ...full, password2: '654321' }), 'הסיסמאות אינן זהות'));
ok(() => assert.strictEqual(wizardStepError(5, EMPTY_WIZARD), null)); // default
ok(() => assert.strictEqual(wizardStepError(-1, EMPTY_WIZARD), null));

// ── תוויות ──
ok(() => assert.strictEqual(industryLabel('clinic'), 'קליניקה'));
ok(() => assert.strictEqual(industryLabel('zzz'), 'zzz'));
ok(() => assert.strictEqual(industryLabel(undefined), '—'));
ok(() => assert.strictEqual(sizeLabel('medium'), 'בינוני'));
ok(() => assert.strictEqual(sizeLabel(undefined), '—'));
ok(() => assert.strictEqual(needLabel('crm'), 'ניהול לקוחות ואנשי קשר'));
ok(() => assert.strictEqual(needLabel('nope'), 'nope')); // בלי '—' — כמו במקור

/* 🛡 מגן-הכרעה: תפרי-החיווט של הקופסה נשארים verbatim (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./signup-wizard.mjs', import.meta.url), 'utf8');
for (const seam of [
  'wizardIndustries(VERTICAL_PACKS)',            // תחומים ⇐ אטום-הנתונים (מקור-אמת יחיד)
  'atomWizardStepError(step, s, signUpError)',   // שלב 4 ⇐ חוט-השכן sign-up-error
  'atomIndustryLabel(id, WIZARD_INDUSTRIES)',
  'atomSizeLabel(id, ORG_SIZES)',
  'atomNeedLabel(id, ORG_NEEDS)',
]) assert.ok(src.includes(seam), `מגן: תפר-החיווט "${seam}" שונה`);
n++;

console.log(`✓ קופסת אשף-ההרשמה: ${n} אימותי-חוזה ירוקים (5 שלבים · 13 תחומים · תוויות · מגן-הכרעה)`);
