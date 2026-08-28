import '../dart-data-maor/sign-up-error-terms.dart' as td_sign_up_error;
// 📦 קופסת-חיבורים · signup-wizard · ליבה-טהורה (Dart) — מקבילה ל-new/boxes/signup-wizard.mjs.
// חוזה משותף: new/boxes/signup-wizard.contract.md. מקור-האמת: maor/src/lib/signupWizard.ts.
// זו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// אשף 5-השלבים של אורביט (SIGNUP3): תחום → גודל → צרכים → פרטי-קשר → חשבון.
// 9 חוטי maor/src/lib/signupWizard.ts (+ השכן sign-up-error) נפגשים כאן ורק כאן (חוק-2);
// אפס-IO — המקור טהור (בלי store/DOM), אין שקעי DOM/localStorage/fetch.
import '../dart-maor/vertical-packs.dart' as vp;
import '../dart-maor/wizard-industries.dart' as wi;
import '../dart-maor/org-sizes.dart' as os;
import '../dart-maor/org-needs.dart' as on_;
import '../dart-maor/wizard-steps.dart' as ws;
import '../dart-maor/empty-wizard.dart' as ew;
import '../dart-maor/wizard-step-error.dart' as wse;
import '../dart-maor/sign-up-error.dart' as sue;
import '../dart-maor/industry-label.dart' as il;
import '../dart-maor/size-label.dart' as sl;
import '../dart-maor/need-label.dart' as nl;

// ── הכרעת-החיווט: תחומי-האשף נגזרים מאטום-הנתונים של 13 חבילות-הוורטיקל
//    (מקור-אמת יחיד — signupWizard.ts:10-15; השקע packs מחווט כאן). ──
final List<Map<String, dynamic>> wizardIndustries = wi.wizardIndustries(vp.verticalPacks);

// ── קבועי-האשף — כלשונם מהמקור (signupWizard.ts:18-60). ──
List<Map<String, String>> get orgSizes => os.orgSizes;
List<Map<String, String>> get orgNeeds => on_.orgNeeds;
int get wizardSteps => ws.wizardSteps;
Map<String, dynamic> emptyWizard() => ew.emptyWizard();

// ── מתאם-טיפוס: sizeLabel מצפה List<Map<String,dynamic>> · orgSizes הוא <String,String>. ──
final List<Map<String, dynamic>> _sizesDyn =
    os.orgSizes.map((m) => m.cast<String, dynamic>()).toList();

/// ולידציית-שלב (0-based; null = תקין). הכרעת-החיווט: השקע signUpError מחווט
/// לחוט-השכן sign-up-error (config.ts:739-756) — שלב-החשבון (4) עובר את אותה
/// ולידציה כמו הטופס הרזה (signupWizard.ts:6+81).
dynamic wizardStepError(dynamic step, dynamic s) => wse.wizardStepError(
      step,
      s,
      (a, b, c, d, e, f) => sue.signUpError(
          a as String, b as String, c as String, d as String, e as String, f as String, term: (k)=>td_sign_up_error.kTerms[k]!),
    );

// ── תוויות-תצוגה (לוח-הבקרה) — השקעים מחווטים לקבועי-הקופסה (signupWizard.ts:88-96). ──
String industryLabel(String? id) => il.industryLabel(id, wizardIndustries);
String sizeLabel(String? id) => sl.sizeLabel(id, _sizesDyn);
String needLabel(String id) => nl.needLabel(id, on_.orgNeeds);
