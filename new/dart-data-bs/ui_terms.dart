// 📦 דאטה · קטלוג-המונחים המאוחד (חולל ע"י one.mjs — נגזרת-דטרמיניסטית).
const uiTerms = <String, String>{
  't_55247199': 'סגור',
  't_a7c55a8d': 'ביטול',
  't_09b6bcca': 'מחק',
  't_be49d01c': 'צבע',
  't_3480206e': 'זווית',
  't_9a215501': 'חומר',
  't_d8c58117': 'מצרה',
  't_a8e71c4c': 'התראות',
  't_7ca35c44': 'נחושת',
  't_d4522b6f': 'פקק',
  't_5f8fb8a5': 'הכל',
  't_a4617429': 'גודל',
  't_deff17c2': 'בקרוב',
  't_e9b62d41': 'ברז כדורי',
  't_a718f9d5': 'מצמד',
  't_47cfdefb': 'הגדרות',
  't_10a2352b': 'חזרה',
  't_1576e69c': 'ברך 45°',
  't_ea79f62b': 'ברך 90°',
  't_4ef4257b': 'מסעף (טי)',
  't_41f37cb6': 'צווארון',
  't_c6dc6e13': 'רוכב',
  't_b593ae97': 'קטגוריה',
  't_f45000d5': 'סוג',
  't_10666b28': 'הסר',
  't_e8b3a3d5': 'נקה',
  't_e537a4bf': 'שיחות',
  't_8cd6a827': 'דגם',
  't_56c0d814': 'ברך',
  't_272a323b': 'מתאם תבריג',
  't_6d6d7964': 'חיפוש',
  't_83d2297d': '‹ יציאה',
  't_f50251bc': 'שמור',
  't_d5f29d99': 'אפשרות',
  't_9524b91f': 'נקודות מים',
  't_8bedeb98': 'מדיניות פרטיות',
  't_8b041840': 'מועדפים',
  't_ebbc108b': 'נקה הכל',
  't_19e61f40': 'תנאי שימוש',
  't_804ba9cf': 'קבלן',
  't_2e131aef': 'עובד',
  't_b939061e': 'יציאה',
  't_cdf9bb83': 'התמונה גדולה מדי — לא נשמרה',
  't_ffda2cc1': 'אזור אישי',
  't_5fef8dcd': 'עוד…',
  't_11579a5d': 'רב-שכבתי',
  't_d83eb302': 'מותג',
  't_e61d9583': 'מעבר',
  't_5502e262': 'בינוני',
  't_98dc6930': 'שחור',
  't_19ab7449': 'ברז',
  't_18d45acc': 'מחבר',
  't_fdd0ed46': 'ניקוז',
  't_23cc2e22': 'ברזי אמבטיה',
  't_d428d3af': 'ברזי גן',
  't_808c1253': 'ברזי דלי',
  't_29e09bce': 'דיורים ופיות',
  't_a43f2a66': 'זרועות דוש',
  't_dbf2e574': 'מזלפי יד',
  't_7b16f2c8': 'מחסומי רצפה',
  't_151382dc': 'מחסומים גלויים',
  't_7b27c528': 'מערכות אמבטיה',
  't_70de8815': 'ערכות רחצה',
  't_43da5b8a': 'ראשי מקלחת',
  't_a6a01fee': 'ברזים',
  't_b00cb1ed': 'ברזי כיור',
  't_6430ebde': 'ברזי קיר',
  't_d525c5ef': 'מחלקים',
  't_f21acb6a': 'אישור',
  't_70974bec': 'חנות',
  't_dda9882b': 'בית',
  't_7337f0e4': 'מאתר',
  't_c5c976c4': 'מחלקות',
  't_b728721f': 'סגירה',
  't_abddecf3': 'עץ חכם',
  't_d7186af1': 'תכנון חיבור',
  't_95d86d7f': 'היום',
  't_fc4def53': 'סמן הכל כנקרא',
  't_f682e3d3': 'הסל שלי',
  't_c5cdb271': 'שירותים',
  't_76047c04': 'שליח',
  't_cdf4bce0': 'אחר',
  't_aee54e53': 'נירוסטה',
  't_ed18037a': 'פוליאתילן',
  't_ea8ce22f': 'פלדה',
  't_9cec3558': 'פליז',
  't_d833d832': 'פקס',
  't_0cc33a3d': 'לבן',
  't_d8cc223a': 'מחלק',
  't_a702a289': 'ברך מחותכת',
  't_ed235cda': 'אסלה',
  't_ee34e97e': 'מסעף',
  't_5bf64c58': 'סיפון',
  't_ee1390ca': 'צינור',
  't_8c7a51cb': 'וריאנטים',
  't_128f6393': 'אביזרי אסלה',
  't_b5832e34': 'אביזרי ברזים',
  't_97fbd5eb': 'אביזרי חיבור',
  't_35678910': 'אביזרי מקלחת',
  't_4031e360': 'זקיף אסלה',
  't_db3f5db2': 'ידיות אחיזה',
  't_ee50614d': 'מאספי רצפה',
  't_0f807dfe': 'צינורות גמישים',
  't_a1e634ee': 'צינורות מקלחת',
  't_c1048fb4': 'ברזי מטבח',
  't_42c3b371': 'ברזי מקלחת',
  't_742d5747': 'מכסים ורשתות',
  't_fae8910f': 'סיפונים',
  't_a5f7e8a0': 'מוצרים',
  't_b51f247a': 'ברזי מעבר',
  't_0aad2678': 'ברזי ניל',
  't_2f6783cd': 'כניסה',
  't_46880f0d': '‹ חזרה',
  't_eb826680': 'קטגוריות',
  't_f862ee5a': '\$label — בבנייה',
  't_409634c7': 'מנהל',
  't_0e43b875': 'ממתין',
  't_0a4a56cd': 'נדחה',
  't_8b72a1ae': 'נמסר',
  't_cbdaff61': 'שם מלא',
  't_e9791e31': 'דמו',
  't_6fcf2194': 'יחובר עם חיבור השרת',
  't_c498839b': 'נמסר ✓',
  't_a96ca77c': 'ברזים וסניטריים',
  't_db83b0ba': 'כלי עבודה חשמלי',
  't_ed7a7afa': 'כלי עבודה ידני',
  't_371cd955': 'ההזמנות שלי',
  't_d0776cb6': 'הזמנות',
  't_8d3676d7': 'אל חזור',
  't_4f70dfd4': 'אורך',
  't_677d85a9': 'אפור',
  't_522003b3': 'כחול',
  't_6f678ac3': 'מידה',
  't_74cf986c': 'מאסף',
  't_4ed04f62': 'מופה',
  't_9fa8604c': 'מזלף',
  't_fd53053d': 'רב שכבתי',
  't_d3671350': 'אביזרים משלימים',
  't_4dd4fd24': 'הוסף לסל',
  't_d4e2d05b': 'כמות',
  't_2632bc2b': 'אביזרי נחושת',
  't_350219b4': 'ארונות מחלק',
  't_8cfc8fdf': 'התקנה גבוהה',
  't_fac5654d': 'התקנה נמוכה',
  't_d4c5deeb': 'חבקי תליה',
  't_3add853b': 'חותך צינורות',
  't_b123cd2d': 'מחברי NTM',
  't_f76d257d': 'מכשירי לחץ',
  't_a43be1bd': 'מנגנונים',
  't_78b85996': 'מסעפים וחיבורי אסלה',
  't_72360c63': 'מערכות שטיפה',
  't_5750e43d': 'עוגנים ובנדים',
  't_bd5ea6a7': 'צינורות אפורות',
  't_2501c18c': 'לא נמצאו מוצרים',
  't_6f03262d': 'אביזרי חדר רחצה',
  't_8ecc1ab4': 'כיסויים',
  't_eca83d55': 'מחברי HDPE',
  't_2c4bae5a': 'ציוד גן',
  't_9ed30228': 'צינורות',
  't_aee42fb6': 'תעלות ניקוז',
  't_08d4f99e': 'ירוק',
  't_ed99b4ed': 'מחלקה',
  't_65053bfa': 'אסלות',
  't_fe8d1e5b': 'אסלות וכיורים',
  't_d3a8f00f': 'כלי עבודה',
  't_a33df148': 'מושבי אסלה',
  't_f5ed1ccb': 'מטבח',
  't_986b4093': '💡 ההסבר החכם דורש חיבור לשרת.',
  't_b7b31c17': 'מלאי',
  't_116f6cc8': 'חובה',
  't_71d0d5de': 'חיבור',
  't_e13c91de': 'חיפושים אחרונים',
  't_d5f40ad5': 'איפוס הגדרות?',
  't_00367599': 'איפוס לברירת מחדל',
  't_769b7b3c': 'אפס',
  't_a98f280f': 'בבנייה',
  't_1cfee728': 'גדול',
  't_9e2ee412': 'הגדרות אופסו',
  't_cf0a5531': 'הוסף',
  't_bba6fed3': 'הפרופיל שלי',
  't_c07370fe': 'מק"ט',
  't_6e254acf': 'עברית',
  't_7c01cbc4': 'קטן',
  't_dca9d772': 'ארכיון שיחות',
  't_a7dc1317': 'מצלמה',
  't_fa107e82': 'בתוקף עד \${_fmtDate(cert.expiry)}',
  't_3551b598': 'אוגוסט',
  't_45ded998': 'אוקטובר',
  't_a1ac81be': 'אפריל',
  't_1774bb5f': 'דצמבר',
  't_cf58b8a7': 'יולי',
  't_4dee19aa': 'יוני',
  't_5fa88202': 'מאי',
  't_c0394ea3': 'מרץ',
  't_712a2e4f': 'נובמבר',
  't_d7106337': 'ספטמבר',
  't_e974ea8b': 'פברואר',
  't_70441ad0': ';
// CAM-cluster seam (#85ב): `pickTaskPhoto()` → data-URL String, or an honest
// null on cancel/failure (no fake placeholder ever).
import ',
  't_f296fb7c': 'משלוחים',
  't_e1ea2811': 'פרופיל',
  't_b6f96e74': '📸 אישור מסירה',
  't_e33efb0e': 'החלפת תפקיד',
  't_10cb0610': 'התנתק',
  't_f98a2712': 'יציאה מהחשבון?',
  't_79fe5b92': 'נוכחות',
  't_8d1ff653': '📷 החלף תמונה',
  't_7463f2c3': '\${d.inDays} ימים',
  't_1fb3c538': '\${d.inDays} ימים \$h שע׳',
  't_bcd00f82': '\${d.inHours} שע׳',
  't_d2092abb': '\${d.inHours} שע׳ \$m דק׳',
  't_0a65873f': '\${d.inMinutes} דק׳',
  't_ebd7946f': 'פחות מדקה',
  't_9983adc2': 'הגדרות התראות',
  't_064aeb66': 'עדכונים',
  't_e642cece': 'בטיחות',
  't_a26f165a': 'עכשיו',
  't_7a64dbbe': 'המלאי שלי',
  't_0bc0d8bb': 'השוואת מחירים',
  't_d9f9c588': 'ליקויים',
  't_23c1e0ba': 'ב',
  't_2da6cebc': 'מנהל המערכת',
  't_1a20048a': 'ח.פ. חייב להכיל 9 ספרות',
  't_daab1ad0': 'כתובת',
  't_25fd43cd': 'טיוטה',
  't_cd25d858': 'למשל: …',
  't_b6b58892': 'מה אתה מחפש?',
  't_0f21ba7d': 'פחות',
  't_a8d8f850': 'בחר מוצר',
  't_86e9cfb0': 'אין פריטים',
  't_e2ffe318': 'כללי',
  't_a4ce69e7': 'פרטים',
  't_ed72fc87': 'אטמים ופקקים',
  't_2df94048': 'קוטר',
  't_bf8f751e': 'סעפת',
  't_5b5f4b25': 'dn נומינלי',
  't_ac0bb13d': 'אום',
  't_3f875d5f': 'דוש',
  't_f235293c': 'הסתעפות',
  't_f1146801': 'חבק',
  't_e12bbcbd': 'טי',
  't_2eb3d83f': 'מושב',
  't_2e3990ad': 'מחסום',
  't_82ff82ce': 'מצוף',
  't_4f204268': 'ניפל',
  't_1fa55d3a': 'פיה',
  't_beb2b151': 'רשת',
  't_5c3baa1a': 'אזהרה',
  't_354ef2c7': 'אשר',
  't_93ddcb4a': 'צנרת',
  't_4b728a8f': 'אום SmartLock',
  't_4d30c539': 'ברכיים',
  't_194e6e60': 'וקר',
  't_350307e9': 'מאסף קווי AQUA SLIM',
  't_88e7aa80': 'מאספים',
  't_7d8b0cfd': 'מים חמים ו-recirculation',
  't_8a538c8f': 'מצמד כפול',
  't_8cf108bb': 'מצמדים וצינורות',
  't_82ca8b83': 'סטי הידוק וחיבורים',
  't_d0fb904c': 'פקקים וצינורות',
  't_8fff24c2': 'צינור חלק',
  't_01316aed': 'אין מוצרים תואמים',
  't_6f841bb9': 'לפי עבודה',
  't_b429a0f3': 'עוד',
  't_48ff0d20': 'אביזרי שקע-תקע',
  't_a5040149': 'אביזרי תבריג',
  't_ba8dc945': 'התקנה צמודה',
  't_c132bd87': 'חבקי צינור',
  't_8bb616f3': 'חלקים סניטריים',
  't_51d6a6d9': 'מקלחת ואמבטיה',
  't_bf75ebb1': 'צינורות PP',
  't_d7e06bf8': 'צינורות רב שכבתי',
  't_6e83503a': 'סובב · הקש לבחור',
  't_1116972e': 'כרום',
  't_1a0573d2': 'ניקל',
  't_32229b41': 'פרגמון',
  't_52cde814': 'שחור מט',
  't_257a0f56': 'אביזרי ביוב',
  't_c6997f08': 'כלי ריתוך PPR',
  't_f70a1ae3': 'ניקוז גג',
  't_03b36454': 'פקסגול',
  't_c60d5840': 'זרוע',
  't_f71c2fc7': 'מערכת',
  't_0b490b5e': 'סיסמה',
  't_7e3808c1': 'משהו השתבש — נסה שוב.',
  't_e0c01b78': 'בינה מלאכותית ואוטומציה',
  't_fa84af0f': 'הזמנה',
  't_ce84491b': 'חלופות זולות',
  't_e6932339': 'שמירה',
  't_11ca7b86': 'ברקוד',
  't_5a15099c': 'פרויקט',
  't_de3fdc52': 'אמבטיה',
  't_27a4567b': 'גינה',
  't_0ad1756f': 'גן',
  't_c3f9ac23': 'הוסף כמות',
  't_f3943fe9': 'הפחת כמות',
  't_58f7253a': 'חוליות',
  't_6ff8815c': 'מאתר-על',
  't_9cd6321e': 'מקלחת',
  't_9fcb2a25': 'סה"כ',
  't_549c1465': 'רשימות',
  't_0cb0b488': '📦 טעינת קטלוג החברה',
  't_25230d9e': 'אזור ושפה',
  't_9b5409b0': 'ברירת מחדל',
  't_b7cf93ae': 'גודל טקסט (כל האפליקציה)',
  't_a8aeaf0a': 'הנפשות מופחתות (כל האפליקציה)',
  't_6276f417': 'מידע',
  't_a4e33bc0': 'ממשק ונגישות',
  't_766a244f': 'ניגודיות גבוהה (כל האפליקציה)',
  't_3a3cce3d': 'בבנייה — ההגדרות נשמרות אך עדיין אינן משפיעות',
  't_584cf3e1': 'בבנייה — עדיין לא משפיע',
  't_73135519': 'רטט',
  't_94cafe81': 'ההשתקה בוטלה',
  't_3e5d3aae': 'עובד — רן',
  't_db4a9245': 'אושר',
  't_9e6fa499': 'נדחתה',
  't_c46f59d0': '✅ אשר',
  't_5000b14b': '❌ דחה',
  't_cb4edfd2': 'אין כניסה פתוחה להיום',
  't_7e38ad07': 'כבר נרשמה כניסה להיום',
  't_673436f1': '✓ נרשמה נוכחות להיום',
  't_cede1f65': '🕐 נוכחות',
  't_2ba31992': '"\${cert.name}" תימחק מהארנק לצמיתות.',
  't_8ed5182f': 'אין תעודות בארנק עדיין — הוסף את הראשונה.',
  't_0ba1292e': 'בתוקף',
  't_03baa387': 'בתוקף עד',
  't_8bbe40fe': 'בתוקף עד \${_fmtDate(expiry!)}',
  't_d52f62bd': 'הוסף תעודה',
  't_7305bf27': 'הסר צילום',
  't_8c5048e0': 'הצג צילום תעודה במסך מלא',
  't_b6be296c': 'התעודה נמחקה',
  't_98655c7f': 'מחיקת תעודה?',
  't_ac5cf233': 'מחק תעודה',
  't_c595e3d1': 'נא לבחור תוקף',
  't_ee86945b': 'נא למלא מנפיק',
  't_f79e1f52': 'נא למלא שם תעודה',
  't_826d9ec1': 'פג בקרוב',
  't_95e953d9': 'פג תוקף',
  't_bc8c52d0': '➕ הוסף תעודה',
  't_29adb962': '💾 שמור תעודה',
  't_2c4b9ad9': '📷 צילום צורף ✓',
  't_9da44333': '📷 צרף צילום תעודה (לא חובה)',
  't_dbc998e4': '🪪 הוספת תעודה',
  't_91c124f8': '🪪 התעודה נשמרה בארנק',
  't_110f05e0': 'אישור מסירה?',
  't_909665f8': 'בדרך',
  't_24e8fc40': 'המשלוח נמסר — +\$kCourierDeliveryCoins מטבעות',
  't_ec3b8a78': 'כל ההתראות יימחקו — פעולה בלתי הפיכה.',
  't_cba022c2': 'לנקות את כל ההתראות?',
  't_659542e9': 'נמסרו ✅',
  't_bc6111e4': 'צליל ורטט',
  't_6bf391b0': '✅ נמסר ללקוח',
  't_0b47545e': '🔔 התראות',
  't_a72455b0': 'הבקשות שלי',
  't_8d517465': 'טלפון נייד',
  't_9638c38f': 'מקצוע / התמחות',
  't_3c34409a': 'ת.ז חייבת להיות 9 ספרות',
  't_c6c6ef99': 'POD + צילום',
  't_e6ec00ba': 'טפסים',
  't_2e916690': 'קוד',
  't_56302cdc': 'תלושי שכר',
  't_a1979ab1': 'תעודות נהג',
  't_fbdcdaad': '✓ שמור פרופיל',
  't_dff8be71': '\$streak ימים',
  't_bc3f3542': 'קטלוג',
  't_f02774cb': 'תיק בטיחות',
  't_debaa1c0': 'אביזרים',
  't_82c40bcf': 'שיחה חדשה',
  't_be285a01': 'אתמול',
  't_80a413c5': 'דלג',
  't_22bf334c': 'לפני \${d.inHours} שע׳',
  't_6cda0fbf': 'לפני \${d.inMinutes} דק׳',
  't_1881898b': 'לקוחות',
  't_197a1b37': 'אינסטלטור',
  't_ad95076f': 'גרסאות',
  't_b735b911': 'חנות ספק',
  't_955f0965': 'יומן עבודה',
  't_bf99e582': 'כספים',
  't_d3951cb4': 'מועדון',
  't_610f2ba8': 'משימות',
  't_16c424a9': '💰 תקציב',
  't_f5aa2d1e': 'בהכנה 🔧',
  't_a82afea7': 'ליפסקי ברקן',
  't_356dae42': 'מעבר בין מסכים',
  't_cf3fdd9b': 'ה',
  't_8ccf3c9f': 'ו',
  't_397ab8a2': 'בהכנה',
  't_737232c2': 'טלפון',
  't_4c43bbb7': 'מוכן',
  't_5f9edf6e': 'הבא',
  't_04f41421': 'אמוג׳י',
  't_80d903e4': 'טקסט',
  't_3e94b3ba': 'שלבי ביצוע',
  't_f3bbf18a': 'פרסם',
  't_d95e2808': 'שלח לאישור',
  't_6e04f4e9': 'התחל מחדש',
  't_94fbbb2c': 'לא נמצא מוצר מתאים — נסה שוב',
  't_22d98d66': 'מה מתאים?',
  't_16a694b2': 'עבודה',
  't_dffe43b2': 'אבג',
  't_a67fd704': 'לפי ספק',
  't_e20ba6ea': 'נוסף לסל',
  't_aeae929e': 'מין חיבור',
  't_97c1ddee': 'שיטה',
  't_641772c4': 'תכולה',
  't_45d5de72': 'יציאות',
  't_e5415583': 'מ"מ',
  't_9ba316fb': 'תבריג',
  't_252974a7': 'אדום',
  't_a7134b94': 'de קוטר חיצוני',
  't_27dfe254': 'בידוד תרמי',
  't_f29f753f': 'מ',
  't_c4d8152c': 'ן',
  't_c223f5f2': 'נ',
  't_cd57e1af': '2 צול',
  't_bc119c2e': '3/4 צול',
  't_1be1ded7': '4 צול',
  't_9c0b2567': 'אוגן',
  't_94c965a5': 'אומגה',
  't_627c0367': 'אטם',
  't_e597e1b8': 'אל חוזר',
  't_335226eb': 'בוקסה',
  't_f8ee5923': 'ונטיל',
  't_74c0cd7b': 'זקיף',
  't_f54a2836': 'חצי צול',
  't_d0bc0380': 'מיכל',
  't_19ec8d1b': 'מכסה',
  't_f7e79be5': 'מנגנון',
  't_7f2b3f94': 'מסנן',
  't_cbe8ff8e': 'מקטין',
  't_d9a4b26b': 'מקשר',
  't_f5530710': 'מרפק',
  't_99c8e85f': 'נסתר',
  't_597eab2c': 'ערכה',
  't_783f4344': 'פילטר',
  't_75e69eca': 'צול וחצי',
  't_fef14cea': 'צול ורבע',
  't_aba710a3': 'רדוקציה',
  't_bb321615': 'שיבר',
  't_315ab21d': 'שסתום',
  't_634939d5': 'הגדרה',
  't_91cfe6b8': 'מפרט הנדסי',
  't_0c33f303': 'שלבי התקנה',
  't_6dddf378': 'ריתוך חשמלי',
  't_5878f1f1': 'אביזרי אמבטיה',
  't_23abe207': 'אביזרים נלווים',
  't_f5fb47a9': 'ברך טלסקופית',
  't_7128ab3d': 'ברך מצרה',
  't_1e9653ab': 'כלי ריתוך',
  't_a86aed95': 'מחסומים',
  't_4ebce18c': 'מים חמים',
  't_25a3f16b': 'מכסים, הגבהות ורשתות',
  't_de14a37d': 'מסעפים',
  't_aa269927': 'מצמדים',
  't_fefad185': 'צינורות ניקוז',
  't_c93fa404': 'איזו עבודה?',
  't_d0940366': 'הכול',
  't_ccef1027': 'המוצר שמצאנו:',
  't_ea45432d': 'כל המוצרים',
  't_3277649e': 'מוצרים תואמים',
  't_d7e6e0c7': 'איזה גודל?',
  't_6c829030': 'איזה סוג?',
  't_e08df8c6': 'איזה צבע?',
  't_f78181b7': 'ברז כיור',
  't_f8f8326e': 'ברזים ובקרים',
  't_65ed9067': 'כלים',
  't_542b61b1': 'סניטרי וניקוז',
  't_08a0f00c': 'צנרת וחומרים',
  't_172183b9': 'רקורד',
  't_1a910767': 'מחסום רצפה',
  't_a4ad9cd8': 'מקטין לחץ',
  't_4d5aacb2': 'סיפונים SmartLock',
  't_7326341e': 'צינור ניקוז',
  't_6ffb2a0f': 'ראש מקלחת',
  't_9b4d56e9': 'ניקל מוברש',
  't_0f929ab9': 'קרמיקה',
  't_85ab355c': 'הסל ריק',
  't_b1bbe7e5': 'נוסף לסל ✓',
  't_5143b558': 'פריטים',
  't_ee47bc9c': 'את',
  't_43fa3ff5': 'עם',
  't_2b6526db': 'של',
  't_104dfad1': 'אביזרי ריתוך חשמלי PPR',
  't_c05b792e': 'אומגה PPR',
  't_8f5eb42d': 'ברזים PPR',
  't_835fc779': 'ברכיים PPR',
  't_ad371e1a': 'מסעפים PPR',
  't_c993d2d6': 'מצופים',
  't_40371f80': 'מצמדים PPR',
  't_e14961fe': 'מתאמים PPR',
  't_a8147fec': 'פקקים PPR',
  't_1d02bfdf': 'צווארונים ואוגנים PPR',
  't_945be3e4': 'צינורות PPR אספקת מים',
  't_805f4b17': 'צינורות PPR מיזוג אוויר',
  't_1b7dd50f': 'צינורות PPR פייזר',
  't_a47a2bba': 'רוכבים PPR',
  't_1ae29c29': 'אמריקאי',
  't_6abf8083': 'למקלחת',
  't_8d1b4a4c': 'פתוח',
  't_5864d360': 'קומקום',
  't_4238f786': 'אטם גומי לברז',
  't_c6e93197': 'אטם דו צדדי',
  't_b481d234': 'ברגי קיבוע',
  't_913d9671': 'ברזי ניל זוויתיים',
  't_ce5f9ed2': 'מ׳',
  't_8c89cce8': 'ס"מ',
  't_92308040': '׳',
  't_3a771ca3': 'אל',
  't_60a9314f': 'אל-חזור',
  't_ac9f3704': 'תעלה',
  't_028be96f': 'מה מתחבר לזה?',
  't_8db4daa8': 'מצא לי',
  't_e6b7206d': 'הקלדה',
  't_ddd875ba': '🔌 איך לגשר?',
  't_e414325b': 'משהו השתבש בחיבור — נסה שוב עוד רגע.',
  't_fa72a8f1': 'שלח',
  't_25476ed1': '\${p.name} נוסף לסל',
  't_1b9bdd23': 'סריקת תוכניות',
  't_b646c3c2': '🔥 חם',
  't_09fa4f26': 'ללא פרויקט',
  't_c2a69e75': 'סכום לא תקין',
  't_6501bf3c': 'תקציב הפרויקט',
  't_a1f19c5f': 'תקציב כולל',
  't_363ce3ab': 'משימה',
  't_ee0500fa': 'משלוח',
  't_93219bf3': '\$count מוצרים',
  't_aac4e7a2': 'בטל',
  't_646d61e1': 'בטל שינויים',
  't_c0c5c113': 'השקי',
  't_f50baabf': 'התקנה',
  't_ae3831b4': 'יצרן',
  't_59743129': 'לבטל את השינויים?',
  't_80a1b084': 'לחץ',
  't_9c2118be': 'לקוח',
  't_0d50276b': 'מאתר חכם',
  't_43cf370d': 'מאתר פשוט',
  't_6717421c': 'מומלץ',
  't_47d028be': 'מחיר משוער',
  't_73a37f0b': 'מקלדת חכמה',
  't_886bcd51': 'נטענו \${resolvedCatalogProducts.length} מוצרים',
  't_16a64fd1': 'ערוך',
  't_39fe2593': 'עריכה',
  't_cdf6e5c3': 'ערכת התקנה',
  't_6eae0e30': 'ראשי',
  't_1c96b9bd': 'שיחה',
  't_71761413': 'שם הרשימה',
  't_022436d7': 'שנה שם',
  't_d5983837': 'דירוג מינימלי',
  't_df30987d': 'הפחת',
  't_c51226d6': 'הצג מחירים כולל מע"מ',
  't_7c26f09f': 'התראות תקציב',
  't_db24d07b': 'חזר למלאי',
  't_ba51e66c': 'ירידת מחיר במועדפים',
  't_df135ca8': 'מיון ברירת מחדל',
  't_e531759a': 'סידור מסך הבית',
  't_c4f0e83c': 'ספקים חסומים',
  't_2f08d624': 'ספקים מועדפים',
  't_76954b33': 'ספקים מקומיים בלבד',
  't_7be856ec': 'ערכת נושא',
  't_a4f5cfc3': 'שפה',
  't_b250492d': 'תצוגה ומיון',
  't_fa2a3649': '30 יום',
  't_5e9909a0': 'הבנתי',
  't_edb8ca33': 'פרטיות',
  't_776915da': 'אימוג׳י',
  't_c5ffac09': 'נסה שוב',
  't_71b3aa3d': 'הורדה זמינה בגרסת-הדפדפן',
  't_be04c1a3': 'התבנית ירדה — פתחו באקסל, מלאו והעלו',
  't_c4803b36': '⬆️ העלה נתונים',
  't_9d071644': '⬇️ הורד תבנית לדוגמה',
  't_ceb98385': '\${_fmtDur(worked)} שעות',
  't_0125c4af': 'מיקום הכניסה — פתח ניווט',
  't_1cb3f6a3': 'אושרה',
  't_8bd26737': 'בקשת החופשה אושרה',
  't_4d345e2e': 'בקשת החופשה נדחתה',
  't_715efb37': 'נרשם',
  't_66b7e1c2': '✅ אושרה חופשה: \${r.workerName} · \${r.range}',
  't_28dd98b7': '✅ בקשת החופשה שלך (\${r.range}) אושרה',
  't_c43e7c82': '❌ נדחתה חופשה: \${r.workerName} · \${r.range}',
  't_5d0ca1b4': '➕ הוסף',
  't_fa4e0a1d': 'דחה',
  't_38ac4ee4': 'הוזמן',
  't_28461636': 'סופק',
  't_2fbe1d4b': '💡 חלופות זולות',
  't_07c19db6': '\${session.displayName}: \${monthDays.length} ימי עבודה, ',
  't_71b09bf9': 'אין רישומי נוכחות בחודש זה',
  't_c1083903': 'אין רישומים לשליחה בחודש זה',
  't_1e2e5a4c': 'הבא ›',
  't_08e6c3a3': 'הדוח נשלח ✓',
  't_89d6e050': 'ינואר',
  't_e35453b7': 'סה"כ \${_fmtDur(total)} שעות',
  't_c704453e': 'סה"כ חודשי',
  't_81e10704': 'סה"כ שעות',
  't_3061ee92': 'שיחת החנות לא נמצאה — הדוח לא נשלח',
  't_d240f185': '‹ הקודם',
  't_8b1d474c': '📋 דוח נוכחות \${_month.month}/\${_month.year} — ',
  't_d741858a': '🔴 יציאה',
  't_cbd79ef3': '🔴 נרשמה יציאה \${_fmtTime(DateTime.now())}',
  't_badce1b4': '🔴 נרשמה יציאה · סה"כ היום \${_fmtDur(worked)} שעות',
  't_574315a4': 'שמור תעודה',
  't_d114d630': 'בדרך 🚚',
  't_b8111d4e': 'דוחות',
  't_77b4b026': 'פורטל',
  't_5b678c13': '📦 אספתי מהחנות',
  't_24ab3d43': 'ההזמנה \${order.id} תסומן כנמסרה ללקוח — פעולה סופית.',
  't_3bfe970a': 'ההזמנה לא נמצאה',
  't_ad8c8091': 'המשלוח \${order.id} עודכן — מסונכרן עם החנות והמנהל ✓',
  't_b28198f0': 'ייתכן שההזמנה הוסרה או שהמשלוח כבר נסגר — חזרו לרשימת המשלוחים',
  't_fdf479c2': 'אין אישורים שהועלו עדיין',
  't_e7e4b77e': 'אישור מחלה · \${_fmtDate(n.ts)}',
  't_8b1412f1': 'אלמן/ה',
  't_4b32c362': 'גרוש/ה',
  't_252bc05e': 'האישור מ-\${_fmtDate(n.ts)} יימחק לצמיתות.',
  't_109f2273': 'האישור נמחק',
  't_7effcd31': 'הגשה רשמית תחובר עם חיבור השרת.',
  't_f2214362': 'הצג אישור מחלה במסך מלא',
  't_1ae4e8f8': 'טופס דיגיטלי מובנה — אינו הטופס הרשמי של רשות המסים. ',
  't_a0091c2e': 'יש לתקן את השדות המסומנים',
  't_154b10e0': 'מחיקת אישור מחלה?',
  't_0b52aec9': 'מחק אישור',
  't_0d3d8dfc': 'מספר נייד לא תקין (05XXXXXXXX)',
  't_aab1f916': 'מצב משפחתי',
  't_a1719662': 'מתאריך',
  't_515bbbb1': 'נא לבחור מצב משפחתי',
  't_f6c980ba': 'נא לבחור תאריך התחלה וסיום',
  't_16be367f': 'נא למלא שם מלא',
  't_84a0a473': 'נשוי/אה',
  't_13821ea9': 'סיבה (לא חובה)',
  't_e6ac04d9': 'עד תאריך',
  't_a2fdee85': 'צלם את אישור המחלה — הצילום נשמר ברשימה כאן.',
  't_b8d9266b': 'רווק/ה',
  't_68583540': 'תאריך הסיום לפני תאריך ההתחלה',
  't_28bf654f': 'תעודת זהות (9 ספרות)',
  't_dda044d4': '⏳ ממתינה',
  't_6b17aa7f': '✅ אושרה',
  't_b43a6285': '❌ נדחתה',
  't_75f8e480': '🏖️ בקשת חופשה',
  't_193b4f3e': '💾 טופס 101 נשמר לשנת \$_year',
  't_f9a83207': '💾 נשמר ב-\${_fmtDate(saved.savedTs)} (טרם נשלח)',
  't_2fac40fb': '💾 שמור טופס',
  't_01a6c0b0': '📄 \${session.displayName}: הגשתי טופס 101 לשנת \$_year',
  't_a608040b': '📄 טופס 101 — שנת \$_year',
  't_806c178f': '📄 טפסים',
  't_cb6d4499': '📷 אישור המחלה נשמר',
  't_a1d6c806': '📷 צרף צילום אישור',
  't_4c0ffa10': '🤒 אישור מחלה',
  't_5caa2fd8': '\${v.name} · \${v.cap} · \${v.status} · נהג \${v.driver}',
  't_bcae71fb': '\${z.name} · \${z.eta} · משלוח \${fMoney(z.fee)}',
  't_9d98f467': '\${z.name} · יעד אספקה: \${z.eta}',
  't_be30e1f7': ' נעלם עם הסתרת האלמנט (לא שלד ריק).
                        ',
  't_7052bd9a': ');
      return; // ה-sheet נשאר פתוח
    }
    showToast(context, ',
  't_959cf027': 'הגדרות שליח',
  't_42a418d8': 'הסר תמונה',
  't_e7969122': 'טופס 101 · בקשת חופשה · אישור מחלה',
  't_1bf5777e': 'טלפון (אופציונלי)',
  't_e7426405': 'יפ ',
  't_ae99c4c8': 'יפ ה',
  't_98225d9b': 'יציאה מהחשבון',
  't_ffdff166': 'כניסה/יציאה ודוח חודשי',
  't_66fda75e': 'מוגן בקוד',
  't_ee97c271': 'מעבר בין לוחות מוגן בקוד. הזן את קוד החלפת התפקיד:',
  't_f06111da': 'עריכת פרופיל',
  't_f3cb4506': 'קוד מעבר',
  't_7f42c8ed': 'קוד שגוי — נסה שוב',
  't_cd2b438b': 'שם תצוגה',
  't_0c587a55': '📷 הוסף תמונת פרופיל',
  't_6c086cbd': 'BuildCoins (מועדון משותף) 🪙',
  't_b6c4c767': 'א׳',
  't_c0505c10': 'ב׳',
  't_7b5b7d0c': 'ג׳',
  't_88aa0681': 'ד׳',
  't_a022d73e': 'הצג אישור מסירה במסך מלא',
  't_c2742c4c': 'ה׳',
  't_08e0ffcd': 'ו׳',
  't_56a9c519': 'נסח דוח עם AI',
  't_59753207': 'רצף פעילות 🔥',
  't_d0d855ad': 'שלח דוח-יומי לחנות',
  't_0645b32c': 'ש׳',
  't_a821d367': '📊 דוחות',
  't_eb9124b9': '📦 \${order.id} — אישור מסירה',
  't_517554f7': 'עדכוני משלוחים',
  't_f7d0bbbe': 'יתרה',
  't_0c7f5e41': 'לא רשומה',
  't_5fbdb400': 'נוצל',
  't_b7b9f7d0': 'העתק לשליחה',
  't_be108e20': 'רשימת ליקויים',
  't_7b7135ae': 'שפכים',
  't_1df5d20f': 'מרכז פיננסים',
  't_2ef7fdce': 'סכום',
  't_e94abfe2': 'שינוי',
  't_b7f24995': 'כיור',
  't_dd5d9372': 'מאספים וקולטים',
  't_0cd9a48c': 'אורח',
  't_ee25aa75': 'השתק',
  't_743f1fc8': 'השתק הכל',
  't_048cf57e': 'השתקת כל השיחות?',
  't_130d59eb': 'כל ההתראות יימחקו לצמיתות.',
  't_190d8007': 'כל ההתראות נמחקו',
  't_a54b10cb': 'כל השיחות הושתקו',
  't_a26070fd': 'כל השיחות יושתקו עד לביטול ההשתקה.',
  't_2d243895': 'ניקוי כל ההתראות?',
  't_7c71c3ed': 'ספק',
  't_cf15ec8c': 'תפריט',
  't_2be31f33': 'אודיט',
  't_961f8946': 'איטום',
  't_9057aef3': 'גמיש',
  't_0b85c66d': 'הסר מוצר',
  't_4875e29a': 'הפרויקטים שלי',
  't_ad2c0cd5': 'חזור',
  't_4ebe8c1e': 'כלי',
  't_1aefc1e9': 'לפני שעה',
  't_2335cb44': 'פרויקטים',
  't_8380641b': '🧪 אודיט',
  't_d2ad3d46': 'הוספה לסל',
  't_c876e235': 'לפני \${d.inDays} ימ׳',
  't_ab201444': 'לפני \${d.inSeconds < 0 ? 0 : d.inSeconds} שנ׳',
  't_74eaec6d': 'מודיעין לקוחות',
  't_20afa3ad': 'צפייה במוצר',
  't_dd0866a8': 'צפייה בסל',
  't_64d87968': 'תקוע',
  't_15ea281e': 'פעילות',
  't_afa61e8a': '\$what — בקרוב',
  't_beb50ffa': 'אינסטלציה',
  't_767ed47d': 'ארכיון',
  't_a73ef06b': 'אתר',
  't_463566cc': 'בינה',
  't_fcd965a0': 'גאנט',
  't_e2895c2d': 'היכרות',
  't_38f66622': 'השכרת כלים',
  't_e0fe08d4': 'חשבון',
  't_6a2e8fc0': 'לוח בקרה',
  't_60615803': 'מצב היכרות',
  't_d8b0e87c': 'משימות העבודה',
  't_3110a14f': 'ניהול',
  't_d2373b3e': 'סריקת תוכנית',
  't_68a038fc': 'עץ',
  't_e09fb284': 'פרויקט חכם',
  't_34499357': 'פרטים אישיים',
  't_ed927047': 'תפקיד',
  't_3bb32ddd': 'תקציב',
  't_60ab42a2': 'בדרך 🚛',
  't_d4d31cdb': 'גיליונות בטיחות',
  't_50bc7c8d': 'החזרה חדשה',
  't_1bb7f459': 'התקבלה 🆕',
  't_cc4bf5c8': 'מוכן 📦',
  't_3dcf4f46': 'מכרז ספקים',
  't_1f109a47': 'ממתין לאיסוף 🏪',
  't_1489bbff': 'פקדונות',
  't_037b8ca1': 'גאנט משימות',
  't_7c71571c': 'הגדרות חנות',
  't_8f2f0b04': 'הגדרות ספק',
  't_67ff632c': 'מבצעים',
  't_19163596': 'מסמכים',
  't_8ad63bb6': 'תעודות עסק',
  't_0c925938': '🦺 בטיחות',
  't_83450838': '\${products.length} מוצרים',
  't_2efbb17a': 'ארגז',
  't_d67cdc0f': 'ל',
  't_67066303': 'מוברש',
  't_73cd2655': 'מט',
  't_6bd4b076': 'מק"ט הועתק',
  't_a9857806': 'משטח',
  't_6e33b8a9': 'קוטר חיצוני',
  't_ccb77538': 'תת-סוג',
  't_a530b6eb': 'הסר מהסל',
  't_695a4846': 'ללא',
  't_70999661': 'מחיר לפי ספק',
  't_9150639e': 'אני על אינטרנט מסונן (נטפרי/רימון)',
  't_4c2390e1': 'המשך עם Google',
  't_c75d0186': 'כניסת Google נכשלה — נסה שוב',
  't_a238fcad': 'מספר טלפון נייד',
  't_eb640ad5': 'סיסמה (6+ תווים)',
  't_dc2192e3': 'סיסמה חלשה (6+ תווים)',
  't_903b6157': 'שאל את העסק שלך',
  't_177b9a14': 'הדפסה זמינה בדפדפן',
  't_192a2a26': 'הפעולה נכשלה — נסה שוב',
  't_fce6a64c': 'התקבלה',
  't_028c26e8': 'נאסף',
  't_c184d0ed': 'סטטוס',
  't_17127579': 'פעילים',
  't_337d076d': '↩️ נדחה: \${t.name}',
  't_62598607': '✅ אושר: \${t.name}',
  't_083b0436': '✓ הושלם',
  't_7f3280e8': '4 שעות',
  't_e104b7ec': 'חריגת תקציב',
  't_ca25d18a': 'תזכורות',
  't_a162e4c4': 'תדריך בטיחות יומי',
  't_14530a39': 'מצא והחלף',
  't_8b1aa6b1': 'שם',
  't_37533957': 'אין הזמנות בקטגוריה זו ✓',
  't_7cc15d03': '✓ אשר וקבל להכנה',
  't_de091e71': '🔄 עדכון מלאי',
  't_33741ad6': '🚛 ניהול צי רכב',
  't_f806b66b': 'חשמלאי',
  't_ceeb9fef': 'קבלן שיפוצים',
  't_ab93759f': 'טלפון או אימייל',
  't_07a4c207': 'מספר נייד או אימייל לא תקינים',
  't_7b023f9c': '🪪 בקשת תפקיד',
  't_4099aa48': '🏗️ פרויקט חכם',
  't_ca33ffce': '📋 משימות',
  't_dcafaf69': 'התחלה',
  't_bd8f1290': 'הזמנות נכנסות, מלאי החנות',
  't_e81d01e5': 'הזמנת חומרים, מלאי, משימות',
  't_9f8a4ade': 'המשימות שהוקצו לי בשטח',
  't_9fdc1dc9': 'משלוחים ועדכוני סטטוס',
  't_5cb766f7': '9 ספרות...',
  't_161c9b6e': 'הוסף מוצר',
  't_17fa6799': 'הלוגו נשמר ✓',
  't_de859eb4': 'ח.פ. / ע.מ.',
  't_0bde1380': 'רחוב, מספר, עיר...',
  't_06ea2f1a': 'שם העסק',
  't_acb26f27': 'שם העסק...',
  't_602494e7': 'שעות פעילות',
  't_278398f2': 'תנותק מלוח חנות הספק ותחזור למסך ההרשמה.',
  't_ee59343e': '✓ הפרופיל נשמר',
  't_7d3f52cf': '📷 צלם / העלה לוגו',
  't_57cf4752': 'המסך מוכן ויתמלא אוטומטית.',
  't_5fedc5aa': 'מספר נייד לא תקין — 10 ספרות, מתחיל ב-05',
  't_fd82d7bd': 'אשראי ספק',
  't_68e0442a': 'ביט',
  't_1aa18690': 'היסטוריית רכישות',
  't_e47e8d55': 'הסדר אשראי ספק',
  't_a6d90ab9': 'לאן לשלוח?',
  't_b0d97ab9': 'שיתוף סל עם צוות',
  't_6d33c292': 'שתף',
  't_76b19a0b': 'אשר והחל בטיוטה ✓',
  't_62732428': '👁️ תצוגה מקדימה (לפני החלה)',
  't_6f78d397': 'דווח על הביצוע',
  't_8a0c3e3e': 'הושלמו',
  't_8ef47167': 'המשימה אושרה ✓',
  't_b7f77bc3': 'הערה — מה בוצע, ומה נשאר (אופציונלי)',
  't_5a0d2952': 'הערת העובד',
  't_f473c61e': 'כל שורה = שלב נפרד (אופציונלי)',
  't_86ef9008': 'לא צולמה תמונה',
  't_c83c4f81': 'ממתין לאישור',
  't_a20eeb86': 'משך משוער (ימים)',
  't_954f4aa2': 'פרטי הביצוע (אופציונלי)',
  't_c1bcd633': 'שלבי ביצוע — שלב בכל שורה',
  't_7e29a6f5': 'שם המשימה',
  't_927492f8': 'תיאור',
  't_5f157e72': 'תמונת ביצוע',
  't_10e0c7c9': '📷 העלה תמונת ביצוע',
  't_5df57438': '📷 תמונת ההוכחה צורפה',
  't_12d51cc5': 'פורסם',
  't_e194bcc5': 'א',
  't_e89d5099': 'ג',
  't_8aea2ff5': 'ד',
  't_b37168e1': 'הגדרות עובד',
  't_f604bef9': 'ש',
  't_0aa0c6cf': '📸 שלח לאישור',
  't_9d885f60': 'שיחת הקבלן לא נמצאה — הדוח לא נשלח',
  't_c016c17b': '🏗️ אתר',
  't_e53d8068': '🏬 מחסן',
  't_9a3ef87e': 'פרופיל עובד',
  't_85b6911f': 'המנהל לא צירף סיבה לדחייה.',
  't_74d0719a': 'הצג תמונת הוכחה במסך מלא',
  't_fc44f2d5': 'live-region בשינוי-קבוצה',
  't_505098ea': 'הקלדה קולית אינה זמינה במכשיר הזה',
  't_d74004be': 'לא הצלחתי לשמוע — נסה שוב',
  't_97c6ff43': 'מילים',
  't_3c8c8676': 'בחר כדי לצמצם',
  't_acd54315': 'הקש מקש — והוא יעלה לכאן',
  't_6b70f212': 'התחל שוב',
  't_7087d259': 'מצאתי — הקש לפתיחה',
  't_8773f757': 'הקלד או דבר…',
  't_93fe6bc6': 'חיפוש קולי',
  't_ccbfdd5d': ']) {
  final rep = _pickRep(group);
  return ConfigTile(
    sku: rep.sku,
    nameHe: typeWordOf(rep),
    emoji: tileEmoji(rep.categoryEmoji),
    imageAsset: _repImage(rep),
    materialHe: material,
  );
}

/// The pilot section (plan phase F.1 · G): `אביזרי קצה וחיבורים` — the top-level
/// `kCatalogTree` node with `id == ',
  't_b9e2ff7e': '` when the
  /// product carries no detected material. The family rail pages by this — a
  /// header swipe walks the materials (owner: "מושך את הכותרת → סוג החומר").
  final String materialHe;

  @override
  bool operator ==(Object other) =>
      other is ConfigTile &&
      other.sku == sku &&
      other.nameHe == nameHe &&
      other.emoji == emoji &&
      other.imageAsset == imageAsset &&
      other.materialHe == materialHe;

  @override
  int get hashCode => Object.hash(sku, nameHe, emoji, imageAsset, materialHe);
}

/// A family = a catalog tree LEAF that carries a `lipskeyCategory`, with the
/// products that map to it as [tiles]. "משפחה פתוחה" — its rail is always
/// visible in the dive. Never built empty ([browseSection] drops 0-tile leaves).
@immutable
class ConfigFamily {
  const ConfigFamily({
    required this.id,
    required this.titleHe,
    required this.emoji,
    required this.tiles,
    required this.productCount,
  });

  /// The source leaf',
  't_dcd73b72': 's
/// wheels carry the variations (owner: "הרַיל = סוגים, הכרטיס = וריאציות"). Reuses
/// the built variant engine — no new grouping, no name-heuristic. Groups keep
/// first-appearance (catalog) order.
List<ConfigTile> _collapseTiles(
  List<LipskeyCatalogProduct> products,
  String fallbackEmoji,
) {
  final groups = <String, List<LipskeyCatalogProduct>>{};
  final order = <String>[];
  for (final product in products) {
    final key = productCanonicalKey(product);
    final list = groups[key];
    if (list == null) {
      groups[key] = [product];
      order.add(key);
    } else {
      list.add(product);
    }
  }
  return [
    for (final key in order) _tileForGroup(groups[key]!, fallbackEmoji),
  ];
}

/// One tile for a collapsed variant group — sku + image from the first pictured
/// member (else the first, plan D); label = the [productFrame] (falls back to the
/// full name for a too-short frame); emoji = the member',
  't_48b2a7af': 's (material⋄type) group keys by material rank, STABLE within a
/// material (first-appearance / catalog order kept) — so the rail reads
/// PPR-tiles · HDPE-tiles · נחושת-tiles, grouped, as the owner asked.
List<String> _byMaterialThenType(
  List<String> keys,
  Map<String, String> groupMaterial,
) {
  final indexed = [for (var i = 0; i < keys.length; i++) (i, keys[i])]
    ..sort((a, b) {
      final ra = _materialRank(groupMaterial[a.\$2]!);
      final rb = _materialRank(groupMaterial[b.\$2]!);
      return ra != rb ? ra.compareTo(rb) : a.\$1.compareTo(b.\$1);
    });
  return [for (final e in indexed) e.\$2];
}

/// One tile per (material × TYPE) group — label = the [typeWordOf]; sku from the
/// BRIGHTEST member ([_pickRep]); image = that photo unless genuinely black
/// ([_repImage] → null ⇒ the emoji); [material] tags the tile for rail paging.
ConfigTile _typeTile(List<LipskeyCatalogProduct> group, [String material = ',
  't_d3074c24': 's REPRESENTATIVE image (plan D · DERIVED, never hardcoded): the
  /// first tile that carries a BRIGHT [ConfigTile.imageAsset] ([isBrightImage] ·
  /// owner: never a black header), else the first with any image. So the family
  /// sub-header shows a real, CLEAR product photo pulled from the live catalog — it
  /// SURVIVES a catalog delete-and-reupload (there is NO family→image map, the north
  /// star). null ⇒ no pictured product (→ the header falls back to [emoji]).
  String? get representativeImage {
    for (final tile in tiles) {
      if (isBrightImage(tile.imageAsset)) {
        return tile.imageAsset;
      }
    }
    for (final tile in tiles) {
      if (tile.imageAsset != null) {
        return tile.imageAsset;
      }
    }
    return null;
  }

  /// The sub-header badge — the total product count (all variations).
  int get count => productCount;

  /// The distinct MATERIALS in this family, in rail order (PPR · HDPE · נחושת · …,
  /// the material-less group `',
  't_fa9a2655': 's canonical MATERIAL (PPR · HDPE · נחושת · …), or `',
  't_93f534c8': 's open-rail dive (§המסך: section → families=מחלקות → אריחי-מוצר).
// SSOT: knowledge/CATALOG-CONFIG-PLAN.md (§המסך, phase A).
//
// GROUNDED (build on the live code, don',
  't_36c73f3a': 's wheels carry the variations. This
/// REPLACES the per-leaf tree walk against fragmentation (93 leaves → ~12 families).
/// Family + type keep first-appearance (catalog) order.
ConfigBrowse browseAll(List<LipskeyCatalogProduct> products) {
  // family -> ordered (material⋄type) group keys · groupKey -> products + material.
  // A TYPE splits per MATERIAL (owner: header swipe = the material) — the same ברך
  // becomes a PPR tile, an HDPE tile and a נחושת tile, and the rail orders them by
  // material so paging the header walks PPR → HDPE → נחושת.
  final familyGroups = <String, List<String>>{};
  final byGroup = <String, List<LipskeyCatalogProduct>>{};
  final groupMaterial = <String, String>{};
  final familyOrder = <String>[];
  final familyEmoji = <String, String>{};
  for (final product in products) {
    final family = familyGroupOf(product);
    final material = materialOf(product);
    final groupKey = ',
  't_9a4d5a10': 'אלומיניום',
  't_1051064a': 'כל הקטלוג',
  't_fdcb9ccf': 'ר חי בכל build. הדגל נותר **default-OFF** רק על **הראוט העצמאי**
// (`CatalogConfigScreen.route`) + שער #128 (GATE_REGISTRY).
// הפיצ',
  't_10236239': 's "אין פריטים" null-fallback state.
class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(',
  't_d98b68ad': 's MATERIAL (owner: "לפי הכותרת") — the
              // wheels list only this material',
  't_e57bbf14': 's [_CatalogConfigScreenState._expandedSku]; its browse data
/// stays the pure [browseAll] projection of the whole catalog into clean families →
/// type tiles. [onTapTile] is an OPTIONAL extra hook, fired alongside the toggle.
class CatalogConfigScreen extends ConsumerStatefulWidget {
  const CatalogConfigScreen({
    super.key,
    this.onTapTile,
    this.initialExpandedSku,
  });

  /// Optional extra tap hook, fired (in addition to toggling the inline card)
  /// when a tile is tapped. Null ⇒ only the accordion toggles.
  final void Function(ConfigTile tile)? onTapTile;

  /// The sku whose inline config card starts OPEN (else all collapsed) — the
  /// visual-verify entry uses it to render the accordion open in a static shot;
  /// null in every production route.
  final String? initialExpandedSku;

  /// The ONLY route factory — GATED. Returns null when the flag is OFF, so there
  /// is no live navigation path to this screen in a default (OFF) build.
  static Route<void>? route({void Function(ConfigTile tile)? onTapTile}) {
    if (!kCatalogConfig) {
      return null;
    }
    return MaterialPageRoute<void>(
      builder: (_) => CatalogConfigScreen(onTapTile: onTapTile),
    );
  }

  @override
  ConsumerState<CatalogConfigScreen> createState() =>
      _CatalogConfigScreenState();
}

class _CatalogConfigScreenState extends ConsumerState<CatalogConfigScreen> {
  /// The sku of the tile whose config card is open (accordion), or null. Only one
  /// card is open at a time; the rest of the rail stays visible (plan B.2).
  String? _expandedSku;

  @override
  void initState() {
    super.initState();
    _expandedSku = widget.initialExpandedSku;
  }

  void _toggleTile(ConfigTile tile) {
    widget.onTapTile?.call(tile);
    setState(() {
      _expandedSku = _expandedSku == tile.sku ? null : tile.sku;
    });
  }

  /// PLAN E.1 · הוסף-לסל — add a [SmartCartLine] that CARRIES the chosen
  /// [selection] (the configurator',
  't_df6b8a32': 's bug ("עלה לי רק החיצוני לא הפנימי": only the
  /// external card came up, the internal sheet never did). So we fall back, in
  /// order, to the family',
  't_d7d05e1f': 's config
/// card opens INLINE below the rail (accordion). A tile whose sku resolves to no
/// catalog product (a stale/foreign sku) simply skips the card.
class _FamilySection extends StatefulWidget {
  const _FamilySection({
    required this.family,
    required this.expandedSku,
    required this.onToggle,
    required this.onAddToCart,
    required this.onBuildLine,
    required this.onOpenDetails,
  });

  final ConfigFamily family;
  final String? expandedSku;
  final void Function(ConfigTile tile) onToggle;

  /// Phase-E card actions, forwarded to the inline [ConfigCard] (הוסף-לסל /
  /// בנה-קו / פרטים) — the screen owns them so it can reach the cart provider,
  /// the toast, and the internal product sheet.
  final ConfigCardAction onAddToCart;
  final ConfigCardAction onBuildLine;
  final ConfigCardAction onOpenDetails;

  @override
  State<_FamilySection> createState() => _FamilySectionState();
}

class _FamilySectionState extends State<_FamilySection> {
  /// Which MATERIAL page the family is on — a header swipe walks it (owner).
  int _matIdx = 0;
  double _accH = 0; // header-drag accumulator (px)

  List<String> get _materials => widget.family.materials;

  String get _material => _materials.isEmpty
      ? ',
  't_cf7c7c0d': 's open-rail dive: section title → families פתוחות (header) → a
// visible rail of product TILES. BuildSmart-dressed (RTL · orange · round ·
// emoji). Phase B: tapping a tile TOGGLES a generic config CARD that opens INLINE
// (accordion) under its rail while the rest of the rail stays visible (plan B.2);
// the card',
  't_26ec80c4': 's real
// catalog product. SSOT: knowledge/CATALOG-CONFIG-PLAN.md (§המסך, phase A/B).
//
// ⚠️ LIVE (owner "תדליק"): the home renders this screen as a section (smart_home_screen
// · _CatalogConfigOpen) UNCONDITIONALLY, so it is compiled into every build (no longer
// tree-shaken / byte-identical). [route] below stays gated on `kCatalogConfig` as a
// secondary standalone entry the home embed does not use. Pilot section:
// `אביזרי קצה וחיבורים` ([pilotSectionNode]).
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_5234634c': 's sizes/angles (owner: "לפי הכותרת" — the card
/// filters to the tapped tile',
  't_48b88bf3': 's wheels carry the
    // variations (size/angle/color/…) of the tapped type.
    final browse = browseAll(resolvedCatalogProducts);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          elevation: 0,
          scrolledUnderElevation: 2,
          title: Text(
            browse.titleHe,
            style: const TextStyle(
              color: BsTokens.brand,
              fontWeight: FontWeight.w900,
              fontSize: BsTokens.typeTitleMd,
            ),
          ),
        ),
        body: browse.families.isEmpty
            ? const _EmptyState()
            : ListView.builder(
                // Bottom clearance so the LAST family ("אחר") scrolls clear of the
                // home',
  't_151bc82a': '` when none is detected. The SINGLE derivation the
/// browse rail groups by AND the config card scopes to, so a material tile and
/// its card agree (owner: "לפי הכותרת" — filter to the current material).
String materialOf(LipskeyCatalogProduct p) {
  final m = materialOfEnriched(p);
  return m == null ? ',
  't_d8e731b7': 's VARIANT
/// family (every size/angle/… of the same type). The card resolves the centre image
/// + name against this set as the selection changes, so a drag swaps the photo.
List<LipskeyCatalogProduct> typeGroupOf(
  LipskeyCatalogProduct p,
  List<LipskeyCatalogProduct> universe,
) {
  final key = typeKeyOf(p);
  return [
    for (final m in universe)
      if (typeKeyOf(m) == key) m,
  ];
}

/// The canonical MATERIAL of [p] (PPR · HDPE · נחושת · …) via the finder',
  't_97778c0b': 's alias map (synonym_bridge.
//     kQuerySynonyms: מרפק→ברך, materials, …). So ברך/מרפק collapse to ONE tile,
//     no page/pack in the key. Category fallback when the name has no token.
//
// GATING (byte-identical-off): pure, no `kCatalogConfig` branch; reachable only
// through the gated dive screen ⇒ tree-shaken from a default (OFF) build.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_37f540e2': 's own map (זווית→ברך, plural→singular מצרות→מצרה,
/// tee-family→מסעף, coupler-family→מצמד); [kQuerySynonyms] is the query-bridge',
  't_365320f7': '),
                  child: _hero(),
                ),
              ),
            ),
            if (_usable.isNotEmpty)
              Positioned(
                left: 0,
                right: 0,
                bottom: 10,
                child: Center(child: _valuesPill()),
              ),
          ],
        ),
      ),
    );
  }

  /// The hero — the REAL per-selection image (swaps on every pick) FILLING the
  /// square pad (BoxFit.contain), falling back to the big product emoji (never a
  /// grey box · D.2).
  Widget _hero() {
    final asset = _resolvedImageAsset();
    if (asset == null) {
      return Center(child: _emoji());
    }
    return Center(
      child: Image(
        image: resolveProductImage(asset),
        fit: BoxFit.contain,
        errorBuilder: (context, error, stack) => _emoji(),
      ),
    );
  }

  Widget _emoji() => Text(
        widget.schema.emoji,
        style: const TextStyle(fontSize: _kEmojiSize, height: 1),
      );

  /// The RIGHT side wheel — the priority-1 chip (usually קוטר) as a FULL spinning
  /// [WheelPicker] (owner: "גלגל מלא", not tap-by-tap). Each row is the bare
  /// canonical DN (the `· ½"` inch hint rides the values pill · keeps the slim
  /// column readable); a fling settles on any value → [_select] updates the
  /// image/name/pill. Empty ⇒ a fixed-width spacer so the image stays centred.
  Widget _sideWheels(List<AttributeDef> attrs) {
    if (attrs.isEmpty) {
      return const SizedBox(width: _kWheelCol);
    }
    final attr = attrs.first;
    return SizedBox(
      width: _kWheelCol,
      child: WheelPicker(
        labelHe: attr.nameHe,
        values: [for (final v in attr.values) v.canonical ?? v.labelHe],
        selectedIndex: _selectedIndex(attr),
        onSelected: (i) => _select(attr.id, _token(attr.values[i])),
        kind: attr.kind,
      ),
    );
  }

  /// The LEFT כמות wheel — a FULL spinning [WheelPicker] 1…[_kMaxQty] (owner: a
  /// flick reaches 56, not 55 taps). Settling on a row sets [_qty].
  Widget _qtyWheel() {
    return SizedBox(
      width: _kWheelCol,
      child: WheelPicker(
        labelHe: ',
  't_fc3b32c1': ');

  /// The clean current-values pill embedded on the image (no arrows · owner).
  Widget _valuesPill() {
    // MATCH the brand palette (owner) — the same accent-orange as the selected wheel
    // values + the הוסף-לסל CTA, white text; not the old dark-ink pill.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
      decoration: BoxDecoration(
        color: _cAccent,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        _currentValues(),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  /// `.cols` — RIGHT קוטר wheel · a SQUARE centre image · LEFT כמות wheel, the wheels
  /// vertically centred on the square (owner).
  Widget _cols() {
    return LayoutBuilder(
      builder: (context, c) {
        // A SQUARE centre image (owner: "מרובע באמצע"), ~20% smaller than the full
        // available width; the side wheels are vertically CENTRED on it (owner:
        // "מרכז את אמצע הגלגלים ביחס אליו") — IntrinsicHeight + center aligns the
        // wheel columns',
  't_67620360': '+ הוסף לסל',
  't_42a0418a': '],
        selectedIndex: (_qty - 1).clamp(0, _kMaxQty - 1),
        onSelected: (i) => setState(() => _qty = i + 1),
        kind: AttributeKind.dimension,
      ),
    );
  }

  /// The dedicated "📄 פרטים" affordance — a full-width, brand-accent-tinted button
  /// under the image that opens the internal product sheet through the SAME
  /// [ConfigCard.onOpenDetails] path as the centre-image tap. A clear, reliable
  /// target the image',
  't_70dcc7f3': 's CLEAN layout). ONE
// StatefulWidget that renders ANY [ProductConfigSchema]: the FULL product name clean
// ABOVE, then a row (RTL) of a קוטר wheel on the RIGHT · a SQUARE image in the CENTRE
// · a כמות wheel on the LEFT. The IMAGE is the hero — dead-centre, never a grey box
// (no file → the big product EMOJI). NO band / slider / bar (the forbidden sins).
//
//   • The centre image is a SQUARE (~20% under the available width); the side
//     wheels are vertically CENTRED on it. Its ONLY overlay is a CLEAN value PILL
//     embedded at the bottom — the current values (e.g. `DN50 · 16×1/2 · 15°`) in
//     the brand accent, NO arrows and NO edge labels. The two axes SCROLL ON THE
//     IMAGE: a ↕ drag cycles attribute[1], a ↔ drag attribute[2], swapping the photo
//     and updating the pill (the image itself is the control).
//   • The side wheels are TAPPABLE value stacks (mockup `.wheel`): the diameter
//     attribute(s) on the RIGHT, qty on the LEFT — the centred value is
//     highlighted brand-orange (bigger + bold), the rest dimmed.
//   • Below: the two actions — הוסף-לסל (solid) + בנה-קו (outline). NO value line,
//     NO "הגלגלים של…" hint (owner: clean).
//
// PER-PRODUCT, DATA-DRIVEN (plan 🫀): the SAME frame draws whatever the schema
// declares — a manifold swaps the axes to ↕יציאות ↔צבע with the same קוטר+כמות
// wheels; ZERO per-product code. The live selection is a `Map<String,String>`
// keyed by [AttributeDef.id] (canonical tokens — the value the cart line carries),
// seeded from each attribute',
  't_96a14dfd': 's PRODUCT
  /// actually holds ([_cardChips]); a synthetic schema (no product) skips the
  /// product-coherence gate. So קוטר leads the side wheel and the two image drags
  /// cycle real variant axes, never a descriptive filter that leaves the SKU put.
  List<AttributeDef> get _usable => <AttributeDef>[
        for (final attr in widget.schema.attributes)
          if (attr.values.isNotEmpty &&
              _kConfigAxes.contains(attr.id) &&
              (_cardProduct == null || (_cardChips[attr.id]?.isNotEmpty ?? false)))
            attr,
      ];

  /// The wheel index for [attr] under the live selection — the position of the
  /// value whose token matches, else 0 (tolerant — a stale pick never throws).
  int _selectedIndex(AttributeDef attr) {
    final token = _selection[attr.id];
    for (var i = 0; i < attr.values.length; i++) {
      if (_token(attr.values[i]) == token) {
        return i;
      }
    }
    return 0;
  }

  /// The label of [attr]',
  't_f7deec4c': 's base image asset (plan D · resolved through
  /// [resolveProductImage]); the per-selection variant image wins over it, and the
  /// family fallback / emoji win when both are absent (D.2 — never empty).
  final String? imageAsset;

  /// הוסף-לסל action. Null ⇒ the button is inert (no cart here).
  final ConfigCardAction? onAddToCart;

  /// בנה-קו action. Null ⇒ the button is inert.
  final ConfigCardAction? onBuildLine;

  /// פרטים — opens the internal product sheet for the current variant; null ⇒
  /// the image tap is inert.
  final ConfigCardAction? onOpenDetails;

  @override
  State<ConfigCard> createState() => _ConfigCardState();
}

class _ConfigCardState extends State<ConfigCard> {
  late Map<String, String> _selection;
  late List<LipskeyCatalogProduct> _family;

  /// The card',
  't_dea6a847': 's chip-values — the axes IT actually carries. The card shows ONLY
  /// these wheels (so a plain 50/50 elbow never sprouts a מעבר wheel from the group',
  't_289fda79': 's default, as before.
  Map<String, String> _seed(ProductConfigSchema schema) {
    final out = <String, String>{};
    for (final attr in schema.attributes) {
      if (attr.values.isEmpty) continue;
      final pv = _cardChips[attr.id];
      if (pv != null && pv.isNotEmpty) {
        out[attr.id] = pv.first;
      } else if (_cardProduct == null) {
        out[attr.id] = _token(_defaultValue(attr));
      }
    }
    return out;
  }

  /// The CONFIGURABLE axes — physical/variant properties a user actually dials to
  /// pick a SKU (size · angle · length · ports · reducer · colour). EXCLUDES the
  /// descriptive filters (סוג/שיטה/מין/מותג/יעד/תכולה): those describe WHAT the
  /// product IS, don',
  't_09746097': 's material — a PPR ברך shows only PPR sizes/angles, never
  /// mixed with HDPE/נחושת). So the wheels + the drag variant-swap stay within one
  /// material. Empty when the sku is not a live catalog product (a synthetic test
  /// schema).
  void _resolveFamily() {
    for (final p in resolvedCatalogProducts) {
      if (p.sku == widget.schema.sku) {
        _cardProduct = p;
        _cardChips = chipValuesOf(p);
        final material = materialOf(p);
        _family = [
          for (final m in typeGroupOf(p, resolvedCatalogProducts))
            if (materialOf(m) == material) m,
        ];
        _familyChips = [for (final m in _family) (m, chipValuesOf(m))];
        return;
      }
    }
    _cardProduct = null;
    _cardChips = const {};
    _family = const <LipskeyCatalogProduct>[];
    _familyChips = const [];
  }

  /// The DEFAULT value of [attr] — the `sortIndex == 0` value, else the first
  /// (guarded caller — only invoked for a non-empty [AttributeDef.values]).
  AttributeValue _defaultValue(AttributeDef attr) {
    for (final v in attr.values) {
      if (v.sortIndex == 0) {
        return v;
      }
    }
    return attr.values.first;
  }

  /// The selection TOKEN for [v] — its canonical form, else the label (the value
  /// the cart line stores; keeps a machine-stable pick where one exists).
  String _token(AttributeValue v) => v.canonical ?? v.labelHe;

  /// The initial selection — SEEDED from the card',
  't_9b7adaa9': 's selection by [dir] (clamped to the ladder ends).
  void _stepAxis(AttributeDef attr, int dir) {
    final i = _selectedIndex(attr);
    final next = (i + dir).clamp(0, attr.values.length - 1);
    if (next != i) {
      _select(attr.id, _token(attr.values[next]));
    }
  }

  void _onVerticalDrag(DragUpdateDetails d, AttributeDef axis) {
    _accV += d.delta.dy;
    while (_accV <= -_kDragStep) {
      _accV += _kDragStep;
      _stepAxis(axis, 1); // drag up → next value
    }
    while (_accV >= _kDragStep) {
      _accV -= _kDragStep;
      _stepAxis(axis, -1);
    }
  }

  void _onHorizontalDrag(DragUpdateDetails d, AttributeDef axis) {
    _accH += d.delta.dx;
    while (_accH <= -_kDragStep) {
      _accH += _kDragStep;
      _stepAxis(axis, 1); // drag left → next value
    }
    while (_accH >= _kDragStep) {
      _accH -= _kDragStep;
      _stepAxis(axis, -1);
    }
  }

  void _onAddToCart() =>
      widget.onAddToCart?.call(widget.schema, Map.of(_selection), _qty);

  void _onBuildLine() =>
      widget.onBuildLine?.call(widget.schema, Map.of(_selection), _qty);

  /// פרטים — open the internal product sheet for the live variant. Shared by the
  /// centre-image tap AND the dedicated "📄 פרטים" button so both routes carry the
  /// identical (schema, selection, qty) snapshot.
  void _onOpenDetails() =>
      widget.onOpenDetails?.call(widget.schema, Map.of(_selection), _qty);

  // ── the POSITIONAL wheel map (owner spec §6, taxonomy-ordered by the schema) ──
  // The schema arrives priority-ordered (prioritizedSchema), so the slots are
  // strictly positional: attr[0] = 🔩 side wheel A (right, usually קוטר) · attr[1]
  // = 🥇 primary (↕ on the image) · attr[2] = 🥈 secondary (↔). qty is a fixed
  // side wheel the card always adds. GRADUATED (§7): only the wheels that exist
  // render; chips beyond the top 3 are dropped (the image can carry two axes).
  AttributeDef? get _sideA => _usable.isNotEmpty ? _usable[0] : null;

  /// The ↕ drag axis — the 2nd config axis, falling back to the 1st (קוטר) so a
  /// vertical drag ALWAYS cycles a variant (owner: "משיכה למעלה ולמטה משנים את
  /// השם ואת התמונה"), even on a product that carries only one axis.
  AttributeDef? get _primary => _usable.length > 1
      ? _usable[1]
      : (_usable.isNotEmpty ? _usable[0] : null);

  /// The ↔ drag axis — the 3rd config axis, falling back to the 1st (קוטר) so a
  /// HORIZONTAL drag is never dead (owner: "משיכה לימין ולשמאל משנים…"): a
  /// two-axis product drags diameter left/right and its 2nd axis up/down.
  AttributeDef? get _secondary => _usable.length > 2
      ? _usable[2]
      : (_usable.isNotEmpty ? _usable[0] : null);

  /// The RIGHT side wheel — the priority-1 chip alone (§6 · 🔩). Empty ⇒ a spacer.
  List<AttributeDef> get _rightWheels =>
      _sideA == null ? const <AttributeDef>[] : <AttributeDef>[_sideA!];

  @override
  Widget build(BuildContext context) {
    // RTL is intrinsic to the card (the dive screen is RTL).
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 12),
        padding: const EdgeInsets.fromLTRB(12, 14, 12, 14),
        decoration: BoxDecoration(
          color: _cCard,
          borderRadius: BorderRadius.circular(_kCardRadius),
          boxShadow: _kCardShadow,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // CLEAN layout (owner): full product name above; the side wheels
            // (קוטר · כמות) STAY; a BIG centre image carrying only a clean
            // current-value pill — no edge arrows/labels, no "הגלגלים של…" hint.
            _fullName(),
            const SizedBox(height: 10),
            _cols(),
            // A dedicated, clearly-labelled פרטים affordance under the image — the
            // image tap alone was missable (owner: "עלה לי רק החיצוני"). Only when a
            // details handler is wired (else no dead control).
            if (widget.onOpenDetails != null) ...[
              const SizedBox(height: 10),
              _detailsButton(),
            ],
            const SizedBox(height: 12),
            _actions(),
          ],
        ),
      ),
    );
  }

  /// The FULL product name, clean, above the image (owner). Reflects the live
  /// selection',
  't_5e98eab3': 's two bottom actions (הוסף-לסל · בנה-קו). The dive
/// screen wires these to `smartCart.add` / a "בקרוב" toast; null ⇒ the button is
/// inert. [selection] is keyed by [AttributeDef.id] → the chosen canonical value.
typedef ConfigCardAction = void Function(
  ProductConfigSchema schema,
  Map<String, String> selection,
  int qty,
);

// ── dive-bs2b palette (exact mockup hexes · 1:1 render) ───────────────────────
const Color _cCard = Color(0xFFFFFFFF); // --card
const Color _cInk = Color(0xFF232A33); // --ink
const Color _cLine = Color(0xFFECEEF2); // --line (secondary btn border)
const Color _cAccent = Color(0xFFEE6A2A); // --accent
const Color _cAccentSoft = Color(0x14EE6A2A); // accent @ 8% — פרטים button fill
const Color _cImgBg = Color(0xFFF5F7FA); // --imgbg (stage)

/// The card',
  't_79ac435b': 'בנה קו',
  't_a2cd92ab': ');

/// A raw diameter token — inch (`½"`), DN (`DN40`), plastic OD (`20`/`110`), mm
/// (`250 מ"מ`), or a bare `odOf` integer — to its canonical `DN<n>` on the one
/// ladder. Inch uses the bore table; every other number is treated as an OD and
/// snaps to the nearest real rung. An unparseable token passes through unchanged
/// (never blanks a wheel). Idempotent: `canonicalDn(',
  't_405a582e': ' ? canonicalMaterial(value) : value;
    // §4 — color_truth: the catalog miscodes metal FINISHES (נחושת/כרום/ניקל) into
    // the color field; [isTrueColor] keeps only real colours off the צבע wheel, so a
    // finish never poses as a colour (it belongs on the חומר axis).
    if (chipId == ',
  't_e5d2c9b5': ' יציאות etc.; a base-card fallback is dropped
/// so the §4 axis wheels win) UNIONed with [axisChips] (the engine wins a shared id),
/// then RE-ORDERED by the 18-chip taxonomy (§5) so the POSITIONAL card lays the wheels
/// out per §6. Graduated (§7). [universe] flows to both (default `resolvedCatalogProducts`).
ProductConfigSchema prioritizedSchema(
  LipskeyCatalogProduct p, {
  List<LipskeyCatalogProduct>? universe,
}) {
  final products = universe ?? resolvedCatalogProducts;
  final base = configSchemaFor(p, universe: products);
  // Keep the engine',
  't_f96b9c9e': ' יציאות, which the axis engine has no wheel for).
//
// ZERO hand-rolled parsing — the axis engine already extracts every axis from any
// name/dims. GATING (byte-identical-off): pure, no `kCatalogConfig` branch; reachable
// only through the gated card ⇒ tree-shaken from a default (OFF) build.
// SSOT: knowledge/CATALOG-CONFIG-PLAN.md (§chips).
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_aff18fbe': ') memberHasDiameter = true;
      for (final v in values) {
        add(chipId, v);
      }
    });
    // Size fallback: a bare trailing mm ("פקק 32") the axis engine',
  't_ae6605c4': ') return a;
  return AttributeDef(
    id: a.id,
    tradeId: a.tradeId,
    nameHe: a.nameHe,
    emoji: a.emoji,
    kind: a.kind,
    unitHe: a.unitHe,
    isVariantAxis: a.isVariantAxis,
    required: a.required,
    matchTokens: a.matchTokens,
    values: [
      for (final v in a.values)
        AttributeValue(
          id: v.id,
          labelHe: v.labelHe,
          canonical: _angleDigits(v.canonical ?? v.labelHe),
          sortIndex: v.sortIndex,
        ),
    ],
  );
}

/// Rewrite the MAIN קוטר wheel',
  't_adcdd64d': ': 1, // קוטר (inch / DN / mm — one size wheel)
  ',
  't_6fde3cc6': ': 1, // קוטר (reducer big end)
  ',
  't_c2de5b8d': ': 10, // מבנה
  ',
  't_575949f8': ': 10, // מין חיבור (the מבנה band)
  ',
  't_2a05476b': ': 11, // צורה
  ',
  't_925293d5': ': 12, // חומר
  ',
  't_bbe782ab': ': 13, // יעד / חדר
  ',
  't_4f7af050': ': 14, // טמפ',
  't_52b5fe24': ': 15, // תוספת
  ',
  't_fac15bd6': ': 15, // תכולה (the תוספת band)
  ',
  't_333a6404': ': 16, // פיה
  ',
  't_5e5c132d': ': 17, // מותג
  ',
  't_92e820bb': ': 18, // גודל
};

/// A chip the taxonomy does not list sorts LAST (§7 keeps every value-carrying wheel).
const int _kUnknownPriority = 99;

/// The taxonomy priority of an attribute [id] (§5) — [_kUnknownPriority] if unlisted.
int chipPriority(String id) => kChipPriority[id] ?? _kUnknownPriority;

// ── §4 axis engine → taxonomy chips ─────────────────────────────────────────────

/// Map each [catAxesOf] axis id → the taxonomy chip id it fills (§5). The three
/// diameter SYSTEMS collapse to one קוטר chip (a family uses one system); the
/// navigation axes (group/world/cat) are NOT product wheels and are omitted.
const Map<String, String> _kAxisToChip = {
  ',
  't_8d01b7ac': ': 2, // קוטר-שני / מעבר
  ',
  't_358a9a51': ': 3, // זווית
  ',
  't_bb0d6396': ': 4, // יציאות
  ',
  't_eaf322b4': ': 5, // אורך
  ',
  't_e72236a3': ': 6, // גובה
  ',
  't_d90620d4': ': 7, // סוג
  ',
  't_51cd8299': ': 8, // צבע
  ',
  't_a1715049': ': 9, // שיטה (connection method — the תבריג band)
  ',
  't_d12116a1': ': 9, // תבריג
  ',
  't_8a37e3f2': 's
/// clean [typeKeyOf] (family + canonical type word: every ברך/מרפק/זווית, any size or
/// angle, is ONE type · owner §1–§3). This is the SAME set the rail collapses to a
/// tile, so rail = types and card = that type',
  't_c7db7856': 's TYPE GROUP (the clean-family peers that share a
// [typeKeyOf] · owner §1–§3, against fragmentation). The axes whose value VARIES
// across the peers (>1 value) are the wheels; each maps to the taxonomy priority; so
// grouping by the TYPE (ברך, צינור) — not the fragmented frame — makes those axes
// genuinely vary. [prioritizedSchema] feeds them,
// UNIONed over [configSchemaFor]',
  't_619ee7b2': 's type group: the axes mapped to
/// taxonomy chips. The SIZE chip ([_kSizeChips]) always shows (the defining
/// property); a DESCRIPTIVE axis (color/type/material/…) shows only when it VARIES
/// across the peers (>1 value — otherwise it is context, not a wheel · §7).
List<AttributeDef> axisChips(
  LipskeyCatalogProduct p,
  List<LipskeyCatalogProduct> universe,
) {
  final group = _typeGroup(p, universe);
  // chip id → ordered distinct values across the family.
  final agg = <String, List<String>>{};
  void add(String chipId, String value) {
    // §4 — one material space: fold brass→copper, PE→HDPE etc. (canonicalMaterial)
    // so a type that spells one material two ways yields ONE חומר value, not a
    // spurious wheel. Idempotent for the axis engine',
  't_ec779d92': 's wheels in a fixed
// PRIORITY order (§5) and allocates the top ones to fixed slots (§6): 🔩 side wheel
// A (right) = priority-1 · 🥇 primary (↕) = next · 🥈 secondary (↔) = the one after ·
// 🔢 qty always. GRADUATED (§7): as many wheels as chips (1→1, 2→2, 3→3), never an
// empty wheel; chips past the top 3 drop (the card caps).
//
// §4 — WHEELS FROM THE COMPREHENSIVE AXIS ENGINE (the root): most real products are
// brass/threaded, which the PPR engine ([configSchemaFor]) types for ≈0 of them. So
// the chips come from the EXISTING 17-axis projector [catAxesOf] (features/ring_dive/
// catalog_axes.dart) — סוג/חומר/מותג/קוטר-אינץ',
  't_62d0e095': 's מעבר
/// wheel (`diameter-small`, whose compound `16×20` tokens must stay verbatim) and
/// NOT `diameter-large`; those are absent from [chipValuesOf], so DN-folding only
/// the wheel side would desync the seed/match. The single-bore קוטר is symmetric.
AttributeDef _dnAttribute(AttributeDef a) {
  if (a.id != ',
  't_9abda08b': 'יעד',
  't_40e9f685': ' show immutable, listEquals;

/// `tradeId` סינתטי ל-`AttributeDef`-ים שנגזרים מהמנוע/קטלוג (לא בבעלות Trade-משתמש).
const String kCatalogConfigTradeId = ',
  't_ae609116': ' נפוצות (תכונת-קטלוג).
AttributeDef _thread() => const AttributeDef(
      id: ',
  't_770883df': ',
          sortIndex: i,
        ),
    ];

/// ערכי-הקוטר **מטבלת-העומק של המנוע** (`kDepth`) — ממוינים. תבנית-הנסיגה (0.2)
/// כשלמשפחה אין אחים באוכלוסייה. **נגזר מהמנוע**.
List<AttributeValue> diameterValues() {
  final ods = kDepth.keys.toList()..sort();
  return _diameterValuesFromOds(ods);
}

/// יציאות-המחלק **האמיתיות** — ה-`dims[',
  't_a9e147bd': ',
        sortIndex: i,
      ),
  ];
}

// ── תכונות-בסיס (גלגלים) — כל אחת עם ערכים (שומר: אין תכונה בלי ערכים) ──────────

/// גלגל-קוטר. [values] = הסולם האגור (פאזה F); ברירת-מחדל = תבנית-המנוע (`kDepth`).
AttributeDef _diameter({
  String id = ',
  't_7ce2e8d2': ',
        sortIndex: i,
      ),
  ];
}

/// צבעי-המחלק **האמיתיים** — ה-`color` הנבדלים (לא-ריקים) על-פני אֲחֵי-המחלק
/// ב-[universe], בסדר-הופעה → **בחירת-צבע אמיתית** (כחול/אדום), לא ערך-יחיד-מנוון.
List<AttributeValue> _colorValues(List<LipskeyCatalogProduct> universe) {
  final seen = <String>{};
  final out = <AttributeValue>[];
  for (final peer in universe) {
    if (!_isManifold(peer)) continue;
    final c = peer.color;
    if (c == null || c.isEmpty || !seen.add(c)) continue;
    out.add(AttributeValue(id: ',
  't_b09f429b': ',
      kind: AttributeKind.choice,
      required: true,
      values: values,
    );

/// אורך-הזרוע (תכונת-קטלוג · ברירת-מחדל בינוני). ברירת-מחדל 3 אפשרויות.
AttributeDef _length() => const AttributeDef(
      id: ',
  't_e4cc0984': ',
      kind: AttributeKind.number,
      required: true,
      values: values,
    );

/// גלגל-צבע — מופיע רק למוצר **שיש-לו-צבע** (`p.color`, לא-מומצא), ואז נושא את
/// **בחירת-הצבעים האמיתית** של קבוצת-המחלקים ([_colorValues] — כחול/אדום),
/// לא ערך-יחיד-מנוון. אין צבע-מוצר → הגלגל מושמט (שומר: אין תכונה בלי ערכים).
AttributeDef? _colorAttr(
  LipskeyCatalogProduct p,
  List<LipskeyCatalogProduct> universe,
) {
  final own = p.color;
  if (own == null || own.isEmpty) return null;
  final aggregated = _colorValues(universe);
  final values = aggregated.isNotEmpty
      ? aggregated
      : [AttributeValue(id: ',
  't_de5a16cf': ',
    kind: AttributeKind.color,
    values: values,
  );
}

/// זיהוי מחלק (סעפת/מחלק) — לפי השם. מחלקים חיים תחת קטגוריית-צווארונים אך נבדלים
/// בשם; לכן מיירטים אותם **לפני** נתיב-משפחת-המנוע (אחרת יקבלו סכמת-צווארון).
bool _isManifold(LipskeyCatalogProduct p) =>
    p.nameHe.contains(',
  't_bd837ad3': ', labelHe: c, canonical: c, sortIndex: out.length));
  }
  return out;
}

/// סולם-הקוטר האמיתי של [family] — ה-`odOf` הנבדלים על-פני אֲחֵי-המשפחה המדויקים
/// ב-[universe]. נסיגה לתבנית-`kDepth` כשאין אחים (שומר M1: לעולם לא ריק).
List<AttributeValue> _familyDiameterValues(
  String family,
  List<LipskeyCatalogProduct> universe,
) {
  final ods = _distinctOds(universe, (p) => familyOf(p) == family, odOf);
  return ods.isEmpty ? diameterValues() : _diameterValuesFromOds(ods);
}

/// הקוטר-הקטן האמיתי של המצרה — ה-`od2Of` הנבדלים על-פני אֲחֵי-',
  't_77a1f783': ', od2Of);
  return ods.isEmpty ? diameterValues() : _diameterValuesFromOds(ods);
}

/// סולם-הקוטר של המחלקים — ה-`odOf` הנבדלים על-פני אֲחֵי-המחלק (`_isManifold`,
/// שכן למחלק אין `familyOf`). נסיגה לתבנית כשאין OD-ים קריאים.
List<AttributeValue> _manifoldDiameterValues(
  List<LipskeyCatalogProduct> universe,
) {
  final ods = _distinctOds(universe, _isManifold, odOf);
  return ods.isEmpty ? diameterValues() : _diameterValuesFromOds(ods);
}

/// הזוויות האמיתיות על-פני קבוצת-הברכיים כולה ב-[universe] (`familyOf` פותח
/// ב-',
  't_e9accf1c': ', sortIndex: 1),
];

/// סכמת-ההגדרה של מוצר: התכונות (=הגלגלים) שהכרטיס-הגנרי מרנדר. תמונה/מחיר
/// (פאזות D/E) מתווספים בהמשך. `attributes` = `AttributeDef` קיים (reuse).
@immutable
class ProductConfigSchema {
  const ProductConfigSchema({
    required this.sku,
    required this.nameHe,
    required this.familyId,
    required this.emoji,
    required this.attributes,
  });

  final String sku;
  final String nameHe;
  final String familyId; // שם-משפחת-המנוע, או מחלקת-הקטלוג (fallback)
  final String emoji;
  final List<AttributeDef> attributes; // הגלגלים (פר-תכונה)

  /// האם המוצר קיבל סכמה-נגזרת-ממנוע (יש לו לפחות תכונה אחת)?
  bool get hasWheels => attributes.isNotEmpty;

  @override
  bool operator ==(Object other) =>
      other is ProductConfigSchema &&
      other.sku == sku &&
      other.nameHe == nameHe &&
      other.familyId == familyId &&
      other.emoji == emoji &&
      listEquals(other.attributes, attributes);

  @override
  int get hashCode =>
      Object.hash(sku, nameHe, familyId, emoji, Object.hashAll(attributes));
}

// ── אגירת-ערכים (פאזה F) — ה-odOf/od2Of/הזוויות הנבדלים על-פני האוכלוסייה ───────

/// ה-OD-ים הנבדלים (nulls מדולגים) על-פני חברי [universe] ש-[matches] מקבל,
/// כפי ש-[reader] קורא אותם — ממוינים עולה. המנרמל המשותף (קוטר/קוטר-שני).
List<int> _distinctOds(
  List<LipskeyCatalogProduct> universe,
  bool Function(LipskeyCatalogProduct) matches,
  int? Function(LipskeyCatalogProduct) reader,
) {
  final set = <int>{};
  for (final peer in universe) {
    if (matches(peer)) {
      final od = reader(peer);
      if (od != null) {
        set.add(od);
      }
    }
  }
  return set.toList()..sort();
}

/// ערכי-קוטר מרשימת-OD ממוינת → `AttributeValue`-ים (`od-N` · label/canonical `N`).
List<AttributeValue> _diameterValuesFromOds(List<int> ods) => [
      for (var i = 0; i < ods.length; i++)
        AttributeValue(
          id: ',
  't_7ec99134': ', sortIndex: 2),
      ],
    );

/// יציאות-המחלק — הגלגל נבנה מ-[values] **האמיתיות** ([_portValues]). תכונת-משפחה
/// מוצהרת (לא שדה-דאטה-חדש).
AttributeDef _ports(List<AttributeValue> values) => AttributeDef(
      id: ',
  't_742f9b42': ', המספר נקרא מהשם: ',
  't_cd13a520': '. נסיגה
/// לתבנית כשאין אחים דו-קוטריים.
List<AttributeValue> _reducerSmallValues(List<LipskeyCatalogProduct> universe) {
  final ods = _distinctOds(universe, (p) => familyOf(p) == ',
  't_cebf8d38': ';

/// קידומת-הברך — `familyOf` מחזיר ',
  't_0a054bdf': ']` הנבדלות על-פני אֲחֵי-המחלק
/// ([_isManifold]) ב-[universe], ממוינות מספרית. נסיגה לתבנית 1–4 כשאין דאטה
/// (שומר M1: לעולם לא ריק). **נאגר מהדאטה** (פאזה F) — לא תבנית-1-4 גנרית.
List<AttributeValue> _portValues(List<LipskeyCatalogProduct> universe) {
  final set = <int>{};
  for (final peer in universe) {
    if (!_isManifold(peer)) continue;
    final raw = peer.dims?[',
  't_e18b4757': 'ארוך',
  't_8f6471d0': 'קוטר גדול',
  't_be35fc25': 'קוטר קטן',
  't_b1896e02': 'קצר',
  't_cd1a4476': '→90) — ממוינות, ב-canonical נטול-° של
/// המנוע. נסיגה לתבנית {45°,90°} כשאין ברכיים (שומר M1).
List<AttributeValue> _angleValues(List<LipskeyCatalogProduct> universe) {
  final degrees = <int>{};
  for (final peer in universe) {
    final family = familyOf(peer);
    if (family == null || !family.startsWith(_kElbowPrefix)) {
      continue;
    }
    final match = RegExp(r',
  't_1eb3604e': ';

/// The pixel height of a single wheel row — the [ListWheelScrollView] itemExtent.
/// Neighbours sit one extent above/below the centred pick.
const double _kItemExtent = 36;

/// The wheel viewport height (~3.6 rows: one centred + dimmed neighbours).
const double _kWheelHeight = 132;

/// The centred SELECTION BAND — a brand-tinted translucent fill (brand @ ~8%)
/// with a rounded (radiusPill) brand hairline outline (brand @ ~40%). Const ARGB,
/// so NO runtime opacity (very_good: no withOpacity).
const Color _kBandFill = Color(0x14FF7A18);
const Color _kBandLine = Color(0x66FF7A18);

/// Colour-swatch palette for an [AttributeKind.color] wheel (plan 🫀). Const
/// ARGB, keyed by the Hebrew colour name; an unknown name → a neutral swatch.
const Color _kSwatchBlue = Color(0xFF2563EB); // כחול
const Color _kSwatchRed = Color(0xFFDC2626); // אדום
const Color _kSwatchWhite = Color(0xFFECECEC); // לבן
const Color _kSwatchBlack = Color(0xFF222222); // שחור
const Color _kSwatchGray = Color(0xFF9AA0A6); // אפור

/// The diameter of a colour-row swatch dot.
const double _kSwatchSize = 14;

/// A wheel',
  't_b0ae0b57': 's "גלגל עם פס-בחירה" ported onto Flutter',
  't_fc8c751e': ' אם ',
  't_78d1bb19': ' אם השם דו-קוטרי
  kPprElbows: ',
  't_30f3f70b': ' בשם
  kPprTees: ',
  't_3b6de743': ') {
    // מצרה = מצמד דו-קוטרי (שני קטרים נבדלים). מצמד ישר = קוטר יחיד.
    final m = _kReducer.firstMatch(p.nameHe);
    if (m != null && m.group(1) != m.group(2)) return ',
  't_ce4ee7b9': '));
  return m == null ? null : int.tryParse(m.group(1)!);
}

/// הקוטר השני של מצרה (הקטן), או `null` אם לא דו-קוטרי.
int? od2Of(LipskeyCatalogProduct p) {
  final m = _kReducer.firstMatch(p.nameHe) ??
      _kReducer.firstMatch(p.dims?[',
  't_24dbadbd': ').firstMatch(p.nameHe);
  if (m2 != null) return int.tryParse(m2.group(1)!);
  // 4. DN-נגרר בשם: "ברך PPR 45° פ.פ 20" → 20.
  final m = RegExp(r',
  't_ad0d786a': ').firstMatch(size);
    if (m != null) return int.tryParse(m.group(1)!);
  }
  // 3. דו-קוטרי בשם: "50x40" · "20×2.8" → 50/20 (הקוטר הראשון). **לפני** ה-DN-
  //    הנגרר: אחרת "50x40" היה תופס את ה-40 הנגרר במקום ה-50 הראשי.
  final m2 = RegExp(r',
  't_dd4755fc': ');

/// זיהוי זווית 45° בשם הברך (אחרת 90°).
bool _is45(String name) => name.contains(',
  't_16c35cd9': ');

/// משפחת-המנוע של מוצר-קטלוג, או `null` כשאין התאמה (צינור · אומגה · כלי ·
/// ריתוך-חשמלי · קטגוריה לא-אביזרית). `null` = **fallback כן**, לא כשל-מנוע (M1).
String? familyOf(LipskeyCatalogProduct p) {
  final base = _kCategoryFamily[p.categoryHe];
  if (base == null) return null; // צינור/אומגה/כלי/electrofusion → fallback
  if (base == ',
  't_6613ab32': ');
  if (m == null || m.group(1) == m.group(2)) return null;
  return int.tryParse(m.group(2)!);
}

/// המנוע יכול לגזור מידות למוצר הזה? (משפחה מוכרת + OD בטבלת-העומק).
/// `false` ⇒ fallback-לתמונה, לעולם לא 3D-שגוי (M1).
bool engineCanRender(LipskeyCatalogProduct p) {
  final fam = familyOf(p);
  final od = odOf(p);
  if (fam == null || od == null) return false;
  if (fam == ',
  't_d11e0234': ', // מוכרע ל-',
  't_0b603062': ';

/// קטגוריית-קטלוג → שם-משפחת-מנוע (מפתח ב-`kFittingFamilies`/`ENGINE`).
/// משפחות דו-משמעיות (ברך 90/45 · מצמד/מצרה) מוכרעות ב-[familyOf] מהשם.
const Map<String, String> _kCategoryFamily = {
  kPprCouplers: ',
  't_4a141808': 'מידה נומינלית',
  't_1a2c604e': ';

/// פורט-חיבור עם כיוון-יציאה מרחבי במסגרת-המקומית של האביזר.
@immutable
class DirectedPort {
  const DirectedPort(this.od, this.dir);

  /// הקוטר-החיצוני (מ"מ) של הפורט הזה.
  final int od;

  /// הנורמל-היוצא (וקטור-יחידה) במסגרת-המקומית של האביזר.
  final Vec3 dir;

  @override
  bool operator ==(Object other) =>
      other is DirectedPort && other.od == od && other.dir == dir;

  @override
  int get hashCode => Object.hash(od, dir);

  @override
  String toString() => ',
  't_f401b689': ' as math;

/// SDR (Standard Dimension Ratio) לפי PN. PN20 ⇒ SDR 6.
const Map<int, double> kSdr = {20: 6.0, 16: 7.4, 10: 11.0};

/// עומק-שקע (ריתוך) — טבלת DIN 8077. ידע הנדסי, לא נתוני-קטלוג.
const Map<int, double> kDepth = {
  20: 14.5, 25: 16.0, 32: 18.0, 40: 20.5, 50: 23.5,
  63: 27.5, 75: 30.0, 90: 33.0, 110: 37.0, 125: 40.0,
};

/// עיגול לספרה-עשרונית אחת, **זהה ל-Python `round(x, 1)`** — half-to-even על
/// *הערך-האמיתי* של ה-double. מאומת golden 1:1 מול `pure_engine.py` (140 שורות).
///
/// למה לא `x*10`/`toStringAsFixed(1)`: הכפל ב-10 הופך ערך כמו 26.7/2=13.34999… ל-
/// תיקו-שקרי (133.5) ומעגל להיפך; `toStringAsFixed(1)` סוטה מ-half-even על עשרות
/// ערכים. הפתרון: הרחבה ל-15 ספרות (נאמנה לערך-האמיתי) + עיגול-לזוגי ידני מדויק.
double r1(double x) {
  final neg = x.isNegative;
  final ax = neg ? -x : x;
  // 18 ספרות — נאמן ל*צד* של הערך-האמיתי מול גבול-ה-.05 לכל גודל כאן (ulp ≪ 1e-13
  // עד ~1200). 15 היה מעט-מדי: 26.7/2=13.34999…964 (מתחת ל-13.35) עוגל שקרית ל-13.350.
  final s = ax.toStringAsFixed(18);
  final dot = s.indexOf(',
  't_97eeace3': ')!; // בברך קוראים לקוטר-החוץ D
  return b;
}

Map<String, double> tee(int od) {
  final b = base(od);
  final f = b[',
  't_a86a8bbe': ');
  var intVal = int.parse(s.substring(0, dot));
  final frac = s.substring(dot + 1);
  var keep = frac.codeUnitAt(0) - 48; // הספרה הנשמרת (עשירית)
  final firstDrop = frac.codeUnitAt(1) - 48; // הספרה שמחליטה
  var restNonZero = false;
  for (var i = 2; i < frac.length; i++) {
    if (frac.codeUnitAt(i) != 48) {
      restNonZero = true;
      break;
    }
  }
  final roundUp = firstDrop > 5 ||
      (firstDrop == 5 && restNonZero) ||
      (firstDrop == 5 && !restNonZero && keep.isOdd); // תיקו → לזוגי
  if (roundUp && ++keep == 10) {
    keep = 0;
    intVal += 1;
  }
  final v = intVal + keep / 10.0;
  return neg ? -v : v;
}

/// הבסיס האוניברסלי — כל אביזר-ריתוך. מקביל ל-`base(od, pn)` ב-Python.
/// מפה עם סדר-הכנסה זהה למקור (`OD·wall·ID·B·C·F`).
Map<String, double> base(int od, {int pn = 20}) {
  final wall = od / kSdr[pn]!;
  return {
    ',
  't_76401cfc': ': kDepth[od] ?? double.nan, // עומק-שקע (ריתוך)
  };
}

// ===== צורה פר-משפחה (z = מרכז→פנים, מגיאומטריה) =====

Map<String, double> coupler(int od) {
  final b = base(od);
  b[',
  't_0c667986': ': r1(0.986 * d),
    };

/// בורר-דיאגרמה: משפחה × טווח-גודל → קונסטרוקציה.
Map<String, double> elbowAuto(int d, {int angle = 90}) =>
    d >= 160 ? miteredElbow(d) : elbow(d, angle: angle);

double _rad(num deg) => deg * math.pi / 180.0;

/// שמות-המשפחות החד-קוטריות — זהים למפתחות `ENGINE` ב-`pure_engine.py`.
/// (מצרה דו-קוטרית + ברך-מחותכת אינן כאן — נבחרות דרך `generate`.)
const List<String> kFittingFamilies = [
  ',
  't_f02b35ff': ': r1(od * (1 + 2 / 6)), // קוטר-חוץ (PN20)
    ',
  't_9232c9e2': ': r1(od * 0.97), // קדח-שקע (הצינור נכנס)
    ',
  't_ea4698a3': ': r1(od - 2 * wall), // קדח-זרימה
    ',
  't_95b4d85e': '] = r1(2 * (z + f)); // רוחב-הרַץ
  b[',
  't_26bf2870': '] = r1(f + od * 0.3); // מרכז-המשושה
  b[',
  't_41882a00': '] = r1(hex * 0.87); // מפתח-על-שטוחים
  b[',
  't_3f3ac7fe': '] = r1(od * 0.4); // אורך-הכיפה
  return b;
}

Map<String, double> saddle(int od) {
  final b = base(od);
  final f = b[',
  't_be2a5fa9': '] = r1(od * 0.6); // עובי-האוגן
  return b;
}

/// מצרה (d1×d2) — קומפוזיציה: כל צד לפי חוקי-הבסיס של הקוטר שלו.
Map<String, double> reducer(int d1, int d2) {
  final s1 = base(d1);
  final s2 = base(d2);
  return {
    ',
  't_c9eb6198': '] = r1(od * 0.64); // מרכז-לפנים
  b[',
  't_1c133854': '] = r1(od * 0.67); // קדח-הכדור ≈ DN
  b[',
  't_91ffaa9a': '] = r1(od * 0.9); // אורך-התבריג
  b[',
  't_26c9ab18': '] = r1(od * 1.05); // מרכז-לפנים
  b[',
  't_6974bd17': '] = r1(od * 1.05); // קוטר-חיצוני של התבריג
  b[',
  't_2d547afd': '] = r1(od * 1.15); // קוטר-צוואר
  b[',
  't_02fe172a': '] = r1(od * 1.333); // קוטר-חוץ של שקע-ההסתעפות
  b[',
  't_bb64c623': '] = r1(od * 1.478); // אורך-כולל
  b[',
  't_830d0183': '] = r1(od * 1.6); // קוטר-גוף
  b.remove(',
  't_742cb773': '] = r1(od * 1.619); // קוטר-אוגן חיצוני
  b[',
  't_0786b483': '] = r1(od * 2); // קוטר הצינור-הראשי
  b[',
  't_3cbf9f72': '] = r1(od * 2.9); // גובה (גוף+ידית)
  return b;
}

Map<String, double> plug(int od) {
  final b = base(od);
  b[',
  't_55c64bda': ']! + 2); // 2 שקעים + מעצור-מרכז
  return b;
}

Map<String, double> elbow(int od, {int angle = 90}) {
  final b = base(od);
  final f = b[',
  't_f14f233c': ']! + 3), // שני שקעים + מעבר
  };
}

/// ברך מחותכת גדולה (מודל B, 160–400) — מגזרים = יחס נקי לרדיוס-הכיפוף (∝d).
Map<String, double> miteredElbow(int d) => {
      ',
  't_58fe3be7': ']! + od * 0.4); // אורך-כולל
  b[',
  't_5fa46d76': ']! / 2); // גובה-ההסתעפות
  return b;
}

Map<String, double> adapter(int od) {
  final b = base(od);
  final f = b[',
  't_e80b29e9': ']! / 2); // מרכז-לפנים ≈ רדיוס-החוץ
  b[',
  't_96b0e8fc': ']!); // גובה-ההסתעפות
  return b;
}

Map<String, double> collar(int od) {
  final b = base(od)..remove(',
  't_0821e521': ']!); // מרכז-לקצה = עומק + z
  b[',
  't_029cae1c': ']!); // מרכז-לקצה-שקע
  b[',
  't_8112de86': ']!); // שקע→קצה-תבריג
  return b;
}

Map<String, double> valve(int od) {
  final b = base(od);
  final f = b[',
  't_30f74d2a': ']!;
  final hex = r1(od * 1.95); // מפתח-על-פינות
  b[',
  't_57a1f480': ']!;
  final r = 0.52 * od; // רדיוס-כיפוף (short radius)
  b[',
  't_f50504c4': ';

/// קצה-פנוי: פורט של [cell] הפונה בכיוון-הסריג [step] (od = [od]) שאין לו שכן
/// מחובר — כלומר מקום פנוי להוסיף אליו אביזר.
@immutable
class FreeEnd {
  const FreeEnd(this.cell, this.step, this.od);

  final GridCell cell;
  final GridStep step;
  final int od;

  @override
  bool operator ==(Object other) =>
      other is FreeEnd &&
      other.cell == cell &&
      other.step == step &&
      other.od == od;

  @override
  int get hashCode => Object.hash(cell, step, od);

  @override
  String toString() => ',
  't_08eb0e70': ';

/// עשר משפחות-המנוע החד/דו-קוטריות (§2) + ברך-מחותכת (טווח גדול, נבחרת בנפרד).
enum Family {
  coupler(',
  't_bd1f6d7f': ');

/// שכבת-ה-3D: layout (turtle) + geometry + render. web-first (פאזה C).
const bool kFittingEngine3d = bool.fromEnvironment(',
  't_98262293': ');

/// שכבת-האינטליגנציה: תכנון-חיבור/ניתוב/AI (פאזה D). מאומת ע"י המנוע הדטרמיניסטי.
const bool kFittingEngineIntel = bool.fromEnvironment(',
  't_81117730': ' show immutable;

/// חומר-החלק — קובע צבע/הצללה אצל הצייר (PP-R ירוק · צינור אפור · פליז).
enum PartMaterial { ppr, pipe, brass }

/// תת-רשת של אביזר, כבר במסגרת-המקומית (מ״מ), עם חומר וסימון זרוע-הסתעפות.
/// `branchAxis` ⇒ החלק נפרס לאורך ציר-ההסתעפות (B) ולא ציר-המעלה (U) — לטי/רוכב.
@immutable
class ElementPart {
  const ElementPart(this.mesh, this.mat, {this.branchAxis = false});
  final Mesh mesh;
  final PartMaterial mat;
  final bool branchAxis;
}

/// גוף-האביזר: חלקיו + דלתות-הפריסה (`ex`/`ey`/`turn`) + סימון-קצה (`term`, פקק).
/// זהה ל-`layoutDeltaFor` בדלתות — הגיאומטריה וההתקדמות נגזרות יחד (כמו gen3d).
@immutable
class ElementMeshes {
  const ElementMeshes(this.parts,
      {required this.ex, required this.ey, required this.turn, this.term = false,});
  final List<ElementPart> parts;
  final double ex;
  final double ey;
  final double turn;
  final bool term;
}

/// גוף-האביזר של (family, od[, od2]) — פורט 1:1 מ-`elemMeshes`. משפחה לא-נתמכת
/// (ברך-מחותכת / לא-מוכר) → `null` (fallback · ה-assembler מדלג · M1).
ElementMeshes? elementMeshesFor(String family, int od, {int? od2}) {
  if (!_kSupported.contains(family)) return null;
  final g = generate(family, od, od2: od2);

  if (family == ',
  't_03d70e2a': ']! / 2, bore), PartMaterial.ppr),
      ],
      ex: a + th,
      ey: 0,
      turn: 0,
    );
  }

  return null; // unreachable (guarded by _kSupported)
}

/// צינור-מעבר בין שני קטרים (חיבור גדלים שונים) — פורט 1:1 מ-`taperGeom` (gen3d:174).
/// `oA→oB` קוטר-חיצוני · דופן ≈ ⅙. משמש את ה-assembler לצנרת-הריתוך בין אביזרים.
Mesh taperGeom(double len, double oA, double oB) {
  final rA = oA / 2 * 0.98;
  final rB = oB / 2 * 0.98;
  final iA = (oA - 2 * oA / 6) / 2;
  final iB = (oB - 2 * oB / 6) / 2;
  return revolve([
    [0, rA],
    [len * 0.4, rA],
    [len * 0.6, rB],
    [len, rB],
    [len, iB],
    [len * 0.6, iB],
    [len * 0.4, iA],
    [0, iA],
  ], 48,);
}

/// צינור ישר (אותו קוטר) — לצנרת-מעבר של קוטר-אחיד. פורט מ-`pipe()` ב-gen3d:333.
Mesh straightPipe(double len, double od) =>
    tube(0, len, od / 2 * 0.98, (od - 2 * od / 6) / 2);

/// אורך-קצה (STUB) ואורך-צנרת-מעבר (PIPELEN) — verbatim מ-gen3d (`:331`).
const double kStubLen = 26;
const double kPipeLen = 58;
const double _kStub = kStubLen;

/// המשפחות שיש להן גוף-אמת (זהה לקבוצת ה-turtle/envelope).
const Set<String> _kSupported = {
  ',
  't_ae69c08d': '## כתב-חיתוך (מרחק-מרכזים \${spacing.toStringAsFixed(0)} מ״מ)',
  't_33079a59': '## רצף (\${plan.route.length} אביזרים)',
  't_bbe99086': '\${c.cutLength.toStringAsFixed(1)} מ״מ',
  't_a3a202e7': '- \${c.fromFamily} → צינור OD\${c.od} → \${c.toFamily}: ',
  't_c1a10f61': '- (אין מרווחי-צינור)',
  't_3f57c1e0': '- (רצף ריק)',
  't_4bcad9a0': ';

/// מייצא תוכנית-קו למסמך-טקסט (Markdown-lite · עברית): כותרת · רצף-אביזרים ממוספר ·
/// כתב-חיתוך פר-מרווח. מרחק-מרכזים [spacing] נומינלי. טהור · דטרמיניסטי.
String exportBuildPlanText(FittingLinePlan plan, {double spacing = 200}) {
  final b = StringBuffer()
    ..writeln(',
  't_952e86e1': ';

/// מסך "ייצוא-מסמך": טקסט-תוכנית-הבנייה, ניתן-לבחירה+העתקה.
class BuildPlanExportScreen extends StatelessWidget {
  const BuildPlanExportScreen({required this.plan, super.key});

  final FittingLinePlan plan;

  @override
  Widget build(BuildContext context) {
    final doc = exportBuildPlanText(plan);
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_65aa83ed': '\${seg.cutLength.toStringAsFixed(1)} מ״מ',
  't_a2a27686': '\${seg.fromFamily} ← צינור OD\${seg.od} → \${seg.toFamily}',
  't_c132847a': ';

/// מסך "תוכנית-בנייה": 3D + סיכום-רצף + טבלת-כתב-חיתוך. מרחק-מרכזים נומינלי (מוגדר).
class BuildPlanScreen extends StatelessWidget {
  const BuildPlanScreen({
    this.route = _demoRoute,
    this.nominalSpacing = 200,
    super.key,
  });

  final List<RunElement> route;
  final double nominalSpacing;

  static const List<RunElement> _demoRoute = [
    RunElement(Family.coupler, 50),
    RunElement(Family.elbow90, 50, dir: Dir.up),
    RunElement(Family.tee, 50),
    RunElement(Family.reducer, 50, od2: 32),
    RunElement(Family.coupler, 32),
    RunElement(Family.elbow90, 32, dir: Dir.down),
    RunElement(Family.plug, 32),
  ];

  @override
  Widget build(BuildContext context) {
    final cuts = cutListUniform(route, nominalSpacing);
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_31056c53': 'אין מרווחי-צינור ברצף',
  't_445906a3': 'כתב-חיתוך (אורכי-צינור פר-מרווח)',
  't_373e24d3': ';

/// מסך "תאימות": מוצר-נבחר + רשימת-האביזרים שמתחברים אליו (✓) / לא (✗ + סיבה).
class CompatibilityScreen extends StatelessWidget {
  const CompatibilityScreen({
    this.product = _demoProduct,
    this.universe = _demoUniverse,
    super.key,
  });

  final LipskeyCatalogProduct product;
  final List<LipskeyCatalogProduct> universe;

  static const _demoProduct =
      LipskeyCatalogProduct(sku: ',
  't_9ce4f0d5': 'אביזרי קצה HDPE',
  't_cf70273c': 'ברך 90° 32',
  't_568c9d81': 'מסעף 32',
  't_26f98217': 'מצמד 32',
  't_cdc6397f': 'מצמד 50',
  't_367a908a': 'מתחבר-ל: \${product.nameHe}',
  't_9c6988b7': 'תאימות-אביזרים · preview (off-live)',
  't_43414a66': ';

/// מסך "מבט-פירוק": 3D + סליידר-פיצוץ (💥). מפרק/מרכיב את הקו חזותית.
class ExplodedViewScreen extends StatefulWidget {
  const ExplodedViewScreen({this.route = _demoRoute, super.key});

  final List<RunElement> route;

  static const List<RunElement> _demoRoute = [
    RunElement(Family.coupler, 50),
    RunElement(Family.elbow90, 50, dir: Dir.up),
    RunElement(Family.tee, 50),
    RunElement(Family.reducer, 50, od2: 32),
    RunElement(Family.valve, 32),
    RunElement(Family.plug, 32),
  ];

  @override
  State<ExplodedViewScreen> createState() => _ExplodedViewScreenState();
}

class _ExplodedViewScreenState extends State<ExplodedViewScreen> {
  double _explode = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_9236f313': '💥 פירוק',
  't_bcda6a54': ' · \${bom.criticalOpen} בטיחות חסרים',
  't_acbb1492': ' · יש פערים',
  't_fc314425': ';

/// מסך-היכולת "כתב-כמויות": רשימת-קנייה + סטטוס. מקבל BOM מוכן (או דמו).
class LineBomScreen extends StatelessWidget {
  const LineBomScreen({this.bom, super.key});

  final LineBom? bom;

  static const LineBom _demo = LineBom(
    rows: [
      BomRow(',
  't_3dc762e8': 'ברז כדורי PPR 32',
  't_8ee62aba': 'ברך PPR 90° 50',
  't_bfa8d35e': 'כתב-כמויות · preview (off-live)',
  't_5ae3d609': 'מסעף PPR 50',
  't_9cc4e06c': 'מצמד PPR 50',
  't_6dbc6566': 'מצרה PPR 50×32',
  't_68c340a6': 'סה״כ \${bom.totalPieces} פריטים',
  't_6fe5eb65': 'פקק PPR 32',
  't_aa3bdde3': ', fontWeight: FontWeight.w700),
        ),
      ),
      body: Column(
        children: [
          _LineSummary(plan: p),
          const Divider(height: 1, color: Color(0xFF26333F)),
          Expanded(child: FittingPreview3d(route: p.route)),
        ],
      ),
    );
  }
}

/// שורת-סיכום: צ',
  't_88f74765': ';

/// מסך-היכולת "בנה-קו": סיכום-רצף + 3D. מקבל תוכנית מוכנה (או רצף-דמו).
class LineBuilderScreen extends StatelessWidget {
  const LineBuilderScreen({this.plan, super.key});

  final FittingLinePlan? plan;

  static final FittingLinePlan _demo = FittingLinePlan.fromRoute(const [
    RunElement(Family.coupler, 50),
    RunElement(Family.elbow90, 50, dir: Dir.up),
    RunElement(Family.tee, 50),
    RunElement(Family.reducer, 50, od2: 32),
    RunElement(Family.valve, 32),
    RunElement(Family.elbow90, 32, dir: Dir.down),
    RunElement(Family.plug, 32),
  ]);

  @override
  Widget build(BuildContext context) {
    final p = plan ?? _demo;
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_57080ce2': 'י-משפחה + קוטר). דאטה בלבד, אפס-חישוב חדש.
class _LineSummary extends StatelessWidget {
  const _LineSummary({required this.plan});

  final FittingLinePlan plan;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: const Color(0xFF151F2A),
      padding: const EdgeInsets.all(12),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final el in plan.route)
              Chip(
                backgroundColor: const Color(0xFF23303D),
                label: Text(
                  ',
  't_ebd66886': 'רצף ריק',
  't_6a91206f': ';

/// מסך "נפילת-לחץ": ΔP + צוואר-בקבוק + הצעות. מקבל תוכנית-קו מוכנה.
class LinePressureScreen extends StatelessWidget {
  const LinePressureScreen({required this.plan, super.key});

  final FittingLinePlan plan;

  @override
  Widget build(BuildContext context) {
    final r = pressureDropForPlan(plan);
    final over = r.exceedsBudget;
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_6c26cd87': 'K=\${r.totalK.toStringAsFixed(2)} · אורך=\${r.frictionMetres.toStringAsFixed(1)}מ׳ · ',
  't_4afe03bc': 'אין הערות-זרימה — הקו בתקציב.',
  't_1e3ec654': 'הצעות',
  't_ad25cc0d': 'צוואר-בקבוק: \${r.bottleneck!.nameHe}',
  't_f543b249': 'קדח-מינ׳=\${r.minBoreMm.toStringAsFixed(1)}מ״מ',
  't_11acbad8': ', color: Colors.white70),
                    ),
                  )
                : FittingPreview3d(route: route),
          ),
          const Divider(height: 1, color: Color(0xFF26333F)),
          Expanded(flex: 2, child: _SpecPanel(product: product, spec: spec)),
        ],
      ),
    );
  }
}

/// לוח-מפרט קריא: כותרת · מידות-מפתח · שיטות-חיבור · ריתוך(+caveat) · בטיחות · תקנים.
class _SpecPanel extends StatelessWidget {
  const _SpecPanel({required this.product, required this.spec});

  final LipskeyCatalogProduct product;
  final BuildableSpec? spec;

  @override
  Widget build(BuildContext context) {
    const label = TextStyle(fontFamily: ',
  't_131657db': ';

/// מסך "הצג-בתלת-ממד" למוצר בודד: 3D למעלה + לוח-מפרט למטה. אביזר לא-פריס-במנוע
/// (`routeFromProducts` ריק) → מציג לוח-מפרט/הודעה בלי 3D, לעולם לא קורס (M1).
class Product3dScreen extends StatelessWidget {
  const Product3dScreen({required this.product, this.tempC = 20, super.key});

  final LipskeyCatalogProduct product;
  final int tempC;

  @override
  Widget build(BuildContext context) {
    final route = routeFromProducts([product]);
    final family = familyOf(product);
    final od = odOf(product);
    final spec = (family != null && od != null)
        ? buildableSpecFor(family, od, od2: od2Of(product), tempC: tempC)
        : null;

    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_48fb6a09': 'אין מפרט-מנוע למוצר זה',
  't_e996a55d': 'בטיחות קו-חם',
  't_e1d4efe1': 'האביזר אינו פריס-במנוע (fallback לתמונה)',
  't_d0f14393': 'לא-נדרשת (קו-קר)',
  't_98731805': 'מחוץ-לטבלה',
  't_c22b2341': 'משפחה: \${s.family} · קוטר: \${s.od}',
  't_5e24d495': 'ראש \${s.weld!.headTempC}°C · \${s.weld!.caveat}',
  't_b145f33b': 'ריתוך (ערכי-ייחוס)',
  't_3622fee9': 'שיטות-חיבור',
  't_621a527d': 'תקנים',
  't_e01b88e2': ' show immutable;

/// וקטור-3D immutable מינימלי (המתמטיקה של ה-turtle · לא תלוי-פלטפורמה).
@immutable
class Vec3 {
  const Vec3(this.x, this.y, this.z);
  final double x;
  final double y;
  final double z;

  Vec3 operator +(Vec3 o) => Vec3(x + o.x, y + o.y, z + o.z);
  Vec3 operator -(Vec3 o) => Vec3(x - o.x, y - o.y, z - o.z);
  Vec3 scale(double s) => Vec3(x * s, y * s, z * s);
  double dot(Vec3 o) => x * o.x + y * o.y + z * o.z;
  Vec3 cross(Vec3 o) =>
      Vec3(y * o.z - z * o.y, z * o.x - x * o.z, x * o.y - y * o.x);
  double get length => math.sqrt(dot(this));
  Vec3 norm() {
    final n = length;
    return n == 0 ? this : scale(1 / n);
  }

  @override
  bool operator ==(Object other) =>
      other is Vec3 && other.x == x && other.y == y && other.z == z;
  @override
  int get hashCode => Object.hash(x, y, z);
  @override
  String toString() =>
      ',
  't_f01def68': ' show immutable;

/// דלתת-פריסה של אביזר בודד ברצף ה-turtle: התקדמות-קדימה, התקדמות-על-הפנייה,
/// זווית-פנייה (רדיאנים · 0 = ישר), וסימון-קצה (פקק סוגר את הרצף).
@immutable
class LayoutDelta {
  const LayoutDelta({
    required this.ex,
    this.ey = 0,
    this.turn = 0,
    this.terminal = false,
  });

  /// התקדמות לאורך ציר-הזרימה הנוכחי (מ״מ).
  final double ex;

  /// התקדמות על ציר-הפנייה (מ״מ) — לא-אפס רק לברך.
  final double ey;

  /// זווית-הפנייה (רדיאנים) — 0 לאביזר-ישר, π/2 / π/4 לברך.
  final double turn;

  /// פקק — סוגר את הרצף (אין המשך-צנרת אחריו).
  final bool terminal;

  @override
  bool operator ==(Object other) =>
      other is LayoutDelta &&
      other.ex == ex &&
      other.ey == ey &&
      other.turn == turn &&
      other.terminal == terminal;

  @override
  int get hashCode => Object.hash(ex, ey, turn, terminal);
}

/// המשפחות שה-turtle יודע לפרוס (מקבילות ל-`elemMeshes`).
const Set<String> _kLayoutFamilies = {
  ',
  't_a54a5076': ' show immutable;

/// תקני PP-R — verbatim מהמקור-המאומת `gen3d.html:422` (שלב 34).
const List<String> kPprStandards = [
  ',
  't_eeb02558': ',
];

/// שיטת-החיבור בקצה נתון (שלב 30) — נגזרת מסוג-הקצה.
String connectionMethodFor(ConnectorEnd end) => switch (end.type) {
      EndType.hdpeCompression => ',
  't_2754793c': 'Press / טבעת-כיווץ',
  't_4ac83231': 'פתח-ניקוז',
  't_c0703328': 'תבריג BSP חיצוני (זכר)',
  't_7cbcbbb6': 'תבריג BSP פנימי (נקבה)',
  't_59097425': ';

/// המשפחות שהניכוי מוגדר-להן חד-משמעית (אביזרי-רַץ סימטריים).
const Set<String> _kCutFamilies = {',
  't_fea3ae95': '];
  if (f == null || f.isNaN) return null; // OD מחוץ-לטבלה → fallback
  switch (family) {
    case ',
  't_d8b9d51c': ']; // = l − F, כבר golden
    case ',
  't_b82e72d2': '` (הסתעפות).
double? cutDeductionFor(String family, int od, {String socket = ',
  't_fafaaae3': '` (רַץ · ברירת-מחדל) או `',
  't_27cb445e': ';

/// חומר-הליבה של אביזר-ריתוך PP-R (מזהה-משפחה ב-`_materialsCompatible`).
const String kPprMaterial = ',
  't_fe2c5a46': ';

/// ספירת-שקעים פר-משפחת-מנוע (= מספר קצוות-הריתוך). מסעף/רוכב=3 · פקק=1 · השאר=2.
const Map<String, int> _kWeldSockets = {
  ',
  't_519a0d07': '`) — `directMatesWith`
/// משווה raw-string, וכל ה-BSP הסטטיים נכתבים עם הסימן. בלי הסימן החיבור פשוט
/// **לא נוצר** (false-negative בטוח, לעולם לא זיווג-שווא) — הנרמול מונע החמצה.
String _canonBsp(String inch) {
  final t = inch.trim();
  return t.contains(',
  't_e2b4073a': '`); [male] = זכר/נקבה.
/// כשאין נתוני-תבריג → מוחזר שקע-בלבד (honest-absent — לא ממציאים תבריג).
List<ConnectorEnd> ppRThreadAdapterEnds(
  int socketDn, {
  String? threadInch,
  bool? male,
}) {
  final ends = <ConnectorEnd>[_socket(socketDn)];
  if (threadInch != null && male != null) {
    ends.add(ConnectorEnd(
        male ? EndType.bspMale : EndType.bspFemale, _canonBsp(threadInch),),);
  }
  return ends;
}

/// מבטיח את סימן-האינץ',
  't_70069a8c': ' show immutable;

/// תיבת-חוסם אחידה לאביזר: אורך-ציר ראשי + קוטר-רדיאלי + היקף-משני אופציונלי
/// (לזרוע-ברך / הסתעפות-טי / ידית-ברז) — מספיק לפריסת-3D ולבורר-מצלמה.
@immutable
class Envelope {
  const Envelope({
    required this.axialLength,
    required this.radialDiameter,
    this.secondaryExtent,
  });

  /// האורך לאורך ציר-הזרימה הראשי (מ״מ).
  final double axialLength;

  /// הקוטר-החיצוני המרבי בחתך (מ״מ).
  final double radialDiameter;

  /// היקף-משני ניצב (זרוע-ברך `l` · גובה-הסתעפות `A` · גובה-ידית `h`) — `null`
  /// למשפחה ישרה (מצמד/פקק/מצרה).
  final double? secondaryExtent;

  @override
  bool operator ==(Object other) =>
      other is Envelope &&
      other.axialLength == axialLength &&
      other.radialDiameter == radialDiameter &&
      other.secondaryExtent == secondaryExtent;

  @override
  int get hashCode => Object.hash(axialLength, radialDiameter, secondaryExtent);

  @override
  String toString() =>
      ',
  't_bd1763b3': '));
    default:
      return null;
  }
}

/// המשפחות ש-`envelopeFor` יודע לחסום (מונע קריאת-`generate` שזורקת על לא-מוכר).
const Set<String> _kEnvelopeFamilies = {
  ',
  't_539a039f': ': // ישר: אורך A, קוטר B
      return _mk(f(',
  't_2d233cb2': ';
}

/// תיבת-החוסם של (family, od[, od2]) — נגזרת מאותיות `generate`. `null` כשאין
/// מספיק אותיות (מחוץ-לתחום) — fallback, לעולם לא תיבה שגויה (M1).
Envelope? envelopeFor(String family, int od, {int? od2}) {
  if (!_kEnvelopeFamilies.contains(family)) return null; // unknown → fallback
  final d = generate(family, od, od2: od2);
  double? f(String k) => d[k];

  switch (family) {
    case ',
  't_504f48ef': ' show immutable;

/// סף קו-חם (°C) — זהה ל-`install_engine._kHotThresholdC`.
const int kHotLineThresholdC = 60;

/// אזהרת-החובה (M5) — נלווית לכל המלצת-בטיחות, verbatim בכל פריט.
const String kSafetyCaveat =
    ',
  't_d9ee4cb4': 'PP-R מתפשט משמעותית יותר ממתכת בחום — לולאת/מפרק-התפשטות ותמיכות מתאימות.',
  't_f009b9d6': '` **וגם**
  // `',
  't_a8f55489': '` יזוהה כ-PP-R.
  if (!material.replaceAll(',
  't_7161f731': '` — וה-faser הוא
  // בדיוק צינור-הקו-החם. `==` היה משמיט בטיחות מקו-חם אמיתי (under-warning · תיקון
  // מביקורת-היריב). המקף מנורמל כדי ש-`',
  't_6a4972ea': 'כלי-התפשטות (מיכל)',
  't_5e81dce5': 'מגן אנטי-כוויה (TMV)',
  't_5113cc4d': 'מוסמך בלבד, לפי התקן והקוד המקומי (ISO 15874 · DVS 2207-11).',
  't_7b3bd42f': 'מים ≥60°C — סיכון-כוויה בנקודות-השימוש; ברז-ערבוב תרמוסטטי.',
  't_b8a259dc': 'פיצוי התפשטות-תרמית של הצינור',
  't_48ed6c93': 'קו-אספקה חם ולחוץ — הגנה מפני עליית-לחץ עם החימום.',
  't_822de4ec': 'קו-חם סגור — נפח-המים גדל בחימום; מיכל-התפשטות סופג את העלייה.',
  't_800b56bd': 'קו-חם — הפחתת הפסדי-חום + מניעת כוויית-מגע במשטח החם.',
  't_2d62fbf9': 'שסתום ביטחון-לחץ (PRV)',
  't_ffd66bca': ' show immutable;

/// טבלת-הריתוך (DVS 2207-11) — verbatim מ-`gen3d.html:362` `WELD`.
/// `od → [חימום(שנ׳), חיבור-מרבי(שנ׳), קירור(דק׳)]`. ראש-ריתוך 260°C.
const Map<int, List<int>> _kWeldTable = {
  16: [5, 4, 2], 20: [5, 4, 2], 25: [7, 4, 2], 32: [8, 6, 4],
  40: [12, 6, 4], 50: [18, 6, 4], 63: [24, 8, 6], 75: [30, 8, 8],
  90: [40, 8, 8], 110: [50, 10, 8], 125: [60, 10, 8],
};

/// אזהרת-היצרן החובה (M5) — verbatim מ-`gen3d.html:417`.
const String kWeldCaveat =
    ',
  't_5ef5eb84': 'ריתוך בידי מתקין מוסמך בלבד.',
  't_c3e04f7d': 'של הצינור הספציפי ותנאי-הסביבה (מתחת ל-5°C — להאריך חימום). ',
  't_1a1561fd': ' show immutable;

/// מטריצת 4×4 **column-major** (`m[col*4 + row]`) — בדיוק פריסת gen3d (`Float32Array`).
@immutable
class Mat4 {
  const Mat4(this.m);
  final List<double> m; // אורך 16

  /// מכפלה `this·b` (column-major) — פורט 1:1 מ-`M.mul` ב-gen3d.
  Mat4 mul(Mat4 b) {
    final o = List<double>.filled(16, 0);
    for (var c = 0; c < 4; c++) {
      for (var r = 0; r < 4; r++) {
        var s = 0.0;
        for (var k = 0; k < 4; k++) {
          s += m[k * 4 + r] * b.m[c * 4 + k];
        }
        o[c * 4 + r] = s;
      }
    }
    return Mat4(o);
  }

  /// מחיל את המטריצה על נקודה הומוגנית `(p, w)` → `(x, y, z, w)`.
  ({double x, double y, double z, double w}) apply(Vec3 p, {double w = 1}) {
    final x = m[0] * p.x + m[4] * p.y + m[8] * p.z + m[12] * w;
    final y = m[1] * p.x + m[5] * p.y + m[9] * p.z + m[13] * w;
    final z = m[2] * p.x + m[6] * p.y + m[10] * p.z + m[14] * w;
    final ww = m[3] * p.x + m[7] * p.y + m[11] * p.z + m[15] * w;
    return (x: x, y: y, z: z, w: ww);
  }
}

/// היטל-פרספקטיבה — פורט 1:1 מ-`M.persp(f, as, n, fa)` ב-gen3d (`:140`).
/// `fov` ברדיאנים · `aspect = W/H` · מישורי-חיתוך `near`/`far`.
Mat4 perspective(double fov, double aspect, double near, double far) {
  final t = 1 / math.tan(fov / 2);
  final m = List<double>.filled(16, 0);
  m[0] = t / aspect;
  m[5] = t;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = 2 * far * near / (near - far);
  return Mat4(m);
}

/// מטריצת-מבט (look-at) — פורט 1:1 מ-`M.look(e, c, u)` ב-gen3d (`:141`).
Mat4 lookAt(Vec3 eye, Vec3 center, Vec3 up) {
  var z = eye - center;
  z = z.norm();
  var x = up.cross(z);
  final xl = x.length;
  x = xl == 0 ? x : x.scale(1 / xl);
  final y = z.cross(x);
  return Mat4([
    x.x, y.x, z.x, 0, //
    x.y, y.y, z.y, 0, //
    x.z, y.z, z.z, 0, //
    -x.dot(eye), -y.dot(eye), -z.dot(eye), 1, //
  ]);
}

/// מיקום-העין במסלול-מסלול (orbit) סביב `target` — פורט 1:1 מ-`eye()` ב-gen3d (`:426`).
Vec3 orbitEye(Vec3 target, double dist, double yaw, double pitch) => Vec3(
      target.x + dist * math.cos(pitch) * math.sin(yaw),
      target.y + dist * math.sin(pitch),
      target.z + dist * math.cos(pitch) * math.cos(yaw),
    );

/// זווית/מרחק ברירת-המחדל של gen3d (`yaw=-0.6 · pitch=0.26 · fov=0.72`, `:425/434`).
const double kDefaultYaw = -0.6;
const double kDefaultPitch = 0.26;
const double kDefaultFov = 0.72;

/// יחס-המסגור של gen3d: `DIST = rad·2.7` (`:268`, בלי סקאלת-`S` — היחס סקאלה-חסין).
const double kFrameDistRatio = 2.7;

/// נקודה-מוקרנת: פיקסלי-מסך (`x`,`y`) + עומק ל-painter',
  't_6e8e0316': 's algorithm) עם הצללת-Lambert דו-צדדית. הליבה-הטהורה
// של ה-CustomPainter (הצייר עצמו = wrapper דק). מגודר · הכרטיס-החי לא-נגוע.
//
// הצללה: `N·L` עם `uLight=[0.5,0.9,0.55]` (gen3d:435) + היפוך-נורמל-לעבר-העין
// (`if dot(N,V)<0: N=-N`, gen3d:252) — דו-צדדי כמו המקור. PBR-מלא = שיפור מאוחר.

import ',
  't_cc1c7ec4': ';

/// צבע-בסיס פר-חומר (מוכפל בגורם-ההצללה פר-משולש). PP-R ירוק · צינור אפור · פליז.
const Color kPprColor = Color(0xFF3F8F46);
const Color kPipeColor = Color(0xFFAAB4BD);
const Color kBrassColor = Color(0xFFC9A24B);

/// רקע-הבמה (כהה) — כדי שהצנרת הירוקה/פליז תבלוט.
const Color kStageBackground = Color(0xFF0E141C);

/// צבע-הבסיס של חומר-חלק.
Color colorForMaterial(PartMaterial mat) => switch (mat) {
      PartMaterial.ppr => kPprColor,
      PartMaterial.pipe => kPipeColor,
      PartMaterial.brass => kBrassColor,
    };

/// צבע-ההיילייט (ברק) פר-חומר: דיאלקטרי → לבן · פליז → לבן-חמים (השתקפות מתכתית).
Color _highlightForMaterial(PartMaterial mat) => switch (mat) {
      PartMaterial.ppr => const Color(0xFFFFFFFF),
      PartMaterial.pipe => const Color(0xFFFFFFFF),
      PartMaterial.brass => const Color(0xFFFFF4D8),
    };

/// צייר-דק: מקבל חלקים-מוכנים (world-space, בעלי-חומר) + פרמטרי-מצלמה, מקרין ומצייר.
/// כל הלוגיקה-הכבדה ב-`projectParts` הטהור (הנבדק-golden); כאן רק רקע + מילוי-משולשים.
class RoutePainter extends CustomPainter {
  RoutePainter({
    required this.parts,
    required this.yaw,
    required this.pitch,
    required this.dist,
    required this.target,
    this.background = kStageBackground,
  });

  final List<WorldPart> parts;
  final double yaw;
  final double pitch;
  final double dist;
  final Vec3 target;
  final Color background;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    canvas.drawRect(Offset.zero & size, Paint()..color = background);
    final proj = perspective(kDefaultFov, size.width / size.height, 0.1, 100000);
    final eye = orbitEye(target, dist, yaw, pitch);
    final view = lookAt(eye, target, const Vec3(0, 1, 0));
    final tris = projectParts(parts, proj, view, eye, size);
    final paint = Paint()..style = PaintingStyle.fill;
    for (final t in tris) {
      final base = colorForMaterial(t.mat);
      final hl = _highlightForMaterial(t.mat);
      final s = t.shade.clamp(0.0, 1.0);
      final spec = t.specular.clamp(0.0, 1.0);
      // צבע-סופי = בסיס·הצללה + היילייט·ספקולרי (מוגבל ל-255).
      int ch(double baseC, double hlC) =>
          (baseC * 255.0 * s + hlC * 255.0 * spec).clamp(0.0, 255.0).round();
      paint.color = Color.fromARGB(
        255,
        ch(base.r, hl.r),
        ch(base.g, hl.g),
        ch(base.b, hl.b),
      );
      canvas.drawPath(
        Path()
          ..moveTo(t.a.dx, t.a.dy)
          ..lineTo(t.b.dx, t.b.dy)
          ..lineTo(t.c.dx, t.c.dy)
          ..close(),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(RoutePainter old) =>
      old.yaw != yaw ||
      old.pitch != pitch ||
      old.dist != dist ||
      !identical(old.parts, parts) ||
      old.background != background;
}

/// תצוגת-3D אינטראקטיבית של רצף-אביזרים: מסגור-אוטומטי מ-bbox + גרירה-לסיבוב +
/// צביטה-לזום. **מגודר · off-live** — נבנה רק ב-build-preview.
class FittingPreview3d extends StatefulWidget {
  const FittingPreview3d({required this.route, this.explode = 0, super.key});

  final List<RunElement> route;

  /// 💥 מרווח-פירוק (0=מורכב) — מרחיק את האביזרים להצגת-פירוק (יכולת exploded-view).
  final double explode;

  @override
  State<FittingPreview3d> createState() => _FittingPreview3dState();
}

class _FittingPreview3dState extends State<FittingPreview3d> {
  late List<WorldPart> _parts;
  late Vec3 _target;
  late double _dist;
  double _yaw = kDefaultYaw;
  double _pitch = kDefaultPitch;
  double _distAtGestureStart = 0;

  @override
  void initState() {
    super.initState();
    _rebuild();
  }

  @override
  void didUpdateWidget(FittingPreview3d old) {
    super.didUpdateWidget(old);
    if (!identical(old.route, widget.route) || old.explode != widget.explode) {
      _rebuild();
    }
  }

  void _rebuild() {
    _parts = assembleRoute(widget.route, explode: widget.explode);
    final b = meshBounds(_parts.map((p) => p.mesh).toList());
    _target = b.center;
    _dist = b.radius * kFrameDistRatio * 2; // מרווח-נשימה סביב הרצף
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleStart: (_) => _distAtGestureStart = _dist,
      onScaleUpdate: (d) {
        setState(() {
          if (d.scale != 1.0) {
            _dist = (_distAtGestureStart / d.scale).clamp(1.0, 1e7);
          }
          _yaw -= d.focalPointDelta.dx * 0.008;
          _pitch = (_pitch + d.focalPointDelta.dy * 0.008).clamp(-1.2, 1.2);
        });
      },
      child: CustomPaint(
        painter: RoutePainter(
          parts: _parts,
          yaw: _yaw,
          pitch: _pitch,
          dist: _dist,
          target: _target,
        ),
        size: Size.infinite,
      ),
    );
  }
}

/// מסך-בדיקה מגודר ל-preview (off-live). רצף-ברירת-מחדל להדגמה. **צעד 43 = GO-בעלים.**
class FittingPreviewScreen extends StatelessWidget {
  const FittingPreviewScreen({
    this.route = _demoRoute,
    super.key,
  });

  final List<RunElement> route;

  static const List<RunElement> _demoRoute = [
    RunElement(Family.coupler, 32),
    RunElement(Family.elbow90, 32, dir: Dir.up),
    RunElement(Family.coupler, 32),
    RunElement(Family.elbow90, 32),
    RunElement(Family.plug, 32),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kStageBackground,
      appBar: AppBar(
        backgroundColor: const Color(0xFF151F2A),
        foregroundColor: Colors.white,
        title: const Text(
          ',
  't_75be2e84': 's-algorithm, 3 פאות מוצללות). מגודר `kFittingEngine`.

import ',
  't_03fd2b52': '📦 סודוקו תלת-ממד — הקו זורם ב-6 כיוונים · הטי מסתעף לעומק',
  't_06397082': '\$free קצוות פנויים',
  't_71fdccb0': '\${_placed.length} אביזרים בקו',
  't_ee4b5d12': 's REAL mates (mapped to engine
  /// elements) when seeded, else the generic od-50 demo palette.
  late final List<RunElement> _candidates = _resolveCandidates();

  List<RunElement> _resolveCandidates() {
    final sp = widget.seedProduct;
    if (sp != null) {
      final mates = [
        for (final m in compatibleProductsFor(sp)) runElementFor(m),
      ].whereType<RunElement>().toList();
      if (mates.isNotEmpty) return mates;
    }
    return _kCandidates;
  }

  List<GridCell> get _cells => [
        for (final e in _placed.entries)
          GridCell(e.key.\$2, -e.key.\$1, 0, e.value),
      ];

  List<RunElement> get _suggestions {
    final a = _active;
    if (a == null) return const [];
    return gridSuggestionsAt(_cells, (a.\$2, -a.\$1, 0), _candidates);
  }

  void _tapEmpty(int r, int c) => setState(() => _active = (r, c));

  void _place(RunElement el) {
    final a = _active;
    if (a == null) return;
    setState(() {
      _placed[a] = el;
      _active = null;
    });
  }

  void _snack(String msg) => ScaffoldMessenger.of(context)
    ..clearSnackBars()
    ..showSnackBar(SnackBar(content: Text(msg), duration: const Duration(seconds: 2)));

  /// The placed fitting orthogonally adjacent to the active cell — the neighbour
  /// the suggestions must mate (drives the "מתחברות ל-…" header, screenshot #6).
  RunElement? get _activeNeighbour {
    final a = _active;
    if (a == null) return null;
    for (final e in _placed.entries) {
      if ((e.key.\$1 - a.\$1).abs() + (e.key.\$2 - a.\$2).abs() == 1) return e.value;
    }
    return null;
  }

  static String _odLabel(RunElement el) =>
      el.od2 != null ? ',
  't_9605ec77': 'אין אביזר שמתחבר לשכן כאן',
  't_01198a85': 'הקו: \${_placed.length} אביזרים · \${freeEndsOf(_cells).length} קצוות פנויים',
  't_b37094ab': 'הקש משבצת ריקה שכנה',
  't_cc71d283': 'נגעת במשבצת שמתחת ל־\${famEmoji(n.family)} \${n.family.label}',
  't_d8d8721a': 'קו סגור — אין קצוות פנויים',
  't_09688d57': '✅ השלם',
  't_92b5a718': '💡 הצעות שמתחברות ל־\${famEmoji(n.family)} \${n.family.label} \${n.od}',
  't_b596ed8d': '💡 מתחברים לשכן',
  't_a2a8cc35': '🔍 בדיקה',
  't_4c5731dd': '🔗 קו',
  't_81c1472d': '🧵 בניית הגריד',
  't_8c344274': 's
/// detail sheet via [storeOrderOpenProvider] (the store screen listens) —
/// navigate + open, no route push.
SearchSource orderSourceFor(WidgetRef ref) => (query, max) {
      final hits = <SearchResult>[];
      for (final o in ref.read(storeOrdersProvider)) {
        final s = scoreMatch(query, o.id);
        if (s <= 0) continue;
        final id = o.id;
        hits.add(
          SearchResult(
            kind: SearchResultKind.order,
            title: o.id,
            subtitle: o.stageLabel,
            score: s,
            run: (r, context) {
              r.read(mainTabProvider.notifier).state = 3; // חנות
              r.read(storeSectionProvider.notifier).state = StoreSection.orders;
              r.read(storeOrderOpenProvider.notifier).state = id;
            },
          ),
        );
      }
      hits.sort((a, b) => b.score.compareTo(a.score));
      return hits.length <= max ? hits : hits.sublist(0, max);
    };

/// NOTIFICATIONS — reads the live [activeNotifViewsProvider] at query time and
/// matches notification titles. Notifications have no per-item detail view, so a
/// tap navigates to the notification',
  't_84c034d5': 's notif chips use.
SearchSource notifSourceFor(WidgetRef ref) => (query, max) {
      final hits = <SearchResult>[];
      for (final n in ref.read(activeNotifViewsProvider)) {
        final s = scoreMatch(query, n.title);
        if (s <= 0) continue;
        final section = n.type;
        hits.add(
          SearchResult(
            kind: SearchResultKind.notification,
            title: n.title,
            score: s,
            run: (r, context) {
              r.read(mainTabProvider.notifier).state = 2; // עדכונים
              r.read(updatesSubTabProvider.notifier).state = 0; // התראות
              r.read(notifSectionProvider.notifier).state = section;
            },
          ),
        );
      }
      hits.sort((a, b) => b.score.compareTo(a.score));
      return hits.length <= max ? hits : hits.sublist(0, max);
    };

/// TASKS — reads the live [tasksProvider] at query time and matches task NAMES.
/// Tapping opens that task',
  't_31becf55': 's own verified [KbDestination.run] navigation closure verbatim.
///
/// Only STRONG matches (score >= 2 — exact / prefix / any-word-start) are kept.
/// A mere substring match (score 1) is too weak for a NAVIGATION target: e.g. the
/// one-letter query "ס" substring-hits the "מסך" keyword of the בית destination,
/// so "בית" would surface for "ס" and then, on tap, navigate to a tab you are
/// often already on — reading as a dead result. Products/chats/etc. keep score-1
/// substring hits (you',
  't_b2b8c28a': 's product open.
List<SearchResult> productSource(String query, int max) {
  final hits = <SearchResult>[];
  for (final p in kDivePool) {
    final s = scoreMatch(query, p.nameHe);
    if (s <= 0) continue;
    hits.add(
      SearchResult(
        kind: SearchResultKind.product,
        title: p.nameHe,
        subtitle: p.categoryHe,
        score: s,
        run: (ref, context) => showLipskeyProductSheet(
          context,
          p,
          kDivePool.where((x) => x.categoryHe == p.categoryHe).toList(),
        ),
      ),
    );
  }
  hits.sort((a, b) => b.score.compareTo(a.score));
  return hits.length <= max ? hits : hits.sublist(0, max);
}

/// CHATS — reads the live [visibleThreadsProvider] at query time (via the
/// captured [ref]) and matches thread names. Tapping opens the chat the SAME way
/// a conversation chip does: updates tab (2) + chats sub-tab (1) +
/// [updatesChatOpenProvider] = the thread id — no route push, live.
SearchSource chatSourceFor(WidgetRef ref) => (query, max) {
      final hits = <SearchResult>[];
      for (final t in ref.read(visibleThreadsProvider)) {
        final s = scoreMatch(query, t.name);
        if (s <= 0) continue;
        final id = t.id;
        hits.add(
          SearchResult(
            kind: SearchResultKind.chat,
            title: t.name,
            score: s,
            run: (r, context) {
              r.read(mainTabProvider.notifier).state = 2; // עדכונים
              r.read(updatesSubTabProvider.notifier).state = 1; // שיחות
              r.read(updatesChatOpenProvider.notifier).state = id;
            },
          ),
        );
      }
      hits.sort((a, b) => b.score.compareTo(a.score));
      return hits.length <= max ? hits : hits.sublist(0, max);
    };

/// ORDERS — reads the live [storeOrdersProvider] at query time and matches order
/// NUMBERS (`o.id`, e.g. "BS-1042"). Tapping navigates to the store',
  't_5305026d': ');

/// The fully-singular variant of [query] — EVERY plural word folded to its
/// singular (the noun can sit anywhere: "ברזים 16" or "16 ברזים" or "צינורות
/// פקסגול"). Returns an empty list when nothing productive applies (already
/// singular, too short, blank) so the caller cleanly skips the rescue. Sizes and
/// non-plural words pass through untouched. Deterministic; never returns [query]
/// itself.
List<String> hebrewSearchVariants(String query) {
  final q = query.trim();
  if (q.isEmpty) return const [];
  var changed = false;
  final singular = <String>[];
  for (final w in q.split(_ws)) {
    // The two productive masculine/feminine plural suffixes. Guard on length so a
    // short word like "מים" (water — length 3) is never gutted to a stub.
    if (w.length >= 4 && (w.endsWith(',
  't_d0d01b16': 's head word back into its singular so the
// literal search still lands.
//
// RESCUE-ONLY by contract: the caller tries these variants ONLY after the literal
// query has already returned zero results, so an over-eager singular can never
// bury or reorder a real match — the worst case is that a variant also finds
// nothing. That safety is why this can stay deliberately simple (just the two
// productive plural suffixes + final-letter restoration) instead of a full
// morphological analyser. Pure + deterministic → directly unit-testable.

/// Non-final Hebrew letter → its word-FINAL form. Stripping a plural suffix
/// exposes a letter that must take its final shape to match the singular in the
/// catalog ("אטמים" → strip "ים" → "אטמ" → restore → "אטם").
const Map<String, String> _finalForm = {
  ',
  't_072c12f6': 'ות',
  't_62b73a60': 'ך',
  't_c1583b47': 'ם',
  't_d3d11da3': 'ף',
  't_a604395c': 'פ',
  't_77741c97': 'ץ',
  't_13567a9b': 'צ',
  't_8ee2611c': ' — so numeric sizes ("1/2") and
/// Hebrew abbreviations ("ש״ת", "ח.פ.") stay ONE token instead of shredding.
final RegExp _sep = RegExp(r',
  't_39dac466': 's ENDS only (internal kept, so "ש״ת" and
/// "ח.פ" survive): period · asterisk · hash · quote · apostrophe · geresh ·
/// gershayim. Kills junk chips like "מס." · "*עם" · a dangling inch-mark.
const String _edge = ',
  't_86938c2a': 's own information-gain engine
// ([cardKeyboardPredictions] → [offerQuestion]); these helpers add the CROSS-
// DOMAIN half — next-words from the titles of the OTHER domains the query matches.
//
// NO-DEAD-END, PROVEN BY CONSTRUCTION: the keyboard appends a tapped word with a
// space (`"\$query "` → `"\$query \$tok"`), and the results panel matches an entity
// title by CONTIGUOUS substring. So a cross-domain suggestion is safe ONLY if it
// is the word that IMMEDIATELY FOLLOWS the query in a matching title — then
// `"\$query \$tok"` is itself a substring of that title and the panel keeps ≥1
// result. [crossDomainNextTokens] offers exactly those successor words (adversarial
// swarm HIGH finding: a frequency-only picker dead-ended "אברהם"→"משה" because
// names read first-last, never reversed). Ranked by how many titles share the
// continuation (most common next word first).
//
// PURE: no widgets, no providers, nothing from lib/screens — directly unit-
// testable, in the spirit of dive_pool.dart / word_lexicon.dart.
// ─────────────────────────────────────────────────────────────────────────────
library;

/// Token separators: whitespace · comma · middle-dot · parentheses · hyphen and
/// en/em dashes. Deliberately NOT ',
  't_b8397179': '׳״',
  't_e3bbb29c': ');

/// Every query variant produced by swapping ONE slang token for a real catalog
/// word — one variant per (slang token × its canonical), other tokens untouched
/// ("אלבו 1/2" → "ברך 1/2", "זווית 1/2"). Empty when the query holds no slang.
/// The caller (dive rescue) unions the matches, so all the real synonyms surface
/// together. Latin loan-words match case-insensitively. Deterministic.
List<String> slangVariants(String query) {
  final q = query.trim();
  if (q.isEmpty) return const [];
  final out = <String>[];
  // (1) Multi-word inch-size phrases: swap the whole colloquialism as a substring
  // ("ברז חצי צול" → "ברז 1/2"), so the size finds the catalog',
  't_3d0b3c5f': '6 צול',
  't_78b8a36d': 's own words. A tradesman asks for an "אלבו", a "רקורד", a "בול" —
// slang and foreign loan-words the catalog never uses (it says ברך, מחבר, ברז
// כדורי). Without help those queries find NOTHING. This maps each such term to the
// REAL catalog word(s) so the search still lands.
//
// VERIFIED, not invented (אין המצאות): every entry below was checked against the
// live catalog — the KEY finds zero products literally (so a rescue actually
// fires), and each VALUE is a word that DOES appear in real product names
// (`test/features/global_search/_slang_verify_dump` produced the counts:
// מחבר 205 · ברך 182 · מצמד 183 · מעבר 28 · אוגן 22 · ניפל 12 · ברז כדורי 46 …).
// Terms whose only target was empty (וסת, פטם) or dangerously broad (שוחה→תא) were
// dropped rather than guessed.
//
// RESCUE-ONLY by contract: [slangVariants] is tried by the dive ONLY after the
// literal query returned zero results, so expanding an ambiguous word (בול, צק)
// can never override a working search — the raw query already found nothing.
// Pure + deterministic.

/// Slang / loan-word → the catalog',
  't_d55c1622': 's technical|slang|English dictionary whose target has REAL products.
  //    Tool/sealant/adhesive rows (מפתח שוודי, טפלון, סיליקון, דבק) were dropped —
  //    no catalog product to point at (owner: "מה שאין מוצר לא צריך").
  ',
  't_e4628a87': 't already covered) and every target below is a real catalog
  //    word. Terms the owner offered that already hit (קו, שרשור, צוואר, מסנן,
  //    כיסוי, מכל, קונוס, כניסה, גלי) or were too generic (קופסת, סיט) were dropped.
  ',
  't_a70c4032': 't stock (טפלון, סיליקון, סיקא, פומפה, ונטוזה, שיער) were DROPPED — no
  //    product to point at, אין המצאות. Terms that already hit (מפצל, בנד, סוללה,
  //    ספירלה, קונוס) or are too generic (מוליך=conductor, כרטיס=card) were skipped.
  ',
  't_55050aae': 'אביק',
  't_82e4eb17': 'אגוז',
  't_502cdc83': 'אדפטר',
  't_a4b6245c': 'אוברפלואו',
  't_a43dfd90': 'אוכף',
  't_90bcf020': 'אורינג',
  't_23a6476c': 'אינטרפוץ',
  't_a3526547': 'אינלט',
  't_d2e7313e': 'אלבו',
  't_242485fc': 'אלבוב',
  't_ba4303fd': 'אקסטנשן',
  't_44dd2a9a': 'ארבעה צול',
  't_bb711583': 'באגה',
  't_0b64a9b6': 'בול',
  't_7f0ddf1c': 'בושינג',
  't_805ab214': 'גבקה',
  't_a70efc69': 'גומיה',
  't_32efea1d': 'גיבריט',
  't_3eba2f26': 'גיברית',
  't_b0bb2cbb': 'גריקן',
  't_93dd69f4': 'דיזה',
  't_c5832895': 'דריין',
  't_4c26b752': 'הארכה',
  't_d164ac86': 'הגבהה',
  't_7bdd16a0': 'ואלף',
  't_241098e7': 'וולב',
  't_3e0f9392': 'ווסת',
  't_e5494e6f': 'וידיה',
  't_74251766': 'זקף',
  't_b3a963e2': 'חונק',
  't_c86eb03d': 'חותך',
  't_b9dcb687': 'חנוכייה',
  't_9fa66b3d': 'חנוכיית',
  't_258767e4': 'חסכם',
  't_4dab3968': 'טאפ',
  't_6423651d': 'טאפא',
  't_e448815a': 'טאפה',
  't_c019b30a': 'טבעת',
  't_44719c0a': 'טוש',
  't_b417b389': 'טיפי',
  't_85c3291a': 'טנק',
  't_defd7805': 'כובע',
  't_246712a5': 'כוסית',
  't_f02f533f': 'כפה',
  't_cdf67f84': 'לוחץ',
  't_3eee8688': 'מאריך',
  't_dfe93de1': 'מבוא',
  't_8af8eaa7': 'מגוף',
  't_f267d494': 'מושפה',
  't_f9cfd5c7': 'מיקסר',
  't_271de78e': 'מנהול',
  't_b5217f87': 'מנומטר',
  't_e8a3cbf0': 'מניפולד',
  't_3f9a4b2f': 'מנקז',
  't_d02fa18e': 'מעדן',
  't_9637c437': 'מפתח',
  't_2efdf7df': 'מצמצם',
  't_f370b599': 'מצרף',
  't_0525ae67': 'מקדח',
  't_62614ed1': 'מקלחון',
  't_099729f2': 'מרזב',
  't_6eca5072': 'משחרר',
  't_8480ef8a': 'משפך',
  't_43f1a0c2': 'מתאם',
  't_13c89d71': 'מתלה',
  't_b3762673': 'סוללה',
  't_63dfcd5f': 'סטאב',
  't_aaceb15e': 'סטילסון',
  't_4cb5ef5a': 'סייפטי',
  't_f815853d': 'סליב',
  't_f894da84': 'סמוי',
  't_9d57e00a': 'ספרטור',
  't_fccbd292': 'סקרין',
  't_9b1115fb': 'פופאפ',
  't_e11fd544': 'פטמה',
  't_cb8d57ac': 'פטרייה',
  't_608afd1c': 'פיביסי',
  't_ccce19c6': 'פלאנג',
  't_92dc8d19': 'פלוטר',
  't_a1da30b5': 'פלנץ',
  't_a1c5ddfe': 'פלסטיק',
  't_f622bcb1': 'פנל',
  't_d409e1d1': 'פעמון',
  't_31076d1a': 'פרלטור',
  't_247e016a': 'פשתן',
  't_6d4e4af2': 'צק',
  't_9d025a6b': 'קאפ',
  't_9192a703': 'קוברה',
  't_9c0dd871': 'קולט',
  't_624e8d87': 'קולטן',
  't_bacd783e': 'קולקטור',
  't_2c2dfe21': 'קולר',
  't_9b13760c': 'קופלונג',
  't_ad463db4': 'קופסת',
  't_68ed8f52': 'קיט',
  't_33447943': 'קלינגרית',
  't_4eb6193d': 'קליפס',
  't_733c19bb': 'קלמזי',
  't_637a6123': 'קנט',
  't_7e548418': 'קפלר',
  't_57489add': 'קרטוש',
  't_642ae6e4': 'קרטרידג',
  't_d9062031': 'רבשכבתי',
  't_f586b60a': 'רדוקטור',
  't_f5062dc6': 'רוזטה',
  't_3690a650': 'רסטריקטור',
  't_23ed7895': 'שלושת רבעי צול',
  't_747fa00c': 'שלייף',
  't_a9c623f4': 'שני צול',
  't_9c3757e0': 'שעון',
  't_5595fb88': 'שפופרת',
  't_95161ba8': 'שקע',
  't_f0964cc0': 'שרוול',
  't_73abb1a3': 'שרול',
  't_39911c08': 'תא',
  't_c9529f59': 'תה',
  't_15733fd6': 'תוכי',
  't_e8c2a65d': 'תושבת',
  't_1739ce72': 'תותב',
  't_ef26d05e': 'תפס',
  't_906b302c': 're on can ("hot-water line" ⇒ its PEX couplers lead the moment you type
/// "מקשר"). [jobSkus] is [keyboardJobSkusProvider]',
  't_ae71821e': 's biggest single leak: a product whose name
/// IS the query (e.g. the generic "ברז") tied with ~100 products that merely
/// CONTAIN "ברז", so it was buried instead of leading. This rewards the literal
/// interpretation — an exact name, then a prefix, then how much of the name the
/// query covers (a short/generic name where the query is most of it). Each product
/// wins for ITS OWN name, so unlike a popularity prior this lifts the uniform
/// metric. Subordinate to [searchRelevance] (callers keep that primary).
int nameAffinity(LipskeyCatalogProduct p, String query) {
  final name = p.nameHe.trim().toLowerCase();
  final q = query.trim().toLowerCase();
  // Affinity is a NAME signal only — a product matched via its category/colour
  // (query absent from the name) gets none, so it never outranks a real name hit.
  if (q.isEmpty || name.isEmpty || !name.contains(q)) return 0;
  var s = 0;
  if (name == q) {
    s += 300; // the name IS the query — the strongest literal signal
  } else if (name.startsWith(q)) {
    s += 120; // the name STARTS with the query
  }
  // Coverage: the query as a fraction of the name — a short/generic name where
  // the query is most of it beats a long variant that merely embeds it.
  s += (q.length * 60 / name.length).round().clamp(0, 60);
  return s;
}

/// PURE. How PROMINENT [p] is, independent of the query — the tie-breaker that
/// pushes the product a user most likely means above equally-relevant matches.
/// Higher = more likely the intended early pick. Deterministic.
int productProminence(LipskeyCatalogProduct p) {
  var s = 0;
  // Showcased: the catalog cropped a real photo for it (the common, displayed
  // products — obscure variants have none).
  if (p.imageFile != null) s += 60;
  // Central / known-good: it has verified connection specs (the products the
  // engine trusts for compatibility — the backbone of the catalogue).
  if (kVerifiedSpecs.containsKey(p.sku)) s += 40;
  // Curated: part of the finder',
  't_67a820c7': 's verified compatible set ([compatibleProductsFor], memoised).
/// Compute ONCE per query from the cart / line the user is building, then feed
/// [matesBoost] per candidate (O(1) lookup). Empty context ⇒ empty ⇒ no effect.
Set<String> contextCompatibleSkus(Iterable<LipskeyCatalogProduct> context) => {
      for (final p in context)
        for (final q in compatibleProductsFor(p)) q.sku,
    };

/// PURE. The prediction boost for a candidate that physically CONNECTS to what
/// the user is ALREADY building — the signal ORTHOGONAL to the typed letters that
/// breaks the "re-ranking is zero-sum" wall (swarm finding #1). Once a ½" nipple
/// is in the cart, typing "ברז" should surface the faucets that actually FIT, not
/// a random 4 of ~100. [compatibleSkus] is [contextCompatibleSkus] of the
/// cart/line; membership is the strongest tie-break there is (verified geometry,
/// not a guess). Zero when the context is empty ⇒ byte-safe.
int matesBoost(LipskeyCatalogProduct candidate, Set<String> compatibleSkus) =>
    compatibleSkus.contains(candidate.sku) ? 400 : 0;

/// PURE. The keystroke-ZERO boost for a candidate that IS a product the OPEN JOB
/// needs (its own kit) — the signal that steers even the FIRST pick, on an empty
/// cart, before [matesBoost] has anything to mate against (swarm finding #2). From
/// the letters alone the keyboard can',
  't_00b90754': ' חזור · מק״ט מוטבע על התמונה · נגיעה=גלריה',
  't_bb6522df': ' מה מתחבר לצד \${toRight ? ',
  't_02c3b5cf': '\${kit.must} חובה',
  't_70456748': '\${kit.optional} אופציה',
  't_ecb1c0d4': '\${kit.tools} כלים',
  't_a761aea1': '),
                  behavior: HitTestBehavior.opaque,
                  onTap: onTapLine == null ? null : () => onTapLine!(i),
                  child: _lineCircle(
                    line[i].productEmoji,
                    line[i].productQty,
                    highlighted: i == hot,
                  ),
                ),
              // "+" — open the line-builder (grid) seeded from this product:
              // "בחר מוצרים לקו (מרובה)" + קו/בדיקה/השלם (screen #7 "+ פתוח").
              GestureDetector(
                key: const Key(',
  't_f6a7b1a6': '),
                controller: _ctrl,
                itemCount: widget.images.length + 1,
                onPageChanged: (i) => setState(() {
                  _page = i;
                  _scale = 1;
                  _zoom.value = Matrix4.identity();
                }),
                itemBuilder: (context, i) {
                  // The extra last page is the seeded 3D view (תלת-ממד).
                  if (i >= widget.images.length) {
                    final route = _galleryThreeDRoute(widget.product);
                    if (route.isEmpty) {
                      return Center(
                        child: Text(widget.product.typeEmoji,
                            style: const TextStyle(fontSize: 96)),
                      );
                    }
                    final panel = Container(
                      margin: const EdgeInsets.all(24),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: ProductLine3D(route: route),
                    );
                    // 🧊 line-builder (kFittingEngineIntel): the static gallery
                    // panel stays as-is when the intel layer is OFF (byte-
                    // identical); when ARMED, a tap opens the full interactive
                    // 3D (drag-rotate · pinch-zoom) of the SAME connected run.
                    if (!kFittingEngineIntel) return Center(child: panel);
                    return Center(
                      child: GestureDetector(
                        onTap: () => _openLine3d(route),
                        child: Stack(
                          alignment: Alignment.bottomCenter,
                          children: [
                            panel,
                            const Padding(
                              padding: EdgeInsets.only(bottom: 44),
                              child: Text(
                                ',
  't_37841384': '),
            behavior: HitTestBehavior.opaque,
            onTap: onPickVariant == null ? null : () => onPickVariant!(i),
            child: Padding(
              // Generous hit area — the dot itself is tiny.
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 7),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: i == sel ? 18 : 7,
                height: 7,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: i == sel ? _cAccent : _cLine,
                ),
              ),
            ),
          ),
      ],
    );
  }

  /// D3 — tap the image → a full-screen gallery of the product image(s) + the
  /// spec diagram(s), with pinch-zoom + page dots. Inert with no image.
  void _openGallery(BuildContext context, LipskeyCatalogProduct p) {
    final images = <String>[...p.imageAssets, ...p.specImageAssets];
    if (images.isEmpty) {
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        fullscreenDialog: true,
        builder: (_) => _InternalCardGallery(product: p, images: images),
      ),
    );
  }

  // ── section shell (6px top border · title row · body) ────────────────────────
  Widget _section({
    required String icon,
    required String title,
    required Widget child,
    String? count,
    bool warn = false,
  }) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: _cCard,
        border: Border(top: BorderSide(color: _cSecBorder, width: 6)),
      ),
      padding: const EdgeInsets.fromLTRB(13, 9, 13, 9),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 12)),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: warn ? _cWarn : _cAccentD,
                  ),
                ),
              ),
              if (count != null) _countBadge(count),
            ],
          ),
          const SizedBox(height: 4),
          DefaultTextStyle.merge(
            style: const TextStyle(
              fontSize: 11,
              color: _cBody,
              height: 1.55,
            ),
            child: child,
          ),
        ],
      ),
    );
  }

  Widget _countBadge(String text) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
        decoration: BoxDecoration(
          color: _cAccent,
          borderRadius: BorderRadius.circular(99),
        ),
        child: Text(
          text,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.w800,
          ),
        ),
      );

  Widget _miniChip(String text, {bool hot = false}) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        decoration: BoxDecoration(
          color: hot ? _cHotBg : _cImgBg,
          border: Border.all(color: hot ? _cHotBorder : _cLine),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 9.5,
            color: hot ? _cAccentD : const Color(0xFF5A636E),
            fontWeight: hot ? FontWeight.w800 : FontWeight.w400,
          ),
        ),
      );

  // ── 1 · הגדרה (wheels label) ─────────────────────────────────────────────────
  List<Widget> _configSection() => [
        _section(
          icon: ',
  't_02f3d170': '),
          mainAxisSize: fillHeight ? MainAxisSize.max : MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Green coaching-hint pill — full-screen card only (e_0/e_2/e_3).
            if (fillHeight) _hintBanner(),
            _topBar(context, p),
            // Full-screen: the hero (image / spec panel / rail) fills the slack;
            // each scrolls internally when it needs to. Embedded: shrink-wraps.
            if (fillHeight) Expanded(child: hero) else hero,
            _footer(p),
            _buyArea(context, ref, p, settings),
            // D6–D9/D14 — the line strip (circles + קו/בדיקה/השלם) appears ONLY
            // after a product is added; the base card is just image + add.
            _lineStrip(context, ref, p, settings),
          ],
        ),
      ),
    );
  }

  // ── green coaching-hint pill (e_0 · e_2 · e_3) ────────────────────────────────
  /// The soft-green hint bar at the very top of the FULL-SCREEN card — verbatim
  /// wording from the reference screens, swapped by state (hero · spec · rail).
  /// Arrows are Material icons (the reference',
  't_78146710': '),
        height: fillHeight ? null : 236,
        margin: const EdgeInsets.fromLTRB(12, 0, 12, 4),
        decoration: BoxDecoration(
          color: _cImgBg,
          borderRadius: BorderRadius.circular(14),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // The product image stays visible in the centre.
            Center(
              child: asset == null
                  ? Text(_heroEmoji(p), style: const TextStyle(fontSize: 88))
                  : Image(
                      image: resolveProductImage(asset),
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) =>
                          Text(_heroEmoji(p), style: const TextStyle(fontSize: 88)),
                    ),
            ),
            // The connection-point dot on the active side of the image.
            Positioned.fill(
              child: Align(
                alignment: railLeft
                    ? const Alignment(-0.35, 0)
                    : const Alignment(0.35, 0),
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.black.withValues(alpha: 0.28),
                  ),
                ),
              ),
            ),
            // Header label — shown ONLY on the embedded card. On the full-screen
            // card the green hint banner already says "מה מתחבר לצד …", so this
            // inner header would be redundant (e_0 shows only the top banner).
            if (!fillHeight)
              Positioned(
                top: 8,
                left: 8,
                right: 8,
                child: Text(
                  ',
  't_53e967ba': '),
      ];
    } else {
      // e_2: "מפרט · → חזור · מק״ט מוטבע על התמונה · נגיעה=גלריה"
      spans = const [
        TextSpan(text: ',
  't_6c45cde4': '),
      mainAxisSize: MainAxisSize.min,
      children: [
        // No header — the total lives on the green "אשר" button (screen #2).
        // A bare bold "+" (left, per "+ בשמאל") + the product circles.
        Padding(
          padding: const EdgeInsets.fromLTRB(13, 6, 13, 2),
          child: Wrap(
            spacing: 10,
            runSpacing: 8,
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              // RTL: last-added circle is rightmost, "+" ends up leftmost.
              for (var i = line.length - 1; i >= 0; i--)
                GestureDetector(
                  key: Key(',
  't_25ed6faa': '),
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(12, 6, 12, 0),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: _cHintBg,
        borderRadius: BorderRadius.circular(9),
      ),
      child: Text.rich(
        TextSpan(
          style: const TextStyle(
            color: _cHintInk,
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            height: 1.25,
          ),
          children: spans,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  // ── top bar (📋 spec toggle · SKU embossed · → next) ──────────────────────────
  Widget _topBar(BuildContext context, LipskeyCatalogProduct p) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Padding(
        // Full-screen: extra top inset so the SKU clears the always-on
        // "🟢 מחובר לשרת" connection pill that overlays the top of every screen.
        padding: EdgeInsets.fromLTRB(12, fillHeight ? 34 : 11, 12, 6),
        child: Row(
          children: [
            GestureDetector(
              key: const Key(',
  't_1555b032': ',
                                style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }
                  return InteractiveViewer(
                    transformationController: i == _page ? _zoom : null,
                    minScale: 1,
                    maxScale: 4,
                    onInteractionEnd: (_) => setState(() =>
                        _scale = _zoom.value.getMaxScaleOnAxis().clamp(1, 4)),
                    child: Center(
                      child: Image(
                        image: resolveProductImage(widget.images[i]),
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => Text(
                          widget.product.typeEmoji,
                          style: const TextStyle(fontSize: 96),
                        ),
                      ),
                    ),
                  );
                },
              ),
              // Side jumps (screen #7): מפרט (spec diagram, right) · תלת-ממד
              // (the 3D page, left).
              if (widget.product.specImageAssets.isNotEmpty)
                Positioned(
                  right: 8,
                  top: 0,
                  bottom: 0,
                  child: Center(
                    child: _galleryThumb(',
  't_a65f3714': ';

  /// D6 — how many of the selected unit to add (up/down swipe on the buy button).
  int _qty = 1;

  /// D6 — cycle the sale unit by a horizontal swipe on the buy button.
  void _stepUnit(int dir) {
    final keys = _current.saleUnits.keys.toList();
    if (keys.length < 2) return;
    final cur = keys.indexOf(_unit);
    final i = cur < 0 ? 0 : cur;
    setState(() => _unit = keys[(i + dir + keys.length) % keys.length]);
  }

  /// D6 — bump the quantity by a vertical swipe (up = +1, down = −1; min 1).
  void _stepQty(int delta) =>
      setState(() => _qty = (_qty + delta).clamp(1, 999));

  /// D8 — which line circle is highlighted (null ⇒ the last-added). Tapping a
  /// circle highlights it; tapping the already-highlighted one removes it
  /// (screen #2: "לחיצה על עיגול = מדגיש · לחיצה על המודגש = מסיר").
  int? _highlightLine;

  void _tapLineCircle(int index) {
    final line = ref.read(smartCartProvider);
    if (index < 0 || index >= line.length) return;
    final highlighted = _highlightLine ?? line.length - 1;
    if (index == highlighted) {
      ref.read(smartCartProvider.notifier).remove(index);
      setState(() => _highlightLine = null);
    } else {
      setState(() => _highlightLine = index);
    }
  }

  /// D15 — the spec is HIDDEN behind the 📋 clipboard; tapping it swaps the big
  /// product image for the spec panel in place (the card is image-first, not a
  /// text dump).
  late bool _specOpen = widget.initialSpecOpen;

  void _toggleSpec() => setState(() => _specOpen = !_specOpen);

  /// D15 — which spec tab is active (מפרט / תקן / אזהרה / חומר / טמפ׳).
  int _specTab = 0;

  void _pickSpecTab(int i) => setState(() => _specTab = i);

  /// D4 — which side',
  't_fcf85c34': ';

  final LipskeyCatalogProduct product;

  /// D4 — pre-open a side rail on first build (previews/tests): -1 left, +1 right.
  final int initialRailSide;

  /// D15 — pre-open the 📋 spec panel on first build (previews/tests).
  final bool initialSpecOpen;

  /// Full-screen mode — the card fills the whole screen (the hero image expands
  /// to take the slack, the buy area pins near the bottom) instead of shrink-
  /// wrapping. Off ⇒ the compact embedded card (home).
  final bool fillHeight;

  /// The top-bar → arrow goes back one screen. Null ⇒ the arrow is inert (the
  /// embedded home card has no route to pop).
  final VoidCallback? onBack;

  @override
  ConsumerState<FullInternalCard> createState() => _FullInternalCardState();
}

class _FullInternalCardState extends ConsumerState<FullInternalCard> {
  late LipskeyCatalogProduct _current = widget.product;

  @override
  void didUpdateWidget(FullInternalCard old) {
    super.didUpdateWidget(old);
    if (old.product.sku != widget.product.sku) {
      _current = widget.product;
    }
  }

  /// D5 — step the variant family by [dir], WRAPPING around the ends so every
  /// swipe changes the size (clamping left one swipe direction inert at the
  /// ends, which read as "broken"). The card re-resolves against the new SKU.
  void _stepVariant(int dir) {
    final fam = variantSiblingsOf(_current);
    if (fam.length < 2) {
      return;
    }
    final i = fam.indexWhere((s) => s.sku == _current.sku);
    final next = (i + dir + fam.length) % fam.length;
    if (next != i) {
      setState(() => _current = fam[next]);
    }
  }

  /// D5 — jump straight to variant [index] (tapping a size dot).
  void _pickVariant(int index) {
    final fam = variantSiblingsOf(_current);
    if (index < 0 || index >= fam.length || fam[index].sku == _current.sku) {
      return;
    }
    setState(() => _current = fam[index]);
  }

  /// D6 — the chosen sale unit (בודד / ארגז / משטח). Swipe-selected on the buy
  /// button (◀▶) — there is no visible unit-chip row.
  String _unit = ',
  't_7ef48f18': ';

// ── palette (exact card-max-internal hexes) ──────────────────────────────────
const Color _cCard = Color(0xFFFFFFFF);
const Color _cInk = Color(0xFF232A33);
const Color _cDim = Color(0xFF7A828D);
const Color _cLine = Color(0xFFE9ECF1);
const Color _cAccent = Color(0xFFEE6A2A);
const Color _cAccentD = Color(0xFFCF551B);
const Color _cImgBg = Color(0xFFF4F6F9);
const Color _cWarn = Color(0xFFC0392B);
const Color _cSecBorder = Color(0xFFE3E7EC);
const Color _cBody = Color(0xFF48505A);
const Color _cHotBg = Color(0xFFFFF2EA);
const Color _cHotBorder = Color(0xFFFFD6BD);
const Color _cGreen = Color(0xFF1F9D57); // D9 "אשר · סה״כ" confirm button
const Color _cHintBg = Color(0xFFE7F6EC); // green coaching-hint pill bg (e_2/e_3)
const Color _cHintInk = Color(0xFF1E874B); // green coaching-hint text

/// THE full internal card. Give it a [product]; it renders every section the
/// engine can populate for that product, and a swipe on the name cycles the
/// size-variant family (D5). Reusable (any fitting SKU); the home embed +
/// standalone route both seed it with the SmartLock elbow hero.
class FullInternalCard extends ConsumerStatefulWidget {
  const FullInternalCard({
    required this.product,
    this.initialRailSide = 0,
    this.initialSpecOpen = false,
    this.fillHeight = false,
    this.onBack,
    super.key,
  });

  /// The default hero — SmartLock ברך 90° 50 (real SKU; mockup',
  't_6eb7e24e': ';
    // Screen #2 — once THIS product is in the line the button turns GREEN
    // "✓ אשר · סה״כ <line-total>"; before, it',
  't_effa3ec0': ';
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // The swipe hint (◀▶ unit · ▲▼ qty) — only while still adding; once the
        // product is in the line the button becomes "אשר".
        if (!inLine)
          Padding(
            padding: const EdgeInsets.fromLTRB(13, 5, 13, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (units.length > 1) ...[
                  const Icon(Icons.swap_horiz, size: 12, color: _cDim),
                  const SizedBox(width: 2),
                  const Text(',
  't_2f88d5ad': 's
    // "90° · 50 מ״מ · …" ordering.
    final angleMatch = RegExp(r',
  't_503c1a2a': 's card (all section builders). The
/// stateful [FullInternalCard] above swaps [product] on a name-swipe.
class _CardView extends ConsumerWidget {
  const _CardView({
    required this.product,
    required this.unit,
    required this.specOpen,
    required this.specTab,
    required this.railSide,
    this.fillHeight = false,
    this.onBack,
    this.onStepVariant,
    this.onPickVariant,
    this.qty = 1,
    this.onCycleUnit,
    this.onStepQty,
    this.highlightLine,
    this.onTapLine,
    this.onToggleSpec,
    this.onPickSpecTab,
    this.onSwipeImage,
  });

  /// Full-screen mode — the hero area expands to fill the screen.
  final bool fillHeight;

  /// Back one screen (top-bar → arrow). Null ⇒ inert.
  final VoidCallback? onBack;

  final LipskeyCatalogProduct product;

  /// D6 — the selected sale-unit key (בודד / ארגז / משטח).
  final String unit;

  /// D15 — whether the 📋 spec panel is showing (in place of the big image).
  final bool specOpen;

  /// D15 — the active spec tab index.
  final int specTab;

  /// D5 — the name-swipe steps the variant family by ±1 (null ⇒ inert).
  final void Function(int dir)? onStepVariant;

  /// D5 — jump to a specific variant by tapping its size dot (null ⇒ inert).
  final void Function(int index)? onPickVariant;

  /// D6 — quantity of the selected unit to add.
  final int qty;

  /// D6 — cycle the sale unit (horizontal swipe on the buy button; null ⇒ inert).
  final void Function(int dir)? onCycleUnit;

  /// D6 — bump the quantity (vertical swipe on the buy button; null ⇒ inert).
  final void Function(int delta)? onStepQty;

  /// D8 — highlighted line-circle index (null ⇒ the last-added).
  final int? highlightLine;

  /// D8 — tap a line circle: highlight it, or remove it if already highlighted.
  final void Function(int index)? onTapLine;

  /// D15 — toggle the spec panel (null ⇒ inert).
  final VoidCallback? onToggleSpec;

  /// D15 — pick a spec tab (null ⇒ inert).
  final void Function(int index)? onPickSpecTab;

  /// D4 — which side',
  't_b59e0715': 's declared colour when it has one (e_2 shows
    // "שחור"); otherwise the brand keeps the slot. SmartLock carries no colour,
    // so we show "חוליות" rather than invent one.
    final colorOrBrand =
        (p.color != null && p.color!.isNotEmpty) ? p.color! : p.brand;
    final sub = <String>[
      if (angle.isNotEmpty) angle,
      if (dn.isNotEmpty) ',
  't_4dcd9fa4': 's own affordances do. Full-screen only, so the
  /// embedded home card stays uncluttered.
  Widget _hintBanner() {
    final List<InlineSpan> spans;
    if (specOpen) {
      // e_3: "נגיעה ב📋 (לא קופץ) — …"
      spans = const [
        TextSpan(
          text: ',
  't_cd912de6': 's תלת-ממד page: THIS product, welded into a complete connected
/// run. The product leads (its routing revealed so an elbow/tee shows its
/// turn/branch instead of hiding inline) and its real compatible mates close the
/// line — the assembler adds the transition-pipes + end-stubs. A terminator
/// (plug) trails the mates so it caps a real run rather than an empty stub.
/// Empty ⇒ untyped product ⇒ the caller shows the emoji.
List<RunElement> _galleryThreeDRoute(LipskeyCatalogProduct p) {
  final seed = runElementFor(p);
  if (seed == null) return const [];
  final star = _revealRouting(seed);
  final mates = [
    for (final m in compatibleProductsFor(p).take(2))
      if (runElementFor(m) case final RunElement e) e,
  ];
  // A plug terminates the assembler ⇒ put it last so the mates render first.
  return star.family == fm.Family.plug ? [...mates, star] : [star, ...mates];
}

/// Re-stamp a bending fitting so its geometry reads in the static gallery view:
/// an elbow/tee/saddle laid out inline (`Dir.right`) hides its turn behind the
/// pipe. Point it UP and the 90°/branch becomes unmistakable. Straight families
/// (coupler · reducer · valve · adapter · plug · collar) are unchanged.
RunElement _revealRouting(RunElement e) => switch (e.family) {
      fm.Family.elbow90 ||
      fm.Family.elbow45 ||
      fm.Family.miteredElbow ||
      fm.Family.tee ||
      fm.Family.saddle =>
        RunElement(e.family, e.od, dir: fm.Dir.up, od2: e.od2),
      _ => e,
    };

/// D3 — the tap-image gallery: a full-screen dark pager over the product
/// image(s), the spec diagram(s), and a seeded 3D page — each pinch/slider-
/// zoomable, with a ✕, page dots, a zoom slider, and מפרט/תלת-ממד side jumps. A
/// missing asset degrades to the big product emoji (never a broken box).
class _InternalCardGallery extends StatefulWidget {
  const _InternalCardGallery({required this.product, required this.images});

  final LipskeyCatalogProduct product;
  final List<String> images;

  @override
  State<_InternalCardGallery> createState() => _InternalCardGalleryState();
}

class _InternalCardGalleryState extends State<_InternalCardGallery> {
  final PageController _ctrl = PageController();
  final TransformationController _zoom = TransformationController();
  int _page = 0;
  double _scale = 1;

  @override
  void dispose() {
    _ctrl.dispose();
    _zoom.dispose();
    super.dispose();
  }

  void _jumpTo(int page) => _ctrl.animateToPage(
        page,
        duration: const Duration(milliseconds: 260),
        curve: Curves.easeOut,
      );

  /// 🧊 Open the interactive line-builder 3D full-screen (drag-rotate / pinch-
  /// zoom) over the SAME connected [route] the gallery panel shows. Only reached
  /// when `kFittingEngineIntel` is armed (the tap is not wired otherwise).
  void _openLine3d(List<RunElement> route) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        fullscreenDialog: true,
        builder: (ctx) => Scaffold(
          backgroundColor: kStageBackground,
          body: SafeArea(
            child: Stack(
              children: [
                Positioned.fill(child: FittingPreview3d(route: route)),
                Positioned(
                  top: 4,
                  left: 4,
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// A side-jump chip (מפרט / תלת-ממד) on the gallery edge.
  Widget _galleryThumb(String emoji, String label, VoidCallback onTap) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: Container(
        width: 54,
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white24,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                  color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xF0151F2A),
        body: SafeArea(
          child: Stack(
            children: [
              PageView.builder(
                key: const Key(',
  't_bdd67a77': 'אזהרות',
  't_7058670d': 'אין נתונים',
  't_4edc57cb': 'אין תואם ישיר',
  't_0e0a9643': 'במקום · טאבים למעבר',
  't_13ebb174': 'גלגלים',
  't_62cfc6eb': 'דרישות תקינות',
  't_ba5a7bbe': 'האחרון מודגש · הקש עיגול=בחירה · הקש מודגש=הסרה · +=הוספה',
  't_2f6999ef': 'הוראות-חיבור',
  't_d96d251e': 'החלק או הקש נקודה להחלפת מידה',
  't_584ce46d': 'הערכה לפי קטגוריה · \${formatCatalogPrice(base, s)}',
  't_dae530c2': 'הערכת מחיר',
  't_c37b1d46': 'טמפרטורה',
  't_7fa9e362': 'טמפ׳',
  't_30cd9c3c': 'יחידה',
  't_0924d121': 'מה מתחבר לצד ימין',
  't_41a6365c': 'מה מתחבר לצד שמאל',
  't_67e01218': 'מה שמתחבר למידה \$dn:',
  't_e8057823': 'מפרט',
  't_b67ddced': 'מפרט חומרים',
  't_ffea20f1': 'משיכה \${toRight ? ',
  't_d9a29395': 'מתחבר ל־',
  't_97229fc8': 'נוספו \$qty × \$unitKey לסל',
  't_a2ea0fff': 'סה״כ \${formatCatalogPrice(lineTotal, s)}',
  't_bfa5c584': 'סימון',
  't_7c14b1ca': 'עד \${spec.maxTempC.round()}°C',
  't_0edfdb0e': 'ערכת אביזרים',
  't_f357c111': 'קוטר · זווית · אורך · כמות',
  't_be22488c': 'שמאל',
  't_f672ba6b': 'שמאלה',
  't_b5157f6d': 'תלת-ממד',
  't_5d7a1094': 'תקן',
  't_b3c08c28': ', <String>[groupOf(p)]);

  // ── SIZE, split into the physical axes a plumber distinguishes — and the bore
  //    itself split by MEASURING SYSTEM (owner: inch / DN / mm never share a wheel).
  final diamInch = <String>{}; // ½" / ¾" / 2"
  final diamDn = <String>{}; //   DN40 / DN110
  final diamMm = <String>{}; //   250 מ"מ (shower heads etc.)
  final length = <String>{}; //   50 ס"מ / 3 מ׳ — how long
  final transition = <String>{}; // 16×½ / 20×¾ — a reducer',
  't_138165eb': 's [rdAxesOf] (8 axes: world/cat/type/size/angle/color/
// material/brand) and (1) SPLITS the single "size" axis into the distinct physical
// axes a plumber actually means — קוטר (diameter) · אורך (length) · מעבר
// (transition/reducer) — and (2) ADDS קבוצה · חדר · מין-חיבור · שיטה · תכולה.
//
// PURE + deterministic. Imported by nothing yet ⇒ inert (byte-identical) until a
// screen reads it.

import ',
  't_29575a4e': 's first
      // (and its top-12 before "עוד") are the ones people actually reach for.
      final c = counts[b]!.compareTo(counts[a]!);
      if (c != 0) return c;
      final ra = ord.indexOf(a);
      final rb = ord.indexOf(b);
      final x = (ra < 0 ? 999 : ra) - (rb < 0 ? 999 : rb);
      return x != 0 ? x : a.compareTo(b);
    });
}

/// ENGINE 1 — the "easy path" (info-gain). How much a single ring narrows the
/// pool: the Shannon entropy of [axis]',
  't_9babbe16': 'הברגה',
  't_93cfb7ff': 'הדבקה/הלחמה',
  't_921f1417': 'זכר',
  't_463d28e8': 'חדר',
  't_91a0fb85': 'ייעוד',
  't_5663e01a': 'נקבה',
  't_68bc1c61': 'עולם',
  't_f9b59b3a': 'קבוצה',
  't_c7343ef1': 'קוטר DN',
  't_7651e034': 'קוטר אינץ׳',
  't_3c249eae': 'קוטר מ"מ',
  't_99a7e44a': 'אביזרי נחושת — כל הסוגים',
  't_dd9890f0': 'אביזרי קופסאות ניקוז וריח',
  't_2e02ee1e': 'אביזרים משלימים למקלחון',
  't_2c3b04d9': 'אום סמארטלוק',
  't_70082253': 'אטמים, אומים ופקקים',
  't_c72b764b': 'אינטרפוצים',
  't_c6861daf': 'אסלות מונובלוק',
  't_a4d90c28': 'ארונות חנוכיית מים',
  't_9f1afebc': 'ברז NTM איטלקי',
  't_f23461fd': 'ברז ניל או כדורי של חברת NTM',
  't_8bf896f0': 'ברזי אל-חזור',
  't_5b5069b1': 'ברזי גן כבדים',
  't_dfd70cbe': 'ברזי כיור AQUATEC',
  't_cd6008e6': 'ברזי כיור אקווטק',
  't_685c639e': 'ברזי מטבח AQUATEC',
  't_6220b5bd': 'ברזי מיקסר למטבח אקווטק',
  't_248f1df8': 'ברזי מעבר כדוריים',
  't_07489b8a': 'ברזי מקלחון אקווטק',
  't_d323b7c9': 'ברזי מקלחת AQUATEC',
  't_cdf3caf0': 'ברזי שירות',
  't_0a89969f': 'ברכי מי גשם',
  't_28a3b860': 'ברכיים וזוויות',
  't_27a63592': 'ברכיים צד אחד חלק',
  't_06364a51': 'גומיות אטם',
  't_059ed6fe': 'זוויות',
  't_6035dec0': 'זוויות 45',
  't_c4188bfb': 'זוויות ומרזבים למי גשם',
  't_45598577': 'זוויות זכר-נקבה',
  't_2e484e76': 'זווית גמישה מתכווננת',
  't_ae8c0331': 'זווית מעבר',
  't_a99b589a': 'זווית מתארכת',
  't_7370be65': 'חבקי חיבור',
  't_dc17d33b': 'חבקי צינור (אומגה)',
  't_d1c0d49b': 'חלקי חילוף וגומיות לברזים',
  't_d999d602': 'חלקי חילוף לאסלות',
  't_931d0862': 'חנוכיות מים',
  't_02ab8b86': 'ידיות נגישות למקלחת',
  't_175f1df6': 'יחידות אסלה+כיור',
  't_9e797f43': 'יחידות משולבות',
  't_65429524': 'ים',
  't_1273d96b': 'כיסויים ורשתות',
  't_cbadac80': 'מוטות מתכת לראש דוש',
  't_cf4b87f9': 'מוטות פינוק',
  't_1aab71a6': 'מונובלוק (צמוד)',
  't_481a5875': 'מופה כפולה',
  't_fc36c420': 'מושב אסלה רגיל',
  't_a7bf683f': 'מחברי HDPE — כל הגדלים',
  't_3f3b042d': 'מחברי NTM — כל הגדלים',
  't_e125acc7': 'מחברי הברגה',
  't_cd9997c1': 'מחברי פלסטיק שחור',
  't_3b2b96c3': 'מחברי שקע',
  't_3046bbca': 'מחברים ומצמדי שקע',
  't_e02cf0a3': 'מחברים וצינורות',
  't_9ae5399c': 'מחברים ישרים',
  't_ac09c9dc': 'מחברים מותברגים',
  't_028863ca': 'מחברים מתאמים',
  't_8cacf836': 'מחברים קטנים',
  't_f0756fd0': 'מחלקים — יציאות מים',
  't_e401c042': 'מחסומי ריח',
  't_57bdcb23': 'מכסי ניקוז',
  't_280bf3a4': 'מכסים ורשתות לרצפה',
  't_b17bb89b': 'מלחמים',
  't_ab09a0f7': 'מנגנוני הדחה',
  't_e8de7458': 'מנגנוני הדחה לניאגרה',
  't_1efb356c': 'מספריים לחיתוך צינורות פלסטיק',
  't_24a19c0a': 'מפצלים',
  't_71eb7171': 'מפצלים וצינורות יציאה לאסלה',
  't_95f03801': 'מפתחות וכלי הברגה',
  't_5f0e6911': 'מפתחות צינורות',
  't_6cae789a': 'מצופי נחושת למכלים גדולים',
  't_1a73475f': 'מצופים וחלקים סניטריים',
  't_4d9f11b4': 'מצופים ומנגנונים לניאגרה',
  't_26b23f7a': 'מצופים נחושת',
  't_a0d88bb4': 'מרכזיות מים',
  't_8fb422ba': 'משאבות לחץ',
  't_879edf58': 'משפכים ואביזרים',
  't_8eef6837': 'משפכים וחלקי סינון',
  't_c5d3c545': 'מתאמים',
  't_03cabf7e': 'מתלים, סבוניות, נייר',
  't_6b70864a': 'ניאגרות גלויות גבוהות',
  't_55fdd886': 'ניאגרות גלויות נמוכות',
  't_38836bc2': 'סוללות',
  't_7ec99492': 'סיפונים לכיורים ולאמבטיות',
  't_fc9db9b9': 'סיפונים — כל הסוגים',
  't_e2e6eb17': 'סלנג טבעות.xlsx',
  't_8beefc35': 'ערכות חיבור ואטימה',
  't_6416bbaf': 'פילטרים לברזים',
  't_302d69fa': 'פלסטיק ירוק (PPR)',
  't_414c394e': 'פלסטיק שחור (HDPE)',
  't_11bd9bf7': 'פקקי סגירה',
  't_3c4496dd': 'פקקים',
  't_ca1f8a36': 'פקקים וחלקי צינור',
  't_7395884b': 'צווארונים ואוגנים',
  't_3b87149e': 'צינור הזנה',
  't_00e4de56': 'צינורות PVC',
  't_c85310fb': 'צינורות אספקת מים',
  't_7bff608e': 'צינורות ביוב אפורים',
  't_ef279597': 'צינורות ביוב אקוסטיים',
  't_91fa572f': 'צינורות הזנת מים',
  't_4c5afa8c': 'צינורות השקיה ואביזרי גינה',
  't_d87aaaf2': 'צינורות וציוד גן',
  't_86fdd334': 'צינורות חלקים',
  't_9b4692fe': 'צינורות ירוקים מחוזקים',
  't_51be27e0': 'צינורות מיזוג אוויר',
  't_d9a9766b': 'צינורות פיברגלס',
  't_fe9f5e1c': 'צינורות פייזר',
  't_49f70d1e': 'צינורות רב-שכבתיים',
  't_4e59d22d': 'צינורות שרשוריים',
  't_59cba770': 'צינורות שרשוריים לטוש ידני',
  't_4cbaaa8a': 'צנרת PP-MD-ML',
  't_b3cbc7f5': 'צנרת רב-שכבתית',
  't_91b7382d': 'קופסאות',
  't_c0d0dacb': 'קופסאות מחסום ריח לרצפה',
  't_6b90c2c7': 'קופסאות ניקוז רצפתיות',
  't_7269b982': 'קופסאות רצפה גלויות',
  't_ddd02746': 'קרש אסלה',
  't_bfde31fd': 'ראשי דוש',
  't_3a850bac': 'רב-שכבתי (מולטיגול)',
  't_6af3cdcb': 'רוכבים',
  't_fb772396': 'רשתות ניקוז לרצפה',
  't_b9ff5160': 'שיברים',
  't_f3f7f2eb': 'שלות אומגה',
  't_4a728678': 'שלות אומגה לקיר',
  't_bcc8240e': 'שלות עיגון',
  't_2d61ae82': 'שלות תליה',
  't_7bcac8dc': 'שסטומי אל-חזור',
  't_39012364': 'שפופרות מקלחת',
  't_57ab9b6d': 'תעלות מקלחת',
  't_e3235db4': 'תעלות ניקוז דקות',
  't_530243b7': 'תעלות ניקוז למקלחון',
  't_a406a002': '\${catOptsFor(id, _cons, matched, matched).length} אפשרויות',
  't_13b61ece': '\${kSmartProducts.length} מתכונים',
  't_5f221bea': ';

class CatalogWheelScreen extends StatefulWidget {
  const CatalogWheelScreen({super.key});

  @override
  State<CatalogWheelScreen> createState() => _CatalogWheelScreenState();
}

class _CatalogWheelScreenState extends State<CatalogWheelScreen> {
  /// Chosen constraints: axisId → value.
  final Map<String, String> _cons = <String, String>{};

  /// Constraint order, so back removes the most-recent pick.
  final List<String> _order = <String>[];

  /// The axis we are currently picking a VALUE for; null = the axis selector.
  String? _axis;

  /// The user asked to see the remaining products (the "📋 הצג" option).
  bool _showList = false;

  /// Which page of a long wheel is showing. Every wheel caps at [_cap] slots; when
  /// there are more options, the last slot is "עוד…" and tapping it advances one
  /// page (cycling back to the start), so a wheel is NEVER more than [_cap] items —
  /// the owner',
  't_47347c58': ';
              return Row(
                children: <Widget>[
                  if (trail.isNotEmpty)
                    Flexible(
                      child: Text(
                        trail,
                        maxLines: 1,
                        softWrap: false,
                        overflow: TextOverflow.fade,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  Text(leaf,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600)),
                ],
              );
            },
          ),
        ),
        body: SafeArea(child: _body()),
      ),
    );
  }

  Widget _wheel(List<String> labels, List<String> subs, String hint,
          ValueChanged<int> onSelect) =>
      Center(
        child: RingDiveWheel(
          labels: labels,
          sublabels: subs,
          hubHint: hint,
          onSelect: onSelect,
        ),
      );

  /// A wheel over [items], NEVER more than [_cap] slots. When there are more, the
  /// last slot is "עוד…" and tapping it pages forward (cycling back to the start),
  /// so the wheel stays ≤ [_cap] — instead of dumping the whole list onto one wheel.
  Widget _capped<T>(List<T> items, String Function(T) label, String hint,
      void Function(T) pick) {
    if (items.length <= _cap) {
      return _wheel(<String>[for (final it in items) label(it)],
          const <String>[], hint, (i) => pick(items[i]));
    }
    const per = _cap - 1; // 11 real options + 1 reserved "עוד…" slot
    final pages = (items.length + per - 1) ~/ per;
    final start = (_page % pages) * per;
    final end = start + per < items.length ? start + per : items.length;
    final slice = items.sublist(start, end);
    final labels = <String>[for (final it in slice) label(it), ',
  't_9b02d717': ';
    if (sig != _lastSig) {
      _lastSig = sig;
      _resetCollapse();
    }

    // ── ENGINE 3 — the JOB path (recipe kits) ──────────────────────────────────
    if (_jobMode) return _jobBody();

    final matched = catMatching(_cons);

    // "+N עוד" / "📋 הצג" → the full list. Checked BEFORE the value-wheel branch so
    // the gallery',
  't_88674576': 's "pick which wheel to start from" finder.
//
// Ring flow (a constraint engine, not a fixed tree — every door open):
//   1) AXIS wheel  — "ממה נתחיל?" — every axis that still splits the pool
//      (סוג · קוטר · אורך · מעבר · חומר · חדר · …). Spin, pick one.
//   2) VALUE wheel — that axis',
  't_3adcae56': 's COLLAPSED form: a compact 🎡 pill pinned at the top that names
  /// what the wheel is choosing ([hint], e.g. "איזה קוטר?"). Tapping it scrolls the
  /// gallery back to the top, which re-opens the full wheel.
  Widget _collapsedPill(String hint) => Align(
        alignment: Alignment.topCenter,
        child: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => _galScroll.animateTo(
                0,
                duration: const Duration(milliseconds: 260),
                curve: Curves.easeOut,
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF3E8),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0x33FF7A18)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Text(',
  't_df44624b': 's paging so the
  /// value wheel + its trailing "עוד…" stay within [_cap] slots.
  List<T> _pageOf<T>(List<T> items) {
    if (items.length <= _cap) return items;
    const per = _cap - 1;
    final pages = (items.length + per - 1) ~/ per;
    final start = (_page % pages) * per;
    final end = start + per < items.length ? start + per : items.length;
    return items.sublist(start, end);
  }

  /// A wheel with a LIVE product gallery beneath it. Spinning fires
  /// [RingDiveWheel.onFocusChanged] → [_focus]; only the gallery (a
  /// [ValueListenableBuilder]) rebuilds, showing [previewFor] of the focused
  /// index — the wheel keeps its own rotation untouched.
  Widget _wheelWithGallery({
    required List<String> labels,
    required List<String> subs,
    required String hint,
    required ValueChanged<int> onSelect,
    required List<CatProduct> Function(int) previewFor,
    required String Function(int) headline,
    bool livePreview = true,
  }) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Keep the dial at its natural 340px when the viewport has room; on a short
        // / landscape / split viewport shrink it (reserving room for the gallery) so
        // the Column never overflows + zeroes the gallery below it. FittedBox routes
        // hit-testing through its transform, so the wheel',
  't_f90984d4': 's products in real time — and ONLY the
  /// gallery rebuilds on a spin, never the wheel itself.
  final ValueNotifier<int> _focus = ValueNotifier<int>(0);

  /// Max thumbnails in the live gallery before a trailing "+N" tile (which opens
  /// the full list) — so the grid never tries to lay out thousands of images.
  static const int _galCap = 24;

  /// The exact product set the "+N עוד" tile counted, so tapping it opens THAT set
  /// even on the value wheel (where a bare _showList was swallowed by the _axis
  /// early-return). Null → the current [_cons] match.
  List<CatProduct>? _listSet;

  /// Debounces the live gallery preview so a fast spin only previews the value the
  /// wheel SETTLES on, not every crossed detent (which churned CDN fetches + janked
  /// the spin). The wheel',
  't_278889f1': 'איזה \${_ax(axisId).label}?',
  't_c916aa9f': 'איזו עבודה תעשה?',
  't_8af85533': 'בחר את המדויק · \${products.length} מוצרים',
  't_67bceeaa': 'הערכה המלאה · \${lines.length} חלקים',
  't_b753aa40': 'לבחירה ידנית',
  't_f346ed4a': 'לפי מה עוד?',
  't_8c53bf05': 'ממה נתחיל?',
  't_a4354f66': 'צירים נוספים',
  't_e4039b8e': 'תצוגה מקדימה · \${_ax(axisId).label}: \${catValueLabel(axisId, shown[f])}',
  't_5d434af5': '📋 הצג \${matched.length}',
  't_70f88523': '🔧 לפי עבודה',
  't_470f9ca8': ' LAST so a big single-caliber family (46 PPR ½" fittings) still splits by
/// kind (ברכיים / מסעפים / מתאמים) instead of dumping one long list.
const List<String> _narrowAxes = <String>[
  ',
  't_49e135b4': ',
];

/// Inch sizes → the spoken word, so rings 4+ stay in plain language ("חצי צול"
/// not ',
  't_01f29a90': '2 ו-3/8 צול',
  't_3b024707': '2 וחצי צול',
  't_704f68ea': '2 צול · 50מ"מ',
  't_bb951da2': '200 מ"מ',
  't_7e65fb06': '3 צול',
  't_6203186b': '3/4 צול · 20מ"מ',
  't_9d48c72b': '3/8 צול',
  't_c0ca9f19': '4 צול · 110מ"מ',
  't_86de352c': '6 צול · 160מ"מ',
  't_08853db7': 's OWN size vocabulary: it dedups
      // cm/meter twins (15 ס"מ ≡ 0.15 מ׳ → one chip), groups families (no inch
      // mixed with DN), and orders each family small→large — none of which the raw
      // rdAxesOf set does. plainFilterBy mirrors it via productHasChip.
      final toks = sizeTokensIn(products);
      // Offer size ONLY when every product carries a size chip — otherwise a
      // size-less product would be dropped by the pick and never reach a final
      // list. When some lack a size we skip to the next axis (',
  't_688c27ec': 's angle ring ("איזו זווית?") splits 45°/90°
  // natively, so a separate "ברך 45" leaf would just duplicate a subset and the
  // "ברך 90" header would sit over 45° products.
  PlainNode(superCat: ',
  't_1c81c462': 's dictionary (מעודכן.xlsx); products attach to each leaf
// through the SAME bilingual+slang search the catalog uses (catalogProductMatchesQuery),
// so a node "reaches products" for real — not a dead label. Nodes that reach NO
// product (tools/sealants the catalog doesn',
  't_e2cb2109': 's dictionary: its place in the tree (superCat →
/// classification → technical), plus the layman label (slang) + English + usage.
class PlainNode {
  const PlainNode({
    required this.superCat,
    required this.classification,
    required this.technical,
    required this.slang,
    required this.english,
    required this.usage,
    this.categoriesExact,
  });

  final String superCat; // ring 1
  final String classification; // ring 2
  final String technical; // ring 3 (the query that reaches products)
  final String slang; // ring 3 label — the everyday word
  final String english;
  final String usage; // "what it does / where it goes"

  /// When set, this leaf reaches products by EXACT catalog category membership
  /// (p.categoryHe ∈ categoriesExact) instead of the [technical] search — used by
  /// the coverage nodes (curated + auto-fallback) so every category is reachable.
  /// A list because several catalog categories can share one plain word (all the
  /// drain-pipe categories → "צינור ניקוז").
  final List<String>? categoriesExact;
}

/// The owner',
  't_fc762f6e': 'איזה חומר?',
  't_23e2a572': 'איזו זווית?',
  't_3dfdd49e': 'אל-חוזר',
  't_d8ce37a5': 'אסלה / מונובלוק',
  't_9242c0ba': 'אסלות וקווים ראשיים',
  't_b7fb4041': 'בחר',
  't_bab3799c': 'ברז ניל',
  't_d91bef96': 'ברז עומד לכיור',
  't_6bc5f5bb': 'ברז פינתי מתחת לכיור/אסלה',
  't_d5e9d46e': 'ברז פרח',
  't_28f13244': 'ברז ראשי (פתיחה/סגירה)',
  't_9f6a187b': 'הברגות',
  't_a40a1279': 'הורדת מים בניאגרה',
  't_83c93597': 'הזנה ראשית למקלחת/מטבח',
  't_8fa38114': 'התקנה רצפתית/תלויה',
  't_e49daee9': 'זכר-זכר לחיבור אביזרים',
  't_baab234b': 'חיבור בין שני צינורות',
  't_f16a3fb8': 'חיבור מתפרק ללא סיבוב צינור',
  't_a8967c16': 'חיבור ניקוז גמיש',
  't_957cc316': 'חצי צול · 16מ"מ',
  't_a5a3f890': 'כיורי רחצה',
  't_a23c31b4': 'מונע ריח מהביוב',
  't_c4757ca1': 'מחבר ישר',
  't_6ad435c6': 'מחבר פירוק',
  't_1e728579': 'מטבח, כביסה, מדיח',
  't_72e2a696': 'מניעת זרימה חוזרת',
  't_f46572c5': 'מעבר מהברגה גדולה לקטנה',
  't_98265aa2': 'מעבר קוטר בצינור',
  't_3790eb4c': 'מצוף ניאגרה',
  't_8aa3be76': 'מתאם הברגה',
  't_0810b40c': 'ניקוז רצפה, קופסאות ריח',
  't_0393e21e': 'ניקוז רצפתי',
  't_def9ca08': 'סגירת נקודה',
  't_dd86d645': 'פייזר/פולירול',
  't_b4661f6d': 'פיצול קו ל-3 כיוונים',
  't_f939f669': 'פעמון / מנגנון',
  't_759b0036': 'פקק / טאפה',
  't_4beb4eb0': 'צול',
  't_79e4cfef': 'צול וחצי · 40מ"מ',
  't_70a76cbc': 'צול ורבע · 32מ"מ',
  't_0ddc1f0a': 'צינור קצר',
  't_59c94dc7': 'צנרת גמישה',
  't_d8c653c2': 'צנרת ירוקה (הלחמה)',
  't_f013a104': 'צנרת ניקוז',
  't_1a2a852f': 'צנרת פקסגול/מולטיגול (ביתית)',
  't_009d2f0e': 'צנרת קשיחה',
  't_da020202': 'קו ביוב ראשי בחצר',
  't_ca47a7ec': 'קופסת ריח',
  't_d3feb024': 'קטגוריות נוספות',
  't_72b5c5cf': 'רבע צול',
  't_61515ecc': 'רדוקציה / מקטין',
  't_da82bcc2': 'שינוי כיוון בצנרת',
  't_cbaf3896': 'שליטה במילוי מים',
  't_72a89f47': 'שרשורי',
  't_566a4229': 'אביזרים לתלייה בחדר האמבטיה',
  't_10afae9c': 'אומים ואטמים',
  't_4639cd18': 'אחיזה בטוחה במקלחת',
  't_304dea5e': 'אטמים ואומים',
  't_e85b531b': 'אטמים ואומים לחיבורים',
  't_0c2d62d5': 'איסוף ניקוז מתחת לרצפה',
  't_49b5e8f8': 'ארון לצנרת מחלק המים',
  't_3332d65a': 'ארון מחלק',
  't_36556b10': 'בקרת לחץ',
  't_104501a6': 'ברז אמבטיה',
  't_eb3e2ffd': 'ברז גן',
  't_42227a64': 'ברז דלי',
  't_6f308c7c': 'ברז ומזלף לאמבטיה',
  't_7da25e4a': 'ברז ומזלף למקלחת',
  't_13bd0c18': 'ברז וראש מקלחת יחד',
  't_e13d405d': 'ברז לכיור אמבטיה מהקיר',
  't_54fb4d35': 'ברז מטבח',
  't_523713fc': 'ברז מים בחצר',
  't_71cf1e00': 'ברז מקלחת',
  't_742ee1f5': 'ברז קיר',
  't_5b8c0393': 'ברזי אמבטיה ומקלחת',
  't_70967f48': 'ברזים כלליים',
  't_13af1513': 'גינה והשקיה',
  't_8e80f632': 'הגבהה לניקוז',
  't_421b0c22': 'הראש הגדול של המקלחת',
  't_d187e20b': 'זרוע מקלחת',
  't_2563f02f': 'חבקים ותליה',
  't_8151fdc9': 'חיבור לצינורות ביוב',
  't_6055e4f0': 'חיבור מים גמיש',
  't_d7ff1a5a': 'חיבור נחושת',
  't_47973048': 'חיבורי נחושת',
  't_a26d0326': 'חיבורי ניקוז',
  't_66e25564': 'חלקי חילוף',
  't_a10cdc56': 'ידית אחיזה',
  't_d5ca0006': 'יציאת המים בברז',
  't_045de870': 'יציאת מים בקיר עם מתלה',
  't_f023f66e': 'להגביה ניקוז לגובה האריח',
  't_1bbfa8d7': 'להשקיה בגינה',
  't_fbed10ad': 'לחבר שני צינורות ניקוז',
  't_0560d4ac': 'לחיבור צינורות מים מפלסטיק',
  't_4f925e73': 'לחיבור צינורות נחושת',
  't_bd6fd95d': 'לחיבור צינורות פלסטיק',
  't_eb4c2cdf': 'לכיור המטבח',
  't_046a14b1': 'לתלות מגבות באמבטיה',
  't_576adfb9': 'לתלות צינור על הקיר',
  't_b3a73e94': 'מאסף רצפה',
  't_0e4f8d03': 'מאספי ניקוז',
  't_6903cd84': 'מהדק חיבור בצנרת',
  't_ad2df7f7': 'מווסת לחץ מים בבית',
  't_5a4968c2': 'מונע חזרת ביוב',
  't_4991a483': 'מותקן על הכיור',
  't_77b9d954': 'מזלף יד למקלחת',
  't_eadd1c7b': 'מחבר ביוב',
  't_371a4423': 'מחבר למזלף המקלחת',
  't_12bccc60': 'מחבר לצינור',
  't_9c0c030e': 'מחבר צינורות בזווית',
  't_abc2298e': 'מחבר שחור',
  't_2d896ab0': 'מחבר שני צינורות',
  't_bbf44856': 'מחברי צנרת פלסטיק',
  't_9c52e9d2': 'מחברים ומצמדים',
  't_feee5861': 'מחזיקה את ראש המקלחת',
  't_6e968303': 'מחלק מים',
  't_7ea91261': 'מחלק קווי מים בבית',
  't_aa665c86': 'מחלקי מים',
  't_0f61bc53': 'מיכל הדחה מונובלוק',
  't_af4742bf': 'מיכל הדחה נמוך',
  't_d9c0f1cf': 'מיכל הדחה נמוך לאסלה',
  't_dc704b01': 'מיכל הדחה על האסלה',
  't_65f1ed49': 'מיכל מים גבוה לאסלה',
  't_d2ab02bb': 'מיכלי הדחה',
  't_0b5f6b6c': 'מילוי דלי במרפסת שירות',
  't_04f34fe3': 'מכסה למחסום רצפה',
  't_be00edcf': 'מכסה לפתח ניקוז ברצפה',
  't_6fad1f56': 'מכסה ניקוז',
  't_04e32051': 'מכסים ורשתות ניקוז',
  't_d60691e7': 'מסעפים ומצמדים',
  't_51481b90': 'מערכת אמבטיה',
  't_8f29c014': 'מפצל מים בין ראש למזלף',
  't_95da00a9': 'מפצל מקלחת',
  't_835309ac': 'מצמדים ומחברים',
  't_2c2de381': 'מתחת לכיור, מנקז מים',
  't_32d53298': 'מתלה מגבת',
  't_653a0389': 'ניאגרה גבוהה',
  't_f6e0eb4f': 'ניקוז ברצפת חדר רחצה',
  't_74059b4a': 'ניקוז מקלחת',
  't_0eb59c3b': 'ניקוז מתחת לאמבטיה',
  't_abab2e08': 'ניקוז קווי לרצפת מקלחת',
  't_84d5b73f': 'ניקוז רצפה גלוי',
  't_9eb97a84': 'ניקוז רצפת המקלחת',
  't_46831436': 'נקודת מים',
  't_221017c6': 'סט אביזרים לאמבטיה',
  't_00c0e8c6': 'סיפון אמבטיה',
  't_6d25d043': 'עוגנים וחבקים',
  't_1e2f6c3a': 'ערכת תיקון ברז',
  't_0a6e03ca': 'פותח וסוגר מים',
  't_f35430e1': 'פיה לברז',
  't_19137983': 'פיה לברז ולמילוי אמבטיה',
  't_2b1e2360': 'פיות ברז',
  't_ea765860': 'פיות לברז',
  't_ea50b9cf': 'פיצול בצינור ניקוז',
  't_d983254d': 'צינור ביוב חיצוני',
  't_757ee7c3': 'צינור ביוב שקט',
  't_9bfca1f6': 'צינור גינה',
  't_a9532e4e': 'צינור גמיש',
  't_25f34099': 'צינור כתום',
  't_da51e1c2': 'צינור לניקוז וביוב',
  't_e0bec824': 'צינור מקלחת',
  't_e7114a68': 'צינור שחור',
  't_b2c0095f': 'צינורות גינה',
  't_fc5aea17': 'קיבוע נקודות מים בקיר',
  't_4b123543': 'שסתומי אל-חזור',
  't_c298a0ee': 'תיקון ברז דולף',
  't_bf184b0c': 'תעלת ניקוז',
  't_b28ae3b2': 'בחר את המדויק · \${products.length} אפשרויות',
  't_ae00a99f': '16 מ"מ',
  't_68f223e6': 'ישר',
  't_c53db84d': '
    show kProfileAxisDive, kProfilePlainDive;

/// Feature-flag name for the RingDive rotary product-finder (צלילת-טבעות).
///
/// RingDive is a NEW PRESENTATION of the SAME unified drill-down the smart
/// keyboard renders (`card_engine.dart`) — the axis options ride a spinning
/// knurled dial instead of a prediction row. A screen that drives it self-gates
/// on this name via `ref.watch(featureFlagsProvider).contains(kRingDiveFlag)`,
/// mirroring `kWordFinderFlag` / `kCardKeyboardFlag` exactly.
///
/// OFF by default (no operator `enable`, no demo define) → the dial renders
/// nothing (a zero-height `SizedBox.shrink`) and the live app is byte-identical.
/// The owner-gated cut-over is what eventually turns it on (see BUILD-PLAN.md).
const String kRingDiveFlag = ',
  't_ee940b8e': ' : s;

  /// The current wheel page of [items]: up to 11 entries + an "עוד…" pager key
  /// when there are >12, so the rim never overflows. `hasMore` says whether to
  /// add the pager; `pageLabel` is its sublabel.
  ({List<T> slice, bool hasMore, String pageLabel}) _pageSlice<T>(
    List<T> items,
  ) {
    const per = 11;
    if (items.length <= 12) {
      return (slice: items, hasMore: false, pageLabel: ',
  't_b138e3de': '\$_qty יחידות',
  't_deac5155': ',
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: _kSub,
            ),
          ),
        ],
      ),
    );
  }

  // ── "סנן לפי" axis switcher ─────────────────────────────────────────────────

  Widget _axisStrip(List<String> fields, String? active) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(22, 12, 22, 0),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        reverse: true,
        child: Row(
          children: [
            const Text(
              ',
  't_d029e07b': ';
      _axisField = validAxis ? axis : null;
      _path.clear();
      _origin = null;
      _product = null;
      _qty = null;
      _added = false;
      _jobKey = null;
      _kitBrand = null;
      _kitAdded = false;
    });
  }

  void _dive(String field, String value) {
    setState(() {
      _page = 0;
      _path.add((field: field, value: value));
      final axes = rdFindAxes(_cons);
      _axisField = axes.isNotEmpty ? axes.first : null;
    });
  }

  /// Jump the active axis to [field] (the "סנן לפי" switcher) without diving.
  void _switchAxis(String field) {
    HapticFeedback.selectionClick();
    setState(() {
      _axisField = field;
      _page = 0;
    });
  }

  void _pickProduct(LipskeyCatalogProduct p) {
    _qtyLive.value = 1;
    setState(() => _product = p);
  }

  void _backTo(int level) {
    setState(() {
      _page = 0;
      _path.removeRange(level, _path.length);
      _product = null;
      _qty = null;
      _added = false;
      final axes = rdFindAxes(_cons);
      _axisField = axes.isNotEmpty ? axes.first : null;
    });
  }

  void _reset() {
    setState(() {
      _mode = ',
  't_be26fead': 's focus on tap.
  LipskeyCatalogProduct? _origin;
  List<LipskeyCatalogProduct> _compatLeaves = const <LipskeyCatalogProduct>[];

  /// The current wheel page. Any option set with >12 entries paginates (11 +
  /// "עוד…") so the rim never overflows; reset to 0 when the set changes.
  int _page = 0;

  /// The accumulating order — products (from the qty confirm) and kits (from a
  /// recipe). Persists across searches (NOT cleared on reset); NO price.
  final List<_CartItem> _cart = <_CartItem>[];

  /// `job` mode: the chosen recipe key (null = the recipe list is on the wheel),
  /// the chosen model within it (defaults to the recommended brand), and whether
  /// its kit has been added.
  String? _jobKey;
  SmartBrand? _kitBrand;
  bool _kitAdded = false;

  /// The live 0–99 quantity from the dual-ring, shown on the confirm bar. Kept
  /// off `setState` so a qty drag rebuilds only the ring + the confirm label,
  /// not the whole card.
  final ValueNotifier<int> _qtyLive = ValueNotifier<int>(1);

  @override
  void dispose() {
    _qtyLive.dispose();
    super.dispose();
  }

  /// The path as a constraint map for the derivation layer.
  RdCons get _cons => <String, String>{for (final s in _path) s.field: s.value};

  bool get _hasSelection => _mode != ',
  't_2c939d58': 'אביזרי נחושת — כל הסוגים 20 מ"מ',
  't_564d11bb': 'בחר \$label · או החלף סינון למעלה',
  't_5233d52d': 'בחר \$label · סובב את הגלגל',
  't_7ecf241b': 'בחר איך לחפש',
  't_95911b76': 'בחר איך למצוא את המוצר הראשון',
  't_78d90a90': 'בחר דגם',
  't_00494486': 'בחר מוצר · הקש על השם',
  't_5a548eaa': 'בחר עבודה',
  't_399e6dc6': 'בחר עבודה — נרכיב ערכה שלמה',
  't_c351d3ed': 'דגם נבחר · \${brand.name}',
  't_3b727500': 'דף \${pg + 1}/\$pages',
  't_51870bc7': 'ההזמנה שלי',
  't_2cff9d68': 'הוסף להזמנה',
  't_f190f731': 'הוסף לסל · × \$v',
  't_c0a19aff': 'הוסף לסל למטה',
  't_2c08a1f5': 'המשך בקנייה',
  't_d910121c': 'הערכה נוספה — חיפוש חדש?',
  't_78bed278': 'הערכה נוספה ✓',
  't_e7c01e3c': 'הקש לבחור מוצר',
  't_a7102dac': 'הקש להוספה',
  't_9febb540': 'התחל מ',
  't_2b387ae1': 'חיפוש חדש',
  't_14cbc778': 'כמות \$_qty',
  't_de1f73ec': 'מה מתחבר ל\${_origin!.nameHe}',
  't_eb3c6f60': 'מועמדים',
  't_e777349f': 'עבודה ✎',
  't_a760bd66': 'עבודות',
  't_2482a9ef': 'ערכה ל\${job.name} — בחר דגם והוסף',
  't_131918a4': 'פריט',
  't_8fff5c7d': 'רכיבי הערכה · \${job.acc.length}',
  't_cc949ab6': 'רכיבים',
  't_6d56cb2f': 'תואם',
  't_61537d3e': 'תואמים',
  't_52fdb370': '↺ מחדש',
  't_22344c22': '✓ הערכה נוספה לסל',
  't_3d2a75f0': '✓ נוסף לסל · מה עכשיו?',
  't_93c328d0': '🔗 מה מתחבר לזה',
  't_4973f7d0': '🛒 ההזמנה שלי · \$n \${n == 1 ? ',
  't_e984f989': '🧩 הוסף ערכה לסל',
  't_5d4f2f6a': '🧩 השלם ערכה',
  't_5ede37cb': '
    show normalizeQuery;

/// Everyday Hebrew filler the user wraps a request in ("אני צריך משהו ל…") that
/// carries no product signal. Dropped before the query reaches resolveQuery, so a
/// whole sentence narrows like its keywords would. WHOLE-TOKEN only — it never
/// strips a prefix (בזווית stays intact) and keeps meaningful verbs/nouns.
const Set<String> kAiFillerWords = {
  ',
  't_18fb9c08': 's 4th input. The user types a whole request ("אני צריך משהו אדום")
// and SUBMITS it; the dive seeds from the interpreted query. The DEFAULT is OFFLINE
// and pure (strip everyday Hebrew filler, then fold synonyms) — the contract',
  't_7d083f6d': 'איזה',
  't_d61cee77': 'אפשר',
  't_cd36f1dd': 'בבקשה',
  't_edbf99e3': 'הביא',
  't_081376f2': 'זה',
  't_f2c00785': 'חפש',
  't_1f70207b': 'יש',
  't_d7c85d31': 'כדי',
  't_d1f6c62c': 'לי',
  't_082dcd19': 'מצא',
  't_50c59b2f': 'משהו',
  't_720f6d0c': 'צריך',
  't_f3bb262f': 'צריכה',
  't_54245eee': 'רוצה',
  't_7ecff16d': 'תביא',
  't_31d3891f': 'תן',
  't_9dbfd4aa': 'אטמים ומצופים',
  't_db3dba4a': 'ברזים ושסתומים',
  't_fbee7499': 'ברך צד אחד חלק',
  't_4861ff94': 'הגבהות ורשתות',
  't_aa5613b2': 'וקר": ',
  't_c75b6e91': 'חיבורים ומחברים',
  't_4ab61e3a': 'מחלקים ונקודות מים',
  't_e79cb579': 'מכסים',
  't_cc43a200': 'ניקוז וסיפונים',
  't_d61abce0': 'סניטריים ושונות',
  't_237fb24d': 'ציוד וכלים',
  't_4e76087a': 'תליה והתקנה',
  't_1e452e29': '
    show colorOptions;

/// The real product colours in the catalog. Metal finishes (זהב / כרום / נחושת /
/// ניקל / נירוסטה …) are deliberately ABSENT — a finish, or the material itself,
/// is never a colour and belongs on the material axis.
const Set<String> kTrueColors = {
  ',
  't_e0c41737': 'גרפיטי',
  't_12dd4464': 'כתום',
  't_c4849be0': 'מט שחור',
  't_307cce69': 'שחור ירוק',
  't_ab31fd7f': '
    show quickLabel;

// ── Reversible display-format defaults (OWNER-REVIEW) ───────────────────────
//
// These three constants are the ONLY display-format choices in this file. They
// are reversible defaults the owner may reword/reorder without touching the
// distinction LOGIC.

/// OWNER-REVIEW: the separator between the base word and a distinguishing
/// suffix (e.g. `ברז שחור`). A single space reads as plain language; change it
/// to ',
  't_c0bb833a': '`. The key order is therefore both
///   the precedence order (a product matching two materials takes the earlier
///   key) AND the display order the UI offers. כרום is a FINISH, not a material,
///   so it is intentionally absent; PVC/מולטיגול carry zero products in the pool,
///   so they are omitted too. HDPE was ADDED 19/6 (120 products) — the #14 scout
///   searched ',
  't_22af7d9c': 's ניפל?".
///   A product',
  't_faab2967': 't substitutes.
/// Returns a deduped set; the family tag lets the chooser keep family-
/// coherent ordering (no inch interleaved with cm).
List<SizeToken> productSizeTokens(LipskeyCatalogProduct p) {
  final out = <SizeToken>{...parseSizeTokens(p.nameHe)};
  final d = p.dims;
  if (d != null) out.addAll(tokensFromDims(d));
  return out.toList();
}

/// Sorted, deduped chip list for the pool. Keeps every family the pool
/// surfaces (mm + cm, inch + DN, …) but groups them so the row reads
/// coherently: all mm in numeric order, THEN all cm in numeric order — never
/// `200 · 25 · 250 · 30` interleaved. Length equivalents across cm/meters/mm
/// collapse to one chip (e.g. `15 ס"מ` ≡ `0.15 מ׳`).
List<SizeToken> sizeTokensIn(List<LipskeyCatalogProduct> ps) {
  final all = <SizeToken>{};
  for (final p in ps) {
    all.addAll(productSizeTokens(p));
  }
  final out = dedupLengthByMm(all.toList());
  sortSizeTokens(out);
  return out;
}

/// Angle chips for the pool (separate axis — used only when sizes don',
  't_284d655b': 'כביסה',
  't_0ddd0c99': 'לכיור',
  't_48649379': 'למדיח',
  't_6b3cd331': 'מרובע',
  't_358621ec': 'עגול',
  't_b019a766': ' / a number), which a
  /// screen reader would otherwise announce as "minus sign" / "plus" / a lone
  /// digit with no idea what is being changed. Each is wrapped in a [Semantics]
  /// node that NAMES the action and the product (e.g. "הוסף אחד · <product>")
  /// and the qty readout exposes the count as a [Semantics.value]. The glyph',
  't_f2baa7c6': 't run the count away; the
/// matching lower floor is 1 (see [_QuickPadKeyboardState._decrement]).
const int kMaxQty = 99; // OWNER-REVIEW value

/// A keyboard of product "quantity keys", styled like `BsKeyboard`.
///
/// [items] are chunked into rows of [_itemsPerRow]; each item is a column of
/// (label key, qty stepper). Tapping the label key fires
/// `onAdd(item, currentQty)`. The optional trailing utility key — `מצב רגיל`
/// — fires [onSwitchMode]. No Material icons anywhere: the stepper uses the
/// text glyphs ',
  't_134a5f92': 'הוסף כמות · \${item.label}',
  't_a61bdca6': 'הפחת כמות · \${item.label}',
  't_485a310c': 'מצב רגיל',
  't_e6b00a4e': 's `מצב רגיל` utility key — lets a host
  /// flip back to the regular browsing mode. Null hides the key entirely.
  final void Function()? onSwitchMode;

  @override
  ConsumerState<QuickPadScreen> createState() => _QuickPadScreenState();
}

class _QuickPadScreenState extends ConsumerState<QuickPadScreen> {
  /// The set of real `kDivePool` skus, computed ONCE per isolate — used to keep
  /// only frequency keys that name an addable catalog product (the usage signal
  /// is keyed by free-form text, not necessarily a sku).
  static final Set<String> _poolSkus = {for (final p in kDivePool) p.sku};

  /// Derive the frequent-sku list from `smartInputUsageProvider`: sort its
  /// `frequencies` entries most-frequent first and keep ONLY keys that are real
  /// `kDivePool` skus (drop free-form phrases). Returns `const []` when none
  /// survive, so the engine falls back to favorites → recents cleanly.
  List<String> _frequentSkus(SmartInputUsage usage) {
    final entries = usage.frequencies.entries
        .where((e) => _poolSkus.contains(e.key))
        .toList()
      ..sort((a, b) => b.value.compareTo(a.value)); // most-frequent first
    if (entries.isEmpty) return const [];
    return [for (final e in entries) e.key];
  }

  /// Add the tapped product (× [qty]) to the smart cart via the SAME
  /// `SmartCartNotifier.add(SmartCartLine(...))` path the product sheet uses.
  /// `brandPrice` is 0 (the catalog carries no price — the sheet defaults it to
  /// 0 too) and there are no accessories on a quick-add line.
  void _addToCart(LipskeyCatalogProduct p, int qty) {
    ref.read(smartCartProvider.notifier).add(
          SmartCartLine(
            productKey: ',
  't_63caa50e': 'התחל',
  't_cdf01666': 'נוסף לסל ✓  \${quickLabel(p)} ×\$qty',
  't_1f8c62fe': 'נוסף לסל ✓  ברך ×3',
  't_9e4ac49e': 'עדיין אין מועדפים — התחל לבחור מוצרים',
  't_aa2d8255': 'תתחיל',
  't_85f0c45d': 'אטם בין מיכל לאסלה',
  't_76175c8e': 'אטם בין מיכל לצינור',
  't_0f15552d': 'אטם גומי',
  't_5fa93d63': 'אטם דו צדדי 1/2"',
  't_38eb4030': 'אטם לאסלה',
  't_634f1e9a': 'אטם לחיבור מים',
  't_dc5b00f0': 'אטם לקיבוע',
  't_1067059d': 'אטם שעווה לאסלה',
  't_f8bf5493': 'ברגי קיבוע לאסלה',
  't_d38ee2e6': 'ברגי קיבוע למושב',
  't_1322527a': 'ברגי קיבוע לקיר',
  't_7b209e4a': 'ברגי רצפה',
  't_cd94d3cb': 'ברגי תלייה לכיור',
  't_8530e97f': 'ברז זוויתי 1/2"',
  't_6f003567': 'ברז זוויתי למדיח',
  't_8d132823': 'ברז למכונת כביסה 3/4"',
  't_7f651b5e': 'ברז ניל 1/2"',
  't_60a243cf': 'ברז ניל כפול',
  't_b8edbb4f': 'ברזי ניתוק',
  't_4b2e5974': 'גוף סמוי לסוללה',
  't_215221e0': 'זרוע + ראש מקלחת',
  't_0e6ef0a1': 'זרוע אמבט',
  't_895b2469': 'זרוע למקלחת',
  't_6ab7928f': 'חבק תליה 4"',
  't_da464b6b': 'מד לחץ',
  't_1365af0a': 'מזלף יד',
  't_150a75b5': 'מיכל הדחה',
  't_2a06ee29': 'מלכודת ריח (סיפון)',
  't_517628f5': 'מסנן מים',
  't_045da643': 'מפתח צינורות',
  't_79af136b': 'מצמד חיתוכי לרב-שכבתי',
  't_5cb64487': 'מצמד לצינור גן',
  't_0694fd0b': 'מקצועיסט HDPE',
  't_45341154': 'מתקן תלייה לצינור',
  't_a0296029': 'סוללה לסוללת אמבט',
  't_20b2445e': 'סוללה לסוללת מקלחת',
  't_a04c6e80': 'סוללת מילוי לאמבטיה',
  't_4d7bd2b5': 'סיפון כפול למטבח',
  't_9b98acad': 'פקק ניקוז עם שרשרת',
  't_10d4579c': 'צינור PEX',
  't_3a2f6a1f': 'צינור גמיש + מתקן',
  't_622cb369': 'צינור גמיש 1/2"',
  't_125f6f03': 'צינור גמיש למדיח',
  't_e8d88aea': 'צינור גמיש למזלף',
  't_87068efa': 'צינור גמיש למקלחת',
  't_e45d5390': 'צינור ניקוז 50 מ"מ',
  't_ec6e2245': 'צינורות חיבור גמישים',
  't_71ad1101': 'צנרת מבודדת לגג',
  't_01c2a7ea': 'ראש מקלחת + זרוע',
  't_b6c7ef12': 'ראש מתיז',
  't_ccf17cc9': 'רוזטות כיסוי',
  't_9cfbcc6d': 'שסתום אל-חזור',
  't_9a78e0af': 'שסתום ביטחון',
  't_d6412939': ';

/// How confidently a [SmartAcc] was bound to a catalog product.
///
///  - [curated] : the accessory already carries an owner-set `sku` AND that sku
///    is a real product in the pool. The strongest binding — a human chose it.
///  - [auto]    : no curated sku, but the name resolves to ONE clearly-best
///    catalog product (top relevance clears the confidence floor AND beats the
///    runner-up by a decisive margin). Safe to auto-fill.
///  - [ambiguous] : the name matched SOMETHING, but not confidently — either the
///    best score is below the auto floor, or several products tie within the
///    margin (e.g. a generic "אטם" matches dozens). Needs OWNER review before it
///    can be trusted; the best candidate is kept so the owner can confirm/reject.
///  - [none]    : nothing in the catalog matched the name at all (score 0 or
///    below the minimum floor). No product is attached.
///  - [swarm]   : no owner sku and the keyword scorer could not resolve it, but
///    the match+verify SWARM picked a product semantically AND a second agent
///    verified it (see [kAccSkuOverrides]). Machine-confident, pending owner
///    spot-check — counted as resolved like [curated] / [auto].
enum KitMatch { curated, auto, ambiguous, none, swarm }

/// The resolution of ONE accessory row: the original [acc], the catalog
/// [product] it bound to (null for [KitMatch.none]), the [match] confidence, and
/// the relevance [score] that produced it (0 for a curated/none row that did not
/// go through the scorer; the curated row',
  't_544c436b': 's words, so top == runner-up, margin 0) — e.g.
// "אטם דו צדדי" tops at 160 but a dozen products score 160, and "מיכל הדחה סמוי"
// tops at 40 with many ties. A genuinely UNIQUE accessory instead leaves the
// runner-up far behind: "מד לחץ" → top 140 / runner-up 20 (margin 120),
// "צינור ניקוז" → top 140 / runner-up 32 (margin 108). Coincidental single-token
// overlaps (a shared size like 10 מ"מ) produce only a small margin (≤20). So the
// auto gate requires BOTH a real absolute score AND a decisive margin over the
// runner-up; everything else — ties, weak tops, coincidental overlaps — stays
// [KitMatch.ambiguous] for owner review.

/// Minimum top score for ANY binding. Below this the accessory is [KitMatch.none]
/// (a score of 8 means only a category-level word matched — too weak to attach a
/// specific product; a score of 0 means the catalog simply has no such product,
/// e.g. "סרט טפלון" / "משקוף" / "רובה אפוקסי", which carry no catalog name). The
/// owner can still review near-floor rows because they surface as [KitMatch.none]
/// with their score recorded. OWNER-REVIEW.
const int kKitMinScore = 8;

/// The absolute score the single best product must reach to be eligible for
/// [KitMatch.auto]. 140 = the WHOLE multi-token name appears in the product name
/// (+100) AND both its words land (2 × +20) — a genuine multi-token 1:1 match.
/// This floor sits deliberately ABOVE the single-token ceiling: a one-word name
/// maxes at 120 (+100 whole-phrase, +20 token), so a lone generic word that
/// coincidentally hits exactly ONE product (large margin) can NEVER reach auto —
/// it stays [KitMatch.ambiguous] for owner review. Combined with [kKitAutoMargin]
/// this keeps BOTH single-token coincidences AND strong-but-tied multi-token
/// names (e.g. "אטם דו צדדי", top 160 with many ties) out of auto. OWNER-REVIEW.
const int kKitAutoScore = 140;

/// How far the best score must EXCEED the runner-up to call it [KitMatch.auto].
/// 40 = a clear two-word-class gap, so only an accessory whose top product stands
/// decisively apart (margin ≥ 40, like "מד לחץ" at 120 or "צינור ניקוז" at 108)
/// auto-binds; ties (margin 0) and coincidental single-token overlaps (margin
/// ≤ 20) stay [KitMatch.ambiguous]. OWNER-REVIEW.
const int kKitAutoMargin = 40;

/// sku → product over the deduped [kDivePool], built once. Used to (a) confirm a
/// curated `acc.sku` actually exists in the pool and (b) is the universe the
/// relevance scorer ranks. FIRST-WINS on a collision, matching the pool',
  't_c21cbc85': '
    show kBspInchToMm;

/// Every inch body (the part before the `"`/`׳`) the catalog or the contract
/// uses, mapped to its [kBspInchToMm] key. Pretty glyphs (½) and the ASCII forms
/// (1/2, 11/2) both land on the same key.
const Map<String, String> _kInchBodyToBspKey = {
  ',
  't_4b824d71': 'מטר',
  't_73633d37': 'ס״מ',
  't_9bf3814f': 's text +
// voice input (P4 step 54). kQuerySynonyms maps a typed/spoken alias to its
// canonical token (a kMaterials key, a colour/finish, or an everyday noun like
// מרפק→ברך). normalizeQuery folds them: LATIN aliases via an ASCII word-boundary
// regex (so ',
  't_d197d732': '). Returns `null` when no token
/// qualifies (e.g. a name that is all brand + numbers) — the caller then
/// applies the category fallback.
String? firstMeaningfulToken(String nameHe, Set<String> blocklist) {
  for (final t in _realWordTokens(nameHe)) {
    if (!blocklist.contains(t)) return t;
  }
  return null;
}

/// Collapses a [token] onto its canonical form via [synonyms]; pass-through
/// when no mapping exists. With the EMPTY default `kWordSynonyms` this is the
/// identity — see the OWNER-REVIEW note there.
String canonicalizeWord(String token, Map<String, String> synonyms) =>
    synonyms[token] ?? token;

/// SEED list of brand / series prefixes that lead a product name but carry no
/// search meaning ("דיור ראש מקלחת" is a *shower head*, not a "דיור"). Skipping
/// them lets the real noun become the lexicon key.
///
/// OWNER-REVIEW: this seed is intentionally partial — names in the catalog also
/// lead with brands NOT listed here (e.g. טולדו, טרפז, תבור, קונקורד already
/// seen in `מערכות אמבטיה`). The category fallback (`kCategoryFallbackWord`)
/// catches those, but the owner should finalize the authoritative brand set.
const Set<String> kBrandPrefixBlocklist = {
  // SEED (16) — original hand-picked brand prefixes.
  ',
  't_974cf77c': ').hasMatch(w))
    .toList();

/// The first "meaningful" token of [nameHe]: the first real word (≥2 chars,
/// digit-free) that is NOT in [blocklist]. Brand-prefix words in [blocklist]
/// are skipped so the meaningful noun behind them wins (e.g. "דיור ראש
/// מקלחת…" → ',
  't_d94fe4f0': ', "קיסר ברז…" → ',
  't_9a510648': ', // OWNER-REVIEW
  "אנג',
  't_e08d705a': 's first meaningful
/// token is unavailable (all brand + numbers) so the lexicon never loses it.
/// Keys are VERBATIM real `categoryHe` values from the catalog; values are the
/// plain word a non-technical user would type.
///
/// OWNER-REVIEW: this is a SEED of obvious cases (taps, shower heads, sprays,
/// systems, spouts, water-points) drawn from real category names. The owner
/// should review/extend coverage; categories without an entry simply fall
/// through (the product keeps whatever first token it has).
const Map<String, String> kCategoryFallbackWord = <String, String>{
  // Faucet families — names often lead with a brand (קיסר/דיור…) → ',
  't_a50230d7': 's lower
/// layer. A PURE library (no Flutter widgets, no Riverpod providers), mirroring
/// the purity of `dive_pool.dart` (STEP 1), `narrow_axis.dart` (STEP 0) and
/// `catalog_lens.dart`. Importing it pulls in zero UI.
///
/// WHY THIS EXISTS:
///   A non-technical user searches by a single plain word ("ברז", "ברך",
///   "צינור"). To map products → words we take the FIRST MEANINGFUL TOKEN of
///   each product',
  't_d0a87365': 'איביזה',
  't_bdb0323f': 'אל חזור …',
  't_b2eab7bf': 'אלפא',
  't_9e36eb00': 'אקווה',
  't_fb7c0294': 'ארון',
  't_3c35d306': 'בתא',
  't_ce01f025': 'גאלרי',
  't_4549002c': 'גל',
  't_235f1632': 'גליל',
  't_00052e03': 'גרנדה',
  't_f62ea186': 'דיור',
  't_2cc1296e': 'דלתא',
  't_aaf7e03b': 'הדר',
  't_b31df6e7': 'הוואי',
  't_8878b35d': 'ויגה',
  't_c20e1fd9': 'זווית נחושת פ.פ',
  't_5343e7a2': 'טולדו',
  't_d1069946': 'טיטוניק',
  't_8bcb9732': 'טרפז',
  't_f2838cce': 'טרפלקס',
  't_d662d80f': 'ידית',
  't_b8af4d20': 'כנרת',
  't_50a78d72': 'לונה',
  't_acbd6bc8': 'מד',
  't_30bc2413': 'מחבר גמיש',
  't_98f6ae5f': 'מלודי',
  't_9e030f31': 'מצרות',
  't_189ed074': 'נבה and
  // אנג',
  't_bacae1cc': 'נבה", // OWNER-REVIEW (ASCII apostrophe U+0027)
  ',
  't_8ccb9b5f': 'נוגה',
  't_c4124e67': 'נקודה',
  't_1f57b1cd': 'סט',
  't_294ec1d0': 'סיגמא',
  't_a06020b9': 'סיגמא פלוס תעלת …',
  't_db20659b': 'סעף',
  't_53314dca': 'פולו',
  't_c6c70bb8': 'פיטרה',
  't_a7fa1435': 'פלוס',
  't_d5bfe371': 'פלורה',
  't_a34655a8': 'קונקורד',
  't_38ecd91d': 'קורל',
  't_7ab42080': 'קיסר',
  't_b402c4c6': 'ראש',
  't_bb8a36f0': 'רותם',
  't_566fa0d0': 'תמר',
  't_06e86be5': '
    show parseAngleTokens, parseSizeTokens;

/// One answered step in the newbie conversation — a chosen "narrow by" chip on
/// a given axis. A list of these (the conversation "stack") is the breadcrumb
/// trail the UI renders ("ברז › 1/2" › שחור") and the engine reads (via its
/// emptiness) to know whether the dive has started.
///
/// const-friendly: all fields are final and the constructor is `const`, so a
/// caller may build canonical fixed steps at compile time. [predicate] is the
/// pure membership test used to apply this step to a pool (mirrors
/// [applyNarrow]',
  't_bbf6f45c': ';
// The 7th engine ("מה מתחבר לזה" / connection-planner) reuses the REAL,
// verified compatibility engine rather than re-deriving a parallel one — see
// [connectionsFor]. This is the SAME function `install_engine`',
  't_1f1092b4': 's "show more words" affordance can reveal the long tail BELOW the
/// opening cut (the ~80 rarer part-nouns a frequency cap hides — `ניפל`,
/// `רקורד`, `בושינג`, …) WITHOUT re-deriving the sort or duplicating the rule.
/// PURE.
///
/// STABLE: `List.sort` is not guaranteed stable, so equal-frequency words are
/// tie-broken by their first-seen position in [WordLexicon.entries] (an index
/// key) — the lexicon',
  't_626bc887': 's "עוד…" (show-more) affordance reveals the rest
    // of [wordsByFrequency] below this cut (one ordering source → no drift).
    return AskWords(
      kFirstQuestion,
      wordsByFrequency(lexicon).take(kFirstWordCount).toList(),
    );
  }

  // (2) Resolved to a single distinct card.
  if (pool.isNotEmpty && distinctCardCount(pool) <= 1) {
    return Resolve(pool.first, pool);
  }

  // (3) Small-pool shortcut — already few enough cards to scan by eye.
  if (distinctCardCount(pool) <= kShowProductsThreshold) {
    return ShowProducts(distinctProducts(pool));
  }

  // The axis labels already answered on this dive. `narrowAxis` is shared with
  // finder_screen and we must not touch it, so the "ask the most-decisive axis,
  // each at most once" logic lives HERE.
  final answeredAxes = {for (final s in stack) s.axisLabel};

  // (4) The MOST-DECISIVE unanswered subtype-free axis (information-gain scored
  // — lowest expected-remaining cards). This is the easiest path: ask the
  // question that narrows the pool most first, so the dive reaches a product in
  // the fewest taps. Every returned axis is UNANSWERED → asked at most once.
  final best = bestUnansweredAxis(pool, answeredAxes);
  if (best != null) {
    return AskAxis(
      kAxisQuestion[best.label] ?? kAxisFallbackQuestion,
      best.chips,
      best.label,
    );
  }

  // (5) No subtype-free axis scores, but the curated-facet axis (offerAxis/
  // narrowAxis honours the subtype ',
  't_d72e5068': 's NEWBIE path (בית/מאתר).
///
/// STEP 3 of the word-finder swarm — the layer that turns the pure data
/// primitives (STEP 0 `narrow_axis`, STEP 1 `dive_pool`, STEP 2 `word_lexicon`)
/// into a deterministic question/answer loop a non-technical user walks:
///   1. "מה אתה מחפש?"  →  pick a plain WORD (top words by frequency),
///   2. then repeatedly "narrow by" one axis (size / angle / colour / model /
///      curated option) until the pool collapses to ONE product card,
///   3. at which point the engine RESOLVES to that product (+ its siblings).
///
/// PURITY: this library imports NO Flutter widgets and builds NO UI. It depends
/// only on the pure finder libraries. (Those libraries DO transitively pull in
/// `package:flutter/widgets.dart` via `_size_norm.dart`',
  't_b5ecb602': 's first-seen sku order.
List<LipskeyCatalogProduct> resolveWord(String word, WordLexicon lexicon) {
  final skus = lexicon.wordToSkus[word];
  if (skus == null) return const <LipskeyCatalogProduct>[];
  final out = <LipskeyCatalogProduct>[];
  for (final sku in skus) {
    final p = _divePoolBySku[sku];
    if (p != null) out.add(p);
  }
  return out;
}

/// Narrows [pool] to the products that carry [chipLabel], using the SAME
/// structural test the finder UI uses (`productHasChip` from `narrow_axis.dart`
/// — no loose `String.contains` for digit-bearing size/angle labels). PURE.
List<LipskeyCatalogProduct> applyNarrow(
  List<LipskeyCatalogProduct> pool,
  String chipLabel,
) =>
    pool.where((p) => productHasChip(p, chipLabel)).toList();

// ── 7th engine: CONNECTION-PLANNER ("מה מתחבר לזה") ─────────────────────────
//
// After the dive reaches a product, let the user see the parts that physically
// CONNECT to it. This is a THIN, pure wrapper over the install engine',
  't_f66db618': 'איזה דגם?',
  't_dad89963': 'אין חלקים מתאימים',
  't_c700a9c2': 'בחר את המוצר',
  't_f45dfe2a': 'ברז · ½" · ½"',
  't_dd221e81': 'ישר או בזווית?',
  't_bec98b14': 'ישר או עם זווית?',
  't_93958674': 'מה אתה צריך?',
  't_8f58dee2': 'מה מתאים לך?',
  't_4ff1a179': 's `מצב רגיל` utility key flips back
        // to the cascade via this callback.
        QuickPadScreen(onSwitchMode: () => _setMode(_Mode.cascade)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    // SELF-GATE first — render nothing unless the flag is on. Mirrors the
    // `word_finder_screen.dart` / `quick_pad_screen.dart`
    // `.contains(flag) → SizedBox.shrink` idiom.
    final on = ref.watch(featureFlagsProvider).contains(kWordFinderFlag);
    if (!on) return const SizedBox.shrink();

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Toggle row: two plain-text segments, active one accented ──────
          Material(
            color: BsTokens.surfaceMid,
            child: Padding(
              padding: const EdgeInsets.all(BsTokens.space1),
              child: Row(
                children: [
                  _segment(_cascadeLabel, _Mode.cascade),
                  const SizedBox(width: BsTokens.space1),
                  _segment(_quickPadLabel, _Mode.quickPad),
                ],
              ),
            ),
          ),

          // ── Active surface — wrapped in Expanded so the child',
  't_e7eb4187': 's own `מצב רגיל` utility key, which calls back into the
/// host to return to the cascade); the cascade screen has no switch affordance
/// of its own.
class WordFinderHome extends ConsumerStatefulWidget {
  const WordFinderHome({super.key});

  @override
  ConsumerState<WordFinderHome> createState() => _WordFinderHomeState();
}

class _WordFinderHomeState extends ConsumerState<WordFinderHome> {
  /// The active surface. Defaults to the newbie cascade (',
  't_02ffd541': 'המהיר שלי',
  't_f9a549cc': 'חפש לי',
  't_b86f0860': 'מתחילים פשוט-לכולם',
  't_e44f9cdf': ' key opens the "מה מתחבר לזה" view for the reached
    // anchor (the representative the affordance was offered for). The connect key
    // carries the literal ',
  't_0ab2523c': '(אין בקטלוג)',
  't_61d6d802': '` — open the "מה מתחבר לזה" connections view;
  ///  • `',
  't_77311b2e': 'name (אין בקטלוג)',
  't_97d8b457': 's
  /// heavy Riverpod deps (the same pattern as [currentQuestion]).
  @visibleForTesting
  List<LipskeyCatalogProduct> get connectionsShown {
    final a = _connectionsAnchor;
    return a == null ? const [] : connectionsFor(a);
  }

  /// @visibleForTesting — true while the connections view is active.
  @visibleForTesting
  bool get connectionsViewOpen => _connectionsAnchor != null;

  /// @visibleForTesting — drive the "מה מתחבר לזה" entry directly (the affordance
  /// is only rendered inside the ShowProducts keyboard, so a test reaches it
  /// through this rather than synthesising a key tap).
  @visibleForTesting
  void showConnectionsForTest(LipskeyCatalogProduct anchor) =>
      _showConnections(anchor);

  /// @visibleForTesting — resolve a tapped product key against a supplied
  /// [products] list using the SAME sku-keyed lookup the live [_onWordTap]
  /// product branch uses ([_resolveBySku]). Lets a behavioral test seed a list
  /// where two DISTINCT cards share a plain-word label and prove the tap reaches
  /// the product by its unique sku payload — tapping the SECOND of a same-label
  /// pair resolves to the SECOND product, not the first (the label-match bug
  /// this fix removes). Routes through the one shared helper, so it cannot drift
  /// from production resolution.
  @visibleForTesting
  LipskeyCatalogProduct? resolveTappedProductForTest(
    List<LipskeyCatalogProduct> products,
    WordKey key,
  ) =>
      _resolveBySku(products, key.payload);

  /// Plain display label for a product key in a [ShowProducts] grid (and the
  /// connections view) — the SHORT plain word `quickLabel(p)`, NOT the full
  /// technical `nameHe` (full jargon violates the simplify-to-words vision; the
  /// quick pad already buckets by this same derived word). NO icon (rendered via
  /// the same icon-free `BsKey` idiom as word/chip keys).
  ///
  /// The label is display-only and intentionally NOT unique — two distinct skus
  /// can share a plain word (e.g. ',
  't_b652941a': 's
  /// product + alternatives, the SAME list `distinctSelectionLabels` labelled)
  /// and open the existing product sheet with that list as its category context —
  /// the SAME sku-keyed add-path the ShowProducts / connections terminus uses, so
  /// the kit view adds NO new cart route. A no-op when the sku is not in
  /// [contextList] (defensive — payload/state drift) or when the sheet is
  /// suppressed in a behavioral test ([openSheetOnResolve] false).
  void _onKitProductTap(WordKey key, List<LipskeyCatalogProduct> contextList) {
    final picked = _resolveBySku(contextList, key.payload);
    if (picked == null) return; // defensive — payload/state drift
    if (openSheetOnResolve) {
      showLipskeyProductSheet(context, picked, contextList);
    }
  }

  /// `הכל` — skip the current axis (no narrowing). A genuine no-op for now: the
  /// engine offers the best splitting axis, and "all" means "don',
  't_34a3c6a8': 's [_popStep] directly.
  /// The `חזרה` control is hidden once the stack is empty, so a test that wants
  /// to prove "popping at an empty stack is a safe no-op" cannot tap a button;
  /// it calls this instead.
  @visibleForTesting
  void popStepForTest() => _popStep();

  /// Reset every SUB-VIEW flag to closed in ONE place, so the [_subViewOpen]
  /// sibling set (kit / connections / jobs) cannot drift: any new sub-view that
  /// ORs into [_subViewOpen] adds its reset here once, and every full dive-reset
  /// path ([_restart], [_submitQuery]) clears the whole set together. Field-only
  /// (no setState) — callers already wrap their own setState.
  void _resetSubViews() {
    _kitRecipe = null;
    _connectionsAnchor = null;
    _jobsOpen = false;
  }

  /// Clear the whole dive — every answered step and any typed-query rank
  /// context — back to the opening word question. Used by the empty-pool
  /// empty-state',
  't_a1dd541b': 's `הקלדה` key reveals the real [BsKeyboard]
// over a [TextField]; on submit the stack is cleared and the pool is re-seeded
// by a catalog text query (`catalogProductMatchesQuery`). Typing is the escape
// hatch only — the happy path is word → chip taps.

import ',
  't_a4567665': 's pool. Non-null only while
  /// [_material] is set. Built ONCE when the material is PICKED (in the tap
  /// handler / [pickMaterialForTest]) — NOT inside a getter/build: a fresh
  /// `buildWordLexicon` over 111–774 products on every frame would jank. Cleared
  /// (set null) whenever the material is cleared. The active-lexicon helper
  /// ([_activeLexicon]) reads it so both [currentQuestion] and the tapped-noun
  /// [resolveWord] resolve WITHIN the material pool.
  WordLexicon? _materialLexicon;

  /// Jobs-first entry ("לפי עבודה") view-state. False (default) → the opening
  /// shows the ',
  't_e95f90ee': 's predicate holds.
  final List<NewbieStep> stack = <NewbieStep>[];

  /// Emergency typing controller. Non-null only while the `הקלדה` surface is
  /// open; the real [BsKeyboard] inserts into it and submit re-seeds the pool.
  TextEditingController? _typeController;

  /// The active emergency-typed query, set by [_submitQuery]. Non-null only
  /// while the dive is seeded by a typed query; it makes [_pool] rank the
  /// re-seeded products DESCENDING by `searchRelevance`, so the most relevant
  /// product is `pool.first` (what a [Resolve] returns / a list would show
  /// first). Cleared whenever the stack is reset back to the word path.
  // OWNER-REVIEW: ranking the typed-query pool by searchRelevance is a
  // reversible default — drop this field (and the sort in `_pool`) to fall
  // back to plain base-pool order.
  String? _typedQuery;

  /// 7th engine ("מה מתחבר לזה" / connection-planner) view-state. Non-null only
  /// while the user is viewing the parts that connect to a reached anchor: it
  /// holds the anchor whose connections are shown. When set, the keyboard area
  /// renders the compatible parts (from [connectionsFor]) as plain product-keys
  /// instead of the word/chip keyboard; tapping one opens the existing product
  /// sheet (the same add-path as a reached product). Cleared by the back key and
  /// by any dive reset. This is the MINIMAL surface — the polished anchor UX is
  /// an OWNER-design decision (see the // OWNER-REVIEW affordance below).
  LipskeyCatalogProduct? _connectionsAnchor;

  /// 6th engine ("מתכון העבודה" / work-recipe) view-state. Non-null only while
  /// the user is viewing the assembled KIT for a reached WORK-product: it holds
  /// the [SmartProduct] recipe whose kit is shown. When set, the keyboard area
  /// renders the per-accessory kit (from [assembleKit]) — each resolved line as
  /// a product-key with its recommended product + collapsible alternatives, each
  /// unmatched line as plain text — instead of the word/chip keyboard. Tapping a
  /// product key opens the existing product sheet (the same add-path as a reached
  /// product / connections part). Cleared by the back key and by any dive reset.
  /// Mirrors [_connectionsAnchor] exactly; the polished kit UX is an OWNER-design
  /// decision (see the // OWNER-REVIEW affordances below).
  SmartProduct? _kitRecipe;

  /// Opening word-list expansion. False (default) → the opening [AskWords] shows
  /// only the top [kFirstWordCount] words by frequency plus a [kMoreWordsKey]
  /// (',
  't_d448ed62': 's scroll region only
              // via this Column child (they are short, so they sit above the
              // Expanded keyboard region).
              if (showMaterialRow) _buildMaterialRow(),
              if (showMaterialClear) _buildMaterialClear(),

              // ── Jobs-first entry ("לפי עבודה") opening affordance ─────────
              // Beside the material controls at the opening: a single icon-free
              // key that opens the JOB LIST (the discoverable way into the recipe
              // kit). Like the material row it is short and sits above the
              // Expanded keyboard region; it renders ONLY at the opening (the
              // showJobsEntry gate), and the list it opens then REPLACES the
              // cascade keyboard in the Expanded region below.
              if (showJobsEntry) _buildJobsEntry(),

              // #ai-finder — opening affordance: a free-text "תאר → מצא" entry
              // (Claude narrows the catalog by category). Same opening gate as
              // the jobs/material affordances.
              if (showJobsEntry) _buildAiFinderEntry(),

              // The key region SCROLLS when its grid is taller than the
              // viewport — a well-connected connections anchor (uncapped) or a
              // full 24-word / 30-product grid on a short phone. The old
              // `const Spacer()` + a non-scrolling Column threw a RenderFlex
              // overflow (and crashed) on a normal-height device; the canonical
              // audit caught it (the screen test masked it at 1080x2400).
              // Expanded takes the remaining height; SingleChildScrollView lets
              // the content exceed it gracefully.
              Expanded(
                child: SingleChildScrollView(
                  child: _kitRecipe != null
                      // ── 6th engine: work-recipe kit view (when open) ──────
                      // Highest priority — a user inside the kit is deeper than
                      // the connections / typing surfaces. Captured into a local
                      // for null promotion.
                      ? _buildKitView(_kitRecipe!)
                      : _connectionsAnchor != null
                      // ── 7th engine: connections view (when open) ──────────
                      ? _buildConnectionsView()
                      : _jobsOpen
                          // ── Jobs-first entry: the JOB LIST (when open) ────
                          // Below the kit/connections views (a job tap OPENS the
                          // kit on top, and closing the kit returns here while the
                          // list stays open), above the cascade — while open it
                          // REPLACES the word keyboard, so the opening still has
                          // exactly one WordKeyboard (zero while the list shows).
                          ? _buildJobsView()
                          : showEmptyState
                          // ── Empty-pool dead-end → neutral empty-state ─────
                          ? _buildEmptyState()
                          : _typeController != null
                              // ── Emergency typing surface (`הקלדה`) ────────
                              ? Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: BsTokens.space2,
                                          vertical: BsTokens.space1),
                                      child: TextField(
                                        controller: _typeController,
                                        textDirection: TextDirection.rtl,
                                        decoration: const InputDecoration(
                                          hintText: ',
  't_30254217': 's unique `.key` as its payload (the
/// SAME sku-keyed-resolution philosophy the product keys use — resolve by a
/// stable id, never by the display label), and this index resolves it back to
/// the [SmartProduct] whose kit [_WordFinderScreenState._showKit] will show.
final Map<String, SmartProduct> kJobByKey = {
  for (final r in kSmartProducts) r.key: r,
};

// ── 6th engine (work-recipe / "מתכון העבודה") view-only copy ────────────────
//
// These three strings are the ONLY display copy the kit view adds. They live
// here (not in the engine) because they are pure VIEW text — the same place
// `_buildEmptyState` keeps its copy. All three are OWNER-REVIEW: reword freely;
// the kit LOGIC (assembleKit / KitMatch) is untouched by a copy change.

/// OWNER-REVIEW: the icon-free key that, on a reached WORK-product, builds and
/// shows its recommended kit. Rendered via the same BsKey letter idiom as every
/// other word/chip key (no icon).
const String kBuildKitKey = ',
  't_4a872aef': 't reach without typing —
/// `ניפל`, `רקורד`, `בושינג`). Tapping it shows EVERY lexicon word.
const String kMoreWordsKey = ',
  't_7cbc4eb2': 'אין בקטלוג',
  't_916cf8fb': 'בנה לי את
        // הערכה',
  't_49f783cc': 'בנה לי את
  /// הערכה',
  't_e2289dbd': 'בנה לי את הערכה',
  't_89157044': 'כל החומרים',
  't_147fa147': 'לא נמצאו תוצאות',
  't_ebba1d75': 'לפי חומר',
  't_53c31290': 'מוצר מתאים',
  't_621b453e': 'נחושת · ניפל · 1/2"',
  't_af08967a': 'נסה',
  't_ef00950f': 'נסו',
  't_d65c6df2': 'עוד אפשרויות',
  't_3c5d303a': 'עוד אפשרויות (3)',
  't_4f4219e6': 'עוד אפשרויות (N)',
  't_b3d0c212': 'תאר במילים שלך → חיפוש חכם',
  't_bfb0a294': 'תוצאות',
  't_33d3c7ca': ';

/// A keyboard of tappable Hebrew word suggestions, styled like `BsKeyboard`.
///
/// [words] are chunked into rows of [_wordsPerRow]; each renders as a plain
/// (icon-free) [BsKey]. The [primary] word — matched by identity — is drawn in
/// brand orange. When [showUtilityRow] is true (the default), a final utility
/// row carries exactly two icon-free keys: `הכל` → [onAll] and `הקלדה` →
/// [onType]. Surfaces with no skip/type affordance (e.g. the connections view)
/// pass `showUtilityRow: false` so those would-be dead keys are not rendered.
class WordKeyboard extends StatelessWidget {
  const WordKeyboard({
    required this.words,
    required this.onWordTap,
    super.key,
    this.onAll,
    this.onType,
    this.primary,
    this.showUtilityRow = true,
  });

  /// The word suggestions to render, in order.
  final List<WordKey> words;

  /// Invoked with the tapped [WordKey].
  final void Function(WordKey) onWordTap;

  /// Fired by the `הכל` ("all") utility key.
  final VoidCallback? onAll;

  /// Fired by the `הקלדה` ("type") utility key.
  final VoidCallback? onType;

  /// When non-null and present in [words], this word renders with the brand
  /// accent fill instead of the plain white key.
  final WordKey? primary;

  /// Whether to append the trailing `הכל` · `הקלדה` utility row. Defaults to
  /// true (every existing call site keeps both keys). Pass false on surfaces
  /// that have no skip-axis / emergency-type affordance — the connections view —
  /// where those keys would be dead no-ops (their callbacks are unwired there).
  final bool showUtilityRow;

  /// Words per word-row before wrapping to the next row.
  static const int _wordsPerRow = 3;

  /// Builds one row of word keys: each gets an [Expanded] (uniform flex), with
  /// [BsTokens.space1] gaps between keys — the BsKeyboard row idiom.
  Widget _buildWordRow(List<WordKey> rowWords) {
    final children = <Widget>[];
    for (var i = 0; i < rowWords.length; i++) {
      if (i > 0) children.add(const SizedBox(width: BsTokens.space1));
      final word = rowWords[i];
      final key = BsKey(
        // KeyKind.letter → BsKey renders the label as plain text, no icon.
        model: KbKey(word.label),
        isAccent: identical(word, primary),
        // Forward the optional product thumbnail. Null on every word / chip
        // key (the default), so those keys stay plain text — only a final
        // selection key (a product key with a real crop) draws a thumbnail.
        // The trailing הכל/הקלדה utility row builds its own bare KbKeys and
        // never passes this, so it always stays clean.
        leadingImageAsset: word.imageAsset,
        // Forward the optional a11y extras (swarm R8 / §5): a leading axis
        // glyph + a Semantics override. Null on every word / product / utility
        // key (the default), so those keys are byte-identical — only a merged
        // card-keyboard chip sets them.
        axisGlyph: word.axisGlyph,
        semanticOverride: word.semanticLabel,
        onTap: () => onWordTap(word),
      );
      children.add(
        Expanded(
          // P9.86 (#41): a DESTINATION key gets a small trailing north-east accent
          // marking that it lands directly on a product. isDestination is false on
          // every live word / chip / utility key (the default), so the un-accented
          // branch is the EXACT same Expanded(child: BsKey) as before — byte-identical.
          child: word.isDestination
              ? Stack(
                  clipBehavior: Clip.none,
                  children: [
                    key,
                    const Positioned(
                      top: 2,
                      left: 2,
                      child: Icon(Icons.north_east,
                          size: 12, color: BsTokens.brand),
                    ),
                  ],
                )
              : key,
        ),
      );
    }
    return Row(children: children);
  }

  /// Builds the trailing utility row: `הכל` and `הקלדה`, both icon-free
  /// (KeyKind.letter) keys routed to [onAll] / [onType].
  Widget _buildUtilityRow() {
    return Row(
      children: [
        Expanded(
          child: BsKey(
            model: const KbKey(',
  't_b154fb35': '
  // 25 ס"מ / 200 מ"מ  (Hebrew unit suffixes)
  r',
  't_a985697e': '\$m מ׳',
  't_e9dee4e4': '\${_fmt(v)} מ"מ',
  't_ae3dbfd0': '\${_fmt(v)} ס"מ',
  't_86c70b89': '\${m.toInt()} מ׳',
  't_345f21a3': '(?<![A-Za-zא-ת])(XXL|XXS|XL|XS|S|M|L)(?![A-Za-zא-ת=])',
  't_41de4735': ',
        family: SizeFamily.dnDiameter, mm: v,);
  }
  // mm — normalize the number so `020 מ"מ` reads `20 מ"מ`.
  final mm = RegExp(r',
  't_9027d6b0': '25 ס"מ',
  't_cfc24683': 's UI is family-coherent — never alternating units.
void sortSizeTokens(List<SizeToken> toks) {
  int rank(SizeFamily f) {
    final i = _kFamilyPrecedence.indexOf(f);
    return i < 0 ? _kFamilyPrecedence.length : i;
  }
  toks.sort((a, b) {
    final r = rank(a.family).compareTo(rank(b.family));
    return r != 0 ? r : a.mm.compareTo(b.mm);
  });
}

/// Length-only family rank: prefer cm (most product-like, compact), then
/// meters. Used by [dedupLengthByMm] to collapse equivalent length
/// representations (e.g. `15 ס"מ` and `0.15 מ׳` are the same physical value
/// and should not both be chips).
///
/// `mm` is deliberately EXCLUDED: an `mm` token is almost always a DIAMETER
/// (a `250 מ"מ` shower head) or a cross-dim OD (`16×20`, tokenized as `mm`),
/// not a length. Collapsing by raw mm-value wrongly merged `250 מ"מ` with
/// `25 ס"מ` and `16×20` with `16×16` (same first dim) into one chip — and
/// because the per-product filter (`_productHasChip`) matches by exact label,
/// every product carrying the collapsed-away label became unreachable by the
/// surviving chip. Keeping mm out means each mm token stays its own chip.
const Map<SizeFamily, int> _kLengthFamilyRank = {
  SizeFamily.cm: 0,
  SizeFamily.meters: 1,
};

/// Collapse equivalent length tokens (same `mm`, length families) to a single
/// representative — cm wins over meters wins over mm. Non-length families
/// (diameter, angle) pass through untouched. Caller should still
/// `sortSizeTokens` after if the input wasn',
  't_c2735f93': 's mental anchor
/// for fit; count breaks precedence-ties.
SizeFamily? dominantFamily(List<SizeToken> toks) {
  if (toks.isEmpty) return null;
  final counts = <SizeFamily, int>{};
  for (final t in toks) {
    counts[t.family] = (counts[t.family] ?? 0) + 1;
  }
  SizeFamily? best;
  var bestRank = 1 << 30;
  var bestCount = -1;
  counts.forEach((f, c) {
    final r = _kFamilyPrecedence.indexOf(f);
    final fr = r < 0 ? _kFamilyPrecedence.length : r;
    if (fr < bestRank || (fr == bestRank && c > bestCount)) {
      best = f;
      bestRank = fr;
      bestCount = c;
    }
  });
  return best;
}

/// Letter clothing-style sizes (S / M / L …) that some products carry instead
/// of a numeric size — e.g. clamp collars "אקווה אוגן כפול M". Ordered
/// small→large for display. EXCLUDES the `L=` length prefix (e.g. gray pipe
/// "DN40 L=50 ס"מ" — that L is "length", not a size letter).
const List<String> kLetterSizeOrder = [',
  't_8984a679': 't (years, generic IDs).
/// "25 שנים אחריות" must NOT become a 25 chip. We require an explicit unit
/// glyph next to the number — so a bare integer in the name yields nothing.
List<SizeToken> parseSizeTokens(String name) {
  final out = <SizeToken>[];
  for (final m in _kSizeRe.allMatches(name)) {
    final raw = m.group(0)!.trim();
    final folded = kInchPretty[raw] ?? raw;
    final tok = _tokenize(folded);
    if (tok == null) continue;
    // Apply the canvaskit font fold to the FINAL tokenized label (`_tokenize`
    // has already done the numeric cleanup like `020 מ"מ` → `20 מ"מ`).
    final display = kHardToRenderFractions[tok.label] ?? tok.label;
    out.add(display == tok.label
        ? tok
        : SizeToken(label: display, family: tok.family, mm: tok.mm),);
  }
  return out;
}

/// Angles as their own list — the chooser surfaces them only when sizes don',
  't_d94541a4': 't meaningfully compare an inch diameter to a cm length.
enum SizeFamily {
  inchDiameter, // ½" / 1" / 1¼"
  dnDiameter,   // DN16 / DN40
  mm,           // 200 מ"מ
  cm,           // 25 ס"מ
  meters,       // 0.5 מ׳ (catalog L (cm)/100)
  angle,        // 45° / 90°  — surfaced as its own axis, never with sizes
}

@immutable
class SizeToken {
  const SizeToken({required this.label, required this.family, required this.mm});

  final String label;     // verbatim display, e.g. ',
  't_41dadf1d': 'פקק שטוח 2⅜"',
  't_1d3e2e81': 'הזן סיסמת גישה',
  't_9b63e302': 'סיסמה שגויה',
  't_7e1a3a42': 'אתה אינסטלטור-מומחה לחיבורים. אתה מסביר ברמת סוג-המתאם בלבד למה קצוות-חיבור ',
  't_d5f8d283': 'הסבר לאינסטלטור בקצרה: (1) למה הקצוות האלה לא מתחברים ישירות לחיבור-תקני ',
  't_68e5d587': 'הקצוות שלו:',
  't_70c3edc6': 'לא מתחברים ומה מגשר ביניהם. לעולם אל תמציא שם-מוצר, מק"ט או מחיר.',
  't_459e38ff': 'מנתוני היבוא',
  't_70565f4f': 'מנתוני-המפרט-המאומת',
  't_347a8532': 'מצמד קומפרסיה HDPE',
  't_91fd46de': 'מק"ט או מחיר.',
  't_5b88cd83': 'נפוץ, (2) איזה סוג-מתאם מגשר. דבר ברמת סוג-המתאם בלבד — אל תמציא שם-מוצר, ',
  't_2b492ded': 'פרס PEX',
  't_13417b60': 'פרס נחושת',
  't_ac26c735': 'פתח ניקוז',
  't_7c96832f': 'תבריג חיצוני BSP',
  't_1d275aad': 'תבריג פנימי BSP',
  't_e9b47d90': '⚙️ הקצוות מנתוני-המפרט; ה-AI רק מסביר איזה סוג-מתאם מגשר.',
  't_5f407a26': '"כמה נשאר בתקציב" · "תוסיף ערכה לסל".',
  't_6e45811b': 's REAL grounded tools
// ("תאר עבודה → סל", the smart finder, the product card). So it reasons over
// general trade knowledge but never claims app-specific data it doesn',
  't_29a55fc8': 't reach ("שחור" →
        // "נחושת"). Prefer real NAME-matches; only when there are none fall back
        // to the model',
  't_b5816bf9': 'אפשר גם לבקש: "תמצא לי ברז" · "מה מצב ההזמנות" · ',
  't_21abf002': 'הוסף \${t.kit.length} לסל',
  't_9f64498f': 'הרכבתי ערכה — להוסיף לסל?',
  't_eaf138c9': 'כתוב הודעה…',
  't_ca758676': 'לא הצלחתי להרכיב את הערכה — נסה לתאר אחרת.',
  't_de0b67ab': 'לא הצלחתי לנסח תשובה — נסה לנסח אחרת.',
  't_20b646a4': 'מצאתי בקטגוריה "\${intent.key}":',
  't_2144e57f': 'מצאתי עבור "\$userText":',
  't_53f4ab54': 'נוספו \${kit.length} פריטים לסל ✓',
  't_98834262': 'שאל אותי כל דבר על אינסטלציה, רכש או עבודה.',
  't_b5f5de70': '✓ נוסף לסל',
  't_640c3da3': '💡 העוזר החכם דורש חיבור לשרת.',
  't_71d3e849': '📊 ההזמנות שלך:',
  't_b4d724e4': '📊 התקציב:',
  't_27c2532c': '🤖 העוזר החכם',
  't_fd98d20d': '\${_resultTitle!}  ·  \${_products.length} מוצרים',
  't_534f17c3': ';
        _products = literal;
      });
      return;
    }

    // 2) No literal name-match → AI semantic mapping for a natural-language request
    //    ("משהו לחבר שני צינורות") → the single best real category (closed-set).
    final gw = ref.read(claudeGatewayProvider);
    if (gw == null) {
      setState(() {
        _searched = true;
        _resultTitle = null;
        _products = const [];
      });
      return;
    }
    setState(() {
      _loading = true;
      _failed = false;
      _searched = true;
      _resultTitle = null;
      _products = const [];
    });
    try {
      final r = await gw.ask(
        prompt: aiFinderPrompt(text),
        system: _kSystem,
        maxTokens: 48,
      );
      final cat = matchCategory(r.text); // closed-set validation
      if (mounted) {
        setState(() {
          _resultTitle = cat == null ? null : ',
  't_2cc54fcd': 'אם אף קטגוריה ברשימה לא מתאימה, החזר NONE.',
  't_4c07bad7': 'אתה ממפה בקשת אינסטלטור לקטגוריית-מוצרים אחת מרשימה סגורה. החזר אך ורק ',
  't_873212d8': 'בחר את הקטגוריה האחת שהכי מתאימה לבקשה — מתוך הרשימה בלבד. ',
  't_ef1f4e6d': 'החזר אך ורק את שם-הקטגוריה (שורה אחת, ללא טקסט נוסף). ',
  't_0a4f53a8': 'לא נמצאו תוצאות — נסה מילים אחרות.',
  't_9eb1ebc7': 'לדוגמה: ברז למטבח / חיבור לצינור ביוב',
  't_5eca3956': 'שם-קטגוריה מהרשימה שניתנה, או NONE. לעולם אל תמציא קטגוריה ואל תכתוב שם-מוצר.',
  't_852e93ee': 'תאר במילים שלך מה אתה מחפש:',
  't_7a26c8fe': '💡 החיפוש החכם דורש חיבור לשרת.',
  't_214c1fc6': '🗣️ חיפוש חכם',
  't_ffebf289': '\${g.hours} / \${g.life} שעות עבודה',
  't_49aed29c': ';

/// 🤖 בינה מלאכותית ואוטומציה — the AI hub (T3.H).
///
/// Faithful native port of proto Category G (`openAIHub` @21123). Nine tools.
/// Each is wired to REAL behaviour or honestly flagged:
///   • 📷 ברקוד + 🎙️ דיבור = REAL — drive the catalog',
  't_ad75e6c4': 'Analytics חכם',
  't_b6cebc6a': 'PDF → רשימת חומרים',
  't_6903dffa': 's own search-tools use).
///   • 💡 חלופות זולות + 📐 סריקת תוכניות = REAL — open the canonical contractor
///     sheets that COMPUTE over the live catalog price tiers / smart-cart.
///   • 📦 חיזוי מלאי = REAL/COMPUTED — [computeStockForecast] over the live
///     orders engine (consumption history) + cart (on-hand). No model.
///   • 📊 Analytics חכם = REAL/COMPUTED — [computeAnalyticsInsights] over the
///     live orders engine + budget + the real cheaper-alternatives scan.
///   • 🔗 התאמה משולשת · 🌦️ מזג אוויר · 🔧 זיהוי בלאי = DEFERRED — each needs an
///     EXTERNAL data source the app does not hold (supplier delivery-note &
///     invoice documents · a weather-forecast API · IoT equipment-hour sensors),
///     so they render a verbatim sample under an explicit "⚙️ בפרודקשן" note.
///
/// True while a [AIHubScreen._runVoice] recognition session is active — guards the
/// stateless-widget 🎙️ tile against overlapping listens (module-level because the
/// dispatch is a `static` method). Mirrors VoiceDictateButton',
  't_780eb00d': '};

  /// The DEFERRED (backend-blocked) tool ids — exposed for tests/guards.
  static Set<String> get deferredToolIds => _deferredToolIds;

  /// The tools a RAW company shell must not offer ([kProfileRawShell]) —
  /// 💡 חלופות זולות + 📐 סריקת תוכניות claim partner-store prices, and a
  /// company shell holds no price data (the imported catalog model carries
  /// none); 📊 Analytics',
  't_86fc9f5a': '}עוד \${p.days} ימים',
  't_4dd012c9': 'אוטומציית מזג אוויר',
  't_00aec526': 'אין עדיין היסטוריית צריכה — בצע הזמנות כדי לקבל חיזוי מלאי',
  't_dc00c18a': 'דיבור למשימה',
  't_8b7f3b12': 'הדפדפן לא תומך בחיפוש קולי',
  't_55b01426': 'הזמן עכשיו',
  't_42bfe40c': 'הזמנה·תעודה·חשבונית',
  't_843ab60c': 'המערכת מתאימה את לוח העבודה לתחזית.',
  't_7d6f17d2': 'השוואה אוטומטית: הזמנה · תעודת משלוח · חשבונית.',
  't_818304e5': 'התאמה משולשת',
  't_d652e08b': 'התראות לפי תחזית',
  't_f31f9895': 'זיהוי בלאי',
  't_005e36b6': 'זיהוי בלאי ציוד',
  't_f05203a8': 'זיהוי מוצר מהיר',
  't_deeaf62a': 'חיזוי מלאי',
  't_6cb896d8': 'חיזוי מתי כל חומר ייגמר — לפי קצב הצריכה באתר.',
  't_261202e5': 'חשבונית',
  't_cfedc3d0': 'יצירת משימה בקול',
  't_be13c548': 'כלים חכמים שחוסכים זמן וטעויות.',
  't_1cdf077e': 'מומלץ AI',
  't_c32bd74f': 'מומלץ לתזמן תחזוקה',
  't_d5dbcef2': 'מוצרים חליפיים',
  't_d4b0256e': 'מלאי \${p.stock} · צריכה \${p.rate}/יום',
  't_cc31f7c2': 'מתי להזמין שוב',
  't_fbb48c18': 'נדרשת בדיקה — הסכומים אינם זהים',
  't_0f806271': 'ניטור שעות עבודה של הציוד והתראה לפני תקלה.',
  't_983873cc': 'סורק ברקוד',
  't_b3af2469': 'סיכום בעברית',
  't_4f190cc5': 'ספר מה צריך, נבנה סל',
  't_bbd7e32f': 'עוזר חכם',
  't_531d67c2': 'שאל אותי כל דבר',
  't_d8522844': 'תאר עבודה → סל',
  't_ec9a68a0': 'תובנות אוטומטיות על ההתנהלות באתר.',
  't_bb9aef92': 'תובנות ומגמות',
  't_156326b1': 'תחזוקת ציוד',
  't_e00b74af': 'תעודה',
  't_297ed08b': '⚙️ בפרודקשן: דורש תעודות משלוח וחשבוניות מהספק (מסמכים חיצוניים)',
  't_ea98bcb2': '⚙️ בפרודקשן: חיישני IoT וניטור צריכת חשמל בשרת',
  't_8be04ad6': '⚠️ אי-התאמה',
  't_648b899e': '✓ תואם',
  't_85b2c3ea': '🌦️ תחזית Open-Meteo · לפי מיקום המכשיר',
  't_4a1a62cc': '🤖 בינה מלאכותית',
  't_e43a9c99': '🧮 מחושב מנתוני אמת — מנוע ההזמנות, התקציב והשוואת המחירים בקטלוג',
  't_c2b5de2c': '🧮 מחושב מתוך היסטוריית ההזמנות והעגלה החיה — קצב צריכה ומלאי נוכחי',
  't_8c46f719': '(אחריות / זמינות / טיב-החומר). אל תמציא מפרטים, מספרים או שמות-מוצר שלא ',
  't_9468006f': 'אתה יועץ-רכש מנוסה לאינסטלטורים. אתה מסביר בקצרה ובכנות tradeoff בין מותגים ',
  't_2f219bb7': 'המלצה: \${widget.recName} · ₪\${widget.recPrice}',
  't_4c8d9033': 'הסבר לאינסטלטור, ב-2–3 משפטים קצרים בעברית, למה \$altName יכול להיות החלפה ',
  't_fa0ab743': 'חיסכון ₪\${widget.savings}',
  't_f27486bc': 'חלופה: \${widget.altName} · ₪\${widget.altPrice}',
  't_d6132dbd': 'לאותו מוצר. לעולם אל תמציא מפרט, מספר או שם-מוצר שלא ניתן לך, ואל תטען שהזול ',
  't_6d8d9189': 'ניתנו לך, ואל תבטיח שהזול תמיד עדיף.',
  't_29c1a872': 'סבירה ל-\$recName לאותו מוצר, ומה הדבר האחד שכדאי לוודא לפני שקונים את הזול ',
  't_009989ad': 'תמיד עדיף — תן לקבלן להחליט.',
  't_edaf1387': '⚙️ המחירים מתוך נתוני-הקטלוג; ה-AI רק מנסח את ההשוואה.',
  't_a1c482c5': '💡 למה החלופה שווה?',
  't_63258930': ' (ריזרקולציה)',
  't_35ae7800': '\${r.criticalOpen} קריטי',
  't_0c94932e': '\${r.itemCount} פריטים',
  't_56c0583e': ';
// Live, in-app audit screen — generates 20 RANDOM installation scenarios
// each run and shows the auto-built plan + compliance result for each.
// Random anchors are sampled from the verified-spec catalog with bias
// toward diversity (supply vs drainage, hot vs cold, different materials),
// so every press of "הרץ" exercises a different slice of the engine.

import ',
  't_15fc3ad3': 'ΔP \${r.dropBar.toStringAsFixed(2)} בר',
  't_59f858e4': 'אודיט תרחישים',
  't_4ad86916': 'הקש "⚡ הרץ 20 תרחישי בדיקה" כדי להתחיל',
  't_0a89819a': 'מריץ \${_results.length}/20…',
  't_27568ebb': 'עדיין לא הורצו בדיקות',
  't_a5f826dc': '⚡ הרץ 20 תרחישי בדיקה',
  't_b57d0ef7': '❄ קר',
  't_fed30bc1': 's
/// a primary device modal (like a file picker), not a feature view.
class BarcodeScanner extends StatefulWidget {
  const BarcodeScanner({super.key});

  @override
  State<BarcodeScanner> createState() => _BarcodeScannerState();
}

class _BarcodeScannerState extends State<BarcodeScanner> {
  final MobileScannerController _ctl = MobileScannerController();
  final TextEditingController _manualCtl = TextEditingController();
  bool _done = false;

  @override
  void dispose() {
    _ctl.dispose();
    _manualCtl.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture cap) {
    if (_done) return;
    final code = cap.barcodes.firstOrNull?.rawValue;
    if (code == null || code.isEmpty) return;
    _done = true;
    Navigator.of(context).pop(code);
  }

  /// #1 — manual fallback: a typed מק"ט pops through the SAME path as a
  /// scanned barcode ([Navigator.pop] with the code String), so every caller
  /// of [openBarcodeScanner] is unchanged. Critical on desktop web / denied
  /// camera permission, where the camera feed never starts.
  void _submitManual() {
    if (_done) return;
    final code = _manualCtl.text.trim();
    if (code.isEmpty) return;
    _done = true;
    Navigator.of(context).pop(code);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: CfgText(',
  't_ddf330cb': 'הקלד מק"ט ידנית',
  't_5d99650d': 'חפש לפי מק"ט',
  't_688afe8c': 'סריקת ברקוד',
  't_7ad4b8ab': ' · הקש לעריכה',
  't_ea0e5f7e': ') + buf.toString();
}

const _ink = BsTokens.inkLight;
const _muted = Color(0xFF888888);
const _ok = Color(0xFF2E9E5B);
const _danger = Color(0xFFE03131);

// ─── screen: budget box → detail (openBudgetDetail :7189) ──────────────────────

/// Build entry `openBudget` — the project/site budget box + tappable detail.
class BudgetScreen extends ConsumerWidget {
  const BudgetScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const BudgetScreen());

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final b = ref.watch(budgetProvider);
    final over = b.left < 0;
    final catTotal =
        b.categories.fold<int>(0, (s, c) => s + c.amount).clamp(1, 1 << 30);
    // T6.3 — the "הוצאות לפי אתר" rows iterate the project list through the
    // server-ready site repository instead of the `kProjects` const directly.
    // The local impl returns kProjects verbatim, so the rows + their weighted
    // amounts are byte-identical; a future field-ops backend swaps in behind it.
    final projects = ref.watch(siteRepositoryProvider).projects();

    // #twin — "הוצאות לפי אתר": on the CONNECTED backend, sum the REAL orders by
    // their site (orders stamp `site = active project name` at checkout, so they
    // match the project rows). Demo/tests keep the illustrative weighting below
    // (byte-identical — no real backend to fold), fulfilling the on-screen
    // disclaimer',
  't_95907f8f': '* הנתונים להמחשה — בגרסה המלאה יתבססו על ההזמנות וההוצאות בפועל של הלקוח.',
  't_4bf25bc0': ', 0)]);
    _persist();
    return state.categories.length - 1;
  }

  // deleteCategory(:7273) — keep at least one.
  void deleteCategory(int i) {
    if (state.categories.length <= 1) return;
    final next = [...state.categories]..removeAt(i);
    state = state.copyWith(categories: next);
    _persist();
  }
}

final budgetProvider =
    StateNotifierProvider<BudgetNotifier, BudgetState>((ref) {
  // Seeds from + persists through the finance repo (T6.2 seam): local → the const
  // demo budget (byte-identical, ephemeral as always); connected → the HONEST
  // persisted budget — empty until the user sets one (no fabricated demo money),
  // round-tripped via `setBudget` and re-seeded when the snapshot lands. The
  // screen renders an empty budget gracefully (the `b.categories.isEmpty` branch).
  return BudgetNotifier(financeRepo());
});

// ─── helpers ──────────────────────────────────────────────────────────────────

/// #twin — Σ orders by `site` (the connected per-site spend). Pure → testable.
Map<String, int> budgetSpendBySite(List<Order> orders) {
  final m = <String, int>{};
  for (final o in orders) {
    m[o.site] = (m[o.site] ?? 0) + o.sum;
  }
  return m;
}

/// #twin — the demo/illustrative per-site weight (decreasing by index): the
/// verbatim shipped formula `spent*(count-index)/(count*(count+1)/2)`. Pure.
num illustrativeSiteSpend(num spent, int count, int index) =>
    count <= 0 ? 0 : spent * (count - index) / (count * (count + 1) / 2);

/// #twin — orders whose site matched NO project (the "אחר / ללא פרויקט" residual):
/// Σ all orders − Σ orders that landed on a known project name. Pure → testable;
/// the row only renders when this is `> 0`.
int budgetResidualSpend(Map<String, int> spendBySite, Iterable<String> projectNames) =>
    spendBySite.values.fold<int>(0, (s, v) => s + v) -
    projectNames.fold<int>(0, (s, n) => s + (spendBySite[n] ?? 0));

String _fmt(num n) {
  final r = n.round();
  // Sign before the ₪ symbol so a negative reads "-₪3,150", not "₪-3,150".
  return ',
  't_b1e94323': 'אחר / ללא פרויקט',
  't_8bccd14a': 'אין אתרים פעילים — הוסיפו פרויקט במסך הפרויקטים',
  't_c66eb488': 'אין קטגוריות עדיין — הקש "＋ הוסף" כדי להוסיף קטגוריה',
  't_a3621c2c': 'הוספת / הסרת הוצאה (₪)',
  't_6d7b94c7': 'הוסרה הוצאה: ₪\${_thousands(amt)}',
  't_2f7a2f80': 'הוצא',
  't_5ed5182e': 'הוצא עד כה',
  't_7b02d6e7': 'הוצאות לפי אתר',
  't_ee7880fa': 'הקטגוריה נמחקה',
  't_cdfd37e6': 'הקטגוריה נשמרה',
  't_c45d4f4f': 'הקטגוריה תימחק מהתקציב לצמיתות.',
  't_445fbf54': 'התקציב עודכן',
  't_600b1b45': 'חריגה מהתקציב',
  't_cda1413e': 'יש להזין מספרים תקינים',
  't_f367b689': 'יש להזין סכום',
  't_44d82189': 'יש להזין סכום תקין',
  't_9fa9ef12': 'יש להזין שם קטגוריה',
  't_061dbed8': 'מבוסס על ההזמנות בפועל לפי אתר.',
  't_1e3df3e2': 'מהתקציב נוצל',
  't_2125a850': 'מחיקת קטגוריה?',
  't_88818536': 'נוספה הוצאה: ₪\${_thousands(amt)}',
  't_1fec850c': 'נשאר',
  't_8c8832bf': 'סכום (₪)',
  't_e8b79290': 'עריכת קטגוריה',
  't_340283ae': 'עריכת תקציב',
  't_c7e4d48c': 'פירוט הוצאות לפי קטגוריה',
  't_17eb2dd1': 'קטגוריה חדשה',
  't_b12fc0b1': 'שם הקטגוריה',
  't_69b83be2': '− הסר הוצאה',
  't_c3056dba': '⚠️ ההוצאות חרגו מהתקציב ב-\${_fmt(-b.left)}. כדאי לעדכן את התקציב או לבדוק הוצאות.',
  't_3163596a': '✏️ עריכת התקציב',
  't_c882ba56': '🗑️ מחיקת קטגוריה',
  't_89fbbfca': '＋ הוסף',
  't_473753a6': '＋ הוסף הוצאה',
  't_d1378085': 'אתה יועץ-עסקי מנוסה לאינסטלטור. אתה מנסח סיכום-עסקי קצר וברור מתובנות שכבר ',
  't_abbcf329': 'החיסכון-האפשרי והתקציב, ומה כדאי לשים לב אליו. השתמש אך ורק במספרים ',
  't_a18c351d': 'התובנות שחושבו:',
  't_131550db': 'חושבו. השתמש אך ורק במספרים שניתנו לך; לעולם אל תמציא, תשנה או תוסיף מספר.',
  't_60ccdb99': 'נסח מהן סיכום-עסקי קצר וזורם בעברית (2–4 משפטים) — מצב ההזמנות, הכסף, ',
  't_017f77ca': 'שניתנו לך — אל תמציא, תשנה או תוסיף שום מספר.',
  't_9673a225': '⚙️ המספרים מנתוני-המערכת; ה-AI רק מנסח אותם לסיכום.',
  't_f6d4ceae': '✨ סיכום עסקי',
  't_03cd7843': '💡 הסיכום החכם דורש חיבור לשרת.',
  't_8f64c894': 's context (captured before the pop) — the
      // same pattern as _onDetect; toasting on `context` after popping this
      // screen reaches a defunct element and silently drops (no "נקלטה").
      final rootCtx = Navigator.of(context, rootNavigator: true).context;
      Navigator.of(context).pop(dataUrl); // deliver the REAL capture
      showToast(rootCtx, ',
  't_7a41221b': 'אין פלאש במכשיר',
  't_44291ad2': 'אישור מסירה',
  't_d871310b': 'אתר A',
  't_7fe16c1f': 'הפקת ברקוד',
  't_a54e469f': 'הקוד \$code לא נמצא במק"ט',
  't_3bd06e83': 'כוון לאזור הצילום',
  't_ef94b096': 'כוון לברקוד',
  't_93d99832': 'כוון לפריט',
  't_f8dfbcc5': 'כל הגלריה',
  't_5c3b7a69': 'להשתמש בתמונה הזו?',
  't_9ccb682c': 'לפני/אחרי',
  't_da783db1': 'מהנדס',
  't_51babf88': 'פותח…',
  't_5baa03dc': 'פלאש',
  't_10f84f5c': 'צילום משימה',
  't_88698353': 'צלם \$label',
  't_cbdb4d35': 'צלם את המשימה',
  't_3ca3d316': 'צלם הוכחת מסירה',
  't_ab214116': 'תצוגה מדומה — תמונת דמו',
  't_ab894983': 'תצוגה מקדימה: \$label',
  't_e1b99f41': '📸 תצוגה מקדימה',
  't_d98ea9c8': ' may be a Huliot/PPR product
    // (they share the lip: prefix), so resolve + sibling-list over resolvedCatalogProducts.
    // stage-3.1 — follows the ACTIVE catalog source (v2-aware).
    final i = resolvedCatalogProducts.indexWhere((p) => p.sku == sku);
    if (i >= 0) {
      final product = resolvedCatalogProducts[i];
      final siblings = resolvedCatalogProducts
          .where((p) => p.categoryHe == product.categoryHe)
          .toList();
      showLipskeyProductSheet(context, product, siblings);
      return;
    }
  }
  final s = kSmartProducts.indexWhere((p) => p.key == key);
  if (s >= 0) {
    _SmartTreeProductList._openProductSheet(context, kSmartProducts[s]);
  }
}

/// Compact display for a cart line in the recent-add bubble: a short product
/// name (the type noun + qualifier, e.g. "ברז כפול") with its distinguishing
/// attributes below (brand model · colour · supplier). Falls back to the full
/// product name when it can',
  't_ba53e6c0': '\$count מוצרים בעץ',
  't_8224ff1d': '\$variants גרסאות',
  't_6ce44274': '\${_hotOnly ? "✓ " : ""}🌡 מים חמים בלבד',
  't_14918df9': '\${_metallicOnly ? "✓ " : ""}💎 מתכת בלבד',
  't_d017240b': '\${_treeNodeCount(node, system)} מוצרים · ליפסקי ברקן',
  't_78db888c': '\${families.length} משפחות וריאנטים',
  't_b61c9b68': '\${family.count} וריאנטים · \${kAttrKindLabel[family.kind]} שונה · [\${family.categoryHe} / \${family.brand}]',
  't_9ebb9123': '\${fit.connects > 0 ? "מתחבר ל-\${fit.connects} מהם" : "אין חיבור ישיר לפריטי הקו"}',
  't_766681b8': '\${hw.suitable}/\${hw.total} מותגים מתאימים  ↻',
  't_72fa8fd2': '\${items.length} חיפושים אחרונים',
  't_32b67835': '\${kit.must} חובה · \${kit.optional} אופ׳ · \${kit.tools} כלים',
  't_a108185c': '\${node.brandIds.length} מותגים',
  't_1098809b': '\${p.brands.length} דגמים זמינים',
  't_77463ca7': '\${p.name} · \${brand.name} (+\${selectedAcc.length} אביזרים) נוסף לסל 🛒',
  't_bad8ac8c': '\${products.length} מועדפים',
  't_eb921455': '\${versions.length} גרסאות',
  't_542fa88f': '(לא מסווג)',
  't_d3c7fe95': '(מוצר ₪\${groupThousands(c.product)} · אביזרים ₪\${groupThousands(c.accessories)} · עבודה ₪\${groupThousands(c.labour)})',
  't_c88a2c9f': ') that product names actually use, so a
/// Hebrew-keyboard query like `1/2״` still matches a `1/2"` product.
String _normForSearch(String s) =>
    s.toLowerCase().replaceAll(',
  't_5a9f9c1e': '))) {
      final wN = _normForSearch(w);
      if (wN.length < 2 || wN == fragN || !wN.startsWith(fragN)) continue;
      freq[w] = (freq[w] ?? 0) + 1;
    }
  }
  // Most-frequent first, then א-ת; de-dupe by normalized form.
  final words = freq.keys.toList()
    ..sort((a, b) {
      final c = freq[b]!.compareTo(freq[a]!);
      return c != 0 ? c : a.compareTo(b);
    });
  final seen = <String>{};
  final out = <String>[];
  for (final w in words) {
    if (!seen.add(_normForSearch(w))) continue;
    out.add(',
  't_69c5b81f': '));
  }
  return out.toList();
}

/// Distinct "type" words — the first distinguishing word in each brand name
/// (shared words and sizes excluded).
List<String> _deriveBrandTypes(List<SmartBrand> brands) {
  if (brands.length < 2) return const [];
  final toks = brands.map((b) => _facetTokens(b.name)).toList();
  final shared = toks.first.toSet();
  for (final t in toks.skip(1)) {
    shared.retainAll(t.toSet());
  }
  final out = <String>{};
  for (final t in toks) {
    for (final w in t) {
      if (!shared.contains(w)) {
        out.add(w);
        break;
      }
    }
  }
  return out.toList();
}

/// Collapsible section with a header (title + selected value + chevron).
class _SheetSection extends StatelessWidget {
  const _SheetSection({
    required this.title,
    required this.value,
    required this.expanded,
    required this.onToggle,
    required this.child,
  });
  final String title;
  final String value;
  final bool expanded;
  final VoidCallback onToggle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        InkWell(
          onTap: onToggle,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: BsTokens.inkLight,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                if (value.isNotEmpty)
                  Flexible(
                    child: Text(
                      value,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.end,
                      style: const TextStyle(
                        color: BsTokens.brand,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                const SizedBox(width: 6),
                Icon(expanded ? Icons.expand_less : Icons.expand_more,
                    color: const Color(0xFF888888), size: 20),
              ],
            ),
          ),
        ),
        AnimatedCrossFade(
          firstChild: Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: child,
          ),
          secondChild: const SizedBox(width: double.infinity),
          crossFadeState:
              expanded ? CrossFadeState.showFirst : CrossFadeState.showSecond,
          duration: const Duration(milliseconds: 180),
        ),
      ],
    );
  }
}

/// Single-select chip row used by the סוג / מידה selectors.
class _ChipWrap extends StatelessWidget {
  const _ChipWrap({
    required this.options,
    required this.selected,
    required this.onSelect,
  });
  final List<String> options;
  final String? selected;
  final void Function(String) onSelect;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final o in options)
          GestureDetector(
            onTap: () => onSelect(o),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: selected == o ? BsTokens.brand : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: selected == o
                      ? BsTokens.brand
                      : const Color(0xFFC8C8CE),
                ),
              ),
              child: Text(
                o,
                style: TextStyle(
                  color: selected == o ? bsOnAccent(context) : const Color(0xFF6E6E73),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

/// Polish G — visual UI for a saved card-version (Roadmap step 76).
/// Two tap targets: the label loads the saved brand into the card; the small
/// "×" deletes the version. Matches the existing violet palette of the
/// "💾 שמור גרסה" button so the relationship is obvious.
class _SavedVersionChip extends StatelessWidget {
  const _SavedVersionChip({
    required this.label,
    required this.onLoad,
    required this.onDelete,
  });

  final String label;
  final VoidCallback onLoad;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFEDE9FE),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Tooltip(
            message: ',
  't_e79c2269': '),
      itemCount: cats.length,
      separatorBuilder: (_, __) => const Divider(
        height: 1,
        indent: 76,
        color: Color(0xFFF5F5F5),
      ),
      itemBuilder: (context, i) => _CatalogRow(cat: cats[i]),
    );
  }
}

// ── Lipskey supplier card — pinned at top of catalog list ────────────────────
// ── Featured product card — shown at top of main catalog list ────────────────
CatalogNode? _findCatalogTreeNodeByTitle(String title) {
  for (final n in kCatalogTree) {
    if (n.title == title) return n;
  }
  return null;
}

/// Smart-nav: switch to the catalog tab and drill into [categoryTitle], so a
/// tapped category suggestion takes the user straight to those products.
void openCatalogCategory(WidgetRef ref, String categoryTitle) {
  ref.read(mainTabProvider.notifier).state = 0; // catalog tab
  // Company overlay: an imported category resolves to a synthetic product
  // leaf (same fallback as _CatalogRow.onTap) — never the "בקרוב" placeholder.
  final node = _findCatalogTreeNodeByTitle(categoryTitle) ??
      (companyCatalogActive
          ? CatalogNode(
              id: ',
  't_02d52cba': ');

/// Selected facet labels (in order) while drilling inside a faceted leaf.
final catalogFacetProvider = StateProvider<List<String>>((_) => const []);

// [ProductSort], [catalogProductSortLabel] and [catalogProductSortProvider]
// now live in state/catalog_settings.dart (the live sort is seeded from the
// persisted מיון ברירת מחדל user default).

/// The keyboard',
  't_9bbec174': ');

/// The seven one-letter Hebrew clitic prefixes (the מש״ה־וכל״ב set) that attach
/// to the front of a word — הברז, באמבטיה, לדוד. A query token may sit one of
/// these past a word start, so "דוד" still finds "הדוד".
const String _kHebrewPrefixes = ',
  't_7e504773': ');
      return (name: name, attrs: attrs);
    }
  }
  return (name: line.productName, attrs: line.brandName);
}


/// Currently selected category in the "קטגוריות" drill. Null = show all 11 cats.
final catalogDrillCatProvider = StateProvider<String?>((_) => null);

/// In-tab catalog-tree drill stack (kCatalogTree). Empty = not drilling.
/// Kept inside the catalog tab so the app bar and bottom nav stay fixed.
final catalogTreePathProvider =
    StateProvider<List<CatalogNode>>((_) => const []);

/// Search query within the current drill level (scoped to its subtree).
final catalogTreeQueryProvider = StateProvider<String>((_) => ',
  't_b15d61bf': ');
  final tokens = q.split(_wsSplit).where((t) => t.isNotEmpty).toList();
  if (tokens.isEmpty) return false;
  bool hit(String t) {
    if (_tokenHitHe(hay, t)) return true;
    final alts = kSearchSynonyms[t];
    return alts != null &&
        alts.any((a) => _tokenHitHe(hay, _normForSearch(a)));
  }

  return requireAll ? tokens.every(hit) : tokens.any(hit);
}

/// Relevance score for ranking search results (higher = better): a name match
/// beats a category-only match beats a synonym/colour match, so the product the
/// user actually meant surfaces first (e.g. a toilet seat above a toilet-branch
/// connector for "שירותים"). Used as the default sort when a query is present.
int searchRelevance(LipskeyCatalogProduct p, String rawQuery) {
  final q = _normForSearch(rawQuery.trim());
  if (q.isEmpty) return 0;
  final name = _normForSearch(p.nameHe);
  final cat = _normForSearch(p.categoryHe);
  final color = _normForSearch(p.color ?? ',
  't_887820c2': ',
                                        style: TextStyle(
                                            color: prog.isDone(p.key, i)
                                                ? const Color(0xFF047857)
                                                : const Color(0xFF475569),
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w700)),
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
                // ── Selectors: מותג / סוג / מידה (collapsible) ──
                _SheetSection(
                  title: ',
  't_5de40ff6': ',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                          color: Color(0xFF888888),
                                          fontSize: 11)),
                                ),
                            ],
                          );
                        }),
                        // Roadmap step 76 — config versioning (save+compare).
                        if (expert)
                          Builder(builder: (_) {
                            ref.watch(cardVersionsProvider);
                            final notif =
                                ref.read(cardVersionsProvider.notifier);
                            final versions = notif.forProduct(p.key);
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      // composite-hide: org hiding this id drops the whole "💾 שמור גרסה" action, not orphaned chrome
                                      CfgVisible(',
  't_9f7e6905': ',
                    expanded: _sizeOpen,
                    onToggle: () => setState(() => _sizeOpen = !_sizeOpen),
                    child: _ChipWrap(
                      options: sizes,
                      selected: _selSize,
                      onSelect: (v) => setState(() {
                        _selSize = _selSize == v ? null : v;
                        // Roadmap step 7 — persist filter selection per product.
                        ref
                            .read(cardFilterStateProvider.notifier)
                            .setSize(widget.product.key, _selSize);
                        _applyFilterSelection();
                      }),
                    ),
                  ),

                // 📦 נתוני קטלוג — spec / compat / price of the selected
                // brand',
  't_15652f82': ',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}


// Small colored pill: a label with its count at the end (e.g. "חובה 3").
class _CountBadge extends StatelessWidget {
  const _CountBadge({
    required this.label,
    required this.count,
    required this.color,
  });
  final String label;
  final int count;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        ',
  't_a7b7e335': ',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF888888), fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}

/// OWNER POLICY (B4): a top category is shown only when it actually leads to
/// content. A `kCatalogCats` title with no matching `kCatalogTree` node (or a
/// node with an empty subtree) would drill straight into the `_TreeComingSoon`
/// "בקרוב — הקטגוריה הזו בבנייה" placeholder; the App Store rejects visible
/// content-less / "coming soon" surfaces, so those tiles are filtered out of
/// the browse list. Reversible data filter (mirrors wave-1',
  't_80a821e3': ',
      };
      bus.track(IntelEvents.searchSubmit, props: props);
      final noResults = ref.read(diveResultsProvider).isEmpty &&
          kVisibleSearchIndex.where((e) => e.matches(q)).isEmpty;
      if (noResults) bus.track(IntelEvents.searchNoResult, props: props);
    });

    // Live DIVE (owner): when the floating keyboard has a query, the catalog
    // body shows the NATIVE narrowed product list — the app dives in place.
    // BUT a wheel-finder section (מאתר-על / מאתר פשוט) is its OWN finder and holds
    // ephemeral in-progress dive state, so a stray 2-char keystroke must NOT swap it
    // out for the text-dive (which would unmount the wheel and discard the dive).
    final diveSection = ref.watch(catalogSectionProvider);
    final wheelFinder = (kAxisDive && diveSection == ',
  't_b46cc15f': ', children: kCatalogTree);

/// Apply a [ProductSort] to a product list (pure — returns a new list, leaves
/// the source order for [ProductSort.byOrder]). This is the single ordering the
/// catalog list + the persisted מיון ברירת מחדל default both flow through.
List<LipskeyCatalogProduct> sortCatalogProducts(
    List<LipskeyCatalogProduct> list, ProductSort s) {
  if (s == ProductSort.byOrder) return list;
  final out = [...list];
  switch (s) {
    case ProductSort.nameAZ:
      out.sort((a, b) => a.nameHe.compareTo(b.nameHe));
    case ProductSort.nameZA:
      out.sort((a, b) => b.nameHe.compareTo(a.nameHe));
    case ProductSort.sku:
      out.sort((a, b) => a.sku.compareTo(b.sku));
    case ProductSort.byOrder:
      break;
  }
  return out;
}

/// One facet option: a [label] chip and the [keyword] that must appear in the
/// product name. A null [keyword] means "none of the other keywords in the
/// group" (e.g. כללי = not-למקלחת).
typedef ProductFacet = ({String label, String? keyword});

/// Ordered facet groups per lipskey leaf category. Drilling a faceted leaf
/// splits its products by these groups before showing the product list.
const Map<String, List<List<ProductFacet>>> kProductFacets = {
  ',
  't_5ecbfd2b': ', items: _genderCounts(), provider: variantsSizeGenderProvider);
    }
  }
}

/// Two-level browser for קוטר: top row shows materials (HDPE/נחושת/PVC/...),
/// click a material to see only the diameter atoms used by products of that
/// material.
class _MaterialDiameterBrowser extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final active = ref.watch(variantsActiveSubGroupProvider);
    final selected = ref.watch(variantsSizeDiameterProvider);

    // Build material → (atom → count) for products in size families.
    final perMat = <String, Map<String, int>>{};
    for (final fam in familiesByKind(AttrKind.size)) {
      for (final p in fam.products) {
        final mat = productMaterial(p);
        final byAtom = perMat.putIfAbsent(mat, () => <String, int>{});
        for (final a in sizeDiameterAtoms(variantValue(p, AttrKind.size))) {
          byAtom[a] = (byAtom[a] ?? 0) + 1;
        }
      }
    }
    final materials = perMat.entries.toList()
      ..sort((a, b) {
        final ta = a.value.values.fold<int>(0, (s, v) => s + v);
        final tb = b.value.values.fold<int>(0, (s, v) => s + v);
        return tb.compareTo(ta);
      });

    void toggleAtom(String material, String a) {
      final key = ',
  't_8604aa3b': ', style: TextStyle(color: Color(0xFF8A8A8A), fontWeight: FontWeight.w700, fontSize: 12)),
                      ),
                    Padding(
                      padding: const EdgeInsetsDirectional.only(start: 4),
                      child: _FacetChip(
                        label: group[i].\$1,
                        count: group[i].\$2,
                        isSelected: selected.contains(group[i].\$1),
                        onTap: () => toggleValue(group[i].\$1),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
      ],
    );
  }
}

List<(String value, int count)> _patternCounts() {
  final freq = <String, int>{};
  for (final fam in familiesByKind(AttrKind.size)) {
    for (final p in fam.products) {
      final v = variantValue(p, AttrKind.size);
      if (v.isEmpty) continue;
      final k = sizeStructurePattern(v);
      freq[k] = (freq[k] ?? 0) + 1;
    }
  }
  final out = freq.entries.map((e) => (e.key, e.value)).toList()..sort((a, b) => b.\$2.compareTo(a.\$2));
  return out;
}

/// Counts of distinct PRODUCT TYPES in size families. Used under axis "מבנה"
/// (renamed) so the user sees זווית/טי/מאסף/... instead of the old system.
List<(String value, int count)> _systemCounts() {
  final freq = <String, int>{};
  for (final fam in familiesByKind(AttrKind.size)) {
    final t = fam.products.first.productType ?? ',
  't_c90f94b3': '1 יציאה',
  't_dcbee42b': '2 יציאות',
  't_bfe6aa7e': '3 יציאות',
  't_76ae40c7': ';

/// Word-boundary-aware token match — the replacement for a raw `hay.contains`.
/// [token] hits [hay] when it is the prefix of some whitespace-delimited word in
/// [hay], or of that word past a single Hebrew clitic prefix. This keeps the
/// prefix/plural hits a forgiving search needs ("ברז"→"ברזים", "דוד"→"הדוד")
/// while dropping the mid-word substring false-positives a plain `contains`
/// produced — so "דוד" no longer drags in "בידוד". Numeric/size tokens (1/2")
/// keep working: they are whole space-delimited words, matched by the prefix arm.
bool _tokenHitHe(String hay, String token) {
  if (token.isEmpty) return false;
  for (final w in hay.split(_wsSplit)) {
    if (w.startsWith(token)) return true;
    if (w.length > token.length &&
        _kHebrewPrefixes.contains(w[0]) &&
        w.substring(1).startsWith(token)) {
      return true;
    }
  }
  return false;
}

/// Forgiving product match for the search bar: a non-technical user types plain
/// words ("ברז מטבח", "ניקוז", "שירותים") and the app does the finding — without
/// them knowing the catalogue',
  't_8b33225b': ';
  return _treeNodeSummaryCache[key] ??= (
    count: _treeNodeCount(node, system),
    desc: _treeNodeDesc(node, system),
  );
}

/// The engine-derived "נתוני קטלוג" facts a card shows for a product: each of
/// these is an O(catalog)-scale sweep (`compatibleProductsFor` ≈ O(855);
/// `installKitFor` + `variantSiblingsCountFor` touch the whole catalog), so the
/// card',
  't_795525ee': 'BOM פרויקט "\$project" — \${plan.items.length} פריטים',
  't_a5c27488': 's REAL verified ends). gateway null → not
                                // in the tree → byte-identical demo.
                                if (aiOn)
                                  // a11y (swarm): expose a button role to a11y.
                                  // composite-hide: org hiding this id drops the whole "🔌 איך לגשר?" action, not orphaned chrome
                                  CfgVisible(',
  't_05ababfc': 's build tree.
              // B4: only offer categories that lead to content, so a curated
              // list can never route into the `_TreeComingSoon` "בקרוב"
              // placeholder (owner policy: no content-less surface in release).
              final cats = ref
                  .watch(catalogRepositoryProvider)
                  .catalogCategories()
                  .where((c) => categoryHasContent(c.title))
                  .toList();
              return ListView.builder(
                controller: scrollCtrl,
                itemCount: cats.length,
                itemBuilder: (_, i) {
                  final cat = cats[i];
                final checked = _selected.contains(cat.title);
                return CheckboxListTile(
                  value: checked,
                  onChanged: (v) => setState(() {
                    if (v ?? false) {
                      _selected.add(cat.title);
                    } else {
                      _selected.remove(cat.title);
                    }
                  }),
                  controlAffinity: ListTileControlAffinity.leading,
                  activeColor: BsTokens.brand,
                  checkColor: Colors.white,
                  tileColor: Theme.of(context).colorScheme.surface,
                  title: Row(
                    children: [
                      Text(
                        cat.emoji,
                        style: const TextStyle(fontSize: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          cat.title,
                          style: const TextStyle(
                            color: BsTokens.inkLight,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
                },
              );
            }),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
        ],
      ),
      ),
    );
  }
}

IconData _sectionIcon(String label) => switch (label) {
      ',
  't_550e05c6': 's query. AND-tokens → OR → fuzzy; system-filtered +
/// sorted; capped at 40. Empty until the query reaches 2 chars.
final diveResultsProvider = Provider<List<LipskeyCatalogProduct>>((ref) {
  final query = ref.watch(keyboardDiveQueryProvider).trim();
  if (query.length < 2) return const [];
  final sort = ref.watch(catalogProductSortProvider);
  final systemFilter = ref.watch(catalogSystemFilterProvider);
  var matched = resolvedCatalogProducts
      .where((p) => catalogProductMatchesQuery(p, query))
      .toList();
  // Query RESCUE ([kGlobalSearch] const-false-FIRST ⇒ the whole block folds out
  // when off, byte-identical). Fires ONLY when the literal query found nothing, so
  // it can never bury or reorder a working search. Two rescues, UNIONED so every
  // real synonym surfaces together:
  //   • Hebrew morphology — a plural query ("ברזים") → its singular ("ברז").
  //   • Plumber slang — a trade / loan word ("אלבו", "valve") → the catalog',
  't_31a0c605': 's search BAR + panel are deleted — the floating keyboard
        // IS the search now (its 🔍 חיפוש tool starts a fresh typed search, and the
        // live dive narrows the catalog underneath). No separate search chrome.
        if (diveActive)
          const Expanded(child: _DiveResultsView())
        else
          // OWNER: the section-pill row is deleted — its lists + all their options
          // now live in the keyboard (tab-0 chips + the ',
  't_234358bc': 's searchQueryProvider = entry.title).
        ref.read(keyboardDiveQueryProvider.notifier).state = entry.title;
      },
    );
  }
}

// Body — switches between the full catalog list (הכל) and a per-section view.
// Non-הכל sections render a header (label + edit button) above either the
// filtered list or an empty state, so the edit affordance is always visible.
class _CatalogBody extends ConsumerWidget {
  const _CatalogBody({this.scrollCtrl});
  final ScrollController? scrollCtrl;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final active = ref.watch(catalogSectionProvider);
    if (active == ',
  't_33316a0b': 's word for it. Values are tokens also tried against the
/// product haystack — all real catalogue vocabulary (search aliasing, not new
/// data: R8 untouched).
const Map<String, List<String>> kSearchSynonyms = {
  // precise toilet-fixture tokens — NOT bare "אסלה", which also lives in
  // connector categories (מסעפים וחיבורי אסלה / זקיף אסלה) and over-matched.
  ',
  't_d5ac2d42': '~\${eff.minutes} דק׳ · \${eff.difficulty}',
  't_c9bd6d33': '×3 חדרים',
  't_58ac87e5': 'אביזרי קצה וחיבורים',
  't_ecfee8e9': 'אין מותג תואם לסינון שנבחר',
  't_44939e27': 'אין משפחות וריאנטים',
  't_04ad89c0': 'אין פריטים שניתן לפתור לקו ב"\$project"',
  't_9e312bde': 'אין תוצאות תואמות',
  't_c1926437': 'אמבט',
  't_629111e2': 'אסל',
  't_7c465022': 'בדיקת קבלה (סיום התקנה)',
  't_da77ea6b': 'בורר טמפ׳ תצוגה · טאפ למחזר: 60°C → 80°C → 95°C → 60°C. משפיע על "מותגים מתאימים".',
  't_d49cbbd6': 'בחר אילו פריטים יופיעו ברשימה',
  't_f059fbf3': 'בחר מידה',
  't_ced30d23': 'בחר סוג',
  't_8892173b': 'בנייה ומחיצות',
  't_dbf3795c': 'ברזים וכיורים',
  't_36188af9': 'גופי תברואה',
  't_94a25e55': 'גינ',
  't_106f02a1': 'גינון',
  't_15f5cb03': 'גמר',
  't_b51595f8': 'גרסאות נוספות במשפחה (\${fam.length})',
  't_e355586b': 'דגמים',
  't_49c624ed': 'דלוחין',
  't_8d1d778c': 'הבחירות שסימנת לא יישמרו.',
  't_dc240f6e': 'הגדרה מראש',
  't_3e1465d7': 'הוחלה תבנית "\${t.name}" (\${t.products.length} פריטים)',
  't_e08144c4': 'הוסף את המוצר לפרויקט',
  't_46700395': 'הוסף את הקו לסל כולל פריטי בטיחות',
  't_f1593ea6': 'הוסף לסל · ₪\${groupThousands(_total)}',
  't_c3425511': 'הוספה',
  't_9173032a': 'הורידו תבנית, מלאו והעלו — והאפליקציה תעבוד על הקטלוג שלכם',
  't_bcc22807': 'החלף טמפ׳ תצוגה (60/80/95)',
  't_bc80c954': 'החלף מצב הצגה (מורחב או פשוט)',
  't_6a1b3145': 'החלף סוג משתמש (DIY/קבלן/מקצועי)',
  't_320dd19f': 'החלף סוג פרויקט (קר/חם/מסחרי)',
  't_f5829774': 'הסבר איזה מתאם מגשר',
  't_cf56e937': 'הסתר',
  't_1d0f564e': 'העתק הצעת מחיר לזיכרון — מחיר + מק"ט + מותג, מוכן ל-WhatsApp',
  't_b27b1829': 'הפרויקט שלי',
  't_193535e0': 'הצג',
  't_96f42469': 'הצעת המחיר הועתקה',
  't_65702a6a': 'הצעת מחיר לפרויקט הועתקה',
  't_81dae9d6': 'הקו נוסף לסל (+\${kit.length} פריטי בטיחות)',
  't_5c567b63': 'הקטגוריה הזו בבנייה — תת-קטגוריות ומוצרים יתווספו בקרוב.',
  't_b3a311e5': 'הרשימה "\$s" תימחק לצמיתות.',
  't_3de8250d': 'השקיה',
  't_a7610847': 'התראה',
  't_66cac148': 'ז',
  't_4820787d': 'ז.ז',
  't_d7319e81': 'ז.נ',
  't_bbddb768': 'חדר 1',
  't_feb5bc99': 'חדר 2',
  't_97d960e8': 'חדר 3',
  't_104eadb3': 'חימום מים',
  't_c5ffbfc9': 'טמפ׳ מרבית',
  't_88a26163': 'טעויות נפוצות וטיפים',
  't_22198a1d': 'טען גרסה \$label',
  't_22a049b1': 'יצירת רשימה מותאמת אישית',
  't_94faa939': 'כל היסטוריית החיפושים תימחק.',
  't_d84a86bd': 'לא נמצאו תוצאות עבור "\$query"',
  't_8b9582f6': 'למה צריך:',
  't_ed790f29': 'מבנה',
  't_a71d390f': 'מה הקו צריך לחיבור',
  't_2ba7f40f': 'מוסתר — מוסתר מהקטלוג',
  't_9267690b': 'מוצרים משלימים נפוצים: \${types.join(" · ")}',
  't_37c8fc4d': 'מחיקת רשימה?',
  't_4344ca36': 'מחיר ליחידה:',
  't_4623679b': 'מחק גרסה',
  't_57738664': 'מחק גרסה \$label',
  't_38b2339a': 'מידע על האביזר',
  't_71084f4c': 'מיון לפי',
  't_0f433d83': 'מיון לפי:',
  't_8bc7fa02': 'מין',
  't_7dc41846': 'מעקב התקנה — \$done/\${p.stages.length} שלבים בוצעו',
  't_86f82f2a': 'מצב מורחב — מציג את כל המפרט. טאפ לפישוט.',
  't_0b7d0455': 'מצב מורחב ▾',
  't_6f2c0e59': 'מצב פשוט — מסתיר פרטים הנדסיים. טאפ להרחבה.',
  't_de2d539b': 'מצב פשוט ▸',
  't_4c175f13': 'מק"ט יצרן',
  't_218486e1': 'מקלחות ואמבטיות',
  't_cf9dd33f': 'מתי לבחור איזה מותג',
  't_2a0c2518': 'נ.נ',
  't_7efde4f1': 'נוסף ל"\$proj" · \$loc',
  't_97492f30': 'נוסף ל-3 חדרים',
  't_5f3f93d1': 'נטען: "\${v.label}"',
  't_638fccad': 'ניהול רשימות',
  't_43a5c1e1': 'ניקוז וצנרת',
  't_18692f72': 'ניקוי כל החיפושים?',
  't_00fe8197': 'נסח הצעה מקצועית',
  't_29fbfe66': 'נסח הצעה מקצועית עם AI — מוכן לשליחה ללקוח',
  't_88c55018': 'נצפו לאחרונה',
  't_d6b5750f': 'נשמר: "\${brand.name}"',
  't_633105ca': 'סוג פרויקט · טאפ למחזר: כל פרויקט / מערכת קרה / מערכת חמה / מסחרי',
  't_7a0544a5': 'עמידות',
  't_e10976bd': 'פתח קו פריטים מומחש',
  't_f8db870c': 'ציון \${s.score} · \${s.label}',
  't_8ca6768f': 'קו מוצע — \${items.length} פריטים',
  't_84e43e8d': 'קוטר מינ׳',
  't_13ccc2f1': 'קוטר/אורך',
  't_fba58739': 'קצוות',
  't_fc2a34fe': 'רחצה',
  't_46106bf5': 'רמת משתמש · טאפ למחזר: DIY (חובב) / קבלן / מקצועי. רמת ההסבר מתאימה עצמה.',
  't_d64cd3ea': 'רשימה חדשה',
  't_b117fa76': 'שטיפה',
  't_2b7cb080': 'שינוי שם הרשימה',
  't_35aaa539': 'שמור את התצורה הזו (מותג נוכחי) כמועדפת',
  't_040fa5e9': 'שמור גרסת תצורה',
  't_a99e11a9': 'שמור תצורה כמועדף',
  't_6fe36e05': 'תבניות:',
  't_476d7320': 'תיקני',
  't_7d9198a7': 'תלי',
  't_cbd42ec0': 'תעלת',
  't_0a6f5721': 'תצורה שמורה — טאפ להסיר ממועדפים',
  't_0a547670': 'תקינות נדרשת',
  't_4a857809': 'תקן ישראלי רלוונטי',
  't_deeda996': '★ נשמר',
  't_0eb875cb': '☆ שמור',
  't_f41a4dd0': '⚠ \${plan.gaps.length} פערים ללא חיבור ישיר',
  't_c3f6833b': '⚡ פריט חובה',
  't_ac7b5f91': '⚡ פריטי חובה',
  't_d630d39d': '✨ נסח',
  't_52d5e125': '➕ הוסף לפרויקט',
  't_f71adaf5': '⤵ האביזרים לשלב "\${p.stages[widget.activeStage!].label}" — הקש שוב לביטול',
  't_797e25d8': '🌡 מים חמים (\${hw.tempC}°C): ',
  't_f989bcd2': '🎯 ציון קו \${lineScore.score} · \${lineScore.label}  ·  💧 ΔP ~\${pd.dropBar.toStringAsFixed(2)} bar',
  't_5ea0cd95': '💡 אופציונלי',
  't_c9268ad5': '💡 הקש על שלב כדי להדגיש את האביזרים שלו',
  't_1297eaef': '💡 פריטים אופציונליים',
  't_a74c2376': '💰 חלופה זולה יותר: \${alt.name} (~₪\${groupThousands(alt.price)})',
  't_c94aeaa7': '💾 שמור גרסה',
  't_9953a37c': '📋 BOM פרויקט מלא',
  't_0dac3823': '📋 בפרויקט "\$proj": \$units יחידות · \$locs מיקומים',
  't_a96b6a5f': '📋 הצעה',
  't_6154ea01': '📋 הצעת מחיר לפרויקט',
  't_954d03e9': '📦 נתוני קטלוג',
  't_a521d719': '🔌 מתאם מומלץ: \${adapter.nameHe}',
  't_0daa4520': '🔗 מתחבר ל-\${compat.length} מוצרים',
  't_68a7e67d': '🔗 שרשרת: \$text',
  't_ff35c779': '🔧 בנה לי קו (BOM)',
  't_ea9fe4fb': '🛒 + בטיחות לסל',
  't_7026bcd6': '🛡 ערכת בטיחות (auto): \${kit.map((p) => p.nameHe).take(4).join(" · ")}',
  't_0d5896ed': '🧩 בקו שלך: \${cart.length} פריטים · ',
  't_8af48c6c': '🧮 עלות קו משוערת: ~₪\${groupThousands(c.total)}  ',
  't_7d014ed8': ' ק"מ',
  't_1a6c07c2': '\$ דולר',
  't_c225488a': ',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
          title: Text(
            title,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          children: _visibleChildren,
        ),
      ),
    );
  }
}

class _SwitchRow extends StatelessWidget {
  const _SwitchRow({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      title: Text(label, style: const TextStyle(color: BsTokens.inkLight)),
      value: value,
      activeColor: BsTokens.brand,
      onChanged: onChanged,
    );
  }
}

class _RadioGroupRow<T> extends StatelessWidget {
  const _RadioGroupRow({
    required this.label,
    required this.value,
    required this.options,
    required this.onChanged,
  });

  final String label;
  final T value;
  final List<_RadioOption<T>> options;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            label,
            style: const TextStyle(color: Colors.black54, fontSize: 13),
          ),
        ),
        ...options.map((o) {
          final enabled = o.enabled;
          // Disabled options stay un-selectable and carry a "בקרוב" badge so
          // the picker is honest about what is actually implemented.
          return RadioListTile<T>(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            // Optional leading icon (e.g. grid/list view glyph) — null = no icon.
            secondary:
                o.icon == null
                    ? null
                    : Icon(
                      o.icon,
                      color: enabled ? BsTokens.inkLight : BsTokens.mutedLight,
                    ),
            title: Row(
              children: [
                Flexible(
                  child: Text(
                    o.label,
                    // Per-option font size lets size pickers render their own
                    // label at its own scale; defaults to the inherited size.
                    style: TextStyle(
                      color: enabled ? BsTokens.inkLight : BsTokens.mutedLight,
                      fontSize: o.labelFontSize,
                    ),
                  ),
                ),
                if (!enabled) ...[
                  const SizedBox(width: 8),
                  const CfgText(
                    ',
  't_d149244a': ',
            ),
          ],
          onChanged: (v) => notifier.update((s) => s.copyWith(unit: v)),
        ),
        // Both rows control the SAME persisted dimension format
        // ([decimalFormat]): "פורמט מידות בכרטיס מוצר" is the on-card view of it
        // and "פורמט הצגה" the general display format. They share one source of
        // truth so they can never drift, and both genuinely re-render the card.
        _RadioGroupRow<CatalogDecimalFormat>(
          label: ',
  't_6cbec90f': ';

/// Full-screen Catalog settings — 9 categories, ~40 leaves.
/// All 23 fields persisted via [catalogSettingsProvider].
class CatalogSettingsScreen extends ConsumerWidget {
  const CatalogSettingsScreen({super.key, this.showProfileRow = true});

  /// Whether to show the personal "הפרופיל שלי" row (→ contractor [ProfileScreen]).
  /// Contractors see it (default true); the MANAGER opens the SAME No-Code
  /// catalog/app admin WITHOUT it — a platform-admin must not land in a
  /// contractor',
  't_8c1fa16e': 'בהיר',
  't_9b876267': 'בינה מלאכותית והמלצות',
  't_0818172f': 'גודל תמונות',
  't_8525be2e': 'גרור לשנות את סדר המקטעים בבית',
  't_69c7f904': 'ההיסטוריה נוקתה',
  't_1b6843d1': 'היסטוריית החיפושים תימחק לצמיתות.',
  't_5aa6da32': 'המלצות מבוססות בינה מלאכותית',
  't_0ff70963': 'הצגת מחיר ליחידה',
  't_fe75dc74': 'השוואת מחירים בין ספקים',
  't_8568485a': 'התאמה לפי היסטוריית הזמנות',
  't_71dddde8': 'התראות קטלוג',
  't_4f0feec6': 'חיפוש וסינון',
  't_0de5d490': 'חלופות זולות אוטומטיות',
  't_52140469': 'יחידות מידה',
  't_61c94ad2': 'כהה',
  't_9d1277f5': 'כל ההגדרות יוחזרו לברירת המחדל.',
  't_6990b8fc': 'מבצעים והטבות',
  't_88151f59': 'מועדפים ורשימות',
  't_dd2b376a': 'מוצרים חדשים בקטגוריה',
  't_b43b6e4a': 'מחירים ומטבע',
  't_c9bf14ed': 'מטבע',
  't_8634add1': 'מטרי (מ"מ / ס"מ)',
  't_fbb3e522': 'מלאי נמוך',
  't_047ff314': 'מערכת מידה',
  't_ec19b1cf': 'מצב קומפקטי (כרטיסים קטנים)',
  't_2a27b0c7': 'מרחק מקסימלי',
  't_36025689': 'ניקוי היסטוריה',
  't_8df8acc1': 'ניקוי היסטוריית חיפוש?',
  't_054b91f5': 'סוג תצוגה',
  't_14856d29': 'סינון לפי פרויקט פעיל',
  't_9d297c6a': 'ספקים מסומנים כמועדפים',
  't_0febf6eb': 'סרגל מיון מהיר במוצרים',
  't_5ad70d74': 'עמודות בתצוגת רשת',
  't_66fca761': 'עשרוני (1.5)',
  't_7a5f9e65': 'פורמט הצגה',
  't_40461c3f': 'רדיוס חיפוש',
  't_984a01ac': 'רשימה (List)',
  't_9e588a92': 'רשת (Grid)',
  't_a892ad2e': 'שבר (1½)',
  't_f0e4e9e3': 'שם א-ת',
  't_19d4fcc0': 'שם ת-א',
  't_f8c21716': 'שמור היסטוריית חיפוש',
  't_a6faad2a': '₪ שקל',
  't_1b7e4377': '€ אירו',
  't_3aaec64f': '180 יום',
  't_40e6963a': '90 יום',
  't_8146568f': ';

/// Full-screen Chat settings — 9 categories, ~40 leaves.
/// Active leaves persisted via [chatSettingsProvider];
/// the rest show "בבנייה" toast on tap.
class ChatSettingsScreen extends ConsumerWidget {
  const ChatSettingsScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const ChatSettingsScreen());

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        title: CfgText(
          ',
  't_b41475e3': 'WiFi + סלולרי',
  't_be18e520': 'WiFi בלבד',
  't_97a234e4': 's persisted toggles have no engine yet — show an
  // honest "בבנייה" subtitle and suppress the active-count badge (Wave 8 / D2).
  final bool underConstruction;

  // A row is a backend-blocked "under construction" placeholder when it is a
  // _PlaceholderRow or an _Inert row flagged underConstruction. Single source of
  // truth for both the active-count badge and the Apple-readiness hide-filter.
  static bool _isUnderConstruction(Widget w) =>
      w is _PlaceholderRow ||
      (w is _Inert && (w as _Inert).underConstruction);

  // Count only functional rows — exclude "בבנייה" placeholders.
  int get _activeCount => children.where((w) => !_isUnderConstruction(w)).length;

  // For Apple review (kHideUnderConstruction) we render only the functional
  // rows; the placeholder rows stay defined in code (reversible) but are hidden.
  List<Widget> get _visibleChildren => kHideUnderConstruction
      ? children.where((w) => !_isUnderConstruction(w)).toList()
      : children;

  @override
  Widget build(BuildContext context) {
    // A whole section that is itself "under construction" — or one whose every
    // row is a hidden placeholder — disappears entirely for Apple review.
    if (kHideUnderConstruction &&
        (underConstruction || _visibleChildren.isEmpty)) {
      return const SizedBox.shrink();
    }
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      color: Theme.of(context).colorScheme.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16),
          childrenPadding: const EdgeInsets.only(bottom: 8),
          iconColor: Colors.black54,
          collapsedIconColor: Colors.black54,
          leading: Text(emoji, style: const TextStyle(fontSize: 22)),
          // Count badge replaces the default expand chevron.
          trailing:
              (underConstruction || _activeCount == 0)
                  ? null
                  : Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: BsTokens.brand,
                      borderRadius: BorderRadius.circular(11),
                    ),
                    child: Text(
                      ',
  't_e8d7a7ef': 'אאשר בקרוב ✅',
  't_193a47f6': 'איכות תמונות נשלחות',
  't_93ea3479': 'אישורי קריאה',
  't_89242fc5': 'אנגלית',
  't_843b5533': 'אנחנו סגורים, נחזור אליך בשעות הפעילות...',
  't_9f89ab55': 'אנשי קשר',
  't_d8835134': 'אנשי קשר בלבד',
  't_843f881d': 'אף אחד',
  't_d48c42c1': 'אף פעם',
  't_032ca4b1': 'ארכוב אוטומטי',
  't_f67cd54d': 'ארכיון וניקיון',
  't_c7f7a33a': 'בדרך אליך 🚗',
  't_78253c5d': 'בוט ואוטומציה',
  't_80ba77d8': 'בוט שאלות נפוצות',
  't_cbad00fd': 'בינונית',
  't_7f706d3e': 'ברכת פתיחה',
  't_a0d916a3': 'גבוהה',
  't_9cb769c0': 'גיבוי וייצוא',
  't_c706c0ae': 'גיבוי לענן',
  't_5b9645f2': 'גיבוי לפני מחיקה',
  't_0f9d901d': 'דחיסת וידאו',
  't_a8cccd89': 'הגדרות שיחות',
  't_5085f51f': 'ההיסטוריה נמחקה',
  't_3bba17db': 'הודעת מחוץ לשעות',
  't_58c37cae': 'הורדה אוטומטית',
  't_b794d6e6': 'היסטוריית השיחות תימחק והשיחות ייפתחו ריקות.',
  't_1dc7d762': 'השתקת שיחה ספציפית',
  't_887287ee': 'התבניות קבועות בגרסה זו. הקש על תבנית כדי להעתיק אותה — ',
  't_6a9029f1': 'התבנית הועתקה',
  't_cf6393ed': 'התראות שיחה',
  't_d6a79a62': 'התראת הודעה חדשה',
  't_704959f8': 'זמן מקוון אחרון',
  't_3ec09dc0': 'חודשי',
  't_fb1d150d': 'חיווי הקלדה',
  't_fcaa0146': 'חסימת משתמשים',
  't_f5e29367': 'טקסט הברכה',
  't_ef403757': 'יומי',
  't_eb2c6734': 'ייצוא היסטוריה (CSV)',
  't_8edcd285': 'כבוי',
  't_cd0c93a3': 'כולם',
  't_c553d711': 'כל הגדרות השיחות יוחזרו לברירת המחדל.',
  't_1545c03a': 'מדיה ושמע',
  't_af3406c5': 'מחיקה אוטומטית',
  't_4ce70953': 'מחיקת גיבוי ענן',
  't_c4c082da': 'מחיקת היסטוריה',
  't_f3b3607f': 'מחיקת היסטוריית שיחות',
  't_e257503c': 'מי יכול לפתוח שיחה',
  't_246f12f8': 'מקורית',
  't_80531464': 'נחזור אליך 📞',
  't_4197a50c': 'ניהול אחסון',
  't_730ca1df': 'ניתוב שיחות',
  't_5db08c64': 'סינון ספאם',
  't_9045c88f': 'ערבית',
  't_aea4fd3b': 'עריכת תבניות מותאמות אישית תתווסף בהמשך.',
  't_b0510062': 'פרטי הפרופיל (תמונה / ביוגרפיה)',
  't_1a1c4d24': 'פתיחה',
  't_0ea30460': 'פתיחת שיחה (מענה ראשוני)',
  't_41fe83a7': 'צלצול לפי איש קשר',
  't_d120dec3': 'צלצול שיחה נכנסת',
  't_ddee3261': 'קטלוג מוצרים בשיחה',
  't_dd2385ed': 'קיבלתי, תודה 🙏',
  't_50296d4c': 'שבועי',
  't_2e0d651f': 'שיחות וחיווי',
  't_d6cde56d': 'שיחות עסקיות',
  't_bc93bd3a': 'שלום! איך אפשר לעזור?',
  't_051dcbe5': 'שמורים בלבד',
  't_d83ff50a': 'שעות פעילות עסקית',
  't_442ea9ad': 'שפה ותרגום',
  't_a5b55fb3': 'שפת ממשק',
  't_3e65fd70': 'שפת מקלדת',
  't_e06b7c47': 'תגובה מחוץ לשעות פעילות',
  't_53dd5ffc': 'תדירות גיבוי',
  't_bf5734ac': 'תמיד',
  't_ccf7f8f1': 'תצוגה מקדימה בנעילה',
  't_4dfba214': 'תרגום אוטומטי',
  't_65aafdd0': 'תשובות מהירות',
  't_f1d9afe1': 'תשלום מתוך שיחה',
  't_2a4c58cc': ' keeps the
  /// legacy נציגים/ספקים chips untouched.
  final String audience;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Board audiences (worker/courier) get their own chip set; selection is a
    // plain index into [_audienceChipsFor].
    final audienceChips = _audienceChipsFor(audience);
    if (audienceChips != null) {
      final raw = ref.watch(_audienceChipIndexProvider);
      final selected = raw < audienceChips.length ? raw : 0;
      return Padding(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (var i = 0; i < audienceChips.length; i++) ...[
                if (i > 0) const SizedBox(width: 8),
                _Pill(
                  label: audienceChips[i].label,
                  active: selected == i,
                  onTap:
                      () =>
                          ref.read(_audienceChipIndexProvider.notifier).state =
                              i,
                ),
              ],
            ],
          ),
        ),
      );
    }

    final filter = ref.watch(_chatFilterProvider);

    void select(_ChatFilter f) =>
        ref.read(_chatFilterProvider.notifier).state = f;

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            _Pill(
              label: ',
  't_8a58248d': ') swap the legacy
// נציגים/ספקים chips for a role-specific set. Selection is a plain index into
// the audience',
  't_6147e4bd': ') {
    if (filter == _ChatFilter.agents && t.category != _ThreadCategory.agent) {
      return false;
    }
    if (filter == _ChatFilter.suppliers &&
        t.category != _ThreadCategory.supplier) {
      return false;
    }
    if (filter == _ChatFilter.bot && t.category != _ThreadCategory.bot) {
      return false;
    }
  }
  if (query.isNotEmpty) {
    final q = query.toLowerCase();
    if (!t.name.toLowerCase().contains(q) &&
        !t.subtitle.toLowerCase().contains(q)) {
      return false;
    }
  }
  return true;
}

/// The עדכונים live-mirror "open a conversation" hand-off (StateProvider):
/// a conversation chip SETS this to a thread id; [ChatsScreen] WATCHES it,
/// performs the real `_ChatPage` push for the matching thread, then nulls it
/// (and it resets to null on pop). Mirrors the established
/// "keyboard sets a provider, screen reacts" contract — the keyboard never
/// imports the private `_ChatPage`, so the overlay stays floating.
final updatesChatOpenProvider = StateProvider<String?>((_) => null);

// ─── per-username chat-UX state (F-37) ────────────────────────────────────────
//
// Archive/mute/lastRead/history-cleared are USER state, not device state:
// switching accounts (ran→omer, demo→dudi) must not inherit the previous
// user',
  't_fde4bb45': ');
final _chatFilterProvider = StateProvider<_ChatFilter>((_) => _ChatFilter.all);

/// A keyboard-consumable projection of ONE visible chat thread: the engine
/// [id] (what a conversation chip dispatches into [updatesChatOpenProvider])
/// plus the persona-relative display [name] (the chip label). Public + minimal
/// on purpose — the עדכונים deriver consumes this surface without importing the
/// private `_Thread`/`_ThreadView` types, so `bs_keyboard` stays pure (it only
/// ever sees `List<String>` chips derived from these names).
typedef ThreadLite = ({String id, String name});

/// The threads currently VISIBLE in the שיחות list for the home-shell scope
/// (contractor, audience ',
  't_67c37506': ',
                            style: TextStyle(
                              color: bsOnAccent(context),
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── chat page ────────────────────────────────────────────────────────────────

/// Opens a fresh, empty conversation with a new contact (from "שיחה חדשה").
/// This is a DETACHED chat (no engine thread / no [_ThreadView.threadId]) so it
/// keeps the legacy session-local message list + bot auto-reply — exactly as
/// before. Real seeded threads go through the shared engine instead.
void openNewChatWith(
  BuildContext context, {
  required String emoji,
  required String name,
}) {
  final now = DateTime.now();
  final thread = (
    id: ',
  't_3e83a2c2': ',
            ),
            source: const ChatSuggestionSource(),
          ),
          _InputBar(controller: _controller, onSend: _send),
          BsKeyboardHost(
            controller: _controller,
            focusNode: _focusNode,
            onSend: _send,
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _scroll.dispose();
    super.dispose();
  }
}

// ─── bubbles ──────────────────────────────────────────────────────────────────

/// Bubble side per SPEC §1 כיווניות (`sys_chat.dart`): the reading persona',
  't_3d08af57': ',
      direction: _directionFor(t, persona, uid: uid),
      isBot: t.isBot,
      unread: _unreadCount(t, persona, lastRead[t.id] ?? 0, uid: uid),
      isOnline: t.isBot,
      category: _categoryFor(t),
    ),
  );
}

// ─── providers ────────────────────────────────────────────────────────────────

/// "זמן מקוון אחרון" privacy: online presence is shown unless set to nobody.
bool showOnlinePresence(ChatLastSeen p) => p != ChatLastSeen.nobody;

/// The שיחות search query. PUBLIC (was `_chatSearchQueryProvider`) so the
/// עדכונים live-mirror keyboard',
  't_e7dc4a83': ',
    direction: _Direction.outgoing,
    isBot: false,
    unread: 0,
    isOnline: true,
    category: _ThreadCategory.agent,
  );
  Navigator.of(context).push(
    MaterialPageRoute<void>(
      // No threadId → detached/local (legacy "שיחה חדשה" behavior).
      builder:
          (_) => _ChatPage(
            view: (thread: thread, threadId: null, persona: BsRole.contractor),
          ),
    ),
  );
}

/// #chat-dm-reroute — the SINGLE "other side" role of a seed thread for the
/// reading [persona], or null when there is no single real counterpart: the bot
/// thread, a per-user dm thread (empty role [ChatThread.participants]), or an
/// ambiguous multi-party thread (>1 non-self role). Pure ⇒ ratchet-tested.
///
/// It exists because a shared SEED role-thread (`th-contractor-manager`, …) can
/// hold at most ONE plain contractor: `ensureParticipantUids` stamps
/// participantUids ONCE, and a plain contractor (no role claim) can',
  't_88c2ef97': '. A board audience shows
  /// ONLY its own threads (+ the shared bot thread) and swaps the filter chips
  /// for its role-specific set ([_audienceChipsFor]).
  final String audience;

  /// True when a role BOARD embeds this as a tab inside its own shell — the
  /// bare body is returned over a white surface (no own Scaffold/AppBar),
  /// like the contractor home-shell tab.
  final bool embedded;

  @override
  ConsumerState<ChatsScreen> createState() => _ChatsScreenState();
}

class _ChatsScreenState extends ConsumerState<ChatsScreen> {
  bool _headerVisible = true;

  /// Inside the contractor home_shell tab — the only context that owns the
  /// shrinking-tab-header coordination ([tabHeaderHiddenProvider]).
  bool get _inHomeShell => widget.persona == BsRole.contractor;

  /// Wrap in our own Scaffold + "שיחות" AppBar only when pushed standalone —
  /// an [ChatsScreen.embedded] board tab gets the bare body instead.
  bool get _standalone => !_inHomeShell && !widget.embedded;

  void _setHeaderVisible(bool v) {
    if (_headerVisible == v) return;
    setState(() => _headerVisible = v);
    // The shrinking-tab-header coordination only exists inside home_shell (the
    // contractor tab); other personas — standalone or board-embedded — have no
    // such header to hide.
    if (_inHomeShell) {
      ref.read(tabHeaderHiddenProvider.notifier).state = !v;
    }
  }

  bool _handleScroll(ScrollNotification n) {
    if (n is ScrollUpdateNotification && n.depth == 0) {
      final delta = n.scrollDelta ?? 0;
      final px = n.metrics.pixels;
      if (delta > 6 && _headerVisible && px > 50) {
        _setHeaderVisible(false);
      } else if (delta < -6 && !_headerVisible) {
        _setHeaderVisible(true);
      } else if (px <= 2 && !_headerVisible) {
        _setHeaderVisible(true);
      }
    }
    return false;
  }

  /// Opens the engine thread [id] (set by a עדכונים live-mirror conversation
  /// chip via [updatesChatOpenProvider]) as the real `_ChatPage`, mirroring
  /// `_ThreadRow.onTap`. Resolves [id] through the SAME persona-relative
  /// [_viewOf] the list uses, so the page renders identically; the provider is
  /// nulled immediately (a repeat tap of the same chip re-fires) and again on
  /// pop (defensive — it is already null). If the thread vanished between the
  /// chip render and the tap, we simply reset and stay on the list (edge-crash
  /// safety: no push for a missing thread).
  Future<void> _openChatById(String id) async {
    // Null the trigger first so a second tap on the same conversation re-sets
    // it and re-fires — and so a vanished thread leaves no stale id behind.
    ref.read(updatesChatOpenProvider.notifier).state = null;
    // #chat-dm-reroute — a seed role-thread chip (e.g. "תמיכה") opens on the real
    // dm-<uids> thread with the counterpart, same as `_ThreadRow.onTap`; the id is
    // unchanged for the bot/dm/ambiguous/offline/signed-out cases.
    id = await rerouteThreadToDm(ref, id, widget.persona);
    if (!mounted) return;
    final threads = ref.read(chatEngineProvider);
    final match = threads.where((t) => t.id == id);
    if (match.isEmpty) return; // thread deleted after the chip rendered
    final lastRead = ref.read(chatLastReadProvider);
    final view = _viewOf(match.first, widget.persona, lastRead,
        uid: ref.read(currentUidProvider));
    Navigator.of(context)
        .push(
          MaterialPageRoute<void>(
            builder:
                (_) => _ChatPage(
                  view: (
                    thread: view.thread,
                    threadId: view.threadId,
                    persona: view.persona,
                  ),
                ),
          ),
        )
        .then((_) {
          // On pop, return the keyboard to the chats-list state (idempotent — the
          // provider was already nulled on open).
          if (mounted) ref.read(updatesChatOpenProvider.notifier).state = null;
        });
  }

  @override
  Widget build(BuildContext context) {
    if (_inHomeShell) {
      ref.listen<bool>(tabHeaderHiddenProvider, (_, hidden) {
        if (!hidden && !_headerVisible) _setHeaderVisible(true);
      });
    }
    // עדכונים live-mirror hand-off: a conversation chip on the floating keyboard
    // SETS [updatesChatOpenProvider] to a thread id; the screen turns that into
    // the real `_ChatPage` push here (the keyboard never touches the private
    // route) and immediately nulls the provider so a repeat tap re-fires.
    ref.listen<String?>(updatesChatOpenProvider, (_, id) {
      if (id != null) unawaited(_openChatById(id));
    });
    // A TAPPED NOTIFICATION, which is the case the listener above cannot serve.
    // `ref.listen` fires on a CHANGE, and every push route sets the thread id
    // BEFORE this screen exists — a cold launch, a browser page opened fresh
    // with `?thread=`, or a warm resume that sets the id and then navigates
    // here. The listener would find the value already in place and never fire,
    // so the notification would open the app and then sit on the wrong screen.
    // Reading it on arrival is what closes that gap; `consumePendingThread`
    // clears as it reads, so a later notification for the same conversation
    // still re-opens it.
    final fromPush = consumePendingThread(ref);
    if (fromPush != null) {
      afterThisFrame(() => unawaited(_openChatById(fromPush)));
    }
    final body = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ClipRect(
          child: AnimatedSize(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeInOut,
            alignment: Alignment.topCenter,
            child:
                _headerVisible
                    ? Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const _SearchBar(),
                        _FilterChipsRow(audience: widget.audience),
                      ],
                    )
                    : const SizedBox.shrink(),
          ),
        ),
        Expanded(
          child: NotificationListener<ScrollNotification>(
            onNotification: _handleScroll,
            child: _ThreadList(
              persona: widget.persona,
              audience: widget.audience,
            ),
          ),
        ),
      ],
    );

    // 🔒 Contractor: embedded tab — return the bare body (home_shell owns the
    // Scaffold/AppBar). A board-[ChatsScreen.embedded] tab gets the same bare
    // body over its own white surface. Every other persona: standalone Scaffold
    // with its own "שיחות" AppBar + a back button that only pops to its
    // dashboard.
    if (!_standalone) {
      return _inHomeShell
          ? body
          : ColoredBox(color: Theme.of(context).colorScheme.surface, child: body);
    }
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          tooltip: ',
  't_b7c28d06': ': legacy};
  } on Object catch (_) {
    /* corrupt — start empty */
  }
  return {};
}

/// Honest "מחיקת היסטוריה": chat history is ephemeral per-session widget state
/// (there is no persisted message store). This flag — once set — makes new chat
/// pages open empty instead of seeding the thread greeting/last message, and it
/// survives restarts. It is the lightest truthful wiring short of a full store.
/// Per-username (F-37): clearing the history on one account does not blank
/// another account',
  't_db4b213d': ';

  final lastRead = ref.watch(chatLastReadProvider);
  final filter = ref.watch(_chatFilterProvider);
  final archivedIds = ref.watch(chatArchivedIdsProvider);
  final query = ref.watch(updatesChatSearchProvider);

  // Board-audience chip set + selected chip — null for the contractor, so the
  // legacy נציגים/ספקים path (filter, below) is what actually narrows here.
  final audienceChips = _audienceChipsFor(audience);
  final chipRaw = ref.watch(_audienceChipIndexProvider);
  final audienceChip =
      audienceChips == null
          ? null
          : audienceChips[chipRaw < audienceChips.length ? chipRaw : 0];

  // #8/3b — the current signed-in uid, so a per-user DM thread surfaces in this
  // keyboard-chip projection too (kept in lock-step with the on-screen list',
  't_6242e171': ';
  }

  /// The messages to render: from the shared engine thread for an engine-backed
  /// page (mapped to the legacy `_Message` shape), or the session-local list for
  /// a detached chat. Honors "מחיקת היסטוריה".
  ///
  /// #chat-identity — "mine vs theirs" is keyed on the READER',
  't_f0e34184': 's "new-message alert" setting (was: persisted but never read — W4).
      if (ref.read(chatSettingsProvider).messageAlertEnabled) {
        HapticFeedback.lightImpact();
      }
      _scrollToBottom();
    });
  }

  /// "עוד" overflow menu — real, working chat actions backed by the existing
  /// mute/archive providers (not a placeholder). Block/search-in-chat are
  /// honest stubs (no backing) shown inline.
  Future<void> _showChatMenu(BuildContext context) async {
    final id = _thread.id;
    final muted = ref.read(chatMutedIdsProvider).contains(id);
    final action = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder:
          (sheetCtx) => SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(0, 12, 0, 12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 36,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.black12,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ListTile(
                    leading: Icon(
                      muted
                          ? Icons.notifications_active_outlined
                          : Icons.notifications_off_outlined,
                      color: Colors.black54,
                    ),
                    title: Text(muted ? ',
  't_dd6d624d': 's [uid]
/// (one person, every board) with the legacy role compare as the fallback. See
/// [chatMessageIsMine] (sys_chat.dart) for the bug this closes.
_Direction _directionFor(ChatThread t, BsRole persona, {String? uid}) {
  if (t.messages.isEmpty) return _Direction.outgoing;
  return chatMessageIsMine(t.messages.last, persona, uid)
      ? _Direction.outgoing
      : _Direction.incoming;
}

_ThreadCategory _categoryFor(ChatThread t) {
  if (t.isBot) return _ThreadCategory.bot;
  // A supplier (🏪) counterpart → "ספקים"; everyone else (👷/🛵/👔) → "נציגים".
  return t.participants.contains(BsRole.store)
      ? _ThreadCategory.supplier
      : _ThreadCategory.agent;
}

String _hhmm(DateTime ts) =>
    ',
  't_4c2b2390': 's flag survives untouched.
      final buckets = _readClearedBuckets(prefs);
      buckets[username] = state;
      await prefs.setString(_kHistoryClearedKey, jsonEncode(buckets));
    } on Object catch (_) {
      /* best-effort */
    }
  }

  void clearAll() {
    state = true;
    unawaited(_persist());
  }
}

final chatHistoryClearedProvider =
    StateNotifierProvider<_ChatHistoryClearedNotifier, bool>(
      (ref) => _ChatHistoryClearedNotifier(_chatBucketUser(ref)),
    );

/// All thread ids — used by "השתק הכל". Reads the live shared engine (every
/// persona',
  't_daafdf70': 's real [MsgStatus] (where it came from), not a global toggle.
///   • [MsgStatus.pending] → 🕐 (grey) — the optimistic write is in flight;
///   • [MsgStatus.sent] → ✓ (grey) — in the outbox / demo-local, NOT
///     server-confirmed;
///   • [MsgStatus.delivered] → ✓✓ (blue) — rebuilt from a SERVER snapshot
///     (`fromDoc`); the readReceipts toggle is kept MEANINGFUL by capping this at
///     a single grey ✓ when it is OFF (delivered is still true, just not shown);
///   • [MsgStatus.failed] → ❌ + a tappable "נסה שוב" that re-fires the write.
class _DeliveryStatus extends StatelessWidget {
  const _DeliveryStatus({
    required this.status,
    required this.readReceipts,
    this.onRetry,
  });

  final MsgStatus status;
  final bool readReceipts;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case MsgStatus.pending:
        return const Icon(
          Icons.access_time,
          size: 13,
          color: Color(0xFF999999),
        );
      case MsgStatus.sent:
        return const Icon(Icons.done, size: 13, color: Color(0xFF999999));
      case MsgStatus.delivered:
        // readReceipts OFF caps delivered at a single grey ✓ — keeps the toggle
        // meaningful while the message is honestly server-confirmed underneath.
        return readReceipts
            ? const Icon(Icons.done_all, size: 13, color: Color(0xFF4FC3F7))
            : const Icon(Icons.done, size: 13, color: Color(0xFF999999));
      case MsgStatus.failed:
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 13, color: Colors.red),
            const SizedBox(width: 3),
            // composite hide: whole "נסה שוב" retry link vanishes, not just its label.
            CfgVisible(
              ',
  't_fc45314a': 's reply synchronously, but we
    // briefly show the "מקליד..." bubble first — so while typing, hide that
    // just-added incoming reply and let the typing bubble stand in for it.
    if (_engineBacked &&
        _isTyping &&
        messages.isNotEmpty &&
        !messages.last.isMe) {
      messages = messages.sublist(0, messages.length - 1);
    }
    return Scaffold(
      backgroundColor: const Color(0xFFECE5DD),
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        titleSpacing: 0,
        leading: IconButton(
          tooltip: ',
  't_1579a357': 's שיחות tab, and a
/// worker→manager message (',
  't_3c114142': 't flip for RTL).
/// Pinned by `test/chat_bubble_side_test.dart`.
AlignmentDirectional chatBubbleAlignment({required bool isMe}) =>
    isMe ? AlignmentDirectional.centerStart : AlignmentDirectional.centerEnd;

class _Bubble extends ConsumerWidget {
  const _Bubble({required this.msg, this.onRetry});

  final _Message msg;

  /// #chat-delivery-status — invoked by the "נסה שוב" tap on a `failed` message
  /// (re-fires the write via the engine). Null when the message can',
  't_1bc3a4d7': 'אין שיחות',
  't_5034d346': 'אין שיחות בארכיון',
  't_6379a3a1': 'אעדכן אותך בהקדם.',
  't_c16b3933': 'אפשרויות',
  't_25da856d': 'בסדר גמור.',
  't_7be72c5a': 'הודעה',
  't_22bd0b8c': 'החלק שיחה שמאלה כדי לארכב אותה',
  't_78f163bd': 'העבר לארכיון',
  't_cca9a5d8': 'הקלטת הודעה קולית',
  't_28355499': 'הקלטת הודעות קוליות אינה זמינה בגרסת הדמו.',
  't_314a1a2c': 'הקלטת קול',
  't_1de5e97a': 'השיחה הושתקה',
  't_602a37b5': 'השיחה שוחזרה',
  't_e2a50184': 'השתק שיחה',
  't_324fa466': 'חיפוש בשיחה',
  't_6932301c': 'חיפוש שיחות...',
  't_5d3b62d7': 'חסום איש קשר',
  't_088cffa9': 'כשיהיו שיחות — הן יופיעו כאן',
  't_da138705': 'לא זמין בדמו',
  't_26d0e7de': 'מיקום',
  't_3c5e26fa': 'מסמך',
  't_3eaa17f3': 'מעולה.',
  't_884a0420': 'מקליד...',
  't_4c6ccdef': 'נקה חיפוש',
  't_44b2b8b2': 'פעיל כעת',
  't_169c97b5': 'צירוף',
  't_f25962e3': 'קיבלתי, תודה 👍',
  't_06604c0e': 'שחזר מהארכיון',
  't_c44e7f30': 'שיחה הועברה לארכיון',
  't_bfff4e8e': 'שלום! 👋 איך אפשר לעזור?',
  't_f7755c38': 'שלח הודעה',
  't_e623713d': 'שליחים',
  't_14602c60': '🎧 תמיכה',
  't_341d3edd': '🏪 חנות',
  't_c8d079c9': '🏪 ספקים',
  't_0360f7ae': '👤 נציגים',
  't_a185c948': '👷 לקוח',
  't_4f0466f6': '👷 קבלן',
  't_929687d2': '🔒 ההודעות בשיחה זו מוצפנות מקצה לקצה. רק המשתתפים יכולים לקרוא אותן.',
  't_14b91fe1': '🛵 שליחים',
  't_3e3a0403': '🤖 בוט',
  't_1ccf9ac8': ';

/// "בקרוב" — an honest placeholder screen for a profession whose content
/// isn',
  't_a6ef9fc4': 'התוכן עבור \$profession בהכנה',
  't_ffce1824': '‹ חזור לבחירת מקצוע',
  't_4290ecff': 'המערכת עובדת על הקטלוג שתטענו — חיפוש, סל והזמנות. מחירים והשוואת-חנויות יתווספו בשלב חיבור-השרת.',
  't_b60020fa': 'השמירה נכשלה — ייתכן שהקובץ גדול מדי לאחסון המקומי',
  't_d9ab9e23': 'נמצאו \${errors.length} שגיאות — תקנו והעלו שוב',
  't_4385c808': 'עדיין לא נטען קטלוג',
  't_c8b239bf': 'שורה \${errors[i].row} — \${errors[i].messageHe}',
  't_ead5806f': '⚠️ \${_quality!.flagged} אזהרות איכות (לא חוסמות) — כדאי לבדוק',
  't_69b7cd15': '✅ נטענו \$committed מוצרים',
  't_64ad17df': '🔄 רענן להחלת הקטלוג בכל המסכים',
  't_cf0c1323': 's
/// job) — it resets on a fresh app start.
final _consentPromptScheduledProvider = StateProvider<bool>((_) => false);

/// The one-time, version-gated consent trigger. Schedules the consent dialog
/// once, only when the user has NOT yet consented to [kCurrentPolicyVersion] (a
/// policy bump re-opens it — Amendment-13 re-opt-in). The SOLE caller wraps this
/// in `if (kIntelLive)` so it never compiles into a normal (INTEL_LIVE-off)
/// build.
void maybeShowConsentModal(BuildContext context, WidgetRef ref) {
  final settings = ref.read(appSettingsProvider);
  // Version-gate: already consented to the current policy → never re-prompt.
  if (settings.consentedPolicyVersion >= kCurrentPolicyVersion) return;
  // Session-guard: repeated build()s schedule the dialog only once.
  if (ref.read(_consentPromptScheduledProvider)) return;
  ref.read(_consentPromptScheduledProvider.notifier).state = true;
  WidgetsBinding.instance.addPostFrameCallback((_) {
    if (context.mounted) showConsentModal(context, ref);
  });
}

/// Opens the consent dialog. On "אני מסכים" it records consent atomically via
/// [recordConsent]; dismissing (barrier / "לא עכשיו") leaves the private
/// default-DENY state untouched (no half-consent).
Future<void> showConsentModal(BuildContext context, WidgetRef ref) {
  return showDialog<void>(
    context: context,
    builder: (ctx) => _ConsentDialog(
      onAgree: () {
        recordConsent(ref.read(appSettingsProvider.notifier));
        Navigator.of(ctx).pop();
      },
      onDismiss: () => Navigator.of(ctx).pop(),
    ),
  );
}

/// Records consent to the CURRENT policy version in ONE ATOMIC settings write:
/// flips [AppSettings.privAnalytics] on AND stamps
/// [AppSettings.consentedPolicyVersion] = [kCurrentPolicyVersion] in a SINGLE
/// `copyWith` — never a half-consent (a toggle written without the version).
/// Pure enough to unit-test directly (test/intel/consent_flow_test.dart).
void recordConsent(AppSettingsNotifier notifier) {
  notifier.update(
    (s) => s.copyWith(
      privAnalytics: true,
      consentedPolicyVersion: kCurrentPolicyVersion,
    ),
  );
}

/// The honest analytics paragraph, pulled VERBATIM from [kPrivacyPolicy] §5 so
/// the consent copy can never drift from the policy text (single source).
String consentPolicyExcerpt() {
  const marker = ',
  't_709e0d5f': 'אני מסכים',
  't_a5061711': 'במכשירך, ומשודרים אלינו רק לאחר הסכמתך המדעת. ניתן למשוך את ',
  't_1b43c1f0': 'ברירת-המחדל כבויה — שום נתון לא נשלח ללא הסכמתך. הנתונים נאספים ',
  't_be0e34ed': 'ההסכמה ולחזור למצב הכבוי בכל עת בהגדרות › פרטיות.',
  't_648ac13e': 'כדי לשפר את השירות נוכל לאסוף נתוני שימוש מצומצמים ולא-מזהים. ',
  't_98c8a5b8': 'לא עכשיו',
  't_7aad0396': 'קראו את מדיניות הפרטיות המלאה',
  't_6ee7b873': 'שיפור השירות — נתוני שימוש',
  't_972ba0d3': '\${day.username} — מיקום כניסה',
  't_66436587': ',
              child: _LocationPill(day: day),
            ),
          ],
        ],
      ),
    );
  }
}

/// One "היום" row — `🦺 username` + the day',
  't_776f718e': 's
// on-site now and who has a record today; they do NOT edit attendance (the
// worker owns their own clock-in/out, worker_attendance_screen.dart).
//
// Two sections:
//   🟢 נוכחים עכשיו — the OPEN days (`clockedInNow`): clocked in, not out, today.
//   היום           — every worker WITH a record today (open or closed shifts).
//
// HONEST by construction: only data that exists is shown. A still-open shift',
  't_51f145e2': 'אין נוכחות רשומה היום',
  't_64626009': 'אין עובדים מחותמים כרגע',
  't_9076e0a1': 'יציאה \${outTs == null ? ',
  't_b803a325': 'כניסה \${_fmtTime(inTs)}',
  't_fac1dbe4': 'כניסה \${inTs == null ? ',
  't_a902a47d': 'כניסה —',
  't_6d061974': 'מי מהעובדים שלך מחותם כרגע ומי נכח היום (לצפייה בלבד)',
  't_918d6381': '🕒 נוכחות עובדים',
  't_0063e735': '🟢 נוכחים עכשיו (\${present.length})',
  't_ffd9bdfb': ' · סיבה: \$why',
  't_654a9ec9': '\$expiringCount לקראת חידוש',
  't_5760e42a': '\${cert.issuer} · בתוקף עד \${_fmtDate(cert.expiry)}',
  't_628b4042': '(בנוסף לטופס 101).',
  't_0479da08': ',
                          style: const TextStyle(
                            color: BsTokens.inkLight,
                            fontWeight: FontWeight.w700,
                            fontSize: 12.5,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: BsTokens.space3),
              // ADD affordance — free-type a required cert/doc name + הוסף.
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      key: const ValueKey(',
  't_4532b65f': 's "קבלן"
    // thread) — the CONTRACTOR is the employer/approver here — sent as
    // BsRole.contractor, second-person, mirroring the manager',
  't_607e36c8': 's reject is the single source
                      // of truth (status-guarded, no double).
                      final why = await promptRejectReason(context);
                      if (why == null || !context.mounted) return;
                      _decide(context, ref, r, approve: false, reason: why);
                    },
                  ),
                  const SizedBox(height: BsTokens.space2),
                ],

              // ══ SECTION A — הדרכות עובדים (approve-back) ══
              const Divider(height: 32),
              const CfgText(
                ',
  't_56b53ce8': 's worker-HR surface: a bottom-sheet listing the
// worker vacation requests scoped to THIS employer (`requestsForEmployer`,
// the H1a Provider.family keyed by employerId) and letting the contractor —
// the actual EMPLOYER, per [[manager-is-platform-admin-not-hr]] — אשר/דחה
// each pending one. PARALLEL to the manager dashboard',
  't_9b646866': 'בקשות חופשה של העובדים שלך',
  't_3c95abd4': 'בקשות חופשה של העובדים שלך — \$pendingCount ממתינות להחלטה',
  't_8d1ef2d2': 'הדרכות הבטיחות של העובדים שלך',
  't_974f089e': 'הדרכות שהעובדים שלך רשמו — \${pendingTrainings.length} ממתינות לאישורך',
  't_0dc8f38f': 'ההדרכה אושרה',
  't_4dec3059': 'ההדרכה נדחתה',
  't_e018875f': 'היתר עבודה בגובה',
  't_a4df56ed': 'הסמכת חשמלאי',
  't_7c4c059c': 'התעודות המקצועיות של העובדים שלך (לצפייה בלבד)',
  't_807ebb75': 'לא הוגדרו מסמכים נדרשים. כרגע עובד נחסם רק על טופס-101 ',
  't_57ae1488': 'לא-חתום או תעודה שפגה.',
  't_37fb5ec5': 'עובד לא יוכל להתחיל עבודה עד שתהיה לו תעודה בתוקף לכל פריט כאן ',
  't_0b40e664': 'שם מסמך/תעודה נדרשים…',
  't_cfd36d8e': 'תעודת מפעיל מלגזה',
  't_00c6782b': '⚠️ \$expiredCount תעודות פגות תוקף',
  't_304762c6': '✅ אושרה הדרכה: \${t.username} · \${t.title}',
  't_9160ce89': '✅ ההדרכה "\${t.title}" אושרה',
  't_4a4f810d': '❌ בקשת החופשה שלך (\${r.range}) נדחתה\$reasonSuffix',
  't_22f7f6e4': '❌ ההדרכה "\${t.title}" נדחתה',
  't_677b5a53': '❌ הוסר מסמך נדרש: \$name',
  't_74bc3f79': '❌ נדחתה הדרכה: \${t.username} · \${t.title}',
  't_9ddbdf5b': '🌴 אין בקשות חופשה מהעובדים שלך כרגע',
  't_b70c5bf8': '🎓 אין הדרכות מהעובדים שלך כרגע',
  't_2bbb2de1': '🎓 הדרכות עובדים',
  't_cba8a0f5': '👷 חופשות עובדים',
  't_ffb9abcc': '📋 מסמכים נדרשים מהעובדים',
  't_e13f9ac7': '📋 נוסף מסמך נדרש: \$s',
  't_2f187431': '📋 נוסף מסמך נדרש: \$text',
  't_574f3cd9': '📜 אין תעודות מהעובדים שלך כרגע',
  't_4f86f5d8': '📜 תעודות עובדים',
  't_898ccce2': '🔴 פג תוקף',
  't_0032b7b7': '🟡 פג בקרוב',
  't_5eaa6939': '🟢 בתוקף',
  't_410847d6': 'כשעובד ישלח בקשת חומרים — היא תופיע כאן ותוכל לעדכן את הסטטוס.',
  't_cc0f13fe': 'ללא פריטים',
  't_2f98399b': 'סמן הוזמן',
  't_afe3a59c': '📥 בקשות חומר',
  't_f95d398f': '\${lines.length} פריטים · ההצעה הזולה ₪\${groupThousands(total)}',
  't_e72eaa46': ',
          productName: it.name,
          productEmoji: it.emoji,
          brandName: best.store,
          brandPrice: best.price,
          productQty: 1,
          accessories: const [],
        ),
      );
    }
  }
  return out;
}

/// (T3) "סרוק תוכנית" — pick a plan type → scan animation → detected zones with
/// per-item store comparison → "הוסף לסל". R9-inline (modal sheet, no new route).
/// Data verbatim from [kPlanTypes] (proto §9); scan is simulated (sim, not toast).
/// [initialPlanKey] (menu leaf wiring) optionally auto-starts that plan',
  't_4c771fd1': ',
        style: TextStyle(
          fontSize: 12,
          fontWeight: best ? FontWeight.w700 : FontWeight.w500,
          color: best ? BsTokens.brand : const Color(0xFF555555),
        ),
      ),
    );
  }
}

/// (T3 · לוח-קבלן) Cart lines for a scanned plan type — each detected zone item
/// at its cheapest partner-store offer (proto §9 `addScanToCart`). Pure → tested.
List<SmartCartLine> scanPlanCartLines(PlanType plan) {
  final out = <SmartCartLine>[];
  for (final z in plan.zones) {
    for (final it in z.items) {
      if (it.stores.isEmpty) continue;
      final best = it.stores[bestStore(it.stores)];
      out.add(
        SmartCartLine(
          productKey: ',
  't_95a485df': '.
    final sel = _selected;
    final lines =
        scanPlanCartLines(
          p,
        ).where((l) => sel == null || sel.contains(l.productKey)).toList();
    if (lines.isEmpty) return; // guarded by the disabled button; defensive.
    final cart = ref.read(smartCartProvider.notifier);
    for (final l in lines) {
      cart.add(l);
    }
    // Stay in context — do NOT yank the user to the Store tab. The live cart FAB
    // (here, on the home shell, and on the AI hub) reflects the new count as
    // the immediate feedback; the "לאן לשלוח?" first-add popup still fires.
    Navigator.pop(context);
    showToast(context, ',
  't_69fb9583': ';

/// Opens the 📐 "סרוק תוכנית עבודה" sheet. [planKey] (plumbing/electrical/
/// architectural/finishing) optionally jumps straight into that plan',
  't_e948f288': 'אין חלופות זולות כרגע.',
  't_c5b4fba3': 'אין מחירים להשוואה כרגע.',
  't_16c831d0': 'אשר את הבחירה — הוסף \$selCount פריטים לסל',
  't_51e7721b': 'אשר הכל — הוסף \${lines.length} פריטים לסל',
  't_20b99ac9': 'בחר סוג תוכנית לסריקה',
  't_a43db0c4': 'המלצה: \${a.recName} · ₪\${groupThousands(a.recPrice)}',
  't_806bd6ee': 'ודאות \${z.conf}%',
  't_eb792500': 'חיסכון ₪\${groupThousands(a.savings)}',
  't_5a53ae5e': 'חלופה: \${a.altName} · ₪\${groupThousands(a.altPrice)}',
  't_4a380d1c': 'חפש מוצר…',
  't_0f1fe11e': 'לא נמצאו חלופות תואמות.',
  't_c28c7e3f': 'למה כדאי?',
  't_db5e5c1d': 'מותג חלופי זול יותר לאותו מוצר — אותה התקנה, פחות עלות.',
  't_3d37fdb8': 'מחירים מ-3 חנויות שותפות — הזול ביותר מסומן.',
  't_e2711ded': 'מנתח את תצורת הבנייה ומחלץ כמויות חומרים…',
  't_4abb39ef': 'סרוק תוכנית אחרת',
  't_bedd1fbf': '⚙️ בפרודקשן: השוואת-מחירים חיה מול מחירוני הספקים.',
  't_b89ca3c9': '✓ זוהו \${p.zones.length} \${p.summaryUnit}',
  't_b76cd4e8': '💰 המחירים נמשכים מ-3 חנויות שותפות. \${AppBrand.name} בוחר אוטומטית את ההצעה המשתלמת ביותר לכל פריט.',
  't_3ff709a2': '📊 השוואת מחירים',
  't_0b42bcde': '📐 סרוק תוכנית עבודה',
  't_ef7e5051': '\${_fmtDur(total)} שעות (\${_month.month}/\${_month.year})',
  't_76af4f03': '\${days.length} ימים · \${_fmtDur(total)} שעות',
  't_c556b6c5': '\${session.displayName}: \${monthDays.length} ימי עבודה · ',
  't_35361551': ';

  @override
  Widget build(BuildContext context) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — COURIER-board screen (F-16):
    // the gate is courier-roled, never a blind copy of the worker gate.
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.courier) {
      return const WelcomeScreen(boardRole: BoardRole.courier);
    }
    final username = session.username;

    final all = ref.watch(courierAttendanceProvider);
    final todayKey = attendanceDateKey(DateTime.now());
    AttendanceDay? today;
    for (final d in all) {
      if (d.username == username && d.date == todayKey) {
        today = d;
        break;
      }
    }
    final monthDays = attendanceMonth(all, username, _month.year, _month.month);
    final monthTotal = attendanceTotal(monthDays);
    final sentThisMonth = _sentMonths.contains(_monthKey);

    // Clock-skew safe (F-15): computed per build against the REAL current
    // month, so a viewed month can never navigate past it — even if _month
    // somehow got ahead, canGoNext stays false until it is truly behind now.
    final now = DateTime.now();
    final canGoNext = DateTime(
      _month.year,
      _month.month,
    ).isBefore(DateTime(now.year, now.month));

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        title: const CfgText(
          ',
  't_47c12229': ';

/// 🕐 נוכחות שליח (#86.2 · F-15) — the courier',
  't_0a2a8cd8': 's chat tab — the intended recipient
  /// (לחנות, לא לקבלן). The courier',
  't_4f130b1d': 's status + the big state-aware action: כניסה (no open shift) →
/// יציאה (clocked in) → an honestly-disabled "נרשמה נוכחות להיום ✓" once the
/// day is complete (one shift per day).
class _ClockCard extends StatelessWidget {
  const _ClockCard({
    required this.today,
    required this.onClockIn,
    required this.onClockOut,
  });

  final AttendanceDay? today;
  final VoidCallback onClockIn;
  final VoidCallback onClockOut;

  @override
  Widget build(BuildContext context) {
    final inTs = today?.inTs;
    final outTs = today?.outTs;
    final worked = today?.worked;

    final String label;
    final Color color;
    final VoidCallback? onTap;
    if (inTs == null) {
      label = ',
  't_7612a45f': 's status, a monthly table
/// (תאריך·כניסה·יציאה·סה"כ שעות) with a month picker + monthly total, and
/// ',
  't_faa79dae': 'דוח נוכחות מהשליח 🛵',
  't_2dfd8522': 'הנוכחי (אין עתיד).',
  't_65cb435c': 'חודש הבא',
  't_064c7e7c': 'חודש קודם',
  't_2a5f6e57': 'יציאה (אדום). לאחר השלמת היום הכפתור ננעל — משמרת אחת ליום.',
  't_ff8328df': 'כניסה / יציאה',
  't_a76f46e7': 'מציג את טבלת הנוכחות של החודש הבא — מושבת על החודש ',
  't_e812476c': 'מציג את טבלת הנוכחות של החודש הקודם.',
  't_c4c52765': 'צ׳אט + פעמון. ננעל אחרי שליחה למניעת כפילות.',
  't_53bb078a': 'רישום נוכחות: לחיצה ראשונה רושמת כניסה (ירוק), השנייה ',
  't_749b7a72': 'שולח לחנות סיכום נוכחות חודשי (ימי עבודה + סה"כ שעות) כהודעת ',
  't_42e689d0': 'שלח דוח נוכחות לחנות',
  't_c87f355d': 'תאריך',
  't_41c08afc': '📨 דוח הנוכחות נשלח לחנות בצ׳אט',
  't_bf10ac03': '📨 שלח דוח נוכחות לחנות',
  't_dc55f129': '🟢 נרשמה כניסה \${_fmtTime(DateTime.now())}',
  't_90051c59': ';

/// 🪪 תעודות נהג (#86.4 · F-17) — the courier',
  't_77f2afe7': 'הוספת תעודה',
  't_4c4c4ec7': 'הקשה על התמונה פותחת את צילום-התעודה במסך מלא.',
  't_2a8fbcf9': 'מוחק את התעודה מהארנק לצמיתות (עם דיאלוג אישור).',
  't_d97602a6': 'מחיקת תעודה',
  't_9e9b13eb': 'מילוי מהיר — ממלא את שם התעודה בלבד:',
  't_a9899150': 'מנפיק (למשל: משרד הרישוי)',
  't_61a552fd': 'פותח את גיליון הוספת תעודת-נהג — שם, מנפיק, תוקף וצילום אופציונלי.',
  't_44ce3b33': 'צפייה בצילום התעודה',
  't_ef1f5d90': 'שם התעודה (למשל: רישיון נהיגה)',
  't_f18a2219': '🪪 תעודות נהג',
  't_468ec730': '🪪 תעודות נהג (\${certs.length})',
  't_968b95bd': ' כשלא-נבחר/לא-מוכר — ערך persisted זר אסור
  /// שייפול ל-[haulInfo], שממציא את kHaulTypes.first).
  String _preferredHaul(BoardSession session) {
    final p = ref.watch(
      courierProfileProvider.select(
        (m) => m[session.username]?.preferredHaul ?? ',
  't_313e9e4d': '\$toPickup משלוחים ממתינים לאיסוף · אסוף מהחנות כדי להתחיל',
  't_7d522278': '\${order.items} פריטים · \${fMoney(order.sum)} · הקש לפרטים',
  't_5124f13a': ') was already emitted, so a
/// reload (F5) or re-login never re-notifies the same real hand-off. אין
/// המצאות: notifications derive only from actual engine stages (pickup/transit
/// = the store really handed the shipment to the courier).
const String kCourierHandoffSeenKey = ',
  't_3ed316bc': ',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    height: 1.4,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Opens the courier notifications sheet (list + mark-read + clear-all).
Future<void> showCourierNotifsSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => const _CourierNotifsSheet(),
  );
}

/// The notifications sheet — style mirrors `_WorkerNotifsSheet` (#85ו: white
/// card sheet, RTL, X close, ≥48dp rows); reads/mutates the courier',
  't_e5848715': ',
          );
    }
    if (dirty) _persistHandoffSeen();
  }

  @override
  Widget build(BuildContext context) {
    // חוק הלוחות (כלל 4 — "מבחוץ לא רואים כלום"): בלי session של שליח נבנה אך
    // ורק שער הרישום (WelcomeScreen במצב-תפקיד) — אף widget מתוכן הלוח לא נבנה.
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.courier) {
      return const WelcomeScreen(boardRole: BoardRole.courier);
    }

    // 🔒 #101 — שער-מוכנות מסמכים (HARD gate): between the auth gate and the
    // vehicle gate, block the board until the logged courier',
  't_a1723c45': ',
      ),
    );
    final greetName =
        profileName.isNotEmpty ? profileName : session.displayName;

    final jobs = orders.courierJobs(vehicle);
    final toPickup = jobs.where((o) => o.stage == OrderStage.ready).length;
    final onRoad =
        jobs
            .where(
              (o) =>
                  o.stage == OrderStage.pickup || o.stage == OrderStage.transit,
            )
            .length;
    final delivered = orders.countAt(OrderStage.delivered);
    final active = jobs.length;
    // #76 — הסינון לפי רכב הוא אמיתי: משלוחים פעילים שהרכב הנבחר לא יכול
    // לשאת לא נעלמים בשקט — הם מוצגים במקטע "דורש רכב אחר" בתחתית.
    const activeStages = [
      OrderStage.ready,
      OrderStage.pickup,
      OrderStage.transit,
    ];
    final otherVehicle =
        orders
            .where(
              (o) =>
                  activeStages.contains(o.stage) &&
                  !vehicleCanCarry(vehicle, o.haul),
            )
            .toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space5,
      ),
      children: [
        Text(
          ',
  't_32565ff8': ';

/// #31 — "מצב היכרות" copy for the courier',
  't_dd1372f5': ';
  }

  Widget _tabBody(BoardSession session, String vehicle) {
    switch (_tab) {
      case 1:
        return const CourierPortalTab();
      case 2:
        return const CourierReportsTab();
      case 3:
        // F-30 — רכב-המשמרת מועבר לפרופיל כדי שסטטיסטיקת "בדרך" תשחזר את
        // סמנטיקת רכב-זכאי של טאב המשלוחים (חוזה 6 — null רק במסך העצמאי).
        return CourierProfileBody(vehicle: vehicle);
      default:
        return _deliveriesTab(session, vehicle);
    }
  }

  /// ה-AppBar המשותף ללוח ולשער-הרכב. Each persona reaches profile + settings
  /// from its OWN dashboard — לשליח יש כעת מסכים ייעודיים (#73). RTL: actions
  /// lay out leading→trailing, so this reads bell · profile · settings · exit
  /// from the right. COURIER v2 ג — the 🔔 bell (unread badge) mirrors the
  /// worker board',
  't_b94bf5c4': 's "מסור לשליח" hand-off
  /// happened) that was not notified yet appends a bell notification to the
  /// logged courier',
  't_2842cb1f': 's `WorkerNotifsBell` (#85ו). IconButton
/// keeps the ≥48dp target.
class _CourierNotifsBell extends ConsumerWidget {
  const _CourierNotifsBell();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔊 ',
  't_80d2ce6c': 's deep-link re-evaluates and opens the board.
    // [docsGateOverrideProvider] is the TEST SEAM (non-null forces the
    // decision; board tests set true to bypass).
    final ov = ref.watch(docsGateOverrideProvider);
    final r = ref.watch(courierDocsReadyProvider(session.username));
    final docsReady = ov ?? r.ready;
    if (!docsReady) {
      return DocsReadinessGate(role: BoardRole.courier, readiness: r);
    }

    // COURIER v2 ג — live hand-off watcher: a REAL ready→pickup advance by the
    // store while this board is mounted lands as a 🔔 immediately (the
    // mount-time sweep in [_loadHandoffSeen] covers off-screen hand-offs).
    ref.listen<List<SysOrder>>(
      sysOrdersProvider,
      (_, next) => _sweepHandoffNotifs(next),
    );

    // F-30 — חיווט "סוג רכב מועדף" (#86.1) ↔ שער-הרכב: seed חד-פעמי מהפרופיל,
    // רק כשהשליח טרם נגע בבורר וטרם נבחר רכב (אידיום ticket #24 — מגיב לעדכון
    // ה-provider כשה-load נוחת, ובחירה ידנית טרייה לעולם לא נדרסת). id
    // persisted לא-מוכר נדחה בכנות ב-[_preferredHaul] — בלי haulInfo fallback
    // שממציא העדפה. הבחירה למשמרת נשארת אפמרלית by-design; אין כתיבה חזרה
    // לפרופיל בלי פעולת-משתמש מפורשת.
    final preferred = _preferredHaul(session);
    if (!_vehicleTouched && _vehicle == null && preferred.isNotEmpty) {
      _vehicle = preferred;
    }

    // #72 — הזרם אחרי כניסה: קודם בחירת "הרכב שלי היום" (אם טרם נבחר במשמרת
    // הזו) → ואז הבית עם 4 הטאבים.
    final vehicle = _vehicle;
    if (vehicle == null) return _vehicleGate(preferred);

    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: _appBar(),
        body: _tabBody(session, vehicle),
        // #31 — each tab wrapped in HelpTarget so help mode highlights it +
        // pops a bubble out of the tab (consistent with the app-bar). Outside
        // help mode the BottomNavCell',
  't_2805e34a': 's full list, zero regression).
  List<SysOrder> _scopeOrders(List<SysOrder> orders) {
    final ids = ref.watch(visibleOrderIdsProvider);
    if (ids == null) return orders;
    return orders.where((o) => ids.contains(o.id)).toList();
  }

  // ── טאב 1 · משלוחים (ברירת המחדל — מונים + כרטיסי משלוח) ──────────────────
  Widget _deliveriesTab(BoardSession session, String vehicle) {
    final orders = _scopeOrders(ref.watch(sysOrdersProvider));
    final haulName = haulInfo(vehicle).name;
    // F-57 — מנוי יחיד על ה-side-car לכל הטאב (ערכי המפה מחזיקים POD
    // data-URLs ענקיים; watch כפול בתוך לולאת הכרטיסים בנה מחדש את כל הטאב
    // על כל מוטציית fulfillment).
    final fulfillment = ref.watch(fulfillmentProvider);
    final preferred = _preferredHaul(session);
    // F-29 — הברכה מכבדת את ה-override מפרופיל-השליח (#86.1): שם מהפרופיל
    // כשאינו ריק, אחרת displayName של ה-session (בלי המצאות).
    final profileName = ref.watch(
      courierProfileProvider.select(
        (m) => m[session.username]?.displayName ?? ',
  't_c3638179': 's hands (pickup/transit)
    // — proto §3.5 `courierPOD` lists transit/pickup orders.
    final canPod =
        order.stage == OrderStage.pickup || order.stage == OrderStage.transit;
    final haul = haulInfo(order.haul);
    final phase = _courierPhase(order.stage);
    // Two-step hand-off: the store owns ready→pickup ("מסור לשליח"); the courier
    // acts only once the order is handed to it — receive at `pickup`
    // ("אספתי מהחנות" → transit), then deliver (→delivered). `ready` is view-only.
    final actionLabel = switch (order.stage) {
      OrderStage.ready => ',
  't_9c10f2a2': 's rewards balance per DELIVERED
/// shipment (COURIER v2 ב — awardCoins on delivered + bell). A fixed demo
/// tariff mirroring `kTaskApprovalCoins` (tasks_engine.dart) — the real
/// per-delivery value comes with the server; NEVER derived from the order sum.
const int kCourierDeliveryCoins = 20;

/// SharedPreferences key (versioned `bs.*.v1`) — per-username set of order ids
/// whose hand-off bell notification (',
  't_a7216de6': 's task-approval award (#85ו).
    ref.read(rewardsProvider.notifier).awardCoins(kCourierDeliveryCoins);
    final s = ref.read(boardAuthProvider);
    if (s != null && s.role == BoardRole.courier) {
      // F-1 (#86.6) — רגע המסירה חותם את זהות השליח על רשומת ה-fulfillment
      // (side-car בלבד — מנוע ההזמנות המשותף לא נגוע); זו נקודת-האמת לייחוס
      // per-courier בפרופיל ובדוחות.
      ref.read(fulfillmentProvider.notifier).stampCourier(o.id, s.username);
      // 🔔 ',
  't_c15f49e7': 't double-notify a hand-off
  /// that was already notified before the reload.
  bool _handoffSeenLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadHandoffSeen();
  }

  Future<void> _loadHandoffSeen() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(kCourierHandoffSeenKey);
      if (raw != null && raw.isNotEmpty) {
        final m = jsonDecode(raw) as Map<String, dynamic>;
        for (final e in m.entries) {
          if (e.value is List) {
            _handoffSeen[e.key] = {
              for (final id in e.value as List)
                if (id is String) id,
            };
          }
        }
      }
    } on Object catch (_) {
      // Corrupt/old payload — start empty (worst case: one repeat 🔔).
    }
    if (!mounted) return;
    _handoffSeenLoaded = true;
    // Catch hand-offs that happened while this board was not mounted (the
    // store handed off, then the courier logged in).
    _sweepHandoffNotifs(ref.read(sysOrdersProvider));
  }

  Future<void> _persistHandoffSeen() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        kCourierHandoffSeenKey,
        jsonEncode({
          for (final e in _handoffSeen.entries) e.key: [...e.value],
        }),
      );
    } on Object catch (_) {}
  }

  /// COURIER v2 ג — 🔔 ',
  't_c0df6c7b': 'אין משלוחים שמתאימים ל\${haulInfo(vehicle).ic} \$haulName. נסה לבחור רכב גדול יותר.',
  't_7c160e86': 'איסוף',
  't_ed0b0d9f': 'אישור מסירה (POD)',
  't_f0d1e5bd': 'אספתי מהחנות',
  't_da4fac5d': 'בוחרים את הרכב להיום — רשימת המשלוחים תסונן לפי הקיבולת ',
  't_282f109b': 'בחירת רכב למשמרת',
  't_1401019f': 'בחר רכב כדי להתחיל את המשמרת — רשימת המשלוחים תסונן לפי הקיבולת',
  't_6e496006': 'דורש \${haulInfo(o.haul).ic} \${haulInfo(o.haul).name} · \${kOrderStageLabel[o.stage]}',
  't_f366a43b': 'האזור האישי שלך — פרטי הנהג, תעודות, טפסים ותלושים.',
  't_b8ef14ac': 'הביצועים שלך — משלוחים שהושלמו, זמני-מסירה ושליחת דוח-יומי לחנות.',
  't_3a1b950d': 'הבית שלך — המשלוחים להיום לפי הרכב שבחרת, עם קידום כל משלוח מאיסוף עד מסירה.',
  't_a5e93f6c': 'הגדרות לוח-השליח — התראות, תצוגה והעדפות אישיות.',
  't_f9715d07': 'ההזמנה \${o.id} תסומן כנמסרה ללקוח — פעולה סופית.',
  't_70028601': 'המשלוח \${o.id} נמסר ✓ +\$kCourierDeliveryCoins מטבעות 🪙',
  't_fb7f9ba0': 'המשלוח \${o.id} עודכן — מסונכרן עם החנות והמנהל ✓',
  't_c0798ffb': 'המשלוחים שלך להיום',
  't_36acf749': 'הפרופיל שלך — פרטי-נהג, נוכחות, טפסים, תעודות-נהג ותלושי-שכר.',
  't_c85d2c7b': 'הקשה על הכרטיס פותחת את גיליון פירוט המשלוח: רשימת הפריטים, לקוח, כתובת, סכום ומסלול ההזמנה, עם קיצורי קידום ו-POD.',
  't_0141ad4d': 'הרכב שלי היום',
  't_06114d65': 'התנתקות מלאה נמצאת באזור האישי.',
  't_461d4805': 'התראות בתוך האפליקציה',
  't_b4ae2f4e': 'והמסירות שהשלמת. התג האדום מציין כמה לא נקראו.',
  't_2ac99151': 'יפ רכב, כך ש-load מאוחר של פרופיל-השליח לעולם לא דורס בחירה ידנית
  /// טרייה. ה-seed מ"סוג רכב מועדף" רץ רק כשהדגל כבוי ו-[_vehicle] עוד null.
  bool _vehicleTouched = false;

  /// 0 משלוחים (ברירת המחדל) · 1 פורטל · 2 דוחות · 3 אזור אישי (#72).
  int _tab = 0;

  /// COURIER v2 ג — per-username order ids whose ',
  't_d34ce6d7': 'יציאה מהלוח חזרה למסך הקודם — אינה מנתקת אותך מהחשבון; ',
  't_df55e9a1': 'לאיסוף',
  't_04f6af1a': 'לאיסוף 📦',
  't_fe8ab8e4': 'לקיחה',
  't_075ca0b1': 'מרכז הכלים — ניווט, צי, אזורי-חלוקה, צ׳אט, יעדי-SLA ואישורי-מסירה במקום אחד.',
  't_d9701ef7': 'משלוח חדש — נמסר לידיך מהחנות',
  't_70783628': 'משלוחים פעילים שמעבר לקיבולת של \${haulInfo(vehicle).name}',
  't_318280fd': 'נמסר ללקוח',
  't_4de23187': 'פותח את גיליון צילום אישור-המסירה — צילום הלקוח/המשלוח שנשמר כהוכחת מסירה. מופיע רק משלב האיסוף ואילך (כשהמשלוח כבר בידיך).',
  't_478079bd': 'פעמון ההתראות — נפתח לרשימת המשלוחים שנמסרו לידיך מהחנות ',
  't_881ece94': 'פרטי המשלוח',
  't_7c8cef36': 'קידום המשלוח',
  't_ae83559c': 'שלו, ומשלוחים גדולים מדי יוצגו בנפרד תחת "דורש רכב אחר".',
  't_6d7ce6e9': '★ מועדף',
  't_34c643ae': '✓ אין משלוחים שמתאימים ל\$haulName כרגע',
  't_2a3fef87': '📸 אישור מסירה · נשמר ✓',
  't_eb44a829': '🕒 נדרש: בתיאום · \${haul.ic} \${haul.name}',
  't_22662d9d': '🚚 \$onRoad משלוחים בדרך — אין איסופים ממתינים',
  't_95c9415c': '🚫 דורש רכב אחר (\${others.length})',
  't_94947506': '🛵 שליח',
  't_37bf658f': '\${haul.ic} דורש \${haul.name}',
  't_9f2fad7f': '\${order.items} פריטים · סה״כ \${fMoney(order.sum)}',
  't_83048003': ';

/// Opens the courier delivery-detail sheet for the order with [orderId].
void showCourierDeliveryDetailSheet(BuildContext context, String orderId) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Theme.of(context).colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (_) => Directionality(
      textDirection: TextDirection.rtl,
      child: CourierDeliveryDetailSheet(orderId: orderId),
    ),
  );
}

/// Stage pill colors — same palette as the courier job card pills.
({Color bg, Color fg}) _stageColors(OrderStage s) => switch (s) {
  OrderStage.ready => (
    bg: const Color(0xFFFFF4D6),
    fg: const Color(0xFF8A6D00),
  ),
  OrderStage.pickup => (
    bg: const Color(0xFFDCEBFF),
    fg: const Color(0xFF2B6CB0),
  ),
  // F-34: #1F8A4C on the light-green pill is 3.75:1 (< AA) — successDark.
  OrderStage.transit || OrderStage.delivered => (
    bg: const Color(0xFFD7F5DF),
    fg: BsTokens.successDark,
  ),
  _ => (bg: const Color(0xFFEFEFEF), fg: BsTokens.mutedLight),
};

class CourierDeliveryDetailSheet extends ConsumerWidget {
  const CourierDeliveryDetailSheet({required this.orderId, super.key});
  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(sysOrdersProvider);
    final idx = orders.indexWhere((o) => o.id == orderId);
    final order = idx >= 0 ? orders[idx] : null;
    if (order == null) {
      // אותו מצב-ריק כן כמו ב-PersonaPodSheet — ההזמנה כבר לא קיימת.
      return Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: BsTokens.space4,
          vertical: BsTokens.space5,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(',
  't_75188481': 'POD זמין משלב האיסוף (כשההזמנה בידי השליח)',
  't_c59de876': 'אין פירוט פריטים שמור להזמנה זו',
  't_36308862': 'חותמות זמן לשלבים יחוברו עם חיבור השרת',
  't_22ba547a': 'מסלול ההזמנה',
  't_1c6c4f8d': 'פריטי המשלוח',
  't_3d442be8': '⏳ ההזמנה עדיין בהכנה אצל החנות',
  't_f50ef0db': '⏳ ממתין למסירה מהחנות',
  't_61884779': '✅ המשלוח נמסר ללקוח — סגור',
  't_fc98958e': '📸 אישור מסירה (POD)',
  't_9b7745f6': ' (F-26 — the shared `demo`
///      username makes username-only filtering leak across boards).
///   3. אישור מחלה — photo uploads via the camera seam + the upload list,
///      with an honest quota-failure toast (the notifier rolls back).
class CourierFormsScreen extends ConsumerStatefulWidget {
  const CourierFormsScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const CourierFormsScreen());

  @override
  ConsumerState<CourierFormsScreen> createState() => _CourierFormsScreenState();
}

class _CourierFormsScreenState extends ConsumerState<CourierFormsScreen> {
  // ── טופס 101 fields ────────────────────────────────────────────────────────
  final _nameCtl = TextEditingController();
  final _idCtl = TextEditingController();
  final _phoneCtl = TextEditingController();
  final _specialtyCtl = TextEditingController();
  String _marital = ',
  't_a20adbf9': ', style: TextStyle(fontSize: 16)),
                const SizedBox(width: BsTokens.space2),
                Expanded(
                  child: Text(
                    value == null ? label : _fmtDate(value!),
                    style: TextStyle(
                      color:
                          value == null
                              ? BsTokens.mutedLight
                              : BsTokens.inkLight,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// One of "הבקשות שלי" — range + reason + a live status pill (the manager',
  't_ea960fe7': ';

/// 📄 טפסים — שליח (#86.3 · F-32) — the courier',
  't_582ee1cc': 's
  /// onChanged, the dropdown via its own onChanged — omitting one silently
  /// reintroduces bug #24.
  bool _touched101 = false;

  /// True once the saved year-form has been loaded into the controllers.
  bool _seededFromSaved = false;

  String? _errName;
  String? _errId;
  String? _errPhone;
  String? _errMarital;

  // ── בקשת חופשה fields ─────────────────────────────────────────────────────
  DateTime? _vacFrom;
  DateTime? _vacTo;
  final _vacReasonCtl = TextEditingController();

  @override
  void dispose() {
    _nameCtl.dispose();
    _idCtl.dispose();
    _phoneCtl.dispose();
    _specialtyCtl.dispose();
    _vacReasonCtl.dispose();
    super.dispose();
  }

  int get _year => DateTime.now().year;

  @override
  Widget build(BuildContext context) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — COURIER-board screen (F-16).
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.courier) {
      return const WelcomeScreen(boardRole: BoardRole.courier);
    }
    final username = session.username;

    final formsState = ref.watch(courierFormsProvider);
    final saved = formsState.form101For(username, _year);
    final sickNotes = formsState.sickNotesFor(username);
    // "Mine" = username AND role (F-26): the demo username is shared across
    // boards, so a demo-worker',
  't_e0bfdc59': 'בוחרים את תאריך ההתחלה והסיום של בקשת החופשה ',
  't_044ee5b5': 'דרך לוח-שנה.',
  't_31fc0425': 'ההגשה הרשמית החתומה תחובר עם חיבור השרת.',
  't_d3642711': 'הסטטוס (ממתינה/אושרה/נדחתה) יתעדכן כאן.',
  't_852c925d': 'הקשה על התמונה פותחת את אישור-המחלה במסך מלא.',
  't_8044d304': 'מוחק את אישור-המחלה לצמיתות (עם דיאלוג אישור).',
  't_9f471cdd': 'מחיקת אישור',
  't_c64320a5': 'ניתן להמשיך לערוך ולשלוח מאוחר יותר.',
  't_583385cd': 'פותח את המצלמה לצילום אישור-מחלה; הצילום נשמר ברשימה למטה.',
  't_3a706a6f': 'צירוף אישור מחלה',
  't_7a468dfe': 'צפייה באישור מחלה',
  't_619c19a6': 'שולח את בקשת החופשה לאישור המנהל בתור המשותף. ',
  't_074d3ebb': 'שומר את טופס 101 במכשיר לשנת המס הנוכחית, בלי לשלוח. ',
  't_a4ab2530': 'שומר ושולח הודעת-הגשה לחנות דרך הצ׳אט. ',
  't_d3e597aa': 'שיחת החנות לא נמצאה — הטופס נשמר אך לא נשלח',
  't_e9a064bc': 'שליחת בקשת חופשה',
  't_146589c2': 'שליחת טופס 101 לחנות',
  't_5a0470b1': 'שמירת טופס 101',
  't_e16125c5': 'תאריכי חופשה',
  't_2bb6f0af': '✓ נשמר ונשלח לחנות ב-\${_fmtDate(saved.sentTs!)}',
  't_521c7015': '🏖️ הבקשה נשלחה לאישור המנהל',
  't_72fc9f45': '🏖️ שלח בקשה לאישור המנהל',
  't_6d38df2c': '📨 טופס 101 נשלח לחנות',
  't_9cc683a9': '📨 שלח לחנות',
  't_0d75b4fc': ' · זמינים היום: \${kHaulAvailabilityDemo[h.id] ?? 0}',
  't_a0d558af': ' → רשימת השיחות של לוח השליח (#75).
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder:
                (_) => const ChatsScreen(
                  persona: BsRole.courier,
                  audience: ',
  't_cbcce594': ')
//   🚛 צי רכב      → גיליון מקומי: kHaulTypes + זמינות demo (SERVER-SWAP) + kFleet
//   🗺️ אזורי הפצה  → רשימה מקומית מכתובות המשלוח האמיתיות + kDistZones (בלי מפה — ביושר)
//   🧭 ניווט למשלוח → SERVER-READY: כרטיס יעד מלא + מצב כן "יחובר עם חיבור השרת"
//   ⏱️ מעקב SLA    → SERVER-READY: פריסת טיימרים + יעדי kDistZones + אותו מצב כן
//
// אין המצאות: כל מספר/מחרוזת מגיעים מה-seeds הקיימים או מההזמנות החיות;
// יכולות תלויות-שרת (ניווט במפות, SLA חי) מוצגות במצב כן — לא כהצלחה מזויפת
// ולא כ-toast עירום.

import ',
  't_e2ca4e9a': ',
                      style: const TextStyle(
                        color: BsTokens.inkLight,
                        fontSize: 13.5,
                      ),
                    ),
                  ),
                  // פריסת הטיימר מוכנה — הערך החי מגיע מהשרת (ביושר: ללא זיוף).
                  const Text(
                    ',
  't_576b5348': ',
                ),
          ),
        );
      case PortalKind.fleet:
        _showFleetSheet(context, tile);
      case PortalKind.zones:
        _showZonesSheet(context, tile, active);
      case PortalKind.nav:
        _showNavSheet(context, tile, active);
      case PortalKind.sla:
        _showSlaSheet(context, tile, active);
      // ratings/bulk/barcode/autoStock/chatContractor אינם בגריד השליח —
      // fallback לגיליון המידע הכללי של persona_portal (לא אמור לקרות).
      case PortalKind.ratings:
      case PortalKind.bulk:
      case PortalKind.barcode:
      case PortalKind.autoStock:
      case PortalKind.chatContractor:
        showPortalSheet(context, tile);
    }
  }

  // ── 📸 אישור מסירה — PersonaPodSheet עבור המשלוח הפעיל ─────────────────────
  void _openPod(BuildContext context, List<SysOrder> orders) {
    // POD רלוונטי רק להזמנות שבידי השליח (pickup/transit) — כמו בכרטיס.
    final eligible =
        orders
            .where(
              (o) =>
                  o.stage == OrderStage.pickup || o.stage == OrderStage.transit,
            )
            .toList();
    if (eligible.isEmpty) {
      // ביושר: אין משלוח פעיל — לא מזייפים POD.
      _sheet(context, ',
  't_f7fa6f56': ',
              style: const TextStyle(
                color: BsTokens.mutedLight,
                fontSize: 12.5,
              ),
            ),
            const SizedBox(height: BsTokens.space2),
            // SERVER-READY: הכפתור קיים ומעוצב אך מושבת בכנות — אין שרת ניווט.
            FilledButton(
              onPressed: null,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(BsTokens.radiusPill),
                ),
              ),
              child: CfgText(
                ',
  't_a9f5e7d3': ',
          onTap: () {
            Navigator.of(context).pop();
            showPodSheet(context, o.id);
          },
        ),
    ]);
  }

  // ── 🚛 צי רכב — kHaulTypes + זמינות demo + רכבי kFleet ─────────────────────
  void _showFleetSheet(BuildContext context, PortalTileData tile) {
    _sheet(context, tile.title, tile.sub, [
      for (final h in kHaulTypes)
        _row(
          // fake-data-sweep: tier + price are real static config (keep, always);
          // the demo "זמינים היום" availability is gated with its label below.
          ',
  't_da85036b': ',
        ),
      // ביושר: הזמינות לעיל היא demo seed (SERVER-SWAP בקובץ זה). מוסתר
      // ל-Apple review (אין הצגת "הדגמה"); הנתונים נשארים. הפיך.
      if (!kHideUnderConstruction)
        _note(',
  't_4a5ab93c': ',
      style: const TextStyle(
        color: Color(0xFF8A6D00),
        fontWeight: FontWeight.w700,
        fontSize: 12.5,
      ),
    ),
  );
}

/// כרטיס יעד לניווט — UI מלא ומוכן-לשרת; כפתור הניווט מושבת בכנות עד שיש שרת.
class _DestinationCard extends StatelessWidget {
  const _DestinationCard({required this.order});
  final SysOrder order;

  @override
  Widget build(BuildContext context) {
    final haul = haulInfo(order.haul);
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space2),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(BsTokens.space4),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              ',
  't_1760eaae': ': 1,
};

/// טאב הפורטל של לוח השליח (#72 טאב 2) — הגריד של [kCourierPortalTiles]
/// כטאב קבוע, עם wiring פר-אריח (#74).
class CourierPortalTab extends ConsumerWidget {
  const CourierPortalTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space5,
      ),
      children: [
        CfgText(
          ',
  't_8bedbaf2': ';

/// זמינות צי לפי סוג רכב — demo seed להמחשה בלבד (כמה רכבים מכל סוג פנויים
/// היום). SERVER-SWAP: יוחלף בזמינות חיה ממערכת ניהול הצי עם חיבור השרת.
const Map<String, int> kHaulAvailabilityDemo = {
  ',
  't_4e0d3408': 'אזורי הפצה · ניווט למשלוח · מעקב SLA. ',
  't_61996670': 'אזורי שירות',
  't_61eb3aa1': 'אין כרגע משלוח בידי השליח — POD זמין משלב האיסוף (לקיחה/בדרך).',
  't_2094760d': 'בחר משלוח פעיל',
  't_dc56afe8': 'הקשה על אריח פותחת את הכלי המתאים.',
  't_a2d1bfab': 'טיימרי SLA חיים יחוברו עם חיבור השרת',
  't_3388dce7': 'יעדי אספקה לפי אזור',
  't_1506b3e3': 'כלי הפורטל',
  't_ab382417': 'כתובות משלוח פעילות',
  't_f2f2ba86': 'משלוחים פעילים',
  't_686cc38d': 'ניווט חי במפות (Waze / Google Maps) יחובר עם חיבור השרת',
  't_9c0e49b1': 'ניווט, צי רכב, צ׳אט ומעקב SLA',
  't_efdf5383': 'רכבי הצי',
  't_6a59e5dd': 'ששת כלי השליח: אישור מסירה · צ׳אט עם החנות · צי רכב · ',
  't_e6f2341b': 'תצוגת מפה חיה תחובר עם חיבור השרת',
  't_6a86b26f': '✓ אין משלוחים פעילים כרגע',
  't_b35a91a0': '✓ אין משלוחים פעילים לניווט כרגע',
  't_d6e1b9da': '🧭 פתח ניווט — יחובר עם חיבור השרת',
  't_dd87b5f5': '🧰 פורטל השליח',
  't_fb9c7122': ' (לא-נבחר) — בלי haulInfo fallback
    // שממציא העדפה.
    _preferredHaul =
        kVehicleRank.containsKey(p.preferredHaul) ? p.preferredHaul : ',
  't_2859f8be': ' : name,
            phone: phone,
            preferredHaul: _preferredHaul,
            photo: _photo,
          ),
        );
    if (!mounted) return;
    if (!ok) {
      setState(() => _saving = false); // מאפשר retry עם תמונה קטנה יותר
      showToast(context, ',
  't_94031b59': ' = לא נבחר.
  late String _preferredHaul;
  String? _photo;
  String? _phoneError;

  /// מגן in-flight: double-tap על "שמור" לא מריץ save כפול / pop כפול.
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final p =
        ref.read(courierProfileProvider)[widget.session.username] ??
        const CourierProfile();
    _name = TextEditingController(
      text:
          p.displayName.isNotEmpty ? p.displayName : widget.session.displayName,
    );
    _phone = TextEditingController(text: p.phone);
    // ערך persisted לא-מוכר ננקה ל-',
  't_51cc34dc': ' אחיד, וכפתור ✏️ שפותח את sheet העריכה.
class _CourierIdentityCard extends StatelessWidget {
  const _CourierIdentityCard({required this.session, required this.profile});

  final BoardSession session;
  final CourierProfile profile;

  @override
  Widget build(BuildContext context) {
    final name =
        profile.displayName.isNotEmpty
            ? profile.displayName
            : session.displayName;
    // רכב-מועדף מוצג רק כשה-id חוקי (kVehicleRank) — בלי haulInfo fallback
    // שממציא רכב שהמשתמש לא בחר.
    final hasHaul = kVehicleRank.containsKey(profile.preferredHaul);
    final meta = [
      if (hasHaul)
        ',
  't_91785470': ' מזויף.
    final ok = await ref
        .read(courierProfileProvider.notifier)
        .save(
          widget.session.username,
          CourierProfile(
            // שמירת ',
  't_4c3381c7': ' משמרת את ה-fallback הכן ל-displayName של ה-session.
            displayName: name == widget.session.displayName ? ',
  't_6b6295f2': ') או ',
  't_ab98e26e': ');

    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          _CourierAvatar(photo: profile.photo, size: 56),
          const SizedBox(width: BsTokens.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: BsTokens.inkLight,
                          fontWeight: FontWeight.w800,
                          fontSize: 18,
                        ),
                      ),
                    ),
                    if (session.demo) ...[
                      const SizedBox(width: BsTokens.space2),
                      // צ',
  't_9a4572a6': ');
      return;
    }
    setState(() => _photo = dataUrl);
  }

  Future<void> _save() async {
    if (_saving) return; // מגן double-tap (in-flight)
    final phone = _phone.text.trim();
    // ולידציית פורמט בלבד (#64) — הטלפון אופציונלי, אבל ערך לא-ריק חייב
    // להיות נייד ישראלי תקין.
    if (phone.isNotEmpty && !validIsraeliMobile(phone)) {
      setState(() => _phoneError = ',
  't_54202540': ');
      return;
    }
    setState(() => _saving = true);
    final name = _name.text.trim();
    // ה-persist הוא AWAITED: כשל quota (תמונה גדולה על web localStorage)
    // מדווח בכנות + rollback ב-store — לא ',
  't_3f4d614a': ');
    Navigator.of(context).pop();
  }

  /// צ',
  't_70be30ac': ',
                      errorText: _phoneError,
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: BsTokens.space3),
                  // ── סוג רכב מועדף (במקום "התמחות" של העובד) ──
                  const Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: CfgText(
                      ',
  't_f7b935c0': ',
              style: TextStyle(
                color: on ? bsOnAccent(context) : BsTokens.inkLight,
                fontSize: 13.5,
                fontWeight: on ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Padding(
        // שומר את השדות מעל המקלדת.
        padding: EdgeInsets.only(
          bottom: MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(BsTokens.radiusCard),
            ),
          ),
          child: SafeArea(
            top: false,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(BsTokens.space4),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: CfgText(
                          ',
  't_93b21f3c': ', style: TextStyle(fontSize: size * 0.46)),
    ),
  );
}

// ─── personal-area card (#86.7) ──────────────────────────────────────────────

/// אזור אישי v2 — ארבע הכניסות בדפוס _PersonalAreaCard של העובד: נוכחות ·
/// טפסים · תעודות נהג · תלושי שכר. שורות ListTile ≥48dp, push רגיל (back
/// מחזיר לטאב הפרופיל). תלושי-שכר = reuse של ה-sheet המשותף ה-role-agnostic
/// (אסור לשכפל ואסור להמציא בו סכומים).
class _CourierPersonalAreaCard extends StatelessWidget {
  const _CourierPersonalAreaCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      // Transparent Material inside the decorated card so the ListTiles',
  't_db54e442': ';

/// מסך עצמאי (נדחף מאייקון הפרופיל ב-AppBar של לוח השליח).
class CourierProfileScreen extends ConsumerWidget {
  const CourierProfileScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const CourierProfileScreen());

  static final List<KbToolNode> _kbNodes = kbCourierProfileNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — אחרי logout/החלפת-תפקיד
    // כשהמסך עדיין בערימה נבנה שער הרישום, לא קליפה ריקה (האידיום של העובד).
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.courier) {
      return const WelcomeScreen(boardRole: BoardRole.courier);
    }

    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          title: const CfgText(
            ',
  't_b6e190bc': ';
    _photo = p.photo;
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    super.dispose();
  }

  /// צילום אמיתי דרך ה-seam המשותף — null = ביטול כן, בלי שינוי.
  Future<void> _pickPhoto() async {
    final dataUrl = await pickTaskPhoto(context);
    if (!mounted) return;
    if (dataUrl == null) {
      showToast(context, ',
  't_c061c233': '@\${session.username} · שליח',
  't_d5febfa1': '@username · שליח',
  't_a5fcc767': 'POD שלי 📸',
  't_f08e6bfd': 'אישור. שונה מ-"יציאה" שב-AppBar של הלוח שרק חוזרת אחורה.',
  't_5aa65b2e': 'בדרך (כלל המערכת)',
  't_33ac4d15': 'בדרך (מתאים לרכב) 🚚',
  't_952b3e5d': 'הנכון פותחת את בורר התפקידים.',
  't_8ce96237': 'ונגישות ומידע משפטי.',
  't_05a7f87b': 'ורישיון רכב עם תאריכי תוקף.',
  't_96b7ca25': 'ושליחת דוח-נוכחות לחנות.',
  't_eeabe6c2': 'ותמונת-פרופיל. השינויים נשמרים בפרופיל שלך.',
  't_a35db142': 'יפים
  /// נבנים מ-kHaulTypes — אין רשימת-רכבים חדשה.
  Widget _haulChip(HaulType h) {
    final on = _preferredHaul == h.id;
    return Semantics(
      button: true,
      selected: on,
      label: h.name,
      excludeSemantics: true,
      child: Material(
        color: on ? BsTokens.brand : Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        child: InkWell(
          borderRadius: BorderRadius.circular(BsTokens.radiusPill),
          onTap: () => setState(() => _preferredHaul = on ? ',
  't_026f93a3': 'יפים מ-kHaulTypes) ·
/// תמונת-פרופיל (ה-seam המשותף pickTaskPhoto — מצלמה אמיתית). נשמר per
/// username דרך [courierProfileProvider] (מפתח bs.courier-profile.v1); כל שדה
/// ריק שומר fallback כן (שם → session.displayName, בלי תמונה → 🛵).
class _EditCourierProfileSheet extends ConsumerStatefulWidget {
  const _EditCourierProfileSheet({required this.session});

  final BoardSession session;

  @override
  ConsumerState<_EditCourierProfileSheet> createState() =>
      _EditCourierProfileSheetState();
}

class _EditCourierProfileSheetState
    extends ConsumerState<_EditCourierProfileSheet> {
  late final TextEditingController _name;
  late final TextEditingController _phone;

  /// id מתוך kHaulTypes (',
  't_0c861578': 'מסירות ישנות ללא ייחוס אינן נספרות (\${stats.unattributed})',
  't_233e7608': 'מסירות — סטטיסטיקה',
  't_1675acc9': 'מעבר ללוח של תפקיד אחר — מוגן בקוד מעבר. הזנת הקוד ',
  't_56f4d511': 'מתנתק מהחשבון ומחזיר אותך למסך ההרשמה — פעולה עם ',
  't_4e497723': 'נמסרו על-ידי ✅',
  't_8e251580': 'סה״כ ערך שנמסר על-ידי: \${fMoney(stats.sum)}',
  't_580cd76d': 'סוג רכב מועדף',
  't_4d653b73': 'עם חיבור השרת.',
  't_0ab3bcb9': 'פותח את ארנק תעודות-הנהג — רישיון נהיגה, ביטוח רכב ',
  't_3616b294': 'פותח את גיליון תלושי-השכר — מוכן לשרת; התלושים יחוברו ',
  't_c7e3345f': 'פותח את מסך ההגדרות — התראות, אזור ושפה, ממשק ',
  't_f9212239': 'פותח את מסך הנוכחות — רישום כניסה/יציאה, טבלה חודשית ',
  't_7f9bee23': 'פותח את מרכז הטפסים — טופס 101, בקשת חופשה ואישור מחלה.',
  't_5dd01446': 'פותח את עורך הפרופיל — שם-תצוגה, טלפון, סוג-רכב מועדף ',
  't_09afbda0': 'פרופיל שליח',
  't_1bed4239': 'רישיון נהיגה · ביטוח רכב · רישיון רכב',
  't_90a07444': 'תנותק מלוח השליח ותחזור למסך ההרשמה.',
  't_cfc5a1fb': '
//      (th-courier-lipskey, מנוע sys_chat — החנות משתתפת בשיחה) + התראת-פעמון
//      תחת המשתמש ',
  't_91c4527f': ' ([workerNotifsProvider]) שפעמון הספק (#82) קורא.
//
// #86.6 (F-13): הערך הכספי ומוני ה"נמסרו"/"POD" בדוח-היומי, בפעמון ובכרטיס-
// הערך מסוננים ל-`courierUser` של הסשן המחובר (ייחוס per-שליח, F-1) — רשומות
// legacy ללא ייחוס אינן נספרות כ"שלי", בכנות. "פעילים" נשאר כלל-מערכתי עם
// תווית כנה (אין ייחוס שליח לפני רגע המסירה).
//
// אין המצאות: כל המספרים נגזרים חיים; מקום שאין בו דאטה אומר זאת בכנות.
//
// SIDE-MAP CONTRACTS:
//   bs.courier-clock.v1  {orderId: {pickedUpAt: iso, deliveredAt: iso,
//                         attempts: n}} — read-only here; WRITTEN by the shared
//                         [stampCourierClock] helper (state/courier_clock.dart,
//                         F-10) at the courierAdvance moments (pickup→transit =
//                         pickedUpAt · transit→delivered = deliveredAt;
//                         attempts defaults to 1, incremented only by a real
//                         failed-attempt flow when one exists).
//   bs.pod-photos.v1     {orderId: ',
  't_edddc38a': ' כן למסירות שקדמו לשעון.
//   ⑤ זמן איסוף→מסירה — ממוצע + פירוט מהחותמות בלבד; אין מדידות → מצב-ריק כן.
//   ⑥ היסטוריית מסירות — תמונת POD אמיתית (data-URL) כתמונה ממוזערת לחיצה
//      (≥48dp) שנפתחת במסך מלא עם X מפורש; ללא תמונה → טקסט כן, לא-לחיץ.
//   ⑦ שלח דוח-יומי לחנות — הודעת צ׳אט אמיתית לשיחת ',
  't_61ec42f2': '\${order.items} פריטים · \${fMoney(order.sum)} · ',
  't_6d592607': '\${s.displayName} — נמסרו על-ידו: \${mine.length} · פעילים: \$active · \${fMoney(deliveredSum)}',
  't_2889561e': '),
          ],
        ),
        const SizedBox(height: BsTokens.space2),

        // ── ② + ③ KPI row: BuildCoins · streak · first-attempt % ──
        Row(
          children: [
            // F-33: מאזן המטבעות הוא overlay אחד לכל המכשיר (bs.rewards.v1,
            // ללא username) — תווית כנה, לא מספר שמתחזה ל-per-שליח.
            _RStat(
              value: ',
  't_086fa5f1': ').
//   ③ % מסירה-ראשונה — מסירות שנמדדו בלי ניסיון חוזר מתוך כלל הנמדדות.
//   ④ מסירות לפי יום — תרשים עמודות שבועי מחותמות deliveredAt (עמודות-Container,
//      בלי ספריית תרשימים) + דלי ',
  't_01fd3ddf': ',
                  style: const TextStyle(
                    color: BsTokens.mutedLight,
                    fontSize: 12.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// תיבת סטטיסטיקה — אותו מראה כמו _Stat של לוח השליח.
class _RStat extends StatelessWidget {
  const _RStat({required this.value, required this.label});
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        padding: const EdgeInsets.symmetric(vertical: BsTokens.space3),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0F000000),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                color: BsTokens.inkLight,
                fontWeight: FontWeight.w800,
                fontSize: 17,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(color: BsTokens.mutedLight, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

/// White card with a bold title — the worker-reports card style.
class _RCard extends StatelessWidget {
  const _RCard({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusCard),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: BsTokens.space3),
          ...children,
        ],
      ),
    );
  }
}

/// Label-value row (order id ← → metric), RTL-safe.
class _KvRow extends StatelessWidget {
  const _KvRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: BsTokens.inkLight, fontSize: 13.5),
            ),
          ),
          const SizedBox(width: BsTokens.space2),
          Text(
            value,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

/// The weekly bar chart — plain Containers, no chart lib (the worker-reports
/// idiom). Sunday-first; under the board',
  't_a72dfc19': ',
                // ביאור כן (כמו F-3): רשומות legacy בלי ייחוס לא נספרות.
                ',
  't_a19667bf': ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לשליח בנפרד); הרצף ו-% מסירה-ראשונה נמדדים מחותמות שעון-המשלוחים — עדיין אין מסירות שנמדדו.',
  't_9fce48b9': ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לשליח בנפרד); הרצף נמדד מחותמות שעון-המשלוחים. מסירה-ראשונה: \$firstAttempt מתוך \${measuredDelivered.length} מסירות שנמדדו — ללא ניסיון חוזר.',
  't_b134c94c': 'אין מסירות שנמדדו השבוע.',
  't_abbfadfb': 'אין עדיין מדידות זמן — הזמן נמדד אוטומטית מרגע אישור האיסוף ועד המסירה ללקוח.',
  't_858f3a31': 'אין עדיין מסירות שהושלמו',
  't_5e52f1e2': 'אין שליח מחובר',
  't_f33ee0ae': 'אין שליח מחובר — הדוח לא נשלח',
  't_31e73fc9': 'דוח יומי מהשליח 🛵',
  't_9d72c2be': 'דוח-יום — שליח \${s.displayName}',
  't_2b517383': 'הדוח נשלח כהודעה אמיתית לשיחת "חנות ליפסקי" (מנוע הצ׳אט המשותף — החנות משתתפת בשיחה) + התראת-פעמון לחנות. מוני המסירות והערך מיוחסים לשליח המחובר בלבד, בלי המצאות.',
  't_44dc4eec': 'היסטוריית מסירות',
  't_5d930f01': 'הקשה על תמונת ה-POD פותחת אותה במסך מלא — צילום הוכחת-המסירה שצולם בעת מסירת המשלוח. מופיעה רק כשיש צילום אמיתי.',
  't_95664371': 'ללא חותמת',
  't_fb587271': 'מטבעות — מאזן \${orgTerm(ref, ',
  't_6ba3aeec': 'ממוצע (\${timed.length} מסירות)',
  't_b48593c8': 'מסירה-ראשונה 🎯',
  't_5afbe5f6': 'מסירות',
  't_2199259f': 'משלוח שיסומן "נמסר ללקוח" יופיע כאן',
  't_849cc560': 'נתונים חיים ממנוע ההזמנות המשותף — ללא המצאות',
  't_b62b30a4': 'סה״כ ערך שנמסר על-ידי: \${fMoney(deliveredSum)}',
  't_61ea8744': 'עוד אין מסירות שהושלמו — מסירה שתסומן "נמסר ללקוח" תופיע כאן.',
  't_57a29f43': 'פעילים 🚚',
  't_541a8345': 'צפייה באישור מסירה',
  't_b6c3f205': 'שולח לחנות סיכום יומי כהודעת צ׳אט אמיתית + התראת-פעמון: כמה משלוחים נמסרו על-ידך, פעילים, POD וערך כספי. המספרים מיוחסים לשליח המחובר בלבד.',
  't_9de667d3': 'שלח דוח יומי לחנות',
  't_74840d61': '⏱️ זמן איסוף→מסירה',
  't_31115be5': '✅ נמסרו היום (נמדד): \$deliveredToday',
  't_784f447d': '🏪 הדוח נשלח לחנות — שיחה + התראת-פעמון',
  't_961d36a3': '🏪 שלח דוח-יומי לחנות',
  't_ee9852b6': '💰 ערך שנמסר על-ידי: \${fMoney(deliveredSum)}',
  't_a76662d1': '💰 ערך שנמסר: \${fMoney(deliveredSum)}',
  't_6f337676': '📅 מסירות לפי יום',
  't_92c2002c': '📦 סה״כ נמסרו על-ידי: \${mine.length}',
  't_98122777': '📸 POD נשמר ✓',
  't_6c754095': '📸 POD שלי: \$podCount',
  't_803c49b1': '📸 POD — הקש לתצוגה',
  't_97de3004': '📸 ללא POD',
  't_65e6ccfe': '🗓️ ללא חותמת: \$noStamp \${noStamp == 1 ? ',
  't_dbc2ffd7': '🚚 משלוחים פעילים (כלל המערכת): \$active',
  't_ae4ea138': ',
                      style: TextStyle(
                        // F-28 — bsOnAccent על מילוי-מותג (לא לבן קשיח): מכבד
                        // את מתג הניגודיות-הגבוהה שנמצא במסך הזה עצמו.
                        color: bsOnAccent(context),
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
          title: Text(
            title,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          children: children,
        ),
      ),
    );
  }
}

class _SwitchRow extends StatelessWidget {
  const _SwitchRow({
    required this.cfgId,
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String cfgId;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      title: CfgText(
        cfgId,
        label,
        style: const TextStyle(color: BsTokens.inkLight),
      ),
      value: value,
      activeColor: BsTokens.brand,
      onChanged: onChanged,
    );
  }
}

/// אופציה לבורר רדיו — `enabled:false` מציג "בקרוב" ולא ניתן לבחירה (ביושר).
class _RadioOption<T> {
  const _RadioOption({
    required this.value,
    required this.label,
    this.enabled = true,
  });

  final T value;
  final String label;
  final bool enabled;
}

class _RadioGroupRow<T> extends StatelessWidget {
  const _RadioGroupRow({
    required this.labelId,
    required this.label,
    required this.value,
    required this.options,
    required this.onChanged,
  });

  final String labelId;
  final String label;
  final T value;
  final List<_RadioOption<T>> options;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: CfgText(
            labelId,
            label,
            style: const TextStyle(color: Colors.black54, fontSize: 13),
          ),
        ),
        ...options.map(
          (o) => RadioListTile<T>(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            title: Row(
              children: [
                Text(
                  o.label,
                  style: TextStyle(
                    color: o.enabled ? BsTokens.inkLight : BsTokens.mutedLight,
                  ),
                ),
                if (!o.enabled) ...[
                  const SizedBox(width: 8),
                  // composite hide: whole "בקרוב" pill vanishes, not just its label.
                  CfgVisible(
                    ',
  't_8ba077f3': ', enabled: false),
            ],
            onChanged:
                (v) => ref
                    .read(appSettingsProvider.notifier)
                    .update((s) => s.copyWith(lang: v)),
          ),
        ),
      ],
    );
  }
}

// ─── 3. ממשק ונגישות (catalogSettingsProvider — מתגים כלל-אפליקציה) ───────────

class _CourierAccessibilitySection extends ConsumerWidget {
  const _CourierAccessibilitySection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(catalogSettingsProvider);
    // #31 — כל פקד עטוף ב-HelpTarget עם אותו הסבר-מקטע (אפס שינוי-התנהגות).
    const accessBody =
        ',
  't_25660184': ';

/// Full-screen courier settings — 4 categories, all leaves persisted via the
/// existing providers. Gated by [boardAuthProvider] (F-4: "מבחוץ לא רואים
/// כלום" — logout while this screen is stacked rebuilds it as the gate).
class CourierSettingsScreen extends ConsumerWidget {
  const CourierSettingsScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const CourierSettingsScreen());

  static final List<KbToolNode> _kbNodes = kbCourierSettingsNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔒 BOARD GATE (חוק הלוחות, כלל 4 — "מבחוץ לא רואים כלום") — F-4: בלי
    // session של שליח נבנה אך ורק שער הרישום במצב-תפקיד; כך גם כל המסך הזה
    // בערימה אחרי logout נבנה-מחדש כשער (האידיום של העובד —
    // worker_settings_screen).
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.courier) {
      return const WelcomeScreen(boardRole: BoardRole.courier);
    }

    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          title: const CfgText(
            ',
  't_09ae2d22': 'בוחר את שפת האפליקציה. כרגע רק עברית פעילה; ',
  't_eb4c6446': 'בחירת שפה',
  't_f6e106d2': 'הודעות צ׳אט חדשות',
  't_30c8e1de': 'התראות Push',
  't_444afca7': 'כל שינוי נשמר ומשפיע על כל הלוחות.',
  't_642cbe84': 'מפעילים/מכבים סוגי התראות: Push, עדכוני משלוחים, הודעות צ׳אט, ',
  't_75eaa97b': 'ערבית ואנגלית מסומנות "בקרוב".',
  't_748d7584': 'פותח את מסמך מדיניות-הפרטיות של האפליקציה.',
  't_5513fbdb': 'פותח את מסמך תנאי-השימוש של האפליקציה.',
  't_3809a1a2': 'צליל',
  't_63db9f38': 'שקט בזמן נהיגה',
  't_65e6e38e': 'שקט בזמן נהיגה, צליל ורטט. כל מתג נשמר מיד.',
  't_643386c9': 'אי-אפשר לומר כמה מהמסגרת נוצל. אל תעריך, אל תשער ואל תרמוז מהי המסגרת, ',
  't_5e758a06': 'אתה יועץ-אשראי מנוסה למנהל-רכש. אתה מסביר בקצרה ובכנות מה משמעות ניצול-האשראי ',
  't_3ae49d29': 'במספרים שניתנו לך — אל תמציא, תשנה או תוסיף שום מספר.',
  't_cc7ae67f': 'הסבר למנהל ב-2–3 משפטים בעברית מה המשמעות של ניצול-האשראי הזה — האם הלקוח ',
  't_fa8ca282': 'ואל תמליץ אם לאשר הזמנה. השתמש אך ורק במספר שניתן לך.',
  't_a5eafa14': 'כתוב למנהל 2–3 משפטים בעברית. פתח בכך שאין מסגרת-אשראי רשומה ולכן ',
  't_dbfda859': 'מסגרת',
  't_282a43c3': 'מסגרת-אשראי: ₪\$creditLimit · נוצל: ₪\$used · יתרה: ₪\$balance · ',
  't_e6f9ce15': 'ניצול',
  't_9b97f88d': 'קרוב לתקרה או פנוי, ומה כדאי לשקול לפני אישור הזמנה נוספת. השתמש אך ורק ',
  't_ddadf4be': 'של לקוח. השתמש אך ורק במספרים שניתנו לך; לעולם אל תמציא, תשנה או תוסיף מספר.',
  't_46f49cd3': '⚙️ המספרים מנתוני-המערכת; ה-AI רק מסביר אותם.',
  't_2595cf92': '💳 הסבר אשראי',
  't_b3f8f671': 'טענו רשימת לקוחות מקובץ CSV — שם חובה, טלפון ואימייל נבדקים, כפילויות מסוננות אוטומטית.',
  't_0a3de4f7': 'נמצאו \${report.errors.length} שגיאות — תקנו והעלו שוב',
  't_54973826': '⚠️ \${quality.flagged} אזהרות איכות (לא חוסמות) — כדאי לבדוק',
  't_5d228368': '✅ נטענו \$committed לקוחות',
  't_6433a534': '👥 ייבוא לקוחות',
  't_6840c0f2': 'אתה עוזר שמנסח דוח-יום קצר ומקצועי מנתונים שכבר נרשמו. השתמש אך ורק במספרים ',
  't_452f9d1a': 'הדוח הועתק',
  't_efe4744c': 'השתמש אך ורק במספרים שניתנו לך — אל תמציא, תשנה או תוסיף שום מספר.',
  't_c73ffe86': 'נסח מהם דוח-יום קצר וזורם בעברית (2–4 משפטים), מוכן לשליחה ללקוח/לחנות. ',
  't_e11846b8': 'שניתנו לך; לעולם אל תמציא, תשנה או תוסיף מספר.',
  't_94212043': '⚙️ המספרים נרשמו במערכת; ה-AI רק מנסח אותם לדוח.',
  't_b07102d8': '✨ ניסוח חכם',
  't_d7139a6e': '💡 ניסוח-הדוח החכם דורש חיבור לשרת.',
  't_6607ed0a': ',
                      style: const TextStyle(
                        color: BsTokens.brandDark,
                        fontWeight: FontWeight.w700,
                        fontSize: 11.5,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

/// The role-aware add-form (one instance per session) — name (required) ·
/// מיקום (optional) · חומרה (a segmented choice incl. an unspecified default) ·
/// a brand-filled save. Bound to the State',
  't_ef6fe895': ';

/// Open the shared ליקויים sheet — the wire target for the ',
  't_152ad5a3': '` to TaskItem + the `defectsProvider` kind-filter, and
// the contractor/worker authoring rides the same createTask/proposeTask the
// regular §6 tasks use). "ליקויים same as משימות" — a defect reuses the ENTIRE
// task lifecycle, so this surface adds NO new approve/reject UI:
//   • CONTRACTOR (the `manager`-role board that opens tasks_screen',
  't_40af9238': 's _contractorProposals), no separate approval here.
//
// PARALLEL to contractor_attendance_sheet.dart — same showXSheet +
// DraggableScrollableSheet + RTL + grab-handle/header/close idiom — but the body
// is a ConsumerStatefulWidget because the add-form owns TextEditingControllers
// (disposed with the State). HONEST by construction: only defects that exist are
// listed; 🔧 מיקום / a severity badge appear only when non-empty (never an
// invented place/severity); an empty name is a no-op (no toast).
//
// SCOPING mirrors the existing idioms: the contractor sees this employer',
  't_b04806cc': 's queue.
//   • WORKER → "➕ דווח ליקוי" mints a `proposed` defect (proposeTask,
//     kind:',
  't_e22ea970': 'אין ליקויים',
  't_6af3cd84': 'דווח ליקוי',
  't_a47cc936': 'דווח על ליקוי שמצאת — הוא יישלח לקבלן לאישור.',
  't_4a08b317': 'הליקוי דווח לקבלן לאישור 🔧',
  't_c56810d7': 'הליקוי נפתח 🔧',
  't_6d1d6810': 'חומרה',
  't_ce8d746b': 'חמור',
  't_b963b751': 'לדוגמה: אמבטיה ראשית',
  't_93a8507e': 'לדוגמה: נזילה מתחת לכיור',
  't_f4a9b6cd': 'מה הליקוי',
  't_d6dcfebe': 'מיקום (אופציונלי)',
  't_553e2979': 'פתח ליקוי',
  't_eb6351a6': 'פתח ליקוי ושייך אותו לעובד, ועקוב אחרי הליקויים הפתוחים.',
  't_9dff9ebc': 'קל',
  't_69afaa5e': '➕ דווח ליקוי',
  't_7838f6e6': '➕ פתח ליקוי',
  't_d523d3b7': '🔧 ליקויים',
  't_9208a9ed': ',
      children: [for (final c in cats) leaf(c)],
    ),
  ];
}

/// Benzi #5 — when true, the open department shows ALL its products in one flat
/// list ("ברצף, ללא קשר לקטלוג") instead of the catalog tree/finder navigation.
final deptFlatProductsProvider = StateProvider<bool>((_) => false);

/// Every product in a department',
  't_ccf4ee89': 's **finder (בית)** scoped to its
/// `WaterSystem`, so every browse section (finder / categories / tree / search)
/// shows only that system',
  't_34c22050': 's first tab so the chrome (AppBar + bottom nav)
/// stays put; tapping the מחלקות tab resets it.
final homeDepartmentProvider = StateProvider<String?>((_) => null);

/// Build a drill path for a tool department straight from its leaf `categoryHe`
/// names — a synthetic node tree, so the department gathers categories that live
/// in different branches (e.g. כלי עבודה + חותך צינורות). One category drills
/// straight to its products; several show a row each, then drill to products.
/// `_TreeDrill` only needs `lipskeyCategory` (leaf) / `children` (branch).
List<CatalogNode> _toolDeptPath(String name, List<String> cats) {
  CatalogNode leaf(String c) =>
      CatalogNode(id: ',
  't_f081d767': 's spec (#2). Two are the clean-water/sewage
  // division (`system`); two more (כלי עבודה) gather EVERY real tool category in
  // the catalog (`toolCats` — leaf `categoryHe` names; a full audit of all 99
  // categories found these are the only genuine tools). The rest stay
  // placeholders until their catalog data exists (R8 — no data, no invention).
  static const List<
      ({
        String name,
        IconData icon,
        bool live,
        WaterSystem? system,
        List<String>? toolCats,
      })> departments = [
    (name: ',
  't_309c2393': 't a plumbing system).
            ref.read(catalogSystemFilterProvider.notifier).state = null;
            ref.read(catalogTreePathProvider.notifier).state =
                _toolDeptPath(dept.name, toolCats);
          } else {
            // Catalog department (ברזים/אינסטלציה — Benzi #1 reframed) → open the
            // grouped headings (no water-system scope; clear any drill).
            ref.read(catalogSystemFilterProvider.notifier).state = null;
            ref.read(catalogTreePathProvider.notifier).state = const [];
          }
          ref.read(deptFlatProductsProvider.notifier).state = false;
          ref.read(homeDepartmentProvider.notifier).state = dept.name;
        },
        child: Semantics(
          label: dept.live ? dept.name : ',
  't_49aa51d2': 'אין מחלקות עדיין — יופיעו עם טעינת קטלוג החברה',
  't_161e48a5': 'אין קטגוריות במחלקה זו',
  't_155645b1': 'אספקה טכנית',
  't_86556bf8': 'גבס ופרופילים',
  't_6296a276': 'הקטגוריות יופיעו כאן כשיתווסף קטלוג למחלקה',
  't_36cc8ec1': 'חומרי בניין',
  't_31644dfb': 'חשמל',
  't_7b087cc7': 'כל המחלקות',
  't_f1b34aa6': 'מים נקיים',
  't_5ad70a95': 'צבע וכלים לצבע',
  't_f50c7ffd': 'אם שום עבודה ברשימה לא מתאימה, החזר NONE.',
  't_06295df8': 'אתה ממפה בקשת אינסטלטור לעבודה אחת מרשימה סגורה. החזר אך ורק key מהרשימה ',
  't_3375e1c4': 'בחר את ה-key של העבודה האחת שהכי מתאימה לבקשה — מתוך הרשימה בלבד. ',
  't_5c7a0b9f': 'הוסף \${_products.length} לסל',
  't_b44dadaa': 'החזר אך ורק את ה-key (שורה אחת, ללא טקסט נוסף). ',
  't_6ba950aa': 'זוהתה העבודה, אך לחלקיה עדיין אין מק"ט מקושר.',
  't_f60e775a': 'לא זוהתה עבודה מתאימה — נסה לתאר אחרת.',
  't_1515ba33': 'לדוגמה: יש לי נזילה מתחת לכיור במטבח',
  't_ad568777': 'מצא לי את הסל',
  't_c7d80e67': 'נוספו \${_products.length} פריטים לסל ✓',
  't_2e5ad42e': 'ספר במילים שלך מה אתה צריך:',
  't_48dc202d': 'ר דורש חיבור לשרת.',
  't_98546b41': 'שניתנה, או NONE. לעולם אל תמציא key ואל תכתוב שם-מוצר.',
  't_8542fdf8': '🗣️ תאר עבודה → סל',
  't_0f4201e9': ';

/// #101 · שער-מוכנות מסמכים (HARD gate) — the blocking screen the worker board
/// (and the courier board) shows INSTEAD of their board content while the
/// logged user',
  't_e20853ae': 'אין פריטים חוסמים',
  't_ac357ab3': 'בדוק שוב',
  't_e1953182': 'המעסיק יגדיר את רשימת המסמכים המחייבת בצד-השרת.',
  't_5e7acb47': 'טופס 101',
  't_c593806a': 'כדי להתחיל לעבוד צריך להשלים את המסמכים הנדרשים ולוודא שהם בתוקף.',
  't_3faa58aa': 'כדי להתחיל משמרת צריך להשלים את תעודות-הנהג הנדרשות ולוודא שהן בתוקף.',
  't_53a851a1': 'ℹ️ רשימת המסמכים הנדרשים כאן היא כלל-הדגמה זמני. ',
  't_8bde2119': '⚠️ לתשומת לבך — יפוג בקרוב',
  't_fb4dd5f3': '⛔ חוסם — חובה להשלים',
  't_eb6128d1': '📝 מלא/חתום טופס 101',
  't_26402b70': '🔄 בדוק שוב',
  't_d4746afe': '🔒 מסמכים חסרים',
  't_8c7879a8': '🔒 מסמכים חסרים — לא ניתן להתחיל עבודה',
  't_bc208501': '🚗 תעודות נהג',
  't_537246f7': '🦺 תיק בטיחות — תעודות',
  't_1204f84c': ' : term.name,
                style: const TextStyle(
                  color: BsTokens.inkLight,
                  fontWeight: FontWeight.w800,
                  fontSize: 15,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                due,
                style: const TextStyle(
                  color: BsTokens.mutedLight,
                  fontSize: 12.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// T1.3 — קבלני משנה · proto finSubs @index.html:19569
//   3 subcontractors · allocated/spent/% + utilisation bar · over→danger.
// ═════════════════════════════════════════════════════════════════════════════
void _openSubs(BuildContext context) {
  final totAlloc = kSubcontractors.fold<int>(0, (s, x) => s + x.allocated);
  final totSpent = kSubcontractors.fold<int>(0, (s, x) => s + x.spent);
  // Empty-safe (clean/company2 gate kSubcontractors): zero allocation → 0%
  // (the budgetPct() idiom), never NaN.round().
  final totPct = totAlloc > 0 ? (totSpent / totAlloc * 100).round() : 0;
  _showFinSheet(
    context,
    child: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _FinHead(
            ic: ',
  't_116cce97': ' יום מקבלת החשבונית',
  't_a2363bf1': ' ימי איחור · ',
  't_ab7d024a': ' ליום · 📅 ',
  't_ea9dfdff': ' — עדכון אוטומטי של ערכי החוזה.',
  't_b9a1a427': '\${AppBrand.name} — דוח פיננסי לפרויקט',
  't_60e487f2': '\${fMoney(item.amount)} · מבקש: \${item.by}',
  't_c04423c7': '\${p.days} ימי איחור · \${fMoney(p.perDay)} ליום · 📅 \${p.createdAt}',
  't_79c6a09e': '+ רישום קנס איחור',
  't_660cfb8c': ',
                      style: const TextStyle(
                        color: Color(0xFF888888),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ReportH2 extends StatelessWidget {
  const _ReportH2(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: BsTokens.space2),
    child: Text(
      text,
      style: const TextStyle(
        color: _kBrandTeal,
        fontWeight: FontWeight.w700,
        fontSize: 14,
      ),
    ),
  );
}

class _ReportTable extends StatelessWidget {
  const _ReportTable({required this.rows});
  final List<(String, String, bool)> rows; // (label, value, big)
  @override
  Widget build(BuildContext context) {
    const border = BorderSide(color: Color(0xFFDDDDDD));
    return Table(
      border: const TableBorder(
        top: border,
        bottom: border,
        left: border,
        right: border,
        horizontalInside: border,
        verticalInside: border,
      ),
      columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth()},
      children: [
        for (final r in rows)
          TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(
                  r.\$1,
                  style: const TextStyle(
                    color: Color(0xFF16191D),
                    fontSize: 13,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(
                  r.\$2,
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    color: const Color(0xFF16191D),
                    fontSize: r.\$3 ? 16 : 13,
                    fontWeight: r.\$3 ? FontWeight.w800 : FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
      ],
    );
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// T1.10 — רכש במט״ח · proto finFX @19773 + updateFXCalc @19797
//   USD/EUR/GBP rates + live amount×rate converter (kFxRates).
// ═════════════════════════════════════════════════════════════════════════════

/// The FX rates to SHOW — gated at the consumer (the minimal correct gate, since
/// `kFxRates` is a plain const map read directly here, not through a repository).
/// On the live Firebase backend there is NO real FX feed yet, so the const DEMO
/// rates (USD 3.72 / EUR 4.05 / GBP 4.71) MUST NOT be shown to a real signed-in
/// user as if they were live server rates — return an EMPTY map there. With the
/// backend OFF (the shipped demo path) this is byte-identical to reading
/// `kFxRates` directly (zero regression). The seed const itself is untouched.
/// clean/company2 ([kProfileEmptySeeds]) get the same empty map — no demo rates.
Map<String, double> _fxRatesToShow() =>
    (useFirebaseBackend || kProfileEmptySeeds) ? const {} : kFxRates;

void _openFx(BuildContext context) {
  _showFinSheet(
    context,
    child: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _FinHead(
            ic: ',
  't_39c5d658': ', style: const TextStyle(fontSize: 16)),
          const SizedBox(width: BsTokens.space2),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: BsTokens.inkLight, fontSize: 13.5),
            ),
          ),
        ],
      ),
    );
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// T1.6 — ניתוח ROI · proto finROI @index.html:19657
//   value=round(total*1.42) · profit=value-total · roi=profit/total*100.
// ═════════════════════════════════════════════════════════════════════════════
void _openRoi(BuildContext context) {
  final r = projectRoi(); // contractValue / profit / roiPct
  final invested = financeRepo().budgetSpent(); // == kBudgetSpent (9840)
  _showFinSheet(
    context,
    child: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _FinHead(
            ic: ',
  't_0c03bde7': '80% / 90% מהתקציב',
  't_ae52b05c': ';

// ═════════════════════════════════════════════════════════════════════════════
// PALETTE — finance-sheet specific colours (proto fin-up / fin-dn / danger).
// ═════════════════════════════════════════════════════════════════════════════
const Color _kUp = Color(0xFF1FA971); // fin-up (green, positive change/profit)
const Color _kDn = Color(
  0xFFE5484D,
); // fin-dn / --danger (red, negative/penalty)
const Color _kBrandTeal = BsTokens.brand; // W0: unified to brand (was teal); name kept

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRIES
// ═════════════════════════════════════════════════════════════════════════════

/// Opens the מרכז פיננסים hub — a 2-col grid of the 10 finance tiles.
/// proto `openFinanceHub` @index.html:19489. Tapping a tile opens its leaf sheet.
void openFinanceHub(BuildContext context) {
  _showFinSheet(context, child: _FinanceHubGrid(parentCtx: context));
}

/// Dispatch a single finance leaf by its menu `fin-*` id (see kFinanceHub in
/// data/menu_trees.dart). Unknown ids fall through to the hub grid.
void openFinanceLeaf(BuildContext context, String id) {
  switch (id) {
    case ',
  't_8c031b6a': 'ROI צפוי',
  't_5d904dfc': 'אושרה ✓',
  't_6f5afa8f': 'איחורים באספקה',
  't_25e45f90': 'אין בקשות לאישור',
  't_9cc4e39b': 'אירו (EUR)',
  't_46aaf766': 'אישור בקשת רכש',
  't_5f3322a9': 'אישורי רכש',
  't_adf7ece4': 'בחר את תנאי התשלום של הפרויקט — משפיע על מועדי החיוב.',
  't_b735b7e2': 'בקשה ',
  't_38a2ae20': 'בקשה \${a.id} \${ok ? ',
  't_f7207273': 'בקשות רכש הממתינות לאישור מנהל לפני ביצוע ההזמנה.',
  't_9a74bf6e': 'דוח פיננסי — \${AppBrand.name}',
  't_15fdf92c': 'דוח רשמי להורדה',
  't_935541b2': 'דוחות PDF',
  't_168593cd': 'דוחות PDF רשמיים',
  't_64e7222c': 'דולר אמריקאי (USD)',
  't_dd7d7813': 'הדפסה',
  't_39bece83': 'הופק על ידי מערכת \${orgTerm(ref, ',
  't_2e53771a': 'הוצאות בפועל',
  't_21aab25d': 'הושקע עד כה',
  't_41f2025a': 'החלטת רכש',
  't_466e1449': 'המרת סכום',
  't_04b61ee9': 'הפקת דוח פיננסי רשמי של הפרויקט להורדה והדפסה.',
  't_3b8f8bfc': 'הצמדה למדד',
  't_b5314e3b': 'התראות חריגה',
  't_88b87877': 'התראות חריגת תקציב',
  't_8895e2d6': 'התראת חריגה',
  't_969b47b4': 'התראת חריגה ראשונית',
  't_5fe9c171': 'התשלום מתבצע ',
  't_d6a2ee53': 'התשלום מתבצע \${term.days} יום מקבלת החשבונית',
  't_3579c0c8': 'חלוקת תקציב הפרויקט בין קבלני המשנה ומעקב ניצול.',
  't_12f46fb6': 'חריגה מלאה מהתקציב',
  't_64076038': 'חריגה קריטית',
  't_8dcaaffd': 'חריגה קריטית — נדרש אישור',
  't_44474455': 'כמה ימי איחור?',
  't_ef49204b': 'לא נרשמו קנסות',
  't_f3e5ed9f': 'לירה שטרלינג (GBP)',
  't_09d83427': 'לפי סעיפי תקציב',
  't_3a770569': 'מדד בסיס (חתימת חוזה)',
  't_8d7765f0': 'מדד נוכחי',
  't_38b9d1a7': 'מדד תשומות הבנייה',
  't_0d9235de': 'מדד תשומות הבנייה — עדכון אוטומטי של ערכי החוזה.',
  't_e5e85ca0': 'משולם בכל אבן דרך',
  't_877ce43e': 'נוצל \${fMoney(sub.spent)} מתוך \${fMoney(sub.allocated)}',
  't_9ef2d8f1': 'נוצל: \${fMoney(totSpent)} (\$totPct%)',
  't_44dcad2b': 'ניהול פיננסי מלא של הפרויקט — תקציב, תשלומים, אישורים ודוחות.',
  't_df49ce8f': 'ניהול קנסות על איחור באספקה — פיצוי מוסכם לפי יום.',
  't_8fbfa07c': 'ניטור דינמי — התראה אוטומטית בהגעה ל-80% ול-90% מהתקציב.',
  't_539f11ba': 'ניתוח ROI',
  't_ccd2e7c1': 'סך הוקצה לקבלני משנה',
  't_2185e5b1': 'סך החשבונית',
  't_326228e7': 'סך קנסות שנצברו',
  't_52fa55fa': 'פוצלה ל-\${cats.length} סעיפי תקציב לפי משקל',
  't_8443bb0f': 'פיצויים וקנסות',
  't_90cbd93d': 'פיצול חשבוניות',
  't_3c7998db': 'פיצול חשבונית',
  't_94132174': 'פיצול חשבונית בסך \${fMoney(kInvoiceTotal)} לסעיפי התקציב.',
  't_5e42e417': 'פיצול חשבונית לסעיפי התקציב.',
  't_8c823a0e': 'פירוט לפי סעיפים',
  't_551a34ca': 'קבלני משנה',
  't_658a8e9d': 'קנס איחור נרשם: ',
  't_7f0a5919': 'קנס איחור נרשם: \${fMoney(amt)}',
  't_da01bf68': 'רווח גולמי צפוי',
  't_482ac894': 'רכש במט״ח',
  't_cdfe7f8f': 'שווי חוזה צפוי',
  't_f0e0a1a7': 'שוטף+30/60, אבני דרך',
  't_e701b3a6': 'שערי חליפין לרכש מספקים בחו״ל.',
  't_803a2569': 'שערים בזמן אמת',
  't_d04c3b08': 'תאריך הפקה: \$today',
  't_57d88c06': 'תוספת הצמדה: \${fMoney(linked - budget)}',
  't_e3db78f2': 'תמצית תקציב',
  't_8d49edb3': 'תנאי התשלום עודכנו: ',
  't_f428be46': 'תנאי התשלום עודכנו: \${t.name}',
  't_0ca20602': 'תנאי תשלום',
  't_b4be06a4': 'תקין',
  't_0b8d0699': 'תקציב וחלוקה',
  't_40541881': 'תקציב מקורי',
  't_e3cb20a8': 'תקציב צמוד-מדד',
  't_2af4f61e': 'תשואה על ההשקעה',
  't_ae910500': 'תשואה על כל שקל שהושקע בפרויקט',
  't_e940aeeb': 'תשואה צפויה על ההשקעה בפרויקט.',
  't_0f8df135': 'תשלום מיידי',
  't_73cea1a7': '⚙️ בפרודקשן: נתוני ה-ROI מהשרת — כאן נתוני דמו',
  't_1efd05cc': '⚙️ בפרודקשן: נתוני המדד מהשרת — כאן נתוני דמו',
  't_e918e31f': '⚙️ בפרודקשן: נתוני פיצול החשבונית מהשרת — כאן נתוני דמו',
  't_5d1ebd4d': '⚙️ בפרודקשן: נתוני קבלני המשנה מהשרת — כאן נתוני דמו',
  't_1114411c': '⚙️ נתוני ה-ROI מתעדכנים מהשרת',
  't_6b681445': '⚙️ נתוני המדד מתעדכנים מהשרת',
  't_71a79ecd': '⚙️ נתוני פיצול החשבונית מתעדכנים מהשרת',
  't_e039c6ef': '⚙️ נתוני קבלני המשנה מתעדכנים מהשרת',
  't_5c1bf529': '⚙️ שערי המט״ח מתעדכנים מהשרת — כאן מוצגים שערי דמו',
  't_62d69f1c': '⛔ אין הרשאה לאישור בקשת רכש',
  't_e695b312': '⬇️ הפק והורד דוח PDF',
  't_7db97627': '
        ? const <String>[]
        : angleTokensIn(pool).map((t) => t.label).toList();
    // Secondary letter-size row (S/M/L): some collars/anchors carry a letter
    // size instead of a number. Surfaced like the angle axis, co-filterable.
    final letterChips = _letterOptions(pool);
    // Secondary wall-thickness row (PPR/multilayer): the SAME OD ships at
    // different walls (PN ratings), so `20×2.8` vs `40×5.5` — wall narrows
    // beyond the גודל (OD) axis. Co-filterable.
    final wallChips = _wallOptions(pool);
    var results = pool;
    if (_size != null) {
      results = results.where((p) => productHasChip(p, _size!)).toList();
    }
    if (_angle != null) {
      results = results.where((p) => productHasChip(p, _angle!)).toList();
    }
    if (_letter != null) {
      results = results
          .where((p) => letterSizeTokens(p.nameHe).contains(_letter))
          .toList();
    }
    if (_wall != null) {
      results =
          results.where((p) => wallTokens(p.nameHe).contains(_wall)).toList();
    }
    // Count of cards the user will actually see (variants collapse to one).
    final shown = results.map(productListDedupeKey).toSet().length;

    return Column(
      children: [
        _header(),
        if (subs.length > 1) _subBar(subs),
        if (narrow.chips.isNotEmpty) _sizeBar(narrow.label, narrow.chips),
        if (angleChips.length > 1) _angleBar(angleChips),
        if (letterChips.length > 1) _letterBar(letterChips),
        if (wallChips.length > 1) _wallBar(wallChips),
        if (results.isNotEmpty) _countStrip(shown),
        if (results.isNotEmpty &&
            !ref.watch(finderChipTipDismissedProvider))
          _chipTip(),
        Expanded(
          child: results.isEmpty
              ? const Center(
                  child: CfgText(',
  't_0af30456': ' chip colours have no legend of their
/// own). Session-scoped; the X hides it for the rest of the session.
final finderChipTipDismissedProvider = StateProvider<bool>((_) => false);

/// A plain-language product group: a layman label + a one-line plain-Hebrew
/// description + the plumber `categoryHe` values it maps to. Empty [cats] marks
/// the catch-all ("אחר").
class FinderGroup {
  const FinderGroup(this.emoji, this.label, this.cats, {this.desc = ',
  't_dde84eaa': '\$c מ"מ',
  't_d708ee16': '),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      color: _ink, fontSize: 16, fontWeight: FontWeight.w700,),),
            ),
          ],),
        ),
      ),
    );
  }

  // ── step 1b: sub-type chips ──────────────────────────────────────────────
  // Curated sub-types when the group defines them; otherwise the real
  // categories, merged by cleaned label so two categories never show as
  // duplicate chips (e.g. "אביזרי ברזים" + "ברזים" → one "ברזים").
  List<FinderSub> _subsFor(List<LipskeyCatalogProduct> base) {
    final present = <String>{for (final p in base) p.categoryHe};
    final curated = kFinderSubs[_group!.label];
    if (curated != null) {
      return [
        for (final s in curated)
          if (s.cats.any(present.contains)) s,
      ];
    }
    final cats = <String, Set<String>>{};
    final counts = <String, int>{};
    for (final p in base) {
      final l = _cleanSub(p.categoryHe);
      (cats[l] ??= <String>{}).add(p.categoryHe);
      counts[l] = (counts[l] ?? 0) + 1;
    }
    final labels = cats.keys.toList()
      ..sort((a, b) => counts[b]!.compareTo(counts[a]!));
    return [for (final l in labels) FinderSub(l, cats[l]!)];
  }

  String _cleanSub(String cat) {
    for (final pre in const [',
  't_8fa8bdef': '),
      itemCount: groups.length,
      separatorBuilder: (_, __) => const Divider(
        height: 1,
        indent: 82,
        color: _surface,
      ),
      itemBuilder: (_, i) {
        final g = groups[i].\$1;
        final count = groups[i].\$2;
        return InkWell(
          onTap: () => setState(() {
            _group = g;
            _sub = null;
            _size = null;
            _angle = null;
            _letter = null;
            _wall = null;
          }),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(children: [
              Container(
                width: 54,
                height: 54,
                decoration: const BoxDecoration(
                    color: _surface, shape: BoxShape.circle,),
                alignment: Alignment.center,
                child: finderGroupGlyph(g.label, size: 46),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(g.label,
                        style: const TextStyle(
                            color: _ink,
                            fontSize: 17,
                            fontWeight: FontWeight.w600,),),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Expanded(
                          child: Text(g.desc,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  color: _mute, fontSize: 13,),),
                        ),
                        const SizedBox(width: 8),
                        // Count pill — same idiom as the קטלוג category badge.
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2,),
                          decoration: BoxDecoration(
                            color: BsTokens.brand,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(',
  't_29dd3f4c': 's
// design language (WhatsApp-style rows + chips). The user answers the two
// questions a layman can answer: מה זה (a plain-language type — not the plumber
// taxonomy) and איזה גודל (a size read off their list). Results render through
// the shared LipskeyProductsList so cards behave like the rest of the catalog.
import ',
  't_7d7e2367': 's product image when
/// present, else the Material icon. [size] is the icon/image box edge.
Widget finderGroupGlyph(String label, {required double size}) {
  final asset = finderGroupImageAsset(label);
  if (asset != null) {
    return Image.asset(asset,
        width: size, height: size, fit: BoxFit.contain,
        // If the file is missing/corrupt, degrade to the icon — never a
        // broken-image box.
        errorBuilder: (_, __, ___) =>
            Icon(finderGroupIcon(label), size: size * 0.7, color: BsTokens.brand),);
  }
  return Icon(finderGroupIcon(label), size: size * 0.7, color: BsTokens.brand);
}

/// A curated sub-type within a finder group: a plain label + the real
/// `categoryHe` values it covers. Lets us merge catalog misfiles (e.g. the lone
/// "ברזים" garden tap belongs under "גן") and drop jargon-y 1-item categories,
/// instead of dumping raw plumber categories on a non-technical user.
class FinderSub {
  const FinderSub(this.label, this.cats);
  final String label;
  final Set<String> cats;
}

/// Curated sub-types per group label. Groups without an entry fall back to the
/// auto path (real categories, merged by cleaned label). Labels are verbatim
/// tokens of real catalog categories — no invented Hebrew (R6/R8).
const Map<String, List<FinderSub>> kFinderSubs = {
  ',
  't_1e552a7a': 's whole pool — subs, narrow
    // chips, results — derives from the filtered base.
    final systemFilter = ref.watch(catalogSystemFilterProvider);
    final base = _baseFor(_group!, systemFilter);
    final subs = _subsFor(base);
    FinderSub? sel;
    for (final s in subs) {
      if (s.label == _sub) {
        sel = s;
        break;
      }
    }
    final pool = sel == null
        ? base
        : base.where((p) => sel!.cats.contains(p.categoryHe)).toList();
    final narrow = narrowAxis(pool, _sub);
    // Secondary angle row appears whenever the primary axis was סוג/גודל/דגם
    // AND the pool has >1 angles — so a user looking at a 90° elbow can flip
    // to 45° from the same screen.
    final angleChips = narrow.label == ',
  't_12d3b2b2': 'אביזרי ',
  't_b7fe2c80': 'אסלות, מושבים, מנגנוני הדחה ואביזרים',
  't_182aa6e1': 'ברזים לכיור, מטבח, אמבטיה, מקלחת וגינה',
  't_339e6eb0': 'דלוחין SmartLock',
  't_def89b83': 'דלי',
  't_886b8af0': 'חבקים ותלייה',
  't_c4df749c': 'חבקים, תליות ועוגנים לצנרת',
  't_d0a904c9': 'כל שאר המוצרים בקטלוג',
  't_62d9445c': 'מושבים',
  't_effde375': 'מחברי ',
  't_8c90b246': 'מחברים וחיבורים',
  't_f70c7dc4': 'מחברים, ברכיים, מצמדים ואביזרי תבריג',
  't_9b9e62e0': 'מחסומי רצפה, סיפונים, תעלות ניקוז ומכסים',
  't_e6256d26': 'מערכת דלוחין SmartLock מפוליפרופילן 32-63 מ"מ — חוליות',
  't_7561dc8f': 'מערכת צנרת PPR לאספקת מים ומיזוג — פולירול',
  't_6dddac8c': 'ניל',
  't_ed030b8d': 'נמצאו \$n מוצרים',
  't_670c977f': 'סטי הידוק',
  't_586a0525': 'עובי',
  't_7a2f9a62': 'פיות',
  't_56a032b8': 'ציוד גינה והשקיה',
  't_a2b79068': 'צינורות מים, ביוב, גמישים ורב-שכבתיים',
  't_2510c1f1': 'צנרת PPR',
  't_d9031efb': 'צ׳יפ כתום על מוצר — הקש כדי להחליף גודל או צבע',
  't_6e7efabd': 'קיר',
  't_46ea75f8': 'ראשי מקלחת, מזלפים, מערכות אמבטיה וידיות אחיזה',
  't_1c0b76d5': 'שקע-תקע',
  't_f531f5f1': ' labels are unique, so the map
    // is total + unambiguous). The per-tab label lists below are copied
    // BYTE-FOR-BYTE from the registry labels (owner-verbatim Hebrew strings).
    final byLabel = _kbDestinationByLabel;
    const labelsByTab = <int, List<String>>{
      // tab 1 (מחלקות) — the 4 live departments, owner order.
      1: <String>[
        ',
  't_ad48cdfc': '),
        );
      }
    } else if (tab == 0) {
      // PARALLEL קטלוג mirror — the FOURTH mirrored tab, the same two-tier gate as
      // the tab-1/2/3 blocks above, just for the catalog tab. It is the TAIL of the
      // `else if` chain (the four mirrored tabs are mutually exclusive at the tab==
      // level, so this branch completely replaces the others when tab==0; they all
      // stay untouched). The EXPENSIVE watch [catalogLocationProvider] stays INSIDE
      // `if (live)`, so a plain prod build (both flags off) never subscribes to it
      // and the off-tab cost is one int compare. The deriver emits the SAME
      // [KbUpdatesContext], so `ctx.row`/`ctx.toolBase` flow through the SAME
      // [_rowFor] adapter + [_syncContextToolBase] below as tabs 1/2/3.
      //
      // FLAG-OFF BYTE-IDENTITY (tab 0',
  't_1d3ce86c': '),
        );
      }
    } else if (tab == 3) {
      // PARALLEL חנות mirror — byte-for-byte the same two-tier gate + atomic
      // snapshot as the tab-2 (עדכונים) block above, just for the store tab. It
      // is an `else if` because the two mirrored tabs are mutually exclusive
      // (mainTabProvider is a single int), so at most one assigns [ctx]; the
      // tab-2 path is completely untouched. The EXPENSIVE watches
      // ([storeLocationProvider] + [smartCartProvider] + [ordersEngineProvider])
      // stay INSIDE `if (live)`, so a plain prod build (both flags off) never
      // subscribes to them and the off-tab cost is one int compare. Both derivers
      // emit the SAME [KbUpdatesContext], so `ctx.row`/`ctx.toolBase` flow through
      // the SAME [_rowFor] adapter + [_syncContextToolBase] below as tab 2.
      //
      // Two-tier gate (identical to the tab-2 block): [kKbLiveMirror] at compile
      // time short-circuits the `||` so when it is ON the [featureFlagsProvider]
      // watch is dead code and tree-shakes; the runtime tier is only ever watched
      // when the compile flag is OFF (the deliberate one-Set-contains cost of the
      // no-rebuild toggle).
      final live = kKbLiveMirror ||
          ref.watch(featureFlagsProvider).contains(kKbLiveMirrorFlag);
      if (live) {
        final StoreLocation st = ref.watch(storeLocationProvider);
        final List<SmartCartLine> cart = ref.watch(smartCartProvider);
        final List<Order> orders = ref.watch(ordersEngineProvider);
        // ORG-GATE: the pure orders.services boolean rides in from the single
        // [orgCfg] watch above — the deriver stays widget-free.
        ctx = deriveStoreContext(
          st,
          cart: cart,
          orders: orders,
          servicesOn: featureOn(orgCfg, ',
  't_b537c457': ')` there. Net flag-OFF diff = ZERO.
      //
      // Two-tier gate (identical to the tab-1/2/3 blocks): [kKbLiveMirror] at
      // compile time short-circuits the `||` so when it is ON the
      // [featureFlagsProvider] watch is dead code and tree-shakes; the runtime tier
      // is only ever watched when the compile flag is OFF (the deliberate
      // one-Set-contains cost of the no-rebuild toggle).
      final live = kKbLiveMirror ||
          ref.watch(featureFlagsProvider).contains(kKbLiveMirrorFlag);
      // kFinderFront ALSO needs the קטלוג location — to decide whether the finder
      // (the salesperson) LEADS on this browse/landing surface. Read it when
      // EITHER flag wants it; with kFinderFront const-false the `|| kFinderFront`
      // folds to `|| false` (⇒ the read stays inside `if (live)`, unchanged) and
      // the lead block below tree-shakes (⇒ leadWithFinder stays false), so the
      // whole finder-front path is byte-identical when the flag is off.
      if (live || kFinderFront) {
        final CatalogLocation loc = ref.watch(catalogLocationProvider);
        // This surface CAN lead with the finder (home / smart-tree grid). It
        // actually leads unless the user left it via the mode-switch bar
        // ([_finderOff], cleared on a tab change → re-arms). When it can lead, the
        // switch bar (מוכר / אותיות / כלים) rides EVERY face so the user can always
        // return to the seller. Elsewhere (a concrete list) the mirror leads.
        if (kFinderFront && catalogLeadsWithFinder(loc)) {
          finderCapable = true;
          if (!_finderOff) leadWithFinder = true;
        }
        if (live) {
          // The product-category set is the module-level [_kCatalogProductCats]
          // (computed ONCE — the catalog is const), not rebuilt on every keystroke.
          // ORG-GATE: the pure search/compat booleans ride in from the single
          // [orgCfg] watch above — the deriver stays widget-free.
          ctx = deriveCatalogContext(
            loc,
            productCats: _kCatalogProductCats,
            searchOn: moduleOn(orgCfg, ',
  't_b74a4657': 's "בקרוב" SnackBar style.
  void _voiceUnavailable() {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(const SnackBar(
        content: CfgText(',
  't_fbb1ecd3': 's 3-way cycle —
  /// עברית → אנגלית → buttons-mode → עברית. "Showing buttons" is derived from the
  /// live stack (single source of truth — no separate counter to desync):
  ///   • showing buttons (a base/stack is open) → back to Hebrew letters
  ///   • Hebrew letters → English letters
  ///   • English letters → buttons-mode (push the tools view)
  /// Wired ONLY under [kKbButtonsV2]; otherwise the host',
  't_e5b05d41': 's OWN filter:
        // on שיחות ([updatesSubTabProvider] == 1) the keyboard IS the chat search
        // ([updatesChatSearchProvider] → [visibleThreadsProvider]); on התראות it
        // drives the notifications filter. Before this, tab-2 typing ALWAYS hit the
        // notif filter, so typing on the chats sub-tab filtered the wrong list.
        if (ref.read(updatesSubTabProvider) == 1) {
          ref.read(updatesChatSearchProvider.notifier).state = _controller.text;
        } else {
          ref.read(notifSearchQueryProvider.notifier).state = _controller.text;
        }
      } else if (tab == 3) {
        // STORE tab — the query drives the store',
  't_4c2d295a': 's `showBack`).
  void _onBack() => setState(() {
        if (_stack.isNotEmpty) _stack.removeLast();
        if (_stack.isEmpty) _baseLayer = KbToolLayer.none;
      });

  /// BACK on a pushed ROUTE (kKbGlobal, owner "המקלדת היא הנווט — צולל קדימה
  /// ואחורה"): with a MANUAL drill open (grid/gear base, or any deeper level)
  /// BACK still pops that drill level FIRST ([_onBack]); once only the AMBIENT
  /// route mirror remains (`_baseLayer == none` && stack depth ≤ 1) BACK dives
  /// back OUT of the screen by popping the route, then re-mirrors the revealed
  /// parent once the pop settles (see the timer below) — the "dive forward AND
  /// back, screens don',
  't_8e0c5ce4': 's action (navigate the screen underneath / push a
//             route) and KEEPS the overlay floating (the panel does NOT close);
//   • BRANCH→ pushes its children onto the stack, MORPHING the tool view in
//             place (e.g. תפריט → its AI-hub/settings tiles) with no navigation.
// A BACK tile pops the stack; popping the last tool-view returns to the letters
// (stack empty). The only explicit dismiss is the close-chevron (unchanged).
//
// The keyboard itself ([bs_keyboard.dart]) stays PURE: it is handed the current
// node-list projected to pure [KbTile]s and bubbles a tapped tile back as an
// opaque int — all the navigation meaning lives in the tree here.
//
// Only the PURE [cardKeyboardPredictions] helper is imported from
// card_keyboard_sheet.dart — never a widget (the modal widget is deleted).
//
// TYPE-TO-NAVIGATE (universal destinations). When the field text is non-empty
// the prediction row MERGES navigable DESTINATIONS ([matchDestinations],
// keyboard_destinations.dart) AHEAD of the product words — destinations are
// exact nav targets, so they lead. The row is still a plain `List<String>` to
// the pure keyboard; this widget keeps a parallel map from each shown chip label
// to either a [KbDestination] (→ run its nav action, KEEP the overlay floating)
// or a product word (→ append to the field, as before).
//
// CONTEXT-FITTING (empty field). When the field is EMPTY the row reflects WHERE
// I AM, not just what I type — computed in [build] (the only place that can
// `ref.watch` the tab). Owner decision (option 1): a DRILL does NOT add chips —
// drilling already morphs the BODY tiles (that IS the "what I pressed" feedback),
// and mirroring those tools as chips would DUPLICATE them on-screen. So the empty
// row reflects the CURRENT TAB whether or not a tool is drilled:
//   • CURRENT TAB chips (ref.watch(mainTabProvider)): tab 1 the 4 departments ·
//     tab 2 שיחות + התראות · tab 3 הסל שלי + ההזמנות שלי + שירותים — each sourced
//     from [kbDestinations] BY LABEL so it carries its REAL run (typing it
//     navigates identically). Tab 0 (בית/catalog) keeps product opening-words.
// Dispatch ([_onPrediction]) reads two DISJOINT parallel maps rebuilt every build:
// [_destByChip] (tab/typed destination chips → [KbDestination]) then [_runByChip]
// (LIVE-MIRROR dynamic chips → tap closure); a chip in neither is a product WORD
// (appended). The empty field at tab 0 still shows product opening-words ONLY (no
// destinations), unchanged.

import ',
  't_774ec788': 's exact empty-field behaviour).
  ///
  /// LIVE-MIRROR ([kKbLiveMirror], guarded): when the flag is on AND we are on a
  /// MIRRORED tab — מחלקות (tab == 1) OR עדכונים (tab == 2) OR חנות (tab == 3) —
  /// AND [ctx] was derived in [build], this returns the PURE deriver',
  't_f95d7f5f': 's faces
  // (עברית → אנגלית → מקלדת-המילים) — and the "מקלדת המילים" (words) face IS the
  // finder. So switching is the GLOBE ([_onKbCycle]) + the finder',
  't_f51a17f0': 's leading edge closes the overlay; the typed
                // query renders INSIDE the strip; and the dual-mode bottom key
                // (reads "אבג" while a tool layer is open) exits back to the
                // letters via [_exitTools].
                onClose: _close,
                typedText: _controller.text,
                onExitTools: _exitTools,
                showToolStrip: true,
                // Owner button-spec v2 (#7): the layer key toggles letters↔
                // numbers only (never "exit tools"). The flag is const-false in
                // a plain build (= the default, hence "redundant") and true with
                // --dart-define=KB_BUTTONS_V2=true, which is the whole point.
                // ignore: avoid_redundant_argument_values
                symbolsAlwaysToggles: kKbButtonsV2,
                // Owner button-spec #6: the floating globe runs the 3-way cycle
                // עברית → אנגלית → מקלדת-המילים (which, under finder-front, IS the
                // FINDER). Enabled under the v2 buttons OR finder-front; null (⇒
                // the host',
  't_2e32f0e6': 's mapping is never carried into the next tap.
  Map<String, KbDestination> _destByChip = const <String, KbDestination>{};

  /// THE SECOND dispatch map (עדכונים LIVE-MIRROR, [kKbLiveMirror]) — from a
  /// truly-dynamic chip label (a conversation name · a notification TYPE label) →
  /// the closure to run on tap with THIS widget',
  't_7067228d': 's own
  ///     [offerQuestion], which scores the MOST-DECISIVE next words by information
  ///     gain (not a dumb substring match) — so each chip is a real step toward a
  ///     product in the fewest taps.
  ///   • CROSS-DOMAIN fills via [crossDomainNextTokens] over the titles of the
  ///     OTHER domains the query currently matches (tasks · customers · chats ·
  ///     screens · …), so a non-product query ("משה") still gets smart narrowers.
  ///
  /// Every chip appears in ≥1 currently-matching item, so appending it can never
  /// dead-end the search. All chips are plain WORDS (no destByChip / runByChip) →
  /// [_onPrediction] case (iii) APPENDS the word, narrowing the query one token at
  /// a time; the panel re-narrows live. ONLY reachable when the flag is ON; OFF ⇒
  /// the whole method + its imports tree-shake and the legacy [_buildRow] path is
  /// byte-identical.
  _PredRow _wordsRow(String text) {
    // Smart PRODUCT narrowers — the information-gain engine (most-decisive first).
    final product =
        cardKeyboardPredictions(text, kDivePool, _lexicon, max: _kRowCap);
    // Cross-domain narrowers — the successor-words of the query in the titles of
    // the ENTITY domains it matches (buildEntitySearchIndex drops the redundant
    // product scan; products already lead above). Every successor is
    // result-guaranteed, and non-product queries ("משה") still get help.
    final titles =
        buildEntitySearchIndex(ref).search(text).map((r) => r.title);
    final cross = crossDomainNextTokens(text, titles, max: _kRowCap);
    // Product engine leads (richer), cross-domain fills; de-duped + capped.
    final chips = mergeNarrowers(product, cross, max: _kRowCap);
    return _PredRow(chips, const <String, KbDestination>{});
  }

  /// THE ROW SELECTOR — the single decision for what the prediction row shows,
  /// called from [build] (the only place that can read [tab]). PURE (no side
  /// effects, no setState): it returns a [_PredRow] of chips + the two dispatch
  /// maps; [build] persists those maps to fields.
  ///
  ///   1. [text] NON-EMPTY → the TYPED row, byte-identical to before:
  ///      [_buildRow] (destinations-first merge + reserved word slot).
  ///   2. [text] EMPTY → the CURRENT [tab]',
  't_c971c48b': 's own faces below.
    final nav =
        kKbGlobal ? bsNavigatorKey.currentState : Navigator.maybeOf(context);
    if (nav?.canPop() ?? false) return false;
    if (_stack.isNotEmpty || _baseLayer != KbToolLayer.none) {
      _onBack();
      return true;
    }
    final finderShowing = _findMode ||
        (kFinderFront &&
            !_finderOff &&
            ref.read(mainTabProvider) == 0 &&
            catalogLeadsWithFinder(ref.read(catalogLocationProvider)));
    if (finderShowing) {
      _finderToLetters();
      return true;
    }
    _close();
    return true;
  }

  @override
  Widget build(BuildContext context) {
    // A floating panel (rounded-top Material + a subtle top shadow), NOT a modal
    // sheet. SafeArea(top:false) keeps the home-indicator inset clear; the host
    // adds its own bottom SafeArea too, which is harmless (nested insets clamp).
    //
    // [_currentNodes] is read LATER (after [_syncContextToolBase]), so the tiles
    // reflect a LIVE-MIRROR context base installed THIS frame rather than lagging
    // it by one frame.

    // WATCH the active tab so the EMPTY-field row recomputes when the user
    // switches tabs (req D) — drill changes already setState. Then compute the
    // whole prediction row HERE (the single source of truth): the text decides
    // typed-vs-context, the tab + drill decide the context chips.
    final tab = ref.watch(mainTabProvider);

    // ORG-GATE (giant-system V2): the org config in force — watched ONCE here
    // (build() only, the org_gates rule) and passed DOWN as a value / as pure
    // moduleOn·featureOn booleans (the typed-scan filter in [_buildRow], the
    // empty-field tab chips in [_rowFor], the deriver params below), so no memo
    // ever holds a config and a live wizard swap rebuilds the whole row.
    // Default all-on ([kDefaultOrgConfig], absent=on) ⇒ every gate reads true ⇒
    // the un-overridden build stays byte-identical.
    final orgCfg = ref.watch(orgConfigProvider);

    // A DELIBERATE tab switch means the user navigated, so the ambient live-mirror
    // should re-appear: clear the typing-suppression (and the find panel) so the
    // mirror follows navigation instead of staying stuck on the LETTERS / finder.
    // Guarded by the `if` so this is a NO-OP (no rebuild churn) when none of those
    // modes is active — keeping the kKbLiveMirror-OFF / kKbButtonsV2-OFF paths
    // byte-identical (same-tab typing is untouched; only a tab CHANGE fires this).
    ref.listen<int>(mainTabProvider, (_, __) {
      if (_typing || _kbEnglish || _findMode || _finderOff) {
        setState(() {
          _typing = false;
          _kbEnglish = false;
          _findMode = false;
          // Re-arm the finder-front lead on navigation (folds to a no-op write
          // when kFinderFront is off — _finderOff is only ever set true there).
          _finderOff = false;
        });
      }
    });

    // LIVE-MIRROR ([kKbLiveMirror], plan seam 2 + Q4) — two-stage guard.
    //
    // OUTER tab gate: the mirror covers exactly THREE tabs (1 = מחלקות,
    // 2 = עדכונים, 3 = חנות); every other tab skips all of this with a single int
    // compare (zero new cost off-tab). The three are an `if`/`else if` chain
    // because `mainTabProvider` is a single int — they are mutually exclusive, so
    // at most one assigns [ctx].
    //
    // INNER `kKbLiveMirror || featureFlagsProvider.contains(kKbLiveMirrorFlag)`:
    // EITHER the compile flag (a `--dart-define` demo build) OR the runtime tier
    // (the orchestrator',
  't_4ab1266b': 's own ref/context and
  ///       KEEP the overlay floating: a tab/section swaps the screen underneath
  ///       while the keyboard keeps floating; a route pushes over everything (the
  ///       keyboard reappears when it pops). Checked FIRST.
  ///   (ii) a LIVE-MIRROR dynamic chip ([_runByChip] — a עדכונים conversation or
  ///       a notification TYPE chip, flag [kKbLiveMirror]) → run its closure on
  ///       THIS widget',
  't_6fb58f8e': 's own tools.
  ///   * else at a TAB ROOT (!canPop()) -> tabNodes().
  ///   * else (pushed but UNWIRED)      -> null => the letters (NO tab fallback).
  /// With kKbGlobal const-false the `!kKbGlobal ||` disjunct folds to true, the
  /// canPop() read tree-shakes, and this returns tabNodes() exactly as before.
  List<KbToolNode>? _frontTools(
    List<KbToolNode>? screenTools,
    List<KbToolNode> Function() tabNodes,
  ) {
    if (screenTools != null) return screenTools;
    final atTabRoot =
        !kKbGlobal || bsNavigatorKey.currentState?.canPop() != true;
    return atTabRoot ? tabNodes() : null;
  }

  /// STEP D — start a voice-to-text session that drops the final transcript into
  /// the search field. Async + crash-safe: the [VoiceService.listen] callbacks
  /// can fire after this element is gone (a long mic session, a late error), so
  /// EVERY callback is `mounted`-guarded before it touches `_controller` or
  /// shows a SnackBar. The spoken text is inserted at the caret via
  /// [insertAtCaret] (exactly like a tapped prediction word), and the
  /// controller listener then recomputes the prediction row. A failure (no mic
  /// permission, no speech recognized, unsupported platform) surfaces a quiet
  /// "בקרוב" — never a silent dead button.
  Future<void> _startVoiceInput() async {
    try {
      final ok = await VoiceService.instance.listen(
        onFinal: (text) {
          if (!mounted) return;
          final t = text.trim();
          if (t.isEmpty) return;
          // Append a trailing space so the next word/prediction is separated,
          // matching the product-word append path (`_onPrediction`).
          insertAtCaret(_controller, ',
  't_d8a181bf': 's product-tap crash fix — showModalBottomSheet needs a
  /// Navigator ancestor). In a plain build [_navContext] is just `context`, so the
  /// manual מאתר finder is unaffected.
  void _openFinderProduct(
    LipskeyCatalogProduct product,
    List<LipskeyCatalogProduct> siblings,
  ) =>
      showLipskeyProductSheet(_navContext, product, siblings);

  /// The distinct label of the JOB-KIT option chip ([kGlobalSearch]). Prepended to
  /// the search row when a job is open; its run-callback reveals the job',
  't_51011fa8': 's toolBase) as the drill-stack base via a PLAIN in-build field
    // write (same discipline as the dispatch maps; never setState in build).
    // Guarded INSIDE the method so that with both flags off `routeBase`/`ctx` are
    // null ⇒ this is a no-op and the stack is untouched; otherwise it installs only
    // when no manual grid/gear drill is open and only when the base actually changed
    // (so it never re-installs every frame and never clobbers a manual drill).
    //
    // FIND-MODE / FINDER-FRONT gate: while the finder panel is shown — manually
    // (the מאתר tool) OR auto-leading on a browse surface (kFinderFront) — the
    // hidden tool stack must not be churned (the panel replaces the keyboard
    // body), so skip the sync entirely. [leadWithFinder] folds to false when
    // kFinderFront is off, so this stays byte-identical there.
    if (!_findMode && !leadWithFinder) {
      _syncContextToolBase(tabBase, routeBase: routeBase);
    }

    // Read the current node-list AFTER the context-base sync so the tiles (and
    // [showBack]) reflect a base installed this frame (no one-frame lag). Null →
    // the keyboard shows its letters; otherwise the synced node-list as tiles.
    final nodes = _currentNodes;
    // OWNER (dedup): on a live-mirror tab, drilling ▦ renders the SAME items as
    // tiles that the prediction chips already show (e.g. מחלקות → the department
    // list appears both as chips AND as drilled tiles). Drop any chip whose label
    // is already a visible tile so each item shows ONCE. Chips that are NOT tiles
    // (a shallower/other drill, product words, the store pills) stay untouched, and
    // with no tiles (nodes == null → the letters/finder face, and every flag-off
    // surface) nothing is dropped — so those paths are byte-identical.
    final tileList = nodes == null ? null : kbTilesFor(nodes);
    final tileLabels = tileList == null
        ? const <String>{}
        : <String>{for (final t in tileList) t.label};
    final dedupedChips = tileLabels.isEmpty
        ? row.chips
        : <String>[for (final c in row.chips) if (!tileLabels.contains(c)) c];

    return Material(
      color: Colors.transparent,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      child: DecoratedBox(
        // Light-orange seam fill (owner): the keyboard',
  't_8ee5f862': 't init — on an unsupported host or
      // a test harness with no plugin registered). Never let that crash the
      // overlay: swallow it into the same quiet "בקרוב".
      if (mounted) _voiceUnavailable();
    }
  }

  /// Quiet, non-crashing feedback when voice can',
  't_46b67336': 'החלקים לעבודה',
  't_abed6512': 'מוכר',
  't_88f39f29': 'קולי — בקרוב',
  't_13a6219f': '🧰 החלקים לעבודה',
  't_69004b52': ';

/// 🏠 תוכן-בית — the REORDERABLE home-content surface (settings → "סידור מסך
/// הבית"). It previews the SAME wired smart-home sections the home actually
/// renders (via [smartHomeSectionFor]) and lets the contractor reorder them
/// (drag, or up/down), persisted via [homeContentOrderProvider]. Opened as a
/// screen via [route] from settings.
class HomeContentReorder extends ConsumerWidget {
  const HomeContentReorder({super.key, this.showAppBar = false});

  /// When opened as a standalone screen we want a Scaffold + AppBar; when
  /// embedded inside the existing home tab we render just the body.
  final bool showAppBar;

  static Route<void> route() => MaterialPageRoute<void>(
        builder: (_) => const HomeContentReorder(showAppBar: true),
      );

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const body = _Body();
    if (!showAppBar) return body;
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          automaticallyImplyLeading: false,
          titleSpacing: BsTokens.space4,
          title: CfgText(
            ',
  't_40226151': 'איפוס',
  't_c3f011fe': 'גרור לסידור מחדש',
  't_555e7b3e': 'הזז למטה',
  't_8ee2e262': 'הזז למעלה',
  't_2173c522': 'הסדר וההסתרות אופסו לברירת מחדל',
  't_5bf14432': 'הסתר סקציה',
  't_413fc6f7': 'הצג סקציה',
  't_60374654': 'מסך הבית שלי',
  't_f600808f': 'סיום',
  't_b78d3efd': 'שנה סדר',
  't_af094fe6': '🏠 תוכן הבית',
  't_fc38a29d': '))
            const Positioned.fill(child: _GlobalSearchOverlay()),
          // "מצב היכרות": freezes the content + a banner. Explainable elements
          // (📷 in the app-bar, the cart FAB) sit above this and stay tappable.
          if (helpMode) const Positioned.fill(child: _HelpModeOverlay()),
          // 🃏 The FLOATING card-keyboard (the NAVIGATOR layer). A separate
          // Positioned SIBLING of the IndexedStack — it overlays the BOTTOM like
          // a real keyboard, so the screen underneath stays FULL (the IndexedStack
          // is never wrapped/resized/scaled/dimmed). Gated by kKeyboardToolStrip,
          // so with the flag OFF this collapses away (shell byte-identical).
          // kKbGlobal ON → the keyboard mounts app-globally (main.dart) instead,
          // so HomeShell SKIPS its own mount here (no double); OFF → mounts here.
          if (kKeyboardToolStrip &&
              !kKbGlobal &&
              ref.watch(keyboardOverlayOpenProvider))
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: SafeArea(top: false, child: FloatingCardKeyboard()),
            ),
          // ⌨️ The keyboard FAB — mirrors the cart FAB on the OPPOSITE side. The
          // cart FAB uses floatingActionButtonLocation.endFloat (bottom-end =
          // bottom-LEFT under RTL), so this one sits at the bottom-START
          // (bottom-RIGHT under RTL). Hidden while the overlay is open so it never
          // sits on top of the keyboard. Gated by kKeyboardToolStrip.
          if (kKeyboardToolStrip &&
              !kKbGlobal &&
              !ref.watch(keyboardOverlayOpenProvider))
            PositionedDirectional(
              start: 16,
              bottom: 16,
              child: FloatingActionButton(
                heroTag: ',
  't_0c7347f3': '),
          borderRadius: BorderRadius.circular(999),
          onTap: () => _onTap(context, ref, state),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
                ),
                const SizedBox(width: 5),
                Text(
                  label,
                  style: TextStyle(
                    color: fg,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Contextual tap — the register-FIRST gate lives here (single source):
  ///   • not a registered user → the dedicated registration screen (no loop);
  ///   • registered but not-yet-requested / rejected → the role-request sheet;
  ///   • in-process → the request sheet (see status / cancel);
  ///   • approved → the role picker (switch board).
  void _onTap(BuildContext context, WidgetRef ref, RoleChipState state) {
    final registered = ref.read(authStateProvider).user?.isRealUser ?? false;
    if (!registered) {
      Navigator.of(context).push(
        MaterialPageRoute<void>(builder: (_) => const WelcomeScreen()),
      );
      return;
    }
    // 🌉 מצב-מסונן: ריענון-תפקיד-כפוי בכל הקשה — מושך idToken טרי (עם ה-custom-
    // claim שהמנהל אישר) ⇒ הצ׳יפ מתעדכן ל"מאושר" בלי re-login. לא-מסונן: reloadRole
    // מרענן ממילא את ה-claims (זהה-התנהגות; אין נזק).
    unawaited(ref.read(authStateProvider.notifier).reloadRole());
    switch (state) {
      case RoleChipState.approved:
        showRolePicker(context);
      case RoleChipState.needsRegistration:
      case RoleChipState.inProcess:
      case RoleChipState.rejected:
        showRoleRequestSheet(context);
    }
  }
}

/// Pulsing green status shown in the app-bar logo area (e.g. when the
/// "עץ חכם" section is active).
class _PulsingStatus extends ConsumerStatefulWidget {
  const _PulsingStatus({required this.text});
  final String text;

  @override
  ConsumerState<_PulsingStatus> createState() => _PulsingStatusState();
}

class _PulsingStatusState extends ConsumerState<_PulsingStatus>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 850),
  );

  @override
  void initState() {
    super.initState();
    if (ref.read(catalogSettingsProvider).reducedMotion) {
      _ctrl.value = 1;
    } else {
      _ctrl.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween<double>(
        begin: 0.35,
        end: 1,
      ).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.circle, color: bsSuccess(context), size: 7),
          const SizedBox(width: 4),
          CfgText(
            ',
  't_6d68fe73': ',
              ),
            ),
            // 🔧 שירותים opens the all-"בבנייה" services section — hidden for Apple
            // review (kHideUnderConstruction); the route + section stay (reversible).
            if (!kHideUnderConstruction)
              const PopupMenuItem<String>(
                value: ',
  't_91d95320': ';

/// Cart line indices whose recent-add chat bubble the user dismissed (via its
/// X). Cleared whenever the cart shrinks so later adds surface fresh bubbles.
final cartBubbleDismissedProvider = StateProvider<Set<int>>((_) => {});

/// #31 — "מצב היכרות" copy for the 4 bottom-nav destinations, in tab order
/// (בית · מחלקות · עדכונים · חנות). The tabs live in the Scaffold',
  't_f6042aa0': 's "הסל" filter so only cart items show.
      ref.read(storeSectionProvider.notifier).state = StoreSection.cart;
      ref.read(mainTabProvider.notifier).state = 3;
    }

    // White cart on the orange FAB + a count badge. (Removed the decorative
    // "+", which read as "add to cart" rather than "open cart".)
    final fab = FloatingActionButton(
      heroTag: ',
  't_02765c52': 's default "contractor" request. Catch a
      // latch that is ALREADY true on first build; schedule in a post-frame
      // (never mutate a provider during build) and re-check so only one frame
      // opens the sheet.
      if (ref.read(promptRoleRequestProvider)) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!context.mounted) return;
          if (ref.read(promptRoleRequestProvider)) {
            ref.read(promptRoleRequestProvider.notifier).state = false;
            showRoleRequestSheet(context);
          }
        });
      }
    }

    // Step 92 — automatic `screen_view` on every tab switch. ONE read-only
    // `ref.listen` on `mainTabProvider` (the RECONCILED real tab source, §3):
    // `listen`, never a new `watch`, so this adds ZERO rebuild on top of the tab
    // UI watch above (:69) and the 4 tabs stay byte-identical. The route half
    // (pushed screens) is the app-global `intelRouteObserver` (main.dart).
    listenTabScreenView(ref);

    // Step 86 — one-time, version-gated analytics-consent modal. COMPILE-GATED
    // behind [kIntelLive] (const-false in every normal build) → this branch AND
    // the whole consent_modal surface tree-shake away, so the shipped shell is
    // BYTE-IDENTICAL to today (the step-81 `_StudioHero` hero pattern). When
    // INTEL_LIVE is flipped on it prompts once until the user consents to the
    // current policy version.
    if (kIntelLive) {
      maybeShowConsentModal(context, ref);
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: const _HomeAppBar(),
      body: Stack(
        children: [
          IndexedStack(
            index: tabIndex,
            children: const [
              CatalogScreen(), // 0 · בית — smart-home landing (#32) + catalog
              DepartmentsScreen(), // 1 · מחלקות
              UpdatesScreen(), // 2 · עדכונים — התראות + שיחות merged
              StoreScreen(), // 3 · חנות
            ],
          ),
          // U1.5.2 → superseded: the "ממתין לאישור" top strip was REMOVED at the
          // owner',
  't_268ae4c5': 's live
/// query and, once it reaches 2 chars, paints the opaque unified panel
/// ([GlobalSearchResultsView]) over the whole body — so the results REPLACE the
/// screen content wherever you are, no "עוד…" and no jump. Below the threshold it
/// is an empty, non-absorbing box, leaving the tab fully interactive. The global
/// floating keyboard (main.dart) sits ABOVE this, so typing keeps working. Only
/// mounted on the flag-gated path, so it tree-shakes with the feature when off.
class _GlobalSearchOverlay extends ConsumerWidget {
  const _GlobalSearchOverlay();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final active = ref.watch(keyboardDiveQueryProvider).trim().length >= 2;
    if (!active) return const SizedBox.shrink();
    return Material(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: const GlobalSearchResultsView(),
    );
  }
}

/// The "מצב היכרות" freeze layer: a top banner + a dim scrim over the frozen
/// content. Explainable elements (the 📷 app-bar icon, the cart FAB) sit above
/// this layer and stay tappable; tapping the dim area nudges the user toward
/// them, and the ✕ (or the 💡 again) exits the mode.
class _HelpModeOverlay extends ConsumerWidget {
  const _HelpModeOverlay();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        Material(
          color: BsTokens.brand,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: BsTokens.space4,
              vertical: BsTokens.space3,
            ),
            child: Row(
              children: [
                const Icon(Icons.lightbulb, color: Colors.white, size: 20),
                const SizedBox(width: BsTokens.space2),
                const Expanded(
                  child: CfgText(
                    ',
  't_aed58dc9': 's ⚙ menu (`kbScreenMenuNodes`, behind KB_BUTTONS_V2) opens the real
/// picker instead of a "בקרוב" placeholder. Referenced only from that flag-gated
/// path (`kKbButtonsV2 ? … : kbKbdNodes()` const-folds away when off), so it
/// tree-shakes out on a normal build — byte-identical.
void openNewChatSheet(BuildContext context) => showModalBottomSheet<void>(
  context: context,
  backgroundColor: Theme.of(context).colorScheme.surface,
  shape: const RoundedRectangleBorder(
    borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
  ),
  builder: (_) => const _NewChatSheet(),
);

// ─── notifications 3-dot menu ──────────────────────────────────────────────────────

class _NotificationsMenuButton extends ConsumerWidget {
  const _NotificationsMenuButton();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert, color: Colors.black54),
      tooltip: ',
  't_b11aa1db': 'או סריקת תוכנית כדי להפיק ממנה רשימת מוצרים — בלי להקליד ידנית.',
  't_117a84ee': 'אין עדיין משתמשים',
  't_f7504576': 'בחר סוג איש קשר',
  't_863131ba': 'בטל השתקת הכל',
  't_46508bae': 'במצב היכרות — לחצו על כפתור מודגש (📷 או הסל). ',
  't_dd2254e7': 'בתהליך',
  't_bbbf1ce4': 'דרוש הרשמה',
  't_c4df5004': 'ההתראות והשיחות במקום אחד — הזמנות, חוסרים והודעות מספקים ומהצוות. התג מציג כמה לא נקראו.',
  't_36b0989f': 'החלפת לוח / זהות',
  't_e6946880': 'החנות — הסל שלך, ההזמנות והמעקב אחריהן. כאן משלימים את הרכישה.',
  't_cb4abbd7': 'הסל הצף מציג כמה פריטים נאספו. לחיצה עליו קופצת ',
  't_d9191f71': 'הסר התראה זו',
  't_a27dd10f': 'והגדרות האפליקציה.',
  't_a77edc43': 'והגדרות התראות.',
  't_399bf1be': 'והשתקת כל השיחות.',
  't_b0d3d4b8': 'כדי לחפש מוצר או פריט במהירות.',
  't_dc4748fe': 'כל ההתראות סומנו כנקרא',
  't_03bfed54': 'כלים להתראות — סימון הכל כנקרא, ניקוי הכל, ',
  't_e80f5f03': 'כלים לחנות — הסל שלי, ההזמנות, שירותים, והגדרות החנות.',
  't_3a4c16f6': 'כלים לשיחות — פתיחת שיחה חדשה, ארכיון, ',
  't_cd6ab6b4': 'כלים נוספים של הקטלוג — בינה מלאכותית ואוטומציה, ',
  't_62fbebab': 'כתובת · ח.פ. · איש קשר; ומשם "ערוך פרופיל" ',
  't_4779d6a3': 'לוח קבלן · מנהל · חנות · שליח · עובד. כך עוברים בין ',
  't_c7386e11': 'לחיצה על הלוגו פותחת את בורר התפקידים — מעבר בין ',
  't_91e66f23': 'לחנות עם הסל המסונן — משם ממשיכים להזמנה.',
  't_d4180123': 'לעריכה מלאה.',
  't_8270663e': 'מאושר',
  't_b71469fd': 'מחזיר את שורת החיפוש של הטאב הפעיל (שנעלמה בגלילה) ',
  't_39e3d72f': 'מסך הבית החכם — נחיתה עם תוכן מותאם ("תוכן הבית"), ומשם כניסה לקטלוג המלא.',
  't_30103541': 'מצב היכרות (לחיצה ארוכה: סיור)',
  't_45edcadc': 'מצב היכרות — לחצו על אלמנט מודגש כדי ללמוד מה הוא עושה',
  't_11208b02': 'מצלמה / סורק',
  't_531cfa6d': 'סוגי המשתמשים באפליקציה.',
  't_e7470501': 'סטטוס הרשמה: \$label',
  't_2578cdcd': 'סל הקנייה',
  't_c366717b': 'עץ חכם הופעל',
  't_1cfef312': 'ערוך פרופיל',
  't_28716081': 'פותח את הסורק: צילום ברקוד או מק"ט לזיהוי מוצר, ',
  't_5a1b158c': 'פותח כרטיס פרופיל לקריאה — שם · מקצוע · ',
  't_a7fb69dc': 'צא ממצב היכרות',
  't_1f2dadc8': 'רשת המחלקות — דפדוף לפי קטגוריות מוצרים (אינסטלציה · גמר · כלים…) לניווט מהיר בקטלוג.',
  't_3bc1abed': 'תמיכה',
  't_b30958fa': 'תפריט ההתראות',
  't_4b89e06e': 'תפריט החנות',
  't_264f18f2': 'תפריט הקטלוג',
  't_f069b84a': 'תפריט השיחות',
  't_6a56b23c': '✏️ שיחה חדשה',
  't_cb15c148': '✕ או 💡 ליציאה.',
  't_88c88999': '   צוואר-בקבוק: \${pd.bottleneck!.nameHe}',
  't_5741f342': ' · \${_totalMeters.toStringAsFixed(1)} מ׳ צנרת',
  't_c7dc5909': ' · \${plan.zones.length} אזורים',
  't_3209226c': ' · ⑂ \$branches ענפים',
  't_f8e33a4f': '\$checkCritical קריטי פתוח',
  't_7bba57c4': '\$count פריטים',
  't_400928a7': '\$criticalCount בעיות בטיחות בקו',
  't_c4033543': '\${(_drainDrop * 100).toStringAsFixed(0)} ס״מ',
  't_4444f5e4': '\${_drainRun.toStringAsFixed(1)} מ׳',
  't_7f19fcc8': '\${_verticalRise.toStringAsFixed(0)} מ׳',
  't_4c978518': '\${branches - outlets} לא חוברו (חסר במחלק)',
  't_646dc403': '\${m.toStringAsFixed(1)} מ׳',
  't_189b3e7a': '\${p.anchorSkus.length} פריטים · ',
  't_7db3af65': '\${plan.items.length} סוגים · \${plan.totalPieces} יחידות',
  't_2af644c7': '\${pr.itemCount} יחידות',
  't_c392bfec': '\${pr.lowConfidence ? " (דיוק נמוך)" : ""}',
  't_02c204f2': '))
        .where((w) => w.length >= 2)
        .toList();
    if (words.isEmpty) return null;
    LipskeyCatalogProduct? best;
    var bestScore = 0;
    // chainUniverse = the imported company catalog when one is active, else
    // kCompatCatalog (same object) — so תכנון חיבור serves the company universe.
    for (final p in chainUniverse) {
      if (!productSuitableForTemp(p, temp)) continue;
      final name = p.nameHe.toLowerCase();
      final cat = p.categoryHe.toLowerCase();
      var score = 0;
      for (final w in words) {
        // A name hit is a stronger signal than a category hit; longer words
        // weigh more. Prevents "אסלה" matching the "…חיבורי אסלה" category
        // over an actual toilet whose name contains the word.
        if (name.contains(w)) {
          score += w.length * 2;
        } else if (cat.contains(w)) {
          score += w.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    return bestScore > 0 ? best : null;
  }

  void _buildFromText(String text, int temp) {
    final phrases = text
        .split(RegExp(r',
  't_62551252': ', true));
    setState(() => _showTutorial = false);
  }

  @override
  void dispose() {
    _flow.dispose();
    _describeCtrl.dispose();
    super.dispose();
  }

  // Free-text → products. Splits on comma/newline, matches each phrase to the
  // best catalog product by token overlap, and drops the matches onto the
  // canvas for review (user then taps "⚡ צור רשימת קנייה").
  LipskeyCatalogProduct? _bestProductMatch(String phrase, int temp) {
    final words = phrase
        .toLowerCase()
        .split(RegExp(r',
  't_a9aa5bd9': '3 ברזי ניתוק (כניסה + משאבה + מניפולד)',
  't_2669fa29': '3 צעדים לרשימת קנייה מוכנה',
  't_65c77bee': 'PEX מתרחב בחום',
  't_9e906723': 's authored slices, bundled once per build:
/// systems (+ colors), the per-sku [ProductConnectorSpec] map, the mustHave
/// [AccessoryRule]s, the s41 [TradeResolution] (REUSED — no parallel seam) and
/// the optional [TradePhysicsConfig] (v1: always null — no authoring UI yet,
/// so the flow-physics panels hide for authored trades).
class _ActiveTradeConfig {
  _ActiveTradeConfig._({
    required this.tradeId,
    required this.systems,
    required this.mustHaveAccessories,
    required this.tradeResolution,
    required Map<String, ProductConnectorSpec> specBySku,
    required Map<String, String?> systemIdByTypeId,
    required Map<String, SystemDef> systemById,
    this.physics,
  })  : _specBySku = specBySku,
        _systemIdByTypeId = systemIdByTypeId,
        _systemById = systemById;

  factory _ActiveTradeConfig.fromDoc(String tradeId, TradesDoc doc) {
    final systems = [
      for (final s in doc.systems)
        if (s.tradeId == tradeId) s,
    ];
    final connectorTypes = [
      for (final t in doc.connectorTypes)
        if (t.tradeId == tradeId) t,
    ];
    final specBySku = {
      for (final s in doc.productSpecs)
        if (s.tradeId == tradeId) s.productSku: s,
    };
    return _ActiveTradeConfig._(
      tradeId: tradeId,
      systems: systems,
      mustHaveAccessories: [
        for (final a in doc.accessories)
          if (a.tradeId == tradeId && a.mustHave) a,
      ],
      tradeResolution: TradeResolution(
        tradeId: tradeId,
        resolver: ConnectionResolver(
          rules: [
            for (final r in doc.compatRules)
              if (r.tradeId == tradeId) r,
          ],
          connectorTypes: connectorTypes,
          systems: systems,
          completionRules: [
            for (final r in doc.completionRules)
              if (r.tradeId == tradeId) r,
          ],
        ),
        specOf: (sku) => specBySku[sku],
      ),
      specBySku: specBySku,
      systemIdByTypeId: {
        for (final t in connectorTypes) t.id: t.systemId,
      },
      systemById: {
        for (final s in systems) s.id: s,
      },
      // physics stays null in v1 (no authoring UI for flow-physics yet) —
      // the slope seam hides the ת"י-1205 panel for authored trades.
    );
  }

  final String tradeId;
  final List<SystemDef> systems;
  final List<AccessoryRule> mustHaveAccessories;
  final TradeResolution tradeResolution;
  final TradePhysicsConfig? physics;
  final Map<String, ProductConnectorSpec> _specBySku;
  final Map<String, String?> _systemIdByTypeId;
  final Map<String, SystemDef> _systemById;

  /// The spec envelope',
  't_a99988a1': 't pool. ─────
                if (!isSupply)
                  Builder(builder: (_) {
                    // s49b seam: an authored trade with no flow-physics
                    // (physics?.minSlopePercent == null — always in v1) hides
                    // the ת"י-1205 panel; plumbing = legacy verbatim (R1-2 —
                    // its hand-written 2% constants below are permanent).
                    if (s49bCfg != null &&
                        s49bCfg.physics?.minSlopePercent == null) {
                      return const SizedBox.shrink();
                    }
                    final res = checkDrainageSlope(
                      horizontalRunMeters: _drainRun,
                      verticalDropMeters: _drainDrop,
                    );
                    final slope = res?.slopePercent ?? 0;
                    final slopeOk = res?.ok ?? false;
                    final color = slopeOk
                        ? const Color(0xFF15803D)
                        : const Color(0xFFF59E0B);
                    return Container(
                      margin: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: slopeOk
                            ? const Color(0xFFE8F5E9)
                            : const Color(0xFFFFF8E1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: color.withOpacity(0.5)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [
                            Icon(slopeOk
                                ? Icons.trending_down
                                : Icons.warning_amber,
                                color: color, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                ',
  't_d7bfa673': 'אביזר',
  't_e3f3e05c': 'אביזר לקו',
  't_38afe4a7': 'אביזרי חובה לקו: \${rules.length} פריטים',
  't_27fb20ac': 'או חפש ישירות בשדה החיפוש למעלה',
  't_8ed62e68': 'אורך אופקי:',
  't_e84c6669': 'אחריות: הסל משלים את העבודה — אין נסיעה שנייה',
  't_bf4f1003': 'אטימות כל מעבר',
  't_baa3548c': 'איזון הלולאה',
  't_d165d4f0': 'איזון לולאת המים החמים',
  't_e7934149': 'איזון לחץ בין ענפים',
  't_f64ea781': 'איטום חיבורים',
  't_4cc82a39': 'אסלה / ניקוז',
  't_65e1ef42': 'אספקה',
  't_6e77c284': 'אפשרות \${ai + 1}: \${alts[ai].length} חלקים',
  't_342e8b55': 'בולם את ההתפשטות של המים החמים בתוך הצנרת',
  't_f37dc4e2': 'בולם רעידות המשאבה',
  't_7d723b3e': 'בחר מה אתה מחבר',
  't_40e8eb1f': 'בחר מה אתה מתקין:',
  't_a0fcb1b3': 'בחר מה לחבר · נכין רשימת קנייה',
  't_5489e4fe': 'בטיחות ותקינות',
  't_c93d4e2f': 'בידוד אזורי לתחזוקה',
  't_1dd3ad03': 'בידוד חום על הצנרת',
  't_999b56df': 'ביוב',
  't_5e27c3ae': 'בנה',
  't_0cb85d21': 'ברוכים הבאים לתכנון חיבור',
  't_a2bd49ed': 'ברז / כיור',
  't_fe81b2a9': 'ברז לכיור / מטבח',
  't_e55d3bd0': 'ברז ניתוק',
  't_86a3cb97': 'ברז ניתוק ×3',
  't_e33d5577': 'ברז ניתוק לתחזוקה',
  't_46eb5700': 'ברז, כיור, שירותים, גינה',
  't_6e0a86fe': 'ברז, מקלחת, שירותים, גינה — לחץ על הקטגוריה הנכונה',
  't_6057262f': 'גזע',
  't_0add194e': 'דוד שמש, דוד חשמלי, מחמם מיידי',
  't_77bdec13': 'דיאלקטרי',
  't_e2320573': 'דיגום',
  't_4f459f0d': 'דיוק נמוך',
  't_9bcf9183': 'הבנתי — בוא נתחיל!',
  't_b80e540e': 'הוסף \${plan.items.length} לסל',
  't_4e305b93': 'הוסף 2 נקודות לפחות',
  't_b8df142d': 'הוסף חלק',
  't_1872ccd1': 'הוספנו \$autoAdded פריטי בטיחות חובה — הם כבר ברשימה',
  't_8658b169': 'הורג חיידק הלגיונלה בטמפרטורה גבוהה',
  't_99817483': 'החלף',
  't_0b9a16eb': 'החלף לחומר עמיד-חום: PEX / נחושת / פליז.',
  't_c0ec9927': 'הטמפרטורה קובעת אילו פריטי בטיחות נדרשים',
  't_0978f789': 'המוצר המומלץ אינו זמין במאגר',
  't_5429de2f': 'המערכת תיקנה אוטומטית:',
  't_cd7e60d1': 'הערכת תקציב: ~₪\${pr.totalILS}',
  't_dcb7bda7': 'הפסדי חום + סכנת כוויות',
  't_3c30ef36': 'הפרדה גלוונית בין מתכות',
  't_b3fa0ccb': 'הפרויקט "\${p.name}" יימחק לצמיתות.',
  't_775a587b': 'הפריטים הבאים חסרים וחשובים לבטיחות:',
  't_f89e0e48': 'הצג רשימה בכל זאת',
  't_b98a53ef': 'הצוואר-בקבוק נוסף אוטומטית — לחץ "צור רשימת קנייה" לבנייה מחדש',
  't_82bd2f28': 'התקנה שלמה',
  't_838217fd': 'זוהו: \${matched.map((p) => p.nameHe).join("، ")}',
  't_15a67834': 'חבקים',
  't_0bf8ec0e': 'חבקים וקיבוע צנרת',
  't_a9767942': 'חזור לתכנון',
  't_0671b533': 'חיבורים',
  't_2946309b': 'חיבורים ללא איטום — דולפים',
  't_579479ce': 'חם',
  't_d8989386': 'חם מאוד',
  't_3ecf5993': 'חסרים \${plan.gaps.length} חיבורים',
  't_bfee2e31': 'חפש ב\${_cat!.label}…',
  't_b2455f0f': 'חפש בכל המוצרים…',
  't_8e914980': 'ירידת לחץ צפויה: \${pd.dropBar.toStringAsFixed(2)} בר',
  't_7eb9db37': 'כלי התפשטות',
  't_d23ca3da': 'כלים ואיטומים לקו: \${kit.length} פריטים',
  't_5bcc92ab': 'כניסה + יציאה — המערכת ממלאת חיבורים אוטומטית',
  't_aba3971a': 'לא זוהו מוצרים — נסה מילה אחרת (למשל: "ברז קיסר", "אסלה", "מחסום")',
  't_2cdb6f1e': 'לא נמצא מוצר רחב יותר במאגר',
  't_e0878032': 'לאמבטיה ומקלחת',
  't_8516dbe8': 'לאסלה ושטיפה',
  't_5814407b': 'לבדיקות חובה על איכות המים',
  't_af5602c3': 'לגינה והשקיה',
  't_f9da32f8': 'ללא שסתום — לחץ החום עלול לפוצץ את הצנרת',
  't_cd17c0ab': 'למשל: ברז קיסר למטבח, צינור, אסלה',
  't_2216823f': 'למשל: מטבח, שירותים, גינה…',
  't_0c867044': 'לפני \$h שעות',
  't_20ade6f1': 'לפני \$m דקות',
  't_3a318868': 'לפני \$n ימים',
  't_16367f1a': 'לפני דקה',
  't_69662cc6': 'לקו מים חמים',
  't_2d116e26': 'מאזן / TRV',
  't_7a12cb05': 'מאזן לחץ בין ענפים במערכת מסחרית',
  't_6051b838': 'מאזן לכל ענף',
  't_d5eda4a9': 'מאפשר לסגור חלק אחד מהקו לתחזוקה',
  't_66fff1e4': 'מבודד רעידות המשאבה מהצנרת',
  't_810a845e': 'מגביל T≤45°C ביציאה — anti-scald',
  't_cbd44215': 'מגביל חום ל-45°C למניעת כוויות',
  't_1d207252': 'מגביר לחץ מים',
  't_ce827795': 'מגן חלודה (מתכות שונות)',
  't_6000ac64': 'מגן כוויות בכל ברז',
  't_b3b3927b': 'מה אתה רוצה לחבר?',
  't_1b6d8aaa': 'מה הצעד הבא?',
  't_a33f2ca8': 'מונע זרימה הפוכה בלולאה',
  't_49d978a4': 'מונע חלודה כשמתכות שונות נוגעות זו בזו',
  't_2316a1a4': 'מונע חלקיקים מלפגוע במשאבה',
  't_26d9aade': 'מונע מים מלזרום לאחור',
  't_b6bcada1': 'מונע קירור מהיר ומגן מפני כוויות מגע',
  't_dfd24ea6': 'מונע רעש ורטט בצנרת מהמשאבה',
  't_8ba73e22': 'מוציא בועות אוויר שגורמות לרעש ואי-נוחות',
  't_7a54da3e': 'מוציא מים לניקוז',
  't_5eff7c42': 'מחבר בין שני חלקים',
  't_4a4ab84f': 'מחזור מים חמים',
  't_a502e614': 'מחזיק הצנרת ומאפשר ניקוז תקין',
  't_2dd0a94b': 'מחיקת פרויקט?',
  't_a69f4f8c': 'מחלק (כמה ברזים)',
  't_b22b5bba': 'מחלק — כמה ברזים',
  't_e8ba33a4': 'מיכל פיצוי התפשטות מים',
  't_ea71235b': 'מים חמים מיד, בלי להמתין שיתחממו',
  't_77e24a0f': 'מינ׳ 2% · ת"י 1205',
  't_a568d315': 'ממברנת EPDM מפרידה N₂ ממים — חובה בכל קו חם סגור',
  't_520d37dd': 'מניעת זרימה הפוכה',
  't_a72e5488': 'מניעת חיידק לגיונלה',
  't_74bf5fe9': 'מסלולים חלופיים: \${alts.length} אפשרויות',
  't_cc4b8a83': 'מסנן חלקיקים בצינור',
  't_12736ace': 'מסנן להגנת המשאבה',
  't_c4d13eda': 'מערכת חמה סגורה',
  't_cf66b039': 'מערכת ישנה או מסחרית, 80° ומעלה',
  't_b4381b00': 'מפוח',
  't_4c260cd7': 'מפל אנכי:',
  't_aed1ead5': 'מפצל לכמה ברזים במקביל',
  't_abd126f0': 'מקלחת / אמבטיה',
  't_56f6b42e': 'משאבה',
  't_2f570b1a': 'נדרש לבדיקות מים תקתיות',
  't_c759781b': 'נוסף לסל: \${widget.plan.items.length} פריטים',
  't_96c2f2f4': 'נוצר ע"י \${AppBrand.name}',
  't_ee330fcb': 'נקודת בדיקת מים',
  't_0c0c2365': 'נקודת קצה של הקו',
  't_9d07b40b': 'סה"כ: \${plan.items.length} פריטים · \${plan.totalPieces} יחידות',
  't_f2aecab9': 'סוג הקו — מה טמפרטורת המים?',
  't_dd87b0d6': 'עוגן',
  't_9403f32a': 'עלייה אנכית:',
  't_6ec33d94': 'ענף',
  't_ebf87436': 'פורק לחץ',
  't_7eddb431': 'פותח/סוגר את המים',
  't_52671cf2': 'פיזור בועות אוויר',
  't_9d5f9d1c': 'פיצוי התפשטות לצינור PEX',
  't_26aa2407': 'פליטת אוויר בלולאה',
  't_dbdc2fce': 'פסטור 70°C/3 דקות אחת לשבוע',
  't_7f864a2d': 'צוואר-בקבוק: \${pd.bottleneck!.nameHe} (#\${pd.bottleneck!.sku})',
  't_8c5f69fc': 'צינור PEX גדל בחום — נדרש מפצה למניעת עיוות',
  't_05d4e08a': 'צינור חיבור',
  't_bd441a8b': 'קבועה',
  't_955e0963': 'קבל רשימת קנייה',
  't_afdeba06': 'קו חם (\$temp°C): \${unfit.length} מוצרים אינם עומדים בחום',
  't_bdf5d833': 'קו ראשי',
  't_29f1b5e2': 'קיבוע ושיפוע',
  't_63b97d25': 'קר',
  't_f2a087aa': 'קריטי',
  't_1f95a861': 'רשימת קנייה',
  't_35b49bfe': 'רשימת קנייה — \${AppBrand.name} 🔧',
  't_c39214f2': 'שהמים יזרמו אחיד בכל הלולאה',
  't_300b6eac': 'שומר על המשאבה מנקיונית ומאריך חייה',
  't_e6732a4e': 'שכל ברז יקבל לחץ שווה',
  't_7002b953': 'שלח לאינסטלטור ב-WhatsApp, או הוסף ישירות לסל',
  't_6b435df1': 'שם הפרויקט (למשל: מטבח דירת 12)',
  't_900529e7': 'שמור פרויקט',
  't_611013ce': 'שנה שם לאזור',
  't_927f91da': 'שנה שם לפרויקט',
  't_5f924224': 'שסתום בטיחות לחץ',
  't_c2469d60': '— או כתוב במילים —',
  't_4fa4e2c1': '• \${p.nameHe} — עד \${cfg.maxTempCOf(p.sku)?.toStringAsFixed(0) ?? "?"}°C',
  't_ba3700dd': '• \${p.nameHe} — עד \${productMaxTempC(p)?.toStringAsFixed(0) ?? "?"}°C',
  't_0d52f605': '⚠ אין חיבור',
  't_2eae6fe1': '⚠️ \$branches ענפים על מחלק \$outlets-יציאות — ',
  't_0b31f922': '⚠️ הפרויקט ריק או שמוצריו לא נמצאים בקטלוג',
  't_0cbc3631': '⚠️ חסרים חיבורים — הקו לא שלם',
  't_49439705': '⚠️ מומלץ',
  't_07612140': '⚡ צור רשימת קנייה',
  't_ae9ed64b': '✅ "\${hits.first.nameHe}" נוסף לקו',
  't_5d44734b': '✅ "\${wider.nameHe}" הוחלף — לחץ "צור רשימת קנייה" לבנייה מחדש',
  't_eb99bede': '✓ כבר נוסף',
  't_4a58c1b8': '✓ מחובר',
  't_a301bc61': '❄️ קר',
  't_c2020e5d': '➕ הוסף מוצר ראשון',
  't_35b6d209': '➕ הוסף עוד מוצר',
  't_52eb4a0c': '🌡️ חם מאוד',
  't_c2e8f63e': '💧 ירידת לחץ: \${pd.dropBar.toStringAsFixed(2)} בר',
  't_9ec6dbac': '💵 הערכת תקציב: ~₪\${pr.totalILS}',
  't_8eac57f9': '💾 הפרויקט "\$name" נשמר',
  't_d1721001': '💾 שמור פרויקט',
  't_5e8c269f': '📂 נפתח: \${p.name}',
  't_9d617597': '📂 פרויקטים',
  't_41c9c25f': '📋 הועתק — שתף ב-WhatsApp עם האינסטלטור שלך',
  't_6082fae5': '📋 שלח לאינסטלטור',
  't_e21c7c31': '🔗 מבנה הקו:',
  't_7a08b078': '🔧 כלים ואיטומים (\${kit.length}):',
  't_c40f68e0': '🔴 חסר',
  't_5c39707a': '🔵 הזנה',
  't_68a21d96': '🚨 חוסרים קריטיים לבטיחות:',
  't_ff76bf82': '🟡 ניקוז',
  't_28a73918': '🟣 ברז / קבועה',
  't_2e705e92': '\${_label(s.name)}: \${s.reached} סשנים, ',
  't_169f6904': '\${a.sessions} סשנים',
  't_89b3e668': '\${c.size} לקוחות',
  't_0be33a3d': '\${s.conversionPct.round()} אחוז המרה',
  't_992e72ca': ', במסך \${r.screen}',
  't_a89c318e': ';

/// 📡 מודיעין לקוחות — the manager Live-Customer-Intelligence tab (step 98).
/// A read-only, RTL, a11y surface over the four intel read providers. Const so it
/// slots into the manager dashboard',
  't_461a023a': 'אין נתונים עדיין',
  't_53d04a4d': 'אף לקוח לא מחובר כעת',
  't_00baadf3': 'המיר',
  't_2a7e0eb0': 'המירו',
  't_beb1b3d5': 'המרה',
  't_66f53cb2': 'הנשירה הגדולה: \${_label(drop.fromStage)} ← ',
  't_2cd59c66': 'יום 1 · \${c.retentionPct(1).round()}%',
  't_bbb92e28': 'מחובר: \${r.named ? r.name! : _pseudonym(r.key)}',
  't_6a24736d': 'מחזור \${_day(c.cohortDay)}: \${c.size} לקוחות, ',
  't_823a1794': 'מי מחובר כעת',
  't_ec5158cc': 'משפך ההמרה, פלחי הלקוחות, שימור ומי מחובר כעת — חי מהמכשיר.',
  't_d4af6790': 'משפך המרה',
  't_8fb87cd3': 'פלחי לקוחות',
  't_965440dd': 'שימור יום 1',
  't_e97542fd': 'שימור יום 1 \${c.retentionPct(1).round()} אחוז',
  't_7b4d45cd': 'שימור לקוחות',
  't_ff92b0dd': 'תקיעות',
  't_849f23b3': 'תשלום',
  't_4212c872': '📡 מודיעין לקוחות',
  't_17f7a3ab': ' show IntelEvents;

/// Upper bound on rows the journey timeline folds for one customer — keeps the
/// read O(window) rather than O(all-history) (§4) even on a long-lived buffer.
const int kJourneyWindow = 50;

/// Hebrew label for an intel event [name] — keyed by the `IntelEvents` wire
/// constants (never a raw literal) so the timeline strings never drift from the
/// taxonomy. Honors the step-99 spec labels verbatim (screen_view→"צפייה במסך",
/// search_submit→"חיפוש", add_to_cart→"הוספה לסל", checkout_start→"התחלת תשלום",
/// order_placed→"הזמנה בוצעה"). An unknown name falls back to the raw name (honest,
/// never a crash).
String intelEventHe(String name) => _he[name] ?? name;

const Map<String, String> _he = <String, String>{
  IntelEvents.sessionStart: ',
  't_edfffe27': 'הזמנה בוצעה',
  't_9d73f876': 'התחלת תשלום',
  't_5d222eb9': 'זיהוי',
  't_eb09fe85': 'חיפוש ללא תוצאות',
  't_8f2b1c1d': 'סיום סשן',
  't_a0ff343b': 'צפייה במסך',
  't_9e7484a9': 'שלב בתשלום',
  't_cf8cfee4': ')` from its single orgConfigProvider watch and
  // passes the VALUES in, so this leaf stays widget-free and no config object
  // ever reaches (or bakes into) the deriver. Both default true ⇒ every
  // existing caller + unit test is byte-identical (absent=on). False drops the
  // מאתר / תכנון חיבור section chips from the entry rows.
  bool searchOn = true,
  bool compatOn = true,
}) {
  switch (loc) {
    // ── ',
  't_b1075626': ';
          ref.read(smartTreeCatProvider.notifier).state = null;
        };
      }
      return KbUpdatesContext(
        row: KbPredRow(
          chips,
          const <String, KbDestination>{},
          runByChip: runByChip,
        ),
        toolBase: kbHomeNodes(),
      );

    // ── the in-tab kCatalogTree drill — the core arm ───────────────────────────
    //
    // facetSel is intentionally NOT destructured: B1 deleted the only reader (the
    // product-leaf facet emission). The keyboard no longer facets here, so the
    // current screen-side facet selection is irrelevant to the chips this arm
    // emits — the navigating closures RESET facets (B2) rather than read them.
    case CatalogDrill(:final pathIds, :final pathTitles):
      return _drillContext(
        tree: tree,
        pathIds: pathIds,
        pathTitles: pathTitles,
        productCats: productCats,
        searchOn: searchOn,
        compatOn: compatOn,
      );
  }
}

/// The home / list-section context: the entry SECTION chips (real registry
/// [KbDestination]s in destByChip, reusing `_openCatalogSection`), STABLE
/// catalog-level tools. [exclude] drops the section the user is already on so the
/// row never carries a dead re-assert chip (review #20). PARITY-SAFE: a label with
/// no registry destination is skipped (continue-on-miss), never a crash.
/// [searchOn]/[compatOn] are the ORG-GATE booleans threaded from
/// [deriveCatalogContext]: false drops מאתר / תכנון חיבור from the LABEL LIST —
/// filtered BEFORE the lookup for coherence with the store/updates roots (this
/// root is continue-on-miss anyway, so the filter is intent, not crash-safety).
KbUpdatesContext _sectionEntryContext({
  String? exclude,
  bool searchOn = true,
  bool compatOn = true,
}) {
  final chips = <String>[];
  final destByChip = <String, KbDestination>{};
  for (final label in _kCatalogSectionLabels) {
    if (label == exclude) continue; // no dead re-assert of the current section.
    // ORG-GATE: a dark module drops its section chip (the registry is never
    // filtered, so the memoized by-label map never bakes a config).
    if (!searchOn && label == ',
  't_4857fe4a': 's `catalogTreePathProvider`, NOT any
// keyboard tool stack (the dual-stack trap), so every catalog chip dispatches
// through one of the two maps below — there is no tool-tile/drill chip here.
//   • `destByChip` — the entry SECTION chips at the home/landing surface
//     (קטגוריות / עץ חכם / מועדפים / …) are REAL registry [KbDestination]s
//     (reusing keyboard_destinations.dart',
  't_bc043cf0': 's labels
/// are unique, so the map is total + unambiguous).
final Map<String, KbDestination> _catalogSectionByLabel =
    <String, KbDestination>{
  for (final d in kbDestinations()) d.label: d,
};

/// An HONEST deferred tap for a chip with no real per-item opener in scope yet
/// (a product-leaf product open #38, a smartKey leaf opener owner-Q2): surface a
/// brief "בקרוב" hint so the tap does something OBSERVABLE and truthful — NEVER a
/// silent no-op behind an actionable-looking chip, and NEVER a dead re-assert of
/// the current axis (the review #20 blocker). It never navigates, never pushes a
/// route, and never crashes (`maybeOf` is null when there is no
/// ScaffoldMessenger). Byte-identical to keyboard_store_deriver.dart',
  't_ed0a4b67': 'פתיחת מוצר',
  't_9c684348': 'פתיחת קטגוריה',
  't_cfda6f35': '⬆️ חזרה',
  't_eb77b10e': '🛒 פתיחת מוצר',
  't_8adfde89': 's
/// root predictions are unchanged from the existing tab-1 row. Each owns a real
/// [KbDestination] in keyboard_destinations.dart (reusing `_openDepartment`), so
/// tapping a chip navigates to that department exactly as a department tile does.
///
/// STATIC (no cap): these four are a FIXED set (like the 6 חנות service chips or
/// the 6 עדכונים notif-type chips) — they ALWAYS all render. There is no dynamic
/// list to cap here (the per-department PRODUCT content is the CATALOG phase, not
/// this thin departments-entry scope).
///
// CRITICAL: These 4 labels MUST stay synchronized with: (1)
// keyboard_destinations.dart _openDepartment destinations, (2)
// departments_screen.dart departments list (live == true), (3)
// floating_card_keyboard.dart labelsByTab[1] hardcoded. A rename in ANY source
// breaks the other two. No shared const = no automatic sync. (Future: extract
// these four into a single shared const so all sites derive from one source.)
const List<String> _kDeptLabels = <String>[
  ',
  't_22d89de5': 's [KbDestination.run] closures — those take a
// `WidgetRef`/`BuildContext`, but they are supplied LATER, at tap time, by the
// keyboard; the deriver only RESOLVES the destinations, it never invokes them or
// reads providers itself.
//
// TYPE REUSE (plan invariant — do NOT duplicate): [KbPredRow] and
// [KbUpdatesContext] are IMPORTED from keyboard_updates_deriver.dart (the SAME
// carriers the store/updates derivers emit), so the keyboard adapter (`_rowFor`
// field-for-field copy into `_PredRow`) is IDENTICAL for all three tabs — one
// adapter, three derivers. This arm never POPULATES the dynamic `runByChip` map
// (the department chips are static [KbDestination]s, like the עדכונים section
// chips), so it does not even import `KbRunByChip` — the reused [KbPredRow]
// defaults that map to const-empty. This file adds NO new carrier types; it only
// adds the department arm.
//
// THE DISPATCH PATH (same as the עדכונים/חנות ROOTS). The four department chips
// are REAL [KbDestination]s in `destByChip` (dispatch (ii) — the keyboard runs
// the registry',
  't_f7f19438': 's `_openDepartment` runs by label);
///     tools: the department node-list ([kbDeptNodes] — עץ חכם / מאתר / מסלול
///     עבודה). A tap on a department chip sets `homeDepartmentProvider` (+ tab 1 +
///     catalog-drill reset) via the registry run; the keyboard keeps floating and
///     the screen underneath opens that department. The four are static (always
///     render, NO cap — like the 6 חנות service / 6 עדכונים notif chips).
KbUpdatesContext deriveDeptContext(DeptLocation location) {
  switch (location) {
    // ── Root: the four department chips + department tools ─────────────────────
    case DeptRoot():
      final chips = <String>[];
      final destByChip = <String, KbDestination>{};
      // Raw shell: the four const departments are gated OUT of the registry
      // (R6), so the by-construction guarantee below no longer holds there —
      // the loud throw would crash the bare shell. The company',
  't_94bf8945': ' hub (store_screen.dart:40 default).
        run: (ref, context) => _openStoreSection(ref, StoreSection.all),
      ),

      // ── עדכונים sub-tabs (tab 2 + updatesSubTabProvider) ─────────────────────
      KbDestination(
        label: ',
  't_52fc2825': ',
        // AIHubScreen.route() (ai_hub_screen.dart:44) — same route the kbd
        // תפריט → בינה branch and the catalog menu push.
        run: (ref, context) => Navigator.of(context).push(AIHubScreen.route()),
      ),
      KbDestination(
        label: ',
  't_be31910b': ',
        ],
        // index 1 == DepartmentsScreen (home_shell.dart:94). Reuse the tool seam.
        run: (ref, context) =>
            runKeyboardTool(ref, context, KbTool.departments),
      ),

      // ── PER-DEPARTMENT (the 4 LIVE departments) ──────────────────────────────
      // Labels are the EXACT names in DepartmentsScreen.departments where
      // `live == true` (departments_screen.dart:105-110). Each `run` opens that
      // one department via [_openDepartment] (homeDepartmentProvider = name +
      // tab 1), exactly as a department tile does — so TYPING a department name
      // lands directly on it, no extra tap. Non-live departments (חשמל / חומרי
      // בניין / צבע / גבס / אספקה) are intentionally absent: their tiles only
      // toast ',
  't_02e6eef8': ',
        run: (ref, context) => _openStoreSection(ref, StoreSection.services),
      ),

      // ── קטלוג sections (tab 0 + catalogSectionProvider) ──────────────────────
      // Labels are the EXACT section strings catalog_screen.dart switches on
      // (lines 2292-2303); a wrong string would land on the empty-section view.
      KbDestination(
        label: ',
  't_9a3cf231': ',
        run: (ref, context) => _openUpdatesSub(ref, 1),
      ),

      // ── חנות sections (tab 3 + storeSectionProvider) ─────────────────────────
      KbDestination(
        label: ',
  't_c104ef7c': '],
        // CatalogSettingsScreen.route() (catalog_settings_screen.dart:20) — the
        // same route the kbd תפריט → הגדרות branch and the catalog menu push.
        run: (ref, context) =>
            Navigator.of(context).push(CatalogSettingsScreen.route()),
      ),
      KbDestination(
        label: ',
  't_c3163eec': '],
        // Tab 2; leave the sub-tab as-is (התראות/שיחות have their own entries).
        run: (ref, context) => ref.read(mainTabProvider.notifier).state = 2,
      ),
      KbDestination(
        label: ',
  't_fcf0e86a': 's fixed shape and can never cache a
      // phantom entry). Demo / buildsmart: the spread folds the same three
      // entries back in place — byte-identical. Mirrors the gated tool leaves
      // in keyboard_tool_tree.dart (מהירים / store orders+services).
      if (!kProfileRawShell) ...<KbDestination>[
        KbDestination(
          label: ',
  't_f65e2c94': 's own section pills (store_screen.dart) and the cart-FAB jump.
void _openStoreSection(WidgetRef ref, StoreSection section) {
  ref.read(mainTabProvider.notifier).state = 3;
  ref.read(storeSectionProvider.notifier).state = section;
}

/// Brings the updates tab (index 2) forward and selects sub-tab [sub] on it
/// (0 = התראות, 1 = שיחות) — mirrors updates_screen.dart',
  't_c54761a6': 'אהובים',
  't_ed4d0dcf': 'אולפן התקנה',
  't_c8a3a472': 'אט", ',
  't_59fe1564': 'אפליקציית עובד',
  't_5ff57bbe': 'ארגון מסך',
  't_bf63813c': 'אתרים',
  't_dffeb48a': 'בדיקת איכות',
  't_a841ce1d': 'בורר תפקידים',
  't_193ffa00': 'בינה מלאכותית',
  't_13841827': 'ביקורת',
  't_981b653a': 'בנה רשימה',
  't_b6111c8f': 'גדלים',
  't_3f154bfb': 'דף הבית',
  't_2b0b6ed3': 'דפדוף חכם',
  't_9f9c061e': 'דפדוף לפי קטגוריה',
  't_163a56e7': 'הודעות מערכת',
  't_5f5f2869': 'הוצאות',
  't_3f0dee58': 'הזמנות וקנייה',
  't_116e8d95': 'הטבות',
  't_c302069f': 'היסטוריית חיפוש',
  't_5c9c12f8': 'הכנסות',
  't_118b4586': 'הסבר',
  't_de2d6129': 'העדפות',
  't_4cca5fe9': 'השוואה',
  't_8ccdef48': 'השוואת ספקים',
  't_e0e8fb89': 'התקדמות פרויקט',
  't_76c8d51d': 'התראות הגדרות',
  't_0af7f4ca': 'זול יותר',
  't_c3db4198': 'חיזוי',
  't_5f8ec95c': 'חיסכון',
  't_dbecfc28': 'חיפוש מוצר',
  't_87774081': 'חלופות',
  't_65e1349e': 'חשבוניות',
  't_bcfd5828': 'כיורים',
  't_1afd9bea': 'כלי יד',
  't_95df77e1': 'כלים חשמליים',
  't_194def55': 'כלים ידניים',
  't_1ab74652': 'כלים מהירים → 📋 משימות העבודה',
  't_482d6286': 'כלים מהירים → 📐 סרוק תוכנית עבודה',
  't_2fb3a4af': 'כלים מהירים → 📦 המלאי שלי',
  't_b4fa890e': 'כלים סניטריים',
  't_19fbd507': 'כסף',
  't_78592fee': 'לוח חנות',
  't_76c07c6e': 'לוח מנהל',
  't_5326cf2a': 'לוח עובד',
  't_5c17abca': 'לוח קבלן',
  't_8e4a4ba1': 'לוח שליח',
  't_19890a90': 'מאפס עד מסירה',
  't_0d85ac41': 'מהירים → סריקת תוכנית',
  't_882f3333': 'מוצא מוצרים',
  't_4c078ee8': 'מוצר זול',
  't_ad8971b7': 'מחירים',
  't_d03ef2e6': 'מחלקת אינסטלציה',
  't_e8865af8': 'מחסן',
  't_cacbc82a': 'מי אתה',
  't_3c066d8a': 'מידות',
  't_a001381a': 'מכונת ריתוך',
  't_0f48207c': 'מסך הבית',
  't_c37f308a': 'מסך קבלן',
  't_d556a759': 'מעקב הזמנה',
  't_578ae38a': 'מעקב משלוח',
  't_a488aff0': 'מצא מוצר',
  't_7508fae9': 'מקלחות',
  't_440591eb': 'מרכז בינה',
  't_bef92571': 'נא תפריע',
  't_55040771': 'נוטיפיקציות',
  't_29c8b33f': 'נקודות',
  't_2eed06a4': 'סדר הבית',
  't_d603fc27': 'סידור הבית',
  't_9fc67878': 'סידור מסכים',
  't_7ced8180': 'סל',
  't_14369284': 'סניטריים',
  't_32310c1c': 'סרוק',
  't_29c17ce5': 'סרוק תוכנית',
  't_c3967647': 'סריקה',
  't_40c71ca5': 'עגלה',
  't_2a157528': 'עגלת קניות',
  't_4db48a66': 'עזרה',
  't_1a369a95': 'עלויות',
  't_ca56f22a': 'פיננסים',
  't_47867d06': 'פרסים',
  't_bb5e6da7': 'צאט',
  't_d2d57ce5': 'קטגוריות ראשיות',
  't_1e7dcfd3': 'ריתוך PPR',
  't_ad3647d4': 'שיחות שמורות',
  't_072ed095': 'שלבי פרויקט',
  't_e8a6d6c6': 'שמורים',
  't_6a0ade1a': 'שעות שקט',
  't_be5d3510': 'תאימות',
  't_8120acda': 'תגמולים',
  't_84ef454a': 'תוכנית עבודה',
  't_a169ddc8': 'תכנון התקנה',
  't_ffc8ecdb': 'תנאים',
  't_703b58fd': 'תפקידים',
  't_45060720': 'תקנון',
  't_6f62056d': 'תקציבים',
  't_f3e008d6': 'תשלומים',
  't_fd9073df': '🎮 מועדון BuildSmart',
  't_a5994b91': '));
        chips.add(label);
        destByChip[label] = d;
      }
      return KbUpdatesContext(
        row: KbPredRow(chips, destByChip),
        toolBase: kbStoreNodes(section),
      );

    // ── 🛒 הסל: the real cart-line chips + cart tools ──────────────────────────
    case CartLocation():
      final chips = <String>[];
      final runByChip = <String, KbRunByChip>{};
      for (final line in cart) {
        if (chips.length >= _kStoreRowCap) break;
        // A readable, owner-style label: emoji + product name (+ ×qty when >1),
        // matching the cart row',
  't_a115ea20': ');
      }
      return KbUpdatesContext(
        row: KbPredRow(
          chips,
          const <String, KbDestination>{},
          runByChip: runByChip,
        ),
        toolBase: kbStoreNodes(StoreSection.cart),
      );

    // ── 📦 הזמנות: the recent-order chips + order tools ─────────────────────────
    case OrdersLocation():
      final chips = <String>[];
      final runByChip = <String, KbRunByChip>{};
      for (final o in orders) {
        if (chips.length >= _kStoreRowCap) break;
        // "BS-1042 · בדרך 🚛" — the id plus the live Hebrew stage label.
        final label = ',
  't_764eea03': ');
      }
      return KbUpdatesContext(
        row: KbPredRow(
          chips,
          const <String, KbDestination>{},
          runByChip: runByChip,
        ),
        toolBase: kbStoreNodes(StoreSection.orders),
      );

    // ── 🔧 שירותים: the 6 always-safe service chips + service tools ─────────────
    case ServicesLocation():
      final chips = <String>[];
      final runByChip = <String, KbRunByChip>{};
      for (final label in _kServiceLabels) {
        // _kServiceLabels is a FIXED set of 6 static services (like the 6 notif
        // type chips) — they ALWAYS all render, NO cap (_kStoreRowCap is only for
        // the DYNAMIC cart / orders lists). The de-dup below is structurally dead
        // here (unique labels); kept to mirror the cart/orders arm shape.
        if (runByChip.containsKey(label)) continue;
        chips.add(label);
        runByChip[label] = _comingSoon(',
  't_8a825d27': ')` from its single orgConfigProvider watch and passes the VALUE
  // in, so this leaf stays widget-free and no config object ever reaches (or
  // bakes into) the deriver. Default true ⇒ every existing caller + unit test
  // is byte-identical (absent=on). False drops the שירותים chip from the
  // [StoreRoot] row.
  bool servicesOn = true,
}) {
  switch (location) {
    // ── Root / ',
  't_f6279b93': ';
        // De-dup by VISIBLE label: the first chip with a given label wins and the
        // rest collapse — the row stays unambiguous.
        if (runByChip.containsKey(label)) continue;
        chips.add(label);
        // No public per-line opener (the cart rows live in private widgets); an
        // HONEST "בקרוב" hint until a per-line seam exists — never a dead no-op.
        runByChip[label] = _comingSoon(',
  't_b92f80ad': ';
        if (runByChip.containsKey(label)) continue;
        chips.add(label);
        // No public per-order opener exposed yet; an HONEST "בקרוב" hint until an
        // order-detail seam exists — never a dead no-op.
        runByChip[label] = _comingSoon(',
  't_db4e89c4': 's PRIVATE `_stageLabelFor` (a leaf file cannot import a
/// file-private fn). Single place here so the chip stage text never drifts from
/// the in-list `_Order.stageLabel`. Used to build a readable order chip label
/// ("BS-1042 · בדרך 🚛").
//
// COPIED FROM store_screen.dart _stageLabelFor — NOT shared (a leaf file cannot
// import a file-private fn). Do not edit the cases below without updating
// store_screen.dart',
  't_2ce43209': 's `_kServices`
/// VERBATIM (same labels, same order) so the floating row matches the in-list
/// service rows exactly. The services surface is static (backend-blocked), so —
/// like the עדכונים notif-type chips — these are emitted from a const list. Each
/// has no public per-service opener yet, so tapping surfaces an HONEST "בקרוב"
/// hint (see [_comingSoon]) — never a silent no-op behind an actionable chip.
const List<String> _kServiceLabels = <String>[
  ',
  't_6b2a47f4': 's `_kbDestinationByLabel`. The entry chips (הסל שלי /
/// ההזמנות שלי / שירותים) are real registry destinations; `kbDestinations`
/// re-allocates the whole ~50-entry list per call, so we resolve it once into a
/// `late final` map (the registry',
  't_de4b8058': 's documented purity. The floating keyboard
// snapshots the data once in `build` (`final cart = ref.watch(smartCartProvider)`
// etc.) and passes it in, so the deriver is deterministic (same location + same
// data in => identical context out) and fully unit-testable with hand-built
// locations. The dispatch closures it returns DO take a `WidgetRef`/`BuildContext`
// — but those are supplied LATER, at tap time, by the keyboard; the deriver only
// CONSTRUCTS the closures, it never invokes them or reads providers itself.
//
// TYPE REUSE (plan invariant — do NOT duplicate): [KbPredRow], [KbUpdatesContext]
// and [KbRunByChip] are IMPORTED from keyboard_updates_deriver.dart so the
// keyboard adapter (`_rowFor` field-for-field copy into `_PredRow`, `_runByChip`
// persistence) is IDENTICAL for both tabs — one adapter, two derivers. This file
// adds NO new carrier types; it only adds the store-flavored arms.
//
// THE SECOND DISPATCH PATH (same as עדכונים). Dynamic cart/order/service chips
// are not static registry destinations, so they belong to NEITHER the keyboard',
  't_eb9862f3': 's node-list ([kbStoreNodes]). A tap on a section chip
///     sets `storeSectionProvider`, which re-fires the location — the mirror
///     closes its own loop with no new dispatch code.
///   • [CartLocation]   -> predictions: one chip per CART LINE (runByChip; de-dup
///     by visible label + capped at [_kStoreRowCap]); tools: cart tools (לקופה /
///     רוקן / כספים via [kbStoreNodes]). Empty cart => empty chip list => the row
///     shows tools only (no crash). De-dup by visible label: if two cart lines
///     share the same emoji+name+qty triple they collapse to ONE chip (the first
///     wins); a per-line opener — once exposed — can break the de-dup by keying on
///     a line-index or SKU identifier instead of the collapsible label.
///   • [OrdersLocation] -> predictions: one chip per recent ORDER ("id · stage";
///     runByChip), de-duped + capped; tools: order tools. De-dup by visible
///     label: if two orders share the same id+stage pair only the first is shown.
///     This should never occur in live data (order IDs are unique), but it guards
///     against a corrupted order list (e.g. two "BS-1 · unknown" entries when a
///     stage is unrecognized and falls back to the raw string).
///   • [ServicesLocation]-> predictions: the 6 static SERVICE chips (runByChip,
///     safe keep-floating); tools: service tools. The row is NEVER blank (static),
///     so it works regardless of backend state.
KbUpdatesContext deriveStoreContext(
  StoreLocation location, {
  List<SmartCartLine> cart = const <SmartCartLine>[],
  List<Order> orders = const <Order>[],
  // ORG-GATE (giant-system V2): is the org',
  't_c1e0862d': 's tools ──────────────────
    case StoreRoot(:final section):
      final chips = <String>[];
      final destByChip = <String, KbDestination>{};
      for (final label in _kStoreSectionLabels) {
        // ORG-GATE: a dark services feature drops the שירותים chip — filtered
        // HERE, BEFORE the throwing lookup below (the dept-deriver raw-arm
        // precedent: the LABEL LIST is what narrows, the registry is never
        // filtered, and the loud throw stays for real programmer errors only —
        // a gated-off label can never fire it).
        if (!servicesOn && label == ',
  't_d5e59dbf': ');

    case KbTool.menu:
      // STEP B: תפריט is no longer a single destination — it is a BRANCH in the
      // morph keyboard ([keyboard_tool_tree.dart]) whose children are the AI hub
      // + settings (replacing the old `_openAppMenu` sheet). The morph keyboard
      // never routes KbTool.menu here (it drills the branch instead); this case
      // only fires from a legacy non-morph mount, where the menu has no single
      // target, so we surface "בקרוב" rather than a guessed/half nav.
      _comingSoon(context, ',
  't_8fa87ef6': ');

    case KbTool.quickTools:
      // "מהירים" is a BRANCH in the morph tree (3 quick-action children). A
      // legacy FLAT mount has nowhere to drill, so it surfaces "בקרוב" here.
      _comingSoon(context, ',
  't_28f78660': ');

    case KbTool.voice:
      // "קולי" runs voice-to-text into the field — but that needs the field
      // controller, which this fire-and-forget helper does not own. The real
      // mic→insertAtCaret path lives in the FLOATING keyboard (it intercepts the
      // voice-marked node); a legacy mount has no field, so "בקרוב" here.
      _comingSoon(context, ',
  't_870541a1': ';

/// Runs the real app action for a tapped keyboard tool tile.
///
/// [ref] drives the state-provider tools (tab / section / help mode); [context]
/// drives the Navigator pushes and the "בקרוב" SnackBar. The `home` tools that
/// land inside the catalog tab set the bottom-nav tab to 0 (catalog) AND the
/// catalog section, mirroring how the catalog',
  't_938a6f30': 's own navigation does (catalog_screen.dart:2534 sets tab 0).
void _openCatalogSection(WidgetRef ref, String section) {
  ref.read(mainTabProvider.notifier).state = 0;
  ref.read(catalogSectionProvider.notifier).state = section;
}

/// Shows a transient "בקרוב" SnackBar for a not-yet-wired tool [label]. Used in
/// place of any guessed/broken navigation.
void _comingSoon(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(',
  't_b33b139b': 's own pills (store_screen.dart:38-41,676). The morph
      // keyboard wires this in the tree; this case keeps a legacy mount correct.
      ref.read(mainTabProvider.notifier).state = 3;
      ref.read(storeSectionProvider.notifier).state = StoreSection.orders;

    case KbTool.workRoute:
      // "מסלול" still has no single nav target — the only surface
      // (smart_home_screen.dart `_WorkPath`) is a display-only hero with no
      // onTap. Deferred (both here AND in the morph tree) until one exists.
      _comingSoon(context, ',
  't_fdaba44b': 't consume the result here yet — opening
      // the scanner is the step-2 action.
      Navigator.of(context).push(
        MaterialPageRoute<String>(builder: (_) => const BarcodeScanner()),
      );

    // ── STEP D wired-or-deferred (legacy non-morph mount only) ───────────────
    case KbTool.recentOrders:
      // "הזמנות" → the store',
  't_20d566ab': '\$label — בקרוב',
  't_4e3fee78': '\$label — לא זמין',
  't_fd47f272': ';
          },
        ),
    ];

/// The KBD tool nodes (gear toggle): קולי / חיפוש / מצלמה / היכרות leaves (via
/// [runKeyboardTool]) + תפריט as a BRANCH. The branch children are the two app
/// destinations the old `_openAppMenu` sheet offered — the AI hub and settings —
/// each a LEAF that pushes the real route (full screen over everything; the
/// floating keyboard reappears when that route pops). Order matches the legacy
/// kbd layer (with תפריט now opening children instead of a sheet).
List<KbToolNode> kbKbdNodes() => <KbToolNode>[
      // STEP D — "קולי" is voice-to-text INTO the keyboard field. The mic needs
      // the field controller, which the (ref, context) action can',
  't_5b7c1f7f': ';
        },
      ),
    ];

/// AiFinderScreen tools: מאתר + עץ חכם (runKeyboardTool seam, like kbAiHubNodes).
List<KbToolNode> kbAiFinderNodes() => <KbToolNode>[
      KbToolNode.leaf(
        icon: Icons.gps_fixed,
        label: ',
  't_89ed5074': 's
/// compose bar, where it already works — not the list). The conversation PREDICTIONS (the real-data surface) stay wired in the
/// deriver meanwhile.
/// 🎤 קולי REUSES the existing voice leaf verbatim ([KbToolNode.leaf] with
/// `isVoiceInput: true`): the FLOATING keyboard already intercepts a voice-marked
/// node in `_onTile` and runs mic→`insertAtCaret` itself, so the same leaf works
/// here with no new plumbing (its non-morph `action` is the legacy "בקרוב"
/// fallback only, exactly as in [kbKbdNodes]).
List<KbToolNode> kbUpdatesChatsNodes() => <KbToolNode>[
      KbToolNode.leaf(
        icon: Icons.add_comment_outlined,
        label: ',
  't_875b1954': 's [runKeyboardTool] for that [KbTool], reused verbatim.
//   • [kbKbdNodes]  — the KBD tools (gear toggle): קולי/חיפוש/מצלמה/היכרות as
//     leaves (again via [runKeyboardTool]) plus תפריט as a BRANCH whose children
//     are the AI hub + settings pushes — replacing the old `_openAppMenu` sheet.
//
// Import direction stays one-way: this file may import the keyboard enum, the
// existing seam ([runKeyboardTool]), and real screens — but [bs_keyboard.dart]
// imports NOTHING from here (it only knows pure [KbTile]s), so the keyboard
// widget stays screen-agnostic.

import ',
  't_cbe1f56e': 's identity-compare
// (didUpdateWidget) never churns the registration.

/// המלאי שלי ([StockScreen]) tools: 📥 בקשות חומר (its AppBar action) + ⚙ הגדרות
/// חנות (the store-settings route). Keep-floating: the first opens a sheet, the
/// second pushes a route (the keyboard reappears on pop).
List<KbToolNode> kbStockNodes() => <KbToolNode>[
      KbToolNode.leaf(
        icon: Icons.inbox_outlined,
        label: ',
  't_7fa847b9': 's own `ref`/`context`.
  final void Function(WidgetRef ref, BuildContext context)? action;

  /// BRANCH children — the node-list the keyboard morphs to on tap. Empty for a
  /// leaf.
  final List<KbToolNode> children;

  /// STEP D — VOICE-INPUT marker. `true` ONLY on the קולי leaf: voice-to-text
  /// needs the field controller (`_controller`), which the `(ref, context)`
  /// [action] signature cannot reach, so the FLOATING keyboard intercepts a tap
  /// on a voice-marked node (in `_onTile`) and runs the mic→`insertAtCaret`
  /// path itself instead of the (no-op) [action]. Every other node is `false`.
  final bool isVoiceInput;

  /// True when this node drills into [children] (morph) rather than running an
  /// action (navigate/keep-floating).
  bool get isBranch => children.isNotEmpty;
}

/// Projects a node-list to the PURE [KbTile]s the keyboard renders. The tile
/// `id` is just the node',
  't_85aab572': 's own pill/tile uses (via [kbDestinationByLabel]). Labels not
/// in the registry are skipped (defensive). tab 0 (בית) = the catalog section
/// pills · tab 1 (מחלקות) = the live departments + עץ-חכם/מאתר · tab 2 (עדכונים) =
/// the two sub-tabs · tab 3 (חנות) = the store sections + כספים. [ref] is accepted
/// for parity with the other node-list factories (future per-tab live reads).
List<KbToolNode> kbTabToolNodes(int tab, WidgetRef ref) {
  // ORG-GATE (giant-system V2): the org config in force, read ONCE per list
  // build (read-not-watch — the ▦ grid rebuilds each time it re-opens, the
  // same one-shot idiom as the featureFlags / hidden-sections reads below).
  // Only PURE booleans leave this line — the node-list never holds the config.
  // Default all-on (absent=on) ⇒ both read true ⇒ byte-identical.
  final cfg = ref.read(orgConfigProvider);
  final diveOn = moduleOn(cfg, ',
  't_85ee491d': 's own section pills (store_screen.dart:38-41,676 +
      // keyboard_destinations.dart:111-114): tab 3 (חנות) + storeSectionProvider
      // = orders. Keep-floating (a section swap under the overlay).
      KbToolNode.leaf(
        icon: Icons.receipt_long,
        label: ',
  't_a5f6702d': 's per-tab AppBar overflow
/// popups (`_CatalogMenuButton` / `_NotificationsMenuButton` / `_ChatsMenuButton`
/// / `_StoreMenuButton`). Navigation + mark-read items reuse the SAME public
/// openers/actions those menus run; the confirm-gated destructive items
/// (נקה הכל / השתק הכל) and the private new-chat sheet ship as honest "בקרוב"
/// until exposed (the established deferral — never a confirmless/broken action).
/// tab 2 (עדכונים) reads [updatesSubTabProvider] to mirror the התראות-vs-שיחות
/// split; tabs 0 + 1 share the catalog overflow.
List<KbToolNode> kbScreenMenuNodes(int tab, WidgetRef ref) {
  switch (tab) {
    case 2:
      if (ref.read(updatesSubTabProvider) == 1) {
        // שיחות (chats) overflow — mirrors _ChatsMenuButton.
        return <KbToolNode>[
          KbToolNode.leaf(
            icon: Icons.add_comment_outlined,
            label: ',
  't_7d74c241': 's private
/// `_comingSoon` uses for מסלול/מהירים, reproduced here because that helper is
/// private to its file). Used wherever a tool',
  't_b8481259': 's שירותים
      // chip — the runtime AND on top of the const list (the same pure
      // featureOn the store',
  't_0e636b1e': 's שירותים chip is already gated upstream (`deriveStoreContext`',
  't_5f97f163': 's 🔔 button opens,
///     store_screen.dart:700); 📊 השוואת מחירים reuses [openPriceCompareSheet].
///   • [StoreSection.services]— 🔧: 📊 השוואת מחירים ([openPriceCompareSheet]) +
///     💡 חלופות זולות ([openCheaperAlternativesSheet]) — both real service
///     sheets the store already opens.
///   • [StoreSection.all]   — the hub root: 📦 הזמנות jumps to the orders section
///     (the SAME pairing keyboard_destinations.dart',
  't_a807aeb7': 'בקשת תפקיד',
  't_4b08d65c': 'התראות הזמנות',
  't_968b1500': 'חיפוש שיחות',
  't_160a3bf9': 'לוח משימות',
  't_b7028211': 'לקופה',
  't_107222e2': 'מאתר חכם / מאתר פשוט / מאתר-על',
  't_5c67c7c8': 'מהירים',
  't_4fa94dce': 'מסלול',
  't_6e8bbf87': 'מסלול עבודה',
  't_5cbe42ce': 'צרף',
  't_113f4cce': 'קו-פיילוט',
  't_7061dcd3': 'קולי',
  't_1b40fceb': 'רוקן סל',
  't_5def0dc9': ')` from its single
  // orgConfigProvider watch and passes the VALUE in, so this leaf stays
  // widget-free and no config object ever reaches (or bakes into) the deriver.
  // Default true ⇒ every existing caller + unit test is byte-identical
  // (absent=on). False drops the שיחות chip from the [UpdatesRoot] row and
  // forces the notif tools even at sub-tab 1 (the screen clamps its own
  // IndexedStack to התראות there — updates_screen.dart).
  bool chatOn = true,
}) {
  switch (location) {
    // ── Entry / root: section chips + the active sub-tab',
  't_8878c491': ',
    );
  }

  /// The row labels (ordered + capped by the producing arm).
  final List<String> chips;

  /// Section chips (שיחות/התראות) -> their real registry [KbDestination].
  final Map<String, KbDestination> destByChip;

  /// Dynamic chips (conversation-open / notif-type) -> their tap closure.
  final Map<String, KbRunByChip> runByChip;

  final Set<String>? _destinationChips;

  /// The chips that get the nav glyph. Defaults to every dispatchable chip
  /// (destByChip ∪ runByChip keys) — the whole עדכונים row is navigable.
  Set<String> get destinationChips =>
      _destinationChips ??
      <String>{...destByChip.keys, ...runByChip.keys};

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is KbPredRow &&
          listEquals(other.chips, chips) &&
          setEquals(other.destByChip.keys.toSet(), destByChip.keys.toSet()) &&
          setEquals(other.runByChip.keys.toSet(), runByChip.keys.toSet()) &&
          setEquals(other.destinationChips, destinationChips);

  @override
  int get hashCode => Object.hash(
        Object.hashAll(chips),
        Object.hashAllUnordered(destByChip.keys),
        Object.hashAllUnordered(runByChip.keys),
        Object.hashAllUnordered(destinationChips),
      );
}

/// The atomic output of the live mirror: BOTH halves derived from ONE location
/// snapshot. [row] is the prediction row (the keyboard adapts it into its
/// `_PredRow`); [toolBase] is the THIRD stack-base node-list the keyboard
/// installs (alongside `kbHomeNodes`/`kbKbdNodes`) when no manual grid/gear drill
/// is open — null leaves the existing tool base untouched.
///
/// Value equality so a rebuilt-but-equal context does not churn: equal when the
/// [row] is equal AND the [toolBase] LABELS match (tool nodes hold non-const
/// closures, so we compare the visible label list — what the user sees + taps).
@immutable
class KbUpdatesContext {
  const KbUpdatesContext({required this.row, required this.toolBase});

  /// The prediction-row half of the mirror (adapted into the keyboard',
  't_7aa0dbfe': 's `_destByChip`
// map nor the product-word fallback; the keyboard adds a SECOND map `_runByChip`
// (chip -> `void Function(WidgetRef, BuildContext)`) checked AFTER `_destByChip`
// and BEFORE the product-word fallback. This deriver is what POPULATES that map:
// the 6 notif type chips set `notifSectionProvider`; each conversation chip sets
// `updatesChatOpenProvider`.
// The entry section chips (שיחות/התראות) stay REAL [KbDestination]s in
// `destByChip` (they reuse the registry',
  't_151dbd1a': 's labels are unique, so the map is total + unambiguous).
late final Map<String, KbDestination> _entrySectionByLabel =
    <String, KbDestination>{
  for (final d in kbDestinations()) d.label: d,
};

/// The two entry SECTION labels, in owner order (שיחות first), copied
/// byte-for-byte from the registry labels — the SAME pair the keyboard',
  't_fc4f5fed': 's node-list (התראות tools at sub 0, chat
///     tools at sub 1). A tap on a section chip flips `updatesSubTabProvider`,
///     which re-fires the location — the mirror closes its own loop with no new
///     dispatch code.
///   • [NotifsLocation] -> predictions: the 6 TYPE chips (runByChip, each sets
///     `notifSectionProvider`); tools: mark-all-read / notif-settings. The row is
///     NEVER blank (the 6 chips are static), so it works even on the empty live
///     feed.
///   • [ChatsLocation]  -> predictions: one chip per VISIBLE thread (runByChip,
///     each sets `updatesChatOpenProvider` to the thread id; the screen performs
///     the real `_ChatPage` push), de-duped by visible label + capped at
///     [_kUpdatesRowCap]; tools: the chat tools ("בקרוב" leaves + voice). Zero
///     conversations => empty chip list => the row shows tools only (no crash).
KbUpdatesContext deriveUpdatesContext(
  UpdatesLocation location, {
  required List<ThreadLite> threads,
  // Phase-4 atomic-snapshot slot (plan seam 8): the live notif list, ignored by
  // phases 0-2 (the NotifsLocation arm emits 6 static type chips). Typed against
  // the public [NotifSection] today because a leaf file cannot define a public
  // `NotifLite` projection and the private `_Notif` record is not importable; swap
  // the element type to `List<NotifLite>` once finding #1 lands it in
  // notifications_screen.dart. Optional + const-default so every existing caller +
  // unit test stays green (not `required` — that cannot carry a default, and the
  // prod call site is owned by the keyboard, not this leaf).
  List<NotifSection> notifs = const <NotifSection>[],
  // ORG-GATE (giant-system V2): is the org',
  't_be8a9dad': 's private `_PredRow`:
/// the prediction-row [chips] plus the TWO dispatch surfaces the keyboard needs.
/// The keyboard adapts this into its own `_PredRow` in `_rowFor` (a field-for-field
/// copy).
///
///   • [chips] — the row labels, already ordered + de-duped + capped by the
///     producing arm.
///   • [destByChip] — chip -> [KbDestination] for the entry SECTION chips
///     (שיחות/התראות): dispatch (i) runs the registry',
  't_4b143160': 's stack base, or
  /// null to leave the current base untouched.
  final List<KbToolNode>? toolBase;

  /// The [toolBase] labels — the stable, comparable projection of the tool nodes
  /// (their closures are never structurally equal, so equality keys on the
  /// labels the user sees).
  List<String> get _toolLabels =>
      <String>[for (final n in toolBase ?? const <KbToolNode>[]) n.label];

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is KbUpdatesContext &&
          other.row == row &&
          (other.toolBase == null) == (toolBase == null) &&
          listEquals(other._toolLabels, _toolLabels);

  @override
  int get hashCode =>
      Object.hash(row, toolBase == null, Object.hashAll(_toolLabels));
}

/// MEMOIZED label -> entry-section [KbDestination], built ONCE from the registry.
/// The entry chips (שיחות/התראות) are real registry destinations; `kbDestinations`
/// re-allocates the whole ~50-entry list per call, so — exactly like the floating
/// keyboard',
  't_7fa9afc2': '🎁 מבצעים',
  't_8a921677': '📦 משלוחים',
  't_df86fd7a': '🛒 הזמנות',
  't_b2249a6e': ' lines become headers).
/// Reached from הגדרות › מידע, from the app-wide search entries, and from the
/// registration footer on the welcome screen.
class LegalScreen extends StatefulWidget {
  const LegalScreen({this.initialTab = LegalTab.terms, super.key});

  /// The document shown when the screen opens.
  final LegalTab initialTab;

  static Route<void> route({LegalTab initialTab = LegalTab.terms}) =>
      MaterialPageRoute<void>(
        builder: (_) => LegalScreen(initialTab: initialTab),
      );

  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  late LegalTab _tab = widget.initialTab;

  @override
  Widget build(BuildContext context) {
    final doc = _tab == LegalTab.terms ? kTermsOfUse : kPrivacyPolicy;
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        title: const CfgText(
          ',
  't_536951a2': ';

/// Which legal document the screen opens on.
enum LegalTab {
  /// תנאי שימוש.
  terms,

  /// מדיניות פרטיות.
  privacy,
}

/// תנאי שימוש + מדיניות פרטיות — a clean RTL reader screen (task #26).
///
/// Two documents behind a segmented toggle; content comes verbatim from
/// [kTermsOfUse] / [kPrivacyPolicy] (lib/data/legal_texts.dart) and renders
/// as scrollable [SelectableText] sections (',
  't_9adf69a5': '[שם החברה] — יושלמו לפני השקה מסחרית.',
  't_2ff5c8c3': 's details exist — אין המצאות.
class _PlaceholderNotice extends StatelessWidget {
  const _PlaceholderNotice();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space3),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E8),
        borderRadius: BorderRadius.circular(BsTokens.space3),
        border: Border.all(color: const Color(0xFFF3DFB6)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(',
  't_d8fca76b': 'עדכון אחרון: \$kLegalLastUpdated',
  't_570bdad6': 'פרטי החברה המופיעים במסמכים בסוגריים מרובעים — כגון ',
  't_8311e01b': 'תנאי שימוש ופרטיות',
  't_49972711': ';

/// Step 3 of the lens selector — the LIST-LEVEL view-axis control that lives
/// OUTSIDE the product card. A row of chips (📂 קטגוריה / 🎚 וריאנטים / 🌳 עץ-חכם)
/// that re-organises the product list it sits above. Only the lenses that are
/// MEANINGFUL for [products] are shown (see [availableLensesForSet]) — a
/// raw-parts list like copper fittings or PPR shows no 🌳, a single-category
/// set shows nothing at all.
///
/// Reads/writes [catalogLensProvider]. Tapping a chip changes the active lens;
/// the host list then renders `groupByLens(products, activeLens)`. This widget
/// renders NOTHING when fewer than two lenses apply (a 1-option selector is
/// noise), so the default category-only screens are visually unchanged.
class LensSelectorRow extends ConsumerWidget {
  const LensSelectorRow({required this.products, super.key});

  final List<LipskeyCatalogProduct> products;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final available = availableLensesForSet(products);
    // A selector with one (or zero) option is noise — render nothing so the
    // familiar category-only list is untouched.
    if (available.length < 2) return const SizedBox.shrink();

    final selected = ref.watch(catalogLensProvider);
    final active = resolveActiveLens(selected, available);

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 4),
      child: Row(
        children: [
          CfgText(
            ',
  't_b0742243': 'סדר לפי:',
  't_01391eb4': '\$catCount קטגוריות',
  't_066e9674': '\$prodCount מוצרים',
  't_a91b1071': '\$totalProducts מוצרים · \$totalCats קטגוריות',
  't_7d6f2a30': ';

/// The catalog entries of [section] that have at least one product. Under
/// [kHideUnderConstruction] the level-2 grid renders ONLY these — the empty
/// brand categories ("אמבט ואגנית", "מאספים וקולטים") would otherwise show a
/// dimmed "בקרוב" badge the App Store rejects. Reversible data filter (mirrors
/// catalog_screen',
  't_93d3a83b': 'אינסטלציה · סניטציה',
  't_f0e416ad': 'ליפסקי ברקן · \${entries.length} קטגוריות',
  't_3f58de5e': '
  int? _activeStage;
  late Map<int, bool> _accSelected;
  int _qty = 1;
  _Unit _unit = _Unit.single;


  int get _unitMult => switch (_unit) {
        _Unit.single => 1,
        _Unit.pack => _current.qtyPack ?? 1,
        _Unit.pallet => _current.qtyPallet ?? 1,
      };

  /// Normalised DN-size set used for *matching* compatibility. Only sizes in
  /// a real dimension context — DN-prefixed, ratios (50/40), inch fractions —
  /// so packaging quantities ("75 כמות באריזה") and lengths ("200 ס"מ") are
  /// NOT treated as sizes.
  Set<String> _sizeSet(String name) {
    final out = <String>{};
    void addParts(String token) {
      out.add(token);
      for (final part in token.split(',
  't_3ff51423': ' and vice-versa
    final method = p.connectionMethod;
    final seen = <String>{p.sku};
    final all = <LipskeyCatalogProduct>[];
    for (final q in _scanPool) {
      if (q.categoryHe == p.categoryHe) continue; // cross-category only
      if (!seen.add(q.sku)) continue;
      if (!_sizeSet(q.nameHe).contains(size)) continue;
      // צעד 60: a gendered end never mates with the same gender — drop it.
      if (gender != null &&
          q.connectionGender != null &&
          q.connectionGender == gender) {
        continue;
      }
      all.add(q);
    }
    // ranking (צעדים 61–63): same connection-method first, then same material,
    // then opposite gender (the true mate), then category name for stability.
    int methodRank(LipskeyCatalogProduct x) =>
        method == null || x.connectionMethod == null
            ? 1
            : (x.connectionMethod == method ? 0 : 2);
    int genderRank(LipskeyCatalogProduct x) => gender != null &&
            x.connectionGender != null &&
            x.connectionGender != gender
        ? 0
        : 1;
    all.sort((a, b) {
      final cmp = methodRank(a).compareTo(methodRank(b));
      if (cmp != 0) return cmp;
      final am = _material(a) == mat ? 0 : 1;
      final bm = _material(b) == mat ? 0 : 1;
      if (am != bm) return am - bm;
      final g = genderRank(a).compareTo(genderRank(b));
      if (g != 0) return g;
      return a.categoryHe.compareTo(b.categoryHe);
    });
    return all.take(12).toList();
  }

  /// Per-side connection groups: [(sizeLabel, fitting parts), ...].
  List<({String size, List<LipskeyCatalogProduct> parts})> _connectionGroups(
      LipskeyCatalogProduct p) {
    // צעד 68: a manual size override wins over name extraction.
    final sizes = kLipskeyConnectionSizeOverride[p.sku] ?? _connectionSizes(p.nameHe);
    final groups = <({String size, List<LipskeyCatalogProduct> parts})>[];
    for (final s in sizes) {
      final parts = _partsForSize(p, s);
      if (parts.isNotEmpty) groups.add((size: s, parts: parts));
    }
    // צעד 68: prepend confirmed manual pairings the size match missed.
    final overrideSkus = kLipskeyCompatPairOverride[p.sku] ?? const [];
    if (overrideSkus.isNotEmpty) {
      final extra = _scanPool
          .where((q) => overrideSkus.contains(q.sku))
          .toList();
      if (extra.isNotEmpty) {
        if (groups.isEmpty) {
          groups.add((size: ',
  't_ff166df7': '\$base ליחידה',
  't_6790d529': '\$compat מוצרים',
  't_17e0803a': '\$famCount וריאנטים',
  't_34e5ce0b': '\${_companyComplements.length} מוצרים',
  't_c599e3ff': '\${_compliance.length} דרישות',
  't_bf8150a5': '\${_stages.length} שלבים',
  't_47a15e63': '\${g.parts.length} חלקים',
  't_deaae812': '\${groups.length} צדדים — מה מתחבר לכל מידה',
  't_381255fc': '\${k.must} חובה',
  't_384b1370': '\${k.optional} אופציה',
  't_6c4eb790': '\${k.tools} כלים',
  't_b2ab6a53': '\${kit.length} חלקים — מתאם לכל צד חיבור',
  't_fb17f9ac': ') !=
          frame) continue;
      if (seen.add(v)) all.add(q);
    }
    all.sort((a, b) {
      if (a.sku == p.sku) return -1;
      if (b.sku == p.sku) return 1;
      return variantValue(a, kind).compareTo(variantValue(b, kind));
    });
    return all;
  }

  // ── סוג מורכב: multi-word types first, then type+qualifier ──────────────
  static String _resolveCompoundType(LipskeyCatalogProduct p) {
    final name = p.nameHe;
    final words = name.split(RegExp(r',
  't_4fae0a44': ')),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _EmptyHint extends StatelessWidget {
  const _EmptyHint(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(4, 4, 4, 6),
        child: Text(text,
            textAlign: TextAlign.right,
            style: const TextStyle(
                color: Color(0xFF9AA3B2),
                fontSize: 11,
                fontStyle: FontStyle.italic)),
      );
}

/// Interactive attribute chips (צעד 71+).
/// All four chip kinds use frame-based sibling detection:
/// orange border = has same-frame siblings with a different attribute value.
class _InteractiveChips extends StatelessWidget {
  const _InteractiveChips({
    required this.product,
    required this.openPickerKey,
    required this.onChipTap,
    required this.onVariantSelect,
  });

  final LipskeyCatalogProduct product;
  final String? openPickerKey; // ',
  't_04381621': ')).toList();
    // preserve a stable, human order: larger DN first
    atomic.sort((a, b) {
      final na = int.tryParse(a), nb = int.tryParse(b);
      if (na != null && nb != null) return nb.compareTo(na);
      return a.compareTo(b);
    });
    return atomic;
  }

  /// Material of a product, inferred from name/category (צעד 62).
  static String _material(LipskeyCatalogProduct p) {
    final n = p.nameHe + p.categoryHe;
    if (n.contains(',
  't_0d6c27b7': ');
      });
  }

  // ── מידה: frame-based (אותו מוצר, מידה שונה) — חוצה-מותג ─────────────────
  static double _firstSizeNum(String s) =>
      double.tryParse(RegExp(r',
  't_1b0b91d6': ');
    });
    return all;
  }

  // ── תת-סוג: frame-based (אותו סוג, תת-סוג שונה) ─────────────────────────
  static List<LipskeyCatalogProduct> _variantsSubtype(
      LipskeyCatalogProduct p) {
    const kind = AttrKind.subtype;
    final frame = p.nameHe
        .split(RegExp(r',
  't_6cca9db2': ');
}

/// Compact spec one-liner for the strip header (the expanded panel shows
/// the full breakdown): "פליז · 90°C · ½""
String _formatSpecValue(
    ({
      String material,
      String? pressureRating,
      double maxTempC,
      String waterSystem,
      String endsSummary,
      double? minBoreMm,
    }) s) {
  final parts = <String>[s.material, ',
  't_846e081f': '+ ערכה',
  't_8e207a7c': ',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5)),
                ),
              ),
            // "פרטים / מפרט" button — flips to the spec page
            Positioned(
              bottom: 0,
              left: 10,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: widget.onFlip,
                // ≥48dp tap target (a11y); bottom 10→0 keeps the centred chip
                // in (roughly) the same visual spot.
                child: ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 48),
                  child: Center(
                    widthFactor: 1,
                    heightFactor: 1,
                    child: Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: BsTokens.brand,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.description_outlined,
                              color: Color(0xFF1A1200), size: 14),
                          SizedBox(width: 5),
                          CfgText(',
  't_2c5ceaac': ',
                    style: TextStyle(
                        color: stage.isFinal
                            ? BsTokens.success
                            : const Color(0xFF64FFDA),
                        fontSize: 12,
                        fontWeight: FontWeight.w700)),
              ),
              const SizedBox(width: 10),
              Text(stage.emoji,
                  style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(stage.label,
                        style: const TextStyle(
                            color: BsTokens.inkLight,
                            fontSize: 13,
                            fontWeight: FontWeight.w600)),
                    if (isActive && stage.desc.isNotEmpty) ...[
                      const SizedBox(height: 3),
                      Text(stage.desc,
                          style: const TextStyle(
                              color: Colors.black38, fontSize: 12)),
                    ],
                  ],
                ),
              ),
              Icon(
                isActive
                    ? Icons.keyboard_arrow_up
                    : Icons.keyboard_arrow_down,
                color: const Color(0xFF888888),
                size: 18,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
class _SectionTitle extends StatelessWidget {
  const _SectionTitle(
      {required this.emoji, required this.title, this.subtitle});
  final String emoji;
  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) => Padding(
        padding:
            const EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          children: [
            Text(emoji,
                style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 8),
            Flexible(
              child: Text(title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      color: BsTokens.inkLight,
                      fontSize: 14,
                      fontWeight: FontWeight.w700)),
            ),
            if (subtitle != null) ...[
              const SizedBox(width: 8),
              Flexible(
                child: Text(subtitle!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        color: Color(0xFF888888), fontSize: 11)),
              ),
            ],
          ],
        ),
      );
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) => const Divider(
      height: 1, color: Color(0xFFEEEEEE), indent: 20, endIndent: 20);
}

Widget _SpecRow(String emoji, String label, String value) => Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 15)),
          const SizedBox(width: 8),
          Flexible(
            child: Text(label,
                style: const TextStyle(
                    color: Colors.black38, fontSize: 13)),
          ),
          const SizedBox(width: 12),
          // Wrap long values (e.g. dims מידות / תיאור) instead of overflowing
          // the Row — short values still right-align identically to before.
          Expanded(
            child: Text(value,
                textAlign: TextAlign.end,
                style: const TextStyle(
                    color: BsTokens.inkLight, fontSize: 13)),
          ),
        ],
      ),
    );

/// Four expandable info strips for the product sheet — מאתר · תאימות ·
/// ערכת התקנה · דומים. Each strip stays compact by default and pulls its
/// payload INTO the card when the user taps it (no navigation, no snackbars,
/// no scrolling) — the data is rendered right below the row. Only one strip
/// is open at a time; tapping the open strip closes it.
class _QuickInfoStrips extends ConsumerStatefulWidget {
  const _QuickInfoStrips({
    required this.product,
    required this.onPickProduct,
  });

  final LipskeyCatalogProduct product;

  /// Called when the user picks a product from any of the expanded panels.
  /// The product sheet swaps the displayed product to the picked one without
  /// closing the sheet — same UX as the existing brand-variant chips.
  final void Function(LipskeyCatalogProduct) onPickProduct;

  @override
  ConsumerState<_QuickInfoStrips> createState() => _QuickInfoStripsState();
}

enum _StripKind { finder, compat, complements, kit, variants, compliance, spec, price, info, hygiene }

/// Socket-fusion welding plan per nominal diameter (catalog p.9):
/// (insertion depth mm, heating sec, cooling min). Plate temp 260°C.
const _kPprWeldPlan = <String, (double, int, int)>{
  ',
  't_0c36906a': ',
            textAlign: TextAlign.right,
            style: const TextStyle(
                color: BsTokens.inkLight, fontSize: 11.5, height: 1.35)),
      );

  Widget _infoHead(String t) => Padding(
        padding: const EdgeInsets.fromLTRB(4, 8, 4, 2),
        child: Text(t,
            textAlign: TextAlign.right,
            style: TextStyle(
                color: tint, fontSize: 12, fontWeight: FontWeight.w800)),
      );

  // ── מידע כללי: מבנה רב-שכבתי + חומר גלם + יתרונות (מהקטלוג, עמ',
  't_9a2f9de2': ', () => onChanged(qty + 1)),
        ],
      ),
    );
  }
}

// ── unit toggle: בודד / ארגז / משטח ──────────────────────────────────────────
class _UnitToggle extends StatelessWidget {
  const _UnitToggle({
    required this.unit,
    required this.hasPack,
    required this.hasPallet,
    required this.onChanged,
  });
  final _Unit unit;
  final bool hasPack;
  final bool hasPallet;
  final ValueChanged<_Unit> onChanged;

  @override
  Widget build(BuildContext context) {
    Widget opt(String label, _Unit u, bool enabled) {
      final sel = unit == u;
      return Expanded(
        child: InkWell(
          onTap: enabled ? () => onChanged(u) : null,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 11),
            color: sel ? BsTokens.brand : Colors.transparent,
            alignment: Alignment.center,
            child: Text(label,
                style: TextStyle(
                    fontSize: 12,
                    color: sel
                        ? const Color(0xFF1A1200)
                        : (enabled
                            ? const Color(0xFF9AA3B2)
                            : const Color(0xFF44495A)),
                    fontWeight: sel ? FontWeight.w800 : FontWeight.w500)),
          ),
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFEEEEEE)),
        borderRadius: BorderRadius.circular(12),
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        children: [
          opt(',
  't_1c8974d2': ', parts: extra));
        } else {
          final first = groups.first;
          final merged = [
            ...extra,
            ...first.parts.where((q) => !overrideSkus.contains(q.sku)),
          ];
          groups[0] = (size: first.size, parts: merged);
        }
      }
    }
    return groups;
  }

  /// Installation kit (צעד 64): the single best-ranked mate for each
  /// connection side — the minimal parts list to complete every joint of this
  /// product. De-duped by SKU so a part shared across sides appears once.
  List<LipskeyCatalogProduct> _installKit(LipskeyCatalogProduct p) {
    final kit = <LipskeyCatalogProduct>[];
    final seen = <String>{};
    for (final g in _connectionGroups(p)) {
      if (g.parts.isEmpty) continue;
      final top = g.parts.first; // rank #1 (same method/material, opp. gender)
      if (seen.add(top.sku)) kit.add(top);
    }
    return kit;
  }

  void _addKitToCart(List<LipskeyCatalogProduct> kit) {
    final notifier = ref.read(smartCartProvider.notifier);
    for (final part in kit) {
      notifier.add(SmartCartLine(
        productKey: ',
  't_4d55e491': '1. הכנס את הצינור* או האביזר עד למעצור (*ללא גראדים)',
  't_5ab69866': '2. הדק את האום עד לנעילת השיניים',
  't_4c297e67': '2. השחל את האום והאטם הכדורי על הצינור',
  't_e31224b4': '4. הדק את אביזר הסמארט לוק',
  't_f853e1ee': '70°C למשך 30 דק׳ (טיפול בלגיונלה)',
  't_ce3e8b9e': ';
  }

  // ── סוג: category-wide (כל הסוגים בקטגוריה, כמו findTypeSiblings) ────────
  static List<LipskeyCatalogProduct> _variantsType(LipskeyCatalogProduct p) {
    final compound = _resolveCompoundType(p);
    if (compound.isEmpty) return [];
    final byCompound = <String, LipskeyCatalogProduct>{compound: p};
    for (final q in resolvedCatalogProducts) {
      if (q.categoryHe != p.categoryHe) continue;
      final qc = _resolveCompoundType(q);
      if (qc.isEmpty || byCompound.containsKey(qc)) continue;
      byCompound[qc] = q;
    }
    if (byCompound.length <= 1) return [];
    return byCompound.values.toList()
      ..sort((a, b) {
        if (a.sku == p.sku) return -1;
        if (b.sku == p.sku) return 1;
        return _resolveCompoundType(a).compareTo(_resolveCompoundType(b));
      });
  }

  // ── דגם: category-wide (כל הדגמים בקטגוריה, כמו findAttrSiblings(model)) ─
  static List<LipskeyCatalogProduct> _variantsModel(LipskeyCatalogProduct p) {
    final seen = <String>{};
    final all = <LipskeyCatalogProduct>[];
    for (final q in resolvedCatalogProducts) {
      if (q.categoryHe != p.categoryHe) continue;
      final m = q.brandModel;
      if (m == null || m.isEmpty) continue;
      if (seen.add(m)) all.add(q);
    }
    if (all.length <= 1) return [];
    return all
      ..sort((a, b) {
        if (a.sku == p.sku) return -1;
        if (b.sku == p.sku) return 1;
        return (a.brandModel ?? ',
  't_8bcdb9fe': '; // default drainage
  }

  /// For one connection size — every other-category part that fits it,
  /// מדורג: אותו חומר תחילה (צעדים 62–63).
  List<LipskeyCatalogProduct> _partsForSize(
      LipskeyCatalogProduct p, String size) {
    final mat = _material(p);
    final gender = p.connectionGender; // ',
  't_2999e2d6': 'SMART LOCK — מערכת דלוחין, צנרת ואביזרים מפוליפרופילן בקטרים 32-63 מ"מ בצבע שחור',
  't_bb5573c7': 'SmartLock™ · דלוחין PP · 32-63 מ"מ',
  't_976e38d3': 's expandable carousel; variant
                    //   switching now happens via the strip panel.)

                    // ── (Removed: standalone "🧰 אביזרים נדרשים" — fully
                    //   absorbed into the 📦 ערכת התקנה strip panel.)

                    // ── Installation stages ─────────────────────────────
                    if (_stages.isNotEmpty) ...[
                      _SectionTitle(
                        emoji: ',
  't_6162f5d8': 's tapped. Each kind
/// pulls its content from the matching helper (related_info.dart / smart-tree
/// / variant-families) and renders it as a compact horizontal carousel of
/// mini cards, or — for ערכת התקנה — a vertical list of accessory rows.
class _StripPanel extends StatelessWidget {
  const _StripPanel({
    required this.kind,
    required this.product,
    required this.tint,
    required this.onPickProduct,
  });

  final _StripKind kind;
  final LipskeyCatalogProduct product;
  final Color tint;
  final void Function(LipskeyCatalogProduct) onPickProduct;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(10, 4, 10, 10),
      color: tint.withValues(alpha: 0.05),
      child: switch (kind) {
        _StripKind.finder => _buildFinder(),
        _StripKind.compat => _buildCompat(),
        _StripKind.complements => _buildComplements(),
        _StripKind.kit => _buildKit(),
        _StripKind.variants => _buildVariants(),
        _StripKind.compliance => _buildCompliance(),
        _StripKind.spec => _buildSpec(),
        _StripKind.price => _buildPrice(context),
        _StripKind.info => _buildInfo(),
        _StripKind.hygiene => _buildHygiene(),
      },
    );
  }

  // ── מאתר: other products in the same layman finder group ──────────────────
  Widget _buildFinder() {
    final f = finderGroupFor(product);
    if (f == null) {
      return const _EmptyHint(',
  't_189f09c2': 'אביזרי תבריג: PPR + פליז DZR',
  't_07294f05': 'אביזרים נבחרים:',
  't_0eeb272e': 'אביזרים: PPMD PP',
  't_0a5e574e': 'אביזרים: PPR',
  't_878565e4': 'אופציונלי (עץ חכם)',
  't_87b6177b': 'אזהרות (חוליות)',
  't_184e13d7': 'אטם מערכת: אטם לחץ אלסטומרי TPE',
  't_59e53b01': 'אטם עמיד לאורך זמן',
  't_dfe05957': 'אין דרישות תקינות מיוחדות',
  't_b351ca65': 'אין הערכת מחיר לקטגוריה זו',
  't_bd64ab0a': 'אין הקטנת קוטר בצינורות ובאביזרים לאחר החיבור',
  't_31215d8f': 'אין וריאנטים נוספים',
  't_3cca7958': 'אין מוצרים אחרים בקבוצה',
  't_334a1128': 'אין מוצרים משלימים',
  't_04858d0a': 'אין מפרט הנדסי מאומת',
  't_c5cdf8bb': 'אין מפרט תואם',
  't_58f615b1': 'אין פריטים לסל',
  't_712bf262': 'אין צורך בהכנת פאזה לצינור (נדרש לנקות גראדים) · אין צורך בשימוש בחומרי סיכה',
  't_2bb110b1': 'אין קורוזיה ואין הצטברות אבנית בכל חלקי המערכת',
  't_def9753f': 'אין רשימת ערכת התקנה',
  't_31ef6888': 'אסור לבצע חיטוי תרמי וכימי בו-זמנית',
  't_e56095e7': 'אסור שימוש בכלור דיאוקסיד במערכות PPR',
  't_68db4ca1': 'בור חלק · ללא אבנית',
  't_1225bb8f': 'דומים',
  't_a0fdf3a3': 'דירוג לחץ',
  't_e6ec4e84': 'הגדלה',
  't_f158ba26': 'הדק את האום עד נעילת השיניים',
  't_c48ad859': 'הוסף הכל לסל',
  't_78d84878': 'הוסף לקו',
  't_91877422': 'החזק מחוברים ללא סיבוב עד התקררות',
  't_e6b18b19': 'הכנס את הפקק שהמילה UP נמצאת בחלקו העליון וידית האחיזה נמצאת במצב אנכי',
  't_4f346a88': 'הכנס צינור ואביזר לתותבים (נקבה+זכר)',
  't_7c95e6fb': 'המפרט הבא',
  't_c242b4ba': 'הערכה',
  't_f4ca49bd': 'הערכה לפי קטגוריה — מחיר אמיתי תלוי בספק, מותג ומידה ספציפית.',
  't_61bf2962': 'הצנרת היחידה לאספקת מים ההומוגנית בכל חלקיה לאחר ריתוך',
  't_dc59d0dc': 'השלם קו (\${picks.length})',
  't_a0e071ac': 'התמונה הבאה',
  't_eae8fac5': 'התקנה ידנית של האום',
  't_adcc8df4': 'התקנה מהירה ופשוטה, אטם אינטגרלי באביזר',
  't_ea5beea1': 'ודא פלטה ב-260°C ותותבים מחוזקים',
  't_7c3c007c': 'וקר לאביזר הנדרש, ללא הידוק חיבור הסמארטלוק',
  't_ce2d1247': 'חובה (עץ חכם)',
  't_2b388c02': 'חוזק טבעתי גבוה',
  't_aea296db': 'חומר גלם',
  't_d5bd65f6': 'חזרה למוצר',
  't_9b10863b': 'חזרה למוצר הקודם',
  't_fffb5824': 'חיבורים תואמים',
  't_de8170ef': 'חיטוי בכלור עלול לקצר את אורך חיי הצנרת',
  't_8a6a6fe2': 'חיטוי וניקוי',
  't_268e450c': 'חיטוי כימי',
  't_84c36041': 'חיטוי תרמי',
  't_98d337f8': 'חלופה: מי חמצן (H2O2) 150 מ"ג/ל׳ למשך 24 שעות',
  't_eacdf049': 'חמם לפי הזמן בטבלה, שלוף וחבר מיד עד הסימון',
  't_26fbb23f': 'ט',
  't_1ed4903f': 'טמפ׳ עד 30°C בזמן החיטוי הכימי',
  't_32bf4be3': 'יתרונות',
  't_4209dd44': 'כוון את החץ הירוק שעל האום מול השן הגדולה באביזר ← הברג את האום עד לשמיעת הקליק (מעבר מעל השן הגדולה)',
  't_0013a216': 'כלור חופשי 50 מ"ג/ל׳ מעל 12 שעות — פעמיים בשנה',
  't_ae6a43f7': 'כלים ואיטומים (אוטומטי)',
  't_57c67db4': 'כמות באריזה',
  't_1c17f824': 'כמות במשטח',
  't_bb4af86f': 'לא נדרש חיטוי שוטף — שטיפה במים בלבד ברוב המקרים',
  't_c6bea672': 'לא נמצאו מוצרים שמשלימים את הקצוות',
  't_29fdd6dc': 'לא נמצאו פריטים לפתרון — בחר מוצרים אחרים לקו',
  't_eb6c72fa': 'לחץ עבודה',
  't_2783a1e0': 'לחץ עבודה (50 שנה)',
  't_98f13081': 'ליחידה',
  't_7f5b391c': 'לפי נתוני היבוא',
  't_48c8721a': 'מה מתחבר ל-\${_sizeLabel(groups.first.size)}',
  't_5eabf8fe': 'מה עוד צריך להתקנה?',
  't_e5325bf9': 'מודול אלסטיות ואימפקט גבוה',
  't_12a71045': 'מוצרים
      // משלימים',
  't_e9f79937': 'מוצרים משלימים',
  't_dbfbfa64': 'מחברי הברגה מפליז DZR לסביבה קורוזיבית',
  't_545926bc': 'מידע כללי',
  't_88ec9d79': 'מיוצר בישראל · בעל תו תקן ישראלי',
  't_dfa1ae5a': 'מקדם חיכוך נמוך ביותר — נשארת נקייה לאורך שנים',
  't_df9e7a0f': 'מתאים לתנאים שלי?',
  't_e0e3e75f': 'נוסף לקו ✓',
  't_0563f7af': 'נוספו \${items.length} פריטי-קו לסל ✓',
  't_d1b299a7': 'נוספו \${kit.length} חלקי ערכת-התקנה לסל ✓',
  't_628acc08': 'ניתן בטמפ׳ גבוהה יותר לפי הטבלאות — ללא חריגה מהמרבי',
  't_85f7879a': 'נמצא ב',
  't_7066e63b': 'סה"כ \${_qty * _unitMult} יחידות',
  't_2a319539': 'עמוד \${p.page}',
  't_ddb10342': 'עמוד 0',
  't_5cdc3761': 'עמוד בקטלוג',
  't_4e03aa9c': 'עמידות בפני פגיעות מכניות',
  't_04bedc33': 'עמידות בתנאי מזג אויר קשים',
  't_db589922': 'עמידות כימית גבוהה',
  't_99601b96': 'עמידות מצוינת וארוכת טווח בלחצים גבוהים',
  't_4c529070': 'ערכת התקנה מומלצת',
  't_14bbc679': 'פולירול',
  't_d3ab5fdb': 'פנים צינור חלק מאפשר זרימה נקיה',
  't_cc9b1d22': 'פרטי מוצר',
  't_e0157a6d': 'פרטים / מפרט',
  't_36c80ecd': 'צבוט להגדלה · הקש לסגירה',
  't_72ab7d74': 'צינור רב שכבתי PPML-MD-S16',
  't_53c6729c': 'צנרת PPR · יתרונות',
  't_fa9f1255': 'צנרת PPR לאספקת מים חמים וקרים',
  't_df3a023a': 'צנרת אקוסטית להפחתת רעש',
  't_89421619': 'צנרת עמידה בעומסי כבידה ללא היווצרות בטן',
  't_8fafa1f8': 'צנרת קלה ונוחה לעבודה, מגוון אביזרים רחב',
  't_d5b13d16': 'קוטר פנימי',
  't_cd4c1ac7': 'קיימות (אורך חיים) ל-100 שנה',
  't_5a109e57': 'קצוות חיבור',
  't_032f875a': 'קשיחות ויציבות גבוהים',
  't_c92ea2ed': 'רמת אקוסטיקה גבוהה',
  't_470cd325': 'שימוש בצינורות חלקים',
  't_10359a7d': 'שכבה אמצעית: פוליפרופילן עם תרכובת מינרלית PPMD — בידוד אקוסטי',
  't_7ff66bff': 'שכבה חיצונית: פוליפרופילן שחור — מעכבת קרני UV',
  't_d5dadf10': 'שכבה פנימית: פוליפרופילן לבן — מאפשרת ניטור ובקרה חזותיים',
  't_7f04a66e': 'שתי צורות חיטוי למערכות פולירול: תרמי וכימי',
  't_cb7bc3be': 'ת"י 14020 — היתר 70304 (תו ירוק למוצרי PP)',
  't_31d24c0d': 'ת"י 5694 — היתר 114783 (אביזרי ניקוז לאמבט, מחסומים גלויה וסיפונים)',
  't_d2dbe848': 'ת"י 71253-1 — היתר 114782 (מחסום ריחות מפלסטיק לרצפה)',
  't_57186e49': 'ת"י 71253-2 (מאסף מפלסטיק לרצפה ברצפה)',
  't_de12074e': 'ת"י 958-1 — היתר 737 (צנרת PP לסילוק שפכים חמים)',
  't_9fe58ad5': 'תוכנית ריתוך-שקע (פלטה 260°C)',
  't_1daeb73a': 'תוצאות צילום חדות במיוחד',
  't_af226b16': 'תכונות הניקיון נובעות משכבה פנימית פוליפרופילן לבן חלקה ⇒ ללא הצטברות זרימה חופשית',
  't_ba3d5a63': 'תקינות',
  't_5975d756': 'תקן בינלאומי EN-1451 · DIN 8078 · ISO 180',
  't_f56bf66c': '⌀\$dn: עומק \${weld.\$1} מ"מ · חימום \${weld.\$2} שנ׳ · קירור \${weld.\$3} דק׳',
  't_2bfae940': '⚠️ \${plan.gaps.length} פערים — דורש השלמה',
  't_6516d642': '⚠️ האביזרים מגיעים כשהאומים מורכבים עליהם ומוכנים להתקנה. במצב שבו האום מופרד מהאביזר יכול להתקיים רק על ידי פתיחה מכוונת',
  't_556efd24': '💡 צ׳יפ כתום ▾ — הקש להחלפת גודל/צבע/דגם',
  't_a8560b06': '📋 רשימת חומרים — קו',
  't_f84ce1e0': '📋 שלמות נתונים \${d.score}% · \${d.label}',
  't_89f5b381': '📐 צד \${gi + 1}: \${_sizeLabel(g.size)}',
  't_b1107d71': '🔌 מה מתחבר לזה',
  't_00644600': '🔗 קשור',
  't_3a3361c4': '🔧 מוכנות התקנה \${s.score} · \${s.label}',
  't_357fb685': '"\${p.nameHe}" יוסר מהסל.',
  't_2d868034': ')
      .trim();
}

/// All individual words that appear in any attribute-value entry (including
/// sub-words of multi-word entries such as "מוברש" from "ניקל מוברש").
/// Used by [productListDedupeKey] so that "שחור מט" and "שחור" collapse to the
/// same frame (both "מט" and "שחור" are stripped).
final _kAttrWordSet = <String>{
  for (final v in [...kLipskeyColors, ...kLipskeyModels, ...kLipskeySubtypes])
    ...v.split(RegExp(r',
  't_9833b845': ')
      .trim();
}

/// First kLipskeyTypes word as it appears in the name (left-to-right) — the real
/// leading product type, unlike _getCompoundType which scans kLipskeyTypes in
/// list-order and can grab a secondary word (רקורד/מצרה) in PPR fitting names.
String _leadingType(LipskeyCatalogProduct p) {
  for (final w in p.nameHe.split(RegExp(r',
  't_1a85dd46': '))
          .where(isSizeToken)
          .expand((w) => parseSizeTokens(w).map((t) => t.label))
          .toSet();
      for (final t in tokensFromDims(product.dims!)) {
        if (t.family == SizeFamily.dnDiameter &&
            !nameSizeLabels.contains(t.label)) {
          chips.add(_grayInfoChip(t.label));
        }
      }
    }

    // Length — informational gray chip (e.g. "4 מ׳"), never pickable.
    final length = product.dims?[',
  't_45c60a22': '))
        .any((w) => _attrKindFor(w) == kind);
  }).toList();
}

/// Compound type of a product.
/// Multi-word kLipskeyTypes entries (e.g. "מוט מגבת") are matched first via
/// substring. Single-word entries follow the "type + next unclassified word"
/// heuristic (e.g. "ברז" + "נשלף" → "ברז נשלף").
String _getCompoundType(LipskeyCatalogProduct p) {
  final name = p.nameHe;
  final words = name.split(RegExp(r',
  't_cb53aca2': '))) {
    if (kLipskeyTypes.contains(w)) return w;
  }
  return _getCompoundType(p);
}

/// Type siblings: one representative per distinct compound type in the same
/// category. Type is the top-level dimension — no frame restriction needed.
List<LipskeyCatalogProduct> findTypeSiblings(LipskeyCatalogProduct p) {
  final compound = _getCompoundType(p);
  if (compound.isEmpty) return [p];
  // Same category only — no cross-product (pipe→valve→drill). For PPR, key by
  // the LEADING type word (not _getCompoundType, which matches whichever
  // kLipskeyTypes word comes first in list-order and so fragments e.g. "מתאם …
  // רקורד" into fake types). This keeps real splits (collar↔flange) but collapses
  // duplicates.
  final ppr = p.brand == kPolyrollBrand;
  String keyOf(LipskeyCatalogProduct q) => ppr ? _leadingType(q) : _getCompoundType(q);
  final byCompound = <String, LipskeyCatalogProduct>{};
  byCompound[keyOf(p)] = p;
  for (final q in resolvedCatalogProducts) {
    if (q.categoryHe != p.categoryHe) continue;
    final qc = keyOf(q);
    if (qc.isEmpty) continue;
    if (!byCompound.containsKey(qc)) byCompound[qc] = q;
  }
  if (byCompound.length <= 1) return [p];
  return byCompound.values.toList();
}

// ── name split into tappable chips: attribute chips (orange) + words (teal) ─
class _NameWords extends StatelessWidget {
  const _NameWords({required this.product, this.onAttrTap, this.openKind});
  final LipskeyCatalogProduct product;
  /// Tap handler for any attribute chip. Receives the clicked word and its
  /// kind so the card can cycle to the next sibling for that attribute.
  final void Function(String word, AttrKind kind)? onAttrTap;
  /// The attribute kind whose picker is currently open — that chip gets orange styling.
  final AttrKind? openKind;

  @override
  Widget build(BuildContext context) {
    // Strip wrapping punctuation so "(סיפון)" → "סיפון" instead of a green
    // pill carrying the parens; drop fragments that become empty.
    final words = product.nameHe
        .split(RegExp(r',
  't_d7cfb63c': ')).any(isSizeToken));
    final dnInfoChips = (!pathHasSize && product.dims != null)
        ? tokensFromDims(product.dims!)
            .where((t) => t.family == SizeFamily.dnDiameter)
            .map((t) => t.label)
            .toList()
        : const <String>[];
    // §21.C — each chip is stacked: tiny grey label on top (חיבור / צורה /
    // תכונה / תבריג / מידה) + the value pill below. The label makes the
    // hierarchy visible at a glance — primary (חיבור) reads first in RTL,
    // מידה reads last — and the separator stays at pill-level so the
    // breadcrumb still flows.
    return Wrap(
      spacing: 4,
      runSpacing: 4,
      crossAxisAlignment: WrapCrossAlignment.end,
      children: [
        for (var j = 0; j < shown.length; j++) ...[
          if (j > 0)
            const Padding(
              padding: EdgeInsets.only(left: 2, right: 2, bottom: 4),
              child: Text(',
  't_cf90d1c6': ')).toSet()
        : <String>{};

    // Multi-word subtypes for two-word chip detection (e.g. "דו כיווני").
    final multiSubtypes = kLipskeySubtypes.where((s) => s.contains(',
  't_414a8d3a': ')).toSet();

    final chips = <Widget>[];
    final seen = <String>{}; // dedupe repeated chips (e.g. "לחץ"/"יציאה"/"+")
    bool compoundEmitted = false;
    int? afterSubtypeIdx; // where to slot the maker chip — right after פייזר
    int i = 0;

    while (i < words.length) {
      final w = words[i];

      // ── Compound type — emit ONCE as a single chip ──────────────────────
      if (typeWords.contains(w)) {
        if (!compoundEmitted && compound.isNotEmpty) {
          compoundEmitted = true;
          chips.add(_AttrChip(
            word: compound,
            kind: AttrKind.type,
            product: product,
            onTap: onAttrTap,
            isOpen: openKind == AttrKind.type,
          ));
        }
        // Skip all words that belong to this compound.
        i++;
        continue;
      }

      // ── Two-word subtype (e.g. "דו כיווני") ──────────────────────────────
      if (i + 1 < words.length) {
        final two = ',
  't_2ec19e2b': ')).where((w) => w.length >= 2),
};

// Per-kind sub-word sets — used by _stripWordsOfKind to strip ALL sub-words
// of a multi-word entry (e.g. "מוברש" from "ניקל מוברש") so that frames
// match across all color variants of a product family.
final _kColorWords = <String>{
  for (final v in kLipskeyColors) ...v.split(RegExp(r',
  't_a8495042': '),
                product: row.p,
                categoryProducts: widget.products,
                smartLens: row.lens == CatalogLens.smartTree,
              );
            },
            childCount: items.length,
          ),
        ),
        const SliverToBoxAdapter(
          child: SizedBox(height: 24),
        ),
      ],
    );
  }
}

/// Section header for a lens group (title + product count). A 🌳 prefix marks
/// smart-tree groups (a cue that each row opens the rich card via its own
/// "כרטיס חכם" button) — the header itself is a plain label, not tappable.
class _LensGroupHeader extends StatelessWidget {
  const _LensGroupHeader({
    required this.title,
    required this.count,
    this.smartTree = false,
  });

  final String title;
  final int count;
  final bool smartTree;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: smartTree ? const Color(0xFFF0FBF4) : const Color(0xFFF7F7F8),
      padding: const EdgeInsets.fromLTRB(14, 9, 14, 9),
      child: Row(
        children: [
          if (smartTree) ...[
            const Text(',
  't_044f85bb': ').hasMatch(w)) return false; // non-size digit fragment, not a link
  return true;
}

/// Kinds of attributes that are cyclable variants on a product card.
/// [colorMod] is the finish/modifier word of a compound colour (e.g. "מוברש"
/// from "ניקל מוברש") — shown as a separate chip from the base colour.
enum AttrKind { size, color, colorMod, model, subtype, type, material, pressure, sdr, maker }

/// PPR material grades — a critical chip for pipe systems (what the part is
/// made of). Shown as a 🧪 chip distinct from colour/model.
// PPR-only grades — NOT נחושת/פליז/PP (those are existing Lipskey color/subtype
// words; reclassifying them would change Lipskey chips).
const _kPprMaterials = {',
  't_759ea172': ');

  /// Finish modifier word ("מוברש", "מט") of [product], or null.
  String? _colorModifier(LipskeyCatalogProduct product) {
    final w = product.nameHe
        .split(RegExp(r',
  't_bf427f77': ',
                  style: TextStyle(
                      color: Color(0xFF8E8E93),
                      fontSize: 13,
                      fontWeight: FontWeight.w700)),
            ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                chips.levelLabelOf(shown[j].key),
                style: const TextStyle(
                  color: Color(0xFF8E8E93),
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  height: 1.0,
                ),
              ),
              const SizedBox(height: 2),
              _HierarchyChipPill(
                word: shown[j].value,
                isOpen: shown[j].key == openIndex,
                onTap: onChipTap == null ? null : () => onChipTap!(shown[j].key),
              ),
            ],
          ),
        ],
        // Informational dims-DN (covers/risers with no name size) — a stacked
        // "מידה" label + gray pill, non-tappable (not a navigable level).
        for (final dn in dnInfoChips)
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CfgText(
                ',
  't_86fa36da': ',
    };

/// Drop every word that belongs to [kind] from a name. What remains is the
/// "frame" — the part of the name that should match between siblings.
/// Uses per-kind sub-word sets so that modifier words like "מוברש" (part of
/// "זהב מוברש" or "ניקל מוברש") are also stripped, giving consistent frames.
String _stripWordsOfKind(String name, AttrKind kind) {
  var result = name;
  // Strip multi-word subtype/color entries first (e.g. "דו כיווני", "ניקל מוברש").
  if (kind == AttrKind.subtype) {
    for (final s in kLipskeySubtypes) {
      if (s.contains(',
  't_e9c93a6a': ';

/// Category product list. Every product is a rich interactive card:
/// image-tap → fullscreen · card-tap → full sheet · name-word → filtered list
/// · SKU → copy · "+" → inline qty picker (no sheet) · ⓘ → full sheet.
class LipskeyProductsScreen extends StatelessWidget {
  const LipskeyProductsScreen({
    super.key,
    required this.category,
    required this.products,
  });

  final String category;
  final List<LipskeyCatalogProduct> products;

  static Route<void> route({
    required String category,
    required List<LipskeyCatalogProduct> products,
  }) =>
      MaterialPageRoute(
        builder: (_) =>
            LipskeyProductsScreen(category: category, products: products),
      );

  /// Open a filtered list of every catalog product whose name contains [word].
  /// Uses the inverted word-index for exact-word hits (O(1)), with a substring
  /// fallback for partial tokens (צעד 87).
  static void openWordSearch(BuildContext context, String word) {
    final w = word.trim();
    if (w.isEmpty) return;
    final hits = _wordHits(w);
    if (hits.isEmpty) return;
    Navigator.push(
      context,
      route(category: ',
  't_63d94267': ';

List<LipskeyCatalogProduct> findAttrSiblings(
  LipskeyCatalogProduct p,
  String word,
  AttrKind kind,
) {
  // Manufacturer: same spec from a different maker (cross-line, cross-category).
  if (kind == AttrKind.maker) {
    final sig = _makerSignature(p);
    final seen = <String>{};
    final res = <LipskeyCatalogProduct>[];
    // stage-3.1 — follows the ACTIVE catalog source (v2-aware).
    for (final q in resolvedCatalogProducts) {
      if (q.brand != kPolyrollBrand || _makerSignature(q) != sig) continue;
      final m = _makerOf(q);
      if (m.isEmpty || !seen.add(m)) continue;
      res.add(q);
    }
    return res.length <= 1 ? [p] : res;
  }
  // PPR: every chip is a pickable dimension. Scope = whole brand within the
  // same product type, so the picker offers the real alternatives — material
  // (PPR/PPRCT), line/subtype (פייזר ↔ אספקת מים), size, etc. — even across the
  // separate per-line categories.
  if (p.brand == kPolyrollBrand) {
    final pType = _getCompoundType(p);
    // Size is a within-line dimension: a faser pipe',
  't_2ff5e232': ';
        if (multiSubtypes.contains(two)) {
          if (seen.add(two)) {
            chips.add(_AttrChip(
              word: two,
              kind: AttrKind.subtype,
              product: product,
              onTap: onAttrTap,
              isOpen: openKind == AttrKind.subtype,
            ));
            afterSubtypeIdx = chips.length;
          }
          i += 2;
          continue;
        }
      }

      // ── Multi-word size token — `200 ס"מ` / `300 מ׳` / `40 מ"מ` ─────────
      // Card used to split by whitespace and lose the unit suffix, so the
      // chip read `200` while the finder filter read `200 ס"מ` (P17). Look
      // ahead: if joining `w` with the next word produces a finder size
      // token, emit ONE chip and skip the consumed pair.
      if (i + 1 < words.length) {
        final two = ',
  't_e4ed6eaa': ';
}

/// External-card title. PPR/PPRCT is shown as a chip (not in the title), so for
/// Polyroll we strip it from the תיאור/categoryHe fallback (e.g. "מצמדים PPR" →
/// "מצמדים"). The internal sheet keeps it in the full name.
String _externalTitle(LipskeyCatalogProduct p) {
  if (p.brand == kPolyrollBrand) {
    // Per §21: title = the singular type noun (`ברך`/`מסעף`/…). Drill-down
    // qualifiers live in the chip breadcrumb instead.
    final type = parseChips(p.nameHe).type;
    if (type != null) return type;
  }
  final t = (p.dims?[',
  't_cc339085': ';
}

/// Find sibling products for a given attribute kind.
///
/// Model is top-level (chip 1): any product in the same category with a
/// different model word qualifies — no frame matching needed.
///
/// Color / colorMod / subtype / size are frame-based (chip 2+): the frame
/// (name minus words of [kind]) must match so that only same-type/same-model
/// variants appear in the picker.
/// Manufacturer (יצרן) of a Polyroll product — e.g. Heliroma / Aquatherm.
/// Stored in dims (not the name), so the maker chip is synthetic.
String _makerOf(LipskeyCatalogProduct p) =>
    (p.dims?[',
  't_90df009a': 's cart-driven state).
      _open = false;
      _qty = 1;
      _unit = _Unit.single;
    }
  }

  /// The attribute value(s) of [product] for the given [kind].
  /// color    → base color only (modifier is a separate colorMod chip).
  /// colorMod → modifier word or "רגיל".
  /// others   → longest-match entry from the relevant list.
  String _attrVal(LipskeyCatalogProduct product, AttrKind kind) {
    if (kind == AttrKind.maker) return _makerOf(product);
    if (kind == AttrKind.color) return _baseColor(product);
    if (kind == AttrKind.colorMod) return _colorModifier(product) ?? ',
  't_5ac3c02e': 's fixture instead of
  /// the standard Lipskey sheet — and is labelled "כרטיס חכם".
  final bool smartLens;
  /// Every product in the same canonical-family (collapsed into this row).
  /// When length > 1 the card shows a ↻ button to cycle through them.
  final List<LipskeyCatalogProduct> familySiblings;
  /// Called when the user taps an attribute chip and cycles to a new sibling.
  /// The parent should update its swap state so the displayed product changes.
  final void Function(LipskeyCatalogProduct next)? onCycle;

  @override
  ConsumerState<_ProductRow> createState() => _ProductRowState();
}

enum _Unit { single, pack, pallet }

class _ProductRowState extends ConsumerState<_ProductRow> {
  bool _open = false;
  int _qty = 1;
  _Unit _unit = _Unit.single;
  /// Cached in-cart state — written once per build() frame so _image() can
  /// read the value without calling ref.watch again.
  bool _inCart = false;
  /// Local cycle state for standalone cards (when no onCycle parent callback).
  LipskeyCatalogProduct? _localProduct;
  /// Inline attribute picker state — non-null when picker is open.
  AttrKind? _pickerKind;
  List<LipskeyCatalogProduct>? _pickerSiblings;
  /// PPR hierarchy picker: chip-index in the parsed path that',
  't_6dfcb2df': 's parsed path. Returns siblings that match every chip
  /// to the left and differ at chipIndex.
  void _cycleHierarchy(int chipIndex) {
    final path = parseChips(p.nameHe).path;
    if (chipIndex >= path.length) return;
    // Unified catalog so Huliot/PPR products find their own-brand siblings
    // (kPolyrollCatalog excluded Huliot → dead picker — lesson T4).
    final sibs = findHierarchySiblings(
      p, chipIndex,
      // T6.3: route through the catalog repository (same const `resolvedCatalogProducts`).
      all: ref.read(catalogRepositoryProvider).allProducts(),
      nameOf: (q) => q.nameHe,
      brandOf: (q) => q.brand,
    );
    // Dedupe by value-at-chipIndex (keep first occurrence of each distinct value).
    final byVal = <String, LipskeyCatalogProduct>{};
    for (final q in sibs) {
      final qp = parseChips(q.nameHe).path;
      if (chipIndex >= qp.length) continue;
      byVal.putIfAbsent(qp[chipIndex], () => q);
    }
    if (byVal.length <= 1) return;
    setState(() {
      if (_hPickerIndex == chipIndex) {
        _hPickerIndex = null;
        _hPickerTitle = null;
        _pickerSiblings = null;
        _pickerKind = null;
      } else {
        _pickerKind = null; // close any old kind-picker
        _hPickerIndex = chipIndex;
        _hPickerTitle = _hierarchyPickerTitle(chipIndex, path[chipIndex]);
        _pickerSiblings = byVal.values.toList();
      }
    });
  }

  String _hierarchyPickerTitle(int chipIndex, String currentValue) {
    // §21.C — name the dimension being picked (חיבור / צורה / תכונה / תבריג /
    // מידה) so the user knows whether this is the primary, secondary or final
    // filter. Without this the header read a generic "בחר ערך" and every chip
    // looked the same — "אני לא יודע מה הוא בורר ראשי ומה משני ומה אחרון".
    final label = parseChips(p.nameHe).levelLabelOf(chipIndex);
    return label.isEmpty ? ',
  't_e74abaf4': 's path index.
/// Display-only cleanup for a chip word: strips a wrapping parenthesis so a
/// verbatim catalog finish like "(ציפוי כרום - ללא ידית)" reads as a clean
/// breadcrumb chip. nameHe stays verbatim (R8) and the raw path is unchanged
/// for the faceted-filter matching — this only affects the rendered label.
String _chipDisplayLabel(String word) {
  var w = word.trim();
  if (w.startsWith(',
  't_dca925dc': 't a number-bearing spec fragment (sizes are handled by
/// [isSizeToken]; other digit tokens like "2,4)" / "ו-3" / "L=50" are noise).
bool isLinkableWord(String w) {
  if (w.length < 2) return false;
  if (kSearchStopWords.contains(w)) return false;
  if (isSizeToken(w)) return false; // styled as a size chip instead
  if (RegExp(r',
  't_559467e3': 't have
        // produced it). Guards against accidental merges like `25 שנים`.
        if (twoTokens.length == 1 &&
            twoTokens.first.label.endsWith(words[i + 1])) {
          final label = twoTokens.first.label;
          if (seen.add(label)) {
            chips.add(_AttrChip(
              word: label,
              kind: AttrKind.size,
              product: product,
              onTap: onAttrTap,
              isOpen: openKind == AttrKind.size,
            ));
          }
          i += 2;
          continue;
        }
      }

      // ── Single-word attribute chip ───────────────────────────────────────
      final kind = _attrKindFor(w);
      // Cross-inch like `1/2"×3/8"` (a reducing tee) is one word that yields
      // TWO finder tokens (`½"` + `3/8"`). Mirror that on the card so the
      // user can filter by either dim — emit a chip per token.
      if (kind == AttrKind.size) {
        final tokens = parseSizeTokens(w);
        if (tokens.length > 1) {
          for (final t in tokens) {
            if (seen.add(t.label)) {
              chips.add(_AttrChip(
                word: t.label,
                kind: AttrKind.size,
                product: product,
                onTap: onAttrTap,
                isOpen: openKind == AttrKind.size,
              ));
            }
          }
          i++;
          continue;
        }
      }
      if (!seen.add(w)) {
        i++; // already shown this chip on this card — skip the duplicate
        continue;
      }
      if (kind != null) {
        chips.add(_AttrChip(
          word: w,
          kind: kind,
          product: product,
          onTap: onAttrTap,
          isOpen: openKind == kind,
        ));
        if (kind == AttrKind.subtype) afterSubtypeIdx = chips.length;
      } else if (isLinkableWord(w)) {
        chips.add(GestureDetector(
          onTap: () => LipskeyProductsScreen.openWordSearch(context, w),
          child: Text(w,
              style: const TextStyle(
                  color: Color(0xFF3DD9B0),
                  fontSize: 12,
                  height: 1.3,
                  decoration: TextDecoration.underline,
                  decorationColor: Color(0x552A5E52))),
        ));
      } else {
        chips.add(Text(w,
            style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
                fontSize: 12,
                height: 1.3)));
      }
      i++;
    }

    // Manufacturer chip — synthetic (value from dims, not the name). Slots right
    // after the subtype (פייזר) chip; falls back to the end if there is none.
    final maker = _makerOf(product);
    if (maker.isNotEmpty) {
      final makerChip = _AttrChip(
        word: maker,
        kind: AttrKind.maker,
        product: product,
        onTap: onAttrTap,
        isOpen: openKind == AttrKind.maker,
      );
      if (afterSubtypeIdx != null && afterSubtypeIdx! <= chips.length) {
        chips.insert(afterSubtypeIdx!, makerChip);
      } else {
        chips.add(makerChip);
      }
    }

    // Diameter from dims (e.g. DN110) — informational gray chip. Many fittings
    // (elbows, seals, covers) carry their bore ONLY in dims, never in the name,
    // so without this the finder',
  't_a3154b9f': 't listed more than
    // once (e.g. 3 sibling products that all read "דו כיווני" → one option).
    final byVal = <String, LipskeyCatalogProduct>{};
    for (final s in siblings) {
      final v = _attrVal(s, kind);
      byVal.putIfAbsent(v.isEmpty ? s.sku : v, () => s);
    }
    final unique = byVal.values.toList();
    return _pickerShell(children: [
      _pickerLabel(',
  't_f3babab3': '};
  return noise.contains(word.trim());
}

class _HierarchyChips extends StatelessWidget {
  const _HierarchyChips({required this.product, this.onChipTap, this.openIndex});
  final LipskeyCatalogProduct product;
  final void Function(int chipIndex)? onChipTap;
  final int? openIndex;

  @override
  Widget build(BuildContext context) {
    final chips = parseChips(product.nameHe);
    final rawPath = chips.path;
    // Render with the ORIGINAL index preserved (so a tap maps back to the
    // right faceted-filter level), but skip noise chips (bare unit tokens like
    // מ"מ) and clean wrapping parens for display.
    final shown = <MapEntry<int, String>>[];
    for (var i = 0; i < rawPath.length; i++) {
      if (_isNoiseChip(rawPath[i])) continue;
      shown.add(MapEntry(i, _chipDisplayLabel(rawPath[i])));
    }
    if (shown.isEmpty) return const SizedBox.shrink();
    // Dims-derived DN — only when the breadcrumb carries NO size of its own.
    // Hierarchy products usually expose their size in the name (PPR `20`,
    // חוליות `32`), but covers/risers/grates (e.g. הגבהה/מכסה/רשת) carry their
    // bore ONLY in dims, so without this their card shows no size at all while
    // the finder filters them by DN. Gated on "no path size" so a PPR valve
    // (whose name already states the OD) never gets a second, possibly
    // less-reliable, dims-DN chip. Sourced from tokensFromDims → matches the
    // finder chip verbatim.
    final pathHasSize =
        rawPath.any((seg) => seg.split(RegExp(r',
  't_fbff31ee': 'או',
  't_53e62dfc': 'אין מוצרים להצגה',
  't_3f3fa7fb': 'אישור — \$sel',
  't_65790820': 'באריזה',
  't_4f815ce8': 'בודד',
  't_e4f83baa': 'בחר \$label:',
  't_892a2cd6': 'בחר כמות',
  't_c779bedc': 'בחר סוג:',
  't_f7604203': 'בחר ערך:',
  't_fb0b20dd': 'בחר צבע:',
  't_1a51d0e4': 'בלי',
  't_1feeed4a': 'במשטח',
  't_03755236': 'גימור',
  't_52dcfaef': 'החלף וריאנט',
  't_1666e150': 'הסרה מהסל?',
  't_73ba60bb': 'העתק מק"ט',
  't_35e6b805': 'יח',
  't_5170f234': 'יחידות',
  't_926d8abe': 'כ',
  't_eb3c7d82': 'כרטיס חכם',
  't_865a1629': 'ליפסקי',
  't_1cb27836': 'לסל',
  't_197e67a0': 'מס.',
  't_d3733f13': 'מ”מ',
  't_a92c9fd7': 'נסו לבחור קטגוריה אחרת בקטלוג',
  't_5e9ae20c': 'על',
  't_524e8d60': '));
    }
  }

  /// "שכחתי סיסמה" — send a reset email. The SAME neutral success toast shows
  /// whether or not the email is registered (no account enumeration — a
  /// `user-not-found` is folded into success); only real failures
  /// (invalid-email / network / too-many) surface in Hebrew. Needs an email.
  Future<void> _resetPassword() async {
    if (!_emailAllowed) return; // no passwords ⇒ nothing to reset
    final email = _email.text.trim();
    if (email.isEmpty) {
      showToast(context, ',
  't_d131006b': '));
    }
  }

  /// server-gate-auth — CREATE a REAL Firebase account ("צור חשבון"). Success
  /// lands on the auth stream (the ref.listen below pops the sheet), exactly
  /// like sign-in; the honest errors (`email-already-in-use` / `weak-password`)
  /// are Hebrew-toasted.
  Future<void> _emailCreate() async {
    if (!_emailAllowed) return; // LOCK 2 of 2 — see [_emailLogin]
    final email = _email.text.trim();
    final password = _password.text;
    if (email.isEmpty || password.isEmpty) {
      showToast(context, ',
  't_ca85a3d4': ';
  }
  return null;
}

/// Opens the login sheet (phone-OTP primary, email fallback).
Future<void> showLoginSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: BsTokens.cardLight,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => Padding(
      // Keyboard inset — the fields stay visible while typing.
      padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
      child: const Directionality(
        textDirection: TextDirection.rtl,
        child: LoginSheet(),
      ),
    ),
  );
}

/// Which of the three panes the sheet is showing.
enum _LoginStep { phone, code, email }

class LoginSheet extends ConsumerStatefulWidget {
  const LoginSheet({super.key});

  @override
  ConsumerState<LoginSheet> createState() => _LoginSheetState();
}

class _LoginSheetState extends ConsumerState<LoginSheet> {
  final TextEditingController _phone = TextEditingController();
  final TextEditingController _code = TextEditingController();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();
  // P2 — optional full name captured on the "צור חשבון" path (mirrored to the
  // local profile → users/{uid}.displayName by the welcome flow',
  't_32555b35': 's "כניסה עם אימייל") and CREATE-account (true, the new
  /// "צור חשבון" → `createUserWithEmailPassword`). Ephemeral UI state.
  bool _emailCreateMode = false;
  // #3 — true while a "צור חשבון" is in flight, so the auth-stream listener shows
  // the email-verification notice (a verification mail was sent best-effort by
  // createUserWithEmailPassword) instead of the generic sign-in toast.
  bool _justCreated = false;
  // Latches the one-time success toast+pop in the auth listener, so a later
  // user→null→user transition on the same sheet can',
  't_a1a7e2d6': 's "כניסה עם אימייל") or CREATE a real Firebase account.
        _primaryButton(
          label: _emailCreateMode ? ',
  't_8d120e37': 'או בקוד ל-SMS',
  't_f7882195': 'אימות וכניסה',
  't_15dbea0f': 'אימייל',
  't_50aeb2c9': 'אימייל או סיסמה שגויים',
  't_627971c4': 'אין חיבור לרשת — נסה שוב',
  't_498263f9': 'אין לי חשבון — צור חשבון',
  't_cef4fd4c': 'אם קיים חשבון — נשלח אליו מייל לאיפוס הסיסמה',
  't_6e8b517b': 'אפשר לשלוח קוד חדש בעוד \$remaining שניות',
  't_99280e49': 'האימייל כבר רשום — התחברו במקום',
  't_4820de5b': 'ההתחברות נכשלה — נסה שוב',
  't_09425912': 'הזן אימייל וסיסמה',
  't_828d3547': 'הזן את הקוד בן 6 הספרות שקיבלת ב-SMS',
  't_79ef488b': 'החלפת מספר',
  't_bdc6515f': 'החשבון הושבת — פנה לתמיכה',
  't_f4eaf342': 'הסיסמה חייבת לפחות 6 תווים',
  't_7d8ce61f': 'הסתר סיסמה',
  't_c45028e5': 'הפרטים כבר משויכים לחשבון אחר — התחברו איתם',
  't_7812cee9': 'הצג סיסמה',
  't_5629e391': 'הקוד נשלח אל \$_sentTo · תקף לכ-2 דקות',
  't_b09fc826': 'התחברת בהצלחה ✓',
  't_6429cb15': 'חזרה לכניסה עם טלפון',
  't_61e8974b': 'יותר מדי ניסיונות — נסה שוב מאוחר יותר',
  't_e3c87826': 'יצירת חשבון חדש עם אימייל וסיסמה',
  't_30b89279': 'כבר יש לי חשבון — כניסה',
  't_383546d4': 'כניסה עם אימייל',
  't_f96b80d5': 'כניסה עם אימייל וסיסמה',
  't_2d361111': 'כתובת האימייל אינה תקינה',
  't_bd6c5ee9': 'מטעמי אבטחה נדרשת התחברות מחדש — התחבר ונסה שוב',
  't_3b4a84ad': 'מספר הטלפון אינו תקין',
  't_a5fbe384': 'נשלח לך קוד אימות חד-פעמי ב-SMS',
  't_f3ab448a': 'קוד אימות נשלח ב-SMS 📱',
  't_4bd7593a': 'קוד בן 6 ספרות',
  't_4d3532c7': 'קוד האימות שגוי — נסה שוב',
  't_a6bca703': 'קוד חדש נשלח ב-SMS 📱',
  't_8ffa2a05': 'שירות ההתחברות אינו זמין כרגע',
  't_cc3c3a9d': 'שכחתי סיסמה',
  't_2395f835': 'שלח קוד אימות',
  't_429f875d': 'שליחת קוד חדש',
  't_392618b7': 'שם מלא (לא חובה)',
  't_5b88e8c4': 'תוקף הקוד פג — שלח קוד חדש',
  't_7a07a6b9': '✓ החשבון נוצר — שלחנו מייל אימות לכתובת, אַשרו אותו',
  't_e34214a9': '✓ מצב אינטרנט מסונן פעיל — כניסה במייל וסיסמה',
  't_61e87426': '🔐 התחברות לחשבון',
  't_c4ca7ba9': 's AI analyst).
//
// The owner types (or taps a suggestion / "תדריך-בוקר") → we fold the LIVE engine
// state (`managerAnalyticsProvider`/`managerCustomersProvider`/`ordersEngineProvider`)
// into a GROUNDED snapshot (`buildManagerContext`) and hand it to Claude with a
// "reason over truth, never invent" system prompt. Every number Claude sees is the
// real business data; it only PHRASES the answer. Gated on a live gateway
// (`claudeGatewayProvider`) — OFF → an honest "requires connection" state.
//
// Manager-only intelligence/oversight surface → governance-clean (no HR), additive,
// zero-regression. Reached from the 📊 cockpit hero-card + the AppBar.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_3f025f50': 'או שאל:',
  't_5956a03b': 'אני קורא את ההזמנות, הלקוחות והאשראי החיים שלך ועונה מהמספרים האמיתיים.',
  't_0e98f3b0': 'לא הצלחתי לנסח תשובה — נסה לשאול אחרת.',
  't_16d85afd': 'שאל אותי כל דבר על העסק שלך.',
  't_dce2fbda': 'שאל את העסק שלך…',
  't_6defaed2': 'תדריך-בוקר',
  't_85822be6': '☀️ תדריך-בוקר',
  't_2f79f6ac': '💡 הקו-פיילוט החכם דורש חיבור לשרת.',
  't_0184e762': '🤖 קו-פיילוט',
  't_a54e705b': ' : buf.toString();
}

// ───────────────────────────────────────────────────────────────────────────
//  👥 לקוחות — the live customer list + credit (M4)
// ───────────────────────────────────────────────────────────────────────────

/// The Hebrew status label per customer status — VERBATIM from the legacy
/// `renderMgrCustomers` (@index.html:16592:
/// `c.status===',
  't_3257e5fa': ' : key);

  /// cluster #85ח — decide a vacation request. Writes the SHARED
  /// [vacationRequestsProvider] (the requester',
  't_9e18ce73': ' for an order-derived-only row,
  /// where the phone→uid resolve stays the path (byte-identical to #8/3c).
  final String directUid;

  @override
  ConsumerState<_CustomerChatButton> createState() =>
      _CustomerChatButtonState();
}

class _CustomerChatButtonState extends ConsumerState<_CustomerChatButton> {
  /// In-flight guard: true while [UsersLookup.uidByPhone] resolves. Disables the
  /// button (shows a spinner) so a rapid double-tap can never kick a 2nd resolve.
  bool _busy = false;

  Future<void> _open(String phone) async {
    if (_busy) return; // double-tap guard (belt-and-suspenders with onPressed)
    final managerUid = ref.read(currentUidProvider);
    if (managerUid == null || managerUid.isEmpty) {
      // No signed-in manager (should not happen on the live board) — honest bail,
      // never a create-or-get with a missing half.
      showToast(context, "יש להתחבר כדי לפתוח צ',
  't_fe094201': ' when order-derived-
  /// only / backend OFF. Drives the ממתין/פעיל row badge; NEVER a permission
  /// decision (the `approveUsers` callable authorizes server-side).
  final String accountStatus;

  /// #reg-approval — the directory role for this row ([BsRole]), or null for an
  /// order-derived / CRM-only row (and ANY row when the backend is OFF — the
  /// directory is empty then). Drives the row',
  't_7ce86733': '\${b.productCount} מוצרים',
  't_0b13867e': '\${c.orderCount} הזמנות · \${view.sites} אתרים',
  't_4ff55d66': '\${e.value} מוצרים',
  't_ad07fe62': '\${order.items} פריטים · ₪\${_grouped(order.sum)}',
  't_ce286d1c': '(התקבלה→בהכנה→מוכן→נאסף→בדרך→נמסר). עקיפת-מנהל ',
  't_768ae0fa': '(חשבון + כל הנתונים)? הפעולה בלתי-הפיכה.',
  't_8e85bd28': '),
            child: _RegressionBody(
              onOpen:
                  () =>
                      Navigator.of(context).push(RegressionPanelScreen.route()),
            ),
          ),
          const SizedBox(height: BsTokens.space3),
        ],

        // 7. 🔌 הקמת המערכת (Pillar-2 + giant-system V5) — the UNIFIED
        // manager-only setup entry. One place, two phases: FIRST build the
        // trade (categories/products/rules), THEN configure the org
        // (vertical/modules/terms/screens) — "קודם מקימים מערכת ואז מגדירים
        // אותה". A collection-`if` on the COMPILE-CONST [kOrgConfigFlag] (ships
        // OFF — `--dart-define=ORG_CONFIG=true` arms it), so every define-less
        // build drops the entry at compile time and the ניהול tab stays
        // byte-identical (out of the pinned manager tests',
  't_5e1790b3': '),
            label: const Text("צ',
  't_2634cd74': '),
          badge: pendingVacations,
          child: _VacationsBody(
            requests: vacations,
            onApprove: (r) => _decideVacation(r, approve: true),
            onReject: (r) => _decideVacation(r, approve: false),
          ),
        ),
        const SizedBox(height: BsTokens.space3),

        // 1. 🗂️ קטגוריות — the LIVE category list.
        _ManageSection(
          sectionKey: ',
  't_88653921': '),
          child: _CategoriesBody(entries: catEntries),
        ),
        const SizedBox(height: BsTokens.space3),

        // 2. ⚙️ הגדרות אפליקציה — the verbatim config rows.
        _ManageSection(
          sectionKey: ',
  't_6db356d8': '),
          child: _ProductTreeBody(
            categoryCount: cats.length,
            productCount: totalProducts,
          ),
        ),
        const SizedBox(height: BsTokens.space3),

        // 4. 🏷️ מותגים ומחירים — the brands list.
        _ManageSection(
          sectionKey: ',
  't_f9fb7ebd': '),
          child: const _AppSettingsBody(),
        ),
        const SizedBox(height: BsTokens.space3),

        // 3. 🌳 עץ המוצרים — an inline summary of the catalog tree.
        _ManageSection(
          sectionKey: ',
  't_db6537e0': '),
          child: const _BrandsBody(),
        ),
        const SizedBox(height: BsTokens.space3),

        // 5. 🔬 בדיקות רגרסיה — DEV-ONLY internal tooling (#6). Gated to debug
        // builds so the test_harness runner never reaches an end user who selects
        // the manager persona in a shipped release (mirrors BackendDebugBadge',
  't_5f426ad6': ',
                          style: const TextStyle(
                            color: BsTokens.mutedLight,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          if (open)
            Padding(
              // Directional (start/top/end/bottom) so RTL/LTR both lay out
              // correctly (gate 62 — no hard-coded left/right edge inset).
              padding: const EdgeInsetsDirectional.fromSTEB(
                BsTokens.space4,
                0,
                BsTokens.space4,
                BsTokens.space4,
              ),
              child: child,
            ),
        ],
      ),
    );
  }
}

/// A small `brand`-fill count badge for a section header (the 👷 אישורי עובדים
/// pending count). White number on `brand`; LIGHT-safe.
class _CountBadge extends StatelessWidget {
  const _CountBadge({required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: ',
  't_f236672a': ',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: bsOnAccent(context),
            fontSize: 12,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}

/// The 👷 אישורי עובדים body — the manager',
  't_676d35cb': ',
      button: onTap != null,
      child: onTap == null
          ? card
          : Material(
              type: MaterialType.transparency,
              borderRadius: BorderRadius.circular(radius),
              child: InkWell(
                onTap: onTap,
                borderRadius: BorderRadius.circular(radius),
                child: card,
              ),
            ),
    );
  }
}

/// The order-pipeline section (@index.html:12177-12198) — a WHITE card listing
/// every [kManagerOrderFlow] stage with its LIVE count and a proportional bar.
/// Labels are the short pipeline forms the legacy `md-pipe` uses (התקבלה ·
/// בהכנה · מוכן · בדרך · נמסר), plus נאסף for the pickup stage — all six stages.
class _OrderPipeline extends ConsumerWidget {
  const _OrderPipeline({required this.byStage});

  final Map<String, int> byStage;

  /// The short Hebrew pipeline label per stage. Verbatim from the legacy
  /// `md-pipe` stages array (@index.html:12181-12187: new=התקבלה · preparing=
  /// בהכנה · ready=מוכן · transit=בדרך · delivered=נמסר); pickup=נאסף (the
  /// 6th stage the dashboard pipeline omits but the flow carries, @index.html:
  /// 12044 `ORDER_STAGE.pickup.label`).
  static const Map<String, String> _stageLabel = {
    ',
  't_4ecca6cd': ',
      button: onTap != null,
      child: onTap == null
          ? row
          : Material(
              type: MaterialType.transparency,
              child: InkWell(onTap: onTap, child: row),
            ),
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
//  🚚 הזמנות — the live order control center (M3)
// ───────────────────────────────────────────────────────────────────────────

/// The full stage label per [kManagerOrderFlow] stage — VERBATIM from the legacy
/// `ORDER_STAGE` map (@index.html:12041-12048). These are the strings the legacy
/// status-filter chips, the order-row pill, and the detail sheet all render
/// (`ORDER_STAGE[st].label`). Distinct from the SHORT pipeline labels the 📊
/// dashboard uses (התקבלה/בהכנה/מוכן/…) so the two tabs never collide.
const Map<String, String> _kOrderStageLabel = {
  ',
  't_bcd2a0f4': ',
};

/// #reg-approval — the account-lifecycle badge shown on a customer row and echoed
/// in the pending checklist: ⏳ ממתין (amber) for a `pending` account, ✓ פעיל
/// (green) for an `active` one. LIGHT tokens; only mounted on the LIVE path
/// (directory-sourced status), so the card is byte-identical when the backend is
/// off.
class _ApprovalBadge extends StatelessWidget {
  const _ApprovalBadge({required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    final pending = status == kDirectoryStatusPending;
    final active = status == kDirectoryStatusActive;
    final label = pending
        ? ',
  't_1a81b1e8': ', תקוע',
  't_65f99aeb': ': Color(0xFF8B8D8F),
};

/// The 🚚 הזמנות tab body — the manager',
  't_a9b5bdd3': ';

/// 👔 מרכז השליטה — the manager-of-the-system role app (the "מנהל המערכת"
/// persona). Same full-role-app shell/style as the worker app
/// (`worker_app_screen.dart`): a LIGHT [Scaffold] (`bgLight`), a WHITE AppBar
/// (`cardLight`) with dark text, and a top segmented toggle that drives an
/// [IndexedStack] (the `updates_screen.dart` pattern).
///
/// All four tabs are live and complete: 📊 לוח בקרה (M2 — the live cockpit),
/// 🚚 הזמנות (M3 — the live order list + god-mode stage-advance), 👥 לקוחות
/// (M4 — live customer list with credit tracking), and 🛠️ ניהול (M5 — the
/// management accordion). Reached
/// from the role picker ("מי אתה?" → מנהל המערכת), which `Navigator.push`es this
/// route instead of opening the old BS-dial drill.
class ManagerDashboardScreen extends ConsumerWidget {
  const ManagerDashboardScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const ManagerDashboardScreen());

  static final List<KbToolNode> _kbNodes = kbManagerDashboardNodes();

  /// Number of top tabs (📊 לוח בקרה · 🚚 הזמנות · 👥 לקוחות · 🛠️ ניהול) —
  /// DERIVED from [_kManagerTabs].length so the toggle, the help tuples and the
  /// [IndexedStack] children can NEVER drift out of lockstep: all four carry the
  /// SAME one `if (kIntelLive)`-gated 5th element (step 98). const-false
  /// `kIntelLive` ⇒ 4 (byte-identical demo); INTEL_LIVE on ⇒ 5, all four together.
  /// Giant-system V2: this stays the COMPILE-floor count — the runtime `intel`
  /// org gate is ANDed at the lockstep CONSUMERS (toggle · IndexedStack ·
  /// journey), so an INTEL_LIVE build with `intel` off RENDERS 4 while the
  /// const lists (and this ceiling) keep 5.
  static int get tabCount => _kManagerTabs.length;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // task #65 · חוק: מבחוץ לא רואים כלום — without a manager [BoardSession]
    // ONLY the gate (the registration screen in role mode) is built; a
    // successful login flips [boardAuthProvider] and this build swaps to the
    // real board in place. logout() swaps it back to the gate.
    if (ref.watch(boardAuthProvider)?.role != BoardRole.manager) {
      return WelcomeScreen(boardRole: BoardRole.manager);
    }
    // Giant-system V2 — the runtime `intel` org gate ANDed onto the step-98
    // compile floor: pure [moduleOn] over the live org config, watched ONCE
    // here in build(). const-false `kIntelLive` (every normal/test build)
    // short-circuits both lines below back to the plain watch — byte-identical
    // demo by construction. Index safety (the updates_screen clamp precedent):
    // in an INTEL_LIVE build with `intel` off, a stale managerTabProvider=4
    // must not point the IndexedStack past its last child — clamp to לוח בקרה
    // (0). The intel tab is the LAST index, so tabs 0–3 never renumber.
    final intelTabOn =
        kIntelLive && moduleOn(ref.watch(orgConfigProvider), ',
  't_10605c17': ';
// #85ב/#23 — the SHARED proof-photo renderer (one renderer for both sides
// of the approval: the worker sheet and this dashboard).
import ',
  't_3f2d8d05': '])
          if ((counts[st] ?? 0) > 0)
            chip(st, _chipLabel[st] ?? st, counts[st] ?? 0),
      ],
    );
  }
}

/// #reg-approval — the account-status filter chip row for the user-management hub:
/// הכל / ממתינים / פעילים / לקוחות בלבד, filtering the merged customer list by the
/// directory `accountStatus` (ממתינים→pending · פעילים→active) or by `uid==',
  't_9d070726': '`
/// (לקוחות בלבד = a CRM/order-derived row with NO app account). Display-only
/// filter; the active chip is a `brand` fill, the rest light outlines — the SAME
/// style as [_CustomerStatusChips]. The tab mounts this ONLY when the list carries
/// a directory-sourced row, so it is ABSENT on the OFF/demo path ⇒ byte-identical.
class _AccountFilterChips extends StatelessWidget {
  const _AccountFilterChips({required this.active, required this.onSelect});

  final String active;
  final ValueChanged<String> onSelect;

  /// The chip key→label per account filter, verbatim (no counts — a light row).
  static const List<MapEntry<String, String>> _options = [
    MapEntry(',
  't_8fd7282f': 's
          // standalone [ChatsScreen] (its own "שיחות" AppBar + back→pop) — back
          // returns to THIS manager dashboard; no route to home_shell, the role
          // picker, or any other persona',
  't_b01c0223': 's
  //    order + content exactly in that case (byte-identical when off).
  for (final c in customers) {
    if (takenNames.contains(c.name.trim())) continue;
    // #reg-approval launch-clean — on the LIVE backend, DROP an order-derived
    // buyer with NO contact (empty phone). These are the bundled demo-seed
    // customers (משה אברהם … — kOrdersEngineSeed) surfacing through the born-seed
    // when the real `orders` collection is empty (firestore_cached_repo
    // `_onSnapshot` keeps the seed on an UNSCOPED empty first snapshot) — they are
    // NOT real accounts, and deleting from the DB can',
  't_02465b57': 's
  /// request only (F-26) — additionally posts it into the existing
  /// worker↔manager chat thread (`th-worker-manager`, sys_chat — the worker
  /// sees it in שיחות → מנהל) plus a manager-side toast. A courier',
  't_57bec21f': 's "ניהול מסכים" editor (ManagedScreen
/// ',
  't_270f6fb3': 's "ניצול אשראי %" summary stops aggregating the
/// fabricated seed ceiling. OFF (demo/tests): each `computeCredit` returns
/// `contractorCredit(name) == c.creditLimit`, so the sum is byte-identical to the
/// old `Σ c.creditLimit`; ON it sums the server-canonical ceilings. The summary
/// falls back to the seed sum while this resolves, so the number never flickers.
final fleetCreditProvider = FutureProvider<int>((ref) async {
  final customers = ref.watch(managerCustomersProvider);
  var total = 0;
  for (final c in customers) {
    final r = await ref.watch(customerCreditProvider(c.name).future);
    total += r.creditLimit;
  }
  return total;
});

/// The 👥 לקוחות tab body — the manager',
  't_121c01b2': 's ACTION row on the customer-detail sheet, mounted
/// ONLY for a real app-user (a directory-sourced row: `view.uid.isNotEmpty`). Three
/// affordances, all through EXISTING server seams — NO client-side authorization:
///   • ✓ אשר (a `pending` account) / ⏸️ השהה (an `active` one) →
///     [userApproverProvider]([uid], approve:), the SAME callable the top-of-tab
///     pending panel uses (mirrors `_PendingApprovalPanel._approve`);
///   • 🔑 שנה תפקיד → [showManagerRoleAssignSheet] focused on this uid/name.
///   • 🗑️ מחק → [userDeleterProvider]([uid]), a full-system account+data delete
///     behind a destructive confirm; the SERVER authorizes + owner-guards (the
///     manager',
  't_9562d6ad': 's PROOF PHOTO (#85ב), the
/// note, and the ✅ אשר / ↩️ דחה buttons.
/// The buttons are keyed `approve-<id>` / `reject-<id>` so the W3 test can tap a
/// specific task',
  't_10c24e20': 's analytics. Sorted by
    // count desc so the biggest categories read first (a stable display order).
    final cats = ref.watch(
      managerAnalyticsProvider.select((a) => a.catalogCategories),
    );
    final catEntries =
        cats.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final totalProducts = cats.values.fold<int>(0, (s, n) => s + n);

    // The LIVE worker-approval queue — tasks the worker submitted (status
    // `review`), read off the SHARED worker-tasks engine. A worker "שלח לאישור"
    // surfaces here with no refresh; approving/rejecting writes back live.
    final pending = ref.watch(pendingApprovalTasksProvider);

    // cluster #85ח — the LIVE vacation-request queue (bs.vacation-requests.v1):
    // requests the worker filed from the worker board',
  't_33df0c0c': 's board role, F-27) + the reason, and (while pending) the
/// ✅ אשר / ❌ דחה buttons; a decided row carries a read-only status pill
/// ([_StagePill]) instead.
class _VacationRequestRow extends StatelessWidget {
  const _VacationRequestRow({
    required this.request,
    this.onApprove,
    this.onReject,
  });

  final VacationRequest request;
  final VoidCallback? onApprove;
  final VoidCallback? onReject;

  @override
  Widget build(BuildContext context) {
    final pending = request.status == kVacationPending;
    return Container(
      padding: const EdgeInsets.all(BsTokens.space3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFEDEDED)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  // F-27: 🛵 for a courier',
  't_648a93da': 's god-mode stage-advance.
                // 👥 לקוחות (M4) — the live customer list + credit. 🛠️ ניהול
                // (M5) — the 5 management tools (the FINAL tab).
                const _DashboardTab(),
                const _OrdersTab(),
                const _CustomersTab(),
                const _ManageTab(),
                // Step 98 — the 5th tab (📡 מודיעין לקוחות) is COMPILE-GATED behind
                // `kIntelLive` (const-false in every normal/test build ⇒ tree-shaken
                // out, so the shipped dashboard is byte-identical with 4 tabs). In
                // LOCKSTEP with `_kManagerTabs` / `_kManagerTabHelp` / `tabCount` —
                // all four share this one `if (kIntelLive)`. Giant-system V2 —
                // `intelTabOn` ANDs the runtime `intel` org gate in (the IndexedStack
                // keeps children ALIVE, so a dark tab must not even mount).
                if (kIntelLive && intelTabOn) const IntelTab(),
              ],
            ),
          ),
        ],
      ),
    );
    return Directionality(
      textDirection: TextDirection.rtl,
      child: kKbGlobal ? KbScreen(tools: _kbNodes, child: scaffold) : scaffold,
    );
  }
}

/// A small green "חי" status pill in the AppBar — signals the dashboard is on
/// the LIVE shared data (the orders engine), mirroring the role drawer',
  't_de2ce2ae': 's headline gateway into "שאל את העסק שלך".
/// A brand-gradient card at the very top of 📊 לוח בקרה → pushes the co-pilot.
class _CopilotHero extends ConsumerWidget {
  const _CopilotHero();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final live = ref.watch(claudeGatewayProvider) != null;
    return Semantics(
      button: true,
      label: ',
  't_abb27eec': 's muted empty line — the honest "no key / no activity"
/// state (never a fabricated row, never a name-join fallback).
class _JourneyEmpty extends StatelessWidget {
  const _JourneyEmpty({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
      );
}

// ───────────────────────────────────────────────────────────────────────────
//  🛠️ ניהול — the 5 management tools (M5, the FINAL tab → screen COMPLETE)
// ───────────────────────────────────────────────────────────────────────────

/// The 🛠️ ניהול tab body — the manager',
  't_b0b0b998': 's name
/// (קבלן / מנהל / חנות / שליח / עובד, from [_kBsRoleLabel]). A brand-tinted pill
/// in the SAME light style as [_ApprovalBadge]; an absent/bot role (',
  't_5808f569': 's name (and role, when known) + the ⏳ ממתין tag. LIGHT tokens.
class _PendingRow extends StatelessWidget {
  const _PendingRow({
    required this.entry,
    required this.checked,
    required this.enabled,
    required this.onChanged,
  });

  final DirectoryEntry entry;
  final bool checked;
  final bool enabled;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final roleLabel = _kBsRoleLabel[entry.role] ?? ',
  't_77e1c60d': 's note, and two actions:
/// ✅ אשר (review → done, ✅ אושר) and ↩️ דחה (review → rejected, back to the
/// worker). Both write the SHARED unified [tasksProvider], so the worker',
  't_9b31758b': 's order list stays
/// live while the sheet is open (orders placed while open appear immediately
/// without reopening the sheet).
class _CustomerDetailSheet extends ConsumerWidget {
  const _CustomerDetailSheet({required this.view});

  final _CustomerView view;

  /// The detail-sheet status TAG — the longer legacy forms (@index.html:16616:
  /// `low`→⚠️ ניצול אשראי גבוה · `off`→לא פעיל · else 🟢 קבלן פעיל).
  static const Map<String, String> _tagLabel = {
    ',
  't_73aba425': 's outer edges. Directional (start/end) so RTL/LTR both lay out
          // correctly (gate 62 — no hard-coded edge inset).
          padding: EdgeInsetsDirectional.only(
            start: i == 0 ? 0 : BsTokens.space2 / 2,
            end: i == count - 1 ? 0 : BsTokens.space2 / 2,
          ),
          // #31 — each tab wrapped in its OWN HelpTarget (orange ring + bubble
          // out of the tab); the four pills are built in this one seg() loop so
          // the per-index help text comes from [_kManagerTabHelp].
          child: HelpTarget(
            title: _kManagerTabHelp[i].\$1,
            body: _kManagerTabHelp[i].\$2,
            child: Material(
              color: on ? BsTokens.brand : Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(BsTokens.radiusPill),
              child: InkWell(
                borderRadius: BorderRadius.circular(BsTokens.radiusPill),
                onTap: () => ref.read(managerTabProvider.notifier).state = i,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    vertical: 10,
                    horizontal: 6,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(emoji, style: const TextStyle(fontSize: 15)),
                      const SizedBox(width: 5),
                      Flexible(
                        child: Text(
                          label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: on ? bsOnAccent(context) : BsTokens.inkLight,
                            fontSize: 13.5,
                            fontWeight: on ? FontWeight.w800 : FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    }

    return Container(
      color: Theme.of(context).colorScheme.surface,
      // Directional (start/top/end/bottom) so RTL/LTR both lay out correctly
      // (gate 62 — no hard-coded edge inset).
      padding: const EdgeInsetsDirectional.fromSTEB(
        BsTokens.space3,
        BsTokens.space2,
        BsTokens.space3,
        BsTokens.space3,
      ),
      child: Row(
        children: [
          for (var i = 0; i < count; i++)
            seg(i, _kManagerTabs[i].emoji, _kManagerTabs[i].label),
        ],
      ),
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
//  📊 לוח בקרה — the dashboard cockpit (M2)
// ───────────────────────────────────────────────────────────────────────────

/// The 📊 לוח בקרה tab body — a LIGHT scrollable cockpit over the LIVE shared
/// orders engine. A faithful port of the legacy `renderMgrDashboard`
/// (@index.html:12133) trimmed to this wave',
  't_7fa55f59': 's registration-approval panel at the TOP.
        // GATED on the LIVE backend + the manager persona (the same
        // BoardRole.manager gate the whole screen is built under, line ~142) so it
        // is NEVER shown to a non-manager and is ABSENT from the tree when the
        // backend is OFF ⇒ the tab is byte-identical off (the whole Firebase-free
        // test suite + demo). The panel self-hides when nobody is pending.
        if (useFirebaseBackend &&
            ref.watch(boardAuthProvider)?.role == BoardRole.manager)
          const _PendingApprovalPanel(),
        _CustomerSummary(
          contractors: views.length,
          totalUsed: totalUsed,
          fleetPct: fleetPct,
        ),
        const SizedBox(height: BsTokens.space4),
        _CustomerStatusChips(
          active: effectiveFilter,
          allCount: views.length,
          counts: counts,
          onSelect: (st) => setState(() => _filter = st),
        ),
        const SizedBox(height: BsTokens.space4),
        // #reg-approval — the account-status filter row (הכל / ממתינים / פעילים /
        // לקוחות בלבד). Absent unless the merged list carries a directory-sourced
        // row (see `hasDirectory`), so the OFF/demo tab is byte-identical.
        if (hasDirectory) ...[
          _AccountFilterChips(
            active: effectiveAccountFilter,
            onSelect: (k) => setState(() => _accountFilter = k),
          ),
          const SizedBox(height: BsTokens.space4),
        ],
        // GIANT Phase-2 wave-3d — CSV bulk-import, behind the same opt-in
        // `manager.customers` gate as the saved-customer block it feeds;
        // absent by default ⇒ the tab is byte-identical.
        if (featEnabled(ref, ',
  't_56536286': 's registration-approval panel, at the TOP of the
/// 👥 לקוחות tab. New users are born `pending` (checkout-blocked) and appear here
/// as a default-CHECKED checklist; the owner approves them in bulk. Three
/// affordances, all one server call (`approveUsers` via [userApproverProvider]):
///   • "אשר הכל"      — approve EVERY pending user (ignores the tick-state);
///   • "אשר מסומנים"  — approve only the ticked (the "manual" path AND the
///                       "approve all-except-X": untick X, then press this).
/// On success the directory stream flips the approved rows active, so they drop
/// out of the pending list here with no reload. Hidden entirely when nobody is
/// pending. Only ever mounted behind `useFirebaseBackend` + the manager persona
/// (see the tab',
  't_c10b043a': 's stage has emptied out (e.g. its last order was
    // advanced away), fall back to `הכל` so the user is never stranded on a chip
    // that no longer renders (the legacy chip simply vanishes; this keeps the
    // list visible rather than wedged on a missing filter).
    final effectiveFilter =
        _filter == ',
  't_c1de0155': 's status has emptied out, fall back to הכל so the
    // user is never stranded on a chip that no longer renders.
    final effectiveFilter =
        _filter == ',
  't_49c3c5a4': 's טפסים screen, decided here LIVE on the
        // shared [vacationRequestsProvider]; the worker',
  't_a351df91': 's 🚚 tile +
/// pipeline + counts LIVE (proven in `manager_dashboard_screen_test`).
///
/// Sections (top→bottom): a 3-stat summary (הזמנות / פתוחות / מחזור), a stage
/// filter chip row (`הכל` + one chip per non-empty stage, verbatim labels +
/// counts), and the filtered order list. LIGHT only — white `cardLight` rows on
/// `bgLight`, `inkLight`/`mutedLight` text, `brand` accents.
class _OrdersTab extends ConsumerStatefulWidget {
  const _OrdersTab();

  @override
  ConsumerState<_OrdersTab> createState() => _OrdersTabState();
}

class _OrdersTabState extends ConsumerState<_OrdersTab> {
  /// The active stage filter — `',
  't_bfbf1512': 't mutate at runtime);
///   • the order pipeline (@index.html:12177-12198) — a per-stage count across
///     the 6 [kManagerOrderFlow] stages, read straight off [ordersEngineProvider].
///
/// Reading the providers (not the static `managerAnalytics` const) is what keeps
/// the LIVE figures — 🚚 open-orders + the pipeline — reflowing whenever any role
/// mutates the engine.
/// 📊 לוח בקרה — the manager cockpit',
  't_a18c147d': 'אט");
    }
  }

  @override
  Widget build(BuildContext context) {
    // The effective phone: the order-derived aggregate phone, else the saved-CRM
    // record',
  't_c2680c4e': 'אין בקשות חופשה.',
  't_906d3a77': 'אין מזהה לקוח לשיוך — המסע יופיע כשייווצר מזהה יציב.',
  't_79356d08': 'אין פעילות מתועדת ללקוח זה עדיין.',
  't_0258bbcd': 'אין פרטי לקוח שמורים עדיין',
  't_07c02e01': 'אישור משתמשים חדשים (\${pending.length})',
  't_38d20df0': 'אישורי עובדים',
  't_56b7fec0': 'אשר בקשת חופשה',
  't_37d37289': 'אשר הכל (\${pendingUids.length})',
  't_d99fa09e': 'אשר מסומנים (\${selected.length})',
  't_8036d02d': 'אשר משימה',
  't_db61daa5': 'אשראי',
  't_6861e760': 'אשראי גבוה',
  't_e8e79700': 'אשראי: לא רשומה',
  't_5dcd4cb2': 'אתרי בנייה',
  't_261383a6': 'בדיקות רגרסיה',
  't_74d4c6f3': 'בדרך לאתר',
  't_6202d302': 'בחר את מי לאשר (ברירת-מחדל: הכל).',
  't_1ebc3a6b': 'בנייה ורשימת ההזמנות שלו. תצוגה בלבד.',
  't_b1dfe036': 'בנייה ידנית עובדת תמיד · העורך החכם דורש חיבור לשרת',
  't_435f0ced': 'בניית ענף חדש והגדרת החברה — הכל במקום אחד',
  't_b7ff8304': 'בסיכון',
  't_0b63acaf': 'בקשות חופשה',
  't_8cfce684': 'בקשות חופשה שעובדים ושליחים הגישו',
  't_f3374ea4': 'דוחה את בקשת החופשה ומעדכן את המבקש בהתראה. הסטטוס ',
  't_abde2778': 'דוחה משימה שנשלחה לאישור ומחזיר אותה לעובד עם סיבת ',
  't_b28247e0': 'דחה בקשת חופשה',
  't_a946bcce': 'דחה משימה',
  't_f22ffc12': 'דחייה. הסיבה והסטטוס מתעדכנים מיד בלוח העובד.',
  't_b2d42a7f': 'האישור נכשל — נסה שוב',
  't_d7ded603': 'הבקשות שלו ושולח התראה. הסטטוס מתעדכן מיד אצל המבקש.',
  't_c3903ac4': 'הגדרות אפליקציה',
  't_798280f9': 'הגדרות אפליקציה, עץ מוצרים, מותגים ושיוך תפקידים.',
  't_43475320': 'הגדרות אפליקציה, עץ מוצרים, מותגים, בדיקות רגרסיה ושיוך ',
  't_8feebfa3': 'הגדרות הקטלוג',
  't_dca6f811': 'ההזמנה כבר הושלמה',
  't_0e60d5ae': 'ההזמנות של \${c.name}',
  't_6b02512a': 'הוסף פרטי לקוח',
  't_5da5f49d': 'הזמנה \${o.id} → \${_kOrderStageLabel[live.stage] ?? live.stage}',
  't_09d08106': 'הזמנות חיה, ומעבר להגדרות ולהחלפת תפקיד מוגנת בקוד.',
  't_1d09081b': 'הזמנות פתוחות',
  't_e639e843': 'המחיקה נכשלה — נסה שוב',
  't_fa3928ab': 'המעדכנת מיד את כל הלוחות. הזמנה שנמסרה אינה ניתנת ',
  't_1eeab5b2': 'המע״מ קבוע לפי חוק (\$_vatPercent%). תוספת האקספרס והאשראי נראים מיד בעגלת הקבלן.',
  't_a478798c': 'המשתמש נמחק',
  't_bf3fda9f': 'הסבר אשראי',
  't_92b0d682': 'הערות',
  't_5aec1412': 'הפרמטרים שכל הקבלנים רואים.',
  't_028c8149': 'הצ׳אט מול עובדים, קבלנים, חנויות ושליחים. נפתח כמסך עצמאי ',
  't_c1b2fe6d': 'הקמת המערכת',
  't_7e03b38e': 'הרצת חבילת בדיקות הרגרסיה המלאה (קטלוג · מאתר · מנוע תאימות · state · ',
  't_a5f83878': 'הרצת חבילת הבדיקות המלאה של האפליקציה',
  't_a4e6c384': 'וחוזר אחורה ללוח; אינו מתנתק ואינו מחליף תפקיד.',
  't_7aa80a7b': 'וצינור ההזמנות לפי שלב.',
  't_d7228b02': 'זמינים כעת',
  't_5d2540f2': 'חי',
  't_39fa0f23': 'חיפוש \${orgTerm(ref, ',
  't_3fad11c7': 'חל על כל המקטעים: אישורי עובדים, בקשות חופשה, קטגוריות, ',
  't_2fc83bcd': 'חנויות פעילות',
  't_e18e2cb4': 'יתרה זמינה',
  't_89211227': 'כל מוצר נושא עץ אביזרים משלימים (חובה / אופציונלי).',
  't_4571388d': 'כמו ׳קדם שלב׳ ברשימה; השלב מתעדכן בכל הלוחות.',
  't_1537c9a0': 'לא בוצע אישור',
  't_ca20c5d8': 'לא בוצעה פעולה',
  't_409fc2bb': 'לא נמצאו הזמנות תואמות.',
  't_fdf9e644': 'לא נמצאו קבלנים תואמים.',
  't_70ca56b8': 'לא פעיל',
  't_2f10ee27': 'לכל קבלן.',
  't_50cb970c': 'למחוק לצמיתות את \${widget.view.customer.name} מכל המערכות ',
  't_5efdeff3': 'לקוח מוביל',
  't_44dbe741': 'לקוח מזדמן',
  't_aada8c32': 'לקוח קבוע',
  't_6c4fafb3': 'לקוחות בלבד',
  't_9ed521d9': 'לקידום.',
  't_810cccd3': 'מאשר בקשת חופשה שעובד/שליח הגיש: מעדכן את רשימת ',
  't_69cfd317': 'מאשר משימה שעובד שלח לאישור: המשימה עוברת ל׳בוצע׳, מזכה ',
  't_a72df80f': 'מה בוער? מי הלקוח הכי שווה? — אני עונה מהנתונים החיים',
  't_f3d329fd': 'מודיעין-עסקי AI · דורש חיבור לשרת',
  't_49129286': 'מוכן לאיסוף',
  't_81b7744c': 'מוצרים בעץ',
  't_ac33b28b': 'מוצרים בקטלוג',
  't_04e906b0': 'מותגים (\${kBrands.length})',
  't_023edf16': 'מותגים ומחירים',
  't_342f3358': 'מחזור',
  't_c1b135fc': 'מחיקת משתמש',
  't_fcd1b259': 'מטבעות ושולחת התראת ✅ לעובד. כתיבה למנוע המשותף — ',
  't_81f4d41a': 'מייל',
  't_fa311e7d': 'ממתינים',
  't_968d489b': 'מנוהל בלוח-הקבלן',
  't_0d77ad87': 'מנותק',
  't_98fe68cf': 'מסגרת אשראי',
  't_9e01d961': 'מסגרת אשראי לקבלן',
  't_ff2bf9b5': 'מסנן את רשימת ההזמנות לשלב שנבחר; ׳הכל׳ מציג את כולן. רק שלבים ',
  't_1f64abed': 'מסנן את רשימת הקבלנים לפי סטטוס אשראי (פעיל / אשראי גבוה); ',
  't_9d56d602': 'מציג את לוח הבקרה החי: אריחי מדדים (הזמנות פתוחות, מוצרים, חנויות) ',
  't_816e1023': 'מציג את רשימת הקבלנים-הלקוחות החיה: ניצול אשראי, מספר אתרים והזמנות ',
  't_e6a7a216': 'מציג מודיעין לקוחות חי: משפך המרה, פלחי לקוחות, שימור ומי מחובר כעת — ',
  't_9d01c709': 'מקדם את ההזמנה לשלב הבא בצינור ',
  't_add18a68': 'מקדם את ההזמנה לשלב הבא ישירות מתוך גיליון הפרטים. אותה עקיפת-מנהל ',
  't_41013fe6': 'מקופל מהמכשיר, קריאה בלבד למנהל.',
  't_b3c93ee1': 'מקטע ניהול',
  't_df577bcd': 'מרכז השליטה',
  't_8eb1e7b7': 'משימות שעובדים שלחו לאישור',
  't_dd92b344': 'משתמשים חדשים נולדים כ״ממתינים״ ואינם יכולים לקנות עד לאישור. ',
  't_4ded2876': 'מתעדכן מיד אצל העובד/שליח.',
  't_0e7a850b': 'ניהול קטגוריות הקטלוג',
  't_7f1fd06d': 'ניווט) על המכשיר.',
  't_04ab15f9': 'ניסיוני',
  't_b95f758b': 'ניצול אשראי',
  't_5a513822': 'ניצול אשראי \$pct%',
  't_1af25980': 'ניצול אשראי: ₪\${_grouped(c.totalSpend)} / ₪\${_grouped(liveLimit)} (\$pct%)',
  't_8620c011': 'נראית מיד בלוח העובד.',
  't_985b2b65': 'סטודיו — ערוך את האפליקציה',
  't_7bea2d25': 'סינון לפי שלב',
  't_445d8aa3': 'סינון קבלנים',
  't_3aacf498': 'סך רכש',
  't_8d3e9824': 'עץ המוצרים',
  't_001cbc6e': 'ערוך פרטי לקוח',
  't_a2bc2620': 'עריכת האביזרים המשלימים של כל מוצר',
  't_0846b791': 'עריכת האביזרים המשלימים של כל מוצר — בחירת מוצר חושפת את עץ האביזרים שלו.',
  't_778c8252': 'עריכת המותגים והמחירים של כל מוצר',
  't_b3b6347d': 'פותח את גיליון פרטי ההזמנה: מעקב 6 שלבים, פריטים/סכום, ',
  't_8a2b6904': 'פותח את גיליון פרטי הקבלן: מסגרת אשראי, נוצל, יתרה זמינה, אתרי ',
  't_72586155': 'פותח את האזור האישי של מנהל המערכת: פרטי החשבון, סטטיסטיקת ',
  't_64070de0': 'פותח את הגדרות הקטלוג והאפליקציה — שליטת No-Code על ',
  't_36507848': 'פותח את מרכז בדיקות הרגרסיה (כלי פיתוח). קיים רק בבילד debug.',
  't_7a29f866': 'פותח את מרכז הניהול (No-Code): אישורי משימות, בקשות חופשה, קטגוריות, ',
  't_79067bd6': 'פותח את מרכז השיחות של מנהל המערכת — קריאה ומענה לשרשורי ',
  't_78a3d85d': 'פותח את מרכז ניהול ההזמנות החי — רשימת ההזמנות, סינון לפי שלב וקידום ',
  't_ba30f98a': 'פותח/סוגר מקטע ניהול באקורדיון (מקטע אחד פתוח בכל רגע). ',
  't_91181c78': 'פעיל',
  't_05a6238c': 'פרטי הזמנה',
  't_424156ba': 'פרטי לקוח',
  't_1a7cb95d': 'פרטי קבלן',
  't_1eaed7a2': 'פרמטרים שהקבלן רואה',
  't_bc86cd9d': 'פתוחות',
  't_5cec0050': 'צינור ההזמנות',
  't_703ed2d2': 'קבלן/אתר/סטטוס ופעולת קידום שלב.',
  't_69a03f0c': 'קבלנים',
  't_f1b3ec91': 'קדם ל"\${_kOrderStageLabel[next] ?? next}"',
  't_43bca105': 'קדם לשלב הבא',
  't_7c36b63d': 'קדם שלב להזמנה',
  't_7d850976': 'קדם שלב ›',
  't_a42cbf5a': 'קטגוריות פעילות (\${entries.length})',
  't_c148180d': 'רדום',
  't_224f99ca': 'שינוי שם קטגוריה מעדכן את כל המוצרים שבה.',
  't_dbcabb5f': 'שיעור מע״מ',
  't_25538895': 'שיש בהם הזמנות מופיעים. סינון תצוגה בלבד — אינו משנה דאטה.',
  't_42662332': 'שלב',
  't_e8af6398': 'שלב (עקיפת-מנהל).',
  't_b35881d5': 'תאר בעברית מה לשנות — או בנה ידנית · אני עורך את הנתונים',
  't_59035333': 'תגיות (מופרדות בפסיק)',
  't_5dfc950b': 'תוספת משלוח אקספרס',
  't_9e1e7f37': 'תפקידים.',
  't_40b963d7': '׳הכל׳ מציג את כולם. סינון תצוגה בלבד.',
  't_d21a9b02': '↩️ דחה',
  't_109c830c': '⏳ ממתין',
  't_f8e62ffb': '⏸️ הושהה',
  't_d28bc29a': '⏸️ השהה',
  't_a0180ec6': '⚠️ אשראי גבוה',
  't_3f613c42': '⚠️ ניצול אשראי גבוה',
  't_d4a0903d': '✓ אושר',
  't_349d02b6': '✓ אושרו \$n משתמשים',
  't_b83c48eb': '✓ אשר',
  't_a3134fee': '✓ ההזמנה הושלמה ונמסרה',
  't_6dbc413f': '✓ פעיל',
  't_36d6a53b': '❌ בקשת החופשה שלך (\${r.range}) נדחתה',
  't_9b78ce15': '⬆️ ייבוא לקוחות מ-CSV',
  't_ee11d203': '🎉 אין משימות הממתינות לאישור.',
  't_3e3b0af3': '👷 \${pending.length} אישורי-עובדים ממתינים אצל הקבלנים · פיקוח בלבד',
  't_fe40ca47': '💵 הפק קבלה',
  't_8efc0826': '📦 תעודת משלוח',
  't_cd096225': '🔑 שנה תפקיד',
  't_5e3e1ebc': '🔔 דורש טיפול',
  't_a04b5e6f': '🔬 פתח מרכז בדיקות רגרסיה',
  't_331d2b47': '🗑️ מחק',
  't_45912fbe': '🛠️ שליטה מלאה על אפליקציית הקבלן — כל שינוי מתעדכן מיידית.',
  't_804a073a': '🟢 קבלן פעיל',
  't_c82b13e8': '🦺 \${kWorkers[(task.worker >= 0 && task.worker < kWorkers.length) ? task.worker : 0]} · 🕒 \${task.days} ימים · \${task.steps} שלבים',
  't_8b36a86e': '🧭 מסע הלקוח',
  't_fa0e1d4d': '🧾 הפק חשבונית',
  't_7a429a08': ';

/// מסך עצמאי (נדחף מאייקון הפרופיל ב-AppBar של מרכז השליטה).
class ManagerProfileScreen extends StatelessWidget {
  const ManagerProfileScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const ManagerProfileScreen());

  static final List<KbToolNode> _kbNodes = kbManagerProfileNodes();

  @override
  Widget build(BuildContext context) {
    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          title: CfgText(
            ',
  't_97830567': '@\${session.username} · מנהל המערכת',
  't_aa7d1dd0': 'אזור אישי — מנהל המערכת',
  't_b6d09cd5': 'הזמנות — סטטיסטיקה',
  't_e197c833': 'הכנסות היום (פעילות): \${fMoney(revenue)}',
  't_0d8a8b1e': 'מצב הדגמה',
  't_7e037b27': 'פעילות 📋',
  't_96b6e2e2': 'צפייה בכל לוח — מצב מנהל',
  't_32f70b5a': ',
                style: TextStyle(
                  color: selected ? bsOnAccent(context) : BsTokens.inkLight,
                  fontSize: 13.5,
                  fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// The full-width שייך תפקיד action — a `brand` pill (disabled grey when the
/// form is incomplete / there is no backend), a spinner while busy. Keyed
/// `role-assign-submit` for tests.
class _AssignButton extends StatelessWidget {
  const _AssignButton({
    required this.enabled,
    required this.busy,
    required this.onPressed,
  });

  final bool enabled;
  final bool busy;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: enabled ? BsTokens.brand : const Color(0xFFE2E2E2),
      borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      child: InkWell(
        key: const ValueKey(',
  't_fd79459a': 's Functions project — see
//      functions/src/index.ts). Without it ([authGatewayProvider] is null —
//      the SAME `useFirebaseBackend` gate the repos use), the sheet does NOT
//      pretend: the action is DISABLED and a clear Hebrew banner explains the
//      assignment is owner/backend-gated. If the seam is somehow reached
//      anyway, its `unavailable` throw is caught and surfaced — never a
//      "success" toast.
//   2. SELF-CONTAINED. All logic lives here; the manager ניהול tab mounts it
//      with a single button (manager_dashboard_screen.dart), so the parallel
//      edit to that screen has the smallest possible conflict surface.
//   3. ADDITIVE. Nothing here changes an existing flow; it only EXPOSES the
//      already-shipped assignRole + UsersLookup seams behind a manager gesture.
//
// The verification is server-side: `setRole` checks the CALLER',
  't_314c216f': 's PHONE (looked
/// up to a uid via [usersLookupProvider]) — or pastes a uid directly — picks a
/// [RoleOption], and taps שייך תפקיד, which forwards `{uid, role}` through the
/// existing `assignRole` seam ([authStateProvider]',
  't_8c4fa0cd': 'אתר משתמש לפי טלפון (או הדבק מזהה uid) ובחר תפקיד להקצאה.',
  't_94c218ee': 'הזן מספר טלפון או מזהה משתמש (uid).',
  't_3c41f957': 'טלפון המשתמש',
  't_b354b2fc': 'לא בוצע שיוך.',
  't_0dd45f62': 'לא נמצא משתמש עם הטלפון \$phone.',
  't_55aa0347': 'מזהה משתמש (uid) — אופציונלי',
  't_c4e5f89c': 'שיוך התפקיד נכשל (\${e.code}). נסה שוב מאוחר יותר.',
  't_886b7da2': 'שיוך התפקיד נכשל. נסה שוב מאוחר יותר. (\$e)',
  't_df8dcc3a': 'שיוך תפקיד למשתמש',
  't_4397ba00': 'שיוך תפקידים זמין רק עם חיבור לשרת (מופעל ע״י בעל המערכת). ',
  't_4a337968': 'שייך תפקיד',
  't_89bb0cba': '✅ התפקיד "\$label" שויך למשתמש \$uid.',
  't_4ae6363e': '));
                },
              ),
          ],
        ),
      ),
    );
  }
}

/// Wraps an impersonated board with an honest "צפייה כ…" banner + one-tap return;
/// popping the route (banner button or system back) restores the manager session
/// via [BoardAuthNotifier.returnFromImpersonation] (only when [impersonated]).
class _ImpersonationFrame extends ConsumerWidget {
  const _ImpersonationFrame({
    required this.label,
    required this.impersonated,
    required this.child,
  });

  final String label;
  final bool impersonated;
  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PopScope(
      onPopInvokedWithResult: (didPop, _) {
        if (didPop && impersonated) {
          ref.read(boardAuthProvider.notifier).returnFromImpersonation();
        }
      },
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          body: SafeArea(
            bottom: false,
            child: Column(
              children: [
                Material(
                  color: BsTokens.brandDark,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    child: Row(
                      children: [
                        const Text(',
  't_7312be5f': 's "מעבר בין מסכים" sheet — a grid of the four other surfaces.
void showManagerScreensSheet(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: Theme.of(context).colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (_) => const _ManagerScreensSheet(),
  );
}

class _ManagerScreensSheet extends ConsumerWidget {
  const _ManagerScreensSheet();

  void _open(BuildContext context, WidgetRef ref, _Dest d) {
    Navigator.pop(context); // close the sheet first
    final role = d.role;
    if (role != null) {
      ref.read(boardAuthProvider.notifier).impersonate(role);
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => _ImpersonationFrame(
          label: d.label,
          impersonated: role != null,
          child: d.build(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            CfgText(
              ',
  't_1587c2c7': 's seed account
// ([BoardAuthNotifier.impersonate]) — the board renders as a real seed user
// behind a visible "צופה כ…" banner with one-tap return ([_ImpersonationFrame]);
// the contractor tile opens the main app (HomeShell), which is not board-gated.
// No role-switch code: the manager IS the admin (recommendation-fleet approach
// (b) — scoped session-swap, NOT a per-board gate override).

import ',
  't_379ef772': 'העלאת מוצר (ספק)',
  't_a44b587c': 'חזרה לניהול',
  't_d615b204': 'צפייה בכל לוח של המערכת — חזרה לניהול בכל רגע.',
  't_c4511a95': 'צפייה כ\$label · מצב מנהל',
  't_ef964c7b': ' + מונה ',
  't_3e90990c': ' / 4ש',
  't_f265ced5': ' ה',
  't_fa865723': ')
        // מושתק דרך notifUnreadCountProvider.
        _SwitchRow(
          label: ',
  't_2b3ce106': ') במקום
        // מתג ששומר ערך בלי שום השפעה.
        _SwitchRow(
          label: ',
  't_b497a24f': ',
          value: settings.pushEnabled,
          onChanged:
              (v) => ref
                  .read(notifSettingsProvider.notifier)
                  .update((s) => s.copyWith(pushEnabled: v)),
        ),
        // ערוצים התלויים בשרת — מושבתים ביושר (',
  't_0039a73b': '15 דקות',
  't_7c8d8e97': ';

/// Full-screen Notification settings — 9 categories, ~40 leaves.
/// Most leaves are persisted via [notifSettingsProvider];
/// OS-level quick actions show "בבנייה" toast on tap.
class NotifSettingsScreen extends ConsumerWidget {
  const NotifSettingsScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const NotifSettingsScreen());

  /// STABLE [KbScreen] tool list — built once so the floating-keyboard mirror
  /// never re-registers on rebuild. Tree-shaken with the [KbScreen] path off-flag.
  static final List<KbToolNode> _kbNodes = kbNotifSettingsNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // KbScreen: while this pushed route is front-most under [kKbGlobal], the
    // floating ▦ grid mirrors THIS screen',
  't_2252960e': 'LED (אנדרואיד)',
  't_97554594': 's persisted toggles have no engine yet — show an
  // honest "בבנייה" subtitle and suppress the active-count badge (Wave 8 / D2).
  final bool underConstruction;

  // A row is a backend-blocked "under construction" placeholder when it is a
  // _PlaceholderRow, a server-only channel, or an _Inert row flagged
  // underConstruction. Single source of truth for the count badge AND the
  // Apple-readiness hide-filter.
  static bool _isUnderConstruction(Widget w) =>
      w is _PlaceholderRow ||
      (w is _SwitchRow && w.requiresServer) ||
      (w is _Inert && (w as _Inert).underConstruction);

  // Count only functional rows — exclude "בבנייה" placeholders and rows
  // that require a server connection (honestly disabled in this build).
  int get _activeCount =>
      children.where((w) => !_isUnderConstruction(w)).length;

  // For Apple review (kHideUnderConstruction) we render only the functional
  // rows; the placeholder rows stay defined in code (reversible) but are hidden.
  List<Widget> get _visibleChildren =>
      kHideUnderConstruction
          ? children.where((w) => !_isUnderConstruction(w)).toList()
          : children;

  @override
  Widget build(BuildContext context) {
    // A whole section that is itself "under construction" — or one whose every
    // row is a hidden placeholder — disappears entirely for Apple review.
    if (kHideUnderConstruction &&
        (underConstruction || _visibleChildren.isEmpty)) {
      return const SizedBox.shrink();
    }
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      color: Theme.of(context).colorScheme.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16),
          childrenPadding: const EdgeInsets.only(bottom: 8),
          iconColor: Colors.black54,
          collapsedIconColor: Colors.black54,
          leading: Text(emoji, style: const TextStyle(fontSize: 22)),
          // Count badge replaces the default expand chevron.
          trailing:
              (underConstruction || _activeCount == 0)
                  ? null
                  : Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: BsTokens.brand,
                      borderRadius: BorderRadius.circular(11),
                    ),
                    child: Text(
                      ',
  't_6dc4f845': 'אישור ביומטרי לפתיחה',
  't_720b8559': 'אישור בלי פתיחת אפליקציה',
  't_e50aa1b4': 'אל תעבר לשעון/רכב',
  't_5fbce8e1': 'בחר משך זמן',
  't_edc6289e': 'דוח בוקר',
  't_80d2e461': 'דורש חיבור שרת',
  't_c1a37302': 'דורש חיבור שרת — לא זמין בגרסה זו',
  't_dc2880ac': 'דחייה מהירה',
  't_ebddb806': 'הסתר לחלוטין',
  't_11959dc5': 'הפעל שעות שקט',
  't_8f085973': 'הצג תוכן מלא',
  't_c0f1b971': 'הצעות ספקים',
  't_d369802d': 'השתקה בוטלה',
  't_74981227': 'התראות הושתקו',
  't_7d93d015': 'התראות מושתקות עד \$untilLabel',
  't_5732ac0c': 'חסימת שולח',
  't_e0379762': 'חשובות בלבד',
  't_30cb3057': 'חשיבות וסינון',
  't_d72a83c2': 'יום שלם',
  't_9793f8d0': 'ימי שבת/חג',
  't_e56c06e3': 'כל הגדרות ההתראות יוחזרו לברירת המחדל.',
  't_35de4aae': 'כפתורי תגובה בהתראה',
  't_23218581': 'לחץ לביטול',
  't_293e605e': 'לפי תפקיד',
  't_23a16d8f': 'מסתיים בשעה',
  't_ec0249f9': 'מצב נהיגה',
  't_e37446d0': 'מתחיל בשעה',
  't_45227a9f': 'סוגי התראות',
  't_92a622d3': 'סיכום חודשי',
  't_6de4ddeb': 'סיכום יומי',
  't_240c664f': 'סיכום ערב',
  't_aa5839e6': 'סיכום שבועי (ראשון)',
  't_cc222a2e': 'סיכומים תקופתיים',
  't_e84f8daf': 'עדכוני פרויקטים',
  't_26b104b4': 'ערוצי קבלה',
  't_7204aa67': 'פעולות מהירות',
  't_7ab9ee50': 'פרטיות במסך נעול',
  't_1b36a7d9': 'צליל מופעל',
  't_c129e3b2': 'צלילים שונים לפי סוג',
  't_424feedd': 'קריטיות בלבד',
  't_7975b9c1': 'רמת חשיבות',
  't_a94467ac': 'רק שם השולח',
  't_8dabcda5': 'שיחות חדשות',
  't_326c8cab': 'שעה',
  't_66634221': 'שעות שקט (DND)',
  't_3a81f0df': 'שעת דוח בוקר',
  't_bb8de5db': 'שעת סיכום ערב',
  't_c34c94be': 'שעת שליחה',
  't_6315906a': 'תוך פגישות',
  't_31b85777': 'תצוגה במסך נעול',
  't_46804af5': 'תשובה ישירה',
  't_575f434c': '🏪 חנות — הזמנות + מלאי',
  't_b8edd6f0': '👔 מנהל המערכת — דשבורד',
  't_6926d8d9': '👷 קבלן — התראות פרויקט',
  't_c1caef29': '🔇 השתק התראות',
  't_e2e3b52f': '🔇 השתק התראות זמנית',
  't_a17d52e5': '🛵 שליח — pickup + active',
  't_17efd56e': '🦺 עובד — משימות',
  't_3a211413': ' כבוי → חיווי ההתראות החדשות בתוך
  // האפליקציה (בדג',
  't_48f5830d': '\$unread חדשות',
  't_af547076': ');
final notifExpandedGroupsProvider = StateProvider<Set<String>>((_) => {});

// Derived provider — used by home_shell badge.
final notifUnreadCountProvider = Provider<int>((ref) {
  // ערוץ ',
  't_f9f7afc8': '120 נקודות נוספו למועדון',
  't_cbc0bef3': 's per-type toggles in settings.
/// (orders/shipments/deals/price-drops → orders/shipments/deals/budget).
Set<NotifSection> notifMutedSections(NotifSettings ns) => <NotifSection>{
      if (!ns.typeOrders) NotifSection.orders,
      if (!ns.typeShipments) NotifSection.shipments,
      if (!ns.typeDeals) NotifSection.deals,
      if (!ns.typePriceDrops) NotifSection.budget,
    };

/// Consecutive same-type runs of this length (or more) collapse behind "הצג עוד".
const int kNotifCollapseRunMin = 3;
bool shouldCollapseNotifRun(int runLength) => runLength >= kNotifCollapseRunMin;

/// Pure row-visibility predicate (regression-tested in test/gaps_test.dart).
bool notifPasses({
  required NotifSection type,
  required String title,
  required String preview,
  required bool dismissed,
  required NotifSection section,
  required String query,
  required Set<NotifSection> muted,
}) {
  if (dismissed) return false;
  if (muted.contains(type)) return false;
  if (section != NotifSection.all && type != section) return false;
  if (query.isNotEmpty) {
    final q = query.toLowerCase();
    if (!title.toLowerCase().contains(q) && !preview.toLowerCase().contains(q)) {
      return false;
    }
  }
  return true;
}

/// Importance filter: "all" keeps everything; otherwise only high-priority rows.
bool passesImportance(NotifImportance filter, bool highPriority) =>
    filter == NotifImportance.all || highPriority;

List<_Notif> _filtered({
  required NotifSection section,
  required Set<String> dismissedIds,
  required String query,
  required Set<NotifSection> mutedTypes,
  required NotifImportance importance,
}) =>
    _activeNotifs
        .where((n) =>
            passesImportance(importance, n.highPriority) &&
            notifPasses(
              type: n.type,
              title: n.title,
              preview: n.preview,
              dismissed: dismissedIds.contains(n.id),
              section: section,
              query: query,
              muted: mutedTypes,
            ))
        .toList();

// Inserts date-group headers and collapses consecutive same-type groups of ≥3.
/// A date header is inserted whenever the group changes from the previous row.
bool isNewDateGroup(String? current, String next) => next != current;

List<Object> _withHeadersAndCollapse(
  List<_Notif> notifs,
  Set<String> expandedKeys,
) {
  final result = <Object>[];
  String? currentDateGroup;
  var i = 0;
  while (i < notifs.length) {
    final n = notifs[i];
    if (isNewDateGroup(currentDateGroup, n.dateGroup)) {
      currentDateGroup = n.dateGroup;
      result.add(currentDateGroup);
    }
    final groupKey = ',
  't_f49b5a47': 'אושרה ונמצאת בהכנה',
  't_55c08c25': 'אין התראות',
  't_51efa742': 'אשר איסוף',
  't_954b818c': 'אשר תדריך',
  't_b79684b8': 'ברזל 12mm · ₪4.20 → ₪3.85',
  't_4d2a2a0d': 'דרגת סיכון עודכנה לאדום — קומה 3',
  't_4153884e': 'ההתראה תימחק לצמיתות.',
  't_45c3afb8': 'ההתראות שנקראו יוסרו מהרשימה לצמיתות.',
  't_827ff54e': 'הזמנה #1198',
  't_ef60e736': 'הזמנה #1234',
  't_1578e27e': 'הצג עוד \${showMore.hiddenCount} ↓',
  't_6c37d6b3': 'התדריך אושר',
  't_83cee196': 'התראה נמחקה',
  't_4bc258cb': 'התראות מושתקות',
  't_46b63448': 'התראות תקציב מופעלות אוטומטית בעת חציית הספים:',
  't_f9dd4caf': 'התראת בטיחות',
  't_fcb1c91d': 'התראת תקציב',
  't_c769edbd': 'חבילה ממתינה לאיסוף בחנות',
  't_03bea7e9': 'חדשות',
  't_dd666001': 'טפל כעת',
  't_927ffa1d': 'יגיע עד מחר 14:00',
  't_4dc749c2': 'כשיהיו עדכונים — הם יופיעו כאן',
  't_e3db1894': 'לפני 3 שעות',
  't_40230d04': 'לפני שעתיים',
  't_60c301d3': 'מבצע שבועי',
  't_555e09b2': 'מוכנה לאיסוף — צור קשר עם הספק',
  't_6c66afbf': 'מוקדם יותר',
  't_a59dd6cd': 'מושתק בשעות השקט',
  't_3dd08b0c': 'מושתק עד \$untilLabel',
  't_8a7d1df7': 'מחיקת התראה?',
  't_591dc834': 'מסלול עודכן — עצור בשוק עכו',
  't_bffb503f': 'משלוח #892',
  't_e7c37d15': 'משלוח #893',
  't_2d7139b2': 'משלוח #894',
  't_36409610': 'ניקוי התראות שנקראו?',
  't_a5368d00': 'נקה נקראו',
  't_b32088a8': 'סמן כנקרא',
  't_8299b36e': 'עדכון מחיר',
  't_2d53c4b8': 'עוקב ✓',
  't_07328923': 'עקוב',
  't_c13ae85a': 'פרויקט A חרג ב-12% מהתקציב',
  't_2da01063': 'ציוד חשמל -15% עד יום ראשון',
  't_3a43ef5e': 'שעות שקט פעילות',
  't_bfd4ae9c': 'תגמול נצבר',
  't_774ab5a3': 's last line opens only on
      // `welcomeSeen`, and that flag is hand-flipped on the REGISTRATION path
      // (`welcome_screen._finishAfterAuth`) — the login path never set it. So a
      // fresh visitor (welcomeSeen absent ⇒ false) could verify an SMS code
      // successfully and still land back on "רישום ראשוני". Anyone already
      // authenticated has, by definition, finished the opening flow.
      if (auth.user?.isRealUser ?? false) return const HomeShell();
      // NOT a real person — an anonymous catalog guest, or nobody at all.
      //
      // The owner',
  't_47771ef9': 's step-1 back still lands on welcome.
      1 => kProfileRawShell ? const OnboardingScreen() : const ProfessionScreen(),
      _ => const OnboardingScreen(),
    };
    // The whole opening flow lives on ONE route (the steps are provider
    // state, not pushed routes), so an unguarded system/browser back would
    // pop the only route and throw the user out of the app mid-registration.
    // Intercept it: past the first step, back walks one step back
    // (slides → profession → welcome); only on the welcome step does back
    // actually leave. Side routes (ComingSoonScreen, the replayable tour)
    // are their own routes and pop normally, untouched by this guard.
    return PopScope<Object?>(
      canPop: step == 0,
      onPopInvokedWithResult: (didPop, _) {
        if (didPop) return;
        ref.read(startupStepProvider.notifier).state = step - 1;
      },
      child: child,
    );
  }
}

/// Opens the intro slides as a replayable tour — e.g. from the 💡 button in
/// the home app-bar. Unlike the first-run flow, finishing just closes the
/// route (it does NOT touch [welcomeSeenProvider]).
Future<void> showIntroTour(BuildContext context) {
  return Navigator.of(context).push<void>(
    MaterialPageRoute<void>(
      fullscreenDialog: true,
      builder: (_) => const OnboardingScreen(isTour: true),
    ),
  );
}

/// First-run welcome flow: swipeable slides + skip / next / get-started.
/// In the first-run flow (`isTour: false`) completing/skipping flips
/// [welcomeSeenProvider] (→ home) and persists it. As a replayable tour
/// (`isTour: true`) it simply pops the route.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key, this.isTour = false});

  /// Replayable tour (pop on finish) vs the first-run flow (flip the gate).
  final bool isTour;

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _controller = PageController();
  int _page = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _finish() {
    // As a replayable tour, finishing just closes the route.
    if (widget.isTour) {
      Navigator.of(context).pop();
      return;
    }
    // First-run flow: flip the gate synchronously (instant → home), persist in
    // the background.
    ref.read(welcomeSeenProvider.notifier).state = true;
    unawaited(persistWelcomeSeen());
    // Rewind the opening step so a later sign-out re-opens the flow at the
    // welcome/login screen (step 0), not the leftover slides (step 2) — which
    // would loop "בואו נתחיל". Harmless on a fresh first run (already 0).
    ref.read(startupStepProvider.notifier).state = 0;
  }

  void _next() {
    if (_page >= kOnboardingSlides.length - 1) {
      _finish();
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _page == kOnboardingSlides.length - 1;
    final showHelp = !widget.isTour;
    final helpMode = showHelp && ref.watch(helpModeProvider);
    return Scaffold(
      backgroundColor: BsTokens.bgLight,
      body: Column(
        children: [
          if (helpMode) const HelpModeBanner(),
          Expanded(
            child: SafeArea(
              child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(BsTokens.space3),
              child: Row(
                children: [
                  HelpTarget(
                    title: ',
  't_ef5731e6': 'בואו נתחיל',
  't_270d03bf': 'בנה רשימת-חומרים עם "תכנון חיבור", הוסף לסל בכמות הנכונה, ',
  't_22fb54d3': 'ברוכים הבאים ל-\${AppBrand.name}',
  't_e458a3cc': 'גודל, זווית וצבע. הכל בעברית פשוטה.',
  't_a76dbf2f': 'הבא / בואו נתחיל',
  't_6a648d7a': 'הקטלוג החכם לאינסטלציה ובנייה — אלפי מוצרים, מותגים ',
  't_05c04b2c': 'התחל מהמחלקות או חפש לפי שם, מק"ט או קטגוריה — וצמצם לפי ',
  't_0462bdfe': 'וחיבורים, במקום אחד.',
  't_8448be32': 'ושלח הזמנה — בלי לפספס אביזר.',
  't_983a1444': 'טוענים את קטלוג החברה ומתחילים לעבוד.',
  't_92995bb8': 'מדלג על שקופיות ההיכרות ועובר ישר לאפליקציה.',
  't_21180439': 'מסיים את ההיכרות ופותח את האפליקציה.',
  't_ddf92138': 'מצא כל מוצר בקלות',
  't_1afcd69c': 'עובר לשקופית הבאה; בשקופית האחרונה ("בואו נתחיל") ',
  't_ce397f03': 'קטלוג, חיפוש חכם, סל והזמנות — הכול במקום אחד. ',
  't_f1bd3ef9': 'תכנן, אסוף, והזמן',
  't_c65e4fb3': ';

/// 🔔 התראות הזמנות ומשלוחים — the ORDER/shipment notification toggles, surfaced
/// IN the orders world (store_screen · 📦 הזמנות) per owner decision #52. Reads &
/// writes the SAME [notifSettingsProvider] the settings screen uses — this is a
/// RELOCATION of two controls (typeOrders + typeShipments), not a second store
/// of state; every other notification setting stays in הגדרות › התראות.
class OrderNotifSheet extends ConsumerWidget {
  const OrderNotifSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = ref.watch(notifSettingsProvider);
    final n = ref.read(notifSettingsProvider.notifier);
    return Directionality(
      textDirection: TextDirection.rtl,
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 2),
              child: CfgText(
                ',
  't_d7bcf455': 'אישור · בהכנה · מוכן · שינוי סטטוס',
  't_eb188ea7': 'יצא לדרך · בדרך אליך · נמסר',
  't_4bcd4de5': 'עדכוני הזמנות',
  't_ff05f76f': 'שאר ההתראות נשארו בהגדרות › התראות',
  't_4ca8c645': '🔔 התראות הזמנות ומשלוחים',
  't_2c3eaf01': '} דגל ORG_CONFIG (חמוש)',
  't_da162dc2': '} דגל ORG_CONFIG_LIVE',
  't_0a5a5dda': 'מחובר כ: \$email',
  't_11825e4c': '— בדיקת-שרת דולגה (אין Firebase) —',
  't_a4908a1e': '⚠️ מנוי-חי כבוי — לא תקבל שינויי-אחרים חי (build ללא ORG_CONFIG_LIVE)',
  't_77e84780': '✅ Firebase מאותחל',
  't_31a6322e': '✅ בעלים — מורשה לפרסם',
  't_f7a48ce2': '✅ הכתיבה הגיעה לשרת ואומתה — פעיל אצל כולם עכשיו',
  't_6807b63b': '✅ מנוי-חי פעיל — תקבל שינויים מאחרים חי',
  't_b6a1065c': '✅ פרסום מופעל — "שמור" יפרסם לשרת',
  't_e79c35e8': '❌ Firebase לא מאותחל בכלל',
  't_829d0ff8': '❌ הכתיבה לא נמצאה בשרת — נדחתה בשקט (בדוק בעלים/הרשאות)',
  't_7ba8f8c8': '❌ כתיבה/קריאה מהשרת נכשלה: \$e',
  't_b2132b21': '❌ לא בעלים — השרת ידחה את הכתיבה',
  't_682e76e9': '❌ לא מחובר (אין email) — התחבר עם גוגל',
  't_8ee632ad': '❌ פרסום כבוי — ORG_CONFIG לא חמוש',
  't_161eb1c4': ' איננו כאן
/// (ה-app-הבסיסי, בלי שער) ⇒ סקציית-תצוגה בלבד.
final Set<String> _kGatedKeys = kOrgModules.map((m) => m.key).toSet();

/// מונחים-שזורים פר-מודול (slice-3): מפתח-מודול → [(מפתח-מונח · תווית · ברירת-מחדל)].
/// רק מונחי-רישום-V3 המחווטים בפועל (`termOf`) — הצגה-חיה "→ תצוגה" בכל סקציה.
/// עריכה נשארת במקטע "מיתוג ומונחים" (מקור-אמת אחד ל-OrgConfig.terms).
const Map<String, List<(String, String, String)>> _kModuleTerms = {
  ',
  't_2cd2467f': ' נעול (onChanged null — הקונפיג עצמו עדיין יודע false
  /// מייבוא-JSON חיצוני, ה-UI רק מגן). [countSuffix] = "N/M פעילים".
  Widget _moduleTile(OrgModuleInfo m, String countSuffix) {
    final locked = kWizardLockedModules.contains(m.key);
    final sub = [
      m.descHe,
      if (locked) ',
  't_d820d7a8': ' נעול — נעילה-עצמית אסורה מה-UI) · 6 מונחי רישום-V3.
// "שמור והפעל" = קודם ה-provider (חי בכל האפליקציה, אפס-ריסטארט) ורק אז
// persist — כישלון-אחסון מדווח ביושר ("פעיל עכשיו — אך לא ישרוד ריסטארט").
// ייצוא/ייבוא JSON רוכבים על seam ה-file-transfer (web-first; IO מדווח
// ביושר), והייבוא **אטומי**: קובץ פסול לא נוגע בטיוטה כלל.
//
// הטיוטה היא המלך: המסך קורא את orgConfigProvider **פעם-אחת** ב-initState ולא
// watch — האשף הוא ה-WRITER של ה-provider, ו-watch היה נלחם בטיוטה (כל שמירה
// דורסת עריכה-בעיצומה). שורת-הסטטוס (_note) היא Text-inline בכוונה — לא
// toast: נבדקת-בטסט ונשארת על המסך.
//
// חוקי-בית: Text רגיל בלבד (לא CfgText — האשף עורך את מילון-המונחים עצמו,
// וסריקת gate-118 נשארת נקייה) · מפות קנוניות-מינימליות (מודול-דלוק לא נשמר
// כ-true, מונח-ריק לא נשמר כלל) · אפס-חבילות-חדשות. ויזואלית: ה-idiom הבהיר
// של בונה-הענפים (bgLight · cardLight · RTL מפורש · clamp-טקסט 1.35×).
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_997b40fd': ' → false, הצגה = **הסרת** המפתח (absent=on ⇒ קונפיג
  /// כולו-מוצג נשאר ריק, byte-identical). ליבה (kImmutable) לעולם לא מגיעה
  /// לכאן — ה-UI מרנדר אותה נעולה (onChanged null).
  void _setElementHidden(String id, {required bool hidden}) {
    final next = <String, bool>{..._draft.features};
    if (hidden) {
      next[',
  't_165e10c0': '\$gShown מתוך \$gTotal רכיבים פעילים',
  't_2a92fc1c': '\${screen.emoji} \${screen.labelHe} — סקציות',
  't_9d93c1a0': '),
                      selected: _selectedPackId == p.id,
                      onSelected: (_) => setState(() {
                        _draft = applyVerticalPack(_draft, p);
                        _selectedPackId = p.id;
                        _syncTermControllers();
                      }),
                    ),
                ],
              ),
              const SizedBox(height: BsTokens.space5),
              // ── מודולים ורכיבים (giant slice-1) — אקורדיון-Maor: 14 סקציות
              // (קבלן ראשון), שער-פרסונה + מונה + סמן/נקה-הכל + מתגי-רכיבים
              // מקובצי-מסך; חיפוש/צ׳יפים מסננים; ליבה נעולה.
              ..._buildModuleAccordion(),
              const SizedBox(height: BsTokens.space5),
              _sectionTitle(',
  't_9ac23f57': '),
              for (final f in _kTermFields) ...[
                TextField(
                  controller: _termCtrls[f.key],
                  style:
                      const TextStyle(color: BsTokens.inkLight, fontSize: 14),
                  decoration: _dec(f.label),
                  onChanged: (v) => _setTerm(f.key, v),
                ),
                const SizedBox(height: BsTokens.space3),
              ],
              // ── כלי-סטודיו (giant slice-4/5) — מיחזור verbatim של פאנלי-הסטודיו
              // במסלול-מלא: מצא-והחלף (+publish חי) · גרסאות-והיסטוריה (שחזור).
              const SizedBox(height: BsTokens.space2),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      key: const Key(',
  't_632b795c': '),
              selected: _filterModule == m.key,
              onSelected: (_) => setState(() =>
                  _filterModule = _filterModule == m.key ? null : m.key),
            ),
        ],
      ),
      const SizedBox(height: BsTokens.space3),
      for (final m in kWizardModules)
        if (_filterModule == null || _filterModule == m.key)
          ..._sectionOrEmpty(m, q),
    ];
  }

  /// סקציה בודדת (או ריק אם חיפוש-פעיל בלי-התאמות — המודול נעלם מהמסננת).
  List<Widget> _sectionOrEmpty(OrgModuleInfo m, String q) {
    final matched = _matchingElements(m.key, q);
    if (q.isNotEmpty && matched.isEmpty) return const <Widget>[];
    return [
      _moduleSection(m, matched,
          open: q.isNotEmpty || _openModules.contains(m.key)),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    // אותו clamp-נגישות של בונה-הענפים: עד 1.35× — מעבר לזה טפסי-RTL נשברים.
    return MediaQuery(
      data: mq.copyWith(
        textScaler: TextScaler.linear(math.min(mq.textScaler.scale(1), 1.35)),
      ),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.surface,
            elevation: 0,
            iconTheme: const IconThemeData(color: BsTokens.inkLight),
            // Text רגיל בכוונה (לא CfgText) — ראה חוקי-הבית בכותרת-הקובץ.
            title: const Text(
              ',
  't_6b61b1bc': '),
    };
  }

  @override
  void dispose() {
    _orgName.dispose();
    for (final c in _termCtrls.values) {
      c.dispose();
    }
    super.dispose();
  }

  /// ל-OrgConfig אין copyWith (API-V1 חתום — לא נוגעים בו); הבנייה-מחדש
  /// המקומית שומרת slug/theme כפי-שהם ומחליפה רק מה שהאשף עורך — שם, מודולים,
  /// מונחים ומפת-features (ציר הצג/הסתר הרכיבים; ברירת-מחדל = carry-through).
  OrgConfig _rebuild({
    String? orgName,
    Map<String, bool>? modules,
    Map<String, bool>? features,
    Map<String, String>? terms,
    String? accessPasswordHash,
  }) =>
      OrgConfig(
        slug: _draft.slug,
        orgName: orgName ?? _draft.orgName,
        theme: _draft.theme,
        features: features ?? _draft.features,
        modules: modules ?? _draft.modules,
        terms: terms ?? _draft.terms,
        // Carry-through by default — an edit to any OTHER field must never wipe
        // the owner',
  't_a5ca0c6a': '), // ריק → ברירת-מחדל
              child: const Text(',
  't_774cfa9f': ');
        }
      }
    }
    setState(() => _draft = _rebuild(features: next));
  }

  /// שורת-רכיב אחת: מתג הצג/הסתר + ✎ מפקח (כשיש ציר-תוכן/עיצוב לערוך — "לא רק
  /// הצג/הסתר"). ליבה (kImmutable) — המתג נעול (onChanged null, value=מוצג-תמיד)
  /// עם 🔒; ה-✎ עדיין פתוח (טקסט/צבע/גודל — הליבה נעולה רק להסתרה, לא לעריכה).
  Widget _elementTile(ElementDescriptor d) {
    final locked = d.kImmutable;
    final tile = SwitchListTile(
      key: Key(',
  't_2980c1af': ');
    return SwitchListTile(
      contentPadding: EdgeInsets.zero,
      activeColor: BsTokens.brand,
      secondary: Text(m.emoji, style: const TextStyle(fontSize: 22)),
      title: Text(
        m.label,
        style: const TextStyle(
          color: BsTokens.inkLight,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        sub,
        style: const TextStyle(color: BsTokens.mutedLight, fontSize: 12.5),
      ),
      value: moduleOn(_draft, m.key),
      onChanged: locked ? null : (v) => _setModule(m.key, on: v),
    );
  }

  /// (מוצגים, סה״כ) של אלמנטי-מודול לפי הטיוטה — למונה-הסקציה.
  (int, int) _moduleCounts(String key) {
    var total = 0;
    var shown = 0;
    for (final list in (_kElementsByModule[key] ?? const {}).values) {
      for (final d in list) {
        total++;
        if (elementShown(_draft, d.id)) shown++;
      }
    }
    return (shown, total);
  }

  /// (מוצגים, סה״כ) על כל הרג׳יסטרי — למונה הגלובלי "X מתוך Y פעילים".
  (int, int) _globalCounts() {
    var total = 0;
    var shown = 0;
    for (final d in kElementRegistry) {
      total++;
      if (elementShown(_draft, d.id)) shown++;
    }
    return (shown, total);
  }

  /// "סמן הכל / נקה הכל" לאלמנטי-מודול — bulk הצג/הסתר. **מדלג על ליבה נעולה**
  /// (kImmutable) — לעולם לא מסתירים ניווט/כניסה, גם לא ב-bulk.
  void _setModuleElementsHidden(String key, {required bool hidden}) {
    final next = <String, bool>{..._draft.features};
    for (final list in (_kElementsByModule[key] ?? const {}).values) {
      for (final d in list) {
        if (d.kImmutable) continue;
        if (hidden) {
          next[',
  't_150fafaf': ');
    }
    setState(() => _draft = _rebuild(features: next));
  }

  /// 🔍 אבחון סנכרון — בדיקה חיה: למה שינוי לא מגיע למשתמשים אחרים. מריץ את
  /// [runOrgConfigDiagnostic] (Firebase? דגלים? מחובר-כבעלים? כתיבה-לשרת עם
  /// אימות-חוזר) ומציג את התוצאה. הצעד האחרון גם מפרסם — תוצאה ירוקה = חי לכולם.
  Future<void> _runDiag() async {
    final lines = await runOrgConfigDiagnostic(encodeOrgConfig(_draft));
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text(',
  't_63407e28': ',
                    style: const TextStyle(
                        color: BsTokens.mutedLight, fontSize: 12.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      );

  /// מונחים-שזורים (slice-3): הצגה-חיה "תווית → תצוגה" של מונחי-המודול (termOf).
  /// ריק ⇒ SizedBox. העריכה עצמה במקטע "מיתוג ומונחים" (מקור-אמת אחד).
  Widget _wovenTerms(String moduleKey) {
    final terms = _kModuleTerms[moduleKey];
    if (terms == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsetsDirectional.only(
          start: BsTokens.space3, end: BsTokens.space3, bottom: BsTokens.space2),
      child: Wrap(
        spacing: BsTokens.space2,
        runSpacing: 4,
        children: [
          for (final (key, label, def) in terms)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(BsTokens.radiusPill),
                border: Border.all(color: const Color(0xFFEDEDED)),
              ),
              child: Text(
                ',
  't_d4ea30b5': ',
                style: const TextStyle(
                  color: BsTokens.brandDark,
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
        ],
      ),
    );
  }

  /// כפתור-bulk קטן (סמן/נקה-הכל).
  Widget _bulkBtn(String label, VoidCallback onTap) => TextButton(
        onPressed: onTap,
        style: TextButton.styleFrom(
          foregroundColor: BsTokens.brand,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          minimumSize: Size.zero,
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
        child: Text(label,
            style:
                const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
      );

  /// סקציית-מודול אחת באקורדיון-Maor: כותרת (שער-פרסונה למודול-שער · כותרת-בלבד
  /// לקבלן) + מונה + רצועת-פתיחה-עצלה + סמן/נקה-הכל + מתגי-רכיבים מקובצי-מסך.
  Widget _moduleSection(
    OrgModuleInfo m,
    Map<String, List<ElementDescriptor>> matched, {
    required bool open,
  }) {
    final (shown, total) = _moduleCounts(m.key);
    final gated = _kGatedKeys.contains(m.key);
    final counter = ',
  't_424ea0d4': ',
                style: const TextStyle(
                  color: BsTokens.inkLight,
                  fontWeight: FontWeight.w800,
                  fontSize: BsTokens.typeSubhead,
                ),
              ),
              Text(
                _d.id,
                style: const TextStyle(
                    color: BsTokens.mutedLight, fontSize: BsTokens.typeCaption),
              ),
              const SizedBox(height: BsTokens.space3),
              // תצוגה-חיה (מקומית, בלי publish) — אותו מנוע-רינדור של האפליקציה.
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(BsTokens.space3),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFEDEDED)),
                ),
                child: Text(',
  't_bcf33f0a': ',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: BsTokens.inkLight,
                fontWeight: FontWeight.w800,
                fontSize: 18,
              ),
            ),
          ),
          body: ListView(
            padding: const EdgeInsets.fromLTRB(
              BsTokens.space4,
              BsTokens.space4,
              BsTokens.space4,
              BsTokens.space5,
            ),
            children: [
              // מצב לא-חמוש: ה-build רץ בלי ORG_CONFIG=true — הכל עובד חי,
              // אבל hydrateOrgConfig לא יטען את השמירה בפתיחה הבאה.
              if (!kOrgConfigFlag) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: BsTokens.space4,
                    vertical: BsTokens.space3,
                  ),
                  decoration: BoxDecoration(
                    color: BsTokens.warnBright.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    ',
  't_29860da3': ', style: TextStyle(fontSize: 16)),
          onPressed: () => _openElementInspector(d),
        ),
      ],
    );
  }

  /// פותח את מפקח-הרכיב (bottom-sheet) — עורך text/emoji/style חי דרך ה-Studio
  /// config-store (applyOps→publish), contextual לפי editableProps של הרכיב.
  void _openElementInspector(ElementDescriptor d) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      builder: (_) => _ElementInspectorSheet(descriptor: d),
    );
  }

  /// slice-4 — משגר את מסך מצא-והחלף (מיחזור `FindReplacePane` verbatim).
  void _openFindReplace() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const _WizardFindReplaceScreen()),
    );
  }

  /// slice-5 — משגר את מסך גרסאות-והיסטוריה (מיחזור `HistoryPane` verbatim).
  void _openHistory() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const _WizardHistoryScreen()),
    );
  }

  /// screen-mgmt slice-2 — משגר את "ניהול מסכים" (רמה-1 רשימת-מסכים).
  void _openScreenManager() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const _ScreenManagerScreen()),
    );
  }

  /// גוף-מודול: קבוצות-מסך (screenLabelHe) + מתגי-הרכיבים. נבנה **רק כשהמודול
  /// פתוח** (lazy — ~896 מתגים לא נבנים בסקציות סגורות). ממויין לפי נפח.
  Widget _moduleBody(Map<String, List<ElementDescriptor>> byScreen) {
    final screens = byScreen.keys.toList()
      ..sort((a, b) {
        final d = byScreen[b]!.length.compareTo(byScreen[a]!.length);
        return d != 0 ? d : a.compareTo(b);
      });
    // Transparent Material ancestor so the SwitchListTiles have a Material to
    // paint ink/background on — the card is a colored Container, and a ListTile
    // directly under it trips a framework assertion. Transparent ⇒ card shows.
    return Material(
      type: MaterialType.transparency,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final sk in screens) ...[
            Padding(
              padding: const EdgeInsets.only(top: BsTokens.space2, bottom: 2),
              child: Text(
                screenLabelHe(sk),
                style: const TextStyle(
                  color: BsTokens.mutedLight,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            for (final d in byScreen[sk]!) _elementTile(d),
          ],
        ],
      ),
    );
  }

  /// אלמנטי-מודול מסוננים לפי שאילתת-החיפוש [q] (ריק ⇒ הכל). מפתח=normScreen.
  Map<String, List<ElementDescriptor>> _matchingElements(String key, String q) {
    final byScreen = _kElementsByModule[key] ?? const {};
    if (q.isEmpty) return byScreen;
    final out = <String, List<ElementDescriptor>>{};
    byScreen.forEach((screen, list) {
      final f = [
        for (final d in list)
          if (d.labelHe.toLowerCase().contains(q) ||
              d.id.toLowerCase().contains(q))
            d,
      ];
      if (f.isNotEmpty) out[screen] = f;
    });
    return out;
  }

  /// כותרת מודול-תצוגה ללא שער (קבלן — ה-app-הבסיסי): אימוג׳י · שם · תיאור · מונה.
  Widget _contractorHeader(OrgModuleInfo m, String countSuffix) => Padding(
        padding: const EdgeInsets.symmetric(vertical: BsTokens.space2),
        child: Row(
          children: [
            Text(m.emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: BsTokens.space3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    m.label,
                    style: const TextStyle(
                      color: BsTokens.inkLight,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    ',
  't_5d76a288': ', style: const TextStyle(fontSize: 18)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: hidden ? BsTokens.mutedLight : BsTokens.inkLight,
                fontWeight: FontWeight.w700,
                fontSize: 14,
                decoration: hidden ? TextDecoration.lineThrough : null,
              ),
            ),
          ),
          // ✎ עריכה — שינוי-שם הפריט (חי במקלדת · בעורך לסקציות).
          IconButton(
            key: Key(',
  't_7ce82bbe': ';

  /// מסנן-צ׳יפ פעיל (מפתח-מודול) — null = הכל. **מסנן**, לא תנאי-הצגה.
  String? _filterModule;

  /// מפתחות-המודולים שהמשתמש פתח ידנית (אקורדיון עצל — גוף נבנה רק כשפתוח).
  /// חיפוש פותח-אוטומטית מודולים תואמים בלי לגעת בסט הזה.
  final Set<String> _openModules = <String>{};

  late final TextEditingController _orgName;
  late final Map<String, TextEditingController> _termCtrls;

  @override
  void initState() {
    super.initState();
    // קריאה חד-פעמית בכוונה (לא watch): האשף הוא ה-WRITER של ה-provider —
    // watch היה נלחם בטיוטה ודורס עריכה-בעיצומה אחרי כל שמירה.
    _draft = ref.read(orgConfigProvider);
    _orgName = TextEditingController(text: _draft.orgName);
    _termCtrls = {
      for (final f in _kTermFields)
        f.key: TextEditingController(text: _draft.terms[f.key] ?? ',
  't_05110a50': ';

/// 6 שדות-המונחים שהאשף עורך — מפתחות רישום-V3 (org_config.dart) + התווית
/// העברית של כל שדה. ריק = אוצר-המילים המקומפל (המפתח מוסר מהמפה).
const List<({String key, String label})> _kTermFields = [
  (key: ',
  't_0d141b95': ';
    return Container(
      margin: const EdgeInsets.only(bottom: BsTokens.space2),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFEDEDED)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Transparent Material so the header SwitchListTile paints ink over
          // the colored card (a ListTile directly under a colored DecoratedBox
          // trips a framework assertion) — same guard as _moduleBody.
          Material(
            type: MaterialType.transparency,
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: BsTokens.space3),
              child: gated
                  ? _moduleTile(m, counter)
                  : _contractorHeader(m, counter),
            ),
          ),
          // מונחים-שזורים (slice-3) — "תווית → תצוגה" חיה של מונחי-המודול.
          _wovenTerms(m.key),
          // רצועת-פתיחה (עצלה) — משטח-הקשה נפרד מכפתורי ה-bulk.
          Row(
            children: [
              Expanded(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => setState(() {
                      if (!_openModules.remove(m.key)) _openModules.add(m.key);
                    }),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: BsTokens.space3,
                          vertical: BsTokens.space2),
                      child: Row(
                        children: [
                          Flexible(
                            child: Text(
                              open ? ',
  't_a8f7be70': ';
    }
  }

  /// סנכרון-מלא (שם + מונחים) — לייבוא/איפוס, שמחליפים את הטיוטה כולה.
  void _syncAllControllers() {
    _orgName.text = _draft.orgName;
    _syncTermControllers();
  }

  /// מפת-מודולים קנונית-מינימלית: דלוק = המפתח **מוסר** (absent=on — לעולם
  /// לא שומרים true), כבוי = false מפורש.
  void _setModule(String key, {required bool on}) {
    final next = <String, bool>{..._draft.modules};
    if (on) {
      next.remove(key);
    } else {
      next[key] = false;
    }
    setState(() => _draft = _rebuild(modules: next));
  }

  /// מפת-מונחים קנונית: ריק (אחרי trim) = המפתח מוסר — אין מונחי-מחרוזת-ריקה.
  void _setTerm(String key, String raw) {
    final v = raw.trim();
    final next = <String, String>{..._draft.terms};
    if (v.isEmpty) {
      next.remove(key);
    } else {
      next[key] = v;
    }
    setState(() => _draft = _rebuild(terms: next));
  }

  /// ציר הצג/הסתר הרכיבים — קנוני-מינימלי כמו [_setModule]: הסתרה = המפתח
  /// ',
  't_3a5a0f89': 'אבחון סנכרון (למה לא מגיע לאחרים)',
  't_80261b6d': 'אין רכיבים תואמים',
  't_a245bb4d': 'איפוס טיוטה',
  't_69ac47cb': 'אפס לברירת-מחדל',
  't_7f7403ea': 'אפס סדר/הסתרה',
  't_a783a273': 'בחר ורטיקל (נקודת-פתיחה)',
  't_4458671e': 'גרסאות והיסטוריה',
  't_9eab55bc': 'דיו',
  't_7a8ffa4e': 'החל וסגור (חי)',
  't_17ebf3f5': 'החלת חבילה מחליפה מודולים+מונחים במלואם — שם וזהות נשמרים.',
  't_a71f7c5c': 'הטיוטה אופסה — לחץ שמור להפעלה',
  't_ec8f80c5': 'המקלדת-הצפה כשתשוגר (kKbGlobal).',
  't_f8ed3c47': 'חיפוש רכיב',
  't_31c1ff4f': 'חצי-מודגש',
  't_dde0bef6': 'טאב ראשון (בית)',
  't_cca0e0bb': 'טאב רביעי (חנות)',
  't_3dc6fd9f': 'טאב שלישי (עדכונים)',
  't_e5047f59': 'טאב שני (מחלקות)',
  't_c833d7d3': 'ייבוא JSON',
  't_bbad80b3': 'ייצוא JSON',
  't_04e77bed': 'ייצוא זמין ב-web בלבד',
  't_7de9ec4d': 'כל מודול = סקציה. פתח סקציה כדי להדליק/לכבות רכיבים. חיפוש וצ׳יפים מסננים. ליבה (ניווט/כניסה) נעולה תמיד.',
  't_51d1f62c': 'לא נבחר קובץ',
  't_fecd43bb': 'לקוח (יחיד)',
  't_5e16ef53': 'מודגש',
  't_81179b57': 'מודולים ורכיבים',
  't_2a1c9b85': 'מותג כהה',
  't_73757989': 'מצא והחלף בטקסטים',
  't_32798e82': 'מצא-והחלף · אשף',
  't_c6f7f477': 'מקלדת',
  't_433e970a': 'משקל',
  't_beb3e8fb': 'ניהול מסכים',
  't_b0afc6d8': 'ניהול מסכים (סדר · הסתר)',
  't_cefedc56': 'סדר והסתר את אריחי-המקלדת של המסך. נשמר עכשיו; יחול על ',
  't_a5f4c87a': 'סיסמה (ריק = ללא נעילה)',
  't_4affdeb2': 'סמן הכל',
  't_e6da2860': 'עמום',
  't_16058972': 'ענק',
  't_6772f968': 'ערוך סקציות',
  't_0fc92c30': 'ערוך רכיב (טקסט · צבע · גודל · משקל)',
  't_94337446': 'ערוך שם',
  't_ca8d5696': 'עריכת רכיב · \$id',
  't_aad96f0b': 'עריכת-הסקציות תיפתח כשהמסך יומר למבנה-סקציות (slice-5).',
  't_03c20f06': 'פורסם — חי בכל האפליקציה ✓',
  't_d9bdb212': 'פרסם לכולם (חי)',
  't_3e20e30e': 'רגיל',
  't_be5b587f': 'שם האפליקציה',
  't_412e9278': 'שם החברה',
  't_4f2750e7': 'שם המועדון',
  't_858bfe2f': 'שם המסך',
  't_59ffa2dc': 'שמור והפעל',
  't_5c06e99f': '‹ רכיבים',
  't_263875e6': '⌨️ מקלדת · \${screen.labelHe}',
  't_2034817c': '⚠️ פעיל עכשיו — אך השמירה נכשלה ולא תשרוד ריסטארט',
  't_a82e9449': '⚠️ קובץ לא-תקין — שום דבר לא יובא',
  't_1f9bc798': '✅ יובא לטיוטה — לחץ שמור להפעלה',
  't_d557b377': '✅ יוצא org-config.json',
  't_e54ffaba': '✅ נשמר ופורסם — פעיל אצל כל המשתמשים',
  't_b3f56162': '✅ נשמר ופעיל בכל האפליקציה',
  't_fe476cb1': '✅ נשמר מקומית — הפרסום לכולם לא עבר (כתיבה לבעלים בלבד)',
  't_36001f82': '🔒 ליבה — נעול',
  't_d05dd02b': '🔒 נעילה פעילה — צריך את הסיסמה כדי להיכנס.',
  't_9a1a2897': '🔒 נעילת גישה',
  't_49280846': '🔓 אין נעילה — כל אחד נכנס. הקלד סיסמה כדי לחסום.',
  't_b4d664b8': 'אתה אינסטלטור-מנטור. אתה מסביר בקצרה למה אביזרים משלימים נחוצים להתקנה, ',
  't_81900595': 'ברמת סוג-המוצר בלבד. לעולם אל תמציא שם-מוצר, מק"ט או מחיר, ואל תוסיף פריטים ',
  't_c47d4751': 'הסבר לאינסטלטור, במשפט קצר לכל סוג, למה הוא נחוץ להתקנה של "\$product", ',
  't_7c66661d': 'וסיים בשורת "אל תשכח" קצרה. דבר ברמת סוג-המוצר בלבד — אל תמציא שמות-מוצר, ',
  't_a0b24970': 'מותקן לרוב יחד עם:',
  't_af311989': 'מעבר לרשימה שניתנה לך.',
  't_da8d85c6': 'מק"טים או מחירים, ואל תוסיף סוגים שלא ברשימה.',
  't_c894b3dc': '⚙️ הרשימה מנתוני-הקטלוג; ה-AI רק מסביר למה כל אביזר נחוץ.',
  't_b67eca1d': '🧩 מה עוד צריך?',
  't_16bc7f13': '"\${order.lines[i].name}" יוחלף במוצר חלופי',
  't_75a40972': '\$g חבילות',
  't_7ebed684': '\$handled/\${lines.length} פריטים טופלו',
  't_9b08ef69': '\${o.items} פריטים · \${fMoney(o.sum)}',
  't_0644af4c': 'או לבטל את ההזמנה כולה.',
  't_1d1c7410': 'בטל הזמנה',
  't_d8a2f6ba': 'ביטול ההזמנה',
  't_17d725b6': 'ההזמנה \${order.id} עודכנה — מסונכרן עם השליח והמנהל ✓',
  't_6fb368de': 'ההזמנה \${order.id} תבוטל כולה אצל הספק — ',
  't_4fe55944': 'ההזמנה אינה זמינה עוד',
  't_605ae0d7': 'ההזמנה בוטלה — הספק עודכן',
  't_9e219b1d': 'הוחלף/בוטל ע"י הקבלן',
  't_3b115f91': 'הזמנה: \${order.id} · \${order.site}',
  't_7d9fbab4': 'הספק ממשיך בליקוט',
  't_a0622932': 'הספק עצר את הליקוט — יש לבחור לכל פריט חסר: החלפה או הסרה, ',
  't_04f03ff2': 'הסר מההזמנה',
  't_188d31cf': 'הפיצול בוטל — חבילה אחת',
  't_f4990dce': 'הפריט "\${order.lines[i].name}" הוסר — ',
  't_9ab89198': 'חבילה אחת',
  't_72018bc2': 'חסר',
  't_ec318200': 'כמות לליקוט: \${line.qty}',
  't_cd64c91c': 'כמות: \$qty · ⏳ הספק ממתין להחלטתך',
  't_986ad2f1': 'מוצר חלופי',
  't_c7f15861': 'נדרשת החלטה',
  't_6ff5b74d': 'סטטוס: \${kOrderStageLabel[order.stage]}',
  't_f22d6743': 'סמן כל פריט כ"לוקט" או "חסר" כדי לסיים את ההכנה',
  't_d0c69fc3': 'סמן כמוכן בכל זאת',
  't_0ae34a99': 'פעולה בלתי-הפיכה.',
  't_4495820d': 'פריט חסר — נדרשת החלטה',
  't_a4a1d526': 'תיקון בוצע',
  't_2ec5c383': 'תעודת משלוח',
  't_ebe99e67': '⏳ הקבלן עודכן — ההזמנה ממתינה להחלטתו (החלפה / הסרה / ביטול)',
  't_ed452bf4': '⏳ ממתין לבחירת הקבלן',
  't_a86e4856': '⏳ פריט חסר — ממתין לבחירת הקבלן (החלפה / ביטול)',
  't_f61cb2ef': '⚠️ \${f.missingCount} פריטים חסרים — הקבלן עודכן',
  't_1a6157b7': '⚠️ ההזמנה ממתינה להחלטת הקבלן על פריט חסר — לא ניתן להמשיך',
  't_eea957a0': '✓ ההחלטה התקבלה — הספק ממשיך בליקוט (תיקון בוצע)',
  't_52d7b2af': '✓ לוקט',
  't_94144a99': '✓ תיקון בוצע — הקבלן החליט, המשך בליקוט',
  't_32ab32b5': '✕ בוטל ע״י הקבלן',
  't_e7cfb051': '✕ חסר',
  't_4f49c207': '📄 הצג תעודת משלוח',
  't_7ad0574b': '📦 כל הפריטים טופלו — סמן כמוכן',
  't_f5c46ab8': '📦 משלוח \$g — \${idxs.length} פריטים',
  't_13f36aa8': '🔁 ההחלטה נשלחה לספק — ',
  't_ee6ad553': '🔁 הוחלף ע״י הקבלן',
  't_bf2df43c': '🔁 החלף מוצר',
  't_30a5d044': '🕒 בתיאום · 📍 \${order.site} · \${haul.ic} \${haul.name}',
  't_983a88d7': '🚚 ההזמנה הוכנה ב-\$g חבילות',
  't_8935a607': '🚚 ההזמנה מפוצלת ל-\${f.splitInto} משלוחים — הכן כל קבוצה כחבילה נפרדת.',
  't_b3a27e9e': '🚚 הוכן ב-\${f.splitInto} חבילות',
  't_9da4758c': '🚚 פיצול משלוחים',
  't_21f66559': '🚫 בטל את ההזמנה כולה',
  't_b5e391b7': '🚫 ביטול ההזמנה כולה — בקרוב',
  't_109e0bc0': '🛵 ההזמנה מוכנה — ממתינה לאיסוף השליח',
  't_8cf06ad1': ',
              style: const TextStyle(
                color: BsTokens.inkLight,
                fontSize: 13.5,
              ),
            ),
            const SizedBox(height: BsTokens.space3),

            // Signature status pill (proto `נחתם ✓`/`ממתין`).
            // Directional start (gate #62 idiom) — not a physical centerRight.
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: f.podSigned
                      ? const Color(0xFFD7F5DF)
                      : const Color(0xFFFFF4D6),
                  borderRadius: BorderRadius.circular(BsTokens.radiusPill),
                ),
                child: Text(
                  f.podSigned ? ',
  't_a8624f04': 'אין צילום עדיין',
  't_a6eb7641': 'החתימה לא נשמרה — נסה שוב',
  't_a32c835c': 'החתימה נשמרה ✍️',
  't_a863f48b': 'צילום המסירה נשמר 📸 — מוצג לחנות ולמנהל',
  't_d3f68864': '✍️ חתום מחדש',
  't_9931b3b4': '✍️ חתימה',
  't_3af06068': '📷 צלם מסירה',
  't_10f7389f': '📷 צלם שוב',
  't_d9612ab6': '\${t.min}+ יח׳ · \${t.discount}% הנחה',
  't_87f40e1a': '\${tile.sub} — כלי זה יחובר בהמשך הפיתוח.',
  't_17754075': 's
      // "צ׳אט עם קבלן" runs under the 🏪 store ([BsRole.store]); the courier
      // portal',
  't_90763e7f': 's
/// "פורטל השליח" button). Each tile then opens its own [showPortalSheet].
void showPersonaPortalGrid(
  BuildContext context,
  String head,
  List<PortalTileData> tiles,
) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Theme.of(context).colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (sheetCtx) => Directionality(
      textDirection: TextDirection.rtl,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          BsTokens.space4,
          BsTokens.space4,
          BsTokens.space4,
          BsTokens.space5,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              head,
              style: const TextStyle(
                color: BsTokens.inkLight,
                fontWeight: FontWeight.w800,
                fontSize: 19,
              ),
            ),
            const SizedBox(height: BsTokens.space3),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: BsTokens.space3,
              crossAxisSpacing: BsTokens.space3,
              childAspectRatio: 1.5,
              children: [
                for (final t in tiles)
                  PortalTileButton(
                    title: t.title,
                    sub: t.sub,
                    onTap: () => showPortalSheet(context, t),
                  ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

/// Opens the info sheet for [tile]. Tall content scrolls (isScrollControlled +
/// SingleChildScrollView) so it never clips.
void showPortalSheet(BuildContext context, PortalTileData tile) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Theme.of(context).colorScheme.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (_) => Directionality(
      textDirection: TextDirection.rtl,
      child: _PortalSheet(tile: tile),
    ),
  );
}

class _PortalSheet extends ConsumerWidget {
  const _PortalSheet({required this.tile});
  final PortalTileData tile;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space5,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              tile.title,
              style: const TextStyle(
                color: BsTokens.inkLight,
                fontWeight: FontWeight.w800,
                fontSize: 19,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              tile.sub,
              style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
            ),
            const SizedBox(height: BsTokens.space4),
            ..._content(context, ref),
          ],
        ),
      ),
    );
  }

  List<Widget> _content(BuildContext context, WidgetRef ref) {
    switch (tile.kind) {
      case PortalKind.ratings:
        // fake-data-sweep: kSupplierRatings is a demo seed with no live source —
        // gate the DATA rows together with the label (not just the note), so the
        // review build never shows fake ratings; show an honest server-pending
        // row instead of a blank sheet.
        return [
          if (!kHideUnderConstruction) ...[
            for (final r in kSupplierRatings)
              _row(',
  't_f8821dbe': 's active [persona] (🏪 store / 🛵 courier).
///
/// 🔒 ISOLATION (SPEC §2.5): the ONLY navigation is `push(ChatsScreen(persona:))`
/// — that screen is a self-contained standalone Scaffold ("שיחות" + back→pop), so
/// the back button returns to THIS portal; nothing here routes to home_shell, the
/// role picker, or any other persona',
  't_1366e99b': 's מלאי tab toggles.
        final oos = ref.watch(storeOosProvider).toList()..sort();
        if (oos.isEmpty) {
          return [_row(',
  't_be728491': 's מלאי tab); the 💬
/// chat tiles open the shared cross-persona [ChatsScreen] for the portal',
  't_113fbdc3': 'אוטומטי לפי מכירות',
  't_68a3f9fc': 'דירוגי ספקים חיים יתווספו עם חיבור השרת',
  't_4624f031': 'הודעות פנימיות',
  't_e1cc7d89': 'זמני אספקה',
  't_29c7c8a8': 'מדרגות הנחה',
  't_ce0b6534': 'מסלול לאתר',
  't_ce96d131': 'מפת אזורים',
  't_5f43c0ca': 'ניהול צי חי יתחבר עם חיבור השרת',
  't_0b7209d9': 'נתוני הדגמה (seed מהפרוטוטייפ) — יוחלפו בנתונים חיים עם חיבור השרת',
  't_5fc9130d': 'ציון וביצועים',
  't_017d19a9': 'רכבים וזמינות',
  't_7a109844': 'תוויות למוצרים',
  't_0e7d48f1': '⏱️ מעקב SLA',
  't_2cacc52f': '⚠️ \${oos.length} מוצרים אזלו מהמלאי',
  't_e9485669': '⭐ דירוג ספקים',
  't_7d282d1d': '🏷️ הפקת ברקודים',
  't_8fd74c1c': '💬 צ׳אט עם חנות',
  't_d69b91ac': '💬 צ׳אט עם קבלן',
  't_7e513ee1': '📉 הנחות כמות',
  't_d10c3651': '🗺️ אזורי הפצה',
  't_59c1aeaa': '🚛 צי רכב',
  't_23173fea': '🧭 ניווט למשלוח',
  't_102820ba': ';

/// Trades that have no real content yet — picking one leads to an honest
/// "בקרוב" screen instead of an empty flow. Only אינסטלטור is fully built.
const Set<String> kComingSoonTrades = {',
  't_a4ab3778': 's `screen-profession`.
/// Picking a trade saves it to the profile and advances to the onboarding step.
class ProfessionScreen extends ConsumerWidget {
  const ProfessionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    void pick(String name) {
      // Trades without real content yet → honest "בקרוב" screen (keeps the
      // user on the picker via back). Only אינסטלטור proceeds into the app.
      if (kComingSoonTrades.contains(name)) {
        Navigator.of(context).push(ComingSoonScreen.route(name));
        return;
      }
      ref.read(userProfileProvider.notifier).setProfession(name);
      ref.read(startupStepProvider.notifier).state = 2;
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: HelpModeScaffold(
        child: SafeArea(
          child: Padding(
          padding: const EdgeInsets.all(BsTokens.space5),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  HelpTarget(
                    title: ',
  't_50d65848': 'בחירת התחום "\${t.name}" (\${t.desc}). אמורה להתאים ',
  't_e42f1de9': 'ברזים, אסלות, צנרת, חימום מים',
  't_7e017b43': 'חוזר אחורה למסך הקודם (מסך הפתיחה / ההרשמה).',
  't_5975e37c': 'מה התחום שלך?',
  't_459a1e69': 'נקודות, לוחות, כבלים, גופי תאורה',
  't_86717288': 'נתאים לך את האפליקציה — קטלוג, כלים והמלצות לפי המקצוע',
  't_39489ed1': 'פרויקט שלם — מבנייה ועד גמר',
  't_41fb163b': 'קטלוג/כלים/המלצות למקצוע — כרגע אינסטלטור פעיל, השאר בקרוב.',
  't_994ab5c6': 'תוכל לשנות את הבחירה בכל עת מההגדרות',
  't_93072edf': ',
                onTap: () =>
                    Navigator.of(context).push(RewardsHubScreen.route()),
              ),
            // ── S1 חשבון — login (guest / signed out) vs. account actions.
            //
            // The test is "is there a REAL person here", not "is there a user".
            // The server-catalog bootstrap signs every visitor in anonymously, so
            // `auth.user == null` stopped being reachable the day the live build
            // turned the backend on — which silently deleted the ONLY in-app way
            // to log in, while showing a browsing GUEST the logout and
            // delete-account rows for an account they do not have.
            if (hasAuthGateway && !(auth.user?.isRealUser ?? false)) ...[
              const SizedBox(height: BsTokens.space2),
              _LinkRow(
                label: ',
  't_97afae9a': ';

/// Primary dark text on the light theme (per the spec — no `inkLight` token).
const Color _ink = BsTokens.inkLight;

/// 👤 הפרופיל שלי — the native home for the user',
  't_f278450b': 's ⚙️ → 👤 חשבון group: name + contact + profession,
/// editable in place and persisted through [userProfileProvider]. Reached by
/// tapping the user',
  't_e0bf06ef': 'החשבון וכל הנתונים האישיים יימחקו לצמיתות. את הפעולה אי אפשר לבטל.',
  't_6dab4c77': 'החשבון נמחק לצמיתות',
  't_b629d772': 'הפרופיל נשמר',
  't_a940ed22': 'התנתקת מהחשבון',
  't_433fe49e': 'ח.פ. / עוסק מורשה',
  't_6cd3e273': 'ח.פ./עוסק מורשה',
  't_370d20e0': 'כתובת / אזור',
  't_c157595f': 'מחיקת חשבון',
  't_3e028bd5': 'מחק לצמיתות',
  't_6e375809': 'שם הקבלן',
  't_4ffeb914': 'תחום מקצועי',
  't_e60a0e31': '📋 בקשות תפקיד',
  't_b4ba87f2': '🔄 החלפת תפקיד',
  't_0ec4d7dc': '🗑️ מחיקת חשבון',
  't_860aca44': '🚪 התנתקות',
  't_872aadbc': ';

/// Open the פרויקטים screen — the wire target for `openProjects`.
void openProjects(BuildContext context) =>
    Navigator.of(context).push(ProjectsScreen.route());

class ProjectsScreen extends ConsumerWidget {
  const ProjectsScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const ProjectsScreen());

  static final List<KbToolNode> _kbNodes = kbProjectsNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(projectsProvider);
    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          automaticallyImplyLeading: false,
          titleSpacing: BsTokens.space4,
          title: const CfgText(',
  't_45b6fea8': 's site list:
// each site card shows name/addr/foreman + a cart/tree count, switches the
// active project (switchProject), opens a full status snapshot, and edits the
// site inline (saveSiteEdit). A "+ פרויקט חדש" sheet adds sites (saveProject).
// All state is the live `projectsProvider` (active id + per-project cart
// snapshot, see state/projects_engine.dart) — the orders-engine pattern.
// Strings/numbers verbatim from the prototype (R6/R8).
//
// Entry: openProjects (the leaf action) → ProjectsScreen.route().
//
// CART-PER-PROJECT: switching stashes the outgoing project',
  't_839344b0': 'אין פרויקטים עדיין',
  't_f77757bf': 'הוסף פרויקט',
  't_e1ac9fa8': 'החלף ›',
  't_612bfd54': 'הפרויקט נוסף',
  't_6da85353': 'השינויים שהזנת לא יישמרו.',
  't_8a0f2cf6': 'יש להזין שם אתר',
  't_b311e4d1': 'יש להזין שם פרויקט',
  't_654e13cb': 'מנהל עבודה',
  't_e3701234': 'עברת לפרויקט: \${p.name}',
  't_7b3138d2': 'עריכת פרטי האתר',
  't_31cc6233': 'פעיל עכשיו',
  't_31c1c8e6': 'פרויקט חדש',
  't_37f69097': 'פרטי האתר עודכנו',
  't_e8a5cb16': 'צרו פרויקט חדש כדי לנהל סל, תקציב ומשימות לכל אתר',
  't_879f979c': 'שם האתר',
  't_5e515858': '⚪ לא פעיל — הקש כדי להפעיל',
  't_f395bacf': '✏️ הקש לעריכת הפרטים',
  't_ba9b743c': '✏️ עריכת פרטי האתר',
  't_1018ef60': '🌳 \${p.treeCount} עצי מוצרים בעבודה',
  't_5773560b': '🌳 \${project.treeCount} עצי מוצרים ›',
  't_b9e7aee5': '🏗️ הפרויקטים שלי',
  't_351e04e3': '👷 מנהל עבודה',
  't_ee5baef1': '👷 מנהל עבודה: \${project.manager}',
  't_9bb9c147': '📊 הקש לסטטוס האתר המלא',
  't_a15435db': '📍 כתובת',
  't_1ea52dc9': '🛒 \${p.cart.length} פריטים בעגלה',
  't_5ce82544': '🛒 \${project.cart.length} פריטים בעגלה ›',
  't_d1f967c1': '🛒 סל הפרויקט: \${p.cart.length} פריטים',
  't_34a6feda': '🟢 אתר פעיל עכשיו',
  't_b2c9352c': 'אתה עוזר-מכירות מנוסה לאינסטלטור. אתה מנסח הצעות-מחיר מקצועיות ומשכנעות ',
  't_f5ae3b5f': 'ההצעה המנוסחת הועתקה',
  't_09af1287': 'הסעיפים בצורה ברורה, וסיום עם הזמנה מנומסת לאישור. שמור על כל מספר, מחיר ',
  't_5f20a1fb': 'ומק"ט בדיוק כפי שהם — אל תשנה, תוסיף או תמחק שום סכום/מחיר/פריט, ואל תמציא ',
  't_6c297f36': 'ללקוחות. שמור על כל מספר ומחיר בדיוק כפי שניתן לך; לעולם אל תשנה, תוסיף או ',
  't_a95d1d6d': 'נסח אותה מחדש כהודעה מקצועית ומנומסת ללקוח בעברית — פתיחה קצרה, פירוט ',
  't_a36194f5': 'פרטים שלא ניתנו לך.',
  't_ae7f5951': 'תמציא מחיר, סכום או פריט.',
  't_32366e15': '⚙️ המספרים מנתוני-המערכת; ה-AI רק מנסח — לא משנה מחירים.',
  't_e0322303': '✨ הצעה מקצועית',
  't_e6e20df2': '💡 הניסוח המקצועי דורש חיבור לשרת.',
  't_01573526': 'בודק קטלוג · chips · מאתר · מנוע תאימות/התקנה · state · ניווט · wiring',
  't_fb4371a4': 'התנהגות',
  't_b016a43a': 'זהויות',
  't_256c248d': 'טאבים',
  't_0aba2dee': 'כפתורים',
  't_09ac041a': 'מנוע',
  't_a293b273': 'סנכרון',
  't_12b857f3': 'עצים',
  't_d8bb14e5': 'ציפיתי: \${check.expected} · קיבלתי: \${check.got ?? "—"}',
  't_63626e55': '↻ הרץ שוב',
  't_b799bb2c': '⏳ מריץ את הבדיקות... רגע',
  't_83ad5ffe': '▶ הרץ בדיקת רגרסיה מלאה',
  't_3390e328': '✅ כל הבדיקות עברו (\${summary.passed}/\${summary.total})',
  't_98925fc4': '❌ נמצאו \${summary.failed} כשלים',
  't_ab0551de': '🔬 מרכז בדיקות רגרסיה',
  't_6aebc194': 'אתה מנסח הודעת-דחייה מנומסת ומקצועית לבקשת-תפקיד. בחר סיבה כללית ומכובדת ',
  't_f991d44a': 'בהזמנה להגיש שוב בעתיד. אל תמציא עובדות ספציפיות על האדם — הישאר ',
  't_7731dc16': 'בקשת-תפקיד: \${widget.role}',
  't_d06c641d': 'ברמת-הקטגוריה בלבד.',
  't_94089062': 'האדם. קצר, מכבד, ומסתיים בהזמנה להגיש שוב.',
  't_0c8af162': 'המבקש',
  't_a72aec72': 'הנוסח הועתק',
  't_57210c1c': 'העתק',
  't_a4a04014': 'מתוך הקטגוריות שניתנו, נסח אותה בעדינות, ולעולם אל תמציא עובדות ספציפיות על ',
  't_09dbbb7e': 'נסח הודעת-דחייה קצרה, מנומסת ומקצועית בעברית, מופנית למבקש, שמסתיימת ',
  't_b1a158ad': 'פרטים על המבקש.',
  't_1d83e811': '⚙️ נוסח כללי ומכובד; ערוך לפי הצורך לפני שליחה. ה-AI לא ממציא ',
  't_8fbc6c9d': '✨ סיבת-דחייה',
  't_39505446': '💡 ניסוח-הסיבה החכם דורש חיבור לשרת.',
  't_4445c95d': ' (אתה)',
  't_a57f9505': '\${r.name} — ינוכו \${r.cost} מטבעות מהיתרה שלך.',
  't_5b591061': '\${rw.challenges.length} פעילים',
  't_5e847734': '+\${c.reward} BuildCoins — אתגר הושלם',
  't_8cd683f3': '+100 לכל הזמנה',
  't_abd7f0db': ';

/// 🎮 מועדון BuildSmart — the rewards/loyalty hub (T3.G).
///
/// A faithful native port of proto Category H (`openRewardsHub` @21452 +
/// `rwFeature` views @21497-21658). The proto opens an overlay grid of 7 tiles;
/// each tile swaps a second overlay (`rwFeature`). Here the hub is a screen and
/// each tile pushes the matching [_RewardsFeatureScreen]; all 7 features render
/// their real content (challenges/leaderboard/green/coupons/referral/VIP/redeem)
/// and the live coin/challenge mutations run through [rewardsProvider].
///
/// WIRE: reached via the home menu-dial settings tree (the מועדון leaves) and
/// the profile card — see the WIRE notes in the agent report. The dial leaf
/// should `Navigator.push(RewardsHubScreen.route())`.
class RewardsHubScreen extends ConsumerWidget {
  const RewardsHubScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const RewardsHubScreen());

  /// The 7 hub tiles — VERBATIM fn/ic/t from proto `items` @21464-21472.
  static const List<({String id, String ic, String t, String s})> _tiles = [
    (id: ',
  't_b0ca0925': 'אין מספיק BuildCoins',
  't_78f9d131': 'אתגרים חודשיים',
  't_e0c8ed59': 'בנייה בת-קיימא',
  't_da33d805': 'דירוג הקבלנים לפי BuildCoins החודש.',
  't_3e45e21f': 'דרגות והטבות',
  't_348d115c': 'הדירוג שלך',
  't_3bd9bc7f': 'הזמן חבר',
  't_8b049613': 'הזמן קבלן אחר — שניכם תרוויחו BuildCoins.',
  't_382c2e05': 'הזמנה ראשונה של החבר',
  't_9fee2103': 'החבר מקבל',
  't_a3332c08': 'החלף BuildCoins בפרסים אמיתיים.',
  't_330cf24e': 'החלף מטבעות בפרסים',
  't_7dd419c1': 'היתרה שלך למימוש',
  't_6e3a8371': 'המשך כדי להשלים את האתגר',
  't_4b718775': 'הקופון נשמר לארנק שלך',
  't_bb2234f9': 'השלם אתגרים וזכה ב-BuildCoins.',
  't_29e46104': 'חבר נרשם',
  't_9cea3708': 'חסרים \${r.cost - rw.coins} מטבעות',
  't_33b9ae2c': 'ככל שצוברים יותר — ההטבות גדלות.',
  't_d7b567d1': 'כל האתגרים הושלמו 🎉',
  't_4b5e837c': 'לוח המובילים',
  't_3f62501f': 'לוח מובילים',
  't_b7ca5952': 'מבצעים בקרבת מקום',
  't_e9024fa1': 'מבצעים זמינים מספקים בקרבת מקום אליך.',
  't_4852494f': 'מועדון VIP',
  't_485f1b78': 'מימוש הטבות',
  't_b241e859': 'מימוש פרס?',
  't_08169abf': 'ממש',
  't_f3560abc': 'ממש עכשיו',
  't_71663ec2': 'צבור מטבעות, השלם אתגרים וקבל הטבות.',
  't_5d1839a9': 'קבל \${c.reward} מטבעות',
  't_3ccd70d6': 'קוד ההזמנה הועתק — שתף אותו עם חברים',
  't_7f27a0d2': 'קוד ההזמנה שלך',
  't_639ff7e8': 'קופון ₪40',
  't_708c1aff': 'קופונים לפי מיקום',
  't_d92781c1': 'שמור קופון',
  't_597c2dd5': 'תגי ירוק',
  't_d83c3640': 'תגים ירוקים שנצברו',
  't_ba801bfa': 'תגים על בנייה בת-קיימא ושמירה על הסביבה.',
  't_d0273369': '⚙️ בפרודקשן: איתור לפי מיקום GPS בזמן אמת',
  't_02292d37': '⚙️ בפרודקשן: דירוג חי מהשרת — כאן מוצג לוח דמו',
  't_0538ec32': '⚙️ בפרודקשן: קוד אישי לכל משתמש — כאן קוד דמו משותף',
  't_cd5b346b': '⚙️ בפרודקשן: תגים מנוטרים מהשרת — כאן נתוני דמו',
  't_bd3d4fe1': '🎁 \${r.name} מומש בהצלחה!',
  't_7eefb4e6': '🎮 מועדון',
  't_3e21ba96': '💎 דרגת \${tier.name}\${current ? ',
  't_48051ee2': '📤 שתף את הקוד',
  't_f5cb2823': '🔥 רצף (דמו): \$kLoginStreak ימים פעילים',
  't_2261d200': ') {
              // Manager is a full role-app (the מרכז השליטה dashboard SHELL),
              // not a BS-dial drill — mirror the worker→WorkerAppScreen pattern.
              Navigator.of(context).pop();
              _pushBoard(context, BoardRole.manager,
                  (_) => const ManagerDashboardScreen());
              return;
            }
            if (persona.id == ',
  't_29f0c2c5': 'בחר תפקיד כדי להיכנס',
  't_22ef6328': 'מי אתה?',
  't_393f6c6d': 'ניהול מוצרים, חנויות, לקוחות',
  't_22f9520b': 'בחר תפקיד — הבקשה תישלח לאישור הגורם המתאים',
  't_832c0949': 'לא ניתן לשלוח בקשה כעת',
  't_c1f40723': 'מאושר ע״י חנות/ספק',
  't_cda64bb1': 'מאושר ע״י מנהל',
  't_c8b231d2': 'מאושר ע״י קבלן',
  't_57929fce': 'מבקש/ת בשם',
  't_6c1088a7': '✓ בקשתך נשלחה — ממתינה לאישור',
  't_11594995': 'אין בקשות למחיקה',
  't_3c3d7e71': 'אין בקשות תפקיד ממתינות',
  't_852ee6ff': 'בקשות תפקיד',
  't_b4a24d90': 'דחייה',
  't_3f36041d': 'הבקשה נדחתה',
  't_6aa40975': 'לא ניתן לטעון בקשות כעת',
  't_32abe99d': 'למחוק את כל בקשות-התפקיד הממתינות? הפעולה בלתי-הפיכה.',
  't_95161b02': 'מבקש/ת: \${persona?.title ?? role}',
  't_5557c4ee': 'מחיקת כל הבקשות',
  't_6725cde0': 'מחק את כל הבקשות',
  't_82a80a16': 'מחק הכל',
  't_40def10e': 'משתמש',
  't_ce49fce9': 'נסח סיבת-דחייה',
  't_1a0db5dc': '✓ התפקיד אושר',
  't_40196e41': '✓ נמחקו \$n בקשות',
  't_4968a276': '\${d.workers} עובדים',
  't_2d74bbd8': '+ רישום יומן להיום',
  't_bc6bee11': '+ תזמן ביקורת',
  't_8aa1c0e9': 's OWN keyboard tools (live-mirror): its 12 tiles, so
/// the floating keyboard MIRRORS "ניהול אתר" instead of the tab fallback. Built
/// ONCE (stable list identity → KbScreen never re-pushes on rebuild). Actions
/// reuse the same open-functions the tiles use, via the tool-dispatch context.
final List<KbToolNode> kbSiteHubTools = <KbToolNode>[
  KbToolNode.leaf(icon: Icons.assignment_outlined, label: ',
  't_135ee9b8': 's OWN keyboard tree — a 3-level browse into the site
      // hierarchy (קומה → דירה → חדר), built inline from the const [kSiteTree].
      // Room leaves are browse endpoints (a location, not an action) → NO-OP.
      // `kKbGlobal ?` gate keeps flag-off byte-identical (tree not built when off).
      kbTools: kKbGlobal ? _kbTree() : null,
      icon: ',
  't_b1cc9f2b': 's `prompt(...)` becomes an AlertDialog with a
// TextField (R: inline input). Returns the entered text, or null on cancel.
// ─────────────────────────────────────────────────────────────────────────────

Future<String?> _promptInput(
  BuildContext context, {
  required String title,
  required String initial,
  required String okLabel,
}) {
  final ctrl = TextEditingController(text: initial);
  return showDialog<String?>(
    context: context,
    builder: (ctx) => Directionality(
      textDirection: TextDirection.rtl,
      child: AlertDialog(
        backgroundColor: Theme.of(ctx).colorScheme.surface,
        title: Text(
          title,
          style: const TextStyle(color: BsTokens.inkLight, fontSize: 16),
        ),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          style: const TextStyle(color: BsTokens.inkLight),
          textInputAction: TextInputAction.done,
          onSubmitted: (v) => Navigator.of(ctx).pop(v),
          decoration: const InputDecoration(border: OutlineInputBorder()),
        ),
        actions: [
          // composite hide: whole ביטול button gone when hidden
          // (dialog cancel → critical:false; the dialog stays dismissible).
          CfgVisible(
            ',
  't_0dc9bc39': 's site functions (`openSiteHub` +
// `siteGantt`…`siteArchive`, index.html:19856-20151). The proto renders each
// tool into a `siteFeatureOverlay`; here every tool is a pushed route with the
// shared shell, matching the existing courier/store-dashboard style (R: match
// existing style). All strings + numbers are VERBATIM from the prototype (R6/R8).
//
// ENTRY POINTS (opened from the catalog ⋮ menu — `site_tasks` case in home_shell, calls openSiteHub):
//   openSiteHub(ctx)        — the tile grid landing (proto openSiteHub @19858).
//   _openGantt              📅  → LIVE showTasksGanttSheet (tasks_gantt_sheet.dart)
//   _openDefects            🔧  → LIVE showDefectsSheet (defects_sheet.dart)
//   _openAttend             📍  → LIVE showContractorAttendanceSheet (contractor_attendance_sheet.dart)
//   _openHr                 👷  → LIVE showContractorHrSheet (contractor_hr_sheet.dart)
//   openSiteLocations       T2.3 site-loc     🏢  [L19952]
//   openSiteDiary           T2.5 site-diary   📓  [L20012]
//   openSiteSafety          T2.6 site-safety  🦺  [L20041]
//   openSiteDeps            T2.7 site-deps    🔗  [L20066]
//   openSitePhotos          T2.8 site-photos  📸  [L20087]
//   openSiteInspect         T2.9 site-inspect 🔍  [L20111]
//   openSiteArchive         T2.10 site-archive 🗄️ [L20143]
//
// The Gantt/ליקויים/נוכחות tiles + the new HR tile are repointed to the LIVE
// shared sheets (live tasksProvider / defectsProvider / attendanceForEmployer);
// the old demo _SiteGantt / _SiteSnagging / _SiteAttendance screens were removed.
// Mutable state (inspections · diary) lives in
// `state/site_hub_state.dart`, seeded from the B0 consts in `data/phaseb_seeds`.

import ',
  't_991c1e22': 'אחרי',
  't_4b549d17': 'אין ביקורות מתוזמנות — הקש "+ תזמן ביקורת"',
  't_2e8c1ef2': 'אין רישומים ביומן',
  't_b00e2ad3': 'אישור חופשות וצוות',
  't_1ed56329': 'ארכיון פרויקטים',
  't_c7f48fa5': 'בוצעה',
  't_7f1384d9': 'בין משימות',
  't_3a0dd6b2': 'ביקורות',
  't_c162c0d5': 'ביקורות מפקח',
  't_fb444ce6': 'ביקורת מהנדס',
  't_0886b133': 'ביקורת תוזמנה ✓',
  't_8f09cd91': 'דורש: \${d.needs}',
  't_ff16bae6': 'הביקורת \${ins.id} סומנה כבוצעה ✓',
  't_6cb5f25f': 'הוסף רשומה',
  't_7e8dc35c': 'התדריך היומי אושר.',
  't_4abc8e9c': 'התראות בטיחות',
  't_e65d9385': 'חופשות',
  't_cd5a006c': 'חופשות עובדים',
  't_aa9d413f': 'יומן',
  't_f24b0cd2': 'יומן יומי דיגיטלי',
  't_b32e8211': 'יומן עבודה דיגיטלי',
  't_5163bd48': 'יציקת רצפת קומה 3',
  't_2920f5d7': 'יצירת משימות ואישורי-עובדים — קבלן',
  't_c9feeddc': 'כל כלי הניהול של אתר הבנייה במקום אחד.',
  't_cf8fddbf': 'כללי בטיחות כלליים',
  't_5d260a75': 'לוח זמנים אינטראקטיבי',
  't_a2e13a2f': 'לפני',
  't_b61c1f5a': 'מבנה האתר ההיררכי — לשיוך משימות למיקום מדויק.',
  't_4372ef25': 'מה בוצע היום באתר?',
  't_62001eae': 'מוכן להתחלה',
  't_ca2b7998': 'מזג אוויר: \${d.weather}',
  't_2455e561': 'מיקומים',
  't_71dbb55f': 'ממתין לתלויות',
  't_a99f71e5': 'משימה לא יכולה להתחיל לפני שהמשימות התלויות הושלמו.',
  't_ee83c634': 'משימות צוות',
  't_4ef2ef1e': 'נוכחות GPS',
  't_252eb409': 'ניהול אתר הבנייה',
  't_75dc85bb': 'סוג הביקורת:',
  't_190bfe24': 'סיכום אתר',
  't_17126238': 'סמן כבוצעה',
  't_14dc6183': 'סמן שהושלם',
  't_e088b46c': 'פרויקטים שהושלמו',
  't_66210c8a': 'פרויקטים שהושלמו — לעיון והפקת לקחים.',
  't_c2f5267d': 'צילום',
  't_02536b85': 'צילום חדש · \${caToday()}',
  't_0ca193d2': 'צילום לפני / אחרי',
  't_05fc4466': 'צילום לפני/אחרי',
  't_95b26021': 'צילום נוסף לתיעוד ✓',
  't_50bbb08d': 'קומה · דירה · חדר',
  't_b250794e': 'רישום נוסף ליומן ✓',
  't_1871a011': 'שיוך משימות למיקום',
  't_e88ef45a': 'שעון נוכחות',
  't_e155448e': 'תאריך: \${caToday()}',
  't_e3b26927': 'תדריך בטיחות יומי — חובה לפני תחילת העבודה.',
  't_150cc1b6': 'תדריך הבטיחות אושר',
  't_2abf6851': 'תדריך הבטיחות אושר ✓',
  't_97b78cfd': 'תדריך היום',
  't_a537d70b': 'תזכורות ביקורת',
  't_98883569': 'תזכורות לביקורות מפקח ורשויות.',
  't_83894f2c': 'תזמן',
  't_3803ac13': 'תיעוד התקדמות',
  't_0b4da618': 'תיעוד ויזואלי של ההתקדמות — השוואת מצב לפני ואחרי.',
  't_9bb4b168': 'תיעוד יומי של ההתקדמות, כוח האדם והאירועים באתר.',
  't_93765183': 'תלויות',
  't_45d3fd82': 'תלויות חומרים',
  't_45e3baba': 'תלויות חומרים בין משימות',
  't_9974b5d0': 'תרשים גאנט',
  't_fd1325d7': '⚙️ בפרודקשן: ארכיון פרויקטים מהשרת — כאן נתוני דמו',
  't_e7dfa7bb': '⚙️ בפרודקשן: מבנה האתר מסונכרן מהשרת — כאן מבנה דמו',
  't_3d30f644': '⚙️ בפרודקשן: תלויות מחושבות מלוח המשימות החי — כאן נתוני דמו',
  't_148c3c99': '⚙️ בפרודקשן: תמונות מהשטח מהשרת — כאן צילומי דמו',
  't_0f8a1ea5': '✓ הביקורת בוצעה',
  't_5c140482': '✓ קראתי ואישרתי את התדריך',
  't_8abe6a63': '✨ סכם התקדמות עם AI',
  't_d55313b1': '🏗️ ניהול אתר',
  't_ad8a3dfe': '🏢 מיקומים',
  't_91591d07': '📅 \${p.year} · \${p.units} יח״ד',
  't_ff21f844': '📓 יומן',
  't_1497b9e6': '📷 הוסף צילום חדש',
  't_d9e3eaf9': '📸 צילום',
  't_924ef3bb': '🔍 ביקורות',
  't_d8399d30': '🔗 תלויות',
  't_fd1975c4': '🗄️ ארכיון',
  't_ef2fd28b': '🦺 תדריך הבטיחות אושר',
  't_cb7007ba': ' key · ids == HomeSection.name). Empty layout ⇒
    // visibleIds == the default order with nothing hidden ⇒ BYTE-IDENTICAL.
    ref.watch(screenSectionsProvider);
    final order = ref
        .read(screenSectionsProvider.notifier)
        .visibleIds(kHomeScreenKey, kHomeSectionIds)
        .map(HomeSection.values.byName)
        .toList();
    // Org gate: the תכנון-חיבור hero is the ',
  't_0cd0ae39': ' landing in the "תוכן הבית" tile
/// layout, wired to real data + real navigation, and synced to the display
/// settings (theme/contrast/text-size/compact/image-size/grid-columns).
class SmartHomeBody extends ConsumerWidget {
  const SmartHomeBody({this.scrollCtrl, super.key});

  final ScrollController? scrollCtrl;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // screen-mgmt slice-3: the home renders through the UNIFIED per-screen model
    // (order + hide · ',
  't_7436afb2': ' module is off; מועדפים
    // carries no trailing gap (it was the last block).
    List<Widget> childrenFor(HomeSection s) => switch (s) {
          HomeSection.installHero => compatOn
              ? const [_InstallStudioHero(), SizedBox(height: BsTokens.space4)]
              : const <Widget>[],
          HomeSection.favorites => const [_Favorites()],
          // מאתר-על on the home (user request: shown OPEN, no entry card) —
          // the axis-dive wheel + its live gallery render in place, so the dive
          // happens right here. Gated on the const kAxisDive super-wheel, so an
          // off build tree-shakes it ⇒ byte-identical.
          HomeSection.superFinder => kAxisDive
              ? const [SizedBox(height: BsTokens.space4), _SuperFinderOpen()]
              : const <Widget>[],
          // 🎛️ קטלוג מגדיר on the home (user request: LIVE, shown OPEN) — the whole
          // catalog-config dive screen renders in place ALWAYS, like categories /
          // products. Turned on for everyone (no flag); the show/hide toggle in
          // "סידור מסך הבית" controls it like any section.
          HomeSection.catalogConfig => const [
              SizedBox(height: BsTokens.space4),
              _CatalogConfigOpen(),
            ],
          // 🃏 כרטיס פנימי on the home (owner: shown OPEN) — the full 13-section
          // internal product card renders in place. Gated on the const kInternalCard
          // so an off build tree-shakes it ⇒ byte-identical; turned on for the live
          // site via --dart-define=INTERNAL_CARD=true (like מאתר-על / kAxisDive).
          HomeSection.internalCard => kInternalCard
              ? const [SizedBox(height: BsTokens.space4), _InternalCardOpen()]
              : const <Widget>[],
          _ => [
              smartHomeSectionFor(s),
              const SizedBox(height: BsTokens.space4),
            ],
        };

    return ListView(
      controller: scrollCtrl,
      key: const Key(',
  't_af869d33': ' module; המלאי שלי is its
    // ',
  't_24af705b': '\${order.items} פריטים',
  't_09872f1c': '))
                : SingleChildScrollView(
                    child: FullInternalCard(product: hero)),
          ),
        ],
      ),
    );
  }
}

// ─── 🃏 כרטיס פנימי — the reorder-preview TOKEN (a compact card) ──────────────────
/// Lightweight stand-in in the home-reorder wizard (`smartHomeSectionFor`), where
/// the open 560px card would dwarf the drag rows. onTap opens the full card as a
/// route. The LIVE home renders [_InternalCardOpen].
class _InternalCardHero extends ConsumerWidget {
  const _InternalCardHero();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pal = _pal(context);
    return _Pad(
      child: InkWell(
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        onTap: () {
          final hero = catalogProductForSku(FullInternalCard.heroSku);
          if (hero == null) return;
          Navigator.of(context).push(MaterialPageRoute<void>(
            builder: (_) => Scaffold(
              appBar: AppBar(title: const Text(',
  't_8ba7b962': '),
          for (final r in rows)
            InkWell(
              borderRadius: BorderRadius.circular(cfgRadius(context)),
              onTap: r.tap,
              child: Container(
                margin: const EdgeInsets.only(bottom: BsTokens.space2),
                padding: const EdgeInsets.all(BsTokens.space3),
                decoration: BoxDecoration(
                  color: pal.card,
                  borderRadius: BorderRadius.circular(cfgRadius(context)),
                  border: Border.all(color: pal.border),
                ),
                child: Row(
                  children: [
                    Text(r.emoji, style: const TextStyle(fontSize: 22)),
                    const SizedBox(width: BsTokens.space3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(r.title,
                              style: TextStyle(
                                color: pal.ink,
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                              )),
                          const SizedBox(height: 2),
                          Text(r.sub,
                              style: TextStyle(color: pal.muted, fontSize: 12)),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_left, color: pal.muted),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ─── תכנון חיבור (Install Studio) ────────────────────────────────────────────────
class _InstallStudioHero extends ConsumerWidget {
  const _InstallStudioHero();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pal = _pal(context);
    return _Pad(
      child: InkWell(
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const InstallStudioScreen()),
        ),
        child: Container(
          padding: const EdgeInsets.all(BsTokens.space4),
          decoration: BoxDecoration(
            color: const Color(0x1AFF7A18),
            borderRadius: BorderRadius.circular(cfgRadius(context)),
            border: Border.all(color: const Color(0x33FF7A18)),
          ),
          child: Row(
            children: [
              const Icon(Icons.account_tree, color: BsTokens.brandDark, size: 32),
              const SizedBox(width: BsTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CfgText(',
  't_e050199f': ');

    // Per-section children with the SAME trailing spacing / compat-gate as the old
    // inline build, spread — so an empty layout ⇒ BYTE-IDENTICAL. installHero
    // (תכנון-חיבור) renders nothing when its ',
  't_05a09274': ',
        child: Opacity(
          opacity: dim ? 0.5 : 1,
          child: Container(
            decoration: BoxDecoration(
              color: pal.card,
              borderRadius: BorderRadius.circular(cfgRadius(context)),
              border: Border.all(color: pal.border),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: BsTokens.brand, size: 22),
                const SizedBox(height: 4),
                Flexible(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: Text(
                      label,
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: pal.ink,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (note != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Text(note!,
                        style: TextStyle(color: pal.muted, fontSize: 9)),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── מחלקות — FIXED 2-col nav grid, 2 rows (3 depts + "עוד"); DECOUPLED ───────────
// Departments are a stable navigation grid: a fixed 2 columns, ~2 rows (3
// departments + the "עוד" tile = 4 cells in 2×2), independent of the gridColumns
// display setting (which still drives the PRODUCT/מועדפים grids via m.cols).
class _Departments extends ConsumerWidget {
  const _Departments();

  /// Fixed column count for the department nav grid (NOT m.cols).
  static const int _deptCols = 2;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Raw shell: the const department names are BuildSmart content — the
    // departments TAB carries the derived (imported-catalog) grid instead.
    if (kProfileRawShell) return const SizedBox.shrink();
    final m = _metrics(context, ref);
    // 3 departments + the "עוד" tile = 4 cells fill a stable 2×2.
    // Only live departments render (owner decision — hide, not dim+"בקרוב");
    // non-live rows stay in `departments` for a one-line `live: true` re-enable.
    final depts = DepartmentsScreen.departments
        .where((d) => d.live)
        .take(_deptCols * 2 - 1)
        .toList();
    return _Pad(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _SectionTitle(',
  't_d8125dd2': '4 שלבים בסדר הנכון. כל שלב: עץ מוצרים + חלון "סדר הרכבה".',
  't_2c77ee76': ';

// ════════════════════════════════════════════════════════════════════════════
// Settings-synced smart-home (#32). The home honours the display settings the
// rest of the catalog does:
//   • ערכת נושא (light/dark) + ניגודיות גבוהה → via Theme.of(context) colours.
//   • גודל טקסט → global MediaQuery textScaler; tile/row heights grow with it
//     so text never clips.
//   • מצב קומפקטי + גודל תמונות → a size factor on cards/images.
//   • עמודות בתצוגת רשת (gridColumns) → grid crossAxisCount.
//   • הנפשות מופחתות → the home has no animations (nothing to reduce).
// ════════════════════════════════════════════════════════════════════════════

/// Theme-resolved palette (carries light/dark + high-contrast from [ThemeData]).
typedef _Pal = ({Color card, Color ink, Color muted, Color border, Color box});

_Pal _pal(BuildContext c) {
  final cs = Theme.of(c).colorScheme;
  final dark = Theme.of(c).brightness == Brightness.dark;
  return (
    card: cs.surface,
    ink: cs.onSurface,
    muted: cs.onSurface.withOpacity(0.62),
    border: cs.onSurface.withOpacity(dark ? 0.18 : 0.10),
    box: cs.onSurface.withOpacity(0.06),
  );
}

/// Size metrics resolved from the catalog display settings + text scaler.
class _Metrics {
  _Metrics(BuildContext c, CatalogSettings s)
      : cols = s.gridColumns.clamp(2, 6),
        compact = s.compactMode,
        _img = switch (s.imageSize) {
          CatalogImageSize.small => 0.85,
          CatalogImageSize.medium => 1.0,
          CatalogImageSize.large => 1.18,
        },
        ts = MediaQuery.textScalerOf(c).scale(1.0).clamp(1.0, 1.4);

  final int cols;
  final bool compact;
  final double _img;
  final double ts;

  double get _base => compact ? 0.82 : 1.0;

  /// Card width for the horizontal rows (עץ חכם / orders).
  double cardW(double base) => base * _base * _img;

  /// Row height — grows with text scale so labels never clip.
  double rowH(double base) => base * _base * _img * ts;

  /// Fixed grid-tile height (independent of column count) — grows with text so
  /// labels never clip, shrinks in compact mode.
  double get tileH => (compact ? 86.0 : 104.0) * ts;
}

_Metrics _metrics(BuildContext c, WidgetRef ref) =>
    _Metrics(c, ref.watch(catalogSettingsProvider));

/// Builds the wired smart-home section widget for a reorderable [HomeSection].
/// Shared by [SmartHomeBody] (the live home) AND the reorder-preview screen
/// (home_content_reorder.dart), so the reorder UI previews the REAL sections.
Widget smartHomeSectionFor(HomeSection s) => switch (s) {
      HomeSection.categories => const _Departments(),
      HomeSection.products => const _SmartTreeRow(),
      HomeSection.workPath => const _WorkPath(),
      HomeSection.promise => const _QuickTools(),
      HomeSection.reorderHistory => const _RecentOrders(),
      HomeSection.installHero => const _InstallStudioHero(),
      HomeSection.favorites => const _Favorites(),
      HomeSection.superFinder => const _SuperFinderHero(),
      HomeSection.catalogConfig => const _CatalogConfigHero(),
      HomeSection.internalCard => const _InternalCardHero(),
    };

/// 🏠 גוף מסך-הבית החכם (task #32) — the ',
  't_f36e36ca': ';
    return Container(
      width: width,
      padding: const EdgeInsets.all(BsTokens.space3),
      decoration: BoxDecoration(
        color: pal.card,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        border: Border.all(color: pal.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              alignment: Alignment.center,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                color: pal.box,
                borderRadius: BorderRadius.circular(cfgRadius(context)),
              ),
              child: rec.imageAsset != null
                  ? productImage(
                      rec.imageAsset!,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) =>
                          Text(p.emoji, style: const TextStyle(fontSize: 28)),
                    )
                  : Text(p.emoji, style: const TextStyle(fontSize: 28)),
            ),
          ),
          const SizedBox(height: 6),
          Text(p.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: pal.ink,
                fontWeight: FontWeight.w800,
                fontSize: 13,
              )),
          Text(p.cat,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: pal.muted, fontSize: 10)),
          const SizedBox(height: 2),
          Text(priceLabel,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: BsTokens.brandDark,
                fontWeight: FontWeight.w800,
                fontSize: 13,
              )),
          const SizedBox(height: 6),
          SizedBox(
            height: 30,
            // composite-hide: whole הוסף-לסל button gone when the org hides
            // this element (add-to-cart action → critical:false).
            child: CfgVisible(
              ',
  't_2acf837d': 's AppBar
    // (kToolbarHeight) + bottom-nav (58 · main.dart `_kHomeNavHeight`) + the OS
    // safe-areas. Earlier `screen − statusBar` overshot by the app-bar + nav and
    // slid behind them (top row + bottom cut · owner "נחתך באמצע"). Now it fits and
    // scrolls INSIDE — never clipped by the shell chrome.
    const kShellAppBar = kToolbarHeight; // _HomeAppBar preferredSize
    const kShellBottomNav = 58.0; // home_shell.dart _BottomNav (main _kHomeNavHeight)
    final media = MediaQuery.of(context);
    final avail = media.size.height -
        media.padding.top -
        media.padding.bottom -
        kShellAppBar -
        kShellBottomNav;
    return SizedBox(
      height: avail > 360 ? avail : 360,
      child: const CatalogConfigScreen(),
    );
  }
}

// ─── 🎛️ קטלוג מגדיר — the reorder-preview TOKEN (a compact card) ───────────────────
/// The lightweight stand-in for the wizard',
  't_ff52a96d': 's own
                    // favorites row (_FavProductRow) — siblings scoped to the
                    // same category.
                    onTap: () => showLipskeyProductSheet(
                      context,
                      p,
                      ref
                          .read(catalogRepositoryProvider)
                          .allProducts()
                          .where((q) => q.categoryHe == p.categoryHe)
                          .toList(),
                    ),
                  ),
              ],
            ),
        ],
      ),
    );
  }
}

// ─── הזמנות אחרונות — same card style as עץ חכם ───────────────────────────────────
class _RecentOrders extends ConsumerWidget {
  const _RecentOrders();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final m = _metrics(context, ref);
    final orders = ref.watch(sysOrdersProvider);
    if (orders.isEmpty) {
      return _Pad(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: const [
            _SectionTitle(',
  't_5b848bc2': 't
    // there (same rule as the empty עץ-חכם strip above).
    if (rows.isEmpty) return const SizedBox.shrink();
    return _Pad(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _SectionTitle(',
  't_91d3717d': 'בחר מה לחבר — נכין רשימת קנייה תקנית ונבדוק את החיבור',
  't_aa173e83': 'גלגל-חיפוש-על — בחר מאיזה ציר להתחיל',
  't_8e1d8653': 'גמר אמבטיה — מלווה אותך שלב-שלב',
  't_8189984c': 'הזמנות אחרונות לאתר',
  't_1877602a': 'חלק משימות לעובדים ועקוב אחרי הביצוע',
  't_5b4b44ba': 'כל המנוע במקום אחד — 13 סקציות',
  't_c6bd2f3a': 'כלים מהירים',
  't_0b594e68': 'כרטיס-הגדרה לכל מוצר — תמונה + גלגלים',
  't_e955059f': 'מה כבר יש לך — במחסן ובאתר',
  't_860d9a12': 'מסלול עבודה חכם',
  't_e3df5d75': 'סרוק תוכנית עבודה',
  't_e163a18a': 'עדיין אין הזמנות — לאחר הראשונה היא תופיע כאן.',
  't_47ee1ffd': 'עדיין אין מועדפים — סמן ☆ על מוצר והוא יופיע כאן.',
  't_16a821e1': 'צלם שרטוט אינסטלציה — נזהה מה צריך להזמין',
  't_0bf29d61': '🃏 כרטיס פנימי',
  't_096029d4': '🌳 עץ חכם — אינסטלציה',
  't_2ebdec94': '🎛️ קטלוג מגדיר',
  't_cfce68a6': '🕸️ מאתר-על',
  't_5afdba83': '🛁 חדש — מאפס עד גמר',
  't_9b808527': '\$done מתוך \$total ימים בוצעו · \$pct%',
  't_949f3a97': '\${active.name} — מאפס עד מסירה',
  't_64364968': '\${stage.totalDays} ימי עבודה',
  't_8975849e': ';

/// Open the פרויקט חכם screen — the wire target for `openSmartProject`.
void openSmartProject(BuildContext context) =>
    Navigator.of(context).push(SmartProjectScreen.route());

class SmartProjectScreen extends ConsumerStatefulWidget {
  const SmartProjectScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const SmartProjectScreen());

  @override
  ConsumerState<SmartProjectScreen> createState() => _SmartProjectScreenState();
}

class _SmartProjectScreenState extends ConsumerState<SmartProjectScreen> {
  String? _expanded; // expanded day-stage key (proto `expandedStage`)
  final _scroll = ScrollController();
  final List<GlobalKey> _cardKeys = [];

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final done = ref.watch(smartProjectProvider);
    final progress = ref.watch(smartProjectProgressProvider);
    final stages = buildDayStages();
    final active = ref.watch(activeProjectProvider);
    final title = active.name.isEmpty
        ? ',
  't_849b95bf': 'אין ימי עבודה בתוכנית',
  't_fcecc670': 'בוצע',
  't_8c09fbe4': 'בחר יום',
  't_d7bf3304': 'היקף',
  't_f006cf8d': 'הסימון בוטל',
  't_e33e3af4': 'יום \${i + 1} · \${stages[i].name}',
  't_32349a92': 'יום עבודה סומן כבוצע',
  't_616ed7a2': 'כשתוגדר תוכנית עבודה — ימי העבודה יופיעו כאן',
  't_62ee04dd': 'לא בוצע',
  't_6e667e23': 'לא שובץ',
  't_e49833ee': 'עברת ליום \${i + 1}',
  't_ff03cc3c': 'עובד אחראי',
  't_5c980a09': '↩ בטל סימון',
  't_ba4c435e': '✓ סמן יום כבוצע',
  't_a6b792e0': '🎉 כל ימי העבודה בוצעו — הפרויקט הושלם!',
  't_9a4e5435': '📅 בחר יום',
  't_31773c17': 's ONLY job is to PHRASE that
// pre-computed verdict in a friendly Hebrew sentence, grounded on the verified
// fields passed in the prompt — it never decides and never invents a number.
//
// Gated by `claudeGatewayProvider` (null unless `useFirebaseBackend && kClaudeAi`):
// OFF → the deterministic verdict still shows, with an honest "הסבר-AI דורש חיבור"
// note instead of the phrased explanation. So the demo/test build is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_26c91f82': 's spec was bridged from a company import (kCompanySpecSkus)
/// rather than hand-verified — the wording must then say so, not claim "מאומת".
bool _isCompanySpec(String sku) => kCompanySpecSkus.contains(sku);

/// The verified temperature verdict for [product] at [tempC] — pure, the single
/// source of truth (`VerifiedSpec.suitableForTemp`). `ok` is null when the product
/// has no verified spec (we then can',
  't_c57f8ce1': 'אין מפרט מאומת למוצר זה — לא ניתן לקבוע.',
  't_b98de1c7': 'אל תמציא נתונים ואל תסתור את התשובה הדטרמיניסטית.',
  't_5d870613': 'אתה עוזר-מפרט לאינסטלטור. ענה במשפט אחד קצר בעברית בלבד, מבוסס אך ורק על ',
  't_846d8acd': 'דירוג-לחץ: \${spec.pressureRating}. ',
  't_06419cd3': 'הנתונים המאומתים שניתנו. לעולם אל תמציא מספרים ואל תסתור את התשובה הנתונה.',
  't_bab04137': 'הסבר לי',
  't_24d4a80b': 'השאלה: האם הוא מתאים לקו של \$tempC°C? ',
  't_e4485cef': 'התשובה הדטרמיניסטית (חושבה מראש): \${ok ? ',
  't_5530f57b': 'טמפרטורת הקו:',
  't_29833e12': 'טמפ׳ מקסימום לפי נתוני היבוא',
  't_d158f794': 'טמפ׳-מקסימום מאומתת',
  't_21a2d9d6': 'לא',
  't_abd8d72d': 'מוצר: \${product.nameHe}. חומר: \${spec.material}. ',
  't_75c4a1cd': 'מנסח הסבר…',
  't_bd6099f8': 'נסח את התשובה הזו במשפט אחד קצר וברור בעברית, כולל המספרים. ',
  't_365c0c0a': '✓ כן — מחזיק \$_temp°C (מקס׳ לפי נתוני היבוא \${v.maxTempC!.toInt()}°C)',
  't_d09635f3': '✓ כן — מחזיק \$_temp°C (מקס׳ מאומת \${v.maxTempC!.toInt()}°C)',
  't_7b4ca032': '✗ לא — מעבר למקס׳ המאומת (\${v.maxTempC!.toInt()}°C)',
  't_83368829': '✗ לא — מעבר למקס׳ לפי נתוני היבוא (\${v.maxTempC!.toInt()}°C)',
  't_a81c65af': '🌡️ מתאים לתנאים שלי?',
  't_c584f35b': '💡 הסבר-AI דורש חיבור לשרת.',
  't_3a42787d': ', style: TextStyle(fontSize: 20)),
          ),
        ],
      ),
      body: Column(
        children: [
          // section title (📦 המלאי שלי)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Align(
              alignment: AlignmentDirectional.centerStart,
              child: CfgText(
                ',
  't_0a5b9765': 'איטום ההברגות',
  't_3d75e97b': 'איטום סניטרי עמיד מים',
  't_0f338896': 'אין פריטים באתר',
  't_4c54eb84': 'באתר',
  't_8e4ccc80': 'בקשות חומר',
  't_d8aa05bd': 'ברז זוויתי לכיור 1/2"',
  't_005de1ac': 'ברז ניל זוויתי 1/2"',
  't_8c291b0f': 'המחסן ריק',
  't_e8816f29': 'הפריט הועבר',
  't_a296ecdd': 'חיבור הברז לקו המים',
  't_45e43873': 'חיבור והסטה של הצנרת',
  't_7ea0cb57': 'מחברים וזוויות',
  't_0c60dcba': 'מניעת נזילות בחיבור',
  't_2be27229': 'סיליקון סניטרי',
  't_b5394d41': 'סיליקון סניטרי שקוף',
  't_18b53515': 'סמן פריטים כ"\${warehouse ? ',
  't_1e9ff456': 'סרט טפלון',
  't_27a64874': 'סרט טפלון (גליל)',
  't_c23d9684': 'סרט טפלון לאיטום',
  't_85a8499d': 'קיבוע לקיר',
  't_9ac33ee1': '↤ למחסן',
  't_2f0a1a63': '↦ לאתר',
  't_d870edaa': '🏗️ האתר',
  't_84638c16': '🏬 המחסן',
  't_2dbc92fd': '💡 כשתסמן פריט כ"במחסן" או "באתר" בעץ המוצרים — הוא יופיע כאן.',
  't_f2c20c77': '📦 המלאי שלי',
  't_b3628e28': ' · 🚚 הוכן ב-\${fulfillment.splitInto} חבילות',
  't_345b78b3': ' — #83).
/// #80 — the מלאי tab carries a catalog-backed inventory (name+מק"ט+category,
/// merged with the live order-line products) behind one smart search field
/// matching name OR sku OR category.
/// #82 — the settings IconButton routes to the supplier-specific
/// [SupplierSettingsScreen] (business profile, persisted), and the AppBar
/// carries the per-username notifications bell (reusing
/// [workerNotifsProvider] — the same store the courier',
  't_c01af5b3': '"\${item.name}" יוסר מהמלאי ומהקטלוג — פעולה בלתי הפיכה.',
  't_cd1ad4fd': '\${order.items} פריטים · \${fMoney(order.sum)} · הקש לתעודת ליקוט',
  't_955139e4': '\${order.items} פריטים · \${fMoney(order.sum)} · הקש לתעודת ליקוט\$splitTag',
  't_21d331bf': ').trim(),
      ),
    );
    final storeName =
        businessName.isNotEmpty
            ? businessName
            : (session.displayName.trim().isNotEmpty
                ? session.displayName.trim()
                : _store.name);
    // Giant-system V2 — the `chat` module gate, watched ONCE here in build()
    // (the home_shell precedent); the nav row + body below use the captured
    // boolean. Index safety (the updates_screen clamp precedent): the שיחות
    // pane sits at index 2 and `_tab` may still hold it (a stale value from
    // before the org turned chat off), so with `chat` off the EFFECTIVE index
    // clamps to 0 (בית) — the hidden pane is unreachable and the cell indices
    // 0–4 never renumber. All-on: `tab == _tab`, byte-for-byte behavior.
    final chatOn = modOn(ref, ',
  't_f6f6cb1f': ');
  }

  // ── Tab 1 · מלאי (stock management, #79/#80) ────────────────────────────────
  Widget _stockTab() {
    final oos = ref.watch(storeOosProvider);
    final oosNotifier = ref.read(storeOosProvider.notifier);
    final base = _inventory;
    final total = base.length;
    final outN = oos.length;
    final inN = base.where((i) => !oos.contains(i.name)).length;
    final q = _stockSearch;

    bool textMatch(_InvItem i) {
      if (q.isEmpty) return true;
      return i.name.contains(q) ||
          (i.sku?.contains(q) ?? false) ||
          (i.category?.contains(q) ?? false);
    }

    bool statusMatch(_InvItem i) {
      switch (_stockFilter) {
        case ',
  't_e3856000': ',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontWeight: FontWeight.w800,
              fontSize: 20,
            ),
          ),
          actions: [
            // #31 — 💡 enters "מצב היכרות"; the wrapped controls then explain
            // themselves in a bubble (the 💡 + ✕ stay tappable to toggle/exit).
            const HelpToggleButton(),
            // #82 — the supplier bell: per-username runtime notifications off
            // the shared [workerNotifsProvider] (the courier',
  't_1a084629': ':
          return oos.contains(i.name);
        default:
          return true;
      }
    }

    // #80 — pro search: the live trading inventory first; a non-empty query
    // ALSO searches the FULL unified catalog (name + מק"ט + category) so the
    // supplier can find and toggle any real catalog product.
    final matched = <_InvItem>[...base.where(textMatch)];
    final baseMatchedCount = matched.length;
    var catalogMatchTotal = 0;
    if (q.isNotEmpty) {
      final names = {for (final i in matched) i.name};
      // stage-3.1 — follows the ACTIVE catalog source (v2-aware).
      for (final p in resolvedCatalogProducts) {
        if (names.contains(p.nameHe)) continue;
        if (p.nameHe.contains(q) ||
            p.sku.contains(q) ||
            p.categoryHe.contains(q)) {
          catalogMatchTotal++;
          if (matched.length < _kStockShownCap) {
            names.add(p.nameHe);
            matched.add(
              _InvItem(name: p.nameHe, sku: p.sku, category: p.categoryHe),
            );
          }
        }
      }
    }
    final filtered = matched.where(statusMatch).toList();
    final shown = filtered.take(_kStockShownCap).toList();
    // Honest "more results exist" count: catalog matches that were not added
    // (beyond the cap) + matched rows truncated by the cap after filtering.
    final hiddenCount =
        (filtered.length - shown.length) +
        (catalogMatchTotal - (matched.length - baseMatchedCount));

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        BsTokens.space4,
        BsTokens.space3,
        BsTokens.space4,
        BsTokens.space5,
      ),
      children: [
        Row(
          children: [
            _Stat(value: ',
  't_50b82ff7': ';

  /// שעות-פעילות is NOT part of the cross-file [StoreProfile] contract
  /// (businessName/phone/address/businessId/logo) — it stays on the legacy
  /// [supplierSettingsProvider] seam as its single remaining owner, and is
  /// committed once on save (so the legacy record — which may still hold the
  /// pre-migration logo bytes — is never re-serialized per keystroke).
  String _hours = ',
  't_94354816': ';

/// #31 — "מצב היכרות" copy for the store board',
  't_4eb0901b': ';

class StoreDashboardScreen extends ConsumerStatefulWidget {
  const StoreDashboardScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const StoreDashboardScreen());

  static final List<KbToolNode> _kbNodes = kbStoreDashboardNodes();

  @override
  ConsumerState<StoreDashboardScreen> createState() =>
      _StoreDashboardScreenState();
}

class _StoreDashboardScreenState extends ConsumerState<StoreDashboardScreen> {
  /// #77/#78 — 0 בית (the הזמנות pipeline, default) · 1 מלאי · 2 שיחות ·
  /// 3 פורטל · 4 אזור אישי (#87.5).
  int _tab = 0;
  String _orderFilter =
      ',
  't_2a4db334': 's ProfileScreen (F-19); the
/// AppBar title reflects the live business-profile override
/// ([storeProfileProvider] — F-20).
///
/// Reached from the role picker ("מי אתה?" → חנות ספק). Orders are the shared
/// [sysOrdersProvider] state, so an order the store marks "מוכן" appears live
/// in the courier app. R8 — every string/number is verbatim from
/// `supplier_data.dart`.
/// 🏪 חנות · בית — the reorderable/hideable CARD sections of the store home
/// (screen-mgmt slice-5c). Ids == enum name, so the wizard',
  't_b2a65831': 's business profile (#82, LEGACY — see the section note):
/// שם-עסק / ח.פ. / טלפון / כתובת / שעות-פעילות / לוגו (a REAL captured
/// data-URL via [pickTaskPhoto], or null).
class SupplierProfile {
  const SupplierProfile({
    this.businessName = ',
  't_11b28cac': 's full list).
  List<SysOrder> _scopeOrders(List<SysOrder> orders) {
    final ids = ref.watch(visibleOrderIdsProvider);
    if (ids == null) return orders;
    return orders.where((o) => ids.contains(o.id)).toList();
  }

  List<_InvItem> get _inventory {
    final seen = <String>{};
    final out = <_InvItem>[];
    for (final o in _scopeOrders(ref.watch(sysOrdersProvider))) {
      for (final l in o.lines) {
        if (seen.add(l.name)) {
          final p = _catalogByName[l.name];
          out.add(_InvItem(name: l.name, sku: p?.sku, category: p?.categoryHe));
        }
      }
    }
    for (final p in ref.watch(storeProductsProvider)) {
      if (seen.add(p.name)) {
        out.add(
          _InvItem(
            name: p.name,
            sku: p.sku,
            category: p.category,
            overlayId: p.id,
          ),
        );
      }
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    // task #65 · חוק: מבחוץ לא רואים כלום — without a store [BoardSession]
    // ONLY the gate (the registration screen in role mode) is built; a
    // successful login flips [boardAuthProvider] and this build swaps to the
    // real board in place. logout() swaps it back to the gate.
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.store) {
      return const WelcomeScreen(boardRole: BoardRole.store);
    }
    // F-44 — sysOrdersProvider is deliberately NOT watched here: the
    // order-reading tabs watch it themselves (_homeTab/_stockTab), so an
    // order mutation no longer rebuilds the whole Scaffold while the
    // שיחות/פורטל/אזור-אישי tabs are showing.
    //
    // #87.1 (F-20) — the board identity reflects the business-profile
    // override. Honest fallback chain: businessName → session.displayName →
    // the kStores demo seed (a documented seed, not real business data).
    final businessName = ref.watch(
      storeProfileProvider.select(
        (m) => (m[session.username]?.businessName ?? ',
  't_1c7acbc9': 's own שיחות tab: the shared cross-persona engine
        // under the ',
  't_cc610932': 's personal area body (store_profile_screen.dart);
        // it gates itself on session+role like every personal screen.
        return const StoreProfileBody();
      default:
        return _homeTab(storeName);
    }
  }

  // ── Tab 0 · בית — action-first header + the הזמנות pipeline (#78) ──────────
  Widget _homeTab(String storeName) {
    // F-44 — the orders watch lives HERE (tab-scoped), not in the main build:
    // while another tab is showing, this method never runs, so the dependency
    // is dropped and order mutations don',
  't_8c31537e': 's אישור-מסירה sheet
/// captures through the camera seam). A real photo renders as a ≥48dp
/// tappable thumbnail (full-screen [showFullPhotoDialog] with an explicit X);
/// no photo keeps the honest ',
  't_64e5ddcb': 's מק"ט + category when the name
  /// matches a real catalog product (no invented SKUs — a non-catalog line
  /// honestly shows ',
  't_4a57a35c': 't silently advance two stages.
    SysOrder? current;
    for (final x in ref.read(sysOrdersProvider)) {
      if (x.id == o.id) {
        current = x;
        break;
      }
    }
    if (current == null || current.stage != o.stage) return;

    // The store now owns the hand-off too (ready→pickup, "מסור לשליח"); the
    // courier takes over from `pickup` (two-step hand-off).
    ref.read(sysOrdersProvider.notifier).storeAdvance(o.id);
    showToast(context, ',
  't_0de3a2c3': 'אזלו',
  't_dc4d07b8': 'אין לוגו עדיין — צלמו או העלו אחד',
  't_2458858e': 'א׳-ה׳ 07:00-17:00...',
  't_add8b253': 'בחרו קטגוריה למוצר',
  't_e7b374d3': 'הגדרות החנות — פרופיל-העסק, התראות והעדפות.',
  't_5e306c31': 'ההזמנה \${order.id} תימסר לשליח — פעולה סופית.',
  't_8fca4808': 'ההסרה נכשלה — נסו שוב',
  't_c290a658': 'הזמנות ממתינות לאישור',
  't_8a033f8e': 'הזמנות ממתינות לבחירת הקבלן',
  't_6eedc8d4': 'הזמנת הדגמה \$id נוצרה — נכנסה לתור ✓',
  't_4585af1b': 'הלוגו הוסר',
  't_43215574': 'הלוגו השמור יימחק — ניתן לצלם חדש בכל רגע.',
  't_646950ec': 'המוצר "\${p.name}" נוסף למלאי ✓',
  't_3af9b485': 'המוצר הוסר',
  't_bd45aeb9': 'המוצר יישמר, יופיע ברשימת המלאי ויסומן בקטלוג כ"\$kSupplierAddedTag"',
  't_44be6712': 'המק"ט כבר בשימוש',
  't_7fc50606': 'הפרופיל העסקי — פרטי החנות, תעודות, מסמכים ותלושים.',
  't_3ae63f51': 'הפרטים נשמרים לחשבון @\$username בלבד — בלחיצת שמירה',
  't_682f7ae2': 'הצ׳אטים שלך — קבלנים, שליחים, מנהל וקבוצת הספקים.',
  't_f0a7632c': 'הקש כדי לאשר ולהתחיל הכנה',
  't_c91f0615': 'השמירה נכשלה — ייתכן שהלוגו גדול מדי',
  't_4d8fa5a1': 'התנתקות',
  't_3619d0ae': 'התנתקות מהחשבון',
  't_357de02d': 'ומהשליחים. התג האדום מציין כמה לא נקראו.',
  't_9a0f845d': 'זמינים',
  't_1352b473': 'חובה להזין מק"ט',
  't_c1b53087': 'חובה להזין שם מוצר',
  't_0bbd90b7': 'חיפוש לפי שם, מק"ט או קטגוריה...',
  't_6a0b8532': 'יציאה מהלוח חזרה למסך הקודם — אינה מנתקת אותך מהחשבון.',
  't_2e8b1dd4': 'לא ניתן להוסיף — בדקו את השדות',
  't_2a428065': 'לא נמצאו מוצרים תואמים.',
  't_40aa81ec': 'לא נקרא',
  't_c5a6f63f': 'לאישור',
  't_5de64bbb': 'לדוגמה: ברז גן 1/2"...',
  't_4206d817': 'להסיר את הלוגו?',
  't_d9df866f': 'להסיר את המוצר?',
  't_49e1ff76': 'לוגו העסק',
  't_6a7dcc2a': 'ללא POD',
  't_ab01288b': 'ללא POD — לא צולם אישור מסירה',
  't_7624df0f': 'ללא מק"ט',
  't_8531d80a': 'ללא מק"ט בקטלוג',
  't_afd875eb': 'מוכן לאיסוף 📦',
  't_8dc5d923': 'מוכנות',
  't_12da6695': 'מוצגות \${shown.length} תוצאות ראשונות (עוד \$hiddenCount בקטלוג) — דייקו את החיפוש',
  't_2d951163': 'מוצר בשם הזה כבר נוסף',
  't_229ce3fe': 'מוצר בשם הזה כבר קיים בקטלוג',
  't_d5b6fb7e': 'מחזור פעיל 💰',
  't_e4feb568': 'מחזור שנמסר 💰',
  't_a3236015': 'מסור',
  't_e8665b8e': 'מסירה לשליח?',
  't_1fb24cbf': 'מסך הבית — ההזמנות הנכנסות מהקבלנים והסטטוס שלהן במבט אחד.',
  't_a81432a6': 'מרכז הכלים של החנות — דירוג, יעדי-SLA, אזורי-חלוקה, הנחות וברקודים.',
  't_d484014d': 'מתנתק מחשבון החנות — לא רק יציאה מהמסך; חוזרים למסך הכניסה.',
  't_50114c32': 'ניהול מלאי החנות — מוצרים, מחירים, זמינות והוספת מוצר חדש.',
  't_a7cbd6f7': 'ניהול צי רכב',
  't_8f77f818': 'נייד ישראלי: 10 ספרות שמתחילות ב-05',
  't_96ac9ea8': 'נמסרו',
  't_dc5d8ef6': 'נמסרו ✓',
  't_7ed81653': 'סומן כאזל במלאי',
  't_a1bc0ab4': 'סומן כזמין במלאי',
  't_4a4b6f98': 'עדכון מלאי',
  't_828fb7a1': 'פעמון ההתראות — הזמנות חדשות, חוסרים ועדכונים מהקבלנים ',
  't_d23f05c6': 'פרופיל עסקי',
  't_03a3218c': 'פריט חסר',
  't_15c2ea0e': 'פריט חסר — ממתין להחלטה (החלפה / ביטול)',
  't_14e8d150': 'קוד המוצר אצלכם...',
  't_2b5c40bd': 'קיצור לאזור האישי של העסק — פרטי החנות, תעודות ומסמכים.',
  't_0bf53105': 'שומר…',
  't_adeab845': 'שלום 👋',
  't_adedbbfc': 'שם המוצר',
  't_dbe19460': '⏳ פריט חסר — אנא המתן להחלטת הקבלן',
  't_871cafbe': '⚠️ \$outCount מוצרים אזלו מהמלאי — הקש לעדכון',
  't_c920559f': '✅ זמין במלאי',
  't_9cf6068a': '✓ אין הזמנות שממתינות לאישור',
  't_71b3d1a7': '✓ כל המוצרים זמינים במלאי',
  't_e6a8193a': '✓ נמסר לשליח',
  't_55ce61b1': '✓ תיקון בוצע — בדוק שינויים',
  't_79170a69': '❌ אזל מהמלאי',
  't_30d49537': '➕ הוסף מוצר',
  't_4c5a37be': '➕ הוסף מוצר חדש',
  't_c091b441': '➕ סימולציית הזמנה נכנסת (כלי הדגמה)',
  't_8801ce2b': '🏪 \$storeName — מה שצריך טיפול עכשיו',
  't_f6261c2f': '🏪 הגדרות ספק',
  't_46f2d0b8': '🏷️ מק"ט \${item.sku}\${item.category != null ? ',
  't_8cbad86d': '💾 שמור פרופיל',
  't_3c769a1b': '📥 הזמנות',
  't_ed0ce374': '📦 סמן כמוכן — העבר לשליח',
  't_aa44e70d': '📸 אישור מסירה נשמר ✓\${signed ? ',
  't_8b7d5a7f': '🕒 נדרש: בתיאום',
  't_96eae4f7': '🗑️ הסר לוגו',
  't_1f32fdc7': '🛵 מסור לשליח',
  't_b77bfff0': ' state on
/// every row. Real invoices / monthly reports REQUIRE the billing server —
/// no fake PDFs, NO invented amounts, no invoice numbers (אין המצאות: not a
/// single business field is rendered).
///
/// SERVER-SWAP: each month row becomes a tappable invoice / monthly-report
/// download once the billing backend lands; the list/row layout below stays
/// as-is.
Future<void> showStoreDocumentsSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Theme.of(context).colorScheme.surface,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius:
          BorderRadius.vertical(top: Radius.circular(BsTokens.radiusCard)),
    ),
    // Explicit RTL on every modal sheet (the sheets convention, F-46).
    builder: (sheetCtx) => const Directionality(
      textDirection: TextDirection.rtl,
      child: _DocumentsSheetBody(),
    ),
  );
}

/// Hebrew month names (calendar labels, not business data).
const List<String> _kHebMonths = [
  ',
  't_28b7bbc6': ';

/// 🧾 מסמכים — חשבוניות ודוח חודשי (#87.4, F-24) — SERVER-READY sheet for the
/// supplier board, in the exact honest pattern of `worker_payslips_sheet.dart`
/// (which is untouchable + worded for payslips, so it cannot be reused here):
/// the complete 12-month UI with an honest ',
  't_cc772b96': '🔌 החשבוניות והדוחות האמיתיים יחוברו עם חיבור השרת — ',
  't_a4f6e4dd': '🧾 חשבוניות ודוח חודשי',
  't_aaad60c5': ' = fallback כן (displayName של ה-session / seed החנות, F-20).
            businessName: _name.text.trim(),
            phone: phone,
            address: _address.text.trim(),
            businessId: bid,
            logo: _logo,
          ),
        );
    if (!mounted) return;
    if (!ok) {
      setState(() => _saving = false); // מאפשר retry עם תמונה קטנה יותר
      showToast(context, ',
  't_93cde2f0': ' אחיד, וכפתור ✏️ שפותח את sheet העריכה.
class _StoreIdentityCard extends StatelessWidget {
  const _StoreIdentityCard({required this.session, required this.profile});

  final BoardSession session;
  final StoreProfile profile;

  @override
  Widget build(BuildContext context) {
    // F-20 — שם-עסק override; ריק → displayName של ה-session (ליפסקי).
    final name = profile.businessName.isNotEmpty
        ? profile.businessName
        : session.displayName;
    final meta = [
      if (profile.businessId.isNotEmpty) ',
  't_4fbffa86': ') נזרק בבניית הטאב.
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        clipBehavior: Clip.antiAlias,
        child: Column(
        children: [
          ListTile(
            leading: const Text(',
  't_b5a10b2a': ');

    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          _StoreLogoAvatar(logo: profile.logo, size: 56),
          const SizedBox(width: BsTokens.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        name,
                        // F-41 — שם ארוך לא מנפח את הכרטיס.
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: BsTokens.inkLight,
                          fontWeight: FontWeight.w800,
                          fontSize: 18,
                        ),
                      ),
                    ),
                    if (session.demo) ...[
                      const SizedBox(width: BsTokens.space2),
                      // צ',
  't_2aad4477': ');
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    // עטיפת RTL מפורשת — חוק ה-sheets (F-46).
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Padding(
        // שומר את השדות מעל המקלדת.
        padding:
            EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(BsTokens.radiusCard),
            ),
          ),
          child: SafeArea(
            top: false,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(BsTokens.space4),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: CfgText(
                          ',
  't_293db9b8': ',
                      errorText: _phoneError,
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: BsTokens.space3),
                  // ── כתובת ──
                  TextField(
                    controller: _address,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: ',
  't_f1a0c6f4': ',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: BsTokens.mutedLight,
                      fontSize: 13,
                    ),
                  ),
                ],
                // 📞/💬 — call or WhatsApp this supplier (hidden when no phone).
                ContactActions(phone: profile.phone),
              ],
            ),
          ),
          // #87.1 — פותח את עורך פרופיל-העסק (IconButton ≥48dp).
          IconButton(
            tooltip: ',
  't_53ae784b': ',
                  label: kOrderStageLabel[s]!,
                ),
            ],
          ),
          const SizedBox(height: BsTokens.space3),
          // מחזור פעיל (new+preparing+ready) לצד מחזור שהושלם (delivered) —
          // שניהם Σ של o.sum בלבד (שדה המנוע, orders_engine.dart:51).
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(BsTokens.space3),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEDEDED)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  ',
  't_460202ff': ',
            icon: const Icon(Icons.edit_outlined, color: BsTokens.mutedLight),
            onPressed: () =>
                showStoreProfileEditSheet(context, session: session),
          ),
        ],
      ),
    );
  }
}

/// אווטאר החנות — לוגו data-URL שמור (Image.memory בעיגול, פענוח הגנתי דרך
/// decodeDataUrlPhoto) או דיסקת 🏪.
class _StoreLogoAvatar extends StatelessWidget {
  const _StoreLogoAvatar({required this.logo, required this.size});

  final String? logo;
  final double size;

  @override
  Widget build(BuildContext context) {
    // Dual-render (A14): data-URL מפוענח מקומית; כתובת `https://…` שהועלתה
    // (kCloudPhotos ON) נטענת מ-R2 — שניהם דרך [imageProviderForRef]. F-43 —
    // thumb מפוענח לגודל התצוגה (ResizeImage חל על data-URL ו-network כאחד).
    final base = imageProviderForRef(logo);
    if (base != null) {
      final cacheW = (size * MediaQuery.devicePixelRatioOf(context)).round();
      return ClipOval(
        child: Image(
          image: ResizeImage(base, width: cacheW),
          width: size,
          height: size,
          fit: BoxFit.cover,
          gaplessPlayback: true,
          // payload פגום / טעינה שנכשלה → ברירת-המחדל, לעולם לא קריסה.
          errorBuilder: (_, __, ___) => _fallback(),
        ),
      );
    }
    return _fallback();
  }

  Widget _fallback() => Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: const BoxDecoration(
          color: Color(0xFFFFF0E3),
          shape: BoxShape.circle,
        ),
        // דקורטיבי: שם העסק המלא נקרא ממש לידו.
        child: ExcludeSemantics(
          child: Text(',
  't_aa239f91': ', style: TextStyle(fontSize: size * 0.46)),
        ),
      );
}

// ─── store stats (#87.2) ─────────────────────────────────────────────────────

/// סטטיסטיקת חנות חיה — ספירה לכל [OrderStage] (countAt) + מחזור פעיל ומחזור
/// שנמסר, נגזרים מ-sysOrdersProvider בתוך הכרטיס עצמו (ConsumerWidget צר —
/// F-44: הלוח לא נבנה מחדש על כל advance).
///
/// by-design (#87.2 / F-23): ללוח החנות הסטטיסטיקה כלל-חנותית — כל ההזמנות
/// שייכות לחנות אחת (kStores.first); אין כאן צורך בסינון per-username
/// (להבדיל מ-courier_profile, ראה Fulfillment.courierUser). אפס מספרים
/// קשיחים — הכל מהמנוע החי.
class _StoreStatsCard extends ConsumerWidget {
  const _StoreStatsCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(sysOrdersProvider);

    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CfgText(
            ',
  't_4e5f99e5': ';

/// מסך עצמאי (נדחף מאייקון ה-person ב-AppBar של לוח הספק — F-19: לא עוד
/// ProfileScreen של הקבלן).
class StoreProfileScreen extends ConsumerWidget {
  const StoreProfileScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const StoreProfileScreen());

  static final List<KbToolNode> _kbNodes = kbStoreProfileNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — אחרי logout/החלפת-תפקיד
    // כשהמסך עדיין בערימה נבנה שער הרישום, לא קליפה ריקה (אידיום העובד).
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.store) {
      return const WelcomeScreen(boardRole: BoardRole.store);
    }

    final Widget body = Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0,
          title: CfgText(
            ',
  't_e558100d': '@\${session.username} · ספק',
  't_4e62b047': '@username · ספק',
  't_5f67b480': 's personal area, in the
// courier_profile_screen.dart pattern (standalone wrapper + embeddable body):
//
//   🏪 כרטיס-זהות     — business-profile overrides (storeProfileProvider,
//                       bs.store-profile.v1, per-username) over the live
//                       [BoardSession]; ✏️ opens the edit sheet (#87.1).
//   📊 סטטיסטיקת חנות — live per-stage counts + active/delivered revenue off
//                       sysOrdersProvider (#87.2) — store-wide BY DESIGN.
//   אזור אישי         — פרופיל עסק · תעודות עסק (#87.3) · מסמכים (#87.4,
//                       SERVER-READY sheet) — ListTile rows ≥48dp.
//   פעולות            — ⚙️ הגדרות ספק (leaf — the settings screen must NOT
//                       link back here, the F-11 loop rule) · 🚪 יציאה
//                       (confirmDestructive → boardAuthProvider.logout()).
//
// [StoreCertsScreen] is COLOCATED here (the SupplierSettingsScreen-in-
// store_dashboard_screen.dart precedent): the business-certificate wallet
// reusing the shared cert model/notifier via storeCertsProvider
// (bs.store-certs.v1) with the kStoreCertPresets quick-add chips.
//
// SERVER-SWAP: the business profile/certificates are local stores until the
// backend lands (see state/store_profile_store.dart); the documents sheet is
// SERVER-READY (no invented amounts).

import ',
  't_2ed9f2ac': 'אזור אישי — ספק',
  't_3ece88fc': 'אישי',
  't_cfdd3ba5': 'הסר לוגו',
  't_0cb34db8': 'ח.פ. / ע.מ. (אופציונלי)',
  't_c71e28e7': 'לא נבחרה תמונה',
  't_bcd3d738': 'מנפיק (למשל: הרשות המקומית)',
  't_fe079674': 'נשמרה',
  't_a80d212c': 'נתונים חיים ממנוע ההזמנות — כלל ההזמנות של החנות.',
  't_4645e16d': 'עריכת פרופיל עסק',
  't_d985878c': 'עתיד בלבד',
  't_4f815fcd': 'פרופיל עסק',
  't_1977ef80': 'רישיון עסק · ביטוח עסק',
  't_2d1a9ad4': 'שם התעודה (למשל: רישיון עסק)',
  't_98b9124a': 'שם, טלפון, כתובת, ח.פ. ולוגו',
  't_c52f3400': '✅ מחזור שנמסר: \${fMoney(orders.deliveredRevenue)}',
  't_8e18a182': '📊 סטטיסטיקת חנות',
  't_4bf17c24': '📷 החלף לוגו',
  't_7c914eab': '🪪 תעודות עסק',
  't_871c11a2': '🪪 תעודות עסק (\${certs.length})',
  't_554e069f': '
                          ? (
                            emoji: m.emoji,
                            title: m.title,
                            preview: ordersPreview,
                            time: m.time,
                            badge: openOrdersCount,
                          )
                          : m,
            )
            .toList();
    var items =
        query.isEmpty
            ? allItems
            : allItems
                .where(
                  (item) =>
                      item.title.toLowerCase().contains(query) ||
                      item.preview.toLowerCase().contains(query),
                )
                .toList();

    // Apple-readiness: the store hub mixes genuinely-wired tiles (🛒 cart / 📦
    // orders) with placeholder tiles — some toast "\$title — בבנייה" (_tapFor →
    // null), others open the all-"בבנייה" service sheets (service-indexed).
    // Hide BOTH placeholder kinds for review; the data lists stay intact
    // (reversible). A tile survives only if it has a real non-service handler.
    if (kHideUnderConstruction) {
      items = [
        for (final item in items)
          if (_kServiceByEmoji[item.emoji] == null &&
              _tapFor(context, ref, item, null) != null)
            item,
      ];
    }

    if (items.isEmpty) {
      return _EmptyState(query: query);
    }

    if (isGrid) {
      return GridView.builder(
        key: ValueKey(',
  't_691b8471': ' (store_settings → פרטיות) is
/// OFF: the purchase history is hidden by the user',
  't_f07ee271': '\$cartCount פריטים ממתינים לסיכום',
  't_a2b78b97': '\$n פריטים',
  't_5de6454b': '\${item.title} — בבנייה',
  't_7a5b3642': '\${list.items.length} פריטים',
  't_1bd209e3': '\${o.items} פריטים',
  't_35f5eb31': '\${r.label} — בבנייה',
  't_e7c81360': '(\${_price(s.largeOrderThreshold)}). להמשיך?',
  't_daaafd09': '),
  ],
  // ↩️ החזרה חדשה
  [
    (emoji: ',
  't_08122918': '),
  ],
  // 💰 פקדונות
  [
    (emoji: ',
  't_c5270954': '),
  ],
  // 📨 מכרז ספקים
  [
    (emoji: ',
  't_065c1427': ');

/// Benzi #4 — whether the one-time "לאן לשלוח" popup has already been shown. It
/// pops up ONCE, the first time a product is added to the cart (the selection
/// stage) — never at checkout.
///
/// Default **true** (mirrors `welcomeSeenProvider`) so widget tests never trip
/// the popup; `main()` overrides it with the persisted value, where an absent
/// key → `false` → a fresh install sees the popup on its first product.
const String kShipToPromptedKey = ',
  't_5f616f0f': ');
          return int.tryParse(digits) ?? 0;
        }
        return parsePrice(a.total).compareTo(parsePrice(b.total));
      });
    }
    // rating / distance: no meaningful equivalent for orders; preserve order.

    final orders =
        query.isEmpty
            ? allOrders
            : allOrders
                .where(
                  (o) =>
                      o.id.toLowerCase().contains(query) ||
                      o.items.toLowerCase().contains(query) ||
                      o.stageLabel.toLowerCase().contains(query),
                )
                .toList();

    if (orders.isEmpty) {
      return _EmptyState(query: query);
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: orders.length,
      separatorBuilder:
          (_, __) =>
              const Divider(height: 1, indent: 76, color: Color(0xFFF5F5F5)),
      itemBuilder: (context, i) => _OrderRow(order: orders[i]),
    );
  }
}

/// Shown in the הזמנות tab when ',
  't_4d445d01': '+ הוסף',
  't_3f0a526f': ',
    badge: 0,
  ),
  // raw shell (kProfileRawShell): 📊 השוואת מחירים routes to the real
  // partner-store comparison sheet, which narrates supplier prices that don',
  't_f88ef27f': '2 כלים מושכרים עד 30.5',
  't_bbb85470': '2 כלים פעילים',
  't_eb0cc60a': '3 הצעות חדשות',
  't_ac252343': '3 הצעות חדשות התקבלו',
  't_3ade4f7d': '3 יחידות',
  't_afc2c2fe': '3 פריטים ממתינים לסיכום',
  't_ef333698': '4 ספקים עדכנו מחירים',
  't_4fb739f2': '4 ספקים עודכנו',
  't_198e1b66': '5 גיליונות',
  't_1a1b054a': '5 גיליונות זמינים להורדה',
  't_cd821c7e': 't be offered it at checkout. Off (the
    // default) ⇒ the chip is removed from the selector entirely. The other
    // methods (כרטיס/ביט) are always available. This is the live client effect
    // of that toggle.
    final supplierCreditEnabled = ref.watch(
      storeSettingsProvider.select((s) => s.supplierCreditEnabled),
    );
    final options = [
      for (final o in _kPaymentOptions)
        if (o.method != CartPaymentMethod.supplierCredit ||
            supplierCreditEnabled)
          o,
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const CfgText(
          ',
  't_bd105995': 'אחים כהן',
  't_fae03b4a': 'אין הזמנות פעילות',
  't_55389cea': 'אין פריטים מועדפים',
  't_f7577c50': 'אין רשימות שמורות עדיין',
  't_ffe01f8e': 'איסוף עצמי',
  't_8cd42a1c': 'אירועים קרובים',
  't_3f824e0e': 'אישור הזמנה',
  't_2e9d90a9': 'אישור הזמנה גדולה',
  't_67ea9596': 'אספקה: יום-יומיים',
  't_ddc5a985': 'אשר והמשך',
  't_5c61f59d': 'בטון יצוק',
  't_1c44b682': 'בית דוד 3',
  't_7de20ed4': 'בני ברק מבנים',
  't_3ea8d306': 'בקשה #567',
  't_93c1bcca': 'בקשה #567 ממתינה לאישור',
  't_5ed12484': 'בקשת החזר',
  't_09bb31f3': 'ברזל 12mm',
  't_6624cd3a': 'ברזל 12mm · ₪3.85',
  't_af46a497': 'ברזל 12mm · ₪3.95',
  't_c03ac490': 'ברזל 12mm · ₪4.10',
  't_ad87950a': 'ברזל 12mm · ₪4.20',
  't_e1965eb1': 'דבק אפוקסי',
  't_c1a1c78c': 'הוסיפו מוצרים מהקטלוג',
  't_e2cdc7a8': 'הוסף כלי',
  't_4d537e46': 'הוסף למועדפים',
  't_379a88f7': 'הוספת פרויקט',
  't_5b1b0f53': 'הזמן עכשיו · \${_price(widget.total)} →',
  't_50f4d2c0': 'הזמנה #1234 · בדרך אליך',
  't_5f10a6ef': 'הזמנה \${order.id}',
  't_a265695c': 'הזמנה \${placed.id} אושרה! 🎉',
  't_4e289c0e': 'הזמנה \${storeOrders.first.id} · \${storeOrders.first.stageLabel}',
  't_cd9f2154': 'החשבון ממתין לאישור — אפשר לשלוח בקשת תפקיד',
  't_36b56af9': 'היסטוריית הרכישות מוסתרת',
  't_ab421fd8': 'הסל נוקה',
  't_17a65674': 'הסר ממועדפים',
  't_8ddb4b04': 'הפעלת "היסטוריית רכישות" בהגדרות תציג שוב את ההזמנות.',
  't_e727f18c': 'הצג היסטוריה',
  't_dfd2e0cf': 'הקבלן הראשי',
  't_88324e6f': 'הרשימה "\${list.name}" נטענה לסל',
  't_797b1d72': 'הרשימה "\${list.name}" תימחק לצמיתות.',
  't_6b7bcaa3': 'הרשימה נשמרה בהצלחה',
  't_a5a1b69b': 'השליח',
  't_502e2e60': 'התראות הזמנות ומשלוחים',
  't_323814d1': 'חינם',
  't_f33def92': 'יום-יומיים',
  't_353e0813': 'יש להירשם כדי לבצע הזמנה',
  't_84ca53bf': 'כל הפריטים יוסרו מהסל.',
  't_a0d9b485': 'כרטיס',
  't_6441836d': 'כתובת / אתר העבודה',
  't_e3e90a0e': 'כתובת ברירת
  // מחדל',
  't_0cd281cc': 'לא חובה — אפשר לאשר את ההזמנה גם בלי כתובת ולהשלים בהמשך.',
  't_c05f743d': 'לוח עבודה',
  't_219d3ee0': 'לוח שנה',
  't_9ff834e0': 'מ.א. שלמה',
  't_9b5fe241': 'מגדל עזריאלי',
  't_de21005d': 'מועדים',
  't_ab7f4e8d': 'מושכר עד 28.5',
  't_f0a79b26': 'מושכרת עד 30.5',
  't_8a4b3f94': 'מחיקת רשימה שמורה?',
  't_6f5d0940': 'מינימום להזמנה: \${_price(s.minOrderAmount)}',
  't_cd19eb49': 'ממס ניקוי',
  't_582dc872': 'ממתינה לאישור',
  't_86c9d4ec': 'מע"מ + משלוח',
  't_fdafda56': 'מע"מ 18%',
  't_ffbbe677': 'מקדחה',
  't_6dfd0134': 'משור חשמלי',
  't_d035ae8c': 'ניקוי הסל?',
  't_33de167e': 'סה"כ לתשלום',
  't_a53a169c': 'סיכום הזמנה',
  't_2fbec343': 'סכום ביניים',
  't_2c14716d': 'סכום ביניים (ללא מע"מ)',
  't_dd5e7ff9': 'סכום ההזמנה \${_price(widget.total)} חורג מהסף שהגדרת ',
  't_35aaa1c3': 'ספק A',
  't_62003852': 'ספק B',
  't_135b2eee': 'ספק C',
  't_d6a198fe': 'ספק חומרי בנייה',
  't_cf9911fb': 'סרוק תעודת-משלוח',
  't_bab37283': 'סריקת תעודת-משלוח (OCR) — בקרוב',
  't_f9671e18': 'עודכן 10.5',
  't_4b1596b2': 'עודכן 12.5',
  't_30a744c7': 'עודכן 15.5',
  't_a3d473e4': 'עודכן 18.5',
  't_cf9a07b7': 'עודכן 20.5',
  't_891b43e4': 'פיקדון #123',
  't_4dd72095': 'פיקדון פעיל · ₪350',
  't_83ea5741': 'פיקדון ₪350',
  't_595f77f0': 'פרטי הפריטים אינם זמינים',
  't_0b317345': 'פריטים להחזרה',
  't_e6b6f0b8': 'צבע אפוקסי',
  't_2846c78a': 'קומה / כניסה / שם האתר / הוראות לנהג...',
  't_aa9e932c': 'רוט',
  't_3efd3075': 'רשימה שמורה',
  't_f7944ba2': 'שיחה עם \${c.name} — בבנייה',
  't_e02dcdf0': 'שם הפרויקט',
  't_df5b0619': 'שם הרשימה לא יכול להיות ריק',
  't_83ac9f90': 'שמור סל כרשימה',
  't_085a5652': 'תזמון',
  't_f89ea01f': 'תזמן ביקורת',
  't_4e9a975f': 'תזמן משלוח',
  't_5db3d921': 'תזמן עובד',
  't_98e0b2a0': 'תזמן פגישה',
  't_f9edb51a': 'תיאום איסוף',
  't_74dce30d': '₪3,980 · הצעה חדשה',
  't_e3626a48': '₪350 · פעיל',
  't_162e0b9c': '₪4,200 · הצעה חדשה',
  't_ab7ca14d': '₪4,500 · הצעה חדשה',
  't_db751a61': '🏗️ שיוך לפרויקט',
  't_6de2dafb': '💳 אמצעי תשלום',
  't_1ff000f8': '💳 תשלום',
  't_6e42e25a': '📝 הערות לשליח',
  't_c57367d1': '📦 \$openOrders הזמנות פתוחות',
  't_dbb601cd': '📦 הזמנות',
  't_5269970d': '📦 משלוח',
  't_e1cc63e1': '📨 \$offers הצעות ספקים',
  't_3dc922d0': '🔖 רשימות שמורות',
  't_d038c4cb': '🔧 שירותים',
  't_a39e5bff': '🚚 אפשרויות משלוח',
  't_240e3a9e': '🚛 מעקב הזמנה',
  't_eb0da3be': '🚧 בבנייה',
  't_f858a72b': '🛒 \$cartCount פריטים בסל',
  't_017688c2': '🛒 הסל',
  't_c6869430': '🛠️ מוצרים חכמים',
  't_8a618410': ',
                child: TextButton(
                  onPressed: () => Navigator.pop(ctx, true),
                  style: TextButton.styleFrom(
                    // AA על רקע-דיאלוג לבן (redAccent=3.19:1 נכשל) — token חוזה 9.
                    foregroundColor: BsTokens.dangerDark,
                  ),
                  child: const CfgText(',
  't_3e3c5caf': '12 תשלומים',
  't_084120da': '14 יום',
  't_b3b90e5a': '3 תשלומים',
  't_b4cbee32': '6 תשלומים',
  't_986f9ad7': '7 ימים',
  't_c9ab6f1a': 's persisted toggles have no engine yet — show an
  // honest "בבנייה" subtitle and suppress the active-count badge (Wave 8 / D2).
  final bool underConstruction;

  // A row is a backend-blocked "under construction" placeholder when it is a
  // _PlaceholderRow or an _Inert row flagged underConstruction. Single source of
  // truth for both the active-count badge and the Apple-readiness hide-filter.
  static bool _isUnderConstruction(Widget w) =>
      w is _PlaceholderRow || (w is _Inert && (w as _Inert).underConstruction);

  // Count only functional rows — exclude "בבנייה" placeholders.
  int get _activeCount =>
      children.where((w) => !_isUnderConstruction(w)).length;

  // For Apple review (kHideUnderConstruction) we render only the functional
  // rows; the placeholder rows stay defined in code (reversible) but are hidden.
  List<Widget> get _visibleChildren =>
      kHideUnderConstruction
          ? children.where((w) => !_isUnderConstruction(w)).toList()
          : children;

  @override
  Widget build(BuildContext context) {
    // A whole section that is itself "under construction" — or one whose every
    // row is a hidden placeholder — disappears entirely for Apple review.
    if (kHideUnderConstruction &&
        (underConstruction || _visibleChildren.isEmpty)) {
      return const SizedBox.shrink();
    }
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      color: Theme.of(context).colorScheme.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16),
          childrenPadding: const EdgeInsets.only(bottom: 8),
          iconColor: Colors.black54,
          collapsedIconColor: Colors.black54,
          leading: Text(emoji, style: const TextStyle(fontSize: 22)),
          // Count badge replaces the default expand chevron.
          trailing:
              (underConstruction || _activeCount == 0)
                  ? null
                  : Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: BsTokens.brand,
                      borderRadius: BorderRadius.circular(11),
                    ),
                    child: Text(
                      ',
  't_f29f08ad': 'אזורי משלוח',
  't_b9301aa4': 'אחריות מורחבת',
  't_fff2b869': 'אינגלי',
  't_da7fe4e5': 'איסוף עצמי כברירת מחדל',
  't_659956cf': 'אישור ביומטרי לרכישה',
  't_c7fa5569': 'אישור כפול לרכישה גדולה',
  't_9c709c1b': 'אמצעי תשלום',
  't_d741ca0e': 'בוקר',
  't_b714ac5b': 'דירוג גבוה',
  't_93249292': 'הוראות לשליח',
  't_1756070c': 'הזמנות חוזרות',
  't_0c817498': 'החיפוש הנוכחי בחנות יימחק.',
  't_bc63f246': 'החיפוש נוקה',
  't_0f564352': 'הערות למשלוח...',
  't_768869c8': 'הצגת מלאי',
  't_fdd74f83': 'התראות חנות',
  't_db4dc886': 'התראות מבצעים',
  't_af2d77c6': 'חזר למלאי במועדפים',
  't_d8873d47': 'חלון זמן מועדף',
  't_ebbba2de': 'חנויות מסומנות',
  't_3ccfaaa8': 'חשבוניות ומס',
  't_41017dca': 'ייעוץ טכני',
  't_0ca3d92a': 'ייצוא לרו"ח',
  't_7b818f6c': 'כל הגדרות החנות יוחזרו לברירת המחדל.',
  't_c5a87fbf': 'כרטיס אשראי',
  't_fd1de491': 'כרטיסים שמורים',
  't_6ec13e9c': 'כתובת ברירת מחדל',
  't_ee9d85ed': 'ללא סינון',
  't_4a7e1333': 'מגבלת אשראי יומית (₪, 0=ללא)',
  't_b5af8227': 'מדיניות החזרות',
  't_049e7e80': 'מחיקת חיפושים',
  't_b338356a': 'מחיקת חיפושים?',
  't_84ff892f': 'מחיר: זול → יקר',
  't_46af84c1': 'מטרי',
  't_93236a22': 'מינימום הזמנה (₪)',
  't_bab99f7b': 'מספר...',
  't_c7d50f0d': 'מרחק מקסימלי (ק"מ, 0=ללא)',
  't_044519e2': 'מרחק קרוב',
  't_ce928cb0': 'משלוח בדרך',
  't_b9084233': 'משלוח מהיר (תוך 4 שעות)',
  't_f4b4c367': 'משלוח רגיל (יום-יומיים)',
  't_2f689a37': 'משלוחים וכתובות',
  't_19ddf771': 'סטטוס הזמנה',
  't_61c6935f': 'סל והזמנות',
  't_b50c0f1d': 'סף לאישור כפול (₪)',
  't_33c5e69b': 'ערב',
  't_f3eb97e7': 'פרטי עוסק/חברה',
  't_2b00a4aa': 'פרטיות ורכישות',
  't_300ea530': 'צהריים',
  't_8a711c6f': 'קבלות אוטומטיות',
  't_1e44e18e': 'רחוב, מספר, עיר',
  't_ef8f7b72': 'רשימה',
  't_e223f954': 'שירות ולוגיסטיקה',
  't_d1924f87': 'שם עסק...',
  't_f89f082d': 'שמירת סל לפרויקט',
  't_81eda1f0': 'ת"א, רמת גן, הרצליה...',
  't_a7bbd1fa': 'תצוגה (רשת / רשימה)',
  't_0abf6435': 'תשלום אחד',
  't_a473334f': 'תשלומים (1/3/6/12)',
  't_59a678b5': ' (\$dropped נדחו — טקסט ארוך/לא תקין)',
  't_ee5dfe4b': '\$count התאמות — החלפה רחבה, לסקור היטב לפני "פרסם".',
  't_7fb68763': '(ריק)',
  't_7f236874': 's *name*). Each
// hit previews labelHe + "before → after", with a per-hit checkbox so the owner
// replaces selectively. "החלף בנבחרים" applies ALL chosen edits as a SINGLE
// `applyOps` batch ⇒ one undo unit (R1-A3 · R2-#18), straight to the DRAFT —
// nothing reaches users until "פרסם לכולם". kImmutable ids are read-only here too.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_944aa6cc': 'אין התאמות ל־"\$query".',
  't_7c80fa44': 'הוחלפו \$applied — בטיוטה. "פרסם לכולם" כדי לשדר לכל המשתמשים.',
  't_c6da781a': 'החלף בנבחרים (\$selectedCount)',
  't_29bf180c': 'החלף ב…',
  't_56ea9064': 'הקלד טקסט לחיפוש על-פני הרכיבים שנערכו.',
  't_dc7a35eb': 'מ־\${h.text} ל־\${after.isEmpty ? ',
  't_48029013': 'מצא טקסט',
  't_803e4d01': 'רכיב קריטי — קריאה בלבד',
  't_899e8ed1': 'בעלים',
  't_29c69e91': 'הגרסה תפורסם מחדש לכל המשתמשים כגרסה חדשה (ההיסטוריה נשמרת).',
  't_3188492a': 'לשחזר גרסה זו?',
  't_0d440e4a': 'שחזר',
  't_63f987c8': '(ברירת-מחדל — \${d.labelHe})',
  't_e3405fed': 'אפס רכיב לברירת-המחדל',
  't_16168789': 'בחר רכיב מהעץ כדי לערוך',
  't_8544debd': 'מוסתר',
  't_fe78ba31': 'רכיב לא מוכר (אינו ברישום)',
  't_c1e7eb09': 'רכיב קריטי — לא ניתן להסתרה',
  't_5c51912f': 'תצוגה:',
  't_1d8be8eb': ';

class ThemePane extends ConsumerWidget {
  const ThemePane({super.key});

  /// Preset brand swatches (first = the current default). No external dep.
  static const _swatches = <Color>[
    BsTokens.brand, // ברירת-מחדל (כתום)
    Color(0xFF2563EB), // כחול
    Color(0xFF059669), // ירוק
    Color(0xFFDC2626), // אדום
    Color(0xFF7C3AED), // סגול
    Color(0xFF0891B2), // טורקיז
    Color(0xFFD97706), // ענבר
    Color(0xFF334155), // פחם
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cfg = ref.watch(configThemeProvider);
    final notifier = ref.read(configStoreProvider.notifier);
    final contrast = _contrastVsWhite(cfg.brand);
    final lowContrast = contrast < 4.5;

    return ListView(
      padding: const EdgeInsets.all(BsTokens.space4),
      children: [
        const _Label(',
  't_0e789533': 'אפס עיצוב לברירת-המחדל',
  't_1199f932': 'גודל גופן פי \${v.toStringAsFixed(2)}',
  't_5fb058f9': 'גודל גופן: ×\${cfg.fontScale.toStringAsFixed(2)}',
  't_d475c577': 'טקסט לבן על הצבע הזה עלול להיות קשה לקריאה.',
  't_81c4e52c': 'כותרת לדוגמה',
  't_86a70b1e': 'כך ייראה טקסט גוף באפליקציה.',
  't_2b73a73e': 'כפתור ראשי',
  't_d1d49ed5': 'עיגול פינות \${v.round()}',
  't_a23d0953': 'עיגול פינות: \${cfg.radius.round()}',
  't_f92760e6': 'צבע מותג',
  't_6bf0056e': 'תצוגה חיה',
  't_07e0f2fa': 'אין רכיבים',
  't_f87cdceb': 'חיפוש רכיב…',
  't_664badda': 'טרם חובר',
  't_dd6d1525': ';

/// The owner-only "🎨 סטודיו" entry — hidden unless the viewer is the owner-manager.
class StudioEntryCard extends ConsumerWidget {
  const StudioEntryCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!ref.watch(studioOwnerManagerProvider)) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space4),
      child: Card(
        color: BsTokens.cardLight,
        child: ListTile(
          leading: const Text(',
  't_8188cd42': 'סטודיו (בטא)',
  't_45f0f848': 'ערוך את האפליקציה — טקסטים · עיצוב · נראות',
  't_ee8981f7': 'היסטוריית גרסאות',
  't_3771df3b': 'מפקח',
  't_7a617384': 'מפקח העריכה',
  't_a6d788d6': 'עיצוב',
  't_857faa19': 'עץ הרכיבים',
  't_0f18801e': '🎨 סטודיו',
  't_e5c88b46': '\${_countFor(_viewAs)} יחולו',
  't_a483a0ae': 'אין שינויים',
  't_4888fe1a': 'בטל טיוטה',
  't_45fccc1d': 'הטיוטה תימחק. מה שכבר פורסם יישאר חי.',
  't_28a1bbc9': 'השאר',
  't_251ee89d': 'טיוטה · \$count שינויים',
  't_97bc9dee': 'לבטל \$count שינויים בטיוטה?',
  't_7a52f6bb': 'מה שינית? (אופציונלי)',
  't_7e40c0c8': 'מצב עריכה',
  't_4588f838': 'סיים עריכה',
  't_3eacb86b': 'עריכה ידנית',
  't_791c1da4': 'פרסום לכולם',
  't_50166022': 'פרסם לכולם',
  't_6c0b6ad1': 'צפה כפי ש-',
  't_43efac5e': '⚠️ ישפיע על כל המשתמשים — \${widget.count} שינויים.',
  't_7ee61b7c': ' · 🔒 נעול',
  't_a3b49371': '1 · בחר אלמנט',
  't_85f2a61b': '2 · בחר סוג עריכה',
  't_069272d4': '3 · אמוג׳י חדש',
  't_9c83f069': '3 · טקסט חדש',
  't_1eb86c24': '3 · נראות',
  't_0f98fad6': '3 · פעולה (מתוך קטלוג הפעולות)',
  't_10cce69c': '3 · צבע (מתוך הערכים החוקיים לרכיב)',
  't_53cb7550': '3 · רכיב להוספה (תצוגה מקדימה — ללא op בגרסה זו)',
  't_318d36e5': 's MVP — no-code editing that works with `kClaudeAi`
// OFF (the builder NEVER reads `claudeGatewayProvider`; §8).
//
// THE FLOW (§2): pick an element id (over the frozen `ElementRegistryView`) → pick
// an edit — a prop (text / emoji / style-color from `allowedValues`), visibility
// (SetHidden), an action (from the step-72 `kActionCatalog`; typed-arg screens are
// GREYED "צריך פרמטרים — לא זמין", R1-5 — never dropped), or a component (from the
// step-73 `kComponentPalette`, validated for preview) → PREVIEW (validateSafe →
// summarizeDiff, recomputed FREE on every change, §6) → CONFIRM (a single tracked
// tap → P1 `applyOps` ONCE, R1-4) → UNDO/REDO (P1',
  't_4d13b5d5': 's `ConfigOp` family is the 6 Set-axis ops — there is NO `AddComponent` variant.
// So the component category is a GROUNDED, validated PREVIEW (over `validateAddCom
// ponent`); placing a component applies once P1 exposes that op. text/emoji/
// visibility produce ops that apply; style-color/action are grounded + previewed and
// (on the seed registry, whose `allowedValues`/`allowedActions` are empty) safely
// BLOCKED by `validateSafe` — the backstop working, surfaced as "נחסמו K" (§4).
//
// §10 draft badge: the Studio edits the DRAFT only; publish is a SEPARATE Pillar-1
// gate, so a "טיוטה" badge is always shown. All colors from `BsTokens` (the color-
// ratchet — zero raw hex literals). No Firebase, no gateway.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_97705d5e': 's frozen family has no
/// `AddComponent`, see the file header).
enum _EditKind { text, emoji, color, visibility, action, component }

/// A few REAL typed-arg screens (need per-screen args → out-of-v1). They are NOT in
/// [kNavScreenIds]; the action-picker shows them GREYED "צריך פרמטרים — לא זמין"
/// (R1-5) rather than dropping them silently. All three exist in the tree.
const List<String> _kTypedArgScreens = <String>[
  ',
  't_5bd91b39': 'אין ערכי צבע מוגדרים לרכיב זה (fail-closed).',
  't_da166ae1': 'בחר מסך-יעד (מסכי-פרמטר מאופרים — צריך פרמטרים):',
  't_00a3d6e6': 'בחר עריכה כדי לראות תצוגה מקדימה.',
  't_c2bc3641': 'בחר רכיב לעריכה…',
  't_754f9b8c': 'בטל (undo של Pillar 1)',
  't_ad49c80d': 'בצע-שוב (redo של Pillar 1)',
  't_1d814641': 'הדבק אמוג׳י…',
  't_568fda93': 'הוחל — \${applied.length} שינוי בטיוטה ✓',
  't_751ae4db': 'הקלד טקסט…',
  't_10f5329d': 'הרכיב הנבחר',
  't_7d56e9a4': 'טיוטה · \$dirtyCount',
  't_e7ca4191': 'יומן שינויים (תצוגה — מקור-האמת הוא undo של Pillar 1)',
  't_63ec0b9e': 'נראות',
  't_e5cb2608': 'פעולה',
  't_6ae77ceb': 'צריך פרמטרים — לא זמין',
  't_deb3f947': 'רכיב',
  't_8c62e748': '✓ חוקי להוספה (יופעל עם שער ה-AddComponent של Pillar 1)',
  't_d4cfb401': '👁️ הצג',
  't_641178e1': '🙈 הסתר',
  't_7dfe2c0a': '🛠️ בונה ידני — ללא מודל',
  't_27e68acc': '),
                controller: _valueController,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  isDense: true,
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                  contentPadding: const EdgeInsets.symmetric(
                    vertical: 10,
                    horizontal: 8,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(BsTokens.radiusCard),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: BsTokens.space4),

        // ── פעולה (action — read-only selectable; mutating GREYED/deferred) ──
        _sectionTitle(',
  't_119e5c28': '),
        const SizedBox(height: BsTokens.space2),
        Wrap(
          spacing: BsTokens.space2,
          runSpacing: BsTokens.space2,
          children: [
            for (final t in kRuleTriggers)
              _pill(
                label: t.labelHe,
                selected: _trigger == t.id,
                onTap: () => setState(() => _trigger = t.id),
              ),
          ],
        ),
        const SizedBox(height: BsTokens.space4),

        // ── תנאי (condition: field · op · value) ──
        _sectionTitle(',
  't_e0ad278e': ';

/// The 🔒 כללים tab pane — manual automation-rule builder + read-only advisory.
class StudioRulesScreen extends ConsumerStatefulWidget {
  const StudioRulesScreen({super.key});

  @override
  ConsumerState<StudioRulesScreen> createState() => _StudioRulesScreenState();
}

class _StudioRulesScreenState extends ConsumerState<StudioRulesScreen> {
  // The composed rule',
  't_895d116b': 's frozen draft in Phase-1.
  final List<Rule> _rules = <Rule>[];

  @override
  void dispose() {
    _valueController.dispose();
    super.dispose();
  }

  /// The rule the pickers currently compose, or null when the value is not numeric
  /// (then the advisory shows a hint instead of a count). The selected action is
  /// always a READ-ONLY one (mutating actions are not selectable — see the picker).
  Rule? _composed() {
    final value = num.tryParse(_valueController.text.trim());
    if (value == null) return null;
    return Rule(
      trigger: _trigger,
      condition: RuleCondition(field: _field, op: _op, value: value),
      action: _action,
    );
  }

  void _addRule() {
    final rule = _composed();
    if (rule == null || rule.isMutating) return; // Phase-1 adds read-only rules only.
    setState(() => _rules.add(rule));
  }

  @override
  Widget build(BuildContext context) {
    // READ-ONLY sources (the manager_copilot_screen.dart:53-64 read idiom). We
    // WATCH the live list + analytics; we NEVER touch `.notifier`.
    final orders = ref.watch(ordersEngineProvider);
    final analytics = ref.watch(managerAnalyticsProvider);

    final composed = _composed();
    final matches = composed == null
        ? null
        : evalRuleAdvisory(composed, orders: orders, analytics: analytics);

    return ListView(
      padding: const EdgeInsets.all(BsTokens.space4),
      children: [
        _introNote(),
        const SizedBox(height: BsTokens.space4),

        // ── מתי (trigger) ──
        _sectionTitle(',
  't_ae1531a1': 'הוסף כלל',
  't_affbd929': 'הזן ערך מספרי לתנאי כדי לראות תצוגה מקדימה.',
  't_4582e143': 'הכללים כאן קוראים בלבד ומתריעים; אינם משנים הזמנות.',
  't_11c1931d': 'הסר כלל',
  't_69b27c85': 'סופרים כמה פריטים תואמים כרגע ומתריעים. מחירים ופעולות-ליבה תמיד מוגנים; ',
  't_8f27f2b5': 'פעולות משנות (סמן הזמנה · הצע הזמנה חוזרת) מוקפאות — ידרשו אישור מפורש. ',
  't_e4b2a93c': 'פעולות שמשנות הזמנות מוקפאות עד אישור מפורש.',
  't_24b70f75': '👁️ \${advisoryHe(matches)} — תצוגה מקדימה, לפני שמירה (קריאה בלבד).',
  't_7d7577be': '📋 כללים פעילים',
  't_9ae82f21': '🔒 כללי אוטומציה — מתי → תנאי → פעולה. בשלב זה הכללים קוראים בלבד: הם ',
  't_d4a189e1': 's explicit confirm-tap, guarded by a tracked single-tap turn (mirror of
/// `studio_component_builder.dart:108-112`) so a double-tap can never write twice. The
/// `|| _loading` guard + a `mounted`-check after EVERY await close the stale-response
/// race (`describe_to_cart_screen.dart:104`), and a 200-empty reply is an honest retry,
/// never an empty box (`reject_reason_screen.dart:92-93`).
class _CoEditorPane extends ConsumerStatefulWidget {
  const _CoEditorPane({required this.ai});

  final bool ai;

  @override
  ConsumerState<_CoEditorPane> createState() => _CoEditorPaneState();
}

class _CoEditorPaneState extends ConsumerState<_CoEditorPane> {
  // The frozen grounding source (R1-2) — the SAME registry `parseConfigEdit` /
  // `validateSafe` / `summarizeDiff` use, so the model can only ever NAME real ids.
  final RegistryView _registry = ElementRegistryView.builtIn();
  final TextEditingController _controller = TextEditingController();

  bool _loading = false;

  // An honest off-path line (ambiguous / empty / truncated / "מה התכוונת" / failed);
  // [_messageIsError] reddens the hard failures and keeps the soft "didn',
  't_67bbd373': 's loading-disable, so a mid-flight re-submit could overwrite a newer
    // preview); the debounce keeps a tap-burst under the 40/min server cap (§10).
    if (gw == null || text.isEmpty || _loading) return;
    final now = DateTime.now();
    if (_lastSubmit != null &&
        now.difference(_lastSubmit!) < const Duration(milliseconds: 400)) {
      return;
    }
    _lastSubmit = now;
    FocusScope.of(context).unfocus();
    setState(() {
      _loading = true;
      _clearResult();
    });
    try {
      // Stage-A — the model NAMES one closed scope token; `classifyScope` grounds it
      // to a real token, or null (AMBIGUOUS → "צריך הבהרה", never a guess — R1-7). The
      // utterance is folded + capped by `promptSafeText` INSIDE `studioScopePrompt`
      // (edit_prompt.dart:214) — the injection-lever defense (§7.9).
      final scopeRes = await gw.ask(
        prompt: studioScopePrompt(_registry, text),
        maxTokens: kStudioEditMaxTokens,
      );
      if (!mounted) return;
      final scope = classifyScope(scopeRes.text, _registry);
      if (scope == null) {
        setState(() {
          _loading = false;
          _message =
              ',
  't_3311c096': 's own guard, `manager_dashboard_screen.dart:87`), not an error page.
//   • §4 off-state — the 🤖 co-editor pane shows an honest [AiOffState] when the
//     Claude gateway is null (`studioCoEditorProvider.ai == false`).
//   • §8/§9 always-works — the 🛠️ manual-builder pane needs NO gateway, so it is
//     ALWAYS usable; the deep-link (the default tab) opens it FIRST (the path that
//     never disappoints), and the hero carries an "ניסיוני" badge.
//
// NOTE: intentionally distinct from the Pillar-1 owner Studio in
// `screens/studio/studio_screen.dart` (same simple name, different library — the
// two are never co-imported, so there is no name clash).
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_058f28ba': 'בונה ידני',
  't_2dd186d3': 'הוחל — \${verdict.applied.length} שינוי בטיוטה ✓',
  't_73e53d85': 'כללים',
  't_a982b0f8': 'לא הצלחתי לבנות את השינוי, נסה שוב',
  't_c4b8c0bb': 'לא התקבלה תשובה מהשרת — נסה שוב.',
  't_3c877e4f': 'לדוגמה: שנה את הכיתוב של כפתור ההזמנה ל"הזמן עכשיו"',
  't_0e8738df': 'מה התכוונת? \${parsed.dropped} חלקים לא הובנו — נסה לנסח מחדש.',
  't_c023454a': 'מה התכוונת? לא זוהה שינוי מתאים — נסה לנסח מחדש.',
  't_543c8a30': 'מתוך: \${scopeHe(scope)}',
  't_a6072e14': 'נסח שינוי לתצוגה מקדימה',
  't_a9121bf5': 'עורך-שפה',
  't_da99b928': 'ערוך את האפליקציה — עורך ניסיוני',
  't_a4c11d46': '🎬 סטודיו',
  't_b4a518fa': '💡 העורך החכם דורש חיבור לשרת. בינתיים — הבנייה הידנית עובדת תמיד.',
  't_f692a1bd': '🤖 תאר בעברית מה לשנות. אכין תצוגה מקדימה — שום דבר לא ישתנה עד שתאשר.',
  't_9712e28e': ',
          ),
);

/// 🏪 העלאת מוצר — the supplier self-onboarding form (Pillar catalog-to-server · C4.1).
class SupplierOnboardingScreen extends ConsumerStatefulWidget {
  const SupplierOnboardingScreen({required this.storeId, super.key});

  /// The store this supplier submits for (stamped on every draft + inventory row).
  final String storeId;

  static Route<void> route(String storeId) => MaterialPageRoute<void>(
    builder: (_) => SupplierOnboardingScreen(storeId: storeId),
  );

  @override
  ConsumerState<SupplierOnboardingScreen> createState() =>
      _SupplierOnboardingState();
}

class _SupplierOnboardingState extends ConsumerState<SupplierOnboardingScreen> {
  final _sku = TextEditingController();
  final _nameHe = TextEditingController();
  final _nameEn = TextEditingController();
  final _categoryHe = TextEditingController();
  final _brand = TextEditingController();
  final _color = TextEditingController();
  final _barcode = TextEditingController();
  final _price = TextEditingController();
  final _stock = TextEditingController();

  List<String> _errors = const [];
  bool _submitting = false;
  bool _done = false;

  @override
  void dispose() {
    for (final c in [
      _sku,
      _nameHe,
      _nameEn,
      _categoryHe,
      _brand,
      _color,
      _barcode,
      _price,
      _stock,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  /// The current form as a draft (rebuilt each frame so the facet preview is live).
  SupplierDraft get _draft => SupplierDraft(
    storeId: widget.storeId,
    sku: _sku.text.trim(),
    nameHe: _nameHe.text.trim(),
    categoryHe: _categoryHe.text.trim(),
    nameEn: _nameEn.text.trim(),
    brand: _brand.text.trim(),
    color: _color.text.trim().isEmpty ? null : _color.text.trim(),
    barcode: _barcode.text.trim().isEmpty ? null : _barcode.text.trim(),
    price: num.tryParse(_price.text.trim()),
    stock: int.tryParse(_stock.text.trim()),
  );

  Future<void> _submit() async {
    final draft = _draft;
    final v = validateDraft(draft, const <String>{});
    if (!v.ok) {
      setState(() => _errors = v.errors);
      return;
    }
    setState(() {
      _errors = const [];
      _submitting = true;
    });
    try {
      await ref.read(supplierSubmitProvider)(draft);
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _done = true;
      });
    } on Object catch (_) {
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _errors = const [',
  't_29ef32c1': 'המוצר נשלח · \${_sku.text.trim()}',
  't_c30da5b7': 'העלאת מוצר',
  't_9ad282bf': 'מאפיינים מזוהים אוטומטית',
  't_5e2a762a': 'מחיר (₪)',
  't_edb89494': 'שולח…',
  't_d61b3ab9': 'שלח מוצר',
  't_223af2cf': 'שם (אנגלית)',
  't_c84a9cd8': 'שם (עברית)',
  't_863a7508': 'אין ספקים עדיין',
  't_770e763d': 'אינסטלציה וסניטציה • \$kLipskeyProductCount מוצרים',
  't_f21305e3': 'ספקים ומותגים',
  't_6b5d9d6d': 'ספקים ומותגים יופיעו כשקטלוג החברה ייטען',
  't_b37bf49d': '\${_fmtDayMonth(start)} · \${bar.lenDays} ימ׳',
  't_fe9245fe': 's start date
// from the authoring sheet (`_TaskAuthorSheet`), not here.
//
// HONEST by construction (אין-המצאות, R6/R8 — NEVER an invented date): only a
// task with a real [TaskItem.scheduledStart] gets a bar, and the date shown on
// each row IS that task',
  't_8a83b23c': 'אין משימות',
  't_6e0b794c': 'לוח-הזמנים של המשימות לפי תאריך-התחלה מתוזמן (לצפייה בלבד)',
  't_e6d3c07c': 'משימות אלו לא ממוקמות על הציר — הקבלן יכול לשבץ להן תאריך התחלה.',
  't_8778c3c6': '📊 גאנט משימות',
  't_2bf38209': '📊 לוח-זמנים (גאנט)',
  't_fe2e62ac': '🗓️ ללא תאריך מתוזמן (\${layout.unscheduled.length})',
  't_70bfbe98': '\$doneCount משימות הושלמו',
  't_3c2f0eea': '`) with ✅ אשר / ❌ דחה. SEPARATE from
/// [_ApprovalCard] (the `',
  't_410d15d4': 's
  // task view — it now also AUTHORS tasks (＋ משימה חדשה / edit a card) and
  // APPROVES submitted ones (the parallel contractor-approval block, on the
  // same review queue the manager dashboard uses — _waveT2 PARKED decision).
  List<Widget> _managerView(List<TaskItem> tasks) {
    final review = tasks.where((t) => t.status == ',
  't_615eba97': 's "אישורי עובדים (קבלן)" section (Wave T2a) — a
/// submitted task with אשר/דחה. Decisions run on the existing engine path
/// (`approve`/`reject`) via the callbacks; this widget is presentation only.
class _ApprovalCard extends StatelessWidget {
  const _ApprovalCard({
    required this.name,
    required this.workerLabel,
    required this.onApprove,
    required this.onReject,
    super.key,
  });
  final String name;
  final String workerLabel;
  final VoidCallback onApprove;
  final VoidCallback onReject;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: BsTokens.space2),
        child: Material(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(cfgRadius(context)),
          elevation: 1,
          shadowColor: Colors.black26,
          child: Padding(
            padding: const EdgeInsets.all(BsTokens.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: const TextStyle(
                        color: BsTokens.inkLight,
                        fontWeight: FontWeight.w700,
                        fontSize: 15)),
                const SizedBox(height: 2),
                Text(',
  't_bd073071': 's "📝 משימות שהעובד הציע" section (Wave G1c) — a
/// worker-PROPOSED task (status `',
  't_0647f633': 's own אשר/דחה surface on
      // the LIVE review queue (parallel to the manager dashboard',
  't_260c3232': 's queue tolerance (`|| employerId.isEmpty`) on both paths.
String authoringEmployerId(WidgetRef ref) =>
    (kTasksServer && useFirebaseBackend)
        ? (ref.read(currentUidProvider) ?? kDemoContractorId)
        : kDemoContractorId;

/// Open the משימות screen — the wire target for `openTasks`.
void openTasks(BuildContext context) =>
    Navigator.of(context).push(TasksScreen.route());

/// GLOBAL SEARCH (`kGlobalSearch`) — open a task',
  't_9729daa9': 'אין משימות לצוות עדיין — משימות חדשות יופיעו כאן',
  't_7a3fc1df': 'אישור המשימה?',
  't_c823bc35': 'אתה רואה את כל משימות הצוות. אשר עבודות שהוגשו ועקוב אחרי ההתקדמות.',
  't_598a927f': 'בביצוע',
  't_54b2bc93': 'המשימה הוחזרה לעובד לתיקון',
  't_13c761fe': 'המשימה נוצרה ✓',
  't_e4687747': 'המשימה עודכנה ✓',
  't_df07d85d': 'המשימה תסומן כהושלמה — פעולה סופית.',
  't_84a0b536': 'העובד הגיש את המשימה. אשר אם בוצעה כראוי, או החזר לתיקון.',
  't_855cf7ae': 'יש להזין שם משימה',
  't_c1bbefd8': 'לא נקבע',
  't_d47d1534': 'לדוגמה: התקנת קו מים חם',
  't_d0b83c0d': 'ממתינות',
  't_a6937001': 'משימה חדשה',
  't_07799abb': 'נשלח לאישור המנהל ✓',
  't_1c33a037': 'סיכום יומי — מה בוצע בפרויקט',
  't_1c0f3827': 'עובד הציע משימה חדשה — אשר כדי שתיכנס לביצוע, או דחה.',
  't_15834252': 'עריכת משימה',
  't_ecc570b5': 'צור משימה',
  't_c763dbdf': 'שיוך לעובד',
  't_dcaa1adc': 'שלח לאישור המנהל',
  't_4722b300': 'שמור שינויים',
  't_415e6625': 'תיאור המשימה',
  't_87dc5c44': '↩️ החזר לתיקון',
  't_fd785f34': '⏳ ממתינות בתור (\${pending.length})',
  't_c0502fad': '✅ אושרה הצעה: \${t.name}',
  't_207a7499': '✅ אישורי עובדים (קבלן) (\${pending.length})',
  't_e64a82a9': '✅ הושלמו ואושרו (\${done.length})',
  't_9f6fac20': '✅ המשימה שהצעת "\${t.name}" אושרה',
  't_8750371b': '✏️ ערוך',
  't_c1f63ca9': '❌ המשימה שהצעת "\${t.name}" נדחתה',
  't_222747f4': '❌ נדחתה הצעה: \${t.name}',
  't_f0c32db5': '👷 \$workerLabel · ⏱️ \$days ימים · 📝 ממתין לאישורך',
  't_14d26891': '👷 \${_wk(task.worker)} · 📋 \${task.steps.length} שלבים · ⏱️ \${task.days} ימים',
  't_da993a39': '📅 יומן עבודה — מה בוצע בכל יום',
  't_59a5bcf9': '📅 תאריך התחלה (לגאנט)',
  't_a25f3a72': '📝 משימות שהעובד הציע (\${proposals.length})',
  't_ac4c2243': '📸 ממתין לאישור שלך (\${review.length})',
  't_5606feb2': '🔨 בביצוע עכשיו (\${active.length})',
  't_8d40b3bc': '＋ משימה חדשה',
  't_5c68f112': ');

/// 🧩 אביזרים — the trade',
  't_e2b78690': 'אין עדיין אביזרים',
  't_89542300': 'הוסף אביזר',
  't_95e3cfc0': 'חובה?',
  't_43fb7039': 'למה חשוב',
  't_d1aa986d': 'מוצר מקושר',
  't_cc097285': 'מחיר',
  't_33169686': 'מחיר לא תקין',
  't_13f0b5f0': 'שם אביזר',
  't_a2545426': '🧩 אביזרים',
  't_e596b052': 's tile and LIVE on the add-form
// while the switch is on with zero staged values), an add-form (שם מאפיין ·
// kind dropdown · a values builder with deletable chips · ציר וריאנט? switch
// · הוסף מאפיין) writing
// through `upsertAttribute` under a DETERMINISTIC slug id
// ',
  't_3e1afd8f': 'אין עדיין מאפיינים',
  't_bb6651cd': 'בדיקת פירוק שם',
  't_9439d121': 'בחירה',
  't_414ce190': 'הוסף מאפיין',
  't_3ff65a85': 'הוסף ערך',
  't_7f00b1db': 'טקסט חופשי',
  't_20b1b4ac': 'למשל: 16',
  't_c19510f4': 'מספר',
  't_82e90f8e': 'ערך',
  't_6cf4b9de': 'ציר וריאנט ללא ערכים',
  't_44560b2f': 'ציר וריאנט?',
  't_4cf564c0': 'קוטר: 16',
  't_9208bca7': 'שם מאפיין',
  't_84ff9bc8': 'שם: ערך',
  't_b0960f88': '🏷️ מאפיינים',
  't_a24025ac': ');

/// Rebuild a category with a new title / sortIndex, preserving EVERY other
/// authored field (parentId, attributeSchemaIds, smartFixtureId — the domain
/// type has no copyWith).
TradeCategory _copy(TradeCategory c, {String? titleHe, int? sortIndex}) =>
    TradeCategory(
      id: c.id,
      tradeId: c.tradeId,
      titleHe: titleHe ?? c.titleHe,
      emoji: c.emoji,
      parentId: c.parentId,
      sortIndex: sortIndex ?? c.sortIndex,
      attributeSchemaIds: c.attributeSchemaIds,
      smartFixtureId: c.smartFixtureId,
    );

/// 🗂️ עץ קטגוריות — the trade',
  't_3ed3d278': 'אין עדיין קטגוריות',
  't_efe2fe31': 'הוסף קטגוריה',
  't_e08c750c': 'מאפיינים',
  't_e1427e7a': 'שינוי שם',
  't_ce71edab': 'שם קטגוריה',
  't_b4a39ab8': '🗂️ עץ קטגוריות',
  't_028e1bd6': ') + 1);

/// 🔌 כללי חיבור — the trade',
  't_8d29361a': 'אין עדיין מחברים',
  't_4211da20': 'בדוק חיבור',
  't_d7739d8a': 'הוסף מחבר',
  't_0792b7ca': 'חיבור \${a.nameHe} אל \${b.nameHe}',
  't_04f49672': 'חיבור <a> אל <b>',
  't_a0adf41e': 'כלל חדש',
  't_35fda2e8': 'כלל חיבור',
  't_c7eaa792': 'לא מתחבר',
  't_a8af26cd': 'מחבר א',
  't_a8e5583a': 'מחבר ב',
  't_4d6c957a': 'מחברים',
  't_ba7d1688': 'מחק כלל',
  't_6f8bdfab': 'מטריצת חיבורים',
  't_182c3db5': 'ספסל בדיקה',
  't_1a809352': 'שם מחבר',
  't_e02355c4': 'תווית שיטה',
  't_f3ddd235': '🔌 כללי חיבור',
  't_2832f7aa': ' (an upsert would silently overwrite that product). The
  /// id is the typed מק"ט VERBATIM (no slug — the sku IS the id); attributes
  /// land keyed attributeDefId → valueId | free text, non-empty entries only.
  void _add() {
    final name = _name.text.trim();
    final sku = _sku.text.trim();
    final catId = _categoryId;
    if (name.isEmpty || sku.isEmpty || catId == null) return;
    final doc = ref.read(tradesStoreProvider);
    if (!_cats(doc).any((c) => c.id == catId)) return;
    if (doc.products.any((p) => p.id == sku)) {
      setState(() => _skuTaken = true);
      return;
    }
    final attrs = <String, String>{};
    for (final d in _defs(doc)) {
      if (d.values.isNotEmpty) {
        final v = _attrChoice[d.id];
        if (v != null && d.values.any((x) => x.id == v)) {
          attrs[d.id] = v;
        }
      } else {
        final t = _attrText[d.id]?.text.trim() ?? ',
  't_6ea5be0b': ';

/// 📦 מוצרים — the trade',
  't_b36942ac': ';
  }

  /// Add from the form. Guards: empty name / empty מק"ט / no category →
  /// no-op; a מק"ט already present in doc.products → no-op + the red
  /// ',
  't_8de3e8b2': 'אין עדיין מוצרים',
  't_124d282b': 'בדוק',
  't_06e1a5c3': 'בדוק (dry-run)',
  't_80b1427c': 'הדבק CSV',
  't_5f85fbdf': 'הורד תבנית',
  't_a32df0f1': 'יובאו \$_importedCount מוצרים',
  't_08c51e6e': 'יובאו N מוצרים',
  't_ef7f3669': 'ייבא',
  't_6b3c5eb4': 'ייבוא מ-CSV',
  't_a9768032': 'כללי חיבור',
  't_9dac6925': 'מק"ט כבר קיים',
  't_9605e80a': 'צור קטגוריה קודם',
  't_053289d9': 'שגיאות: \${report.errors.length}',
  't_62f89c9e': 'שורה \${e.rowIndex}: \${e.messageHe}',
  't_6a34a23f': 'שורה R: <msg>',
  't_884e4bda': 'שם מוצר',
  't_57517572': 'תקינים: \${report.valid.length} · ',
  't_aad12a76': 'תקינים: N · שגיאות: M',
  't_ab3db7e1': '📦 מוצרים',
  't_5792902a': ';

/// 🔌 הקמת המערכת — the unified two-phase setup host (בונה-ענף → הגדרת-ארגון).
class SystemSetupHostScreen extends StatefulWidget {
  const SystemSetupHostScreen({super.key});

  static Route<void> route() => MaterialPageRoute<void>(
        builder: (_) => const SystemSetupHostScreen(),
      );

  @override
  State<SystemSetupHostScreen> createState() => _SystemSetupHostScreenState();
}

class _SystemSetupHostScreenState extends State<SystemSetupHostScreen> {
  /// 0 = build the trade (phase 1), 1 = configure the org (phase 2). Local
  /// widget state; no engine/global write.
  int _phase = 0;

  @override
  Widget build(BuildContext context) {
    // A plain switch (NOT IndexedStack): phase-2 constructs on advance, so its
    // initState reads orgConfigProvider fresh at entry (audited hazard #4).
    switch (_phase) {
      case 0:
        // Phase 1 — build the trade. Its own Scaffold/AppBar/bottom-bar; the
        // host only injects the "המשך" affordance via onContinue.
        return TradeBuilderHomeScreen(
          onContinue: () => setState(() => _phase = 1),
        );
      case 1:
      default:
        // Phase 2 — configure the org. Terminal phase: the manager exits via
        // the wizard',
  't_48f02190': 's 🛠️ ניהול tab, gated by the
// compile-const `kOrgConfigFlag` (armed in the live build, off in define-less
// test builds ⇒ the manager tab stays byte-identical there). Phase-1 is pushed
// DIRECTLY (the trade-builder screens do not self-gate), so `kTradeBuilder` stays
// owner-staged-OFF and its pinned tests are untouched.
// ─────────────────────────────────────────────────────────────────────────────

import ',
  't_ec8ce6ad': ';
    }
    return id;
  }
}

/// The draft/published chip — the `_StagePill` idiom (a 12% colour wash with
/// full-colour text): טיוטה = dark amber, פורסם = the ready-green.
class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.published});

  final bool published;

  @override
  Widget build(BuildContext context) {
    final color =
        published ? const Color(0xFF1F8A4C) : const Color(0xFFB45309);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        published ? ',
  't_8872b0c8': 's step 1 — the define screen.
          bottomNavigationBar: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                BsTokens.space4,
                BsTokens.space2,
                BsTokens.space4,
                BsTokens.space4,
              ),
              // Standalone route (onContinue == null) ⇒ byte-identical: just the
              // pinned add-action. Inside the unified setup host (onContinue set)
              // ⇒ a second "המשך להגדרת החברה" button advances to the org wizard.
              child: onContinue == null
                  ? _AddTradeButton(
                      onTap: () => Navigator.of(context)
                          .push(TradeDefineStepScreen.route()),
                    )
                  : Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _AddTradeButton(
                          onTap: () => Navigator.of(context)
                              .push(TradeDefineStepScreen.route()),
                        ),
                        const SizedBox(height: BsTokens.space2),
                        Semantics(
                          button: true,
                          label: ',
  't_3067ae84': 'אשף בניית ענף — שלב \$_kWizardStep מתוך \$_kWizardTotal',
  't_a74e8c7b': 'הגדרת הענף',
  't_c01b7557': 'הוסף ענף',
  't_ef638431': 'המשך להגדרת החברה ←',
  't_935dafeb': 'עדיין אין ענפים — הוסף את הראשון',
  't_5c122a0e': 'שלב 1 מתוך 6',
  't_9328476e': '🏗️ בונה ענפים',
  't_3bfcb97c': ';

/// The emoji a trade falls back to when the אימוג׳י field is left empty.
const String _kDefaultTradeEmoji = ',
  't_7bc9c006': ';

/// The fixed colour palette for a new trade — 6 predefined ARGB ints (the
/// `Brand.color` format `Trade.color` matches): teal · blue · purple · green ·
/// amber · the BuildSmart brand orange. The FIRST is the default selection.
const List<int> _kTradeColors = [
  0xFF1F6F6B,
  0xFF2C7BE5,
  0xFF5A4A8C,
  0xFF1F8A4C,
  0xFFF2A516,
  0xFFFF7A18,
];

/// 🏗️ הגדרת ענף — the trade-builder wizard',
  't_7f0cf50a': 'למשל: חשמל',
  't_49f953e8': 'פרסונה',
  't_3bdd6775': 'צבע \${index + 1}',
  't_0b573278': 'שם הענף',
  't_ef09cea8': 'שמור טיוטה',
  't_366ef32e': '🏗️ הגדרת ענף',
  't_c0d2923f': ';

/// Rebuild a trade with the published flag flipped, preserving EVERY other
/// authored field (nameHe, emoji, color, personaId, schemaVersion, brandIds —
/// the domain type has no copyWith; the s45 _copy idiom).
Trade _copy(Trade t, {bool? published}) => Trade(
      id: t.id,
      nameHe: t.nameHe,
      emoji: t.emoji,
      color: t.color,
      personaId: t.personaId,
      published: published ?? t.published,
      schemaVersion: t.schemaVersion,
      brandIds: t.brandIds,
    );

/// 🚀 פרסום ענף — the trade',
  't_ec257d64': 'אין כלל-חיבור יתום',
  't_985d7521': 'כל המוצרים משויכים לקטגוריה קיימת',
  't_18535f38': 'כללים: \${rules.length}',
  't_8311e683': 'לכל ציר וריאנט יש ערכים',
  't_a2baa8ac': 'לכל קטגוריה יש מוצר',
  't_fd6963c2': 'קטגוריות: \${cats.length} · מוצרים: \${products.length} · ',
  't_9b82b18d': 'קטגוריות: N · מוצרים: M ·
// כללים: K',
  't_9931c8a9': '🚀 פרסום ענף',
  't_7107be09': ');
    // Index safety: the שיחות pane sits at index 1, and external navigation
    // (global search / keyboard destinations) may leave the provider at 1.
    // With `chat` off the effective index is clamped to 0 (התראות) so the
    // IndexedStack can never point at the hidden pane.
    final sub = chatOn ? ref.watch(updatesSubTabProvider) : 0;
    // PUSH-CHAT degrade: with `chat` off the שיחות pane never mounts, so its
    // consumer (ChatsScreen — the chats_screen.dart consumePendingThread site)
    // can',
  't_17fb35f4': ';

/// Which sub-view the merged "עדכונים" tab shows: 0 = התראות, 1 = שיחות.
final updatesSubTabProvider = StateProvider<int>((_) => 0);

/// Benzi #3 — "עדכונים": the former התראות + שיחות tabs merged under ONE tab,
/// with a top segmented toggle. Both existing screens are kept alive
/// (`IndexedStack`) so their state (scroll / search / filters) survives a switch.
/// When the org',
  't_5f94da5b': 't render at all — התראות fills the tab.
class UpdatesScreen extends ConsumerWidget {
  const UpdatesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chatOn = modOn(ref, ',
  't_3f553804': 'שיחות אינן פעילות בחברה זו',
  't_56810610': 'אין גישה למצלמה',
  't_9444c0b0': 'החלף מצלמה',
  't_4e01da33': 'צלם',
  't_9415f92c': '📸 צלם',
  't_2a758bda': '
  /// under the code field until the input is edited again. Never set in the
  /// contractor flow.
  bool _codeRejected = false;

  /// Cluster #85א · role-gate mode only: whether the inline existing-customer
  /// login form (שם משתמש + קוד + ',
  't_bf4b9fac': ' is the
    // seeded username+code login (the revealed inline form normally handles
    // it — this path is a safety net), independent of the Firebase flag.
    final role = widget.boardRole;
    if (role != null) {
      _boardLogin(role);
      return;
    }
    // Contractor flow — live backend (flag ON): route to the Firebase
    // phone-OTP login sheet; on success we enter the app.
    if (useFirebaseBackend) {
      if (_busy) return; // a flow is already in flight — ignore the double-tap
      setState(() => _busy = true);
      unawaited(
        _enterViaAuth().whenComplete(() {
          if (mounted) setState(() => _busy = false);
        }),
      );
      return;
    }
    // Demo (flag OFF) — #19 honesty: there is no login server yet (tickets
    // #23/#27), so say so BEFORE entering as a demo guest. For App Store review
    // (kHideUnderConstruction) the self-declared "אין שרת … (דוגמה)" wording is
    // SOFTENED to a neutral guest-entry confirmation (Apple rejects apps that
    // present themselves as demos / missing a backend); the underlying guest
    // flow is identical, and flipping the flag restores the honest disclosure.
    final ok = await confirmDestructive(
      context,
      title: ',
  't_8163913b': ' is the PRIMARY path:
  /// tapping it reveals (inline, same card style) שם משתמש + קוד fields and a
  /// ',
  't_f01a67bc': ' under the
  /// code field via the errorText slot.
  void _boardLogin(BoardRole role) {
    final ok = ref
        .read(boardAuthProvider.notifier)
        .login(role, _name.text, _contact.text);
    if (!ok) setState(() => _codeRejected = true);
  }

  /// Whether the email+password door is open on the welcome registration form:
  /// the compile-time [kEmailPasswordAuth] OR the runtime 🌉 filtered-mode flag.
  /// A filtered client (Netfree/Rimon) has no working phone-OTP (SMS touches
  /// google hosts the filter blocks), so email+password through the edge proxy
  /// is their ONLY way to register — the same rule as the login sheet.
  bool get _emailAllowed =>
      kEmailPasswordAuth || ref.read(filteredModeProvider);

  void _register() {
    // Contractor flow only — in role mode (cluster #85א) the registration
    // form is not built; board login goes through [_boardLogin].
    //
    // server-gate-auth — live backend (flag ON): the welcome CTA must mint a
    // REAL Firebase account, never a local-only "registered" profile (the gap a
    // device test exposed). So flag-ON routes to [_registerViaAuth] and does
    // NOT call `user_profile.register` here. Demo (flag OFF): the verbatim
    // local register + advance to the profession step, byte-identical.
    if (useFirebaseBackend) {
      if (_busy) return; // a flow is already in flight — ignore the double-tap
      setState(() => _busy = true);
      unawaited(
        _registerViaAuth().whenComplete(() {
          if (mounted) setState(() => _busy = false);
        }),
      );
      return;
    }
    ref
        .read(userProfileProvider.notifier)
        .register(name: _name.text.trim(), contact: _contact.text.trim());
    _advance();
  }

  /// server-gate-auth (flag ON only) — mint a REAL account for a NEW user from
  /// the welcome form. The contact field accepts a phone OR an email:
  ///   • EMAIL → create the account directly with the typed password
  ///     (`createUserWithEmailPassword`); honest errors (`email-already-in-use`
  ///     / `weak-password`) are Hebrew-toasted and the user stays on welcome.
  ///   • PHONE → route to the login sheet',
  't_85564974': ' ואת ',
  't_b4d6f829': ' של \${AppBrand.name}',
  't_50f0e28c': '(כולל אימות דו-שלבי אם מוגדר) — לא נשמרת סיסמה במכשיר.',
  't_59c0f612': ').hasMatch(digits);
  }

  @override
  void dispose() {
    _name.dispose();
    _contact.dispose();
    _password.dispose();
    super.dispose();
  }

  void _advance() => ref.read(startupStepProvider.notifier).state = 1;

  /// task #65 + #85א · role-gate mode: try the seeded board credentials
  /// (the שם משתמש + קוד fields of the revealed login form). Success flips
  /// [boardAuthProvider] and the gated parent rebuilds into the board — no
  /// navigation here. Failure shows ',
  't_00a5862b': ': p.businessId,
        }).catchError((Object _) {}),
      );
    }
    ref.read(welcomeSeenProvider.notifier).state = true;
    unawaited(persistWelcomeSeen());
  }

  /// Manager (OWNER) gate — secure login is "כניסה עם Google" ONLY (no demo, no
  /// seed code). After a Google sign-in whose email is on the owner allowlist
  /// ([isOwnerEmail]) we grant the manager board; any other account is rejected.
  /// When Firebase is unavailable the Google button is replaced by an honest
  /// "needs a connection" message.
  List<Widget> _managerGoogleChildren() {
    final canGoogle = ref.read(authGatewayProvider) != null;
    return [
      const CfgText(
        ',
  't_ad704d71': '` defaults
    //     when the key is absent). `ensureUser` then becomes an UPDATE that ADDS
    //     `status`, and the users update rule FREEZES `status` → permission-
    //     denied, swallowed by guardWrite. The doc is left status-less forever,
    //     `BsUser.fromWire(null)` decodes it as `pending`, and EVERY registered
    //     user is shown "ממתין לאישור מנהל" with all permissions denied.
    //   • ensureUser first (this order) → the doc is CREATED carrying
    //     `status: ',
  't_2a2ecc37': 's
  /// gate route) rebuilds into the board in place, so no navigation happens.
  final BoardRole? boardRole;

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  final TextEditingController _name = TextEditingController();
  final TextEditingController _contact = TextEditingController();

  /// server-gate-auth — the registration PASSWORD, used ONLY when the backend
  /// flag is ON and the contact is an email: the welcome CTA then mints a REAL
  /// Firebase account (`createUserWithEmailPassword`) instead of writing a
  /// local-only profile. The field is not built (and never read) when the flag
  /// is OFF, so the demo flow stays byte-identical.
  final TextEditingController _password = TextEditingController();

  @override
  void initState() {
    super.initState();
    _name.addListener(_onChanged);
    _contact.addListener(_onChanged);
    _password.addListener(_onChanged);
  }

  /// task #65 + #85א · role-gate mode only: a well-formed code that
  /// [BoardAuthNotifier.login] rejected — shows ',
  't_84316f8f': 's `screen-welcome`
/// (`index.html`) in the "hero sheet" look: a tall orange gradient hero with a
/// glassy logo badge up top, and a white sheet that lifts over it carrying the
/// form — existing-customer login, full name + contact (saved locally, no
/// server), or "continue as demo". On continue → the profession step.
class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key, this.boardRole});

  /// task #65 + cluster #85א · role-gate mode: when set, this screen acts as
  /// the login gate of a role board. ',
  't_2480853f': 's back. Instead we latch a one-shot
      // prompt so the shell opens the role-request sheet ONCE right after entry —
      // "בקשת תפקיד במסך אחד אחרי הרשמה" — and the person CHOOSES their role.
      // The account is already created `pending` (onRegisteredLogin) and the
      // server users-create trigger still seeds the approval queue, so nobody is
      // stranded even if they dismiss the sheet (their chip reads 🟠 דרוש הרשמה
      // and one tap re-opens it).
      ref.read(promptRoleRequestProvider.notifier).state = true;
    }
    if (uid != null && writer != null) {
      final p = ref.read(userProfileProvider);
      // Best-effort identity mirror (merge); never blocks entry. The contact is
      // EITHER a phone OR an email (the email-create flow stores the email in
      // `contact`), so route it to the matching field — never write an email
      // into `phone` (the field users_lookup.uidByPhone queries).
      // Runs AFTER the user-system create above — see the ordering note there.
      unawaited(
        writer.set(uid, {
          if (p.name.isNotEmpty) ',
  't_1333dfb6': 's currentUser when the
      // snapshot still lags.
      _finishAfterAuth();
      return;
    }
    // Phone contact (or non-email): the account is minted by phone-OTP in the
    // login sheet. Mirror the name first so the post-auth write carries it.
    ref
        .read(userProfileProvider.notifier)
        .register(name: _name.text, contact: contact);
    await _enterViaAuth();
  }

  void _demo() {
    final role = widget.boardRole;
    if (role != null) {
      // מנהל = חשבון הבעלים: אין כניסת דמו (גם הגנה אם נקרא בטעות) — "אין לו דמו".
      if (role == BoardRole.manager) return;
      // Role-gate mode: the demo affordance enters a demo board session —
      // the contractor profile / startup flow is never touched.
      ref.read(boardAuthProvider.notifier).enterDemo(role);
      return;
    }
    ref.read(userProfileProvider.notifier).continueAsDemo();
    // Record the CHOICE to browse without an account. On the live backend this
    // is the only thing that opens the gate for a visitor who is not signed in
    // (OnboardingGate) — `welcomeSeen` alone no longer counts as entry, because
    // the anonymous catalog bootstrap makes everyone look "signed in" and a
    // returning visitor would otherwise slip into the app never having been
    // asked who they are.
    ref.read(guestBrowsingProvider.notifier).state = true;
    unawaited(persistGuestBrowsing());
    _advance();
  }

  Future<void> _existingLogin() async {
    // Board role-gate FIRST (#65): in role mode ',
  't_62056516': 'או הירשם',
  't_12d2fe32': 'או כניסה עם קוד (demo)',
  't_730b4826': 'אין שרת התחברות, כך שבפועל זה נכנס כאורח.',
  't_a1322098': 'אישור והמשך',
  't_51520464': 'איתה תוכלו להתחבר בכל מכשיר.',
  't_da4eed83': 'באפליקציה. אפשר להירשם מאוחר יותר מההגדרות.',
  't_4f954549': 'בהרשמה אתה מאשר את ',
  't_7671e303': 'בודק את שם המשתמש והקוד מול החשבונות הקיימים ונכנס ללוח. ',
  't_c90d9e0a': 'בוחרים סיסמה (6 תווים ומעלה) ליצירת החשבון. ',
  't_8eb24699': 'בכניסה הבאה. כאן מקלידים מספר טלפון או כתובת מייל.',
  't_106fa038': 'בעל המערכת נכנס עם חשבון ה-Google שלו — הדרך ',
  't_87a7ec2f': 'גדולות לקטנות.',
  't_e82f2517': 'הדרך הראשית להיכנס ללוח — לחיצה פותחת את שדות שם המשתמש ',
  't_2fadaf28': 'הזיהוי בפועל הוא לפי טלפון/מייל.',
  't_f4192305': 'המהירה להיכנס מחובר. רק חשבון הבעלים מורשה.',
  't_29996c45': 'המספר שמזהה אותך. נשלח אליו קוד חד-פעמי ב-SMS, ',
  't_4ffa055c': 'המקצוע. נפעל רק כשהשדות תקינים.',
  't_7e02b34c': 'המשך כאורח',
  't_089c09e7': 'המשך ללא רישום (דוגמה)',
  't_d9704c99': 'השם שיוצג בפרופיל ובהזמנות. שדה זה פחות קריטי — ',
  't_98692cab': 'ואיתו נכנסים גם בפעם הבאה — בלי סיסמה לזכור.',
  't_e5b312e3': 'והקוד שקיבלת.',
  't_a26a284b': 'חשבון הבעלים — כניסה מאובטחת עם חשבון Google.',
  't_4ff35865': 'טלפון או אימייל.',
  't_183711ee': 'כניסה ללוח בלי חשבון — לסיור מהיר עם נתוני דוגמה בלבד.',
  't_80b2c9a9': 'כניסה ללקוח קיים',
  't_6e40db07': 'כניסה עם Google',
  't_f905c811': 'כניסה עם Google (בעלים)',
  't_40452f81': 'כניסה עם Google (בעלים/מנהל)',
  't_4634e72a': 'כניסת מנהל דורשת חיבור לאינטרנט. נסה שוב כשיש חיבור.',
  't_4dc62373': 'כניסת מנהל המערכת',
  't_f52fda14': 'מדיניות הפרטיות',
  't_2d0f4848': 'מהשרטוט עד האתר — בלי לשכוח כלום',
  't_956d66ad': 'מותרים.',
  't_9158640c': 'מיועד למי שכבר נרשם — כניסה ישירה פנימה. כרגע ',
  't_92fef321': 'מיועד למי שכבר נרשם — נפתח חלון התחברות עם ',
  't_7e70b2e2': 'מלא את הפרטים — סימן ✓ יופיע כשהשדות תקינים',
  't_b0c2ea96': 'מסיים את ההרשמה, שומר את הפרטים, וממשיך לבחירת ',
  't_9ebd4e01': 'מספר טלפון',
  't_3267d44d': 'מספר נייד לא תקין',
  't_a97bd309': 'מצב דמו',
  't_e0d54a4f': 'מצב דמו — נתונים מקומיים',
  't_a83fa2c9': 'נכנסים כאורח כדי לעיין באפליקציה.',
  't_76af1a14': 'נכנסים כאורח-דמו בלי לשמור פרטים — לסיור מהיר ',
  't_02d97588': 'נכנסים עם חשבון ה-Google של הבעלים. גוגל מאמתת את הזהות ',
  't_339d695f': 'נפעל רק כששני השדות מלאים והקוד בן 4 ספרות.',
  't_068c43d2': 'עדיין אין שרת התחברות — נכנסים כאורח (דוגמה).',
  't_cf14b3b0': 'פרטי הקשר שמזהים אותך כלקוח — לפיהם תזוהה ',
  't_8faa9040': 'קוד בן 4 ספרות',
  't_b7cc7ebe': 'קוד בן 4 ספרות שקיבלת יחד עם שם המשתמש — רווחים ומקפים ',
  't_f6d91e3e': 'קוד כניסה',
  't_1a46ab00': 'קטלוג, חיפוש חכם, סל והזמנות — הכול במקום אחד',
  't_151fc097': 'רישום ראשוני',
  't_2f64192b': 'רק חשבון הבעלים יכול להיכנס כמנהל המערכת',
  't_f1f988f3': 'שם המשתמש שהוגדר לך בלוח — באנגלית, בלי הבדל בין אותיות ',
  't_65784d97': 'שם משתמש',
  't_6626fba3': 'שם משתמש או קוד לא נכונים',
  't_a25bd15a': 'תנאי השימוש',
  't_8a0dd4bd': '✓ אינטרנט מסונן פעיל — כניסה במייל וסיסמה',
  't_f9c9f4e1': ' && !rejLog.contains(t.id)) t.id,
    ];
    if (newlyRejected.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          ref.read(taskRejectionLogProvider.notifier).recordAll(newlyRejected);
        }
      });
    }

    // Giant-system V2 — the `chat` module gate, watched ONCE here in build()
    // (the home_shell precedent); the nav + body below use the captured
    // boolean. Index safety (the updates_screen clamp precedent): שיחות is
    // LOGICAL tab 1 and `_tab` may still hold it (a stale value from before
    // the org turned chat off), so with `chat` off the EFFECTIVE index clamps
    // to 0 (משימות) — the hidden pane is unreachable and the logical ids
    // 0 משימות · 1 שיחות · 2 דוחות · 3 אזור אישי never renumber. All-on:
    // `tab == _tab`, byte-for-byte behavior.
    final chatOn = modOn(ref, ',
  't_cb7feccc': ' : _fmtDur(worked),
              ),
            ],
          ),
          const SizedBox(height: BsTokens.space3),
          // 📍 מיקום-לחיץ (contract 3) — the day',
  't_acbc9aeb': ' chip) sees ONLY
/// their own tasks everywhere: queue, submitted, stats and reports.
///
/// TABS (#67): משימות (the board, default) · שיחות (worker-audience
/// [ChatsScreen], contract §3) · דוחות (submission history + live stats) ·
/// אזור אישי ([WorkerProfileScreen]).
///
/// LIVE (cross-persona W3): the board reads the single unified [tasksProvider]
/// (verbatim detail/steps/photo — the §6 engine). Wave T1 collapsed the old
/// dual-engine bridge into ONE source of truth: a worker submit and the 👔
/// manager dashboard',
  't_28085001': '"מה להביא" ודיווח ביצוע. כפתור "שלח לאישור" מגיש את ',
  't_297c3c03': '),
                    onPressed: () => onSubmit!(task),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 🧰 בדוק ציוד נדרש (#112) — a secondary (outlined) action under the current
/// bucket that opens Builder-B',
  't_82356a9c': '), which
        // flows through the SAME contractor proposal-approval already built
        // (Wave G1). Always available, like the gantt/stock buttons.
        _DefectsButton(onPressed: () => showDefectsSheet(context)),
        // 📝 הצעות שממתינות לאישור (Wave G1) — the worker',
  't_0a874008': ');

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ⏱️ task clock (#85ו) — read-only view of the bs.task-clock.v1 side-map
    // (see worker_reports_tab.dart; the writer lives with the engine). No
    // stamp for this task → no line: honest, no invented times.
    final clock = ref.watch(taskClockProvider).asData?.value[task.id];
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space2),
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        elevation: 1,
        shadowColor: Colors.black26,
        child: InkWell(
          // #71: any task card opens its detail sheet (steps/הוראות/תמונה).
          borderRadius: BorderRadius.circular(cfgRadius(context)),
          onTap: () => showWorkerTaskDetailSheet(context, taskId: task.id),
          child: Padding(
            padding: const EdgeInsets.all(BsTokens.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF2F3F5),
                        borderRadius: BorderRadius.circular(
                          BsTokens.radiusPill,
                        ),
                      ),
                      child: Text(
                        kTaskStatusLabel[task.status] ?? ',
  't_39a82003': ',
                        style: const TextStyle(
                          color: BsTokens.inkLight,
                          fontWeight: FontWeight.w700,
                          fontSize: 12.5,
                        ),
                      ),
                    ),
                    const Spacer(),
                    // #113 chevron-צלילה — the visible dive affordance into the
                    // task',
  't_b864f760': ',
                  style: TextStyle(
                    color: numColor,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              // The attendance/work dot — a tiny brand dot, or an invisible
              // spacer so chips keep one height.
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color:
                      hasDot
                          ? (selected ? BsTokens.brandDark : BsTokens.brand)
                          : Colors.transparent,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// נוכחות + מיקום של היום-הנבחר (#113). On TODAY ([isToday]) the big
/// clock-with-GPS action ([onClock], contract 4) is live; on a past day the
/// panel is a read-only summary. The location row launches the nav sheet
/// ([onOpenLocation], contract 3) when the day carries a coordinate.
class _DayAttendanceCard extends StatelessWidget {
  const _DayAttendanceCard({
    required this.day,
    required this.isToday,
    required this.onClock,
    required this.onOpenLocation,
  });

  final AttendanceDay? day;
  final bool isToday;

  /// clock-with-GPS — null on a past day (read-only).
  final VoidCallback? onClock;
  final VoidCallback onOpenLocation;

  @override
  Widget build(BuildContext context) {
    final inTs = day?.inTs;
    final outTs = day?.outTs;
    final worked = day?.worked;
    final hasLocation = day != null && mapsQueryForDay(day!) != null;

    // The clock action label mirrors the attendance screen',
  't_70826425': ';

/// 🦺 עובד — the field-worker BOARD. Same shell/style as the contractor app
/// (white AppBar + card list + the home_shell-style bottom tab bar); only the
/// content differs. The task cards/buckets are the faithful port of the
/// prototype `renderWorker()` (proto 06 §4.2) — minus the worker picker, which
/// is replaced by the real logged identity (#66).
///
/// 🔒 BOARD GATE (#66, חוק: מבחוץ לא רואים כלום): without a worker
/// [BoardSession] the build returns ONLY the registration gate
/// ([WelcomeScreen] in role mode) — no board content widget is constructed.
/// The logged worker (ran→רן · omer→עומר · demo→רן + ',
  't_3ad2205d': 's
  /// build(), captured here): false hides the שיחות item. The LOGICAL tab ids
  /// (0 משימות · 1 שיחות · 2 דוחות · 3 אזור אישי) NEVER renumber — the bar',
  't_c4b48e8b': 's "היום"); honest, no
    // invented per-day mapping.
    final hasPlan = buildDayStages().any((s) => s.worker == worker);
    final todayKey = attendanceDateKey(today);

    bool hasDot(DateTime d) {
      final key = attendanceDateKey(d);
      if (attDays.contains(key)) return true;
      return hasPlan && key == todayKey;
    }

    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Expanded(
                child: CfgText(
                  ',
  't_64e4559b': 's `_PrimaryBtn`. A null [onTap] renders it disabled (greyed
/// fill, no tap) so the save action can be guarded until the name is non-empty.
class _ProposePrimaryBtn extends StatelessWidget {
  const _ProposePrimaryBtn({
    required this.label,
    required this.onTap,
    super.key,
  });

  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final enabled = onTap != null;
    return Semantics(
      button: true,
      enabled: enabled,
      label: label,
      excludeSemantics: true,
      child: Material(
        color: enabled ? BsTokens.brand : const Color(0xFFE9EAEC),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        child: InkWell(
          borderRadius: BorderRadius.circular(BsTokens.radiusPill),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: enabled ? bsOnAccent(context) : BsTokens.mutedLight,
                fontWeight: FontWeight.w800,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// The "שלח לאישור" action on a current-bucket task — a `brand`-fill pill (the
/// worker app',
  't_c1431fb9': 's approval (G1c).
        _ProposeTaskButton(onPressed: _openProposeSheet),
        // 📊 גאנט משימות (Wave G2b) — a READ-ONLY peer secondary action that
        // opens the same timeline sheet the contractor uses; the worker only
        // views their schedule (no editing). Always available, like the stock
        // button — not gated on a current task.
        _GanttButton(onPressed: () => showTasksGanttSheet(context)),
        // 🔧 ליקויים (Wave G3b) — a peer secondary action: the worker REPORTS a
        // defect here (showDefectsSheet → proposeTask kind:',
  't_7d3668fb': 's card style (white rounded card). Tapping the
/// card opens the full detail sheet (#71 — real steps/instructions/photo).
/// When [onSubmit] is provided AND the task is in a submittable status
/// (`active`/`rejected`), a "שלח לאישור" button is shown that calls it.
class _TaskCard extends ConsumerWidget {
  const _TaskCard({required this.task, this.onSubmit});

  final TaskItem task;
  final void Function(TaskItem)? onSubmit;

  /// Submittable = a worker-owned status the manager has not yet seen.
  bool get _canSubmit =>
      onSubmit != null &&
      (task.status == ',
  't_ed204797': 's deep-links re-evaluates and opens the board.
    // [docsGateOverrideProvider] is the TEST SEAM: non-null forces the decision
    // (board tests set true to bypass this gate). Sits ABOVE the journal-home
    // below — none of it is disturbed.
    final ov = ref.watch(docsGateOverrideProvider);
    final r = ref.watch(workerDocsReadyProvider(session.username));
    final ready = ov ?? r.ready;
    if (!ready) {
      return DocsReadinessGate(role: BoardRole.worker, readiness: r);
    }

    final worker = workerIndexForSession(session);

    // One source of truth (Wave T1): the manager dashboard now decides on the
    // SAME unified [tasksProvider] this board reads, so a manager review→done /
    // review→rejected flips the card here live with no reconcile — the old
    // legacy-engine mirror is gone.
    final rich = ref.watch(tasksProvider);

    // #85ז first-pass log: remember every task ever seen `rejected` — the
    // engine keeps only the CURRENT status, so the reports tab needs this log
    // to compute אחוז אישור-ראשון across resubmits. Post-frame so the write
    // never lands mid-build; no-op when nothing is new (cannot loop).
    final rejLog = ref.watch(taskRejectionLogProvider);
    final newlyRejected = [
      for (final t in rich)
        if (t.status == ',
  't_0e19fdc1': 's header already says "אין משימה פעילה" so it passes nothing.
  final String? emptyText;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
            BsTokens.space1,
            BsTokens.space4,
            BsTokens.space1,
            BsTokens.space2,
          ),
          child: Text(
            header,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ),
        if (tasks.isEmpty && emptyText != null)
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(
              BsTokens.space1,
              0,
              BsTokens.space1,
              BsTokens.space2,
            ),
            child: Text(
              emptyText!,
              style: const TextStyle(
                color: BsTokens.mutedLight,
                fontSize: 13.5,
              ),
            ),
          )
        else
          for (final t in tasks)
            HelpTarget(
              title: ',
  't_d47deceb': 's identity). The captured photo is therefore actually stored on
  /// the task — the manager sees it in the approvals queue. Cancel anywhere →
  /// honest toast inside the shared flow, NO submit. `Future<void>
  /// Function(TaskItem)` is assignable to the existing `void Function(TaskItem)`
  /// onSubmit callback, so no caller changes.
  Future<void> _submit(TaskItem task) async {
    await submitWithProofPhoto(context, ref, task);
  }

  /// 📷 סרוק מוצר (#85ה) — open the device scanner; an exact SKU match opens
  /// the product',
  't_f575a616': 's own feed only (state/worker_notifs.dart).
            const WorkerNotifsBell(),
            // 🗂️ לוח משימות מלא (#114) — the status-GROUPED hierarchical board
            // of ALL this worker',
  't_df61dea5': 's plan context. Honest empty line when none.
        WorkerTodayStrip(worker: widget.worker),
        const SizedBox(height: BsTokens.space4),
        _SummaryCard(
          name: workerShortName(widget.worker),
          demo: widget.demo,
          done: done,
          total: total,
          activeCount: hasActive ? 1 : 0,
          queueCount: queue.length,
          submittedCount: submitted.length,
          hasActive: hasActive,
          hasQueue: queue.isNotEmpty,
        ),
        const SizedBox(height: BsTokens.space4),
        // משימות-היום (#113) — the live buckets from [tasksProvider], cards
        // that dive into the detail sheet (#71, chevron). HONEST framing: the
        // §6 tasks carry no calendar date, so these are the worker',
  't_107a02a3': 's selected day — pre-pressed on TODAY at first entry (#113).
  /// Date-only (midnight) so day-key comparisons are exact.
  late DateTime _selected;

  // ➕ הצעת-משימה (Wave G1b) — the worker-authoring sheet',
  't_05d18c81': 's sheet. Only
        // shown when there is a current task, so it never offers an empty
        // checklist. Placed under the current section, above the queue header —
        // the queue/submitted headers keep their order (reached by scroll).
        if (current.isNotEmpty)
          _EquipmentButton(
            onPressed:
                () => showEquipmentChecklistSheet(context, ref, tasks: current),
          ),
        // 📦 מלאי הקבלן (Wave E1) — READ-ONLY view of the employing contractor',
  't_158d548f': 's נוכחות + מיקום (the location
/// row launches [openNavSheet], contract 3) + a clock-with-GPS button on TODAY
/// (contract 4) + that day',
  't_6f69157b': '}).isNotEmpty;

    // Attendance ledger of the logged worker (#66) — drives the week-strip dots
    // and the selected-day נוכחות/מיקום panel.
    final ledger = ref.watch(workerAttendanceProvider);
    final selectedDay = _attendanceFor(ledger, _selected);

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space4,
        BsTokens.space5,
      ),
      children: [
        // 📅 JOURNAL (#113) — the week strip, TODAY pre-pressed; a day with
        // attendance OR a planned work-stage carries a dot.
        _WeekStripCard(
          selected: _selected,
          username: widget.username,
          worker: widget.worker,
          onSelect: (d) => setState(() => _selected = d),
          onFullMonth:
              () => Navigator.of(context).push(WorkerAttendanceScreen.route()),
        ),
        const SizedBox(height: BsTokens.space4),
        // נוכחות + מיקום של היום-הנבחר (#113). On TODAY the clock-with-GPS
        // button (contract 4) is live; on a past day the panel is a read-only
        // summary. The location row launches the nav sheet (contract 3).
        _DayAttendanceCard(
          day: selectedDay,
          isToday: _selectedIsToday,
          onClock: _selectedIsToday ? _clockWithGps : null,
          onOpenLocation: () => _openDayLocation(selectedDay),
        ),
        const SizedBox(height: BsTokens.space4),
        // סדר-יום (#85ה): the worker',
  't_1124252d': 'אין מיקום שמור',
  't_06490223': 'אין מיקום שמור ליום זה',
  't_c6211d05': 'אין משימות בתור — משימות חדשות מהמנהל יופיעו כאן',
  't_0672fcfc': 'אין משימות פתוחות',
  't_20948f77': 'אינו זמין — הנוכחות נרשמת בלי מיקום, בלי המצאה.',
  't_4959ed40': 'ארבעת אזורי הלוח: משימות — העבודה שלך; שיחות — קבלן, מנהל ',
  't_dfd3b491': 'ב-Waze או ב-Google Maps אל מיקום העבודה.',
  't_cdb41947': 'בדוק ציוד נדרש',
  't_aa4b7b21': 'בעבודה מאז',
  't_e3c8babc': 'בתור',
  't_814500a2': 'בתור, בבדיקה והושלמו — עם פס-התקדמות וצלילה לכל משימה.',
  't_d15290e3': 'הוגשו',
  't_18ab1bcb': 'הוסף משימה',
  't_1fe80a76': 'המשימה לאישור המנהל.',
  't_4edafa24': 'המשימה תישלח לקבלן לאישור',
  't_3ed07ca5': 'ואיזה באתר. אינך עורך מלאי זה; הוא של הקבלן.',
  't_911a784c': 'ובוט; דוחות — היסטוריית ההגשות; אזור אישי — פרופיל ויציאה.',
  't_80706ce9': 'וברגע שאישר אותו הוא נכנס לביצוע — בדיוק כמו משימה.',
  't_f026c849': 'וסיכום-עבודה לכל יום בחודש.',
  't_61ba56f2': 'חודש מלא',
  't_2e8adfc2': 'חודש מלא ›',
  't_e9a871d1': 'טאבי הלוח',
  't_3a4963c4': 'יום \$label \$dayNum\${isToday ? ',
  't_7a5e846b': 'יציאה מהלוח',
  't_3814146e': 'יש לך משימה פעילה',
  't_99122866': 'יש משימות בתור',
  't_bbbeb52f': 'לא נמצא מוצר בקטלוג עבור הקוד \$code',
  't_d3923f32': 'לא נרשמה נוכחות ביום זה',
  't_7740cfc5': 'לא נשמר מיקום ליום זה',
  't_aa4d97c2': 'לדוגמה: התקנת ברז במטבח',
  't_cf0bca3f': 'לוח משימות מלא',
  't_1006dc45': 'לחיצה על הכרטיס פותחת את פירוט המשימה — שלבים, הוראות, ',
  't_87812824': 'לקבלן לאישור, ורק לאחר שאישר אותה היא הופכת לפעילה אצלך.',
  't_30071346': 'מיקום העבודה',
  't_787492d1': 'מיקום העבודה · \${_fmtJournalDate(_selected)}',
  't_5f665727': 'מיקום העבודה נשמר — פתח ניווט',
  't_90e3ae50': 'מיקום לא זמין — נרשמה נוכחות בלי מיקום',
  't_1d70b296': 'מלאי הקבלן',
  't_7c23c516': 'מציג לצפייה בלבד את לוח-הזמנים של המשימות לפי תאריך-התחלה ',
  't_59442551': 'מציג לצפייה בלבד את מלאי הקבלן המעסיק — איזה פריט נמצא במחסן ',
  't_13ee6d8f': 'מרכז את כל הכלים והחומרים הדרושים למשימות הפעילות שלך לרשימה ',
  't_816b1d00': 'מתוזמן. הקבלן קובע את התאריכים; אתה רואה כאן את התזמון.',
  't_c5cb538b': 'נוכחות עם מיקום',
  't_51eac91a': 'ניתוק מלא נמצא בטאב אזור אישי.',
  't_a8768903': 'נפתח כאן בכרטיס המוצר המלא — כולל ערכת ההתקנה שלו.',
  't_4be69763': 'נשלח לקבלן לאישור 📝',
  't_ad240d0a': 'נשמר ממכשיר ה-GPS בעת רישום הכניסה. לחיצה פותחת ניווט ',
  't_da0af1c1': 'סוגר את מסך לוח העובד וחוזר אחורה. אינו מנתק את החשבון — ',
  't_c92d3881': 'סרוק מוצר',
  't_0ec5527d': 'סריקת מוצר',
  't_fe9230b7': 'עוד לא הגשת משימות לאישור',
  't_625ff038': 'פותח את הגדרות הלוח המותאמות לעובד.',
  't_d8acb48a': 'פותח את לוח-הנוכחות החודשי המלא — כניסה/יציאה, מיקום ',
  't_d5394947': 'פותח טופס לדיווח על ליקוי שמצאת. הליקוי נשלח לקבלן לאישור, ',
  't_7244d502': 'פותח טופס להצעת משימה חדשה לקבלן. המשימה שאתה מציע נשלחת ',
  't_ab353ca0': 'פותח לוח של כל המשימות שלך מקובצות לפי מצב — פעילות, ',
  't_55fe1b71': 'פותח מצלמה לסריקת ברקוד או מק"ט. מוצר שנמצא בקטלוג ',
  't_bf556864': 'פעילה',
  't_6c2a6fd9': 'פתח ניווט למיקום העבודה',
  't_fdfa083f': 'קליסט מאוגד ליום, שאפשר לסמן ולשלוח לקבלן.',
  't_6b199499': 'רושם כניסה/יציאה להיום ושומר את מיקום ה-GPS. אם המיקום ',
  't_bd905b17': 'שלום, \$name 👷',
  't_52a52416': 'שלח לקבלן לאישור',
  't_1f0950a9': '⏱️ בעבודה מאז \$hh:\$mm',
  't_6a674ba8': '⏱️ בעבודה מאז HH:MM',
  't_0be0c12b': '⏱️ זמן עבודה: \${_fmtClockDuration(d)}',
  't_6fbc6524': '⏱️ זמן עבודה: …',
  't_8a2a89c5': '⏳ הבאות בתור (\${queue.length})',
  't_38c43858': '➕ הצעת משימה לקבלן',
  't_2526c26f': '🎉 אין משימה פעילה כרגע',
  't_2b9012ed': '📅 היומן שלי',
  't_20f37dcc': '📋 שהגשת (\${submitted.length})',
  't_68565e99': '📝 הוצעה',
  't_5cd0b6fc': '📝 הצעות שממתינות לאישור (\${proposed.length})',
  't_8de69fc7': '🔨 המשימה הנוכחית שלך',
  't_106642ff': '🔴 יציאה עם מיקום',
  't_93fc3828': '🔴 נרשמה יציאה עם מיקום',
  't_fb2968f2': '🕐 נוכחות היום',
  't_06f14ccb': '🕒 \${task.days} ימים · \${task.steps.length} שלבים',
  't_1251f198': '🟢 כניסה עם מיקום',
  't_230d64b4': '🟢 נרשמה כניסה עם מיקום',
  't_dbabe253': '🦺 עובד',
  't_55253f61': '\$d ב\${_kHebMonths[m - 1]} \$y',
  't_308b844c': '\$dayCount ימים · \${_fmtDur(total)} שעות',
  't_40a159b7': '\${_fmtDateKeyLong(day.date)} — מיקום כניסה',
  't_54e0a263': '\${item.stepsDone}/\${item.stepsTotal} שלבים',
  't_87a4398b': ',
                      style: TextStyle(fontSize: 8),
                    ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── day-detail sheet ──────────────────────────────────────────────────────────

/// The day drill-down: כניסה/יציאה+סה"כ, the CLICKABLE location (contract 3 —
/// [openNavSheet] to Waze / Google Maps; honestly hidden when no coordinate was
/// recorded), and the HONEST per-day work summary from [tasksProvider].
class _DayDetailSheet extends StatelessWidget {
  const _DayDetailSheet({required this.day, required this.work});

  final AttendanceDay day;
  final List<DayWorkItem> work;

  @override
  Widget build(BuildContext context) {
    final inTs = day.inTs;
    final outTs = day.outTs;
    final worked = day.worked;
    final loc = mapsQueryForDay(day);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: SafeArea(
        top: false,
        child: Container(
          margin: const EdgeInsets.all(BsTokens.space2),
          padding: const EdgeInsets.all(BsTokens.space4),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(cfgRadius(context)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      ',
  't_b4479db9': ';

  bool get _viewingCurrentMonth {
    final now = DateTime.now();
    return _month.year == now.year && _month.month == now.month;
  }

  @override
  Widget build(BuildContext context) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — worker-board screen.
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.worker) {
      return const WelcomeScreen(boardRole: BoardRole.worker);
    }
    final username = session.username;
    final workerIndex = workerIndexForSession(session);

    final all = ref.watch(workerAttendanceProvider);
    final tasks = ref.watch(tasksProvider);
    final todayKey = attendanceDateKey(DateTime.now());
    AttendanceDay? today;
    for (final d in all) {
      if (d.username == username && d.date == todayKey) {
        today = d;
        break;
      }
    }
    final monthDays =
        attendanceMonth(all, username, _month.year, _month.month);
    final monthTotal = attendanceTotal(monthDays);
    final sentThisMonth = _sentMonths.contains(_monthKey);

    // Fast lookup: yyyy-MM-dd → that day',
  't_4401426e': ';

/// `yyyy-MM-dd` → `d בMMMM yyyy` (the sheet',
  't_2667f7ad': ';

/// 🕐 נוכחות (#105) — the worker',
  't_a2227d11': 's status + the big state-aware action: כניסה (no open shift) →
/// יציאה (clocked in) → an honestly-disabled "נרשמה נוכחות להיום ✓" once the
/// day is complete (one shift per day). Both actions capture GPS (contract 4).
class _ClockCard extends StatelessWidget {
  const _ClockCard({
    required this.today,
    required this.onClockIn,
    required this.onClockOut,
  });

  final AttendanceDay? today;
  final VoidCallback onClockIn;
  final VoidCallback onClockOut;

  @override
  Widget build(BuildContext context) {
    final inTs = today?.inTs;
    final outTs = today?.outTs;
    final worked = today?.worked;
    final hasLoc = mapsQueryForDay(today ?? _emptyDay) != null;

    final String label;
    final Color color;
    final VoidCallback? onTap;
    if (inTs == null) {
      label = ',
  't_a6146b2c': 's נוכחות at a glance; tapping a populated day opens a
/// detail sheet with כניסה/יציאה+סה"כ, a CLICKABLE location (contract 3:
/// [openNavSheet] → Waze / Google Maps), and an HONEST per-day work summary
/// derived from [tasksProvider] (which tasks were done/advanced that calendar
/// day, matched by the task clock',
  't_f0bbcc68': 'אין פירוט-עבודה משויך ליום זה',
  't_5abf4fd8': 'התחיל ביום זה',
  't_a9e89ff5': 'יום \$dom, \${worked == null ? ',
  't_f9794796': 'יום \$dom, אין רישום',
  't_dbcdf216': 'מיקום לא זמין — נרשמה כניסה \${_fmtTime(DateTime.now())} בלי מיקום',
  't_99bd848a': 'סיכום עבודה יומי',
  't_17f08c39': 'פתח ניווט למיקום',
  't_354f8bc7': 'שלח דוח נוכחות לקבלן',
  't_c0b6533d': '📍 לא נרשם מיקום ביום זה',
  't_0cd87148': '📍 מיקום נרשם',
  't_b426a0b1': '📨 דוח הנוכחות נשלח לקבלן בצ׳אט',
  't_fe844ef0': '📨 שלח דוח נוכחות לקבלן',
  't_34c516ea': '🟢 נרשמה כניסה \${_fmtTime(DateTime.now())} 📍',
  't_a03988e5': 's `_sheetShell` (sheet rule F-46).
//
// Wave E3 — the worker also files a STRUCTURED material request to the
// employing contractor from this sheet ("🧱 בקש חומרים"): free-text items
// (one per line) + an optional note → `materialRequestsProvider.submit(...)`.
// This is a REQUEST entity (`material_requests_engine.dart`), NOT a stock edit
// — the worker stays read-only on stock. The worker',
  't_1e2f32d0': 's stock (resolved via `session.employerId`). Builder E1b/E2 call
/// this verbatim.
Future<void> showEmployerStockSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => const _EmployerStockSheet(),
  );
}

class _EmployerStockSheet extends ConsumerStatefulWidget {
  const _EmployerStockSheet();

  @override
  ConsumerState<_EmployerStockSheet> createState() =>
      _EmployerStockSheetState();
}

class _EmployerStockSheetState extends ConsumerState<_EmployerStockSheet> {
  /// The "🧱 בקש חומרים" input — one item per line + an optional note. Local
  /// to the sheet (no provider): the worker types, presses send, the engine
  /// owns the persisted request from there.
  final TextEditingController _itemsCtrl = TextEditingController();
  final TextEditingController _noteCtrl = TextEditingController();

  /// Whether the request composer is expanded (collapsed by default so the
  /// sheet still leads with the read-only stock — the E1 surface).
  bool _composing = false;

  @override
  void dispose() {
    _itemsCtrl.dispose();
    _noteCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // The Wave-0 employment link → the employer',
  't_4a5f1df0': 'בקש חומרים',
  't_47ea293f': 'הבקשה נשלחה לקבלן',
  't_51d68e9a': 'הערה (לא חובה)',
  't_d443e740': 'הקבלן טרם שיתף מלאי',
  't_c2065d65': 'כתוב לפחות פריט אחד כדי לשלוח בקשה',
  't_4eb0503c': 'כתוב פריט אחד בכל שורה. הבקשה נשלחת לקבלן המעסיק — לא משנה את המלאי.',
  't_20cd51f0': 'לדוגמה: דחוף, נגמר באתר',
  't_94afe680': 'רשימת המלאי תוצג כאן כשתחובר עם השרת.',
  't_dfe611d6': 'שלח בקשה',
  't_fb80f611': 'תצוגה בלבד · \${items.length} פריטים',
  't_96d378ac': 'תצוגה בלבד — המלאי של הקבלן המעסיק',
  't_7fd81648': '📦 מלאי הקבלן',
  't_d9c6799b': '🧱 בקשת חומרים מהקבלן',
  't_6558e7f4': 's
/// tasks, carrying its reason, severity (Hebrew string from
/// [KitItem.severityHe]: חובה/מומלץ/אופציונלי) and the ids of every task that
/// needs it (merged on dedup).
typedef DayEquipmentItem = ({
  String label,
  String reason,
  String severity,
  List<int> taskIds,
});

/// Numeric rank for a severity STRING (lower = more severe) — חובה<מומלץ<
/// אופציונלי. Drives both the "keep the most-severe occurrence" merge in
/// [equipmentForTasks] and the checklist sort in the sheet. An unknown string
/// sorts last (defensive — every real KitItem maps to one of the three).
int _severityRank(String severityHe) => switch (severityHe) {
      ',
  't_682a0b19': 's availability
// (🏬 מחסן / 🏗️ אתר / זמינות לא ידועה) so "do I have the gear?" reads the
// contractor',
  't_5ae4a0b3': 's current bucket
// into one deduped "ציוד נדרש להיום" checklist.
//
// REUSE (no new logic): the source of every line is the SAME pair the detail
// sheet uses — `productsForTask(t.id)` (task_skus_local.dart) →
// `recommendedKitForProduct(p)` (install_kit.dart, KitItem{kind,label,reason,
// severity}). Deduped by label across all tasks (a wrench two products both
// need shows once), merging the contributing task ids and keeping the
// most-severe occurrence. A task with NO SKU mapping (e.g. task 3 איטום — the
// plumbing catalogs carry no waterproofing products) contributes nothing and is
// listed honestly as "אין רשימת ציוד".
//
// HONESTY: the mapping is DEMO wiring (a manager does not attach products to a
// task yet) — the sheet says so in a visible DEMO-SEED hint.
//
// E2 (#112) — reads the EMPLOYER',
  't_afd3ed9e': 's stock
/// availability for one equipment line: 🏬 מחסן (warehouse) / 🏗️ אתר (site) /
/// ',
  't_726d9a57': 'אופציונלי',
  't_f39d8d9e': 'אין פריטי ציוד למשימות היום',
  't_5339893c': 'אין פריטים מסומנים לשליחה',
  't_09f3dbba': 'אין רשימת ציוד למשימות הנוכחיות',
  't_6e51b2a1': 'אין רשימת ציוד: \${t.name}',
  't_657f5d3b': 'הצ׳אט עם הקבלן אינו זמין כרגע',
  't_3c64f17e': 'זמינות לא ידועה',
  't_0975caa3': 'ל-\$taskCount משימות',
  't_8545a45a': 'למשימה אחת',
  't_3893b251': 'משימות ללא רשימת ציוד',
  't_117874dc': 'סומנו \$checkedCount מתוך \${_items.length} פריטים',
  't_ed5e0be9': 'ציוד נדרש להיום: \${picked.map((it) => it.label).join(',
  't_c7abd799': 'צ׳קליסט ציוד',
  't_50a46f02': 'רשימת הציוד נגזרת ממיפוי דמו של מוצרים למשימה — תחובר עם השרת',
  't_5a027842': 'שלח רשימה לקבלן',
  't_1eb40455': '✓ נשלח לקבלן',
  't_2c302b34': '🧰 הרשימה נשלחה לקבלן',
  't_f571a71a': '🧰 ציוד נדרש להיום',
  't_e77dfc7b': ', style: TextStyle(fontSize: 16)),
                const SizedBox(width: BsTokens.space2),
                Expanded(
                  child: Text(
                    value == null ? label : _fmtDate(value!),
                    style: TextStyle(
                      color: value == null
                          ? BsTokens.mutedLight
                          : BsTokens.inkLight,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// One of "הבקשות שלי" — range + reason + a live status pill (the manager',
  't_44a7e540': ', sys_chat); the contractor reads it in his
      // שיחות tab, whose list admits worker-audience threads he participates
      // in (`_visibleToAudience`, chats_screen.dart — thread ',
  't_5c31bf13': ';

/// 📄 טפסים (cluster #85ח) — the worker',
  't_da37bd84': ';
            }),
          ),
        ),
        // #106 — READ-ONLY EMPLOYER (מעסיק) section, autofilled from the
        // contractor',
  't_069d6d5f': 's own profile (idNumber/phone), the EMPLOYEE autofill
    // source when no 101 was saved yet. אין המצאות: only what the worker
    // actually typed in אזור-אישי; empty fields stay honest empty inputs.
    final myProfile = ref.watch(workerProfileProvider)[username];
    // #106 honesty fix — the EMPLOYER (מעסיק = the contractor) profile, shown
    // READ-ONLY. Resolved via the worker→contractor LINK (`session.employerId`)
    // through `employerProfileProvider`, NOT the raw device `userProfileProvider`
    // — so the employer block reflects who actually employs this worker (and
    // honestly empties when there is no link). SERVER-SWAP lives in the provider.
    final employer = ref.watch(employerProfileProvider(session.employerId));

    // Prefill ONCE: from the saved year-form when prefs resolve; otherwise the
    // live session name + the worker',
  't_3fed29a5': 'אישור הצהרה: \$kDeclarationText',
  't_c7256816': 'בקשת חופשה',
  't_38005ffc': 'ח.פ / עוסק מורשה',
  't_18fc9f97': 'חתום ✓',
  't_e50010d1': 'חתימה — בקשת חופשה',
  't_4ae5eddc': 'חתימה — טופס 101',
  't_584aa850': 'טופס 101 — שנת \$_year',
  't_404518c7': 'יוחברו עם השרת',
  't_8de6dd69': 'יש לאשר את ההצהרה לפני צירוף הצילום',
  't_7055bceb': 'יש לאשר את ההצהרה לפני שליחה',
  't_a44204b3': 'יש להוסיף חתימה לפני שליחה',
  't_4473cc93': 'כתובת המעסיק',
  't_9e2f6f0a': 'נמשכים מהקבלן',
  't_254e3506': 'סיבה',
  't_e2107a5a': 'פרטי המעסיק',
  't_bb235473': 'פרטי המעסיק יוחברו עם השרת',
  't_3eede301': 'פרטי המעסיק נמשכים מהקבלן',
  't_05db2c19': 'שיחת הקבלן לא נמצאה — הטופס נשמר אך לא נשלח',
  't_abecdfa4': 'שם המעסיק',
  't_3b200298': 'שם העובד',
  't_d2089e78': 'תעודת זהות',
  't_12ed9357': '✍️ הוסף חתימה',
  't_856cbfdb': '✍️ עדכן חתימה',
  't_ce326cf0': '✓ נשמר ונשלח לקבלן ב-\${_fmtDate(saved.sentTs!)}',
  't_46bfeb71': '🏖️ הבקשה נשלחה לאישור הקבלן',
  't_9c6562a8': '🏖️ שלח בקשה',
  't_b9384c2e': '🏖️ שלח בקשה לאישור הקבלן',
  't_763ca618': '📨 טופס 101 נשלח לקבלן',
  't_066738f6': '📨 שלח לקבלן',
  't_ca2b4054': '🖨️ הדפס',
  't_8708cbd5': '🖨️ הדפס / שמור PDF',
  't_5dc4d0c8': 'לפני \${d.inDays} ימים',
  't_8b9a3a5a': 'ממוקם ב-AppBar של הלוח שיש בו 💡, כך שניתן לעטיפה.',
  't_4518662e': 'פותח את רשימת ההתראות שלך. התג האדום מציג כמה התראות לא-נקראו. ',
  't_3156a093': ' state on every row. Real payslips
/// REQUIRE the payroll server — no fake PDFs, no invented amounts (אין
/// המצאות). SERVER-SWAP: each month row becomes a tappable payslip download
/// once the payroll backend lands; the list/row layout below stays as-is.
Future<void> showWorkerPayslipsSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Theme.of(context).colorScheme.surface,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius:
          BorderRadius.vertical(top: Radius.circular(BsTokens.radiusCard)),
    ),
    builder: (sheetCtx) => const Directionality(
      textDirection: TextDirection.rtl,
      child: _PayslipsSheetBody(),
    ),
  );
}

/// Hebrew month names (calendar labels, not business data).
const List<String> _kHebMonths = [
  ',
  't_697e3bf2': ';

/// 💰 תלושי שכר (cluster #85ח) — SERVER-READY sheet: the complete months UI
/// with an honest ',
  't_000d5ddc': '💰 תלושי שכר',
  't_7dfe5e59': '🔌 תלושי השכר האמיתיים יחוברו עם חיבור השרת — ',
  't_42a635ae': ' : name,
            phone: phone,
            specialty: existing.specialty,
            photo: _photo,
            // Store the normalized 9-digit ת.ז (or ',
  't_0f7b3b5d': ' ? 1 : 0;

/// #104ב · התמחות — ONE source of truth. טופס 101 (`worker_forms`) is the
/// form that actually collects the worker',
  't_79f55b53': ' when left empty).
            idNumber: idDigits,
            address: _address.text.trim(),
            emergencyName: _emName.text.trim(),
            emergencyPhone: emPhone,
          ),
        );
    if (!mounted) return;
    if (!ok) {
      setState(() => _saving = false); // מאפשר retry עם תמונה קטנה יותר
      showToast(context, ',
  't_12c4efb3': '\$expired פג תוקף',
  't_d41f5d17': '\$soon לקראת תפוגה',
  't_be47376f': '),
                  const SizedBox(height: BsTokens.space3),
                  // ── specialty — DERIVED from טופס 101 (#104ב, read-only) ──
                  _SpecialtyDerivedRow(specialty: specialty),
                  const SizedBox(height: BsTokens.space4),
                  // ── emergency contact (#104ג) ──
                  const Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: CfgText(
                      ',
  't_2a3f8b34': '),
        ),
    ];

    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusCard),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              _ProfileAvatar(photo: profile.photo, size: 56),
              const SizedBox(width: BsTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            style: const TextStyle(
                              color: BsTokens.inkLight,
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        if (session.demo) ...[
                          const SizedBox(width: BsTokens.space2),
                          // Honest demo-session marker (#66).
                          CfgVisible(
                            // כל צ',
  't_6d3bfbc6': '). Same white-card ListTile style as [_ActionsCard]; rows are ≥48dp.
///
/// #103 — every row now shows an EXTERNAL live status derived from the
/// providers (never invented: each falls back to an honest empty state), and
/// the status itself is a tappable shortcut that jumps to the SAME destination
/// as the row (the existing navigation for that row), straight to the latest
/// update.
class _PersonalAreaCard extends ConsumerWidget {
  const _PersonalAreaCard({required this.session});

  final BoardSession session;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final username = session.username;
    final now = DateTime.now();

    // ── נוכחות — "נכנס HH:MM" (or "יצא" once clocked out) / "לא נרשם היום" ──
    // Watch the LEDGER (not `.notifier`) so a clock-in/out rebuilds the status
    // live; derive today',
  't_63c2974e': ').length;

    // #85ד — the worker',
  't_b0688d0d': ');

    // #104ג — the expanded personal details, each shown ONLY when filled
    // (honest empty state — אין המצאות).
    final details = <(String, String)>[
      if (profile.idNumber.isNotEmpty) (',
  't_1ae757a9': ');
      return;
    }
    setState(() => _photo = dataUrl);
  }

  Future<void> _save() async {
    if (_saving) return; // מגן double-tap (in-flight)
    final phone = _phone.text.trim();
    final idDigits = _idNumber.text.replaceAll(RegExp(r',
  't_3f853e71': ');
    final emPhone = _emPhone.text.trim();
    // FORMAT validation (the #64 validators), gathered so EVERY bad field is
    // marked at once — not one-at-a-time.
    final phoneErr =
        phone.isEmpty
            // #104א — the phone is now REQUIRED (no longer optional).
            ? ',
  't_f3b80c98': ',
                    keyboardType: TextInputType.number,
                    ltr: true,
                    errorText: _idError,
                    onClearError: () {
                      if (_idError != null) {
                        setState(() => _idError = null);
                      }
                    },
                  ),
                  const SizedBox(height: BsTokens.space3),
                  // ── address (#104ג) ──
                  _sheetField(_address, ',
  't_d332658e': ',
                    keyboardType: TextInputType.phone,
                    ltr: true,
                    errorText: _emPhoneError,
                    textInputAction: TextInputAction.done,
                    onClearError: () {
                      if (_emPhoneError != null) {
                        setState(() => _emPhoneError = null);
                      }
                    },
                  ),
                  const SizedBox(height: BsTokens.space4),
                  // ── save ──
                  CfgVisible(
                    // כל כרטיס-הכפתור נעלם עם הסתרת האלמנט (לא שלד ריק).
                    ',
  't_66b97f65': ',
                    keyboardType: TextInputType.phone,
                    ltr: true,
                    errorText: _phoneError,
                    onClearError: () {
                      if (_phoneError != null) {
                        setState(() => _phoneError = null);
                      }
                    },
                  ),
                  const SizedBox(height: BsTokens.space3),
                  // ── ת.ז (#104ג — optional, 9-digit FORMAT) ──
                  _sheetField(
                    _idNumber,
                    ',
  't_bc40c0e8': ', style: TextStyle(fontSize: size * 0.46)),
    ),
  );
}

/// #85ד — opens the worker profile editor (modal bottom sheet, X to close).
Future<void> showWorkerProfileEditSheet(
  BuildContext context, {
  required BoardSession session,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _EditProfileSheet(session: session),
  );
}

/// The profile editor — שם-תצוגה · טלפון · התמחות (chips) · תמונת-פרופיל (the
/// shared [pickTaskPhoto] capture seam, #85ב). Saved per username through
/// [workerProfileProvider] (key `bs.worker-profile.v1`); every empty field
/// keeps its honest fallback (name → session displayName, no photo → 🦺).
class _EditProfileSheet extends ConsumerStatefulWidget {
  const _EditProfileSheet({required this.session});

  final BoardSession session;

  @override
  ConsumerState<_EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends ConsumerState<_EditProfileSheet> {
  late final TextEditingController _name;
  late final TextEditingController _phone;
  // #104ג — extra personal details (all optional except the phone, which is
  // now REQUIRED). ת.ז · כתובת · איש-קשר-לחירום (שם + טלפון).
  late final TextEditingController _idNumber;
  late final TextEditingController _address;
  late final TextEditingController _emName;
  late final TextEditingController _emPhone;
  String? _photo;
  String? _phoneError;
  String? _idError;
  String? _emPhoneError;

  /// מגן in-flight: double-tap על "שמור" לא מריץ save כפול / pop כפול.
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final p =
        ref.read(workerProfileProvider)[widget.session.username] ??
        const WorkerProfile();
    _name = TextEditingController(
      text: p.name.isNotEmpty ? p.name : widget.session.displayName,
    );
    _phone = TextEditingController(text: p.phone);
    _idNumber = TextEditingController(text: p.idNumber);
    _address = TextEditingController(text: p.address);
    _emName = TextEditingController(text: p.emergencyName);
    _emPhone = TextEditingController(text: p.emergencyPhone);
    _photo = p.photo;
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _idNumber.dispose();
    _address.dispose();
    _emName.dispose();
    _emPhone.dispose();
    super.dispose();
  }

  /// Real capture via the shared seam — null = honest cancel, no change.
  Future<void> _pickPhoto() async {
    final dataUrl = await pickTaskPhoto(context);
    if (!mounted) return;
    if (dataUrl == null) {
      showToast(context, ',
  't_dcad119d': '101 הוגש ✓',
  't_e57093c5': '101 נשמר',
  't_0a342917': ';

/// One אזור-אישי row (#103): the leading emoji · title/subtitle · a live status
/// pill that is ITSELF a shortcut (taps run [onTap] — the same destination the
/// whole row navigates to, jumping straight to the latest update for that area).
class _PersonalAreaRow extends StatelessWidget {
  const _PersonalAreaRow({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.status,
    required this.onTap,
  });

  final String emoji;
  final String title;
  final String subtitle;
  final _RowStatus status;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    // The row lives inside a decorated card (Container bg). Its own Material —
    // transparent, so the card colour still shows — gives the ListTile an ink
    // surface ABOVE that bg, otherwise the tap ripple paints on the far Scaffold
    // Material and is hidden by the card. Matches the status-pill Material below.
    return Material(
      type: MaterialType.transparency,
      child: ListTile(
        leading: Text(emoji, style: const TextStyle(fontSize: 20)),
        title: Text(
          title,
          style: const TextStyle(color: BsTokens.inkLight, fontSize: 15),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: BsTokens.mutedLight, fontSize: 12),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // The status is a tappable shortcut to the latest update (same
            // destination as the row). ≥48dp tap target via the pill padding.
            Semantics(
              button: true,
              label: ',
  't_4ffc7c18': '@\${session.username} · עובד',
  't_28f2471e': 's 4th tab (bare body — the board
/// shell owns AppBar/nav), or pushed standalone from the worker settings.

/// Board identity → seed worker index ([kWorkers], #66): ran→0 (רן) ·
/// omer→1 (עומר). A demo session enters as רן (the seed',
  't_f99c7b9a': 's RTL Directionality; default stays RTL.
    bool ltr = false,
  }) {
    return TextField(
      controller: ctl,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      textDirection: ltr ? TextDirection.ltr : null,
      onChanged: onClearError == null ? null : (_) => onClearError(),
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        errorText: errorText,
        border: const OutlineInputBorder(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // #104ב — התמחות is DERIVED from טופס 101 (single source of truth); the
    // sheet only DISPLAYS it (read-only) and points the worker to 101 to
    // change it — no second editable copy that could drift.
    final specialty = workerSpecialtyOf(
      widget.session.username,
      ref.watch(workerFormsProvider),
      ref.watch(workerProfileProvider)[widget.session.username] ??
          const WorkerProfile(),
    );
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Padding(
        // Keep the fields above the keyboard.
        padding: EdgeInsets.only(
          bottom: MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(BsTokens.radiusCard),
            ),
          ),
          child: SafeArea(
            top: false,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(BsTokens.space4),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: CfgText(
                          ',
  't_2077682c': 's derived live status — the label shown on the right and the tint it
/// carries (#103). [muted] = the honest "no data yet" empty state.
class _RowStatus {
  const _RowStatus(this.label, this.color, {this.muted = false});
  final String label;
  final Color color;
  final bool muted;

  /// The honest empty-state status (grey, low-emphasis) — used when a row has
  /// no live data to surface yet (אין המצאות).
  static _RowStatus empty(String label) =>
      _RowStatus(label, BsTokens.mutedLight, muted: true);
}

/// אזור אישי v2 (#85ח) — the four personal-area entries: נוכחות (clock-in/out
/// + monthly table) · טפסים (101 / חופשה / מחלה) · תיק בטיחות (הדרכות +
/// ארנק תעודות) · תלושי שכר (SERVER-READY sheet — honest ',
  't_845e9c37': 's local clock for the נוכחות status.
String _hhmm(DateTime d) =>
    ',
  't_767f7031': 's אזור אישי: the live
/// [BoardSession] identity (displayName / username / role), honest task stats
/// derived from [tasksProvider], an entry to the worker settings (#69), the
/// code-gated ',
  't_1a1040b8': 's אזור-אישי tab; false when pushed
  /// standalone (its own Scaffold + "פרופיל עובד" AppBar).
  final bool embedded;

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const WorkerProfileScreen());

  static final List<KbToolNode> _kbNodes = kbWorkerProfileNodes();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔒 BOARD GATE (חוק: מבחוץ לא רואים כלום) — this is a worker-board screen:
    // without a worker session ONLY the registration gate is built (so right
    // after ',
  't_cc1a5b4f': 'אין תעודות',
  't_8e2ccfa6': 'איש קשר לחירום',
  't_cc914d9c': 'בתוקף ✓',
  't_2ba702b2': 'הדרכות ותעודות מקצועיות',
  't_4dd07dc0': 'ההתמחות נגזרת אוטומטית מטופס 101.',
  't_29874f1b': 'המקטע מוכן לחיבור השרת.',
  't_13365d79': 'המשימות שלי',
  't_92abdf70': 'הפיל מציג את מצב הטופס האחרון וקיצור אליו.',
  't_7903c213': 'הפיל מציג את סטטוס הנוכחות החי של היום וקיצור ישיר אליו.',
  't_6536b324': 'הפיל מציג רמזור-תוקף (פג/לקראת-תפוגה/בתוקף) וקיצור אליו.',
  't_55750ef4': 'התמחות',
  't_b904e902': 'חופשה ⏳ ממתינה',
  't_0acba39f': 'יצא \${_hhmm(today!.outTs!)}',
  't_c1ff83c1': 'לא הוגדרה',
  't_aec76420': 'לא הוגשו טפסים',
  't_326ba485': 'לא נרשם היום',
  't_02ef9a68': 'ללא הקוד הנכון המעבר אינו מתאפשר.',
  't_442e38ae': 'מוכן לשרת',
  't_fe0cd2fb': 'מחלה \$sickCount',
  't_23469287': 'ממשק ונגישות ומידע משפטי.',
  't_10ede38b': 'ממתינות לאישור',
  't_6acc5248': 'מנתק אותך מלוח העובד ומחזיר למסך ההרשמה. ',
  't_47d31478': 'מעבר ללוח אחר (קבלן/מנהל/חנות/שליח) — מוגן בקוד. ',
  't_28dc35f3': 'נדחו',
  't_a545ce95': 'נכנס \${_hhmm(today!.inTs!)}',
  't_4ee57187': 'נערך בטופס 101 (מקצוע / התמחות)',
  't_7fd64620': 'פותח את הגדרות הלוח המותאמות לעובד — התראות, אזור ושפה, ',
  't_365a89ca': 'פותח את ההדרכות והתעודות המקצועיות שלך. ',
  't_a7c147bf': 'פותח את הטפסים שלך — טופס 101, בקשת חופשה ואישור מחלה. ',
  't_d15209b1': 'פותח את לוח-הנוכחות: כניסה/יציאה ודוח חודשי. ',
  't_094935ed': 'פותח את תלושי השכר. כרגע אין מקור-נתונים מקומי — ',
  't_21e3b72d': 'פותח טופס לעריכת הפרופיל שלך — שם-תצוגה, טלפון, תמונה ופרטים אישיים. ',
  't_b42feec8': 'קוד שגוי',
  't_405d0d7b': 'תנותק מלוח העובד ותחזור למסך ההרשמה.',
  't_a7727ed1': 'תתבקש לאשר לפני הניתוק.',
  't_9ffec8fa': '✓ נשמר',
  't_1967ada4': '(bs.rewards.v1) — אינו נצבר לעובד בנפרד. ניהול נקודות per-עובד יחובר עם ',
  't_cf034e5b': ', AppBrand.club)} המשותף לכל התפקידים במכשיר הזה ',
  't_3eb5a3e3': 's reason + the task.
//
// אין המצאות: every figure is read live from [tasksProvider] /
// [rewardsProvider] / the bs.* side-maps that the tab already imports. Where the
// engine has no data the sheet prints an honest empty line instead of inventing.
// These openers are pure presentation — they never mutate a provider.
//
// SOLE OWNER: Builder-C (#109), same as worker_reports_tab.dart. This file adds
// NO new public provider/engine surface; it only consumes the existing one.

import ',
  't_935f0d2a': 'אין אתגרים פתוחים — כולם הושלמו או נוצלו.',
  't_062d1f32': 'אין חותמת התחלה — המשימה נפתחה לפני הפעלת שעון המשימות.',
  't_5b4d0346': 'אין משימות באזור הזה.',
  't_a34d4f9e': 'אין משימות עם חותמת-זמן בחלון הרצף הנוכחי.',
  't_e7768dec': 'אין משימות עם חותמת-זמן ביום הזה.',
  't_86756f2c': 'אין עדיין משימות שאושרו בלי דחייה.',
  't_bba19761': 'אין עדיין פעילות מתוזמנת — הרצף נמדד מימים רצופים עם שעון משימות פעיל.',
  't_8c934261': 'אישור למשימה שלך.',
  't_ea25b16e': 'אישור-ראשון = הגשות שאושרו בלי דחייה אף פעם, מתוך כלל ההגשות. ',
  't_b9bc2ae8': 'אמיתיים יחובר עם חיבור השרת.',
  't_6c33846c': 'דרגת מועדון',
  't_556e233e': 'האזור נגזר משם המשימה',
  't_c5245759': 'האזור נגזר משם המשימה (אין שדה אתר במנוע המשימות). שיוך לאתרי פרויקט ',
  't_5a8795e2': 'הושלם · +\${c.reward} 🪙',
  't_15746c5a': 'הזמן נמדד אוטומטית מרגע "התחל עבודה" ועד אישור המשימה.',
  't_f4efdc22': 'הרצף נמדד משעון המשימות — ימים רצופים (עד היום) שבהם יש חותמת התחלה או ',
  't_f3a2a722': 'חיבור השרת.',
  't_491a3bbd': 'יום אחד',
  't_a345e666': 'לא צורפה הערה להגשה.',
  't_63e2b717': 'לא צורפה תמונה (או שהוסרה בעת דחייה).',
  't_8fe2d932': 'מאזן המטבעות הוא מאזן \${orgTermNow(ref, ',
  't_8b328e79': 'מאזן נוכחי',
  't_5b8ffd2f': 'משימה שנדחתה פעם אחת ואז אושרה אינה נספרת כאישור-ראשון.',
  't_bbc8f2e4': 'משימות תורמות לרצף (\${contributing.length})',
  't_cf4c3b06': 'משך כולל',
  't_7693926b': 'משך מדוד',
  't_b9ff7a85': 'משך עד כה',
  't_9b6661c4': 'סיבת המנהל',
  't_649b6c56': 'עוד אין הגשות — משימה שתוגש לאישור תופיע כאן.',
  't_14888b9b': 'פירוט המשימה',
  't_76b97d5a': 'צלם שוב ושלח לאישור כדי לתקן — הדחייה נשמרת ביומן עד לאישור.',
  't_3106635e': 'רצף נוכחי',
  't_49433b54': 'תמונת דמו — אין קובץ אמיתי להצגה.',
  't_b04c918f': '↩️ ממתינות לתיקון (\${rejected.length})',
  't_ecdb42d1': '✅ אושרו היום (\${approved.length})',
  't_69edaa07': '✅ אושרו ללא דחייה (\${doneClean.length}/\${submitted.length})',
  't_1496b433': '🎯 אישור-ראשון — פירוט',
  't_074d8f52': '🎯 אתגרים חודשיים פתוחים (\${rewards.challenges.length})',
  't_a2b91ec4': '📅 \${_fmtDate(day)} — פעילות היום',
  't_e8288af8': '📝 הערת עובד',
  't_c0ccddf6': '📷 לא ניתן להציג את התמונה.',
  't_3a733bb4': '📷 תמונת הוכחה',
  't_9882dd5d': '🔁 אושרו אחרי תיקון (\${doneAfterReject.length})',
  't_112204b7': '🔥 רצף פעילות — פירוט',
  't_b41723f0': '🔨 נפתחו לעבודה היום (\${started.length})',
  't_014257c7': '🪙 BuildCoins — מועדון משותף',
  't_fe77fd7c': ' suffix
//      (the engine has no site/project field — see [TaskItem]).
//   ⑥ היסטוריית הגשות עם תמונות — proof-photo thumbnail per submission row
//      (data-URL or uploaded https URL → Image · ',
  't_bea89ec5': ' → honest placeholder).
//   ⑦ דחיות + סיבה — rejected tasks with the manager',
  't_b30c8fc8': '\$label — הצג פירוט',
  't_338b205d': '\$label, \$value — הצג פירוט',
  't_3337cd44': '\${t.name} — הצג סיבת דחייה',
  't_8abb9863': '\${task.name} — הצג פרטי הגשה',
  't_e843298e': ').
//   ⑤ פירוט לפי אזור עבודה — honest grouping by the task NAME',
  't_36fac9cf': ').length}/\${e.value.length} אושרו',
  't_950d65d4': ');
      if (s == null && c == null) return;
      out[id] = TaskClockEntry(startedAt: s, completedAt: c);
    });
    return out;
  } on Object catch (_) {
    return const {}; // corrupt payload — honest "no measurements" state
  }
});

/// The bs.task-reject-note.v1 side-map (manager rejection reasons), re-read on
/// any task mutation — same pattern as [taskClockProvider].
final taskRejectNotesProvider = FutureProvider<Map<int, String>>((ref) async {
  ref.watch(tasksProvider);
  try {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(kTaskRejectNoteKey);
    if (raw == null || raw.isEmpty) return const {};
    final m = jsonDecode(raw) as Map<String, dynamic>;
    final out = <int, String>{};
    m.forEach((k, v) {
      final id = int.tryParse(k);
      if (id == null || v is! String || v.trim().isEmpty) return;
      out[id] = v.trim();
    });
    return out;
  } on Object catch (_) {
    return const {};
  }
});

// ─── ever-rejected log (bs.task-rejections.v1) ───────────────────────────────

/// Persisted set of task ids EVER seen `rejected`. The engine keeps only the
/// CURRENT status, so a rejected-then-resubmitted-then-approved task looks
/// "clean" — this log is what makes אחוז אישור-ראשון a real computation.
/// Recorded by the worker board shell on every rebuild (see
/// `worker_app_screen.dart`); persisted with the board_auth `_userTouched`
/// idiom so a late `_load()` never clobbers a fresh record.
class TaskRejectionLog extends StateNotifier<Set<int>> {
  TaskRejectionLog({this.persist = true}) : super(const {}) {
    if (persist) _load();
  }

  /// When false (tests), skip SharedPreferences entirely.
  final bool persist;

  /// One-shot guard (the board_auth idiom) — set ONLY by [resetLog]: a
  /// `recordAll` that lands before prefs resolve is safe because `_load`
  /// MERGES (union), but a reset must not be clobbered by a late load.
  bool _userTouched = false;

  Future<void> _load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(kTaskRejectionsKey);
      if (raw == null || raw.isEmpty || _userTouched) return;
      final ids =
          (jsonDecode(raw) as List)
              .whereType<num>()
              .map((n) => n.toInt())
              .toSet();
      if (ids.isEmpty || _userTouched) return;
      // MERGE (not replace) — ids recorded before prefs resolved are kept.
      state = {...state, ...ids};
    } on Object catch (_) {
      // corrupt payload — keep whatever was recorded this session
    }
  }

  Future<void> _persist() async {
    if (!persist) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        kTaskRejectionsKey,
        jsonEncode(state.toList()..sort()),
      );
    } on Object catch (_) {}
  }

  /// Remember [ids] as ever-rejected. No-op (no rebuild, no write) when every
  /// id is already known. Safe against the load race without the guard — a
  /// late `_load` only ADDS persisted ids, never drops recorded ones.
  void recordAll(Iterable<int> ids) {
    final add = ids.where((id) => !state.contains(id)).toList();
    if (add.isEmpty) return;
    state = {...state, ...add};
    _persist();
  }

  /// Forget everything (tests / a future "demo reset").
  void resetLog() {
    _userTouched = true;
    state = const {};
    _persist();
  }
}

final taskRejectionLogProvider =
    StateNotifierProvider<TaskRejectionLog, Set<int>>(
      (_) => TaskRejectionLog(),
    );

// ─── helpers ─────────────────────────────────────────────────────────────────

/// Work-area of a task, derived HONESTLY from its name: the suffix after the
/// ',
  't_ef263bcd': ',
              // Honest: derived from the task name — the engine has no site
              // field; real project-site binding יחובר עם חיבור השרת.
              ',
  't_69c78d27': ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לעובד בנפרד). לחיצה פותחת פירוט.',
  't_2f8947a4': ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לעובד בנפרד); הרצף נמדד משעון המשימות (ימים רצופים עם פעילות).',
  't_c97c4942': ';

// ─── the tab ─────────────────────────────────────────────────────────────────

/// Tab 3 — דוחות v2 (#85ז): everything derived LIVE for the logged worker only
/// (#66 — a worker sees only their own tasks everywhere).
class WorkerReportsTab extends ConsumerWidget {
  const WorkerReportsTab({required this.worker, super.key});

  /// Index into [kWorkers] — the logged worker (see `workerIndexForSession`).
  final int worker;

  /// The seed id of the worker↔contractor thread ([kWorkerChatThreads],
  /// `sys_chat.dart`) the daily report is posted into.
  static const String kContractorThreadId = ',
  't_89f099c1': 's RTL Directionality the first child renders on the RIGHT, so
/// ראשון starts at the right edge as a Hebrew calendar reads.
class _WeekBars extends StatelessWidget {
  const _WeekBars({
    required this.counts,
    required this.todayIndex,
    this.onTapDay,
  });

  /// Approved-task count per weekday, index = weekday % 7 (0 = ראשון).
  final List<int> counts;
  final int todayIndex;

  /// #109 — tap a bar (by its weekday index) → that day',
  't_85dbf706': 's old `_ReportsTab` and rebuilt:
//   ① סיכום שבועי — bar chart of approved tasks per weekday (plain Containers).
//   ② אחוז אישור-ראשון — approved-without-rejection / total submitted.
//   ③ זמן לכל משימה — from the bs.task-clock.v1 side-map (startedAt/completedAt).
//   ④ מטבעות + רצף — live [rewardsProvider] coins + an HONEST streak computed
//      from the task-clock stamps (consecutive calendar days ending today with
//      a startedAt/completedAt for this worker; no stamps at all → ',
  't_ec3ccadf': 'אזור עבודה',
  't_7a77eafb': 'אחוז ההגשות שאושרו בלי דחייה מתוך כלל ההגשות. לחיצה פותחת פירוט מלא של הנתון.',
  't_20184299': 'אט סיכום אמיתי של מצבי-המשימות הנוכחי שלך — בלי המצאות.",
          // composite hide: whole button gone when the org hides this element
          child: CfgVisible(
            ',
  't_4be776a9': 'אין משימות שאושרו השבוע.',
  't_046ea2b3': 'אין משימות שנדחו לתיקון.',
  't_3d1b22db': 'אין עדיין מדידות זמן — הזמן נמדד אוטומטית מרגע תחילת משימה ועד אישורה.',
  't_cbdbe642': 'אישור ראשון',
  't_32a839ea': 'אישור-ראשון = הגשות שאושרו בלי דחייה מתוך כלל ההגשות — עדיין אין הגשות. מטבעות — מאזן \${orgTerm(ref, ',
  't_ed5aa274': 'אישור-ראשון 🎯',
  't_d5548b76': 'אישור-ראשון: \$firstPass מתוך \${submitted.length} הגשות אושרו בלי דחייה. מטבעות — מאזן \${orgTerm(ref, ',
  't_4ce0fb58': 'דוח-יום — \${workerShortName(worker)}',
  't_c3dfeee0': 'הדוח נשלח כהודעה אמיתית לשיחת הקבלן (טאב שיחות) — סיכום הסטטוסים הנוכחי, בלי המצאות.',
  't_1bb4e8ce': 'הצג
  /// פירוט',
  't_49c4b7ad': 'התקנת קו מים חם — חדר רחצה',
  't_6c185497': 'זמן משימה',
  't_9e01255f': 'חדר רחצה',
  't_6ec74186': 'יום \${_kDayLetters[index]} — \$count אושרו, הצג פירוט',
  't_2225ade3': 'יום בגרף',
  't_4c3cf4c9': 'לא צורפה סיבה',
  't_b96f64fd': 'לחיצה על עמודת-יום פותחת את רשימת המשימות שאושרו באותו יום.',
  't_f0daf42d': 'לחיצה על שורת ההגשה פותחת את פירוט-ההגשה — מצב, זמן והערה.',
  't_d669819a': 'לחיצה על תמונת-ההוכחה הזעירה פותחת אותה במסך מלא עם זום.',
  't_c8164a4d': 'לחיצה פותחת את סיבת הדחייה של המנהל ואת פרטי המשימה לתיקון.',
  't_58ce0763': 'ללא תאריך',
  't_6c9b7e11': 'מאזן \${orgTerm(ref, ',
  't_7caee89d': 'מסכם כמה משימות אושרו בכל אזור (הנגזר משם המשימה). לחיצה פותחת את המשימות באזור.',
  't_474bf712': 'מספר הימים הרצופים עם פעילות לפי שעון-המשימות. לחיצה פותחת פירוט הרצף.',
  't_eca1ddcb': 'מציג את משך-העבודה שנמדד למשימה. לחיצה פותחת פירוט זמן מלא של המשימה.',
  't_d7789fec': 'משימות שאושרו',
  't_1b255033': 'נתונים חיים מהמשימות של \${workerShortName(worker)} — ללא המצאות',
  't_76ea74cf': 'סיבת דחייה',
  't_faf939ff': 'סיבת המנהל: "\${rejectNotes[t.id]}"',
  't_3d83413c': 'עוד אין משימות שאושרו — משימה שתאושר תופיע כאן.',
  't_f65e2101': 'עוד לא הגשת משימות לאישור — ההגשות שלך יופיעו כאן.',
  't_09abd8e7': 'פרטי הגשה',
  't_b5bd716f': 'רצף פעילות',
  't_52c25545': 'שלח דוח יומי לקבלן',
  't_69f24762': 'תמונת הוכחה',
  't_82be6731': '↩️ דחיות לתיקון (\${rejectedTasks.length})',
  't_253b2587': '↩️ נדחו לתיקון: \${count(',
  't_98429fac': '⏱️ זמן לכל משימה',
  't_d4690e30': '⏳ בתור: \$queued',
  't_417cfeee': '⏳ בתור: \${count(',
  't_73a28d03': '✅ אושרו: \${count(',
  't_73f3bc03': '💬 הדוח נשלח לקבלן — מופיע בטאב שיחות',
  't_21d8c35b': '💬 שלח דוח יומי לקבלן',
  't_eddc4455': '📅 סיכום שבועי — משימות שאושרו',
  't_394903f9': '📋 היסטוריית הגשות (\${submitted.length})',
  't_15701dd2': '📍 פירוט לפי אזור עבודה',
  't_31cb6c04': '📷 לא ניתן להציג את התמונה',
  't_0b379b59': '📸 הוגשו וממתינות לאישור: \${count(',
  't_9eb0e853': '🔨 בביצוע מאז \${_hhmm(clock[t.id]!.startedAt!)}',
  't_18f44d2d': '🔨 בביצוע: \${count(',
  't_b1d87480': '🗓️ ללא תאריך: \$noDate \${noDate == 1 ? ',
  't_452d6a13': '"\${t.title}" תימחק מהרישום לצמיתות.',
  't_5f3f0c77': ';

/// 🛡️ תיק בטיחות (cluster #85ח) — two sections:
///   1. הדרכות שעברתי — a real persisted training log ([workerTrainingsProvider],
///      bs.worker-trainings.v1): the worker',
  't_518859ec': 'אין הדרכות רשומות עדיין — הוסף את הראשונה.',
  't_d6a4edc1': 'ההדרכה נמחקה',
  't_3df10af6': 'הוסף הדרכה',
  't_2d12ffbb': 'המסמך גדול מדי — לא נשמר',
  't_b1486417': 'הסר מסמך',
  't_cd150c9d': 'מדריך/מנפיק',
  't_23bbb627': 'מחיקת הדרכה?',
  't_63f455a5': 'מחק הדרכה',
  't_34976fcd': 'ממונה בטיחות',
  't_ba292eae': 'מנפיק (למשל: משרד העבודה)',
  't_35f481f0': 'נא לבחור תאריך',
  't_7d48389a': 'נא למלא שם הדרכה',
  't_11b1a6ba': 'נתוני דמו — רישום הדרכות אמיתי יחובר עם חיבור השרת.',
  't_8627a04d': 'צפה במסמך',
  't_70841ab2': 'שם ההדרכה (למשל: עבודה בגובה)',
  't_d084fe65': 'שם התעודה (למשל: עבודה בגובה)',
  't_9d45eac4': 'שמור הדרכה',
  't_acdd4c95': 'תאריך ההדרכה',
  't_4d9b9af1': 'תאריך: \${_fmtDate(date!)}',
  't_b85f9b55': '➕ הוסף הדרכה',
  't_ca58c2da': '🎓 הדרכות שעברתי (\${trainings.length})',
  't_c2b55e8e': '🎓 ההדרכה נשמרה',
  't_9db17dd9': '🎓 הוספת הדרכה',
  't_1b01cbda': '💾 שמור הדרכה',
  't_7f351db7': '📄 מסמך צורף ✓',
  't_4906c2f8': '📄 צרף מסמך הדרכה (לא חובה)',
  't_3dc62cc6': '🛡️ תיק בטיחות',
  't_fbfaa246': '🪪 תעודות מקצועיות (\${certs.length})',
  't_257fd740': ',
          value: BsLang.en,
          groupValue: settings.lang,
          enabled: false,
        ),
      ],
    );
  }
}

/// One language radio row — disabled options carry the honest "בקרוב" badge.
class _LangOption extends StatelessWidget {
  const _LangOption({
    required this.label,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.enabled = true,
  });

  final String label;
  final BsLang value;
  final BsLang groupValue;
  final ValueChanged<BsLang>? onChanged;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return RadioListTile<BsLang>(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      title: Row(
        children: [
          Flexible(
            child: Text(
              label,
              style: TextStyle(
                color: enabled ? BsTokens.inkLight : BsTokens.mutedLight,
              ),
            ),
          ),
          if (!enabled) ...[
            const SizedBox(width: 8),
            const CfgText(
              ',
  't_977ece02': 's full CatalogSettingsScreen).
/// ONLY the worker-relevant areas: פרופיל-עובד · התראות (the existing
/// [NotifSettingsScreen]) · אזור ושפה · ממשק ונגישות · מידע ([LegalScreen]).
///
/// The אזור-ושפה / ממשק-ונגישות rows mirror the contractor settings',
  't_806994cf': ' · סגור',
  't_a631598d': ' · פתוח',
  't_db00208a': '\${widget.title} · \$count משימות',
  't_a8ca79d7': ',
      excludeSemantics: true,
      child: InkWell(
        // #114 dive — the existing #71 detail sheet (steps/הוראות/תמונה). This
        // is the deepest REAL tier; no invented stage level.
        onTap: () => showWorkerTaskDetailSheet(context, taskId: task.id),
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          padding: const EdgeInsets.all(BsTokens.space4),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      task.name,
                      style: const TextStyle(
                        color: BsTokens.inkLight,
                        fontWeight: FontWeight.w700,
                        fontSize: 14.5,
                      ),
                    ),
                    const SizedBox(height: BsTokens.space1),
                    Text(
                      ',
  't_c2632c1b': '` task lands in
  /// בתור, never a group of its own; every task falls in exactly one group.
  @visibleForTesting
  static List<({String title, List<TaskItem> tasks})> groupByStatus(
    List<TaskItem> tasks,
  ) =>
      [
        for (final g in _groups)
          (
            title: g.title,
            tasks: [
              for (final t in tasks)
                if (g.statuses.contains(t.status)) t,
            ],
          ),
      ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔒 BOARD GATE (#66) — mirror every board screen: no worker session ⇒
    // only the registration gate is built (the welcome screen in role mode).
    final session = ref.watch(boardAuthProvider);
    if (session == null || session.role != BoardRole.worker) {
      return const WelcomeScreen(boardRole: BoardRole.worker);
    }
    final worker = workerIndexForSession(session);

    // The logged worker',
  't_fc4444dc': 's approval) FOLD into בתור
  /// — owner decision A5, NO separate group. Every engine status still maps to
  /// exactly ONE group, so the group counts sum to the worker',
  't_e1592879': 's tasks out grouped by their live status, each
/// group collapsible with a live count, so the worker can scan the whole
/// pipeline and dive into any task.
///
/// 🔒 BOARD GATE (#66, חוק: מבחוץ לא רואים כלום): without a worker
/// [BoardSession] the build returns ONLY the registration gate
/// ([WelcomeScreen] in role mode) — no board content is constructed.
///
/// 🪜 DIVE — HONEST DEPTH: a task row dives via the existing
/// [showWorkerTaskDetailSheet] (#71) — the task→steps level, which is the
/// DEEPEST REAL tier. There is NO separate "stage" tier in the §6 model
/// (`TaskItem` carries no stage), so none is invented here. Each card shows a
/// real `doneSteps.length/steps.length` progress hint off the live engine.
///
/// LIVE: reads [tasksProvider] (the §6 engine) filtered to `t.worker == worker`.
/// Empty groups render an honest empty line — never a fabricated row.
class WorkerTaskBoardScreen extends ConsumerWidget {
  const WorkerTaskBoardScreen({super.key});

  static Route<void> route() =>
      MaterialPageRoute<void>(builder: (_) => const WorkerTaskBoardScreen());

  /// The status groups, in the contract',
  't_926edc3a': 's משימות tab. Where the
/// journal home (`worker_app_screen.dart`) shows TODAY',
  't_a1d9f2b6': 'אין משימות במצב זה',
  't_7eee2b17': 'אין משימות משויכות אליך כרגע',
  't_49ffdd25': 'אין שלבים מוגדרים',
  't_259e814f': 'כל המשימות שלך — \${mine.length} סה"כ, מקובצות לפי מצב',
  't_dd5760a9': '↩️ נדחו',
  't_30233ac5': '⏳ בתור',
  't_83bc7f25': '✅ הושלמו',
  't_77db3dea': '✓ \$done/\$total שלבים',
  't_ef0e4d64': '📸 בבדיקה',
  't_4c40d65f': '🔨 פעילות',
  't_b66632dc': '🗂️ לוח משימות מלא',
  't_3b7f6605': ' line (#85ה) — kind icon (🔧 כלי / 🧴 איטום / ⚠️ בטיחות) +
/// label + reason + severity pill (חובה/מומלץ/אופציונלי), mirroring the
/// product sheet',
  't_8ea4cebd': ' marker carries NO real
  // image, so under [kHideUnderConstruction] its "(הדגמה)" placeholder is hidden
  // entirely — every render site (worker sheet, manager approvals row, POD
  // preview) collapses to nothing rather than showing a self-declared demo box.
  // A REAL photo (data-URL / https) is unaffected; flip the flag to restore.
  if (kHideUnderConstruction && photo == ',
  't_e6c79225': ' placeholder — kept verbatim for seeded photos (#85ב
/// keeps pre-photo submissions honest: "הדגמה", never a fake image).
Widget _photoPlaceholder() => Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F3F5),
        borderRadius: BorderRadius.circular(BsTokens.radiusCard),
      ),
      child: CfgText(
        ',
  't_9d9714e3': 's
/// "שלח לאישור" button style).
class _PrimaryBtn extends StatelessWidget {
  const _PrimaryBtn({required this.label, required this.onTap, super.key});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: Material(
        color: BsTokens.brand,
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        child: InkWell(
          borderRadius: BorderRadius.circular(BsTokens.radiusPill),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: BsTokens.space4,
              vertical: 11,
            ),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: bsOnAccent(context),
                fontSize: 14,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// One ',
  't_53217931': 's
/// `_TaskSheet`, scoped to the WORKER role only (no manager decide block —
/// the manager decides on their own board).
///
/// No new fake state: every action is an existing engine call
/// ([TasksNotifier.attachPhoto] / [TasksNotifier.submitForReview], routed
/// through [submitWorkerTaskForReview]); the step ticks write
/// [TasksNotifier.toggleStep] — per-step completion lives on
/// [TaskItem.doneSteps] and persists with the engine overlay (#3), so the
/// checklist survives sheet close/reopen and an app restart.

/// WORKER submit — "שלח לאישור" onto the single unified [tasksProvider] (Wave
/// T1 collapsed the old dual-engine bridge into one source of truth — the
/// manager',
  't_6f5237db': 's "🎙️ מקליט..." state; reset on final transcript,
  /// engine error, no-result ending or manual stop.
  bool _dictating = false;

  @override
  void dispose() {
    // Don',
  't_0f58461e': 's `_TaskSheet` shell).
  Widget _sheetShell({required List<Widget> children}) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.4,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scroll) => Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
                top: Radius.circular(BsTokens.radiusCard)),
          ),
          child: ListView(
            controller: scroll,
            padding: const EdgeInsets.all(BsTokens.space4),
            children: [
              // #85ג: grab handle + an explicit 48dp X close (the
              // contractor_tools_sheets idiom) — the sheet closes with one
              // tap, not only by drag/scrim.
              SizedBox(
                height: 48,
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.topCenter,
                      child: Container(
                        width: 40,
                        height: 4,
                        margin: const EdgeInsets.only(top: BsTokens.space1),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDDDDDD),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Semantics(
                        button: true,
                        label: ',
  't_52328987': 's `note` is a single
  /// string, set only via submitForReview — no engine change needed) and is
  /// persisted through the existing submit path. #6 voice honesty: while
  /// listening the button shows a live "מקליט" state and a second tap stops
  /// the session; an engine error / no-result ending resets the state with an
  /// honest failure toast instead of silently doing nothing.
  Future<void> _dictateNote() async {
    if (_dictating) {
      // Second tap = explicit stop. The engine then delivers either the final
      // transcript (onFinal) or a no-result (onError) — both reset the state.
      await VoiceService.instance.stop();
      return;
    }
    setState(() => _dictating = true);
    final ok = await VoiceService.instance.listen(
      onFinal: (text) {
        if (!mounted) return;
        setState(() => _dictating = false);
        if (text.trim().isEmpty) {
          // An empty final transcript carries nothing to append — honest fail.
          showToast(context, ',
  't_6cd304e9': 's mapped catalog products ([productsForTask] →
  /// [recommendedKitForProduct]), deduped by label (e.g. both SmartLock
  /// products recommend the same DN50 nut wrench — shown once). Returns []
  /// when the task has no SKU mapping (e.g. task 3 איטום — the plumbing
  /// catalogs carry no waterproofing products), so the section is omitted.
  List<Widget> _bringSection(BuildContext context, TaskItem t) {
    final products = productsForTask(t.id);
    if (products.isEmpty) return const [];
    final kit = <String, KitItem>{};
    for (final p in products) {
      for (final k in recommendedKitForProduct(p)) {
        kit.putIfAbsent(k.label, () => k);
      }
    }
    return [
      const SizedBox(height: BsTokens.space3),
      const _SecH(',
  't_aa717bfd': 's proof photo (#85ב): a real data-URL
/// (',
  't_bdd45617': 's quick
/// "שלח לאישור" button (`worker_app_screen.dart`) and this detail sheet:
///  1. reuse an already-attached REAL photo, else open [pickTaskPhoto];
///  2. no photo → toast ',
  't_cbd3a5a6': 's אישורי-עובדים
/// row (`manager_dashboard_screen.dart`) so both sides see the same proof.
Widget taskPhotoWidget(String? photo, {double height = 140, BuildContext? context}) {
  if (photo == null) return const SizedBox.shrink();
  // Apple-readiness hide (reversible): the legacy ',
  't_26b58844': 'אין הוראות נוספות למשימה זו',
  't_2fa45f58': 'אין המלצת ערכת התקנה למוצרי המשימה',
  't_0f999fd3': 'הוגש לאישור המנהל',
  't_c16b3ef0': 'הזיהוי נכשל — נסו שוב',
  't_fff31d18': 'המשימה לא נמצאה',
  't_d8aaca7a': 'הקלט הערה בקול',
  't_53e342c2': 'התחל עבודה',
  't_ec683774': 'זיהוי דיבור אינו זמין בדפדפן הזה',
  't_a62f276e': 'חובה לצלם הוכחת-ביצוע',
  't_effda400': 'לא הוגדרו שלבים למשימה זו',
  't_a76f57f9': 'לשלוח את המשימה לאישור המנהל עם התמונה הזו?',
  't_9d7056e0': 'מה להביא',
  't_e1c76c46': 'משימה בתור — תעבור לביצוע אוטומטית כשתוגש המשימה הנוכחית.',
  't_6cd30618': 'סומנו \$stepsDone מתוך \$stepsTotal שלבים',
  't_866deb97': 'תיאור והוראות',
  't_0de5493e': '⏱️ בעבודה: \${taskClockLabel(t)}',
  't_82ef4469': '⏱️ זמן עבודה: \${taskClockLabel(t)}',
  't_3277c3eb': '⏱️ שעון העבודה הופעל',
  't_57c1d8c0': '🎙️ ההערה נקלטה — תישמר בשליחה לאישור',
  't_4e45f319': '🎙️ מקליט... עצור',
  't_6947b6c1': '📷 תמונה מהשטח (הדגמה)',
  't_eaafe235': '📸 הוכחת ביצוע',
  't_1b6ab76a': '📸 נשלח לאישור המנהל',
  't_c9a90cb6': '🔨 התחל עבודה',
  't_d7de043a': '🕒 \${t.days} ימים · \${t.steps.length} שלבים',
  't_0784953e': '\$doneCount/\${mine.length} ימים',
  't_4787b12e': '\${stage.dayTag} · \${stage.steps.length} שלבים',
  't_7911b3a2': 's FIRST unfinished day-stage in plan order and "הבא" the one after
/// it, exactly the order the SmartProject screen walks. Marking a day done is
/// the engine',
  't_ec9cf915': 's משימות tab: the SmartProject day-plan ([buildDayStages],
/// the §7 engine) filtered to the LOGGED worker only ([DayStage.worker] ==
/// the session',
  't_6c70d08d': 'אותו סימון שהקבלן רואה במסך "מאפס עד מסירה".',
  't_abdf2d7f': 'אין שלבי-יום מתוכננים עבורך בפרויקט',
  't_4e3981ca': 'היום שלי',
  't_0f1a9b7d': 'והוראות. כפתור הסימון (כבר עטוף) מסמן את היום כהושלם בתוכנית.',
  't_5596856f': 'לחיצה על שלב-היום פותחת את פירוט המשימה שלו — שלבים ',
  't_df26f01f': 'מסמן את יום-העבודה הנוכחי כהושלם בתוכנית הפרויקט — ',
  't_8a6746f9': 'סימון יום כהושלם',
  't_44360cc9': 'סמן שהיום הושלם',
  't_2e2dd521': 'שלב היום',
  't_3ba4fc52': '✅ כל שלבי-היום שלך בפרויקט הושלמו',
  't_66311020': '✓ \${current.dayTag} סומן כהושלם',
  't_d7d08cc2': '📅 היום שלי',
};

String termOf(String key, [String fb = '']) => uiTerms[key] ?? fb;
