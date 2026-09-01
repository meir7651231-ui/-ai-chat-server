# 📦 Backlog-קופסה · בנייה-חכמה (26.8.2026) — 45 טיוטות שנדחו-במכוון מקידום-עלה

**הקשר:** סחיפת 173 טיוטות-Dart של בנייה-חכמה מ-dart-quarry לחוזה. **128 קודמו** לאטומי-חוזה
(analyze נקי + golden ירוק). **45 נדחו-ביושר** — הן **אינן עלים טהורים** אלא שייכות לשכבת-
הקופסה/מחולל. הטיוטות נשארות ב-dart-quarry (מקור קדוש, חוק-4) — **אפס אובדן-יכולת**; הן
ייחוותו כשתיבנה שכבת-הקופסה. סירוב-הקידום = משמעת (חוק-1/9: לא מזייפים עלה מקופסה).

## סיבות-החסימה (מקובצות)
### א. דורש data-classes/const-tables של הדומיין (בוני-קטלוג — שכבת-מחולל)
plumbing_accessories · plumbing_categories · plumbing_compat_rules · plumbing_connector_types ·
plumbing_fixtures · plumbing_products · product_systems · real_pipe_of · recommended_kit_for ·
recommended_kit_for_product · resolve_cat_title · profile_for_brand · coupling_for · edge_cost ·
ai_alternatives · plan_wf_advance · to_json · usable_connector · trigger_matches · smart_product_systems

### ב. state/מטמון-מודול משתנה או repository/IO (קופסה state-ful)
lipskey_category_to_id · sku_of · smart_key_to_id · synthetic_pipe · system_coherence ·
prop_keys_for · insert_at · end_pair_memoized · enqueue · enqueue_now · drain_now · pending ·
node_has_system · wider_sibling_of · build_category_resolvers

### ג. sealed-class/היררכיית-טיפוסים (switch ממצה — קופסה)
he_for_op · op_tag · parse_assistant_intent · parse_rule · end_pair · frozen · match_value · validate_op

### ד. Flutter/dart:ui (קופסת-UI)
color_for_token

### ה. טיוטה-קטומה (חילוץ חלקי — המקור נעדר מה-checkout)
walk · (חלק מ-ב/ג לעיל שהיו גם קטומים)

## ⚠️ ממצא-סביבה מהותי
קבצי-המקור של רוב הטיוטות **נעדרים מ-checkout הנוכחי של buildsmart** (‏`app_flutter/lib/logic`
מכיל רק install_engine/install_kit/pressure_drop/price_estimate; ‏studio/manager/assistant/intel/
segments/seeds — כולם נעדרים). לכן הטיוטה שימשה מקור-אמת יחיד (כהוראת המגילה), וקבועים-חסרים
הורמו-לשקעים או הוסקו-ותועדו — **לא זויפו**. חלק מהחסימות נובעות ישירות מהיעדר-המקור (גוף-עוזר חתוך).
**המלצה:** לרענן את checkout ה-buildsmart (הבאת קבצי-המקור החסרים) לפני חציבת-הקופסאות.
