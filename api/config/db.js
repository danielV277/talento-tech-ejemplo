import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    host: 'database-1.cerca4qiiura.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    database: 'Personas',
    password: 'postgres9876',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;