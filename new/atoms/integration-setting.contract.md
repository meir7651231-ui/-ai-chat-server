# חוזה · חוט integration-setting
**תפקיד:** שליפת הגדרת-הרחבה מהקונפיג (גל ג׳ של INTEGRATIONS): ערך-מחרוזת של
שדה בהרחבה, אחרי ‏trim; כל דבר אחר (חסר / לא-מחרוזת) ⇒ ‏'' — לעולם לא זורק,
לעולם לא מחזיר לא-מחרוזת.
**קלט:** ‏cfg — אובייקט-קונפיג · ‏key — שם-ההרחבה · ‏field — שם-השדה.
**פלט:** מחרוזת (אולי ריקה).
**דוגמאות מחייבות:**
1. ‏cfg={integrations:{payments:{payUrl:'  https://pay.example  '}}},
   key='payments', field='payUrl' ⇒ ‏'https://pay.example' — ‏trim.
2. ‏cfg={} (אין integrations), key='payments', field='payUrl' ⇒ ‏''.
3. ‏cfg={integrations:{payments:{}}}, key='payments', field='payUrl' ⇒ ‏''.
4. ‏cfg={integrations:{payments:{payUrl:42}}}, key='payments', field='payUrl'
   ⇒ ‏'' — לא-מחרוזת מסוננת.
5. ‏cfg={integrations:{whatsapp:{enabled:true}}}, key='whatsapp',
   field='enabled' ⇒ ‏'' — בוליאני אינו מחרוזת.
6. ‏cfg={integrations:{campaign:{url:'   '}}}, key='campaign', field='url'
   ⇒ ‏'' — רווחים בלבד מצטמצמים לריק.
**מוצא:** maor/src/lib/config.ts:95-103 (‏integrationSetting — "מחרוזת
מה-allowlist אחרי trim, אחרת ''"). ה-allowlist עצמו (INTEGRATION_SETTING_KEYS)
נאכף בחיטוי-הקונפיג במקור — לא חלק מהחוט הזה. עצמאי — אפס שקעים.
