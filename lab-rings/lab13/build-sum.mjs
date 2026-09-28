import { build } from './build.mjs';
// סכום רשימה: כמו «אורך», אבל מוסיפים את האיבר עצמו במקום 1
build('סכום רשימה', `WHERE 0; GO; TAKE; WHERE 2; GO; PUT;
 WHERE 1; GO; TAKE; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; WHERE @T; JUMP;
 B: WHERE 3; GO; PUT; TAKE; TAKE; WHERE 2; GO; TAKE; ADD; PUT; WHERE @; GO; TAKE; TAKE;
 T: WHERE @B; JUMP`, (l) => l.reduce((a, b) => a + b, 0) & 15);
