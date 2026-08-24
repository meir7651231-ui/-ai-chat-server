# חוזה · אטום-קבוע manual-driver
**תפקיד:** ערך-מערכת קבוע + פונקציית-חיוג טהורה. **התחייבות:** הערך זהה-ביט לצילום; `callHref` זהה-התנהגות למקור.
**ערכים:** manualDriver = `{ id, label, capabilities, callHref }`.
**callHref(phone: string) → string|null:** מנקה לתווי ספרה/‎+‎; פחות מ-6 ספרות ⇒ null; אחרת `'tel:' + cleaned`. הוטמע ממקור tel.ts (פונקציה-טהורה, חוק-1 inline).
**דוגמאות מספריות:** `callHref('050-123-4567')='tel:0501234567'` · `callHref('+972 50-1234567')='tel:+972501234567'` · `callHref('')=null` · `callHref('12')=null` · `callHref('ללא')=null`.
**מוצא:** maor/src/lib/telephony/driver.ts:34-44 (manualDriver) + maor/src/lib/tel.ts:9-14 (telHref, הוטמע) · תורגם TS→JS מכונה.
