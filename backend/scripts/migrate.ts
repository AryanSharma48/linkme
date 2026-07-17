import { Pool } from 'pg';
import { config } from '../utils/config';

const pool = new Pool ({
    connectionString: config.DATABASE_URL
});

async function migrate() {
    try {
        console.log("Starting database migration...");
        await pool.query('CREATE TABLE IF NOT EXISTS urls ( id SERIAL PRIMARY KEY, short_code TEXT UNIQUE, long_url TEXT )');
        console.log("Migration completed successfully: urls table exists.");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
