// 📜 קובץ-ראשי · screens__store_settings_screen — פירוק מסך-הגדרות-החנות (בנייה-חכמה)
// לאטומים-נקיים. מוצא קדוש: scratchpad/all-screens/screens__store_settings_screen.dart
// (1,135 שורות) — לא נגענו. מפת-המכונה: screens-seed/machine/screens__store_settings_screen.json
// תוכן: new/dart-data-bs/screens__store_settings_screen_content.dart
//
// ── אטומי-מדף שנצרכים (הכרעה-5: צורכים, לא משכפלים) ──
// המסך הוא תאום-מנגנוני של screens__chat_settings_screen — כל המנגנונים המשותפים
// כבר על המדף ונצרכים כמו-שהם (עוגני-מקור: store_settings_screen.dart):
// • SettingsScreenShell (screens__chat_settings_screen/settings_screen_shell.dart)
//   — מחליף את שלד StoreSettingsScreen (שורות 35–72): Scaffold+AppBar+פעולת-איפוס
//   +ListView; bottomGap=24 = ה-SizedBox(height: 24) שבמקור (שורה 69).
// • SettingsSectionTile (…/settings_section_tile.dart) — מקור _SectionTile (שורה 689).
// • SettingsSwitchRow (…/settings_switch_row.dart) — מקור _SwitchRow (שורה 800).
// • SettingsRadioGroupRow (…/settings_radio_group_row.dart) — מקור _RadioGroupRow (שורה 834).
// • SettingsActionRow (…/settings_action_row.dart) — מקור _ActionRow (שורה 1108);
//   buttonColor=BsTokens.dangerDark (הערת-AA במקור, שורה 1127) — הזרקת-קופסה.
// • ConfirmDialog (…/confirm_dialog.dart) — מקור דיאלוג-האיפוס (שורות 77–115, כולל
//   ההסתרה-המרוכבת של CfgVisible: הקופסה מוסרת cancelLabel/confirmLabel) וגם
//   confirmDestructive של מחיקת-חיפושים (שורות 653–658; היה import חיצוני
//   widgets/confirm_dialog.dart — אותו מנגנון).
// • PlaceholderRow (new/dart-ui-bs/placeholder_row.dart, אטום-מדף עליון) — מקור
//   _PlaceholderRow (שורה 1089): ארבע שורות-בבנייה (מקור 221, 463, 464, 599).
//
// ── אטומים חדשים בתיקייה זו (מנגנון שאינו על המדף) ──
// • settings_validated_text_row.dart — SettingsValidatedTextRow (מקור _InlineTextRow,
//   שורה 896). שונה-מנגנון מ-SettingsInlineTextRow של המדף: שם maxLines:2 ואין
//   errorText ואין תת-כותרת; כאן חד-שורתי + errorText (task #64) + subtitleNote.
// • settings_number_row.dart — SettingsNumberRow (מקור _NumberRow, שורה 989):
//   שדה-מספר צר ספרות-בלבד עם int.tryParse ?? 0. אין מקבילת-מדף.
//
// ── התרת-סבך: קריאות-provider ⇒ props/callbacks (מה הקופסה תזרים) ──
// המקור קורא storeSettingsProvider בכל 9 הסקציות; באטומים אין ref. הקופסה תזרים:
// • ref.watch(storeSettingsProvider) ⇒ value של כל שורה (defaultAddress,
//   preferredDeliveryWindow, deliveryAreas, courierInstructions, selfPickupDefault,
//   defaultPayment, defaultInstallments, supplierCreditEnabled, vatInclusive,
//   businessName, businessId, exportToAccountant, autoReceipts, notifDeals,
//   notifBackInStock, notifPriceDrop, notifOrderStatus, notifShipmentEnRoute,
//   minOrderAmount, confirmLargeOrder, largeOrderThreshold, repeatOrders,
//   shareCartWithTeam, saveCartToProject, maxSupplierDistance, minSupplierRating,
//   localSuppliersOnly, sortDefault, displayMode, unitSystem, showStock,
//   fastDelivery, regularDelivery, returnPolicy, extendedWarranty,
//   purchaseHistory, biometricConfirm, dailyCreditLimit).
// • ref.read(storeSettingsProvider.notifier).update((s) => s.copyWith(...)) ⇒
//   onChanged של כל שורה — callback פר-שדה.
// • ref.read(storeSettingsProvider.notifier).reset() ⇒ אחרי ConfirmDialog=true
//   בפעולת-האיפוס של SettingsScreenShell (מקור _confirmReset, שורות 76–120);
//   showToast של הגדרות-אופסו — fx-קופסה.
// • ref.read(storeSearchQueryProvider.notifier).state = '' (מקור 660) ⇒ onTap של
//   SettingsActionRow מחיקת-חיפושים: הקופסה עוטפת ב-ConfirmDialog (confirmDestructive)
//   ואז מאפסת ומטיסה טוסט החיפוש-נוקה. האטום מקבל callback בלבד.
// • errorText של שדה ח.פ. (מקור 289–293): validBusinessId מ-logic/input_validators
//   (מועמד-לוגיקה במחצבה) — הקופסה מחשבת ומזריקה מחרוזת-מוכנה/null לאטום.
// • showToast של PlaceholderRow (מקור 1103): הקופסה מפרמטת את תבנית-ה-$ מהתוכן
//   (placeholderRowContent.tapToastTemplate בקובץ-התוכן של chat_settings — מנגנון משותף).
// • CfgText/CfgVisible עם מזהי store_settings_screen.* — חיווט-סטודיו של הקופסה
//   (הסתרה-מרוכבת = הקופסה מוסרת prop; האטום עיוור למזהי-קונפיג).
// • שער kKbGlobal + עטיפת KbScreen(tools: kbStoreSettingsNodes) (מקור 28, 73) —
//   חיווט-לוח (מראה-מקלדת-צפה), לא ידע-אטום.
// • שער kHideUnderConstruction + אינטרוספקציית _isUnderConstruction/_activeCount
//   (מקור 708–728): עובר לקופסה — היא מסננת children, מחשבת badgeCount (null ⇒ אין
//   תג, כמו סקציה-בבנייה/ריקה במקור) ומזריקה subtitleNote לסקציות/שורות בבנייה.
//   אופציות-המיון החבויות (rating/distance, מקור 521–524) — אותו שער, בבניית
//   רשימת-options של SettingsRadioGroupRow בקופסה.
// • הרכב 9 הסקציות וסדרן (מקור 60–68: משלוחים, תשלום, חשבוניות, התראות, סל,
//   ספקים, תצוגה, לוגיסטיקה, פרטיות) — תוכנית-חיווט של הקופסה.
//
// התוכן: new/dart-data-bs/screens__store_settings_screen_content.dart (verbatim מהמקור;
// מנגנונים-משותפים — בבנייה לגווניה — נצרכים מקובץ-התוכן של chat_settings / uiTerms).
