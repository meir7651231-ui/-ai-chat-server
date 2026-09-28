import { build } from './build.mjs';
// הפוך רשימה (במקום): כל איבר מצביע אחורה, ותא 1 מצביע לאחרון
const walk = (mem) => { const out = []; let a = mem[1]; for (let i = 0; a && i < 10; i++) { out.push(a); a = mem[a]; } return out; };
build('הפוך רשימה', `WHERE 0; GO; TAKE; WHERE 2; GO; PUT;
 WHERE 1; GO; TAKE; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; WHERE @T; JUMP;
 B: WHERE 3; GO; PUT; TAKE; WHERE @; GO; TAKE; WHERE 4; GO; PUT;
 WHERE 2; GO; TAKE; WHERE 3; GO; TAKE; WHERE @; GO; PUT;
 WHERE 3; GO; TAKE; WHERE 2; GO; PUT;
 WHERE 4; GO; TAKE; TAKE;
 T: WHERE @B; JUMP;
 WHERE 2; GO; TAKE; WHERE 1; GO; PUT`, (l) => (mem) => JSON.stringify(walk(mem)) === JSON.stringify([...l].reverse()));
