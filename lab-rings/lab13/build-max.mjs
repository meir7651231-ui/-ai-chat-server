import { build } from './build.mjs';
// הגדול ברשימה: מתחילים מהראשון. לכל איבר p: אם p > הגדול (בדיקה: p + לא(הגדול) בלי ביט-8) ⇒ הגדול = p
build('הגדול ברשימה', `WHERE 1; GO; TAKE; WHERE 2; GO; PUT;
 WHERE 0; GO; TAKE; TAKE; CALC; WHERE 3; GO; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT;
 WHERE 1; GO; TAKE; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; WHERE @T; JUMP;
 B: WHERE 4; GO; PUT;
 WHERE 2; GO; TAKE; TAKE; CALC; WHERE 4; GO; TAKE; ADD;
 WHERE 3; GO; TAKE; CALC; WHERE 5; GO; PUT; TAKE; TAKE; CALC; WHERE @N; JUMP;
 WHERE 4; GO; TAKE; WHERE 2; GO; PUT;
 N: WHERE 4; GO; TAKE; WHERE @; GO; TAKE; TAKE;
 T: WHERE @B; JUMP`, (l) => (l.length ? Math.max(...l) : 0));
