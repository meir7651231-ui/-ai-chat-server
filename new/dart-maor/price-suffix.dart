// חוט · price-suffix — סיומת תקופת-המחיר של מסלול (half_year/year/punch/*). חוזה: price-suffix.contract.md
// מוצא: maor/src/components/courses/lib.ts:195-199 · המקור: new/atoms/price-suffix.mjs. חולץ כלשונו, אפס שקעים.
// המרה מ-JS — התנהגות זהה-לחלוטין למקור (חוק-4). אפס-import (dart:core בלבד).
// הערת-המרה: המקור כולו שרשרת-טרנרים של השוואת-מחרוזת ל-`===`. ב-Dart `==` על String הוא
//   שוויון-ערך (זהה ל-`===` של JS למחרוזות) ⇒ אין מלכודות locale/getMonth/truthiness/מוטביליות.
//   ענף ברירת-המחדל ('לחודש') תופס כל ערך שאינו half_year/year/punch — כולל 'month'.
String priceSuffix(String model) {
  return model == 'half_year'
      ? 'לחצי שנה'
      : model == 'year'
          ? 'לשנה'
          : model == 'punch'
              ? ''
              : 'לחודש';
}
