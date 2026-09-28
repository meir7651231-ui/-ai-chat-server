import { build } from './build.mjs';
// מיין רשימה: (1) עוברים על הרשימה ומסמנים כל איבר (מצביע לעצמו). (2) סופרים מ-15 עד 8: כל מסומן — מחובר לראש הרשימה החדשה.
const walk = (mem) => { const out = []; let a = mem[1]; for (let i = 0; a && i < 10; i++) { out.push(a); a = mem[a]; } return out; };
build('מיין רשימה', `WHERE 1; GO; TAKE; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; WHERE @T; JUMP;
 B: WHERE 3; GO; PUT; TAKE; WHERE @; GO; TAKE; WHERE 4; GO; PUT;
 WHERE 3; GO; TAKE; TAKE; WHERE @; GO; PUT;
 WHERE 4; GO; TAKE; TAKE;
 T: WHERE @B; JUMP;
 WHERE 2; GO; PUT;
 WHERE 0; GO; TAKE; TAKE; CALC; WHERE 3; GO; PUT;
 WHERE 0; GO; TAKE; TAKE; CALC; WHERE 5; GO; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT;
 L: WHERE 3; GO; TAKE; WHERE @; GO; TAKE; WHERE @K; JUMP;
 WHERE 0; GO; TAKE; TAKE; CALC; WHERE @X; JUMP;
 K: WHERE 2; GO; TAKE; WHERE 3; GO; TAKE; WHERE @; GO; PUT;
 WHERE 3; GO; TAKE; WHERE 2; GO; PUT;
 X: WHERE 3; GO; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; ADD; WHERE 3; GO; PUT;
 WHERE 3; GO; TAKE; WHERE 5; GO; TAKE; CALC; WHERE 6; GO; PUT; TAKE; TAKE; CALC; WHERE @L; JUMP;
 WHERE 2; GO; TAKE; WHERE 1; GO; PUT`, (l) => (mem) => JSON.stringify(walk(mem)) === JSON.stringify([...l].sort((a, b) => a - b)));
