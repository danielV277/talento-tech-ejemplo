import 'dotenv/config'
import pg from 'pg'
const { Pool } = pg

console.log("Conectando con:");
console.log("  host:", process.env.HOST);
console.log("  user:", process.env.USER);
console.log("  database:", process.env.DATABASE);
console.log("  password:", process.env.PASSWORD);
console.log("  port:", process.env.PORT);


const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: Number(process.env.PORT),
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;