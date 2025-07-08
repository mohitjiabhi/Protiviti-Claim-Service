// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,        // <-- change if needed
  database: process.env.DB   // <-- change to your DB name
})
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,        // <-- change if needed
  database: process.env.DB   // <-- change to your DB name
});


export default db;
